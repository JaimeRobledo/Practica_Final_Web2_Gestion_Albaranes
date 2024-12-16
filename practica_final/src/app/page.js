'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    // Redirige automáticamente a la página de login
    const token = localStorage.getItem('jwt');

    if (token) {
      // Si hay un token, redirige a la página principal
      router.push('/webprincipal'); 
    } else {
      // Si no hay token, redirige al login
      router.push('/login');
    }
  }, [router]);

  return null;
}
