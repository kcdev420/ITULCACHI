import React, { useState } from 'react';
import { useBarrio } from '../context/BarrioContext';
import {
  Users,
  CreditCard,
  TrendingDown,
  CalendarCheck,
  Building,
  AlertTriangle,
  ArrowUpRight,
  ShieldAlert,
  Sparkles,
  PlusCircle,
  FileCheck2,
  Receipt,
  UserPlus,
  ArrowRight,
} from 'lucide-react';
import { ReciboPagoModal } from './ReciboPagoModal';
import { CertificadoSolvenciaModal } from './CertificadoSolvenciaModal';
import { Payment, Socio } from '../types';

export const DashboardOverview: React.FC = () => {
  const {
    socios,
    payments,
    expenses,
    events,
    incidents,
    setActiveTab,
    currentRole,
  } = useBarrio();

  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);
  const [selectedSolvencySocio, setSelectedSolvencySocio] = useState<Socio | null>(null);

  // Financial calculations
  const totalIncome = payments.reduce((acc, p) => acc + p.amount, 0);
  const totalExpenses = expenses.reduce((acc, e) => acc + e.amount, 0);
  const currentCashBalance = totalIncome - totalExpenses;

  const naturalesCount = socios.filter(s => s.category === 'natural').length;
  const juridicasCount = socios.filter(s => s.category === 'juridica').length;
  const totalSocios = socios.length || 1;
  const naturalPct = Math.round((naturalesCount / totalSocios) * 100);
  const juridicaPct = 100 - naturalPct;

  const sociosEnMora = socios.filter(s => s.status === 'en_mora');
  const totalDeudaAcumulada = socios.reduce((acc, s) => acc + s.balanceDue, 0);

  const nextEvent = events.find(e => e.status === 'programada') || events[0];
  const pendingIncidents = incidents.filter(i => i.status !== 'resuelto');

  const recentPayments = payments.slice(0, 4);

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Top Banner / Welcome card */}
      <div className="bg-slate-900 rounded-xl p-6 sm:p-8 text-white shadow-md border border-slate-800 relative overflow-hidden">
        <div className="absolute right-0 top-0 translate-x-12 -translate-y-12 w-72 h-72 bg-blue-600/15 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-300 text-xs font-semibold border border-blue-500/30">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              Período Activo: Agosto 2026 • Parroquia Pifo
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              Gestión Vecinal Barrio Itulcachi
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Panel administrativo unificado para el control de expensas diferenciadas, padrón de socios naturales y jurídicos, y registro en vivo de mingas comunitarias.
            </p>
          </div>

          {/* Quick Action Matrix */}
          <div className="flex flex-wrap items-center gap-2.5 w-full lg:w-auto">
            {currentRole === 'admin' && (
              <>
                <button
                  onClick={() => setActiveTab('pagos')}
                  className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg transition-all shadow-xs cursor-pointer"
                >
                  <PlusCircle className="w-4 h-4" />
                  Registrar Cobro
                </button>
                <button
                  onClick={() => setActiveTab('mingas')}
                  className="flex items-center gap-2 px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-lg border border-slate-700 transition-all cursor-pointer"
                >
                  <CalendarCheck className="w-4 h-4 text-blue-400" />
                  Asistencia Minga
                </button>
                <button
                  onClick={() => setActiveTab('asistente_ia')}
                  className="flex items-center gap-2 px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-blue-300 text-xs font-bold rounded-lg border border-blue-500/30 transition-all cursor-pointer"
                >
                  <Sparkles className="w-4 h-4 text-blue-400" />
                  Asesor IA
                </button>
              </>
            )}

            {currentRole !== 'admin' && (
              <button
                onClick={() => {
                  const target = socios.find(s => s.status === 'al_dia') || socios[0];
                  setSelectedSolvencySocio(target);
                }}
                className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg transition-all shadow-xs cursor-pointer"
              >
                <FileCheck2 className="w-4 h-4" />
                Mi Certificado de Solvencia
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main KPI Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Recaudación Total */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
              Recaudación en Caja
            </span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <CreditCard className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-3xl font-black text-slate-900 font-mono">
              ${totalIncome.toFixed(2)}
            </div>
            <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
              <span className="text-blue-600 font-semibold">{payments.length} recibos</span> emitidos
            </p>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
            <span>Naturales: ${payments.filter(p => p.socioCategory === 'natural').reduce((a,b)=>a+b.amount,0)}</span>
            <span>Jurídicas: ${payments.filter(p => p.socioCategory === 'juridica').reduce((a,b)=>a+b.amount,0)}</span>
          </div>
        </div>

        {/* Egresos y Obras */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
              Gastos & Obras
            </span>
            <div className="w-8 h-8 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center">
              <TrendingDown className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-3xl font-black text-slate-900 font-mono">
              ${totalExpenses.toFixed(2)}
            </div>
            <p className="text-xs text-slate-500 mt-1">
              {expenses.length} comprobantes de egreso
            </p>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
            <span>Vías y Maquinaria: $320</span>
            <span>Seguridad: $145</span>
          </div>
        </div>

        {/* Saldo Neto Disponible */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
              Fondo Comunal Neto
            </span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Building className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className={`text-3xl font-black font-mono ${currentCashBalance >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
              ${currentCashBalance.toFixed(2)}
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Superávit activo disponible
            </p>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-100 text-[11px] text-slate-500 flex items-center justify-between">
            <span>Fondo de reserva: <strong className="text-slate-700">$180.00</strong></span>
          </div>
        </div>

        {/* Padrón de Socios */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
              Padrón de Socios
            </span>
            <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-3xl font-black text-slate-900 font-mono">
              {socios.length} <span className="text-xs font-normal text-slate-500">unidades</span>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              <strong className="text-blue-600 font-bold">{naturalesCount}</strong> Naturales • <strong className="text-emerald-600 font-bold">{juridicasCount}</strong> Jurídicos
            </p>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px]">
            <span className="text-emerald-600 font-semibold">{socios.length - sociosEnMora.length} al día</span>
            <span className="text-amber-600 font-semibold">{sociosEnMora.length} en mora</span>
          </div>
        </div>

      </div>

      {/* Geometric Balance Core Grid: Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Composición del Barrio (4 Cols) */}
        <div className="lg:col-span-4 bg-white rounded-xl border border-slate-200 p-6 flex flex-col justify-between shadow-xs">
          <div>
            <h3 className="text-slate-500 text-[10px] font-bold uppercase tracking-widest">
              Composición del Barrio
            </h3>
            <div className="flex items-end justify-between mt-4">
              <div className="space-y-1">
                <p className="text-4xl font-black text-slate-900">{socios.length}</p>
                <p className="text-[11px] text-slate-400 font-medium">Total de Unidades Registradas</p>
              </div>
              <div className="text-right space-y-2">
                <div className="flex items-center gap-2 justify-end">
                  <span className="text-[11px] text-slate-600 font-semibold">Naturales ({naturalesCount})</span>
                  <span className="w-3 h-3 bg-blue-500 rounded-xs"></span>
                </div>
                <div className="flex items-center gap-2 justify-end">
                  <span className="text-[11px] text-slate-600 font-semibold">Jurídicos ({juridicasCount})</span>
                  <span className="w-3 h-3 bg-emerald-500 rounded-xs"></span>
                </div>
              </div>
            </div>
          </div>

          <div>
            <div className="w-full h-3 bg-slate-100 rounded-full mt-6 overflow-hidden flex">
              <div
                style={{ width: `${naturalPct}%` }}
                className="bg-blue-500 h-full border-r border-white"
                title={`Naturales: ${naturalPct}%`}
              />
              <div
                style={{ width: `${juridicaPct}%` }}
                className="bg-emerald-500 h-full"
                title={`Jurídicos: ${juridicaPct}%`}
              />
            </div>
            <div className="flex justify-between text-[10px] text-slate-400 mt-2 font-mono">
              <span>{naturalPct}% Residencial</span>
              <span>{juridicaPct}% Industrial/Comercial</span>
            </div>
          </div>
        </div>

        {/* Últimas Transacciones (8 Cols) */}
        <div className="lg:col-span-8 bg-white rounded-xl border border-slate-200 p-6 shadow-xs">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-slate-500 text-[10px] font-bold uppercase tracking-widest">
              Últimas Transacciones (Agosto 2026)
            </h3>
            <button
              onClick={() => setActiveTab('pagos')}
              className="text-[10px] text-blue-600 font-bold bg-blue-50 hover:bg-blue-100 px-2 py-1 rounded transition-colors cursor-pointer"
            >
              Ver Historial Completo
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="text-[10px] text-slate-400 border-b border-slate-100 uppercase font-bold">
                <tr className="h-8">
                  <th className="pb-2">Socio / Razón Social</th>
                  <th className="pb-2">Categoría</th>
                  <th className="pb-2">Fecha</th>
                  <th className="pb-2">Monto</th>
                  <th className="pb-2">Estado</th>
                  <th className="pb-2 text-right">Recibo</th>
                </tr>
              </thead>
              <tbody className="text-xs font-medium text-slate-700">
                {recentPayments.map((payment) => (
                  <tr key={payment.id} className="border-b border-slate-50 h-12 hover:bg-slate-50/60 transition-colors">
                    <td className="font-semibold text-slate-900">
                      {payment.socioName}
                      <span className="block text-[10px] text-slate-400 font-mono font-normal">
                        {payment.receiptNumber}
                      </span>
                    </td>
                    <td className="text-slate-500 capitalize">
                      {payment.socioCategory === 'natural' ? 'Natural' : 'Jurídico'}
                    </td>
                    <td className="text-slate-500">{payment.date}</td>
                    <td className="font-bold font-mono text-slate-900">${payment.amount.toFixed(2)}</td>
                    <td>
                      <span className="text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full text-[11px] font-semibold">
                        Aprobado
                      </span>
                    </td>
                    <td className="text-right">
                      <button
                        onClick={() => setSelectedPayment(payment)}
                        className="text-[11px] text-blue-600 hover:text-blue-800 font-semibold cursor-pointer underline underline-offset-2"
                      >
                        Ver QR
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>

      {/* Geometric Balance Core Grid: Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Control de Mingas: Próximo Evento (7 Cols) */}
        <div className="lg:col-span-7 bg-white rounded-xl border border-slate-200 p-6 flex flex-col shadow-xs">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-slate-500 text-[10px] font-bold uppercase tracking-widest">
              Control de Mingas: Próximo Evento
            </h3>
            <div className="flex gap-1.5 items-center">
              <span className="w-2 h-2 rounded-full bg-rose-500"></span>
              <span className="text-[10px] text-slate-900 font-bold">Asistencia Obligatoria</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row flex-1 gap-6">
            <div className="sm:w-3/5 space-y-3 flex flex-col justify-between">
              <div className="bg-slate-50 p-4 rounded-lg border border-slate-100">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-xs font-bold text-slate-900 block">
                      {nextEvent ? nextEvent.title : 'Limpieza de Vía Interoceánica e Itulcachi'}
                    </span>
                    <span className="text-[11px] text-slate-500 block mt-0.5">
                      📍 {nextEvent ? nextEvent.location : 'Sector La Cruz y Acceso Principal'}
                    </span>
                  </div>
                  <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded shrink-0">
                    {nextEvent ? nextEvent.date : '22 AGO'}
                  </span>
                </div>

                <div className="mt-4 flex gap-4">
                  <div className="text-center">
                    <p className="text-xl font-black text-slate-900">42</p>
                    <p className="text-[9px] uppercase font-bold text-slate-400">Confirmados</p>
                  </div>
                  <div className="text-center border-l border-slate-200 pl-4">
                    <p className="text-xl font-black text-slate-400">{Math.max(0, socios.length - 42)}</p>
                    <p className="text-[9px] uppercase font-bold text-slate-400">Por Registrar</p>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setActiveTab('mingas')}
                className="w-full bg-slate-900 hover:bg-slate-800 text-white text-xs py-2.5 rounded-lg font-bold transition-colors cursor-pointer flex items-center justify-center gap-2"
              >
                <CalendarCheck className="w-4 h-4 text-blue-400" />
                Abrir Control de Asistencia Digital
              </button>
            </div>

            <div className="flex-1 flex flex-col justify-center items-center bg-blue-50 rounded-lg p-6 border border-blue-100 text-center">
              <p className="text-[10px] font-bold text-blue-800 uppercase tracking-wider mb-2">
                Participación Promedio
              </p>
              <p className="text-5xl font-black text-blue-600 tracking-tight">
                88%
              </p>
              <div className="w-full h-1.5 bg-blue-200 rounded-full mt-4 overflow-hidden">
                <div className="w-[88%] h-full bg-blue-600 rounded-full"></div>
              </div>
              <p className="text-[10px] text-blue-600 mt-2 font-medium">
                Alto índice de civismo comunal
              </p>
            </div>
          </div>
        </div>

        {/* Resumen Mensual de Gastos (5 Cols) */}
        <div className="lg:col-span-5 bg-slate-900 rounded-xl p-6 text-white shadow-lg flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">
                Resumen Mensual de Gastos
              </h3>
              <span className="text-[10px] font-mono text-slate-400 bg-slate-800 px-2 py-0.5 rounded">
                ID: REP-2026-08
              </span>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-end border-b border-slate-800 pb-3">
                <div>
                  <p className="text-xs text-slate-300 font-medium">Mantenimiento de Vía y Rodillos</p>
                  <p className="text-lg font-bold text-white font-mono">$320.00</p>
                </div>
                <div className="text-[10px] text-emerald-400 font-semibold bg-emerald-950/60 border border-emerald-800/60 px-2 py-0.5 rounded">
                  Pagado
                </div>
              </div>

              <div className="flex justify-between items-end border-b border-slate-800 pb-3">
                <div>
                  <p className="text-xs text-slate-300 font-medium">Seguridad & Alarmas Comunitarias</p>
                  <p className="text-lg font-bold text-white font-mono">$145.00</p>
                </div>
                <div className="text-[10px] text-amber-400 font-bold uppercase bg-amber-950/60 border border-amber-800/60 px-2 py-0.5 rounded">
                  En Proceso
                </div>
              </div>
            </div>
          </div>

          <div className="pt-4 mt-4 border-t border-slate-800 flex justify-between items-center">
            <div>
              <p className="text-xs text-slate-400 font-medium">Balance Neto Comunal</p>
              <p className="text-2xl font-black text-blue-400 font-mono">
                ${currentCashBalance.toFixed(2)}
              </p>
            </div>
            <button
              onClick={() => setActiveTab('reportes')}
              className="text-xs text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 px-3 py-1.5 rounded-lg border border-slate-700 transition-colors cursor-pointer flex items-center gap-1"
            >
              <span>Ver Libro</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

      </div>

      {/* Modal for Receipt */}
      {selectedPayment && (
        <ReciboPagoModal
          payment={selectedPayment}
          onClose={() => setSelectedPayment(null)}
        />
      )}

      {/* Modal for Solvency Certificate */}
      {selectedSolvencySocio && (
        <CertificadoSolvenciaModal
          socio={selectedSolvencySocio}
          onClose={() => setSelectedSolvencySocio(null)}
        />
      )}

    </div>
  );
};

