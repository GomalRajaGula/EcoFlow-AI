'use client';

import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';
import {
  FiCheckCircle,
  FiBarChart2,
  FiLayers,
  FiZap,
  FiArrowRight,
  FiGithub,
  FiActivity,
} from 'react-icons/fi';
import { LuBot, LuLightbulb } from 'react-icons/lu';

export default function Home() {
  const { user } = useAuth();
  const targetHref = user ? '/dashboard' : '/login';
  const joinLabel = user ? 'Buka Dasbor' : 'Mulai Sekarang';

  const features = [
    {
      icon: <LuBot className="h-6 w-6" />,
      title: 'Asisten Fermentasi AI',
      description: 'Pemantauan real-time dengan AI untuk prediksi status fermentasi (Normal, Hati-hati, Gagal).'
    },
    {
      icon: <FiCheckCircle className="h-6 w-6" />,
      title: 'Rekomendasi Produk Cerdas',
      description: 'Rekomendasi produk otomatis berdasarkan karakteristik hasil fermentasi eco-enzyme Anda.'
    },
    {
      icon: <FiBarChart2 className="h-6 w-6" />,
      title: 'Analisis Bisnis',
      description: 'Analisis kelayakan bisnis lengkap: COGS, margin profit, break-even, dan proyeksi pendapatan.'
    },
    {
      icon: <FiLayers className="h-6 w-6" />,
      title: 'Manajemen Batch',
      description: 'Kelola seluruh siklus fermentasi dari pembuatan batch hingga panen dengan pelacakan detail.'
    },
    {
      icon: <FiZap className="h-6 w-6" />,
      title: 'Perhitungan Otomatis',
      description: 'Kalkulasi otomatis kebutuhan air & gula, estimasi panen 90 hari, dan skor kesehatan.'
    },
    {
      icon: <LuLightbulb className="h-6 w-6" />,
      title: 'Wawasan Cerdas',
      description: 'Dasbor komprehensif dengan pelacakan pencapaian dan rekomendasi tindakan preventif.'
    }
  ];

  const steps = [
    { num: '1', title: 'Buat Batch', desc: 'Input berat sampah organik. Sistem otomatis hitung kebutuhan air (3x) & gula (1x).' },
    { num: '2', title: 'Monitor Fermentasi', desc: 'Catat observasi harian. AI memprediksi status & kesehatan batch dari aroma, warna, dan gas.' },
    { num: '3', title: 'Rekomendasi Produk', desc: 'Setelah panen 90 hari, AI merekomendasikan produk turunan terbaik berdasarkan karakteristik hasil.' },
    { num: '4', title: 'Analisis Kelayakan', desc: 'Sistem menghitung COGS, margin, break-even point, dan proyeksi profit bisnis.' }
  ];

  return (
    <div className="min-h-screen bg-[#0B0F17] font-sans text-slate-100 selection:bg-emerald-500/30 selection:text-emerald-100">
      {/* NAVBAR */}
      <header className="fixed top-0 z-50 w-full border-b border-white/5 bg-[#0B0F17]/70 backdrop-blur-md">
        <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-400 to-teal-600 shadow-lg shadow-emerald-500/25">
              <span className="text-lg font-extrabold text-white" aria-hidden="true">E</span>
            </div>
            <span className="text-xl font-bold tracking-tight text-white">
              Eco<span className="bg-gradient-to-r from-emerald-400 to-teal-300 bg-clip-text text-transparent">Flow</span>
            </span>
          </div>

          <div className="hidden items-center gap-8 md:flex">
            {[
              { label: 'Fitur', href: '#fitur' },
              { label: 'Cara Kerja', href: '#cara-kerja' },
              { label: 'GitHub', href: 'https://github.com/GomalRajaGula/EcoFlow-AI', external: true },
            ].map((item) =>
              item.external ? (
                <a
                  key={item.label}
                  href={item.href}
                  target="_blank"
                  rel="noreferrer"
                  className="text-sm font-medium text-slate-400 transition-colors hover:text-emerald-300"
                >
                  {item.label}
                </a>
              ) : (
                <a
                  key={item.label}
                  href={item.href}
                  className="text-sm font-medium text-slate-400 transition-colors hover:text-emerald-300"
                >
                  {item.label}
                </a>
              )
            )}
          </div>

          <div className="flex items-center gap-3">
            <Link
              href={targetHref}
              className="text-sm font-semibold text-slate-300 transition-colors hover:text-emerald-300"
            >
              {user ? 'Dasbor' : 'Masuk'}
            </Link>
            <Link
              href={targetHref}
              className="rounded-full bg-emerald-500 px-5 py-2.5 text-sm font-bold text-[#0B0F17] shadow-[0_0_24px_rgba(16,185,129,0.45)] transition-all hover:-translate-y-0.5 hover:bg-emerald-400 hover:shadow-[0_0_36px_rgba(16,185,129,0.6)]"
            >
              {joinLabel}
            </Link>
          </div>
        </nav>
      </header>

      {/* HERO SECTION */}
      <section className="relative overflow-hidden pb-24 pt-36 lg:pb-36 lg:pt-48">
        {/* Radial glows */}
        <div aria-hidden="true" className="pointer-events-none absolute -top-32 left-1/2 h-[560px] w-[900px] -translate-x-1/2 rounded-full bg-emerald-500/15 blur-[140px]" />
        <div aria-hidden="true" className="pointer-events-none absolute -left-40 top-1/3 h-96 w-96 rounded-full bg-teal-500/10 blur-[120px]" />
        <div aria-hidden="true" className="pointer-events-none absolute -right-40 bottom-0 h-96 w-96 rounded-full bg-emerald-600/10 blur-[120px]" />
        {/* Subtle grid overlay */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-[0.15]"
          style={{
            backgroundImage:
              'linear-gradient(rgba(148,163,184,0.12) 1px, transparent 1px), linear-gradient(90deg, rgba(148,163,184,0.12) 1px, transparent 1px)',
            backgroundSize: '56px 56px',
            maskImage: 'radial-gradient(ellipse 70% 60% at 50% 35%, black, transparent)',
            WebkitMaskImage: 'radial-gradient(ellipse 70% 60% at 50% 35%, black, transparent)',
          }}
        />

        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-sm font-medium text-emerald-300 backdrop-blur">
              <span aria-hidden="true">✨</span>
              Platform Fermentasi Eco-Enzyme Berbasis AI
            </span>

            <h1 className="mt-7 text-4xl font-extrabold leading-[1.1] tracking-tight text-white sm:text-6xl lg:text-7xl">
              Kelola Fermentasi Eco-Enzyme{' '}
              <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-emerald-400 bg-clip-text text-transparent">
                Lebih Cerdas
              </span>{' '}
              dengan AI
            </h1>

            <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-slate-400 sm:text-xl">
              Platform inovatif untuk memonitor kesehatan fermentasi, mendapatkan rekomendasi produk
              turunan, dan menghitung analisis bisnis secara otomatis.
            </p>

            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link
                href={targetHref}
                className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-emerald-500 px-8 py-4 text-base font-bold text-[#0B0F17] shadow-[0_0_40px_rgba(16,185,129,0.5)] transition-all hover:-translate-y-0.5 hover:bg-emerald-400 hover:shadow-[0_0_56px_rgba(16,185,129,0.65)] sm:w-auto"
              >
                {user ? 'Buka Dasbor' : 'Mulai Sekarang'}
                <FiArrowRight className="h-5 w-5" aria-hidden="true" />
              </Link>
              <a
                href="#fitur"
                className="inline-flex w-full items-center justify-center rounded-full border border-white/10 bg-white/5 px-8 py-4 text-base font-semibold text-slate-200 backdrop-blur transition-all hover:border-emerald-500/40 hover:bg-white/10 sm:w-auto"
              >
                Pelajari Fitur
              </a>
            </div>
          </div>

          {/* Floating glassmorphism mockup */}
          <div className="relative mx-auto mt-20 max-w-3xl">
            <div
              aria-hidden="true"
              className="absolute inset-x-8 -top-6 bottom-8 rounded-3xl bg-emerald-500/20 blur-3xl"
            />
            <div className="relative rounded-3xl border border-white/10 bg-white/[0.04] p-6 shadow-2xl shadow-black/50 backdrop-blur-xl sm:p-8">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-rose-400/80" />
                  <div className="h-3 w-3 rounded-full bg-amber-400/80" />
                  <div className="h-3 w-3 rounded-full bg-emerald-400/80" />
                </div>
                <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-400/30 bg-emerald-500/10 px-3 py-1 text-xs font-bold text-emerald-300">
                  <span className="relative flex h-1.5 w-1.5">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                    <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400" />
                  </span>
                  SEDANG DIPROSES
                </span>
              </div>

              <div className="mt-6">
                <div className="flex items-end justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-400">Batch: Sampah Dapur — Juli</p>
                    <p className="mt-1 text-xs text-slate-500">AI Status: <span className="font-semibold text-emerald-400">Sehat</span> · Skor Kesehatan 90.3</p>
                  </div>
                  <p className="text-sm font-bold text-slate-200">Hari 45 dari 90</p>
                </div>
                <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-white/10">
                  <div className="h-2 rounded-full bg-gradient-to-r from-emerald-400 to-teal-400" style={{ width: '50%' }} />
                </div>
              </div>

              <div className="mt-6 grid grid-cols-3 gap-3 sm:gap-4">
                {[
                  { label: 'Bahan Baku', value: '3.0 kg' },
                  { label: 'Kebutuhan Air', value: '30.0 L' },
                  { label: 'Gula', value: '10.0 kg' },
                ].map((stat) => (
                  <div key={stat.label} className="rounded-xl border border-white/10 bg-white/[0.03] p-3 sm:p-4">
                    <p className="text-[11px] font-medium text-slate-500 sm:text-xs">{stat.label}</p>
                    <p className="mt-1 text-base font-extrabold text-white sm:text-xl">{stat.value}</p>
                  </div>
                ))}
              </div>

              <div className="mt-6 flex items-start gap-3 rounded-xl border border-emerald-400/20 bg-emerald-500/[0.06] p-4">
                <LuBot className="mt-0.5 h-5 w-5 shrink-0 text-emerald-400" aria-hidden="true" />
                <div>
                  <p className="text-sm font-bold text-emerald-300">Saran AI</p>
                  <p className="mt-0.5 text-sm text-slate-400">
                    Fermentasi berjalan normal. Lanjutkan pemantauan gas mingguan. Perkiraan panen dalam 45 hari.
                  </p>
                </div>
              </div>
            </div>

            {/* Floating chips */}
            <div className="absolute -right-6 -top-8 hidden rounded-2xl border border-white/10 bg-white/5 px-4 py-3 shadow-xl backdrop-blur-xl lg:block">
              <div className="flex items-center gap-2">
                <FiActivity className="h-4 w-4 text-emerald-400" aria-hidden="true" />
                <span className="text-xs font-bold text-white">CO₂ Dihindari: 5.7 kg</span>
              </div>
            </div>
            <div className="absolute -bottom-8 -left-6 hidden rounded-2xl border border-white/10 bg-white/5 px-4 py-3 shadow-xl backdrop-blur-xl lg:block">
              <div className="flex items-center gap-2">
                <FiCheckCircle className="h-4 w-4 text-teal-300" aria-hidden="true" />
                <span className="text-xs font-bold text-white">8 Produk Direkomendasikan</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES SECTION */}
      <section id="fitur" className="relative py-24 lg:py-32">
        <div aria-hidden="true" className="pointer-events-none absolute left-1/2 top-0 h-72 w-[700px] -translate-x-1/2 rounded-full bg-emerald-500/10 blur-[120px]" />
        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto mb-16 max-w-3xl text-center">
            <p className="mb-3 text-sm font-bold uppercase tracking-[0.2em] text-emerald-400">Platform Terpadu</p>
            <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
              Fitur Utama EcoFlow
            </h2>
            <p className="mt-4 text-lg leading-relaxed text-slate-400">
              Semua yang Anda butuhkan untuk memproduksi eco-enzyme berkualitas tinggi dengan tingkat
              keberhasilan maksimal.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, idx) => (
              <Link
                key={idx}
                href={targetHref}
                className="group rounded-2xl border border-white/10 bg-white/[0.03] p-8 transition-all duration-300 hover:-translate-y-1.5 hover:border-emerald-500/50 hover:bg-white/[0.05] hover:shadow-[0_0_36px_rgba(16,185,129,0.15)]"
              >
                <div className="mb-6 inline-flex h-12 w-12 items-center justify-center rounded-xl border border-emerald-400/20 bg-emerald-500/10 text-emerald-400 transition-colors group-hover:bg-emerald-500/20">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-white">{feature.title}</h3>
                <p className="mt-3 leading-relaxed text-slate-400">{feature.description}</p>
                <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-emerald-400 opacity-0 transition-opacity group-hover:opacity-100">
                  {user ? 'Buka di Dasbor' : 'Coba Sekarang'}
                  <FiArrowRight className="h-4 w-4" aria-hidden="true" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="cara-kerja" className="relative border-t border-white/5 py-24 lg:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto mb-16 max-w-3xl text-center">
            <p className="mb-3 text-sm font-bold uppercase tracking-[0.2em] text-emerald-400">Cara Kerja</p>
            <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
              Dari Sampah Organik Menjadi Produk Bernilai
            </h2>
            <p className="mt-4 text-lg leading-relaxed text-slate-400">
              4 langkah sederhana, didampingi AI di setiap tahap.
            </p>
          </div>

          <div className="grid gap-10 md:grid-cols-4 md:gap-6">
            {steps.map((step, idx) => (
              <div key={idx} className="relative">
                {idx < steps.length - 1 && (
                  <div
                    aria-hidden="true"
                    className="absolute left-16 top-7 hidden h-px w-[calc(100%-4rem)] bg-gradient-to-r from-emerald-500/50 to-transparent md:block"
                  />
                )}
                <div className="relative inline-flex h-14 w-14 items-center justify-center rounded-2xl border border-emerald-400/30 bg-emerald-500/10 text-lg font-extrabold text-emerald-300 shadow-[0_0_24px_rgba(16,185,129,0.2)]">
                  {step.num}
                </div>
                <h3 className="mt-5 text-lg font-bold text-white">{step.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-400">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA BANNER */}
      <section className="px-4 pb-24 sm:px-6 lg:px-8">
        <div className="relative mx-auto max-w-5xl overflow-hidden rounded-3xl border border-emerald-400/20 bg-gradient-to-br from-emerald-600/30 via-teal-600/20 to-[#0B0F17] p-10 text-center shadow-[0_0_80px_rgba(16,185,129,0.15)] sm:p-16">
          <div aria-hidden="true" className="pointer-events-none absolute -left-20 -top-20 h-64 w-64 rounded-full bg-emerald-500/20 blur-3xl" />
          <div aria-hidden="true" className="pointer-events-none absolute -bottom-20 -right-20 h-64 w-64 rounded-full bg-teal-500/20 blur-3xl" />
          <h2 className="relative text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            Mulai Transformasi Sampah Organik Anda Hari Ini
          </h2>
          <p className="relative mx-auto mt-4 max-w-xl text-lg text-emerald-100/80">
            Gunakan AI untuk memastikan keberhasilan panen eco-enzyme Anda. Gratis untuk memulai.
          </p>
          <Link
            href={targetHref}
            className="relative mt-8 inline-flex items-center gap-2 rounded-full bg-emerald-500 px-8 py-4 text-lg font-bold text-[#0B0F17] shadow-[0_0_40px_rgba(16,185,129,0.5)] transition-all hover:-translate-y-0.5 hover:bg-emerald-400 hover:shadow-[0_0_56px_rgba(16,185,129,0.7)]"
          >
            {user ? 'Buka Dasbor' : 'Daftar Gratis Sekarang'}
            <FiArrowRight className="h-5 w-5" aria-hidden="true" />
          </Link>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-white/5 pb-10 pt-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-400 to-teal-600">
                <span className="text-sm font-extrabold text-white" aria-hidden="true">E</span>
              </div>
              <span className="font-bold text-white">EcoFlow AI</span>
            </div>

            <div className="flex gap-8 text-sm font-medium text-slate-400">
              <a href="#fitur" className="transition-colors hover:text-emerald-300">Fitur</a>
              <a href="#cara-kerja" className="transition-colors hover:text-emerald-300">Cara Kerja</a>
              <Link href={targetHref} className="transition-colors hover:text-emerald-300">Dasbor</Link>
              <a
                href="https://github.com/GomalRajaGula/EcoFlow-AI"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 transition-colors hover:text-emerald-300"
              >
                <FiGithub className="h-4 w-4" aria-hidden="true" />
                GitHub
              </a>
            </div>
          </div>

          <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-white/5 pt-8 text-sm text-slate-500 md:flex-row">
            <p>© {new Date().getFullYear()} EcoFlow AI. Hak Cipta Dilindungi.</p>
            <p>Smart Eco-Enzyme Assistant v0.1.0</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
