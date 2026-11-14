'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { RefreshCw, X, DollarSign, Calendar } from 'lucide-react';

interface RenewModalProps {
  clientId: string;
  clientName: string;
  currentExpiry: Date | string;
  isOpen: boolean;
  onClose: () => void;
}

export function RenewModal({
  clientId,
  clientName,
  currentExpiry,
  isOpen,
  onClose,
}: RenewModalProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [amount, setAmount] = useState('120000');
  const [paymentMethod, setPaymentMethod] = useState('Transferencia');
  const [daysToAdd, setDaysToAdd] = useState('30');

  if (!isOpen) return null;

  const handleRenew = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch('/api/payments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          clientId,
          amount,
          paymentMethod,
          daysToAdd,
        }),
      });

      if (!res.ok) throw new Error('Error al registrar pago');

      onClose();
      router.refresh();
    } catch {
      alert('Hubo un error al procesar el pago.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4">
      <div className="w-full max-w-sm bg-slate-900 border border-slate-800 rounded-2xl p-6 text-slate-100 shadow-2xl space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-emerald-500/10 text-emerald-400 rounded-lg border border-emerald-500/20">
              <RefreshCw className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-white text-sm">Renovar Membresía</h3>
              <p className="text-[11px] text-slate-400">Atleta: <span className="text-white font-medium">{clientName}</span></p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white p-1 rounded">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleRenew} className="space-y-3.5 text-xs">
          <div>
            <label className="block text-slate-400 uppercase font-semibold mb-1">Monto Cobrado ($)</label>
            <div className="relative">
              <DollarSign className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-500" />
              <input
                required
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg pl-8 pr-3 py-2 text-white font-medium focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-400 uppercase font-semibold mb-1">Período</label>
              <select
                value={daysToAdd}
                onChange={(e) => setDaysToAdd(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-2 text-white focus:outline-none focus:border-emerald-500"
              >
                <option value="30">1 Mes (+30d)</option>
                <option value="60">2 Meses (+60d)</option>
                <option value="90">3 Meses (+90d)</option>
                <option value="15">Quincenal (+15d)</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-400 uppercase font-semibold mb-1">Medio</label>
              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-2 text-white focus:outline-none focus:border-emerald-500"
              >
                <option value="Transferencia">Transferencia</option>
                <option value="Efectivo">Efectivo</option>
                <option value="Tarjeta">Tarjeta</option>
              </select>
            </div>
          </div>

          <div className="bg-slate-950/70 border border-slate-800 rounded-lg p-2.5 text-[11px] text-slate-400 space-y-1">
            <div className="flex justify-between">
              <span>Corte previo:</span>
              <span className="text-slate-300">{new Date(currentExpiry).toLocaleDateString()}</span>
            </div>
            <div className="flex justify-between font-semibold text-emerald-400">
              <span>Se extenderá por:</span>
              <span>+{daysToAdd} días</span>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-2 bg-slate-800 text-slate-300 rounded-lg hover:bg-slate-700 transition"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-medium rounded-lg disabled:opacity-50 transition"
            >
              {loading ? 'Procesando...' : 'Cobrar y Extender'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}