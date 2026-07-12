'use client';

import { useSession, signOut } from '@/lib/useSession';
import { useSearchParams, useRouter } from 'next/navigation';
import { useEffect, useState, Suspense } from 'react';
import { CreditCard, ShieldCheck, CheckCircle2, Lock, ArrowRight, Loader2 } from 'lucide-react';
import { SignInButton, SignUpButton } from '@clerk/nextjs';

function CheckoutContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { data: session, status } = useSession();
  
  const productId = searchParams?.get('productId') || null;
  const [product, setProduct] = useState<any>(null);
  const [loadingProduct, setLoadingProduct] = useState(true);

  // Checkout loading/errors
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [checkoutError, setCheckoutError] = useState<string | null>(null);

  // Load product details
  useEffect(() => {
    if (!productId) return;
    
    setLoadingProduct(true);
    fetch(`/api/products/${productId}`)
      .then((res) => {
        if (!res.ok) throw new Error('Product not found');
        return res.json();
      })
      .then((data) => {
        setProduct(data);
        setLoadingProduct(false);
      })
      .catch(() => {
        setLoadingProduct(false);
      });
  }, [productId]);

  const handleStripeCheckout = async () => {
    if (!product) return;
    setCheckoutLoading(true);
    setCheckoutError(null);

    try {
      const response = await fetch('/api/checkout/session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId: product._id }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Checkout session failed');
      }

      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error('Stripe redirect URL was not returned.');
      }
    } catch (err: any) {
      setCheckoutLoading(false);
      setCheckoutError(err.message || 'Payment initiation failed');
    }
  };

  const handleSimulatedCheckout = async () => {
    if (!product) return;
    setCheckoutLoading(true);
    setCheckoutError(null);

    try {
      const response = await fetch('/api/checkout/simulate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId: product._id }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Simulated checkout failed');
      }

      // Redirect to the success screen
      router.push(`/checkout/success?productId=${product._id}&simulated=true`);
    } catch (err: any) {
      setCheckoutLoading(false);
      setCheckoutError(err.message || 'Simulated checkout failed');
    }
  };

  if (!productId) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6" style={{ backgroundColor: 'var(--checkout-bg)', color: 'var(--color-text)' }}>
        <div className="max-w-md w-full rounded-2xl p-8 border text-center space-y-4" style={{ backgroundColor: 'var(--checkout-card)', borderColor: 'var(--color-border)' }}>
          <h2 className="text-xl font-bold" style={{ color: 'var(--color-danger)' }}>Checkout Error</h2>
          <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>No product ID has been specified. Please navigate back to a hub page to purchase resources.</p>
          <a href="/hubs" className="inline-block text-white font-bold py-2.5 px-6 rounded-xl transition text-sm" style={{ backgroundColor: 'var(--checkout-btn)' }}>
            Browse Content Hubs
          </a>
        </div>
      </div>
    );
  }

  if (loadingProduct) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center" style={{ backgroundColor: 'var(--checkout-bg)', color: 'var(--color-text)' }}>
        <Loader2 className="w-12 h-12 animate-spin mb-4" style={{ color: 'var(--checkout-btn)' }} />
        <p className="text-sm font-medium" style={{ color: 'var(--color-text-muted)' }}>Retrieving Order Details...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6" style={{ backgroundColor: 'var(--checkout-bg)', color: 'var(--color-text)' }}>
        <div className="max-w-md w-full rounded-2xl p-8 border text-center space-y-4" style={{ backgroundColor: 'var(--checkout-card)', borderColor: 'var(--color-border)' }}>
          <h2 className="text-xl font-bold" style={{ color: 'var(--color-danger)' }}>Product Not Found</h2>
          <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>The product you are trying to purchase does not exist or has been removed.</p>
          <a href="/hubs" className="inline-block text-white font-bold py-2.5 px-6 rounded-xl transition text-sm" style={{ backgroundColor: 'var(--checkout-btn)' }}>
            Browse Content Hubs
          </a>
        </div>
      </div>
    );
  }

  const isPurchased = session?.user?.hasAccess?.includes(product._id);

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8" style={{ backgroundColor: 'var(--checkout-bg)', color: 'var(--color-text)' }}>
      <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
        
        {/* Left Column: Product Summary */}
        <div className="space-y-8">
          <div className="rounded-3xl p-8 shadow-xl relative overflow-hidden border" style={{ backgroundColor: 'var(--checkout-card)', borderColor: 'var(--color-border)' }}>
            <div className="absolute top-0 right-0 w-32 h-32 rounded-full filter blur-xl" style={{ backgroundColor: 'color-mix(in srgb, var(--checkout-btn) 10%, transparent)' }}></div>
            <span className="text-[10px] font-extrabold uppercase tracking-widest px-3 py-1 rounded-md border" style={{ backgroundColor: 'color-mix(in srgb, var(--checkout-btn) 20%, transparent)', color: 'var(--checkout-btn)', borderColor: 'color-mix(in srgb, var(--checkout-btn) 30%, transparent)' }}>
              Confirming Order
            </span>
            <h2 className="text-3xl font-black mt-4 mb-2 tracking-tight" style={{ color: 'var(--color-text)' }}>
              {product.title}
            </h2>
            <p className="text-sm leading-relaxed mb-6" style={{ color: 'var(--color-text-muted)' }}>
              {product.description}
            </p>

            <div className="rounded-2xl p-5 flex items-center justify-between border" style={{ backgroundColor: 'color-mix(in srgb, var(--color-bg) 60%, transparent)', borderColor: 'var(--color-border)' }}>
              <div>
                <span className="text-xs block uppercase font-bold tracking-wider" style={{ color: 'var(--color-text-muted)' }}>Subtotal</span>
                <span className="text-3xl font-black" style={{ color: 'var(--color-text)' }}>${product.price.toFixed(2)} USD</span>
              </div>
              <span className="text-xs font-bold px-3 py-1 rounded-full border" style={{ color: 'var(--color-success)', backgroundColor: 'color-mix(in srgb, var(--color-success) 10%, transparent)', borderColor: 'color-mix(in srgb, var(--color-success) 20%, transparent)' }}>
                Guaranteed Access
              </span>
            </div>
          </div>

          {/* E-E-A-T Guarantee Elements */}
          <div className="space-y-4">
            <div className="flex gap-4 items-start p-4 rounded-2xl border" style={{ backgroundColor: 'color-mix(in srgb, var(--checkout-card) 40%, transparent)', borderColor: 'var(--color-border)' }}>
              <ShieldCheck className="w-6 h-6 shrink-0 mt-0.5" style={{ color: 'var(--checkout-btn)' }} />
              <div>
                <h4 className="text-sm font-bold" style={{ color: 'var(--color-text)' }}>Secure Billing System</h4>
                <p className="text-xs mt-0.5" style={{ color: 'var(--color-text-muted)' }}>Your checkout session is encrypted end-to-end. We never collect or store your card number details.</p>
              </div>
            </div>
            <div className="flex gap-4 items-start p-4 rounded-2xl border" style={{ backgroundColor: 'color-mix(in srgb, var(--checkout-card) 40%, transparent)', borderColor: 'var(--color-border)' }}>
              <CheckCircle2 className="w-6 h-6 shrink-0 mt-0.5" style={{ color: 'var(--color-success)' }} />
              <div>
                <h4 className="text-sm font-bold" style={{ color: 'var(--color-text)' }}>100% Satisfaction Guarantee</h4>
                <p className="text-xs mt-0.5" style={{ color: 'var(--color-text-muted)' }}>Backed by a 30-day money-back guarantee. If you are not completely satisfied, email support for a full refund.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Checkout forms / actions */}
        <div className="space-y-6">
          {isPurchased ? (
            <div className="bg-emerald-950/30 border border-emerald-800/50 rounded-3xl p-8 shadow-xl text-center space-y-6">
              <div className="w-16 h-16 bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <div className="space-y-2">
                <h3 className="text-2xl font-bold text-white">Already Owned</h3>
                <p className="text-sm text-slate-350">
                  You already own access to this product. Head straight to the course viewer to begin your curriculum.
                </p>
              </div>
              <a
                href={`/courses/${product._id}`}
                className="block text-center w-full bg-emerald-500 hover:bg-emerald-450 text-white font-bold py-3.5 px-4 rounded-2xl transition tracking-wide text-sm"
              >
                Go to Gated Course Content
              </a>
            </div>
          ) : status !== 'authenticated' ? (
            /* Clerk Sign In / Sign Up Trigger Card */
            <div className="rounded-3xl shadow-xl border p-8 space-y-6 text-center" style={{ backgroundColor: 'var(--checkout-card)', borderColor: 'var(--color-border)' }}>
              <div className="w-16 h-16 bg-slate-800/80 border border-slate-700 text-indigo-400 rounded-full flex items-center justify-center mx-auto">
                <Lock className="w-8 h-8" />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-bold text-white">Authentication Required</h3>
                <p className="text-xs text-slate-400">
                  Please sign in or create a student account to secure your digital course license.
                </p>
              </div>

              <div className="pt-2 flex flex-col gap-3">
                <SignInButton mode="modal" forceRedirectUrl={typeof window !== 'undefined' ? window.location.href : undefined}>
                  <button className="w-full text-white font-bold py-3.5 px-4 rounded-xl transition flex items-center justify-center gap-2 text-sm shadow-md cursor-pointer" style={{ backgroundColor: 'var(--checkout-btn)' }}>
                    Sign In to Your Account
                  </button>
                </SignInButton>

                <SignUpButton mode="modal" forceRedirectUrl={typeof window !== 'undefined' ? window.location.href : undefined}>
                  <button className="w-full text-slate-350 hover:text-white font-bold py-3.5 px-4 rounded-xl transition flex items-center justify-center gap-2 text-sm border border-slate-800 bg-slate-900 hover:bg-slate-850 cursor-pointer">
                    Create a New Student Account
                  </button>
                </SignUpButton>
              </div>
            </div>
          ) : (
            /* Logged in checkout options */
            <div className="rounded-3xl p-8 shadow-xl space-y-6 border" style={{ backgroundColor: 'var(--checkout-card)', borderColor: 'var(--color-border)' }}>
              <div className="flex items-center justify-between pb-4" style={{ borderBottom: '1px solid var(--color-border)' }}>
                <div>
                  <span className="text-xs text-slate-500 block uppercase font-bold tracking-wider">Account Active</span>
                  <span className="text-sm font-bold text-white">{session?.user?.name || session?.user?.email}</span>
                </div>
                <button
                  onClick={() => signOut()}
                  className="text-xs text-red-400 hover:underline hover:text-red-350 cursor-pointer"
                >
                  Log Out
                </button>
              </div>

              <div className="space-y-4">
                {/* 1. Simulated Checkout */}
                {(!product.gatewayId || product.gatewayId.type === 'simulate') && (
                  <div className="p-5 bg-indigo-950/20 border border-indigo-850/50 rounded-2xl space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-bold text-indigo-400 uppercase tracking-wide">
                        {product.gatewayId ? 'Assigned Payment Gateway' : 'Option A (Sandbox Simulation)'}
                      </span>
                      <span className="text-[10px] font-mono text-indigo-300 bg-indigo-500/10 border border-indigo-500/20 px-2 py-0.5 rounded">
                        {product.gatewayId ? product.gatewayId.name : 'Fast Dev Testing'}
                      </span>
                    </div>
                    <h4 className="font-bold text-white text-sm">Simulate Instant Sandbox Payment</h4>
                    <p className="text-xs text-slate-450 leading-relaxed">
                      Instantly unlock course content on localhost by bypassing real transaction networks. Perfect for immediate interface and gating tests.
                    </p>
                    <button
                      onClick={handleSimulatedCheckout}
                      disabled={checkoutLoading}
                      className="w-full bg-slate-800 hover:bg-slate-750 text-white font-bold py-3 px-4 rounded-xl border border-slate-700 transition flex items-center justify-center gap-2 text-xs cursor-pointer"
                    >
                      {checkoutLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <>⚡ Unlock Content Instantly</>}
                    </button>
                  </div>
                )}

                {/* 2. Stripe Checkout */}
                {(!product.gatewayId || product.gatewayId.type === 'stripe') && (
                  <div className="p-5 bg-slate-950/60 border border-slate-850 rounded-2xl space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-bold text-slate-400 uppercase tracking-wide">
                        {product.gatewayId ? 'Assigned Payment Gateway' : 'Option B (Live Gateways)'}
                      </span>
                      <span className="text-[10px] font-mono text-slate-400 bg-slate-900 border border-slate-800 px-2 py-0.5 rounded">
                        {product.gatewayId ? product.gatewayId.name : 'Credit Card'}
                      </span>
                    </div>
                    <h4 className="font-bold text-white text-sm">Stripe Hosted Checkout</h4>
                    <p className="text-xs text-slate-450 leading-relaxed">
                      Initiate real/test transactions via the official Stripe card checkout forms. Requires Stripe keys.
                    </p>
                    <button
                      onClick={handleStripeCheckout}
                      disabled={checkoutLoading}
                      className="w-full text-white font-bold py-3 px-4 rounded-xl transition flex items-center justify-center gap-2 text-xs shadow-md cursor-pointer"
                      style={{ backgroundColor: 'var(--checkout-btn)' }}
                    >
                      {checkoutLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <><CreditCard className="w-4 h-4" /> Redirect to Stripe Checkout</>}
                    </button>
                  </div>
                )}
              </div>

              {checkoutError && (
                <div className="p-3 bg-red-950/40 border border-red-800/40 rounded-xl text-red-300 text-xs">
                  <span className="font-bold">Checkout Error:</span> {checkoutError}
                </div>
              )}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex flex-col items-center justify-center" style={{ backgroundColor: 'var(--checkout-bg)', color: 'var(--color-text)' }}>
        <Loader2 className="w-12 h-12 animate-spin mb-4" style={{ color: 'var(--checkout-btn)' }} />
        <p className="text-sm font-medium" style={{ color: 'var(--color-text-muted)' }}>Initializing Checkout Components...</p>
      </div>
    }>
      <CheckoutContent />
    </Suspense>
  );
}
