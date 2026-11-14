'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { UserPlus, X, Printer } from 'lucide-react';
import { RoutineModal } from '@/components/routines/RoutineModal';
import { Dumbbell } from 'lucide-react';
import { ViewRoutinesModal } from '@/components/routines/ViewRoutinesModal';
import { MetricsModal } from '@/components/dashboard/MetricsModal';
import { Activity } from 'lucide-react';
import { RenewModal } from '@/components/payments/RenewModal';
import { RefreshCw } from 'lucide-react';

interface CoachActionsProps {
  coachId: string;
}

export function CoachActions({ coachId }: CoachActionsProps) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    membershipPlan: 'Plan Mensual Personalizado',
    membershipExpiry: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    initialAmount: '120000',
    paymentMethod: 'Transferencia',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch('/api/clients', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, coachId }),
      });

      if (!res.ok) throw new Error('Error al registrar');

      setIsOpen(false);
      setFormData({
        name: '',
        email: '',
        phone: '',
        membershipPlan: 'Plan Mensual Personalizado',
        membershipExpiry: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        initialAmount: '120000',
        paymentMethod: 'Transferencia',
      });
      router.refresh();
    } catch {
      alert('Error al registrar atleta en la base de datos.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="text-xs bg-emerald-600 hover:bg-emerald-500 text-white font-semibold px-3.5 py-2 rounded-lg transition flex items-center gap-1.5 shadow-sm shadow-emerald-950"
      >
        <UserPlus className="w-3.5 h-3.5" />
        Nuevo Atleta
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl text-slate-100">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-bold text-white text-base">Registrar Nuevo Atleta</h3>
              <button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-white p-1 rounded">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="mt-4 space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold uppercase text-slate-400 mb-1">Nombre Completo *</label>
                <input
                  required
                  type="text"
                  placeholder="Ej: Laura Castro"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold uppercase text-slate-400 mb-1">WhatsApp / Teléfono</label>
                  <input
                    type="text"
                    placeholder="300 123 4567"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block font-semibold uppercase text-slate-400 mb-1">Correo Electrónico</label>
                  <input
                    type="email"
                    placeholder="correo@ejemplo.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold uppercase text-slate-400 mb-1">Plan de Entrenamiento</label>
                <input
                  type="text"
                  value={formData.membershipPlan}
                  onChange={(e) => setFormData({ ...formData, membershipPlan: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-3 gap-2 border-t border-slate-800 pt-3">
                <div>
                  <label className="block font-semibold uppercase text-slate-400 mb-1">Monto ($)</label>
                  <input
                    type="number"
                    value={formData.initialAmount}
                    onChange={(e) => setFormData({ ...formData, initialAmount: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-2 text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block font-semibold uppercase text-slate-400 mb-1">Medio</label>
                  <select
                    value={formData.paymentMethod}
                    onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-2 py-2 text-white focus:outline-none focus:border-emerald-500"
                  >
                    <option value="Transferencia">Transferencia</option>
                    <option value="Efectivo">Efectivo</option>
                    <option value="Tarjeta">Tarjeta</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold uppercase text-slate-400 mb-1">Vence</label>
                  <input
                    type="date"
                    value={formData.membershipExpiry}
                    onChange={(e) => setFormData({ ...formData, membershipExpiry: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-2 py-2 text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2.5 pt-4">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="px-3.5 py-2 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700 transition"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-medium disabled:opacity-50 transition"
                >
                  {loading ? 'Guardando...' : 'Guardar y Activar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

interface ClientRowActionsProps {
  clientId: string;
  coachId: string;
  clientName: string;
  coachName: string;
  membershipExpiry: Date | string;
  lastPayment?: {
    reference: string;
    amount: number;
    paymentMethod: string;
    paymentDate: Date | string;
    nextDueDate: Date | string;
  };
}

export function ClientRowActions({
  clientId,
  coachId,
  clientName,
  coachName,
  membershipExpiry,
  lastPayment,
}: ClientRowActionsProps) {
  const [showReceipt, setShowReceipt] = useState(false);
  const [showViewRoutine, setShowViewRoutine] = useState(false);
  const [showCreateRoutine, setShowCreateRoutine] = useState(false);
  const [showMetrics, setShowMetrics] = useState(false);
  const [showRenew, setShowRenew] = useState(false); // Estado de renovación

  return (
    <>
      {/* Botón de Renovación Rápida */}
      <button
        onClick={() => setShowRenew(true)}
        className="p-1.5 hover:bg-slate-800 rounded text-slate-400 hover:text-emerald-400 transition"
        title="Renovar Membresía"
      >
        <RefreshCw className="w-4 h-4 inline" />
      </button>

      {/* Botón de Rutinas */}
      <button
        onClick={() => setShowViewRoutine(true)}
        className="p-1.5 hover:bg-slate-800 rounded text-slate-400 hover:text-blue-400 transition ml-1"
        title="Ver y Gestionar Rutinas"
      >
        <Dumbbell className="w-4 h-4 inline" />
      </button>

      {/* Botón de Antropometría */}
      <button
        onClick={() => setShowMetrics(true)}
        className="p-1.5 hover:bg-slate-800 rounded text-slate-400 hover:text-purple-400 transition ml-1"
        title="Control Antropométrico"
      >
        <Activity className="w-4 h-4 inline" />
      </button>

      {/* Botón de Recibo */}
      <button
        onClick={() => {
          if (!lastPayment) {
            alert('Este atleta no tiene pagos registrados aún.');
            return;
          }
          setShowReceipt(true);
        }}
        className="p-1.5 hover:bg-slate-800 rounded text-slate-400 hover:text-amber-400 transition ml-1"
        title="Ver Recibo Digital"
      >
        <Printer className="w-4 h-4 inline" />
      </button>

      {/* Modal de Renovación */}
      <RenewModal
        clientId={clientId}
        clientName={clientName}
        currentExpiry={membershipExpiry}
        isOpen={showRenew}
        onClose={() => setShowRenew(false)}
      />

      {/* Modal Antropometría */}
      <MetricsModal
        clientId={clientId}
        clientName={clientName}
        isOpen={showMetrics}
        onClose={() => setShowMetrics(false)}
      />

      {/* Modal Ver Rutinas */}
      <ViewRoutinesModal
        clientId={clientId}
        clientName={clientName}
        isOpen={showViewRoutine}
        onClose={() => setShowViewRoutine(false)}
        onOpenCreateModal={() => setShowCreateRoutine(true)}
      />

      {/* Modal Crear Rutina */}
      <RoutineModal
        clientId={clientId}
        clientName={clientName}
        coachId={coachId}
        isOpen={showCreateRoutine}
        onClose={() => {
          setShowCreateRoutine(false);
          setShowViewRoutine(true);
        }}
      />

      {/* Modal Recibo */}
      {showReceipt && lastPayment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4">
          <div className="w-full max-w-sm bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-2xl text-slate-100 space-y-4">
            <div className="text-center border-b border-slate-800 pb-3">
              <span className="text-xs uppercase tracking-widest text-emerald-400 font-bold">Comprobante Oficial</span>
              <h4 className="text-base font-bold text-white mt-0.5">Recibo de Mensualidad</h4>
              <p className="text-[11px] text-slate-500 font-mono mt-1">{lastPayment.reference}</p>
            </div>

            <div className="text-xs space-y-2">
              <div className="flex justify-between py-1 border-b border-slate-800/60">
                <span className="text-slate-400">Atleta:</span>
                <span className="font-semibold text-white">{clientName}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800/60">
                <span className="text-slate-400">Entrenador:</span>
                <span className="text-slate-200">{coachName}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800/60">
                <span className="text-slate-400">Método:</span>
                <span className="text-slate-200">{lastPayment.paymentMethod}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800/60">
                <span className="text-slate-400">Vence:</span>
                <span className="text-amber-400 font-medium">
                  {new Date(lastPayment.nextDueDate).toLocaleDateString()}
                </span>
              </div>
              <div className="flex justify-between pt-2 text-sm font-bold">
                <span className="text-slate-300">Total Pagado:</span>
                <span className="text-emerald-400">${lastPayment.amount.toLocaleString()}</span>
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                onClick={() => window.print()}
                className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white font-medium py-2 rounded-lg text-xs transition"
              >
                Imprimir
              </button>
              <button
                onClick={() => setShowReceipt(false)}
                className="px-4 bg-slate-800 hover:bg-slate-700 text-slate-300 py-2 rounded-lg text-xs transition"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}