import { prisma } from '@/lib/prisma';
import { getPaymentStatus } from '@/lib/utils';
import { Dumbbell, Calendar, Activity, CheckCircle2, AlertCircle, Clock, ShieldCheck, ArrowLeft } from 'lucide-react';
import { connection } from 'next/server';
import Link from 'next/link';

interface PortalProps {
  searchParams: Promise<{ search?: string }>;
}

export default async function AthletePortalPage({ searchParams }: PortalProps) {
  await connection();
  const { search } = await searchParams;

  // Busca el atleta por correo o teléfono
  const client = search
    ? await prisma.client.findFirst({
        where: {
          OR: [{ email: search }, { phone: search }],
        },
        include: {
          coach: true,
          routines: {
            include: {
              items: {
                include: { exercise: true },
                orderBy: { orderIndex: 'asc' },
              },
            },
          },
          metrics: {
            orderBy: { recordedAt: 'desc' },
            take: 3,
          },
          payments: {
            orderBy: { paymentDate: 'desc' },
            take: 1,
          },
        },
      })
    : await prisma.client.findFirst({
        // Si no pasa búsqueda, muestra el primer atleta de prueba
        include: {
          coach: true,
          routines: {
            include: {
              items: {
                include: { exercise: true },
                orderBy: { orderIndex: 'asc' },
              },
            },
          },
          metrics: {
            orderBy: { recordedAt: 'desc' },
            take: 3,
          },
          payments: {
            orderBy: { paymentDate: 'desc' },
            take: 1,
          },
        },
      });

  if (!client) {
    return (
      <main className="min-h-screen bg-slate-950 p-8 text-slate-100 flex items-center justify-center">
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl text-center space-y-3 max-w-sm">
          <AlertCircle className="w-8 h-8 text-amber-400 mx-auto" />
          <h2 className="font-bold text-white">Atleta no encontrado</h2>
          <p className="text-xs text-slate-400">Verifica que tu correo o teléfono coincida con el registrado por tu entrenador.</p>
          <Link href="/login" className="inline-block text-xs text-emerald-400 font-semibold hover:underline">
            Volver a intentar
          </Link>
        </div>
      </main>
    );
  }

  const paymentInfo = getPaymentStatus(client.membershipExpiry);
  const lastMetric = client.metrics[0];

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 p-6 md:p-10">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Barra superior de navegación */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400">
              <Dumbbell className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">Hola, {client.name}</h1>
              <p className="text-xs text-slate-400">
                Entrenador: <span className="text-emerald-400 font-medium">{client.coach.name}</span>
              </p>
            </div>
          </div>
          <Link
            href="/"
            className="text-xs bg-slate-900 border border-slate-800 hover:bg-slate-800 px-3 py-1.5 rounded-lg text-slate-300 flex items-center gap-1 transition"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Salir
          </Link>
        </div>

        {/* Tarjetas de Estado (Membresía + Composición Actual) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Estado de Membresía */}
          <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 space-y-3">
            <span className="text-xs font-semibold uppercase text-slate-400 tracking-wider">Estado de Mensualidad</span>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-lg font-bold text-white">{client.membershipPlan}</p>
                <p className="text-xs text-slate-400">
                  Vence: {new Date(client.membershipExpiry).toLocaleDateString()}
                </p>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${paymentInfo.badgeClass}`}>
                {paymentInfo.label}
              </span>
            </div>
          </div>

          {/* Última Medición Física */}
          <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 space-y-3">
            <span className="text-xs font-semibold uppercase text-slate-400 tracking-wider">Progreso Físico Actual</span>
            {lastMetric ? (
              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="bg-slate-950/60 p-2 rounded-lg border border-slate-800/80">
                  <span className="text-[10px] text-slate-500 uppercase block">Peso</span>
                  <span className="text-sm font-bold text-white">{lastMetric.weightKg} kg</span>
                </div>
                <div className="bg-slate-950/60 p-2 rounded-lg border border-slate-800/80">
                  <span className="text-[10px] text-slate-500 uppercase block">% Grasa</span>
                  <span className="text-sm font-bold text-emerald-400">{lastMetric.bodyFatPercent || '-'}%</span>
                </div>
                <div className="bg-slate-950/60 p-2 rounded-lg border border-slate-800/80">
                  <span className="text-[10px] text-slate-500 uppercase block">Cintura</span>
                  <span className="text-sm font-bold text-white">{lastMetric.waistCm || '-'} cm</span>
                </div>
              </div>
            ) : (
              <p className="text-xs text-slate-500 pt-2">Aún no tienes mediciones registradas por tu coach.</p>
            )}
          </div>
        </div>

        {/* Plan de Rutinas Semanales */}
        <section className="rounded-xl border border-slate-800 bg-slate-900/50 p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h2 className="font-bold text-white text-base flex items-center gap-2">
              <Calendar className="w-5 h-5 text-emerald-400" /> Mi Plan de Entrenamiento
            </h2>
            <span className="text-xs text-slate-500">{client.routines.length} rutinas activas</span>
          </div>

          {client.routines.length === 0 ? (
            <p className="text-xs text-slate-500 py-6 text-center">
              Tu entrenador aún no ha cargado rutinas para tu plan.
            </p>
          ) : (
            <div className="space-y-4">
              {client.routines.map((routine) => (
                <div key={routine.id} className="bg-slate-950/80 border border-slate-800 rounded-xl p-4 space-y-3">
                  <div className="flex items-center gap-2 border-b border-slate-800/70 pb-2">
                    <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs px-2.5 py-0.5 rounded-md font-semibold">
                      {routine.dayOfWeek}
                    </span>
                    <h3 className="font-semibold text-white text-sm">{routine.name}</h3>
                  </div>

                  <div className="space-y-2">
                    {routine.items.map((item, idx) => (
                      <div
                        key={item.id}
                        className="flex flex-col sm:flex-row sm:items-center justify-between bg-slate-900/50 p-2.5 rounded-lg text-xs gap-2"
                      >
                        <div>
                          <span className="text-slate-500 font-mono mr-2">{idx + 1}.</span>
                          <strong className="text-white">{item.exercise.name}</strong>
                          <span className="text-[11px] text-slate-400 ml-2">({item.exercise.muscleGroup})</span>
                          {item.exercise.notes && (
                            <p className="text-[11px] text-slate-500 ml-5 italic">Técnica: {item.exercise.notes}</p>
                          )}
                        </div>

                        <div className="flex items-center gap-3 text-slate-300 font-mono text-[11px] self-end sm:self-auto">
                          <span className="bg-slate-800 px-2 py-0.5 rounded font-semibold text-emerald-400">
                            {item.sets} x {item.reps}
                          </span>
                          <span className="flex items-center gap-1 text-slate-400">
                            <Clock className="w-3 h-3" /> {item.restSec}s
                          </span>
                          {item.rpe && <span className="text-amber-400 font-medium">RPE {item.rpe}</span>}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}