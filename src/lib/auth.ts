'use client';

import { cookies } from 'next/headers';

export function getCurrentUser() {
  if (typeof window === 'undefined') return null;
  
  const cookieStore = cookies();
  const userCookie = cookieStore.get('fanzap_user');
  
  if (!userCookie) return null;
  
  try {
    return JSON.parse(decodeURIComponent(userCookie.value));
  } catch {
    return null;
  }
}

export function getUserId(): string | null {
  const user = getCurrentUser();
  return user?.id || null;
}