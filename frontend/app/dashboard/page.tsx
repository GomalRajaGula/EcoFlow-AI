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
      <div className="flex items-center justify-center min-h-screen bg-slate-900">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-slate-900">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-white focus:px-4 focus:py-3 focus:text-slate-900"
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
            />
            <StatCard 
              label="Batch Aktif"
              value={activeBatches.length}
              icon="⚙️"
            />
            <StatCard 
              label="Batch Selesai"
              value={completedBatches.length}
              icon="✅"
            />
          </div>

          <div className="mt-6 md:mt-8 grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-6">
            <StatCard 
              label="Total Limbah Diproses"
              value={`${totalWasteDivertedKg.toFixed(2)} kg`}
              icon="♻️"
            />
            <StatCard 
              label="CO₂ Dihindari (estimasi)"
              value={`${totalCO2AvoidedKg.toFixed(2)} kg`}
              icon="🌍"
              highlight
            />
          </div>

          <div className="mt-6 md:mt-8">
            <h2 className="text-lg md:text-xl font-bold text-gray-100 mb-4">Batch Aktif</h2>
            {loadingBatches ? (
              <div className="flex justify-center py-12">
                <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-green-500"></div>
              </div>
            ) : activeBatches.length === 0 ? (
              <div className="text-center py-12 bg-slate-800 rounded-xl border border-slate-700">
                <p className="text-gray-400 text-sm md:text-base">Tidak ada batch aktif. Buat satu untuk memulai!</p>
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
            <h2 className="text-lg md:text-xl font-bold text-gray-100 mb-4">Batch Selesai</h2>
            {completedBatches.length === 0 ? (
              <div className="text-center py-12 bg-slate-800 rounded-xl border border-slate-700">
                <p className="text-gray-400 text-sm md:text-base">Belum ada batch yang selesai.</p>
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
          className="fixed inset-0 z-30 bg-black/50 md:hidden"
          aria-hidden="true"
          onClick={onClose}
        />
      )}
      <div
        aria-label="Navigasi utama"
        className={`fixed h-full z-40 bg-slate-800 border-r border-slate-700 flex flex-col transition-all duration-300 ${
          sidebarOpen ? 'w-64' : 'w-20'
        } ${sidebarOpen ? 'left-0' : '-left-full'} md:left-0 md:-translate-x-0`}
      >
        <div className="p-4 border-b border-slate-700">
          <div className="flex items-center justify-center h-10 bg-gradient-to-r from-orange-500 to-green-500 rounded-lg overflow-hidden">
            {sidebarOpen && <span className="text-white font-bold">EcoFlow</span>}
          </div>
        </div>

        <nav aria-label="Navigasi utama" className="flex-1 px-4 py-6 space-y-2">
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

        <div className="p-4 border-t border-slate-700">
          <button
            type="button"
            aria-label="Keluar dari akun"
            onClick={onSignOut}
            className="min-h-11 w-full py-2 px-4 bg-red-600 hover:bg-red-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white text-white rounded-lg transition-all font-medium text-sm flex items-center justify-center gap-2"
          >
            <span>🚪</span>
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
      onClick={onClick}
      className={`min-h-11 w-full py-3 px-4 rounded-lg transition-colors flex items-center gap-3 text-sm font-medium focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-300 ${
        active
          ? 'bg-gradient-to-r from-orange-500 to-green-500 text-white'
          : 'text-gray-300 hover:bg-slate-700'
      }`}
    >
      <span className="text-lg">{icon}</span>
      {sidebarOpen && <span>{label}</span>}
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
    <nav className={`bg-slate-800 border-b border-slate-700 transition-all duration-300 px-4 md:px-6 py-3 md:py-4 flex items-center justify-between md:justify-between`}>
      <button
        type="button"
        aria-label="Buka atau tutup navigasi"
        aria-expanded={sidebarOpen}
        onClick={onToggleSidebar}
        className="min-h-11 min-w-11 p-2 hover:bg-slate-700 rounded-lg transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-300 md:hidden"
      >
        <span aria-hidden="true" className="text-2xl text-gray-300">☰</span>
      </button>

      <div className="hidden md:flex items-center gap-4 ml-auto">
        <div className="text-right">
          <p className="text-sm font-medium text-gray-100">{userName}</p>
          <p className="text-xs text-gray-400">{userEmail}</p>
        </div>
        <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-green-500 rounded-full flex items-center justify-center">
          <span className="text-white font-bold text-sm">{userName.charAt(0).toUpperCase()}</span>
        </div>
      </div>

      <div className="flex md:hidden items-center gap-2">
        <div className="text-right">
          <p className="text-xs font-medium text-gray-100">{userName.split(' ')[0]}</p>
        </div>
        <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-green-500 rounded-full flex items-center justify-center">
          <span className="text-white font-bold text-xs">{userName.charAt(0).toUpperCase()}</span>
        </div>
        <button
          type="button"
          onClick={onSignOut}
          aria-label="Keluar dari akun"
          className="ml-1 p-2 text-gray-300 hover:text-red-400 hover:bg-slate-700 rounded-lg transition-colors text-lg"
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
    <section aria-labelledby="greeting-title" className="bg-gradient-to-r from-orange-500 via-green-500 to-teal-500 rounded-xl p-6 md:p-8 text-white shadow-lg">
      <h1 id="greeting-title" className="text-2xl md:text-3xl font-bold mb-2">Halo {userName} <span aria-hidden="true">👋</span></h1>
      <p className="text-lg mb-6 opacity-95">
        Selamat datang di Dasbor Eco-Enzyme Anda! Pantau produksi dan lihat insight di sini.
      </p>
      <button
        type="button"
        onClick={onCreateBatch}
        className="min-h-11 px-6 py-2 bg-white text-orange-600 font-bold rounded-lg hover:bg-gray-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white transition-colors"
      >
        Mulai Batch Baru
      </button>
    </section>
  );
}

function StatCard({
  label,
  value,
  icon,
  highlight = false,
}: {
  label: string;
  value: string | number;
  icon: string;
  highlight?: boolean;
}) {
  return (
    <div
      className={`rounded-xl p-6 shadow-lg border transition-all ${
        highlight
          ? 'bg-gradient-to-br from-green-600 to-teal-600 border-green-500 text-white'
          : 'bg-slate-800 border-slate-700 text-gray-100'
      }`}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className={`text-sm font-medium ${highlight ? 'text-green-100' : 'text-gray-400'}`}>
            {label}
          </p>
          <p className="text-3xl font-bold mt-2">{value}</p>
        </div>
        <span className="text-5xl opacity-20">{icon}</span>
      </div>
    </div>
  );
}
