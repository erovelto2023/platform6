"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { 
  Search, TrendingUp, Map, FileText, Download, Upload, Plus, Trash2, 
  Database, Terminal, Layers, CheckCircle, Lightbulb, Copy, Globe, 
  UserCircle, Clock, DollarSign, AlertCircle, Link as LinkIcon, Paperclip, Target,
  Briefcase, Heart, BrainCircuit, Rss, ShoppingCart, Save, Info, Video, ShoppingBag,
  BookOpen, HelpCircle, Users, Palette, PenTool, Zap, Map as MapIcon, Compass
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import NicheImporter from '@/components/admin/NicheImporter';
import { UploadButton } from '@/lib/uploadthing';

const NicheBoxContext = React.createContext<{ data: NicheBoxData; updateField: (path: string, value: any) => void } | null>(null);

interface SEOKeyword {
  keyword: string;
  searchVolume: string;
  searchIntent: string;
  serpFeatures: string;
  cpc: string;
  competitionDifficulty: string;
}

interface MarketTrend {
  query: string;
  search: string;
  interest: string;
  increase: string;
}

interface ContentAsset {
  category: string;
  name: string;
  title: string;
  description: string;
  type: string;
  fileUrl: string;
  link: string;
  fileName: string;
}

interface BusinessModel {
  name: string;
  description: string;
  profitPotential: string;
}

interface RecommendedTool {
  toolName: string;
  cost: string;
  purpose: string;
  priority: string;
  affiliateLink: string;
}

interface CustomerAvatar {
  demographics: {
    age: string;
    gender: string;
    location: string;
    educationLevel: string;
    incomeLevel: string;
    familyStatus: string;
  };
  psychographics: {
    coreValues: string;
    beliefs: string;
    interestsHobbies: string;
    lifestyleTraits: string;
    personalityType: string;
  };
  professional: {
    occupation: string;
    industry: string;
    jobTitle: string;
    dailyResponsibilities: string;
  };
  psychology: {
    painPoints: string;
    frustrations: string;
    biggestChallenges: string;
    obstaclesToSuccess: string;
    primaryGoals: string;
    deepestDesires: string;
    aspirations: string;
    fears: string;
    whatKeepsThemUpAtNight: string;
    commonObjections: string;
    buyingHesitations: string;
  };
  informationDiet: {
    favoriteBlogsWebsites: string;
    topPodcasts: string;
    gurusInfluencers: string;
    primarySocialMedia: string;
    booksMagazines: string;
  };
  buyingBehavior: {
    decisionMakingProcess: string;
    priceSensitivity: string;
    keyPurchasingDrivers: string;
    brandAffinities: string;
  };
}

interface RoadmapPhase {
  id: number;
  name: string;
  duration: string;
  budget: string;
  description: string;
  tasks: string[];
}

interface ContentIdeas {
  social: string;
  video: string;
  products: string;
  articles: string;
  questions: string;
  audience: string;
  visual: string;
  pinterest: string;
  youtube: string;
  tiktok: string;
  instagram: string;
  instagramReel: string;
  facebook: string;
  linkedin: string;
  twitter: string;
  podcast: string;
  shortForm: string;
  longForm: string;
  liveStream: string;
  amazon: string;
  etsy: string;
  digital: string;
  printOnDemand: string;
  merchandise: string;
  course: string;
  miniCourse: string;
  membership: string;
  subscription: string;
  bundle: string;
  template: string;
  printable: string;
  blogPost: string;
  article: string;
  guide: string;
  tutorial: string;
  caseStudy: string;
  listicle: string;
  opinion: string;
  beginnerGuide: string;
  advancedStrategy: string;
  stepByStep: string;
  comparison: string;
  review: string;
  toolsList: string;
  leadMagnet: string;
  ebook: string;
  workbook: string;
  checklist: string;
  cheatSheet: string;
  framework: string;
  swipeFile: string;
  resourceList: string;
  toolkit: string;
  faq: string;
  beginnerQuestions: string;
  advancedQuestions: string;
  expertQuestions: string;
  troubleshooting: string;
  problemSolving: string;
  mythVsFact: string;
  debate: string;
  whatVsWhy: string;
  howTo: string;
  whenTo: string;
  whereTo: string;
  trending: string;
  seasonal: string;
  evergreen: string;
  communityDiscussion: string;
  forumThread: string;
  poll: string;
  survey: string;
  ama: string;
  painPoints: string;
  problems: string;
  goals: string;
  desires: string;
  objections: string;
  mistakes: string;
  fears: string;
  contentSeries: string;
  challenge: string;
  daily: string;
  weekly: string;
  educationalSeries: string;
  storytelling: string;
  infographic: string;
  visualGuide: string;
  dataVisualization: string;
  mindMap: string;
  flowchart: string;
  brandStory: string;
  founderStory: string;
  behindScenes: string;
  dayInLife: string;
  processBreakdown: string;
  industryTrend: string;
  marketAnalysis: string;
  futurePredictions: string;
  innovation: string;
  toolList: string;
  resourceRoundup: string;
  softwareComparison: string;
  workflow: string;
  habit: string;
  productivity: string;
  goalSetting: string;
  mindset: string;
  successPrinciples: string;
  mythBusting: string;
  commonMistakes: string;
  beginnerPitfalls: string;
  expertSecrets: string;
  littleKnownTips: string;
}

interface NicheBoxData {
  status: 'draft' | 'published' | 'archived';
  // Form 1 - Niche
  nicheName: string;
  nicheSlug: string;
  category: string;
  competition: string;
  marketSize: string;
  growthRate: string;
  estimatedValue: string;
  thumbnailImage: string;
  heroImage: string;
  // Form 2 - Research
  research: {
    marketOverview: string;
    topTrends: MarketTrend[];
    risingTrends: MarketTrend[];
    opportunities: string[];
  };
  // Form 2.5 - Avatar
  customerAvatar: CustomerAvatar;
  // Form 3 - SEO
  keywords: SEOKeyword[];
  // Form 4 - Assets
  assets: ContentAsset[];
  // Form 5 - Roadmap
  phases: RoadmapPhase[];
  // Form 6 - Business Models
  businessModels: BusinessModel[];
  // Form 7 - Tools
  recommendedTools: RecommendedTool[];
  // Form 8 - Content Ideas
  ideas: ContentIdeas;
}

const ASSET_LIBRARY = {
  "Written Content": [
    "Blog Posts", "Articles", "Guides", "Tutorials", "How-To Posts", "Case Studies", 
    "White Papers", "Research Reports", "Industry Reports", "eBooks", "Workbooks", 
    "Checklists", "Cheat Sheets", "Resource Lists", "Templates", "Worksheets", 
    "Manuals", "Playbooks", "Toolkits", "Framework Documents", "Strategy Documents", 
    "Standard Operating Procedures (SOPs)", "Scripts", "Swipe Files", "Email Sequences", 
    "Sales Letters", "Product Documentation", "FAQs", "Glossaries"
  ],
  "Visual Assets": [
    "Infographics", "Data Visualizations", "Charts", "Graphs", "Diagrams", 
    "Flowcharts", "Mind Maps", "Process Maps", "Pinterest Pins", "Illustrations", 
    "Icons", "Memes", "Quote Cards", "Slide Decks", "Presentation Slides", 
    "Visual Frameworks", "Posters", "Printables", "Visual Worksheets"
  ],
  "Video & Audio": [
    "Explainer Videos", "Tutorial Videos", "Educational Lessons", "Webinars", 
    "Live Streams", "Product Demonstrations", "Case Study Videos", "Interview Videos", 
    "Documentary Style Videos", "Video Courses", "Short Form Videos", "Video Ads",
    "Podcasts", "Audiobooks", "Audio Courses", "Guided Trainings", "Audio Lessons", 
    "Audio Interviews", "Recorded Webinars"
  ],
  "Interactive": [
    "Quizzes", "Calculators", "Assessments", "Surveys", "Polls", "Interactive Tools", 
    "Interactive Infographics", "Interactive Maps", "Simulators", "Decision Trees"
  ],
  "Educational": [
    "Online Courses", "Mini Courses", "Masterclasses", "Lesson Plans", "Curriculum Guides", 
    "Study Guides", "Practice Tests", "Flashcards", "Learning Modules", "Certification Programs"
  ],
  "Marketing & Sales": [
    "Landing Pages", "Lead Magnets", "Email Newsletters", "Email Drip Campaigns", 
    "Ad Creatives", "Social Media Posts", "Social Media Carousels", "Content Calendars", 
    "Brand Guidelines", "Media Kits", "Pitch Decks"
  ],
  "Community": [
    "Forum Discussions", "AMA Sessions", "Community Challenges", "Member Spotlights", 
    "User Generated Content", "Knowledge Base Articles", "Resource Libraries"
  ],
  "Research & Data": [
    "Original Research", "Benchmark Studies", "Market Analysis", "Trend Reports", 
    "Data Sets", "Survey Findings"
  ],
  "Technical": [
    "Spreadsheets", "Dashboards", "Software Tools", "Apps", "Plugins", "Code Snippets", 
    "Automation Templates"
  ],
  "Print & Physical": [
    "Books", "Magazines", "Printed Workbooks", "Posters", "Flyers", "Brochures", 
    "Coloring Books"
  ]
};

const CATEGORIES = [
  "Home & Hobby", "Business & Finance", "Health & Fitness", "Technology", 
  "Education & Learning", "Travel & Lifestyle", "Food & Cooking", "Fashion & Beauty",
  "Sports & Recreation", "Arts & Crafts", "Pets & Animals", "Gardening", 
  "Parenting & Family", "Career & Professional", "Self Improvement"
];

const StableInput = React.memo(({ 
  value, 
  onChange, 
  placeholder, 
  type = "text",
  className = ""
}: {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  type?: string;
  className?: string;
}) => {
  return type === "textarea" ? (
    <Textarea 
      className={`w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm text-slate-900 focus:ring-1 focus:ring-black outline-none min-h-[80px] ${className}`}
      value={value} 
      onChange={(e) => onChange(e.target.value)} 
      placeholder={placeholder} 
    />
  ) : (
    <Input 
      type={type} 
      className={`w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-sm text-slate-900 focus:ring-1 focus:ring-black outline-none ${className}`}
      value={value} 
      onChange={(e) => onChange(e.target.value)} 
      placeholder={placeholder} 
    />
  );
});

const InputField = React.memo(({ label, path, placeholder, type = "text" }: {
  label: string;
  path: string;
  placeholder: string;
  type?: string;
}) => {
  const ctx = React.useContext(NicheBoxContext);
  if (!ctx) return null;
  const { data, updateField } = ctx;
  const keys = path.split('.');
  let value: any = data;
  keys.forEach(k => value = value?.[k]);
  
  return (
    <div className="space-y-1">
      <Label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">{label}</Label>
      <StableInput 
        value={value || ''} 
        onChange={(newValue) => updateField(path, newValue)}
        placeholder={placeholder} 
        type={type}
      />
    </div>
  );
});

export default function NicheBoxEdit() {
  const params = useParams();
  const slug = params?.slug as string;
  const router = useRouter();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('niche');
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState<NicheBoxData>({
    status: 'published',
    nicheName: '',
    nicheSlug: '',
    category: '',
    competition: 'Medium',
    marketSize: '',
    growthRate: '',
    estimatedValue: '',
    thumbnailImage: '',
    heroImage: '',
    research: {
      marketOverview: '',
      topTrends: [{ query: '', search: '', interest: '', increase: '' }],
      risingTrends: [{ query: '', search: '', interest: '', increase: '' }],
      opportunities: []
    },
    customerAvatar: {
      demographics: { age: '', gender: '', location: '', educationLevel: '', incomeLevel: '', familyStatus: '' },
      psychographics: { coreValues: '', beliefs: '', interestsHobbies: '', lifestyleTraits: '', personalityType: '' },
      professional: { occupation: '', industry: '', jobTitle: '', dailyResponsibilities: '' },
      psychology: { painPoints: '', frustrations: '', biggestChallenges: '', obstaclesToSuccess: '', primaryGoals: '', deepestDesires: '', aspirations: '', fears: '', whatKeepsThemUpAtNight: '', commonObjections: '', buyingHesitations: '' },
      informationDiet: { favoriteBlogsWebsites: '', topPodcasts: '', gurusInfluencers: '', primarySocialMedia: '', booksMagazines: '' },
      buyingBehavior: { decisionMakingProcess: '', priceSensitivity: '', keyPurchasingDrivers: '', brandAffinities: '' }
    },
    keywords: [],
    assets: [],
    phases: [
      { id: 1, name: 'Phase 1', duration: '4 weeks', budget: '$500', description: '', tasks: [''] }
    ],
    businessModels: [],
    recommendedTools: [],
    ideas: {
      social: '', video: '', products: '', articles: '', questions: '', audience: '', visual: '',
      pinterest: '', youtube: '', tiktok: '', instagram: '', instagramReel: '', facebook: '',
      linkedin: '', twitter: '', podcast: '', shortForm: '', longForm: '', liveStream: '',
      amazon: '', etsy: '', digital: '', printOnDemand: '', merchandise: '', course: '',
      miniCourse: '', membership: '', subscription: '', bundle: '', template: '', printable: '',
      blogPost: '', article: '', guide: '', tutorial: '', caseStudy: '', listicle: '', opinion: '',
      beginnerGuide: '', advancedStrategy: '', stepByStep: '', comparison: '', review: '', toolsList: '',
      leadMagnet: '', ebook: '', workbook: '', checklist: '', cheatSheet: '', framework: '', swipeFile: '',
      resourceList: '', toolkit: '', faq: '', beginnerQuestions: '', advancedQuestions: '', expertQuestions: '',
      troubleshooting: '', problemSolving: '', mythVsFact: '', debate: '', whatVsWhy: '', howTo: '',
      whenTo: '', whereTo: '', trending: '', seasonal: '', evergreen: '', communityDiscussion: '',
      forumThread: '', poll: '', survey: '', ama: '', painPoints: '', problems: '', goals: '',
      desires: '', objections: '', mistakes: '', fears: '', contentSeries: '', challenge: '',
      daily: '', weekly: '', educationalSeries: '', storytelling: '', infographic: '', visualGuide: '',
      dataVisualization: '', mindMap: '', flowchart: '', brandStory: '', founderStory: '', behindScenes: '',
      dayInLife: '', processBreakdown: '', industryTrend: '', marketAnalysis: '', futurePredictions: '',
      innovation: '', toolList: '', resourceRoundup: '', softwareComparison: '', workflow: '', habit: '',
      productivity: '', goalSetting: '', mindset: '', successPrinciples: '', mythBusting: '', commonMistakes: '',
      beginnerPitfalls: '', expertSecrets: '', littleKnownTips: ''
    }
  });

  const updateField = useCallback((path: string, valueOrUpdater: any) => {
    setData(prev => {
      try {
        const newData = JSON.parse(JSON.stringify(prev));
        const keys = path.split('.');
        let current = newData;
        for (let i = 0; i < keys.length - 1; i++) {
          if (!current[keys[i]]) current[keys[i]] = {};
          current = current[keys[i]];
        }
        
        const lastKey = keys[keys.length - 1];
        if (typeof valueOrUpdater === 'function') {
          current[lastKey] = valueOrUpdater(current[lastKey]);
        } else {
          current[lastKey] = valueOrUpdater;
        }
        
        return newData;
      } catch (e) {
        console.error("Error updating field:", path, e);
        return prev;
      }
    });
  }, []);

  const addKeyword = () => {
    updateField('keywords', (prev: any[]) => [...(prev || []), { keyword: 'New Keyword', searchVolume: '0', searchIntent: 'Informational', serpFeatures: '', cpc: '$0', competitionDifficulty: '10' }]);
  };

  const handleKeywordImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (evt) => {
      const text = evt.target?.result as string;
      const rows = text.split('\n').slice(1);
      const keywords = rows.map(r => {
        const c = r.split(',');
        return { 
          keyword: c[0] || '', 
          searchVolume: c[1] || '', 
          searchIntent: c[2] || '', 
          serpFeatures: c[3] || '', 
          cpc: c[4] || '', 
          competitionDifficulty: c[5] || '' 
        };
      }).filter(k => k.keyword);
      updateField('keywords', (prev: any[]) => [...(prev || []), ...keywords]);
      toast({ title: "Keywords Imported", description: `Successfully imported ${keywords.length} keywords` });
    };
    reader.readAsText(file);
  };

  useEffect(() => {
    if (!slug) return;
    const fetchNicheBox = async () => {
      try {
        const response = await fetch(`/api/niche-boxes/${slug}`);
        if (!response.ok) throw new Error('Failed to fetch');
        const boxData = await response.json();
        
        // Deep merge: initial state provides defaults for any missing fields
        setData(prev => {
          const merged = JSON.parse(JSON.stringify(prev)) as typeof prev;
          // Merge top-level scalar fields
          const scalarKeys = ['status','nicheName','nicheSlug','category','competition','marketSize','growthRate','estimatedValue','thumbnailImage','heroImage'];
          scalarKeys.forEach(k => { if (boxData[k] != null) (merged as any)[k] = boxData[k]; });
          // Merge research (deep)
          if (boxData.research) {
            if (boxData.research.marketOverview != null) merged.research.marketOverview = boxData.research.marketOverview;
            if (Array.isArray(boxData.research.topTrends) && boxData.research.topTrends.length > 0) merged.research.topTrends = boxData.research.topTrends;
            if (Array.isArray(boxData.research.risingTrends) && boxData.research.risingTrends.length > 0) merged.research.risingTrends = boxData.research.risingTrends;
            if (Array.isArray(boxData.research.opportunities)) merged.research.opportunities = boxData.research.opportunities;
          }
          // Merge customerAvatar (deep)
          if (boxData.customerAvatar) {
            const avatarSections = ['demographics','psychographics','professional','psychology','informationDiet','buyingBehavior'] as const;
            avatarSections.forEach(section => {
              if (boxData.customerAvatar[section]) {
                (merged.customerAvatar as any)[section] = { ...(merged.customerAvatar as any)[section], ...boxData.customerAvatar[section] };
              }
            });
          }
          // Merge arrays (only overwrite if data has them)
          if (Array.isArray(boxData.keywords)) merged.keywords = boxData.keywords;
          if (Array.isArray(boxData.assets)) merged.assets = boxData.assets;
          if (Array.isArray(boxData.phases) && boxData.phases.length > 0) merged.phases = boxData.phases;
          if (Array.isArray(boxData.businessModels)) merged.businessModels = boxData.businessModels;
          if (Array.isArray(boxData.recommendedTools)) merged.recommendedTools = boxData.recommendedTools;
          // Merge ideas (deep)
          if (boxData.ideas) {
            Object.keys(boxData.ideas).forEach(k => {
              const val = boxData.ideas[k];
              if (val != null) (merged.ideas as any)[k] = Array.isArray(val) ? val.join('\n') : val;
            });
          }
          return merged;
        });
      } catch (error) {
        toast({ title: "Error", description: "Could not load niche box data", variant: "destructive" });
      } finally {
        setIsLoading(false);
      }
    };
    fetchNicheBox();
  }, [slug]); // eslint-disable-line react-hooks/exhaustive-deps

  const saveNicheBox = async () => {
    setIsSaving(true);
    try {
      const response = await fetch(`/api/niche-boxes/${slug}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (response.ok) {
        toast({ title: "Success", description: "Blueprint updated successfully!" });
      } else {
        throw new Error('Failed to save');
      }
    } catch (error) {
      toast({ title: "Error", description: "Failed to update blueprint", variant: "destructive" });
    } finally {
      setIsSaving(false);
    }
  };

  const exportNicheBox = () => {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${data.nicheSlug || slug}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const processImportData = useCallback((jsonData: any) => {
    setData(prevData => {
      const ideasObj = jsonData.ideas ? { ...jsonData.ideas } : {};
      Object.keys(ideasObj).forEach(key => {
        if (Array.isArray(ideasObj[key])) {
          ideasObj[key] = ideasObj[key].join('\n');
        }
      });

      return {
        ...prevData,
        status: jsonData.status || prevData.status || 'published',
        nicheName: jsonData.nicheName || prevData.nicheName || '',
        nicheSlug: jsonData.nicheSlug || prevData.nicheSlug || '',
        category: jsonData.category || prevData.category || '',
        competition: jsonData.competition || prevData.competition || 'Medium',
        marketSize: jsonData.marketSize || prevData.marketSize || '',
        growthRate: jsonData.growthRate || prevData.growthRate || '',
        estimatedValue: jsonData.estimatedValue || prevData.estimatedValue || '',
        thumbnailImage: jsonData.thumbnailImage || prevData.thumbnailImage || '',
        heroImage: jsonData.heroImage || prevData.heroImage || '',
        
        research: {
          marketOverview: jsonData.research?.marketOverview || prevData.research.marketOverview || '',
          topTrends: jsonData.research?.topTrends || prevData.research.topTrends || [{ query: '', search: '', interest: '', increase: '' }],
          risingTrends: jsonData.research?.risingTrends || prevData.research.risingTrends || [{ query: '', search: '', interest: '', increase: '' }],
          opportunities: jsonData.research?.opportunities || prevData.research.opportunities || []
        },
        
        customerAvatar: {
          demographics: { ...prevData.customerAvatar.demographics, ...(jsonData.customerAvatar?.demographics || {}) },
          psychographics: { ...prevData.customerAvatar.psychographics, ...(jsonData.customerAvatar?.psychographics || {}) },
          professional: { ...prevData.customerAvatar.professional, ...(jsonData.customerAvatar?.professional || {}) },
          psychology: { ...prevData.customerAvatar.psychology, ...(jsonData.customerAvatar?.psychology || {}) },
          informationDiet: { ...prevData.customerAvatar.informationDiet, ...(jsonData.customerAvatar?.informationDiet || {}) },
          buyingBehavior: { ...prevData.customerAvatar.buyingBehavior, ...(jsonData.customerAvatar?.buyingBehavior || {}) }
        },
        
        keywords: Array.isArray(jsonData.keywords) ? jsonData.keywords : (prevData.keywords || []),
        assets: Array.isArray(jsonData.assets) ? jsonData.assets : (prevData.assets || []),
        phases: Array.isArray(jsonData.phases) ? jsonData.phases : (prevData.phases || [{ id: 1, name: 'Phase 1', duration: '4 weeks', budget: '$500', description: '', tasks: [''] }]),
        businessModels: Array.isArray(jsonData.businessModels) ? jsonData.businessModels : (prevData.businessModels || []),
        recommendedTools: Array.isArray(jsonData.recommendedTools) ? jsonData.recommendedTools : (prevData.recommendedTools || []),
        
        ideas: {
          ...prevData.ideas,
          ...ideasObj
        }
      };
    });
  }, []);

  const handleJsonImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const jsonData = JSON.parse(evt.target?.result as string);
        processImportData(jsonData);
        toast({ title: "Success", description: "JSON imported successfully" });
      } catch (error) {
        toast({ title: "Error", description: "Failed to parse JSON", variant: "destructive" });
      }
    };
    reader.readAsText(file);
  };

  // ─── Asset helpers ───
  const addAsset = (name: string, category: string) => {
    const newAsset = { category, name, title: name, description: '', type: 'Document', fileUrl: '', link: '', fileName: '' };
    updateField('assets', (prev: any[]) => [...(prev || []), newAsset]);
  };
  const removeAsset = (index: number) => {
    updateField('assets', (prev: any[]) => (prev || []).filter((_: any, i: number) => i !== index));
  };

  // ─── Phase/Task helpers ───
  const addPhase = () => {
    const newPhase = { id: Date.now(), name: 'New Phase', duration: '4 weeks', budget: '$500', description: '', tasks: [''] };
    updateField('phases', (prev: any[]) => [...(prev || []), newPhase]);
  };
  const removePhase = (id: number) => {
    updateField('phases', (prev: any[]) => (prev || []).filter((p: any) => p.id !== id));
  };
  const addTask = (phaseIndex: number) => {
    updateField('phases', (prev: any[]) =>
      (prev || []).map((p: any, i: number) => i === phaseIndex ? { ...p, tasks: [...(p.tasks || []), ''] } : p)
    );
  };
  const removeTask = (phaseIndex: number, taskIndex: number) => {
    updateField('phases', (prev: any[]) =>
      (prev || []).map((p: any, i: number) => i === phaseIndex ? { ...p, tasks: (p.tasks || []).filter((_: any, ti: number) => ti !== taskIndex) } : p)
    );
  };

  // ─── Trend helpers ───
  const addTrend = (type: 'top' | 'rising') => {
    const path = type === 'top' ? 'research.topTrends' : 'research.risingTrends';
    updateField(path, (prev: any[]) => [...(prev || []), { query: '', search: '', interest: '', increase: '' }]);
  };
  const removeTrend = (type: 'top' | 'rising', index: number) => {
    const path = type === 'top' ? 'research.topTrends' : 'research.risingTrends';
    updateField(path, (prev: any[]) => (prev || []).filter((_: any, i: number) => i !== index));
  };

  // ─── Opportunity helpers ───
  const addOpportunity = () => {
    updateField('research.opportunities', (prev: any[]) => [...(prev || []), '']);
  };
  const removeOpportunity = (index: number) => {
    updateField('research.opportunities', (prev: any[]) => (prev || []).filter((_: any, i: number) => i !== index));
  };

  // ─── Business Model helpers ───
  const addBusinessModel = () => {
    updateField('businessModels', (prev: any[]) => [...(prev || []), { name: '', description: '', profitPotential: '' }]);
  };
  const removeBusinessModel = (index: number) => {
    updateField('businessModels', (prev: any[]) => (prev || []).filter((_: any, i: number) => i !== index));
  };

  // ─── Recommended Tool helpers ───
  const addRecommendedTool = () => {
    updateField('recommendedTools', (prev: any[]) => [...(prev || []), { toolName: '', cost: '', purpose: '', priority: 'Medium', affiliateLink: '' }]);
  };
  const removeRecommendedTool = (index: number) => {
    updateField('recommendedTools', (prev: any[]) => (prev || []).filter((_: any, i: number) => i !== index));
  };



  if (isLoading) return <div className="h-screen flex items-center justify-center bg-white text-slate-500">Loading blueprint...</div>;

  return (
    <NicheBoxContext.Provider value={{ data, updateField }}>
    <div className="flex h-screen bg-slate-50 text-slate-900 overflow-hidden font-sans">
      {/* Sidebar - Same as Creator */}
      <div className="w-72 bg-white border-r border-slate-200 flex flex-col p-6 shrink-0 shadow-sm">
        <div className="flex items-center space-x-3 px-2 mb-10">
          <div className="bg-slate-900 p-2.5 rounded-2xl shadow-xl shadow-slate-900/10">
            <Layers size={24} className="text-white" />
          </div>
          <div>
             <h1 className="text-2xl font-black tracking-tighter text-slate-900 uppercase italic leading-none">
                Edit<span className="text-indigo-600">Box</span>
             </h1>
             <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mt-0.5">Architect Studio</p>
          </div>
        </div>
        <nav className="flex-1 space-y-1.5 overflow-y-auto custom-scrollbar pr-1">
          {[
            { id: 'niche', icon: <Database size={16}/>, label: 'Niche Setup' },
            { id: 'prompts', icon: <Terminal size={16}/>, label: 'AI Importer Lab' },
            { id: 'research', icon: <Search size={16}/>, label: 'Research & Avatar' },
            { id: 'seo', icon: <TrendingUp size={16}/>, label: 'SEO Vault' },
            { id: 'assets', icon: <FileText size={16}/>, label: 'Content Assets' },
            { id: 'roadmap', icon: <Map size={16}/>, label: 'Roadmap Builder' },
            { id: 'business', icon: <DollarSign size={16}/>, label: 'Business Models' },
            { id: 'tools', icon: <LinkIcon size={16}/>, label: 'Recommended Tools' },
            { id: 'ideas', icon: <Lightbulb size={16}/>, label: 'Content Strategy' },
          ].map((tab) => (
            <button 
              key={tab.id} 
              onClick={() => setActiveTab(tab.id)} 
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-2xl transition-all font-black uppercase text-[10px] tracking-widest ${
                activeTab === tab.id 
                  ? 'bg-slate-900 text-white shadow-lg shadow-slate-900/10' 
                  : 'text-slate-400 hover:bg-slate-50 hover:text-slate-600'
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          ))}
        </nav>
        <div className="pt-6 mt-6 border-t border-slate-100 space-y-3">
          <Button onClick={saveNicheBox} disabled={isSaving}
            className="w-full bg-indigo-600 hover:bg-indigo-500 text-white p-6 rounded-2xl text-[10px] font-black tracking-widest flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/10 transition-transform active:scale-95"
          >
            {isSaving ? 'Updating...' : <><Save size={14} /> UPDATE BLUEPRINT</>}
          </Button>
          <div className="grid grid-cols-2 gap-2">
            <Button onClick={exportNicheBox} variant="outline" className="bg-white border-slate-200 text-slate-600 hover:bg-slate-50 p-5 rounded-xl text-[10px] font-black tracking-widest flex items-center justify-center gap-1.5">
              <Download size={14} /> EXPORT
            </Button>
            <label className="bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 p-2.5 rounded-xl text-[10px] font-black tracking-widest flex items-center justify-center gap-1.5 cursor-pointer">
              <Upload size={14} /> IMPORT 
              <input type="file" className="hidden" accept=".json" onChange={handleJsonImport} />
            </label>
          </div>
        </div>
      </div>

      {/* Main Content - Shared Sections */}
      <div className="flex-1 overflow-y-auto p-12 bg-white">
        <div className="max-w-5xl mx-auto">
          {activeTab === 'niche' && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4">
              <header>
                <h2 className="text-4xl font-black text-slate-900 italic tracking-tighter uppercase leading-none mb-1">NICHE SETUP</h2>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic leading-none">Modify the core identity of this blueprint</p>
              </header>
              <div className="grid grid-cols-2 gap-8 bg-slate-50 p-10 rounded-3xl border border-slate-200">
                <InputField label="Niche Name" path="nicheName" placeholder="e.g. Indoor Gardening" />
                <InputField label="Niche Slug" path="nicheSlug" placeholder="indoor-gardening-box" />
                <div className="space-y-1">
                  <Label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Category</Label>
                  <Select value={data.category} onValueChange={(value) => updateField('category', value)}>
                    <SelectTrigger className="w-full bg-white border border-slate-200 rounded-xl p-3 text-sm text-slate-900 shadow-sm focus:ring-1 focus:ring-black">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent className="bg-white border-slate-200 shadow-xl font-sans">
                      {CATEGORIES.map(cat => (
                        <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                      ))}
                      {data.category && !CATEGORIES.includes(data.category) && (
                        <SelectItem value={data.category}>{data.category}</SelectItem>
                      )}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1">
                  <Label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Competition Level</Label>
                  <Select value={data.competition} onValueChange={(value) => updateField('competition', value)}>
                    <SelectTrigger className="w-full bg-white border border-slate-200 rounded-xl p-3 text-sm text-slate-900 shadow-sm focus:ring-1 focus:ring-black">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-white border-slate-200 shadow-xl font-sans">
                      <SelectItem value="Low">Low</SelectItem>
                      <SelectItem value="Medium">Medium</SelectItem>
                      <SelectItem value="Hard">Hard</SelectItem>
                      <SelectItem value="Master">Master</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <InputField label="Market Size" path="marketSize" placeholder="e.g. $2.1 Billion" />
                <InputField label="Growth Rate" path="growthRate" placeholder="e.g. 12% YoY" />
                <InputField label="Estimated Value" path="estimatedValue" placeholder="e.g. $4,500" />
                <div className="col-span-2 grid grid-cols-2 gap-8">
                  <InputField label="Thumbnail Image URL" path="thumbnailImage" placeholder="https://..." />
                  <InputField label="Hero Image URL" path="heroImage" placeholder="https://..." />
                </div>
                <div className="col-span-2 space-y-1">
                  <Label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Status</Label>
                  <Select value={data.status} onValueChange={(value) => updateField('status', value)}>
                    <SelectTrigger className="w-full bg-white border border-slate-200 rounded-xl p-3 text-sm text-slate-900 shadow-sm focus:ring-1 focus:ring-black">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-white border-slate-200 shadow-xl font-sans">
                      <SelectItem value="draft">Draft</SelectItem>
                      <SelectItem value="published">Published</SelectItem>
                      <SelectItem value="archived">Archived</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'research' && (
            <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4">
              <div className="space-y-8">
                <header>
                  <h2 className="text-4xl font-black text-slate-900 italic tracking-tighter uppercase leading-none mb-1">MARKET RESEARCH</h2>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic leading-none">Update competitive landscape and trends</p>
                </header>
                <div className="bg-slate-50 p-10 rounded-3xl border border-slate-200">
                  <InputField label="Market Overview" path="research.marketOverview" type="textarea" placeholder="Describe the market opportunity..." />
                </div>
                <div className="grid grid-cols-2 gap-8">
                  <div className="space-y-6 bg-slate-50 p-8 rounded-3xl border border-slate-200">
                    <h3 className="text-xs font-black text-slate-900 uppercase tracking-widest pb-4 border-b border-slate-200 flex items-center gap-2">
                       <TrendingUp size={16} className="text-indigo-600"/> TOP QUERIES
                    </h3>
                    {data.research.topTrends.map((t, i) => (
                      <div key={i} className="p-4 bg-white rounded-2xl border border-slate-200 shadow-sm relative group">
                        <button onClick={() => removeTrend('top', i)} className="absolute -top-2 -right-2 bg-white text-slate-400 hover:text-red-500 border border-slate-200 p-1 rounded-full opacity-0 group-hover:opacity-100 transition-all"><Trash2 size={12}/></button>
                        <div className="grid grid-cols-2 gap-2">
                          <StableInput className="h-9" placeholder="Query" value={t.query} onChange={(v) => updateField(`research.topTrends.${i}.query`, v)} />
                          <StableInput className="h-9" placeholder="Vol" value={t.search} onChange={(v) => updateField(`research.topTrends.${i}.search`, v)} />
                        </div>
                      </div>
                    ))}
                    <Button onClick={() => addTrend('top')} variant="outline" className="w-full border-dashed border-slate-300 text-[10px] font-black uppercase tracking-widest h-11 transition-all hover:border-indigo-600 hover:text-indigo-600 bg-white">+ ADD QUERY</Button>
                  </div>
                  <div className="space-y-6 bg-slate-50 p-8 rounded-3xl border border-slate-200">
                    <h3 className="text-xs font-black text-slate-900 uppercase tracking-widest pb-4 border-b border-slate-200 flex items-center gap-2">
                       <TrendingUp size={16} className="text-indigo-600"/> RISING TRENDS
                    </h3>
                    {data.research.risingTrends.map((t, i) => (
                      <div key={i} className="p-4 bg-white rounded-2xl border border-slate-200 shadow-sm relative group">
                        <button onClick={() => removeTrend('rising', i)} className="absolute -top-2 -right-2 bg-white text-slate-400 hover:text-red-500 border border-slate-200 p-1 rounded-full opacity-0 group-hover:opacity-100 transition-all"><Trash2 size={12}/></button>
                        <div className="grid grid-cols-2 gap-2">
                          <StableInput className="h-9" placeholder="Rising Query" value={t.query} onChange={(v) => updateField(`research.risingTrends.${i}.query`, v)} />
                          <StableInput className="h-9" placeholder="Score" value={t.search} onChange={(v) => updateField(`research.risingTrends.${i}.search`, v)} />
                        </div>
                      </div>
                    ))}
                    <Button onClick={() => addTrend('rising')} variant="outline" className="w-full border-dashed border-slate-300 text-[10px] font-black uppercase tracking-widest h-11 transition-all hover:border-indigo-600 hover:text-indigo-600 bg-white">+ ADD RISING</Button>
                  </div>
                </div>

                <div className="space-y-6 pt-8 border-t border-slate-100">
                  <h3 className="text-xs font-black text-slate-900 uppercase tracking-widest pb-4 flex items-center gap-2">
                    <Target size={16} className="text-indigo-600"/> MARKET OPPORTUNITIES
                  </h3>
                  <div className="space-y-4">
                    {data.research.opportunities?.map((opp, i) => (
                      <div key={i} className="flex gap-3">
                        <StableInput 
                          className="flex-1 h-10" 
                          placeholder="e.g. Expand into B2B consulting..." 
                          value={opp} 
                          onChange={(v) => updateField(`research.opportunities.${i}`, v)} 
                        />
                        <Button 
                          onClick={() => removeOpportunity(i)}
                          variant="ghost"
                          size="icon"
                          className="h-10 w-10 text-slate-300 hover:text-red-500 transition-colors"
                        >
                          <Trash2 size={14}/>
                        </Button>
                      </div>
                    ))}
                    <Button 
                      onClick={addOpportunity}
                      variant="outline"
                      className="w-full border-dashed border-slate-300 text-slate-400 hover:text-indigo-600 hover:border-indigo-600 rounded-2xl h-12 uppercase text-[10px] font-black tracking-widest transition-all bg-white"
                    >
                      <Plus size={14} className="mr-2" /> ADD OPPORTUNITY
                    </Button>
                  </div>
                </div>
              </div>
              
              <div className="space-y-8 pt-8 border-t border-slate-100">
                <header>
                  <h2 className="text-4xl font-black text-slate-900 italic tracking-tighter uppercase leading-none mb-1">CUSTOMER AVATAR</h2>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic leading-none">Refine your target audience details</p>
                </header>
                <div className="grid grid-cols-2 gap-8">
                  <div className="bg-slate-50 p-8 rounded-3xl border border-slate-200 space-y-6">
                    <h3 className="text-xs font-black text-slate-900 uppercase tracking-widest pb-4 border-b border-slate-200 flex items-center gap-2"><UserCircle size={16}/> DEMOGRAPHICS</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <InputField label="Age" path="customerAvatar.demographics.age" placeholder="25-45" />
                      <InputField label="Gender" path="customerAvatar.demographics.gender" placeholder="..." />
                    </div>
                  </div>
                  <div className="bg-slate-50 p-8 rounded-3xl border border-slate-200 space-y-6">
                    <h3 className="text-xs font-black text-slate-900 uppercase tracking-widest pb-4 border-b border-slate-200 flex items-center gap-2"><BrainCircuit size={16}/> PSYCHOLOGY</h3>
                    <InputField label="Pain Points" path="customerAvatar.psychology.painPoints" type="textarea" placeholder="..." />
                  </div>
                </div>
              </div>
            </div>
          )}

              {activeTab === 'seo' && (
                <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4">
                  <header className="flex justify-between items-center">
                    <div>
                      <h2 className="text-4xl font-black text-slate-900 italic tracking-tighter uppercase leading-none mb-1">SEO VAULT</h2>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic leading-none">High-traffic search terms for this niche</p>
                    </div>
                    <div className="flex gap-2">
                       <Button onClick={addKeyword} className="bg-white hover:bg-slate-50 text-slate-900 border border-slate-200 px-6 py-3 rounded-2xl text-[10px] font-black tracking-widest flex items-center gap-2 shadow-sm transition-transform hover:-translate-y-1 uppercase">
                         <Plus size={16} /> ADD KEYWORD
                       </Button>
                       <label className="bg-slate-900 hover:bg-black text-white px-6 py-3 rounded-2xl text-[10px] font-black tracking-widest cursor-pointer flex items-center gap-2 shadow-lg transition-transform hover:-translate-y-1 uppercase">
                         <Upload size={16} /> IMPORT CSV 
                         <input type="file" className="hidden" accept=".csv" onChange={handleKeywordImport} />
                       </label>
                    </div>
                  </header>
                  <Card className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm">
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-[11px]">
                        <thead className="bg-slate-50 text-slate-500 uppercase font-black tracking-widest text-[9px]">
                          <tr>
                            <th className="p-5">Keyword</th>
                            <th className="p-5">Vol.</th>
                            <th className="p-5">Intent</th>
                            <th className="p-5">Features</th>
                            <th className="p-5">CPC</th>
                            <th className="p-5">Difficulty</th>
                            <th className="p-5"></th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {data.keywords.length > 0 ? data.keywords.map((kw, i) => (
                            <tr key={i} className="hover:bg-slate-50 transition-colors">
                              <td className="p-5">
                                <StableInput 
                                  className="h-8 text-[11px] font-bold" 
                                  value={kw.keyword} 
                                  onChange={(v) => {
                                    updateField(`keywords.${i}.keyword`, v);
                                  }}
                                  placeholder="Keyword..."
                                />
                              </td>
                              <td className="p-5 text-indigo-600 font-black">
                                <StableInput 
                                  className="h-8 text-[11px]" 
                                  value={kw.searchVolume} 
                                  onChange={(v) => {
                                    updateField(`keywords.${i}.searchVolume`, v);
                                  }}
                                  placeholder="Vol..."
                                />
                              </td>
                              <td className="p-5">
                                <StableInput 
                                  className="h-8 text-[11px]" 
                                  value={kw.searchIntent} 
                                  onChange={(v) => {
                                    updateField(`keywords.${i}.searchIntent`, v);
                                  }}
                                  placeholder="Intent..."
                                />
                              </td>
                              <td className="p-5">
                                <StableInput 
                                  className="h-8 text-[11px]" 
                                  value={kw.serpFeatures} 
                                  onChange={(v) => {
                                    updateField(`keywords.${i}.serpFeatures`, v);
                                  }}
                                  placeholder="Features..."
                                />
                              </td>
                              <td className="p-5">
                                <StableInput 
                                  className="h-8 text-[11px] text-green-600 font-bold" 
                                  value={kw.cpc} 
                                  onChange={(v) => {
                                    updateField(`keywords.${i}.cpc`, v);
                                  }}
                                  placeholder="CPC..."
                                />
                              </td>
                              <td className="p-5">
                                <StableInput 
                                  className="h-8 text-[11px]" 
                                  value={kw.competitionDifficulty} 
                                  onChange={(v) => {
                                    updateField(`keywords.${i}.competitionDifficulty`, v);
                                  }}
                                  placeholder="Diff..."
                                />
                              </td>
                              <td className="p-5">
                                <Button onClick={() => updateField('keywords', (prev: any[]) => prev.filter((_, idx) => idx !== i))} variant="ghost" className="text-slate-300 hover:text-red-500"><Trash2 size={14}/></Button>
                              </td>
                            </tr>
                          )) : (
                            <tr>
                              <td colSpan={7} className="p-10 text-center text-slate-400 italic">No keywords imported. Click Import or Add to start.</td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </Card>
                </div>
              )}

          {activeTab === 'assets' && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4">
              <h2 className="text-4xl font-black text-slate-900 italic tracking-tighter uppercase leading-none mb-1">CONTENT ASSETS</h2>
              <div className="grid grid-cols-12 gap-8">
                <div className="col-span-4 bg-slate-50 p-6 rounded-3xl border border-slate-200 h-fit space-y-4 max-h-[70vh] overflow-y-auto custom-scrollbar">
                  {Object.entries(ASSET_LIBRARY).map(([cat, list]) => (
                    <div key={cat} className="space-y-1 mb-4">
                      <h4 className="text-[10px] font-black uppercase text-slate-400 tracking-widest border-b border-slate-100 pb-2 mb-2">{cat}</h4>
                      {list.map(item => (
                        <Button key={item} onClick={() => addAsset(item, cat)} variant="ghost" className="w-full justify-between text-[10px] font-bold uppercase tracking-wider text-slate-600 hover:text-indigo-600 group hover:bg-white h-8">
                          {item} <Plus size={10} className="opacity-0 group-hover:opacity-100"/>
                        </Button>
                      ))}
                    </div>
                  ))}
                  <div className="pt-4 border-t border-slate-200 mt-6">
                    <Button 
                      onClick={() => addAsset('New Asset', 'Custom')}
                      variant="outline"
                      className="w-full text-[10px] font-black uppercase tracking-widest border-dashed border-slate-300 text-slate-400 hover:text-indigo-600 hover:border-indigo-600 transition-all bg-white"
                    >
                      + ADD CUSTOM ASSET
                    </Button>
                  </div>
                </div>
                <div className="col-span-8 space-y-4">
                  {data.assets.map((asset, i) => (
                    <Card key={i} className="p-6 bg-white border border-slate-200 rounded-3xl group relative shadow-sm hover:shadow-md transition-all">
                      <button onClick={() => removeAsset(i)} className="absolute top-6 right-6 text-slate-300 hover:text-red-500 h-10 w-10 rounded-full opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center">
                        <Trash2 size={16}/>
                      </button>
                      
                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div className="col-span-1">
                          <InputField label="Asset Title / Name" path={`assets.${i}.title`} placeholder="e.g. Niche Profit Checklist" />
                        </div>
                        <div className="col-span-1 space-y-1">
                          <Label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Asset Type</Label>
                          <Select 
                            value={asset.type || 'Document'} 
                            onValueChange={(value) => updateField(`assets.${i}.type`, value)}
                          >
                            <SelectTrigger className="bg-slate-50 border-slate-200 rounded-xl text-xs h-10 focus:ring-1 focus:ring-black">
                              <SelectValue placeholder="Asset Type" />
                            </SelectTrigger>
                            <SelectContent className="bg-white border-slate-200 text-xs text-slate-900">
                              <SelectItem value="Document">Document</SelectItem>
                              <SelectItem value="Link">External Link</SelectItem>
                              <SelectItem value="Video">Video</SelectItem>
                              <SelectItem value="Audio">Audio</SelectItem>
                              <SelectItem value="Image">Image</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div className="space-y-1 mb-4">
                        <Label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Description</Label>
                        <Textarea
                          className="w-full bg-slate-50 border-slate-200 rounded-xl p-3 text-xs min-h-[80px] text-slate-900 focus:ring-1 focus:ring-black"
                          placeholder="Briefly describe what this asset is and how it helps the user..."
                          value={asset.description || ''}
                          onChange={(e) => updateField(`assets.${i}.description`, e.target.value)}
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <Label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Source Link</Label>
                          <div className="relative">
                            <LinkIcon size={14} className="absolute left-3.5 top-3 text-slate-400" />
                            <Input 
                              className="w-full bg-slate-50 border-slate-200 rounded-xl p-3 pl-10 text-xs text-slate-900 focus:ring-1 focus:ring-black h-10" 
                              placeholder="File URL or Link" 
                              value={asset.link || asset.fileUrl || ''} 
                              onChange={(e) => {
                                updateField(`assets.${i}.link`, e.target.value);
                                updateField(`assets.${i}.fileUrl`, e.target.value);
                              }} 
                            />
                          </div>
                        </div>
                        <div className="space-y-1">
                          <Label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1 flex justify-between">
                            <span>File Attachment</span>
                            {asset.fileName && <span className="text-indigo-600 truncate max-w-[100px]" title={asset.fileName}>{asset.fileName}</span>}
                          </Label>
                          <div className="bg-slate-50 border border-slate-200 border-dashed rounded-xl p-2 flex items-center justify-center min-h-[40px]">
                            <UploadButton
                              endpoint="nicheDownload"
                              onClientUploadComplete={(res: any) => {
                                if (res?.[0]) {
                                  updateField(`assets.${i}.fileName`, res[0].name);
                                  updateField(`assets.${i}.fileUrl`, res[0].ufsUrl || res[0].url);
                                  toast({
                                    title: "Asset Uploaded",
                                    description: `${res[0].name} successfully attached.`
                                  });
                                }
                              }}
                              onUploadError={(error: Error) => {
                                toast({
                                  title: "Upload Error",
                                  description: error.message,
                                  variant: "destructive"
                                });
                              }}
                              appearance={{
                                button: "bg-indigo-600 hover:bg-indigo-500 text-white text-[10px] uppercase font-black tracking-widest h-8 px-4 rounded-lg w-full transition-colors",
                                container: "w-full",
                                allowedContent: "hidden"
                              }}
                              content={{
                                button: asset.fileName ? "REPLACE FILE" : "UPLOAD FILE"
                              }}
                            />
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'prompts' && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4">
               <h2 className="text-4xl font-black text-slate-900 italic tracking-tighter uppercase leading-none mb-1">AI IMPORTER LAB</h2>
               <NicheImporter onImport={(jsonData) => {
                 processImportData(jsonData);
                 toast({ title: "Blueprint Updated", description: "Successfully updated from JSON data." });
                 setActiveTab('niche');
               }} />
            </div>
          )}

          {/* Form 5: Roadmap Builder */}
          {activeTab === 'roadmap' && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4">
              <header className="flex justify-between items-center">
                <div>
                  <h2 className="text-4xl font-black text-slate-900 italic tracking-tighter uppercase leading-none mb-1">IMPLEMENTATION ROADMAP</h2>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic leading-none">Step-by-step execution plan for the business</p>
                </div>
                <Button onClick={addPhase} className="bg-slate-900 hover:bg-black text-white px-8 py-5 rounded-2xl text-[10px] font-black tracking-widest flex items-center gap-3 shadow-xl transition-transform hover:-translate-y-1">
                  <Plus size={16} /> ADD PHASE
                </Button>
              </header>
              <div className="space-y-6">
                {data.phases.map((phase, i) => (
                  <Card key={phase.id} className="bg-white border border-slate-200 rounded-3xl p-8 relative overflow-hidden group shadow-sm hover:shadow-md transition-all">
                    <Button 
                      onClick={() => removePhase(phase.id)}
                      variant="ghost"
                      size="icon"
                      className="absolute top-6 right-6 text-slate-300 hover:text-red-500 h-10 w-10 rounded-full opacity-0 group-hover:opacity-100 transition-all"
                    >
                      <Trash2 size={18}/>
                    </Button>
                    <div className="grid grid-cols-12 gap-8">
                      <div className="col-span-6 space-y-6">
                        <div className="grid grid-cols-12 gap-4">
                          <div className="col-span-12">
                            <InputField label="Phase Name" path={`phases.${i}.name`} placeholder="Phase Name" />
                          </div>
                          <div className="col-span-6">
                            <InputField label="Duration" path={`phases.${i}.duration`} placeholder="e.g. 4 weeks" />
                          </div>
                          <div className="col-span-6">
                            <InputField label="Budget" path={`phases.${i}.budget`} placeholder="e.g. $500" />
                          </div>
                        </div>
                        <InputField label="Phase Description" path={`phases.${i}.description`} type="textarea" placeholder="Describe this phase..." />
                      </div>
                      <div className="col-span-6 border-l border-slate-100 pl-8 space-y-4">
                        <Label className="text-[10px] font-black text-slate-900 uppercase tracking-widest border-b border-slate-100 pb-2 flex items-center justify-between">
                          TASKS <span className="text-slate-300 font-normal">{phase.tasks.length} total</span>
                        </Label>
                        <div className="space-y-2">
                          {phase.tasks.map((task, ti) => (
                            <div key={ti} className="flex gap-2 group/task">
                              <StableInput 
                                className="flex-1 h-10" 
                                value={task} 
                                onChange={(newValue) => updateField(`phases.${i}.tasks.${ti}`, newValue)} 
                                placeholder="Task description..."
                              />
                              <Button 
                                onClick={() => removeTask(i, ti)}
                                variant="ghost"
                                size="icon"
                                className="h-10 w-10 text-slate-300 hover:text-red-500 transition-colors"
                              >
                                <Trash2 size={14}/>
                              </Button>
                            </div>
                          ))}
                        </div>
                        <Button 
                          onClick={() => addTask(i)}
                          variant="outline"
                          className="w-full text-[10px] font-black uppercase tracking-widest border-dashed border-slate-300 text-slate-400 hover:text-indigo-600 hover:border-indigo-600 transition-all bg-white mt-2"
                        >
                          + ADD TASK
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Form 6: Business Models */}
          {activeTab === 'business' && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4">
              <header className="flex justify-between items-center">
                <div>
                  <h2 className="text-4xl font-black text-slate-900 italic tracking-tighter uppercase leading-none mb-1">BUSINESS MODELS</h2>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic leading-none">Monetization strategies for this niche</p>
                </div>
                <Button onClick={addBusinessModel} className="bg-slate-900 hover:bg-black text-white px-8 py-5 rounded-2xl text-[10px] font-black tracking-widest flex items-center gap-3 shadow-xl transition-transform hover:-translate-y-1">
                  <Plus size={16} /> ADD MODEL
                </Button>
              </header>
              <div className="space-y-6">
                {data.businessModels.map((model, i) => (
                  <Card key={i} className="bg-white border border-slate-200 rounded-3xl p-8 relative overflow-hidden group shadow-sm hover:shadow-md transition-all">
                    <Button 
                      onClick={() => removeBusinessModel(i)}
                      variant="ghost"
                      size="icon"
                      className="absolute top-6 right-6 text-slate-300 hover:text-red-500 h-10 w-10 rounded-full opacity-0 group-hover:opacity-100 transition-all"
                    >
                      <Trash2 size={18}/>
                    </Button>
                    <div className="grid grid-cols-2 gap-6">
                      <InputField label="Business Model Name" path={`businessModels.${i}.name`} placeholder="e.g. Affiliate Marketing, Digital Products..." />
                      <InputField label="Profit Potential" path={`businessModels.${i}.profitPotential`} placeholder="e.g. $1k - $5k / Month" />
                      <div className="col-span-2">
                        <InputField label="Model Description" path={`businessModels.${i}.description`} placeholder="Describe how this monetization model works for this niche..." type="textarea" />
                      </div>
                    </div>
                  </Card>
                ))}
                {data.businessModels.length === 0 && (
                   <div className="h-64 border-2 border-dashed border-slate-200 rounded-3xl flex flex-col items-center justify-center text-slate-400 italic gap-3 bg-slate-50">
                      <Layers size={32} className="opacity-20" />
                      <p className="text-xs text-center">Add a business model to show how users can monetize this niche</p>
                   </div>
                )}
              </div>
            </div>
          )}

          {/* Form 7: Recommended Tools */}
          {activeTab === 'tools' && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4">
              <header className="flex justify-between items-center">
                <div>
                  <h2 className="text-4xl font-black text-slate-900 italic tracking-tighter uppercase leading-none mb-1">RECOMMENDED TOOLS</h2>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic leading-none">Software & resources to help users succeed</p>
                </div>
                <Button onClick={addRecommendedTool} className="bg-slate-900 hover:bg-black text-white px-8 py-5 rounded-2xl text-[10px] font-black tracking-widest flex items-center gap-3 shadow-xl transition-transform hover:-translate-y-1">
                  <Plus size={16} /> ADD TOOL
                </Button>
              </header>
              <div className="space-y-6">
                {data.recommendedTools?.map((tool, i) => (
                  <Card key={i} className="bg-white border border-slate-200 rounded-3xl p-8 relative overflow-hidden group shadow-sm hover:shadow-md transition-all">
                    <Button 
                      onClick={() => removeRecommendedTool(i)}
                      variant="ghost"
                      size="icon"
                      className="absolute top-6 right-6 text-slate-300 hover:text-red-500 h-10 w-10 rounded-full opacity-0 group-hover:opacity-100 transition-all"
                    >
                      <Trash2 size={18}/>
                    </Button>
                    <div className="grid grid-cols-2 gap-6">
                      <InputField label="Tool Name" path={`recommendedTools.${i}.toolName`} placeholder="e.g. ConvertKit, Jasper..." />
                      <div className="space-y-1">
                        <Label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Priority / Type</Label>
                        <Select value={tool.priority} onValueChange={(value) => updateField(`recommendedTools.${i}.priority`, value)}>
                          <SelectTrigger className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs h-11 focus:ring-1 focus:ring-black">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="bg-white border-slate-200 text-xs text-slate-900">
                             <SelectItem value="High">Essential / High Priority</SelectItem>
                             <SelectItem value="Medium">Recommended</SelectItem>
                             <SelectItem value="Low">Optional</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <InputField label="Cost / Pricing" path={`recommendedTools.${i}.cost`} placeholder="e.g. Free Tier, $29/mo..." />
                      <InputField label="Affiliate Link" path={`recommendedTools.${i}.affiliateLink`} placeholder="https://..." />
                      <div className="col-span-2">
                        <InputField label="Purpose & Use Case" path={`recommendedTools.${i}.purpose`} placeholder="Why does the user need this tool?..." type="textarea" />
                      </div>
                    </div>
                  </Card>
                ))}
                {(data.recommendedTools?.length === 0 || !data.recommendedTools) && (
                   <div className="h-64 border-2 border-dashed border-slate-200 rounded-3xl flex flex-col items-center justify-center text-slate-400 italic gap-3 bg-slate-50">
                      <Layers size={32} className="opacity-20" />
                      <p className="text-xs text-center">Share what tools someone needs to succeed in this niche (include your affiliate links!)</p>
                   </div>
                )}
              </div>
            </div>
          )}

          {/* Form 8: Content Ideas */}
          {activeTab === 'ideas' && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4">
              <header>
                <h2 className="text-4xl font-black text-slate-900 italic tracking-tighter uppercase leading-none mb-1">CONTENT STRATEGY</h2>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic leading-none">Plan your content ecosystem and audience engagement</p>
              </header>
              <div className="grid grid-cols-2 gap-8">
                
                {/* Visual & Brand Assets */}
                <div className="bg-slate-50 p-8 rounded-3xl border border-slate-200 space-y-6">
                  <h3 className="text-xs font-black text-slate-900 uppercase tracking-widest pb-4 border-b border-slate-200 flex items-center gap-2">
                     <Layers size={16} className="text-indigo-600"/> VISUAL & BRAND ASSETS
                  </h3>
                  <div className="space-y-4">
                    <InputField label="Infographic Ideas" path="ideas.infographic" type="textarea" placeholder="..." />
                    <InputField label="Visual Guide Ideas" path="ideas.visualGuide" type="textarea" placeholder="..." />
                    <InputField label="Data Visualization Ideas" path="ideas.dataVisualization" type="textarea" placeholder="..." />
                    <InputField label="Mind Map Ideas" path="ideas.mindMap" type="textarea" placeholder="..." />
                    <InputField label="Flowchart Ideas" path="ideas.flowchart" type="textarea" placeholder="..." />
                    <InputField label="Brand Story Ideas" path="ideas.brandStory" type="textarea" placeholder="..." />
                    <InputField label="Founder Story Ideas" path="ideas.founderStory" type="textarea" placeholder="..." />
                    <InputField label="Behind The Scenes" path="ideas.behindScenes" type="textarea" placeholder="..." />
                    <InputField label="Day In The Life" path="ideas.dayInLife" type="textarea" placeholder="..." />
                    <InputField label="Process Breakdown" path="ideas.processBreakdown" type="textarea" placeholder="..." />
                  </div>
                </div>

                {/* Social Media Post Ideas */}
                <div className="bg-slate-50 p-8 rounded-3xl border border-slate-200 space-y-6">
                  <h3 className="text-xs font-black text-slate-900 uppercase tracking-widest pb-4 border-b border-slate-200 flex items-center gap-2">
                     <Rss size={16} className="text-indigo-600"/> SOCIAL MEDIA POST IDEAS
                  </h3>
                  <div className="space-y-4">
                    <InputField label="Pinterest Pin Ideas" path="ideas.pinterest" type="textarea" placeholder="..." />
                    <InputField label="Instagram Post Ideas" path="ideas.instagram" type="textarea" placeholder="..." />
                    <InputField label="Facebook Post Ideas" path="ideas.facebook" type="textarea" placeholder="..." />
                    <InputField label="LinkedIn Post Ideas" path="ideas.linkedin" type="textarea" placeholder="..." />
                    <InputField label="Twitter / X Ideas" path="ideas.twitter" type="textarea" placeholder="..." />
                  </div>
                </div>

                {/* Social Media Video Ideas */}
                <div className="bg-slate-50 p-8 rounded-3xl border border-slate-200 space-y-6">
                  <h3 className="text-xs font-black text-slate-900 uppercase tracking-widest pb-4 border-b border-slate-200 flex items-center gap-2">
                     <Video size={16} className="text-indigo-600"/> SOCIAL MEDIA VIDEO IDEAS
                  </h3>
                  <div className="space-y-4">
                    <InputField label="YouTube Video Ideas" path="ideas.youtube" type="textarea" placeholder="..." />
                    <InputField label="TikTok Video Ideas" path="ideas.tiktok" type="textarea" placeholder="..." />
                    <InputField label="Instagram Reel Ideas" path="ideas.instagramReel" type="textarea" placeholder="..." />
                    <InputField label="Short Form Video Ideas" path="ideas.shortForm" type="textarea" placeholder="..." />
                    <InputField label="Long Form Video Ideas" path="ideas.longForm" type="textarea" placeholder="..." />
                    <InputField label="Live Stream Ideas" path="ideas.liveStream" type="textarea" placeholder="..." />
                  </div>
                </div>

                {/* Product Ideas */}
                <div className="bg-slate-50 p-8 rounded-3xl border border-slate-200 space-y-6">
                  <h3 className="text-xs font-black text-slate-900 uppercase tracking-widest pb-4 border-b border-slate-200 flex items-center gap-2">
                     <ShoppingBag size={16} className="text-indigo-600"/> PRODUCT IDEAS
                  </h3>
                  <div className="space-y-4">
                    <InputField label="Amazon Products" path="ideas.amazon" type="textarea" placeholder="..." />
                    <InputField label="Etsy Product Ideas" path="ideas.etsy" type="textarea" placeholder="..." />
                    <InputField label="Digital Product Ideas" path="ideas.digital" type="textarea" placeholder="..." />
                    <InputField label="Print on Demand Ideas" path="ideas.printOnDemand" type="textarea" placeholder="..." />
                    <InputField label="Merchandise Ideas" path="ideas.merchandise" type="textarea" placeholder="..." />
                    <InputField label="Course Ideas" path="ideas.course" type="textarea" placeholder="..." />
                    <InputField label="Mini Course Ideas" path="ideas.miniCourse" type="textarea" placeholder="..." />
                    <InputField label="Membership Ideas" path="ideas.membership" type="textarea" placeholder="..." />
                    <InputField label="Subscription Products" path="ideas.subscription" type="textarea" placeholder="..." />
                    <InputField label="Bundle Product Ideas" path="ideas.bundle" type="textarea" placeholder="..." />
                    <InputField label="Template Ideas" path="ideas.template" type="textarea" placeholder="..." />
                    <InputField label="Printable Ideas" path="ideas.printable" type="textarea" placeholder="..." />
                  </div>
                </div>

                {/* Written Content Ideas */}
                <div className="bg-slate-50 p-8 rounded-3xl border border-slate-200 space-y-6">
                  <h3 className="text-xs font-black text-slate-900 uppercase tracking-widest pb-4 border-b border-slate-200 flex items-center gap-2">
                     <FileText size={16} className="text-indigo-600"/> WRITTEN CONTENT IDEAS
                  </h3>
                  <div className="space-y-4">
                    <InputField label="Blog Post Ideas" path="ideas.blogPost" type="textarea" placeholder="..." />
                    <InputField label="Article Ideas" path="ideas.article" type="textarea" placeholder="..." />
                    <InputField label="Guide Ideas" path="ideas.guide" type="textarea" placeholder="..." />
                    <InputField label="Tutorial Ideas" path="ideas.tutorial" type="textarea" placeholder="..." />
                    <InputField label="Case Study Ideas" path="ideas.caseStudy" type="textarea" placeholder="..." />
                    <InputField label="Listicle Ideas" path="ideas.listicle" type="textarea" placeholder="..." />
                    <InputField label="Opinion Piece Ideas" path="ideas.opinion" type="textarea" placeholder="..." />
                    <InputField label="Beginner Guides" path="ideas.beginnerGuide" type="textarea" placeholder="..." />
                    <InputField label="Advanced Strategies" path="ideas.advancedStrategy" type="textarea" placeholder="..." />
                    <InputField label="Step-by-Step Instructions" path="ideas.stepByStep" type="textarea" placeholder="..." />
                    <InputField label="Comparison Articles" path="ideas.comparison" type="textarea" placeholder="..." />
                    <InputField label="Review Articles" path="ideas.review" type="textarea" placeholder="..." />
                    <InputField label="Best Tools Lists" path="ideas.toolsList" type="textarea" placeholder="..." />
                  </div>
                </div>

                {/* Questions People Ask */}
                <div className="bg-slate-50 p-8 rounded-3xl border border-slate-200 space-y-6">
                  <h3 className="text-xs font-black text-slate-900 uppercase tracking-widest pb-4 border-b border-slate-200 flex items-center gap-2">
                     <HelpCircle size={16} className="text-indigo-600"/> QUESTIONS PEOPLE ASK
                  </h3>
                  <div className="space-y-4">
                    <InputField label="Frequently Asked Questions" path="ideas.faq" type="textarea" placeholder="..." />
                    <InputField label="Beginner Questions" path="ideas.beginnerQuestions" type="textarea" placeholder="..." />
                    <InputField label="Advanced Questions" path="ideas.advancedQuestions" type="textarea" placeholder="..." />
                    <InputField label="Expert Questions" path="ideas.expertQuestions" type="textarea" placeholder="..." />
                    <InputField label="Troubleshooting" path="ideas.troubleshooting" type="textarea" placeholder="..." />
                    <InputField label="Problem Solving" path="ideas.problemSolving" type="textarea" placeholder="..." />
                    <InputField label="Myth vs Fact" path="ideas.mythVsFact" type="textarea" placeholder="..." />
                    <InputField label="Debate Questions" path="ideas.debate" type="textarea" placeholder="..." />
                    <InputField label="What vs Why" path="ideas.whatVsWhy" type="textarea" placeholder="..." />
                    <InputField label="How To Questions" path="ideas.howTo" type="textarea" placeholder="..." />
                    <InputField label="When To Questions" path="ideas.whenTo" type="textarea" placeholder="..." />
                    <InputField label="Where To Questions" path="ideas.whereTo" type="textarea" placeholder="..." />
                  </div>
                </div>

                {/* Lead Magnet Ideas */}
                <div className="bg-slate-50 p-8 rounded-3xl border border-slate-200 space-y-6">
                  <h3 className="text-xs font-black text-slate-900 uppercase tracking-widest pb-4 border-b border-slate-200 flex items-center gap-2">
                     <Target size={16} className="text-indigo-600"/> LEAD MAGNET IDEAS
                  </h3>
                  <div className="space-y-4">
                    <InputField label="Lead Magnet Ideas (General)" path="ideas.leadMagnet" type="textarea" placeholder="..." />
                    <InputField label="eBook Ideas" path="ideas.ebook" type="textarea" placeholder="..." />
                    <InputField label="Workbook Ideas" path="ideas.workbook" type="textarea" placeholder="..." />
                    <InputField label="Checklist Ideas" path="ideas.checklist" type="textarea" placeholder="..." />
                    <InputField label="Cheat Sheet Ideas" path="ideas.cheatSheet" type="textarea" placeholder="..." />
                    <InputField label="Framework Ideas" path="ideas.framework" type="textarea" placeholder="..." />
                    <InputField label="Swipe File Ideas" path="ideas.swipeFile" type="textarea" placeholder="..." />
                    <InputField label="Resource List Ideas" path="ideas.resourceList" type="textarea" placeholder="..." />
                    <InputField label="Toolkit Ideas" path="ideas.toolkit" type="textarea" placeholder="..." />
                  </div>
                </div>

                {/* Community & Audience */}
                <div className="bg-slate-50 p-8 rounded-3xl border border-slate-200 space-y-6">
                  <h3 className="text-xs font-black text-slate-900 uppercase tracking-widest pb-4 border-b border-slate-200 flex items-center gap-2">
                     <Users size={16} className="text-indigo-600"/> COMMUNITY & AUDIENCE
                  </h3>
                  <div className="space-y-4">
                    <InputField label="Community Discussions" path="ideas.communityDiscussion" type="textarea" placeholder="..." />
                    <InputField label="Forum Threads" path="ideas.forumThread" type="textarea" placeholder="..." />
                    <InputField label="Poll Ideas" path="ideas.poll" type="textarea" placeholder="..." />
                    <InputField label="Survey Ideas" path="ideas.survey" type="textarea" placeholder="..." />
                    <InputField label="AMA Questions" path="ideas.ama" type="textarea" placeholder="..." />
                    <InputField label="Customer Pain Points" path="ideas.painPoints" type="textarea" placeholder="..." />
                    <InputField label="Customer Problems" path="ideas.problems" type="textarea" placeholder="..." />
                    <InputField label="Customer Goals" path="ideas.goals" type="textarea" placeholder="..." />
                    <InputField label="Customer Desires" path="ideas.desires" type="textarea" placeholder="..." />
                    <InputField label="Customer Objections" path="ideas.objections" type="textarea" placeholder="..." />
                    <InputField label="Customer Mistakes" path="ideas.mistakes" type="textarea" placeholder="..." />
                    <InputField label="Customer Fears" path="ideas.fears" type="textarea" placeholder="..." />
                  </div>
                </div>

                {/* Themes & Series */}
                <div className="bg-slate-50 p-8 rounded-3xl border border-slate-200 space-y-6">
                  <h3 className="text-xs font-black text-slate-900 uppercase tracking-widest pb-4 border-b border-slate-200 flex items-center gap-2">
                     <TrendingUp size={16} className="text-indigo-600"/> THEMES & SERIES
                  </h3>
                  <div className="space-y-4">
                    <InputField label="Trending Topics" path="ideas.trending" type="textarea" placeholder="..." />
                    <InputField label="Seasonal Topics" path="ideas.seasonal" type="textarea" placeholder="..." />
                    <InputField label="Evergreen Topics" path="ideas.evergreen" type="textarea" placeholder="..." />
                    <InputField label="Content Series" path="ideas.contentSeries" type="textarea" placeholder="..." />
                    <InputField label="Challenge Ideas" path="ideas.challenge" type="textarea" placeholder="..." />
                    <InputField label="Daily Content Ideas" path="ideas.daily" type="textarea" placeholder="..." />
                    <InputField label="Weekly Content Ideas" path="ideas.weekly" type="textarea" placeholder="..." />
                    <InputField label="Educational Series" path="ideas.educationalSeries" type="textarea" placeholder="..." />
                    <InputField label="Storytelling Ideas" path="ideas.storytelling" type="textarea" placeholder="..." />
                  </div>
                </div>

                {/* Industry & Metrics */}
                <div className="bg-slate-50 p-8 rounded-3xl border border-slate-200 space-y-6">
                  <h3 className="text-xs font-black text-slate-900 uppercase tracking-widest pb-4 border-b border-slate-200 flex items-center gap-2">
                     <Globe size={16} className="text-indigo-600"/> INDUSTRY & AUTHORITY
                  </h3>
                  <div className="space-y-4">
                    <InputField label="Industry Trends" path="ideas.industryTrend" type="textarea" placeholder="..." />
                    <InputField label="Market Analysis" path="ideas.marketAnalysis" type="textarea" placeholder="..." />
                    <InputField label="Future Predictions" path="ideas.futurePredictions" type="textarea" placeholder="..." />
                    <InputField label="Innovation Ideas" path="ideas.innovation" type="textarea" placeholder="..." />
                    <InputField label="Tool Lists" path="ideas.toolList" type="textarea" placeholder="..." />
                    <InputField label="Resource Roundups" path="ideas.resourceRoundup" type="textarea" placeholder="..." />
                    <InputField label="Software Comparisons" path="ideas.softwareComparison" type="textarea" placeholder="..." />
                    <InputField label="Workflow Ideas" path="ideas.workflow" type="textarea" placeholder="..." />
                  </div>
                </div>

                {/* Mindset & Productivity */}
                <div className="bg-slate-50 p-8 rounded-3xl border border-slate-200 space-y-6">
                  <h3 className="text-xs font-black text-slate-900 uppercase tracking-widest pb-4 border-b border-slate-200 flex items-center gap-2">
                     <BrainCircuit size={16} className="text-indigo-600"/> MINDSET & PRODUCTIVITY
                  </h3>
                  <div className="space-y-4">
                    <InputField label="Habit Ideas" path="ideas.habit" type="textarea" placeholder="..." />
                    <InputField label="Productivity Tips" path="ideas.productivity" type="textarea" placeholder="..." />
                    <InputField label="Goal Setting Ideas" path="ideas.goalSetting" type="textarea" placeholder="..." />
                    <InputField label="Mindset Tips" path="ideas.mindset" type="textarea" placeholder="..." />
                    <InputField label="Success Principles" path="ideas.successPrinciples" type="textarea" placeholder="..." />
                    <InputField label="Myth Busting" path="ideas.mythBusting" type="textarea" placeholder="..." />
                    <InputField label="Common Mistakes" path="ideas.commonMistakes" type="textarea" placeholder="..." />
                    <InputField label="Beginner Pitfalls" path="ideas.beginnerPitfalls" type="textarea" placeholder="..." />
                    <InputField label="Expert Secrets" path="ideas.expertSecrets" type="textarea" placeholder="..." />
                    <InputField label="Little Known Tips" path="ideas.littleKnownTips" type="textarea" placeholder="..." />
                  </div>
                </div>

                {/* Older / Generic Fields grouped */}
                <div className="bg-slate-50 p-8 rounded-3xl border border-slate-200 space-y-6 col-span-2">
                  <h3 className="text-xs font-black text-slate-900 uppercase tracking-widest pb-4 border-b border-slate-200 flex items-center gap-2">
                     <Database size={16} className="text-indigo-600"/> MISC / PODCAST & WEB
                  </h3>
                  <div className="grid grid-cols-2 gap-8">
                    <InputField label="Social Media (General)" path="ideas.social" type="textarea" placeholder="..." />
                    <InputField label="Video (General)" path="ideas.video" type="textarea" placeholder="..." />
                    <InputField label="Products (General)" path="ideas.products" type="textarea" placeholder="..." />
                    <InputField label="Articles (General)" path="ideas.articles" type="textarea" placeholder="..." />
                    <InputField label="Questions (General)" path="ideas.questions" type="textarea" placeholder="..." />
                    <InputField label="Audience (General)" path="ideas.audience" type="textarea" placeholder="..." />
                    <InputField label="Visuals (General)" path="ideas.visual" type="textarea" placeholder="..." />
                    <InputField label="Podcast Ideas" path="ideas.podcast" type="textarea" placeholder="..." />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
    </NicheBoxContext.Provider>
  );
}
