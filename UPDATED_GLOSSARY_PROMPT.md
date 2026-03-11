# Updated Glossary Terms JSON Prompt

Generate a strict JSON array containing exactly ONE object for each of the keywords at the bottom of this prompt.

The JSON MUST conform precisely to this schema structure and nothing else. Output ONLY the JSON array inside a standard code block, do not include any conversational text:

[
  {
    "term": "The Keyword",
    "slug": "url-friendly-version-of-the-keyword",
    "category": "Broad Category (e.g. Marketing, Development, Email Marketing, Social Media)",
    "skillRequired": "Must be exactly one of: 'Beginner', 'Intermediate', or 'Advanced'",
    "tags": ["tag1", "tag2", "tag3", "relevant-keywords"],
    "shortDefinition": "1-2 sentence quick definition under 50 words.",
    "definition": "Simple, beginner-friendly explanation of what it means, why it exists, and where it is used.",
    "origin": "History, Origin, and Etymology of the term.",
    "traditionalMeaning": "The traditional or classic meaning of the term.",
    "expandedExplanation": "Expanded history and a deeper explanation of the concept context.",
    "commonPractices": "Common practices or exercises related to this term.",
    "useCases": "A real-world use case or practical application.",
    "howItMakesMoney": "A detailed explanation of how this concept generates revenue.",
    "bestFor": "The ideal target audience or type of person best suited for this.",
    "startupCost": "Must be exactly one of: '$0', '<$100', or '$100+'",
    "timeToFirstDollar": "Estimated time it realistically takes to make the first dollar.",
    "platformPreference": "The preferred software, platform, or environment.",
    "gettingStartedChecklist": ["Step 1", "Step 2", "Step 3", "Step 4", "Step 5"],
    "whyItMatters": "1-3 sentences explaining why someone in business/marketing should care.",
    "videoUrl": "",
    "takeaways": ["Takeaway 1", "Takeaway 2", "Takeaway 3"],
    "headlines": ["Headline 1", "Headline 2", "Headline 3", "Headline 4", "Headline 5"],
    "youtubeTitles": ["YT 1", "YT 2", "YT 3", "YT 4", "YT 5"],
    "pinterestIdeas": ["Pin 1", "Pin 2", "Pin 3", "Pin 4", "Pin 5"],
    "instagramIdeas": ["IG 1", "IG 2", "IG 3", "IG 4", "IG 5"],
    "amazonProducts": [
      {"name": "Product or Book Name 1", "url": ""},
      {"name": "Product or Book Name 2", "url": ""}
    ],
    "websitesRanking": [
      {"name": "Competitor/Authority Website 1", "url": "https://example.com"},
      {"name": "Competitor/Authority Website 2", "url": "https://example.com"}
    ],
    "podcastsRanking": [
      {"name": "Podcast Name 1", "url": "https://example.com"},
      {"name": "Podcast Name 2", "url": "https://example.com"}
    ],
    "faqs": [
      {"question": "Common Question 1?", "answer": "Answer 1"},
      {"question": "Common Question 2?", "answer": "Answer 2"}
    ],
    "caseStudies": [
      {"title": "Example Case Study", "description": "Short explanation of the case study in practice."}
    ],
    "relatedTermIds": ["slug-of-related-term-1", "slug-of-related-term-2", "slug-of-related-term-3"],
    "synonyms": ["Alternative Name 1", "Alternative Name 2"],
    "antonyms": ["Opposite Concept 1"],
    "seeAlso": ["Related Concept 1", "Related Concept 2"],
    "metaTitle": "SEO Optimized Meta Title under 60 characters",
    "metaDescription": "SEO meta description under 160 characters",
    "keywords": ["keyword 1", "keyword 2", "keyword 3", "keyword 4", "keyword 5"],
    "isFeatured": false,
    "status": "published",
    "aiTrainingEligible": true,
    "niche": "Internet Marketing / Online Business"
  }
]

## Field Explanations:

### **NEW FIELDS ADDED:**
- `slug`: URL-friendly version of the term (lowercase, hyphens instead of spaces)
- `tags`: Array of relevant tags for tag cloud filtering
- `relatedTermIds`: Array of slugs for related terms (creates smart relationships)
- `synonyms`: Alternative names for the term
- `antonyms`: Opposite concepts
- `seeAlso`: Additional related concepts
- `metaDescription`: SEO meta description
- `isFeatured`: Whether to show in "trending" section
- `status`: Publication status
- `aiTrainingEligible`: For AI training purposes
- `niche`: Primary niche classification

### **EXISTING FIELDS (Unchanged):**
All other fields remain exactly the same as your original prompt.

## Important Notes:

1. **slug**: Should be URL-friendly (lowercase, hyphens for spaces, no special characters)
2. **tags**: Include 3-5 relevant keywords that users might search for
3. **relatedTermIds**: Use the `slug` values of other terms in your glossary to create relationships
4. **category**: Be consistent with categories across all terms for better filtering
5. **skillRequired**: Use accurate difficulty levels for user filtering

Please generate the robust JSON array for the following terms:
1.
2.
3.
