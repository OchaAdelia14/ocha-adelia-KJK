'use client';

import React, { Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import {
  CheckCircle2,
  ArrowLeft,
  ShieldCheck,
  Clock,
  Fingerprint,
  Activity,
  Database,
  ExternalLink,
} from 'lucide-react';

function ResultContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session') || 'SES-DEMO-2026';
  const timestamp =
    searchParams.get('time') ||
    new Intl.DateTimeFormat('id-ID', {
      dateStyle: 'full',
      timeStyle: 'medium',
      timeZone: 'Asia/Jakarta',
    }).format(new Date());

  const statusParam = searchParams.get('status');
  const isRecorded = statusParam === 'recorded' || !statusParam;

  return (
    <div className="w-full max-w-lg mx-auto">
      <div className="bg-slate-900/90 backdrop-blur-xl border border-slate-800 rounded-2xl shadow-2xl p-6 sm:p-8 relative overflow-hidden">
        {/* Garis Aksen Gradien Atas */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500" />

        {/* Ikon Sukses & Judul */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-emerald-950/60 border border-emerald-800/60 text-emerald-400 mb-4 shadow-lg shadow-emerald-950/50">
            <CheckCircle2 className="w-9 h-9" />
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            Interaksi Demonstrasi Berhasil!
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1.5 leading-relaxed">
            Terima kasih telah berpartisipasi dalam demonstrasi interaktif ini. Interaksi Anda telah diverifikasi dan dicatat ke dalam sistem log Google Sheets.
          </p>
        </div>

        {/* Ringkasan Metadata Telemetri (Bukan Data Rahasia) */}
        <div className="bg-slate-950/70 border border-slate-800/80 rounded-xl p-4 mb-6 space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800/60 text-xs">
            <span className="text-slate-400 flex items-center gap-1.5">
              <Fingerprint className="w-3.5 h-3.5 text-cyan-400" /> ID Sesi Demonstrasi:
            </span>
            <span className="font-mono font-medium text-cyan-300 bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-800/40">
              {sessionId}
            </span>
          </div>

          <div className="flex items-center justify-between pb-2 border-b border-slate-800/60 text-xs">
            <span className="text-slate-400 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-blue-400" /> Waktu Interaksi:
            </span>
            <span className="font-medium text-slate-200 text-right text-[11px] sm:text-xs">
              {timestamp}
            </span>
          </div>

          <div className="flex items-center justify-between pb-2 border-b border-slate-800/60 text-xs">
            <span className="text-slate-400 flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5 text-indigo-400" /> Jenis Aksi:
            </span>
            <span className="font-medium text-indigo-300">
              Tombol Demonstrasi Ditekan
            </span>
          </div>

          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-400 flex items-center gap-1.5">
              <Database className="w-3.5 h-3.5 text-emerald-400" /> Status Pencatatan:
            </span>
            <span className="inline-flex items-center gap-1 font-semibold text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800/40">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              {isRecorded ? 'Tercatat di Google Sheets' : 'Selesai Diverifikasi'}
            </span>
          </div>
        </div>

        {/* Banner Jaminan Privasi */}
        <div className="mb-6 p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 text-slate-300 text-xs flex items-start gap-2.5">
          <ShieldCheck className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            <strong className="text-emerald-300 font-medium">Kepatuhan Privasi Penuh:</strong>{' '}
            Sistem ini mematuhi standar etika keamanan UTS KJK. Tidak ada kata sandi, OTP, token, ataupun kredensial rahasia yang disimpan atau dikirim.
          </p>
        </div>

        {/* Tombol Navigasi Kembali */}
        <div className="space-y-2.5">
          <Link
            href="/"
            className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 bg-slate-800 hover:bg-slate-700/80 text-white text-sm font-semibold rounded-xl border border-slate-700 transition-all duration-200 active:scale-[0.99]"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Kembali ke Halaman Utama</span>
          </Link>
        </div>

        {/* Footer Card */}
        <div className="mt-6 pt-4 border-t border-slate-800/80 text-center">
          <p className="text-[11px] text-slate-500">
            Proyek Ujian Tengah Semester (UTS) — Keamanan Jaringan & Komputer
          </p>
        </div>
      </div>
    </div>
  );
}

export default function ResultPage() {
  return (
    <main className="min-h-screen relative flex flex-col justify-between p-4 sm:p-6 md:p-8 bg-slate-950 overflow-hidden">
      {/* Latar Belakang Gradien Halus & Grid Dekoratif */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b15_1px,transparent_1px),linear-gradient(to_bottom,#1e293b15_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />
      <div className="absolute top-0 right-1/2 translate-x-1/2 w-[34rem] h-[18rem] bg-emerald-600/10 blur-[130px] rounded-full pointer-events-none" />

      {/* Header Halaman */}
      <header className="relative z-10 w-full max-w-4xl mx-auto flex items-center justify-between py-2 border-b border-slate-800/60 pb-4">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-emerald-400">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <span className="font-semibold text-sm tracking-tight text-white block">
              Sistem Uji KJK
            </span>
            <span className="text-[11px] text-slate-400 block">
              Halaman Konfirmasi Telemetri Interaksi
            </span>
          </div>
        </div>
        <Link
          href="/"
          className="text-xs text-slate-400 hover:text-cyan-300 transition-colors flex items-center gap-1"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Beranda Demo
        </Link>
      </header>

      {/* Bagian Konten Utama dibungkus Suspense */}
      <section className="relative z-10 flex-1 flex flex-col items-center justify-center my-8 sm:my-12">
        <Suspense
          fallback={
            <div className="text-center text-slate-400 text-sm py-12">
              Memuat data konfirmasi interaksi...
            </div>
          }
        >
          <ResultContent />
        </Suspense>
      </section>

      {/* Footer */}
      <footer className="relative z-10 w-full max-w-4xl mx-auto pt-4 border-t border-slate-800/60 text-center text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-2">
        <p>© 2026 Proyek UTS Keamanan Jaringan dan Komputer (KJK).</p>
        <p className="text-slate-400">Pencatatan Telemetri Google Sheets Berhasil</p>
      </footer>
    </main>
  );
}
