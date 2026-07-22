import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import dbConnect from "@/lib/dbConnect";
import { PowerWord } from "@/lib/models/powerWords.model";

const INITIAL_POWER_WORDS = [
  // Urgency & Scarcity
  { word: "Now", category: "urgency_scarcity", psychology: "Fear Of Missing Out (FOMO). Forces the brain to make a decision quickly to avoid loss.", appUseCase: "When a user is writing a launch email or a sales page footer.", examples: ["Join today before enrollment closes."] },
  { word: "Today", category: "urgency_scarcity", psychology: "Fear Of Missing Out (FOMO). Forces the brain to make a decision quickly to avoid loss.", appUseCase: "When a user is writing a launch email or a sales page footer.", examples: ["Act today to secure your spot."] },
  { word: "Limited", category: "urgency_scarcity", psychology: "Fear Of Missing Out (FOMO). Forces the brain to make a decision quickly to avoid loss.", appUseCase: "When a user is writing a launch email or a sales page footer.", examples: ["Limited spots available."] },
  { word: "Expires", category: "urgency_scarcity", psychology: "Fear Of Missing Out (FOMO). Forces the brain to make a decision quickly to avoid loss.", appUseCase: "When a user is writing a launch email or a sales page footer.", examples: ["Offer expires tonight."] },
  { word: "Deadline", category: "urgency_scarcity", psychology: "Fear Of Missing Out (FOMO). Forces the brain to make a decision quickly to avoid loss.", appUseCase: "When a user is writing a launch email or a sales page footer.", examples: ["Don't miss the deadline."] },
  { word: "Instantly", category: "urgency_scarcity", psychology: "Fear Of Missing Out (FOMO). Forces the brain to make a decision quickly to avoid loss.", appUseCase: "When a user is writing a launch email or a sales page footer.", examples: ["Get access instantly."] },
  { word: "Immediate", category: "urgency_scarcity", psychology: "Fear Of Missing Out (FOMO). Forces the brain to make a decision quickly to avoid loss.", appUseCase: "When a user is writing a launch email or a sales page footer.", examples: ["Immediate results guaranteed."] },
  { word: "Running Out", category: "urgency_scarcity", psychology: "Fear Of Missing Out (FOMO). Forces the brain to make a decision quickly to avoid loss.", appUseCase: "When a user is writing a launch email or a sales page footer.", examples: ["Slots are running out."] },
  { word: "Last Chance", category: "urgency_scarcity", psychology: "Fear Of Missing Out (FOMO). Forces the brain to make a decision quickly to avoid loss.", appUseCase: "When a user is writing a launch email or a sales page footer.", examples: ["This is your last chance."] },
  { word: "Final Call", category: "urgency_scarcity", psychology: "Fear Of Missing Out (FOMO). Forces the brain to make a decision quickly to avoid loss.", appUseCase: "When a user is writing a launch email or a sales page footer.", examples: ["Final call to join."] },

  // Curiosity & Mystery
  { word: "Secret", category: "curiosity_mystery", psychology: "The brain hates incomplete information. These words open a 'loop' that the reader feels compelled to close.", appUseCase: "Teaser posts, subject lines, or lead magnet titles.", examples: ["The hidden SEO tactic most gurus ignore."] },
  { word: "Hidden", category: "curiosity_mystery", psychology: "The brain hates incomplete information. These words open a 'loop' that the reader feels compelled to close.", appUseCase: "Teaser posts, subject lines, or lead magnet titles.", examples: ["Hidden strategies revealed."] },
  { word: "Revealed", category: "curiosity_mystery", psychology: "The brain hates incomplete information. These words open a 'loop' that the reader feels compelled to close.", appUseCase: "Teaser posts, subject lines, or lead magnet titles.", examples: ["Finally revealed: the truth."] },
  { word: "Behind-the-Scenes", category: "curiosity_mystery", psychology: "The brain hates incomplete information. These words open a 'loop' that the reader feels compelled to close.", appUseCase: "Teaser posts, subject lines, or lead magnet titles.", examples: ["Behind-the-scenes access."] },
  { word: "Forbidden", category: "curiosity_mystery", psychology: "The brain hates incomplete information. These words open a 'loop' that the reader feels compelled to close.", appUseCase: "Teaser posts, subject lines, or lead magnet titles.", examples: ["Forbidden knowledge exposed."] },
  { word: "Little-Known", category: "curiosity_mystery", psychology: "The brain hates incomplete information. These words open a 'loop' that the reader feels compelled to close.", appUseCase: "Teaser posts, subject lines, or lead magnet titles.", examples: ["Little-known tactics."] },
  { word: "Uncovered", category: "curiosity_mystery", psychology: "The brain hates incomplete information. These words open a 'loop' that the reader feels compelled to close.", appUseCase: "Teaser posts, subject lines, or lead magnet titles.", examples: ["Uncovered secrets."] },
  { word: "What They Don't Want You to Know", category: "curiosity_mystery", psychology: "The brain hates incomplete information. These words open a 'loop' that the reader feels compelled to close.", appUseCase: "Teaser posts, subject lines, or lead magnet titles.", examples: ["What experts don't want you to know."] },
  { word: "Sneak Peek", category: "curiosity_mystery", psychology: "The brain hates incomplete information. These words open a 'loop' that the reader feels compelled to close.", appUseCase: "Teaser posts, subject lines, or lead magnet titles.", examples: ["Get a sneak peek."] },

  // Ease & Speed
  { word: "Easy", category: "ease_speed", psychology: "People are lazy and busy. They want maximum result for minimum effort.", appUseCase: "Course descriptions, tool benefits, or 'How-to' guides.", examples: ["An easy way to succeed."] },
  { word: "Simple", category: "ease_speed", psychology: "People are lazy and busy. They want maximum result for minimum effort.", appUseCase: "Course descriptions, tool benefits, or 'How-to' guides.", examples: ["Simple steps to success."] },
  { word: "Step-by-Step", category: "ease_speed", psychology: "People are lazy and busy. They want maximum result for minimum effort.", appUseCase: "Course descriptions, tool benefits, or 'How-to' guides.", examples: ["Step-by-step guidance."] },
  { word: "Foolproof", category: "ease_speed", psychology: "People are lazy and busy. They want maximum result for minimum effort.", appUseCase: "Course descriptions, tool benefits, or 'How-to' Guides.", examples: ["A foolproof method."] },
  { word: "Effortless", category: "ease_speed", psychology: "People are lazy and busy. They want maximum result for minimum effort.", appUseCase: "Course descriptions, tool benefits, or 'How-to' guides.", examples: ["Effortless results."] },
  { word: "Quick", category: "ease_speed", psychology: "People are lazy and busy. They want maximum result for minimum effort.", appUseCase: "Course descriptions, tool benefits, or 'How-to' guides.", examples: ["Quick results guaranteed."] },
  { word: "Fast", category: "ease_speed", psychology: "People are lazy and busy. They want maximum result for minimum effort.", appUseCase: "Course descriptions, tool benefits, or 'How-to' guides.", examples: ["Fast track to success."] },
  { word: "Shortcut", category: "ease_speed", psychology: "People are lazy and busy. They want maximum result for minimum effort.", appUseCase: "Course descriptions, tool benefits, or 'How-to' guides.", examples: ["The ultimate shortcut."] },
  { word: "Blueprint", category: "ease_speed", psychology: "People are lazy and busy. They want maximum result for minimum effort.", appUseCase: "Course descriptions, tool benefits, or 'How-to' guides.", examples: ["Complete blueprint included."] },
  { word: "Cheat Sheet", category: "ease_speed", psychology: "People are lazy and busy. They want maximum result for minimum effort.", appUseCase: "Course descriptions, tool benefits, or 'How-to' guides.", examples: ["Free cheat sheet."] },
  { word: "Done-for-You", category: "ease_speed", psychology: "People are lazy and busy. They want maximum result for minimum effort.", appUseCase: "Course descriptions, tool benefits, or 'How-to' guides.", examples: ["Done-for-you templates."] },
  { word: "Automatic", category: "ease_speed", psychology: "People are lazy and busy. They want maximum result for minimum effort.", appUseCase: "Course descriptions, tool benefits, or 'How-to' guides.", examples: ["Automatic income system."] },

  // Trust & Authority
  { word: "Proven", category: "trust_authority", psychology: "Reduces risk. Newbies are afraid of being scammed or wasting money.", appUseCase: "Sales pages, testimonials, and about me sections.", examples: ["Our proven framework."] },
  { word: "Guaranteed", category: "trust_authority", psychology: "Reduces risk. Newbies are afraid of being scammed or wasting money.", appUseCase: "Sales pages, testimonials, and about me sections.", examples: ["Results guaranteed."] },
  { word: "Certified", category: "trust_authority", psychology: "Reduces risk. Newbies are afraid of being scammed or wasting money.", appUseCase: "Sales pages, testimonials, and about me sections.", examples: ["Certified expert."] },
  { word: "Official", category: "trust_authority", psychology: "Reduces risk. Newbies are afraid of being scammed or wasting money.", appUseCase: "Sales pages, testimonials, and about me sections.", examples: ["Official guide."] },
  { word: "Endorsed", category: "trust_authority", psychology: "Reduces risk. Newbies are afraid of being scammed or wasting money.", appUseCase: "Sales pages, testimonials, and about me sections.", examples: ["Expert endorsed."] },
  { word: "Research-Backed", category: "trust_authority", psychology: "Reduces risk. Newbies are afraid of being scammed or wasting money.", appUseCase: "Sales pages, testimonials, and about me sections.", examples: ["Research-backed methods."] },
  { word: "Data-Driven", category: "trust_authority", psychology: "Reduces risk. Newbies are afraid of being scammed or wasting money.", appUseCase: "Sales pages, testimonials, and about me sections.", examples: ["Data-driven decisions."] },
  { word: "Expert", category: "trust_authority", psychology: "Reduces risk. Newbies are afraid of being scammed or wasting money.", appUseCase: "Sales pages, testimonials, and about me sections.", examples: ["Expert advice."] },
  { word: "Authentic", category: "trust_authority", psychology: "Reduces risk. Newbies are afraid of being scammed or wasting money.", appUseCase: "Sales pages, testimonials, and about me sections.", examples: ["Authentic strategies."] },
  { word: "Transparent", category: "trust_authority", psychology: "Reduces risk. Newbies are afraid of being scammed or wasting money.", appUseCase: "Sales pages, testimonials, and about me sections.", examples: ["Transparent pricing."] },
  { word: "No-Risk", category: "trust_authority", psychology: "Reduces risk. Newbies are afraid of being scammed or wasting money.", appUseCase: "Sales pages, testimonials, and about me sections.", examples: ["No-risk trial."] },

  // Exclusivity & Belonging
  { word: "Exclusive", category: "exclusivity_belonging", psychology: "People want to be part of an inner circle or feel special. It appeals to ego and identity.", appUseCase: "Membership offers, high-ticket coaching, or community builds.", examples: ["Exclusive access."] },
  { word: "Members-Only", category: "exclusivity_belonging", psychology: "People want to be part of an inner circle or feel special. It appeals to ego and identity.", appUseCase: "Membership offers, high-ticket coaching, or community builds.", examples: ["Members-only content."] },
  { word: "Insider", category: "exclusivity_belonging", psychology: "People want to be part of an inner circle or feel special. It appeals to ego and identity.", appUseCase: "Membership offers, high-ticket coaching, or community builds.", examples: ["Insider secrets."] },
  { word: "Elite", category: "exclusivity_belonging", psychology: "People want to be part of an inner circle or feel special. It appeals to ego and identity.", appUseCase: "Membership offers, high-ticket coaching, or community builds.", examples: ["Elite group."] },
  { word: "Private", category: "exclusivity_belonging", psychology: "People want to be part of an inner circle or feel special. It appeals to ego and identity.", appUseCase: "Membership offers, high-ticket coaching, or community builds.", examples: ["Private community."] },
  { word: "Select", category: "exclusivity_belonging", psychology: "People want to be part of an inner circle or feel special. It appeals to ego and identity.", appUseCase: "Membership offers, high-ticket coaching, or community builds.", examples: ["Select group only."] },
  { word: "Invitation-Only", category: "exclusivity_belonging", psychology: "People want to be part of an inner circle or feel special. It appeals to ego and identity.", appUseCase: "Membership offers, high-ticket coaching, or community builds.", examples: ["Invitation-only event."] },
  { word: "VIP", category: "exclusivity_belonging", psychology: "People want to be part of an inner circle or feel special. It appeals to ego and identity.", appUseCase: "Membership offers, high-ticket coaching, or community builds.", examples: ["VIP treatment."] },
  { word: "Community", category: "exclusivity_belonging", psychology: "People want to be part of an inner circle or feel special. It appeals to ego and identity.", appUseCase: "Membership offers, high-ticket coaching, or community builds.", examples: ["Join our community."] },
  { word: "Tribe", category: "exclusivity_belonging", psychology: "People want to be part of an inner circle or feel special. It appeals to ego and identity.", appUseCase: "Membership offers, high-ticket coaching, or community builds.", examples: ["Our exclusive tribe."] },
  { word: "Inner Circle", category: "exclusivity_belonging", psychology: "People want to be part of an inner circle or feel special. It appeals to ego and identity.", appUseCase: "Membership offers, high-ticket coaching, or community builds.", examples: ["Inner circle access."] },

  // Value & Gain
  { word: "Free", category: "value_gain", psychology: "Focuses on the positive outcome. It answers 'What's in it for me?'", appUseCase: "Headlines, bullet points, and call-to-actions (CTAs).", examples: ["Free guide included."] },
  { word: "Bonus", category: "value_gain", psychology: "Focuses on the positive outcome. It answers 'What's in it for me?'", appUseCase: "Headlines, bullet points, and call-to-actions (CTAs).", examples: ["Exclusive bonuses."] },
  { word: "Profit", category: "value_gain", psychology: "Focuses on the positive outcome. It answers 'What's in it for me?'", appUseCase: "Headlines, bullet points, and call-to-actions (CTAs).", examples: ["Maximize your profit."] },
  { word: "Save", category: "value_gain", psychology: "Focuses on the positive outcome. It answers 'What's in it for me?'", appUseCase: "Headlines, bullet points, and call-to-actions (CTAs).", examples: ["Save time and money."] },
  { word: "Double", category: "value_gain", psychology: "Focuses on the positive outcome. It answers 'What's in it for me?'", appUseCase: "Headlines, bullet points, and call-to-actions (CTAs).", examples: ["Double your results."] },
  { word: "Triple", category: "value_gain", psychology: "Focuses on the positive outcome. It answers 'What's in it for me?'", appUseCase: "Headlines, bullet points, and call-to-actions (CTAs).", examples: ["Triple your income."] },
  { word: "Maximize", category: "value_gain", psychology: "Focuses on the positive outcome. It answers 'What's in it for me?'", appUseCase: "Headlines, bullet points, and call-to-actions (CTAs).", examples: ["Maximize your ROI."] },
  { word: "Boost", category: "value_gain", psychology: "Focuses on the positive outcome. It answers 'What's in it for me?'", appUseCase: "Headlines, bullet points, and call-to-actions (CTAs).", examples: ["Boost your sales."] },
  { word: "Skyrocket", category: "value_gain", psychology: "Focuses on the positive outcome. It answers 'What's in it for me?'", appUseCase: "Headlines, bullet points, and call-to-actions (CTAs).", examples: ["Skyrocket your growth."] },
  { word: "Unlock", category: "value_gain", psychology: "Focuses on the positive outcome. It answers 'What's in it for me?'", appUseCase: "Headlines, bullet points, and call-to-actions (CTAs).", examples: ["Unlock your potential."] },
  { word: "Discover", category: "value_gain", psychology: "Focuses on the positive outcome. It answers 'What's in it for me?'", appUseCase: "Headlines, bullet points, and call-to-actions (CTAs).", examples: ["Discover new opportunities."] },
  { word: "Wealth", category: "value_gain", psychology: "Focuses on the positive outcome. It answers 'What's in it for me?'", appUseCase: "Headlines, bullet points, and call-to-actions (CTAs).", examples: ["Build your wealth."] },
  { word: "Income", category: "value_gain", psychology: "Focuses on the positive outcome. It answers 'What's in it for me?'", appUseCase: "Headlines, bullet points, and call-to-actions (CTAs).", examples: ["Generate passive income."] },

  // Fear & Pain
  { word: "Mistake", category: "fear_pain", psychology: "Pain is a stronger motivator than pleasure. These words remind the user of what they are losing by not acting.", appUseCase: "Opening hooks in emails or ads to agitate the problem before offering the solution.", examples: ["Avoid this common mistake."] },
  { word: "Warning", category: "fear_pain", psychology: "Pain is a stronger motivator than pleasure. These words remind the user of what they are losing by not acting.", appUseCase: "Opening hooks in emails or ads to agitate the problem before offering the solution.", examples: ["Warning: Read this first."] },
  { word: "Danger", category: "fear_pain", psychology: "Pain is a stronger motivator than pleasure. These words remind the user of what they are losing by not acting.", appUseCase: "Opening hooks in emails or ads to agitate the problem before offering the solution.", examples: ["Danger of ignoring this."] },
  { word: "Struggle", category: "fear_pain", psychology: "Pain is a stronger motivator than pleasure. These words remind the user of what they are losing by not acting.", appUseCase: "Opening hooks in emails or ads to agitate the problem before offering the solution.", examples: ["End your struggle."] },
  { word: "Overwhelmed", category: "fear_pain", psychology: "Pain is a stronger motivator than pleasure. These words remind the user of what they are losing by not acting.", appUseCase: "Opening hooks in emails or ads to agitate the problem before offering the solution.", examples: ["Feeling overwhelmed?"] },
  { word: "Stuck", category: "fear_pain", psychology: "Pain is a stronger motivator than pleasure. These words remind the user of what they are losing by not acting.", appUseCase: "Opening hooks in emails or ads to agitate the problem before offering the solution.", examples: ["Get unstuck now."] },
  { word: "Frustrating", category: "fear_pain", psychology: "Pain is a stronger motivator than pleasure. These words remind the user of what they are losing by not acting.", appUseCase: "Opening hooks in emails or ads to agitate the problem before offering the solution.", examples: ["Stop frustrating delays."] },
  { word: "Costly", category: "fear_pain", psychology: "Pain is a stronger motivator than pleasure. These words remind the user of what they are losing by not acting.", appUseCase: "Opening hooks in emails or ads to agitate the problem before offering the solution.", examples: ["Avoid costly errors."] },
  { word: "Risk", category: "fear_pain", psychology: "Pain is a stronger motivator than pleasure. These words remind the user of what they are losing by not acting.", appUseCase: "Opening hooks in emails or ads to agitate the problem before offering the solution.", examples: ["Minimize your risk."] },
  { word: "Avoid", category: "fear_pain", psychology: "Pain is a stronger motivator than pleasure. These words remind the user of what they are losing by not acting.", appUseCase: "Opening hooks in emails or ads to agitate the problem before offering the solution.", examples: ["Avoid these pitfalls."] },
  { word: "Stop", category: "fear_pain", psychology: "Pain is a stronger motivator than pleasure. These words remind the user of what they are losing by not acting.", appUseCase: "Opening hooks in emails or ads to agitate the problem before offering the solution.", examples: ["Stop wasting time."] },
  { word: "Kill", category: "fear_pain", psychology: "Pain is a stronger motivator than pleasure. These words remind the user of what they are losing by not acting.", appUseCase: "Opening hooks in emails or ads to agitate the problem before offering the solution.", examples: ["Kill bad habits."] },
  { word: "Destroy", category: "fear_pain", psychology: "Pain is a stronger motivator than pleasure. These words remind the user of what they are losing by not acting.", appUseCase: "Opening hooks in emails or ads to agitate the solution.", examples: ["Destroy your obstacles."] },
];

export async function GET(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();

    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category");
    const initialize = searchParams.get("initialize");

    // Initialize database with default power words if requested
    if (initialize === "true") {
      const existingCount = await PowerWord.countDocuments();
      if (existingCount === 0) {
        await PowerWord.insertMany(INITIAL_POWER_WORDS);
      }
    }

    const query: any = { isActive: true };
    if (category && category !== "all") {
      query.category = category;
    }

    const powerWords = await PowerWord.find(query).sort({ word: 1 });
    return NextResponse.json({ success: true, data: powerWords });
  } catch (error) {
    console.error("Error fetching power words:", error);
    return NextResponse.json({ success: false, error: "Failed to fetch power words" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();

    const body = await req.json();
    const powerWord = await PowerWord.create(body);
    return NextResponse.json({ success: true, data: powerWord });
  } catch (error) {
    console.error("Error creating power word:", error);
    return NextResponse.json({ success: false, error: "Failed to create power word" }, { status: 500 });
  }
}
