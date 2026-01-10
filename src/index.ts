/**
 * Presenton SDK for Node.js
 *
 * The official JavaScript/TypeScript SDK for the Presenton presentation generation API.
 *
 * @packageDocumentation
 * @module presenton
 *
 * @example
 * ```typescript
 * import { Presenton, Tone, Theme } from 'presenton';
 *
 * const client = new Presenton({
 *   apiKey: process.env.PRESENTON_API_KEY!
 * });
 *
 * const result = await client.presentations.generate({
 *   content: 'Introduction to Machine Learning',
 *   numSlides: 10,
 *   tone: Tone.Professional,
 *   theme: Theme.ProfessionalBlue
 * });
 *
 * console.log(`Presentation ready: ${result.path}`);
 * ```
 */

// ============================================================================
// Main Client
// ============================================================================

export { Presenton, PresentationsAPI, FilesAPI } from "./client.js";

// ============================================================================
// Types - Enums
// ============================================================================

export {
    Tone,
    Verbosity,
    ContentGeneration,
    ImageType,
    Theme,
    Template,
    Language,
    ExportFormat,
    TaskStatus,
} from "./types.js";

// ============================================================================
// Types - Interfaces
// ============================================================================

export type {
    GenerateOptions,
    GenerateSyncResponse,
    GenerateAsyncResponse,
    TaskStatusResponse,
    UploadResponse,
    ClientConfig,
    PollOptions,
} from "./types.js";

// ============================================================================
// Errors
// ============================================================================

export {
    PresentonError,
    AuthenticationError,
    ValidationError,
    APIError,
    NetworkError,
    RateLimitError,
    GenerationError,
    UploadError,
    type ValidationErrorDetail,
} from "./errors.js";

// ============================================================================
// Validation
// ============================================================================

export {
    validateGenerateOptions,
    validateTaskId,
    validateApiKey,
    validateUploadFiles,
    validatePollOptions,
} from "./validation.js";

// ============================================================================
// Factory Function
// ============================================================================

import { Presenton } from "./client.js";
import type { ClientConfig } from "./types.js";

/**
 * Create a new Presenton client instance
 */
export function createClient(config: ClientConfig): Presenton {
    return new Presenton(config);
}

// ============================================================================
// Default Export
// ============================================================================

export default Presenton;
