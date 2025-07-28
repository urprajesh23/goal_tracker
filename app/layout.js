"use client";
import { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import './globals.css';

export default function RootLayout({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  
  useEffect(() => {
    async function checkAuth() {
      if (pathname === '/login' || pathname === '/signup') return;
      const res = await fetch('/api/auth/me');
      if (res.status !== 200) {
        router.replace('/login');
      }
    }
    checkAuth();
  }, [pathname, router]);
  
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="description" content="Professional Goal Tracker - Track, manage, and achieve your goals with ease" />
        <meta name="theme-color" content="#0284c7" />
        <title>Goal Tracker - Professional Goal Management</title>
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body>
        <div id="root">
          {children}
        </div>
      </body>
    </html>
  );
}