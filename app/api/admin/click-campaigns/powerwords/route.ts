import { NextResponse } from "next/server";

export interface PowerWordSeed {
  word: string;
  category: string;
  subcategory?: string;
  pressureLevel: "low" | "medium" | "high";
  psychology: string;
  appUseCase: string;
  examples: string[];
  isActive: boolean;
}

const URGENCY_SCARCITY_WORDS = [
  "Deadline", "Expires", "Final Call", "Immediate", "Instantly", "Last Chance", "Limited", "Now", "Running Out", "Today",
  "Urgent", "Countdown", "Hurry", "Don't Miss", "One-Time", "Ending Soon", "Flash Sale", "Final Hours", "Strictly Limited", "Only X Left",
  "Fast-Track", "Act Fast", "Closing Soon", "Never Again", "Once In A Lifetime", "Before It's Gone", "Overnight", "Instant Access", "Speedy", "Express",
  "Quick", "Rapid", "Short-Term", "Time-Sensitive", "Door-Buster", "Last Day", "Final Notice", "Clock Is Ticking", "Unrepeatable", "Zero Hour",
  "Blink And You'll Miss It", "Limited Stock", "Scarce", "Rare", "Exclusive Access", "Vault Closing", "Spot Reserved", "Seats Limited", "Cap Met", "Almost Gone",
  "Final Batch", "First Come First Served", "Priority", "Immediate Delivery", "Right Now", "Directly", "Promptly", "Swiftly", "Expedited", "Accelerated",
  "Breakneck", "Blitz", "Snap", "Tick-Tock", "Deadline Approaching", "Last Call", "Window Closing", "Today Only"
];

const CURIOSITY_MYSTERY_WORDS = [
  "Secret", "Hidden", "Banned", "Unlocking", "Confidential", "Forbidden", "Uncovered", "Shocking", "Strange", "Unusual",
  "Mysterious", "Private", "Behind-The-Scenes", "Revealed", "Untold", "Underground", "Covert", "Stealth", "Whispered", "Illicit",
  "Classified", "Discovered", "Exposed", "Unveiled", "Disclosed", "Leaked", "Eye-Opening", "Mind-Blowing", "Unbelievable", "Surprising",
  "Astonishing", "Bizarre", "Unconventional", "Counter-Intuitive", "Unexpected", "Crazy", "Wild", "Puzzling", "Enigmatic", "Cryptic",
  "Unknown", "Little-Known", "Sneaky", "Taboo", "Off-Limits", "Unspoken", "Masked", "Veiled", "Silenced", "Suppressed",
  "Censored", "Under-The-Radar", "Dark-Horse", "Backdoor", "Insider", "Privileged", "Smuggled", "Unadvertised", "Unpublished"
];

const EASE_SPEED_WORDS = [
  "Easy", "Simple", "Effortless", "Fast", "Quick", "Instant", "Automated", "Turnkey", "Plug-And-Play", "Copy-Paste",
  "Done-For-You", "1-Click", "Step-By-Step", "No-Brainer", "Child's Play", "Seamless", "Smooth", "Pain-Free", "Hassle-Free", "Stress-Free",
  "Foolproof", "Beginner-Friendly", "Ready-To-Use", "Shortcut", "Cheat-Sheet", "Blueprint", "Template", "Formula", "Recipe", "Hack",
  "Trick", "System", "Framework", "Engine", "Machine", "Push-Button", "Hands-Free", "Streamlined", "Simplified", "Direct",
  "Straightforward", "Uncomplicated", "Painless", "Rapid-Fire", "Instantaneous", "Overnight", "Lightning", "Express", "Fast-Lane", "Turbo",
  "Supercharged", "Accelerated", "Fast-Track", "Auto-Pilot", "Self-Running", "Magic-Bullet", "Pre-Built", "Pre-Formatted", "Pre-Made", "Drop-In",
  "Zero-Setup", "Frictionless", "Intuitive", "Clear-Cut", "Plain-English", "Walkthrough", "Guide"
];

const TRUST_AUTHORITY_WORDS = [
  "Proven", "Guaranteed", "Scientific", "Verified", "Certified", "Official", "Authorized", "Backed", "Tested", "Endorsed",
  "Authentic", "Genuine", "Legitimate", "Ironclad", "Rock-Solid", "Bulletproof", "Factual", "Documented", "Validated", "Research-Backed",
  "Expert", "Master", "Authority", "Professional", "Specialist", "Leading", "Premier", "Top-Rated", "Award-Winning", "Recognized",
  "Established", "Time-Tested", "Fail-Safe", "Risk-Free", "Protected", "Secure", "Safe", "Reliable", "Dependable", "Trusted",
  "Honest", "Transparent", "Unbiased", "Objective", "Accurate", "Precise", "Exact", "Unbreakable", "Guaranteed-ROI", "Money-Back",
  "No-Risk", "100% Guaranteed", "Zero-Risk", "Peace-Of-Mind", "Standard", "Benchmark", "Gold-Standard", "Industry-Leading", "World-Class", "Unmatched", "Unbeatable"
];

const EXCLUSIVITY_BELONGING_WORDS = [
  "Elite", "Vip", "Insider", "Members-Only", "Private", "Secret-Society", "Inner-Circle", "Select", "Hand-Picked", "Chosen",
  "Exclusive", "Privileged", "Invitation-Only", "Restricted", "Special", "Custom", "Bespoke", "Tailored", "Personalized", "Tribe",
  "Community", "Family", "Brotherhood", "Sisterhood", "Network", "Club", "Alliance", "Mastermind", "Fellowship", "Circle",
  "Collective", "Guild", "Society", "League", "Union", "Pioneers", "Visionaries", "Leaders", "Founders", "Insiders-Club",
  "VIP-Access", "Pass", "Key", "Gatekeeper", "Top-Tier", "High-Society", "Prestigious", "Reputable", "Distinguished", "Renowned", "Acclaimed", "First-Class"
];

const VALUE_GAIN_WORDS = [
  "Profitable", "Lucrative", "Massive", "Huge", "Unstoppable", "Skyrocket", "Explode", "Dominate", "Conquer", "Multiply",
  "Double", "Triple", "Quadruple", "Surge", "Boost", "Maximize", "Amplify", "Expand", "Scale", "Grow",
  "Abundant", "Rich", "Wealthy", "Prosperous", "Bounty", "Jackpot", "Windfall", "Bonanza", "Goldmine", "Treasure",
  "Valuable", "Priceless", "Premium", "Bonus", "Free", "Gift", "Reward", "Dividend", "Return", "ROI",
  "Profit-Margin", "Cash-Flow", "Revenue", "Income", "Passive-Income", "Freedom", "Liberty", "Empowered", "Victorious", "Triumphant",
  "Successful", "Thriving", "Flourishing", "Superior", "Unbeatable", "Ultimate"
];

const FEAR_PAIN_WORDS = [
  "Warning", "Danger", "Risk", "Mistake", "Failure", "Trapped", "Stuck", "Frustrated", "Overwhelmed", "Exhausted",
  "Bleeding", "Losing", "Waste", "Costly", "Deadly", "Fatal", "Catastrophic", "Devastating", "Disastrous", "Tragic",
  "Painful", "Agonizing", "Cruel", "Brutal", "Harsh", "Scam", "Trap", "Pitfall", "Hazard", "Threat",
  "Vulnerable", "Exposed", "Helpless", "Hopeless", "Desperate", "Terrifying", "Scary", "Shocking", "Horrifying", "Nightmare",
  "Crisis", "Emergency", "Panic", "Alarming", "Troubling", "Worrying", "Stressful", "Burden", "Heavy", "Crushing",
  "Suffocating", "Paralyzed", "Defeated", "Ruined", "Broke", "Bankrupt", "Failing", "Sinking", "Drowning", "Blindside",
  "Sabotage", "Backfire", "Bury"
];

// NEW 5 TRIGGER CATEGORIES
const FRESH_RELEASE_WORDS = [
  "New", "Latest", "Just Released", "Fresh", "Brand-New", "Newly Updated", "Now Available",
  "Hot Off the Press", "Premiere", "Debut", "Launch", "Unveiled", "Introduced", "Arrived"
];

const BREAKTHROUGH_DISCOVERY_WORDS = [
  "Breakthrough", "Discovery", "Revelation", "Uncovered", "Found", "Pioneering", "Groundbreaking",
  "Revolutionary", "Game-Changer", "Paradigm Shift", "Leap", "Advancement", "Innovation", "Invention"
];

const MODERN_FUTURE_WORDS = [
  "Modern", "Next-Gen", "Next Generation", "Future-Proof", "Cutting-Edge", "State-of-the-Art",
  "Advanced", "Evolved", "Upgraded", "Refined", "Enhanced", "Improved", "Superior", "Ahead of the Curve", "Trending"
];

const UNIQUE_DIFFERENT_WORDS = [
  "Unique", "One-of-a-Kind", "Unlike Any Other", "Distinct", "Original", "Exclusive Method",
  "Proprietary", "Signature", "Custom", "Bespoke", "Rare", "Unmatched", "Singular", "First-Ever"
];

const REINVENTION_WORDS = [
  "Reinvented", "Reimagined", "Redesigned", "Transformed", "Overhauled", "Revamped", "Refreshed",
  "Renewed", "Restored", "Revived", "New Approach", "New Way", "New Standard", "New Era"
];

function generateDataset() {
  const dataset: any[] = [];

  const addCategoryWords = (
    words: string[],
    category: string,
    defaultPressure: "low" | "medium" | "high",
    customPsychology?: string
  ) => {
    words.forEach((w, idx) => {
      dataset.push({
        _id: `pw_${category}_${idx + 1}`,
        word: w,
        category,
        subcategory: "general",
        pressureLevel: defaultPressure,
        synonyms: [w.toLowerCase(), `${w.toLowerCase()} offer`],
        examples: [`Get ${w} Access Now!`, `The ${w} Strategy for Marketers`],
        psychology: customPsychology || `Triggers strong psychological motivation via ${category.replace("_", " ")}.`,
        appUseCase: `Use in primary headlines, CTA buttons, and high-impact email subject lines.`,
        isActive: true,
      });
    });
  };

  addCategoryWords(URGENCY_SCARCITY_WORDS, "urgency_scarcity", "high");
  addCategoryWords(CURIOSITY_MYSTERY_WORDS, "curiosity_mystery", "medium");
  addCategoryWords(EASE_SPEED_WORDS, "ease_speed", "low");
  addCategoryWords(TRUST_AUTHORITY_WORDS, "trust_authority", "low");
  addCategoryWords(EXCLUSIVITY_BELONGING_WORDS, "exclusivity_belonging", "medium");
  addCategoryWords(VALUE_GAIN_WORDS, "value_gain", "medium");
  addCategoryWords(FEAR_PAIN_WORDS, "fear_pain", "high");

  // ADD THE 5 NEW CATEGORIES
  addCategoryWords(FRESH_RELEASE_WORDS, "fresh_release", "medium", "Signals immediate availability and timeliness: 'This just happened, and you are among the first to know.'");
  addCategoryWords(BREAKTHROUGH_DISCOVERY_WORDS, "breakthrough_discovery", "high", "Implies a significant leap forward, suggesting that previous methods are now obsolete.");
  addCategoryWords(MODERN_FUTURE_WORDS, "modern_future", "low", "Positions the product as the smart, forward-thinking choice for early adopters.");
  addCategoryWords(UNIQUE_DIFFERENT_WORDS, "unique_different", "medium", "Separates the offer from competitors: 'Why should I care if I've seen this before?'");
  addCategoryWords(REINVENTION_WORDS, "reinvention", "high", "Acknowledges past failures or old ways and promises a fresh start.");

  return dataset;
}

const FULL_DATASET = generateDataset();

export async function GET() {
  return NextResponse.json({
    success: true,
    data: FULL_DATASET,
    total: FULL_DATASET.length,
  });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const newWordItem = {
      _id: `pw_custom_${Date.now()}`,
      ...body,
      isActive: true,
    };
    FULL_DATASET.unshift(newWordItem);
    return NextResponse.json({ success: true, data: newWordItem });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
