'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function WebPrincipal() {
  const router = useRouter();

  useEffect(() => {
    router.push('/webprincipal/resumen');
  }, [router]);

  return null;
}