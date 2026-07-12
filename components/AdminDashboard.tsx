'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import {
  BookOpen,
  FileText,
  HelpCircle,
  FolderOpen,
  ShoppingBag,
  Users,
  Settings,
  Plus,
  Edit,
  Trash2,
  CheckCircle,
  X,
  Loader2,
  Star,
  Wallet,
  Filter,
  Palette,
  Play
} from 'lucide-react';
import {
  upsertPillarPage,
  deletePillarPage,
  upsertBlogPost,
  deleteBlogPost,
  upsertGlossaryTerm,
  deleteGlossaryTerm,
  upsertDirectoryResource,
  deleteDirectoryResource,
  upsertProduct,
  upsertAuthor,
  upsertPaymentGateway,
  deletePaymentGateway,
  upsertProductFunnel,
  deleteProductFunnel,
  upsertSiteTheme
} from '@/app/actions/adminActions';

// Interface types
interface AuthorData {
  _id: string;
  name: string;
  bio?: string;
  credentials?: string;
  avatarUrl?: string;
  verificationBadge?: boolean;
}

interface ProductData {
  _id: string;
  title: string;
  type: string;
  price: number;
  stripePriceId?: string;
  description?: string;
  landingPageUrl?: string;
  gatewayId?: any;
  curriculum?: string;
}

interface PillarData {
  _id: string;
  keyword: string;
  slug: string;
  title: string;
  metaDescription: string;
  heroTitle?: string;
  heroSubtitle?: string;
  introductionText?: string;
  primaryProduct?: any; // ObjectId or ProductData
  author: any; // ObjectId or AuthorData
  // Niche branding
  accentColor?: string;
  icon?: string;
  category?: string;
  isPublished?: boolean;
  trustBadges?: string[];
  affiliateDisclosure?: string;
  coverImageUrl?: string;
}

interface PostData {
  _id: string;
  pillarId: any;
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  isFeatured?: boolean;
  readTime?: string;
}

interface GlossaryData {
  _id: string;
  pillarId: any;
  term: string;
  definition: string;
  slug: string;
}

interface DirectoryData {
  _id: string;
  pillarId: any;
  resourceName: string;
  category?: string;
  description?: string;
  affiliateUrl?: string;
  rating?: number;
  isSponsored?: boolean;
}

interface GatewayData {
  _id: string;
  name: string;
  type: 'stripe' | 'simulate';
  stripeSecretKey?: string;
  stripePublishableKey?: string;
  isActive: boolean;
}

interface FunnelData {
  _id: string;
  name: string;
  description?: string;
  isActive: boolean;
  primaryProduct: any; // ObjectId or ProductData
  upsellProduct?: any; // ObjectId or ProductData
  downsellProduct?: any; // ObjectId or ProductData
}

interface DashboardProps {
  pillars: PillarData[];
  posts: PostData[];
  glossary: GlossaryData[];
  directory: DirectoryData[];
  products: ProductData[];
  authors: AuthorData[];
  gateways: GatewayData[];
  funnels: FunnelData[];
  theme: any;
}

const tabToModelMap: Record<string, 'pillar' | 'post' | 'glossary' | 'directory' | 'product' | 'author' | 'gateway' | 'funnel'> = {
  pillars: 'pillar',
  posts: 'post',
  glossary: 'glossary',
  directory: 'directory',
  products: 'product',
  authors: 'author',
  gateways: 'gateway',
  funnels: 'funnel'
};

const PRESETS = [
  {
    name: 'Midnight Indigo',
    tokens: {
      colorPrimary: '#6366f1',
      colorPrimaryHover: '#4f46e5',
      colorAccent: '#f59e0b',
      colorSuccess: '#10b981',
      colorDanger: '#ef4444',
      colorBg: '#020617',
      colorSurface: '#0f172a',
      colorSurface2: '#1e293b',
      colorBorder: '#334155',
      colorText: '#f8fafc',
      colorTextMuted: '#94a3b8',
      navBg: '#0f172a',
      navBorder: '#1e293b',
      navText: '#f8fafc',
      navBrand: '#6366f1',
      hubHeroFrom: '#0f172a',
      hubHeroTo: '#1e1b4b',
      hubHeroText: '#f8fafc',
      hubAccent: '#6366f1',
      checkoutBg: '#020617',
      checkoutCard: '#0f172a',
      checkoutBtn: '#6366f1',
      checkoutBtnHover: '#4f46e5',
      upsellBanner: '#78350f',
      upsellBannerText: '#fef3c7',
      upsellBtn: '#f59e0b',
      downsellBanner: '#1e1b4b',
      downsellBtn: '#6366f1',
      courseBg: '#020617',
      courseHeader: '#0f172a',
      coursePlayBtn: '#6366f1',
      adminSidebar: '#020617',
      adminSidebarActive: '#6366f1',
      adminSurface: '#0f172a',
    }
  },
  {
    name: 'Specialty Coffee',
    tokens: {
      colorPrimary: '#f59e0b',
      colorPrimaryHover: '#d97706',
      colorAccent: '#854d0e',
      colorSuccess: '#10b981',
      colorDanger: '#ef4444',
      colorBg: '#1c1917',
      colorSurface: '#292524',
      colorSurface2: '#44403c',
      colorBorder: '#57534e',
      colorText: '#fafaf9',
      colorTextMuted: '#a8a29e',
      navBg: '#292524',
      navBorder: '#44403c',
      navText: '#fafaf9',
      navBrand: '#f59e0b',
      hubHeroFrom: '#292524',
      hubHeroTo: '#451a03',
      hubHeroText: '#fafaf9',
      hubAccent: '#f59e0b',
      checkoutBg: '#1c1917',
      checkoutCard: '#292524',
      checkoutBtn: '#f59e0b',
      checkoutBtnHover: '#d97706',
      upsellBanner: '#451b03',
      upsellBannerText: '#fef3c7',
      upsellBtn: '#f59e0b',
      downsellBanner: '#292524',
      downsellBtn: '#f59e0b',
      courseBg: '#1c1917',
      courseHeader: '#292524',
      coursePlayBtn: '#f59e0b',
      adminSidebar: '#1c1917',
      adminSidebarActive: '#f59e0b',
      adminSurface: '#292524',
    }
  },
  {
    name: 'Forest Emerald',
    tokens: {
      colorPrimary: '#10b981',
      colorPrimaryHover: '#059669',
      colorAccent: '#14b8a6',
      colorSuccess: '#10b981',
      colorDanger: '#ef4444',
      colorBg: '#022c22',
      colorSurface: '#064e3b',
      colorSurface2: '#0f766e',
      colorBorder: '#115e59',
      colorText: '#f0fdf4',
      colorTextMuted: '#a7f3d0',
      navBg: '#064e3b',
      navBorder: '#115e59',
      navText: '#f0fdf4',
      navBrand: '#10b981',
      hubHeroFrom: '#064e3b',
      hubHeroTo: '#022c22',
      hubHeroText: '#f0fdf4',
      hubAccent: '#10b981',
      checkoutBg: '#022c22',
      checkoutCard: '#064e3b',
      checkoutBtn: '#10b981',
      checkoutBtnHover: '#059669',
      upsellBanner: '#064e3b',
      upsellBannerText: '#ccfbf1',
      upsellBtn: '#14b8a6',
      downsellBanner: '#022c22',
      downsellBtn: '#10b981',
      courseBg: '#022c22',
      courseHeader: '#064e3b',
      coursePlayBtn: '#10b981',
      adminSidebar: '#022c22',
      adminSidebarActive: '#10b981',
      adminSurface: '#064e3b',
    }
  },
  {
    name: 'Sunset Crimson',
    tokens: {
      colorPrimary: '#ef4444',
      colorPrimaryHover: '#dc2626',
      colorAccent: '#f97316',
      colorSuccess: '#10b981',
      colorDanger: '#ef4444',
      colorBg: '#180202',
      colorSurface: '#2a0808',
      colorSurface2: '#450a0a',
      colorBorder: '#7f1d1d',
      colorText: '#fef2f2',
      colorTextMuted: '#fca5a5',
      navBg: '#2a0808',
      navBorder: '#450a0a',
      navText: '#fef2f2',
      navBrand: '#ef4444',
      hubHeroFrom: '#2a0808',
      hubHeroTo: '#180202',
      hubHeroText: '#fef2f2',
      hubAccent: '#ef4444',
      checkoutBg: '#180202',
      checkoutCard: '#2a0808',
      checkoutBtn: '#ef4444',
      checkoutBtnHover: '#dc2626',
      upsellBanner: '#7f1d1d',
      upsellBannerText: '#fee2e2',
      upsellBtn: '#f97316',
      downsellBanner: '#180202',
      downsellBtn: '#ef4444',
      courseBg: '#180202',
      courseHeader: '#2a0808',
      coursePlayBtn: '#ef4444',
      adminSidebar: '#180202',
      adminSidebarActive: '#ef4444',
      adminSurface: '#2a0808',
    }
  },
  {
    name: 'Cyberpunk Gold',
    tokens: {
      colorPrimary: '#eab308',
      colorPrimaryHover: '#ca8a04',
      colorAccent: '#ec4899',
      colorSuccess: '#22c55e',
      colorDanger: '#ef4444',
      colorBg: '#090d16',
      colorSurface: '#111827',
      colorSurface2: '#1f2937',
      colorBorder: '#374151',
      colorText: '#f9fafb',
      colorTextMuted: '#9ca3af',
      navBg: '#111827',
      navBorder: '#1f2937',
      navText: '#f9fafb',
      navBrand: '#eab308',
      hubHeroFrom: '#111827',
      hubHeroTo: '#311042',
      hubHeroText: '#f9fafb',
      hubAccent: '#eab308',
      checkoutBg: '#090d16',
      checkoutCard: '#111827',
      checkoutBtn: '#eab308',
      checkoutBtnHover: '#ca8a04',
      upsellBanner: '#4c0519',
      upsellBannerText: '#ffe4e6',
      upsellBtn: '#ec4899',
      downsellBanner: '#111827',
      downsellBtn: '#eab308',
      courseBg: '#090d16',
      courseHeader: '#111827',
      coursePlayBtn: '#eab308',
      adminSidebar: '#090d16',
      adminSidebarActive: '#eab308',
      adminSurface: '#111827',
    }
  }
];

export default function AdminDashboard({
  pillars,
  posts,
  glossary,
  directory,
  products,
  authors,
  gateways = [],
  funnels = [],
  theme,
}: DashboardProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const [activeTab, setActiveTab] = useState<'pillars' | 'posts' | 'glossary' | 'directory' | 'products' | 'authors' | 'gateways' | 'funnels' | 'system' | 'theme'>('pillars');
  const [themeTokens, setThemeTokens] = useState<any>(theme || {});
  
  // Modal configurations
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState<'pillar' | 'post' | 'glossary' | 'directory' | 'product' | 'author' | 'gateway' | 'funnel' | null>(null);
  const [editItem, setEditItem] = useState<any>(null); // holds item being edited, or null for creating
  const [deleteConfirm, setDeleteConfirm] = useState<{ type: string; id: string } | null>(null);

  // Notification status
  const [message, setMessage] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [loadingSeed, setLoadingSeed] = useState(false);
  const [savingTheme, setSavingTheme] = useState(false);

  const [curriculumState, setCurriculumState] = useState<any[]>([]);

  // Curriculum state mutation helpers
  const addModule = () => {
    setCurriculumState([...curriculumState, { title: `Module ${curriculumState.length + 1}`, lessons: [] }]);
  };

  const updateModuleTitle = (mIdx: number, newTitle: string) => {
    const updated = [...curriculumState];
    updated[mIdx].title = newTitle;
    setCurriculumState(updated);
  };

  const deleteModule = (mIdx: number) => {
    const updated = curriculumState.filter((_: any, idx: number) => idx !== mIdx);
    setCurriculumState(updated);
  };

  const addLesson = (mIdx: number) => {
    const updated = [...curriculumState];
    const newLesson = {
      title: `Lesson ${mIdx + 1}.${updated[mIdx].lessons.length + 1}`,
      duration: '10 mins',
      videoUrl: '',
      description: '',
      attachments: []
    };
    updated[mIdx].lessons.push(newLesson);
    setCurriculumState(updated);
  };

  const updateLessonField = (mIdx: number, lIdx: number, field: string, value: any) => {
    const updated = [...curriculumState];
    updated[mIdx].lessons[lIdx][field] = value;
    setCurriculumState(updated);
  };

  const deleteLesson = (mIdx: number, lIdx: number) => {
    const updated = [...curriculumState];
    updated[mIdx].lessons = updated[mIdx].lessons.filter((_: any, idx: number) => idx !== lIdx);
    setCurriculumState(updated);
  };

  const addAttachment = (mIdx: number, lIdx: number) => {
    const updated = [...curriculumState];
    if (!updated[mIdx].lessons[lIdx].attachments) {
      updated[mIdx].lessons[lIdx].attachments = [];
    }
    updated[mIdx].lessons[lIdx].attachments.push({ name: 'Worksheet PDF', url: '' });
    setCurriculumState(updated);
  };

  const updateAttachmentField = (mIdx: number, lIdx: number, aIdx: number, field: string, value: string) => {
    const updated = [...curriculumState];
    updated[mIdx].lessons[lIdx].attachments[aIdx][field] = value;
    setCurriculumState(updated);
  };

  const deleteAttachment = (mIdx: number, lIdx: number, aIdx: number) => {
    const updated = [...curriculumState];
    updated[mIdx].lessons[lIdx].attachments = updated[mIdx].lessons[lIdx].attachments.filter((_: any, idx: number) => idx !== aIdx);
    setCurriculumState(updated);
  };

  const handleSaveTheme = async () => {
    setSavingTheme(true);
    try {
      const res = await upsertSiteTheme(themeTokens);
      if (res.success) {
        showNotification('Global Site Theme updated successfully!');
        router.refresh();
      } else {
        showNotification('Failed to update theme', true);
      }
    } catch (err: any) {
      showNotification(err.message || 'Error updating theme', true);
    } finally {
      setSavingTheme(false);
    }
  };

  const showNotification = (msg: string, isError = false) => {
    if (isError) {
      setErrorMsg(msg);
      setTimeout(() => setErrorMsg(null), 4000);
    } else {
      setMessage(msg);
      setTimeout(() => setMessage(null), 4000);
    }
  };

  const handleSeedDatabase = async () => {
    setLoadingSeed(true);
    try {
      const res = await fetch('/api/seed', { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        showNotification('Database seeded successfully!');
        router.refresh();
      } else {
        showNotification(data.error || 'Failed to seed database', true);
      }
    } catch (err: any) {
      showNotification(err.message || 'Network error seeding database', true);
    } finally {
      setLoadingSeed(false);
    }
  };

  // State-based delete handlers
  const confirmDelete = (type: string, id: string) => {
    setDeleteConfirm({ type, id });
  };

  const executeDelete = async () => {
    if (!deleteConfirm) return;
    const { type, id } = deleteConfirm;
    setDeleteConfirm(null);

    try {
      startTransition(async () => {
        if (type === 'pillar') {
          await deletePillarPage(id);
        } else if (type === 'post') {
          await deleteBlogPost(id);
        } else if (type === 'glossary') {
          await deleteGlossaryTerm(id);
        } else if (type === 'directory') {
          await deleteDirectoryResource(id);
        } else if (type === 'gateway') {
          await deletePaymentGateway(id);
        } else if (type === 'funnel') {
          await deleteProductFunnel(id);
        }
        showNotification(`${type.toUpperCase()} deleted successfully!`);
        router.refresh();
      });
    } catch (err: any) {
      showNotification(err.message || 'Failed to delete item', true);
    }
  };

  // Form submission handler
  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const dataObj: any = {};
    formData.forEach((value, key) => {
      dataObj[key] = value;
    });

    // Handle checkmarks/checkboxes
    if (modalType === 'post') {
      dataObj.isFeatured = formData.get('isFeatured') === 'on';
    } else if (modalType === 'directory') {
      dataObj.isSponsored = formData.get('isSponsored') === 'on';
      dataObj.rating = parseFloat(dataObj.rating || '5');
    } else if (modalType === 'product') {
      dataObj.price = parseFloat(dataObj.price || '0');
    } else if (modalType === 'author') {
      dataObj.verificationBadge = formData.get('verificationBadge') === 'on';
    } else if (modalType === 'gateway') {
      dataObj.isActive = formData.get('isActive') === 'on';
    } else if (modalType === 'funnel') {
      dataObj.isActive = formData.get('isActive') === 'on';
    }

    if (editItem) {
      dataObj.id = editItem._id;
    }

    try {
      startTransition(async () => {
        if (modalType === 'pillar') {
          await upsertPillarPage(dataObj);
        } else if (modalType === 'post') {
          await upsertBlogPost(dataObj);
        } else if (modalType === 'glossary') {
          await upsertGlossaryTerm(dataObj);
        } else if (modalType === 'directory') {
          await upsertDirectoryResource(dataObj);
        } else if (modalType === 'product') {
          await upsertProduct(dataObj);
        } else if (modalType === 'author') {
          await upsertAuthor(dataObj);
        } else if (modalType === 'gateway') {
          await upsertPaymentGateway(dataObj);
        } else if (modalType === 'funnel') {
          await upsertProductFunnel(dataObj);
        }

        showNotification(`${modalType!.toUpperCase()} saved successfully!`);
        setModalOpen(false);
        setEditItem(null);
        router.refresh();
      });
    } catch (err: any) {
      showNotification(err.message || 'Failed to save changes', true);
    }
  };

  const openCreateModal = (type: typeof modalType) => {
    setEditItem(null);
    setModalType(type);
    setModalOpen(true);
    if (type === 'product') {
      setCurriculumState([]);
    }
  };

  const openEditModal = (type: typeof modalType, item: any) => {
    setEditItem(item);
    setModalType(type);
    setModalOpen(true);
    if (type === 'product') {
      try {
        const parsed = item?.curriculum ? JSON.parse(item.curriculum) : [];
        setCurriculumState(Array.isArray(parsed) ? parsed : []);
      } catch (e) {
        setCurriculumState([]);
      }
    }
  };

  return (
    <div className="min-h-screen bg-slate-905 bg-slate-950 text-slate-100 flex flex-col md:flex-row">
      
      {/* Sidebar Navigation */}
      <aside className="w-full md:w-64 bg-slate-900 border-b md:border-b-0 md:border-r border-slate-800 p-6 flex flex-col gap-8 shrink-0">
        <div>
          <span className="text-[10px] font-black uppercase text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 px-2 py-0.5 rounded tracking-widest">
            Control Console
          </span>
          <h2 className="text-xl font-black mt-2 text-white">OmniPublish</h2>
        </div>

        <nav className="flex flex-row md:flex-col gap-1.5 overflow-x-auto md:overflow-x-visible pb-3 md:pb-0">
          <button
            onClick={() => setActiveTab('pillars')}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold transition w-full whitespace-nowrap ${
              activeTab === 'pillars' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/10' : 'text-slate-400 hover:bg-slate-850 hover:text-white'
            }`}
          >
            <BookOpen className="w-4 h-4" /> Pillar Pages
          </button>
          <button
            onClick={() => setActiveTab('posts')}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold transition w-full whitespace-nowrap ${
              activeTab === 'posts' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/10' : 'text-slate-400 hover:bg-slate-850 hover:text-white'
            }`}
          >
            <FileText className="w-4 h-4" /> Blog Posts
          </button>
          <button
            onClick={() => setActiveTab('glossary')}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold transition w-full whitespace-nowrap ${
              activeTab === 'glossary' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/10' : 'text-slate-400 hover:bg-slate-850 hover:text-white'
            }`}
          >
            <HelpCircle className="w-4 h-4" /> Glossary
          </button>
          <button
            onClick={() => setActiveTab('directory')}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold transition w-full whitespace-nowrap ${
              activeTab === 'directory' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/10' : 'text-slate-400 hover:bg-slate-850 hover:text-white'
            }`}
          >
            <FolderOpen className="w-4 h-4" /> Gear Directory
          </button>
          <button
            onClick={() => setActiveTab('products')}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold transition w-full whitespace-nowrap ${
              activeTab === 'products' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/10' : 'text-slate-400 hover:bg-slate-850 hover:text-white'
            }`}
          >
            <ShoppingBag className="w-4 h-4" /> Products
          </button>
          <button
            onClick={() => setActiveTab('gateways')}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold transition w-full whitespace-nowrap ${
              activeTab === 'gateways' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/10' : 'text-slate-400 hover:bg-slate-850 hover:text-white'
            }`}
          >
            <Wallet className="w-4 h-4" /> Payment Gateways
          </button>
          <button
            onClick={() => setActiveTab('funnels')}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold transition w-full whitespace-nowrap ${
              activeTab === 'funnels' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/10' : 'text-slate-400 hover:bg-slate-850 hover:text-white'
            }`}
          >
            <Filter className="w-4 h-4" /> Product Funnels
          </button>
          <button
            onClick={() => setActiveTab('authors')}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold transition w-full whitespace-nowrap ${
              activeTab === 'authors' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/10' : 'text-slate-400 hover:bg-slate-850 hover:text-white'
            }`}
          >
            <Users className="w-4 h-4" /> Authors
          </button>
          <button
            onClick={() => setActiveTab('theme')}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold transition w-full whitespace-nowrap ${
              activeTab === 'theme' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/10' : 'text-slate-400 hover:bg-slate-850 hover:text-white'
            }`}
          >
            <Palette className="w-4 h-4" /> Theme Studio
          </button>
          <button
            onClick={() => setActiveTab('system')}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold transition w-full whitespace-nowrap ${
              activeTab === 'system' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/10' : 'text-slate-400 hover:bg-slate-850 hover:text-white'
            }`}
          >
            <Settings className="w-4 h-4" /> System Actions
          </button>
          
          <div className="h-px bg-slate-800 my-2 w-full"></div>

          <a
            href="/story-hacker"
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold transition w-full whitespace-nowrap text-amber-500 hover:bg-slate-850 hover:text-amber-400"
          >
            <Edit className="w-4 h-4" /> Story Hacker
          </a>
        </nav>
      </aside>

      {/* Main Workspace */}
      <main className="flex-1 p-6 md:p-10 space-y-6 overflow-x-hidden">
        
        {/* Floating Notification */}
        {(message || errorMsg) && (
          <div className={`fixed top-6 right-6 p-4 rounded-xl border z-50 text-xs font-bold flex items-center gap-2 shadow-2xl ${
            errorMsg ? 'bg-red-950 border-red-800 text-red-300' : 'bg-emerald-950 border-emerald-800 text-emerald-350'
          }`}>
            <CheckCircle className="w-4 h-4 shrink-0" />
            <span>{message || errorMsg}</span>
          </div>
        )}

        {/* Workspace Headers */}
        <div className="flex justify-between items-center pb-4 border-b border-slate-800/80">
          <div>
            <h1 className="text-2xl md:text-3xl font-black text-white capitalize">
              {activeTab === 'system' ? 'System Controls' : activeTab === 'theme' ? 'Theme Studio' : activeTab === 'gateways' ? 'Payment Gateways' : activeTab === 'funnels' ? 'Product Funnels' : `${activeTab} Management`}
            </h1>
            <p className="text-slate-450 text-xs mt-1">
              {activeTab === 'theme' 
                ? 'Customize your global typography and design tokens real-time.'
                : 'Add, edit, or delete components powering your content pillars.'}
            </p>
          </div>

          {activeTab !== 'system' && activeTab !== 'theme' && (
            <button
              onClick={() => openCreateModal(tabToModelMap[activeTab])}
              className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-2.5 px-4 rounded-xl text-xs flex items-center gap-1.5 transition shadow-lg shadow-indigo-600/15"
            >
              <Plus className="w-4 h-4" /> New {tabToModelMap[activeTab]}
            </button>
          )}
        </div>

        {/* 1. PILLAR PAGES PANEL */}
        {activeTab === 'pillars' && (
          <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-800 bg-slate-950/40 text-slate-400 font-bold uppercase tracking-wider">
                    <th className="p-4">Keyword</th>
                    <th className="p-4">Slug</th>
                    <th className="p-4">Page Title</th>
                    <th className="p-4">Author</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/50">
                  {pillars.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="p-8 text-center text-slate-500">No Pillar Pages configured yet.</td>
                    </tr>
                  ) : (
                    pillars.map((item) => (
                      <tr key={item._id} className="hover:bg-slate-850/30 transition">
                        <td className="p-4 font-bold text-white">{item.keyword}</td>
                        <td className="p-4 font-mono">
                          <a
                            href={`/hub/${item.slug}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-cyan-400 hover:text-cyan-300 underline decoration-cyan-400/30"
                          >
                            /hub/{item.slug}
                          </a>
                        </td>
                        <td className="p-4 text-slate-300 truncate max-w-xs">{item.title}</td>
                        <td className="p-4 text-slate-400">{item.author?.name || 'Unassigned'}</td>
                        <td className="p-4 text-right space-x-2 whitespace-nowrap">
                          <button
                            onClick={() => openEditModal('pillar', item)}
                            className="p-1.5 bg-slate-800 text-slate-300 rounded hover:bg-slate-700 transition"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => confirmDelete('pillar', item._id)}
                            className="p-1.5 bg-red-950/40 text-red-400 rounded hover:bg-red-900/40 transition"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 2. BLOG POSTS PANEL */}
        {activeTab === 'posts' && (
          <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-800 bg-slate-950/40 text-slate-400 font-bold uppercase tracking-wider">
                    <th className="p-4">Title</th>
                    <th className="p-4">Slug</th>
                    <th className="p-4">Pillar</th>
                    <th className="p-4">Featured</th>
                    <th className="p-4">Read Time</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/50">
                  {posts.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="p-8 text-center text-slate-500">No blog posts configured yet.</td>
                    </tr>
                  ) : (
                    posts.map((item) => (
                      <tr key={item._id} className="hover:bg-slate-850/30 transition">
                        <td className="p-4 font-bold text-white">{item.title}</td>
                        <td className="p-4 font-mono">
                          {(() => {
                            const postPillar = pillars.find((p) => p._id === item.pillarId);
                            return postPillar ? (
                              <a
                                href={`/hub/${postPillar.slug}#blog`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-cyan-400 hover:text-cyan-300 underline decoration-cyan-400/30"
                              >
                                {item.slug}
                              </a>
                            ) : (
                              <span className="text-slate-500">{item.slug}</span>
                            );
                          })()}
                        </td>
                        <td className="p-4 text-slate-450">
                          {pillars.find((p) => p._id === item.pillarId)?.keyword || 'Unknown'}
                        </td>
                        <td className="p-4">
                          {item.isFeatured ? (
                            <span className="bg-amber-500/10 border border-amber-500/20 text-amber-400 text-[10px] px-2 py-0.5 rounded">Featured</span>
                          ) : (
                            <span className="text-slate-500">Standard</span>
                          )}
                        </td>
                        <td className="p-4 text-slate-400">{item.readTime || '5 mins'}</td>
                        <td className="p-4 text-right space-x-2 whitespace-nowrap">
                          <button
                            onClick={() => openEditModal('post', item)}
                            className="p-1.5 bg-slate-800 text-slate-300 rounded hover:bg-slate-700 transition"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => confirmDelete('post', item._id)}
                            className="p-1.5 bg-red-950/40 text-red-400 rounded hover:bg-red-900/40 transition"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 3. GLOSSARY TERMS PANEL */}
        {activeTab === 'glossary' && (
          <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-800 bg-slate-950/40 text-slate-400 font-bold uppercase tracking-wider">
                    <th className="p-4">Term</th>
                    <th className="p-4">Slug</th>
                    <th className="p-4">Pillar</th>
                    <th className="p-4">Definition Snippet</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/50">
                  {glossary.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="p-8 text-center text-slate-500">No glossary terms configured yet.</td>
                    </tr>
                  ) : (
                    glossary.map((item) => (
                      <tr key={item._id} className="hover:bg-slate-850/30 transition">
                        <td className="p-4 font-bold text-cyan-300">{item.term}</td>
                        <td className="p-4 font-mono text-slate-450">{item.slug}</td>
                        <td className="p-4 text-slate-400">
                          {pillars.find((p) => p._id === item.pillarId)?.keyword || 'Unknown'}
                        </td>
                        <td className="p-4 text-slate-450 truncate max-w-xs">{item.definition}</td>
                        <td className="p-4 text-right space-x-2 whitespace-nowrap">
                          <button
                            onClick={() => openEditModal('glossary', item)}
                            className="p-1.5 bg-slate-800 text-slate-300 rounded hover:bg-slate-700 transition"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => confirmDelete('glossary', item._id)}
                            className="p-1.5 bg-red-950/40 text-red-400 rounded hover:bg-red-900/40 transition"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 4. DIRECTORY RESOURCE PANEL */}
        {activeTab === 'directory' && (
          <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-800 bg-slate-950/40 text-slate-400 font-bold uppercase tracking-wider">
                    <th className="p-4">Resource Name</th>
                    <th className="p-4">Category</th>
                    <th className="p-4">Rating</th>
                    <th className="p-4">Sponsored</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/50">
                  {directory.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="p-8 text-center text-slate-500">No directory resources configured yet.</td>
                    </tr>
                  ) : (
                    directory.map((item) => (
                      <tr key={item._id} className="hover:bg-slate-850/30 transition">
                        <td className="p-4 font-bold text-white">{item.resourceName}</td>
                        <td className="p-4 text-slate-400 capitalize">{item.category || 'Gear'}</td>
                        <td className="p-4 text-amber-400 font-bold flex items-center gap-1">
                          <Star className="w-3.5 h-3.5 fill-amber-400" /> {item.rating?.toFixed(1) || '5.0'}
                        </td>
                        <td className="p-4">
                          {item.isSponsored ? (
                            <span className="bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-[10px] px-2 py-0.5 rounded">Sponsored</span>
                          ) : (
                            <span className="text-slate-500">Standard</span>
                          )}
                        </td>
                        <td className="p-4 text-right space-x-2 whitespace-nowrap">
                          <button
                            onClick={() => openEditModal('directory', item)}
                            className="p-1.5 bg-slate-800 text-slate-300 rounded hover:bg-slate-700 transition"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => confirmDelete('directory', item._id)}
                            className="p-1.5 bg-red-950/40 text-red-400 rounded hover:bg-red-900/40 transition"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 5. PRODUCTS PANEL */}
        {activeTab === 'products' && (
          <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-800 bg-slate-950/40 text-slate-400 font-bold uppercase tracking-wider">
                    <th className="p-4">Product Name</th>
                    <th className="p-4">Type</th>
                    <th className="p-4">Price</th>
                    <th className="p-4">Payment Gateway</th>
                    <th className="p-4">Checkout Link</th>
                    <th className="p-4">Student Portal</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/50">
                  {products.map((item) => (
                    <tr key={item._id} className="hover:bg-slate-850/30 transition">
                      <td className="p-4 font-bold text-white">{item.title}</td>
                      <td className="p-4 text-slate-400 capitalize">{item.type}</td>
                      <td className="p-4 text-emerald-400 font-bold">${item.price.toFixed(2)}</td>
                      <td className="p-4">
                        {item.gatewayId ? (
                          <span className="text-slate-300 bg-indigo-950/45 border border-indigo-900/50 px-2.5 py-1 rounded-lg font-bold text-[10px] uppercase tracking-wider">
                            {item.gatewayId.name} ({item.gatewayId.type})
                          </span>
                        ) : (
                          <span className="text-slate-500 italic">Global Env Default</span>
                        )}
                      </td>
                      <td className="p-4 font-mono">
                        <a
                          href={`/checkout?productId=${item._id}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-cyan-400 hover:text-cyan-300 underline decoration-cyan-400/30"
                        >
                          /checkout?productId={item._id.slice(0, 6)}...
                        </a>
                      </td>
                      <td className="p-4 font-mono">
                        <a
                          href={`/courses/${item._id}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-indigo-400 hover:text-indigo-300 underline decoration-indigo-400/30"
                        >
                          /courses/{item._id.slice(0, 6)}...
                        </a>
                      </td>
                      <td className="p-4 text-right whitespace-nowrap">
                        <button
                          onClick={() => openEditModal('product', item)}
                          className="p-1.5 bg-slate-800 text-slate-300 rounded hover:bg-slate-700 transition"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 5B. PAYMENT GATEWAYS PANEL */}
        {activeTab === 'gateways' && (
          <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-800 bg-slate-950/40 text-slate-400 font-bold uppercase tracking-wider">
                    <th className="p-4">Gateway Name</th>
                    <th className="p-4">Type</th>
                    <th className="p-4">Stripe Publishable Key</th>
                    <th className="p-4">Status</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/50">
                  {gateways.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="p-8 text-center text-slate-500">No Payment Gateways configured yet.</td>
                    </tr>
                  ) : (
                    gateways.map((item) => (
                      <tr key={item._id} className="hover:bg-slate-850/30 transition">
                        <td className="p-4 font-bold text-white">{item.name}</td>
                        <td className="p-4 text-slate-450 uppercase">{item.type}</td>
                        <td className="p-4 text-slate-400 font-mono">
                          {item.type === 'stripe' ? (item.stripePublishableKey || 'Not Defined') : 'N/A (Simulation Mode)'}
                        </td>
                        <td className="p-4">
                          {item.isActive ? (
                            <span className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] px-2 py-0.5 rounded">Active</span>
                          ) : (
                            <span className="bg-red-500/10 border border-red-500/20 text-red-400 text-[10px] px-2 py-0.5 rounded">Inactive</span>
                          )}
                        </td>
                        <td className="p-4 text-right space-x-2 whitespace-nowrap">
                          <button
                            onClick={() => openEditModal('gateway', item)}
                            className="p-1.5 bg-slate-800 text-slate-300 rounded hover:bg-slate-700 transition"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => confirmDelete('gateway', item._id)}
                            className="p-1.5 bg-red-950/40 text-red-400 rounded hover:bg-red-900/40 transition"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 5C. PRODUCT FUNNELS PANEL */}
        {activeTab === 'funnels' && (
          <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-800 bg-slate-950/40 text-slate-400 font-bold uppercase tracking-wider">
                    <th className="p-4">Funnel Name</th>
                    <th className="p-4">Primary Product</th>
                    <th className="p-4">Upsell Product</th>
                    <th className="p-4">Downsell Product</th>
                    <th className="p-4">Status</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/50">
                  {funnels.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="p-8 text-center text-slate-500">No Product Funnels configured yet.</td>
                    </tr>
                  ) : (
                    funnels.map((item) => (
                      <tr key={item._id} className="hover:bg-slate-850/30 transition">
                        <td className="p-4 font-bold text-white">{item.name}</td>
                        <td className="p-4 text-indigo-400 font-semibold">{item.primaryProduct?.title || 'None'}</td>
                        <td className="p-4 text-amber-400">{item.upsellProduct?.title || 'None'}</td>
                        <td className="p-4 text-slate-450">{item.downsellProduct?.title || 'None'}</td>
                        <td className="p-4">
                          {item.isActive ? (
                            <span className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] px-2 py-0.5 rounded">Active</span>
                          ) : (
                            <span className="bg-red-500/10 border border-red-500/20 text-red-400 text-[10px] px-2 py-0.5 rounded">Inactive</span>
                          )}
                        </td>
                        <td className="p-4 text-right space-x-2 whitespace-nowrap">
                          <button
                            onClick={() => openEditModal('funnel', item)}
                            className="p-1.5 bg-slate-800 text-slate-300 rounded hover:bg-slate-700 transition"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => confirmDelete('funnel', item._id)}
                            className="p-1.5 bg-red-950/40 text-red-400 rounded hover:bg-red-900/40 transition"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 6. AUTHORS PANEL */}
        {activeTab === 'authors' && (
          <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-800 bg-slate-950/40 text-slate-400 font-bold uppercase tracking-wider">
                    <th className="p-4">Author Name</th>
                    <th className="p-4">Credentials</th>
                    <th className="p-4">Avatar Initials</th>
                    <th className="p-4">Verified</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/50">
                  {authors.map((item) => (
                    <tr key={item._id} className="hover:bg-slate-850/30 transition">
                      <td className="p-4 font-bold text-white">{item.name}</td>
                      <td className="p-4 text-slate-400">{item.credentials || 'None'}</td>
                      <td className="p-4 font-mono text-indigo-400">{item.avatarUrl || 'JD'}</td>
                      <td className="p-4">
                        {item.verificationBadge ? (
                          <span className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] px-2 py-0.5 rounded">Verified</span>
                        ) : (
                          <span className="text-slate-500">Unverified</span>
                        )}
                      </td>
                      <td className="p-4 text-right whitespace-nowrap">
                        <button
                          onClick={() => openEditModal('author', item)}
                          className="p-1.5 bg-slate-800 text-slate-300 rounded hover:bg-slate-700 transition"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* THEME STUDIO PANEL */}
        {activeTab === 'theme' && (
          <div className="space-y-8">
            {/* Presets Row */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
              <div>
                <h3 className="text-sm font-black text-white">Theme Presets</h3>
                <p className="text-slate-450 text-[11px] mt-0.5">Choose a pre-designed theme to instantly overhaul all variables, then fine-tune below.</p>
              </div>
              <div className="flex flex-wrap gap-3">
                {PRESETS.map((preset) => (
                  <button
                    key={preset.name}
                    onClick={() => {
                      setThemeTokens(preset.tokens);
                      showNotification(`Loaded ${preset.name} preset!`);
                    }}
                    className="px-4 py-2 rounded-xl text-xs font-bold border transition hover:opacity-90 flex items-center gap-2"
                    style={{
                      backgroundColor: preset.tokens.colorSurface,
                      borderColor: preset.tokens.colorBorder,
                      color: preset.tokens.colorText
                    }}
                  >
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: preset.tokens.colorPrimary }} />
                    {preset.name}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
              {/* Color Settings Columns */}
              <div className="lg:col-span-2 space-y-6">
                
                {/* Brand Colors Group */}
                <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
                  <h4 className="text-xs font-black uppercase text-indigo-400 tracking-wider pb-2 border-b border-slate-800">
                    1. Core Branding Colors
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {[
                      { l: 'Primary Accent', k: 'colorPrimary' },
                      { l: 'Primary Hover', k: 'colorPrimaryHover' },
                      { l: 'Accent Accent', k: 'colorAccent' },
                      { l: 'Success Alert', k: 'colorSuccess' },
                      { l: 'Danger Alert', k: 'colorDanger' },
                    ].map(x => (
                      <div key={x.k} className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">{x.l}</label>
                        <div className="flex items-center gap-2">
                          <input
                            type="color"
                            value={themeTokens[x.k] || '#ffffff'}
                            onChange={(e) => setThemeTokens({ ...themeTokens, [x.k]: e.target.value })}
                            className="w-8 h-8 rounded-lg cursor-pointer bg-transparent border-0"
                          />
                          <input
                            type="text"
                            value={themeTokens[x.k] || ''}
                            onChange={(e) => setThemeTokens({ ...themeTokens, [x.k]: e.target.value })}
                            className="w-full text-xs font-mono bg-slate-950 border border-slate-850 rounded-lg px-2 py-1 text-white focus:outline-none"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Surfaces & Layout Group */}
                <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
                  <h4 className="text-xs font-black uppercase text-indigo-400 tracking-wider pb-2 border-b border-slate-800">
                    2. Surface & Layout Tokens
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {[
                      { l: 'Page Background', k: 'colorBg' },
                      { l: 'Surface Content Card', k: 'colorSurface' },
                      { l: 'Surface Sub-Card', k: 'colorSurface2' },
                      { l: 'System Border', k: 'colorBorder' },
                      { l: 'Primary Text', k: 'colorText' },
                      { l: 'Muted Sub-Text', k: 'colorTextMuted' },
                    ].map(x => (
                      <div key={x.k} className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">{x.l}</label>
                        <div className="flex items-center gap-2">
                          <input
                            type="color"
                            value={themeTokens[x.k] || '#ffffff'}
                            onChange={(e) => setThemeTokens({ ...themeTokens, [x.k]: e.target.value })}
                            className="w-8 h-8 rounded-lg cursor-pointer bg-transparent border-0"
                          />
                          <input
                            type="text"
                            value={themeTokens[x.k] || ''}
                            onChange={(e) => setThemeTokens({ ...themeTokens, [x.k]: e.target.value })}
                            className="w-full text-xs font-mono bg-slate-950 border border-slate-850 rounded-lg px-2 py-1 text-white focus:outline-none"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Navigation & Hub Group */}
                <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
                  <h4 className="text-xs font-black uppercase text-indigo-400 tracking-wider pb-2 border-b border-slate-800">
                    3. Header Nav & Hub Directory
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {[
                      { l: 'Navbar Bg', k: 'navBg' },
                      { l: 'Navbar Border', k: 'navBorder' },
                      { l: 'Navbar Link Text', k: 'navText' },
                      { l: 'Navbar Logo Brand', k: 'navBrand' },
                      { l: 'Hub Hero Gradient Start', k: 'hubHeroFrom' },
                      { l: 'Hub Hero Gradient End', k: 'hubHeroTo' },
                      { l: 'Hub Hero Title Text', k: 'hubHeroText' },
                      { l: 'Hub Accent Trim', k: 'hubAccent' },
                    ].map(x => (
                      <div key={x.k} className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">{x.l}</label>
                        <div className="flex items-center gap-2">
                          <input
                            type="color"
                            value={themeTokens[x.k] || '#ffffff'}
                            onChange={(e) => setThemeTokens({ ...themeTokens, [x.k]: e.target.value })}
                            className="w-8 h-8 rounded-lg cursor-pointer bg-transparent border-0"
                          />
                          <input
                            type="text"
                            value={themeTokens[x.k] || ''}
                            onChange={(e) => setThemeTokens({ ...themeTokens, [x.k]: e.target.value })}
                            className="w-full text-xs font-mono bg-slate-950 border border-slate-850 rounded-lg px-2 py-1 text-white focus:outline-none"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Checkout, Funnels & Student Portal */}
                <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
                  <h4 className="text-xs font-black uppercase text-indigo-400 tracking-wider pb-2 border-b border-slate-800">
                    4. Checkout, Funnel Pipeline & Student Portal
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {[
                      { l: 'Checkout Bg', k: 'checkoutBg' },
                      { l: 'Checkout Card surface', k: 'checkoutCard' },
                      { l: 'Checkout CTA Button', k: 'checkoutBtn' },
                      { l: 'Checkout CTA Hover', k: 'checkoutBtnHover' },
                      { l: 'Upsell Offer Banner', k: 'upsellBanner' },
                      { l: 'Upsell Banner Text', k: 'upsellBannerText' },
                      { l: 'Upsell Upgrade CTA', k: 'upsellBtn' },
                      { l: 'Downsell Banner', k: 'downsellBanner' },
                      { l: 'Downsell Decline Link', k: 'downsellBtn' },
                      { l: 'Student Course Portal Bg', k: 'courseBg' },
                      { l: 'Portal Header Navbar', k: 'courseHeader' },
                      { l: 'Portal Play Button', k: 'coursePlayBtn' },
                    ].map(x => (
                      <div key={x.k} className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">{x.l}</label>
                        <div className="flex items-center gap-2">
                          <input
                            type="color"
                            value={themeTokens[x.k] || '#ffffff'}
                            onChange={(e) => setThemeTokens({ ...themeTokens, [x.k]: e.target.value })}
                            className="w-8 h-8 rounded-lg cursor-pointer bg-transparent border-0"
                          />
                          <input
                            type="text"
                            value={themeTokens[x.k] || ''}
                            onChange={(e) => setThemeTokens({ ...themeTokens, [x.k]: e.target.value })}
                            className="w-full text-xs font-mono bg-slate-950 border border-slate-850 rounded-lg px-2 py-1 text-white focus:outline-none"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Save Theme Action Bar */}
                <div className="pt-2 flex justify-end">
                  <button
                    onClick={handleSaveTheme}
                    disabled={savingTheme}
                    className="bg-indigo-650 bg-indigo-650 hover:bg-indigo-600 disabled:bg-slate-700 text-white font-bold py-3.5 px-8 rounded-2xl text-xs transition duration-150 flex items-center gap-2 shadow-lg shadow-indigo-600/10"
                  >
                    {savingTheme ? <Loader2 className="w-4 h-4 animate-spin" /> : '💾 Save Global Theme Tokens'}
                  </button>
                </div>
              </div>

              {/* Real-time preview widget */}
              <div className="space-y-6 lg:sticky lg:top-6">
                <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
                  <div>
                    <h3 className="text-xs font-black text-white uppercase tracking-wider">Real-Time Canvas Preview</h3>
                    <p className="text-[10px] text-slate-450 mt-0.5">Mock page rendering reflecting chosen CSS variables.</p>
                  </div>

                  {/* Header Mock */}
                  <div className="rounded-xl border p-3 space-y-2" style={{ backgroundColor: themeTokens.navBg || '#000', borderColor: themeTokens.navBorder || '#333' }}>
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-black" style={{ color: themeTokens.navBrand || '#6366f1' }}>OmniPublish</span>
                      <div className="flex gap-2">
                        <span className="w-8 h-2 rounded" style={{ backgroundColor: themeTokens.navText || '#fff', opacity: 0.6 }} />
                        <span className="w-8 h-2 rounded" style={{ backgroundColor: themeTokens.navText || '#fff', opacity: 0.6 }} />
                      </div>
                    </div>
                  </div>

                  {/* Hub Hero Mock */}
                  <div className="rounded-xl p-4 text-center space-y-2 bg-gradient-to-br" style={{ backgroundImage: `linear-gradient(to bottom right, ${themeTokens.hubHeroFrom || '#111'}, ${themeTokens.hubHeroTo || '#000'})` }}>
                    <span className="text-[9px] font-black uppercase px-2 py-0.5 rounded" style={{ backgroundColor: themeTokens.hubAccent || '#6366f1', color: '#fff' }}>Dog Training</span>
                    <h5 className="text-[11px] font-black" style={{ color: themeTokens.hubHeroText || '#fff' }}>Canine Secrets Unlocked</h5>
                    <div className="w-24 h-1 mx-auto rounded" style={{ backgroundColor: themeTokens.colorPrimary || '#6366f1' }} />
                  </div>

                  {/* Checkout Button & Surface Card Mock */}
                  <div className="rounded-xl border p-4 space-y-3" style={{ backgroundColor: themeTokens.checkoutCard || '#000', borderColor: themeTokens.colorBorder || '#333' }}>
                    <div className="flex justify-between items-center">
                      <div className="space-y-1">
                        <div className="w-16 h-2 rounded" style={{ backgroundColor: themeTokens.colorText || '#fff' }} />
                        <div className="w-10 h-1.5 rounded" style={{ backgroundColor: themeTokens.colorTextMuted || '#ccc' }} />
                      </div>
                      <span className="text-[10px] font-bold" style={{ color: themeTokens.colorSuccess || '#10b981' }}>$49.00</span>
                    </div>
                    <button className="w-full text-[9px] font-bold py-2 rounded-lg text-white" style={{ backgroundColor: themeTokens.checkoutBtn || '#6366f1' }}>
                      Complete Secure Order
                    </button>
                  </div>

                  {/* Course Player Mock */}
                  <div className="rounded-xl border aspect-video flex flex-col justify-center items-center relative overflow-hidden" style={{ backgroundColor: themeTokens.courseBg || '#000', borderColor: themeTokens.colorBorder || '#333' }}>
                    <div className="w-8 h-8 rounded-full flex items-center justify-center text-white" style={{ backgroundColor: themeTokens.coursePlayBtn || '#6366f1' }}>
                      <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
                    </div>
                    <span className="absolute bottom-2 left-2 text-[7px] font-mono text-slate-500">00:00 / 15:24</span>
                  </div>

                  {/* Upsell Banner Mock */}
                  <div className="rounded-xl p-3 text-center space-y-2" style={{ backgroundColor: themeTokens.upsellBanner || '#78350f' }}>
                    <p className="text-[9px] font-black leading-tight" style={{ color: themeTokens.upsellBannerText || '#fef3c7' }}>Special One-Time Upgrade Offer!</p>
                    <button className="w-full text-[8px] font-bold py-1.5 rounded text-slate-900" style={{ backgroundColor: themeTokens.upsellBtn || '#f59e0b' }}>
                      Upgrade Order Now
                    </button>
                  </div>

                </div>
              </div>
            </div>
          </div>
        )}

        {/* 7. SYSTEM ACTIONS PANEL */}
        {activeTab === 'system' && (
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 max-w-xl space-y-6 shadow-xl">
            <h3 className="text-lg font-bold text-white border-b border-slate-800 pb-3">Database Tools</h3>
            <p className="text-slate-400 text-xs leading-relaxed">
              Use the tools below to reload high-fidelity configurations or perform collection-wide deletions for development sandbox resets.
            </p>
            <button
              onClick={handleSeedDatabase}
              disabled={loadingSeed}
              className="bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-700 text-white font-bold py-3 px-6 rounded-2xl text-xs transition duration-150 flex items-center gap-2 shadow-lg shadow-indigo-600/10"
            >
              {loadingSeed ? <Loader2 className="w-4 h-4 animate-spin" /> : '⚡ Trigger Database Seed Content'}
            </button>
          </div>
        )}

      </main>

      {/* CRUD FORM MODAL */}
      {modalOpen && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-lg w-full max-h-[85vh] overflow-y-auto p-8 shadow-2xl space-y-6 flex flex-col justify-between">
            <div className="flex justify-between items-center pb-4 border-b border-slate-800">
              <h3 className="text-lg font-black text-white capitalize">
                {editItem ? 'Edit' : 'Create'} {modalType}
              </h3>
              <button
                onClick={() => setModalOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 flex items-center justify-center transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="space-y-4">
              
              {/* PILLAR PAGE FORM */}
              {modalType === 'pillar' && (
                <>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-450 uppercase mb-2">Keyword</label>
                    <input
                      type="text"
                      name="keyword"
                      defaultValue={editItem?.keyword || ''}
                      required
                      placeholder="e.g. Dog Training"
                      className="w-full text-xs bg-slate-950 border border-slate-850 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-450 uppercase mb-2">Slug</label>
                    <input
                      type="text"
                      name="slug"
                      defaultValue={editItem?.slug || ''}
                      required
                      placeholder="e.g. dog-training"
                      className="w-full text-xs bg-slate-950 border border-slate-850 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-450 uppercase mb-2">Page Title</label>
                    <input
                      type="text"
                      name="title"
                      defaultValue={editItem?.title || ''}
                      required
                      placeholder="e.g. The Ultimate Guide | OmniPublish"
                      className="w-full text-xs bg-slate-950 border border-slate-850 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-450 uppercase mb-2">Meta Description</label>
                    <textarea
                      name="metaDescription"
                      defaultValue={editItem?.metaDescription || ''}
                      required
                      placeholder="SEO meta description..."
                      rows={2}
                      className="w-full text-xs bg-slate-950 border border-slate-850 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-450 uppercase mb-2">Hero Title</label>
                    <input
                      type="text"
                      name="heroTitle"
                      defaultValue={editItem?.heroTitle || ''}
                      placeholder="Large header title..."
                      className="w-full text-xs bg-slate-950 border border-slate-850 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-450 uppercase mb-2">Hero Subtitle</label>
                    <textarea
                      name="heroSubtitle"
                      defaultValue={editItem?.heroSubtitle || ''}
                      placeholder="Short value proposition subtitle..."
                      rows={2}
                      className="w-full text-xs bg-slate-950 border border-slate-850 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-450 uppercase mb-2">Introduction Text</label>
                    <textarea
                      name="introductionText"
                      defaultValue={editItem?.introductionText || ''}
                      placeholder="First paragraphs for author bio section..."
                      rows={3}
                      className="w-full text-xs bg-slate-950 border border-slate-850 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-450 uppercase mb-2">Author Assignment</label>
                    <select
                      name="author"
                      defaultValue={editItem?.author?._id || editItem?.author || ''}
                      required
                      className="w-full text-xs bg-slate-950 border border-slate-850 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                      <option value="">Select Author...</option>
                      {authors.map((auth) => (
                        <option key={auth._id} value={auth._id}>{auth.name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-450 uppercase mb-2">Primary Product CTA</label>
                    <select
                      name="primaryProduct"
                      defaultValue={editItem?.primaryProduct?._id || editItem?.primaryProduct || ''}
                      className="w-full text-xs bg-slate-950 border border-slate-850 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                      <option value="">None</option>
                      {products.map((prod) => (
                        <option key={prod._id} value={prod._id}>{prod.title} (${prod.price.toFixed(2)})</option>
                      ))}
                    </select>
                  </div>
                </>
              )}

              {/* BLOG POST FORM */}
              {modalType === 'post' && (
                <>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-450 uppercase mb-2">Pillar Hub Connection</label>
                    <select
                      name="pillarId"
                      defaultValue={editItem?.pillarId?._id || editItem?.pillarId || ''}
                      required
                      className="w-full text-xs bg-slate-950 border border-slate-850 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                      <option value="">Select Pillar Page...</option>
                      {pillars.map((pil) => (
                        <option key={pil._id} value={pil._id}>{pil.keyword}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-450 uppercase mb-2">Title</label>
                    <input
                      type="text"
                      name="title"
                      defaultValue={editItem?.title || ''}
                      required
                      placeholder="e.g. Crate Training Blueprint"
                      className="w-full text-xs bg-slate-950 border border-slate-850 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-450 uppercase mb-2">Slug</label>
                    <input
                      type="text"
                      name="slug"
                      defaultValue={editItem?.slug || ''}
                      required
                      placeholder="e.g. crate-training-guide"
                      className="w-full text-xs bg-slate-950 border border-slate-850 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-450 uppercase mb-2">Excerpt</label>
                    <textarea
                      name="excerpt"
                      defaultValue={editItem?.excerpt || ''}
                      placeholder="Brief article summary for rolls..."
                      rows={2}
                      className="w-full text-xs bg-slate-950 border border-slate-850 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-450 uppercase mb-2">Read Time</label>
                    <input
                      type="text"
                      name="readTime"
                      defaultValue={editItem?.readTime || '8 mins'}
                      placeholder="e.g. 8 mins"
                      className="w-full text-xs bg-slate-950 border border-slate-850 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-450 uppercase mb-2">Content (HTML Supported)</label>
                    <textarea
                      name="content"
                      defaultValue={editItem?.content || ''}
                      required
                      placeholder="Full guide contents..."
                      rows={6}
                      className="w-full text-xs bg-slate-950 border border-slate-850 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono"
                    />
                  </div>
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      id="isFeatured"
                      name="isFeatured"
                      defaultChecked={editItem?.isFeatured || false}
                      className="w-4 h-4 rounded border-slate-850 bg-slate-950 text-indigo-650 focus:ring-indigo-500"
                    />
                    <label htmlFor="isFeatured" className="text-xs font-bold text-slate-350 select-none">
                      Mark as Featured (Highlights in rollup grid)
                    </label>
                  </div>
                </>
              )}

              {/* GLOSSARY TERM FORM */}
              {modalType === 'glossary' && (
                <>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-450 uppercase mb-2">Pillar Hub Connection</label>
                    <select
                      name="pillarId"
                      defaultValue={editItem?.pillarId?._id || editItem?.pillarId || ''}
                      required
                      className="w-full text-xs bg-slate-950 border border-slate-850 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                      <option value="">Select Pillar Page...</option>
                      {pillars.map((pil) => (
                        <option key={pil._id} value={pil._id}>{pil.keyword}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-450 uppercase mb-2">Vocabulary Term</label>
                    <input
                      type="text"
                      name="term"
                      defaultValue={editItem?.term || ''}
                      required
                      placeholder="e.g. Clicker Training"
                      className="w-full text-xs bg-slate-950 border border-slate-850 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-450 uppercase mb-2">Slug</label>
                    <input
                      type="text"
                      name="slug"
                      defaultValue={editItem?.slug || ''}
                      required
                      placeholder="e.g. clicker-training"
                      className="w-full text-xs bg-slate-950 border border-slate-850 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-450 uppercase mb-2">Term Definition</label>
                    <textarea
                      name="definition"
                      defaultValue={editItem?.definition || ''}
                      required
                      placeholder="Semantic dictionary entry definition text..."
                      rows={3}
                      className="w-full text-xs bg-slate-950 border border-slate-850 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                </>
              )}

              {/* DIRECTORY RESOURCE FORM */}
              {modalType === 'directory' && (
                <>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-450 uppercase mb-2">Pillar Hub Connection</label>
                    <select
                      name="pillarId"
                      defaultValue={editItem?.pillarId?._id || editItem?.pillarId || ''}
                      required
                      className="w-full text-xs bg-slate-950 border border-slate-850 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                      <option value="">Select Pillar Page...</option>
                      {pillars.map((pil) => (
                        <option key={pil._id} value={pil._id}>{pil.keyword}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-450 uppercase mb-2">Resource Name</label>
                    <input
                      type="text"
                      name="resourceName"
                      defaultValue={editItem?.resourceName || ''}
                      required
                      placeholder="e.g. Blue-9 Balance Harness"
                      className="w-full text-xs bg-slate-950 border border-slate-850 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-450 uppercase mb-2">Category</label>
                    <input
                      type="text"
                      name="category"
                      defaultValue={editItem?.category || 'Gear'}
                      placeholder="e.g. Tools, Gear, Local Services"
                      className="w-full text-xs bg-slate-950 border border-slate-850 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-450 uppercase mb-2">Affiliate Tracking URL</label>
                    <input
                      type="url"
                      name="affiliateUrl"
                      defaultValue={editItem?.affiliateUrl || ''}
                      placeholder="e.g. https://amazon.com/..."
                      className="w-full text-xs bg-slate-950 border border-slate-850 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-450 uppercase mb-2">Star Rating (1 - 5)</label>
                    <input
                      type="number"
                      step="0.1"
                      min="1"
                      max="5"
                      name="rating"
                      defaultValue={editItem?.rating || '5'}
                      className="w-full text-xs bg-slate-950 border border-slate-850 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-450 uppercase mb-2">Description</label>
                    <textarea
                      name="description"
                      defaultValue={editItem?.description || ''}
                      placeholder="Affiliate product short review..."
                      rows={2}
                      className="w-full text-xs bg-slate-950 border border-slate-850 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      id="isSponsored"
                      name="isSponsored"
                      defaultChecked={editItem?.isSponsored || false}
                      className="w-4 h-4 rounded border-slate-850 bg-slate-950 text-indigo-650 focus:ring-indigo-500"
                    />
                    <label htmlFor="isSponsored" className="text-xs font-bold text-slate-350 select-none">
                      Mark as Top Pick (Sponsored banner highlights)
                    </label>
                  </div>
                </>
              )}

              {/* PRODUCT FORM */}
              {modalType === 'product' && (
                <>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-450 uppercase mb-2">Product Name</label>
                    <input
                      type="text"
                      name="title"
                      defaultValue={editItem?.title || ''}
                      required
                      placeholder="Product title..."
                      className="w-full text-xs bg-slate-950 border border-slate-850 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-450 uppercase mb-2">Product Type</label>
                    <select
                      name="type"
                      defaultValue={editItem?.type || 'course'}
                      required
                      className="w-full text-xs bg-slate-950 border border-slate-850 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                      <option value="course">Video Course</option>
                      <option value="ebook">Ebook / PDF Guide</option>
                      <option value="service">Coaching / Service</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-450 uppercase mb-2">Price (USD)</label>
                    <input
                      type="number"
                      step="0.01"
                      name="price"
                      defaultValue={editItem?.price || '49.00'}
                      required
                      className="w-full text-xs bg-slate-950 border border-slate-850 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-450 uppercase mb-2">Payment Gateway Connection</label>
                    <select
                      name="gatewayId"
                      defaultValue={editItem?.gatewayId?._id || editItem?.gatewayId || ''}
                      className="w-full text-xs bg-slate-950 border border-slate-850 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                      <option value="">Use Global Env Default</option>
                      {gateways.map((gw) => (
                        <option key={gw._id} value={gw._id}>{gw.name} ({gw.type})</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-450 uppercase mb-2">Stripe Price ID</label>
                    <input
                      type="text"
                      name="stripePriceId"
                      defaultValue={editItem?.stripePriceId || ''}
                      placeholder="price_..."
                      className="w-full text-xs bg-slate-950 border border-slate-850 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-450 uppercase mb-2">Description</label>
                    <textarea
                      name="description"
                      defaultValue={editItem?.description || ''}
                      placeholder="Short pricing plan features..."
                      rows={2}
                      className="w-full text-xs bg-slate-950 border border-slate-850 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                  <div className="border-t border-slate-850 pt-6 space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-xs font-bold text-white uppercase tracking-wider">Course Curriculum Builder</h4>
                        <p className="text-[10px] text-slate-500 mt-0.5">Visually design modules, lessons, video URLs, and worksheets.</p>
                      </div>
                      <button
                        type="button"
                        onClick={addModule}
                        className="bg-indigo-650 hover:bg-indigo-600 text-white text-[10px] font-bold px-3 py-1.5 rounded-lg flex items-center gap-1 transition"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        Add Module
                      </button>
                    </div>

                    <input type="hidden" name="curriculum" value={JSON.stringify(curriculumState)} />

                    {curriculumState.length === 0 ? (
                      <div className="bg-slate-950 border border-dashed border-slate-850 p-6 rounded-2xl text-center">
                        <p className="text-xs text-slate-500">No modules added yet. Click "Add Module" to begin building your course curriculum.</p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {curriculumState.map((mod, mIdx) => (
                          <div key={mIdx} className="bg-slate-950 border border-slate-850 p-5 rounded-2xl space-y-4 relative">
                            {/* Module Header */}
                            <div className="flex items-center gap-3">
                              <span className="text-[10px] font-black uppercase text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded">
                                Module {mIdx + 1}
                              </span>
                              <input
                                type="text"
                                value={mod.title || ''}
                                placeholder="Module Title (e.g. Module 1: Foundations)"
                                onChange={(e) => updateModuleTitle(mIdx, e.target.value)}
                                className="flex-1 text-xs bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:ring-1 focus:ring-indigo-500 font-bold"
                              />
                              <button
                                type="button"
                                onClick={() => deleteModule(mIdx)}
                                className="text-red-400 hover:text-red-300 p-2 hover:bg-slate-900 rounded-xl transition"
                                title="Delete Module"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>

                            {/* Lessons Container */}
                            <div className="space-y-3 pl-4 border-l border-slate-855" style={{ borderColor: 'var(--color-border)' }}>
                              {(mod.lessons || []).map((les: any, lIdx: number) => (
                                <div key={lIdx} className="bg-slate-900 border border-slate-800/80 p-4 rounded-xl space-y-3 relative">
                                  {/* Lesson Header */}
                                  <div className="flex items-center gap-3">
                                    <span className="text-[9px] font-bold text-slate-400">
                                      Lesson {mIdx + 1}.{lIdx + 1}
                                    </span>
                                    <input
                                      type="text"
                                      value={les.title || ''}
                                      placeholder="Lesson Title"
                                      onChange={(e) => updateLessonField(mIdx, lIdx, 'title', e.target.value)}
                                      className="flex-1 text-xs bg-slate-955 border border-slate-850 rounded-lg px-3 py-1.5 text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                                      style={{ backgroundColor: 'var(--color-bg)', borderColor: 'var(--color-border)' }}
                                    />
                                    <input
                                      type="text"
                                      value={les.duration || ''}
                                      placeholder="Duration (e.g. 15 mins)"
                                      onChange={(e) => updateLessonField(mIdx, lIdx, 'duration', e.target.value)}
                                      className="w-28 text-xs bg-slate-955 border border-slate-850 rounded-lg px-3 py-1.5 text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                                      style={{ backgroundColor: 'var(--color-bg)', borderColor: 'var(--color-border)' }}
                                    />
                                  </div>

                                  {/* Video URL */}
                                  <div>
                                    <label className="block text-[9px] font-bold text-slate-500 uppercase mb-1">Video URL (YouTube or Groove watch links)</label>
                                    <input
                                      type="text"
                                      value={les.videoUrl || ''}
                                      placeholder="e.g. https://videoplayer.gg/watch/... or https://youtube.com/watch?v=..."
                                      onChange={(e) => updateLessonField(mIdx, lIdx, 'videoUrl', e.target.value)}
                                      className="w-full text-xs bg-slate-955 border border-slate-850 rounded-lg px-3 py-1.5 text-white focus:outline-none focus:ring-1 focus:ring-indigo-500 font-mono"
                                      style={{ backgroundColor: 'var(--color-bg)', borderColor: 'var(--color-border)' }}
                                    />
                                  </div>

                                  {/* Description */}
                                  <div>
                                    <label className="block text-[9px] font-bold text-slate-500 uppercase mb-1">Lesson Description</label>
                                    <textarea
                                      value={les.description || ''}
                                      placeholder="What does this lesson cover?"
                                      onChange={(e) => updateLessonField(mIdx, lIdx, 'description', e.target.value)}
                                      rows={2}
                                      className="w-full text-xs bg-slate-955 border border-slate-850 rounded-lg px-3 py-1.5 text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                                      style={{ backgroundColor: 'var(--color-bg)', borderColor: 'var(--color-border)' }}
                                    />
                                  </div>

                                  {/* Attachments list */}
                                  <div className="space-y-2">
                                    <div className="flex items-center justify-between">
                                      <label className="block text-[9px] font-bold text-slate-500 uppercase">Downloads / Worksheets</label>
                                      <button
                                        type="button"
                                        onClick={() => addAttachment(mIdx, lIdx)}
                                        className="text-[9px] text-indigo-400 hover:text-indigo-300 font-bold flex items-center gap-1 transition"
                                      >
                                        <Plus className="w-3 h-3" />
                                        Add File
                                      </button>
                                    </div>

                                    {(les.attachments || []).map((att: any, aIdx: number) => (
                                      <div key={aIdx} className="flex items-center gap-2 bg-slate-955 p-2 rounded-lg border border-slate-850" style={{ backgroundColor: 'var(--color-bg)', borderColor: 'var(--color-border)' }}>
                                        <input
                                          type="text"
                                          value={att.name || ''}
                                          placeholder="File Name (e.g. Homework Sheet PDF)"
                                          onChange={(e) => updateAttachmentField(mIdx, lIdx, aIdx, 'name', e.target.value)}
                                          className="flex-1 text-[10px] bg-slate-900 border border-slate-800 rounded px-2.5 py-1 text-white focus:outline-none"
                                        />
                                        <input
                                          type="text"
                                          value={att.url || ''}
                                          placeholder="File URL/Link"
                                          onChange={(e) => updateAttachmentField(mIdx, lIdx, aIdx, 'url', e.target.value)}
                                          className="flex-1 text-[10px] bg-slate-900 border border-slate-800 rounded px-2.5 py-1 text-white focus:outline-none font-mono"
                                        />
                                        <button
                                          type="button"
                                          onClick={() => deleteAttachment(mIdx, lIdx, aIdx)}
                                          className="text-red-400 hover:text-red-300 p-1"
                                        >
                                          <X className="w-3.5 h-3.5" />
                                        </button>
                                      </div>
                                    ))}
                                  </div>

                                  {/* Lesson Delete Trigger */}
                                  <div className="flex justify-end pt-1">
                                    <button
                                      type="button"
                                      onClick={() => deleteLesson(mIdx, lIdx)}
                                      className="text-red-400 hover:text-red-300 text-[10px] font-bold flex items-center gap-1 transition px-2.5 py-1 hover:bg-slate-950 rounded-lg border border-transparent hover:border-slate-850"
                                    >
                                      <Trash2 className="w-3.5 h-3.5" />
                                      Remove Lesson
                                    </button>
                                  </div>
                                </div>
                              ))}

                              {/* Add Lesson Trigger */}
                              <button
                                type="button"
                                onClick={() => addLesson(mIdx)}
                                className="w-full py-2 bg-slate-900 hover:bg-slate-850 border border-dashed border-slate-800 text-[10px] font-bold text-slate-450 hover:text-white rounded-xl flex items-center justify-center gap-1 transition"
                              >
                                <Plus className="w-3.5 h-3.5" />
                                Add Lesson
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </>
              )}

              {/* PAYMENT GATEWAY FORM */}
              {modalType === 'gateway' && (
                <>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-450 uppercase mb-2">Gateway Name</label>
                    <input
                      type="text"
                      name="name"
                      defaultValue={editItem?.name || ''}
                      required
                      placeholder="e.g. Stripe Live Account, Test Simulator..."
                      className="w-full text-xs bg-slate-950 border border-slate-850 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-450 uppercase mb-2">Gateway Type</label>
                    <select
                      name="type"
                      defaultValue={editItem?.type || 'stripe'}
                      required
                      className="w-full text-xs bg-slate-950 border border-slate-850 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                      <option value="stripe">Stripe Payments</option>
                      <option value="simulate">Simulated Sandbox Sandbox</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-450 uppercase mb-2">Stripe Secret Key (sk_...)</label>
                    <input
                      type="password"
                      name="stripeSecretKey"
                      defaultValue={editItem?.stripeSecretKey || ''}
                      placeholder="sk_test_..."
                      className="w-full text-xs bg-slate-950 border border-slate-850 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-450 uppercase mb-2">Stripe Publishable Key (pk_...)</label>
                    <input
                      type="text"
                      name="stripePublishableKey"
                      defaultValue={editItem?.stripePublishableKey || ''}
                      placeholder="pk_test_..."
                      className="w-full text-xs bg-slate-950 border border-slate-850 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono"
                    />
                  </div>
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      id="isActive"
                      name="isActive"
                      defaultChecked={editItem ? editItem.isActive : true}
                      className="w-4 h-4 rounded border-slate-850 bg-slate-950 text-indigo-650 focus:ring-indigo-500"
                    />
                    <label htmlFor="isActive" className="text-xs font-bold text-slate-350 select-none">
                      Active Gateway Status
                    </label>
                  </div>
                </>
              )}

              {/* PRODUCT FUNNEL FORM */}
              {modalType === 'funnel' && (
                <>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-450 uppercase mb-2">Funnel Name</label>
                    <input
                      type="text"
                      name="name"
                      defaultValue={editItem?.name || ''}
                      required
                      placeholder="e.g. Perfect Canine Sales Funnel"
                      className="w-full text-xs bg-slate-950 border border-slate-850 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-450 uppercase mb-2">Description</label>
                    <textarea
                      name="description"
                      defaultValue={editItem?.description || ''}
                      placeholder="Purpose of this funnel..."
                      rows={2}
                      className="w-full text-xs bg-slate-950 border border-slate-850 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-450 uppercase mb-2">Primary Front-End Product</label>
                    <select
                      name="primaryProduct"
                      defaultValue={editItem?.primaryProduct?._id || editItem?.primaryProduct || ''}
                      required
                      className="w-full text-xs bg-slate-950 border border-slate-850 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                      <option value="">Select Primary Product...</option>
                      {products.map((prod) => (
                        <option key={prod._id} value={prod._id}>{prod.title} (${prod.price.toFixed(2)})</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-450 uppercase mb-2">Upsell Offer Product</label>
                    <select
                      name="upsellProduct"
                      defaultValue={editItem?.upsellProduct?._id || editItem?.upsellProduct || ''}
                      className="w-full text-xs bg-slate-950 border border-slate-850 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                      <option value="">None (Skip Upsell stage)</option>
                      {products.map((prod) => (
                        <option key={prod._id} value={prod._id}>{prod.title} (${prod.price.toFixed(2)})</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-450 uppercase mb-2">Downsell Offer Product</label>
                    <select
                      name="downsellProduct"
                      defaultValue={editItem?.downsellProduct?._id || editItem?.downsellProduct || ''}
                      className="w-full text-xs bg-slate-950 border border-slate-850 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                      <option value="">None (Skip Downsell stage)</option>
                      {products.map((prod) => (
                        <option key={prod._id} value={prod._id}>{prod.title} (${prod.price.toFixed(2)})</option>
                      ))}
                    </select>
                  </div>
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      id="isActive"
                      name="isActive"
                      defaultChecked={editItem ? editItem.isActive : true}
                      className="w-4 h-4 rounded border-slate-850 bg-slate-950 text-indigo-650 focus:ring-indigo-500"
                    />
                    <label htmlFor="isActive" className="text-xs font-bold text-slate-350 select-none">
                      Active Funnel Flow
                    </label>
                  </div>
                </>
              )}

              {/* AUTHOR FORM */}
              {modalType === 'author' && (
                <>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-450 uppercase mb-2">Full Name</label>
                    <input
                      type="text"
                      name="name"
                      defaultValue={editItem?.name || ''}
                      required
                      placeholder="Author name..."
                      className="w-full text-xs bg-slate-950 border border-slate-850 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-450 uppercase mb-2">Credentials / Title</label>
                    <input
                      type="text"
                      name="credentials"
                      defaultValue={editItem?.credentials || ''}
                      placeholder="e.g. Canine Behaviorist & Author"
                      className="w-full text-xs bg-slate-950 border border-slate-850 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-450 uppercase mb-2">Avatar Initials</label>
                    <input
                      type="text"
                      name="avatarUrl"
                      defaultValue={editItem?.avatarUrl || 'JD'}
                      placeholder="e.g. JD"
                      className="w-full text-xs bg-slate-950 border border-slate-850 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-450 uppercase mb-2">Bio Summary</label>
                    <textarea
                      name="bio"
                      defaultValue={editItem?.bio || ''}
                      placeholder="Brief specialist biography details..."
                      rows={3}
                      className="w-full text-xs bg-slate-950 border border-slate-850 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      id="verificationBadge"
                      name="verificationBadge"
                      defaultChecked={editItem?.verificationBadge || false}
                      className="w-4 h-4 rounded border-slate-850 bg-slate-950 text-indigo-650 focus:ring-indigo-500"
                    />
                    <label htmlFor="verificationBadge" className="text-xs font-bold text-slate-350 select-none">
                      Verified Specialist Badge Active
                    </label>
                  </div>
                </>
              )}

              {/* Action Buttons */}
              <div className="pt-4 border-t border-slate-800 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold py-2.5 px-5 rounded-xl text-xs transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isPending}
                  className="bg-indigo-650 bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-2.5 px-5 rounded-xl text-xs transition flex items-center gap-2 shadow-lg shadow-indigo-600/10"
                >
                  {isPending ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : 'Save Changes'}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {deleteConfirm && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-sm w-full p-8 shadow-2xl space-y-6 text-center relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-red-500/5 rounded-full filter blur-xl"></div>
            
            <div className="w-12 h-12 bg-red-950/40 border border-red-800/40 text-red-400 rounded-full flex items-center justify-center mx-auto">
              <Trash2 className="w-6 h-6 animate-pulse" />
            </div>

            <div className="space-y-2">
              <h3 className="text-base font-black text-white">Delete {deleteConfirm.type.toUpperCase()}?</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Are you absolutely sure? This action is permanent and cannot be undone.
              </p>
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setDeleteConfirm(null)}
                className="flex-1 bg-slate-800 hover:bg-slate-700 text-slate-350 font-bold py-2.5 rounded-xl text-xs transition"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={executeDelete}
                className="flex-1 bg-red-600 hover:bg-red-500 text-white font-bold py-2.5 rounded-xl text-xs transition shadow-lg shadow-red-600/10"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
