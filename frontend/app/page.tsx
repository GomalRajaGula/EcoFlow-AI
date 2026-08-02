'use client';

import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';

export default function Home() {
  const { user } = useAuth();
  const targetHref = user ? '/dashboard' : '/login';
  const joinLabel = user ? 'Buka Dasbor' : 'Mulai Sekarang';
  const features = [
    {
      icon: "🤖",
      title: 'Asisten Fermentasi AI',
      description: 'Pemantauan real-time dengan AI untuk prediksi status fermentasi (Normal, Hati-hati, Gagal)'
    },
    {
      icon: "✅",
      title: 'Rekomendasi Produk Cerdas',
      description: 'Rekomendasi produk otomatis berdasarkan karakteristik hasil fermentasi eco-enzyme'
    },
    {
      icon: "📊",
      title: 'Analisis Bisnis',
      description: 'Analisis kelayakan bisnis lengkap: COGS, margin profit, break-even, dan proyeksi pendapatan'
    },
    {
      icon: "📈",
      title: 'Manajemen Batch',
      description: 'Kelola seluruh siklus fermentasi dari pembuatan batch hingga panen dengan pelacakan detail'
    },
    {
      icon: "⚡",
      title: 'Perhitungan Otomatis',
      description: 'Kalkulasi otomatis kebutuhan air & gula, estimasi panen 90 hari, dan skor kesehatan'
    },
    {
      icon: "💡",
      title: 'Wawasan Cerdas',
      description: 'Dasbor komprehensif dengan pelacakan pencapaian dan rekomendasi tindakan preventif'
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-gray-900 selection:bg-green-100 selection:text-green-900">
      
      {/* NAVBAR */}
      <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-gray-100 transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center text-white font-bold text-xl">
                E
              </div>
              <span className="font-bold text-xl tracking-tight text-gray-900">
                EcoFlow
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <Link href={targetHref} className="text-sm font-medium text-gray-600 hover:text-green-600 transition-colors">
                {user ? 'Dasbor' : 'Masuk'}
              </Link>
              <Link href={targetHref} className="text-sm font-medium bg-green-600 text-white px-5 py-2.5 rounded-full shadow-sm hover:bg-green-700 hover:shadow transition-all hover:-translate-y-0.5">
                {joinLabel}
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* HERO SECTION */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
        {/* Background Decorative Elements */}
        <div className="absolute top-0 right-0 -translate-y-12 translate-x-1/3">
          <div className="w-96 h-96 bg-green-100/50 rounded-full blur-3xl" />
        </div>
        <div className="absolute bottom-0 left-0 translate-y-1/3 -translate-x-1/3">
          <div className="w-96 h-96 bg-emerald-100/40 rounded-full blur-3xl" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center">
            {/* Left Content */}
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-50 border border-green-100 text-green-700 text-sm font-medium mb-6">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                </span>
                Tersedia Sekarang v0.1.0
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-gray-900 mb-6 leading-tight">
                Kelola Fermentasi Eco-Enzyme Lebih Cerdas dengan <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-emerald-500">AI</span>
              </h1>
              <p className="text-lg sm:text-xl text-gray-600 mb-8 leading-relaxed">
                Platform inovatif untuk memonitor kesehatan fermentasi, mendapatkan rekomendasi produk turunan, dan menghitung analisis bisnis secara otomatis.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href={targetHref} className="inline-flex justify-center items-center px-6 py-3.5 border border-transparent text-base font-medium rounded-full shadow-sm text-white bg-green-600 hover:bg-green-700 hover:shadow-md hover:-translate-y-0.5 transition-all">
                  {user ? 'Buka Dasbor' : 'Buat Batch Pertamamu'}
                </Link>
                <a href="#fitur" className="inline-flex justify-center items-center px-6 py-3.5 border border-gray-200 text-base font-medium rounded-full text-gray-700 bg-white hover:bg-gray-50 transition-all">
                  Pelajari Fitur
                </a>
              </div>
            </div>

            {/* Right Mockup/Illustration */}
            <div className="relative mx-auto w-full max-w-lg lg:max-w-none">
              <div className="relative rounded-2xl bg-white shadow-2xl border border-gray-100 overflow-hidden transform rotate-2 hover:rotate-0 transition-transform duration-500 ease-out">
                {/* Mockup Top Bar */}
                <div className="bg-gray-50 border-b border-gray-100 px-4 py-3 flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-400" />
                  <div className="w-3 h-3 rounded-full bg-amber-400" />
                  <div className="w-3 h-3 rounded-full bg-green-400" />
                </div>
                {/* Mockup Content */}
                <div className="p-6">
                  <div className="flex justify-between items-center mb-6">
                    <div>
                      <div className="h-2 w-20 bg-gray-200 rounded-full mb-2" />
                      <div className="h-4 w-32 bg-gray-300 rounded-full" />
                    </div>
                    <div className="px-3 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full">
                      SEDANG DIPROSES
                    </div>
                  </div>
                  <div className="space-y-4 mb-6">
                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-gray-500 font-medium">Progres Fermentasi</span>
                        <span className="text-gray-500">Hari 45 dari 90</span>
                      </div>
                      <div className="w-full bg-gray-100 rounded-full h-2">
                        <div className="bg-green-500 h-2 rounded-full w-1/2" />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-gray-50 p-3 rounded-lg border border-gray-100">
                        <div className="text-xs text-gray-500 mb-1">Bahan Baku</div>
                        <div className="font-bold text-gray-900">3.0 kg</div>
                      </div>
                      <div className="bg-gray-50 p-3 rounded-lg border border-gray-100">
                        <div className="text-xs text-gray-500 mb-1">Kebutuhan Air</div>
                        <div className="font-bold text-gray-900">30.0 L</div>
                      </div>
                    </div>
                  </div>
                  <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 flex gap-3">
                    <div className="text-xl">🤖</div>
                    <div>
                      <div className="text-xs font-bold text-blue-900 mb-1">Status AI: Sehat</div>
                      <div className="text-xs text-blue-700">Fermentasi berjalan normal. Lanjutkan pemantauan gas mingguan.</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FITUR SECTION */}
      <section id="fitur" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-base text-green-600 font-semibold tracking-wide uppercase mb-2">Platform Terpadu</h2>
            <h3 className="text-3xl font-bold text-gray-900 sm:text-4xl mb-4">Fitur Utama EcoFlow</h3>
            <p className="text-lg text-gray-600">
              Semua yang Anda butuhkan untuk memproduksi eco-enzyme berkualitas tinggi dengan tingkat keberhasilan maksimal.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, idx) => (
              <Link
                key={idx}
                href={targetHref}
                className="group bg-white border border-gray-100 rounded-2xl p-8 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
              >
                <div className="w-12 h-12 inline-flex items-center justify-center rounded-xl bg-green-50 text-2xl mb-6 shadow-sm border border-green-100">
                  {feature.icon}
                </div>
                <h4 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h4>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
                <span className="inline-flex items-center gap-1 text-sm font-semibold text-green-600 mt-4 opacity-0 group-hover:opacity-100 transition-opacity">
                  {user ? 'Buka di Dasbor' : 'Coba Sekarang'} →
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CARA KERJA SECTION */}
      <section className="py-20 bg-slate-50 border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h3 className="text-3xl font-bold text-gray-900 sm:text-4xl mb-4">Bagaimana Cara Kerjanya?</h3>
            <p className="text-lg text-gray-600">
              4 langkah sederhana dari sampah organik menjadi produk bernilai ekonomis.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12 max-w-5xl mx-auto">
            {[
              { num: '1', title: 'Buat Batch', desc: 'Input berat sampah organik. Sistem otomatis hitung kebutuhan air (3x) & gula (1x).' },
              { num: '2', title: 'Monitor Fermentasi', desc: 'Catat observasi harian. AI memprediksi status & kesehatan batch dari aroma, warna, dan gas.' },
              { num: '3', title: 'Rekomendasi Produk', desc: 'Setelah panen 90 hari, AI merekomendasikan produk turunan terbaik berdasarkan karakteristik hasil.' },
              { num: '4', title: 'Analisis Kelayakan', desc: 'Sistem menghitung COGS, margin, break-even point, dan proyeksi profit bisnis.' }
            ].map((step, idx) => (
              <div key={idx} className="flex gap-6">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 flex items-center justify-center rounded-full bg-green-100 text-green-700 font-bold text-xl border-4 border-white shadow-sm">
                    {step.num}
                  </div>
                </div>
                <div>
                  <h4 className="text-xl font-bold text-gray-900 mb-2">{step.title}</h4>
                  <p className="text-gray-600 leading-relaxed">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA SECTION */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-green-600"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-green-700 to-transparent opacity-90"></div>
        
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
            Mulai Transformasi Sampah Organik Anda Hari Ini
          </h2>
          <p className="text-xl text-green-100 mb-10">
            Bergabunglah dan gunakan AI untuk memastikan keberhasilan panen eco-enzyme Anda.
          </p>
          <Link href={targetHref} className="inline-flex justify-center items-center px-8 py-4 border border-transparent text-lg font-bold rounded-full text-green-700 bg-white hover:bg-gray-50 hover:scale-105 transition-all shadow-lg">
            {user ? 'Buka Dasbor' : 'Daftar Gratis Sekarang'}
          </Link>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-white border-t border-gray-100 pt-12 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded bg-green-600 flex items-center justify-center text-white font-bold text-sm">
                E
              </div>
              <span className="font-bold text-gray-900">EcoFlow AI</span>
            </div>
            
            <div className="flex gap-6 text-sm text-gray-500 font-medium">
              <Link href="/" className="hover:text-green-600 transition-colors">Beranda</Link>
              <Link href={targetHref} className="hover:text-green-600 transition-colors">Dasbor</Link>
              <a
                href="https://github.com/GomalRajaGula/EcoFlow-AI"
                target="_blank"
                rel="noreferrer"
                className="hover:text-green-600 transition-colors"
              >
                GitHub
              </a>
            </div>
          </div>
          
          <div className="mt-8 pt-8 border-t border-gray-100 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-500">
            <p>© {new Date().getFullYear()} EcoFlow AI. Hak Cipta Dilindungi.</p>
            <p>Smart Eco-Enzyme Assistant v0.1.0</p>
          </div>
        </div>
      </footer>
      
    </div>
  );
}
