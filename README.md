# Presenton SDK for Node.js

The official JavaScript/TypeScript SDK for the [Presenton](https://presenton.ai) presentation generation API.

[![npm version](https://badge.fury.io/js/presenton.svg)](https://www.npmjs.com/package/presenton)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue.svg)](https://www.typescriptlang.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## Features

- 🚀 **Simple API** - Generate presentations with just a few lines of code
- 📝 **TypeScript First** - Full type safety and autocompletion
- 🔄 **Async Support** - Both synchronous and async generation with polling
- 🛡️ **Input Validation** - Cosdkmprehensive validation with helpful error messages
- 🔁 **Automatic Retries** - Built-in retry logic with exponential backoff
- 📁 **File Uploads** - Upload PDFs, documents, and more as source material

---

## Installation

```bash
npm install presenton
```

---

## Quick Start

```typescript
import { Presenton, Tone, Theme } from 'presenton';

const client = new Presenton({
  apiKey: process.env.PRESENTON_API_KEY!
});

const result = await client.presentations.generate({
  content: 'Introduction to Machine Learning',
  numSlides: 10,
  tone: Tone.Professional,
  theme: Theme.ProfessionalBlue
});

console.log(`Presentation ready: ${result.path}`);
```

---

## SDK Architecture

### File Structure

```
src/
├── index.ts        # Public API exports
├── client.ts       # Main client and API classes  
├── types.ts        # TypeScript interfaces and enums
├── errors.ts       # Custom error classes
└── validation.ts   # Input validation logic
```

### File Purposes

#### `index.ts` - Entry Point
The main entry point that exports all public APIs. When you `import { ... } from 'presenton'`, this file determines what's available.

**Exports:**
- `Presenton` - Main client class
- `PresentationsAPI`, `FilesAPI` - Sub-API classes
- All enums: `Tone`, `Verbosity`, `Theme`, `Template`, etc.
- All types: `GenerateOptions`, `GenerateSyncResponse`, etc.
- All errors: `ValidationError`, `APIError`, etc.

#### `client.ts` - API Client
Contains the core client logic for communicating with the Presenton API.

**Classes:**
- `Presenton` - Main client that handles authentication and requests
- `PresentationsAPI` - Methods for generating presentations
- `FilesAPI` - Methods for uploading files

**Key Features:**
- Automatic retry with exponential backoff
- Rate limit handling with Retry-After support
- camelCase ↔ snake_case conversion

#### `types.ts` - Type Definitions
All TypeScript interfaces and enums that define the shape of data.

**Enums:**
- `Tone` - Presentation tone (Professional, Casual, etc.)
- `Verbosity` - Text amount (Concise, Standard, TextHeavy)
- `ContentGeneration` - Content handling (Preserve, Enhance, Condense)
- `ImageType` - Image source (Stock, AIGenerated)
- `Theme` - Visual themes
- `Template` - Layout templates
- `Language` - 70+ supported languages
- `ExportFormat` - Output format (PPTX, PDF)
- `TaskStatus` - Async task status

**Interfaces:**
- `ClientConfig` - Client configuration options
- `GenerateOptions` - Presentation generation options
- `GenerateSyncResponse` - Sync generation result
- `GenerateAsyncResponse` - Async task details
- `TaskStatusResponse` - Task status details
- `UploadResponse` - File upload result
- `PollOptions` - Async polling configuration

#### `errors.ts` - Error Classes
Custom error classes for precise error handling.

**Error Hierarchy:**
```
PresentonError (base)
├── AuthenticationError  - Invalid API key
├── ValidationError      - Input validation failed
├── APIError             - API returned an error
│   └── RateLimitError   - Rate limit exceeded
├── NetworkError         - Network failure
├── GenerationError      - Generation failed
└── UploadError          - File upload failed
```

Each error has:
- `code` - Machine-readable error code
- `isRetryable` - Whether the operation can be retried

#### `validation.ts` - Input Validation
Validates all inputs before making API requests.

**Validation Functions:**
- `validateGenerateOptions()` - Validates generation parameters
- `validateApiKey()` - Validates API key format
- `validateTaskId()` - Validates task ID format
- `validateUploadFiles()` - Validates files for upload
- `validatePollOptions()` - Validates polling configuration

**What's Validated:**
- Content length limits
- Slide count (1-50)
- Enum values are valid
- Required fields present
- File size limits

---

## Request Flow

Here's how a request flows through the SDK:

```
┌─────────────────────────────────────────────────────────────────────────┐
│  USER CODE                                                               │
│  client.presentations.generate({ content: 'My Topic', numSlides: 10 }) │
└─────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────┐
│  1. VALIDATION (validation.ts)                                           │
│     - Check content is non-empty                                         │
│     - Check numSlides is 1-50                                           │
│     - Check enum values are valid                                        │
│     ❌ Invalid → throw ValidationError                                  │
│     ✅ Valid → continue                                                  │
└─────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────┐
│  2. TRANSFORM (client.ts)                                                │
│     - Convert camelCase → snake_case for API                            │
│     - numSlides → n_slides                                              │
│     - Apply defaults (tone: 'default', etc.)                            │
└─────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────┐
│  3. REQUEST (client.ts)                                                  │
│     - Add Authorization header                                           │
│     - POST to /api/v1/ppt/presentation/generate                         │
└─────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────┐
│  4. RETRY LOGIC (client.ts)                                              │
│     On failure:                                                          │
│     - Network error → Retry with backoff                                │
│     - 429 Rate limit → Wait for Retry-After, retry                      │
│     - 5xx Server error → Retry with backoff                             │
│     - 401/403 Auth error → Throw immediately                            │
│     - 4xx Client error → Throw immediately                              │
│                                                                          │
│     Max retries: 3, Backoff: 1s → 2s → 4s                               │
└─────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────┐
│  5. RESPONSE (client.ts)                                                 │
│     On success:                                                          │
│     - Parse JSON                                                         │
│     - Convert snake_case → camelCase                                    │
│     - Return GenerateSyncResponse                                        │
│                                                                          │
│     On error:                                                            │
│     - Create appropriate error class                                     │
│     - Throw error                                                        │
└─────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────┐
│  USER CODE                                                               │
│  result.presentationId  // "abc123"                                     │
│  result.path            // "https://presenton.ai/..."                   │
│  result.creditsConsumed // 10                                           │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## API Reference

### Creating a Client

```typescript
import { Presenton } from 'presenton';

const client = new Presenton({
  apiKey: 'sk-presenton-xxxxxxxx',  // Required
  baseUrl: 'https://api.presenton.ai',  // Optional, for self-hosted
  maxRetries: 3,    // Retry attempts (default: 3)
  retryDelay: 1000  // Base retry delay in ms (default: 1 second)
});
```

### Synchronous Generation

```typescript
const result = await client.presentations.generate({
  content: 'Quarterly Sales Report Q4 2024',
  numSlides: 15,
  tone: Tone.Professional,
  theme: Theme.ProfessionalBlue,
  exportAs: ExportFormat.PPTX
});

// Response
{
  presentationId: 'abc123',
  path: 'https://presenton.ai/view/abc123',
  editPath: 'https://presenton.ai/edit/abc123',
  creditsConsumed: 10
}
```

### Asynchronous Generation

```typescript
// Start generation
const task = await client.presentations.generateAsync({
  content: 'Annual Company Review',
  numSlides: 30
});

console.log(`Task started: ${task.taskId}`);

// Wait for completion with progress updates
const result = await client.presentations.waitForCompletion(task.taskId, {
  interval: 3000,  // Check every 3 seconds
  onStatusChange: (status) => console.log(`Status: ${status.status}`)
});
```

### Uploading Files

```typescript
// Node.js - upload by file path
const { fileIds } = await client.files.upload([
  './data/report.pdf',
  './data/quarterly-data.xlsx'
]);

// Generate from uploaded files
const result = await client.presentations.generate({
  content: 'Create a presentation summarizing these documents',
  files: fileIds,
  numSlides: 15
});
```

---

## Generation Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `content` | `string` | - | Main topic or content |
| `slidesMarkdown` | `string[]` | - | Pre-defined markdown for each slide |
| `slidesLayout` | `(string\|null)[]` | - | Layout for each slide |
| `numSlides` | `number` | auto | Number of slides (1-50) |
| `instructions` | `string` | - | Additional AI instructions |
| `tone` | `Tone` | `Default` | Voice tone |
| `verbosity` | `Verbosity` | `Standard` | Text amount |
| `contentGeneration` | `ContentGeneration` | - | Content handling mode |
| `markdownEmphasis` | `boolean` | `true` | Apply bold/italic formatting |
| `webSearch` | `boolean` | `false` | Enable web search |
| `imageType` | `ImageType` | `Stock` | Image source |
| `theme` | `Theme \| string` | - | Visual theme |
| `language` | `Language \| string` | `English` | Content language |
| `template` | `Template \| string` | `General` | Layout template |
| `includeTableOfContents` | `boolean` | `false` | Add TOC slide |
| `includeTitleSlide` | `boolean` | `true` | Add title slide |
| `files` | `string[]` | - | File IDs from upload |
| `exportAs` | `ExportFormat` | `PPTX` | Output format |
| `triggerWebhook` | `boolean` | `false` | Trigger webhooks |

---

## Error Handling

```typescript
import {
  Presenton,
  ValidationError,
  AuthenticationError,
  APIError,
  RateLimitError,
  NetworkError,
  GenerationError
} from 'presenton';

try {
  const result = await client.presentations.generate(options);
} catch (error) {
  if (error instanceof ValidationError) {
    console.error('Validation errors:');
    error.details.forEach(d => {
      console.error(`  ${d.field}: ${d.message}`);
    });
  } else if (error instanceof AuthenticationError) {
    console.error('Invalid API key');
  } else if (error instanceof RateLimitError) {
    console.error(`Rate limited. Retry after ${error.retryAfter}s`);
  } else if (error instanceof NetworkError) {
    console.error('Network error:', error.message);
  } else if (error instanceof APIError) {
    console.error(`API error (${error.statusCode}): ${error.message}`);
  } else if (error instanceof GenerationError) {
    console.error(`Generation failed: ${error.message}`);
  }
}
```

---

## Available Themes

```typescript
import { Theme } from 'presenton';

Theme.EdgeYellow
Theme.LightRose
Theme.MintBlue
Theme.ProfessionalBlue
Theme.ProfessionalDark
```

## Available Templates

```typescript
import { Template } from 'presenton';

Template.General
Template.Modern
Template.Standard
Template.Swift
```

---

## Links

- [Presenton Website](https://presenton.ai)
- [API Documentation](https://docs.presenton.ai)
- [Dashboard](https://presenton.ai/dashboard)

## License

MIT License - see [LICENSE](LICENSE) for details.
