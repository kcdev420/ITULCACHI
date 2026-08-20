import React, { useState } from 'react';
import { useBarrio } from '../context/BarrioContext';
import { MingaEvent, AttendanceRecord, EventType, AttendanceStatus } from '../types';
import {
  CalendarCheck,
  PlusCircle,
  Users,
  CheckCircle2,
  UserCheck,
  UserX,
  Clock,
  MapPin,
  Wrench,
  AlertCircle,
  Printer,
  Search,
  Lock,
  Sparkles,
  ShieldCheck,
  X,
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const MingasEventos: React.FC = () => {
  const {
    events,
    attendance,
    socios,
    createEvent,
    updateAttendanceStatus,
    closeMingaAttendance,
    currentRole,
  } = useBarrio();

  const [selectedEventId, setSelectedEventId] = useState<string>(events[0]?.id || '');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isNewEventModalOpen, setIsNewEventModalOpen] = useState(false);
  const [editingAttendanceRecord, setEditingAttendanceRecord] = useState<AttendanceRecord | null>(null);

  // Form for new Minga/Event
  const [eventForm, setEventForm] = useState({
    title: '',
    type: 'minga' as EventType,
    date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    time: '07:30 - 12:30',
    location: 'Casa Barrial de Itulcachi (Cancha Central)',
    description: '',
    requiredTools: 'Palas, Picos, Machetes, Guantes, Costales',
    fineAmountNatural: 15,
    fineAmountJuridica: 35,
  });

  const activeEvent = events.find(e => e.id === selectedEventId) || events[0];

  // Records for this event
  const currentAttendanceRecords = attendance.filter(a => a.eventId === activeEvent?.id);

  const filteredAttendance = currentAttendanceRecords.filter(rec => {
    const matchesSearch =
      rec.socioName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rec.identification.includes(searchQuery) ||
      rec.lotNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (rec.delegateName && rec.delegateName.toLowerCase().includes(searchQuery.toLowerCase()));

    if (!matchesSearch) return false;
    if (statusFilter !== 'all' && rec.status !== statusFilter) return false;

    return true;
  });

  const totalRegistered = currentAttendanceRecords.length;
  const presentCount = currentAttendanceRecords.filter(a => a.status === 'presente').length;
  const delegateCount = currentAttendanceRecords.filter(a => a.status === 'delegado').length;
  const excusedCount = currentAttendanceRecords.filter(a => a.status === 'justificado').length;
  const absentCount = currentAttendanceRecords.filter(a => a.status === 'ausente').length;
  const participationPercentage = totalRegistered > 0
    ? (((presentCount + delegateCount) / totalRegistered) * 100).toFixed(0)
    : '0';

  const handleCreateEventSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!eventForm.title || !eventForm.location) {
      alert('Por favor complete los campos obligatorios.');
      return;
    }

    const tools = eventForm.requiredTools
      .split(',')
      .map(t => t.trim())
      .filter(Boolean);

    createEvent({
      title: eventForm.title,
      type: eventForm.type,
      date: eventForm.date,
      time: eventForm.time,
      location: eventForm.location,
      description: eventForm.description,
      requiredTools: tools,
      fineAmountNatural: eventForm.fineAmountNatural,
      fineAmountJuridica: eventForm.fineAmountJuridica,
      status: 'programada',
    });

    setIsNewEventModalOpen(false);
  };

  const handleCloseAttendance = () => {
    if (!activeEvent) return;
    if (
      window.confirm(
        `¿Desea cerrar definitivamente el registro de asistencia para "${activeEvent.title}" y facturar automáticamente las multas de $${activeEvent.fineAmountNatural} / $${activeEvent.fineAmountJuridica} a los ${absentCount} socios ausentes?`
      )
    ) {
      closeMingaAttendance(activeEvent.id);
      confetti({ particleCount: 60, spread: 70 });
    }
  };

  const handlePrintAttendanceList = () => {
    window.print();
  };

  const getStatusBadge = (status: AttendanceStatus) => {
    switch (status) {
      case 'presente':
        return (
          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" />
            Presente
          </span>
        );
      case 'delegado':
        return (
          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800 border border-blue-300 flex items-center gap-1">
            <Users className="w-3 h-3" />
            Delegado / Cuadrilla
          </span>
        );
      case 'justificado':
        return (
          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-300 flex items-center gap-1">
            <AlertCircle className="w-3 h-3" />
            Justificado
          </span>
        );
      case 'ausente':
        return (
          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-800 border border-rose-300 flex items-center gap-1">
            <UserX className="w-3 h-3" />
            Ausente (Multa)
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <CalendarCheck className="w-6 h-6 text-emerald-600" />
            <h1 className="text-xl font-black text-slate-900">
              Agenda de Mingas y Asistencia Digital
            </h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Coordinación comunitaria del Barrio Itulcachi: registro en tiempo real de asistencia para socios naturales y cuadrillas de socios jurídicos.
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0 print:hidden">
          {currentRole === 'admin' && (
            <button
              onClick={() => setIsNewEventModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl transition-all shadow-sm cursor-pointer"
            >
              <PlusCircle className="w-4 h-4" />
              Agendar Minga / Asamblea
            </button>
          )}

          <button
            onClick={handlePrintAttendanceList}
            className="flex items-center gap-2 px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl transition-all cursor-pointer shadow-sm"
          >
            <Printer className="w-4 h-4" />
            Imprimir Acta de Asistencia
          </button>
        </div>
      </div>

      {/* Event Selector Ribbon */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {events.map(ev => {
          const isSelected = ev.id === activeEvent?.id;
          return (
            <button
              key={ev.id}
              onClick={() => setSelectedEventId(ev.id)}
              className={`p-4 rounded-2xl border text-left min-w-[280px] max-w-[320px] transition-all cursor-pointer ${
                isSelected
                  ? 'bg-emerald-900 text-white border-emerald-700 shadow-md ring-2 ring-emerald-500/40'
                  : 'bg-white text-slate-800 border-slate-200 hover:bg-slate-50'
              }`}
            >
              <div className="flex items-center justify-between gap-2 mb-1.5">
                <span
                  className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                    isSelected ? 'bg-emerald-700 text-emerald-200' : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  {ev.type}
                </span>
                <span className="text-[11px] font-mono font-bold">
                  {ev.date}
                </span>
              </div>
              <h3 className="font-bold text-xs line-clamp-1 leading-snug">
                {ev.title}
              </h3>
              <p className={`text-[11px] mt-1 flex items-center gap-1 ${isSelected ? 'text-emerald-300' : 'text-slate-500'}`}>
                <MapPin className="w-3 h-3 shrink-0" />
                <span className="line-clamp-1">{ev.location}</span>
              </p>
            </button>
          );
        })}
      </div>

      {/* Active Event Details & Live KPI Bar */}
      {activeEvent && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-6">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 pb-6 border-b border-slate-200">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 bg-emerald-100 text-emerald-800 text-xs font-bold rounded-md uppercase">
                  {activeEvent.type}
                </span>
                {activeEvent.attendanceClosed ? (
                  <span className="px-2.5 py-0.5 bg-slate-200 text-slate-700 text-xs font-bold rounded-md flex items-center gap-1">
                    <Lock className="w-3 h-3" />
                    Asistencia Cerrada & Multas Liquidadas
                  </span>
                ) : (
                  <span className="px-2.5 py-0.5 bg-emerald-600 text-white text-xs font-bold rounded-md flex items-center gap-1 animate-pulse">
                    <span className="w-2 h-2 rounded-full bg-white" />
                    Toma de Asistencia Activa en Vivo
                  </span>
                )}
              </div>
              <h2 className="text-lg font-black text-slate-900">
                {activeEvent.title}
              </h2>
              <p className="text-xs text-slate-600">
                {activeEvent.description}
              </p>
              <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 pt-1">
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  {activeEvent.time}
                </span>
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  {activeEvent.location}
                </span>
                {activeEvent.requiredTools && activeEvent.requiredTools.length > 0 && (
                  <span className="flex items-center gap-1 text-slate-700">
                    <Wrench className="w-3.5 h-3.5 text-emerald-600" />
                    Herramientas: {activeEvent.requiredTools.join(', ')}
                  </span>
                )}
              </div>
            </div>

            {/* Attendance Lock / Actions */}
            {currentRole === 'admin' && !activeEvent.attendanceClosed && (
              <button
                onClick={handleCloseAttendance}
                className="flex items-center gap-2 px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl transition-all shadow cursor-pointer shrink-0"
              >
                <Lock className="w-4 h-4 text-emerald-400" />
                Cerrar Asistencia y Liquidar Multas
              </button>
            )}
          </div>

          {/* KPI Attendance Gauges */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-center">
              <span className="text-[10px] text-slate-400 font-bold uppercase">Total Convocados</span>
              <div className="text-xl font-black text-slate-900 font-mono mt-1">{totalRegistered}</div>
            </div>
            <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-center">
              <span className="text-[10px] text-emerald-700 font-bold uppercase">Presentes Titulares</span>
              <div className="text-xl font-black text-emerald-800 font-mono mt-1">{presentCount}</div>
            </div>
            <div className="p-3 bg-blue-50 rounded-xl border border-blue-200 text-center">
              <span className="text-[10px] text-blue-700 font-bold uppercase">Delegados / Cuadrilla</span>
              <div className="text-xl font-black text-blue-800 font-mono mt-1">{delegateCount}</div>
            </div>
            <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-center">
              <span className="text-[10px] text-amber-700 font-bold uppercase">Justificados</span>
              <div className="text-xl font-black text-amber-800 font-mono mt-1">{excusedCount}</div>
            </div>
            <div className="p-3 bg-rose-50 rounded-xl border border-rose-200 text-center col-span-2 sm:col-span-1">
              <span className="text-[10px] text-rose-700 font-bold uppercase">Ausentes (Multa ${activeEvent.fineAmountNatural}/${activeEvent.fineAmountJuridica})</span>
              <div className="text-xl font-black text-rose-800 font-mono mt-1">{absentCount}</div>
            </div>
          </div>

          {/* Participation Progress Bar */}
          <div>
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="font-bold text-slate-700">Participación Comunitaria Total:</span>
              <span className="font-mono font-black text-emerald-800 text-sm">{participationPercentage}% de quorum</span>
            </div>
            <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
              <div
                className="bg-emerald-600 h-full rounded-full transition-all duration-300"
                style={{ width: `${participationPercentage}%` }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Live Attendance List Table */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
        {/* Search & Filter Bar */}
        <div className="p-4 bg-slate-50 border-b border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Buscar socio, cédula o lote para check-in..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-emerald-500"
            />
          </div>

          <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto text-xs">
            <button
              onClick={() => setStatusFilter('all')}
              className={`px-3 py-1 rounded-lg font-semibold transition-colors cursor-pointer ${
                statusFilter === 'all' ? 'bg-slate-900 text-white font-bold' : 'bg-white text-slate-600 hover:bg-slate-200'
              }`}
            >
              Todos ({currentAttendanceRecords.length})
            </button>
            <button
              onClick={() => setStatusFilter('presente')}
              className={`px-3 py-1 rounded-lg font-semibold transition-colors cursor-pointer ${
                statusFilter === 'presente' ? 'bg-emerald-700 text-white font-bold' : 'bg-white text-emerald-700 hover:bg-emerald-50'
              }`}
            >
              Presentes ({presentCount})
            </button>
            <button
              onClick={() => setStatusFilter('delegado')}
              className={`px-3 py-1 rounded-lg font-semibold transition-colors cursor-pointer ${
                statusFilter === 'delegado' ? 'bg-blue-700 text-white font-bold' : 'bg-white text-blue-700 hover:bg-blue-50'
              }`}
            >
              Delegados ({delegateCount})
            </button>
            <button
              onClick={() => setStatusFilter('ausente')}
              className={`px-3 py-1 rounded-lg font-semibold transition-colors cursor-pointer ${
                statusFilter === 'ausente' ? 'bg-rose-700 text-white font-bold' : 'bg-white text-rose-700 hover:bg-rose-50'
              }`}
            >
              Ausentes ({absentCount})
            </button>
          </div>
        </div>

        {/* Table Body */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-100 text-slate-600 uppercase font-bold border-b border-slate-200 text-[10px]">
              <tr>
                <th className="px-4 py-3">Socio / Empresa</th>
                <th className="px-4 py-3">Predio / Sector</th>
                <th className="px-4 py-3">Hora Check-in</th>
                <th className="px-4 py-3">Delegado / Justificación</th>
                <th className="px-4 py-3">Estado Actual</th>
                {currentRole === 'admin' && !activeEvent?.attendanceClosed && (
                  <th className="px-4 py-3 text-center print:hidden">Marcación Rápida (Check-in)</th>
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredAttendance.map(record => {
                const isJuridica = record.socioCategory === 'juridica';

                return (
                  <tr key={record.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-1.5">
                        <span
                          className={`px-1.5 py-0.5 rounded text-[9px] font-bold uppercase ${
                            isJuridica ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'
                          }`}
                        >
                          {isJuridica ? 'Empresa' : 'Natural'}
                        </span>
                        <strong className="text-slate-900">{record.socioName}</strong>
                      </div>
                      <span className="text-[10px] text-slate-400 font-mono block ml-12">
                        {record.identification}
                      </span>
                    </td>

                    <td className="px-4 py-3.5 text-slate-600">
                      {record.lotNumber}
                    </td>

                    <td className="px-4 py-3.5 font-mono text-slate-600">
                      {record.checkInTime || '-'}
                    </td>

                    <td className="px-4 py-3.5">
                      {record.delegateName && (
                        <span className="text-blue-800 font-medium block">
                          Delegado: {record.delegateName}
                        </span>
                      )}
                      {record.justificationReason && (
                        <span className="text-amber-800 italic block">
                          Motivo: {record.justificationReason}
                        </span>
                      )}
                      {!record.delegateName && !record.justificationReason && (
                        <span className="text-slate-400">-</span>
                      )}
                    </td>

                    <td className="px-4 py-3.5">
                      {getStatusBadge(record.status)}
                    </td>

                    {/* Quick Live Check-In Buttons for Admin */}
                    {currentRole === 'admin' && !activeEvent?.attendanceClosed && (
                      <td className="px-4 py-3.5 text-center print:hidden">
                        <div className="inline-flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200">
                          <button
                            onClick={() => updateAttendanceStatus(record.eventId, record.socioId, 'presente')}
                            title="Marcar Presente Titular"
                            className={`px-2 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                              record.status === 'presente'
                                ? 'bg-emerald-600 text-white shadow-xs'
                                : 'text-slate-600 hover:text-emerald-700 hover:bg-emerald-50'
                            }`}
                          >
                            Presente
                          </button>
                          <button
                            onClick={() => setEditingAttendanceRecord(record)}
                            title="Registrar Delegado / Cuadrilla"
                            className={`px-2 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                              record.status === 'delegado'
                                ? 'bg-blue-600 text-white shadow-xs'
                                : 'text-slate-600 hover:text-blue-700 hover:bg-blue-50'
                            }`}
                          >
                            Delegado
                          </button>
                          <button
                            onClick={() => setEditingAttendanceRecord(record)}
                            title="Registrar Justificación"
                            className={`px-2 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                              record.status === 'justificado'
                                ? 'bg-amber-600 text-white shadow-xs'
                                : 'text-slate-600 hover:text-amber-700 hover:bg-amber-50'
                            }`}
                          >
                            Justificar
                          </button>
                          <button
                            onClick={() => updateAttendanceStatus(record.eventId, record.socioId, 'ausente')}
                            title="Marcar Ausente"
                            className={`px-2 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                              record.status === 'ausente'
                                ? 'bg-rose-600 text-white shadow-xs'
                                : 'text-slate-600 hover:text-rose-700 hover:bg-rose-50'
                            }`}
                          >
                            Ausente
                          </button>
                        </div>
                      </td>
                    )}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Delegate / Justification Details Modal */}
      {editingAttendanceRecord && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
          <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-8 animate-in fade-in zoom-in duration-200">
            <div className="flex items-center justify-between px-6 py-4 bg-slate-900 text-white">
              <h3 className="font-bold text-sm">Detalle de Asistencia: {editingAttendanceRecord.socioName}</h3>
              <button
                onClick={() => setEditingAttendanceRecord(null)}
                className="p-1 text-slate-400 hover:text-white rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  Nombre del Delegado / Encargado de Cuadrilla:
                </label>
                <input
                  type="text"
                  placeholder="Ej: Jhonny Tipán (Hijo) o Cuadrilla 3 operarios"
                  defaultValue={editingAttendanceRecord.delegateName || ''}
                  id="delegateInput"
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-slate-900 focus:outline-emerald-500"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  Motivo de Justificación (si aplica):
                </label>
                <textarea
                  rows={2}
                  placeholder="Ej: Calamidad doméstica o cita médica presentada con documento..."
                  defaultValue={editingAttendanceRecord.justificationReason || ''}
                  id="justificationInput"
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-slate-900 focus:outline-emerald-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setEditingAttendanceRecord(null)}
                  className="px-4 py-2 font-semibold text-slate-600 hover:bg-slate-100 rounded-xl cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const del = (document.getElementById('delegateInput') as HTMLInputElement)?.value;
                    const just = (document.getElementById('justificationInput') as HTMLTextAreaElement)?.value;
                    const newStatus: AttendanceStatus = del ? 'delegado' : just ? 'justificado' : 'presente';

                    updateAttendanceStatus(
                      editingAttendanceRecord.eventId,
                      editingAttendanceRecord.socioId,
                      newStatus,
                      { delegateName: del, justificationReason: just }
                    );
                    setEditingAttendanceRecord(null);
                  }}
                  className="px-4 py-2 font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl cursor-pointer"
                >
                  Guardar Registro
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Program New Event Modal */}
      {isNewEventModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
          <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-8 animate-in fade-in zoom-in duration-200">
            <div className="flex items-center justify-between px-6 py-4 bg-slate-900 text-white">
              <div className="flex items-center gap-2">
                <CalendarCheck className="w-5 h-5 text-emerald-400" />
                <h3 className="font-bold text-sm">Agendar Nueva Minga o Asamblea</h3>
              </div>
              <button
                onClick={() => setIsNewEventModalOpen(false)}
                className="p-1 text-slate-400 hover:text-white rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateEventSubmit} className="p-6 space-y-4 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  Tipo de Convocatoria *
                </label>
                <select
                  value={eventForm.type}
                  onChange={e => setEventForm({ ...eventForm, type: e.target.value as EventType })}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-slate-900 focus:outline-emerald-500 cursor-pointer"
                >
                  <option value="minga">Minga de Trabajo Comunitario</option>
                  <option value="asamblea">Asamblea General Ordinaria / Extraordinaria</option>
                  <option value="evento_social">Evento Social / Festividades Barriales</option>
                  <option value="capacitacion">Capacitación Vecinal / Simulacro</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  Título del Evento *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ej: Minga de Bacheo Vía Principal o Asamblea de Presupuesto"
                  value={eventForm.title}
                  onChange={e => setEventForm({ ...eventForm, title: e.target.value })}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-slate-900 focus:outline-emerald-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    Fecha de Realización *
                  </label>
                  <input
                    type="date"
                    required
                    value={eventForm.date}
                    onChange={e => setEventForm({ ...eventForm, date: e.target.value })}
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-slate-900 focus:outline-emerald-500"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    Horario *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ej: 07:30 - 12:30"
                    value={eventForm.time}
                    onChange={e => setEventForm({ ...eventForm, time: e.target.value })}
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-slate-900 focus:outline-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  Lugar / Punto de Concentración *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ej: Casa Barrial de Itulcachi o Quebrada La Chorrera"
                  value={eventForm.location}
                  onChange={e => setEventForm({ ...eventForm, location: e.target.value })}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-slate-900 focus:outline-emerald-500"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  Descripción y Objetivos:
                </label>
                <textarea
                  rows={2}
                  placeholder="Describa las tareas a realizar y disposiciones generales..."
                  value={eventForm.description}
                  onChange={e => setEventForm({ ...eventForm, description: e.target.value })}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-slate-900 focus:outline-emerald-500"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  Herramientas e Insumos Requeridos (separados por coma):
                </label>
                <input
                  type="text"
                  placeholder="Palas, Picos, Machetes, Guantes, Costales"
                  value={eventForm.requiredTools}
                  onChange={e => setEventForm({ ...eventForm, requiredTools: e.target.value })}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-slate-900 focus:outline-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    Multa Inasistencia Natural ($):
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={eventForm.fineAmountNatural}
                    onChange={e => setEventForm({ ...eventForm, fineAmountNatural: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-slate-900 font-mono font-bold focus:outline-emerald-500"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    Multa Inasistencia Jurídica ($):
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={eventForm.fineAmountJuridica}
                    onChange={e => setEventForm({ ...eventForm, fineAmountJuridica: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-slate-900 font-mono font-bold focus:outline-emerald-500"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsNewEventModalOpen(false)}
                  className="px-4 py-2 font-semibold text-slate-600 hover:bg-slate-100 rounded-xl cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl transition-all shadow cursor-pointer"
                >
                  Publicar y Generar Padrón de Asistencia
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
