import React, { useState } from 'react';
import { BarrioProvider, useBarrio } from './context/BarrioContext';
import { Sidebar, Header } from './components/Navbar';
import { DashboardOverview } from './components/DashboardOverview';
import { SociosManager } from './components/SociosManager';
import { PagosExpensas } from './components/PagosExpensas';
import { ReportesGastos } from './components/ReportesGastos';
import { MingasEventos } from './components/MingasEventos';
import { ComunidadIncidencias } from './components/ComunidadIncidencias';
import { AsistenteIA } from './components/AsistenteIA';

const MainLayout: React.FC = () => {
  const { activeTab } = useBarrio();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="flex h-screen w-full bg-slate-100 font-sans overflow-hidden">
      {/* Geometric Balance Sidebar */}
      <Sidebar mobileOpen={mobileMenuOpen} setMobileOpen={setMobileMenuOpen} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Header onOpenMobileMenu={() => setMobileMenuOpen(true)} />

        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto space-y-6">
            {activeTab === 'resumen' && <DashboardOverview />}
            {activeTab === 'socios' && <SociosManager />}
            {activeTab === 'pagos' && <PagosExpensas />}
            {activeTab === 'reportes' && <ReportesGastos />}
            {activeTab === 'mingas' && <MingasEventos />}
            {activeTab === 'comunidad' && <ComunidadIncidencias />}
            {activeTab === 'asistente_ia' && <AsistenteIA />}

            {/* Subtle Footer inside scroll container */}
            <footer className="pt-8 pb-4 text-xs text-slate-400 print:hidden flex flex-col sm:flex-row items-center justify-between gap-2 border-t border-slate-200/80 mt-8">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                <span className="font-semibold text-slate-700">Barrio Itulcachi</span>
                <span>• Parroquia Pifo, Quito - Ecuador</span>
              </div>
              <div className="text-[11px] text-slate-400">
                Personería Jurídica Comunal • Régimen Natural & Jurídico
              </div>
            </footer>
          </div>
        </main>
      </div>
    </div>
  );
};

export default function App() {
  return (
    <BarrioProvider>
      <MainLayout />
    </BarrioProvider>
  );
}

