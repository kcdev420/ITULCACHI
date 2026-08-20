import React, { useState } from 'react';
import { useBarrio } from '../context/BarrioContext';
import { Expense, ExpenseCategory } from '../types';
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  PlusCircle,
  FileSpreadsheet,
  Printer,
  PieChart,
  ShieldCheck,
  AlertTriangle,
  Send,
  Building2,
  Receipt,
  Trash2,
  X,
} from 'lucide-react';

export const ReportesGastos: React.FC = () => {
  const {
    expenses,
    payments,
    socios,
    addExpense,
    deleteExpense,
    currentRole,
  } = useBarrio();

  const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [delinquentNoticeSocio, setDelinquentNoticeSocio] = useState<any | null>(null);

  // Form State for Expense
  const [expenseForm, setExpenseForm] = useState({
    category: 'mantenimiento_vial' as ExpenseCategory,
    title: '',
    description: '',
    amount: 50,
    supplierName: '',
    invoiceNumber: '',
    approvedBy: 'Asamblea y Presidente Barrial',
    paymentMethod: 'Transferencia Bancaria',
  });

  const totalIncome = payments.reduce((sum, p) => sum + p.amount, 0);
  const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);
  const netSurplus = totalIncome - totalExpenses;

  // Group expenses by category
  const categoryTotals = expenses.reduce((acc, exp) => {
    acc[exp.category] = (acc[exp.category] || 0) + exp.amount;
    return acc;
  }, {} as Record<string, number>);

  const categoryLabels: Record<ExpenseCategory, string> = {
    mantenimiento_vial: 'Mantenimiento Vial & Bacheo',
    seguridad_alarmas: 'Seguridad & Alarmas Barriales',
    alumbrado_publico: 'Alumbrado Público Comunal',
    mingas_refrigerios: 'Insumos Mingas & Refrigerios',
    casa_barrial: 'Casa Barrial & Obras Comunales',
    obras_alcantarillado_agua: 'Obras de Agua & Alcantarillado',
    tramites_legales_gad: 'Gestión Legal & GAD Pifo',
    otros: 'Otros Gastos Operativos',
  };

  const handleAddExpenseSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!expenseForm.title || !expenseForm.supplierName) {
      alert('Por favor complete los campos obligatorios.');
      return;
    }

    addExpense({
      ...expenseForm,
    });

    setIsExpenseModalOpen(false);
    setExpenseForm({
      category: 'mantenimiento_vial',
      title: '',
      description: '',
      amount: 50,
      supplierName: '',
      invoiceNumber: '',
      approvedBy: 'Asamblea y Presidente Barrial',
      paymentMethod: 'Transferencia Bancaria',
    });
  };

  const handlePrintReport = () => {
    window.print();
  };

  const sociosEnMora = socios.filter(s => s.status === 'en_mora');

  return (
    <div className="space-y-6">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <BarChart3 className="w-6 h-6 text-emerald-600" />
            <h1 className="text-xl font-black text-slate-900">
              Reportes Mensuales y Balance de Gastos
            </h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Rendición de cuentas comunitaria del Barrio Itulcachi: Ingresos recaudados vs Obras y mantenimiento ejecutados.
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0 print:hidden">
          {currentRole === 'admin' && (
            <button
              onClick={() => setIsExpenseModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2.5 bg-rose-700 hover:bg-rose-800 text-white font-bold text-xs rounded-xl transition-all shadow-sm cursor-pointer"
            >
              <PlusCircle className="w-4 h-4" />
              Registrar Nuevo Gasto / Obra
            </button>
          )}

          <button
            onClick={handlePrintReport}
            className="flex items-center gap-2 px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl transition-all cursor-pointer shadow-sm"
          >
            <Printer className="w-4 h-4" />
            Imprimir Informe de Asamblea
          </button>
        </div>
      </div>

      {/* Main Financial Balance KPI Ribbon */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Ingresos */}
        <div className="bg-white p-5 rounded-2xl border border-emerald-200 shadow-xs relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider">
              Total Ingresos Comunitarios
            </span>
            <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-emerald-950 font-mono mt-3">
            ${totalIncome.toFixed(2)}
          </div>
          <div className="mt-2 text-xs text-emerald-800 font-medium">
            Expensas + multas + reservas de áreas
          </div>
        </div>

        {/* Egresos */}
        <div className="bg-white p-5 rounded-2xl border border-rose-200 shadow-xs relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-rose-700 uppercase tracking-wider">
              Total Egresos & Inversión
            </span>
            <div className="w-8 h-8 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center">
              <TrendingDown className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-rose-950 font-mono mt-3">
            ${totalExpenses.toFixed(2)}
          </div>
          <div className="mt-2 text-xs text-rose-800 font-medium">
            Vías, luminarias, seguridad y mingas
          </div>
        </div>

        {/* Superávit / Balance Neto */}
        <div className="bg-white p-5 rounded-2xl border border-blue-200 shadow-xs relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-blue-700 uppercase tracking-wider">
              Saldo Líquido en Caja Comunal
            </span>
            <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-blue-950 font-mono mt-3">
            ${netSurplus.toFixed(2)}
          </div>
          <div className="mt-2 text-xs text-blue-800 font-semibold">
            Superávit financiero positivo
          </div>
        </div>
      </div>

      {/* Visual Distribution of Expenses by Category */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <h2 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2">
          <PieChart className="w-4 h-4 text-emerald-600" />
          Distribución de Egresos por Rubro Comunal
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
          {Object.entries(categoryTotals).map(([catKey, val]) => {
            const amount = Number(val) || 0;
            const percentage = totalExpenses > 0 ? ((amount / totalExpenses) * 100).toFixed(1) : '0';
            return (
              <div key={catKey} className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="font-semibold text-slate-700 line-clamp-1">
                    {categoryLabels[catKey as ExpenseCategory] || catKey}
                  </span>
                  <span className="font-mono font-bold text-slate-900">${amount.toFixed(2)}</span>
                </div>
                <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden mt-2">
                  <div
                    className="bg-emerald-600 h-full rounded-full transition-all"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
                <div className="text-[10px] text-slate-400 text-right mt-1 font-semibold">
                  {percentage}% del presupuesto
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Expenses Breakdown Table */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="p-5 border-b border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Receipt className="w-5 h-5 text-rose-600" />
            <h3 className="font-bold text-slate-900 text-sm">
              Libro de Egresos y Comprobantes de Pago
            </h3>
          </div>

          <div className="flex items-center gap-2 print:hidden">
            <select
              value={selectedCategory}
              onChange={e => setSelectedCategory(e.target.value)}
              className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-emerald-500 cursor-pointer"
            >
              <option value="all">Todas las categorías</option>
              {Object.keys(categoryLabels).map(k => (
                <option key={k} value={k}>
                  {categoryLabels[k as ExpenseCategory]}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 uppercase font-bold border-b border-slate-200 text-[11px]">
              <tr>
                <th className="px-4 py-3.5">Comprobante</th>
                <th className="px-4 py-3.5">Fecha</th>
                <th className="px-4 py-3.5">Detalle / Obra</th>
                <th className="px-4 py-3.5">Proveedor / Factura</th>
                <th className="px-4 py-3.5">Aprobado Por</th>
                <th className="px-4 py-3.5 text-right">Valor (USD)</th>
                {currentRole === 'admin' && <th className="px-4 py-3.5 text-center print:hidden">Acción</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {expenses
                .filter(e => selectedCategory === 'all' || e.category === selectedCategory)
                .map(expense => (
                  <tr key={expense.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-4 py-3.5 font-mono font-bold text-slate-900 text-xs">
                      {expense.voucherNumber}
                    </td>
                    <td className="px-4 py-3.5 text-slate-500">{expense.date}</td>
                    <td className="px-4 py-3.5">
                      <strong className="block text-slate-900 font-semibold">{expense.title}</strong>
                      <span className="text-[11px] text-slate-500">{expense.description}</span>
                    </td>
                    <td className="px-4 py-3.5">
                      <span className="font-semibold text-slate-800 block">{expense.supplierName}</span>
                      <span className="text-[10px] text-slate-400 font-mono">Fac: {expense.invoiceNumber}</span>
                    </td>
                    <td className="px-4 py-3.5 text-slate-600 font-medium">{expense.approvedBy}</td>
                    <td className="px-4 py-3.5 text-right font-mono font-black text-rose-700 text-sm">
                      -${expense.amount.toFixed(2)}
                    </td>
                    {currentRole === 'admin' && (
                      <td className="px-4 py-3.5 text-center print:hidden">
                        <button
                          onClick={() => {
                            if (window.confirm('¿Desea anular este comprobante de egreso?')) {
                              deleteExpense(expense.id);
                            }
                          }}
                          className="p-1 text-slate-400 hover:text-rose-600 rounded cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    )}
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Delinquency Monitoring Section */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-amber-500" />
            <h3 className="font-bold text-slate-900 text-base">
              Control de Morosidad y Cuentas por Cobrar
            </h3>
          </div>
          <span className="px-2.5 py-1 bg-amber-100 text-amber-900 text-xs font-bold rounded-full">
            {sociosEnMora.length} socios con valores pendientes
          </span>
        </div>

        <p className="text-xs text-slate-500 mb-4">
          Listado de socios naturales y jurídicos que registran atrasos en expensas o multas de mingas comunitarias.
        </p>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 uppercase font-bold border-b border-slate-200 text-[10px]">
              <tr>
                <th className="px-4 py-3">Código</th>
                <th className="px-4 py-3">Socio / Empresa</th>
                <th className="px-4 py-3">Ubicación</th>
                <th className="px-4 py-3">Contacto</th>
                <th className="px-4 py-3 text-right">Saldo Pendiente</th>
                <th className="px-4 py-3 text-center print:hidden">Notificación</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {sociosEnMora.map(soc => (
                <tr key={soc.id} className="hover:bg-slate-50/80">
                  <td className="px-4 py-3 font-mono font-bold text-slate-900">{soc.code}</td>
                  <td className="px-4 py-3">
                    <strong className="text-slate-900">{soc.fullNameOrCompany}</strong>
                    <span className="block text-[10px] text-slate-400 font-mono">{soc.identification}</span>
                  </td>
                  <td className="px-4 py-3 text-slate-600">{soc.lotNumber} ({soc.sector})</td>
                  <td className="px-4 py-3 text-slate-600 font-mono">{soc.phone}</td>
                  <td className="px-4 py-3 text-right font-mono font-black text-rose-700 text-sm">
                    ${soc.balanceDue.toFixed(2)}
                  </td>
                  <td className="px-4 py-3 text-center print:hidden">
                    <button
                      onClick={() => setDelinquentNoticeSocio(soc)}
                      className="px-3 py-1 bg-amber-50 hover:bg-amber-100 text-amber-900 font-bold text-xs rounded-xl border border-amber-200 transition-colors cursor-pointer"
                    >
                      Aviso de Cobro
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Expense Modal */}
      {isExpenseModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
          <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-8 animate-in fade-in zoom-in duration-200">
            <div className="flex items-center justify-between px-6 py-4 bg-slate-900 text-white">
              <div className="flex items-center gap-2">
                <PlusCircle className="w-5 h-5 text-rose-400" />
                <h3 className="font-bold text-sm">Registrar Gasto u Obra Comunal</h3>
              </div>
              <button
                onClick={() => setIsExpenseModalOpen(false)}
                className="p-1 text-slate-400 hover:text-white rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddExpenseSubmit} className="p-6 space-y-4 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  Categoría de Gasto *
                </label>
                <select
                  value={expenseForm.category}
                  onChange={e => setExpenseForm({ ...expenseForm, category: e.target.value as ExpenseCategory })}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-slate-900 focus:outline-emerald-500 cursor-pointer"
                >
                  {Object.keys(categoryLabels).map(k => (
                    <option key={k} value={k}>
                      {categoryLabels[k as ExpenseCategory]}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  Título / Descripción Corta *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ej: Bacheo vial, reparación de motobomba, reflectores..."
                  value={expenseForm.title}
                  onChange={e => setExpenseForm({ ...expenseForm, title: e.target.value })}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-slate-900 focus:outline-emerald-500"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  Detalle Extendido:
                </label>
                <textarea
                  rows={2}
                  placeholder="Detalle técnico de los trabajos realizados y destino del material..."
                  value={expenseForm.description}
                  onChange={e => setExpenseForm({ ...expenseForm, description: e.target.value })}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-slate-900 focus:outline-emerald-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    Valor Total (USD) *
                  </label>
                  <input
                    type="number"
                    min="1"
                    step="0.5"
                    required
                    value={expenseForm.amount}
                    onChange={e => setExpenseForm({ ...expenseForm, amount: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-slate-900 font-mono font-bold focus:outline-emerald-500"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    Proveedor / Maestro de Obra *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ej: Ferretería Central o Maquinarias Valle"
                    value={expenseForm.supplierName}
                    onChange={e => setExpenseForm({ ...expenseForm, supplierName: e.target.value })}
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-slate-900 focus:outline-emerald-500"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    Nro. de Factura / Comprobante:
                  </label>
                  <input
                    type="text"
                    placeholder="Ej: 001-001-0004123"
                    value={expenseForm.invoiceNumber}
                    onChange={e => setExpenseForm({ ...expenseForm, invoiceNumber: e.target.value })}
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-slate-900 font-mono focus:outline-emerald-500"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    Aprobado Por:
                  </label>
                  <input
                    type="text"
                    required
                    value={expenseForm.approvedBy}
                    onChange={e => setExpenseForm({ ...expenseForm, approvedBy: e.target.value })}
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-slate-900 focus:outline-emerald-500"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsExpenseModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 text-xs font-bold text-white bg-rose-700 hover:bg-rose-800 rounded-xl transition-all shadow cursor-pointer"
                >
                  Guardar Comprobante de Egreso
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delinquent Notice Modal */}
      {delinquentNoticeSocio && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
          <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-8 animate-in fade-in zoom-in duration-200">
            <div className="flex items-center justify-between px-6 py-4 bg-amber-900 text-white">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-amber-300" />
                <h3 className="font-bold text-sm">Notificación Formal de Cobro Comunitario</h3>
              </div>
              <button
                onClick={() => setDelinquentNoticeSocio(null)}
                className="p-1 text-slate-300 hover:text-white rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4 text-xs text-slate-700">
              <div className="p-4 bg-amber-50 rounded-xl border border-amber-200">
                <p><strong>Destinatario:</strong> {delinquentNoticeSocio.fullNameOrCompany}</p>
                <p><strong>Predio:</strong> {delinquentNoticeSocio.lotNumber} ({delinquentNoticeSocio.sector})</p>
                <p><strong>Valor Pendiente:</strong> <span className="font-mono font-black text-rose-700">${delinquentNoticeSocio.balanceDue.toFixed(2)}</span></p>
              </div>

              <p className="leading-relaxed">
                Estimado socio(a), le recordamos cordialmente que mantiene valores pendientes por concepto de alícuotas comunales o multas de mingas del Barrio Itulcachi. Le solicitamos acercarse a regularizar su estado de cuenta para mantener el buen estado de nuestras vías y servicios.
              </p>

              <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-200">
                <button
                  onClick={() => setDelinquentNoticeSocio(null)}
                  className="px-4 py-2 font-semibold text-slate-600 hover:bg-slate-100 rounded-xl cursor-pointer"
                >
                  Cerrar
                </button>
                <button
                  onClick={() => {
                    const text = encodeURIComponent(
                      `🏛️ *NOTIFICACIÓN DE COBRO - BARRIO ITULCACHI*\n\n` +
                      `Estimado socio/empresa *${delinquentNoticeSocio.fullNameOrCompany}* (${delinquentNoticeSocio.lotNumber}):\n\n` +
                      `Le recordamos que mantiene un saldo pendiente de *$${delinquentNoticeSocio.balanceDue.toFixed(2)}* correspondiente a expensas/mingas comunales.\n\n` +
                      `Agradecemos realizar su pago a la cuenta del Barrio Itulcachi para coordinar las obras del sector.\n\n` +
                      `_Directiva Central Itulcachi_`
                    );
                    window.open(`https://wa.me/593${delinquentNoticeSocio.phone.replace(/^0/, '')}?text=${text}`, '_blank');
                    setDelinquentNoticeSocio(null);
                  }}
                  className="flex items-center gap-1.5 px-4 py-2 font-bold text-white bg-emerald-700 hover:bg-emerald-800 rounded-xl transition-colors cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                  Enviar Recordatorio WhatsApp
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
