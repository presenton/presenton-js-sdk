// ============================================================================
// Enums - Matching Presenton API specification exactly
// ============================================================================

/**
 * Tone style for the presentation text
 * @see https://docs.presenton.ai/api-reference/presentation/generate-presentation-sync-v1
 */
export enum Tone {
    /** Default tone - balanced and neutral */
    Default = "default",
    /** Casual and conversational */
    Casual = "casual",
    /** Formal business tone */
    Professional = "professional",
    /** Light-hearted and humorous */
    Funny = "funny",
    /** Instructional and informative */
    Educational = "educational",
    /** Persuasive sales language */
    SalesPitch = "sales_pitch",
}

/**
 * Text verbosity level for slides
 */
export enum Verbosity {
    /** Minimal text, key points only */
    Concise = "concise",
    /** Balanced amount of text */
    Standard = "standard",
    /** Detailed explanations */
    TextHeavy = "text-heavy",
}

/**
 * How to process and generate content for slides
 */
export enum ContentGeneration {
    /** Keep content as provided */
    Preserve = "preserve",
    /** Expand and improve content */
    Enhance = "enhance",
    /** Summarize and shorten content */
    Condense = "condense",
}

/**
 * Image source type for slides
 */
export enum ImageType {
    /** Use stock images */
    Stock = "stock",
    /** Generate images with AI */
    AIGenerated = "ai-generated",
}

/**
 * Built-in presentation themes
 */
export enum Theme {
    EdgeYellow = "edge-yellow",
    LightRose = "light-rose",
    MintBlue = "mint-blue",
    ProfessionalBlue = "professional-blue",
    ProfessionalDark = "professional-dark",
}

/**
 * Built-in presentation templates
 */
export enum Template {
    General = "general",
    Modern = "modern",
    Standard = "standard",
    Swift = "swift",
}

/**
 * Export format for generated presentations
 */
export enum ExportFormat {
    /** PowerPoint format */
    PPTX = "pptx",
    /** PDF format */
    PDF = "pdf",
}

/**
 * Status of async presentation generation
 */
export enum TaskStatus {
    Pending = "pending",
    Completed = "completed",
    Error = "error",
}

/**
 * Supported languages for presentation generation
 */
export enum Language {
    // Major World Languages
    English = "English",
    Spanish = "Spanish (Español)",
    French = "French (Français)",
    German = "German (Deutsch)",
    Portuguese = "Portuguese (Português)",
    Italian = "Italian (Italiano)",
    Dutch = "Dutch (Nederlands)",
    Russian = "Russian (Русский)",
    ChineseSimplified = "Chinese (Simplified - 中文, 汉语)",
    ChineseTraditional = "Chinese (Traditional - 中文, 漢語)",
    Japanese = "Japanese (日本語)",
    Korean = "Korean (한국어)",
    Arabic = "Arabic (العربية)",
    Hindi = "Hindi (हिन्दी)",
    Bengali = "Bengali (বাংলা)",

    // European Languages
    Polish = "Polish (Polski)",
    Czech = "Czech (Čeština)",
    Slovak = "Slovak (Slovenčina)",
    Hungarian = "Hungarian (Magyar)",
    Romanian = "Romanian (Română)",
    Bulgarian = "Bulgarian (Български)",
    Greek = "Greek (Ελληνικά)",
    Serbian = "Serbian (Српски / Srpski)",
    Croatian = "Croatian (Hrvatski)",
    Bosnian = "Bosnian (Bosanski)",
    Slovenian = "Slovenian (Slovenščina)",
    Finnish = "Finnish (Suomi)",
    Swedish = "Swedish (Svenska)",
    Danish = "Danish (Dansk)",
    Norwegian = "Norwegian (Norsk)",
    Icelandic = "Icelandic (Íslenska)",
    Lithuanian = "Lithuanian (Lietuvių)",
    Latvian = "Latvian (Latviešu)",
    Estonian = "Estonian (Eesti)",
    Maltese = "Maltese (Malti)",
    Welsh = "Welsh (Cymraeg)",
    Irish = "Irish (Gaeilge)",
    ScottishGaelic = "Scottish Gaelic (Gàidhlig)",

    // Middle Eastern and Central Asian Languages
    Hebrew = "Hebrew (עברית)",
    Persian = "Persian/Farsi (فارسی)",
    Turkish = "Turkish (Türkçe)",
    Kurdish = "Kurdish (Kurdî / کوردی)",
    Pashto = "Pashto (پښتو)",
    Dari = "Dari (دری)",
    Uzbek = "Uzbek (Oʻzbek)",
    Kazakh = "Kazakh (Қазақша)",
    Tajik = "Tajik (Тоҷикӣ)",
    Turkmen = "Turkmen (Türkmençe)",
    Azerbaijani = "Azerbaijani (Azərbaycan dili)",

    // South Asian Languages
    Urdu = "Urdu (اردو)",
    Tamil = "Tamil (தமிழ்)",
    Telugu = "Telugu (తెలుగు)",
    Marathi = "Marathi (मराठी)",
    Punjabi = "Punjabi (ਪੰਜਾਬੀ / پنجابی)",
    Gujarati = "Gujarati (ગુજરાતી)",
    Malayalam = "Malayalam (മലയാളം)",
    Kannada = "Kannada (ಕನ್ನಡ)",
    Odia = "Odia (ଓଡ଼ିଆ)",
    Sinhala = "Sinhala (සිංහල)",
    Nepali = "Nepali (नेपाली)",

    // East and Southeast Asian Languages
    Thai = "Thai (ไทย)",
    Vietnamese = "Vietnamese (Tiếng Việt)",
    Lao = "Lao (ລາວ)",
    Khmer = "Khmer (ភាសាខ្មែរ)",
    Burmese = "Burmese (မြန်မာစာ)",
    Tagalog = "Tagalog/Filipino (Tagalog/Filipino)",
    Javanese = "Javanese (Basa Jawa)",
    Sundanese = "Sundanese (Basa Sunda)",
    Malay = "Malay (Bahasa Melayu)",
    Mongolian = "Mongolian (Монгол)",

    // African Languages
    Swahili = "Swahili (Kiswahili)",
    Hausa = "Hausa (Hausa)",
    Yoruba = "Yoruba (Yorùbá)",
    Igbo = "Igbo (Igbo)",
    Amharic = "Amharic (አማርኛ)",
    Zulu = "Zulu (isiZulu)",
    Xhosa = "Xhosa (isiXhosa)",
    Shona = "Shona (ChiShona)",
    Somali = "Somali (Soomaaliga)",

    // Indigenous and Regional Languages
    Basque = "Basque (Euskara)",
    Catalan = "Catalan (Català)",
    Galician = "Galician (Galego)",
    Quechua = "Quechua (Runasimi)",
    Nahuatl = "Nahuatl (Nāhuatl)",
    Hawaiian = "Hawaiian (ʻŌlelo Hawaiʻi)",
    Maori = "Maori (Te Reo Māori)",
    Tahitian = "Tahitian (Reo Tahiti)",
    Samoan = "Samoan (Gagana Samoa)",
}

// ============================================================================
// Request Types
// ============================================================================

/**
 * Options for generating a presentation
 */
export interface GenerateOptions {
    /**
     * The main content/topic for generating the presentation.
     * This is the primary input that describes what the presentation should be about.
     * @example "Introduction to Machine Learning"
     */
    content?: string;

    /**
     * Pre-defined markdown content for each slide.
     * Use this when you want precise control over slide content.
     * @example ["# Slide 1\n- Point 1\n- Point 2", "# Slide 2\n..."]
     */
    slidesMarkdown?: string[];

    /**
     * Layout specification for each slide.
     * Should match the length of slidesMarkdown if both are provided.
     */
    slidesLayout?: (string | null)[];

    /**
     * Number of slides to generate (1-50).
     * Ignored if slidesMarkdown is provided.
     * @default Automatically determined based on content
     */
    numSlides?: number;

    /**
     * Additional instructions for the AI to follow when generating.
     * @example "Focus on practical examples and include statistics"
     */
    instructions?: string;

    /**
     * The tone of voice for the presentation text.
     * @default Tone.Default
     */
    tone?: Tone;

    /**
     * How verbose the slide text should be.
     * @default Verbosity.Standard
     */
    verbosity?: Verbosity;

    /**
     * How to handle content generation.
     * - preserve: Keep content as provided
     * - enhance: Expand and improve
     * - condense: Summarize and shorten
     */
    contentGeneration?: ContentGeneration;

    /**
     * Whether to apply markdown formatting emphasis (bold, italic).
     * @default true
     */
    markdownEmphasis?: boolean;

    /**
     * Enable web search for additional content.
     * @default false
     */
    webSearch?: boolean;

    /**
     * Type of images to use in slides.
     * @default ImageType.Stock
     */
    imageType?: ImageType;

    /**
     * Theme for the presentation.
     * Can be a built-in Theme enum value or a custom theme ID.
     */
    theme?: Theme | string;

    /**
     * Language for the presentation content.
     * @default Language.English
     */
    language?: Language | string;

    /**
     * Template for the presentation layout.
     * Can be a built-in Template enum value or a custom template ID.
     * @default Template.General
     */
    template?: Template | string;

    /**
     * Include a table of contents slide.
     * @default false
     */
    includeTableOfContents?: boolean;

    /**
     * Include a title slide at the beginning.
     * @default true
     */
    includeTitleSlide?: boolean;

    /**
     * Allow the API to access user profile information.
     * @default true
     */
    allowAccessToUserInfo?: boolean;

    /**
     * File IDs to use as source material.
     * Upload files first using client.files.upload()
     */
    files?: string[];

    /**
     * Output format for the presentation.
     * @default ExportFormat.PPTX
     */
    exportAs?: ExportFormat;

    /**
     * Trigger configured webhooks when generation completes.
     * @default false
     */
    triggerWebhook?: boolean;
}

// ============================================================================
// Response Types
// ============================================================================

/**
 * Response from synchronous presentation generation
 */
export interface GenerateSyncResponse {
    /** Unique identifier for the generated presentation */
    presentationId: string;
    /** URL path to view/download the presentation */
    path: string;
    /** URL path to edit the presentation in Presenton */
    editPath: string;
    /** Number of credits consumed for this generation */
    creditsConsumed: number;
}

/**
 * Response from asynchronous presentation generation
 */
export interface GenerateAsyncResponse {
    /** Confirmation message */
    message: string;
    /** Task creation timestamp */
    createdAt: Date;
    /** Task last update timestamp */
    updatedAt: Date;
    /** Task ID for status polling (e.g., "task-xxxxxxxxxx") */
    taskId: string;
    /** Current task status */
    status: TaskStatus;
    /** Task result data (populated when completed) */
    data?: GenerateSyncResponse;
    /** Error details (populated when failed) */
    error?: Record<string, unknown>;
}

/**
 * Response from checking async task status
 */
export interface TaskStatusResponse {
    /** Confirmation message */
    message: string;
    /** Task creation timestamp */
    createdAt: Date;
    /** Task last update timestamp */
    updatedAt: Date;
    /** Task ID */
    taskId: string;
    /** Current task status */
    status: TaskStatus;
    /** Task result data (populated when completed) */
    data?: GenerateSyncResponse;
    /** Error details (populated when failed) */
    error?: Record<string, unknown>;
}

/**
 * Response from file upload
 */
export interface UploadResponse {
    /** Array of file IDs that can be used in generate options */
    fileIds: string[];
}

// ============================================================================
// Internal API Types (snake_case for API communication)
// ============================================================================

/** @internal API request payload format */
export interface ApiGeneratePayload {
    content?: string | null;
    slides_markdown?: string[] | null;
    slides_layout?: (string | null)[] | null;
    n_slides?: number | null;
    instructions?: string | null;
    tone?: string;
    verbosity?: string;
    content_generation?: string | null;
    markdown_emphasis?: boolean;
    web_search?: boolean;
    image_type?: string;
    theme?: string | null;
    language?: string | null;
    template?: string;
    include_table_of_contents?: boolean;
    include_title_slide?: boolean;
    allow_access_to_user_info?: boolean;
    files?: string[] | null;
    export_as?: string;
    trigger_webhook?: boolean;
}

/** @internal API sync response format */
export interface ApiSyncResponse {
    presentation_id: string;
    path: string;
    edit_path: string;
    credits_consumed: number;
}

/** @internal API async response format */
export interface ApiAsyncResponse {
    message: string;
    created_at: string;
    updated_at: string;
    id: string;
    status: string;
    data?: ApiSyncResponse;
    error?: Record<string, unknown>;
}

// ============================================================================
// Client Configuration Types
// ============================================================================

/**
 * Configuration options for the Presenton client
 */
export interface ClientConfig {
    /**
     * Your Presenton API key.
     * Get one from https://presenton.ai/api-key
     * @example "sk-presenton-xxxxxxxx"
     */
    apiKey: string;

    /**
     * Base URL for the Presenton API.
     * Override for self-hosted instances.
     * @default "https://api.presenton.ai"
     */
    baseUrl?: string;

    /**
     * Maximum number of retry attempts for failed requests.
     * Only retries on network errors and 5xx responses.
     * @default 3
     */
    maxRetries?: number;

    /**
     * Base delay between retries in milliseconds.
     * Actual delay uses exponential backoff.
     * @default 1000
     */
    retryDelay?: number;
}

/**
 * Options for polling async task status
 */
export interface PollOptions {
    /**
     * Interval between status checks in milliseconds.
     * @default 2000
     */
    interval?: number;

    /**
     * Callback invoked on each status check.
     * Useful for progress updates.
     */
    onStatusChange?: (status: TaskStatusResponse) => void;
}
