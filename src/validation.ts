import { ValidationError, ValidationErrorDetail } from "./errors.js";
import {
    GenerateOptions,
    Tone,
    Verbosity,
    ContentGeneration,
    ImageType,
    ExportFormat,
} from "./types.js";

/**
 * Validates generation options and returns cleaned payload
 */
export function validateGenerateOptions(options: GenerateOptions): void {
    const errors: ValidationErrorDetail[] = [];

    // Content validation
    if (options.content !== undefined) {
        if (typeof options.content !== "string") {
            errors.push({
                field: "content",
                message: "Content must be a string",
                received: typeof options.content,
                expected: "string",
            });
        } else if (options.content.length === 0) {
            errors.push({
                field: "content",
                message: "Content cannot be an empty string",
                received: '""',
                expected: "non-empty string",
            });
        } else if (options.content.length > 100000) {
            errors.push({
                field: "content",
                message: "Content exceeds maximum length of 100,000 characters",
                received: options.content.length,
                expected: "<= 100000",
            });
        }
    }

    // Slides markdown validation
    if (options.slidesMarkdown !== undefined) {
        if (!Array.isArray(options.slidesMarkdown)) {
            errors.push({
                field: "slidesMarkdown",
                message: "slidesMarkdown must be an array of strings",
                received: typeof options.slidesMarkdown,
                expected: "string[]",
            });
        } else {
            if (options.slidesMarkdown.length === 0) {
                errors.push({
                    field: "slidesMarkdown",
                    message: "slidesMarkdown cannot be an empty array",
                    received: "[]",
                    expected: "non-empty array",
                });
            }
            options.slidesMarkdown.forEach((slide: unknown, index: number) => {
                if (typeof slide !== "string") {
                    errors.push({
                        field: `slidesMarkdown[${index}]`,
                        message: `Slide at index ${index} must be a string`,
                        received: typeof slide,
                        expected: "string",
                    });
                }
            });
        }
    }

    // Slides layout validation
    if (options.slidesLayout !== undefined) {
        if (!Array.isArray(options.slidesLayout)) {
            errors.push({
                field: "slidesLayout",
                message: "slidesLayout must be an array",
                received: typeof options.slidesLayout,
                expected: "(string | null)[]",
            });
        } else if (
            options.slidesMarkdown &&
            options.slidesLayout.length !== options.slidesMarkdown.length
        ) {
            errors.push({
                field: "slidesLayout",
                message:
                    "slidesLayout length must match slidesMarkdown length",
                received: options.slidesLayout.length,
                expected: String(options.slidesMarkdown.length),
            });
        }
    }

    // Number of slides validation
    if (options.numSlides !== undefined) {
        if (typeof options.numSlides !== "number" || !Number.isInteger(options.numSlides)) {
            errors.push({
                field: "numSlides",
                message: "numSlides must be an integer",
                received: options.numSlides,
                expected: "integer",
            });
        } else if (options.numSlides < 1 || options.numSlides > 50) {
            errors.push({
                field: "numSlides",
                message: "numSlides must be between 1 and 50",
                received: options.numSlides,
                expected: "1-50",
            });
        }
    }

    // Instructions validation
    if (options.instructions !== undefined) {
        if (typeof options.instructions !== "string") {
            errors.push({
                field: "instructions",
                message: "instructions must be a string",
                received: typeof options.instructions,
                expected: "string",
            });
        } else if (options.instructions.length > 10000) {
            errors.push({
                field: "instructions",
                message: "instructions exceeds maximum length of 10,000 characters",
                received: options.instructions.length,
                expected: "<= 10000",
            });
        }
    }

    // Tone validation
    if (options.tone !== undefined) {
        const validTones = Object.values(Tone);
        if (!validTones.includes(options.tone as Tone)) {
            errors.push({
                field: "tone",
                message: `Invalid tone value`,
                received: options.tone,
                expected: validTones.join(" | "),
            });
        }
    }

    // Verbosity validation
    if (options.verbosity !== undefined) {
        const validVerbosities = Object.values(Verbosity);
        if (!validVerbosities.includes(options.verbosity as Verbosity)) {
            errors.push({
                field: "verbosity",
                message: `Invalid verbosity value`,
                received: options.verbosity,
                expected: validVerbosities.join(" | "),
            });
        }
    }

    // Content generation validation
    if (options.contentGeneration !== undefined) {
        const validModes = Object.values(ContentGeneration);
        if (!validModes.includes(options.contentGeneration as ContentGeneration)) {
            errors.push({
                field: "contentGeneration",
                message: `Invalid contentGeneration value`,
                received: options.contentGeneration,
                expected: validModes.join(" | "),
            });
        }
    }

    // Boolean validations
    const booleanFields = [
        "markdownEmphasis",
        "webSearch",
        "includeTableOfContents",
        "includeTitleSlide",
        "allowAccessToUserInfo",
        "triggerWebhook",
    ] as const;

    for (const field of booleanFields) {
        if (options[field] !== undefined && typeof options[field] !== "boolean") {
            errors.push({
                field,
                message: `${field} must be a boolean`,
                received: typeof options[field],
                expected: "boolean",
            });
        }
    }

    // Image type validation
    if (options.imageType !== undefined) {
        const validTypes = Object.values(ImageType);
        if (!validTypes.includes(options.imageType as ImageType)) {
            errors.push({
                field: "imageType",
                message: `Invalid imageType value`,
                received: options.imageType,
                expected: validTypes.join(" | "),
            });
        }
    }

    // Export format validation
    if (options.exportAs !== undefined) {
        const validFormats = Object.values(ExportFormat);
        if (!validFormats.includes(options.exportAs as ExportFormat)) {
            errors.push({
                field: "exportAs",
                message: `Invalid exportAs value`,
                received: options.exportAs,
                expected: validFormats.join(" | "),
            });
        }
    }

    // Files validation
    if (options.files !== undefined) {
        if (!Array.isArray(options.files)) {
            errors.push({
                field: "files",
                message: "files must be an array of file IDs",
                received: typeof options.files,
                expected: "string[]",
            });
        } else {
            options.files.forEach((fileId: unknown, index: number) => {
                if (typeof fileId !== "string") {
                    errors.push({
                        field: `files[${index}]`,
                        message: `File ID at index ${index} must be a string`,
                        received: typeof fileId,
                        expected: "string",
                    });
                } else if (fileId.trim().length === 0) {
                    errors.push({
                        field: `files[${index}]`,
                        message: `File ID at index ${index} cannot be empty`,
                        received: '""',
                        expected: "non-empty string",
                    });
                }
            });
        }
    }

    // Check if at least one content source is provided
    const hasContent = options.content && options.content.length > 0;
    const hasSlidesMarkdown = options.slidesMarkdown && options.slidesMarkdown.length > 0;
    const hasFiles = options.files && options.files.length > 0;

    if (!hasContent && !hasSlidesMarkdown && !hasFiles) {
        errors.push({
            field: "content",
            message:
                "At least one of 'content', 'slidesMarkdown', or 'files' must be provided",
            expected: "content | slidesMarkdown | files",
        });
    }

    if (errors.length > 0) {
        const message =
            errors.length === 1
                ? `Validation failed: ${errors[0].message}`
                : `Validation failed with ${errors.length} errors:\n${errors
                    .map((e) => `  - ${e.field}: ${e.message}`)
                    .join("\n")}`;
        throw new ValidationError(message, errors);
    }
}

/**
 * Validates task ID format
 */
export function validateTaskId(taskId: string): void {
    if (!taskId || typeof taskId !== "string") {
        throw new ValidationError("Task ID is required and must be a string", [
            {
                field: "taskId",
                message: "Task ID is required and must be a string",
                received: taskId,
                expected: "string (e.g., 'task-xxxxxxxxxx')",
            },
        ]);
    }

    if (!taskId.startsWith("task-")) {
        throw new ValidationError(
            `Invalid task ID format. Expected format: "task-xxxxxxxxxx", received: "${taskId}"`,
            [
                {
                    field: "taskId",
                    message: 'Task ID must start with "task-"',
                    received: taskId,
                    expected: "task-xxxxxxxxxx",
                },
            ]
        );
    }
}

/**
 * Validates API key format
 */
export function validateApiKey(apiKey: string): void {
    if (!apiKey) {
        throw new ValidationError("API key is required", [
            {
                field: "apiKey",
                message: "API key is required",
                expected: "sk-presenton-xxxxxxxx",
            },
        ]);
    }

    if (typeof apiKey !== "string") {
        throw new ValidationError("API key must be a string", [
            {
                field: "apiKey",
                message: "API key must be a string",
                received: typeof apiKey,
                expected: "string",
            },
        ]);
    }

    if (!apiKey.startsWith("sk-presenton-")) {
        throw new ValidationError(
            'Invalid API key format. API keys should start with "sk-presenton-"',
            [
                {
                    field: "apiKey",
                    message: 'API key should start with "sk-presenton-"',
                    received: apiKey.slice(0, 15) + "...",
                    expected: "sk-presenton-xxxxxxxx",
                },
            ]
        );
    }
}

/**
 * Validates files for upload
 */
export function validateUploadFiles(files: unknown[]): void {
    if (!Array.isArray(files)) {
        throw new ValidationError("Files must be an array", [
            {
                field: "files",
                message: "Files must be an array",
                received: typeof files,
                expected: "File[] | Blob[] | string[]",
            },
        ]);
    }

    if (files.length === 0) {
        throw new ValidationError("At least one file is required", [
            {
                field: "files",
                message: "At least one file is required",
                received: "[]",
                expected: "non-empty array",
            },
        ]);
    }

    if (files.length > 10) {
        throw new ValidationError("Maximum 10 files can be uploaded at once", [
            {
                field: "files",
                message: "Maximum 10 files can be uploaded at once",
                received: files.length,
                expected: "<= 10",
            },
        ]);
    }

    // Validate each file
    const maxFileSize = 50 * 1024 * 1024; // 50MB
    files.forEach((file, index) => {
        if (file === null || file === undefined) {
            throw new ValidationError(`File at index ${index} is null or undefined`, [
                {
                    field: `files[${index}]`,
                    message: "File cannot be null or undefined",
                    received: file,
                    expected: "File | Blob | string (file path)",
                },
            ]);
        }

        // Check file size if it's a Blob/File
        if (file instanceof Blob && file.size > maxFileSize) {
            throw new ValidationError(
                `File at index ${index} exceeds maximum size of 50MB`,
                [
                    {
                        field: `files[${index}]`,
                        message: "File exceeds maximum size of 50MB",
                        received: `${(file.size / 1024 / 1024).toFixed(2)}MB`,
                        expected: "<= 50MB",
                    },
                ]
            );
        }
    });
}

/**
 * Validates poll options
 */
export function validatePollOptions(options: {
    interval?: number;
}): void {
    if (options.interval !== undefined) {
        if (typeof options.interval !== "number" || options.interval < 500) {
            throw new ValidationError(
                "Polling interval must be at least 500ms",
                [{
                    field: "interval",
                    message: "Polling interval must be at least 500ms",
                    received: options.interval,
                    expected: ">= 500",
                }]
            );
        }
    }
}

