# Presenton SDK for Node.js

The official JavaScript/TypeScript SDK for the [Presenton](https://presenton.ai) AI presentation generation API.

[![npm version](https://badge.fury.io/js/presenton.svg)](https://www.npmjs.com/package/presenton)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue.svg)](https://www.typescriptlang.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## Installation

```bash
npm install presenton
```

## Quick Start

```typescript
import { Presenton, Tone, Theme } from "presenton";

const client = new Presenton({
  apiKey: "sk-presenton-xxxxxxxx",
  baseUrl: "https://api.presenton.ai",
});

const result = await client.presentations.generate({
  content: "Introduction to Machine Learning",
  numSlides: 10,
  tone: Tone.Professional,
  theme: Theme.ProfessionalBlue,
});

console.log(result.path); // https://presenton.ai/view/...
```

---

## Examples

### 1. Synchronous Generation

Generate a presentation and wait for the result. Best for quick presentations (< 15 slides).

```typescript
import { Presenton, Tone, Verbosity, Theme, ExportFormat } from "presenton";

const client = new Presenton({
  apiKey: process.env.PRESENTON_API_KEY!,
});

async function generatePresentation() {
  const result = await client.presentations.generate({
    // Required: Your topic or content
    content: "Quarterly Sales Report Q4 2024",

    // Optional: Number of slides (1-50)
    numSlides: 12,

    // Optional: Tone of the presentation
    tone: Tone.Professional,

    // Optional: How much text per slide
    verbosity: Verbosity.Standard,

    // Optional: Visual theme
    theme: Theme.ProfessionalBlue,

    // Optional: Output format
    exportAs: ExportFormat.PPTX,

    // Optional: Additional instructions for AI
    instructions: "Focus on revenue growth and include charts",

    // Optional: Include table of contents
    includeTableOfContents: true,
  });

  console.log("Presentation generated!");
  console.log("ID:", result.presentationId);
  console.log("View:", result.path);
  console.log("Edit:", result.editPath);
  console.log("Credits used:", result.creditsConsumed);
}

generatePresentation();
```

---

### 2. Asynchronous Generation with Status Polling

For longer presentations, use async generation to avoid long waits. The SDK polls automatically.

```typescript
import { Presenton, Tone, TaskStatus } from "presenton";

const client = new Presenton({
  apiKey: process.env.PRESENTON_API_KEY!,
});

async function generateLargePresentation() {
  // Step 1: Start async generation
  const task = await client.presentations.generateAsync({
    content: "Complete Guide to Cloud Computing",
    numSlides: 30,
    tone: Tone.Educational,
  });

  console.log("Task started!");
  console.log("Task ID:", task.taskId);
  console.log("Status:", task.status);

  // Step 2: Wait for completion with progress updates
  const result = await client.presentations.waitForCompletion(task.taskId, {
    // Check status every 3 seconds
    interval: 3000,

    // Callback on each status check
    onStatusChange: (status) => {
      console.log(`Status: ${status.status}`);

      if (status.status === TaskStatus.Completed) {
        console.log("Generation complete!");
      }
    },
  });

  console.log("Presentation ready!");
  console.log("View:", result.path);
}

generateLargePresentation();
```

---

### 3. Manual Status Checking

If you prefer to check status manually instead of using `waitForCompletion`:

```typescript
import { Presenton, TaskStatus } from "presenton";

const client = new Presenton({
  apiKey: process.env.PRESENTON_API_KEY!,
});

async function manualStatusCheck() {
  // Start async generation
  const task = await client.presentations.generateAsync({
    content: "AI in Healthcare",
    numSlides: 20,
  });

  console.log("Task ID:", task.taskId);

  // Poll manually
  let completed = false;

  while (!completed) {
    // Wait 2 seconds between checks
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Check status
    const status = await client.presentations.getStatus(task.taskId);
    console.log("Current status:", status.status);

    if (status.status === TaskStatus.Completed) {
      completed = true;
      console.log("Done! View at:", status.data?.path);
    }

    if (status.status === TaskStatus.Error) {
      console.error("Generation failed:", status.error);
      break;
    }
  }
}

manualStatusCheck();
```

---

### 4. Upload Files

Upload PDF, DOCX, XLSX, or other files to use as source material.

```typescript
import { Presenton } from "presenton";

const client = new Presenton({
  apiKey: process.env.PRESENTON_API_KEY!,
});

async function uploadFiles() {
  // Upload files by path (Node.js)
  const { fileIds } = await client.files.upload([
    "./documents/report.pdf",
    "./documents/data.xlsx",
    "./documents/notes.docx",
  ]);

  console.log("Files uploaded!");
  console.log("File IDs:", fileIds);
  // ['file-abc123', 'file-def456', 'file-ghi789']
}

uploadFiles();
```

**Browser upload example:**

```typescript
// Get files from input element
const fileInput = document.querySelector(
  'input[type="file"]'
) as HTMLInputElement;
const files = Array.from(fileInput.files || []);

const { fileIds } = await client.files.upload(files);
console.log("Uploaded:", fileIds);
```

---

### 5. Upload Files Then Generate Presentation

The complete workflow: upload source files, then generate a presentation from them.

```typescript
import { Presenton, Tone, Theme, ExportFormat } from "presenton";

const client = new Presenton({
  apiKey: process.env.PRESENTON_API_KEY!,
});

async function createPresentationFromFiles() {
  // Step 1: Upload source files
  console.log("Uploading files...");

  const { fileIds } = await client.files.upload([
    "./quarterly-report.pdf",
    "./sales-data.xlsx",
  ]);

  console.log("Files uploaded:", fileIds);

  // Step 2: Generate presentation using uploaded files
  console.log("Generating presentation...");

  const result = await client.presentations.generate({
    // Describe what you want
    content: "Create a quarterly business review presentation",

    // Reference the uploaded files
    files: fileIds,

    // Customize the output
    numSlides: 15,
    tone: Tone.Professional,
    theme: Theme.ProfessionalDark,
    exportAs: ExportFormat.PPTX,

    // Additional instructions
    instructions: "Extract key metrics and create visualizations from the data",

    // Add table of contents
    includeTableOfContents: true,
  });

  console.log("Presentation created!");
  console.log("View:", result.path);
  console.log("Edit:", result.editPath);
}

createPresentationFromFiles();
```

---

### 6. Generate with Pre-defined Slide Content

Use `slidesMarkdown` to specify exact content for each slide:

```typescript
import { Presenton, Theme } from "presenton";

const client = new Presenton({
  apiKey: process.env.PRESENTON_API_KEY!,
});

async function generateWithMarkdown() {
  const result = await client.presentations.generate({
    // Define content for each slide in markdown
    slidesMarkdown: [
      "# Welcome\n\nIntroduction to our company",
      "# Our Mission\n\n- Innovation first\n- Customer focused\n- Quality driven",
      "# Products\n\n- Product A: Enterprise solution\n- Product B: SMB solution",
      "# Contact\n\n**Email:** hello@company.com\n**Phone:** 555-1234",
    ],

    theme: Theme.MintBlue,
  });

  console.log("Presentation:", result.path);
}

generateWithMarkdown();
```

---

## Configuration Options

### Client Options

```typescript
const client = new Presenton({
  // Required: Your API key
  apiKey: "sk-presenton-xxxxxxxx",

  // Optional: Custom API URL (for self-hosted)
  baseUrl: "https://api.presenton.ai",

  // Optional: Max retry attempts (default: 3)
  maxRetries: 3,

  // Optional: Base delay between retries in ms (default: 1000)
  retryDelay: 1000,
});
```

### Generation Options

#### ⚠️ Required: Choose ONE Content Source

You must provide **at least one** of these three options:

| Option           | When to Use                                        |
| ---------------- | -------------------------------------------------- |
| `content`        | Let AI generate slides from your topic/description |
| `slidesMarkdown` | Define exact content for each slide yourself       |
| `files`          | Generate presentation from uploaded documents      |

You can also combine `files` with either `content` or `slidesMarkdown` to use uploaded documents as reference material.

#### All Options

| Option                   | Type                 | Required | Default    | Description                                       |
| ------------------------ | -------------------- | -------- | ---------- | ------------------------------------------------- |
| `content`                | `string`             | \*       | -          | Main topic or content for the presentation        |
| `slidesMarkdown`         | `string[]`           | \*       | -          | Pre-defined markdown content for each slide       |
| `files`                  | `string[]`           | \*       | -          | File IDs from upload to use as source material    |
| `numSlides`              | `number`             | No       | auto       | Number of slides to generate (1-50)               |
| `slidesLayout`           | `(string\|null)[]`   | No       | -          | Layout specification for each slide               |
| `instructions`           | `string`             | No       | -          | Additional instructions for AI                    |
| `tone`                   | `Tone`               | No       | `Default`  | Voice tone for the text                           |
| `verbosity`              | `Verbosity`          | No       | `Standard` | Amount of text per slide                          |
| `contentGeneration`      | `ContentGeneration`  | No       | -          | How to handle content (preserve/enhance/condense) |
| `markdownEmphasis`       | `boolean`            | No       | `true`     | Apply bold/italic formatting                      |
| `webSearch`              | `boolean`            | No       | `false`    | Enable web search for additional content          |
| `imageType`              | `ImageType`          | No       | `Stock`    | Image source (stock or AI-generated)              |
| `theme`                  | `Theme \| string`    | No       | -          | Use `Theme` enum or custom theme ID               |
| `language`               | `Language \| string` | No       | `English`  | Presentation language                             |
| `template`               | `Template \| string` | No       | `General`  | Use `Template` enum or custom template ID         |
| `includeTableOfContents` | `boolean`            | No       | `false`    | Add table of contents slide                       |
| `includeTitleSlide`      | `boolean`            | No       | `true`     | Add title slide                                   |
| `exportAs`               | `ExportFormat`       | No       | `PPTX`     | Output format (PPTX or PDF)                       |
| `triggerWebhook`         | `boolean`            | No       | `false`    | Trigger configured webhooks on completion         |

> **\*** At least one of `content`, `slidesMarkdown`, or `files` is required.

### Using Custom Theme or Template

You can use built-in enums or your own custom theme/template IDs:

```typescript
import { Presenton, Theme, Template } from "presenton";

// Using built-in enum
const result1 = await client.presentations.generate({
  content: "My presentation",
  theme: Theme.ProfessionalBlue,
  template: Template.Modern,
});

// Using custom theme/template ID (from your Presenton dashboard)
const result2 = await client.presentations.generate({
  content: "My presentation",
  theme: "my-custom-theme-id",
  template: "my-custom-template-id",
});
```

---

## Available Enums

### Tone

```typescript
import { Tone } from "presenton";

Tone.Default; // Balanced, neutral
Tone.Casual; // Conversational
Tone.Professional; // Formal business
Tone.Funny; // Light-hearted
Tone.Educational; // Instructional
Tone.SalesPitch; // Persuasive
```

### Verbosity

```typescript
import { Verbosity } from "presenton";

Verbosity.Concise; // Minimal text
Verbosity.Standard; // Balanced
Verbosity.TextHeavy; // Detailed
```

### Theme

```typescript
import { Theme } from "presenton";

Theme.EdgeYellow;
Theme.LightRose;
Theme.MintBlue;
Theme.ProfessionalBlue;
Theme.ProfessionalDark;
```

### Template

```typescript
import { Template } from "presenton";

Template.General;
Template.Modern;
Template.Standard;
Template.Swift;
```

### ExportFormat

```typescript
import { ExportFormat } from "presenton";

ExportFormat.PPTX; // PowerPoint
ExportFormat.PDF; // PDF
```

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
  GenerationError,
  UploadError,
} from "presenton";

const client = new Presenton({ apiKey: "sk-presenton-xxx" });

try {
  const result = await client.presentations.generate({
    content: "My presentation",
    numSlides: 10,
  });
} catch (error) {
  if (error instanceof ValidationError) {
    // Input validation failed
    console.error("Invalid input:");
    error.details.forEach((d) => {
      console.error(`  ${d.field}: ${d.message}`);
    });
  } else if (error instanceof AuthenticationError) {
    // Invalid API key
    console.error("Check your API key");
  } else if (error instanceof RateLimitError) {
    // Too many requests
    console.error(`Rate limited. Retry after ${error.retryAfter} seconds`);
  } else if (error instanceof NetworkError) {
    // Network issue
    console.error("Network error:", error.message);
  } else if (error instanceof APIError) {
    // API error
    console.error(`API error (${error.statusCode}): ${error.message}`);
  } else if (error instanceof GenerationError) {
    // Generation failed
    console.error("Generation failed:", error.message);
  } else if (error instanceof UploadError) {
    // File upload failed
    console.error("Upload failed:", error.fileName);
  }
}
```

---

## Links

- [Presenton Website](https://presenton.ai)
- [API Documentation](https://docs.presenton.ai)
- [Get API Key](https://presenton.ai/api-key)
- [GitHub](https://github.com/presenton/presenton)

## License

MIT License
