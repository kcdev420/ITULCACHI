import React, { useState } from 'react';
import { useBarrio } from '../context/BarrioContext';
import { Payment, PaymentType, PaymentMethod, Socio } from '../types';
import {
  CreditCard,
  PlusCircle,
  Search,
  Receipt,
  FileCheck2,
  CheckCircle2,
  Building2,
  User,
  Share2,
  Filter,
  DollarSign,
  Download,
  X,
} from 'lucide-react';
import { ReciboPagoModal } from './ReciboPagoModal';
import { CertificadoSolvenciaModal } from './CertificadoSolvenciaModal';

export const PagosExpensas: React.FC = () => {
  const {
    socios,
    payments,
    registerPayment,
    currentRole,
    activeSocioId,
  } = useBarrio();

  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [selectedSolvencySocio, setSelectedSolvencySocio] = useState<Socio | null>(null);

  // Form State
  const [selectedSocioId, setSelectedSocioId] = useState<string>(socios[0]?.id || '');
  const [paymentAmount, setPaymentAmount] = useState<number>(socios[0]?.monthlyFee || 15);
  const [paymentType, setPaymentType] = useState<PaymentType>('alicuota_ordinaria');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('transferencia');
  const [periodCovered, setPeriodCovered] = useState<string>('Agosto 2026');
  const [referenceNumber, setReferenceNumber] = useState<string>(
    `TR-BP-${Math.floor(100000 + Math.random() * 900000)}`
  );
  const [registeredBy, setRegisteredBy] = useState<string>('Tesorera Barrial');
  const [paymentNotes, setPaymentNotes] = useState<string>('');

  const currentSocioSelection = socios.find(s => s.id === selectedSocioId);

  const handleSocioChange = (socioId: string) => {
    setSelectedSocioId(socioId);
    const s = socios.find(soc => soc.id === socioId);
    if (s) {
      setPaymentAmount(s.monthlyFee);
    }
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentSocioSelection) return;

    const newPayment = registerPayment({
      socioId: currentSocioSelection.id,
      socioName: currentSocioSelection.fullNameOrCompany,
      socioCategory: currentSocioSelection.category,
      identification: currentSocioSelection.identification,
      amount: paymentAmount,
      periodCovered,
      paymentType,
      paymentMethod,
      referenceNumber,
      registeredBy,
      status: 'aprobado',
      notes: paymentNotes,
    });

    setIsRegisterModalOpen(false);
    setSelectedPayment(newPayment);
    // Refresh reference generator
    setReferenceNumber(`TR-BP-${Math.floor(100000 + Math.random() * 900000)}`);
  };

  // Filter Payments
  const filteredPayments = payments.filter(p => {
    // If role is natural or juridica, show their payments or all
    if (currentRole === 'socio_natural' || currentRole === 'socio_juridico') {
      // In member role, show their account or let them search
    }

    const matchesSearch =
      p.receiptNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.socioName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.identification.includes(searchQuery) ||
      p.referenceNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.periodCovered.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;
    if (typeFilter !== 'all' && p.paymentType !== typeFilter) return false;

    return true;
  });

  const totalCollected = payments.reduce((sum, p) => sum + p.amount, 0);
  const collectedNaturales = payments.filter(p => p.socioCategory === 'natural').reduce((sum, p) => sum + p.amount, 0);
  const collectedJuridicas = payments.filter(p => p.socioCategory === 'juridica').reduce((sum, p) => sum + p.amount, 0);

  const paymentTypeLabels: Record<PaymentType, string> = {
    alicuota_ordinaria: 'Alícuota Ordinaria Mensual',
    alicuota_extraordinaria: 'Cuota Extraordinaria Obras',
    multa_minga: 'Multa Inasistencia a Minga',
    reserva_area_comunal: 'Reserva de Área Comunal',
    cuota_agua_comunal: 'Servicio Agua Comunal',
    otro: 'Otro Aporte Comunal',
  };

  return (
    <div className="space-y-6">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <CreditCard className="w-6 h-6 text-emerald-600" />
            <h1 className="text-xl font-black text-slate-900">
              Registro y Control de Expensas Comunitarias
            </h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Recaudación de alícuotas residenciales e industriales, multas de mingas y emisión instantánea de recibos con firma digital.
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          {currentRole === 'admin' && (
            <button
              onClick={() => setIsRegisterModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl transition-all shadow-sm cursor-pointer"
            >
              <PlusCircle className="w-4 h-4" />
              Registrar Nuevo Cobro
            </button>
          )}

          <button
            onClick={() => {
              const eligibleSocio = socios.find(s => s.status === 'al_dia') || socios[0];
              setSelectedSolvencySocio(eligibleSocio);
            }}
            className="flex items-center gap-2 px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl transition-all cursor-pointer"
          >
            <FileCheck2 className="w-4 h-4 text-emerald-400" />
            Certificado de No Adeudar
          </button>
        </div>
      </div>

      {/* Financial Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            Total Recaudado (Agosto 2026)
          </span>
          <div className="text-2xl font-black text-slate-900 font-mono mt-2">
            ${totalCollected.toFixed(2)}
          </div>
          <p className="text-xs text-slate-500 mt-1">
            {payments.length} recibos oficiales emitidos
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-blue-100 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-blue-700 uppercase tracking-wider">
              Aportes Socios Naturales
            </span>
            <User className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-2xl font-black text-blue-950 font-mono mt-2">
            ${collectedNaturales.toFixed(2)}
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Expensas residenciales ($15/mes)
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-purple-100 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-purple-700 uppercase tracking-wider">
              Aportes Socios Jurídicos
            </span>
            <Building2 className="w-4 h-4 text-purple-600" />
          </div>
          <div className="text-2xl font-black text-purple-950 font-mono mt-2">
            ${collectedJuridicas.toFixed(2)}
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Expensas industriales y transporte de carga
          </p>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-96">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
          <input
            type="text"
            placeholder="Buscar por recibo, socio, cédula o ref..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-emerald-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="w-4 h-4 text-slate-400" />
          <select
            value={typeFilter}
            onChange={e => setTypeFilter(e.target.value)}
            className="px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-700 font-semibold focus:outline-emerald-500 cursor-pointer"
          >
            <option value="all">Todos los conceptos</option>
            <option value="alicuota_ordinaria">Alícuotas Ordinarias</option>
            <option value="alicuota_extraordinaria">Cuotas Extraordinarias</option>
            <option value="multa_minga">Multas de Mingas</option>
            <option value="reserva_area_comunal">Reserva de Áreas</option>
          </select>
        </div>
      </div>

      {/* Payments Table */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 uppercase font-bold border-b border-slate-200 text-[11px]">
              <tr>
                <th className="px-4 py-3.5">Nro. Recibo</th>
                <th className="px-4 py-3.5">Fecha</th>
                <th className="px-4 py-3.5">Socio / Razón Social</th>
                <th className="px-4 py-3.5">Concepto / Período</th>
                <th className="px-4 py-3.5">Método & Referencia</th>
                <th className="px-4 py-3.5 text-right">Monto (USD)</th>
                <th className="px-4 py-3.5 text-center">Comprobante</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredPayments.map(payment => {
                const isJuridica = payment.socioCategory === 'juridica';

                return (
                  <tr key={payment.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-4 py-3.5 font-mono font-bold text-slate-900 text-xs">
                      {payment.receiptNumber}
                    </td>

                    <td className="px-4 py-3.5 text-slate-500">
                      {payment.date}
                    </td>

                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-1.5">
                        <span
                          className={`w-2 h-2 rounded-full ${
                            isJuridica ? 'bg-purple-500' : 'bg-blue-500'
                          }`}
                        />
                        <strong className="text-slate-900 font-semibold">{payment.socioName}</strong>
                      </div>
                      <span className="text-[10px] text-slate-400 font-mono block ml-3.5">
                        {payment.identification}
                      </span>
                    </td>

                    <td className="px-4 py-3.5">
                      <span className="font-semibold text-slate-800 block">
                        {payment.periodCovered}
                      </span>
                      <span className="text-[10px] text-slate-500">
                        {paymentTypeLabels[payment.paymentType] || 'Expensa Comunal'}
                      </span>
                    </td>

                    <td className="px-4 py-3.5">
                      <span className="uppercase text-[11px] font-semibold text-slate-700 block">
                        {payment.paymentMethod.replace('_', ' ')}
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono">
                        Ref: {payment.referenceNumber}
                      </span>
                    </td>

                    <td className="px-4 py-3.5 text-right font-mono font-black text-slate-900 text-sm">
                      ${payment.amount.toFixed(2)}
                    </td>

                    <td className="px-4 py-3.5 text-center">
                      <button
                        onClick={() => setSelectedPayment(payment)}
                        className="inline-flex items-center gap-1 px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold text-xs rounded-xl border border-emerald-200 transition-colors cursor-pointer"
                      >
                        <Receipt className="w-3.5 h-3.5" />
                        Ver Recibo
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Register Payment Modal */}
      {isRegisterModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
          <div className="relative w-full max-w-xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-8 animate-in fade-in zoom-in duration-200">
            <div className="flex items-center justify-between px-6 py-4 bg-slate-900 text-white">
              <div className="flex items-center gap-2">
                <PlusCircle className="w-5 h-5 text-emerald-400" />
                <h3 className="font-bold text-sm">Registrar Cobro de Expensa / Aporte</h3>
              </div>
              <button
                onClick={() => setIsRegisterModalOpen(false)}
                className="p-1 text-slate-400 hover:text-white rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleRegisterSubmit} className="p-6 space-y-4 text-xs">
              
              {/* Socio Selector */}
              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  Seleccionar Socio / Predio *
                </label>
                <select
                  required
                  value={selectedSocioId}
                  onChange={e => handleSocioChange(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-slate-900 focus:outline-emerald-500 cursor-pointer font-medium"
                >
                  {socios.map(s => (
                    <option key={s.id} value={s.id}>
                      [{s.code}] {s.fullNameOrCompany} ({s.category === 'juridica' ? 'Jurídica' : 'Natural'} • {s.lotNumber}) {s.balanceDue > 0 ? `[Deuda: $${s.balanceDue}]` : '[Al Día]'}
                    </option>
                  ))}
                </select>
              </div>

              {/* Socio Info Pill */}
              {currentSocioSelection && (
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
                  <div>
                    <span className="text-[11px] text-slate-400 uppercase font-bold">Identificación:</span>
                    <p className="font-mono font-bold text-slate-800">{currentSocioSelection.identification}</p>
                    <span className="text-[11px] text-slate-500">{currentSocioSelection.lotNumber} ({currentSocioSelection.sector})</span>
                  </div>
                  <div className="text-right">
                    <span className="text-[11px] text-slate-400 uppercase font-bold">Expensa Base:</span>
                    <p className="font-mono font-black text-slate-900 text-sm">${currentSocioSelection.monthlyFee.toFixed(2)}</p>
                  </div>
                </div>
              )}

              {/* Payment Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    Concepto de Pago *
                  </label>
                  <select
                    value={paymentType}
                    onChange={e => setPaymentType(e.target.value as PaymentType)}
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-slate-900 focus:outline-emerald-500 cursor-pointer"
                  >
                    <option value="alicuota_ordinaria">Alícuota Ordinaria Mensual</option>
                    <option value="alicuota_extraordinaria">Cuota Extraordinaria de Obras</option>
                    <option value="multa_minga">Multa por Inasistencia a Minga</option>
                    <option value="reserva_area_comunal">Reserva Casa Barrial / Cancha</option>
                    <option value="cuota_agua_comunal">Servicio de Agua Comunal</option>
                    <option value="otro">Otro Aporte Comunal</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    Monto Cancelado (USD) *
                  </label>
                  <input
                    type="number"
                    min="1"
                    step="0.5"
                    required
                    value={paymentAmount}
                    onChange={e => setPaymentAmount(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-slate-900 font-mono font-black text-sm focus:outline-emerald-500"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    Período / Detalle Cubierto *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ej: Agosto 2026 o Cuota Vía Principal"
                    value={periodCovered}
                    onChange={e => setPeriodCovered(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-slate-900 focus:outline-emerald-500"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    Forma de Pago *
                  </label>
                  <select
                    value={paymentMethod}
                    onChange={e => setPaymentMethod(e.target.value as PaymentMethod)}
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-slate-900 focus:outline-emerald-500 cursor-pointer uppercase"
                  >
                    <option value="transferencia">Transferencia Bancaria</option>
                    <option value="deposito">Depósito Bancario</option>
                    <option value="pichincha_vecino">Banco del Barrio / Pichincha Vecino</option>
                    <option value="efectivo">Efectivo en Caja</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    Nro. de Referencia / Comprobante *
                  </label>
                  <input
                    type="text"
                    required
                    value={referenceNumber}
                    onChange={e => setReferenceNumber(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-slate-900 font-mono focus:outline-emerald-500"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    Registrado Por:
                  </label>
                  <input
                    type="text"
                    required
                    value={registeredBy}
                    onChange={e => setRegisteredBy(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-slate-900 focus:outline-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  Notas / Observaciones de Cobro:
                </label>
                <textarea
                  rows={2}
                  placeholder="Ej: Pago puntual con retención SRI adjunta..."
                  value={paymentNotes}
                  onChange={e => setPaymentNotes(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-slate-900 focus:outline-emerald-500"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsRegisterModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl transition-all shadow cursor-pointer"
                >
                  Registrar y Emitir Recibo Oficial
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Recibo Modal */}
      {selectedPayment && (
        <ReciboPagoModal
          payment={selectedPayment}
          onClose={() => setSelectedPayment(null)}
        />
      )}

      {/* Solvency Certificate Modal */}
      {selectedSolvencySocio && (
        <CertificadoSolvenciaModal
          socio={selectedSolvencySocio}
          onClose={() => setSelectedSolvencySocio(null)}
        />
      )}

    </div>
  );
};
