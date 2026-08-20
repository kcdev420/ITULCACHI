import React, { useState } from 'react';
import { useBarrio } from '../context/BarrioContext';
import { UserRole } from '../types';
import {
  Users,
  CreditCard,
  BarChart3,
  CalendarCheck,
  Building2,
  Sparkles,
  PhoneCall,
  RotateCcw,
  Shield,
  Layers,
  Menu,
  X,
  PlusCircle,
  UserPlus,
} from 'lucide-react';

interface SidebarProps {
  mobileOpen: boolean;
  setMobileOpen: (open: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ mobileOpen, setMobileOpen }) => {
  const {
    activeTab,
    setActiveTab,
    currentRole,
    setCurrentRole,
    socios,
    resetAllData,
  } = useBarrio();

  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);

  const navItems = [
    { id: 'resumen', label: 'Panel de Control', icon: Layers },
    { id: 'socios', label: 'Base de Socios', icon: Users, badge: socios.length },
    { id: 'pagos', label: 'Pagos de Expensas', icon: CreditCard },
    { id: 'mingas', label: 'Eventos y Mingas', icon: CalendarCheck },
    { id: 'reportes', label: 'Reportes Mensuales', icon: BarChart3 },
    { id: 'comunidad', label: 'Áreas & Novedades', icon: Building2 },
    { id: 'asistente_ia', label: 'Asistente IA Barrial', icon: Sparkles, highlight: true },
  ];

  const getRoleLabel = (role: UserRole) => {
    switch (role) {
      case 'admin':
        return 'Admin Principal';
      case 'socio_natural':
        return 'Socio Natural';
      case 'socio_juridico':
        return 'Socio Jurídico';
      case 'fiscalizador':
        return 'Fiscalizador';
      default:
        return 'Usuario';
    }
  };

  const getRoleSubtext = (role: UserRole) => {
    switch (role) {
      case 'admin':
        return 'Directiva Barrial';
      case 'socio_natural':
        return 'Residente Domiciliario';
      case 'socio_juridico':
        return 'Empresa / Industria';
      case 'fiscalizador':
        return 'Comisario Comunal';
    }
  };

  const getRoleInitials = (role: UserRole) => {
    switch (role) {
      case 'admin':
        return 'AD';
      case 'socio_natural':
        return 'SN';
      case 'socio_juridico':
        return 'SJ';
      case 'fiscalizador':
        return 'FC';
    }
  };

  return (
    <>
      {/* Mobile backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-slate-900/80 z-40 lg:hidden backdrop-blur-xs"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <aside
        className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-slate-900 flex flex-col border-r border-slate-800 transition-transform duration-300 ease-in-out ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Brand Header */}
        <div className="p-6 border-b border-slate-800 flex items-center justify-between">
          <div>
            <h1 className="text-white font-bold text-xl tracking-tight flex items-center gap-2">
              <span className="w-2.5 h-2.5 bg-blue-500 rounded-xs"></span>
              ITULCACHI
            </h1>
            <p className="text-slate-400 text-xs uppercase tracking-widest mt-1 font-semibold">
              Gestión Vecinal
            </p>
          </div>
          <button
            onClick={() => setMobileOpen(false)}
            className="lg:hidden text-slate-400 hover:text-white p-1"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 py-4 space-y-0.5 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            const Icon = item.icon;

            return (
              <div
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setMobileOpen(false);
                }}
                className={`px-6 py-3 flex items-center justify-between gap-3 cursor-pointer transition-colors ${
                  isActive
                    ? 'bg-blue-600 text-white font-semibold'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-2 h-2 rounded-full shrink-0 ${
                      isActive ? 'bg-blue-200' : 'bg-slate-700'
                    }`}
                  />
                  <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                  <span className="text-sm font-medium">{item.label}</span>
                </div>

                {item.badge !== undefined && (
                  <span
                    className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${
                      isActive ? 'bg-blue-800 text-blue-100' : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
                {item.highlight && !isActive && (
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
                )}
              </div>
            );
          })}
        </nav>

        {/* Reset Demo Data & Quick Action */}
        <div className="px-6 py-2 border-t border-slate-800/60 flex items-center justify-between text-[11px] text-slate-400">
          <span>Pifo, Quito • Ecuador</span>
          <button
            onClick={() => {
              if (window.confirm('¿Desea restaurar los datos de prueba iniciales del Barrio Itulcachi?')) {
                resetAllData();
              }
            }}
            title="Restaurar datos"
            className="hover:text-slate-200 transition-colors p-1"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* User Profile Footer */}
        <div className="p-6 bg-slate-950 mt-auto border-t border-slate-800 relative">
          <div
            onClick={() => setRoleDropdownOpen(!roleDropdownOpen)}
            className="flex items-center justify-between gap-3 cursor-pointer group"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded bg-blue-800 flex items-center justify-center text-xs font-bold text-white shadow-xs">
                {getRoleInitials(currentRole)}
              </div>
              <div>
                <p className="text-xs text-white font-medium group-hover:text-blue-300 transition-colors">
                  {getRoleLabel(currentRole)}
                </p>
                <p className="text-[10px] text-slate-500">
                  {getRoleSubtext(currentRole)}
                </p>
              </div>
            </div>
            <Shield className="w-4 h-4 text-slate-600 group-hover:text-blue-400 transition-colors" />
          </div>

          {/* Role selector dropdown */}
          {roleDropdownOpen && (
            <div className="absolute bottom-full left-4 right-4 mb-2 bg-slate-900 border border-slate-700 rounded-lg p-2 shadow-xl z-50 text-xs space-y-1">
              <p className="text-[10px] text-slate-400 px-2 py-1 font-bold uppercase tracking-widest border-b border-slate-800">
                Cambiar Rol de Usuario
              </p>
              {(
                [
                  { id: 'admin', label: 'Admin Principal (Directiva)' },
                  { id: 'socio_natural', label: 'Socio Natural' },
                  { id: 'socio_juridico', label: 'Socio Jurídico' },
                  { id: 'fiscalizador', label: 'Fiscalizador / Comisario' },
                ] as const
              ).map((r) => (
                <button
                  key={r.id}
                  onClick={() => {
                    setCurrentRole(r.id);
                    setRoleDropdownOpen(false);
                  }}
                  className={`w-full text-left px-2.5 py-1.5 rounded transition-colors text-xs flex items-center justify-between ${
                    currentRole === r.id
                      ? 'bg-blue-600 text-white font-bold'
                      : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  <span>{r.label}</span>
                  {currentRole === r.id && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
                </button>
              ))}
            </div>
          )}
        </div>
      </aside>
    </>
  );
};

export const Header: React.FC<{ onOpenMobileMenu: () => void }> = ({ onOpenMobileMenu }) => {
  const { activeTab, setActiveTab } = useBarrio();

  const getTabTitle = (tab: string) => {
    switch (tab) {
      case 'resumen':
        return 'Administración General';
      case 'socios':
        return 'Base y Padrón de Socios';
      case 'pagos':
        return 'Recaudación y Expensas';
      case 'mingas':
        return 'Eventos y Control de Mingas';
      case 'reportes':
        return 'Balances Financieros y Gastos';
      case 'comunidad':
        return 'Áreas Comunales & Seguridad';
      case 'asistente_ia':
        return 'Asesor Inteligente IA';
      default:
        return 'Administración General';
    }
  };

  return (
    <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 sm:px-8 shrink-0 sticky top-0 z-30">
      <div className="flex gap-4 sm:gap-8 items-center">
        <button
          onClick={onOpenMobileMenu}
          className="lg:hidden p-1.5 text-slate-600 hover:text-slate-900 rounded-md hover:bg-slate-100"
        >
          <Menu className="w-5 h-5" />
        </button>

        <h2 className="text-slate-800 font-bold text-base sm:text-lg tracking-tight">
          {getTabTitle(activeTab)}
        </h2>

        <div className="hidden sm:flex gap-2 items-center">
          <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
          <span className="text-xs text-slate-500 font-medium">Servicio en Línea</span>
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-4">
        {/* Quick Emergency UPC trigger */}
        <button
          onClick={() => setActiveTab('comunidad')}
          className="hidden md:flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-800 px-3 py-2 font-medium"
        >
          <PhoneCall className="w-3.5 h-3.5 text-rose-500" />
          <span>UPC Pifo: 02 238 0122</span>
        </button>

        <button
          onClick={() => setActiveTab('socios')}
          className="bg-slate-50 text-slate-700 border border-slate-200 text-xs px-3 sm:px-4 py-2 rounded-md font-semibold hover:bg-slate-100 transition-colors cursor-pointer flex items-center gap-1.5"
        >
          <UserPlus className="w-3.5 h-3.5 text-slate-500" />
          <span className="hidden sm:inline">Nuevo</span> Socio
        </button>

        <button
          onClick={() => setActiveTab('pagos')}
          className="bg-blue-600 hover:bg-blue-700 text-white text-xs px-3 sm:px-4 py-2 rounded-md font-semibold shadow-xs transition-colors cursor-pointer flex items-center gap-1.5"
        >
          <PlusCircle className="w-3.5 h-3.5" />
          Registrar Pago
        </button>
      </div>
    </header>
  );
};

