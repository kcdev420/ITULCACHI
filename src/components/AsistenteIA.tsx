import React, { useState } from 'react';
import { useBarrio } from '../context/BarrioContext';
import {
  Sparkles,
  FileText,
  Send,
  Copy,
  Printer,
  CheckCircle2,
  RefreshCw,
  Building,
  Calendar,
  AlertTriangle,
  BookOpen,
} from 'lucide-react';

export const AsistenteIA: React.FC = () => {
  const { socios, payments, expenses, events } = useBarrio();

  const [documentType, setDocumentType] = useState<string>('convocatoria_minga');
  const [customPrompt, setCustomPrompt] = useState<string>('');
  const [generatedDocument, setGeneratedDocument] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Financial summary for context
  const totalIncome = payments.reduce((acc, p) => acc + p.amount, 0);
  const totalExpenses = expenses.reduce((acc, e) => acc + e.amount, 0);
  const currentCash = totalIncome - totalExpenses;
  const nextEvent = events.find(e => e.status === 'programada');

  const templates = [
    {
      id: 'convocatoria_minga',
      title: 'Convocatoria a Minga Barrial',
      icon: Calendar,
      desc: 'Redacta la convocatoria formal con fecha, herramientas, multas ($15 natural / $35 jurídica) y punto de encuentro.',
      defaultPrompt: `Redacta una convocatoria formal y motivadora para la minga del próximo domingo en el Barrio Itulcachi. Recuerda especificar que la asistencia es obligatoria para socios naturales y que las empresas jurídicas deben enviar su cuadrilla de apoyo.`,
    },
    {
      id: 'oficio_gad_pifo',
      title: 'Oficio al GAD Parroquial de Pifo',
      icon: Building,
      desc: 'Solicitud formal para bacheo vial, maquinaria pesada o luminarias públicas.',
      defaultPrompt: `Redacta un oficio formal dirigido al Presidente del GAD Parroquial de Pifo solicitando maquinaria pesada (motoniveladora y rodillo) y material pétreo para el mantenimiento de la vía principal de acceso a Itulcachi y conexión con el Parque Industrial.`,
    },
    {
      id: 'acta_asamblea',
      title: 'Acta de Asamblea General',
      icon: FileText,
      desc: 'Estructura oficial de un acta con orden del día, informe de tesorería y resoluciones.',
      defaultPrompt: `Redacta el acta de asamblea general del Barrio Itulcachi celebrada en la Casa Barrial. Incluye la aprobación del informe económico con saldo a favor de $${currentCash.toFixed(2)} y el acuerdo de cuota extraordinaria para la iluminación comunal.`,
    },
    {
      id: 'oficio_policia_upc',
      title: 'Solicitud de Seguridad a UPC Pifo',
      icon: AlertTriangle,
      desc: 'Petición formal de patrullaje preventivo y rondas en horarios críticos.',
      defaultPrompt: `Redacta una carta dirigida al Jefe del UPC de Pifo solicitando patrullajes nocturnos y rondas preventivas en el sector central y zonas colindantes al Parque Industrial de Itulcachi para salvaguardar a las familias y predios.`,
    },
  ];

  const handleSelectTemplate = (templateId: string) => {
    setDocumentType(templateId);
    const tmpl = templates.find(t => t.id === templateId);
    if (tmpl) {
      setCustomPrompt(tmpl.defaultPrompt);
    }
  };

  const handleGenerate = async () => {
    setLoading(true);
    setErrorMsg(null);
    setCopied(false);

    try {
      const response = await fetch('/api/gemini/assist', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          documentType,
          prompt: customPrompt,
          contextData: {
            barrioName: 'Barrio Itulcachi (Parroquia Pifo)',
            sociosCount: socios.length,
            totalIncome,
            totalExpenses,
            currentBalance: currentCash,
            nextEvent: nextEvent
              ? `${nextEvent.title} (${nextEvent.date} a las ${nextEvent.time}) en ${nextEvent.location}`
              : 'Ninguno programado',
          },
        }),
      });

      if (!response.ok) {
        throw new Error('Error al contactar con el servidor de IA.');
      }

      const data = await response.json();
      setGeneratedDocument(data.document);
    } catch (err: any) {
      setErrorMsg(err.message || 'Ocurrió un error inesperado');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedDocument);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>Documento Oficial - Barrio Itulcachi</title>
            <style>
              body { font-family: 'Times New Roman', serif; padding: 40px; line-height: 1.6; color: #111; max-width: 800px; margin: 0 auto; }
              .header { text-align: center; border-bottom: 2px solid #333; padding-bottom: 15px; margin-bottom: 30px; }
              .header h1 { margin: 0; font-size: 20px; text-transform: uppercase; }
              .header p { margin: 4px 0; font-size: 13px; color: #444; }
              .content { white-space: pre-wrap; font-size: 14px; text-align: justify; }
              .footer { margin-top: 60px; text-align: center; display: flex; justify-content: space-around; }
              .signature { border-top: 1px solid #333; width: 220px; padding-top: 8px; margin: 0 auto; font-size: 12px; }
            </style>
          </head>
          <body>
            <div class="header">
              <h1>Directiva Central Barrio Itulcachi</h1>
              <p>Parroquia Pifo - Distrito Metropolitano de Quito - Ecuador</p>
              <p>Personería Jurídica Comunal • Fundado para el Progreso y Bienestar Vecinal</p>
            </div>
            <div class="content">${generatedDocument}</div>
            <div class="footer" style="margin-top: 80px; display: grid; grid-template-columns: 1fr 1fr; gap: 40px;">
              <div class="signature">
                <strong>PRESIDENTE BARRIAL</strong><br/>
                Barrio Itulcachi
              </div>
              <div class="signature">
                <strong>SECRETARÍA / TESORERÍA</strong><br/>
                Barrio Itulcachi
              </div>
            </div>
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.focus();
      printWindow.print();
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-6 sm:p-8 rounded-2xl border border-indigo-900/50 shadow-xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-500/20 text-amber-300 rounded-full text-xs font-semibold border border-amber-500/30 mb-2">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              Impulsado por Google Gemini 2.5 Flash
            </div>
            <h1 className="text-2xl font-black tracking-tight">
              Asesor Virtual y Redactor de Documentos Comunitarios
            </h1>
            <p className="text-xs text-slate-300 max-w-2xl mt-1">
              Generador inteligente de convocatorias a mingas, oficios dirigidos a entidades públicas (GAD Pifo, Municipio, Policía), actas de asamblea y notificaciones con formato legal ecuatoriano.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column (5 cols): Template Selection & Prompt */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              1. Seleccione el Tipo de Documento
            </h2>

            <div className="space-y-2">
              {templates.map(tmpl => {
                const IconComponent = tmpl.icon;
                const isSelected = documentType === tmpl.id;

                return (
                  <button
                    key={tmpl.id}
                    onClick={() => handleSelectTemplate(tmpl.id)}
                    className={`w-full p-3 rounded-xl border text-left transition-all cursor-pointer flex items-start gap-3 ${
                      isSelected
                        ? 'bg-indigo-50 border-indigo-500 text-indigo-950 ring-1 ring-indigo-500'
                        : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <div className={`p-2 rounded-lg ${isSelected ? 'bg-indigo-600 text-white' : 'bg-slate-200 text-slate-600'}`}>
                      <IconComponent className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-xs">{tmpl.title}</h4>
                      <p className="text-[11px] text-slate-500 line-clamp-2 mt-0.5">{tmpl.desc}</p>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Prompt Input */}
            <div className="pt-2">
              <label className="text-xs font-bold text-slate-700 block mb-1">
                2. Instrucciones o Detalles Adicionales para la IA:
              </label>
              <textarea
                rows={4}
                value={customPrompt}
                onChange={e => setCustomPrompt(e.target.value)}
                placeholder="Indique fecha, personas a notificar, herramientas requeridas, o temas a tratar..."
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-indigo-500 leading-relaxed"
              />
            </div>

            {/* Generate Button */}
            <button
              onClick={handleGenerate}
              disabled={loading}
              className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-bold text-xs rounded-xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  Redactando Documento con IA...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-amber-300" />
                  Generar Documento Oficial
                </>
              )}
            </button>

            {errorMsg && (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-800 text-xs">
                {errorMsg}
              </div>
            )}
          </div>

          {/* Quick Guidance Box */}
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-xs text-slate-600 space-y-1.5">
            <div className="flex items-center gap-1.5 font-bold text-slate-800">
              <BookOpen className="w-4 h-4 text-indigo-600" />
              Sustento Normativo Comunal
            </div>
            <p className="text-[11px] leading-relaxed">
              Los documentos generados cumplen con la normativa del <strong>Código Orgánico de Organización Territorial (COOTAD)</strong> y la <strong>Ley Orgánica de Participación Ciudadana</strong> para cabildos y directivas barriales en Ecuador.
            </p>
          </div>
        </div>

        {/* Right Column (7 cols): Document Output Preview */}
        <div className="lg:col-span-7">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs flex flex-col h-full min-h-[500px]">
            {/* Output Header */}
            <div className="flex items-center justify-between p-4 border-b border-slate-200 bg-slate-50 rounded-t-2xl">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-indigo-600" />
                <h3 className="font-bold text-xs text-slate-900">
                  Vista Previa del Documento Redactado
                </h3>
              </div>

              {generatedDocument && (
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleCopy}
                    className="flex items-center gap-1 px-3 py-1.5 bg-white hover:bg-slate-100 text-slate-700 font-bold text-xs rounded-lg border border-slate-200 transition-colors cursor-pointer"
                  >
                    {copied ? (
                      <>
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        Copiado
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        Copiar
                      </>
                    )}
                  </button>

                  <button
                    onClick={handlePrint}
                    className="flex items-center gap-1 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-lg transition-colors cursor-pointer"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    Imprimir con Membrete
                  </button>
                </div>
              )}
            </div>

            {/* Output Body */}
            <div className="p-6 flex-1 bg-white font-serif text-slate-800 text-xs sm:text-sm leading-relaxed overflow-y-auto whitespace-pre-wrap">
              {loading ? (
                <div className="flex flex-col items-center justify-center h-64 text-slate-400 space-y-3 font-sans">
                  <div className="w-10 h-10 border-3 border-indigo-600 border-t-transparent rounded-full animate-spin" />
                  <p className="text-xs font-semibold text-slate-600">
                    Procesando parámetros comunitarios de Itulcachi y redactando...
                  </p>
                </div>
              ) : generatedDocument ? (
                generatedDocument
              ) : (
                <div className="flex flex-col items-center justify-center h-64 text-slate-400 text-center font-sans space-y-2">
                  <FileText className="w-12 h-12 text-slate-200" />
                  <p className="text-xs font-semibold text-slate-500">
                    Seleccione una plantilla a la izquierda y presione "Generar Documento Oficial".
                  </p>
                  <p className="text-[11px] text-slate-400 max-w-sm">
                    El asistente redactará automáticamente un borrador estructurado con membrete del Barrio Itulcachi.
                  </p>
                </div>
              )}
            </div>

            {/* Document Footer Signature Preview */}
            {generatedDocument && (
              <div className="p-4 bg-slate-50 border-t border-slate-200 text-center text-[11px] text-slate-500 font-sans">
                Directiva Central Itulcachi • Pifo - Quito, Ecuador
              </div>
            )}
          </div>
        </div>

      </div>

    </div>
  );
};
