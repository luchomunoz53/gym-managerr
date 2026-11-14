'use client';

import { useState, useEffect } from 'react';
import { X, Plus, Trash2, Dumbbell } from 'lucide-react';

interface Exercise {
  id: string;
  name: string;
  muscleGroup: string;
  notes: string | null;
}

interface RoutineItemInput {
  exerciseId: string;
  sets: number;
  reps: string;
  restSec: number;
  rpe: number;
}

interface RoutineModalProps {
  clientId: string;
  clientName: string;
  coachId: string;
  isOpen: boolean;
  onClose: () => void;
}

export function RoutineModal({ clientId, clientName, coachId, isOpen, onClose }: RoutineModalProps) {
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [loading, setLoading] = useState(false);
  const [routineName, setRoutineName] = useState('Torso Pesado - Fuerza');
  const [dayOfWeek, setDayOfWeek] = useState('Lunes');

  const [items, setItems] = useState<RoutineItemInput[]>([
    { exerciseId: '', sets: 4, reps: '8-10', restSec: 90, rpe: 8 },
  ]);

  useEffect(() => {
    if (!isOpen) return;
    fetch('/api/routines')
      .then((res) => res.json())
      .then((data) => {
        if (data.exercises) {
          setExercises(data.exercises);
          if (data.exercises.length > 0 && !items[0].exerciseId) {
            setItems([{ exerciseId: data.exercises[0].id, sets: 4, reps: '8-10', restSec: 90, rpe: 8 }]);
          }
        }
      })
      .catch((err) => console.error(err));
  }, [isOpen]);

  if (!isOpen) return null;

  const handleAddItem = () => {
    setItems((prev) => [
      ...prev,
      { exerciseId: exercises[0]?.id || '', sets: 3, reps: '10-12', restSec: 60, rpe: 8 },
    ]);
  };

  const handleRemoveItem = (index: number) => {
    setItems((prev) => prev.filter((_, i) => i !== index));
  };

  const handleUpdateItem = (index: number, field: keyof RoutineItemInput, value: any) => {
    setItems((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch('/api/routines', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: routineName,
          dayOfWeek,
          clientId,
          coachId,
          items,
        }),
      });

      if (!res.ok) throw new Error('Error al guardar rutina');
      alert('¡Rutina asignada exitosamente!');
      onClose();
    } catch {
      alert('Error al registrar la rutina.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm">
      <div className="w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-2xl p-6 text-slate-100 shadow-2xl max-h-[90vh] flex flex-col">
        {/* Cabecera */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <Dumbbell className="w-5 h-5 text-emerald-400" />
            <div>
              <h3 className="font-bold text-white text-base">Asignar Rutina</h3>
              <p className="text-xs text-slate-400">Atleta: <span className="text-emerald-400 font-semibold">{clientName}</span></p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white p-1 rounded">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="mt-4 flex-1 overflow-y-auto space-y-4 pr-1 text-xs">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold uppercase text-slate-400 mb-1">Nombre de la Rutina</label>
              <input
                required
                type="text"
                value={routineName}
                onChange={(e) => setRoutineName(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
              />
            </div>
            <div>
              <label className="block font-semibold uppercase text-slate-400 mb-1">Día Asignado</label>
              <select
                value={dayOfWeek}
                onChange={(e) => setDayOfWeek(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
              >
                <option value="Lunes">Lunes</option>
                <option value="Martes">Martes</option>
                <option value="Miércoles">Miércoles</option>
                <option value="Jueves">Jueves</option>
                <option value="Viernes">Viernes</option>
                <option value="Sábado">Sábado</option>
                <option value="Domingo">Domingo</option>
              </select>
            </div>
          </div>

          {/* Bloque de ejercicios dinámicos */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between">
              <span className="font-semibold uppercase text-slate-400 tracking-wider">Ejercicios del Día</span>
              <button
                type="button"
                onClick={handleAddItem}
                className="flex items-center gap-1 text-emerald-400 hover:text-emerald-300 font-semibold"
              >
                <Plus className="w-3.5 h-3.5" /> Agregar Ejercicio
              </button>
            </div>

            {items.map((item, index) => (
              <div key={index} className="flex flex-col md:flex-row gap-2 items-center bg-slate-950/60 p-3 rounded-xl border border-slate-800">
                <div className="flex-1 w-full">
                  <label className="block text-[10px] text-slate-500 uppercase mb-1">Ejercicio</label>
                  <select
                    value={item.exerciseId}
                    onChange={(e) => handleUpdateItem(index, 'exerciseId', e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-white focus:outline-none focus:border-emerald-500"
                  >
                    {exercises.map((ex) => (
                      <option key={ex.id} value={ex.id}>
                        {ex.name} ({ex.muscleGroup})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-4 gap-2 w-full md:w-auto">
                  <div>
                    <label className="block text-[10px] text-slate-500 uppercase mb-1">Series</label>
                    <input
                      type="number"
                      min={1}
                      value={item.sets}
                      onChange={(e) => handleUpdateItem(index, 'sets', e.target.value)}
                      className="w-14 bg-slate-900 border border-slate-700 rounded-lg px-2 py-1.5 text-center text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-slate-500 uppercase mb-1">Reps</label>
                    <input
                      type="text"
                      value={item.reps}
                      onChange={(e) => handleUpdateItem(index, 'reps', e.target.value)}
                      className="w-16 bg-slate-900 border border-slate-700 rounded-lg px-2 py-1.5 text-center text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-slate-500 uppercase mb-1">Descanso(s)</label>
                    <input
                      type="number"
                      step={15}
                      value={item.restSec}
                      onChange={(e) => handleUpdateItem(index, 'restSec', e.target.value)}
                      className="w-16 bg-slate-900 border border-slate-700 rounded-lg px-2 py-1.5 text-center text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-slate-500 uppercase mb-1">RPE</label>
                    <input
                      type="number"
                      min={1}
                      max={10}
                      value={item.rpe}
                      onChange={(e) => handleUpdateItem(index, 'rpe', e.target.value)}
                      className="w-12 bg-slate-900 border border-slate-700 rounded-lg px-2 py-1.5 text-center text-white"
                    />
                  </div>
                </div>

                {items.length > 1 && (
                  <button
                    type="button"
                    onClick={() => handleRemoveItem(index)}
                    className="p-1.5 text-slate-500 hover:text-red-400 mt-4 md:mt-3"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}
          </div>

          <div className="flex justify-end gap-2.5 pt-4 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700 transition"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-medium disabled:opacity-50 transition"
            >
              {loading ? 'Guardando...' : 'Asignar Rutina'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}