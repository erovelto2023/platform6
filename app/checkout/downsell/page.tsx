'use client';

import { useSession } from '@/lib/useSession';
import { useSearchParams, useRouter } from 'next/navigation';
import { useEffect, useState, Suspense } from 'react';
import { Sparkles, ArrowRight, Loader2, ShieldCheck, CheckCircle2, ChevronRight, X } from 'lucide-react';

function DownsellContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { data: session } = useSession();

  const funnelId = searchParams?.get('funnelId') || null;
  const productId = searchParams?.get('productId') || null;
  const primaryProductId = searchParams?.get('primaryProductId') || null;
  const simulated = searchParams?.get('simulated') === 'true';

  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [checkoutError, setCheckoutError] = useState<string | null>(null);

  // Load downsell product details
  useEffect(() => {
    if (!productId) return;
    setLoading(true);
    fetch(`/api/products/${productId}`)
      .then((res) => {
        if (!res.ok) throw new Error('Product not found');
        return res.json();
      })
      .then((data) => {
        setProduct(data);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, [productId]);

  const handleAcceptOffer = async () => {
    if (!product) return;
    setCheckoutLoading(true);
    setCheckoutError(null);

    try {
      if (simulated || (product.gatewayId && product.gatewayId.type === 'simulate')) {
        // Simulated checkout
        const response = await fetch('/api/checkout/simulate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ productId: product._id }),
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || 'Simulated checkout failed');

        // Redirect to success
        router.push(`/checkout/success?productId=${primaryProductId}&simulated=true`);
      } else {
        // Stripe checkout
        const response = await fetch('/api/checkout/session', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ productId: product._id }),
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || 'Stripe checkout failed');

        if (data.url) {
          window.location.href = data.url;
        } else {
          throw new Error('Stripe redirect URL not returned');
        }
      }
    } catch (err: any) {
      setCheckoutLoading(false);
      setCheckoutError(err.message || 'Payment failed');
    }
  };

  const handleDeclineOffer = () => {
    // Go straight to success for the primary product
    router.push(`/checkout/success?productId=${primaryProductId}${simulated ? '&simulated=true' : ''}`);
  };

  if (!productId || !funnelId) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6" style={{ backgroundColor: 'var(--color-bg)', color: 'var(--color-text)' }}>
        <div className="max-w-md w-full rounded-3xl p-8 text-center space-y-4 shadow-2xl border" style={{ backgroundColor: 'var(--color-surface)', borderColor: 'var(--color-border)' }}>
          <h2 className="text-xl font-bold" style={{ color: 'var(--color-danger)' }}>Offer Error</h2>
          <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>No active promotional funnel was found.</p>
          <a href="/" className="inline-block text-white font-bold py-2.5 px-6 rounded-xl transition text-sm" style={{ backgroundColor: 'var(--color-primary)' }}>
            Go to Homepage
          </a>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center" style={{ backgroundColor: 'var(--color-bg)', color: 'var(--color-text)' }}>
        <Loader2 className="w-12 h-12 animate-spin mb-4" style={{ color: 'var(--downsell-btn)' }} />
        <p className="text-sm font-medium" style={{ color: 'var(--color-text-muted)' }}>Preparing Your Custom Starter Offer...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6" style={{ backgroundColor: 'var(--color-bg)', color: 'var(--color-text)' }}>
        <div className="max-w-md w-full rounded-3xl p-8 text-center space-y-4 shadow-2xl border" style={{ backgroundColor: 'var(--color-surface)', borderColor: 'var(--color-border)' }}>
          <h2 className="text-xl font-bold" style={{ color: 'var(--color-danger)' }}>Starter Offer Missing</h2>
          <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>The downsell item is no longer available.</p>
          <button
            onClick={() => router.push(`/checkout/success?productId=${primaryProductId}${simulated ? '&simulated=true' : ''}`)}
            className="w-full text-white font-bold py-2.5 px-6 rounded-xl transition text-sm"
            style={{ backgroundColor: 'var(--color-primary)' }}
          >
            Show My Receipt
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 flex flex-col justify-center items-center" style={{ backgroundColor: 'var(--color-bg)', color: 'var(--color-text)' }}>
      {/* Funnel Progress Indicator */}
      <div className="max-w-xl w-full mb-8">
        <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider mb-2" style={{ color: 'var(--color-text-muted)' }}>
          <span>1. Core Purchase ✓</span>
          <span style={{ color: 'var(--downsell-btn)' }}>2. Special Offer (Active)</span>
          <span>3. Receipt</span>
        </div>
        <div className="w-full h-1.5 rounded-full overflow-hidden border" style={{ backgroundColor: 'var(--color-surface)', borderColor: 'var(--color-border)' }}>
          <div className="w-2/3 h-full" style={{ background: `linear-gradient(to right, var(--color-primary), var(--downsell-btn))` }}></div>
        </div>
      </div>

      <div className="max-w-3xl w-full rounded-3xl overflow-hidden shadow-2xl relative border" style={{ backgroundColor: 'var(--color-surface)', borderColor: 'var(--color-border)' }}>
        <div className="absolute top-0 right-0 w-64 h-64 rounded-full filter blur-3xl" style={{ backgroundColor: 'color-mix(in srgb, var(--downsell-btn) 10%, transparent)' }}></div>
        
        {/* Banner Alert */}
        <div className="p-4 text-center flex items-center justify-center gap-2" style={{ background: `linear-gradient(to right, color-mix(in srgb, var(--downsell-banner) 40%, transparent), color-mix(in srgb, var(--downsell-banner) 60%, transparent))`, borderBottom: '1px solid color-mix(in srgb, var(--downsell-btn) 30%, transparent)' }}>
          <Sparkles className="w-4 h-4 animate-pulse" style={{ color: 'var(--downsell-btn)' }} />
          <span className="text-xs sm:text-sm font-black uppercase tracking-widest" style={{ color: 'var(--color-text)' }}>
            Wait! Let&apos;s make this a no-brainer for you
          </span>
        </div>

        <div className="p-8 sm:p-12 space-y-8">
          <div className="text-center space-y-3">
            <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-none">
              Get the Starter Edition Instead
            </h1>
            <p className="text-slate-400 text-sm max-w-xl mx-auto">
              If the full masterclass was too much, grab the <span className="text-white font-bold">{product.title}</span> today to get up and running at a fraction of the cost.
            </p>
          </div>

          {/* Offer Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-950/80 rounded-2xl p-6 border border-slate-850">
            <div className="space-y-4">
              <h3 className="text-xs text-indigo-400 font-extrabold uppercase tracking-widest flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-indigo-400" /> Starter Pack Features:
              </h3>
              <ul className="text-xs text-slate-300 space-y-2.5">
                <li className="flex gap-2 items-start">
                  <ChevronRight className="w-3.5 h-3.5 text-indigo-500 shrink-0 mt-0.5" />
                  <span>Essential core lesson guides (PDF Format)</span>
                </li>
                <li className="flex gap-2 items-start">
                  <ChevronRight className="w-3.5 h-3.5 text-indigo-500 shrink-0 mt-0.5" />
                  <span>Printable checklists and quick references</span>
                </li>
                <li className="flex gap-2 items-start">
                  <ChevronRight className="w-3.5 h-3.5 text-indigo-500 shrink-0 mt-0.5" />
                  <span>Lifetime product updates included</span>
                </li>
              </ul>
            </div>

            <div className="border-t md:border-t-0 md:border-l border-slate-800 pt-6 md:pt-0 md:pl-6 flex flex-col justify-center items-center md:items-end space-y-2 text-center md:text-right">
              <span className="text-xs text-slate-450 line-through font-bold">Standard Value: ${(product.price * 2).toFixed(2)}</span>
              <div className="space-y-1">
                <span className="text-[10px] bg-indigo-500/15 border border-indigo-500/35 text-indigo-400 px-2 py-0.5 rounded font-black tracking-widest uppercase block md:inline-block">SPECIAL DOWNSELL DISCOUNT</span>
                <div className="text-4xl font-black text-white mt-1">${product.price.toFixed(2)} USD</div>
              </div>
              <p className="text-[10px] text-slate-450">One-time developer sandbox pricing.</p>
            </div>
          </div>

          {/* Form Actions */}
          <div className="space-y-4">
            {checkoutError && (
              <div className="p-3 bg-red-950/40 border border-red-800/40 rounded-xl text-red-300 text-xs text-center">
                {checkoutError}
              </div>
            )}

            <button
              onClick={handleAcceptOffer}
              disabled={checkoutLoading}
              className="w-full text-white font-extrabold py-4 px-6 rounded-2xl transition flex items-center justify-center gap-2 text-sm shadow-xl"
              style={{ backgroundColor: 'var(--downsell-btn)' }}
            >
              {checkoutLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>Yes! Add {product.title} to My Order <ArrowRight className="w-4 h-4" /></>
              )}
            </button>

            <button
              onClick={handleDeclineOffer}
              disabled={checkoutLoading}
              className="w-full py-3 text-slate-500 hover:text-slate-350 text-xs font-bold transition flex items-center justify-center gap-1"
            >
              <X className="w-3.5 h-3.5" /> No thanks, skip this option too
            </button>
          </div>
        </div>

        {/* EEAT Seal */}
        <div className="bg-slate-950/40 border-t border-slate-850 p-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-450">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-indigo-400" />
            <span>Guaranteed Secure Payments powered by your Gateway configuration.</span>
          </div>
          <span>30-Day Refund Guarantee Applies</span>
        </div>
      </div>
    </div>
  );
}

export default function DownsellPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex flex-col items-center justify-center" style={{ backgroundColor: 'var(--color-bg)', color: 'var(--color-text)' }}>
        <Loader2 className="w-12 h-12 animate-spin mb-4" style={{ color: 'var(--downsell-btn)' }} />
        <p className="text-sm font-medium" style={{ color: 'var(--color-text-muted)' }}>Loading Offer...</p>
      </div>
    }>
      <DownsellContent />
    </Suspense>
  );
}
