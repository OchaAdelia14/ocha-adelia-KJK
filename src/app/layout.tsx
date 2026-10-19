import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Demo Interaktif KJK - Simulasi & Telemetri Sesi',
  description:
    'Website demonstrasi interaktif sederhana untuk pengujian alur interaksi pengguna dan pencatatan telemetri ke Google Sheets.',
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" className="dark">
      <body className="bg-slate-950 text-slate-100 min-h-screen antialiased selection:bg-cyan-500 selection:text-white">
        {children}
      </body>
    </html>
  );
}
