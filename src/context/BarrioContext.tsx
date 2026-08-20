import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Socio,
  Payment,
  Expense,
  MingaEvent,
  AttendanceRecord,
  CommunityAreaReservation,
  NeighborhoodIncident,
  UserRole,
} from '../types';
import {
  INITIAL_SOCIOS,
  INITIAL_PAYMENTS,
  INITIAL_EXPENSES,
  INITIAL_EVENTS,
  INITIAL_ATTENDANCE,
  INITIAL_RESERVATIONS,
  INITIAL_INCIDENTS,
} from '../data/initialData';

interface BarrioContextType {
  socios: Socio[];
  payments: Payment[];
  expenses: Expense[];
  events: MingaEvent[];
  attendance: AttendanceRecord[];
  reservations: CommunityAreaReservation[];
  incidents: NeighborhoodIncident[];
  currentRole: UserRole;
  activeSocioId: string;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  setCurrentRole: (role: UserRole) => void;
  setActiveSocioId: (id: string) => void;
  // Actions
  addSocio: (socio: Omit<Socio, 'id' | 'code'>) => void;
  updateSocio: (id: string, updated: Partial<Socio>) => void;
  deleteSocio: (id: string) => void;
  registerPayment: (payment: Omit<Payment, 'id' | 'receiptNumber' | 'date'>) => Payment;
  addExpense: (expense: Omit<Expense, 'id' | 'voucherNumber' | 'date'>) => Expense;
  deleteExpense: (id: string) => void;
  createEvent: (event: Omit<MingaEvent, 'id' | 'attendanceClosed' | 'totalAttendees'>) => void;
  updateAttendanceStatus: (
    eventId: string,
    socioId: string,
    status: AttendanceRecord['status'],
    details?: { delegateName?: string; justificationReason?: string }
  ) => void;
  closeMingaAttendance: (eventId: string) => void;
  createReservation: (res: Omit<CommunityAreaReservation, 'id' | 'status'>) => void;
  updateReservationStatus: (id: string, status: CommunityAreaReservation['status']) => void;
  addIncident: (inc: Omit<NeighborhoodIncident, 'id' | 'date' | 'status'>) => void;
  updateIncidentStatus: (id: string, status: NeighborhoodIncident['status']) => void;
  resetAllData: () => void;
  // Helpers
  getSocioById: (id: string) => Socio | undefined;
  getSocioPayments: (socioId: string) => Payment[];
  getSocioAttendance: (socioId: string) => AttendanceRecord[];
}

const BarrioContext = createContext<BarrioContextType | undefined>(undefined);

const STORAGE_KEYS = {
  SOCIOS: 'itulcachi_socios_v1',
  PAYMENTS: 'itulcachi_payments_v1',
  EXPENSES: 'itulcachi_expenses_v1',
  EVENTS: 'itulcachi_events_v1',
  ATTENDANCE: 'itulcachi_attendance_v1',
  RESERVATIONS: 'itulcachi_reservations_v1',
  INCIDENTS: 'itulcachi_incidents_v1',
  ROLE: 'itulcachi_role_v1',
  ACTIVE_SOCIO: 'itulcachi_active_socio_v1',
};

export const BarrioProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [socios, setSocios] = useState<Socio[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.SOCIOS);
    return saved ? JSON.parse(saved) : INITIAL_SOCIOS;
  });

  const [payments, setPayments] = useState<Payment[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.PAYMENTS);
    return saved ? JSON.parse(saved) : INITIAL_PAYMENTS;
  });

  const [expenses, setExpenses] = useState<Expense[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.EXPENSES);
    return saved ? JSON.parse(saved) : INITIAL_EXPENSES;
  });

  const [events, setEvents] = useState<MingaEvent[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.EVENTS);
    return saved ? JSON.parse(saved) : INITIAL_EVENTS;
  });

  const [attendance, setAttendance] = useState<AttendanceRecord[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.ATTENDANCE);
    return saved ? JSON.parse(saved) : INITIAL_ATTENDANCE;
  });

  const [reservations, setReservations] = useState<CommunityAreaReservation[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.RESERVATIONS);
    return saved ? JSON.parse(saved) : INITIAL_RESERVATIONS;
  });

  const [incidents, setIncidents] = useState<NeighborhoodIncident[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.INCIDENTS);
    return saved ? JSON.parse(saved) : INITIAL_INCIDENTS;
  });

  const [currentRole, setCurrentRole] = useState<UserRole>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.ROLE);
    return (saved as UserRole) || 'admin';
  });

  const [activeSocioId, setActiveSocioId] = useState<string>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.ACTIVE_SOCIO);
    return saved || 'soc-nat-01';
  });

  const [activeTab, setActiveTab] = useState<string>('resumen');

  // Persistence
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.SOCIOS, JSON.stringify(socios));
  }, [socios]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.PAYMENTS, JSON.stringify(payments));
  }, [payments]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.EXPENSES, JSON.stringify(expenses));
  }, [expenses]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.EVENTS, JSON.stringify(events));
  }, [events]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ATTENDANCE, JSON.stringify(attendance));
  }, [attendance]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.RESERVATIONS, JSON.stringify(reservations));
  }, [reservations]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.INCIDENTS, JSON.stringify(incidents));
  }, [incidents]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ROLE, currentRole);
  }, [currentRole]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ACTIVE_SOCIO, activeSocioId);
  }, [activeSocioId]);

  // Actions
  const addSocio = (data: Omit<Socio, 'id' | 'code'>) => {
    const nextNum = socios.length + 1;
    const prefix = data.category === 'natural' ? 'NAT' : 'JUR';
    const code = `${prefix}-${String(nextNum).padStart(3, '0')}`;
    const id = `soc-${data.category.slice(0, 3)}-${Date.now().toString().slice(-4)}`;

    const newSocio: Socio = {
      ...data,
      id,
      code,
    };

    setSocios(prev => [newSocio, ...prev]);
  };

  const updateSocio = (id: string, updated: Partial<Socio>) => {
    setSocios(prev =>
      prev.map(soc => (soc.id === id ? { ...soc, ...updated } : soc))
    );
  };

  const deleteSocio = (id: string) => {
    setSocios(prev => prev.filter(soc => soc.id !== id));
  };

  const registerPayment = (paymentData: Omit<Payment, 'id' | 'receiptNumber' | 'date'>): Payment => {
    const nextReceiptNum = `REC-2026-${String(payments.length + 140).padStart(5, '0')}`;
    const today = new Date().toISOString().split('T')[0];
    const newPayment: Payment = {
      ...paymentData,
      id: `pay-${Date.now()}`,
      receiptNumber: nextReceiptNum,
      date: today,
    };

    setPayments(prev => [newPayment, ...prev]);

    // Update socio balance and status
    setSocios(prev =>
      prev.map(soc => {
        if (soc.id === paymentData.socioId) {
          const newBalance = Math.max(0, soc.balanceDue - paymentData.amount);
          return {
            ...soc,
            balanceDue: newBalance,
            status: newBalance === 0 ? 'al_dia' : 'en_mora',
          };
        }
        return soc;
      })
    );

    return newPayment;
  };

  const addExpense = (expenseData: Omit<Expense, 'id' | 'voucherNumber' | 'date'>): Expense => {
    const nextVoucherNum = `EGR-2026-${String(expenses.length + 41).padStart(4, '0')}`;
    const today = new Date().toISOString().split('T')[0];
    const newExpense: Expense = {
      ...expenseData,
      id: `exp-${Date.now()}`,
      voucherNumber: nextVoucherNum,
      date: today,
    };

    setExpenses(prev => [newExpense, ...prev]);
    return newExpense;
  };

  const deleteExpense = (id: string) => {
    setExpenses(prev => prev.filter(e => e.id !== id));
  };

  const createEvent = (eventData: Omit<MingaEvent, 'id' | 'attendanceClosed' | 'totalAttendees'>) => {
    const newId = `evt-${Date.now().toString().slice(-4)}`;
    const newEvent: MingaEvent = {
      ...eventData,
      id: newId,
      attendanceClosed: false,
      totalAttendees: 0,
    };

    // Pre-populate attendance records for all active socios
    const newAttendanceList: AttendanceRecord[] = socios.map(soc => ({
      id: `att-${newId}-${soc.id}`,
      eventId: newId,
      socioId: soc.id,
      socioName: soc.fullNameOrCompany,
      socioCategory: soc.category,
      identification: soc.identification,
      lotNumber: soc.lotNumber,
      status: 'ausente',
      fineCharged: false,
      fineAmount: soc.category === 'natural' ? eventData.fineAmountNatural : eventData.fineAmountJuridica,
    }));

    setEvents(prev => [newEvent, ...prev]);
    setAttendance(prev => [...prev, ...newAttendanceList]);
  };

  const updateAttendanceStatus = (
    eventId: string,
    socioId: string,
    status: AttendanceRecord['status'],
    details?: { delegateName?: string; justificationReason?: string }
  ) => {
    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    setAttendance(prev => {
      const existing = prev.find(a => a.eventId === eventId && a.socioId === socioId);
      const targetSocio = socios.find(s => s.id === socioId);
      const targetEvent = events.find(e => e.id === eventId);
      const defaultFine = targetSocio?.category === 'natural' 
        ? (targetEvent?.fineAmountNatural || 15) 
        : (targetEvent?.fineAmountJuridica || 35);

      if (existing) {
        return prev.map(a => {
          if (a.eventId === eventId && a.socioId === socioId) {
            return {
              ...a,
              status,
              checkInTime: (status === 'presente' || status === 'delegado') ? (a.checkInTime || timeStr) : undefined,
              delegateName: details?.delegateName !== undefined ? details.delegateName : a.delegateName,
              justificationReason: details?.justificationReason !== undefined ? details.justificationReason : a.justificationReason,
            };
          }
          return a;
        });
      } else if (targetSocio) {
        const newRecord: AttendanceRecord = {
          id: `att-${eventId}-${socioId}`,
          eventId,
          socioId,
          socioName: targetSocio.fullNameOrCompany,
          socioCategory: targetSocio.category,
          identification: targetSocio.identification,
          lotNumber: targetSocio.lotNumber,
          status,
          checkInTime: (status === 'presente' || status === 'delegado') ? timeStr : undefined,
          delegateName: details?.delegateName,
          justificationReason: details?.justificationReason,
          fineCharged: false,
          fineAmount: defaultFine,
        };
        return [...prev, newRecord];
      }
      return prev;
    });
  };

  const closeMingaAttendance = (eventId: string) => {
    const eventRecords = attendance.filter(a => a.eventId === eventId);
    const eventObj = events.find(e => e.id === eventId);
    if (!eventObj) return;

    let chargedSociosCount = 0;
    const sociosFinesMap: Record<string, number> = {};

    eventRecords.forEach(rec => {
      if (rec.status === 'ausente' && !rec.fineCharged) {
        const fine = rec.socioCategory === 'natural' ? eventObj.fineAmountNatural : eventObj.fineAmountJuridica;
        sociosFinesMap[rec.socioId] = fine;
        chargedSociosCount++;
      }
    });

    // Update attendance record flag
    setAttendance(prev =>
      prev.map(rec => {
        if (rec.eventId === eventId && rec.status === 'ausente') {
          return { ...rec, fineCharged: true };
        }
        return rec;
      })
    );

    // Apply fines to socios balance
    if (chargedSociosCount > 0) {
      setSocios(prev =>
        prev.map(soc => {
          if (sociosFinesMap[soc.id]) {
            const fine = sociosFinesMap[soc.id];
            return {
              ...soc,
              balanceDue: soc.balanceDue + fine,
              status: 'en_mora',
            };
          }
          return soc;
        })
      );
    }

    // Mark event attendance closed
    const totalAttending = eventRecords.filter(a => a.status === 'presente' || a.status === 'delegado').length;
    setEvents(prev =>
      prev.map(e => (e.id === eventId ? { ...e, attendanceClosed: true, totalAttendees: totalAttending } : e))
    );
  };

  const createReservation = (resData: Omit<CommunityAreaReservation, 'id' | 'status'>) => {
    const newRes: CommunityAreaReservation = {
      ...resData,
      id: `res-${Date.now().toString().slice(-4)}`,
      status: 'solicitada',
    };
    setReservations(prev => [newRes, ...prev]);
  };

  const updateReservationStatus = (id: string, status: CommunityAreaReservation['status']) => {
    setReservations(prev =>
      prev.map(r => (r.id === id ? { ...r, status } : r))
    );
  };

  const addIncident = (incData: Omit<NeighborhoodIncident, 'id' | 'date' | 'status'>) => {
    const today = new Date().toISOString().split('T')[0];
    const newInc: NeighborhoodIncident = {
      ...incData,
      id: `inc-${Date.now().toString().slice(-4)}`,
      date: today,
      status: 'reportado',
    };
    setIncidents(prev => [newInc, ...prev]);
  };

  const updateIncidentStatus = (id: string, status: NeighborhoodIncident['status']) => {
    setIncidents(prev =>
      prev.map(inc => (inc.id === id ? { ...inc, status } : inc))
    );
  };

  const resetAllData = () => {
    setSocios(INITIAL_SOCIOS);
    setPayments(INITIAL_PAYMENTS);
    setExpenses(INITIAL_EXPENSES);
    setEvents(INITIAL_EVENTS);
    setAttendance(INITIAL_ATTENDANCE);
    setReservations(INITIAL_RESERVATIONS);
    setIncidents(INITIAL_INCIDENTS);
    localStorage.clear();
  };

  const getSocioById = (id: string) => socios.find(s => s.id === id);
  const getSocioPayments = (socioId: string) => payments.filter(p => p.socioId === socioId);
  const getSocioAttendance = (socioId: string) => attendance.filter(a => a.socioId === socioId);

  return (
    <BarrioContext.Provider
      value={{
        socios,
        payments,
        expenses,
        events,
        attendance,
        reservations,
        incidents,
        currentRole,
        activeSocioId,
        activeTab,
        setActiveTab,
        setCurrentRole,
        setActiveSocioId,
        addSocio,
        updateSocio,
        deleteSocio,
        registerPayment,
        addExpense,
        deleteExpense,
        createEvent,
        updateAttendanceStatus,
        closeMingaAttendance,
        createReservation,
        updateReservationStatus,
        addIncident,
        updateIncidentStatus,
        resetAllData,
        getSocioById,
        getSocioPayments,
        getSocioAttendance,
      }}
    >
      {children}
    </BarrioContext.Provider>
  );
};

export const useBarrio = () => {
  const context = useContext(BarrioContext);
  if (!context) {
    throw new Error('useBarrio must be used within a BarrioProvider');
  }
  return context;
};
