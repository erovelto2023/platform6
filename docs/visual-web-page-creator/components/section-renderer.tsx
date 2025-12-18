"use client"

import { useMemo } from "react"
import type { Section, Template } from "@/lib/types"
import { HeroCentered } from "./sections/hero-centered"
import { HeroSplit } from "./sections/hero-split"
import { FeaturesGrid } from "./sections/features-grid"
import { CallToAction } from "./sections/call-to-action"
import { ContentTwoColumn } from "./sections/content-two-column"
import { HeroVideoBg } from "./sections/hero-video-bg"
import { TestimonialsSlider } from "./sections/testimonials-slider"
import { PricingTable } from "./sections/pricing-table"
import { FAQAccordion } from "./sections/faq-accordion"
import { StatsSection } from "./sections/stats-section"
import { ImageGallery } from "./sections/image-gallery"
import { TeamGrid } from "./sections/team-grid"
import { NewsletterSignup } from "./sections/newsletter-signup"
import { BlogGrid } from "./sections/blog-grid"
import { ProcessSteps } from "./sections/process-steps"
import { LogoCloud } from "./sections/logo-cloud"
import { FeatureComparison } from "./sections/feature-comparison"
import { CountdownTimer } from "./sections/countdown-timer"
import { VideoEmbed } from "./sections/video-embed"
import { ContactForm } from "./sections/contact-form"
import { FooterSection } from "./sections/footer-section"
import { GlobalHeader } from "./sections/global-header"
import { StickyHeader } from "./sections/sticky-header"
import { AnnouncementBar } from "./sections/announcement-bar"
import { MegaMenu } from "./sections/mega-menu"
import { SidebarLayout } from "./sections/sidebar-layout"
import { SubFooter } from "./sections/sub-footer"
import { SectionWrapper } from "./sections/section-wrapper"
import { FullWidthSection } from "./sections/full-width-section"
import { BoxedSection } from "./sections/boxed-section"
import { SplitLayout } from "./sections/split-layout"
import { GridLayout } from "./sections/grid-layout"
import { MasonryLayout } from "./sections/masonry-layout"
import { CardGrid } from "./sections/card-grid"
import { FlexStack } from "./sections/flex-stack"
import { SpacerDivider } from "./sections/spacer-divider"
import { BackgroundSection } from "./sections/background-section"
import { HeroWithForm } from "./sections/hero-with-form"
import { HeroSocialProof } from "./sections/hero-social-proof"
import { HeroMinimal } from "./sections/hero-minimal"
import { HeroProductLaunch } from "./sections/hero-product-launch"
import { HeroWebinar } from "./sections/hero-webinar"
import { HeroAppDownload } from "./sections/hero-app-download"
import { HeroCourse } from "./sections/hero-course"
import { LogoBar } from "./sections/logo-bar"
import { BeforeAfter } from "./sections/before-after"
import { GuaranteeSection } from "./sections/guarantee-section"
import { AwardsCertifications } from "./sections/awards-certifications"
import { TrustBadges } from "./sections/trust-badges"
import { CustomerLoveWall } from "./sections/customer-love-wall"
import { TabbedFeatures } from "./sections/tabbed-features"
import { VideoTestimonials } from "./sections/video-testimonials"
import { LiveActivityFeed } from "./sections/live-activity-feed"
import { ComparisonPricing } from "./sections/comparison-pricing"
import { LeadMagnetOptin } from "./sections/lead-magnet-optin"
import { MultiStepForm } from "./sections/multi-step-form"
import { AboutStory } from "./sections/about-story"
import { DemoRequest } from "./sections/demo-request"
import { TextBlock } from "./sections/text-block"
import { RichText } from "./sections/rich-text"
import { HeadlineSubheadline } from "./sections/headline-subheadline"
import { LongFormContent } from "./sections/long-form-content"
import { FeatureList } from "./sections/feature-list"
import { IconText } from "./sections/icon-text"
import { NumberedSteps } from "./sections/numbered-steps"
import { Timeline } from "./sections/timeline"
import { HowItWorks } from "./sections/how-it-works"
import { AboutUs } from "./sections/about-us"
import { MissionVision } from "./sections/mission-vision"
import { Values } from "./sections/values"
import { StoryNarrative } from "./sections/story-narrative"
import { BioTeamIntro } from "./sections/bio-team-intro"
import { KnowledgeBase } from "./sections/knowledge-base"
import { Documentation } from "./sections/documentation"
import { Glossary } from "./sections/glossary"
import { ImageBlock } from "./sections/image-block"
import { LightboxGallery } from "./sections/lightbox-gallery"
import { SliderCarousel } from "./sections/slider-carousel"
import { AudioPlayer } from "./sections/audio-player"
import { PodcastEpisode } from "./sections/podcast-episode"
import { ImageTextSplit } from "./sections/image-text-split"
import { ImageHotspots } from "./sections/image-hotspots"
import { AnimatedMedia } from "./sections/animated-media"
import { CtaBar } from "./sections/cta-bar"
import { CtaButtonGrid } from "./sections/cta-button-grid"
import { LeadCapture } from "./sections/lead-capture"
import { OptinSignup } from "./sections/optin-signup"
import { QuizAssessment } from "./sections/quiz-assessment"
import { OfferStack } from "./sections/offer-stack"
import { BonusStack } from "./sections/bonus-stack"
import { ScarcitySection } from "./sections/scarcity-section"
import { UpsellCrosssell } from "./sections/upsell-crosssell"
import { CheckoutEmbed } from "./sections/checkout-embed"
import { PaymentButton } from "./sections/payment-button"
import { ReviewsGrid } from "./sections/reviews-grid"
import { StarRatings } from "./sections/star-ratings"
import { CaseStudies } from "./sections/case-studies"
import { SuccessStories } from "./sections/success-stories"
import { MediaMentions } from "./sections/media-mentions"
import { UserGeneratedContent } from "./sections/user-generated-content"
import { InfluencerEndorsements } from "./sections/influencer-endorsements"
import { CommunityProof } from "./sections/community-proof"
import { ProductGrid } from "./sections/product-grid"
import { FeaturedProduct } from "./sections/featured-product"
import { ProductComparison } from "./sections/product-comparison"
import { ProductHighlights } from "./sections/product-highlights"
import { ProductSpecs } from "./sections/product-specs"
import { AddToCart } from "./sections/add-to-cart"
import { CartSummary } from "./sections/cart-summary"
import { BundleOffers } from "./sections/bundle-offers"
import { RelatedProducts } from "./sections/related-products"
import { RecentlyViewed } from "./sections/recently-viewed"
import { SubscriptionPlans } from "./sections/subscription-plans"
import { DigitalDownload } from "./sections/digital-download"

interface SectionRendererProps {
  section: Section
  template: Template
  isSelected?: boolean
  onClick?: () => void
}

export function SectionRenderer({ section, template, isSelected, onClick }: SectionRendererProps) {
  const Component = useMemo(() => {
    if (template.customCode) {
      return createCustomComponent(template.customCode, template.componentType)
    }
    return getComponentByType(template.componentType)
  }, [template.customCode, template.componentType])

  return (
    <div
      onClick={onClick}
      className={`relative transition-all ${
        isSelected ? "ring-4 ring-blue-500 ring-offset-2" : "hover:ring-2 hover:ring-gray-300"
      }`}
    >
      <Component content={section.content} style={section.style} />
    </div>
  )
}

function createCustomComponent(code: string, componentName: string) {
  try {
    // Create a function from the code string
    const componentFunction = new Function(
      "React",
      `
      ${code}
      return ${componentName};
    `,
    )

    // Import React to pass to the function
    const React = require("react")
    return componentFunction(React)
  } catch (error) {
    console.error("[v0] Error creating custom component:", error)
    // Return a fallback component that shows the error
    return function ErrorComponent({ content }: any) {
      return (
        <div className="bg-red-50 border-2 border-red-200 p-8 text-center">
          <h3 className="text-red-700 font-semibold mb-2">Component Error</h3>
          <p className="text-red-600 text-sm">Failed to render custom component. Check your code syntax.</p>
          <pre className="mt-4 text-xs text-left bg-red-100 p-4 rounded overflow-x-auto">
            {error instanceof Error ? error.message : "Unknown error"}
          </pre>
        </div>
      )
    }
  }
}

function getComponentByType(type: string) {
  const components: Record<string, any> = {
    HeroCentered,
    HeroSplit,
    FeaturesGrid,
    CallToAction,
    ContentTwoColumn,
    HeroVideoBg,
    TestimonialsSlider,
    PricingTable,
    FAQAccordion,
    StatsSection,
    ImageGallery,
    TeamGrid,
    NewsletterSignup,
    BlogGrid,
    ProcessSteps,
    LogoCloud,
    FeatureComparison,
    CountdownTimer,
    VideoEmbed,
    ContactForm,
    FooterSection,
    GlobalHeader,
    StickyHeader,
    AnnouncementBar,
    MegaMenu,
    SidebarLayout,
    SubFooter,
    SectionWrapper,
    FullWidthSection,
    BoxedSection,
    SplitLayout,
    GridLayout,
    MasonryLayout,
    CardGrid,
    FlexStack,
    SpacerDivider,
    BackgroundSection,
    HeroWithForm,
    HeroSocialProof,
    HeroMinimal,
    HeroProductLaunch,
    HeroWebinar,
    HeroAppDownload,
    HeroCourse,
    LogoBar,
    BeforeAfter,
    GuaranteeSection,
    AwardsCertifications,
    TrustBadges,
    CustomerLoveWall,
    TabbedFeatures,
    VideoTestimonials,
    LiveActivityFeed,
    ComparisonPricing,
    LeadMagnetOptin,
    MultiStepForm,
    AboutStory,
    DemoRequest,
    TextBlock,
    RichText,
    HeadlineSubheadline,
    LongFormContent,
    FeatureList,
    IconText,
    NumberedSteps,
    Timeline,
    HowItWorks,
    AboutUs,
    MissionVision,
    Values,
    StoryNarrative,
    BioTeamIntro,
    KnowledgeBase,
    Documentation,
    Glossary,
    ImageBlock,
    LightboxGallery,
    SliderCarousel,
    AudioPlayer,
    PodcastEpisode,
    ImageTextSplit,
    ImageHotspots,
    AnimatedMedia,
    CtaBar,
    CtaButtonGrid,
    LeadCapture,
    OptinSignup,
    QuizAssessment,
    OfferStack,
    BonusStack,
    ScarcitySection,
    UpsellCrosssell,
    CheckoutEmbed,
    PaymentButton,
    ReviewsGrid,
    StarRatings,
    CaseStudies,
    SuccessStories,
    MediaMentions,
    UserGeneratedContent,
    InfluencerEndorsements,
    CommunityProof,
    ProductGrid,
    FeaturedProduct,
    ProductComparison,
    ProductHighlights,
    ProductSpecs,
    AddToCart,
    CartSummary,
    BundleOffers,
    RelatedProducts,
    RecentlyViewed,
    SubscriptionPlans,
    DigitalDownload,
  }

  return components[type] || HeroCentered
}
