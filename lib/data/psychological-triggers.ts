// ─── Master Taxonomy of Psychological Triggers ──────────────────────────────────────
// Database schema for AI engine - categorized by function for dynamic application
// based on campaign goal, audience awareness level, and platform constraints

export type TriggerCategory =
  | "cognitive_biases"
  | "social_influence"
  | "emotional_motivational"
  | "persuasion_techniques"
  | "behavioral_economics"
  | "neuroscience"
  | "decision_science"
  | "social_psychology"
  | "consumer_psychology"
  | "digital_psychology";

export type TriggerApplication =
  | "headline"
  | "hook"
  | "opening"
  | "body_copy"
  | "call_to_action"
  | "urgency_element"
  | "scarcity_element"
  | "social_proof"
  | "testimonial"
  | "objection_handling"
  | "pricing"
  | "offer_structure"
  | "visual_design"
  | "user_experience"
  | "email_subject"
  | "social_media"
  | "video_script"
  | "landing_page"
  | "email_sequence"
  | "onboarding"
  | "content_marketing"
  | "brand_building"
  | "gamification"
  | "community"
  | "customer_service";

export type AwarenessLevel = "unaware" | "problem_aware" | "solution_aware" | "product_aware" | "most_aware";

export interface PsychologicalTrigger {
  id: string;
  name: string;
  category: TriggerCategory;
  description: string;
  mechanism: string;
  applications: TriggerApplication[];
  awarenessLevels: AwarenessLevel[];
  platformSuitability: string[];
  effectiveness: number; // 1-10 scale
  ethicalConsiderations: string;
  examples: string[];
  relatedTriggers: string[];
  difficulty: "beginner" | "intermediate" | "advanced";
  riskLevel: "low" | "medium" | "high";
}

// ─── Category 1: Cognitive Biases & Heuristics ────────────────────────────────────
export const cognitiveBiases: PsychologicalTrigger[] = [
  {
    id: "anchoring_effect",
    name: "Anchoring Effect",
    category: "cognitive_biases",
    description: "First number/info sets reference point for all subsequent judgments",
    mechanism: "People rely heavily on the first piece of information offered (the 'anchor') when making decisions",
    applications: ["pricing", "headline", "offer_structure", "call_to_action"],
    awarenessLevels: ["unaware", "problem_aware", "solution_aware", "product_aware", "most_aware"],
    platformSuitability: ["landing_page", "email", "social_media", "google_ads"],
    effectiveness: 9,
    ethicalConsiderations: "Generally ethical when used transparently. Avoid deceptive anchoring.",
    examples: [
      "Was $299, now $99",
      "Join 10,000+ marketers",
      "Most popular plan (selected by default)"
    ],
    relatedTriggers: ["contrast_effect", "decoy_effect", "default_effect"],
    difficulty: "beginner",
    riskLevel: "low"
  },
  {
    id: "availability_heuristic",
    name: "Availability Heuristic",
    category: "cognitive_biases",
    description: "People judge likelihood based on how easily examples come to mind",
    mechanism: "Recent or vivid examples are given more weight in probability judgments",
    applications: ["headline", "hook", "social_proof", "testimonial"],
    awarenessLevels: ["unaware", "problem_aware", "solution_aware"],
    platformSuitability: ["social_media", "email", "video_script"],
    effectiveness: 7,
    ethicalConsiderations: "Avoid exploiting fear through exaggerated availability.",
    examples: [
      "Last chance to avoid this common mistake",
      "What 90% of businesses overlook",
      "The #1 reason campaigns fail"
    ],
    relatedTriggers: ["negativity_bias", "recency_bias", "frequency_illusion"],
    difficulty: "intermediate",
    riskLevel: "medium"
  },
  {
    id: "bandwagon_effect",
    name: "Bandwagon Effect",
    category: "cognitive_biases",
    description: "Tendency to do/believe things because many others do",
    mechanism: "Social proof creates pressure to conform to group behavior",
    applications: ["social_proof", "headline", "call_to_action", "testimonial"],
    awarenessLevels: ["unaware", "problem_aware", "solution_aware", "product_aware"],
    platformSuitability: ["social_media", "landing_page", "email"],
    effectiveness: 8,
    ethicalConsiderations: "Ensure social proof is authentic. Avoid fake testimonials.",
    examples: [
      "Join 50,000+ satisfied customers",
      "The #1 choice for marketers",
      "Trending now"
    ],
    relatedTriggers: ["social_proof_principle", "conformity", "herd_behavior"],
    difficulty: "beginner",
    riskLevel: "low"
  },
  {
    id: "confirmation_bias",
    name: "Confirmation Bias",
    category: "cognitive_biases",
    description: "Favoring info that confirms existing beliefs",
    mechanism: "People seek and interpret evidence in ways that support their preexisting beliefs",
    applications: ["headline", "hook", "body_copy", "email_subject"],
    awarenessLevels: ["problem_aware", "solution_aware", "product_aware", "most_aware"],
    platformSuitability: ["email", "social_media", "landing_page"],
    effectiveness: 8,
    ethicalConsiderations: "Avoid reinforcing harmful misconceptions. Use responsibly.",
    examples: [
      "Finally, a solution that actually works",
      "You were right about this",
      "What you've always suspected about marketing"
    ],
    relatedTriggers: ["belief_bias", "motivated_reasoning", "selective_exposure"],
    difficulty: "intermediate",
    riskLevel: "medium"
  },
  {
    id: "loss_aversion",
    name: "Loss Aversion",
    category: "cognitive_biases",
    description: "Losses loom larger than equivalent gains",
    mechanism: "People feel the pain of losing something twice as strongly as the pleasure of gaining it",
    applications: ["headline", "call_to_action", "urgency_element", "pricing"],
    awarenessLevels: ["unaware", "problem_aware", "solution_aware", "product_aware"],
    platformSuitability: ["email", "landing_page", "social_media", "google_ads"],
    effectiveness: 10,
    ethicalConsiderations: "Use genuine loss framing, not manufactured scarcity.",
    examples: [
      "Don't lose another customer to competitors",
      "Last chance to save $200",
      "Protect your marketing investment"
    ],
    relatedTriggers: ["endowment_effect", "sunk_cost_fallacy", "status_quo_bias"],
    difficulty: "beginner",
    riskLevel: "low"
  },
  {
    id: "decoy_effect",
    name: "Decoy Effect",
    category: "cognitive_biases",
    description: "Changing preference between two options when third asymmetric option is added",
    mechanism: "Adding a less attractive option makes the target option appear more valuable",
    applications: ["pricing", "offer_structure"],
    awarenessLevels: ["solution_aware", "product_aware", "most_aware"],
    platformSuitability: ["landing_page", "pricing_page"],
    effectiveness: 9,
    ethicalConsiderations: "Ensure decoy option is genuinely available. Avoid manipulation.",
    examples: [
      "Basic: $9, Pro: $29 (highlighted), Enterprise: $49",
      "Three-tier pricing with middle option emphasized"
    ],
    relatedTriggers: ["anchoring_effect", "contrast_effect", "choice_architecture"],
    difficulty: "intermediate",
    riskLevel: "low"
  },
  {
    id: "default_effect",
    name: "Default Effect",
    category: "cognitive_biases",
    description: "Tendency to choose pre-selected option",
    mechanism: "People are more likely to accept the default option due to inertia and decision fatigue",
    applications: ["user_experience", "pricing", "call_to_action", "offer_structure"],
    awarenessLevels: ["unaware", "problem_aware", "solution_aware"],
    platformSuitability: ["landing_page", "user_experience", "checkout"],
    effectiveness: 8,
    ethicalConsiderations: "Default should be in user's best interest. Avoid dark patterns.",
    examples: [
      "Auto-select annual plan (better value)",
      "Pre-checked opt-in for newsletter",
      "Recommended plan selected by default"
    ],
    relatedTriggers: ["choice_architecture", "status_quo_bias", "endowment_effect"],
    difficulty: "beginner",
    riskLevel: "low"
  },
  {
    id: "framing_effect",
    name: "Framing Effect",
    category: "cognitive_biases",
    description: "Drawing different conclusions from same info based on presentation",
    mechanism: "Positive vs negative framing of identical information leads to different decisions",
    applications: ["headline", "body_copy", "pricing", "call_to_action"],
    awarenessLevels: ["unaware", "problem_aware", "solution_aware", "product_aware", "most_aware"],
    platformSuitability: ["email", "landing_page", "social_media", "google_ads"],
    effectiveness: 9,
    ethicalConsiderations: "Avoid misleading framing. Present information accurately.",
    examples: [
      "90% success rate vs 10% failure rate",
      "Save $100 vs Avoid losing $100",
      "Gain 5 hours vs Waste 5 hours"
    ],
    relatedTriggers: ["loss_aversion", "gain_framing", "loss_framing"],
    difficulty: "beginner",
    riskLevel: "low"
  },
  {
    id: "halo_effect",
    name: "Halo Effect",
    category: "cognitive_biases",
    description: "One positive trait influencing overall perception",
    mechanism: "Positive impression in one area influences opinions in unrelated areas",
    applications: ["testimonial", "social_proof", "headline", "visual_design"],
    awarenessLevels: ["unaware", "problem_aware", "solution_aware"],
    platformSuitability: ["landing_page", "social_media", "email"],
    effectiveness: 7,
    ethicalConsiderations: "Ensure halo effect is based on genuine merits.",
    examples: [
      "Featured in Forbes, TechCrunch, and Wired",
      "Trusted by Fortune 500 companies",
      "Award-winning design"
    ],
    relatedTriggers: ["authority_principle", "social_proof_principle", "brand_association"],
    difficulty: "beginner",
    riskLevel: "low"
  },
  {
    id: "scarcity_principle",
    name: "Scarcity Principle",
    category: "cognitive_biases",
    description: "Valuing limited opportunities",
    mechanism: "Limited availability increases perceived value and urgency",
    applications: ["urgency_element", "scarcity_element", "call_to_action", "headline"],
    awarenessLevels: ["solution_aware", "product_aware", "most_aware"],
    platformSuitability: ["email", "landing_page", "social_media", "google_ads"],
    effectiveness: 9,
    ethicalConsiderations: "Use genuine scarcity. Avoid artificial limitations.",
    examples: [
      "Only 5 spots remaining",
      "Offer ends in 24 hours",
      "Limited edition release"
    ],
    relatedTriggers: ["urgency_element", "fear_of_missing_out", "exclusivity"],
    difficulty: "beginner",
    riskLevel: "medium"
  },
  {
    id: "social_proof_principle",
    name: "Social Proof Principle",
    category: "cognitive_biases",
    description: "Following crowd behavior",
    mechanism: "People look to others' actions to determine appropriate behavior",
    applications: ["social_proof", "testimonial", "headline", "call_to_action"],
    awarenessLevels: ["unaware", "problem_aware", "solution_aware", "product_aware"],
    platformSuitability: ["landing_page", "social_media", "email"],
    effectiveness: 9,
    ethicalConsiderations: "Ensure social proof is authentic and current.",
    examples: [
      "See what our customers are saying",
      "Join 10,000+ happy users",
      "4.9/5 stars from 2,000+ reviews"
    ],
    relatedTriggers: ["bandwagon_effect", "authority_principle", "liking_principle"],
    difficulty: "beginner",
    riskLevel: "low"
  },
  {
    id: "authority_principle",
    name: "Authority Principle",
    category: "cognitive_biases",
    description: "Compliance with perceived experts/figures",
    mechanism: "People defer to perceived authorities and experts",
    applications: ["testimonial", "social_proof", "headline", "body_copy"],
    awarenessLevels: ["unaware", "problem_aware", "solution_aware"],
    platformSuitability: ["landing_page", "email", "social_media"],
    effectiveness: 8,
    ethicalConsiderations: "Use genuine authority. Avoid false endorsements.",
    examples: [
      "Recommended by Dr. Smith",
      "Used by top Fortune 500 companies",
      "Based on research from Harvard"
    ],
    relatedTriggers: ["social_proof_principle", "expertise_bias", "credibility_heuristic"],
    difficulty: "beginner",
    riskLevel: "low"
  },
  {
    id: "reciprocity_principle",
    name: "Reciprocity Principle",
    category: "cognitive_biases",
    description: "Obligation to return favors",
    mechanism: "People feel compelled to return favors and kindness",
    applications: ["headline", "offer_structure", "call_to_action", "email_subject"],
    awarenessLevels: ["unaware", "problem_aware", "solution_aware"],
    platformSuitability: ["email", "landing_page", "social_media"],
    effectiveness: 8,
    ethicalConsiderations: "Provide genuine value before asking for anything.",
    examples: [
      "Free guide: 10 Marketing Secrets",
      "Try before you buy",
      "Free consultation"
    ],
    relatedTriggers: ["commitment_consistency", "liking_principle", "ben_franklin_effect"],
    difficulty: "beginner",
    riskLevel: "low"
  },
  {
    id: "commitment_consistency",
    name: "Commitment & Consistency",
    category: "cognitive_biases",
    description: "Aligning with prior commitments",
    mechanism: "People want to appear consistent with their past actions and commitments",
    applications: ["call_to_action", "user_experience", "email_sequence", "onboarding"],
    awarenessLevels: ["solution_aware", "product_aware", "most_aware"],
    platformSuitability: ["email", "landing_page", "user_experience"],
    effectiveness: 8,
    ethicalConsiderations: "Avoid exploiting sunk costs. Allow easy opt-out.",
    examples: [
      "Start your free trial",
      "Get started in 2 minutes",
      "Complete your profile"
    ],
    relatedTriggers: ["foot_in_the_door", "public_commitment", "self_perception_theory"],
    difficulty: "intermediate",
    riskLevel: "low"
  },
  {
    id: "liking_principle",
    name: "Liking Principle",
    category: "cognitive_biases",
    description: "Compliance with those we like",
    mechanism: "People are more likely to say yes to those they know and like",
    applications: ["headline", "body_copy", "visual_design", "social_media"],
    awarenessLevels: ["unaware", "problem_aware", "solution_aware"],
    platformSuitability: ["social_media", "landing_page", "email"],
    effectiveness: 7,
    ethicalConsiderations: "Build genuine rapport. Avoid manipulation.",
    examples: [
      "From one marketer to another",
      "We understand your challenges",
      "Join our community"
    ],
    relatedTriggers: ["similarity_attraction", "familiarity_principle", "physical_attractiveness"],
    difficulty: "beginner",
    riskLevel: "low"
  },
  {
    id: "unity_principle",
    name: "Unity Principle",
    category: "cognitive_biases",
    description: "Shared identity increases influence",
    mechanism: "People are more influenced by those they perceive as part of their group",
    applications: ["headline", "body_copy", "social_media", "email_subject"],
    awarenessLevels: ["unaware", "problem_aware", "solution_aware"],
    platformSuitability: ["social_media", "email", "landing_page"],
    effectiveness: 7,
    ethicalConsiderations: "Avoid exploiting tribalism. Build inclusive communities.",
    examples: [
      "For marketers, by marketers",
      "Join the movement",
      "We're in this together"
    ],
    relatedTriggers: ["social_identity_theory", "ingroup_favoritism", "shared_identity"],
    difficulty: "intermediate",
    riskLevel: "medium"
  }
];

// ─── Category 2: Social Influence & Persuasion Principles ───────────────────────
export const socialInfluence: PsychologicalTrigger[] = [
  {
    id: "foot_in_the_door",
    name: "Foot-in-the-Door Technique",
    category: "social_influence",
    description: "Small request followed by larger one increases compliance",
    mechanism: "Agreeing to small request creates commitment to larger request",
    applications: ["call_to_action", "user_experience", "email_sequence", "onboarding"],
    awarenessLevels: ["unaware", "problem_aware", "solution_aware"],
    platformSuitability: ["email", "landing_page", "user_experience"],
    effectiveness: 8,
    ethicalConsiderations: "Ensure progression is reasonable. Avoid manipulation.",
    examples: [
      "Sign up for newsletter → Upgrade to premium",
      "Free trial → Paid subscription",
      "Download guide → Attend webinar"
    ],
    relatedTriggers: ["commitment_consistency", "door_in_the_face", "low_ball_technique"],
    difficulty: "beginner",
    riskLevel: "low"
  },
  {
    id: "door_in_the_face",
    name: "Door-in-the-Face Technique",
    category: "social_influence",
    description: "Large request followed by smaller one increases compliance",
    mechanism: "Rejection of large request makes smaller request seem reasonable",
    applications: ["pricing", "offer_structure", "call_to_action"],
    awarenessLevels: ["solution_aware", "product_aware", "most_aware"],
    platformSuitability: ["landing_page", "email", "sales_page"],
    effectiveness: 7,
    ethicalConsiderations: "Initial request should be plausible. Avoid bad faith.",
    examples: [
      "$500 package → $50 package seems reasonable",
      "Enterprise plan → Pro plan comparison",
      "Full consulting → DIY guide"
    ],
    relatedTriggers: ["foot_in_the_door", "contrast_effect", "reciprocity_principle"],
    difficulty: "intermediate",
    riskLevel: "medium"
  },
  {
    id: "fear_of_missing_out",
    name: "Fear of Missing Out (FOMO)",
    category: "social_influence",
    description: "Anxiety about missing rewarding experiences",
    mechanism: "Social comparison creates anxiety about being excluded",
    applications: ["urgency_element", "scarcity_element", "social_media", "headline"],
    awarenessLevels: ["solution_aware", "product_aware", "most_aware"],
    platformSuitability: ["social_media", "email", "landing_page"],
    effectiveness: 8,
    ethicalConsiderations: "Use genuine FOMO. Avoid creating unnecessary anxiety.",
    examples: [
      "Your competitors are already using this",
      "Don't miss out on the trend",
      "Limited time offer"
    ],
    relatedTriggers: ["scarcity_principle", "social_comparison", "social_proof_principle"],
    difficulty: "beginner",
    riskLevel: "medium"
  },
  {
    id: "ingroup_favoritism",
    name: "Ingroup Favoritism",
    category: "social_influence",
    description: "Preferring members of own group",
    mechanism: "People favor those perceived as part of their group",
    applications: ["headline", "body_copy", "social_media", "email_subject"],
    awarenessLevels: ["unaware", "problem_aware", "solution_aware"],
    platformSuitability: ["social_media", "email", "landing_page"],
    effectiveness: 7,
    ethicalConsiderations: "Avoid excluding or alienating potential customers.",
    examples: [
      "For small business owners",
      "Join fellow entrepreneurs",
      "Made for marketers like you"
    ],
    relatedTriggers: ["unity_principle", "social_identity_theory", "outgroup_homogeneity_bias"],
    difficulty: "beginner",
    riskLevel: "medium"
  },
  {
    id: "social_loafing",
    name: "Ringelmann Effect (Social Loafing)",
    category: "social_influence",
    description: "Reduced individual effort in groups",
    mechanism: "People exert less effort when working in groups",
    applications: ["user_experience", "onboarding", "call_to_action"],
    awarenessLevels: ["unaware", "problem_aware", "solution_aware"],
    platformSuitability: ["user_experience", "onboarding", "team_features"],
    effectiveness: 6,
    ethicalConsiderations: "Design to counteract social loafing with individual accountability.",
    examples: [
      "Track individual progress",
      "Personal achievements",
      "Individual recognition"
    ],
    relatedTriggers: ["diffusion_of_responsibility", "bystander_effect", "accountability"],
    difficulty: "intermediate",
    riskLevel: "low"
  },
  {
    id: "self_fulfilling_prophecy",
    name: "Self-Fulfilling Prophecy",
    category: "social_influence",
    description: "Expectations causing predicted outcome",
    mechanism: "Beliefs about outcomes influence behaviors that make them true",
    applications: ["headline", "body_copy", "testimonial", "onboarding"],
    awarenessLevels: ["problem_aware", "solution_aware", "product_aware"],
    platformSuitability: ["landing_page", "email", "onboarding"],
    effectiveness: 7,
    ethicalConsiderations: "Set positive but realistic expectations.",
    examples: [
      "You're closer to success than you think",
      "This will transform your business",
      "Expect results in 30 days"
    ],
    relatedTriggers: ["placebo_effect", "expectation_bias", "optimism_bias"],
    difficulty: "intermediate",
    riskLevel: "low"
  },
  {
    id: "sleeper_effect",
    name: "Sleeper Effect",
    category: "social_influence",
    description: "Persuasive message from low-credibility source gaining impact over time",
    mechanism: "Message content becomes separated from source credibility over time",
    applications: ["email_sequence", "content_marketing", "brand_building"],
    awarenessLevels: ["solution_aware", "product_aware", "most_aware"],
    platformSuitability: ["email", "content", "social_media"],
    effectiveness: 6,
    ethicalConsiderations: "Build genuine credibility over time.",
    examples: [
      "Consistent messaging builds trust",
      "Long-term content strategy",
      "Brand storytelling"
    ],
    relatedTriggers: ["source_forgetting", "message_decay", "credibility_building"],
    difficulty: "advanced",
    riskLevel: "low"
  }
];

// ─── Category 3: Emotional & Motivational Drivers ───────────────────────────────
export const emotionalMotivational: PsychologicalTrigger[] = [
  {
    id: "achievement_motivation",
    name: "Achievement Motivation",
    category: "emotional_motivational",
    description: "Drive to accomplish challenging goals",
    mechanism: "People are motivated by the desire to achieve and master challenges",
    applications: ["headline", "call_to_action", "onboarding", "gamification"],
    awarenessLevels: ["problem_aware", "solution_aware", "product_aware", "most_aware"],
    platformSuitability: ["landing_page", "user_experience", "onboarding"],
    effectiveness: 8,
    ethicalConsiderations: "Set achievable goals. Avoid creating unhealthy competition.",
    examples: [
      "Reach your marketing goals",
      "Achieve 10x growth",
      "Master marketing in 30 days"
    ],
    relatedTriggers: ["competence_need", "self_efficacy", "goal_setting"],
    difficulty: "beginner",
    riskLevel: "low"
  },
  {
    id: "affiliation_need",
    name: "Affiliation Need",
    category: "emotional_motivational",
    description: "Desire for belonging/connection",
    mechanism: "People are motivated by the need to belong and connect with others",
    applications: ["headline", "social_media", "community", "email_subject"],
    awarenessLevels: ["unaware", "problem_aware", "solution_aware"],
    platformSuitability: ["social_media", "community", "email"],
    effectiveness: 8,
    ethicalConsiderations: "Build genuine communities. Avoid exploiting loneliness.",
    examples: [
      "Join our community",
      "Connect with fellow marketers",
      "You're not alone in this"
    ],
    relatedTriggers: ["belongingness", "social_connection", "community_building"],
    difficulty: "beginner",
    riskLevel: "low"
  },
  {
    id: "autonomy_need",
    name: "Autonomy Need",
    category: "emotional_motivational",
    description: "Desire for self-direction/control",
    mechanism: "People are motivated when they feel in control of their choices",
    applications: ["user_experience", "call_to_action", "pricing", "onboarding"],
    awarenessLevels: ["solution_aware", "product_aware", "most_aware"],
    platformSuitability: ["user_experience", "landing_page", "onboarding"],
    effectiveness: 8,
    ethicalConsiderations: "Provide genuine choice. Avoid illusion of control.",
    examples: [
      "Choose your plan",
      "Customize your experience",
      "You're in control"
    ],
    relatedTriggers: ["self_determination_theory", "agency", "choice_architecture"],
    difficulty: "beginner",
    riskLevel: "low"
  },
  {
    id: "curiosity_drive",
    name: "Curiosity Drive",
    category: "emotional_motivational",
    description: "Intrinsic motivation to seek knowledge",
    mechanism: "People are naturally curious and seek information gaps",
    applications: ["headline", "hook", "email_subject", "social_media"],
    awarenessLevels: ["unaware", "problem_aware", "solution_aware"],
    platformSuitability: ["email", "social_media", "headline"],
    effectiveness: 9,
    ethicalConsiderations: "Deliver on curiosity promises. Avoid clickbait.",
    examples: [
      "The secret to marketing success",
      "What nobody tells you about...",
      "Discover the hidden strategy"
    ],
    relatedTriggers: ["information_gap", "mystery", "novelty_seeking"],
    difficulty: "beginner",
    riskLevel: "low"
  },
  {
    id: "nostalgia_marketing",
    name: "Nostalgia Marketing",
    category: "emotional_motivational",
    description: "Leveraging sentimental longing for past",
    mechanism: "Nostalgia creates positive emotional connections and social bonding",
    applications: ["headline", "visual_design", "body_copy", "social_media"],
    awarenessLevels: ["unaware", "problem_aware", "solution_aware"],
    platformSuitability: ["social_media", "landing_page", "email"],
    effectiveness: 7,
    ethicalConsiderations: "Use authentic nostalgia. Avoid exploitation of sensitive memories.",
    examples: [
      "Remember when marketing was simple?",
      "Back to basics",
      "The golden age of advertising"
    ],
    relatedTriggers: ["emotional_connection", "sentimental_value", "retro_appeal"],
    difficulty: "intermediate",
    riskLevel: "low"
  },
  {
    id: "envy_marketing",
    name: "Envy Marketing",
    category: "emotional_motivational",
    description: "Aspirational desire triggered by others' success",
    mechanism: "Seeing others succeed creates desire to achieve similar outcomes",
    applications: ["headline", "social_proof", "testimonial", "social_media"],
    awarenessLevels: ["problem_aware", "solution_aware", "product_aware"],
    platformSuitability: ["social_media", "landing_page", "email"],
    effectiveness: 7,
    ethicalConsiderations: "Use aspirational envy, not destructive envy. Avoid comparison traps.",
    examples: [
      "See how top marketers succeed",
      "Join the elite",
      "What successful marketers know"
    ],
    relatedTriggers: ["social_comparison", "aspirational_marketing", "status_seeking"],
    difficulty: "intermediate",
    riskLevel: "medium"
  },
  {
    id: "surprise_element",
    name: "Surprise Element",
    category: "emotional_motivational",
    description: "Unexpectedness capturing attention/memory",
    mechanism: "Surprise increases attention, memory, and emotional impact",
    applications: ["headline", "hook", "visual_design", "user_experience"],
    awarenessLevels: ["unaware", "problem_aware", "solution_aware"],
    platformSuitability: ["social_media", "email", "landing_page"],
    effectiveness: 8,
    ethicalConsiderations: "Surprise should be positive. Avoid shock tactics.",
    examples: [
      "You won't believe this...",
      "The unexpected truth about...",
      "What happens next will surprise you"
    ],
    relatedTriggers: ["novelty", "pattern_interrupt", "attention_grabbing"],
    difficulty: "beginner",
    riskLevel: "low"
  },
  {
    id: "gratitude_amplification",
    name: "Gratitude Amplification",
    category: "emotional_motivational",
    description: "Thankfulness increasing well-being/generosity",
    mechanism: "Feeling grateful increases prosocial behavior and generosity",
    applications: ["email_subject", "body_copy", "customer_service", "community"],
    awarenessLevels: ["product_aware", "most_aware"],
    platformSuitability: ["email", "customer_service", "community"],
    effectiveness: 7,
    ethicalConsiderations: "Express genuine gratitude. Avoid manipulation.",
    examples: [
      "Thank you for being part of our journey",
      "We appreciate your trust",
      "Grateful for customers like you"
    ],
    relatedTriggers: ["reciprocity_principle", "positive_emotion", "relationship_building"],
    difficulty: "beginner",
    riskLevel: "low"
  },
  {
    id: "inspiration_activation",
    name: "Inspiration Activation",
    category: "emotional_motivational",
    description: "Uplifted state motivating action",
    mechanism: "Inspiration creates motivation and energy for action",
    applications: ["headline", "body_copy", "video_script", "social_media"],
    awarenessLevels: ["problem_aware", "solution_aware", "product_aware"],
    platformSuitability: ["social_media", "landing_page", "video_script"],
    effectiveness: 8,
    ethicalConsiderations: "Provide actionable inspiration. Avoid empty motivation.",
    examples: [
      "Transform your marketing today",
      "Your breakthrough starts here",
      "Inspiring marketing success stories"
    ],
    relatedTriggers: ["motivation", "empowerment", "hope_theory"],
    difficulty: "beginner",
    riskLevel: "low"
  }
];

// ─── Helper Functions ─────────────────────────────────────────────────────────────

export function getTriggersByCategory(category: TriggerCategory): PsychologicalTrigger[] {
  const allTriggers = [...cognitiveBiases, ...socialInfluence, ...emotionalMotivational];
  return allTriggers.filter(trigger => trigger.category === category);
}

export function getTriggersByApplication(application: TriggerApplication): PsychologicalTrigger[] {
  const allTriggers = [...cognitiveBiases, ...socialInfluence, ...emotionalMotivational];
  return allTriggers.filter(trigger => trigger.applications.includes(application));
}

export function getTriggersByAwareness(awareness: AwarenessLevel): PsychologicalTrigger[] {
  const allTriggers = [...cognitiveBiases, ...socialInfluence, ...emotionalMotivational];
  return allTriggers.filter(trigger => trigger.awarenessLevels.includes(awareness));
}

export function getTriggersByPlatform(platform: string): PsychologicalTrigger[] {
  const allTriggers = [...cognitiveBiases, ...socialInfluence, ...emotionalMotivational];
  return allTriggers.filter(trigger => 
    trigger.platformSuitability.includes(platform) || 
    trigger.platformSuitability.includes("all")
  );
}

export function getTriggersByDifficulty(difficulty: PsychologicalTrigger["difficulty"]): PsychologicalTrigger[] {
  const allTriggers = [...cognitiveBiases, ...socialInfluence, ...emotionalMotivational];
  return allTriggers.filter(trigger => trigger.difficulty === difficulty);
}

export function getTriggersByEffectiveness(minEffectiveness: number): PsychologicalTrigger[] {
  const allTriggers = [...cognitiveBiases, ...socialInfluence, ...emotionalMotivational];
  return allTriggers.filter(trigger => trigger.effectiveness >= minEffectiveness);
}

export function getTriggerById(id: string): PsychologicalTrigger | undefined {
  const allTriggers = [...cognitiveBiases, ...socialInfluence, ...emotionalMotivational];
  return allTriggers.find(trigger => trigger.id === id);
}

export function searchTriggers(query: string): PsychologicalTrigger[] {
  const allTriggers = [...cognitiveBiases, ...socialInfluence, ...emotionalMotivational];
  const lowerQuery = query.toLowerCase();
  return allTriggers.filter(trigger =>
    trigger.name.toLowerCase().includes(lowerQuery) ||
    trigger.description.toLowerCase().includes(lowerQuery) ||
    trigger.mechanism.toLowerCase().includes(lowerQuery) ||
    trigger.examples.some(example => example.toLowerCase().includes(lowerQuery))
  );
}

export function getRecommendedTriggers(
  application: TriggerApplication,
  awareness: AwarenessLevel,
  platform: string,
  maxResults: number = 5
): PsychologicalTrigger[] {
  let triggers = getTriggersByApplication(application);
  triggers = triggers.filter(trigger => trigger.awarenessLevels.includes(awareness));
  triggers = triggers.filter(trigger => 
    trigger.platformSuitability.includes(platform) || 
    trigger.platformSuitability.includes("all")
  );
  
  // Sort by effectiveness and return top results
  return triggers
    .sort((a, b) => b.effectiveness - a.effectiveness)
    .slice(0, maxResults);
}

export function getAllTriggers(): PsychologicalTrigger[] {
  return [...cognitiveBiases, ...socialInfluence, ...emotionalMotivational];
}

export function getTriggerCategories(): TriggerCategory[] {
  return [
    "cognitive_biases",
    "social_influence", 
    "emotional_motivational",
    "persuasion_techniques",
    "behavioral_economics",
    "neuroscience",
    "decision_science",
    "social_psychology",
    "consumer_psychology",
    "digital_psychology"
  ];
}

export function getTriggerApplications(): TriggerApplication[] {
  return [
    "headline",
    "hook",
    "opening",
    "body_copy",
    "call_to_action",
    "urgency_element",
    "scarcity_element",
    "social_proof",
    "testimonial",
    "objection_handling",
    "pricing",
    "offer_structure",
    "visual_design",
    "user_experience",
    "email_subject",
    "social_media",
    "video_script",
    "landing_page",
    "email_sequence",
    "onboarding",
    "content_marketing",
    "brand_building",
    "gamification",
    "community",
    "customer_service"
  ];
}
