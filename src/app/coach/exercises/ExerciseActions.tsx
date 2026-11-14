'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, X, Dumbbell } from 'lucide-react';

export function NewExerciseModal() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    name: '',
    muscleGroup: 'Pecho',
    notes: '',
  });

  const muscleGroups = [
    'Pecho',
    'Espalda',
    'Cuádriceps',
    'Isquiosurales / Glúteos',
    'Hombros',
    'Bíceps',
    'Tríceps',
    'Core / Abdomen',
    'Pantorrillas',
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch('/api/exercises', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Error al guardar');
      }

      setIsOpen(false);
      setForm({ name: '', muscleGroup: 'Pecho', notes: '' });
      router.refresh();
    } catch (err: any) {
      alert(err.message || 'Error al registrar el ejercicio');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="text-xs bg-emerald-600 hover:bg-emerald-500 text-white font-semibold px-4 py-2 rounded-lg transition flex items-center gap-1.5 shadow-sm shadow-emerald-950"
      >
        <Plus className="w-4 h-4" /> Nuevo Ejercicio
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4">
          <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-6 text-slate-100 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-emerald-500/10 text-emerald-400 rounded-lg border border-emerald-500/20">
                  <Dumbbell className="w-4 h-4" />
                </div>
                <h3 className="font-bold text-white text-base">Registrar Ejercicio</h3>
              </div>
              <button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-white p-1 rounded">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-400 font-semibold uppercase mb-1">Nombre del Ejercicio *</label>
                <input
                  required
                  type="text"
                  placeholder="Ej: Press Inclinado con Mancuernas 30°"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-slate-400 font-semibold uppercase mb-1">Grupo Muscular Principal *</label>
                <select
                  value={form.muscleGroup}
                  onChange={(e) => setForm({ ...form, muscleGroup: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                >
                  {muscleGroups.map((group) => (
                    <option key={group} value={group}>
                      {group}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-400 font-semibold uppercase mb-1">Indicaciones Biomecánicas / Notas de Técnica</label>
                <textarea
                  rows={3}
                  placeholder="Ej: Retracción escapular activa, banco a 30°, trayectoria de codos a 45° respecto al torso."
                  value={form.notes}
                  onChange={(e) => setForm({ ...form, notes: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-emerald-500 resize-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="px-3.5 py-2 bg-slate-800 text-slate-300 rounded-lg hover:bg-slate-700 transition"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-medium rounded-lg disabled:opacity-50 transition"
                >
                  {loading ? 'Guardando...' : 'Guardar Ejercicio'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

export function DeleteExerciseButton({ id, name }: { id: string; name: string }) {
  const router = useRouter();

  const handleDelete = async () => {
    if (!confirm(`¿Deseas eliminar el ejercicio "${name}"?`)) return;

    try {
      const res = await fetch(`/api/exercises?id=${id}`, { method: 'DELETE' });
      const data = await res.json();

      if (!res.ok) {
        alert(data.error || 'No se pudo eliminar');
        return;
      }

      router.refresh();
    } catch {
      alert('Error en la solicitud.');
    }
  };

  return (
    <button
      onClick={handleDelete}
      className="text-slate-500 hover:text-red-400 p-1 rounded transition text-xs"
      title="Eliminar ejercicio"
    >
      Eliminar
    </button>
  );
}