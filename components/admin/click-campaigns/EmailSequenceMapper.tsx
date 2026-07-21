"use client";

import React, { useState } from "react";
import { Mail, Plus, Copy, Check, Send, Sparkles, UserCheck, Trash2, ArrowRight, ShieldAlert, BookOpen, Layers, Eye, RefreshCw, HelpCircle, Lightbulb, Search, Filter, ShieldCheck, CheckCircle2 } from "lucide-react";

export interface EmailSequenceStep {
  id: string;
  stepNumber: number;
  title: string;
  templateId?: string;
  category: string;
  delay: string;
  subjectLine: string;
  preheader: string;
  bodyCopy: string;
  ctaText: string;
  whenToUse?: string;
  whyItWorks?: string;
}

export interface OutreachTemplate {
  id: string;
  name: string;
  category: "Prospecting" | "Follow-Up & Re-Engagement" | "Demo & Proposals" | "Closing & Contracts" | "Onboarding & Post-Sale" | "Upselling & Loyalty";
  subjectLine: string;
  preheader: string;
  bodyCopy: string;
  ctaText: string;
  whenToUse: string;
  whyItWorks: string;
}

// Complete 55 Battle-Tested Sales Email Master Catalog from Outreach.ai
export const outreach55Templates: OutreachTemplate[] = [
  // 1 to 10: Prospecting & Initial Outreach
  {
    id: "tpl_1_cold",
    name: "1. Cold Email (New Prospect)",
    category: "Prospecting",
    subjectLine: "Quick chat about {{company_name}}?",
    preheader: "Noticed your company's growth in {{relevant_detail}}...",
    bodyCopy: "Hi {{first_name}},\n\nI noticed your company is {{relevant_detail}}.\n\nWe help companies like yours achieve {{specific_benefit}}.\n\nI’d love to schedule a quick call to explore how {{product_name}} could support your goals.\n\nLet me know if next Tuesday or Wednesday works for you.\n\nBest,\nEric",
    ctaText: "Schedule a Quick Call",
    whenToUse: "• First outreach to a prospect you’ve never contacted.\n• When there’s a relevant, timely hook like recent news or an industry milestone.",
    whyItWorks: "Highlights personalization while keeping the message concise and action-oriented. Balances curiosity with value, encouraging engagement without feeling pressured.",
  },
  {
    id: "tpl_2_followup",
    name: "2. Follow-Up Email (Post Outreach)",
    category: "Follow-Up & Re-Engagement",
    subjectLine: "Still thinking about {{company_name}}'s goals?",
    preheader: "Following up on my previous email regarding {{product_name}}...",
    bodyCopy: "Hi {{first_name}},\n\nJust following up on my previous email about {{product_name}}.\n\nI wanted to see if you had a chance to review my message.\n\nI’m happy to answer any questions or discuss how we can help with {{specific_need}}.\n\nLooking forward to hearing your thoughts.\n\nBest,\nEric",
    ctaText: "Reply with Your Thoughts",
    whenToUse: "• After no response to initial cold email within 3-5 days.\n• To maintain momentum after a positive interaction when no next steps were locked in.",
    whyItWorks: "Polite but persistent. Reminds the prospect of the initial message and offers assistance without being pushy, keeping dialogue focused on their needs.",
  },
  {
    id: "tpl_3_warm",
    name: "3. Warm Email (Engaged Lead)",
    category: "Prospecting",
    subjectLine: "Saw you were interested — let's connect",
    preheader: "Noticed you recently downloaded {{resource_name}}...",
    bodyCopy: "Hi {{first_name}},\n\nI saw that you recently downloaded our {{resource_name}} or visited our website.\n\nI wanted to share how {{product_name}} can help with {{specific_challenge}}.\n\nWould you be open to a brief call to explore this further?\n\nBest,\nEric",
    ctaText: "Book an Exploration Call",
    whenToUse: "• When a lead shows active engagement (downloading content, viewing pricing, visiting site).\n• After an inbound inquiry or demo request.",
    whyItWorks: "Reaches out when lead interest is hot, increasing response probability with a natural, logical next step.",
  },
  {
    id: "tpl_4_intro",
    name: "4. Introductory Email (Formal Intro)",
    category: "Prospecting",
    subjectLine: "Introducing {{my_company}} to {{company_name}}",
    preheader: "Helping businesses like yours achieve {{desired_result}}...",
    bodyCopy: "Hi {{first_name}},\n\nI’m Eric from {{my_company}}.\n\nWe specialize in {{product_name}} that helps businesses like yours {{specific_benefit}}.\n\nI’d love to chat and see how we can help your team achieve {{desired_result}}.\n\nCan we set up a quick call next week?\n\nBest,\nEric",
    ctaText: "Set Up a Quick Call Next Week",
    whenToUse: "• Reaching out to new prospects for the first time.\n• Making a clean, formal introduction to decision-makers.",
    whyItWorks: "Brief and to the point. Quickly positions your product or service as a direct solution to potential operational challenges.",
  },
  {
    id: "tpl_5_referral",
    name: "5. Referral Request (Existing Contacts)",
    category: "Prospecting",
    subjectLine: "Need a referral? I'd appreciate the help",
    preheader: "Quick favor regarding colleagues in {{relevant_detail}}...",
    bodyCopy: "Hi {{first_name}},\n\nI hope things are going well!\n\nI wanted to ask if you know anyone who might benefit from {{product_name}}.\n\nIf so, I’d appreciate an introduction, and I’m happy to share more details if needed.\n\nThanks,\nEric",
    ctaText: "Introduce a Colleague",
    whenToUse: "• After a positive interaction or experience with a client or contact.\n• Expanding network through warm, trusted referrals.",
    whyItWorks: "Casual but specific. Makes it easy for the recipient to consider referring someone without feeling put on the spot.",
  },
  {
    id: "tpl_6_networking",
    name: "6. Networking Email (Mutual Connection)",
    category: "Prospecting",
    subjectLine: "Connecting through {{mutual_contact}}",
    preheader: "{{mutual_contact}} suggested I reach out to you...",
    bodyCopy: "Hi {{first_name}},\n\n{{mutual_contact}} suggested I reach out to you.\n\nI’d love to learn more about your work and discuss how our {{product_name}} could help your company with {{specific_need}}.\n\nLet me know if you have time for a quick call.\n\nBest,\nEric",
    ctaText: "Schedule a Quick Call",
    whenToUse: "• Introduced by a mutual connection or warm contact.\n• Starting conversations with high-priority prospects who are more likely to respond to a referral.",
    whyItWorks: "A mutual connection adds instant credibility and context, dramatically increasing response rates with a warm approach.",
  },
  {
    id: "tpl_7_event",
    name: "7. Event Follow-Up (Met at Event)",
    category: "Prospecting",
    subjectLine: "Great to meet you at {{event_name}}",
    preheader: "Enjoyed our conversation about {{specific_topic}}...",
    bodyCopy: "Hi {{first_name}},\n\nIt was great meeting you at {{event_name}}!\n\nI enjoyed our conversation about {{specific_topic}}.\n\nI’d love to continue the conversation and see how our {{product_name}} might be a good fit for your team.\n\nLet’s set up a time to chat soon.\n\nBest,\nEric",
    ctaText: "Continue the Conversation",
    whenToUse: "• After meeting a lead at a conference, trade show, or networking gathering.\n• Maintaining momentum toward scheduling a formal follow-up.",
    whyItWorks: "References the event and specific conversation, creating a natural, warm transition to continue building the relationship.",
  },
  {
    id: "tpl_8_insight",
    name: "8. Industry Insight (Value-First)",
    category: "Prospecting",
    subjectLine: "Thought you'd find this helpful",
    preheader: "Came across this report addressing {{specific_trend}}...",
    bodyCopy: "Hi {{first_name}},\n\nI came across this {{report_name}} that I think would be valuable for your team as it addresses {{specific_trend}}.\n\nI’d love to chat about how we’re helping companies navigate this change with {{product_name}}.\n\nDo you have time for a call next week?\n\nBest,\nEric",
    ctaText: "Read Report & Connect",
    whenToUse: "• Soft-selling by providing immediate value with relevant industry reports/articles.\n• Positioning yourself as a knowledgeable, trusted partner.",
    whyItWorks: "By offering valuable insights first, you prove investment in the prospect's industry, building authority before pitching.",
  },
  {
    id: "tpl_9_personal",
    name: "9. Personal Connection (Shared Experience)",
    category: "Prospecting",
    subjectLine: "Noticed we have this in common...",
    preheader: "Noticed we both attended {{shared_connection}}...",
    bodyCopy: "Hi {{first_name}},\n\nI noticed that we both {{shared_connection}}, and I’d love to connect!\n\nI think our {{product_name}} could help you with {{specific_challenge}}.\n\nCan we set up a time to discuss?\n\nBest,\nEric",
    ctaText: "Connect & Chat",
    whenToUse: "• Sharing a common background (same university, event, association, or group).\n• Warming up leads with a casual, familiar tone.",
    whyItWorks: "Leverages a shared experience to break the ice, creating immediate rapport and higher reply rates.",
  },
  {
    id: "tpl_10_seasonal",
    name: "10. Seasonal Email (Holiday/Offer)",
    category: "Prospecting",
    subjectLine: "Happy {{season_holiday}}! Special offer inside",
    preheader: "Special promotion on {{product_name}} to celebrate...",
    bodyCopy: "Hi {{first_name}},\n\nHappy {{season_holiday}}!\n\nTo celebrate, we’re offering {{special_promotion}} on our {{product_name}}.\n\nIt’s a great opportunity to explore how we can help with {{specific_need}}.\n\nLet’s schedule a time to chat soon.\n\nBest,\nEric",
    ctaText: "Claim Seasonal Promotion",
    whenToUse: "• During major holidays, new quarter starts, or seasonal promotional windows.\n• Offering time-bound incentives without sounding desperate.",
    whyItWorks: "Seasonal greetings feel timely and personal. The limited offer adds natural urgency without feeling pushy.",
  },
  // 11 to 20: Demos, Proposals & Pricing
  {
    id: "tpl_11_demo",
    name: "11. Demo Request Email",
    category: "Demo & Proposals",
    subjectLine: "Ready to see {{product_name}} in action?",
    preheader: "Showing how {{product_name}} benefits your team...",
    bodyCopy: "Hi {{first_name}},\n\nI’d love to show you how {{product_name}} can benefit your team.\n\nAre you available for a demo this week?\n\nLet me know a time that works for you.\n\nBest,\nEric",
    ctaText: "Schedule a Live Demo",
    whenToUse: "• After initial interest has been shown in your product/service.\n• When a prospect is ready to dive deeper into specific capabilities.",
    whyItWorks: "Direct and concise. Makes it effortless for prospects to take the next step and commit to a demo, removing decision-making friction.",
  },
  {
    id: "tpl_12_pricing",
    name: "12. Pricing Discussion Email",
    category: "Demo & Proposals",
    subjectLine: "Let's talk {{product_name}} pricing",
    preheader: "Overview of flexible pricing options & packages...",
    bodyCopy: "Hi {{first_name}},\n\nI wanted to provide some details on our pricing options.\n\nWe offer {{pricing_tiers}} that can suit different needs.\n\nLet’s discuss which option might be best for you.\n\nBest,\nEric",
    ctaText: "Discuss Custom Pricing Options",
    whenToUse: "• When prospect has shown interest but has questions about affordability or package options.\n• After a demo or product discussion when evaluating cost.",
    whyItWorks: "Positions pricing as a flexible, collaborative conversation while prompting further engagement, helping overcome cost objections.",
  },
  {
    id: "tpl_13_socialproof",
    name: "13. Social Proof Email",
    category: "Demo & Proposals",
    subjectLine: "Successes like this could be yours",
    preheader: "See how clients achieved {{specific_benefit}}...",
    bodyCopy: "Hi {{first_name}},\n\nI wanted to share some success stories from clients who have benefited from {{product_name}}.\n\nHere’s a testimonial from {{client_name}}:\n\"{{testimonial_quote}}\"\n\nLet’s discuss how we can achieve similar results for you.\n\nBest,\nEric",
    ctaText: "Explore How We Can Help",
    whenToUse: "• When prospects are weighing options or hesitating to move forward.\n• Follow-up after discussions where you need to build credibility.",
    whyItWorks: "Leveraging testimonials builds trust and reduces perceived risk, validating your solution with real-world proof.",
  },
  {
    id: "tpl_14_feature",
    name: "14. Feature Highlight Email",
    category: "Demo & Proposals",
    subjectLine: "This {{feature_name}} could be a game-changer",
    preheader: "Addressing your {{specific_challenge}} with {{feature_name}}...",
    bodyCopy: "Hi {{first_name}},\n\nI wanted to highlight how {{feature_name}} of our {{product_name}} can help with {{specific_challenge}}.\n\nLet’s schedule a time to explore this feature in detail.\n\nBest,\nEric",
    ctaText: "Explore Feature in Detail",
    whenToUse: "• When a prospect has a specific pain point and needs deeper information on how your product solves it.\n• Follow-up after initial product exploration.",
    whyItWorks: "Focusing on a specific feature addresses the prospect's unique needs while keeping the conversation relevant and targeted.",
  },
  {
    id: "tpl_15_casestudy",
    name: "15. Case Study Email",
    category: "Demo & Proposals",
    subjectLine: "See how {{company_name}} achieved {{specific_benefit}}",
    preheader: "A detailed breakdown of how we achieved {{specific_benefit}}...",
    bodyCopy: "Hi {{first_name}},\n\nI thought you might find this case study interesting.\n\nIt details how {{company_name}} achieved {{specific_benefit}} using our {{product_name}}.\n\nLet’s discuss how we can replicate this success for your team.\n\nBest,\nEric",
    ctaText: "Replicate This Success",
    whenToUse: "• When a prospect is considering solutions and needs reassurance through proven results.\n• Follow-up after a demo or meeting.",
    whyItWorks: "Provides concrete examples of how your product works in real situations, showing potential outcomes persuasively.",
  },
  {
    id: "tpl_16_comparison",
    name: "16. Comparison Email",
    category: "Demo & Proposals",
    subjectLine: "How we stack up against the competition",
    preheader: "Comparing {{product_name}} vs {{competitor_name}}...",
    bodyCopy: "Hi {{first_name}},\n\nI’ve put together a comparison of our {{product_name}} versus {{competitor_name}}.\n\nYou’ll find that we offer {{unique_advantages}}.\n\nLet’s discuss how we can meet your needs better.\n\nBest,\nEric",
    ctaText: "Compare Features & Pricing",
    whenToUse: "• When prospects are evaluating multiple vendors or alternatives.\n• When a competitor is mentioned in conversation and you need to demonstrate differentiation.",
    whyItWorks: "Proactively addresses competitive concerns and highlights unique strengths, helping sway decision-making in your favor.",
  },
  {
    id: "tpl_17_benefits",
    name: "17. Product Benefits Email",
    category: "Demo & Proposals",
    subjectLine: "Reminding you of the key benefits",
    preheader: "Core advantages of {{product_name}} for your team...",
    bodyCopy: "Hi {{first_name}},\n\nI wanted to remind you of the key benefits of our {{product_name}}.\n\nIt helps with {{specific_challenge}} and offers {{unique_advantages}}.\n\nLet’s explore how it can help your business.\n\nBest,\nEric",
    ctaText: "Explore Key Benefits",
    whenToUse: "• Follow-up after initial interest when the conversation hasn't progressed.\n• Highlighting a particular benefit matching prospect pain points.",
    whyItWorks: "Reinforces value by reminding the prospect of core advantages, keeping your solution top-of-mind.",
  },
  {
    id: "tpl_18_consultation",
    name: "18. Consultation Email",
    category: "Demo & Proposals",
    subjectLine: "Free consultation to explore your needs",
    preheader: "No-pressure discovery session for {{company_name}}...",
    bodyCopy: "Hi {{first_name}},\n\nWe offer a free consultation to explore how our {{product_name}} can address your needs.\n\nAre you available for a chat next week?\n\nBest,\nEric",
    ctaText: "Book Free Consultation",
    whenToUse: "• After initial interest but before a formal product demo or detailed discussion.\n• When a prospect seems unsure and needs deeper exploration of their needs.",
    whyItWorks: "Removes pressure from the conversation and opens up space for discovery, aligning your product effectively.",
  },
  {
    id: "tpl_19_testimonial",
    name: "19. Customer Testimonial Email",
    category: "Demo & Proposals",
    subjectLine: "Join us to see {{product_name}} in action",
    preheader: "Here's how {{client_name}} had a great experience...",
    bodyCopy: "Hi {{first_name}},\n\nHere’s a testimonial from {{client_name}} who had a great experience with our {{product_name}}.\n\nI think it’s relevant to your needs.\n\nLet’s discuss how we can help you.\n\nBest,\nEric",
    ctaText: "See Customer Testimonials",
    whenToUse: "• Reinforcing trust during discovery phase or after initial hesitation.\n• Prospect is in a similar industry or has similar needs as the customer in testimonial.",
    whyItWorks: "Validates your claims with relatable social proof, encouraging prospects to imagine their own success.",
  },
  {
    id: "tpl_20_webinar",
    name: "20. Product Webinar Email",
    category: "Demo & Proposals",
    subjectLine: "Live demonstration of {{product_name}}",
    preheader: "Join our upcoming live interactive webinar...",
    bodyCopy: "Hi {{first_name}},\n\nWe’re hosting a webinar on {{webinar_date}} to demonstrate the benefits of {{product_name}}.\n\nIt's a great way to learn more about {{specific_challenge}} and see it in action.\n\nRegister here {{webinar_link}} to learn more.\n\nBest,\nEric",
    ctaText: "Register for Live Webinar",
    whenToUse: "• When a prospect wants to learn more before making a decision.\n• Offering a non-committal, educational opportunity for prospects on the fence.",
    whyItWorks: "Webinars provide a low-pressure way for prospects to see your product in action and ask questions in real-time.",
  },

  // 21 to 30: Proposals, Closing & Contracts
  {
    id: "tpl_21_proposal",
    name: "21. Proposal Email",
    category: "Closing & Contracts",
    subjectLine: "Proposal for {{product_name}} attached",
    preheader: "Detailed proposal for our discussed project...",
    bodyCopy: "Hi {{first_name}},\n\nI hope you’re doing well.\n\nI’ve attached the proposal for {{product_name}} that we discussed.\n\nPlease take a look and let me know if you have any questions or need further clarification.\n\nLooking forward to hearing your thoughts!\n\nBest,\nEric",
    ctaText: "Review Proposal Details",
    whenToUse: "• After a discovery call or in-depth discussion.\n• Once the prospect has expressed interest in receiving a formal proposal.",
    whyItWorks: "Provides clarity and transparency while positioning the conversation for follow-up questions or negotiations.",
  },
  {
    id: "tpl_22_finalfollowup",
    name: "22. Final Follow-Up Email",
    category: "Closing & Contracts",
    subjectLine: "One last chance — are you interested?",
    preheader: "Touching base one final time regarding {{product_name}}...",
    bodyCopy: "Hi {{first_name}},\n\nI hope this finds you well.\n\nI wanted to touch base one last time regarding {{product_name}}.\n\nPlease let me know if you’re still interested or if there’s anything else you need from me.\n\nLooking forward to your response!\n\nBest,\nEric",
    ctaText: "Confirm Your Interest",
    whenToUse: "• After previous attempts to engage have not received a reply.\n• When nearing the end of the decision timeline.",
    whyItWorks: "Signals urgency without being pushy, giving the prospect a last chance to re-engage.",
  },
  {
    id: "tpl_23_closing",
    name: "23. Closing the Deal Email",
    category: "Closing & Contracts",
    subjectLine: "Ready to move forward with {{product_name}}?",
    preheader: "Confirming final details to launch project...",
    bodyCopy: "Hi {{first_name}},\n\nI hope you’re doing great.\n\nI wanted to confirm if you’re ready to move forward with {{product_name}}.\n\nLet me know if you need anything else to finalize the agreement.\n\nExcited to get started!\n\nBest,\nEric",
    ctaText: "Confirm & Move Forward",
    whenToUse: "• When the prospect is close to making a decision.\n• After proposal and pricing have been discussed.",
    whyItWorks: "Confidently signals readiness to proceed, providing a simple, action-oriented request.",
  },
  {
    id: "tpl_24_contract",
    name: "24. Contract Email",
    category: "Closing & Contracts",
    subjectLine: "Contract for {{product_name}} attached",
    preheader: "Agreement ready for your review and signature...",
    bodyCopy: "Hi {{first_name}},\n\nI hope all is well!\n\nAttached is the contract for {{product_name}}.\n\nPlease review it at your convenience, and let me know if you have any questions or need any adjustments before signing.\n\nLooking forward to moving ahead!\n\nBest,\nEric",
    ctaText: "Review & Sign Contract",
    whenToUse: "• Once deal terms have been agreed upon.\n• After all objections have been addressed.",
    whyItWorks: "Offers a clear path forward with the next actionable step, making the process simple for the prospect.",
  },
  {
    id: "tpl_25_payment",
    name: "25. Payment Instructions Email",
    category: "Closing & Contracts",
    subjectLine: "Next steps: payment for {{product_name}}",
    preheader: "Invoice and payment instructions inside...",
    bodyCopy: "Hi {{first_name}},\n\nI hope you’re having a great day!\n\nHere are the payment instructions for {{product_name}}.\n\nPlease follow the steps, and let me know if you need any help.\n\nThank you for your prompt attention!\n\nBest,\nEric",
    ctaText: "Complete Payment",
    whenToUse: "• After contract has been signed and payment is the next step.\n• Prior to onboarding or delivery.",
    whyItWorks: "Provides a smooth transition to the payment phase while maintaining a professional tone.",
  },
  {
    id: "tpl_26_onboarding",
    name: "26. Onboarding Email",
    category: "Onboarding & Post-Sale",
    subjectLine: "Welcome aboard! Next steps for {{product_name}}",
    preheader: "Setting up your account and onboarding steps...",
    bodyCopy: "Hi {{first_name}},\n\nWelcome aboard!\n\nWe’re excited to start the onboarding process for {{product_name}}.\n\nI’ve outlined the next steps below, and we’ll guide you through every part.\n\nLet me know if you have any questions!\n\nBest,\nEric",
    ctaText: "Start Onboarding Steps",
    whenToUse: "• After deal has been closed and payment processed.\n• Initiating next phase of customer journey.",
    whyItWorks: "Sets clear expectations and fosters a positive customer experience right from day one.",
  },
  {
    id: "tpl_27_lastchance",
    name: "27. Last Chance Offer Email",
    category: "Closing & Contracts",
    subjectLine: "Hurry, this offer won't last!",
    preheader: "Final reminder before promotional terms expire...",
    bodyCopy: "Hi {{first_name}},\n\nI wanted to reach out one final time regarding {{product_name}}.\n\nIf you’re still interested, please let me know, as this offer will expire soon.\n\nDon’t miss out on this opportunity!\n\nBest,\nEric",
    ctaText: "Claim Expiring Offer",
    whenToUse: "• When nearing a promotion deadline or prospect is hesitant.\n• After multiple follow-up attempts without a solid commitment.",
    whyItWorks: "Creates a sense of urgency and encourages action before losing the opportunity.",
  },
  {
    id: "tpl_28_confirmation",
    name: "28. Confirmation Email",
    category: "Closing & Contracts",
    subjectLine: "Confirming next steps for {{product_name}}",
    preheader: "Everything is set and ready for kickoff...",
    bodyCopy: "Hi {{first_name}},\n\nThank you for choosing {{product_name}}.\n\nI wanted to confirm that everything is set, and we’re ready to move to the next phase.\n\nPlease let me know if you need anything else!\n\nBest,\nEric",
    ctaText: "Review Confirmed Steps",
    whenToUse: "• After agreement has been signed or terms finalized.\n• Before transitioning into onboarding or fulfillment.",
    whyItWorks: "Solidifies agreement and ensures both parties are aligned on next steps.",
  },
  {
    id: "tpl_29_pricingagreement",
    name: "29. Pricing Agreement Email",
    category: "Closing & Contracts",
    subjectLine: "Finalized pricing agreement attached",
    preheader: "Documented pricing terms attached for review...",
    bodyCopy: "Hi {{first_name}},\n\nI hope you’re well.\n\nAttached is the finalized pricing agreement for {{product_name}}.\n\nPlease review and confirm, or let me know if any changes are needed.\n\nThanks for your attention!\n\nBest,\nEric",
    ctaText: "Confirm Pricing Terms",
    whenToUse: "• After price negotiations or adjustments have been finalized.\n• Prior to sending final contract.",
    whyItWorks: "Provides clear documentation of agreed pricing and avoids misunderstandings.",
  },
  {
    id: "tpl_30_renewal",
    name: "30. Contract Renewal Email",
    category: "Upselling & Loyalty",
    subjectLine: "Time to renew your {{product_name}} contract",
    preheader: "Renewal details attached to continue your access...",
    bodyCopy: "Hi {{first_name}},\n\nI hope you’re doing well.\n\nIt’s time to renew your contract for {{product_name}}.\n\nI’ve attached the renewal details for your review.\n\nLet me know if you have any questions, and I’ll be happy to assist!\n\nBest,\nEric",
    ctaText: "Review Renewal Details",
    whenToUse: "• At end of existing contract term.\n• As part of ongoing relationship to maintain partnership.",
    whyItWorks: "Keeps renewal process straightforward, reminding client of continued value.",
  },

  // 31 to 35: Re-Engaging Silent Prospects
  {
    id: "tpl_31_noresponse",
    name: "31. No Response Follow-Up",
    category: "Follow-Up & Re-Engagement",
    subjectLine: "Checking in on {{product_name}}",
    preheader: "Quick follow-up to see if this is still on your radar...",
    bodyCopy: "Hi {{first_name}},\n\nI hope you’re doing well.\n\nI wanted to quickly follow up on my previous message about {{product_name}} to see if this is still on your radar.\n\nIf now isn’t the right time, I completely understand — just let me know, and we can touch base down the line.\n\nLooking forward to hearing from you soon!\n\nBest,\nEric",
    ctaText: "Touch Base When Ready",
    whenToUse: "• After prospect hasn't responded to initial outreach or follow-up.\n• Keeping communication open without being pushy.",
    whyItWorks: "Acknowledges time constraints and provides easy way to re-engage without pressure.",
  },
  {
    id: "tpl_32_reconnectcold",
    name: "32. Reconnecting Cold Prospect",
    category: "Follow-Up & Re-Engagement",
    subjectLine: "Reconnecting about {{product_name}}",
    preheader: "Checking in since it's been a while since we last touched base...",
    bodyCopy: "Hi {{first_name}},\n\nI hope this message finds you well!\n\nI wanted to check in as it’s been a while since we last touched base.\n\nIf your priorities have shifted or there’s a better time for us to discuss {{product_name}}, I’d be happy to accommodate.\n\nLooking forward to hearing how things are progressing on your end!\n\nBest,\nEric",
    ctaText: "Reconnect & Catch Up",
    whenToUse: "• For prospects who haven't engaged in months.\n• Checking in without making assumptions about interest.",
    whyItWorks: "Non-intrusive and offers flexibility, making it easy for cold prospects to re-engage.",
  },
  {
    id: "tpl_33_feedbackreq",
    name: "33. Feedback Request Email",
    category: "Follow-Up & Re-Engagement",
    subjectLine: "Would love your feedback on {{product_name}}",
    preheader: "Seeking your quick insights on our last discussion...",
    bodyCopy: "Hi {{first_name}},\n\nI hope all is well!\n\nI’d love to get your feedback on our last discussion about {{product_name}} — any insights or questions you may have would be really helpful as we continue to refine our offering.\n\nLooking forward to hearing from you!\n\nBest,\nEric",
    ctaText: "Share Quick Feedback",
    whenToUse: "• After prospect goes silent following demo, proposal, or discovery call.\n• Re-opening conversation through constructive engagement.",
    whyItWorks: "Invites valuable input while re-establishing dialogue, showing their opinion matters.",
  },
  {
    id: "tpl_34_reengagementcampaign",
    name: "34. Re-Engagement Campaign",
    category: "Follow-Up & Re-Engagement",
    subjectLine: "Exciting updates to {{product_name}}",
    preheader: "New features launched to address {{specific_challenge}}...",
    bodyCopy: "Hi {{first_name}},\n\nI wanted to share some exciting updates!\n\nSince we last connected, {{product_name}} has launched new features designed to {{specific_benefit}}.\n\nI’d love to chat about how these enhancements can benefit you.\n\nLet me know if you’d like more information or a quick demo!\n\nBest,\nEric",
    ctaText: "See New Feature Demo",
    whenToUse: "• Targeted re-engagement campaign for leads gone cold.\n• Launching major new features or improvements.",
    whyItWorks: "Sparks curiosity by showcasing updates that reignite prospect interest with fresh relevance.",
  },
  {
    id: "tpl_35_anniversarycheckin",
    name: "35. Anniversary Check-In",
    category: "Follow-Up & Re-Engagement",
    subjectLine: "It's been a while since we last connected",
    preheader: "Reaching out to catch up and support {{company_name}}...",
    bodyCopy: "Hi {{first_name}},\n\nIt’s been a while since we first connected, and I wanted to reach out and see how things are going on your end.\n\nIf there’s any way we can support you with {{product_name}} or explore new opportunities, I’d love to discuss it.\n\nLet me know if you’d like to catch up!\n\nBest,\nEric",
    ctaText: "Schedule a Catch-Up Chat",
    whenToUse: "• Anniversary of initial outreach, demo, or previous milestone.\n• Personal, relationship-driven re-engagement.",
    whyItWorks: "Leverages time-based touchpoints to feel personalized, creating open space for fresh conversations.",
  },

  // 36 to 54: Post-Sale Nurturing, Upselling & Retention
  {
    id: "tpl_36_46_welcomecust",
    name: "36/46. Customer Welcome & Getting Started",
    category: "Onboarding & Post-Sale",
    subjectLine: "Welcome to the {{my_company}} family!",
    preheader: "Everything you need to get started inside...",
    bodyCopy: "Hi {{first_name}},\n\nWelcome to the {{product_name}} family!\n\nWe’re so excited to have you with us.\n\nHere’s everything you need to get started: [Link to Resources/Onboarding].\n\nIf you have any questions or need help along the way, don’t hesitate to reach out. We’re here for you every step of the way!\n\nBest,\nEric",
    ctaText: "Access Onboarding Portal",
    whenToUse: "• Immediately after customer completes first purchase or signs up.\n• Kicking off relationship with warm, supportive tone.",
    whyItWorks: "Sets positive customer experience tone and ensures customer knows support is ready from day one.",
  },
  {
    id: "tpl_37_47_upsell",
    name: "37/47. Upselling & Next Level Tools",
    category: "Upselling & Loyalty",
    subjectLine: "Take your {{product_name}} to the next level",
    preheader: "Additional tools to accelerate {{desired_result}}...",
    bodyCopy: "Hi {{first_name}},\n\nI hope you’ve been enjoying {{product_name}}!\n\nI wanted to share some additional tools and services that could make your experience even better.\n\nIf you’re open to it, I’d love to show you how {{feature_name}} can help you achieve {{desired_result}}.\n\nLet me know if we can set up a quick call or if you’d like more details!\n\nBest,\nEric",
    ctaText: "Explore Expansion Tools",
    whenToUse: "• Customer has experienced initial value from current product.\n• Identifying opportunities to offer complementary modules.",
    whyItWorks: "Highlights relevant upsell opportunities while positioning them as enhancements to current success.",
  },
  {
    id: "tpl_38_48_productupdate",
    name: "38/48. Product Updates & Walkthrough",
    category: "Onboarding & Post-Sale",
    subjectLine: "New updates to {{product_name}} you'll love",
    preheader: "Exciting new enhancements launched this week...",
    bodyCopy: "Hi {{first_name}},\n\nWe’ve been working hard to improve {{product_name}} and are excited to share some new updates with you!\n\nHeres a few key features we think you’ll love:\n- {{feature_name}}\n\nLet me know if you’d like a personalized walkthrough or if you have any questions!\n\nBest,\nEric",
    ctaText: "View New Product Updates",
    whenToUse: "• After releasing new updates or improvements.\n• Keeping customers informed and excited about ongoing innovation.",
    whyItWorks: "Keeps customer engaged by showing continuous value delivery.",
  },
  {
    id: "tpl_39_49_appreciation",
    name: "39/49. Customer Appreciation & Gratitude",
    category: "Upselling & Loyalty",
    subjectLine: "Thank you for being a valued customer",
    preheader: "Expressing our gratitude for your partnership...",
    bodyCopy: "Hi {{first_name}},\n\nWe just wanted to take a moment to say thank you for being a valued customer!\n\nYour partnership means the world to us, and we’re here to support you however we can.\n\nIf you ever need assistance or want to explore new opportunities, don’t hesitate to reach out. We’re always here for you!\n\nBest,\nEric",
    ctaText: "Connect with Customer Success",
    whenToUse: "• General check-in or around significant relationship milestones.\n• Expressing gratitude and building long-term rapport.",
    whyItWorks: "Showing appreciation fosters loyalty and strengthens relationships by validating customer value.",
  },
  {
    id: "tpl_40_50_survey",
    name: "40/50. Customer Survey Request",
    category: "Onboarding & Post-Sale",
    subjectLine: "We'd love your feedback on {{product_name}}",
    preheader: "Spare 2 minutes to share your feedback?",
    bodyCopy: "Hi {{first_name}},\n\nWe value your feedback and would love to hear your thoughts on your experience with {{product_name}}.\n\nCould you spare a few minutes to complete a quick survey?\n\nYour insights are incredibly important to us, and they help us continue improving.\n\nThank you in advance for your time!\n\nBest,\nEric",
    ctaText: "Take Quick 2-Min Survey",
    whenToUse: "• Customer used product for a while or after key usage milestones.\n• Seeking input to improve satisfaction and product roadmap.",
    whyItWorks: "Emphasizes customer input importance, making them feel heard and appreciated.",
  },
  {
    id: "tpl_41_51_anniversary",
    name: "41/51. Customer Anniversary Celebration",
    category: "Upselling & Loyalty",
    subjectLine: "1 Year with {{product_name}} — celebrate with us!",
    preheader: "Thank you for your partnership! Special gift inside...",
    bodyCopy: "Hi {{first_name}},\n\nIt’s hard to believe it’s been 1 year since you first joined the {{product_name}} family!\n\nWe’re so grateful for your continued support and partnership.\n\nTo celebrate, we’d like to offer you {{special_promotion}}.\n\nThank you for being a valued customer, and here’s to many more years of success together!\n\nBest,\nEric",
    ctaText: "Claim Anniversary Gift",
    whenToUse: "• Customer sign-up or purchase anniversary date.\n• Celebrating milestones and fostering long-term retention.",
    whyItWorks: "Adds personal touch, proving long-term investment in customer journey beyond initial purchase.",
  },
  {
    id: "tpl_42_52_feedbackfollowup",
    name: "42/52. Feedback Follow-Up & Action Updates",
    category: "Onboarding & Post-Sale",
    subjectLine: "Updating you on your {{product_name}} feedback",
    preheader: "We've implemented suggestions you shared...",
    bodyCopy: "Hi {{first_name}},\n\nThank you again for sharing your feedback on {{product_name}}.\n\nI’m pleased to let you know we’ve already started implementing some of your suggestions.\n\nIf you have any additional thoughts or would like more updates, feel free to reach out—I’d love to hear from you!\n\nBest,\nEric",
    ctaText: "See Implemented Changes",
    whenToUse: "• After receiving customer feedback leading to product changes.\n• Closing feedback loop and showing tangible action.",
    whyItWorks: "Demonstrates active listening and implementation, building trust and deep engagement.",
  },
  {
    id: "tpl_43_53_loyalty",
    name: "43/53. Loyalty Program & VIP Perks",
    category: "Upselling & Loyalty",
    subjectLine: "Exclusive perks await in our loyalty program",
    preheader: "Inviting you to join our VIP partner rewards...",
    bodyCopy: "Hi {{first_name}},\n\nWe’re thrilled to invite you to join our exclusive {{loyalty_program}} as a thank you for being a valued customer.\n\nWith this program, you’ll enjoy exclusive perks and early feature access.\n\nWe’d love for you to take advantage of these perks!\n\nBest,\nEric",
    ctaText: "Join Loyalty Program",
    whenToUse: "• Introducing customers to loyalty or VIP rewards program.\n• Reminding long-term customers of un-claimed perks.",
    whyItWorks: "Incentivizes ongoing engagement by highlighting added value, deepening brand loyalty.",
  },
  {
    id: "tpl_44_breakupfile",
    name: "44. Should I Close Your File? Breakup",
    category: "Follow-Up & Re-Engagement",
    subjectLine: "Should I close your file?",
    preheader: "Assuming timing isn't right for now...",
    bodyCopy: "Hi {{first_name}},\n\nI haven’t heard back and don’t want to keep bothering you.\n\nShould I close your file for now?\n\nIf timing isn’t right, no problem at all. I’d be glad to reconnect down the line.\n\nBest,\nEric",
    ctaText: "Keep My File Open",
    whenToUse: "• After multiple unanswered attempts.\n• Respectful exit message to trigger final response.",
    whyItWorks: "Reverses prospect dynamic; prospects frequently reply to 'close the file' emails to keep doors open.",
  },
  {
    id: "tpl_45_productupdatereengage",
    name: "45. Feature Update Re-Engagement",
    category: "Follow-Up & Re-Engagement",
    subjectLine: "Our new {{feature_name}} could help with {{specific_challenge}}",
    preheader: "New capability launched since we last spoke...",
    bodyCopy: "Hi {{first_name}},\n\nSince we last spoke, we’ve added {{feature_name}} to {{product_name}}.\n\nIt’s designed to solve {{specific_challenge}} that we talked about.\n\nWould you like me to send over a quick overview?\n\nBest,\nEric",
    ctaText: "Send Quick Overview",
    whenToUse: "• Re-engaging cold opportunities after new feature launches.\n• Linking updates directly to past stated pain points.",
    whyItWorks: "Provides fresh, relevant reason to reconnect linked directly to their problem.",
  },
  {
    id: "tpl_54_milestone",
    name: "54. Customer Milestone Celebration",
    category: "Upselling & Loyalty",
    subjectLine: "Congrats on {{customer_milestone}}!",
    preheader: "Exciting to see your hard work paying off...",
    bodyCopy: "Hi {{first_name}},\n\nCongratulations on {{customer_milestone}}!\n\nIt’s exciting to see your hard work pay off.\n\nIf you’d like, I can share ideas from other customers who scaled after hitting similar milestones.\n\nBest,\nEric",
    ctaText: "Explore Next Growth Ideas",
    whenToUse: "• After customer achieves key win (product launch, revenue target).\n• Opening door to expansion or upselling.",
    whyItWorks: "Celebrating success builds immense goodwill while gently seeding expansion opportunities.",
  },
  // 55: Renewal Pre-Check-In
  {
    id: "tpl_55_renewalcheckin",
    name: "55. Renewal Pre-Check-In Email",
    category: "Upselling & Loyalty",
    subjectLine: "Looking ahead to your {{product_name}} renewal",
    preheader: "Checking in early to support your upcoming goals...",
    bodyCopy: "Hi {{first_name}},\n\nYour {{product_name}} renewal is coming up in {{renewal_timeframe}}.\n\nI’d love to check in early to make sure we’re meeting expectations and see if there are new goals we should support.\n\nWould you have time for a quick call next week?\n\nBest,\nEric",
    ctaText: "Schedule Renewal Pre-Check-In Call",
    whenToUse: "• A few months before contract renewal.\n• To prevent churn proactively by checking alignment early.",
    whyItWorks: "Shows you’re invested in customer outcomes and avoids last-minute surprises or panic at renewal time.",
  },
];

export const EmailSequenceMapper: React.FC = () => {
  const [searchFilter, setSearchFilter] = useState<string>("");
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>("All");
  const [showBestPractices, setShowBestPractices] = useState<boolean>(false);

  const [sequence, setSequence] = useState<EmailSequenceStep[]>([
    {
      id: "s1",
      stepNumber: 1,
      title: "1. Cold Email (New Prospect)",
      templateId: "tpl_1_cold",
      category: "Prospecting",
      delay: "Immediate (Day 0)",
      subjectLine: outreach55Templates[0].subjectLine,
      preheader: outreach55Templates[0].preheader,
      bodyCopy: outreach55Templates[0].bodyCopy,
      ctaText: outreach55Templates[0].ctaText,
      whenToUse: outreach55Templates[0].whenToUse,
      whyItWorks: outreach55Templates[0].whyItWorks,
    },
    {
      id: "s2",
      stepNumber: 2,
      title: "36/46. Customer Welcome & Getting Started",
      templateId: "tpl_36_46_welcomecust",
      category: "Onboarding & Post-Sale",
      delay: "Immediate Post-Purchase",
      subjectLine: outreach55Templates[35].subjectLine,
      preheader: outreach55Templates[35].preheader,
      bodyCopy: outreach55Templates[35].bodyCopy,
      ctaText: outreach55Templates[35].ctaText,
      whenToUse: outreach55Templates[35].whenToUse,
      whyItWorks: outreach55Templates[35].whyItWorks,
    },
    {
      id: "s3",
      stepNumber: 3,
      title: "37/47. Upselling & Next Level Tools",
      templateId: "tpl_37_47_upsell",
      category: "Upselling & Loyalty",
      delay: "14 Days Post-Onboarding",
      subjectLine: outreach55Templates[36].subjectLine,
      preheader: outreach55Templates[36].preheader,
      bodyCopy: outreach55Templates[36].bodyCopy,
      ctaText: outreach55Templates[36].ctaText,
      whenToUse: outreach55Templates[36].whenToUse,
      whyItWorks: outreach55Templates[36].whyItWorks,
    },
  ]);

  const [activeStepId, setActiveStepId] = useState<string>("s1");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Token Sandbox State
  const [tokenValues, setTokenValues] = useState<Record<string, string>>({
    first_name: "Alex",
    company_name: "Acme Growth",
    relevant_detail: "expanding multi-platform ad spend",
    specific_benefit: "30% higher CTR and 75% faster launches",
    product_name: "Campaign Manager Dashboard",
    specific_need: "reducing ad aspect ratio errors",
    resource_name: "2026 Marketing Playbook",
    specific_challenge: "fragmented media asset management",
    my_company: "KB Academy",
    desired_result: "scalable affiliate campaign growth",
    mutual_contact: "Sarah Jenkins",
    event_name: "Affiliate World Summit",
    specific_topic: "vertical video hooks",
    report_name: "Q3 Multi-Channel Benchmark Report",
    specific_trend: "privacy-first Meta CAPI tracking",
    shared_connection: "attended the Growth Summit",
    season_holiday: "Summer",
    special_promotion: "20% off annual plan",
    pricing_tiers: "$49 Starter, $99 Growth, $199 Pro",
    client_name: "Sarah M.",
    testimonial_quote: "Consolidating graphics and copy cut our weekly ad setup time from 15 hours to 2 hours.",
    feature_name: "Dynamic Aspect Ratio Prompter",
    competitor_name: "Generic Ad Tools",
    unique_advantages: "unified DAM media storage, AI Co-Pilot with human touch, and ROAS profit simulator",
    webinar_date: "Thursday at 2 PM EST",
    webinar_link: "https://kbacademy.com/webinar",
    customer_milestone: "10,000 ad conversions",
    loyalty_program: "VIP Founder Club",
    renewal_timeframe: "2 months",
  });

  const activeStep = sequence.find((e) => e.id === activeStepId) || sequence[0];

  const handleApplyTemplateToActiveStep = (tpl: OutreachTemplate) => {
    setSequence((prev) =>
      prev.map((item) =>
        item.id === activeStepId
          ? {
              ...item,
              title: tpl.name,
              templateId: tpl.id,
              category: tpl.category,
              subjectLine: tpl.subjectLine,
              preheader: tpl.preheader,
              bodyCopy: tpl.bodyCopy,
              ctaText: tpl.ctaText,
              whenToUse: tpl.whenToUse,
              whyItWorks: tpl.whyItWorks,
            }
          : item
      )
    );
  };

  const handleUpdateActiveStep = (field: keyof EmailSequenceStep, value: any) => {
    setSequence((prev) =>
      prev.map((item) => (item.id === activeStepId ? { ...item, [field]: value } : item))
    );
  };

  const handleAddStep = () => {
    const nextNum = sequence.length + 1;
    const defaultTpl = outreach55Templates[1]; // Followup
    const newStep: EmailSequenceStep = {
      id: `s_${Date.now()}`,
      stepNumber: nextNum,
      title: `${nextNum}. Follow-Up Step`,
      templateId: defaultTpl.id,
      category: defaultTpl.category,
      delay: `${nextNum - 1} Days After Previous`,
      subjectLine: defaultTpl.subjectLine,
      preheader: defaultTpl.preheader,
      bodyCopy: defaultTpl.bodyCopy,
      ctaText: defaultTpl.ctaText,
      whenToUse: defaultTpl.whenToUse,
      whyItWorks: defaultTpl.whyItWorks,
    };
    setSequence([...sequence, newStep]);
    setActiveStepId(newStep.id);
  };

  const handleDeleteStep = (id: string) => {
    if (sequence.length <= 1) return;
    const filtered = sequence.filter((s) => s.id !== id);
    const reindexed = filtered.map((s, idx) => ({ ...s, stepNumber: idx + 1 }));
    setSequence(reindexed);
    setActiveStepId(reindexed[0].id);
  };

  const interpolate = (text: string) => {
    let result = text || "";
    Object.entries(tokenValues).forEach(([key, val]) => {
      result = result.replaceAll(`{{${key}}}`, val);
    });
    return result;
  };

  const handleCopyText = (stepItem: EmailSequenceStep) => {
    const text = `Subject: ${interpolate(stepItem.subjectLine)}\nPreheader: ${interpolate(stepItem.preheader)}\n\n${interpolate(stepItem.bodyCopy)}\n\n[CTA Button: ${interpolate(stepItem.ctaText)}]`;
    navigator.clipboard.writeText(text);
    setCopiedId(stepItem.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const insertToken = (tokenKey: string) => {
    handleUpdateActiveStep("bodyCopy", activeStep.bodyCopy + ` {{${tokenKey}}} `);
  };

  const categories = [
    "All",
    "Prospecting",
    "Follow-Up & Re-Engagement",
    "Demo & Proposals",
    "Closing & Contracts",
    "Onboarding & Post-Sale",
    "Upselling & Loyalty",
  ];

  const filteredTemplates = outreach55Templates.filter((t) => {
    const matchesCategory = selectedCategoryFilter === "All" || t.category === selectedCategoryFilter;
    const matchesSearch =
      t.name.toLowerCase().includes(searchFilter.toLowerCase()) ||
      t.subjectLine.toLowerCase().includes(searchFilter.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Outreach.ai Deliverability & Health Checks
  const subjectLen = activeStep.subjectLine.length;
  const isSubjectOptimal = subjectLen > 0 && subjectLen <= 50;
  const paragraphCount = (activeStep.bodyCopy.match(/\n\n/g) || []).length + 1;

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Mail className="w-5 h-5 text-purple-400" />
            <h3 className="text-lg font-bold text-slate-100">Outreach.ai 55-Template Master Sales Email Catalog & Deliverability Audit</h3>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Complete 55-template master catalog with integrated SPF/DKIM/DMARC deliverability audit & Outreach.ai best practices.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowBestPractices(!showBestPractices)}
            className="px-3.5 py-2 bg-purple-950/60 border border-purple-800/60 hover:bg-purple-900/80 text-purple-300 rounded-xl text-xs font-bold flex items-center gap-1.5 transition"
          >
            <ShieldCheck className="w-4 h-4 text-purple-400" /> Deliverability Audit
          </button>

          <button
            onClick={handleAddStep}
            className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-xs font-bold flex items-center gap-2 transition shadow-md shadow-purple-600/20 shrink-0"
          >
            <Plus className="w-4 h-4" /> Add Sequence Step
          </button>
        </div>
      </div>

      {/* Deliverability & Outreach.ai Best Practices Audit Drawer */}
      {showBestPractices && (
        <div className="bg-slate-900 border border-purple-500/40 rounded-2xl p-6 space-y-4 text-xs text-slate-300 shadow-xl animate-in fade-in duration-200">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2 text-sm font-bold text-slate-100">
              <ShieldCheck className="w-5 h-5 text-emerald-400" /> Outreach.ai Deliverability & Sales Best Practices Checklist
            </div>
            <button onClick={() => setShowBestPractices(false)} className="text-slate-400 hover:text-white">✕</button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-1">
              <div className="font-bold text-slate-200 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" /> 1. Subject Line Length
              </div>
              <p className="text-[11px] text-slate-400">Keep under 50 characters. Current length: <strong className={isSubjectOptimal ? "text-emerald-400" : "text-amber-400"}>{subjectLen} chars</strong>.</p>
            </div>

            <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-1">
              <div className="font-bold text-slate-200 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" /> 2. Brevity & Mobile Formatting
              </div>
              <p className="text-[11px] text-slate-400">Aim for 3-5 short paragraphs. Current: <strong className="text-indigo-300">{paragraphCount} paragraphs</strong>.</p>
            </div>

            <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-1">
              <div className="font-bold text-slate-200 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" /> 3. Single Specific CTA
              </div>
              <p className="text-[11px] text-slate-400">Every email must end with a single, clear action ask (e.g. "Schedule a quick call").</p>
            </div>

            <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-1">
              <div className="font-bold text-slate-200 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" /> 4. Domain Authentication
              </div>
              <p className="text-[11px] text-slate-400">Ensure proper SPF, DKIM, and DMARC record implementation to maintain primary inbox placement.</p>
            </div>

            <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-1">
              <div className="font-bold text-slate-200 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" /> 5. Proactive Renewal Check-In
              </div>
              <p className="text-[11px] text-slate-400">Initiate renewal check-ins 60-90 days early (Template #55) to eliminate last-minute churn surprises.</p>
            </div>

            <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-1">
              <div className="font-bold text-slate-200 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" /> 6. Consistent Sequencing
              </div>
              <p className="text-[11px] text-slate-400">Space follow-ups 3-5 days apart. Consistent multi-touch cadence increases reply rates by 2.4x.</p>
            </div>
          </div>
        </div>
      )}

      {/* Searchable Master Catalog Grid */}
      <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
          <div className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-purple-400" /> Master Catalog ({filteredTemplates.length} / 55 Battle-Tested Templates):
          </div>

          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
              <input
                type="text"
                placeholder="Search 55 templates..."
                value={searchFilter}
                onChange={(e) => setSearchFilter(e.target.value)}
                className="bg-slate-950 border border-slate-800 rounded-xl pl-8 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
              />
            </div>
          </div>
        </div>

        {/* Category Filters */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategoryFilter(cat)}
              className={`px-3 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition ${
                selectedCategoryFilter === cat
                  ? "bg-purple-600 text-white"
                  : "bg-slate-950 border border-slate-800 text-slate-400 hover:text-slate-200"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Templates Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 max-h-72 overflow-y-auto pr-1">
          {filteredTemplates.map((tpl) => (
            <button
              key={tpl.id}
              onClick={() => handleApplyTemplateToActiveStep(tpl)}
              className={`p-3 rounded-xl border text-left text-xs transition flex flex-col justify-between space-y-2 ${
                activeStep.templateId === tpl.id
                  ? "bg-purple-950/80 border-purple-500 text-purple-200 shadow-md ring-1 ring-purple-500"
                  : "bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200"
              }`}
            >
              <div>
                <div className="font-bold text-slate-100 text-xs truncate">{tpl.name}</div>
                <div className="text-[11px] text-purple-300 font-mono italic truncate mt-0.5">
                  "{tpl.subjectLine}"
                </div>
              </div>
              <div className="flex items-center justify-between pt-1 border-t border-slate-800/60 text-[9px]">
                <span className="px-2 py-0.5 bg-slate-900 text-slate-300 rounded font-semibold truncate max-w-[120px]">{tpl.category}</span>
                <span className="text-purple-400 font-bold shrink-0">Apply ➔</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Main Sequence Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sequence Steps Sidebar */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-4">
          <div className="flex items-center justify-between">
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Sequence Workflow ({sequence.length} Steps)
            </div>
            <button onClick={handleAddStep} className="text-xs text-purple-400 hover:text-purple-300 font-semibold">
              + Add Step
            </button>
          </div>

          <div className="space-y-2">
            {sequence.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveStepId(item.id)}
                className={`w-full p-3.5 rounded-xl border text-left transition flex items-center justify-between ${
                  activeStepId === item.id
                    ? "bg-purple-950/60 border-purple-500 text-purple-200 shadow-md"
                    : "bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700"
                }`}
              >
                <div className="space-y-1 truncate">
                  <div className="text-xs font-bold text-slate-100 truncate">{item.title}</div>
                  <div className="flex items-center gap-2 text-[10px]">
                    <span className="px-2 py-0.5 bg-purple-950 text-purple-300 rounded font-semibold border border-purple-800/40 truncate max-w-[100px]">
                      {item.category}
                    </span>
                    <span className="opacity-75">{item.delay}</span>
                  </div>
                </div>
                <Send className="w-3.5 h-3.5 shrink-0 opacity-60 ml-2" />
              </button>
            ))}
          </div>

          {/* Sandbox Live Variable Customizer */}
          <div className="border-t border-slate-800 pt-4 space-y-3">
            <div className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-yellow-300" /> Token Sandbox Values
            </div>

            <div className="space-y-2 text-xs max-h-56 overflow-y-auto pr-1">
              {Object.keys(tokenValues).map((key) => (
                <div key={key}>
                  <span className="text-[10px] text-slate-400 font-mono">{`{{${key}}}`}</span>
                  <input
                    type="text"
                    value={tokenValues[key]}
                    onChange={(e) => setTokenValues({ ...tokenValues, [key]: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2 py-1 text-slate-200 mt-0.5 text-xs"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Step Editor & Educational Cards */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-5">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div>
                <h4 className="font-bold text-base text-slate-100">{activeStep.title}</h4>
                <span className="text-xs text-purple-400 font-semibold">{activeStep.category} | {activeStep.delay}</span>
              </div>

              <div className="flex items-center gap-2">
                {sequence.length > 1 && (
                  <button
                    onClick={() => handleDeleteStep(activeStep.id)}
                    className="p-2 text-rose-400 hover:bg-rose-950/40 rounded-lg transition"
                    title="Delete step"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}

                <button
                  onClick={() => handleCopyText(activeStep)}
                  className="px-3.5 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition shadow-md shadow-purple-600/20"
                >
                  {copiedId === activeStep.id ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-300" /> Copied Text!
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" /> Copy Email Text
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Educational Outreach.ai Rationale Card */}
            {(activeStep.whenToUse || activeStep.whyItWorks) && (
              <div className="bg-purple-950/40 border border-purple-800/50 rounded-xl p-4 space-y-2.5 text-xs text-purple-200">
                {activeStep.whenToUse && (
                  <div className="flex items-start gap-2">
                    <HelpCircle className="w-4 h-4 text-purple-300 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold uppercase tracking-wider text-[10px] text-purple-300 block">When to use it:</span>
                      <div className="whitespace-pre-line mt-0.5">{activeStep.whenToUse}</div>
                    </div>
                  </div>
                )}
                {activeStep.whyItWorks && (
                  <div className="flex items-start gap-2 border-t border-purple-800/40 pt-2">
                    <Lightbulb className="w-4 h-4 text-yellow-300 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold uppercase tracking-wider text-[10px] text-yellow-300 block">Why this works:</span>
                      <div className="mt-0.5">{activeStep.whyItWorks}</div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Quick Variable Token Insertion Chips */}
            <div className="space-y-1.5">
              <div className="text-[10px] font-bold text-slate-400 uppercase">Click Token Chip to Insert:</div>
              <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto">
                {Object.keys(tokenValues).map((tKey) => (
                  <button
                    key={tKey}
                    type="button"
                    onClick={() => insertToken(tKey)}
                    className="px-2 py-0.5 bg-slate-950 hover:bg-slate-800 border border-slate-700 text-purple-300 rounded text-[11px] font-mono transition"
                  >
                    + {`{{${tKey}}}`}
                  </button>
                ))}
              </div>
            </div>

            {/* Fields */}
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase mb-1 flex justify-between">
                  <span>Subject Line Template</span>
                  <span className={`text-[10px] font-mono ${isSubjectOptimal ? "text-emerald-400" : "text-amber-400"}`}>
                    {subjectLen}/50 chars (Optimal: under 50)
                  </span>
                </label>
                <input
                  type="text"
                  value={activeStep.subjectLine}
                  onChange={(e) => handleUpdateActiveStep("subjectLine", e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-slate-100"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">
                  Preheader Snippet
                </label>
                <input
                  type="text"
                  value={activeStep.preheader}
                  onChange={(e) => handleUpdateActiveStep("preheader", e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-slate-100"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">
                  Body Copy Template
                </label>
                <textarea
                  rows={8}
                  value={activeStep.bodyCopy}
                  onChange={(e) => handleUpdateActiveStep("bodyCopy", e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3.5 text-xs text-slate-100 font-mono leading-relaxed"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">
                  CTA Button Label
                </label>
                <input
                  type="text"
                  value={activeStep.ctaText}
                  onChange={(e) => handleUpdateActiveStep("ctaText", e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-slate-100"
                />
              </div>
            </div>
          </div>

          {/* Live Recipient Email Preview */}
          <div className="bg-slate-900 border border-purple-500/30 rounded-2xl p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2 text-xs font-bold text-purple-300">
                <Eye className="w-4 h-4 text-purple-400" /> Live Rendered Recipient Email ({tokenValues.first_name})
              </div>
              <span className="text-[10px] bg-purple-950 px-2 py-0.5 rounded text-purple-300 font-mono">
                OUTREACH.AI FORMAT
              </span>
            </div>

            <div className="bg-slate-950 p-5 rounded-xl border border-slate-800 space-y-3">
              <div className="border-b border-slate-800/80 pb-2 space-y-1">
                <div className="text-sm font-bold text-slate-100">
                  {interpolate(activeStep.subjectLine)}
                </div>
                <div className="text-xs text-slate-400">
                  Preheader: <span className="italic">{interpolate(activeStep.preheader)}</span>
                </div>
              </div>

              <div className="text-xs text-slate-300 leading-relaxed whitespace-pre-wrap font-sans">
                {interpolate(activeStep.bodyCopy)}
              </div>

              {activeStep.ctaText && (
                <div className="pt-3">
                  <div className="inline-block px-5 py-2 bg-purple-600 text-white rounded-lg text-xs font-bold shadow-md">
                    {interpolate(activeStep.ctaText)}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
