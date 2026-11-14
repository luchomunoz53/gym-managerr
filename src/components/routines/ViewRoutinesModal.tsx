'use client';

import { useState, useEffect } from 'react';
import { X, Calendar, Dumbbell, Clock, Activity, Trash2, Plus } from 'lucide-react';

interface RoutineItem {
  id: string;
  sets: number;
  reps: string;
  restSec: number;
  rpe: number | null;
  exercise: {
    name: string;
    muscleGroup: string;
    notes: string | null;
  };
}

interface Routine {
  id: string;
  name: string;
  dayOfWeek: string;
  createdAt: string;
  items: RoutineItem[];
}

interface ViewRoutinesModalProps {
  clientId: string;
  clientName: string;
  isOpen: boolean;
  onClose: () => void;
  onOpenCreateModal: () => void;
}

export function ViewRoutinesModal({
  clientId,
  clientName,
  isOpen,
  onClose,
  onOpenCreateModal,
}: ViewRoutinesModalProps) {
  const [routines, setRoutines] = useState<Routine[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedDay, setSelectedDay] = useState<string>('Todos');

  const fetchRoutines = () => {
    if (!clientId) return;
    setLoading(true);
    fetch(`/api/routines?clientId=${clientId}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.clientRoutines) {
          setRoutines(data.clientRoutines);
        }
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    if (isOpen) {
      fetchRoutines();
    }
  }, [isOpen, clientId]);

  if (!isOpen) return null;

  const handleDeleteRoutine = async (routineId: string) => {
    if (!confirm('¿Deseas eliminar esta rutina de entrenamiento?')) return;
    try {
      const res = await fetch(`/api/routines?id=${routineId}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('No se pudo eliminar');
      setRoutines((prev) => prev.filter((r) => r.id !== routineId));
    } catch {
      alert('Error al eliminar la rutina.');
    }
  };

  const days = ['Todos', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];
  const filteredRoutines =
    selectedDay === 'Todos'
      ? routines
      : routines.filter((r) => r.dayOfWeek.toLowerCase() === selectedDay.toLowerCase());

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4">
      <div className="w-full max-w-3xl bg-slate-900 border border-slate-800 rounded-2xl p-6 text-slate-100 shadow-2xl max-h-[90vh] flex flex-col">
        {/* Encabezado */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
              <Dumbbell className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-white text-base">Plan de Entrenamiento</h3>
              <p className="text-xs text-slate-400">
                Atleta: <span className="text-emerald-400 font-semibold">{clientName}</span>
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                onClose();
                onOpenCreateModal();
              }}
              className="text-xs bg-emerald-600 hover:bg-emerald-500 text-white font-medium px-3 py-1.5 rounded-lg transition flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" /> Nueva Rutina
            </button>
            <button onClick={onClose} className="text-slate-400 hover:text-white p-1 rounded">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Filtro por Día */}
        <div className="flex gap-1.5 overflow-x-auto py-3 border-b border-slate-800 text-xs">
          {days.map((day) => (
            <button
              key={day}
              onClick={() => setSelectedDay(day)}
              className={`px-3 py-1 rounded-lg transition whitespace-nowrap ${
                selectedDay === day
                  ? 'bg-slate-700 text-white font-semibold'
                  : 'bg-slate-800/60 text-slate-400 hover:bg-slate-800'
              }`}
            >
              {day}
            </button>
          ))}
        </div>

        {/* Contenido de Rutinas */}
        <div className="flex-1 overflow-y-auto py-4 space-y-4">
          {loading ? (
            <div className="text-center py-12 text-slate-400 text-xs">Cargando rutinas...</div>
          ) : filteredRoutines.length === 0 ? (
            <div className="text-center py-12 border border-dashed border-slate-800 rounded-xl space-y-2">
              <Dumbbell className="w-8 h-8 text-slate-600 mx-auto" />
              <p className="text-sm font-semibold text-slate-300">Sin rutinas registradas</p>
              <p className="text-xs text-slate-500">
                {selectedDay === 'Todos'
                  ? 'Este atleta aún no tiene rutinas asignadas.'
                  : `No hay rutinas asignadas para el día ${selectedDay}.`}
              </p>
            </div>
          ) : (
            filteredRoutines.map((routine) => (
              <div
                key={routine.id}
                className="bg-slate-950/70 border border-slate-800 rounded-xl p-4 space-y-3"
              >
                <div className="flex items-center justify-between border-b border-slate-800/80 pb-2">
                  <div className="flex items-center gap-2">
                    <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs px-2.5 py-0.5 rounded-md font-semibold">
                      {routine.dayOfWeek}
                    </span>
                    <h4 className="font-semibold text-white text-sm">{routine.name}</h4>
                  </div>
                  <button
                    onClick={() => handleDeleteRoutine(routine.id)}
                    className="text-slate-500 hover:text-red-400 p-1 rounded transition"
                    title="Eliminar Rutina"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="space-y-2">
                  {routine.items.map((item, idx) => (
                    <div
                      key={item.id}
                      className="flex flex-col sm:flex-row sm:items-center justify-between bg-slate-900/60 p-2.5 rounded-lg text-xs gap-2"
                    >
                      <div>
                        <span className="text-slate-500 font-mono mr-2">{idx + 1}.</span>
                        <strong className="text-white">{item.exercise.name}</strong>
                        <span className="text-[11px] text-slate-400 ml-2">
                          ({item.exercise.muscleGroup})
                        </span>
                        {item.exercise.notes && (
                          <p className="text-[11px] text-slate-500 ml-5 italic">
                            Nota: {item.exercise.notes}
                          </p>
                        )}
                      </div>

                      <div className="flex items-center gap-3 text-slate-300 self-end sm:self-auto font-mono text-[11px]">
                        <span className="bg-slate-800 px-2 py-0.5 rounded">
                          {item.sets} x {item.reps}
                        </span>
                        <span className="flex items-center gap-1 text-slate-400">
                          <Clock className="w-3 h-3 text-slate-500" /> {item.restSec}s
                        </span>
                        {item.rpe && (
                          <span className="flex items-center gap-1 text-amber-400">
                            <Activity className="w-3 h-3" /> RPE {item.rpe}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))
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