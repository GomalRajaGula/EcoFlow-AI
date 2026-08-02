'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import apiClient from '@/lib/api';
import CreateBatchModal from '@/components/CreateBatchModal';
import BatchCard from '@/components/BatchCard';
import FermentationLogModal from '@/components/FermentationLogModal';
import ProductRecommendationModal from '@/components/ProductRecommendationModal';
import BusinessAnalysisModal from '@/components/BusinessAnalysisModal';
import RoadmapModal from '@/components/RoadmapModal';
import { subscribeToOnlineSync, syncPendingFermentationLogs } from '@/lib/offline-queue';

interface Batch {
  id: number;
  name: string;
  status: string;
  waste_weight_kg: number;
  water_liters: number;
  sugar_kg: number;
  selected_product_id: number | null;
  start_date: string;
  harvest_date: string;
  created_at: string;
}

async function loadBatches(): Promise<Batch[]> {
  const response = await apiClient.get('/api/v1/batches');
  return response.data.data.batches || [];
}

export default function DashboardPage() {
  const [batches, setBatches] = useState<Batch[]>([]);
  const [loadingBatches, setLoadingBatches] = useState(true);
  const [selectedBatch, setSelectedBatch] = useState<Batch | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showLogModal, setShowLogModal] = useState(false);
  const [showRecommendationModal, setShowRecommendationModal] = useState(false);
  const [showAnalysisModal, setShowAnalysisModal] = useState(false);
  const [showRoadmapModal, setShowRoadmapModal] = useState(false);
  const [selectedProductTemplateId, setSelectedProductTemplateId] = useState<number | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, loading: authLoading, signOut } = useAuth();
  const router = useRouter();
  const hasFetched = useRef(false);

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      router.push('/login');
      return;
    }
    apiClient
      .get('/api/v1/users/me')
      .then((response) => setIsAdmin(response.data.data.role === 'admin'))
      .catch(() => setIsAdmin(false));

    if (hasFetched.current) return;
    hasFetched.current = true;

    let cancelled = false;
    setLoadingBatches(true);

    loadBatches()
      .then((data) => {
        if (!cancelled) {
          setBatches(data);
        }
      })
      .catch((error: unknown) => {
        if (!cancelled) {
          console.error('Failed to load batches:', error);
        }
      })
      .finally(() => {
        if (!cancelled) {
          setLoadingBatches(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [user, authLoading, router]);

  useEffect(() => {
    if (authLoading || !user) return;
    const sync = () => {
      syncPendingFermentationLogs().then((synced) => {
        if (synced > 0) {
          loadBatches().then(setBatches).catch(() => undefined);
        }
      });
    };
    sync();
    return subscribeToOnlineSync(sync);
  }, [user, authLoading]);

  const refreshBatches = async () => {
    try {
      setLoadingBatches(true);
      const data = await loadBatches();
      setBatches(data);
    } catch (error: unknown) {
      console.error('Failed to refresh batches:', error);
    } finally {
      setLoadingBatches(false);
    }
  };

  const handleCreateBatch = async () => {
    await refreshBatches();
    setShowCreateModal(false);
  };

  const handleLogCreated = async () => {
    await refreshBatches();
    setShowLogModal(false);
    setSelectedBatch(null);
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      router.push('/login');
    } catch (error) {
      console.error('Sign out failed:', error);
    }
  };

  const activeBatches = batches.filter(b => b.status !== 'harvested');
  const completedBatches = batches.filter(b => b.status === 'harvested');
  const totalWasteDivertedKg = batches.reduce((sum, batch) => sum + batch.waste_weight_kg, 0);
  const co2ConversionFactor = 1.9;
  const totalCO2AvoidedKg = totalWasteDivertedKg * co2ConversionFactor;

  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-emerald-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"></div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-slate-50">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-white focus:px-4 focus:py-3 focus:text-emerald-900"
      >
        Lewati ke konten utama
      </a>
      <Sidebar sidebarOpen={sidebarOpen} onSignOut={handleSignOut} isAdmin={isAdmin} onClose={() => setSidebarOpen(false)} />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar 
          sidebarOpen={sidebarOpen} 
          onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
          onSignOut={handleSignOut}
          userName={user?.displayName || 'User'}
          userEmail={user?.email || ''}
        />

        <main id="main-content" tabIndex={-1} className="flex-1 overflow-y-auto px-4 md:px-6 py-4 md:py-6 focus:outline-none">
          <GreetingBanner 
            userName={user?.displayName || 'User'} 
            onCreateBatch={() => setShowCreateModal(true)}
          />

          <div className="mt-6 md:mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6">
            <StatCard 
              label="Total Batch"
              value={batches.length}
              icon="📦"
              tint="bg-emerald-100"
              accent="#059669"
            />
            <StatCard 
              label="Batch Aktif"
              value={activeBatches.length}
              icon="⚙️"
              tint="bg-amber-100"
              accent="#d97706"
            />
            <StatCard 
              label="Batch Selesai"
              value={completedBatches.length}
              icon="✅"
              tint="bg-teal-100"
              accent="#0d9488"
            />
          </div>

          <div className="mt-6 md:mt-8 grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-6">
            <StatCard 
              label="Total Limbah Diproses"
              value={`${totalWasteDivertedKg.toFixed(2)} kg`}
              icon="♻️"
              tint="bg-lime-100"
              accent="#65a30d"
            />
            <StatCard 
              label="CO₂ Dihindari (estimasi)"
              value={`${totalCO2AvoidedKg.toFixed(2)} kg`}
              icon="🌍"
              tint="bg-green-100"
              accent="#16a34a"
              highlight
            />
          </div>

          <div className="mt-6 md:mt-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg md:text-xl font-extrabold text-slate-800">
                Batch Aktif
              </h2>
              <span className="text-xs font-semibold text-emerald-700 bg-emerald-100 px-3 py-1 rounded-full">
                {activeBatches.length} berjalan
              </span>
            </div>
            {loadingBatches ? (
              <div className="flex justify-center py-12">
                <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-emerald-500"></div>
              </div>
            ) : activeBatches.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-2xl border border-emerald-100 shadow-sm">
                <span className="text-4xl" aria-hidden="true">🌱</span>
                <p className="mt-3 text-slate-500 text-sm md:text-base">
                  Belum ada batch aktif. Mulai satu untuk membuat eco-enzyme pertamamu!
                </p>
                <button
                  type="button"
                  onClick={() => setShowCreateModal(true)}
                  className="mt-4 min-h-11 px-5 py-2 bg-emerald-600 text-white font-semibold rounded-xl hover:bg-emerald-700 transition-colors"
                >
                  Mulai Batch Baru
                </button>
              </div>
            ) : (
              <div className="space-y-3 md:space-y-4">
                {activeBatches.map((batch) => (
                  <BatchCard
                    key={batch.id}
                    batch={batch}
                    onLogClick={() => {
                      setSelectedBatch(batch);
                      setShowLogModal(true);
                    }}
                    onRecommendationClick={() => {
                      setSelectedBatch(batch);
                      setShowRecommendationModal(true);
                    }}
                    onRoadmapClick={() => {
                      setSelectedBatch(batch);
                      setSelectedProductTemplateId(batch.selected_product_id ?? 1);
                      setShowRoadmapModal(true);
                    }}
                    onAnalysisClick={() => {
                      setSelectedBatch(batch);
                      setShowAnalysisModal(true);
                    }}
                  />
                ))}
              </div>
            )}
          </div>

          <div className="mt-6 md:mt-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg md:text-xl font-extrabold text-slate-800">
                Batch Selesai
              </h2>
              <span className="text-xs font-semibold text-slate-500 bg-white border border-slate-200 px-3 py-1 rounded-full">
                {completedBatches.length} selesai
              </span>
            </div>
            {completedBatches.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-2xl border border-slate-200 shadow-sm">
                <span className="text-3xl opacity-60" aria-hidden="true">🏁</span>
                <p className="mt-3 text-slate-500 text-sm md:text-base">
                  Belum ada batch yang selesai.
                </p>
              </div>
            ) : (
              <div className="space-y-3 md:space-y-4">
                {completedBatches.map((batch) => (
                  <BatchCard
                    key={batch.id}
                    batch={batch}
                    isCompleted={true}
                    onRoadmapClick={() => {
                      setSelectedBatch(batch);
                      setSelectedProductTemplateId(batch.selected_product_id ?? 1);
                      setShowRoadmapModal(true);
                    }}
                    onAnalysisClick={() => {
                      setSelectedBatch(batch);
                      setShowAnalysisModal(true);
                    }}
                  />
                ))}
              </div>
            )}
          </div>
        </main>
      </div>

      <CreateBatchModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSuccess={handleCreateBatch}
      />

      {selectedBatch && (
        <FermentationLogModal
          isOpen={showLogModal}
          onClose={() => setShowLogModal(false)}
          batch={selectedBatch}
          onSuccess={handleLogCreated}
        />
      )}

      {selectedBatch && (
        <ProductRecommendationModal
          isOpen={showRecommendationModal}
          onClose={() => setShowRecommendationModal(false)}
          batchId={selectedBatch.id}
          onSuccess={() => {
            refreshBatches();
            setShowRecommendationModal(false);
          }}
        />
      )}

      {selectedBatch && (
        <BusinessAnalysisModal
          isOpen={showAnalysisModal}
          onClose={() => setShowAnalysisModal(false)}
          batchId={selectedBatch.id}
          onSuccess={() => {
            refreshBatches();
            setShowAnalysisModal(false);
          }}
        />
      )}

      {selectedBatch && selectedProductTemplateId && (
        <RoadmapModal
          isOpen={showRoadmapModal}
          onClose={() => setShowRoadmapModal(false)}
          batchId={selectedBatch.id}
          productTemplateId={selectedProductTemplateId}
          onSuccess={() => {
            refreshBatches();
            setShowRoadmapModal(false);
          }}
        />
      )}
    </div>
  );
}

function Sidebar({
  sidebarOpen,
  onSignOut,
  isAdmin,
  onClose,
}: {
  sidebarOpen: boolean;
  onSignOut: () => void;
  isAdmin: boolean;
  onClose: () => void;
}) {
  const router = useRouter();
  const navigate = (path: string) => {
    router.push(path);
    onClose();
  };

return (
    <>
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-emerald-900/40 backdrop-blur-sm md:hidden"
          aria-hidden="true"
          onClick={onClose}
        />
      )}
      <div
        aria-label="Navigasi utama"
        className={`fixed h-full z-40 bg-white/95 backdrop-blur border-r border-emerald-100 flex flex-col transition-all duration-300 shadow-xl shadow-emerald-900/10 ${
          sidebarOpen ? 'w-64' : 'w-20'
        } ${sidebarOpen ? 'left-0' : '-left-full'} md:left-0 md:-translate-x-0`}
      >
        <div className="p-4 border-b border-emerald-50 flex items-center gap-3">
          <div className="shrink-0 w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center shadow-md shadow-emerald-500/30">
            <span className="text-white font-extrabold text-lg" aria-hidden="true">E</span>
          </div>
          {sidebarOpen && (
            <div className="overflow-hidden">
              <p className="text-emerald-800 font-extrabold leading-tight truncate">EcoFlow</p>
              <p className="text-[11px] text-slate-400 font-medium truncate">Eco-Enzyme AI</p>
            </div>
          )}
        </div>

        <nav aria-label="Navigasi utama" className="flex-1 px-3 py-4 space-y-1.5 overflow-y-auto">
          <p className={`px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-slate-400 ${sidebarOpen ? '' : 'sr-only'}`}>
            Menu
          </p>
          <NavItem
            label="Dasbor"
            icon="📊"
            onClick={() => navigate('/dashboard')}
            sidebarOpen={sidebarOpen}
            active
          />
          {isAdmin && (
            <NavItem
              label="Admin"
              icon="⚙️"
              onClick={() => navigate('/admin')}
              sidebarOpen={sidebarOpen}
            />
          )}
        </nav>

        <div className="p-3 border-t border-emerald-50">
          <button
            type="button"
            aria-label="Keluar dari akun"
            title={sidebarOpen ? undefined : 'Keluar dari akun'}
            onClick={onSignOut}
            className={`w-full min-h-11 py-2.5 px-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-300 text-white rounded-xl transition-all font-semibold text-sm flex items-center justify-center gap-2 shadow-md shadow-emerald-600/20 active:scale-[0.98] ${
              sidebarOpen ? '' : 'flex-col'
            }`}
          >
            <span className="text-lg" aria-hidden="true">🚪</span>
            {sidebarOpen && <span>Keluar</span>}
          </button>
        </div>
      </div>
    </>
  );
}

function NavItem({
  label,
  icon,
  onClick,
  sidebarOpen,
  active = false,
}: {
  label: string;
  icon: string;
  onClick: () => void;
  sidebarOpen: boolean;
  active?: boolean;
}) {
  return (
    <button
      type="button"
      aria-current={active ? 'page' : undefined}
      aria-label={label}
      title={sidebarOpen ? undefined : label}
      onClick={onClick}
      className={`group relative min-h-11 w-full py-2.5 px-3 rounded-xl transition-all flex items-center gap-3 text-sm font-semibold focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-300 active:scale-[0.97] ${
        active
          ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-md shadow-emerald-500/25'
          : 'text-slate-500 hover:bg-emerald-50 hover:text-emerald-700'
      }`}
    >
      {active && (
        <span
          aria-hidden="true"
          className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 rounded-r-full bg-emerald-300"
        />
      )}
      <span
        className={`text-lg transition-transform duration-200 ${sidebarOpen ? 'group-hover:scale-110' : 'mx-auto'}`}
        aria-hidden="true"
      >
        {icon}
      </span>
      {sidebarOpen && <span className="truncate">{label}</span>}
      {!sidebarOpen && active && (
        <span className="absolute right-2 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-emerald-400" aria-hidden="true" />
      )}
    </button>
  );
}

function Navbar({
  sidebarOpen,
  onToggleSidebar,
  onSignOut,
  userName,
  userEmail,
}: {
  sidebarOpen: boolean;
  onToggleSidebar: () => void;
  onSignOut: () => void;
  userName: string;
  userEmail: string;
}) {
  return (
    <nav className={`bg-white/80 backdrop-blur border-b border-emerald-100 transition-all duration-300 px-4 md:px-6 py-3 md:py-4 flex items-center justify-between md:justify-between`}>
      <button
        type="button"
        aria-label="Buka atau tutup navigasi"
        aria-expanded={sidebarOpen}
        onClick={onToggleSidebar}
        className="min-h-11 min-w-11 p-2 hover:bg-emerald-50 rounded-lg transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-300 md:hidden"
      >
        <span aria-hidden="true" className="text-2xl text-emerald-700">☰</span>
      </button>

      <div className="hidden md:flex items-center gap-4 ml-auto">
        <div className="text-right">
          <p className="text-sm font-bold text-slate-700">{userName}</p>
          <p className="text-xs text-slate-400">{userEmail}</p>
        </div>
        <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full flex items-center justify-center shadow-md shadow-emerald-500/20">
          <span className="text-white font-bold text-sm">{userName.charAt(0).toUpperCase()}</span>
        </div>
      </div>

      <div className="flex md:hidden items-center gap-2">
        <div className="text-right">
          <p className="text-xs font-bold text-slate-700">{userName.split(' ')[0]}</p>
        </div>
        <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full flex items-center justify-center">
          <span className="text-white font-bold text-xs">{userName.charAt(0).toUpperCase()}</span>
        </div>
        <button
          type="button"
          onClick={onSignOut}
          aria-label="Keluar dari akun"
          className="ml-1 p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors text-lg"
        >
          🚪
        </button>
      </div>
    </nav>
  );
}

function GreetingBanner({
  userName,
  onCreateBatch,
}: {
  userName: string;
  onCreateBatch: () => void;
}) {
  return (
    <section aria-labelledby="greeting-title" className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 p-6 md:p-8 text-white shadow-lg shadow-emerald-500/20">
      <div aria-hidden="true" className="absolute -right-8 -top-8 w-40 h-40 bg-white/10 rounded-full"></div>
      <div aria-hidden="true" className="absolute right-24 -bottom-10 w-32 h-32 bg-white/10 rounded-full"></div>
      <h1 id="greeting-title" className="text-2xl md:text-3xl font-extrabold mb-2">Halo {userName} <span aria-hidden="true">👋</span></h1>
      <p className="text-emerald-50 text-base md:text-lg mb-6 max-w-xl">
        Selamat datang! Kelola eco-enzymemu dengan mudah dan lihat dampak positifmu bagi lingkungan.
      </p>
      <button
        type="button"
        onClick={onCreateBatch}
        className="min-h-11 px-6 py-2 bg-white text-emerald-700 font-bold rounded-xl hover:bg-emerald-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white transition-colors shadow-md"
      >
        + Mulai Batch Baru
      </button>
    </section>
  );
}

function StatCard({
  label,
  value,
  icon,
  tint,
  accent,
  highlight = false,
}: {
  label: string;
  value: string | number;
  icon: string;
  tint: string;
  accent: string;
  highlight?: boolean;
}) {
  return (
    <div
      className={`group rounded-2xl p-6 border shadow-sm transition-all hover:shadow-lg hover:-translate-y-1 cursor-default ${
        highlight
          ? 'bg-gradient-to-br from-emerald-500 to-teal-600 border-emerald-400 text-white shadow-emerald-500/20'
          : 'bg-white border-emerald-100 text-slate-800'
      }`}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className={`text-sm font-semibold ${highlight ? 'text-emerald-50' : 'text-slate-500'}`}>
            {label}
          </p>
          <p className={`text-3xl font-extrabold mt-2 ${highlight ? 'text-white' : 'text-slate-800'}`}>{value}</p>
        </div>
        <span
          aria-hidden="true"
          className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl shadow-sm ${
            highlight ? 'bg-white/20' : tint
          }`}
          style={highlight ? undefined : { color: accent }}
        >
          {icon}
        </span>
      </div>
    </div>
  );
}
