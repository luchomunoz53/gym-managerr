import { prisma } from '@/lib/prisma';
import { Role } from '@prisma/client';
import { connection } from 'next/server';
import { Users, UserPlus, ExternalLink, ShieldCheck, Dumbbell } from 'lucide-react';
import { NewTrainerModal } from './AdminActions';
import Link from 'next/link';

export default async function AdminDashboardPage() {
  await connection();

  // Consultamos los entrenadores y sus atletas
  const trainers = await prisma.user.findMany({
    where: { role: Role.COACH },
    include: {
      clients: true,
    },
    orderBy: { createdAt: 'desc' },
  });

  const totalClients = await prisma.client.count();

  return (
    <main className="min-h-screen bg-slate-950 p-6 md:p-10 text-slate-100">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Encabezado */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
              <ShieldCheck className="w-6 h-6 text-emerald-400" />
              Gestión Operativa de Plataforma
            </h1>
            <p className="text-sm text-slate-400">
              Administración de cuentas de entrenadores y accesos a sus portales de trabajo.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <NewTrainerModal />
          </div>
        </header>

        {/* Métricas Operativas (Sin finanzas, solo estructura) */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 flex items-center gap-4">
            <div className="rounded-lg bg-emerald-500/10 p-3 text-emerald-400 border border-emerald-500/20">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">Entrenadores Activos</p>
              <p className="text-2xl font-bold text-white">{trainers.length}</p>
            </div>
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 flex items-center gap-4">
            <div className="rounded-lg bg-blue-500/10 p-3 text-blue-400 border border-blue-500/20">
              <Dumbbell className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">Total Atletas Registrados</p>
              <p className="text-2xl font-bold text-white">{totalClients}</p>
            </div>
          </div>
        </section>

        {/* Directorio de Entrenadores y Acceso a Portales */}
        <section className="rounded-xl border border-slate-800 bg-slate-900/50 overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-800 flex justify-between items-center">
            <h2 className="text-base font-semibold text-white">Cuentas de Entrenadores</h2>
            <span className="text-xs text-slate-500">{trainers.length} cuentas configuradas</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-900 text-slate-400 uppercase tracking-wider border-b border-slate-800">
                <tr>
                  <th className="px-6 py-3.5">Entrenador</th>
                  <th className="px-6 py-3.5">Credencial / Correo</th>
                  <th className="px-6 py-3.5">Teléfono</th>
                  <th className="px-6 py-3.5 text-center">Atletas Asignados</th>
                  <th className="px-6 py-3.5 text-right">Acción Operativa</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {trainers.map((trainer) => (
                  <tr key={trainer.id} className="hover:bg-slate-800/40 transition">
                    <td className="px-6 py-4 font-semibold text-white">
                      {trainer.name}
                    </td>
                    <td className="px-6 py-4 text-slate-400 font-mono">
                      {trainer.email}
                    </td>
                    <td className="px-6 py-4 text-slate-400">
                      {trainer.phone || 'Sin registrar'}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="rounded-full bg-slate-800 px-3 py-1 text-xs font-semibold text-emerald-400 border border-slate-700">
                        {trainer.clients.length}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Link
                        href={`/coach?coachId=${trainer.id}`}
                        className="inline-flex items-center gap-1.5 text-xs bg-slate-800 hover:bg-slate-700 text-white px-3 py-1.5 rounded-lg border border-slate-700 transition"
                      >
                        Acceder a su Portal <ExternalLink className="w-3 h-3 text-slate-400" />
                      </Link>
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