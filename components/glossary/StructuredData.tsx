interface GlossaryTermStructuredDataProps {
  term: {
    term: string;
    slug: string;
    definition: string;
    shortDefinition: string;
    category?: string;
    contentLevel?: string;
    keywords?: string[];
    lastUpdated?: Date | string;
    imageUrl?: string;
  };
  baseUrl: string;
}

export default function GlossaryTermStructuredData({ term, baseUrl }: GlossaryTermStructuredDataProps) {
  const structuredData: any = {
    "@context": "https://schema.org",
    "@type": ["DefinedTerm", "Article"],
    "name": term.term,
    "description": term.shortDefinition,
    "definition": term.definition,
    "inDefinedTermSet": {
      "@type": "DefinedTermSet",
      "name": "Internet Marketing & Online Business Glossary",
      "url": `${baseUrl}/glossary`
    },
    "termCode": term.slug,
    "url": `${baseUrl}/glossary/${term.slug}`,
    "dateModified": term.lastUpdated || new Date().toISOString(),
    "author": {
      "@type": "Organization",
      "name": "KB Academy"
    },
    "publisher": {
      "@type": "Organization",
      "name": "KB Academy",
      "url": baseUrl
    },
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `${baseUrl}/glossary/${term.slug}`
    }
  };

  // Add category if present
  if (term.category) {
    structuredData.about = {
      "@type": "Thing",
      "name": term.category
    };
  }

  // Add difficulty level if present
  if (term.contentLevel) {
    structuredData.educationalLevel = term.contentLevel;
    structuredData.audience = {
      "@type": "EducationalAudience",
      "educationalRole": term.contentLevel.toLowerCase()
    };
  }

  // Add keywords if present
  if (term.keywords && term.keywords.length > 0) {
    structuredData.keywords = term.keywords.join(", ");
  }

  // Add image if present
  if (term.imageUrl) {
    structuredData.image = term.imageUrl;
  }

  // Add breadcrumb data
  const breadcrumbData = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
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
        "item": `${baseUrl}/glossary/${term.slug}`
      }
    ]
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData, null, 2) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbData, null, 2) }}
      />
    </>
  );
}
