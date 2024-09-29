"use client";
import 'pannellum/build/pannellum.css';
import './globals.css';
import { useEffect } from 'react';

export default function RootLayout({ children }) {
  useEffect(() => {
    if (typeof window !== 'undefined') {
      require('pannellum/build/pannellum.js');
    }
  }, []);

  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
