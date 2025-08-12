/**
 * Recoil state atoms can cause a larger bundle if imported in multiple components. 
 * This is because each import creates a separate instance of the atom,
 * which can lead to increased bundle size and potential performance issues.
 * And bad Lighthouse score
 * To avoid this, we can import them in a single file and export them from there.
 * and return memoized values to avoid unnecessary re-renders.
 */

'use client';
import { useState, useEffect, useMemo } from 'react';
import { useRecoilState } from 'recoil';
import Cookies from 'js-cookie';
import { userState } from '@/recoil/atoms/userAtom';

export function useUser() {
  const [user, setUser] = useRecoilState(userState);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.requestIdleCallback(() => {
        const savedUserState = Cookies.get('userState');
        if (savedUserState && !user?.uid) {
          try {
            const parsedUser = JSON.parse(savedUserState);
            setUser(parsedUser);
          } catch (error) {
            console.error('Error rehydrating user data:', error);
          }
        }
        setLoading(false);
      });
    }
  }, []);

  return useMemo(() => ({ user, setUser, loading }), [user, setUser, loading]);
  // return { user, setUser, loading };
}
