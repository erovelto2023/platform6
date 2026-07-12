'use client';

import { useState, useEffect, useCallback } from 'react';
import { useUser } from '@clerk/nextjs';

export function useSession() {
  const { user: clerkUser, isLoaded } = useUser();
  const [session, setSession] = useState<any>(null);
  const [status, setStatus] = useState<'loading' | 'authenticated' | 'unauthenticated'>('loading');

  const fetchSession = useCallback(async () => {
    if (!clerkUser) {
      setSession(null);
      setStatus('unauthenticated');
      return;
    }

    try {
      const response = await fetch('/api/auth/session');
      if (response.ok) {
        const data = await response.json();
        if (data?.user) {
          setSession(data);
          setStatus('authenticated');
        } else {
          setSession(null);
          setStatus('unauthenticated');
        }
      } else {
        setSession(null);
        setStatus('unauthenticated');
      }
    } catch (error) {
      console.error('Error fetching mock session:', error);
      setSession(null);
      setStatus('unauthenticated');
    }
  }, [clerkUser]);

  useEffect(() => {
    if (!isLoaded) {
      setStatus('loading');
      return;
    }
    fetchSession();
  }, [clerkUser, isLoaded, fetchSession]);

  const update = async (newData?: any) => {
    // If the component passes updated values directly, merge them; otherwise refetch
    if (newData?.user) {
      setSession((prev: any) => ({
        ...prev,
        user: {
          ...(prev?.user || {}),
          ...newData.user,
        },
      }));
    } else {
      await fetchSession();
    }
  };

  return {
    data: session,
    status,
    update,
  };
}

export function signIn() {
  // Direct to custom Clerk route or show button (handled at component level)
  window.location.href = '/sign-in';
}

export function signOut() {
  // Redirect to signout
  window.location.href = '/sign-out';
}
