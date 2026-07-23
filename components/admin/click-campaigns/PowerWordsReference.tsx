"use client";

import React, { useState, useEffect } from "react";
import {
  BookOpen, Copy, Check, Plus, X, Search, Filter, Zap,
  Lightbulb, Clock, Target, Shield, Users, TrendingUp,
  AlertTriangle, ChevronDown, ChevronUp, RefreshCw, Layers,
  Sparkles, FileText, Hash, DollarSign, Edit3, Heart, ThumbsDown
} from "lucide-react";

export interface PowerWord {
  _id?: string;
  word: string;
  category: string;
  subcategory?: string;
  pressureLevel?: "low" | "medium" | "high";
  synonyms?: string[];
  examples?: string[];
  psychology: string;
  appUseCase: string;
  isActive: boolean;
}

const CATEGORIES = [
  { value: "urgency_scarcity", label: "Urgency & Scarcity", icon: Clock, color: "red", description: "The 'Now' Trigger - FOMO" },
  { value: "curiosity_mystery", label: "Curiosity & Mystery", icon: Lightbulb, color: "purple", description: "The 'Gap' Trigger" },
  { value: "ease_speed", label: "Ease & Speed", icon: Zap, color: "blue", description: "The 'Friction Remover'" },
  { value: "trust_authority", label: "Trust & Authority", icon: Shield, color: "emerald", description: "The 'Safety' Trigger" },
  { value: "exclusivity_belonging", label: "Exclusivity & Belonging", icon: Users, color: "amber", description: "The 'Tribe' Trigger" },
  { value: "value_gain", label: "Value & Gain", icon: TrendingUp, color: "green", description: "The 'Greed/Benefit' Trigger" },
  { value: "fear_pain", label: "Fear & Pain", icon: AlertTriangle, color: "orange", description: "The 'Problem Agitation' Trigger" },
];

const PRESSURE_LEVELS = [
  { value: "all", label: "All Pressure Levels", color: "slate" },
  { value: "low", label: "Low Pressure (Nurture)", color: "blue", description: "Gentle urgency for brand-building" },
  { value: "medium", label: "Medium Pressure (Announcement)", color: "amber", description: "Balanced urgency for announcements" },
  { value: "high", label: "High Pressure (Closing)", color: "red", description: "Strong urgency for final calls" },
];

const SUBCATEGORIES = {
  urgency_scarcity: [
    { value: "time_based", label: "Time-Based (The Clock)", description: "Time is running out" },
    { value: "deadline_driven", label: "Deadline-Driven", description: "Specific end point" },
    { value: "speed_efficiency", label: "Speed/Efficiency", description: "Fast results" },
    { value: "quantity_based", label: "Quantity-Based (The Vault)", description: "Supply is limited" },
    { value: "exclusivity", label: "Exclusivity", description: "Special status" },
    { value: "action_oriented", label: "Action-Oriented (The Push)", description: "Direct commands" },
    { value: "soft_urgency", label: "Soft Urgency", description: "Brand-building" },
  ],
  curiosity_mystery: [
    { value: "secret_hidden", label: "Secret/Hidden", description: "Insider information" },
    { value: "contrarian", label: "Unexpected/Contrarian", description: "Challenges beliefs" },
    { value: "question_gap", label: "Question/Gap", description: "Information gaps" },
    { value: "story_narrative", label: "Story/Narrative", description: "Personal journeys" },
    { value: "specificity", label: "Specificity (Oddball Effect)", description: "Specific details" },
  ],
  ease_speed: [
    { value: "simplicity", label: "Simplicity (Low Effort)", description: "Removes fear of difficulty" },
    { value: "speed", label: "Speed (Fast Results)", description: "Instant gratification" },
    { value: "system_structure", label: "System/Structure (Guided Path)", description: "Pre-built path" },
    { value: "automation", label: "Automation/Assistance (Done For You)", description: "Heavy lifting done" },
    { value: "beginner_friendly", label: "Beginner-Friendly (Safety)", description: "No fear of mistakes" },
  ],
  trust_authority: [
    { value: "proof_evidence", label: "Proof & Evidence", description: "Opinion to fact" },
    { value: "guarantee_safety", label: "Guarantee & Safety", description: "Risk reduction" },
    { value: "expertise_credibility", label: "Expertise & Credibility", description: "Established status" },
    { value: "social_proof", label: "Social Proof & Community", description: "Others are doing it" },
    { value: "transparency", label: "Transparency & Authenticity", description: "Real connection" },
  ],
  exclusivity_belonging: [
    { value: "inner_circle", label: "Inner Circle (Status)", description: "Special and chosen" },
    { value: "tribe_community", label: "Tribe & Community (Connection)", description: "Like-minded people" },
    { value: "shared_identity", label: "Shared Identity (Empathy)", description: "They get me" },
    { value: "access_privilege", label: "Access & Privilege (Value)", description: "Gate and key" },
  ],
  value_gain: [
    { value: "financial_monetary", label: "Financial & Monetary", description: "Wealth and ROI" },
    { value: "growth_improvement", label: "Growth & Improvement", description: "Self-betterment" },
    { value: "discovery_access", label: "Discovery & Access", description: "Unlock opportunities" },
    { value: "abundance_volume", label: "Abundance & Volume", description: "More is better" },
  ],
  fear_pain: [
    { value: "loss_waste", label: "Loss & Waste", description: "What's slipping away" },
    { value: "emotional_distress", label: "Emotional Distress", description: "Internal feeling" },
    { value: "danger_warning", label: "Danger & Warning", description: "Survival instinct" },
    { value: "failure_mistake", label: "Failure & Mistake", description: "Fear of incompetence" },
    { value: "obstacle_barrier", label: "Obstacle & Barrier", description: "Friction preventing success" },
  ],
};

const CATEGORY_COLORS = {
  red: { bg: "bg-red-950", border: "border-red-800", text: "text-red-400" },
  purple: { bg: "bg-purple-950", border: "border-purple-800", text: "text-purple-400" },
  blue: { bg: "bg-blue-950", border: "border-blue-800", text: "text-blue-400" },
  emerald: { bg: "bg-emerald-950", border: "border-emerald-800", text: "text-emerald-400" },
  amber: { bg: "bg-amber-950", border: "border-amber-800", text: "text-amber-400" },
  green: { bg: "bg-green-950", border: "border-green-800", text: "text-green-400" },
  orange: { bg: "bg-orange-950", border: "border-orange-800", text: "text-orange-400" },
};

// INITIAL HYPNOTIC WORDS DICTIONARY (#, $, A, B, C, D, E, F, G, H, I, J INITIALIZED)
const INITIAL_HYPNOTIC_DICTIONARY: Record<string, string[]> = {
  "#": [
    "(no) affiliate sales will pay for it", "(no) cents", "(no) characteristics of", "(no) customers in",
    "(no) day(s)", "(no) day free trial", "(no) day trial pass", "(no) days free access", "(no) different",
    "(no) different ways", "(no) easy payments of", "(no) elements you can", "(no) examples", "(no) feet",
    "(no) figure income", "(no) foot", "(no) free bonuses worth $", "(no) freebies valued at $", "(no) friends of mine",
    "(no) full years of", "(no) gallon", "(no) grams", "(no) helpful links", "(no) hits in less than",
    "(no) hour(s)", "(no) hot reasons", "(no) information packed pages", "(no) information rich chapters",
    "(no) items you", "(no) karat", "(no) key principles you", "(no) key questions", "(no) kinds of",
    "(no) knowledge packed lessons", "(no) leads in", "(no) week(s)", "(no) lesson course", "(no) mistakes that",
    "(no) months ago", "(no) out of every (no)", "(no) piece", "(no) piece collection", "(no) places to",
    "(no) pounds", "(no) proven strategies", "(no) quart", "(no) quarters", "(no) resources", "(no) rules you must",
    "(no) sales in", "(no) month(s)", "(no) sales will pay for it", "(no) sections on", "(no) simple formulas",
    "(no) step system", "(no) strong", "(no) subscribers", "(no) things to consider", "(no) tips and tricks",
    "(no) types of", "(no) ways to", "(no) ways to use our product", "(no) year subscription", "(no) years ago",
    "(no) years in the making", "(no) years later in (year)", "(no)% commission", "(no)inches", "(no)piece",
    "(product name) includes", "(product) contains", "(source) felt", "(source) has/have proven",
    "(source) heard", "(source) said it look like", "(source) saw", "(source) says", "(source) says it sounds",
    "(source) stated", "(source) studies show", "(source) surveys show", "(source) tests show", "(source) thinks",
    "(source) told me", "100% of every sale", "100% original information", "100% pure traffic",
    "100% royalty free resell rights", "2 tier", "24 hours a day, 7 days a week", "24/7 affiliate support",
    "24/7 presence", "24/7 service", "24/7 support", "50-50 proposition", "6 figure income",
    "6 figures each year", "9 to 5"
  ],
  "$": [
    "$ a month or more", "$ a year or more", "$ every single month", "$ from my bedroom", "$ grand",
    "$ in free advertising", "$ in free publicity", "$ worth of", "$ worth of bonuses", "$ worth of merchandise",
    "($no) per click through", "($no) per lead", "($no) per sale"
  ],
  "A": [
    "a (no) minute", "a (year) classic", "a absolute must", "a balanced life", "a blueprint for",
    "a booming business", "a breath of fresh air", "a breeze", "a brief list of", "a brief summary of what's",
    "a chance like no other", "a child could do it", "a cinch", "a collection of", "a complete",
    "a complete arsenal of", "a complete package", "a copy of my deposit", "a couple hours a week",
    "a custom designed", "a cut above the rest", "a date with destiny", "a detailed", "a diamond in the rough",
    "a dime a dozen", "a dirt cheap way", "a drop in the bucket", "a few of the features", "a few success stories",
    "a fortune this year", "a free & easy way to", "a fresh approach", "a full (no) day guarantee",
    "a full archive of", "a glimpse of my sales", "a gold mine of information", "a good friend of mine",
    "a great addition", "a guaranteed gain", "a guide to", "a high degree of", "a huge collection of",
    "a letter from a client", "a list of", "a list of all", "a long shot", "a long story made short",
    "a long time coming", "a lot of people feel that", "a massive collection of", "a must read",
    "a new lease on life", "a new perspective", "a new twist", "a no brainer", "a non-stop salesman",
    "a novel twist", "a numbers game", "a partial list of what", "a place you can go", "a pretty penny",
    "a professional image", "a proven blueprint", "a quick fix", "a revised and expanded", "a rich source",
    "a secret that", "a secret weapon", "a short list of our clients", "a short list of what",
    "a sign of the times", "a simple", "a simple technique that", "a simple test to", "a small list of",
    "a small portion of", "a snap", "a special arrangement", "a step forward", "a study conducted by",
    "a summary of everything included", "a sure thing", "a valuable reference", "a way to get",
    "a wealth of information", "able minded", "abnormal", "above and beyond", "above average income",
    "above ground", "above normal", "abreast of changing regulations", "abridged version", "abrupt ending",
    "absolute", "absolute fact", "absolute influence", "absolute necessity", "absolute power",
    "absolute reason", "absolute standards", "absorbable", "absorbing", "absorbing story",
    "abstracted from", "abundant in", "academic background in", "academic like", "academy like",
    "accelerate your", "accelerated", "accented with", "accept credit cards in minutes", "accept your offers",
    "accept your proposal", "accepted business practices", "accepted by", "access proof", "access time",
    "access to all past issues", "accessible", "accessories included", "accident prone", "accidental",
    "acclaimed", "accompanied by", "accomplish your", "accomplished", "accomplishing a goal",
    "according to", "accountability", "accountable", "accountant like", "accounted for", "accuracy and precision",
    "accuracy tested", "accurate information", "accurate methods", "accurate records", "accused of",
    "ace in the hole", "achieve goals", "achieve instant credibility", "achieve the success you deserve",
    "achieve top rankings", "achieve your", "achieving success", "acknowledged by", "acknowledged expert",
    "acknowledged forerunner", "acknowledgment", "acquire your", "acquired taste", "acrobatic",
    "act now", "act upon", "act upon your suggestions", "act within (hour, days, etc.)", "activate your",
    "activated by", "activation fee", "active company", "active market", "active participation",
    "actor like", "actress like", "actual case studies", "actual people", "ad claims", "ad like",
    "adapt to", "adaptable", "adaptive", "add another income", "add emotional value", "add on",
    "add on business", "add on products", "add up", "add your", "add your own links", "added bonus",
    "addict like", "addicted", "addiction free", "addictive", "additional", "additional benefits",
    "additional income", "additional stream of income", "additive free", "address your", "addressed by",
    "adequate insurance", "adhered to", "adhesive like", "adjoin at", "adjust your", "adjusted",
    "administer", "administrated by", "administrator", "admirable", "admirer the", "admissible in",
    "admit that", "adoptive", "adorable", "adore the", "adrenaline rush", "adsorbing", "adult",
    "advance", "advanced", "advanced equipment", "advanced formula", "advantage", "advantageous features",
    "adventure", "adverse reaction", "advertise", "advertise to millions", "advertise to thousands",
    "advertised", "advertisement free", "advertising allowance", "advertising impressions",
    "advertising related", "advertising space", "advertising strategy", "advice from", "advice jammed",
    "advisable", "advise your", "advised by", "advocated to", "aerial", "affected by", "affection prone",
    "affectionate", "affiliate", "affiliate bonus", "affiliate contests", "affiliate discounts",
    "affiliate newsletter", "affiliate program", "affiliate selling", "affiliation", "affirm your",
    "affirmations", "affirmative", "affix your", "affluent in", "affluent times", "afford luxury items",
    "afford the", "affordable", "affordable accommodations", "affordable price", "afraid of",
    "after hours", "after tax", "after years of", "against the wall", "age old", "agenda",
    "agent runned", "agony free", "agree that", "agreed to", "agreement", "ahead of",
    "ahead of the game", "ahead of the pack", "aided by", "aim at", "aiming for", "air conditioned",
    "air cooled", "air heating", "air like", "air proof", "air sealed", "air tight", "airborne",
    "alarmed that", "alarming", "alarming increase", "alarming speed", "alien like", "alien proof",
    "alienated by", "aligned", "alignment free", "alive and kicking", "all about", "all absorbing",
    "all consuming", "all day", "all embracing", "all female", "all I can say is", "all important",
    "all in one place", "all inclusive", "all male", "all natural", "all night", "all of the resources",
    "all or nothing", "all powerful", "all purpose", "all round", "all star", "all systems go",
    "all terrain", "all the ( ) you'll need", "all the business you want", "all the ins and outs",
    "all the tools you will need", "all the way", "all time record", "all walks of life", "all washed up",
    "all you do is advertise", "all you need to know", "allergy free", "alliance with", "allocated by",
    "allow yourself", "allowance", "allowed to", "alluring terrain", "almighty", "almighty dollar",
    "almost controversial", "almost everyone has heard of", "almost perfect", "almost too good to be true",
    "alter your", "altered by", "alternated", "alternating", "alternative strategies",
    "always adding new products", "amazed", "amazement", "amazing advertising tips", "amazing amount",
    "amazing collection", "amazing discovery", "amazing features", "amazing improvement", "amazing results",
    "amazing scene", "amazing", "amazing ability", "amazingly effective", "amazingly simple",
    "ambition seeking", "ambitious", "ambitious growth", "amended", "ammunition filled",
    "amount to something", "amphibious", "amplified", "amplify", "amplify your orders", "amusement",
    "amusing", "an absolute winner", "an action plan for", "an angel", "an arm and leg",
    "an astronomical living", "an email from a customer", "an extra surprise", "an idea whose time has",
    "an in depth look", "an instant business", "an Internet fortune", "an offer you can't refuse",
    "an old age problem", "analysis", "analysis of", "analyzed", "ancestor", "ancestral", "ancestry",
    "anchor down", "ancient secrets", "ancient truth", "ancient", "ancient myth", "angel like",
    "anger free", "angered by", "angled", "anguish free", "animal like", "animated like", "ankle deep",
    "anniversary", "annoyance free", "annoyed by", "annoying", "annual earnings", "annual sale",
    "anonymous", "answerable", "answered by", "answering your questions", "answers hundreds of your questions",
    "anti-drug", "anti-virus", "anticipated by", "antique", "any budget", "any CEO will agree",
    "anybody", "anyhow", "anyone", "anyone can do it", "anyone who buys will", "anyone who is serious about",
    "anyplace", "anything", "anytime", "anyway", "anywhere", "apart from", "apologetic", "apology",
    "apparent advantage", "appeal to prospects", "appealing", "appealing alternative", "appealing choice",
    "appealing fragrance", "appearance friendly", "appliance like", "applicable", "application required",
    "appointed by", "appraisal proof", "appraised by", "appreciate by", "apprentice friendly",
    "approachable", "appropriate", "appropriate alternative", "approval rating", "approved by",
    "approximate value of", "archive your goals", "are you a ( ) who has been trying to", "are you looking",
    "are you looking for", "are you ready to", "are you serious about", "are...?", "arm raising",
    "arm twisting", "armed with", "around the clock", "around the clock service", "arousing",
    "arranged by", "array of colors", "art like", "article mentioned", "artifact", "artificial",
    "artist signed", "as good as it gets", "as heard on", "as mentioned on", "as seen in", "as seen on",
    "as soon as possible", "ask yourself", "ask yourself this question", "asking price", "assassin proof",
    "assembled by", "assembles fast", "assembly less", "assert yourself", "assess your", "assessable to",
    "assessed by", "asset", "assigned to", "assists you", "associate", "associate program",
    "association", "assumable", "assume your", "assumed by many", "assure yourself of", "assured by",
    "astonishing", "astonishing ability", "astonishing size", "astounding", "astounding ability",
    "astounding collection", "astounding efficiency", "astounding miracle", "astounding power",
    "astronomical proportions", "astronomical sales", "at a premium", "at the age of (no) I",
    "at your fingertips", "athlete like", "athletic", "athletic looking", "atomic", "attachments",
    "attain celebrity status", "attainable", "attempt to", "attend today", "attention driven",
    "attention grabbing", "attentive service", "attest to", "attitude adjuster", "attract customers",
    "attract new clients", "attract prospects", "attracting business", "attractive", "attractive deal",
    "attractive incentive", "attractive investment", "attractive price", "auction like", "audible",
    "audio", "audit proof", "augmented", "authentic", "authentic antique", "authentic flavor",
    "authentic miracle", "authentication", "author of", "authored by", "authoring", "authoritative",
    "authoritative reports", "authority on", "authorization require", "authorized by", "authorized version",
    "auto pilot", "auto pilot income stream", "auto saved", "autographed", "automate", "automate everything",
    "automate your follow up", "automate your product fulfillment", "automate your prospect in",
    "automate your site", "automated", "automated income", "automated profit generators", "automated tools",
    "automatic", "automatic marketing system", "automatic merchandising", "automatic sponsoring",
    "automatically deposited in your bank", "automatically submit", "automating", "automation",
    "autosuggestibility", "availability limited", "available", "available funding",
    "available in hard copy format", "avalanche of sales", "average", "average sized", "avid fan of",
    "avoid costly mistakes", "avoid mistakes", "avoid pain", "avoid problems", "avoid the big mistakes",
    "avoid the costly mistakes", "avoid the costly pitfalls", "avoid the run around", "award winning",
    "award winning presentation", "awarded", "awe inspiring", "awe struck", "awed", "awesome",
    "awesome pay plans", "awesome size", "awful looking", "awhile back I"
  ],
  "B": [
    "babe magnet", "baby like", "back alley", "back breaking", "back end", "back end profits", "back handing",
    "back in the saddle", "back order", "back when I was just", "backdoor selling", "backed by", "background",
    "backlash", "backlogged", "backed up", "bad", "bad debt", "bad economy", "bag like", "bag of tricks",
    "bags of cash", "bail out", "balance your", "balanced", "bald like", "ball and chain", "ball park figure",
    "ballistic", "balloon your business", "band like", "bang", "bank like", "bankable", "bankrolled",
    "bankrupt proof", "bankruptcy", "banned", "banner like", "banner year", "bar like", "barbecued",
    "bare", "bare basics", "bare boned", "bare truth", "barely", "barely scratched the surface", "bargain",
    "bargain conscious", "bargain hunter", "bargain price", "bargained", "barn burner", "barrier proof",
    "barring out", "barter deal", "base line", "base on a true story", "based in", "based on",
    "based on my experiences", "basic", "basic advice", "basic guide", "basic survival", "basically you",
    "basics of", "basket full", "bastard like", "battered", "battery powered", "battle hardened",
    "battle tested", "be a major player", "be a super affiliate", "be an affiliate", "be an expert",
    "be completely satisfied or", "be one of the first", "be rich and successful", "be selling in minutes",
    "be your own boss", "beach like", "beached", "bearable", "beast like", "beat competition",
    "beat recession", "beatable", "beaten", "beating the competition", "beautiful", "beautiful scenery",
    "beautifully", "beauty", "because you", "become a bona fide expert", "become a expert",
    "become a millionaire", "become a paid subscriber", "become a pro", "become a super associate",
    "become an expert in your field", "become profitable", "become rich", "beef up", "been publishing since",
    "been well kept", "before I share with you", "beg you", "begging", "begin by", "begin profiting now",
    "begin without any", "beginner", "beginner to advanced", "behind closed doors", "behind the scenes",
    "behind the scenes look", "being a leader", "being an expert", "being educated", "being famous",
    "being in first place", "being informative", "being intelligent", "being organized", "being successful",
    "belief driven", "believability", "believable", "believably", "believe", "believe us or not",
    "belly buster", "belong to", "belonging", "belonging to a certain group", "below average",
    "below is proof that", "below market", "bend the rules", "beneath you", "beneficial", "beneficial advice",
    "beneficial agreement", "beneficial influence", "beneficial ties", "beneficiary", "benefit",
    "benefits", "benefits you'll get", "bent over", "berry flavored", "beside yourself", "best",
    "best $ I every spent", "best home businesses", "best investment I've ever made", "best is yet to come",
    "best kept secret", "best managed companies", "best money can buy", "best money I have ever spent",
    "best price points", "best promotional tools", "best selection", "best seller", "best selling",
    "best shot", "beta test", "beta test offer", "beta version", "better late than never", "better paying",
    "better than", "between success and failure", "beware of", "bewildering", "bewilderment", "bewitched",
    "beyond expectations", "beyond your wildest dreams", "bible like", "big", "big and bold",
    "big breakthrough", "big business", "big check", "big company", "big corporation", "big deal",
    "big enough", "big hearted", "big hitter", "big issue", "big name", "big reduction", "big residual checks",
    "big spender", "big stacks of money", "big ticket item", "big time", "big time operator",
    "big trends", "big wig", "biggest", "billed to", "billing cycle", "billing deferred",
    "billion dollar company", "billion dollar empire", "billion dollar industry", "billionaire",
    "billions", "binary plan", "bind together", "binding", "binding commitment", "binding promise",
    "birth date", "birthday", "birthplace", "bite sized", "bitter sweet", "bizarre", "bizarre tactics",
    "bizarre twist", "black and white", "black colored", "black market", "blast off", "blatant",
    "blazing", "bleak chances", "blended", "bless", "blessed", "blessing", "blew up", "blind like",
    "blistering speed", "blizzard like", "blockbuster", "blocked", "blonde", "blood", "blood and guts",
    "blood red", "blood stained", "blood thirsty", "bloody", "blossoming", "blow", "blow by blow",
    "blow it wide open", "blow the lid off of", "blow the whistle", "blow up", "blow up your profits",
    "blown apart", "blown away", "blown out", "blue collar", "blue colored", "blue ribbon", "blueprint",
    "blueprint for", "board of directors", "bodacious", "bodily harm", "body sculpting", "boggle your",
    "boil over", "boiled", "bold", "bold look", "bold offer", "boldly", "bolt out", "bomb like", "bombard",
    "bona fide", "bonded by", "bonding", "bone chilling", "bone dry", "bone jarring", "bonkers over",
    "bonus", "bonuses", "book like", "book value", "booked", "booked months ahead", "boom", "booming",
    "booming industry", "booming trade", "boost", "boost sales", "boost your", "boost your response",
    "boost your response rates", "borderline", "born again", "born and raised", "born on", "bottled",
    "bottom", "bottom line", "bottoming", "bottomless", "bounce back", "bounce less", "bouncy",
    "bound and determined", "bound up", "boundary line", "boxed", "brace yourself", "braced by",
    "braided", "brain burned", "brain friendly", "brainy", "brand", "brand image", "brand loyalty",
    "brand name", "brand new", "brand positioning", "branded", "branding", "branding solution",
    "brass", "brat like", "bratty", "brave", "breach of", "bread and butter", "break", "break a leg",
    "break away", "break down", "break even", "break free from", "break in", "break new ground",
    "break out", "break out of your", "break the bank", "break the ice", "break up", "breakable",
    "breaking news", "breakneck speed", "breakthrough", "breakthrough discovery", "breathtaking",
    "breathtaking display", "breathtaking picture", "breathtaking scene", "breathtaking view",
    "breezy", "bribe proof", "bricks and mortar", "brief", "bright", "bright colors", "bright eye",
    "bright future", "brightly colored", "brightness", "brilliant", "brilliant color",
    "bring home the bacon", "bring in", "brink of", "brisk", "brittle", "broad", "broad base support",
    "broad experience", "broad minded", "broad spectrum", "broadened", "broke", "broken",
    "broker friendly", "bronze like", "brought in over $", "brown colored", "browse around",
    "brutally honest", "bubble less", "bubble wrapped", "buckle down", "buckled", "buddy", "buddy buddy",
    "buddy like", "budget", "budgeted", "buffed", "bug like", "bugged by", "build a client base",
    "build a global network", "build an empire", "build business relationships", "build consumer trust",
    "build profitable alliances", "build self confidence", "build strategic alliances", "build your",
    "build your business", "building block", "built", "built in", "built in affiliate program",
    "built in business", "built like a", "built to order", "built up", "bulk of", "bull headed",
    "bullet proof", "bullet proof system", "bullet stopping", "bull's eye", "bully proof", "bum rap",
    "bumpy", "bunched together", "bundles of cash", "bureau of", "burglar proof", "burn rubber",
    "burned by", "burning desire", "burning issue", "burning question", "burst of cash",
    "bury the hatched", "business", "business alliance", "business as usual", "business building",
    "business consulting", "business equipment", "business from referrals", "business geniuses",
    "business information", "business law", "business leads", "business letter", "business like",
    "business machinery", "business model", "business name", "business needs", "business owner",
    "business partner", "business plan", "business planning help", "business relationships",
    "business secrets", "business seminar", "business vehicles", "business venture", "business veteran",
    "business wants", "bust onto the scene", "busted by", "busy", "busy time", "butt kicking",
    "buy", "buy a better car", "buy a bigger house", "buy a new car", "buy a new house",
    "buy again and again", "buy anything from you", "buy before midnight tonight", "buy it already",
    "buy now", "buy on impulse", "buy over and over", "buyer behavior", "buying power",
    "buying whatever they want", "by leaps and bounds", "by the book", "by the numbers",
    "by the truck full", "bypass"
  ],
  "C": [
    "cajole", "cakewalk", "calculate your order", "calculated", "caliber", "call it like you see it", "call now",
    "call the shots", "call toll free", "call your own shots", "camera ready", "camouflaged", "can be digitally download",
    "can I show you", "can you", "can you handle", "cancel anytime", "canceled on", "candy like", "canned",
    "can't imagine a better investment", "can't live without it", "can't match the sheer potential",
    "can't put it into words", "can't you", "capable of", "capitalize on", "captivating results",
    "capture customers", "capture interested prospects", "carbonated", "career improving", "carefree living",
    "careful inspected", "careful supervision", "carefully selected", "caring", "caring service", "carnival like",
    "carries a lot of weight", "carry out", "carry the torch", "cartoon like", "carve out a niche",
    "carved in stone", "case by case", "case history", "case in point", "case sensitive", "case study",
    "cases studies", "cash", "cash at closing", "cash back", "cash bearing", "cash cow", "cash discount",
    "cash flow", "cash generating", "cash grants", "cash in", "cash in on", "cash in on your share",
    "cash in your chips", "cash in your pocket", "cash incentive", "cash instantly deposited", "cash magnet",
    "cash on delivery", "cash on demand", "cash or credit", "cash paying customers", "cash rebate", "cash secrets",
    "cash starved", "cash value", "casino like", "casual", "cat and mouse", "cat like", "cataloged",
    "catapult your sales", "catastrophic results", "catch 22", "catchy", "categorized by", "causal", "caution",
    "cautionary", "celebrated by many", "celebrity status", "cemented", "center", "centered", "centralized",
    "centuries old", "centuries owned", "ceramic", "certifiable", "certified by", "chairman",
    "chairman of the board", "chalk up your", "challenged by", "challenging", "chamber of", "champion of",
    "chance of a lifetime", "change their beliefs", "change their mind", "change your destiny", "change your life",
    "changeable", "changed forever", "changed my life", "channels of distribution", "chapter (no) will show you",
    "chapter (no) you'll uncover", "charge it", "charge the right price", "charity giving", "charmer", "charming",
    "charming beauty", "charming hospitality", "chat with us", "cheap", "cheap imitation", "cheapskate",
    "cheat proof", "check in", "check out these comments", "checked", "checked out what others", "checklist of",
    "checkout", "checks in your mailbox", "cheerful help", "chemical free", "cherish by many", "child like",
    "child proof", "chill out", "chilled", "chilly", "chipped", "chock full of", "chocolate covered",
    "choose your own schedule", "choosing the right", "chopped", "chosen by many", "chrome", "chronologically",
    "chunky", "cinnamon flavored", "circle", "circle the wagons", "circular", "circulated by", "circulation of",
    "circus like", "citrus", "city like", "city smart", "claimed by many", "clarified it with", "classed alone",
    "classic", "classic style", "classifiable", "classification", "classified", "classified information",
    "classy", "clean", "clean bill", "clean cut", "clean the floor", "clean up", "cleanest", "cleansing",
    "clear communicator", "clear cut", "clear cut answers", "clear cut proposal", "clear cut report",
    "clear examples", "clear eyed", "clear headed", "clear ideas", "clear language", "clear policy",
    "clear proof", "clear sighted", "clear solution", "clear thinking", "clear understanding", "cleared",
    "clearinghouse", "clearly defined", "clearly explained", "clearly written", "clever", "clever advice",
    "clever devise", "clever ideas", "clever scheme", "clever tactics", "cleverly designed", "click here",
    "client attracting", "client driven", "climate safe", "climb on the bandwagon", "climbable",
    "clinical evidence", "clock like", "clocked at", "clockwork", "clone your sales", "close at hand",
    "close deals effectively", "close every sale", "close fitting", "close in", "close knit", "close out",
    "close sales faster", "close supervision", "close the deal", "close the sale", "close ties", "close up",
    "closed door", "closely guarded strategies", "closely monitors", "closes at (time)", "closing down soon",
    "closing forever", "club like", "coached by", "coaching included", "coast to coast", "coastal",
    "coated with", "co-author", "co-authored", "coded", "coefficient", "coffin like", "coiled", "coin operated",
    "cold", "cold blooded", "cold cash", "cold hard facts", "cold hearted", "cold shoulder", "cold sweat",
    "cold turkey", "colder", "coldest", "collaborated with", "collateral free", "collect them all", "collectable",
    "collected by", "collectible", "collector's edition", "collector's item", "college like", "collision proof",
    "colonial", "color", "color organized", "colorable", "colorful", "colorful demonstration", "colossal amount",
    "colossal wealth", "combination locked", "combined with", "combustible", "combustible issue", "come and go",
    "come full circle", "come on strong", "come out ahead", "come out on top", "come out swinging",
    "come to a head", "come to grips with", "come to terms with", "come up with", "comeback to",
    "comes with free reseller program", "comes with the territory", "comfort", "comfort of home",
    "comfort zone", "comfortable", "comfortable accommodations", "comfortable fit", "comforting", "comical",
    "commendable", "comments from satisfied customers", "commerce friendly", "commercial", "commercially sold",
    "commission check", "commission on back end sales", "commission on repeat sales", "commissioned by",
    "commitment to", "committed to", "common cause", "common in most", "common purpose", "commonsense to buy",
    "commonwealth", "communication oriented", "community oriented", "compact", "companionable", "company loyal",
    "company stock", "comparable to", "comparative", "compare it with other opportunities",
    "compare our product to", "compared by", "compassionate service", "compatibility", "compatible",
    "compelled them to buy later", "compelling", "compelling evidence", "compelling force", "compelling reason",
    "compelling testimonials", "compensate you", "compensated with", "compensating for", "compensation",
    "compensation package", "compensation plan", "compete with", "competitive advantage",
    "competitive advertising", "competitive drive", "competitive edge", "competitive industry",
    "competitive prices", "competitor proof", "compiled by", "complete", "complete authority",
    "complete confidentiality", "complete honesty", "complete information", "complete instructions",
    "complete menu", "complete package", "complete perfection", "complete reliability", "complete support",
    "complete training", "complete truth", "completely", "completely confidential", "completely free",
    "completely free to join", "completing a project", "completing a task", "complex", "compliant with",
    "complimentary", "compliments your business", "compliments your product", "composed by",
    "comprehensive index", "comprehensive instructions", "comprehensive inventory", "comprehensive knowledge",
    "comprehensive package", "comprehensive solution", "compressed", "computable", "computed by", "computer",
    "computer assisted", "computer equipment", "computer like", "computer literate", "computer repair",
    "computer training", "computerize", "computerized", "concealed by", "concise report", "conclusive evidence",
    "conclusive proof", "concrete information", "concrete solution", "condensed version", "confession of a",
    "confide in your desires", "confidence", "confident that you'll", "confidential", "confidential location",
    "confirm your order", "confirmation provided", "confirmed by", "confusion proof", "congratulations",
    "connect the dots", "connected", "conscious of your", "consecutive awards in", "consider all alternatives",
    "consider these benefits", "consider your", "considerate", "consistent", "consistent accuracy",
    "consistent income", "consolidate", "consolidated", "constant communication", "constant interaction with",
    "constant promotional tool", "constant revenue stream", "constantly improving", "constructed by",
    "construction", "constructive", "constructive advice", "constructive approach", "consulted by",
    "consulting provided", "consumed by", "consumer protection", "consumer service", "contact information",
    "contact us by e-mail", "contagious", "contemporary", "content filled", "content rich", "contest",
    "continuing relief", "continuous", "continuous flow of visitors", "contract protected",
    "contrary to popular belief", "contribute to", "contributing", "contribution of", "control",
    "control your income", "control your life style", "control your schedule", "controversial", "convenience",
    "convention like", "conventional", "conventional size", "conversational", "conversion cost", "conversion ratio",
    "convert every lead", "convert into customers", "convert more prospects", "convert visitors to sales",
    "convert your", "convertibility", "convertible", "convince any skeptic", "convince yourself that",
    "convinced that", "convincing statistics", "cooked by", "cool", "cooler", "coolest", "co-op", "cooperative",
    "coordinated by", "coordinated plan", "copy of my bank statement", "copyright", "coral", "core market",
    "corporate", "corporate identity", "corporate image", "corporate secrets", "corporation", "correct",
    "corruptive proof", "cosmetic", "cosmic", "cost", "cost accounting", "cost analysis", "cost conscious",
    "cost control", "cost effective", "cost effective advertising", "cost efficient", "cost of goods sold",
    "cost of living", "costly", "couldn't live without it", "couldn't you", "counseled by", "countdown to",
    "counted by", "counter offensive", "counter productive", "counteract", "counteractive", "counterblow",
    "counterclockwise", "countered by", "counterpart", "counting on", "countless", "country wide",
    "county smart", "coupon", "courageous", "course free", "courteous service", "courtesy driven",
    "cover virtually every", "cover your", "cover your butt", "coverage provided by", "covered by",
    "covering everything", "covers a lot of ground", "covers all the bases", "covers every detail",
    "covers everything", "cowboy like", "cozy", "crackdown on", "craft like", "crafty", "crammed full of",
    "crank", "crank out", "crank up your promotion", "cranks out money", "crash and burn", "crave your product",
    "crazy", "cream of the crop", "creamy", "create a buying urge", "create a lasting impression",
    "create a media frenzy", "create a network", "create a traffic funnel", "create believable ads",
    "create credibility", "create impulse spending", "create interest", "create lifetime customers",
    "create monthly income", "create obscene wealth", "create profitable deals", "create profitable products",
    "create raving fans", "create residual income", "create your", "create your own", "create your own products",
    "created by", "creating a buzz", "creative", "creative alternatives", "creative invention",
    "credential supported", "credentials", "credibility", "credibility booster", "credible", "credible guarantee",
    "credible organization", "credible story", "credit", "credit card", "credit card processing",
    "credit cards accepted", "crime proof", "crime ridden", "criminal proof", "cringe at the thought",
    "crinkled", "crisis ready", "crisper", "crispy", "critic proof", "critical", "critical acclaim",
    "critical acclaimed", "critical decision", "critical factor", "critical issue", "critical mass",
    "critical material", "critical moment", "critical state", "critically acclaimed", "critically needed",
    "criticism proof", "crook proof", "cross county", "cross merchandising", "cross promotion",
    "cross selling", "cross the line", "crossed by", "crossover to a new", "crowd pleaser", "crowd proof",
    "crowded by", "crowned by", "crucial function", "crucial issue", "crucial stage", "crucial to own",
    "crumbly", "crunch the numbers", "crunch time", "crunchy", "crush your competition", "crushed", "crusty",
    "crying free", "crystal clear", "crystal clear sound", "crystal like", "crystallized", "cubed", "cubic",
    "cult like", "cultivated into", "culture", "curable problem", "cure your", "curiosity driven", "curled",
    "curly", "currency converter", "currency exchange", "current cost", "current price is",
    "currently we are offering", "cursed by", "curved", "cushioned", "custom", "custom built", "custom design",
    "custom designed", "custom made", "customer base", "customer care", "customer complaints",
    "customer driven", "customer friendly", "customer loyalty", "customer oriented", "customer oriented company",
    "customer profile", "customer questions", "customer satisfaction", "customer service", "customizable",
    "customizable links", "customization", "customized", "customized affiliate web site", "customized for you",
    "customized information", "customized product", "customized version", "cut and dried", "cut and dry",
    "cut and dry answers", "cut and paste", "cut corners", "cut costs", "cut down", "cut out", "cut rate",
    "cut rate price", "cut throat", "cut to the chase", "cut you in on", "cut your loses", "cutting costs",
    "cutting edge", "cyber", "cyber ready", "cyber space", "cybermall", "cyberspace", "cycle like", "cycled",
    "cyclone"
  ],
  "D": [
    "daily", "dainty", "dairy like", "damp", "danger", "dangerous", "dangling hope", "dare to be different",
    "dare you to", "daring color", "daring innovation", "dark", "darken by", "darling", "darn", "data supported",
    "database chosen", "date of", "dawn of a new age", "day long", "day of", "day of judgment", "day old",
    "day to day", "daydream about", "dazzling", "dazzling color", "dazzling compilation", "dazzling event",
    "dead broke", "dead deal", "dead end", "dead on", "deadbeat", "deadline", "deadlocked", "deal of the",
    "Dear ( ) Subscriber", "Dear (industry) Consultant", "Dear (industry) Customer", "Dear (item) Dealers",
    "Dear (item) Enthusiast", "Dear (item) Seeker", "Dear (their name)", "Dear Associate", "Dear Auction Seller",
    "Dear Bargain Hunter", "Dear Bidder", "Dear Business Coach", "Dear Business Investor", "Dear Business Owner",
    "Dear Business Tax Payer", "Dear Buyer", "Dear CEO", "Dear Collector", "Dear Copywriter", "Dear Customer",
    "Dear Editor", "Dear Entrepreneur", "Dear Executive", "Dear Fellow Business Owner", "Dear Friend",
    "Dear Future ( )", "Dear Future Millionaire", "Dear Home Worker", "Dear Home-Based Business Owner",
    "Dear Marketer", "Dear Opportunity Seeker", "Dear Publisher", "Dear Reseller", "Dear Sales Representative",
    "Dear Supplier", "Dear Surfer", "Dear Visitor", "Dear Webmaster", "Dear Wholesaler", "dearly thankful",
    "debated by", "debit or credit", "debt eliminating", "debt free company", "debt less", "debt ridden budget",
    "debugged", "debut", "decade long", "decaffeinated", "decay proof", "deceased", "deceived by",
    "decent living", "decently priced", "deceptive competition", "decide now", "decided by", "deciding factor",
    "decipher", "decision", "decision makers", "decision making", "decisional", "decisive advantage",
    "decisive choice", "decisive influence", "decisive moment", "decode your", "deconstructed from",
    "decorated", "decreased price", "dedicate your", "dedicated", "dedicated team of", "deducted from",
    "deductible", "deduction friendly", "deed", "deep", "deep pocket", "deep rooted", "deepened", "deeper",
    "deepest", "defeat", "defeat your competition", "defective until", "defend your", "defendable",
    "defensible", "deferrable", "deferred billing", "deferred payments", "deferred till", "defined by",
    "definite answers", "definite benefits", "definite information", "definitely affordable", "deflective",
    "defrauding", "defrosted", "deft free", "defused the situation", "degree in", "delay paying till",
    "delegated by", "delete your", "deliberate discount", "delicacy", "delicate", "delicious", "deliciously",
    "delightful", "delightful scent", "delightful surprise", "delightful taste", "delightfully", "delighting",
    "deliverable", "delivered fast", "delivers on their promise", "delivery guarantee", "delivery mechanism",
    "deluxe", "demo", "demographically", "demonstrate your", "demonstrated by", "demonstrated skills in",
    "demonstration", "demoted to", "denied by", "denounced by", "deodorized", "department of",
    "departmental to", "dependable", "dependable promise", "dependably", "dependency", "dependent upon",
    "deposit", "deposited in your bank", "depreciated", "depreciation", "depressed market", "depressed over",
    "depth of", "descend upon", "descent", "described with", "description", "descriptive", "design your",
    "designated by", "designed by", "designed to order", "designed to sell", "desirable", "desired results",
    "desperate deadline", "desperate measures", "destiny", "destroy the competition", "destructible",
    "destruction of", "destructive", "detachable", "detail driven", "detail oriented", "detailed",
    "detailed analysis", "detailed description of", "detailed instruction", "detailed plan", "detailed report",
    "detailed research", "detailed sales statistics", "detailed table of contents", "detailed traffic statistics",
    "detailing", "detected by", "detective", "determination", "determine the", "determine your",
    "determined to help", "detrimental to", "develop a recognizable brand", "develop your", "developed by",
    "developed new products", "developer tested", "developing new", "devilish", "devoted to", "diabolic",
    "diagnosed by", "diagonal", "diagrammed", "dial tone", "dial up access", "diamond in the rough",
    "diamond like", "did you", "did you feel", "did you know", "did you like", "did you note that",
    "did you realize", "didn't you", "die hard customer base", "diet proof", "dietary", "different",
    "difficult economic times", "difficult situation", "digest version", "digital", "digital cash",
    "digital delivery", "dignified", "diligent", "dim", "dimensional", "diminish the", "dingy", "dinosaur like",
    "dip into", "diploma like", "diplomatic", "dire need", "direct access", "direct action", "direct marketing",
    "direct response", "direct selling", "directed by", "directional", "dirt cheap", "dirt poor", "dirty",
    "dirty secrets", "disability friendly", "disadvantages of", "disaffiliate with", "disagree with",
    "disappointed with", "disapproval of", "disassembles easily", "disaster proof", "disbelieve the competition",
    "discard your old", "disciplined", "disclaim any", "disclose any", "disclosed by", "discolored",
    "discontinue using", "discount", "discount rate", "discounted", "discover", "discover a step by step",
    "discover free", "discover how", "discover how to", "discover new tricks", "discover the mistakes that",
    "discover the most important", "discover the number one", "discover the secrets of", "discover what the",
    "discover which", "discovered by", "discrete packaging", "discretion advised", "disease proof",
    "disguised by", "dish out", "dishonest competition", "disinfected", "dislike your old", "dismiss as a",
    "dispatched to", "dispensable", "dispirited about", "display modal", "displayed by", "displeased with",
    "disposable", "disrupt your competition", "dissolvable", "distinct advantage", "distinct trend",
    "distinction between", "distinctive competence", "distinctly remembered", "distinguished",
    "distinguished ability", "distorted by", "distress about", "distributed by", "distribution",
    "distribution center", "distribution rights", "distributor friendly", "district runned", "disturbed by",
    "ditch your", "diverse", "diverse background", "diverse experience in", "diversified", "dividable between",
    "divide and conquer", "divide your payments", "dividends", "divine", "do I have it right",
    "do it yourself", "do something you love", "do you ask yourself", "do you ever notice that",
    "do you have a problem with", "do you know anyone who", "do you know what", "do you want",
    "do yourself a favor", "do…?", "doctor approved", "doctor recommended", "documented", "documented facts",
    "dodge the", "does…?", "doesn't leave anything out", "doesn't…?", "dollar amount", "dollar for dollar",
    "domain friendly", "domestic", "dominate the", "donation of $(no)", "don't be fooled by", "don't be left out",
    "don't cop out", "don't delay", "don't even think of ( ) until", "don't fall for the hype",
    "don't go away empty handed", "don't know how I lived without", "don't let (subject) stop you",
    "don't let the chance slip by", "don't make another", "don't miss out", "don't need any employees",
    "don't press you luck", "don't take my word for it", "dooms day", "doorway to", "dormant", "do's and don'ts",
    "dotcom", "double", "double barrel", "double digit advantage", "double digit response rates", "double edge",
    "double headed", "double header", "double hung", "double sales", "double take", "double trouble",
    "double whammy", "double your money back", "double your revenues", "doubled by", "doubtful of",
    "down and dirty", "down economy", "down scale", "down the sales path", "down to", "down to a science",
    "down to earth", "down to earth advice", "down to the wire", "downgraded to", "downhill", "down line",
    "download a free version of", "download it in minutes", "download it now", "downloadable",
    "downside of not ordering", "downsizing", "downtrend", "dozens of", "drafted by", "drafty", "drag and drop",
    "drama like", "dramatic", "dramatic breakthrough", "dramatic discovery", "dramatically increase your sales",
    "draped", "drastic mistake", "draw the line", "drawback", "drawing wide interest", "drawn out", "dream like",
    "dream your", "drench in", "dressed up", "dried", "driven", "driving force", "droopy", "drop",
    "drop dead gorgeous", "drop down menu", "drop shipping", "drop the ball", "drought stricken", "drug free",
    "drum up business", "dry", "due by", "due to popular demand", "duplicable", "duplicate my success",
    "duplicate our", "duplicate your business", "duplication proof", "durable", "duty free", "dwarfs other",
    "dyed with", "dyer need of", "dynamic", "dynamite"
  ],
  "E": [
    "each and every", "eagerly anticipated", "ear piercing", "ear splitting", "ear steaming", "earful of",
    "early bird", "early on", "early retirement", "early stages", "earn", "earn (no) times your current income",
    "earn an additional $", "earn great recognition", "earn money", "earn money selling", "earn money while you sleep",
    "earn more in less time", "earn substantial income", "earn top dollar", "earned income", "earned over",
    "earning about", "earning potential is enormous", "earth shattering", "earthbound", "earthy materials", "ease",
    "ease of distribution", "eased up", "easier", "easiest", "easiest way to make money", "easily", "easily add",
    "easily sell them", "easily understood", "easy", "easy access", "easy as pie", "easy come, easy go",
    "easy going", "easy money", "easy payment", "easy plan", "easy prosperity", "easy reference", "easy renewal",
    "easy solution", "easy to follow", "easy to implement", "easy to install", "easy to read",
    "easy to read and follow", "easy to understand", "easy to use software", "easygoing", "eat up your competition",
    "eat your heart out", "ebook marketing", "ebusiness", "ecommerce", "economic", "economic benefits",
    "economic change", "economic climate", "economic factors", "economic gain", "economic growth",
    "economic indicators", "economic survival", "economical", "economy", "ecstatic buyers", "edge up", "edited",
    "educate your audience", "educated", "educational", "effect of", "effected by", "effective",
    "effective and efficient", "effective approach", "effective ideas", "effective immediately", "effective scheme",
    "effectively", "efficient", "efficient company", "efficient service", "effort", "effort free", "effortless",
    "effortless skill", "effortlessly", "ego less", "eight", "eighth", "either or", "ejected from", "elaborate",
    "elaborate comfort", "elaborate scheme", "elaborate style", "elapse time", "elastic", "elastic material",
    "elating", "elderly", "elected", "election held", "electric", "electricity", "electrifying performance",
    "electronic", "electronic currency", "electronic marketing", "electronic publishing", "elegance", "elegant",
    "elegant shaped", "elementary", "elevate traffic", "elevate your", "elevated", "elevated level", "elevating",
    "eleven", "eligibility is limited", "eligible for", "eliminate all the confusion", "eliminate debt",
    "eliminate stress", "eliminate work", "eliminate your", "eliminated", "eliminating debt", "elite",
    "elude your", "elusive", "elusiveness", "email alert", "email marketing", "embark on", "embarrass by",
    "embedded", "embrace our", "emerald", "emerge as", "emergence of", "emergency", "emerging market",
    "emotion driven", "emotional", "emotional appeal", "emotional response", "emotionally charged", "empathy",
    "emphasize", "empire like", "employ our", "employable", "employed", "employee friendly", "employer proof",
    "empty", "emulate the", "enable our", "enabled", "enchanting", "enchanting fragrance", "enchanting scene",
    "enchantment", "enclosed", "encoded with", "encounter our", "encourage yourself to", "encouraged",
    "encrypted", "encryption", "encyclopedia like", "end cold prospecting", "end of a", "end procrastination",
    "end skepticism", "end the daily grind", "end user", "end your money worries", "endangered", "endeavor less",
    "endless", "endless demand", "endless possibilities", "endless selection", "endless stream of traffic",
    "endless supply", "endless supply of ( ) information", "endorsed", "endorsed by", "endorsements", "ends today",
    "enduring stability", "enduring success", "energetic", "energize", "energize your income", "energy friendly",
    "energy saving", "enforced", "enforced by", "engaged", "engaged in", "engineered", "engraved",
    "engraved with", "engross yourself", "engulfed in", "enhance your", "enhanced", "enhances relationships",
    "enhancing performance", "enjoy", "enjoy a dream vacation", "enjoyable", "enjoyable surprise", "enjoyed by",
    "enjoyment", "enlarge your", "enlarged", "enlighten by", "enlightened", "enlightening", "enlist our",
    "enlisted", "enormous", "enormous ability", "enormous help", "enormous industry", "enormous savings",
    "enormous wealth", "enraged", "enriched", "enriching", "enroll in", "enroll now", "ensure yourself",
    "entangle", "entangled by", "enter here", "entering a new", "enterprise", "enterprising",
    "enterprising entrepreneurs", "entertain yourself with", "entertained", "entertainer like", "entertaining",
    "entertainment", "enthusiasm", "enthusiastic", "enthusiastic comments", "entice yourself with", "enticing",
    "enticing choice", "enticing incentive", "enticing offer", "entire price of", "entirely up to you",
    "entrancing", "entrepreneur", "entrust", "entry level", "envious of", "environment", "environmental",
    "environmental concerns", "environmentally friendly", "environmentally safe", "environmentally sound",
    "envision having", "envy", "epic adventure", "epic proportions", "epidemic like", "equal", "equal terms",
    "equipment", "equipped with", "equity", "era of", "erasable", "erased from", "erotic", "erotica",
    "errand free", "error proof", "errorless", "erupt your", "erupt your cash", "escape proof", "escape your",
    "escaping the daily grind", "escorted by", "essence of", "essential", "essential component",
    "essential goods", "essential ingredients", "essential knowledge", "essential nutrients", "establish",
    "establish rapport", "establish yourself as", "established", "established classic", "established tradition",
    "estimated", "eternal problem", "eternity", "ethical", "ethical procedures", "ethically increase your profits",
    "ethics", "evaluated by", "evaporated", "even", "even for busy people", "even terms", "event of",
    "eventually you", "ever lasting", "ever present", "ever wonder how", "everlasting comfort",
    "everlasting profits", "every (no)th customer will", "every entrepreneur", "every little bit helps",
    "every minute counts", "every wonder", "everyone experiences", "everyone is joining",
    "everyone is talking about", "everything exposed", "everything from ( ) to ( )", "everything still in tact",
    "everything you always wanted to know about", "everything you may have heard about", "everything you need",
    "everything you need to know", "evidence from", "exact", "exact instructions", "exact timetable", "exactly",
    "exactly how", "exactly how to", "exactly what", "exactly what I've been looking", "exactly what you get",
    "examination less", "examined by", "example", "examples of how", "exceed your goals", "exceeding expectations",
    "excellence", "excellent", "excellent authority", "excellent craftsmanship", "excellent credentials",
    "excellent credit", "excellent payment structure", "excellent quality", "excellent skills", "except our",
    "exceptional ability", "exceptional antique", "exceptional condition", "exceptional facility",
    "exceptional honesty", "exceptional qualifications", "exceptional quality", "exceptional service",
    "exceptionally high incomes", "exceptionally reliable", "excess of", "excessively", "exchange it for",
    "exciting", "exciting adventure", "exciting challenge", "exciting destination", "exciting developments",
    "exciting discovery", "exciting invention", "exciting news", "exciting results", "exciting revelation",
    "exclude the $(no)", "exclusive", "exclusive access", "exclusive information", "exclusive news",
    "exclusive privilege", "exclusive product", "exclusive rights", "exclusivity", "excuse me but", "execute our",
    "executed", "executive", "executive like", "executive strength", "executive summary", "exempt by", "exempted",
    "exemption", "exercise free", "exercised by", "exhausted from", "exhibited at", "exhilarated by",
    "exhilarating adventure", "exhilarating news", "existing customers", "exotic location", "exotic taste",
    "expand", "expand your marketers", "expandability", "expandable", "expanded", "expanding income",
    "expands your knowledge", "expansion driven", "expect a lot", "expedited by many", "expendable income",
    "expenditures", "expense", "expensive", "experimentation", "expensive looking", "experience happiness",
    "experience included", "experience the", "experienced", "experienced as", "experienced in all aspects of",
    "experienced in all facets of", "experienced in all phases of", "experiential", "experiment like",
    "experimented", "expert", "expert choice", "expert in your field", "expert only information",
    "expert opinion", "expert solutions", "expert testimonials", "expertise", "experts agree",
    "experts won't share this", "explained by", "explanation", "explicit", "explode", "explode your orders",
    "exploded", "exploit", "explore new opportunities", "explore your", "explosion in profits", "explosive",
    "explosive growth", "explosive influence tactics", "exported", "exposed", "exposure", "express",
    "express ordering", "expressed", "expressible", "exquisite color", "exquisite elegance", "exquisite pleasure",
    "exquisitely detailed", "extend your", "extended", "extensible", "extensive experience",
    "extensive involvement", "extensive marketing", "extensive training", "exterminate", "external", "extinct",
    "extinct proof", "extinguished by many as", "extra", "extra energy", "extra exposure", "extra incentives",
    "extra insurance", "extra money", "extra source of income", "extracted from", "extraction proof",
    "extraordinary collection", "extraordinary resemblance", "extraordinary success", "extrasensory",
    "extravagant", "extravagant gift", "extreme", "extreme accuracy", "extreme caution",
    "extreme persuasion strategies", "extremely hard to find", "extremely versatile", "eye candy",
    "eye catching", "eye catching style", "eye opening", "eye opening advice", "eye pleaser", "eye popping",
    "eye startling", "eyebrow raising", "eyewitness accounts", "eyewitnesses", "ezine advertising", "ezine friendly"
  ],
  "F": [
    "fabricated proof", "fabulous", "fabulous adventure", "fabulous collection", "fabulous taste", "face up",
    "face up to reality", "face value", "faceless", "fact", "fact finding", "fact sheet", "factor in", "factoring",
    "factory like", "facts and figures", "factual", "factual material", "fad like", "fad proof", "fail proof",
    "fail safe", "fail safe system", "fail safe tests", "failure", "faint hit of", "eye catching", "eye catching style",
    "eye opening", "eye opening advice", "eye pleaser", "eye popping", "eye startling", "eyebrow raising",
    "eyewitness accounts", "eyewitnesses", "ezine advertising", "ezine friendly", "fair", "fair and square",
    "fair market value", "fair methods", "fair price", "fair shake", "fair value", "faith", "faithfully",
    "fake out", "fall back on", "fall in love with", "fallen to $(no)", "fame", "fame and fortune", "familiar",
    "familiarized by", "family", "family run", "famine proof", "famous", "fan driven", "fancy", "fancy schmancy",
    "fantasies", "fantasize learning", "far and wide", "far fetched", "far flung", "far more than I expected",
    "far out", "far reaching consequences", "far seeing", "far surpasses anything", "fascinating figures",
    "fascinating ideas", "fascinating information", "fascinating results", "fashion", "fashion conscious",
    "fashion friendly", "fashionable mix", "fashioned", "fast", "fast and easy access", "fast and furious",
    "fast break", "fast breaking news", "fast delivery", "fast distribution", "fast food", "fast growing",
    "fast growing collection", "fast growing market", "fast moving", "fast pace", "fast results", "fast rising",
    "fast service", "faster", "fastest", "fat free", "fatal", "fate", "father from the truth", "favorable image",
    "favorite", "fear of", "feared by", "fearless", "feasible ideas", "feast on", "feast or famine", "featured",
    "features", "federal", "fee less", "feed yourself", "feedback friendly", "feel like a million",
    "felt by many", "festival like", "festive", "few and far between", "few clicks of the mouse", "few disagree",
    "few employees", "fewer the better", "fiber like", "fictional", "field of", "fielded by", "figure driven",
    "figure pointing", "figured by", "fill in", "fill in the blank", "filled with", "filler", "fills the bill",
    "filmed at", "filter proof", "filthy rich", "final offer", "finalized today", "finance", "financed",
    "financial", "financial abundance", "financial advice", "financial advisor", "financial collapse",
    "financial crisis", "financial dreams", "financial freedom", "financial gain", "financial goal",
    "financial independence", "financial position", "financial security", "financial statement",
    "financially beneficial", "financially independent life", "find extra cash", "find hidden profits",
    "find out a easier way", "find out how to", "find smarter ways", "find success", "finder's fee", "fine",
    "fine accent", "fine and dandy", "fine antique", "fine craftsmanship", "fine grained", "fine quality",
    "fine reputation", "fine texture", "fine tune your", "fine tune your biz", "fine workmanship", "finely crafted",
    "finish by", "fire breathing", "fire like", "fire off", "fire proof", "fire your boss", "fired up",
    "fireproof materials", "firm", "firm action", "firm believer in", "firm commitment", "firm hold", "firm policy",
    "firm support", "firmly placed", "first", "first and foremost", "first class", "first class company",
    "first come first served", "first degree", "first generation", "first hand", "first-hand experience",
    "first hand facts", "first hand report", "first line of defense", "first of its kind", "first place",
    "first priority", "first prize", "first rate", "first round", "first strike", "firsthand experience",
    "fist punching", "fist squeezing", "fit", "fit for a king", "fits all", "fits in your pocket",
    "fits your budget", "five", "five star", "five star rating", "fix up", "fixable", "flabbergasted",
    "flame proof", "flannel", "flaring", "flash by", "flat", "flat fee", "flaunt it", "flavor less", "flawless",
    "flawless integrity", "flawless system", "flee from", "flex your", "flexible", "flimsy", "flip over",
    "flirt with", "flood of", "flood of money", "flood of visitors", "floodgates of success", "floored by",
    "floral", "flourishing business", "flowing", "fluent in", "fluffy", "fluid like", "fluke", "flurry of",
    "flush out", "fly by night", "focus on", "focused", "foldable", "follow though", "follow up",
    "follow up message", "follow your dreams", "follow your heart", "follow your instincts", "follow your passions",
    "followed through", "follows directions", "follows through", "foolish", "foolproof", "foolproof ideas",
    "foolproof methods", "foot loose", "foot stumping", "for a beginner or pro", "for a novice or expert",
    "for a number of years", "for a select few", "for beginners or veterans", "for better or for worse",
    "for example", "for less than $ you can", "for less than the cost of", "for most any budget",
    "for serious collectors only", "for the hell of it", "for the low price of $", "for the month of",
    "for the next (no) buyers we", "for those of you planning", "forbidden", "forbidden luxury",
    "forbidden secrets", "force field of", "forced by", "forced matrix", "forecasted by", "foreclose on",
    "forefront of", "foreign", "foremost expert on", "forensic like", "foreplay", "foresight in",
    "foretell the future", "forever", "forfeit your", "forgery proof", "forget about", "forgetful",
    "forgivable", "forgive us for", "form and substance", "formalized offer", "formatted with", "formed by",
    "former customer", "formidable challenges", "formula", "formula for success", "formulated with",
    "forthcoming", "fortunate", "fortune", "forum of", "fossil like", "foul", "foul smelling", "found out",
    "foundation", "founded by", "founders of", "four", "four star", "four wheeled", "fourth", "foxy",
    "fraction of", "fragile", "fragile economy", "fragrance", "fragrance free", "framed", "framework",
    "franchised", "franchising", "fraud proof", "freak of", "freak out", "freaky", "free", "free advertising",
    "free and clear", "free articles", "free bonus", "free booklet", "free classified ad", "free consulting",
    "free distribution rights", "free ebook", "free ecourse", "free email consolidation", "free email support",
    "free enterprise", "free excerpt", "free exposure", "free ezine", "free ezine submission", "free flowing",
    "free gift", "free gift subscription", "free Internet access", "free lesson", "free market",
    "free newsletter", "free parts", "free personal help", "free publicity", "free report", "free reprint rights",
    "free resell rights", "free ride", "free sample", "free samples or trials", "free seminar", "free service",
    "free shipping", "free software", "free standing", "free subscription", "free support",
    "free telephone consulting", "free to join", "free training", "free trial", "free trial download",
    "free up your time", "free vacation certificate", "free web site", "free your schedule", "freebie",
    "freedom", "free-lanced", "freelancing as", "freely", "freeze dry", "freeze proof", "freeze up", "frenzy",
    "frequency", "frequent", "fresh", "fresh and targeted", "fresh detail", "fresh information", "fresh insights",
    "fresh look", "fresh originality", "fresh perspective", "fresh scent", "fresh thinking", "fresher",
    "freshly made", "friction proof", "fried", "friend like", "friendly", "friendly advice", "friendly terms",
    "frighten by", "frigid", "fringe benefits", "frisky", "from rags to riches", "from start to finish",
    "from the bottom up", "front line", "fronted by", "frost like", "frosted", "frown upon", "frozen",
    "frugal", "frugal times", "fruity", "fuel efficient", "fuel to the fire", "fugitive like", "fulfill",
    "fulfilled", "fulfilling a dream", "fulfilling a fantasy", "fulfillment driven", "full", "full blooded",
    "full blossom", "full blown", "full bodied", "full bodied taste", "full circle", "full coverage",
    "full faced", "full fledged", "full grown", "full hearted", "full independence", "full length",
    "full level intelligence", "full page ad", "full scale", "full service", "full size book", "full solution",
    "full term", "full throttle", "full time", "fully", "fully assembled", "fully automated", "fully documented",
    "fully insured", "fully prepared", "fully restored", "fully searchable", "fully track able", "fun",
    "function less", "functional", "fund raiser", "fundamental", "fundamental business principles",
    "fundamental component", "fundamental goals", "funded by", "fungus proof", "funky", "funnel",
    "funnel in business", "funny", "furious with", "furnished", "future", "future earnings", "future of",
    "futures market"
  ],
  "G": [
    "gadget", "gag gift", "gain", "gain an edge", "gain an enormous following", "gain authority",
    "gain control of your life", "gain instant", "gain instant recognition", "gain new leads and customers",
    "gain pleasure", "gain prestigious", "gain status", "gain the upper hand", "gain valuable experience",
    "gaining a promotion", "gaining a talent", "gaining an advantage", "gaining free publicity", "gaining freedom",
    "gaining knowledge", "gaining popularity", "gaining time", "galactic", "galaxy like", "gallery of",
    "gamble less", "gambling", "game like", "game plan", "gamesmanship", "gang up", "gangster like",
    "garbage proof", "garnish with", "gas generated", "gas less", "gas powered", "gated", "gateway to",
    "gathered by", "gauge your", "gear down", "gear less", "gear shifting", "gear up", "geared for",
    "gel", "gelled together", "gem like", "gems", "gender friendly", "gender specific", "general",
    "generate a huge response", "generate cash on demand", "generate consistent revenue", "generate instant cash",
    "generate leads", "generate more leads", "generate qualified targeted leads", "generate sales",
    "generated", "generic", "generosity", "generous hospitality", "generous offer", "generous portion",
    "generous terms", "genetic", "genius", "gentle", "gently", "genuine", "genuine commitment",
    "genuine improvement", "genuine offer", "genuine opportunity", "genuine satisfaction", "geographical",
    "germ free", "germ less", "get $ worth of bonus gifts", "get (no) free gifts", "get (no) page views",
    "get (no) surprise bonuses", "get (no)% off of selling price", "get a (no)% discount", "get a bang out of",
    "get a free subscription to", "get a high ranking", "get a load off", "get a maximum return",
    "get a piece of the pie", "get a sneak peak at some", "get across", "get all dolled up", "get an edge",
    "get around", "get away", "get back on your feet", "get direct access to", "get dozens of",
    "get every technique I use", "get every tool I use", "get everything you need to", "get expert advice on",
    "get free advertising", "get in", "get into the swing of things", "get it without delay", "get more traffic",
    "get on auto pilot", "get on the stick", "get one under your belt", "get out of debt", "get paid",
    "get paid forever", "get readers interested", "get reciprocal links", "get repeat visitors", "get results",
    "get rich quick", "get rid of financial frustration", "get rid of money problems", "get spectacular results",
    "get started immediately", "get started in minutes", "get started overnight", "get started today",
    "get the ball rolling", "get the buzz", "get the facts", "get the final word", "get the freedom you want",
    "get the goods on", "get the inside track", "get the last laugh", "get the most for your money",
    "get the picture", "get the upper hand", "get them to buy", "get these incentives", "get to the top",
    "get together", "get top placement", "get top rankings", "get up the nerve", "get with it",
    "get your feet wet", "get your foot in the door", "get your hands on", "get your prospect's attention",
    "getting a bargain", "getting a discount", "getting a raise", "getting intense interest",
    "getting over obstacles", "ghost like", "ghostly", "giant", "giant like", "gift", "gift certificate",
    "gifted", "gifted marketer", "gigantic industry", "gigantic profit", "gimmick proof", "give and take",
    "give away", "give back", "give in", "give me a chance", "give up", "give you an insiders", "giveaway rights",
    "giveaways", "gives you more flexibility", "gives you new insight", "glad", "gladly", "glamorized",
    "glamour driven", "glare less", "glaring", "glass", "glass clear", "glassy", "glazed", "glimmer of",
    "glimmer of hope", "glimmering", "glitch proof", "glittering", "global", "global achiever",
    "global commerce", "global market", "global marketing", "globalize", "globe like", "gloomy", "glorified by",
    "glorious", "glory", "gloss", "glossy", "glowing", "glowing acknowledgments", "glowing forecast",
    "glowing reviews", "glowing testimonials", "glued together", "go", "go along for the ride",
    "go down in history", "go for broke", "go for it", "go for the gold", "go the distance", "go to town",
    "goal", "goal oriented", "goal setting", "goes both ways", "going away from", "going bananas over",
    "going like clockwork", "going on", "going public", "going through the roof", "going value", "gold",
    "gold digger", "gold medal", "gold mine at your fingertips", "gold mine of secrets", "gold plated",
    "gold rush", "golden", "golden opportunity", "gone instantly", "good", "good advice", "good afternoon",
    "good and ready", "good as gold", "good by", "good customer service", "good day", "good deal", "good evening",
    "good faith", "good health", "good humored", "good investment", "good judgment", "good listener",
    "good looking", "good luck", "good night", "good quality", "good reviews", "good sense", "good year",
    "goods", "goodwill", "goof proof", "goofy", "gossip", "governed", "government", "government established",
    "governmental", "grab their attention", "grab your", "grab your share", "grace period", "graceful",
    "graceful acknowledgments", "grade a", "gradual adjustment", "gradual increase", "graduate",
    "graduated from", "grainy", "grand", "grand adventure", "grand opening", "grand prize", "grand scale",
    "grand slam", "grand times", "grand tour", "grant yourself", "granted by", "grape flavored", "graphic",
    "grass roots", "grassy", "grateful", "gratification", "gratifying", "grave consequences", "gray colored",
    "greasy", "great", "great bargain", "great deal", "great deal of money", "great for beginners",
    "great for novices", "great significance", "great wealth", "greater", "greatest", "greed", "greedy",
    "green colored", "grenade like", "grief stricken", "grim results", "gritty", "gross", "gross earnings",
    "gross income", "gross revenue", "gross sales", "ground breaking", "ground breaking findings",
    "ground breaking solutions", "ground floor", "ground floor opportunity", "ground out", "ground shaking",
    "ground speed", "grounded", "group like", "group ware", "grouped", "grow", "grow up", "grow your business",
    "grow your practice", "growing", "growing commitment", "growing competition", "growing craze",
    "growing day by day", "growing demand", "growth fund", "growth industry", "growth patterns",
    "growth potential", "growth segment", "grueling hours", "guarantee", "guarantee your success",
    "guaranteed", "guaranteed income", "guaranteed success", "guaranteed to work", "guaranteed visitors",
    "guarantees", "guard against", "guarded", "guarded secrets", "guardian angel", "guess", "guesswork",
    "guest", "guide", "guided", "guided tour", "guiding force", "guilt", "guilty", "gunning", "guru",
    "gut like", "gutsy", "gutter less"
  ],
  "H": [
    "habit", "habit buying", "habit forming", "habitual", "hacker proof", "haggle the price", "hair raising",
    "hairy", "half baked", "half hearted", "half off", "half price", "halftone", "hand blistering", "hand blown",
    "hand carved", "hand crafted", "hand held", "hand made", "hand painted", "hand picked", "hand powered",
    "hand set", "hand stamped", "hand stenciled", "hand woven", "hand written", "handier", "handle the volume",
    "handling", "hands free", "hands free income", "hands free system", "hands on", "hands on demonstration",
    "hands on experience", "hands on information", "hands on training", "handsome", "handsome benefit",
    "handsome offer", "handsome profit", "handy", "handy guide", "handy order form", "handy reference",
    "hang onto your hat", "happy", "happy alternative", "happy feeling", "hard bitten", "hard core", "hard drive",
    "hard earned", "hard earned dollars", "hard earned money", "hard facts", "hard hearted", "hard hitting",
    "hard hitting appeal", "hard liner", "hard nose", "hard-nosed approach", "hard offer", "hard one",
    "hard pressed", "hard shelled", "hard to beat", "hard to find", "hard to get", "hard to pin down",
    "hard to resist", "hard up", "hard wired", "hard working people", "hard, cold facts", "hardball", "hardship",
    "hardware", "hardworking", "harmful", "harmless", "harness", "harness the power", "harsh economic times",
    "harshly", "harvest", "has been", "hassle free", "haunted by", "haunting beauty", "have a ball", "have a heart",
    "have access within minutes", "have it made", "have money to burn", "have the time of your life",
    "have them in your pocket", "have you", "have you been trying to", "have you ever asked yourself",
    "have you ever purchased an", "have you ever wanted", "have you ever wished", "haven't seen it anywhere else",
    "haven't you", "having a fulfilling career", "having authority", "having excellent credit",
    "having high investment returns", "having things easier", "having things faster", "hazardous free",
    "head fast", "head over heels", "head spinning", "head start", "head to head", "head turner", "head turning",
    "headache proof", "headline", "heads up", "headway", "healing", "healthy", "healthy flow of customers",
    "healthy income", "healthy portion", "heard working", "heart felt", "heart pounding", "heart rendering",
    "heart stirring discovery", "heart to heart advice", "heartfelt", "heartfelt appeal", "hearty",
    "hearty nutrients", "heat proof", "heat up", "heat up your sales", "heated", "heaven", "heaven sent",
    "heaven sent opportunity", "heavenly", "heavier", "heavily armed", "heavy", "heavy duty", "heavy handed",
    "heavy hitter", "heavy weight", "hefty", "hefty gain", "hefty profits", "heighten", "hell bent", "hell like",
    "hell or high water", "hello", "help", "help desk", "help you personally", "helped many", "helpful",
    "helpful invention", "helpful reference", "helpful service", "helpless", "helps you",
    "helps you ( ) every step of the way", "here are my credentials", "here is a summary", "here is how you can",
    "here to stay", "here's (no) reasons why you", "here's a fact for you", "here's a list of common",
    "here's a quick recap", "here's a small sample", "here's a summary of", "here's my actual check (your affiliate check)",
    "here's my web site stats", "here's proof", "here's something that will", "here's the bottom line",
    "here's what other say (testimonials)", "here's what you'll learn", "here's what you'll receive",
    "here's your opportunity to", "hero like", "heroic", "heroic status", "hesitant with", "hi", "hidden",
    "hidden gold mine", "hidden secrets", "hidden strengths", "hidden wealth", "high", "high achievement",
    "high and mighty", "high budget", "high caliber", "high click through rate", "high conversion ratio",
    "high cut", "high definition", "high degree of", "high demand", "high end features", "high energy level",
    "high ethical standards", "high expectations", "high flying", "high frequency", "high grade", "high hopes",
    "high impact strategies", "high income products", "high intensity", "high key agenda", "high level",
    "high level of expertise", "high level strategies", "high margin products", "high octane", "high paying",
    "high payoff", "high percentage", "high performance", "high pitched", "high potential", "high powered",
    "high pressure", "high priced", "high priority", "high probability", "high productive output", "high profile",
    "high profile industries", "high profit margin", "high profit potential", "high quality", "high quality company",
    "high quality goods", "high quality products", "high ranking", "high results", "high return",
    "high return investment", "high rise", "high rise enterprise", "high risk", "high roller", "high security",
    "high speed", "high speed traffic", "high spirited", "high standards", "high status lifestyle", "high strung",
    "high tech", "high tech innovation", "high tech service", "high tension", "high ticket items",
    "high turnover", "high velocity", "high voltage", "high wage", "higher", "higher click rates",
    "higher conversions", "higher income", "higher paying", "higher profit margins", "higher sales conversion",
    "highest", "highest paid people", "highest paying clients", "highest quality", "highest recommendation ever",
    "highest recommendations", "highest response anywhere", "highest standards", "highlighted",
    "highly acclaimed seminar", "highly ambitious", "highly articulate", "highly competitive", "highly complexed",
    "highly customizable", "highly endorsed", "highly guarded", "highly motivated", "highly organized",
    "highly persuasive", "highly prosperous people", "highly rated ( )", "highly regarded", "highly respected",
    "highly selective", "highly sensitive information", "highly skilled", "highly skilled marketers",
    "highly sophisticated", "highly specialized", "highly trained", "hilarious", "hire us", "hired by",
    "historic", "historic treasure", "historical material", "history making", "history of prior successes",
    "history rich", "hit and miss", "hit counter spinning", "hit or miss", "hit the bull's eye",
    "hit the jackpot", "hit their sweet spots", "hit's the spot", "hold prospects attention", "holiday",
    "holiday favorite", "hollow", "hollowed out", "home based business", "home business", "home grown",
    "home made", "home office", "home stead", "homemade", "honest", "honest methods", "honest truth", "honesty",
    "honor", "honorable", "honorary", "hook, line and sinker", "hope", "hopeful situation", "hordes of customers",
    "hordes of visitors", "horizon expanding", "horizontal", "horrendous figures", "horrible conditions",
    "horribly", "horrified by", "hospitable", "hospitality driven", "hosted by", "hostile competition",
    "hostile takeover", "hot", "hot and cold", "hot business model", "hot commodity", "hot issue", "hot product",
    "hot selling", "hot tempered", "hot ticket", "hotheaded", "hotshot", "hotter", "hottest", "hour long",
    "hourly", "how a simple", "how and where to", "how and why to", "how anyone can", "how come", "how do you",
    "how does", "how I ( ) in one week", "how I get at least", "how I made $", "how I once", "how I took a",
    "how important is", "how I've earned", "how many times have you", "how often to", "how one man",
    "how one person", "how one woman", "how to", "how to absolutely", "how to actually see", "how to add",
    "how to always", "how to automatically", "how to avoid", "how to become an", "how to build", "how to buy",
    "how to choose", "how to come up with", "how to create", "how to decide", "how to design",
    "how to determine your", "how to develop", "how to double", "how to earn", "how to eliminate",
    "how to ensure", "how to establish", "how to find", "how to gain", "how to generate", "how to get",
    "how to get rid of", "how to get your hands on", "how to give your", "how to have", "how to identify",
    "how to increase", "how to install", "how to instantly", "how to know exactly", "how to know if",
    "how to launch a", "how to legally", "how to literally", "how to locate", "how to maintain", "how to make",
    "how to manage", "how to never again", "how to obtain", "how to operate", "how to overcome", "how to pick",
    "how to present", "how to produce", "how to promote", "how to pull in $", "how to quickly", "how to reduce",
    "how to roll out", "how to select", "how to sell", "how to send", "how to set up", "how to spend",
    "how to spot", "how to start", "how to stop", "how to take", "how to tap into", "how to tell if",
    "how to triple", "how to turn", "how to use", "how understanding the", "how would you feel knowing",
    "how would you like to", "how you can", "how…?", "howdy", "huge amount", "huge collection", "huge compilation",
    "huge discount", "huge fortune", "huge industry", "huge money maker", "huge proportions", "huge quantities",
    "huge selection", "huge success", "human like", "humane", "humble", "humbling display", "humorless",
    "humorous", "hundreds", "hungry", "hungry crowd of customers", "hunky dory", "hurry", "hustle and bustle",
    "hustle proof", "hygiene", "hyped up", "hyper feeling", "hyperactive", "hypnotic", "hypnotic effects",
    "hypnotize", "hypnotized prospects", "hypoallergenic"
  ],
  "I": [
    "I (benefit) (no) thousand in (no) weeks", "I (benefit) in (no) days", "I (benefit) in (no) weeks",
    "I (benefit) over (no) %", "I (benefit) up to (no) %", "I (benefit)(no) pounds in (no) months",
    "I (benefits) leas than (no) hours", "I almost bought it again", "I am about to tell you a", "I am excited to",
    "I appreciate your interest", "I couldn't wait to", "I don't care if you're", "I don't care what",
    "I don't have to convince you of", "I don't want to waste", "I first got involved in", "I graduated from college",
    "I grew up in (location) in the (year)", "I have a confession to make", "I have a degree in",
    "I have first-hand experience", "I heard from", "I heard on (source) that", "I highly recommend",
    "I just have to say", "I know from experience", "I know this sounds", "I know you", "I know you don't have",
    "I know your busy", "I know your skeptical", "I know you've been", "I love it", "I normally charge",
    "I normally charge up to $", "I picture you", "I promise to", "I rarely endorse products but",
    "I rate it (no) out of (no)", "I read in a (source) that", "I remember back about ( ) years",
    "I saw on (source) that", "I sense you", "I stand behind the product", "I think you'll agree",
    "I trust you'll", "I was blown away", "I was reluctant at first", "I was skeptical but", "I would have paid",
    "icon like", "I'd like to make you a promise", "idea driven", "idea generation", "ideal", "ideal choice",
    "ideal condition", "ideal customer", "ideas", "identical", "identifiable", "identification checked",
    "identified", "idiot proof", "idiotic", "idol", "idolized by", "if I can do it you can", "if I were you",
    "if you", "if you already", "if you are looking for a simple", "if you are seriously",
    "if you aren't familiar with", "if you buy now", "if you could have", "if you give me (no) minutes to",
    "if you learn nothing else", "if you like the idea of", "if you really want to", "if you thought",
    "if you want a", "if you want the answers to", "if you want to know how", "if you would like to",
    "if you would like to learn", "if you're currently", "if you're like me", "if you're like most",
    "if you're looking for", "if you're planning to", "if you're ready to", "if you're serious about",
    "if you're tired of", "if you've been looking", "if you've been wanting to", "if you've ever thought about",
    "if you've ever wondered", "if you've read every", "if you've tried to", "if you've watched", "ignitable",
    "ignite your", "ignite your profits", "ignite your sales", "ignorant proof", "ignore the", "ill advised",
    "I'll also throw in", "I'll assume you've", "I'll be completely honest with you about",
    "I'll bet you anything that", "ill feeling", "I'll get straight to the point", "I'll help you", "ill judged",
    "I'll keep my word", "I'll make you a promise", "ill mannered", "ill nature", "I'll personally guarantee",
    "I'll refund your money", "I'll refund your purchase", "I'll show you how to", "I'll show you the following",
    "I'll show you where", "I'll teach you", "I'll tell you exactly how to", "I'll throw in (no) bonuses",
    "illegal", "illuminated", "I'm about to reveal to you", "I'm absolutely amazed", "I'm confident that",
    "I'm definitely impressed", "I'm going to show you", "I'm no rookie", "I'm not going to waste your time",
    "I'm not kidding", "I'm sensing that you", "I'm so (emotion) today", "I'm speechless",
    "I'm sure you agree with", "I'm sure you heard of", "I'm sure you know from experience",
    "I'm sure you'll agree that", "I'm sure you're", "I'm very satisfied", "image driven", "imaginable",
    "imaginary", "imagination friendly", "imagine making $", "imagine that", "imagined by", "immeasurable",
    "immeasurable importance", "immediate", "immediate access", "immediate action", "immediate cash flow",
    "immediate cash surge", "immediate change", "immediately", "immediately after you order",
    "immediately downloadable", "immense appeal", "immense fortune", "immense improvement", "immense relief",
    "immense satisfaction", "immense size", "immerse yourself with", "immobilize your", "immoral", "immortal",
    "immovable", "immune to", "impacted by", "impeccable", "impeccable guide", "impeccable policy",
    "impeccable reputation", "imperial", "implemented", "important", "important addition", "important factor",
    "imported", "impose your", "impossible", "impossible to fail", "impractical", "impress your",
    "impression driven", "impressive", "impressive ability", "impressive demonstration", "impressive findings",
    "impressive packaging", "impressive statistics", "impressive technology", "imprinted", "improper to",
    "improve", "improve customer retention", "improve customer service", "improve every area of your life",
    "improve link popularity", "improve your business", "improve your lifestyle", "improve your sales",
    "improved", "improvement", "improvise", "impulse buying", "impulse like", "impulsive", "in",
    "in (month/year)", "in (no) or less", "in (year)", "in (year) I", "in a big way", "in a few minutes",
    "in a flash", "in business for (no.) decades", "in case", "in charge of", "in close", "in constant demand",
    "in demand", "in demand product", "in depth", "in depth analysis", "in depth report", "in depth study",
    "in excellent condition", "in flesh and blood", "in full swing", "in hot pursuit", "in house",
    "in less than no time", "in line", "in minutes", "in my humble opinion", "in my opinion",
    "in order to ( ) you need", "in prelaunch", "in record numbers", "in season", "in seconds",
    "in short supply", "in stock", "in store", "in style", "in the bag", "in the black", "in the lap of luxury",
    "in the long run", "in the next (no) minutes", "in the nick of time", "in the red",
    "in this article you're going to", "in this day and age", "in this letter you're going to",
    "in this report you're going to", "in today's", "in your best interests", "in your spare time", "inactive",
    "inappropriate", "in-between jobs", "inbound", "incalculable profits", "incalculable worth", "incapable of",
    "incentives", "inch by inch", "incidental", "included with", "includes (no) issues",
    "includes a high tech formula for", "includes useful resources", "income", "income enhancing",
    "income literally overnight", "income on the line", "income statement", "income stream", "income tax",
    "incoming", "incomparable", "incompatible of", "incomplete", "inconceivable", "inconclusive",
    "inconsiderate businesses", "inconspicuous", "incontestable", "incontestable proof", "inconvenient",
    "incorporate", "incorporated", "incorporation", "incorrect numbers", "increase", "increase affiliate commissions",
    "increase leads", "increase leverage", "increase perceived value", "increase profits", "increase readership",
    "increase renewals", "increase sales", "increase sales anytime", "increase subscribers",
    "increase the dollar value", "increase their average order amount", "increase your",
    "increase your bank account", "increase your cash flow", "increase your closing ratio",
    "increase your popularity", "increase your sales volume", "increase your success", "increased", "increasing",
    "increasing affiliate partners", "increasing profits", "increasing sales", "increasing traffic",
    "incredible", "incredible announcement", "incredible results", "incredible sight",
    "incredible sums of money", "incredibly easy", "incredibly low budget", "indebted to helping you",
    "indeed you can", "indefinite supply", "independence", "independent", "independent company",
    "independent contractor", "independent professionals", "indestructible", "indestructible material",
    "indexed by", "indispensable", "indispensable component", "indisputable evidence", "indisputable proof",
    "individual effort", "indoor", "indulge in", "industrial", "industrial strength", "industrialized",
    "industry", "industry experts", "industry leader", "industry leading", "industry secrets",
    "industry's leading experts", "ineffective", "inefficient", "ineligible for", "inestimable benefits",
    "inexpensive", "infamous", "inferior to", "infiltrate your", "infinite benefits", "infinite possibilities",
    "infinity", "inflatable", "inflated prices", "inflation prone economy", "inflation proof", "influence",
    "influence buying behavior", "influence others", "influence your prospects", "influenced by", "infomercial",
    "inform yourself on", "informal", "information", "information highway", "information superhighway",
    "informational", "informed", "informed advice", "ingenious", "ingenious design", "ingenious mechanics",
    "ingenious methods", "ingenious tactics", "ingenious technique", "ingredient", "inhabited by",
    "inherit our", "inhuman", "inhumane", "initial", "initial public offering", "initially employed",
    "injury free", "inner", "inner circle", "innermost", "innocent", "innovated", "innovation",
    "innovative", "innovative approach", "innovative concept", "innovative creation", "innovative skills",
    "innovator in", "inopportune time", "ins and outs", "insane", "insane amounts of traffic", "insane not to buy",
    "insanely profitable", "inscribed with", "insecure", "inside", "inside knowledge", "insider discoveries",
    "insider information", "insider knowledge", "insider secrets to", "insightful", "inspected by",
    "inspection checked", "inspiration", "inspired", "installation free", "installed", "installed by",
    "installment plan", "instant", "instant access", "instant access product", "instant acclaim",
    "instant e-mail notifications", "instant fortune", "instant impacted", "instant magic", "instant message",
    "instant money machine", "instant reference", "instant relief", "instant results", "instant success",
    "instantaneous", "instantly", "instantly learn", "instituted by", "institution like", "instructed",
    "instructional", "instructions", "instrumental in", "insubstantial amount of", "insufficient",
    "insufficient income", "insulated", "insurable", "insurance", "insure yourself", "insured by",
    "indicted", "intangible", "integral part", "integrate your", "integrated by", "integrity", "intellect",
    "intellectual", "intellectual atmosphere", "intellectual property", "intellectually",
    "intellectually appealing", "intelligence", "intelligent", "intense", "intense commitment",
    "intensify your sales", "intensive study", "intent on", "interactive", "interactive experience",
    "interchangeable", "interest free", "interest free findings", "interest less", "interest rate",
    "interesting", "interesting adventure", "interesting developments", "interesting invention",
    "interfaced with", "interior designed", "interlocking", "intermediate", "internal problem",
    "internally secret", "international", "international acclaim", "international attention",
    "international best seller", "international reputation", "internationally known", "Internet",
    "Internet access", "Internet marketing", "Internet marketing guru", "Internet presence",
    "interpreted by", "interrupt your", "intervention", "interview free", "interviewed by",
    "intimate moment", "intoxicating", "intriguing", "intriguing collection", "intriguing details",
    "intriguing features", "intriguing ideas", "intriguing results", "intriguing scene", "introducing",
    "introduction", "introductory offer", "introductory price", "introductory price of only", "intruder proof",
    "intuition driven", "intuitive", "invalid", "invaluable", "invaluable advice", "invaluable facts",
    "invaluable help", "invent your future", "invented", "invention", "inventive", "inventive tactics",
    "inventory controlled", "inverted", "invest in our product today", "invest now", "invest today and receive",
    "invested in", "investigate", "investigated by", "investigation", "investigative", "investing",
    "investment", "investment bank", "investment banker", "investment quality", "investor like", "invincible",
    "invisible", "invite your friends", "invited by", "inviting", "inviting offer", "invoiced by",
    "involuntary", "involve yourself", "involved in", "iron like", "ironclad", "irrefutable", "irreplaceable",
    "irresistible", "irresistible appeal", "irresistible magnetism", "irresistible sales letter",
    "irresistible temptation", "irresponsibility", "is ( ) a problem for you", "is it possible that",
    "isolate yourself from", "issued by", "it actually delivers", "it blows my mind", "it can't be matched",
    "it can't hurt", "it could mean the difference", "it could take you years", "it doesn't matter how",
    "it far exceeded my wildest", "it has been about (no) years since", "it is by far", "it is for people that",
    "it over delivers", "it seems that everywhere", "it simply works", "it surprises me how most people",
    "it took (time) of research", "it walks you through", "it was just another typical day", "it would take several",
    "it's (time) on a (day)", "it's a fact that", "it's a steal", "it's absolutely crucial you learn",
    "it's all covered in", "it's all here", "it's allowed me to", "it's almost ( ) years old",
    "it's better than nothing", "it's common knowledge that", "it's critical to have this information",
    "it's important to understand that", "it's in our (no) year", "it's just what you need",
    "it's more like a library", "it's not for everyone", "it's not the same old ( ) you use to", "it's numbered",
    "it's quite obvious", "it's sold over (no) copies", "it's that good", "it's the only ( ) that", "itty bitty",
    "I've discovered a", "I've found the secret to", "I've just put together", "I've personally found",
    "I've recently", "I've recently developed a", "I've sold over $", "I've taught",
    "I've taught ( ) seminars about", "I've written", "I've written over ( ) on"
  ],
  "J": [
    "jacked up fees", "jam packed", "jargon free", "jargon less", "jaw dropping", "jazz up your sales",
    "jealous feeling", "jealously guarded", "jeopardizing your", "jerked around", "jet lagged", "jewel like",
    "job satisfaction", "jobless", "join now"
  ]
};

// INITIAL COMMONLY MISSPELLED WORDS DICTIONARY (A-Z FULLY POPULATED)
const INITIAL_MISSPELLED_DICTIONARY: Record<string, string[]> = {
  "A": [
    "abandon", "abdomen", "abductor", "abet", "abortion", "absence", "absolutely", "accelerate", "acceptance",
    "access", "accessory", "accidental", "accommodate", "accomplice", "accosted", "accused", "acetylene",
    "acknowledge", "acquit", "acquittal", "address", "adjourn", "admissible", "appearance", "appellant",
    "apprehended", "appropriate", "arctic", "adolescent", "adversary", "advice", "affidavit", "aggravate",
    "aisle", "alcohol", "alias", "alibi", "all right", "Alzheimer's", "amalgamation", "ambulance", "amended",
    "ammunition", "among", "amphetamine", "analyse", "annual", "anonymous", "antiseptic", "aorta",
    "apparatus", "apparent", "arraignment", "arrangement", "arrears", "arson", "artifact", "asphyxiate",
    "assailant", "assassin", "assessment", "assistant", "asthma", "attachment", "attest", "attorney",
    "audible", "autopsy", "auxiliary"
  ],
  "B": [
    "bail", "bailiff", "balaclava", "ballistics", "barbiturate", "barrel", "barricade", "barrister", "battalion",
    "bayonet", "bazaar", "beginning", "believe", "belligerent", "beneficiary", "bias", "bicycle", "bludgeon",
    "bona fide", "boulevard", "brilliant", "broccoli", "bruise", "bulletin", "bureau", "burglarize", "business", "bystander"
  ],
  "C": [
    "cadaver", "caffeine", "calendar", "caliber", "camaraderie", "campaign", "cancel", "canine", "cannabis sativa",
    "capable", "cardiac", "cartridge", "cassette", "casualties", "category", "Caucasian", "ceiling", "cemetery",
    "censor", "changeable", "chattel", "circumstantial", "citation", "civilian", "cocaine", "coerce", "cognizance",
    "coincidence", "collateral", "colleague", "collusion", "comatose", "commission", "commitment", "committee",
    "compel", "competent", "complainant", "complicity", "conceive", "concurrent", "condemn", "confidential",
    "confiscate", "conjugal", "conscientious", "conscious", "consciousness", "consensus", "conspicuous",
    "conspirator", "constitutional", "contagious", "contempt", "contraband", "contraceptive", "controversy",
    "conviction", "convulsion", "coroner", "corpse", "correspondence", "corroborate", "counterfeit", "courteous",
    "credibility", "cremate", "culprit", "custody", "cylinder"
  ],
  "D": [
    "database", "decapitated", "decease", "deceased", "deceive", "decision", "defendant", "deferred", "definite",
    "delegate", "deliberate", "delinquent", "dependent", "descend", "descent", "description", "desperate", "detain",
    "detention", "deterrent", "detonator", "development", "deviant", "deviation", "device", "diabetes", "diagonal",
    "diarrhea", "dilemma", "disagreeable", "disastrous", "discrepancy", "discriminate", "dispatcher", "disposition",
    "divulge", "domicile", "dominant", "drunkenness", "duress", "dynamite", "dysfunction"
  ],
  "E": [
    "earnest", "ecstasy", "efficient", "electrocution", "elicit", "eligible", "eliminate", "embarrass", "embezzle",
    "eminent", "enforceable", "entirely", "environment", "epileptic", "equestrian", "equivalent", "erratic",
    "escalator", "espionage", "ethical", "evangelist", "evidence", "exaggerate", "excessive", "excite", "execution",
    "exercise", "exhausted", "exhibit", "extenuating", "external", "extradited", "extremely"
  ],
  "F": [
    "facility", "fallacy", "falsify", "fascinate", "fatality", "February", "felon", "fictitious", "fiery",
    "flexible", "fluorescent", "forceps", "forcible", "forehead", "foreign", "forensic", "formula", "fraudulent", "fugitive"
  ],
  "G": [
    "gauge", "genuine", "geriatric", "gonorrhea", "gouge", "government", "graffiti", "grateful", "grievance",
    "grievous", "grudge", "guarantee", "guerilla", "gymnasium"
  ],
  "H": [
    "habitual", "hallucinate", "hallucinogen", "handcuff", "harass", "harbour", "hazard", "hazardous", "height",
    "heroin", "homicidal", "homicide", "horizontal", "hostile", "humorous", "hygiene", "hypodermic", "hysteria", "hysterical"
  ],
  "I": [
    "identical", "ideology", "illegitimate", "illicit", "illustrate", "immediate", "immigrant", "imminent",
    "impediment", "impostor", "inadmissible", "incapable", "incapacitate", "incarcerate", "incendiary", "incessant",
    "incite", "incoherent", "inconspicuous", "incorrigible", "incriminate", "indecent", "independent", "indictment",
    "indispensable", "inevitable", "infanticide", "informant", "infringement", "ingenious", "initiate", "injunction",
    "inoculate", "insolent", "institute", "insufficient", "interpreter", "interrogate", "intoxicate", "investigator",
    "irrelevant", "irresistible", "itinerary"
  ],
  "J": [
    "jamb", "jealous", "jeopardy", "jewelry", "judgment", "judicial", "jurisdiction"
  ],
  "K": [
    "ketchup", "khaki", "kidnap", "kidnapper", "kleptomania", "knife", "knowledge"
  ],
  "L": [
    "laceration", "language", "larceny", "legislate", "legitimate", "leisure", "lenient", "liability", "liaison",
    "libelous", "librarian", "library", "license", "licentious", "lien", "litigant", "lucid"
  ],
  "M": [
    "magazine", "magistrate", "maintain", "maintenance", "malice", "malign", "management", "mandatory", "manila",
    "manipulate", "maneuver", "marijuana", "massacre", "mathematics", "measurements", "median", "mediation",
    "mediocre", "memorandum", "menace", "methadone", "mileage", "militia", "millennium", "miniature", "minor",
    "miscarriage", "miscellaneous", "mischievous", "misdemeanour", "misspell", "misspelled", "mitigating",
    "moccasin", "monotonous", "moratorium", "morgue", "mortal", "mortgage", "mortuary", "mucous", "municipal",
    "mutilate", "muzzle", "mysterious"
  ],
  "N": [
    "narcotics", "necessary", "negative", "negligence", "negotiate", "neighbor", "neighbour", "neutral", "nominal",
    "notary", "notorious", "nuclear", "nuisance", "nullify"
  ],
  "O": [
    "obedient", "obligation", "obscenity", "occasion", "occult", "occupant", "occurrence", "odyssey", "official",
    "omission", "opponent", "ordinance", "orient", "orthodox"
  ],
  "P": [
    "parachute", "paraffin", "parallel", "paramedic", "paraphernalia", "pavilion", "pedestrian", "penitentiary",
    "permissible", "persistent", "personal", "personnel", "pertinent", "phallic", "physician", "piece", "pigeon",
    "plaintiff", "playwright", "polygraph", "positive", "possession", "potential", "precede", "prejudice",
    "preliminary", "premises", "prescription", "priority", "privilege", "probable", "procedure", "proceed",
    "prohibition", "projectile", "prominent", "propeller", "prophylactic", "prosecute", "prosecutor", "prostitute",
    "prostitution", "protester", "psilocybin", "psychiatrist", "psychopathic", "pumpkin", "punitive", "pursue", "pyromaniac"
  ],
  "Q": [
    "quadrant", "quadriplegic", "quarantine", "quarrel", "query", "questionnaire", "quinine", "quotation"
  ],
  "R": [
    "rabies", "racketeer", "raspberry", "reasonable", "receding", "receipt", "receive", "recidivist", "recognizance",
    "recommend", "reconcile", "reconnaissance", "reformatory", "refute", "reinforcement", "relevant", "religious",
    "relinquish", "remission", "rendezvous", "repeal", "representative", "reprieve", "rescue", "resident", "residue",
    "respiration", "restaurant", "resuscitate", "rhythm", "ricochet", "ritual", "routine"
  ],
  "S": [
    "sabotage", "sacrifice", "sacrilegious", "salvage", "scenario", "schedule", "scheme", "schizophrenic", "science",
    "scissors", "seize", "seniority", "sentence", "separate", "separation", "sequence", "sequester", "sergeant",
    "serial", "severance", "sexual", "sheriff", "siege", "silhouette", "simultaneous", "sincerely", "skeleton",
    "sociopath", "solicit", "solicitor", "soluble", "special", "specimen", "spectator", "spontaneous", "strenuous",
    "subpoena", "suffocate", "suicide", "suppress", "surrogate", "surveillance", "susceptible", "suspect", "suspension",
    "suspicious", "symmetrical", "symptom", "synagogue", "syphilis", "syringe"
  ],
  "T": [
    "tactical", "tariff", "tattoo", "taut", "technique", "temperament", "tendency", "terrorism", "testify",
    "testimony", "thief", "thorough", "through", "toboggan", "torture", "tournament", "trajectory", "tranquillizer",
    "trauma", "trespass", "truancy", "truly"
  ],
  "U": [
    "ultimatum", "umbrella", "unanimous", "uncooperative", "unlawful", "unmistakable", "until", "urinate", "useful",
    "utility", "utilize"
  ],
  "V": [
    "vacuum", "vagrancy", "validate", "vandal", "variance", "vehicle", "vein", "velocity", "venereal", "vengeance",
    "verdict", "verify", "version", "veterinarian", "vicinity", "vicious", "vigilante", "violation", "violence",
    "viscous", "visible", "volatile", "voluntary", "voucher"
  ],
  "W": [
    "waiver", "warrant", "weapon", "wedge", "Wednesday", "weird", "wholesale", "wiretap", "withdrawal", "witness",
    "worship", "wound"
  ],
  "X": [
    "Xerox", "X-ray"
  ],
  "Y": [
    "yacht", "yield", "you're", "youth"
  ],
  "Z": [
    "zealot", "zinc", "zircon"
  ]
};

// INITIAL EMOTIONAL TRIGGER WORDS DICTIONARY (A-Z POPULATED)
const INITIAL_EMOTIONAL_DICTIONARY: Record<string, string[]> = {
  "A": ["agony", "amazing", "anniversary", "arrogant", "avenge"],
  "B": ["banned", "basic", "before you forget…", "best", "big", "blissful", "bonus", "boost", "bright", "burned"],
  "C": ["complete", "conspiracy", "controversial", "create", "cruel", "cure"],
  "D": ["deadline", "delightful", "destiny", "discover", "disinformation"],
  "E": ["easy", "empower", "energize", "exclusive", "exposed", "extra", "extraordinary"],
  "F": ["first", "fleece", "floundering", "flush", "free"],
  "G": ["greed", "guarantee"],
  "H": ["had enough?", "hate", "health", "help", "helpless", "hot", "hot special", "how to"],
  "I": ["immediately", "improve", "insider"],
  "J": ["jubilant"],
  "K": ["know"],
  "L": ["latest", "learn", "limited"],
  "M": ["money", "more"],
  "N": ["never again…", "new", "now"],
  "O": ["overcome"],
  "P": ["paralyzed", "payback", "plus!", "pointless", "powerful", "premiere", "profit", "protect", "proven"],
  "R": ["rave", "reclaim", "results"],
  "S": ["safety", "save", "seize", "surrender", "swindle"],
  "T": ["taboo", "temporary fix", "thrilled", "tired", "today", "trust", "turn the tables"],
  "U": ["ultimate", "understand", "undo", "unscrupulous"],
  "V": ["vibrant", "vindication"],
  "W": ["while it’s fresh on your mind", "win", "worst"],
  "Y": ["you"]
};

// INITIAL NEGATIVE WORDS DICTIONARY (A-Z POPULATED)
const INITIAL_NEGATIVE_DICTIONARY: Record<string, string[]> = {
  "A": ["abysmal", "adverse", "alarming", "angry", "annoy", "anxious", "apathy", "appalling", "atrocious", "awful"],
  "B": ["bad", "banal", "barbed", "belligerent", "bemoan", "beneath", "boring", "broken"],
  "C": ["callous", "can't", "clumsy", "coarse", "cold", "cold-hearted", "collapse", "confused", "contradictory", "contrary", "corrosive", "corrupt", "crazy", "creepy", "criminal", "cruel", "cry", "cutting"],
  "D": ["damage", "damaging", "dastardly", "dead", "decaying", "deformed", "deny", "deplorable", "depressed", "deprived", "despicable", "detrimental", "dirty", "disease", "disgusting", "disheveled", "dishonest", "dishonorable", "dismal", "distress", "don't", "dreadful", "dreary"],
  "E": ["enraged", "eroding", "evil"],
  "F": ["fail", "faulty", "fear", "feeble", "fight", "filthy", "foul", "frighten", "frightful"],
  "G": ["gawky", "ghastly", "grave", "greed", "grim", "grimace", "gross", "grotesque", "gruesome", "guilty"],
  "H": ["haggard", "hard", "hard-hearted", "harmful", "hate", "hideous", "homely", "horrendous", "horrible", "hostile", "hurt", "hurtful"],
  "I": ["icky", "ignore", "ignorant", "ill", "immature", "imperfect", "impossible", "inane", "inelegant", "infernal", "injure", "injurious", "insane", "insidious", "insipid"],
  "J": ["jealous", "junky"],
  "L": ["lose", "lousy", "lumpy"],
  "M": ["malicious", "mean", "menacing", "messy", "misshapen", "missing", "misunderstood", "moan", "moldy", "monstrous"],
  "N": ["naive", "nasty", "naughty", "negate", "negative", "never", "no", "nobody", "nondescript", "nonsense", "not", "noxious"],
  "O": ["objectionable", "odious", "offensive", "old", "oppressive"],
  "P": ["pain", "perturb", "pessimistic", "petty", "plain", "poisonous", "poor", "prejudice"],
  "Q": ["questionable", "quirky", "quit"],
  "R": ["reject", "renege", "repellant", "reptilian", "repulsive", "repugnant", "revenge", "revolting", "rocky", "rotten", "rude", "ruthless"],
  "S": ["sad", "savage", "scare", "scary", "scream", "severe", "shoddy", "shocking", "sick", "sickening", "sinister", "slimy", "smelly", "sobbing", "sorry", "spiteful", "sticky", "stinky", "stormy", "stressful", "stuck", "stupid", "substandard", "suspect", "suspicious"],
  "T": ["tense", "terrible", "terrifying", "threatening"],
  "U": ["ugly", "undermine", "unfair", "unfavorable", "unhappy", "unhealthy", "unjust", "unlucky", "unpleasant", "unsatisfactory", "unsightly", "untoward", "unwanted", "unwelcome", "unwholesome", "unwieldy", "unwise", "upset"],
  "V": ["vice", "vicious", "vile", "villainous", "vindictive"],
  "W": ["wary", "weary", "wicked", "woeful", "worthless", "wound"],
  "Y": ["yell", "yucky"],
  "Z": ["zero"]
};

const ALL_LETTERS = ["#", "$", "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"];

export const PowerWordsReference: React.FC = () => {
  const [activeViewMode, setActiveViewMode] = useState<"triggers" | "hypnotic" | "misspelled" | "emotional" | "negative">("triggers");
  const [powerWords, setPowerWords] = useState<PowerWord[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedSubcategory, setSelectedSubcategory] = useState<string>("all");
  const [selectedPressureLevel, setSelectedPressureLevel] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [copiedWord, setCopiedWord] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);

  // HYPNOTIC WORDS STATE
  const [hypnoticDict, setHypnoticDict] = useState<Record<string, string[]>>(INITIAL_HYPNOTIC_DICTIONARY);
  const [selectedLetter, setSelectedLetter] = useState<string>("J");
  const [showAddHypnoticModal, setShowAddHypnoticModal] = useState<boolean>(false);
  const [targetLetterToAdd, setTargetLetterToAdd] = useState<string>("K");
  const [bulkHypnoticInput, setBulkHypnoticInput] = useState<string>("");

  // COMMONLY MISSPELLED WORDS STATE
  const [misspelledDict, setMisspelledDict] = useState<Record<string, string[]>>(INITIAL_MISSPELLED_DICTIONARY);
  const [selectedMisspelledLetter, setSelectedMisspelledLetter] = useState<string>("B");
  const [targetMisspelledLetterToAdd, setTargetMisspelledLetterToAdd] = useState<string>("B");

  // EMOTIONAL TRIGGER WORDS STATE
  const [emotionalDict, setEmotionalDict] = useState<Record<string, string[]>>(INITIAL_EMOTIONAL_DICTIONARY);
  const [selectedEmotionalLetter, setSelectedEmotionalLetter] = useState<string>("A");
  const [targetEmotionalLetterToAdd, setTargetEmotionalLetterToAdd] = useState<string>("A");

  // NEGATIVE WORDS STATE
  const [negativeDict, setNegativeDict] = useState<Record<string, string[]>>(INITIAL_NEGATIVE_DICTIONARY);
  const [selectedNegativeLetter, setSelectedNegativeLetter] = useState<string>("A");
  const [targetNegativeLetterToAdd, setTargetNegativeLetterToAdd] = useState<string>("A");

  // ALL CATEGORIES EXPANDED BY DEFAULT FOR PSYCHOLOGICAL TRIGGERS
  const [expandedCategories, setExpandedCategories] = useState<string[]>(
    CATEGORIES.map((c) => c.value)
  );

  const [selectedWord, setSelectedWord] = useState<PowerWord | null>(null);

  const [newWord, setNewWord] = useState({
    word: "",
    category: "urgency_scarcity",
    subcategory: "",
    pressureLevel: "medium" as "low" | "medium" | "high",
    psychology: "",
    appUseCase: "",
    examples: [] as string[],
  });

  useEffect(() => {
    fetchPowerWords();
  }, []);

  const fetchPowerWords = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/admin/click-campaigns/powerwords");
      const data = await response.json();
      if (data.success && data.data) {
        setPowerWords(data.data);
      }
    } catch (error) {
      console.error("Failed to fetch power words:", error);
    } finally {
      setLoading(false);
    }
  };

  const copyWord = (word: string) => {
    navigator.clipboard.writeText(word);
    setCopiedWord(word);
    setTimeout(() => setCopiedWord(null), 2000);
  };

  const toggleCategoryExpand = (categoryValue: string) => {
    setExpandedCategories((prev) =>
      prev.includes(categoryValue)
        ? prev.filter((c) => c !== categoryValue)
        : [...prev, categoryValue]
    );
  };

  const toggleExpandAll = () => {
    if (expandedCategories.length === CATEGORIES.length) {
      setExpandedCategories([]);
    } else {
      setExpandedCategories(CATEGORIES.map((c) => c.value));
    }
  };

  // ADD BULK PHRASES FOR A SPECIFIC LETTER
  const handleAddBulkPhrases = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bulkHypnoticInput) return;

    const parsedPhrases = bulkHypnoticInput
      .split(/,|\n|\s{2,}/)
      .map((p) => p.trim())
      .filter(Boolean);

    if (activeViewMode === "negative") {
      setNegativeDict((prev) => {
        const existing = prev[targetNegativeLetterToAdd] || [];
        return {
          ...prev,
          [targetNegativeLetterToAdd]: Array.from(new Set([...existing, ...parsedPhrases])),
        };
      });
      setSelectedNegativeLetter(targetNegativeLetterToAdd);
    } else if (activeViewMode === "misspelled") {
      setMisspelledDict((prev) => {
        const existing = prev[targetMisspelledLetterToAdd] || [];
        return {
          ...prev,
          [targetMisspelledLetterToAdd]: Array.from(new Set([...existing, ...parsedPhrases])),
        };
      });
      setSelectedMisspelledLetter(targetMisspelledLetterToAdd);
    } else if (activeViewMode === "emotional") {
      setEmotionalDict((prev) => {
        const existing = prev[targetEmotionalLetterToAdd] || [];
        return {
          ...prev,
          [targetEmotionalLetterToAdd]: Array.from(new Set([...existing, ...parsedPhrases])),
        };
      });
      setSelectedEmotionalLetter(targetEmotionalLetterToAdd);
    } else {
      setHypnoticDict((prev) => {
        const existing = prev[targetLetterToAdd] || [];
        return {
          ...prev,
          [targetLetterToAdd]: Array.from(new Set([...existing, ...parsedPhrases])),
        };
      });
      setSelectedLetter(targetLetterToAdd);
    }

    setShowAddHypnoticModal(false);
    setBulkHypnoticInput("");
  };

  const addWord = async () => {
    try {
      const response = await fetch("/api/admin/click-campaigns/powerwords", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...newWord,
          isActive: true,
        }),
      });

      const data = await response.json();
      if (data.success) {
        await fetchPowerWords();
        setShowAddModal(false);
        setNewWord({
          word: "",
          category: "urgency_scarcity",
          subcategory: "",
          pressureLevel: "medium",
          psychology: "",
          appUseCase: "",
          examples: [],
        });
      }
    } catch (error) {
      console.error("Failed to add word:", error);
    }
  };

  const deleteWord = async (id: string) => {
    try {
      await fetch(`/api/admin/click-campaigns/powerwords/${id}`, {
        method: "DELETE",
      });
      await fetchPowerWords();
    } catch (error) {
      console.error("Failed to delete word:", error);
    }
  };

  const filteredWords = powerWords.filter(word => {
    const matchesCategory = selectedCategory === "all" || word.category === selectedCategory;
    const matchesSubcategory = selectedSubcategory === "all" || word.subcategory === selectedSubcategory;
    const matchesPressure = selectedPressureLevel === "all" || word.pressureLevel === selectedPressureLevel;
    const matchesSearch = word.word.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         (word.synonyms?.some(s => s.toLowerCase().includes(searchQuery.toLowerCase())));
    return matchesCategory && matchesSubcategory && matchesPressure && matchesSearch;
  });

  const wordsByCategory = CATEGORIES.reduce((acc, category) => {
    acc[category.value] = powerWords.filter(w => w.category === category.value);
    return acc;
  }, {} as Record<string, PowerWord[]>);

  // TOTAL COUNTS
  const totalHypnoticPhrasesCount = Object.values(hypnoticDict).reduce((acc, list) => acc + (list?.length || 0), 0);
  const totalMisspelledWordsCount = Object.values(misspelledDict).reduce((acc, list) => acc + (list?.length || 0), 0);
  const totalEmotionalWordsCount = Object.values(emotionalDict).reduce((acc, list) => acc + (list?.length || 0), 0);
  const totalNegativeWordsCount = Object.values(negativeDict).reduce((acc, list) => acc + (list?.length || 0), 0);

  // FILTERED LISTS FOR SELECTED LETTERS
  const activeHypnoticList = (hypnoticDict[selectedLetter] || []).filter((phrase) => phrase.toLowerCase().includes(searchQuery.toLowerCase()));
  const activeMisspelledList = (misspelledDict[selectedMisspelledLetter] || []).filter((word) => word.toLowerCase().includes(searchQuery.toLowerCase()));
  const activeEmotionalList = (emotionalDict[selectedEmotionalLetter] || []).filter((word) => word.toLowerCase().includes(searchQuery.toLowerCase()));
  const activeNegativeList = (negativeDict[selectedNegativeLetter] || []).filter((word) => word.toLowerCase().includes(searchQuery.toLowerCase()));

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <RefreshCw className="w-8 h-8 text-slate-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* TOP HEADER & MODE SWITCHER */}
      <div className="bg-slate-900 border border-slate-800 p-5 rounded-3xl shadow-xl flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative overflow-hidden">
        <div>
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-gradient-to-tr from-purple-600 to-indigo-600 rounded-2xl shadow-lg shadow-purple-600/30">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-100">Power Words & Hypnotic Copy Vault</h3>
              <p className="text-xs text-slate-400 mt-0.5">
                {activeViewMode === "triggers"
                  ? `Psychological trigger words for high-converting copy (${powerWords.length} words loaded)`
                  : activeViewMode === "hypnotic"
                  ? `Hypnotic A-Z Copywriting Phrases Dictionary (${totalHypnoticPhrasesCount} hypnotic phrases loaded)`
                  : activeViewMode === "misspelled"
                  ? `Commonly Misspelled Words A-Z Dictionary (${totalMisspelledWordsCount} words loaded across A-Z)`
                  : activeViewMode === "emotional"
                  ? `Emotional Trigger Words A-Z Dictionary (${totalEmotionalWordsCount} emotional trigger words loaded)`
                  : `Negative Words A-Z Dictionary (${totalNegativeWordsCount} negative words loaded)`}
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* MODE TOGGLE SWITCH */}
          <div className="bg-slate-950 p-1 rounded-2xl border border-slate-800 flex items-center gap-1">
            <button
              onClick={() => setActiveViewMode("triggers")}
              className={`px-3 py-2 rounded-xl text-xs font-extrabold flex items-center gap-1.5 transition ${
                activeViewMode === "triggers"
                  ? "bg-blue-600 text-white shadow-md shadow-blue-600/30"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <Target className="w-3.5 h-3.5" /> Triggers ({powerWords.length})
            </button>

            <button
              onClick={() => setActiveViewMode("hypnotic")}
              className={`px-3 py-2 rounded-xl text-xs font-extrabold flex items-center gap-1.5 transition ${
                activeViewMode === "hypnotic"
                  ? "bg-purple-600 text-white shadow-md shadow-purple-600/30"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-yellow-300" /> 🌀 Hypnotic ({totalHypnoticPhrasesCount})
            </button>

            <button
              onClick={() => setActiveViewMode("misspelled")}
              className={`px-3 py-2 rounded-xl text-xs font-extrabold flex items-center gap-1.5 transition ${
                activeViewMode === "misspelled"
                  ? "bg-amber-600 text-white shadow-md shadow-amber-600/30"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <Edit3 className="w-3.5 h-3.5 text-amber-300" /> ✏️ Misspelled ({totalMisspelledWordsCount})
            </button>

            <button
              onClick={() => setActiveViewMode("emotional")}
              className={`px-3 py-2 rounded-xl text-xs font-extrabold flex items-center gap-1.5 transition ${
                activeViewMode === "emotional"
                  ? "bg-rose-600 text-white shadow-md shadow-rose-600/30"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <Heart className="w-3.5 h-3.5 text-rose-300 fill-rose-300/30" /> 💖 Emotional ({totalEmotionalWordsCount})
            </button>

            <button
              onClick={() => setActiveViewMode("negative")}
              className={`px-3 py-2 rounded-xl text-xs font-extrabold flex items-center gap-1.5 transition ${
                activeViewMode === "negative"
                  ? "bg-red-700 text-white shadow-md shadow-red-700/30"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <ThumbsDown className="w-3.5 h-3.5 text-red-300" /> ⚠️ Negative ({totalNegativeWordsCount})
            </button>
          </div>

          {activeViewMode === "triggers" ? (
            <>
              <button
                onClick={toggleExpandAll}
                className="px-3.5 py-2.5 bg-slate-950 border border-slate-800 hover:border-slate-700 text-slate-300 rounded-2xl text-xs font-bold flex items-center gap-2 transition"
              >
                <Layers className="w-4 h-4 text-purple-400" />
                {expandedCategories.length === CATEGORIES.length ? "Collapse All" : "Expand All Categories"}
              </button>

              <button
                onClick={() => setShowAddModal(true)}
                className="px-4 py-2.5 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white rounded-2xl text-xs font-bold flex items-center gap-2 transition shadow-md shadow-blue-600/20"
              >
                <Plus className="w-4 h-4" /> Add Word
              </button>
            </>
          ) : (
            <button
              onClick={() => setShowAddHypnoticModal(true)}
              className={`px-4 py-2.5 rounded-2xl text-xs font-extrabold flex items-center gap-2 transition shadow-lg ${
                activeViewMode === "negative"
                  ? "bg-gradient-to-r from-red-700 to-rose-700 hover:from-red-600 hover:to-rose-600 text-white shadow-red-700/30"
                  : activeViewMode === "emotional"
                  ? "bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500 text-white shadow-rose-600/30"
                  : activeViewMode === "misspelled"
                  ? "bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white shadow-amber-600/30"
                  : "bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white shadow-purple-600/30"
              }`}
            >
              <Plus className="w-4 h-4 text-yellow-300" />
              {activeViewMode === "negative"
                ? "Add Negative Words by Letter"
                : activeViewMode === "emotional"
                ? "Add Emotional Words by Letter"
                : activeViewMode === "misspelled"
                ? "Add Misspelled Words by Letter"
                : "Add Hypnotic List by Letter"}
            </button>
          )}
        </div>
      </div>

      {/* MODE 1: PSYCHOLOGICAL TRIGGERS VIEW */}
      {activeViewMode === "triggers" && (
        <div className="space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-wrap gap-3 items-center">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input
                type="text"
                placeholder="Search trigger words..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-10 pr-4 py-2 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500 transition"
              />
            </div>

            <select
              value={selectedCategory}
              onChange={(e) => {
                setSelectedCategory(e.target.value);
                setSelectedSubcategory("all");
              }}
              className="bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-blue-500 transition"
            >
              <option value="all">All Categories</option>
              {CATEGORIES.map(cat => (
                <option key={cat.value} value={cat.value}>{cat.label}</option>
              ))}
            </select>

            <select
              value={selectedPressureLevel}
              onChange={(e) => setSelectedPressureLevel(e.target.value)}
              className="bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-blue-500 transition"
            >
              {PRESSURE_LEVELS.map(level => (
                <option key={level.value} value={level.value}>{level.label}</option>
              ))}
            </select>
          </div>

          {selectedCategory === "all" ? (
            <div className="space-y-4">
              {CATEGORIES.map((category) => {
                const categoryWords = wordsByCategory[category.value] || [];
                if (categoryWords.length === 0) return null;

                const Icon = category.icon;
                const colors = CATEGORY_COLORS[category.color as keyof typeof CATEGORY_COLORS];
                const isExpanded = expandedCategories.includes(category.value);

                return (
                  <div key={category.value} className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
                    <button
                      onClick={() => toggleCategoryExpand(category.value)}
                      className="w-full p-4 flex items-center justify-between hover:bg-slate-800/50 transition cursor-pointer"
                    >
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-xl ${colors.bg} border ${colors.border}`}>
                          <Icon className={`w-5 h-5 ${colors.text}`} />
                        </div>
                        <div className="text-left">
                          <h4 className="text-sm font-bold text-slate-100">{category.label}</h4>
                          <p className="text-[10px] text-slate-500">{category.description}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-[10px] text-slate-400 font-semibold">{categoryWords.length} words</span>
                        {isExpanded ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                      </div>
                    </button>

                    {isExpanded && (
                      <div className="p-4 border-t border-slate-800 bg-slate-950/40">
                        <div className="flex flex-wrap gap-2">
                          {categoryWords.map((word) => (
                            <div key={word._id} className="group relative">
                              <button
                                onClick={() => copyWord(word.word)}
                                className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition cursor-pointer ${
                                  copiedWord === word.word
                                    ? "bg-emerald-950 border-emerald-700 text-emerald-300"
                                    : `${colors.bg} ${colors.border} ${colors.text} hover:opacity-80`
                                }`}
                              >
                                {copiedWord === word.word ? <Check className="w-3 h-3" /> : word.word}
                              </button>
                              <button
                                onClick={() => setSelectedWord(word)}
                                className="absolute -top-2 -right-2 p-1 bg-slate-800 rounded-full opacity-0 group-hover:opacity-100 transition cursor-pointer"
                              >
                                <Lightbulb className="w-3 h-3 text-slate-400" />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="space-y-3">
              {filteredWords.map((word) => {
                const category = CATEGORIES.find(c => c.value === word.category);
                const colors = category ? CATEGORY_COLORS[category.color as keyof typeof CATEGORY_COLORS] : CATEGORY_COLORS.blue;
                const Icon = category?.icon || Lightbulb;

                return (
                  <div key={word._id} className="bg-slate-900 border border-slate-800 rounded-2xl p-4 hover:border-slate-700 transition">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-xl ${colors.bg} border ${colors.border}`}>
                          <Icon className={`w-4 h-4 ${colors.text}`} />
                        </div>
                        <div>
                          <h4 className="text-sm font-bold text-slate-100">{word.word}</h4>
                          <span className={`px-2 py-0.5 rounded-md text-[10px] ${colors.bg} ${colors.border} ${colors.text}`}>
                            {category?.label}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button onClick={() => copyWord(word.word)} className="p-2 hover:bg-slate-800 rounded-lg transition">
                          {copiedWord === word.word ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-slate-400" />}
                        </button>
                        <button onClick={() => deleteWord(word._id!)} className="p-2 hover:bg-slate-800 rounded-lg transition">
                          <X className="w-4 h-4 text-red-400" />
                        </button>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="bg-slate-950 border border-slate-700 rounded-lg p-3">
                        <div className="flex items-center gap-2 mb-1">
                          <Target className="w-3 h-3 text-purple-400" />
                          <span className="text-[10px] font-semibold text-purple-300">Psychology</span>
                        </div>
                        <p className="text-[10px] text-slate-400">{word.psychology}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* MODE 2: HYPNOTIC WORDS A-Z DICTIONARY VIEW */}
      {activeViewMode === "hypnotic" && (
        <div className="space-y-6">
          {/* A-Z Letter Selector Bar */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                <FileText className="w-4 h-4 text-purple-400" /> Select Letter Directory
              </span>
              <span className="text-xs text-purple-400 font-bold">
                Showing Letter '{selectedLetter}' ({(hypnoticDict[selectedLetter] || []).length} phrases)
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-1.5 pt-1">
              {ALL_LETTERS.map((letter) => {
                const count = (hypnoticDict[letter] || []).length;
                const isSelected = selectedLetter === letter;

                return (
                  <button
                    key={letter}
                    onClick={() => setSelectedLetter(letter)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-extrabold transition flex items-center gap-1 cursor-pointer ${
                      isSelected
                        ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md shadow-purple-600/30 scale-105"
                        : count > 0
                        ? "bg-slate-950 border border-slate-800 text-purple-300 hover:bg-slate-800"
                        : "bg-slate-950/60 border border-slate-800/60 text-slate-500 hover:text-slate-300"
                    }`}
                  >
                    <span>{letter}</span>
                    <span className="text-[10px] opacity-75 font-mono">({count})</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Search Bar for Hypnotic Phrases */}
          <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="relative w-full sm:w-96">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input
                type="text"
                placeholder={`Search hypnotic phrases in letter '${selectedLetter}'...`}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <button
              onClick={() => {
                setTargetLetterToAdd(selectedLetter);
                setShowAddHypnoticModal(true);
              }}
              className="px-4 py-2 bg-purple-950/80 hover:bg-purple-900 border border-purple-800 text-purple-300 rounded-xl text-xs font-bold flex items-center gap-2 transition"
            >
              <Plus className="w-4 h-4 text-yellow-400" /> Add Phrases for Letter '{selectedLetter}'
            </button>
          </div>

          {/* Hypnotic Phrases Display Grid */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h4 className="text-base font-bold text-slate-100 flex items-center gap-2">
                {selectedLetter === "#" ? <Hash className="w-5 h-5 text-purple-400" /> : selectedLetter === "$" ? <DollarSign className="w-5 h-5 text-emerald-400" /> : <Sparkles className="w-5 h-5 text-yellow-400" />}
                Hypnotic Phrases under '{selectedLetter}' ({activeHypnoticList.length} phrases)
              </h4>
            </div>

            {activeHypnoticList.length === 0 ? (
              <div className="text-center py-12 space-y-3 bg-slate-950/60 border border-slate-800/80 rounded-2xl">
                <FileText className="w-10 h-10 text-slate-600 mx-auto" />
                <p className="text-sm font-semibold text-slate-400">
                  No hypnotic phrases added for letter '{selectedLetter}' yet.
                </p>
                <button
                  onClick={() => {
                    setTargetLetterToAdd(selectedLetter);
                    setShowAddHypnoticModal(true);
                  }}
                  className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-xs font-bold transition shadow-md shadow-purple-600/30"
                >
                  + Add Hypnotic List for Letter '{selectedLetter}'
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {activeHypnoticList.map((phrase, idx) => (
                  <div
                    key={idx}
                    onClick={() => copyWord(phrase)}
                    className="p-3 bg-slate-950 border border-slate-800 hover:border-purple-600/60 rounded-xl flex items-center justify-between gap-3 group transition cursor-pointer"
                  >
                    <span className="text-xs text-slate-200 font-medium font-mono group-hover:text-purple-300 transition">
                      {phrase}
                    </span>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        copyWord(phrase);
                      }}
                      className="p-1.5 text-slate-500 hover:text-emerald-400 transition"
                      title="Copy phrase"
                    >
                      {copiedWord === phrase ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* MODE 3: COMMONLY MISSPELLED WORDS A-Z VIEW */}
      {activeViewMode === "misspelled" && (
        <div className="space-y-6">
          {/* A-Z Letter Selector Bar for Misspelled Words */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                <Edit3 className="w-4 h-4 text-amber-400" /> Select Letter Directory
              </span>
              <span className="text-xs text-amber-400 font-bold">
                Showing Letter '{selectedMisspelledLetter}' ({(misspelledDict[selectedMisspelledLetter] || []).length} words)
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-1.5 pt-1">
              {ALL_LETTERS.map((letter) => {
                const count = (misspelledDict[letter] || []).length;
                const isSelected = selectedMisspelledLetter === letter;

                return (
                  <button
                    key={letter}
                    onClick={() => setSelectedMisspelledLetter(letter)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-extrabold transition flex items-center gap-1 cursor-pointer ${
                      isSelected
                        ? "bg-gradient-to-r from-amber-600 to-orange-600 text-white shadow-md shadow-amber-600/30 scale-105"
                        : count > 0
                        ? "bg-slate-950 border border-slate-800 text-amber-300 hover:bg-slate-800"
                        : "bg-slate-950/60 border border-slate-800/60 text-slate-500 hover:text-slate-300"
                    }`}
                  >
                    <span>{letter}</span>
                    <span className="text-[10px] opacity-75 font-mono">({count})</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Search Bar for Misspelled Words */}
          <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="relative w-full sm:w-96">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input
                type="text"
                placeholder={`Search misspelled words in letter '${selectedMisspelledLetter}'...`}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>

            <button
              onClick={() => {
                setTargetMisspelledLetterToAdd(selectedMisspelledLetter);
                setShowAddHypnoticModal(true);
              }}
              className="px-4 py-2 bg-amber-950/80 hover:bg-amber-900 border border-amber-800 text-amber-300 rounded-xl text-xs font-bold flex items-center gap-2 transition"
            >
              <Plus className="w-4 h-4 text-yellow-300" /> Add Misspelled Words for Letter '{selectedMisspelledLetter}'
            </button>
          </div>

          {/* Misspelled Words Display Grid */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h4 className="text-base font-bold text-slate-100 flex items-center gap-2">
                <Edit3 className="w-5 h-5 text-amber-400" />
                Misspelled Words under '{selectedMisspelledLetter}' ({activeMisspelledList.length} words)
              </h4>
            </div>

            {activeMisspelledList.length === 0 ? (
              <div className="text-center py-12 space-y-3 bg-slate-950/60 border border-slate-800/80 rounded-2xl">
                <FileText className="w-10 h-10 text-slate-600 mx-auto" />
                <p className="text-sm font-semibold text-slate-400">
                  No misspelled words added for letter '{selectedMisspelledLetter}' yet.
                </p>
                <button
                  onClick={() => {
                    setTargetMisspelledLetterToAdd(selectedMisspelledLetter);
                    setShowAddHypnoticModal(true);
                  }}
                  className="px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white rounded-xl text-xs font-bold transition shadow-md shadow-amber-600/30"
                >
                  + Add Misspelled Words for Letter '{selectedMisspelledLetter}'
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                {activeMisspelledList.map((word, idx) => (
                  <div
                    key={idx}
                    onClick={() => copyWord(word)}
                    className="p-3 bg-slate-950 border border-slate-800 hover:border-amber-600/60 rounded-xl flex items-center justify-between gap-2 group transition cursor-pointer"
                  >
                    <span className="text-xs text-slate-200 font-medium font-mono group-hover:text-amber-300 transition truncate">
                      {word}
                    </span>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        copyWord(word);
                      }}
                      className="p-1 text-slate-500 hover:text-emerald-400 transition"
                      title="Copy word"
                    >
                      {copiedWord === word ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* MODE 4: EMOTIONAL TRIGGER WORDS A-Z VIEW */}
      {activeViewMode === "emotional" && (
        <div className="space-y-6">
          {/* A-Z Letter Selector Bar for Emotional Words */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                <Heart className="w-4 h-4 text-rose-400 fill-rose-400/20" /> Select Letter Directory
              </span>
              <span className="text-xs text-rose-400 font-bold">
                Showing Letter '{selectedEmotionalLetter}' ({(emotionalDict[selectedEmotionalLetter] || []).length} words)
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-1.5 pt-1">
              {ALL_LETTERS.map((letter) => {
                const count = (emotionalDict[letter] || []).length;
                const isSelected = selectedEmotionalLetter === letter;

                return (
                  <button
                    key={letter}
                    onClick={() => setSelectedEmotionalLetter(letter)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-extrabold transition flex items-center gap-1 cursor-pointer ${
                      isSelected
                        ? "bg-gradient-to-r from-rose-600 to-pink-600 text-white shadow-md shadow-rose-600/30 scale-105"
                        : count > 0
                        ? "bg-slate-950 border border-slate-800 text-rose-300 hover:bg-slate-800"
                        : "bg-slate-950/60 border border-slate-800/60 text-slate-500 hover:text-slate-300"
                    }`}
                  >
                    <span>{letter}</span>
                    <span className="text-[10px] opacity-75 font-mono">({count})</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Search Bar for Emotional Words */}
          <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="relative w-full sm:w-96">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input
                type="text"
                placeholder={`Search emotional words in letter '${selectedEmotionalLetter}'...`}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-rose-500"
              />
            </div>

            <button
              onClick={() => {
                setTargetEmotionalLetterToAdd(selectedEmotionalLetter);
                setShowAddHypnoticModal(true);
              }}
              className="px-4 py-2 bg-rose-950/80 hover:bg-rose-900 border border-rose-800 text-rose-300 rounded-xl text-xs font-bold flex items-center gap-2 transition"
            >
              <Plus className="w-4 h-4 text-yellow-300" /> Add Emotional Words for Letter '{selectedEmotionalLetter}'
            </button>
          </div>

          {/* Emotional Words Display Grid */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h4 className="text-base font-bold text-slate-100 flex items-center gap-2">
                <Heart className="w-5 h-5 text-rose-400 fill-rose-400/20" />
                Emotional Words under '{selectedEmotionalLetter}' ({activeEmotionalList.length} words)
              </h4>
            </div>

            {activeEmotionalList.length === 0 ? (
              <div className="text-center py-12 space-y-3 bg-slate-950/60 border border-slate-800/80 rounded-2xl">
                <FileText className="w-10 h-10 text-slate-600 mx-auto" />
                <p className="text-sm font-semibold text-slate-400">
                  No emotional trigger words added for letter '{selectedEmotionalLetter}' yet.
                </p>
                <button
                  onClick={() => {
                    setTargetEmotionalLetterToAdd(selectedEmotionalLetter);
                    setShowAddHypnoticModal(true);
                  }}
                  className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-bold transition shadow-md shadow-rose-600/30"
                >
                  + Add Emotional Words for Letter '{selectedEmotionalLetter}'
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                {activeEmotionalList.map((word, idx) => (
                  <div
                    key={idx}
                    onClick={() => copyWord(word)}
                    className="p-3 bg-slate-950 border border-slate-800 hover:border-rose-600/60 rounded-xl flex items-center justify-between gap-2 group transition cursor-pointer"
                  >
                    <span className="text-xs text-slate-200 font-medium font-mono group-hover:text-rose-300 transition truncate">
                      {word}
                    </span>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        copyWord(word);
                      }}
                      className="p-1 text-slate-500 hover:text-emerald-400 transition"
                      title="Copy word"
                    >
                      {copiedWord === word ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* MODE 5: NEGATIVE WORDS A-Z VIEW */}
      {activeViewMode === "negative" && (
        <div className="space-y-6">
          {/* A-Z Letter Selector Bar for Negative Words */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                <ThumbsDown className="w-4 h-4 text-red-400" /> Select Letter Directory
              </span>
              <span className="text-xs text-red-400 font-bold">
                Showing Letter '{selectedNegativeLetter}' ({(negativeDict[selectedNegativeLetter] || []).length} words)
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-1.5 pt-1">
              {ALL_LETTERS.map((letter) => {
                const count = (negativeDict[letter] || []).length;
                const isSelected = selectedNegativeLetter === letter;

                return (
                  <button
                    key={letter}
                    onClick={() => setSelectedNegativeLetter(letter)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-extrabold transition flex items-center gap-1 cursor-pointer ${
                      isSelected
                        ? "bg-gradient-to-r from-red-700 to-rose-700 text-white shadow-md shadow-red-700/30 scale-105"
                        : count > 0
                        ? "bg-slate-950 border border-slate-800 text-red-300 hover:bg-slate-800"
                        : "bg-slate-950/60 border border-slate-800/60 text-slate-500 hover:text-slate-300"
                    }`}
                  >
                    <span>{letter}</span>
                    <span className="text-[10px] opacity-75 font-mono">({count})</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Search Bar for Negative Words */}
          <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="relative w-full sm:w-96">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input
                type="text"
                placeholder={`Search negative words in letter '${selectedNegativeLetter}'...`}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>

            <button
              onClick={() => {
                setTargetNegativeLetterToAdd(selectedNegativeLetter);
                setShowAddHypnoticModal(true);
              }}
              className="px-4 py-2 bg-red-950/80 hover:bg-red-900 border border-red-800 text-red-300 rounded-xl text-xs font-bold flex items-center gap-2 transition"
            >
              <Plus className="w-4 h-4 text-yellow-300" /> Add Negative Words for Letter '{selectedNegativeLetter}'
            </button>
          </div>

          {/* Negative Words Display Grid */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h4 className="text-base font-bold text-slate-100 flex items-center gap-2">
                <ThumbsDown className="w-5 h-5 text-red-400" />
                Negative Words under '{selectedNegativeLetter}' ({activeNegativeList.length} words)
              </h4>
            </div>

            {activeNegativeList.length === 0 ? (
              <div className="text-center py-12 space-y-3 bg-slate-950/60 border border-slate-800/80 rounded-2xl">
                <FileText className="w-10 h-10 text-slate-600 mx-auto" />
                <p className="text-sm font-semibold text-slate-400">
                  No negative words added for letter '{selectedNegativeLetter}' yet.
                </p>
                <button
                  onClick={() => {
                    setTargetNegativeLetterToAdd(selectedNegativeLetter);
                    setShowAddHypnoticModal(true);
                  }}
                  className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded-xl text-xs font-bold transition shadow-md shadow-red-600/30"
                >
                  + Add Negative Words for Letter '{selectedNegativeLetter}'
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                {activeNegativeList.map((word, idx) => (
                  <div
                    key={idx}
                    onClick={() => copyWord(word)}
                    className="p-3 bg-slate-950 border border-slate-800 hover:border-red-600/60 rounded-xl flex items-center justify-between gap-2 group transition cursor-pointer"
                  >
                    <span className="text-xs text-slate-200 font-medium font-mono group-hover:text-red-300 transition truncate">
                      {word}
                    </span>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        copyWord(word);
                      }}
                      className="p-1 text-slate-500 hover:text-emerald-400 transition"
                      title="Copy word"
                    >
                      {copiedWord === word ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* MODAL: BULK ADD HYPNOTIC / MISSPELLED / EMOTIONAL / NEGATIVE LIST BY LETTER */}
      {showAddHypnoticModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2">
                {activeViewMode === "negative" ? (
                  <>
                    <ThumbsDown className="w-5 h-5 text-red-400" /> Add Negative Words for Letter '{targetNegativeLetterToAdd}'
                  </>
                ) : activeViewMode === "emotional" ? (
                  <>
                    <Heart className="w-5 h-5 text-rose-400" /> Add Emotional Words for Letter '{targetEmotionalLetterToAdd}'
                  </>
                ) : activeViewMode === "misspelled" ? (
                  <>
                    <Edit3 className="w-5 h-5 text-amber-400" /> Add Misspelled Words for Letter '{targetMisspelledLetterToAdd}'
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5 text-purple-400" /> Add Hypnotic Phrases for Letter '{targetLetterToAdd}'
                  </>
                )}
              </h3>
              <button onClick={() => setShowAddHypnoticModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddBulkPhrases} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">
                  Target Letter Category
                </label>
                {activeViewMode === "negative" ? (
                  <select
                    value={targetNegativeLetterToAdd}
                    onChange={(e) => setTargetNegativeLetterToAdd(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-sm text-slate-100 font-extrabold"
                  >
                    {ALL_LETTERS.map((lettr) => (
                      <option key={lettr} value={lettr}>
                        Letter '{lettr}' (Currently { (negativeDict[lettr] || []).length } words)
                      </option>
                    ))}
                  </select>
                ) : activeViewMode === "emotional" ? (
                  <select
                    value={targetEmotionalLetterToAdd}
                    onChange={(e) => setTargetEmotionalLetterToAdd(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-sm text-slate-100 font-extrabold"
                  >
                    {ALL_LETTERS.map((lettr) => (
                      <option key={lettr} value={lettr}>
                        Letter '{lettr}' (Currently { (emotionalDict[lettr] || []).length } words)
                      </option>
                    ))}
                  </select>
                ) : activeViewMode === "misspelled" ? (
                  <select
                    value={targetMisspelledLetterToAdd}
                    onChange={(e) => setTargetMisspelledLetterToAdd(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-sm text-slate-100 font-extrabold"
                  >
                    {ALL_LETTERS.map((lettr) => (
                      <option key={lettr} value={lettr}>
                        Letter '{lettr}' (Currently { (misspelledDict[lettr] || []).length } words)
                      </option>
                    ))}
                  </select>
                ) : (
                  <select
                    value={targetLetterToAdd}
                    onChange={(e) => setTargetLetterToAdd(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-sm text-slate-100 font-extrabold"
                  >
                    {ALL_LETTERS.map((lettr) => (
                      <option key={lettr} value={lettr}>
                        Letter '{lettr}' (Currently { (hypnoticDict[lettr] || []).length } phrases)
                      </option>
                    ))}
                  </select>
                )}
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
                    Paste Words/Phrases (Comma, Space, or Line-Separated)
                  </label>
                  {bulkHypnoticInput.trim().length > 0 && (
                    <span className="text-[11px] text-red-400 font-bold bg-red-950/60 border border-red-800/60 px-2 py-0.5 rounded-full">
                      ⚡ {bulkHypnoticInput.split(/,|\n|\s{2,}/).filter((p) => p.trim().length > 0).length} Item(s) Detected
                    </span>
                  )}
                </div>
                <textarea
                  rows={6}
                  required
                  placeholder={
                    activeViewMode === "negative"
                      ? `Paste negative words for letter '${targetNegativeLetterToAdd}' here...`
                      : activeViewMode === "emotional"
                      ? `Paste emotional trigger words for letter '${targetEmotionalLetterToAdd}' here...`
                      : activeViewMode === "misspelled"
                      ? `Paste misspelled words for letter '${targetMisspelledLetterToAdd}' here...`
                      : `Paste hypnotic phrases starting with letter '${targetLetterToAdd}' here...`
                  }
                  value={bulkHypnoticInput}
                  onChange={(e) => setBulkHypnoticInput(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 focus:border-red-500 rounded-xl p-3 text-sm text-slate-100 placeholder:text-slate-600 font-mono"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddHypnoticModal(false)}
                  className="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className={`px-5 py-2 rounded-xl text-xs font-extrabold shadow-lg ${
                    activeViewMode === "negative"
                      ? "bg-red-700 hover:bg-red-600 text-white shadow-red-700/30"
                      : activeViewMode === "emotional"
                      ? "bg-rose-600 hover:bg-rose-500 text-white shadow-rose-600/30"
                      : activeViewMode === "misspelled"
                      ? "bg-amber-600 hover:bg-amber-500 text-white shadow-amber-600/30"
                      : "bg-purple-600 hover:bg-purple-500 text-white shadow-purple-600/30"
                  }`}
                >
                  Save List for Letter '{activeViewMode === "negative" ? targetNegativeLetterToAdd : activeViewMode === "emotional" ? targetEmotionalLetterToAdd : activeViewMode === "misspelled" ? targetMisspelledLetterToAdd : targetLetterToAdd}'
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: ADD PSYCHOLOGICAL TRIGGER WORD */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-lg w-full">
            <div className="p-6 space-y-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-950 border border-blue-800 rounded-xl">
                    <Plus className="w-5 h-5 text-blue-400" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-100">Add New Power Word</h3>
                    <p className="text-xs text-slate-400">Expand your power words database</p>
                  </div>
                </div>
                <button onClick={() => setShowAddModal(false)} className="p-2 hover:bg-slate-800 rounded-lg transition">
                  <X className="w-4 h-4 text-slate-400" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">Word *</label>
                  <input
                    type="text"
                    value={newWord.word}
                    onChange={(e) => setNewWord({ ...newWord, word: e.target.value })}
                    placeholder="e.g. Amazing"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-sm text-slate-100"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">Category *</label>
                  <select
                    value={newWord.category}
                    onChange={(e) => setNewWord({ ...newWord, category: e.target.value, subcategory: "" })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-sm text-slate-100"
                  >
                    {CATEGORIES.map(cat => (
                      <option key={cat.value} value={cat.value}>{cat.label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">Psychology *</label>
                  <textarea
                    value={newWord.psychology}
                    onChange={(e) => setNewWord({ ...newWord, psychology: e.target.value })}
                    placeholder="Explain the psychological trigger..."
                    rows={2}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-sm text-slate-100"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">App Use Case *</label>
                  <textarea
                    value={newWord.appUseCase}
                    onChange={(e) => setNewWord({ ...newWord, appUseCase: e.target.value })}
                    placeholder="When to use this word..."
                    rows={2}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-sm text-slate-100"
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 px-4 py-2.5 bg-slate-800 hover:bg-slate-700 border border-slate-600 text-slate-200 text-xs font-semibold rounded-xl transition"
                >
                  Cancel
                </button>
                <button
                  onClick={addWord}
                  disabled={!newWord.word || !newWord.psychology || !newWord.appUseCase}
                  className="flex-1 px-4 py-2.5 bg-blue-600 hover:bg-blue-500 disabled:bg-slate-700 disabled:text-slate-500 disabled:cursor-not-allowed text-white text-xs font-semibold rounded-xl transition"
                >
                  Add Word
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
