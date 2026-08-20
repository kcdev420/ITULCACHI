import React from 'react';
import { Payment } from '../types';
import { Printer, Download, Share2, CheckCircle2, ShieldCheck, X } from 'lucide-react';
import confetti from 'canvas-confetti';

interface ReciboPagoModalProps {
  payment: Payment | null;
  onClose: () => void;
}

export const ReciboPagoModal: React.FC<ReciboPagoModalProps> = ({ payment, onClose }) => {
  if (!payment) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleShareWhatsApp = () => {
    const text = encodeURIComponent(
      `🏛️ *COMPROBANTE DE PAGO - BARRIO ITULCACHI*\n\n` +
      `📄 *Recibo Nro:* ${payment.receiptNumber}\n` +
      `👤 *Socio:* ${payment.socioName}\n` +
      `🆔 *Cédula/RUC:* ${payment.identification}\n` +
      `💵 *Monto:* $${payment.amount.toFixed(2)}\n` +
      `📌 *Concepto:* ${payment.periodCovered}\n` +
      `📅 *Fecha:* ${payment.date}\n` +
      `💳 *Método:* ${payment.paymentMethod.toUpperCase()} (Ref: ${payment.referenceNumber})\n` +
      `✅ *Estado:* Aprobado y registrado en el Sistema Comunal Itulcachi.\n\n` +
      `_Comprobante digital válido para la Directiva Barrial Itulcachi._`
    );
    window.open(`https://wa.me/?text=${text}`, '_blank');
  };

  const triggerConfetti = () => {
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.8 },
    });
  };

  React.useEffect(() => {
    triggerConfetti();
  }, []);

  const paymentTypeLabels: Record<string, string> = {
    alicuota_ordinaria: 'Expensa / Alícuota Ordinaria Mensual',
    alicuota_extraordinaria: 'Cuota Extraordinaria de Obras Comunitarias',
    multa_minga: 'Multa por Inasistencia a Minga Barrial',
    reserva_area_comunal: 'Reserva y Garantía de Área Comunal',
    cuota_agua_comunal: 'Servicio y Mantenimiento de Agua Comunal',
    otro: 'Otro Aporte Comunal',
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-8 animate-in fade-in zoom-in duration-200">
        
        {/* Header bar (no print for modal controls) */}
        <div className="flex items-center justify-between px-6 py-4 bg-slate-900 text-white print:hidden">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            <span className="font-semibold text-sm tracking-wide">Recibo Digital Oficial Verificado</span>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Printable Receipt Body */}
        <div id="receipt-print-area" className="p-8 bg-white text-slate-800">
          {/* Header */}
          <div className="border-b-2 border-emerald-600 pb-6 mb-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-14 h-14 rounded-xl bg-emerald-700 text-white flex items-center justify-center font-bold text-2xl shadow-md border-2 border-emerald-500">
                  BI
                </div>
                <div>
                  <h1 className="text-xl font-black text-slate-900 uppercase tracking-tight">
                    Barrio Itulcachi
                  </h1>
                  <p className="text-xs text-slate-500 font-medium">
                    Parroquia Pifo • Cantón Quito • Pichincha, Ecuador
                  </p>
                  <p className="text-[11px] text-emerald-700 font-semibold">
                    Personería Jurídica Comunitaria • RUC: 1792940214001
                  </p>
                </div>
              </div>

              <div className="text-right sm:border-l sm:pl-6 border-slate-200">
                <span className="inline-block px-3 py-1 bg-emerald-50 text-emerald-700 text-xs font-bold rounded-full border border-emerald-200 uppercase tracking-wider mb-1">
                  Comprobante de Caja
                </span>
                <div className="text-lg font-black text-slate-900 font-mono tracking-wider">
                  {payment.receiptNumber}
                </div>
                <div className="text-xs text-slate-500">
                  Fecha: {new Date(payment.date).toLocaleDateString('es-EC', { year: 'numeric', month: 'long', day: 'numeric' })}
                </div>
              </div>
            </div>
          </div>

          {/* Member Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-slate-50 rounded-xl border border-slate-200 mb-6 text-sm">
            <div>
              <span className="text-xs text-slate-400 uppercase font-bold tracking-wider">Socio / Titular:</span>
              <p className="font-bold text-slate-900 text-base">{payment.socioName}</p>
              <div className="flex items-center gap-2 mt-1">
                <span className={`px-2 py-0.5 text-[11px] font-semibold rounded-md ${payment.socioCategory === 'juridica' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'}`}>
                  {payment.socioCategory === 'juridica' ? 'Persona Jurídica (Empresa/Industria)' : 'Persona Natural (Residente)'}
                </span>
              </div>
            </div>

            <div>
              <span className="text-xs text-slate-400 uppercase font-bold tracking-wider">Identificación Legal:</span>
              <p className="font-mono font-bold text-slate-800">{payment.identification}</p>
              <p className="text-xs text-slate-500 mt-1">
                Registrado por: <strong className="text-slate-700">{payment.registeredBy}</strong>
              </p>
            </div>
          </div>

          {/* Payment Items Breakdown */}
          <div className="border border-slate-200 rounded-xl overflow-hidden mb-6">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-100 text-slate-700 text-xs uppercase font-bold border-b border-slate-200">
                <tr>
                  <th className="px-4 py-3">Concepto y Detalle</th>
                  <th className="px-4 py-3">Período / Referencia</th>
                  <th className="px-4 py-3 text-right">Valor Pagado</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                <tr>
                  <td className="px-4 py-3.5">
                    <strong className="block text-slate-900">
                      {paymentTypeLabels[payment.paymentType] || 'Expensa Comunal'}
                    </strong>
                    <span className="text-xs text-slate-500">{payment.notes || 'Pago reglamentario al día.'}</span>
                  </td>
                  <td className="px-4 py-3.5">
                    <span className="font-medium text-slate-800">{payment.periodCovered}</span>
                    <span className="block text-[11px] text-slate-400 font-mono">Ref: {payment.referenceNumber}</span>
                  </td>
                  <td className="px-4 py-3.5 text-right font-black text-slate-900 text-base font-mono">
                    ${payment.amount.toFixed(2)}
                  </td>
                </tr>
              </tbody>
              <tfoot className="bg-emerald-50 text-emerald-950 font-bold border-t-2 border-emerald-600">
                <tr>
                  <td colSpan={2} className="px-4 py-3 text-right uppercase text-xs tracking-wider">
                    Total Cancelado en Dólares (USD):
                  </td>
                  <td className="px-4 py-3 text-right font-mono text-lg font-black text-emerald-800">
                    ${payment.amount.toFixed(2)}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>

          {/* Payment Method & Signatures */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-end pt-4 border-t border-slate-100">
            <div className="space-y-2 text-xs text-slate-600">
              <p>
                <strong>Forma de Pago:</strong> <span className="uppercase text-slate-800 font-semibold">{payment.paymentMethod.replace('_', ' ')}</span>
              </p>
              <p>
                <strong>Nro. Transacción / Depósito:</strong> <span className="font-mono text-slate-800">{payment.referenceNumber}</span>
              </p>
              <div className="flex items-center gap-1.5 text-emerald-700 font-medium mt-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Transacción verificada en tesorería barrial</span>
              </div>
            </div>

            <div className="text-center pt-8 border-t border-dashed border-slate-300">
              <div className="h-10 flex items-center justify-center">
                <span className="font-serif italic text-slate-400 text-sm">Directiva Central Itulcachi</span>
              </div>
              <div className="border-t border-slate-400 pt-1">
                <p className="font-bold text-xs text-slate-900">Tesorería / Recaudación Barrial</p>
                <p className="text-[10px] text-slate-400">Comprobante electrónico sin valor tributario SRI (Uso comunal interno)</p>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-between gap-3 px-8 py-4 bg-slate-50 border-t border-slate-200 print:hidden">
          <div className="text-xs text-slate-500 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Código de Seguridad: <strong className="font-mono text-slate-700">ITUL-{payment.id.slice(-6)}</strong></span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleShareWhatsApp}
              className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-emerald-700 bg-emerald-100 hover:bg-emerald-200 rounded-xl transition-colors cursor-pointer"
            >
              <Share2 className="w-4 h-4" />
              Compartir WhatsApp
            </button>
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-xl transition-colors shadow-sm cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              Imprimir / Guardar PDF
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
