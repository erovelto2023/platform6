'use client';

import { useSession } from '@/lib/useSession';
import { ArrowRight, BookOpen, Lock } from 'lucide-react';
import Link from 'next/link';

interface Product {
  _id: string;
  title: string;
  price: number;
  description: string;
}

export default function SidebarCourseCard({ product, accentColor = '#6366f1' }: { product: Product; accentColor?: string }) {
  const { data: session } = useSession();

  const hasAccess = session && (session.user as any).hasAccess?.includes(product._id);

  // Helper to generate gradient from accentColor to darker version
  const gradientStyle = {
    background: `linear-gradient(135deg, ${accentColor}, ${accentColor}dd)`,
    borderColor: `${accentColor}ee`
  };

  return (
    <div 
      className="text-white p-8 rounded-3xl shadow-xl border space-y-6 relative overflow-hidden"
      style={gradientStyle}
    >
      <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 rounded-full filter blur-lg"></div>
      
      <div className="flex justify-between items-center">
        <span className="bg-white/20 text-white text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-md">
          Our Premium Course
        </span>
        {hasAccess && (
          <span className="bg-emerald-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-md flex items-center gap-1">
            Active Student
          </span>
        )}
      </div>

      <div>
        <h3 className="text-2xl font-black tracking-tight text-white">
          {product.title}
        </h3>
        <p className="text-white/80 text-xs leading-relaxed mt-2">
          {product.description}
        </p>
      </div>

      <div className="bg-black/20 rounded-2xl p-4 border border-white/10 flex justify-between items-center">
        <div>
          <span className="text-[10px] block text-white/60 line-through">
            $199.00 USD
          </span>
          <span className="text-2xl font-black text-white">
            ${product.price.toFixed(2)} USD
          </span>
        </div>
        <span className="bg-emerald-500 text-white font-bold text-xs px-2.5 py-1 rounded-md">
          Save 75%
        </span>
      </div>

      {hasAccess ? (
        <Link
          href={`/catalog/${product._id}`}
          className="block text-center w-full bg-emerald-500 hover:bg-emerald-450 text-white font-bold py-3.5 px-4 rounded-xl shadow-md transition tracking-wide text-xs flex items-center justify-center gap-2"
        >
          <BookOpen className="w-4 h-4" /> Enter Student Portal
        </Link>
      ) : (
        <Link
          href={`/checkout?productId=${product._id}`}
          className="block text-center w-full bg-white font-bold py-3.5 px-4 rounded-xl shadow-md transition tracking-wide text-xs flex items-center justify-center gap-1.5"
          style={{ color: accentColor }}
        >
          Enroll in Masterclass Now <ArrowRight className="w-4 h-4" style={{ color: accentColor }} />
        </Link>
      )}

      <div className="text-center space-y-1">
        <span className="block text-[10px] text-white/70">
          🔒 Secure Stripe Checkout &bull; 30 Day Refund Guarantee
        </span>
      </div>
    </div>
  );
}
