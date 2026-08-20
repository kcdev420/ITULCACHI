import React from 'react';
import { Socio } from '../types';
import { Printer, ShieldCheck, CheckCircle, X, QrCode } from 'lucide-react';

interface CertificadoSolvenciaModalProps {
  socio: Socio | null;
  onClose: () => void;
}

export const CertificadoSolvenciaModal: React.FC<CertificadoSolvenciaModalProps> = ({ socio, onClose }) => {
  if (!socio) return null;

  const handlePrint = () => {
    window.print();
  };

  const today = new Date();
  const dateFormatted = today.toLocaleDateString('es-EC', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const validUntil = new Date(today);
  validUntil.setMonth(validUntil.getMonth() + 1);
  const validUntilFormatted = validUntil.toLocaleDateString('es-EC', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const certCode = `CERT-SOLV-${today.getFullYear()}-${socio.code}-${Math.floor(1000 + Math.random() * 9000)}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-8 animate-in fade-in zoom-in duration-200">
        
        {/* Header bar */}
        <div className="flex items-center justify-between px-6 py-4 bg-slate-900 text-white print:hidden">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            <span className="font-semibold text-sm">Certificado Oficial de Solvencia Vecinal</span>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Certificate Body (Formal Document Style) */}
        <div className="p-10 bg-[#fdfcf9] text-slate-800 border-8 border-double border-slate-300 m-4 rounded-xl relative shadow-inner">
          {/* Watermark effect */}
          <div className="absolute inset-0 flex items-center justify-center opacity-4 pointer-events-none select-none">
            <span className="text-8xl font-black tracking-widest text-slate-900 rotate-[-25deg]">
              ITULCACHI
            </span>
          </div>

          {/* Official Header */}
          <div className="text-center pb-6 border-b border-slate-300">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-emerald-800 text-white font-bold text-2xl mb-3 shadow">
              BI
            </div>
            <h1 className="text-2xl font-black tracking-tight text-slate-900 uppercase">
              Directiva Central del Barrio Itulcachi
            </h1>
            <p className="text-xs font-semibold text-slate-600 uppercase tracking-widest">
              Parroquia Pifo • Cantón Quito • Provincia de Pichincha
            </p>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Acuerdo Ministerial de Organización Comunitaria N° 0492-GAD • RUC: 1792940214001
            </p>
          </div>

          {/* Title */}
          <div className="text-center my-6">
            <span className="inline-block px-4 py-1 text-xs font-bold uppercase tracking-widest bg-emerald-100 text-emerald-800 border border-emerald-300 rounded-full mb-2">
              Documento Oficial de No Adeudar
            </span>
            <h2 className="text-xl font-extrabold text-slate-900 uppercase tracking-wide">
              Certificado de Solvencia Comunal
            </h2>
            <p className="text-xs font-mono text-slate-500 mt-1 font-semibold">
              Código de Emisión: {certCode}
            </p>
          </div>

          {/* Text Statement */}
          <div className="text-justify text-sm leading-relaxed space-y-4 text-slate-700 font-serif">
            <p>
              La <strong>DIRECTIVA CENTRAL DEL BARRIO ITULCACHI</strong>, en uso de las facultades estatutarias y reglamentarias que le confiere la Asamblea General de Socios Comunitarios:
            </p>

            <p className="bg-emerald-50/70 p-4 rounded-xl border border-emerald-200 text-slate-900 not-italic font-sans">
              <strong>CERTIFICA QUE:</strong> El socio(a) <strong>{socio.fullNameOrCompany}</strong>
              {socio.tradeName && <span> (Nombre Comercial: <strong>{socio.tradeName}</strong>)</span>}
              , portador(a) del documento de identificación <strong>{socio.category === 'juridica' ? 'RUC' : 'Cédula de Ciudadanía'} Nro. {socio.identification}</strong>
              {socio.representativeName && <span> debidamente representado por el/la <strong>{socio.representativeName}</strong> (C.I. {socio.representativeId})</span>}
              , propietario / posesionario del predio ubicado en el <strong>{socio.sector}</strong>, designado como <strong>{socio.lotNumber}</strong>, perteneciente a la jurisdicción de nuestra comunidad:
            </p>

            <div className="p-3 bg-white rounded-lg border border-slate-200 flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                <CheckCircle className="w-5 h-5" />
              </div>
              <p className="text-xs font-sans text-emerald-900 font-semibold m-0">
                Se encuentra <strong>COMPLETAMENTE AL DÍA Y SOLVENTE</strong> en el pago de sus alícuotas y expensas ordinarias, cuotas extraordinarias de obras y asistencia/compensación de mingas comunitarias hasta la presente fecha.
              </p>
            </div>

            <p>
              El presente certificado se expide a solicitud de la parte interesada para los fines pertinentes ante el <strong>Municipio del Distrito Metropolitano de Quito</strong>, <strong>GAD Parroquial de Pifo</strong>, notarías, empresas de servicios básicos o instituciones que lo requieran.
            </p>

            <p className="text-xs text-slate-500 font-sans">
              * Válido por 30 días calendario hasta el: <strong>{validUntilFormatted}</strong>.
            </p>
          </div>

          {/* Signatures & Seal */}
          <div className="grid grid-cols-2 gap-8 pt-12 mt-6 border-t border-slate-200 text-center font-sans text-xs">
            <div>
              <div className="h-12 flex items-end justify-center pb-2">
                <span className="font-serif italic text-slate-400 text-sm">Sr. Segundo Tipán G.</span>
              </div>
              <div className="border-t-2 border-slate-800 pt-1">
                <p className="font-bold text-slate-900">Presidente del Barrio Itulcachi</p>
                <p className="text-[10px] text-slate-500">C.I. 1712458921</p>
              </div>
            </div>

            <div>
              <div className="h-12 flex items-end justify-center pb-2">
                <span className="font-serif italic text-slate-400 text-sm">Lcda. Rosaura Quishpe T.</span>
              </div>
              <div className="border-t-2 border-slate-800 pt-1">
                <p className="font-bold text-slate-900">Secretaría / Tesorería General</p>
                <p className="text-[10px] text-slate-500">C.I. 1709321456</p>
              </div>
            </div>
          </div>

          {/* Validation Foot */}
          <div className="mt-8 pt-4 border-t border-slate-200 flex items-center justify-between text-[11px] text-slate-400">
            <div className="flex items-center gap-2">
              <QrCode className="w-6 h-6 text-slate-600" />
              <span>Verificación electrónica en línea: <strong>itulcachi.gob.ec/verificar/{certCode}</strong></span>
            </div>
            <div>
              Itulcachi, {dateFormatted}
            </div>
          </div>
        </div>

        {/* Modal Buttons */}
        <div className="flex items-center justify-end gap-3 px-8 py-4 bg-slate-50 border-t border-slate-200 print:hidden">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer"
          >
            Cerrar
          </button>
          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-5 py-2.5 text-xs font-bold text-white bg-emerald-700 hover:bg-emerald-800 rounded-xl transition-colors shadow cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            Imprimir Certificado Oficial (PDF)
          </button>
        </div>

      </div>
    </div>
  );
};
