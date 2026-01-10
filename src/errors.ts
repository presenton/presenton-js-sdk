/**
 * Base error class for all Presenton SDK errors
 */
export class PresentonError extends Error {
    readonly code: string;
    readonly isRetryable: boolean;

    constructor(message: string, code: string, isRetryable = false) {
        super(message);
        this.name = "PresentonError";
        this.code = code;
        this.isRetryable = isRetryable;
        Object.setPrototypeOf(this, PresentonError.prototype);
    }
}

/**
 * Thrown when API key is missing or invalid
 */
export class AuthenticationError extends PresentonError {
    constructor(message = "Invalid or missing API key") {
        super(message, "AUTHENTICATION_ERROR", false);
        this.name = "AuthenticationError";
        Object.setPrototypeOf(this, AuthenticationError.prototype);
    }
}

/**
 * Thrown when input validation fails
 */
export class ValidationError extends PresentonError {
    readonly field?: string;
    readonly details: ValidationErrorDetail[];

    constructor(message: string, details: ValidationErrorDetail[] = [], field?: string) {
        super(message, "VALIDATION_ERROR", false);
        this.name = "ValidationError";
        this.field = field;
        this.details = details;
        Object.setPrototypeOf(this, ValidationError.prototype);
    }
}

export interface ValidationErrorDetail {
    field: string;
    message: string;
    received?: unknown;
    expected?: string;
}

/**
 * Thrown when the API returns an error response
 */
export class APIError extends PresentonError {
    readonly statusCode: number;
    readonly response?: unknown;
    readonly requestId?: string;

    constructor(
        message: string,
        statusCode: number,
        response?: unknown,
        requestId?: string
    ) {
        const isRetryable = statusCode >= 500 || statusCode === 429;
        super(message, "API_ERROR", isRetryable);
        this.name = "APIError";
        this.statusCode = statusCode;
        this.response = response;
        this.requestId = requestId;
        Object.setPrototypeOf(this, APIError.prototype);
    }

    static fromResponse(statusCode: number, body: unknown, requestId?: string): APIError {
        let message = `API request failed with status ${statusCode}`;

        if (typeof body === "object" && body !== null) {
            const errorBody = body as Record<string, unknown>;
            if (typeof errorBody.detail === "string") {
                message = errorBody.detail;
            } else if (typeof errorBody.message === "string") {
                message = errorBody.message;
            } else if (Array.isArray(errorBody.detail)) {
                // Handle FastAPI validation errors
                const details = errorBody.detail as Array<{ msg: string; loc: string[] }>;
                message = details.map((d) => `${d.loc.join(".")}: ${d.msg}`).join("; ");
            }
        } else if (typeof body === "string" && body.length > 0) {
            message = body;
        }

        return new APIError(message, statusCode, body, requestId);
    }
}

/**
 * Thrown when a network error occurs
 */
export class NetworkError extends PresentonError {
    readonly cause?: Error;

    constructor(message: string, cause?: Error) {
        super(message, "NETWORK_ERROR", true);
        this.name = "NetworkError";
        this.cause = cause;
        Object.setPrototypeOf(this, NetworkError.prototype);
    }
}

/**
 * Thrown when rate limit is exceeded
 */
export class RateLimitError extends APIError {
    readonly retryAfter?: number;

    constructor(message: string, retryAfter?: number, requestId?: string) {
        super(message, 429, undefined, requestId);
        this.name = "RateLimitError";
        this.retryAfter = retryAfter;
        Object.setPrototypeOf(this, RateLimitError.prototype);
    }
}

/**
 * Thrown when presentation generation fails
 */
export class GenerationError extends PresentonError {
    readonly taskId?: string;
    readonly details?: unknown;

    constructor(message: string, taskId?: string, details?: unknown) {
        super(message, "GENERATION_ERROR", false);
        this.name = "GenerationError";
        this.taskId = taskId;
        this.details = details;
        Object.setPrototypeOf(this, GenerationError.prototype);
    }
}

/**
 * Thrown when file upload fails
 */
export class UploadError extends PresentonError {
    readonly fileName?: string;

    constructor(message: string, fileName?: string) {
        super(message, "UPLOAD_ERROR", true);
        this.name = "UploadError";
        this.fileName = fileName;
        Object.setPrototypeOf(this, UploadError.prototype);
    }
}

