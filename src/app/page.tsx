import LoginForm from '@/components/LoginForm';
import { ShieldCheck, Database, Lock, Laptop, CheckCircle2 } from 'lucide-react';

export default function HomePage() {
  return (
    <main className="min-h-screen relative flex flex-col justify-between p-4 sm:p-6 md:p-8 bg-slate-950 overflow-hidden">
      {/* Latar Belakang Gradien Halus & Grid Dekoratif */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b15_1px,transparent_1px),linear-gradient(to_bottom,#1e293b15_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[36rem] h-[18rem] bg-cyan-600/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[28rem] h-[16rem] bg-indigo-600/10 blur-[140px] rounded-full pointer-events-none" />

      {/* Header Halaman */}
      <header className="relative z-10 w-full max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 py-2 border-b border-slate-800/60 pb-4">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-cyan-400">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <span className="font-semibold text-sm tracking-tight text-white block">
              Sistem Uji KJK
            </span>
            <span className="text-[11px] text-slate-400 block">
              Demo Interaksi & Telemetri Berbasis Cloud
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-medium bg-emerald-950/60 text-emerald-400 border border-emerald-800/60">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
            Sistem Aktif & Terlindungi
          </span>
        </div>
      </header>

      {/* Bagian Konten Utama */}
      <section className="relative z-10 flex-1 flex flex-col items-center justify-center my-8 sm:my-12">
        <div className="w-full max-w-md">
          <LoginForm />

          {/* Indikator Fitur & Kepatuhan Keamanan */}
          <div className="mt-6 grid grid-cols-3 gap-2 text-center">
            <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800/70">
              <Lock className="w-4 h-4 text-cyan-400 mx-auto mb-1" />
              <p className="text-[10px] font-medium text-slate-300">Privasi Terjaga</p>
              <p className="text-[9px] text-slate-500">Nir-Kredensial</p>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800/70">
              <Database className="w-4 h-4 text-blue-400 mx-auto mb-1" />
              <p className="text-[10px] font-medium text-slate-300">Google Sheets</p>
              <p className="text-[9px] text-slate-500">Apps Script Logger</p>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800/70">
              <Laptop className="w-4 h-4 text-indigo-400 mx-auto mb-1" />
              <p className="text-[10px] font-medium text-slate-300">Responsif</p>
              <p className="text-[9px] text-slate-500">Mobile & Desktop</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 w-full max-w-4xl mx-auto pt-4 border-t border-slate-800/60 text-center text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-2">
        <p>© 2026 Proyek UTS Keamanan Jaringan dan Komputer (KJK).</p>
        <p className="flex items-center gap-1.5 text-slate-400">
          <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />
          Deployment Siap Vercel & Terintegrasi Google Cloud
        </p>
      </footer>
    </main>
  );
}
