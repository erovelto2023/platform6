import { getServerSession } from '@/lib/authOptions';
import { authOptions } from '@/lib/authOptions';
import dbConnect from '@/lib/dbConnect';
import { PillarPage, BlogPost, Glossary, Directory, Product, Author, PaymentGateway, ProductFunnel, SiteTheme } from '@/models';
import AdminDashboard from '@/components/AdminDashboard';
import { DEFAULT_THEME } from '@/lib/theme';
import { Lock, ShieldAlert } from 'lucide-react';
import Link from 'next/link';

export default async function AdminPage() {
  await dbConnect();
  
  const session = await getServerSession(authOptions);
  
  // Gate dashboard to admin accounts only
  if (!session || (session.user as any).role !== 'admin') {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-3xl p-8 text-center shadow-2xl space-y-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/5 rounded-full filter blur-xl"></div>
          
          <div className="w-16 h-16 bg-slate-800/80 border border-slate-700 text-red-400 rounded-full flex items-center justify-center mx-auto">
            <Lock className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <span className="text-[10px] font-black uppercase tracking-widest text-red-400 bg-red-500/10 px-3 py-1 rounded-full border border-red-500/20">
              Access Restricted
            </span>
            <h1 className="text-2xl font-black text-white mt-3">Admin Portal Locked</h1>
            <p className="text-sm text-slate-400">
              {session 
                ? 'Your active session role is not authorized to access administrative controls.' 
                : 'Authentication is required to log in and inspect the developer database dashboard.'}
            </p>
          </div>

          <div className="pt-2 flex flex-col gap-3">
            {session ? (
              <Link
                href="/api/auth/signout?callbackUrl=/"
                className="block text-center w-full bg-red-950/60 hover:bg-red-900/60 text-red-400 font-bold py-3.5 px-4 rounded-xl transition text-xs border border-red-900"
              >
                Sign Out & Switch Accounts
              </Link>
            ) : (
              <Link
                href="/login?callbackUrl=/admin"
                className="block text-center w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3.5 px-4 rounded-xl transition text-xs shadow-lg shadow-indigo-600/15"
              >
                Sign In to Admin Account
              </Link>
            )}
            <Link
              href="/"
              className="text-xs text-slate-500 hover:underline transition"
            >
              Return to Landing Page
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Fetch all collections on the server side
  const rawPillars = await PillarPage.find().populate('author').populate('primaryProduct');
  const rawPosts = await BlogPost.find();
  const rawGlossary = await Glossary.find().sort({ term: 1 });
  const rawDirectory = await Directory.find().sort({ rating: -1 });
  const rawProducts = await Product.find().populate('gatewayId');
  const rawAuthors = await Author.find();
  const rawGateways = await PaymentGateway.find();
  const rawFunnels = await ProductFunnel.find()
    .populate('primaryProduct')
    .populate('upsellProduct')
    .populate('downsellProduct');
  const rawTheme = await SiteTheme.findOne({ isDefault: true }).lean() as any;

  // Helper function to serialize Mongo records safely for client rendering
  const serialize = (doc: any) => {
    const plain = doc.toObject ? doc.toObject() : doc;
    return JSON.parse(JSON.stringify(plain));
  };

  const pillars = rawPillars.map(serialize);
  const posts = rawPosts.map(serialize);
  const glossary = rawGlossary.map(serialize);
  const directory = rawDirectory.map(serialize);
  const products = rawProducts.map(serialize);
  const authors = rawAuthors.map(serialize);
  const gateways = rawGateways.map(serialize);
  const funnels = rawFunnels.map(serialize);
  const theme = rawTheme ? { ...DEFAULT_THEME, ...serialize(rawTheme) } : DEFAULT_THEME;

  return (
    <AdminDashboard
      pillars={pillars}
      posts={posts}
      glossary={glossary}
      directory={directory}
      products={products}
      authors={authors}
      gateways={gateways}
      funnels={funnels}
      theme={theme}
    />
  );
}
