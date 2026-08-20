import React, { useState } from 'react';
import { useBarrio } from '../context/BarrioContext';
import { CommunityAreaReservation, NeighborhoodIncident, IncidentPriority, IncidentStatus } from '../types';
import {
  Building2,
  Calendar,
  AlertTriangle,
  PlusCircle,
  Clock,
  MapPin,
  CheckCircle2,
  ShieldCheck,
  Flame,
  MessageSquare,
  X,
  Sparkles,
  Users,
} from 'lucide-react';

export const ComunidadIncidencias: React.FC = () => {
  const {
    reservations,
    incidents,
    socios,
    createReservation,
    addIncident,
    updateIncidentStatus,
    currentRole,
  } = useBarrio();

  const [activeSubTab, setActiveSubTab] = useState<'areas' | 'novedades'>('areas');
  const [isReserveModalOpen, setIsReserveModalOpen] = useState(false);
  const [isIncidentModalOpen, setIsIncidentModalOpen] = useState(false);

  // Reservation Form
  const [reserveForm, setReserveForm] = useState({
    areaName: 'Casa Barrial de Itulcachi (Salón Principal)',
    socioId: socios[0]?.id || '',
    date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    startTime: '14:00',
    endTime: '20:00',
    purpose: '',
    fee: 25,
    deposit: 30,
  });

  // Incident Form
  const [incidentForm, setIncidentForm] = useState({
    title: '',
    description: '',
    location: 'Sector Central (Vía Principal)',
    priority: 'media' as IncidentPriority,
    reportedBy: 'Vecino del Sector',
    category: 'Vías & Tránsito',
  });

  const communitySpaces = [
    {
      name: 'Casa Barrial de Itulcachi (Salón Principal)',
      capacity: '120 personas',
      fee: '$25 / evento',
      deposit: '$30 garantía',
      features: ['Sillas y mesas', 'Cocina básica', 'Equipo de amplificación', 'Baños comunitarios'],
      status: 'Disponible para socios al día',
    },
    {
      name: 'Cancha de Césped Sintético y Polideportivo',
      capacity: '20 personas',
      fee: '$10 / hora nocturna ($0 socios de día)',
      deposit: '$10 garantía de llaves',
      features: ['Iluminación LED', 'Arcos reglamentarios', 'Camerinos'],
      status: 'Disponible',
    },
    {
      name: 'Área de Juegos Infantiles y Parque Central',
      capacity: 'Uso libre',
      fee: '$0 (Gratuito)',
      deposit: 'Cuidado comunal',
      features: ['Juegos infantiles', 'Bancas', 'Áreas verdes'],
      status: 'Abierto 24/7',
    },
  ];

  const handleReserveSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const selectedSocio = socios.find(s => s.id === reserveForm.socioId) || socios[0];
    if (!selectedSocio || !reserveForm.purpose) {
      alert('Por favor complete los datos requeridos.');
      return;
    }

    createReservation({
      areaName: reserveForm.areaName,
      socioId: selectedSocio.id,
      socioName: selectedSocio.fullNameOrCompany,
      date: reserveForm.date,
      startTime: reserveForm.startTime,
      endTime: reserveForm.endTime,
      purpose: reserveForm.purpose,
      fee: reserveForm.fee,
      deposit: reserveForm.deposit,
    });

    setIsReserveModalOpen(false);
  };

  const handleIncidentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!incidentForm.title || !incidentForm.description) {
      alert('Por favor complete el título y detalle del reporte.');
      return;
    }

    addIncident({
      title: incidentForm.title,
      description: incidentForm.description,
      location: incidentForm.location,
      priority: incidentForm.priority,
      reportedBy: incidentForm.reportedBy,
      status: 'pendiente',
    });

    setIsIncidentModalOpen(false);
    setIncidentForm({
      title: '',
      description: '',
      location: 'Sector Central (Vía Principal)',
      priority: 'media',
      reportedBy: 'Vecino del Sector',
      category: 'Vías & Tránsito',
    });
  };

  return (
    <div className="space-y-6">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <Building2 className="w-6 h-6 text-emerald-600" />
            <h1 className="text-xl font-black text-slate-900">
              Espacios Comunitarios y Seguridad Barrial
            </h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Gestión de reservas para la Casa Barrial, polideportivo y canal de alertas comunitarias de Itulcachi.
          </p>
        </div>

        {/* Sub-tab toggle */}
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs">
          <button
            onClick={() => setActiveSubTab('areas')}
            className={`px-4 py-2 rounded-lg font-bold transition-all cursor-pointer ${
              activeSubTab === 'areas'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Áreas Comunales ({reservations.length})
          </button>
          <button
            onClick={() => setActiveSubTab('novedades')}
            className={`px-4 py-2 rounded-lg font-bold transition-all cursor-pointer ${
              activeSubTab === 'novedades'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Alertas & Vías ({incidents.length})
          </button>
        </div>
      </div>

      {/* VIEW 1: Community Areas & Reservations */}
      {activeSubTab === 'areas' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          {/* Available Spaces Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {communitySpaces.map((space, idx) => (
              <div key={idx} className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      {space.capacity}
                    </span>
                    <span className="text-xs font-mono font-bold text-slate-900">{space.fee}</span>
                  </div>
                  <h3 className="font-bold text-slate-900 text-sm mb-2">{space.name}</h3>
                  <div className="space-y-1 text-xs text-slate-600">
                    {space.features.map((f, i) => (
                      <div key={i} className="flex items-center gap-1.5 text-slate-600">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span>{f}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[11px] text-slate-400">Garantía: {space.deposit}</span>
                  <button
                    onClick={() => {
                      setReserveForm(prev => ({ ...prev, areaName: space.name }));
                      setIsReserveModalOpen(true);
                    }}
                    className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl transition-colors cursor-pointer"
                  >
                    Agendar Reserva
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Active Reservations Calendar Table */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-emerald-600" />
                <h3 className="font-bold text-slate-900 text-base">
                  Cronograma de Reservas Confirmadas
                </h3>
              </div>

              <button
                onClick={() => setIsReserveModalOpen(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl cursor-pointer"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                Nueva Solicitud
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-500 uppercase font-bold border-b border-slate-200 text-[10px]">
                  <tr>
                    <th className="px-4 py-3">Espacio Comunal</th>
                    <th className="px-4 py-3">Fecha & Horario</th>
                    <th className="px-4 py-3">Socio Responsable</th>
                    <th className="px-4 py-3">Finalidad del Evento</th>
                    <th className="px-4 py-3">Aporte & Garantía</th>
                    <th className="px-4 py-3">Estado</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {reservations.map(res => (
                    <tr key={res.id} className="hover:bg-slate-50/80">
                      <td className="px-4 py-3.5 font-bold text-slate-900">{res.areaName}</td>
                      <td className="px-4 py-3.5 font-mono">
                        <span className="font-bold text-slate-800 block">{res.date}</span>
                        <span className="text-[11px] text-slate-500">{res.startTime} - {res.endTime}</span>
                      </td>
                      <td className="px-4 py-3.5 font-medium text-slate-800">{res.socioName}</td>
                      <td className="px-4 py-3.5 text-slate-600">{res.purpose}</td>
                      <td className="px-4 py-3.5 font-mono">
                        <span className="text-slate-900 font-bold">${res.fee}</span>
                        <span className="text-[10px] text-slate-400 block">Gar: ${res.deposit}</span>
                      </td>
                      <td className="px-4 py-3.5">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200 uppercase">
                          {res.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* VIEW 2: Incidents & Safety Board */}
      {activeSubTab === 'novedades' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="flex items-center justify-between bg-amber-50 p-4 rounded-2xl border border-amber-200">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center shrink-0">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-amber-950 text-sm">Buzón de Novedades Viales y Seguridad Barrial</h3>
                <p className="text-xs text-amber-800">
                  Canal directo para reportar bacheo urgente, daños en luminarias públicas, maquinaria de paso o solicitudes de patrullaje a la UPC.
                </p>
              </div>
            </div>

            <button
              onClick={() => setIsIncidentModalOpen(true)}
              className="flex items-center gap-1.5 px-4 py-2 bg-amber-700 hover:bg-amber-800 text-white font-bold text-xs rounded-xl shadow cursor-pointer shrink-0"
            >
              <PlusCircle className="w-4 h-4" />
              Reportar Novedad
            </button>
          </div>

          {/* Incidents Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {incidents.map(inc => {
              const isUrgent = inc.priority === 'urgente' || inc.priority === 'alta';

              return (
                <div key={inc.id} className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                          isUrgent ? 'bg-rose-100 text-rose-800' : 'bg-slate-100 text-slate-700'
                        }`}
                      >
                        Prioridad {inc.priority}
                      </span>
                      <span className="text-[11px] text-slate-400 font-mono">{inc.date}</span>
                    </div>

                    <h4 className="font-bold text-slate-900 text-sm mb-1">{inc.title}</h4>
                    <p className="text-xs text-slate-600 leading-relaxed mb-3">{inc.description}</p>

                    <div className="space-y-1 text-xs text-slate-500 border-t border-slate-100 pt-2">
                      <div className="flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-slate-400" />
                        <span>{inc.location}</span>
                      </div>
                      <div className="text-[11px]">
                        Reportado por: <strong>{inc.reportedBy}</strong>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                    <span
                      className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${
                        inc.status === 'resuelto'
                          ? 'bg-emerald-100 text-emerald-800'
                          : inc.status === 'en_proceso'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      Estado: {inc.status.replace('_', ' ')}
                    </span>

                    {currentRole === 'admin' && inc.status !== 'resuelto' && (
                      <div className="flex items-center gap-1">
                        {inc.status === 'pendiente' && (
                          <button
                            onClick={() => updateIncidentStatus(inc.id, 'en_proceso')}
                            className="px-2.5 py-1 text-[11px] font-bold text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-lg cursor-pointer"
                          >
                            Atender
                          </button>
                        )}
                        <button
                          onClick={() => updateIncidentStatus(inc.id, 'resuelto')}
                          className="px-2.5 py-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded-lg cursor-pointer"
                        >
                          Marcar Resuelto
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Reservation Modal */}
      {isReserveModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
          <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-8 animate-in fade-in zoom-in duration-200">
            <div className="flex items-center justify-between px-6 py-4 bg-slate-900 text-white">
              <h3 className="font-bold text-sm">Reservar Espacio Comunitario</h3>
              <button
                onClick={() => setIsReserveModalOpen(false)}
                className="p-1 text-slate-400 hover:text-white rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleReserveSubmit} className="p-6 space-y-4 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Espacio Comunal:</label>
                <select
                  value={reserveForm.areaName}
                  onChange={e => setReserveForm({ ...reserveForm, areaName: e.target.value })}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-slate-900 focus:outline-emerald-500"
                >
                  <option value="Casa Barrial de Itulcachi (Salón Principal)">Casa Barrial (Salón Principal)</option>
                  <option value="Cancha de Césped Sintético y Polideportivo">Cancha de Césped Sintético</option>
                  <option value="Área de Parrillas y Quincho">Área de Parrillas</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Socio Solicitante (al día):</label>
                <select
                  value={reserveForm.socioId}
                  onChange={e => setReserveForm({ ...reserveForm, socioId: e.target.value })}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-slate-900 focus:outline-emerald-500"
                >
                  {socios.map(s => (
                    <option key={s.id} value={s.id}>
                      {s.fullNameOrCompany} ({s.lotNumber})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Fecha del Evento:</label>
                  <input
                    type="date"
                    required
                    value={reserveForm.date}
                    onChange={e => setReserveForm({ ...reserveForm, date: e.target.value })}
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-slate-900 focus:outline-emerald-500"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Horario (Inicio - Fin):</label>
                  <input
                    type="text"
                    required
                    value={`${reserveForm.startTime} - ${reserveForm.endTime}`}
                    onChange={e => {
                      const parts = e.target.value.split('-');
                      setReserveForm({
                        ...reserveForm,
                        startTime: parts[0]?.trim() || '14:00',
                        endTime: parts[1]?.trim() || '20:00',
                      });
                    }}
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-slate-900 focus:outline-emerald-500 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Motivo / Tipo de Celebración:</label>
                <input
                  type="text"
                  required
                  placeholder="Ej: Cumpleaños familiar, reunión comunitaria..."
                  value={reserveForm.purpose}
                  onChange={e => setReserveForm({ ...reserveForm, purpose: e.target.value })}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-slate-900 focus:outline-emerald-500"
                />
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex justify-between font-mono font-bold">
                <span>Aporte Comunitario: $25.00</span>
                <span>Garantía: $30.00</span>
              </div>

              <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsReserveModalOpen(false)}
                  className="px-4 py-2 font-semibold text-slate-600 hover:bg-slate-100 rounded-xl cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl cursor-pointer"
                >
                  Confirmar Reserva
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Incident Modal */}
      {isIncidentModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
          <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-8 animate-in fade-in zoom-in duration-200">
            <div className="flex items-center justify-between px-6 py-4 bg-slate-900 text-white">
              <h3 className="font-bold text-sm">Reportar Novedad o Daño Comunitario</h3>
              <button
                onClick={() => setIsIncidentModalOpen(false)}
                className="p-1 text-slate-400 hover:text-white rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleIncidentSubmit} className="p-6 space-y-4 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Título de la Novedad *</label>
                <input
                  type="text"
                  required
                  placeholder="Ej: Fuga de agua en tubería comunal, bache profundo..."
                  value={incidentForm.title}
                  onChange={e => setIncidentForm({ ...incidentForm, title: e.target.value })}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-slate-900 focus:outline-emerald-500"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Ubicación Exacta *</label>
                <input
                  type="text"
                  required
                  placeholder="Ej: Entrada a Santa Ana frente al Lote 12"
                  value={incidentForm.location}
                  onChange={e => setIncidentForm({ ...incidentForm, location: e.target.value })}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-slate-900 focus:outline-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Prioridad:</label>
                  <select
                    value={incidentForm.priority}
                    onChange={e => setIncidentForm({ ...incidentForm, priority: e.target.value as IncidentPriority })}
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-slate-900 focus:outline-emerald-500"
                  >
                    <option value="baja">Baja</option>
                    <option value="media">Media</option>
                    <option value="alta">Alta</option>
                    <option value="urgente">Urgente</option>
                  </select>
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Reportado Por:</label>
                  <input
                    type="text"
                    value={incidentForm.reportedBy}
                    onChange={e => setIncidentForm({ ...incidentForm, reportedBy: e.target.value })}
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-slate-900 focus:outline-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Descripción del Problema *</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Explique el detalle de la novedad para que la directiva pueda gestionar la maquinaria o insumos..."
                  value={incidentForm.description}
                  onChange={e => setIncidentForm({ ...incidentForm, description: e.target.value })}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-slate-900 focus:outline-emerald-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsIncidentModalOpen(false)}
                  className="px-4 py-2 font-semibold text-slate-600 hover:bg-slate-100 rounded-xl cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 font-bold text-white bg-amber-700 hover:bg-amber-800 rounded-xl cursor-pointer"
                >
                  Publicar Reporte
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
