import { prisma } from '@/lib/prisma';
import { connection } from 'next/server';
import { Dumbbell, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { NewExerciseModal, DeleteExerciseButton } from '@/app/coach/exercises/ExerciseActions';

interface PageProps {
  searchParams: Promise<{ coachId?: string }>;
}

export default async function CoachExercisesPage({ searchParams }: PageProps) {
  await connection();
  const { coachId } = await searchParams;

  const exercises = await prisma.exercise.findMany({
    orderBy: [{ muscleGroup: 'asc' }, { name: 'asc' }],
    include: {
      routineItems: true,
    },
  });

  const backUrl = coachId ? `/coach?coachId=${coachId}` : '/coach';

  return (
    <main className="min-h-screen bg-slate-950 p-6 md:p-10 text-slate-100">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Navegación Superior */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <Link
              href={backUrl}
              className="p-2 bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-300 rounded-lg transition"
              title="Volver a mi panel"
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <div>
              <h1 className="text-xl font-bold text-white flex items-center gap-2">
                <Dumbbell className="w-5 h-5 text-emerald-400" /> Banco de Ejercicios
              </h1>
              <p className="text-xs text-slate-400">
                Gestiona y añade variantes biomecánicas para asignar a las rutinas de tus atletas ({exercises.length} movimientos)
              </p>
            </div>
          </div>
          <NewExerciseModal />
        </div>

        {/* Tabla de Ejercicios */}
        <section className="rounded-xl border border-slate-800 bg-slate-900/50 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-900 text-slate-400 uppercase tracking-wider border-b border-slate-800">
                <tr>
                  <th className="px-6 py-3.5">Ejercicio</th>
                  <th className="px-6 py-3.5">Grupo Muscular</th>
                  <th className="px-6 py-3.5">Notas Técnicas / Biomecánica</th>
                  <th className="px-6 py-3.5 text-center">Uso en Rutinas</th>
                  <th className="px-6 py-3.5 text-right">Acción</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {exercises.map((ex) => (
                  <tr key={ex.id} className="hover:bg-slate-800/40 transition">
                    <td className="px-6 py-4 font-semibold text-white">
                      {ex.name}
                    </td>
                    <td className="px-6 py-4">
                      <span className="rounded-md bg-slate-800 px-2.5 py-1 text-[11px] font-medium text-emerald-400 border border-slate-700">
                        {ex.muscleGroup}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-400 text-[11px] max-w-xs">
                      {ex.notes || <span className="text-slate-600 italic">Sin notas específicas</span>}
                    </td>
                    <td className="px-6 py-4 text-center font-mono">
                      {ex.routineItems.length}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <DeleteExerciseButton id={ex.id} name={ex.name} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </main>
  );
}