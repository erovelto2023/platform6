'use client';

import { useSession } from '@/lib/useSession';
import { useSearchParams, useRouter } from 'next/navigation';
import { useEffect, useState, Suspense } from 'react';
import { CheckCircle2, Loader2, ArrowRight, BookOpen, Star } from 'lucide-react';

function SuccessContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { data: session, update } = useSession();
  const productId = searchParams?.get('productId') || null;
  const simulated = searchParams?.get('simulated') || null;
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // When checkouts complete, we check for funnels and trigger a session update to ensure local next-auth cache is refreshed
  useEffect(() => {
    if (!productId) return;

    // Check if there is an active upsell funnel for this primary product
    fetch(`/api/checkout/funnel-next?productId=${productId}`)
      .then((res) => res.json())
      .then((funnelData) => {
        if (funnelData.hasUpsell) {
          // Redirect to the upsell checkout flow!
          router.push(`/checkout/upsell?funnelId=${funnelData.funnelId}&productId=${funnelData.upsellProductId}&primaryProductId=${productId}${simulated ? '&simulated=true' : ''}`);
        } else {
          // No upsell configured, load product details to show confirmation page
          fetch(`/api/products/${productId}`)
            .then((res) => res.json())
            .then((data) => {
              setProduct(data);
              setLoading(false);
            })
            .catch(() => setLoading(false));
        }
      })
      .catch(() => {
        // Fallback on error
        fetch(`/api/products/${productId}`)
          .then((res) => res.json())
          .then((data) => {
            setProduct(data);
            setLoading(false);
          })
          .catch(() => setLoading(false));
      });

    // Refresh Session access array
    if (session) {
      fetch('/api/auth/session')
        .then((res) => res.json())
        .then((freshSession) => {
          if (freshSession?.user) {
            update({
              ...session,
              user: {
                ...session.user,
                hasAccess: freshSession.user.hasAccess || []
              }
            });
          }
        });
    }
  }, [productId, session, update, router, simulated]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center" style={{ backgroundColor: 'var(--color-bg)', color: 'var(--color-text)' }}>
        <Loader2 className="w-12 h-12 animate-spin mb-4" style={{ color: 'var(--color-primary)' }} />
        <p className="text-sm font-medium" style={{ color: 'var(--color-text-muted)' }}>Verifying Purchase and Activating Licensing...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6" style={{ backgroundColor: 'var(--color-bg)', color: 'var(--color-text)' }}>
      <div className="max-w-md w-full rounded-3xl p-8 text-center shadow-2xl space-y-6 relative overflow-hidden border" style={{ backgroundColor: 'var(--color-surface)', borderColor: 'var(--color-border)' }}>
        <div className="absolute top-0 right-0 w-32 h-32 rounded-full filter blur-xl" style={{ backgroundColor: 'color-mix(in srgb, var(--color-success) 10%, transparent)' }}></div>
        
        <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto shadow-lg border" style={{ backgroundColor: 'color-mix(in srgb, var(--color-success) 25%, transparent)', borderColor: 'color-mix(in srgb, var(--color-success) 30%, transparent)', color: 'var(--color-success)' }}>
          <CheckCircle2 className="w-10 h-10" />
        </div>

        <div className="space-y-2">
          <span className="text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full border" style={{ color: 'var(--color-success)', backgroundColor: 'color-mix(in srgb, var(--color-success) 10%, transparent)', borderColor: 'color-mix(in srgb, var(--color-success) 20%, transparent)' }}>
            {simulated ? 'SIMULATION CONFIRMED' : 'PAYMENT SUCCESSFUL'}
          </span>
          <h1 className="text-3xl font-black mt-3" style={{ color: 'var(--color-text)' }}>Course Unlocked!</h1>
          <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>
            Thank you for purchasing {product?.title || 'our course'}. Your access has been provisioned.
          </p>
        </div>

        <div className="rounded-2xl p-4 border text-left space-y-2 text-xs" style={{ backgroundColor: 'color-mix(in srgb, var(--color-bg) 60%, transparent)', borderColor: 'var(--color-border)' }}>
          <div className="flex justify-between items-center pb-2 mb-2" style={{ color: 'var(--color-text-muted)', borderBottom: '1px solid var(--color-border)' }}>
            <span>Access Type</span>
            <span className="font-bold uppercase" style={{ color: 'var(--color-text)' }}>{product?.type || 'Course'}</span>
          </div>
          <p className="flex items-center gap-1.5" style={{ color: 'var(--color-text-muted)' }}>
            <BookOpen className="w-4 h-4" style={{ color: 'var(--color-primary)' }} /> Lifetime Updates Included
          </p>
          <p className="flex items-center gap-1.5" style={{ color: 'var(--color-text-muted)' }}>
            <Star className="w-4 h-4 fill-amber-400" style={{ color: 'var(--color-accent)' }} /> Exclusive Student Community Access
          </p>
        </div>

        <a
          href={product ? `/courses/${product._id}` : '/hubs'}
          className="block w-full text-white font-bold py-3.5 px-4 rounded-xl transition flex items-center justify-center gap-2 text-sm shadow-lg"
          style={{ backgroundColor: 'var(--color-primary)' }}
        >
          Begin Learning Now <ArrowRight className="w-4 h-4" />
        </a>
      </div>
    </div>
  );
}

export default function SuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex flex-col items-center justify-center" style={{ backgroundColor: 'var(--color-bg)', color: 'var(--color-text)' }}>
        <Loader2 className="w-12 h-12 animate-spin mb-4" style={{ color: 'var(--color-primary)' }} />
        <p className="text-sm font-medium" style={{ color: 'var(--color-text-muted)' }}>Loading Confirmation Screen...</p>
      </div>
    }>
      <SuccessContent />
    </Suspense>
  );
}
