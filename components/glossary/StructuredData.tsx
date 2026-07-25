interface GlossaryTermStructuredDataProps {
  term: {
    term: string;
    slug: string;
    definition: string;
    shortDefinition: string;
    aeoSummary?: string;
    entityType?: string;
    category?: string;
    contentLevel?: string;
    keywords?: string[];
    lastUpdated?: Date | string;
    imageUrl?: string;
    faqs?: { question: string; answer: string }[];
    questionVariations?: { question: string; intentType: string; targetAnswer: string }[];
    realWorldScenario?: { context?: string; stepByStep?: string[]; citableMetric?: string; outcome?: string };
  };
  baseUrl: string;
}

export default function GlossaryTermStructuredData({ term, baseUrl }: GlossaryTermStructuredDataProps) {
  const pageUrl = `${baseUrl}/glossary/${term.slug}`;

  // Graph schema combining DefinedTerm, Article & Speakable AEO
  const graphSchema: any = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": ["DefinedTerm", "Article"],
        "@id": `${pageUrl}#definedterm`,
        "name": term.term,
        "description": term.aeoSummary || term.shortDefinition,
        "definition": term.definition,
        "inDefinedTermSet": {
          "@type": "DefinedTermSet",
          "@id": `${baseUrl}/glossary#definedtermset`,
          "name": "K Business Academy Digital Monetization Glossary",
          "url": `${baseUrl}/glossary`
        },
        "termCode": term.slug,
        "url": pageUrl,
        "dateModified": term.lastUpdated || new Date().toISOString(),
        "author": {
          "@type": "Organization",
          "name": "K Business Academy Editorial Board",
          "url": baseUrl
        },
        "publisher": {
          "@type": "Organization",
          "name": "K Business Academy",
          "url": baseUrl
        },
        "mainEntityOfPage": {
          "@type": "WebPage",
          "@id": pageUrl
        },
        "speakable": {
          "@type": "SpeakableSpecification",
          "cssSelector": ["[data-aeo-summary]", "[data-direct-answer]"]
        }
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${pageUrl}#breadcrumb`,
        "itemListElement": [
          {
            "@type": "ListItem",
            "position": 1,
            "name": "Home",
            "item": baseUrl
          },
          {
            "@type": "ListItem",
            "position": 2,
            "name": "Glossary",
            "item": `${baseUrl}/glossary`
          },
          {
            "@type": "ListItem",
            "position": 3,
            "name": term.category || "General",
            "item": `${baseUrl}/glossary?category=${encodeURIComponent(term.category || 'General')}`
          },
          {
            "@type": "ListItem",
            "position": 4,
            "name": term.term,
            "item": pageUrl
          }
        ]
      }
    ]
  };

  // Build FAQ schema combining standard FAQs and Question Variations
  const allQuestions: { question: string; answer: string }[] = [];
  if (term.faqs && term.faqs.length > 0) {
    allQuestions.push(...term.faqs);
  }
  if (term.questionVariations && term.questionVariations.length > 0) {
    term.questionVariations.forEach(qv => {
      if (qv.question && qv.targetAnswer) {
        allQuestions.push({ question: qv.question, answer: qv.targetAnswer });
      }
    });
  }

  if (allQuestions.length > 0) {
    graphSchema["@graph"].push({
      "@type": "FAQPage",
      "@id": `${pageUrl}#faq`,
      "mainEntity": allQuestions.map(q => ({
        "@type": "Question",
        "name": q.question,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": q.answer
        }
      }))
    });
  }

  // HowTo Schema for Real World Step-by-Step Scenario
  if (term.realWorldScenario?.stepByStep && term.realWorldScenario.stepByStep.length > 0) {
    graphSchema["@graph"].push({
      "@type": "HowTo",
      "@id": `${pageUrl}#howto`,
      "name": `How to Apply ${term.term} in Real-World Business`,
      "description": term.realWorldScenario.context || term.shortDefinition,
      "step": term.realWorldScenario.stepByStep.map((step, idx) => ({
        "@type": "HowToStep",
        "position": idx + 1,
        "text": step
      }))
    });
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(graphSchema, null, 2) }}
    />
  );
}
