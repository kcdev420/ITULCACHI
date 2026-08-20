export type UserRole = 'admin' | 'socio_natural' | 'socio_juridico' | 'fiscalizador';

export type SocioCategory = 'natural' | 'juridica';

export type SocioStatus = 'al_dia' | 'en_mora' | 'inactivo';

export interface Socio {
  id: string;
  code: string;
  category: SocioCategory;
  fullNameOrCompany: string;
  tradeName?: string;
  identification: string; // Cédula o RUC
  representativeName?: string; // Para personas jurídicas
  representativeId?: string;
  sector: string; // e.g. "Sector Central", "Parque Industrial", "Santa Ana", "La Chorrera", "El Rosal"
  lotNumber: string; // e.g. "Mz 4, Lote 12"
  phone: string;
  email: string;
  joinedDate: string;
  monthlyFee: number; // Expensa base: $15 natural, $45-$120 jurídica
  status: SocioStatus;
  balanceDue: number; // Saldo pendiente
  occupantsCount?: number; // Para naturales
  businessType?: string; // Para jurídicas (Metalmecánica, Logística, etc.)
  notes?: string;
}

export type PaymentType =
  | 'alicuota_ordinaria'
  | 'alicuota_extraordinaria'
  | 'multa_minga'
  | 'reserva_area_comunal'
  | 'cuota_agua_comunal'
  | 'otro';

export type PaymentMethod =
  | 'transferencia'
  | 'efectivo'
  | 'deposito'
  | 'pichincha_vecino'
  | 'banco_guayaquil';

export interface Payment {
  id: string;
  receiptNumber: string;
  socioId: string;
  socioName: string;
  socioCategory: SocioCategory;
  identification: string;
  amount: number;
  periodCovered: string; // e.g. "Agosto 2026"
  paymentType: PaymentType;
  paymentMethod: PaymentMethod;
  referenceNumber: string;
  date: string;
  registeredBy: string;
  status: 'aprobado' | 'pendiente_validacion' | 'anulado';
  notes?: string;
}

export type ExpenseCategory =
  | 'mantenimiento_vial'
  | 'seguridad_alarmas'
  | 'alumbrado_publico'
  | 'mingas_refrigerios'
  | 'casa_barrial'
  | 'obras_alcantarillado_agua'
  | 'tramites_legales_gad'
  | 'otros';

export interface Expense {
  id: string;
  voucherNumber: string;
  category: ExpenseCategory;
  title: string;
  description: string;
  amount: number;
  supplierName: string;
  invoiceNumber: string;
  date: string;
  approvedBy: string;
  paymentMethod: string;
  receiptUrl?: string;
}

export type EventType = 'minga' | 'asamblea' | 'evento_social' | 'capacitacion';

export interface MingaEvent {
  id: string;
  title: string;
  type: EventType;
  date: string;
  time: string;
  location: string;
  description: string;
  requiredTools?: string[];
  fineAmountNatural: number;
  fineAmountJuridica: number;
  status: 'programada' | 'en_curso' | 'finalizada' | 'cancelada';
  attendanceClosed: boolean;
  totalAttendees?: number;
}

export type AttendanceStatus = 'presente' | 'delegado' | 'justificado' | 'ausente';

export interface AttendanceRecord {
  id: string;
  eventId: string;
  socioId: string;
  socioName: string;
  socioCategory: SocioCategory;
  identification: string;
  lotNumber: string;
  status: AttendanceStatus;
  checkInTime?: string;
  delegateName?: string;
  justificationReason?: string;
  fineCharged: boolean;
  fineAmount: number;
}

export type IncidentPriority = 'baja' | 'media' | 'alta' | 'urgente';
export type IncidentStatus = 'reportado' | 'en_inspeccion' | 'en_ejecucion' | 'resuelto';
export type ReservationStatus = 'solicitada' | 'aprobada' | 'rechazada' | 'finalizada';

export interface CommunityAreaReservation {
  id: string;
  areaName: string;
  socioId: string;
  socioName: string;
  identification?: string;
  date: string;
  startTime?: string;
  endTime?: string;
  timeSlot?: string;
  purpose: string;
  status: ReservationStatus;
  fee: number;
  deposit?: number;
}

export interface NeighborhoodIncident {
  id: string;
  socioId?: string;
  socioName?: string;
  phone?: string;
  type?: 'luminaria_danada' | 'bache_vial' | 'fuga_agua' | 'seguridad' | 'limpieza' | 'otro';
  title: string;
  description: string;
  location: string;
  date: string;
  status: IncidentStatus;
  priority: IncidentPriority;
  reportedBy?: string;
}

export interface MonthlyFinancialSummary {
  month: string;
  year: number;
  totalIncome: number;
  incomeNaturales: number;
  incomeJuridicas: number;
  totalExpenses: number;
  netBalance: number;
  reserveFundAccumulated: number;
  delinquencyRate: number; // percentage
}
