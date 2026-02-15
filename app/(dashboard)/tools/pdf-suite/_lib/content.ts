import { toolContentEn } from '../_config/tool-content/en';
import { ToolContent } from '../_types/tool';

export function getToolContent(toolId: string): ToolContent {
    const content = toolContentEn[toolId];
    if (!content) {
        // Fallback content if missing
        return {
            title: 'PDF Tool',
            metaDescription: 'PDF Tool',
            keywords: [],
            description: '',
            howToUse: [],
            useCases: [],
            faq: []
        };
    }
    return content;
}
