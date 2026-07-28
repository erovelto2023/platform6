export interface StateNewspaper {
  name: string;
  url: string;
  description: string;
  type: string; // e.g. "Statewide Daily", "Regional Journal", "Community Press"
  city?: string;
  rssUrl?: string;
}

export const STATE_NEWSPAPERS_MAP: Record<string, StateNewspaper[]> = {
  delaware: [
    {
      name: "The News Journal / Delaware Online",
      url: "https://www.delawareonline.com",
      description: "Delaware's primary statewide daily newspaper covering Wilmington, Dover, and Sussex County.",
      type: "Statewide Daily",
      city: "Wilmington"
    },
    {
      name: "Delaware State News (Bay to Bay News)",
      url: "https://baytobaynews.com/delaware",
      description: "Leading daily news publication serving Kent and Sussex counties with state government coverage.",
      type: "Statewide Daily",
      city: "Dover"
    },
    {
      name: "Cape Gazette",
      url: "https://www.capegazette.com",
      description: "Independent community newspaper serving Lewes, Rehoboth Beach, and coastal Sussex County.",
      type: "Regional Community Press",
      city: "Lewes"
    },
    {
      name: "Middletown Transcript",
      url: "https://www.middletowntranscript.com",
      description: "Local news, politics, and business reporting for Middletown, Odessa, and Townsend.",
      type: "Community Press",
      city: "Middletown"
    },
    {
      name: "Dover Post",
      url: "https://www.doverpost.com",
      description: "Community newspaper covering Dover and central Kent County local government & events.",
      type: "Community Press",
      city: "Dover"
    },
    {
      name: "Milford Chronicle",
      url: "https://baytobaynews.com/milford",
      description: "Local news journal for Milford and southern Kent / northern Sussex counties.",
      type: "Community Press",
      city: "Milford"
    }
  ]
};

export function getStateNewspapers(stateSlugOrName: string): StateNewspaper[] {
  const normalized = (stateSlugOrName || '').toLowerCase().replace(/[^a-z]/g, '');
  if (STATE_NEWSPAPERS_MAP[normalized]) {
    return STATE_NEWSPAPERS_MAP[normalized];
  }

  const nameClean = stateSlugOrName ? stateSlugOrName.charAt(0).toUpperCase() + stateSlugOrName.slice(1) : "State";
  return [
    {
      name: `The ${nameClean} State Journal`,
      url: `https://google.com/search?q=${encodeURIComponent(nameClean + " State Journal news")}`,
      description: `Primary statewide news coverage for ${nameClean}.`,
      type: "Statewide Daily"
    },
    {
      name: `${nameClean} Herald Tribune`,
      url: `https://google.com/search?q=${encodeURIComponent(nameClean + " Herald Tribune news")}`,
      description: `Regional daily reporting and community news in ${nameClean}.`,
      type: "Regional Daily"
    },
    {
      name: `${nameClean} Business Gazette`,
      url: `https://google.com/search?q=${encodeURIComponent(nameClean + " Business Gazette")}`,
      description: `Market intelligence, commerce, and business news across ${nameClean}.`,
      type: "Business Press"
    }
  ];
}
