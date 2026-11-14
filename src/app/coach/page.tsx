import { prisma } from '@/lib/prisma';
import { getPaymentStatus } from '@/lib/utils';
import { Users, AlertCircle, CheckCircle2, ArrowLeft, ShieldAlert, Dumbbell } from 'lucide-react';
import type { Client, Payment } from '@prisma/client';
import { CoachActions, ClientRowActions } from './CoachActions';
import { connection } from 'next/server';
import Link from 'next/link';

type ClientWithPayments = Client & {
  payments: Payment[];
};

interface PageProps {
  searchParams: Promise<{ coachId?: string }>;
}

export default async function CoachDashboardPage({ searchParams }: PageProps) {
  await connection();
  
  // Resolvemos los parámetros de la URL
  const { coachId } = await searchParams;

  // Si viene coachId en la URL buscamos por ese ID; si no, tomamos el primero disponible
  const coach = coachId
    ? await prisma.user.findUnique({
        where: { id: coachId },
        include: {
          clients: {
            include: {
              payments: {
                orderBy: { paymentDate: 'desc' },
                take: 1,
              },
            },
          },
        },
      })
    : await prisma.user.findFirst({
        where: { email: 'carlos@gym.com' },
        include: {
          clients: {
            include: {
              payments: {
                orderBy: { paymentDate: 'desc' },
                take: 1,
              },
            },
          },
        },
      });

  if (!coach) {
    return (
      <main className="min-h-screen bg-slate-950 p-10 text-slate-100 flex items-center justify-center">
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl text-center space-y-3">
          <p className="text-amber-400 font-semibold">Entrenador no encontrado</p>
          <p className="text-xs text-slate-400">El ID proporcionado no coincide con ningún registro activo.</p>
          <Link
            href="/admin"
            className="inline-flex items-center gap-1.5 text-xs bg-slate-800 hover:bg-slate-700 px-3 py-2 rounded-lg text-slate-200 transition"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Volver al Panel Admin
          </Link>
        </div>
      </main>
    );
  }

  const clients: ClientWithPayments[] = coach.clients;
  const overdueCount = clients.filter(
    (c: ClientWithPayments) => getPaymentStatus(c.membershipExpiry).status === 'OVERDUE'
  ).length;

  return (
    <main className="min-h-screen bg-slate-950 p-6 md:p-10 text-slate-100">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Banner de Navegación Admin / Suplantación */}
        <div className="flex items-center justify-between bg-slate-900/80 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-300">
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-amber-400" />
            <span>
              Vista de Entrenador: <strong className="text-white">{coach.name}</strong> ({coach.email})
            </span>
          </div>
          <Link
            href="/admin"
            className="inline-flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 px-3 py-1.5 rounded-lg border border-slate-700 transition"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Volver al Admin
          </Link>
        </div>

        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
  <div>
    <h1 className="text-2xl font-bold tracking-tight text-white">
      Portal del Entrenador
    </h1>
    <p className="text-sm text-slate-400">
      Bienvenido, <span className="text-emerald-400 font-semibold">{coach.name}</span>
    </p>
  </div>
  <div className="flex items-center gap-3">
    <Link
      href={`/coach/exercises${coachId ? `?coachId=${coachId}` : ''}`}
      className="text-xs bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 font-medium px-3 py-1.5 rounded-lg transition flex items-center gap-1.5"
    >
      <Dumbbell className="w-3.5 h-3.5 text-emerald-400" />
      Banco de Ejercicios
    </Link>
    <span className="rounded-full bg-slate-800 px-3 py-1 text-xs text-slate-300 border border-slate-700">
      Comisión: {coach.commissionRate * 100}%
    </span>
  </div>
</header>

        {/* Tarjetas de Métricas */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 flex items-center gap-4">
            <div className="rounded-lg bg-blue-500/10 p-3 text-blue-400 border border-blue-500/20">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">Mis Atletas</p>
              <p className="text-2xl font-bold text-white">{clients.length}</p>
            </div>
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 flex items-center gap-4">
            <div className="rounded-lg bg-amber-500/10 p-3 text-amber-400 border border-amber-500/20">
              <AlertCircle className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">Pagos Vencidos</p>
              <p className="text-2xl font-bold text-amber-400">{overdueCount}</p>
            </div>
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 flex items-center gap-4">
            <div className="rounded-lg bg-emerald-500/10 p-3 text-emerald-400 border border-emerald-500/20">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">Al día</p>
              <p className="text-2xl font-bold text-emerald-400">{clients.length - overdueCount}</p>
            </div>
          </div>
        </section>

        {/* Tabla de Atletas */}
        <section className="rounded-xl border border-slate-800 bg-slate-900/50 overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-white">Atletas Asignados</h2>
            <CoachActions coachId={coach.id} />
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-300">
              <thead className="bg-slate-900 text-xs uppercase tracking-wider text-slate-400 border-b border-slate-800">
                <tr>
                  <th className="px-6 py-3">Nombre</th>
                  <th className="px-6 py-3">Plan</th>
                  <th className="px-6 py-3">Estado Membresía</th>
                  <th className="px-6 py-3">Último Pago</th>
                  <th className="px-6 py-3 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {clients.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-8 text-center text-xs text-slate-500">
                      Este entrenador aún no tiene atletas asignados. Haz clic en "+ Nuevo Atleta" para agregar el primero.
                    </td>
                  </tr>
                ) : (
                  clients.map((client: ClientWithPayments) => {
                    const paymentInfo = getPaymentStatus(client.membershipExpiry);
                    const lastPayment = client.payments[0];

                    return (
                      <tr key={client.id} className="hover:bg-slate-800/40 transition">
                        <td className="px-6 py-4 font-medium text-white">
                          <div>{client.name}</div>
                          <div className="text-xs text-slate-500">{client.phone || client.email}</div>
                        </td>
                        <td className="px-6 py-4">{client.membershipPlan}</td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${paymentInfo.badgeClass}`}>
                            {paymentInfo.label}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-xs text-slate-400">
                          {lastPayment ? `$${lastPayment.amount.toLocaleString()} (${lastPayment.paymentMethod})` : 'Sin registro'}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <ClientRowActions
                            clientId={client.id}
                            coachId={coach.id}
                            clientName={client.name}
                            coachName={coach.name}
                            membershipExpiry={client.membershipExpiry}
                            lastPayment={lastPayment ? {
                              reference: lastPayment.reference,
                              amount: lastPayment.amount,
                              paymentMethod: lastPayment.paymentMethod,
                              paymentDate: lastPayment.paymentDate,
                              nextDueDate: lastPayment.nextDueDate,
                            } : undefined}
                          />
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </main>
  );
}