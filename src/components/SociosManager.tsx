import React, { useState } from 'react';
import { useBarrio } from '../context/BarrioContext';
import { Socio, SocioCategory, SocioStatus } from '../types';
import {
  Users,
  Search,
  UserPlus,
  Building2,
  User,
  CheckCircle,
  AlertCircle,
  FileCheck2,
  Phone,
  Mail,
  MapPin,
  FileText,
  DollarSign,
  CalendarCheck,
  Edit2,
  Trash2,
  X,
  CreditCard,
} from 'lucide-react';
import { CertificadoSolvenciaModal } from './CertificadoSolvenciaModal';

export const SociosManager: React.FC = () => {
  const {
    socios,
    addSocio,
    updateSocio,
    deleteSocio,
    payments,
    attendance,
    currentRole,
    setActiveTab,
  } = useBarrio();

  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<'all' | 'natural' | 'juridica' | 'mora'>('all');
  const [selectedSocio, setSelectedSocio] = useState<Socio | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSocio, setEditingSocio] = useState<Socio | null>(null);
  const [solvencyModalSocio, setSolvencyModalSocio] = useState<Socio | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    category: 'natural' as SocioCategory,
    fullNameOrCompany: '',
    tradeName: '',
    identification: '',
    representativeName: '',
    representativeId: '',
    sector: 'Sector Central',
    lotNumber: '',
    phone: '',
    email: '',
    monthlyFee: 15,
    businessType: '',
    occupantsCount: 3,
    notes: '',
  });

  const handleOpenAddModal = () => {
    setEditingSocio(null);
    setFormData({
      category: 'natural',
      fullNameOrCompany: '',
      tradeName: '',
      identification: '',
      representativeName: '',
      representativeId: '',
      sector: 'Sector Central',
      lotNumber: '',
      phone: '',
      email: '',
      monthlyFee: 15,
      businessType: '',
      occupantsCount: 3,
      notes: '',
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (socio: Socio) => {
    setEditingSocio(socio);
    setFormData({
      category: socio.category,
      fullNameOrCompany: socio.fullNameOrCompany,
      tradeName: socio.tradeName || '',
      identification: socio.identification,
      representativeName: socio.representativeName || '',
      representativeId: socio.representativeId || '',
      sector: socio.sector,
      lotNumber: socio.lotNumber,
      phone: socio.phone,
      email: socio.email,
      monthlyFee: socio.monthlyFee,
      businessType: socio.businessType || '',
      occupantsCount: socio.occupantsCount || 3,
      notes: socio.notes || '',
    });
    setIsModalOpen(true);
  };

  const handleCategorySwitch = (cat: SocioCategory) => {
    setFormData(prev => ({
      ...prev,
      category: cat,
      monthlyFee: cat === 'natural' ? 15 : 80,
    }));
  };

  const handleSubmitForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullNameOrCompany || !formData.identification) {
      alert('Por favor complete los campos obligatorios (Nombre e Identificación).');
      return;
    }

    if (editingSocio) {
      updateSocio(editingSocio.id, {
        ...formData,
      });
    } else {
      addSocio({
        ...formData,
        joinedDate: new Date().toISOString().split('T')[0],
        status: 'al_dia',
        balanceDue: 0,
      });
    }

    setIsModalOpen(false);
    setEditingSocio(null);
  };

  const handleDeleteSocio = (id: string, name: string) => {
    if (window.confirm(`¿Está seguro de eliminar al socio "${name}" del padrón comunal?`)) {
      deleteSocio(id);
      if (selectedSocio?.id === id) {
        setSelectedSocio(null);
      }
    }
  };

  // Filtered List
  const filteredSocios = socios.filter(s => {
    const matchesSearch =
      s.fullNameOrCompany.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.identification.includes(searchQuery) ||
      s.lotNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.sector.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (s.tradeName && s.tradeName.toLowerCase().includes(searchQuery.toLowerCase()));

    if (!matchesSearch) return false;

    if (categoryFilter === 'natural') return s.category === 'natural';
    if (categoryFilter === 'juridica') return s.category === 'juridica';
    if (categoryFilter === 'mora') return s.status === 'en_mora';
    return true;
  });

  const sectorsList = [
    'Sector Central',
    'Parque Industrial',
    'Santa Ana',
    'La Chorrera',
    'El Rosal',
    'Vía a Palugo',
  ];

  return (
    <div className="space-y-6">
      
      {/* Header with Search and Actions */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <Users className="w-6 h-6 text-emerald-600" />
            <h1 className="text-xl font-black text-slate-900">
              Padrón de Socios del Barrio Itulcachi
            </h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Registro legal y catastral comunitario: Socios Naturales (familias) y Socios Jurídicos (empresas e industrias).
          </p>
        </div>

        {currentRole === 'admin' && (
          <button
            onClick={handleOpenAddModal}
            className="flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl transition-all shadow-sm cursor-pointer shrink-0"
          >
            <UserPlus className="w-4 h-4" />
            Registrar Nuevo Socio
          </button>
        )}
      </div>

      {/* Filter and Search Bar */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
        {/* Search */}
        <div className="md:col-span-6 relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
          <input
            type="text"
            placeholder="Buscar por nombre, RUC/Cédula, lote o sector..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-emerald-500 focus:ring-1 focus:ring-emerald-500"
          />
        </div>

        {/* Category Tabs */}
        <div className="md:col-span-6 flex items-center gap-1.5 overflow-x-auto bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs">
          <button
            onClick={() => setCategoryFilter('all')}
            className={`flex-1 py-1.5 px-3 rounded-lg font-semibold whitespace-nowrap transition-all cursor-pointer ${
              categoryFilter === 'all'
                ? 'bg-white text-slate-900 shadow-2xs font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Todos ({socios.length})
          </button>
          <button
            onClick={() => setCategoryFilter('natural')}
            className={`flex-1 py-1.5 px-3 rounded-lg font-semibold whitespace-nowrap transition-all cursor-pointer ${
              categoryFilter === 'natural'
                ? 'bg-blue-600 text-white shadow-2xs font-bold'
                : 'text-slate-600 hover:text-blue-700'
            }`}
          >
            Naturales ({socios.filter(s => s.category === 'natural').length})
          </button>
          <button
            onClick={() => setCategoryFilter('juridica')}
            className={`flex-1 py-1.5 px-3 rounded-lg font-semibold whitespace-nowrap transition-all cursor-pointer ${
              categoryFilter === 'juridica'
                ? 'bg-purple-600 text-white shadow-2xs font-bold'
                : 'text-slate-600 hover:text-purple-700'
            }`}
          >
            Jurídicos ({socios.filter(s => s.category === 'juridica').length})
          </button>
          <button
            onClick={() => setCategoryFilter('mora')}
            className={`flex-1 py-1.5 px-3 rounded-lg font-semibold whitespace-nowrap transition-all cursor-pointer ${
              categoryFilter === 'mora'
                ? 'bg-rose-600 text-white shadow-2xs font-bold'
                : 'text-slate-600 hover:text-rose-700'
            }`}
          >
            En Mora ({socios.filter(s => s.status === 'en_mora').length})
          </button>
        </div>
      </div>

      {/* Main Grid: Socios Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredSocios.map(socio => {
          const isNatural = socio.category === 'natural';
          const isEnMora = socio.status === 'en_mora';

          return (
            <div
              key={socio.id}
              onClick={() => setSelectedSocio(socio)}
              className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs hover:shadow-md hover:border-emerald-300 transition-all cursor-pointer flex flex-col justify-between"
            >
              <div>
                {/* Top badges */}
                <div className="flex items-center justify-between gap-2 mb-3">
                  <div className="flex items-center gap-1.5">
                    <span className="font-mono text-[11px] font-bold text-slate-400">
                      {socio.code}
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase flex items-center gap-1 ${
                        isNatural
                          ? 'bg-blue-50 text-blue-700 border border-blue-200'
                          : 'bg-purple-50 text-purple-700 border border-purple-200'
                      }`}
                    >
                      {isNatural ? <User className="w-3 h-3" /> : <Building2 className="w-3 h-3" />}
                      {isNatural ? 'Natural' : 'Jurídica'}
                    </span>
                  </div>

                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                      isEnMora
                        ? 'bg-rose-100 text-rose-800 border border-rose-200'
                        : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                    }`}
                  >
                    {isEnMora ? `Mora ($${socio.balanceDue})` : 'Al Día'}
                  </span>
                </div>

                {/* Name & Trade Name */}
                <h3 className="font-bold text-slate-900 text-sm leading-snug">
                  {socio.fullNameOrCompany}
                </h3>
                {socio.tradeName && (
                  <p className="text-xs text-purple-700 font-semibold mt-0.5">
                    {socio.tradeName}
                  </p>
                )}

                {/* ID and Location */}
                <div className="space-y-1 mt-3 text-xs text-slate-600">
                  <div className="flex items-center gap-1.5 font-mono text-slate-700">
                    <span className="text-slate-400 font-sans">{isNatural ? 'Cédula:' : 'RUC:'}</span>
                    <strong>{socio.identification}</strong>
                  </div>
                  <div className="flex items-center gap-1.5 text-slate-600">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>{socio.lotNumber} • {socio.sector}</span>
                  </div>
                  {socio.representativeName && (
                    <div className="text-[11px] text-slate-500">
                      Rep. Legal: <strong>{socio.representativeName}</strong>
                    </div>
                  )}
                  {socio.businessType && (
                    <div className="text-[11px] text-purple-600 font-medium">
                      Giro: {socio.businessType}
                    </div>
                  )}
                </div>
              </div>

              {/* Bottom fee & actions */}
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <div>
                  <span className="text-[11px] text-slate-400">Expensa Mensual:</span>
                  <p className="font-black text-slate-900 font-mono text-sm">
                    ${socio.monthlyFee.toFixed(2)}
                  </p>
                </div>

                <div className="flex items-center gap-1.5" onClick={e => e.stopPropagation()}>
                  {socio.status === 'al_dia' && (
                    <button
                      onClick={() => setSolvencyModalSocio(socio)}
                      title="Emitir Certificado de Solvencia"
                      className="p-1.5 text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded-lg transition-colors cursor-pointer"
                    >
                      <FileCheck2 className="w-4 h-4" />
                    </button>
                  )}
                  {currentRole === 'admin' && (
                    <>
                      <button
                        onClick={() => handleOpenEditModal(socio)}
                        title="Editar Datos"
                        className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteSocio(socio.id, socio.fullNameOrCompany)}
                        title="Eliminar del padrón"
                        className="p-1.5 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Selected Socio Detail Drawer / Modal */}
      {selectedSocio && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
          <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-8 animate-in fade-in zoom-in duration-200">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 bg-slate-900 text-white">
              <div className="flex items-center gap-2">
                <span className="font-mono text-emerald-400 font-bold">{selectedSocio.code}</span>
                <span className="font-bold text-sm">Ficha Catastral Comunitaria</span>
              </div>
              <button
                onClick={() => setSelectedSocio(null)}
                className="p-1 text-slate-400 hover:text-white rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6">
              {/* Profile Top */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 bg-slate-50 rounded-xl border border-slate-200">
                <div>
                  <div className="flex items-center gap-2">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        selectedSocio.category === 'natural'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-purple-100 text-purple-800'
                      }`}
                    >
                      {selectedSocio.category === 'natural' ? 'Persona Natural' : 'Persona Jurídica'}
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                        selectedSocio.status === 'al_dia'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-rose-100 text-rose-800'
                      }`}
                    >
                      {selectedSocio.status === 'al_dia' ? 'Al Día' : `En Mora ($${selectedSocio.balanceDue})`}
                    </span>
                  </div>
                  <h2 className="text-lg font-black text-slate-900 mt-1">
                    {selectedSocio.fullNameOrCompany}
                  </h2>
                  {selectedSocio.tradeName && (
                    <p className="text-xs text-purple-700 font-semibold">{selectedSocio.tradeName}</p>
                  )}
                </div>

                <div className="text-right sm:border-l sm:pl-4 border-slate-200">
                  <span className="text-xs text-slate-400">Expensa Mensual:</span>
                  <div className="text-xl font-black text-slate-900 font-mono">
                    ${selectedSocio.monthlyFee.toFixed(2)}
                  </div>
                </div>
              </div>

              {/* Data Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="p-3 bg-white border border-slate-200 rounded-xl space-y-2">
                  <p>
                    <strong className="text-slate-500 uppercase text-[10px] block">Identificación:</strong>
                    <span className="font-mono font-bold text-slate-800 text-sm">{selectedSocio.identification}</span>
                  </p>
                  <p>
                    <strong className="text-slate-500 uppercase text-[10px] block">Ubicación / Predio:</strong>
                    <span className="text-slate-800 font-medium">{selectedSocio.lotNumber} ({selectedSocio.sector})</span>
                  </p>
                  <p>
                    <strong className="text-slate-500 uppercase text-[10px] block">Fecha de Ingreso:</strong>
                    <span className="text-slate-700">{selectedSocio.joinedDate}</span>
                  </p>
                </div>

                <div className="p-3 bg-white border border-slate-200 rounded-xl space-y-2">
                  <p>
                    <strong className="text-slate-500 uppercase text-[10px] block">Teléfono / Celular:</strong>
                    <span className="font-mono text-slate-800">{selectedSocio.phone}</span>
                  </p>
                  <p>
                    <strong className="text-slate-500 uppercase text-[10px] block">Correo Electrónico:</strong>
                    <span className="text-slate-800">{selectedSocio.email}</span>
                  </p>
                  {selectedSocio.representativeName && (
                    <p>
                      <strong className="text-slate-500 uppercase text-[10px] block">Representante Legal:</strong>
                      <span className="text-slate-800 font-bold">{selectedSocio.representativeName} (C.I. {selectedSocio.representativeId})</span>
                    </p>
                  )}
                  {selectedSocio.occupantsCount && (
                    <p>
                      <strong className="text-slate-500 uppercase text-[10px] block">Habitantes en Vivienda:</strong>
                      <span className="text-slate-800">{selectedSocio.occupantsCount} personas</span>
                    </p>
                  )}
                </div>
              </div>

              {/* Notes */}
              {selectedSocio.notes && (
                <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-900">
                  <strong>Observaciones Comunitarias:</strong> {selectedSocio.notes}
                </div>
              )}

              {/* Quick History of Payments */}
              <div>
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <CreditCard className="w-4 h-4 text-emerald-600" />
                  Historial de Pagos Recientes
                </h4>
                <div className="border border-slate-200 rounded-xl overflow-hidden text-xs">
                  {payments.filter(p => p.socioId === selectedSocio.id).length > 0 ? (
                    <table className="w-full text-left">
                      <thead className="bg-slate-50 text-slate-500 uppercase font-semibold border-b border-slate-100 text-[10px]">
                        <tr>
                          <th className="px-3 py-2">Recibo</th>
                          <th className="px-3 py-2">Fecha</th>
                          <th className="px-3 py-2">Concepto</th>
                          <th className="px-3 py-2 text-right">Monto</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 text-slate-700">
                        {payments
                          .filter(p => p.socioId === selectedSocio.id)
                          .map(p => (
                            <tr key={p.id}>
                              <td className="px-3 py-2 font-mono font-bold">{p.receiptNumber}</td>
                              <td className="px-3 py-2">{p.date}</td>
                              <td className="px-3 py-2">{p.periodCovered}</td>
                              <td className="px-3 py-2 text-right font-mono font-bold text-slate-900">${p.amount.toFixed(2)}</td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  ) : (
                    <div className="p-4 text-center text-slate-400 text-xs">
                      No hay pagos registrados para este socio en el período actual.
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Modal Footer Actions */}
            <div className="flex flex-wrap items-center justify-between gap-3 px-6 py-4 bg-slate-50 border-t border-slate-200">
              <button
                onClick={() => setSelectedSocio(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer"
              >
                Cerrar
              </button>

              <div className="flex items-center gap-2">
                {selectedSocio.status === 'al_dia' && (
                  <button
                    onClick={() => {
                      setSolvencyModalSocio(selectedSocio);
                    }}
                    className="flex items-center gap-1.5 px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-xl transition-all cursor-pointer"
                  >
                    <FileCheck2 className="w-4 h-4" />
                    Emitir Certificado de Solvencia
                  </button>
                )}
                {currentRole === 'admin' && (
                  <button
                    onClick={() => {
                      setSelectedSocio(null);
                      setActiveTab('pagos');
                    }}
                    className="flex items-center gap-1.5 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl transition-all cursor-pointer"
                  >
                    <CreditCard className="w-4 h-4 text-emerald-400" />
                    Registrar Cobro
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add / Edit Socio Modal Form */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
          <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-8 animate-in fade-in zoom-in duration-200">
            <div className="flex items-center justify-between px-6 py-4 bg-slate-900 text-white">
              <div className="flex items-center gap-2">
                <UserPlus className="w-5 h-5 text-emerald-400" />
                <h3 className="font-bold text-sm">
                  {editingSocio ? 'Editar Socio Comunal' : 'Registrar Nuevo Socio en el Padrón'}
                </h3>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 text-slate-400 hover:text-white rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitForm} className="p-6 space-y-4 text-xs">
              
              {/* Category Selector Tabs */}
              <div className="space-y-1">
                <label className="font-bold text-slate-700">Categoría Legal del Socio:</label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => handleCategorySwitch('natural')}
                    className={`p-3 rounded-xl border flex items-center gap-2.5 transition-all cursor-pointer ${
                      formData.category === 'natural'
                        ? 'bg-blue-50 border-blue-500 text-blue-900 font-bold ring-1 ring-blue-500'
                        : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    <User className="w-4 h-4 text-blue-600" />
                    <div className="text-left">
                      <div className="text-xs">Persona Natural</div>
                      <div className="text-[10px] text-slate-400 font-normal">Residente / Familia ($15/mes)</div>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleCategorySwitch('juridica')}
                    className={`p-3 rounded-xl border flex items-center gap-2.5 transition-all cursor-pointer ${
                      formData.category === 'juridica'
                        ? 'bg-purple-50 border-purple-500 text-purple-900 font-bold ring-1 ring-purple-500'
                        : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    <Building2 className="w-4 h-4 text-purple-600" />
                    <div className="text-left">
                      <div className="text-xs">Persona Jurídica</div>
                      <div className="text-[10px] text-slate-400 font-normal">Empresa / Industria ($65-$120/mes)</div>
                    </div>
                  </button>
                </div>
              </div>

              {/* Main Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    {formData.category === 'natural' ? 'Nombres y Apellidos Completos *' : 'Razón Social Oficial (SRI) *'}
                  </label>
                  <input
                    type="text"
                    required
                    placeholder={formData.category === 'natural' ? 'Ej: Juan Carlos Tipán' : 'Ej: METALMECÁNICA VALLE CÍA. LTDA.'}
                    value={formData.fullNameOrCompany}
                    onChange={e => setFormData({ ...formData, fullNameOrCompany: e.target.value })}
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-slate-900 focus:outline-emerald-500"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    {formData.category === 'natural' ? 'Cédula de Identidad (10 dígitos) *' : 'RUC Empresarial (13 dígitos) *'}
                  </label>
                  <input
                    type="text"
                    required
                    placeholder={formData.category === 'natural' ? 'Ej: 1712458921' : 'Ej: 1792841029001'}
                    value={formData.identification}
                    onChange={e => setFormData({ ...formData, identification: e.target.value })}
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-slate-900 font-mono focus:outline-emerald-500"
                  />
                </div>

                {formData.category === 'juridica' && (
                  <>
                    <div>
                      <label className="font-bold text-slate-700 block mb-1">
                        Nombre Comercial del Predio:
                      </label>
                      <input
                        type="text"
                        placeholder="Ej: Planta Industrial Itulcachi"
                        value={formData.tradeName}
                        onChange={e => setFormData({ ...formData, tradeName: e.target.value })}
                        className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-slate-900 focus:outline-emerald-500"
                      />
                    </div>

                    <div>
                      <label className="font-bold text-slate-700 block mb-1">
                        Giro de Negocio / Actividad:
                      </label>
                      <input
                        type="text"
                        placeholder="Ej: Logística, Bodegaje, Agroindustria"
                        value={formData.businessType}
                        onChange={e => setFormData({ ...formData, businessType: e.target.value })}
                        className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-slate-900 focus:outline-emerald-500"
                      />
                    </div>

                    <div>
                      <label className="font-bold text-slate-700 block mb-1">
                        Representante Legal:
                      </label>
                      <input
                        type="text"
                        placeholder="Ej: Ing. Fernando Andrade"
                        value={formData.representativeName}
                        onChange={e => setFormData({ ...formData, representativeName: e.target.value })}
                        className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-slate-900 focus:outline-emerald-500"
                      />
                    </div>

                    <div>
                      <label className="font-bold text-slate-700 block mb-1">
                        C.I. Representante Legal:
                      </label>
                      <input
                        type="text"
                        placeholder="Ej: 1705643219"
                        value={formData.representativeId}
                        onChange={e => setFormData({ ...formData, representativeId: e.target.value })}
                        className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-slate-900 font-mono focus:outline-emerald-500"
                      />
                    </div>
                  </>
                )}

                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    Sector de Itulcachi:
                  </label>
                  <select
                    value={formData.sector}
                    onChange={e => setFormData({ ...formData, sector: e.target.value })}
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-slate-900 focus:outline-emerald-500 cursor-pointer"
                  >
                    {sectorsList.map(s => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    Nro. de Lote / Manzana / Predio:
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ej: Mz B, Lote 04 o Predio Ind-14"
                    value={formData.lotNumber}
                    onChange={e => setFormData({ ...formData, lotNumber: e.target.value })}
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-slate-900 focus:outline-emerald-500"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    Teléfono de Contacto:
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ej: 0998342110 / 022987100"
                    value={formData.phone}
                    onChange={e => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-slate-900 font-mono focus:outline-emerald-500"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    Correo Electrónico:
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="Ej: contacto@ejemplo.com"
                    value={formData.email}
                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-slate-900 focus:outline-emerald-500"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    Alícuota / Expensa Mensual (USD):
                  </label>
                  <input
                    type="number"
                    min="5"
                    step="1"
                    required
                    value={formData.monthlyFee}
                    onChange={e => setFormData({ ...formData, monthlyFee: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-slate-900 font-mono font-bold focus:outline-emerald-500"
                  />
                </div>

                {formData.category === 'natural' && (
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">
                      Nro. de Habitantes en el Predio:
                    </label>
                    <input
                      type="number"
                      min="1"
                      value={formData.occupantsCount}
                      onChange={e => setFormData({ ...formData, occupantsCount: Number(e.target.value) })}
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-slate-900 focus:outline-emerald-500"
                    />
                  </div>
                )}
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  Notas Adicionales / Acuerdos Comunitarios:
                </label>
                <textarea
                  rows={2}
                  placeholder="Ej: Aporta con maquinaria para bacheo, miembro de directiva anterior, etc."
                  value={formData.notes}
                  onChange={e => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-slate-900 focus:outline-emerald-500"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl transition-all shadow cursor-pointer"
                >
                  {editingSocio ? 'Guardar Cambios' : 'Registrar Socio'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Solvency Certificate Modal */}
      {solvencyModalSocio && (
        <CertificadoSolvenciaModal
          socio={solvencyModalSocio}
          onClose={() => setSolvencyModalSocio(null)}
        />
      )}

    </div>
  );
};
