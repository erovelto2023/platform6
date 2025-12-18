import { SECTION_TEMPLATES } from "@/lib/constants/affiliate-templates";

interface GenerateContentParams {
  sectionType: string;
  brandData: {
    name: string;
    productType: string;
    affiliateLink: string;
    description?: string;
    knowledgeBase?: any[];
    features?: string[];
    pros?: string[];
    cons?: string[];
    pricing?: any;
  };
  customInstructions?: string;
  comparisonBrand?: any;
  userId?: string;
}

// Template-specific prompts
const SECTION_PROMPTS: Record<string, string> = {
  hero: `Create a modern, high-converting hero section matching this design style:
  - Background: White or very light gray
  - Typography: Inter font, large bold headings (text-5xl to text-7xl)
  - Styling: Use a gradient text effect for key phrases (bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent)
  - Layout: Centered alignment, max-w-4xl mx-auto
  - Elements:
    - A small pill badge at the top (bg-indigo-50 text-indigo-700 rounded-full)
    - Main headline with gradient emphasis
    - Subheadline in text-gray-600 text-lg
    - Two buttons: Primary (indigo-600 rounded-full shadow-xl shadow-indigo-200) and Secondary (white border rounded-full)
    - A visual placeholder or image container with rounded-2xl shadow-2xl border
  Format as HTML with Tailwind CSS classes.`,

  introduction: `Write a clean, centered introduction section:
  - Background: White
  - Typography: Inter font
  - Layout: Centered, max-w-3xl mx-auto
  - Elements:
    - Heading: text-3xl font-bold mb-6
    - Text: text-xl text-gray-500 leading-relaxed
  Format as HTML with Tailwind CSS classes.`,

  features: `Create a "Bento Grid" style features section:
  - Background: bg-gray-50
  - Layout: Grid (grid-cols-1 md:grid-cols-3 gap-8)
  - Cards: White background, rounded-3xl, p-8, border border-gray-100
  - Card Hover: hover:-translate-y-1 hover:shadow-lg transition-all duration-200
  - Icons: Large colorful icon containers (w-12 h-12 rounded-2xl flex items-center justify-center mb-6)
  - Typography: Bold headings (text-xl), gray-600 body text
  Format as HTML with Tailwind CSS classes.`,

  proscons: `Create a modern Pros & Cons section:
  - Background: White
  - Container: Dark rounded container (bg-gray-900 rounded-[3rem] text-white p-8 md:p-16)
  - Layout: Two columns (grid-cols-1 lg:grid-cols-2 gap-16)
  - Elements:
    - "Why [Product]?" (Pros) vs "Not for everyone" (Cons)
    - List items with custom icons (bg-green-500/20 text-green-400 rounded-full checkmarks for pros)
    - Cons should use neutral/gray styling (bg-gray-500/20 text-gray-500)
  Format as HTML with Tailwind CSS classes.`,

  comparison: `Create a detailed comparison table:
  - Background: White
  - Style: Clean, minimal, border-b dividers
  - Header: Sticky or distinct header row
  - Cells: Py-4 px-6
  - Highlights: Use checkmarks (text-green-500) and crosses (text-gray-300)
  - Typography: font-medium text-gray-900 for features
  Format as a responsive table with Tailwind CSS.`,

  pricing: `Create a pricing section with 3 cards:
  - Background: bg-gray-50
  - Layout: Grid (grid-cols-1 md:grid-cols-3 gap-8)
  - Cards:
    - Standard: White, rounded-3xl, border border-gray-100, p-8
    - Popular/Pro: White, rounded-3xl, border-2 border-indigo-600, shadow-xl, transform scale-105 (relative z-10)
    - Enterprise: White, rounded-3xl, border border-gray-100, p-8
  - Elements:
    - Price: Large bold text (text-4xl)
    - Features: List with small check icons
    - Button: Full width, rounded-xl, py-3
  Format as HTML with Tailwind CSS classes.`,

  coupon: `Create a special offer/coupon section:
  - Background: bg-indigo-600
  - Container: rounded-[3rem] p-12 text-center text-white shadow-2xl shadow-indigo-200
  - Typography: text-4xl font-bold mb-6
  - Elements:
    - Dashed border box for code
    - "Copy Code" button
    - Urgency text
  Format as HTML with Tailwind CSS classes.`,

  video: `Create a video section:
  - Background: White
  - Container: max-w-5xl mx-auto
  - Frame: rounded-2xl overflow-hidden shadow-2xl border border-gray-200
  - Overlay: Optional play button overlay
  Format as HTML with Tailwind CSS classes.`,

  cta: `Create a high-impact CTA section:
  - Background: White (or transparent if placed on gray)
  - Container: bg-indigo-600 rounded-[3rem] p-12 text-center text-white shadow-2xl shadow-indigo-200
  - Typography: text-4xl font-bold mb-6
  - Elements:
    - Two buttons: White (primary) and Indigo-500 (secondary)
    - Rounded-full buttons
  Format as HTML with Tailwind CSS classes.`,

  faq: `Create a clean FAQ section:
  - Background: White
  - Container: max-w-3xl mx-auto
  - Style: details/summary HTML elements
  - Items: bg-gray-50 rounded-2xl p-6 mb-4 cursor-pointer
  - Typography: font-semibold text-gray-900 for questions
  - Icon: Simple arrow that rotates on open
  Format as HTML with Tailwind CSS classes.`,

  author: `Create an author/founder note section:
  - Background: bg-gray-50 border-t border-gray-100
  - Layout: Centered text-center
  - Image: Small rounded-full avatar (w-16 h-16) with shadow
  - Text: Italicized quote, max-w-2xl mx-auto
  - Signature: Name and title in bold indigo-600
  Format as HTML with Tailwind CSS classes.`,

  conclusion: `Write a conclusion section:
  - Background: White
  - Layout: Centered max-w-3xl
  - Typography: text-2xl font-bold mb-4
  - Elements:
    - Summary paragraph
    - Final rating (stars)
    - Final CTA button (rounded-full, indigo-600)
  Format as HTML with Tailwind CSS classes.`,
};

export async function generateAIContent(params: GenerateContentParams): Promise<string> {
  const { sectionType, brandData, customInstructions, comparisonBrand } = params;

  // Check if OpenAI is configured
  // const apiKey = process.env.OPENAI_API_KEY;

  // if (!apiKey) {
  //   // Return placeholder content if no API key
  //   // return generatePlaceholderContent(sectionType, brandData);
  // }

  try {
    const template = SECTION_TEMPLATES[sectionType as keyof typeof SECTION_TEMPLATES];
    const basePrompt = SECTION_PROMPTS[sectionType] || "Create content for this section.";

    // Build context from knowledge base
    const knowledgeContext = brandData.knowledgeBase
      ?.map((source: any) => source.extractedText || source.content)
      .join("\n\n")
      .substring(0, 3000); // Limit context size

    const systemPrompt = `You are an expert affiliate marketer and copywriter. 
Your task is to write honest, compelling, and SEO-optimized content for affiliate review pages.
Use Tailwind CSS classes for styling. Make the content conversion-focused but authentic.
IMPORTANT: Return ONLY the HTML content. Do not include markdown code blocks (like \`\`\`html). Do not include any explanations.`;

    const userPrompt = `
Product: ${brandData.name}
Type: ${brandData.productType}
${brandData.description ? `Description: ${brandData.description}` : ""}

${knowledgeContext ? `Background Information:\n${knowledgeContext}` : ""}

${brandData.features?.length ? `Features:\n${brandData.features.join("\n")}` : ""}
${brandData.pros?.length ? `Pros:\n${brandData.pros.join("\n")}` : ""}
${brandData.cons?.length ? `Cons:\n${brandData.cons.join("\n")}` : ""}

${comparisonBrand ? `Comparing against: ${comparisonBrand.name}` : ""}

Task: ${basePrompt}

${customInstructions ? `Additional Instructions: ${customInstructions}` : ""}

Important:
- Use the affiliate link: ${brandData.affiliateLink}
- Include it in all CTA buttons
- Write in a conversational, trustworthy tone
- Be specific with facts and figures
- Use Tailwind CSS for styling
- Make it mobile-responsive
- Return ONLY valid HTML
`;

    // Use AIService to handle routing between Local and OpenRouter
    const { AIService } = await import("@/lib/ai-service");

    const response = await AIService.generate({
      prompt: userPrompt,
      systemPrompt: systemPrompt,
      model: "deepseek-llm:latest", // Default fallback, AIService will override based on settings
      userId: params.userId, // Pass userId to fetch settings
    });

    // Clean up response if it contains markdown blocks
    let content = response.content.trim();
    if (content.startsWith("```html")) {
      content = content.replace(/^```html/, "").replace(/```$/, "");
    } else if (content.startsWith("```")) {
      content = content.replace(/^```/, "").replace(/```$/, "");
    }

    return content || generatePlaceholderContent(sectionType, brandData);
  } catch (error) {
    console.error("AI generation error:", error);
    return generatePlaceholderContent(sectionType, brandData);
  }
}

// Fallback placeholder content generator
function generatePlaceholderContent(sectionType: string, brandData: any): string {
  const template = SECTION_TEMPLATES[sectionType as keyof typeof SECTION_TEMPLATES];

  return `
    <div class="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm">
      <div class="max-w-3xl mx-auto text-center">
        <div class="w-16 h-16 bg-indigo-50 rounded-2xl flex items-center justify-center mx-auto mb-6">
          <svg class="w-8 h-8 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
          </svg>
        </div>
        <h2 class="text-3xl font-bold text-gray-900 mb-4 font-[family-name:var(--font-inter)]">
          ${template?.name || sectionType}
        </h2>
        <p class="text-lg text-gray-500 mb-8 font-[family-name:var(--font-inter)]">
          ${template?.description || "Content section"}
        </p>
        
        <div class="bg-gray-50 rounded-2xl p-8 border border-gray-100">
          <h3 class="font-bold text-xl mb-3 text-gray-900">${brandData.name}</h3>
          <p class="text-gray-600 mb-6">
            ${brandData.description || `Comprehensive ${brandData.productType} solution`}
          </p>
          
          ${brandData.features?.length ? `
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left mb-8">
              ${brandData.features.slice(0, 4).map((f: string) => `
                <div class="flex items-center gap-3 bg-white p-3 rounded-xl border border-gray-100">
                  <div class="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                    <svg class="w-3 h-3 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                  </div>
                  <span class="text-sm font-medium text-gray-700">${f}</span>
                </div>
              `).join('')}
            </div>
          ` : ''}

          <a 
            href="${brandData.affiliateLink}" 
            target="_blank"
            rel="noopener noreferrer"
            class="inline-flex items-center justify-center px-8 py-4 bg-indigo-600 text-white rounded-full font-semibold hover:bg-indigo-700 transition shadow-lg shadow-indigo-200"
          >
            Learn More About ${brandData.name}
          </a>
        </div>

        <div class="mt-8 p-4 bg-amber-50 rounded-xl border border-amber-100 text-amber-800 text-sm">
          <strong>AI Generation Pending:</strong> This is a placeholder. 
          <br/>
          If using <strong>Local AI</strong>: Ensure Ollama is running (<code>ollama serve</code>) and model is pulled.
          <br/>
          If using <strong>OpenRouter</strong>: Check your API Key in Settings > AI Configuration and ensure you have credits.
        </div>
      </div>
    </div>
  `;
}
