import { readFile } from "node:fs/promises";
import { basename } from "node:path";
import { existsSync } from "node:fs";

import {
    PresentonError,
    AuthenticationError,
    APIError,
    NetworkError,
    RateLimitError,
    GenerationError,
    UploadError,
} from "./errors.js";
import {
    ClientConfig,
    GenerateOptions,
    GenerateSyncResponse,
    GenerateAsyncResponse,
    TaskStatusResponse,
    PollOptions,
    UploadResponse,
    ApiGeneratePayload,
    ApiSyncResponse,
    ApiAsyncResponse,
    TaskStatus,
    Tone,
    Verbosity,
    ImageType,
    ExportFormat,
    Template,
} from "./types.js";
import {
    validateApiKey,
    validateGenerateOptions,
    validateTaskId,
    validateUploadFiles,
    validatePollOptions,
} from "./validation.js";

// ============================================================================
// Constants
// ============================================================================

const DEFAULT_BASE_URL = "https://api.presenton.ai";
const DEFAULT_MAX_RETRIES = 3;
const DEFAULT_RETRY_DELAY = 1000;
const DEFAULT_POLL_INTERVAL = 2000;



// ============================================================================
// Utility Functions
// ============================================================================

/**
 * Delay execution for specified milliseconds
 */
function delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Calculate exponential backoff delay with jitter
 */
function getBackoffDelay(attempt: number, baseDelay: number): number {
    const exponentialDelay = baseDelay * Math.pow(2, attempt);
    const jitter = Math.random() * 0.3 * exponentialDelay;
    return Math.min(exponentialDelay + jitter, 30000);
}

/**
 * Convert camelCase options to snake_case API payload
 */
function toApiPayload(options: GenerateOptions): ApiGeneratePayload {
    return {
        content: options.content ?? null,
        slides_markdown: options.slidesMarkdown ?? null,
        slides_layout: options.slidesLayout ?? null,
        n_slides: options.numSlides ?? null,
        instructions: options.instructions ?? null,
        tone: options.tone ?? Tone.Default,
        verbosity: options.verbosity ?? Verbosity.Standard,
        content_generation: options.contentGeneration ?? null,
        markdown_emphasis: options.markdownEmphasis ?? true,
        web_search: options.webSearch ?? false,
        image_type: options.imageType ?? ImageType.Stock,
        theme: options.theme ?? null,
        language: options.language ?? null,
        template: options.template ?? Template.General,
        include_table_of_contents: options.includeTableOfContents ?? false,
        include_title_slide: options.includeTitleSlide ?? true,
        allow_access_to_user_info: options.allowAccessToUserInfo ?? true,
        files: options.files ?? null,
        export_as: options.exportAs ?? ExportFormat.PPTX,
        trigger_webhook: options.triggerWebhook ?? false,
    };
}

/**
 * Convert snake_case API response to camelCase
 */
function fromApiSyncResponse(response: ApiSyncResponse): GenerateSyncResponse {
    return {
        presentationId: response.presentation_id,
        path: response.path,
        editPath: response.edit_path,
        creditsConsumed: response.credits_consumed,
    };
}

/**
 * Convert snake_case async response to camelCase
 */
function fromApiAsyncResponse(response: ApiAsyncResponse): GenerateAsyncResponse {
    return {
        message: response.message,
        createdAt: new Date(response.created_at),
        updatedAt: new Date(response.updated_at),
        taskId: response.id,
        status: response.status as TaskStatus,
        data: response.data ? fromApiSyncResponse(response.data) : undefined,
        error: response.error,
    };
}

// ============================================================================
// Presenton Client
// ============================================================================

/**
 * Presenton API Client
 *
 * The official Node.js SDK for the Presenton presentation generation API.
 *
 * @example
 * ```typescript
 * import { Presenton } from 'presenton';
 *
 * const client = new Presenton({ apiKey: 'sk-presenton-xxx' });
 *
 * const result = await client.presentations.generate({
 *   content: 'Introduction to Machine Learning',
 *   numSlides: 10,
 *   tone: Tone.Professional
 * });
 *
 * console.log(result.path);
 * ```
 */
export class Presenton {
    private readonly apiKey: string;
    private readonly baseUrl: string;
    private readonly maxRetries: number;
    private readonly retryDelay: number;

    /** Presentation generation methods */
    readonly presentations: PresentationsAPI;

    /** File upload methods */
    readonly files: FilesAPI;

    constructor(config: ClientConfig) {
        validateApiKey(config.apiKey);

        this.apiKey = config.apiKey;
        this.baseUrl = (config.baseUrl ?? DEFAULT_BASE_URL).replace(/\/$/, "");
        this.maxRetries = config.maxRetries ?? DEFAULT_MAX_RETRIES;
        this.retryDelay = config.retryDelay ?? DEFAULT_RETRY_DELAY;

        this.presentations = new PresentationsAPI(this);
        this.files = new FilesAPI(this);
    }

    /**
     * Make an authenticated request to the Presenton API
     * @internal
     */
    async request<T>(
        path: string,
        method: "GET" | "POST" | "DELETE",
        body?: unknown,
        options: { retries?: number; isFormData?: boolean } = {}
    ): Promise<T> {
        const { retries = this.maxRetries, isFormData = false } = options;
        let lastError: Error | undefined;

        for (let attempt = 0; attempt <= retries; attempt++) {
            try {
                return await this._doRequest<T>(path, method, body, isFormData);
            } catch (err: unknown) {
                lastError = err as Error;

                // Don't retry on these errors
                if (
                    err instanceof AuthenticationError ||
                    (err instanceof APIError && !err.isRetryable) ||
                    (err instanceof PresentonError && !err.isRetryable)
                ) {
                    throw err;
                }

                // Handle rate limiting with Retry-After
                if (err instanceof RateLimitError && err.retryAfter) {
                    if (attempt < retries) {
                        await delay(err.retryAfter * 1000);
                        continue;
                    }
                }

                // Retry with exponential backoff
                if (attempt < retries) {
                    const backoff = getBackoffDelay(attempt, this.retryDelay);
                    await delay(backoff);
                }
            }
        }

        throw lastError;
    }

    /**
     * Execute a single request attempt
     * @internal
     */
    private async _doRequest<T>(
        path: string,
        method: string,
        body?: unknown,
        isFormData = false
    ): Promise<T> {
        const headers: Record<string, string> = {
            Authorization: `Bearer ${this.apiKey}`,

            Accept: "application/json",
        };

        if (!isFormData) {
            headers["Content-Type"] = "application/json";
        }

        let requestBody: string | FormData | undefined;
        if (body) {
            requestBody = isFormData ? (body as FormData) : JSON.stringify(body);
        }

        let response: Response;

        try {
            response = await fetch(`${this.baseUrl}${path}`, {
                method,
                headers,
                body: requestBody,
            });
        } catch (error) {
            if (error instanceof Error) {
                throw new NetworkError(`Network request failed: ${error.message}`, error);
            }
            throw new NetworkError("Unknown network error occurred");
        }

        const requestId = response.headers.get("x-request-id") ?? undefined;

        if (!response.ok) {
            let responseBody: unknown;
            try {
                responseBody = await response.json();
            } catch {
                responseBody = await response.text().catch(() => "");
            }

            if (response.status === 401 || response.status === 403) {
                throw new AuthenticationError(
                    "Invalid API key or insufficient permissions"
                );
            }

            if (response.status === 429) {
                const retryAfter = response.headers.get("retry-after");
                throw new RateLimitError(
                    "Rate limit exceeded. Please slow down your requests.",
                    retryAfter ? parseInt(retryAfter, 10) : undefined,
                    requestId
                );
            }

            throw APIError.fromResponse(response.status, responseBody, requestId);
        }

        try {
            return (await response.json()) as T;
        } catch {
            throw new APIError(
                "Failed to parse API response as JSON",
                response.status,
                undefined,
                requestId
            );
        }
    }
}

// ============================================================================
// Presentations API
// ============================================================================

/**
 * API for generating and managing presentations
 */
export class PresentationsAPI {
    constructor(private readonly client: Presenton) { }

    /**
     * Generate a presentation synchronously.
     * Waits until the presentation is fully generated.
     */
    async generate(options: GenerateOptions): Promise<GenerateSyncResponse> {
        validateGenerateOptions(options);
        const payload = toApiPayload(options);

        const response = await this.client.request<ApiSyncResponse>(
            "/api/v1/ppt/presentation/generate",
            "POST",
            payload
        );

        return fromApiSyncResponse(response);
    }

    /**
     * Generate a presentation asynchronously.
     * Returns immediately with a task ID for polling.
     */
    async generateAsync(options: GenerateOptions): Promise<GenerateAsyncResponse> {
        validateGenerateOptions(options);
        const payload = toApiPayload(options);

        const response = await this.client.request<ApiAsyncResponse>(
            "/api/v1/ppt/presentation/generate/async",
            "POST",
            payload
        );

        return fromApiAsyncResponse(response);
    }

    /**
     * Check the status of an async generation task.
     */
    async getStatus(taskId: string): Promise<TaskStatusResponse> {
        validateTaskId(taskId);

        const response = await this.client.request<ApiAsyncResponse>(
            `/api/v1/ppt/presentation/status/${taskId}`,
            "GET"
        );

        return fromApiAsyncResponse(response);
    }

    /**
     * Wait for an async generation task to complete.
     * Polls until the task completes or fails.
     */
    async waitForCompletion(
        taskId: string,
        options: PollOptions = {}
    ): Promise<GenerateSyncResponse> {
        validateTaskId(taskId);
        validatePollOptions(options);

        const interval = options.interval ?? DEFAULT_POLL_INTERVAL;

        while (true) {
            const status = await this.getStatus(taskId);

            if (options.onStatusChange) {
                options.onStatusChange(status);
            }

            if (status.status === TaskStatus.Completed) {
                if (!status.data) {
                    throw new GenerationError(
                        "Task completed but no data was returned",
                        taskId
                    );
                }
                return status.data;
            }

            if (status.status === TaskStatus.Error) {
                throw new GenerationError(
                    (status.error?.message as string) || "Presentation generation failed",
                    taskId,
                    status.error
                );
            }

            await delay(interval);
        }
    }
}

// ============================================================================
// Files API
// ============================================================================

type UploadableFile = File | Blob | string;

/**
 * API for uploading files
 */
export class FilesAPI {
    constructor(private readonly client: Presenton) { }

    /**
     * Upload files to be used in presentation generation.
     * Accepts File objects (browser), Blob objects, or file paths (Node.js).
     */
    async upload(files: UploadableFile[]): Promise<UploadResponse> {
        validateUploadFiles(files);

        const formData = new FormData();

        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            let blob: Blob;
            let filename: string;

            if (typeof file === "string") {
                if (!existsSync(file)) {
                    throw new UploadError(`File not found: ${file}`, file);
                }

                try {
                    const buffer = await readFile(file);
                    blob = new Blob([buffer]);
                    filename = basename(file);
                } catch {
                    throw new UploadError(`Failed to read file: ${file}`, file);
                }
            } else if (file instanceof Blob) {
                blob = file;
                filename = (file as File).name || `file-${i}`;
            } else {
                throw new UploadError(
                    `Invalid file type at index ${i}. Expected File, Blob, or string path.`,
                    undefined
                );
            }

            formData.append("files", blob, filename);
        }

        const response = await this.client.request<string[]>(
            "/api/v1/ppt/files/upload",
            "POST",
            formData,
            { isFormData: true }
        );

        return { fileIds: response };
    }
}
