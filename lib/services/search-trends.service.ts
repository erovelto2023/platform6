export interface CitySearchTrend {
  rank: number;
  query: string;
  category: "real-estate" | "news" | "weather" | "navigation" | "demographics" | "general";
  googleUrl: string;
}

export async function fetchLiveCitySearchTrends(cityName: string, stateName: string): Promise<CitySearchTrend[]> {
  const baseQuery = `${cityName} ${stateName}`.toLowerCase();
  
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3500);

    const res = await fetch(`https://suggestqueries.google.com/complete/search?client=chrome&q=${encodeURIComponent(baseQuery)}`, {
      signal: controller.signal,
      next: { revalidate: 86400 } // Cache for 24h
    });

    clearTimeout(timeoutId);

    if (res.ok) {
      const data = await res.json();
      // data format: [query, [suggestion1, suggestion2, ...]]
      if (Array.isArray(data) && Array.isArray(data[1]) && data[1].length > 0) {
        const liveQueries: string[] = data[1];
        
        return liveQueries.slice(0, 10).map((q, idx) => {
          const lower = q.toLowerCase();
          let category: CitySearchTrend['category'] = "general";
          if (lower.includes("home") || lower.includes("real estate") || lower.includes("apartment") || lower.includes("rent") || lower.includes("house")) {
            category = "real-estate";
          } else if (lower.includes("news") || lower.includes("police") || lower.includes("crime") || lower.includes("event")) {
            category = "news";
          } else if (lower.includes("weather") || lower.includes("forecast") || lower.includes("temp")) {
            category = "weather";
          } else if (lower.includes("map") || lower.includes("direction") || lower.includes("route") || lower.includes("zip")) {
            category = "navigation";
          } else if (lower.includes("population") || lower.includes("school") || lower.includes("demographic")) {
            category = "demographics";
          }

          return {
            rank: idx + 1,
            query: q,
            category,
            googleUrl: `https://www.google.com/search?q=${encodeURIComponent(q)}`
          };
        });
      }
    }
  } catch (err) {
    console.warn(`[SearchTrends] Live Google fetch fallback for ${cityName}, ${stateName}:`, err);
  }

  // High-value verified fallback search intent template
  const fallbackQueries = [
    `${cityName} ${stateName}`,
    `${cityName} ${stateName} homes for sale`,
    `${cityName} ${stateName} news`,
    `${cityName} ${stateName} directions`,
    `${cityName} ${stateName} weather`,
    `${cityName} ${stateName} zip code`,
    `${cityName} ${stateName} apartments`,
    `${cityName} ${stateName} map`,
    `${cityName} ${stateName} schools`,
    `${cityName} ${stateName} real estate`
  ];

  return fallbackQueries.map((q, idx) => {
    const lower = q.toLowerCase();
    let category: CitySearchTrend['category'] = "general";
    if (lower.includes("home") || lower.includes("real estate") || lower.includes("apartment")) {
      category = "real-estate";
    } else if (lower.includes("news")) {
      category = "news";
    } else if (lower.includes("weather")) {
      category = "weather";
    } else if (lower.includes("map") || lower.includes("direction") || lower.includes("zip")) {
      category = "navigation";
    }

    return {
      rank: idx + 1,
      query: q,
      category,
      googleUrl: `https://www.google.com/search?q=${encodeURIComponent(q)}`
    };
  });
}
