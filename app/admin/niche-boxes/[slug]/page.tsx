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

  const updateField = useCallback((path: string, value: any) => {
    setData(prev => {
      const newData = JSON.parse(JSON.stringify(prev));
      const keys = path.split('.');
      let current: any = newData;
      for (let i = 0; i < keys.length - 1; i++) {
        if (!current[keys[i]]) current[keys[i]] = {};
        current = current[keys[i]];
      }
      current[keys[keys.length - 1]] = value;
      return newData;
    });
  }, []);

  useEffect(() => {
    if (!slug) return;
    const fetchNicheBox = async () => {
      try {
        const response = await fetch(`/api/niche-boxes/${slug}`);
        if (!response.ok) throw new Error('Failed to fetch');
        const boxData = await response.json();
        
        // Deep merge with initial state to ensure all fields exist
        setData(prev => {
           const merged = { ...prev };
           Object.keys(boxData).forEach(k => {
             if (boxData[k] !== undefined && boxData[k] !== null) {
                (merged as any)[k] = boxData[k];
             }
           });
           return merged;
        });
      } catch (error) {
        toast({ title: "Error", description: "Could not load niche box data", variant: "destructive" });
      } finally {
        setIsLoading(false);
      }
    };
    fetchNicheBox();
  }, [slug, toast]);

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

  const handleJsonImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const jsonData = JSON.parse(evt.target?.result as string);
        
        // Map arrays in ideas to newline-separated strings
        if (jsonData.ideas) {
          Object.keys(jsonData.ideas).forEach(key => {
            if (Array.isArray(jsonData.ideas[key])) {
              jsonData.ideas[key] = jsonData.ideas[key].join('\n');
            }
          });
        }
        
        setData(prev => ({ ...prev, ...jsonData }));
        toast({ title: "Success", description: "JSON imported successfully" });
      } catch (error) {
        toast({ title: "Error", description: "Failed to parse JSON", variant: "destructive" });
      }
    };
    reader.readAsText(file);
  };

  const addAsset = (name: string, category: string) => {
    updateField('assets', [...data.assets, { category, name, title: '', description: '', type: 'Document', fileUrl: '', link: '', fileName: '' }]);
  };

  const removeAsset = (index: number) => {
    updateField('assets', data.assets.filter((_, i) => i !== index));
  };

  const addPhase = () => {
    updateField('phases', [...data.phases, { id: Date.now(), name: 'New Phase', duration: '4 weeks', budget: '$500', description: '', tasks: [''] }]);
  };

  const removePhase = (id: number) => {
    updateField('phases', data.phases.filter(p => p.id !== id));
  };

  const addTask = (phaseIndex: number) => {
    const newPhases = [...data.phases];
    newPhases[phaseIndex].tasks.push('');
    updateField('phases', newPhases);
  };

  const removeTask = (phaseIndex: number, taskIndex: number) => {
    const newPhases = [...data.phases];
    newPhases[phaseIndex].tasks = newPhases[phaseIndex].tasks.filter((_, i) => i !== taskIndex);
    updateField('phases', newPhases);
  };

  const addTrend = (type: 'top' | 'rising') => {
    const path = type === 'top' ? 'research.topTrends' : 'research.risingTrends';
    updateField(path, [...data.research[type === 'top' ? 'topTrends' : 'risingTrends'], { query: '', search: '', interest: '', increase: '' }]);
  };

  const removeTrend = (type: 'top' | 'rising', index: number) => {
    const path = type === 'top' ? 'research.topTrends' : 'research.risingTrends';
    updateField(path, data.research[type === 'top' ? 'topTrends' : 'risingTrends'].filter((_, i) => i !== index));
  };

  const addBusinessModel = () => {
    updateField('businessModels', [...data.businessModels, { name: '', description: '', profitPotential: '' }]);
  };

  const removeBusinessModel = (index: number) => {
    updateField('businessModels', data.businessModels.filter((_, i) => i !== index));
  };

  const addRecommendedTool = () => {
    updateField('recommendedTools', [...data.recommendedTools, { toolName: '', cost: '', purpose: '', priority: 'Medium', affiliateLink: '' }]);
  };

  const removeRecommendedTool = (index: number) => {
    updateField('recommendedTools', data.recommendedTools.filter((_, i) => i !== index));
  };

  const InputField = useCallback(({ label, path, placeholder, type = "text" }: {
    label: string;
    path: string;
    placeholder: string;
    type?: string;
  }) => {
    const keys = path.split('.');
    let value: any = data;
    keys.forEach(k => value = value?.[k]);
    return (
      <div className="space-y-1">
        <Label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">{label}</Label>
        <StableInput value={value || ''} onChange={(newValue) => updateField(path, newValue)} placeholder={placeholder} type={type} />
      </div>
    );
  }, [data, updateField]);

  if (isLoading) return <div className="h-screen flex items-center justify-center bg-white text-slate-500">Loading blueprint...</div>;

  return (
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
                          <Input className="bg-slate-50 border-slate-100 text-xs h-9" placeholder="Query" value={t.query} onChange={(e) => { const nt = [...data.research.topTrends]; nt[i].query = e.target.value; updateField('research.topTrends', nt); }} />
                          <Input className="bg-slate-50 border-slate-100 text-xs h-9" placeholder="Vol" value={t.search} onChange={(e) => { const nt = [...data.research.topTrends]; nt[i].search = e.target.value; updateField('research.topTrends', nt); }} />
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
                          <Input className="bg-slate-50 border-slate-100 text-xs h-9" placeholder="Rising Query" value={t.query} onChange={(e) => { const nt = [...data.research.risingTrends]; nt[i].query = e.target.value; updateField('research.risingTrends', nt); }} />
                          <Input className="bg-slate-50 border-slate-100 text-xs h-9" placeholder="Score" value={t.search} onChange={(e) => { const nt = [...data.research.risingTrends]; nt[i].search = e.target.value; updateField('research.risingTrends', nt); }} />
                        </div>
                      </div>
                    ))}
                    <Button onClick={() => addTrend('rising')} variant="outline" className="w-full border-dashed border-slate-300 text-[10px] font-black uppercase tracking-widest h-11 transition-all hover:border-indigo-600 hover:text-indigo-600 bg-white">+ ADD RISING</Button>
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
               <h2 className="text-4xl font-black text-slate-900 italic tracking-tighter uppercase leading-none mb-1">SEO VAULT</h2>
               <Card className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm">
                 <table className="w-full text-left text-[11px]">
                   <thead className="bg-slate-50 text-slate-500 uppercase font-black tracking-widest text-[9px]">
                     <tr>
                       <th className="p-5">Keyword</th>
                       <th className="p-5">Volume</th>
                       <th className="p-5">Difficulty</th>
                       <th className="p-5"></th>
                     </tr>
                   </thead>
                   <tbody className="divide-y divide-slate-100 font-sans">
                     {data.keywords.map((kw, i) => (
                       <tr key={i} className="hover:bg-slate-50">
                         <td className="p-5 font-bold text-slate-900">{kw.keyword}</td>
                         <td className="p-5 font-black text-indigo-600">{kw.searchVolume}</td>
                         <td className="p-5">{kw.competitionDifficulty}</td>
                         <td className="p-5">
                            <Button onClick={() => updateField('keywords', data.keywords.filter((_, idx) => idx !== i))} variant="ghost" className="text-slate-300 hover:text-red-500"><Trash2 size={14}/></Button>
                         </td>
                       </tr>
                     ))}
                   </tbody>
                 </table>
               </Card>
            </div>
          )}

          {activeTab === 'assets' && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4">
              <h2 className="text-4xl font-black text-slate-900 italic tracking-tighter uppercase leading-none mb-1">CONTENT ASSETS</h2>
              <div className="grid grid-cols-12 gap-8">
                <div className="col-span-4 bg-slate-50 p-6 rounded-3xl border border-slate-200 h-fit space-y-4">
                  <h4 className="text-[10px] font-black uppercase text-slate-400 tracking-widest border-b border-slate-200 pb-2">PRESETS</h4>
                  <div className="max-h-96 overflow-y-auto custom-scrollbar pr-2 space-y-1">
                    {ASSET_LIBRARY["Written Content"].slice(0, 10).map(item => (
                      <Button key={item} onClick={() => addAsset(item, "Written")} variant="ghost" className="w-full justify-between text-[10px] font-bold uppercase tracking-wider text-slate-600 hover:text-indigo-600 group">
                        {item} <Plus size={10} className="opacity-0 group-hover:opacity-100"/>
                      </Button>
                    ))}
                  </div>
                </div>
                <div className="col-span-8 space-y-4">
                  {data.assets.map((asset, i) => (
                    <Card key={i} className="p-6 bg-white border border-slate-200 rounded-3xl group relative shadow-sm">
                      <button onClick={() => removeAsset(i)} className="absolute top-4 right-4 text-slate-300 hover:text-red-500"><Trash2 size={14}/></button>
                      <div className="flex gap-4">
                         <div className="w-full space-y-3">
                            <InputField label="Asset Title" path={`assets.${i}.title`} placeholder="..." />
                            <InputField label="Asset Subtitle / Desc" path={`assets.${i}.description`} placeholder="..." />
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
                 setData(jsonData);
                 toast({ title: "Blueprint Updated", description: "Successfully updated from JSON data." });
                 setActiveTab('niche');
               }} />
            </div>
          )}

          {/* Add other tabs like Roadmap, Business, Tools as simplified versions of creator or fully matching */}
          {activeTab === 'roadmap' && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4">
               <header className="flex justify-between items-center">
                 <h2 className="text-4xl font-black text-slate-900 italic tracking-tighter uppercase leading-none">ROADMAP</h2>
                 <Button onClick={addPhase} variant="outline" className="border-slate-900 text-[10px] font-black px-6 py-5 rounded-xl">+ PHASE</Button>
               </header>
               <div className="space-y-6">
                 {data.phases.map((phase, i) => (
                   <Card key={phase.id} className="p-8 bg-white border border-slate-200 rounded-3xl relative">
                     <button onClick={() => removePhase(phase.id)} className="absolute top-6 right-6 text-slate-300 hover:text-red-500"><Trash2 size={16}/></button>
                     <div className="grid grid-cols-2 gap-6">
                        <InputField label="Phase Name" path={`phases.${i}.name`} placeholder="..." />
                        <InputField label="Duration" path={`phases.${i}.duration`} placeholder="..." />
                     </div>
                   </Card>
                 ))}
               </div>
            </div>
          )}

          {['business', 'tools', 'ideas'].includes(activeTab) && (
             <div className="py-20 text-center space-y-4">
                <p className="text-slate-400 italic text-sm">This section is ready for refinement. Matching creator UI...</p>
                <Button onClick={() => setActiveTab('niche')} variant="outline">Back to Setup</Button>
             </div>
          )}
        </div>
      </div>
    </div>
  );
}
