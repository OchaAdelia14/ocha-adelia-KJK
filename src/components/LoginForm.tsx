'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  ShieldCheck,
  Lock,
  User,
  Eye,
  EyeOff,
  ArrowRight,
  Info,
  Loader2,
  CheckCircle2,
} from 'lucide-react';
import { trackInteraction, getOrCreateSessionId } from '@/lib/tracking';

export default function LoginForm() {
  const router = useRouter();

  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    // Validasi input sederhana di sisi client
    const trimmedId = identifier.trim();
    if (!trimmedId) {
      setErrorMessage('Silakan isi kolom Nama Pengguna / Email Demo terlebih dahulu.');
      return;
    }

    if (trimmedId.length < 3) {
      setErrorMessage('Nama Pengguna / Email Demo minimal terdiri dari 3 karakter.');
      return;
    }

    setIsLoading(true);

    try {
      // Dapatkan atau buat ID sesi acak
      const sessionId = getOrCreateSessionId();

      // CATATAN KEAMANAN KRUSIAL:
      // Hanya kirimkan metadata telemetri (ID sesi, waktu, tipe aksi).
      // Kata sandi & input autentikasi SAMA SEKALI TIDAK disertakan dalam payload!
      const trackingResult = await trackInteraction({
        interactionType: 'tombol_login_demo_ditekan',
        status: 'success',
        customSessionId: sessionId,
      });

      // Navigasikan pengguna ke halaman konfirmasi setelah interaksi berhasil dicatat
      const queryParams = new URLSearchParams({
        session: trackingResult.sessionId,
        time: trackingResult.timestamp,
        status: 'recorded',
      });

      router.push(`/result?${queryParams.toString()}`);
    } catch (err) {
      console.error('Error saat proses demonstrasi:', err);
      // Tetap lanjutkan navigasi agar pengalaman pengguna tidak terhambat
      const sessionId = getOrCreateSessionId();
      router.push(`/result?session=${sessionId}&status=fallback`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      {/* Kartu Utama Form */}
      <div className="bg-slate-900/90 backdrop-blur-xl border border-slate-800 rounded-2xl shadow-2xl p-6 sm:p-8 relative overflow-hidden">
        {/* Ornamen Garis Aksen Atas */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-500" />

        {/* Header Identitas Visual Orisinal */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-cyan-950/60 border border-cyan-800/50 text-cyan-400 mb-3 shadow-inner">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            Portal Demonstrasi KJK
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Simulasi Alur Interaksi Pengguna & Pencatatan Telemetri
          </p>
        </div>

        {/* Banner Edukasi & Privasi (Sesuai Syarat UTS) */}
        <div className="mb-6 p-3.5 rounded-xl bg-cyan-950/40 border border-cyan-900/60 text-cyan-200 text-xs leading-relaxed flex items-start gap-2.5">
          <Info className="w-4 h-4 text-cyan-400 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-cyan-300 mb-0.5">Simulasi Demonstrasi Interaktif</p>
            <p className="text-slate-300">
              Form ini dibuat untuk menguji alur interaksi pengguna. Sesuai prinsip keamanan,{' '}
              <span className="text-cyan-200 font-medium underline decoration-cyan-500">
                kata sandi Anda sama sekali tidak pernah disimpan atau dikirimkan
              </span>.
            </p>
          </div>
        </div>

        {/* Pesan Kesalahan Validasi */}
        {errorMessage && (
          <div className="mb-5 p-3 rounded-xl bg-rose-950/50 border border-rose-800/60 text-rose-300 text-xs flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-rose-400 animate-pulse" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Form Input */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Kolom 1: Identifier */}
          <div>
            <label
              htmlFor="identifier"
              className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5"
            >
              Nama Pengguna / Email Demo
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                <User className="w-4 h-4" />
              </div>
              <input
                id="identifier"
                type="text"
                value={identifier}
                onChange={(e) => {
                  setIdentifier(e.target.value);
                  if (errorMessage) setErrorMessage('');
                }}
                placeholder="misal: demo.user@kampus.ac.id"
                disabled={isLoading}
                className="w-full pl-10 pr-3.5 py-2.5 bg-slate-950/70 border border-slate-700/80 rounded-xl text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500 transition-all disabled:opacity-50"
              />
            </div>
          </div>

          {/* Kolom 2: Password (Hanya untuk simulasi tampilan di client) */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label
                htmlFor="demoPassword"
                className="block text-xs font-semibold uppercase tracking-wider text-slate-300"
              >
                Kata Sandi Simulasi
              </label>
              <span className="text-[10px] text-emerald-400/90 font-medium flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" /> Hanya Tampilan Sisi Klien
              </span>
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                <Lock className="w-4 h-4" />
              </div>
              <input
                id="demoPassword"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                disabled={isLoading}
                className="w-full pl-10 pr-10 py-2.5 bg-slate-950/70 border border-slate-700/80 rounded-xl text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500 transition-all disabled:opacity-50"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                disabled={isLoading}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-500 hover:text-slate-300 focus:outline-none"
                aria-label={showPassword ? 'Sembunyikan kata sandi' : 'Tampilkan kata sandi'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            <p className="mt-1 text-[11px] text-slate-400">
              *TIDAK akan dikirim ke server manapun demi menjaga privasi dan etika keamanan.
            </p>
          </div>

          {/* Tombol Utama Interaksi */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full group relative flex items-center justify-center gap-2 py-3 px-4 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white text-sm font-semibold rounded-xl shadow-lg shadow-cyan-900/30 hover:shadow-cyan-800/50 transition-all duration-200 active:scale-[0.99] disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Mencatat Interaksi Demo...</span>
                </>
              ) : (
                <>
                  <span>Kirim Interaksi Demonstrasi</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </div>
        </form>

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
