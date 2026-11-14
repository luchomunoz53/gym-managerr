'use client';

import { useState, useEffect } from 'react';
import { X, Activity, Plus, TrendingDown, TrendingUp, Minus } from 'lucide-react';

interface MetricRecord {
  id: string;
  recordedAt: string;
  weightKg: number;
  bodyFatPercent: number | null;
  muscleMassKg: number | null;
  chestCm: number | null;
  waistCm: number | null;
  hipCm: number | null;
  armCm: number | null;
  thighCm: number | null;
  notes: string | null;
}

interface MetricsModalProps {
  clientId: string;
  clientName: string;
  isOpen: boolean;
  onClose: () => void;
}

export function MetricsModal({ clientId, clientName, isOpen, onClose }: MetricsModalProps) {
  const [metrics, setMetrics] = useState<MetricRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    weightKg: '',
    bodyFatPercent: '',
    muscleMassKg: '',
    chestCm: '',
    waistCm: '',
    hipCm: '',
    armCm: '',
    thighCm: '',
    notes: '',
  });

  const fetchMetrics = () => {
    if (!clientId) return;
    setLoading(true);
    fetch(`/api/metrics?clientId=${clientId}`)
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setMetrics(data);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    if (isOpen) {
      fetchMetrics();
      setShowForm(false);
    }
  }, [isOpen, clientId]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const res = await fetch('/api/metrics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, clientId }),
      });

      if (!res.ok) throw new Error('Error al registrar medición');

      setForm({
        weightKg: '',
        bodyFatPercent: '',
        muscleMassKg: '',
        chestCm: '',
        waistCm: '',
        hipCm: '',
        armCm: '',
        thighCm: '',
        notes: '',
      });
      setShowForm(false);
      fetchMetrics();
    } catch {
      alert('Error al guardar los datos antropométricos.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4">
      <div className="w-full max-w-3xl bg-slate-900 border border-slate-800 rounded-2xl p-6 text-slate-100 shadow-2xl max-h-[90vh] flex flex-col">
        {/* Cabecera */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
              <Activity className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-white text-base">Control Antropométrico</h3>
              <p className="text-xs text-slate-400">
                Atleta: <span className="text-emerald-400 font-semibold">{clientName}</span>
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {!showForm && (
              <button
                onClick={() => setShowForm(true)}
                className="text-xs bg-emerald-600 hover:bg-emerald-500 text-white font-medium px-3 py-1.5 rounded-lg transition flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" /> Nueva Medición
              </button>
            )}
            <button onClick={onClose} className="text-slate-400 hover:text-white p-1 rounded">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Formulario de nueva medición */}
        {showForm && (
          <form onSubmit={handleSubmit} className="mt-4 bg-slate-950/70 border border-slate-800 rounded-xl p-4 space-y-3 text-xs">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <span className="font-semibold text-white">Registrar Chequeo Físico</span>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="text-slate-400 hover:text-slate-200"
              >
                Cancelar
              </button>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-slate-400 font-semibold uppercase mb-1">Peso (kg) *</label>
                <input
                  required
                  type="number"
                  step="0.1"
                  placeholder="Ej: 75.5"
                  value={form.weightKg}
                  onChange={(e) => setForm({ ...form, weightKg: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-white focus:outline-none focus:border-emerald-500"
                />
              </div>
              <div>
                <label className="block text-slate-400 font-semibold uppercase mb-1">% Grasa</label>
                <input
                  type="number"
                  step="0.1"
                  placeholder="Ej: 14.2"
                  value={form.bodyFatPercent}
                  onChange={(e) => setForm({ ...form, bodyFatPercent: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-white focus:outline-none focus:border-emerald-500"
                />
              </div>
              <div>
                <label className="block text-slate-400 font-semibold uppercase mb-1">Masa Musc. (kg)</label>
                <input
                  type="number"
                  step="0.1"
                  placeholder="Ej: 36.0"
                  value={form.muscleMassKg}
                  onChange={(e) => setForm({ ...form, muscleMassKg: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-white focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-5 gap-2 border-t border-slate-800/80 pt-2">
              <div>
                <label className="block text-[10px] text-slate-400 uppercase">Pecho (cm)</label>
                <input
                  type="number"
                  step="0.5"
                  value={form.chestCm}
                  onChange={(e) => setForm({ ...form, chestCm: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2 py-1 text-white text-center"
                />
              </div>
              <div>
                <label className="block text-[10px] text-slate-400 uppercase">Cintura (cm)</label>
                <input
                  type="number"
                  step="0.5"
                  value={form.waistCm}
                  onChange={(e) => setForm({ ...form, waistCm: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2 py-1 text-white text-center"
                />
              </div>
              <div>
                <label className="block text-[10px] text-slate-400 uppercase">Cadera (cm)</label>
                <input
                  type="number"
                  step="0.5"
                  value={form.hipCm}
                  onChange={(e) => setForm({ ...form, hipCm: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2 py-1 text-white text-center"
                />
              </div>
              <div>
                <label className="block text-[10px] text-slate-400 uppercase">Brazo (cm)</label>
                <input
                  type="number"
                  step="0.5"
                  value={form.armCm}
                  onChange={(e) => setForm({ ...form, armCm: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2 py-1 text-white text-center"
                />
              </div>
              <div>
                <label className="block text-[10px] text-slate-400 uppercase">Muslo (cm)</label>
                <input
                  type="number"
                  step="0.5"
                  value={form.thighCm}
                  onChange={(e) => setForm({ ...form, thighCm: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2 py-1 text-white text-center"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-400 font-semibold uppercase mb-1">Notas Biomecánicas / Observaciones</label>
              <input
                type="text"
                placeholder="Ej: Buena hidratación, reducción visible en pliegue abdominal"
                value={form.notes}
                onChange={(e) => setForm({ ...form, notes: e.target.value })}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-white focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div className="flex justify-end pt-1">
              <button
                type="submit"
                disabled={saving}
                className="bg-emerald-600 hover:bg-emerald-500 text-white font-medium px-4 py-1.5 rounded-lg transition disabled:opacity-50"
              >
                {saving ? 'Guardando...' : 'Registrar Chequeo'}
              </button>
            </div>
          </form>
        )}

        {/* Lista de Registros Históricos */}
        <div className="flex-1 overflow-y-auto py-4 space-y-3">
          {loading ? (
            <div className="text-center py-10 text-slate-400 text-xs">Cargando mediciones...</div>
          ) : metrics.length === 0 ? (
            <div className="text-center py-12 border border-dashed border-slate-800 rounded-xl space-y-2">
              <Activity className="w-8 h-8 text-slate-600 mx-auto" />
              <p className="text-sm font-semibold text-slate-300">Sin tomas antropométricas</p>
              <p className="text-xs text-slate-500">
                Registra la primera medición para hacer seguimiento a la composición corporal.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-950 text-slate-400 uppercase tracking-wider border-b border-slate-800">
                  <tr>
                    <th className="px-3 py-2.5">Fecha</th>
                    <th className="px-3 py-2.5">Peso</th>
                    <th className="px-3 py-2.5">% Grasa</th>
                    <th className="px-3 py-2.5">Músculo</th>
                    <th className="px-3 py-2.5">Cintura</th>
                    <th className="px-3 py-2.5">Brazo</th>
                    <th className="px-3 py-2.5">Notas</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 font-mono">
                  {metrics.map((m, idx) => {
                    const previous = metrics[idx + 1];
                    let weightDiff = null;
                    if (previous) {
                      weightDiff = (m.weightKg - previous.weightKg).toFixed(1);
                    }

                    return (
                      <tr key={m.id} className="hover:bg-slate-800/40 transition">
                        <td className="px-3 py-3 text-slate-400 whitespace-nowrap">
                          {new Date(m.recordedAt).toLocaleDateString()}
                        </td>
                        <td className="px-3 py-3 font-semibold text-white whitespace-nowrap">
                          {m.weightKg} kg
                          {weightDiff && (
                            <span
                              className={`ml-1.5 text-[10px] inline-flex items-center ${
                                parseFloat(weightDiff) > 0
                                  ? 'text-amber-400'
                                  : parseFloat(weightDiff) < 0
                                  ? 'text-emerald-400'
                                  : 'text-slate-500'
                              }`}
                            >
                              {parseFloat(weightDiff) > 0 ? (
                                <TrendingUp className="w-3 h-3 inline mr-0.5" />
                              ) : parseFloat(weightDiff) < 0 ? (
                                <TrendingDown className="w-3 h-3 inline mr-0.5" />
                              ) : (
                                <Minus className="w-3 h-3 inline mr-0.5" />
                              )}
                              {weightDiff > '0' ? `+${weightDiff}` : weightDiff}
                            </span>
                          )}
                        </td>
                        <td className="px-3 py-3">{m.bodyFatPercent ? `${m.bodyFatPercent}%` : '-'}</td>
                        <td className="px-3 py-3">{m.muscleMassKg ? `${m.muscleMassKg} kg` : '-'}</td>
                        <td className="px-3 py-3">{m.waistCm ? `${m.waistCm} cm` : '-'}</td>
                        <td className="px-3 py-3">{m.armCm ? `${m.armCm} cm` : '-'}</td>
                        <td className="px-3 py-3 font-sans text-slate-400 text-[11px] truncate max-w-[150px]">
                          {m.notes || '-'}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-slate-800 pt-3 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700 text-xs transition"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}