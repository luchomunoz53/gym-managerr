import { prisma } from '@/lib/prisma';
import { connection } from 'next/server';
import { CreditCard, DollarSign, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

interface PageProps {
  searchParams: Promise<{ coachId?: string }>;
}

export default async function CoachPaymentsHistoryPage({ searchParams }: PageProps) {
  await connection();
  const { coachId } = await searchParams;

  // Si viene coachId en la URL usamos ese, si no el coach por defecto
  const coach = coachId
    ? await prisma.user.findUnique({ where: { id: coachId } })
    : await prisma.user.findFirst({ where: { email: 'carlos@gym.com' } });

  if (!coach) {
    return (
      <main className="min-h-screen bg-slate-950 p-8 text-slate-100 flex items-center justify-center">
        <p className="text-sm text-slate-400">Entrenador no encontrado.</p>
      </main>
    );
  }

  // Consultamos solo los pagos de los clientes de este entrenador
  const payments = await prisma.payment.findMany({
    where: {
      client: { coachId: coach.id },
    },
    include: {
      client: true,
    },
    orderBy: { paymentDate: 'desc' },
  });

  const totalCollected = payments.reduce((acc, curr) => acc + curr.amount, 0);
  const backUrl = coachId ? `/coach?coachId=${coachId}` : '/coach';

  return (
    <main className="min-h-screen bg-slate-950 p-6 md:p-10 text-slate-100">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Cabecera */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <Link
              href={backUrl}
              className="p-2 bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-300 rounded-lg transition"
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <div>
              <h1 className="text-xl font-bold text-white flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-emerald-400" /> Mi Historial de Cobros
              </h1>
              <p className="text-xs text-slate-400">
                Registro de renovaciones y mensualidades cobradas a tus atletas ({coach.name})
              </p>
            </div>
          </div>
          <div className="bg-slate-900 border border-slate-800 px-4 py-2 rounded-xl flex items-center gap-2 text-xs">
            <DollarSign className="w-4 h-4 text-emerald-400" />
            <span>Total Recaudado:</span>
            <strong className="text-emerald-400 text-sm font-bold">
              ${totalCollected.toLocaleString()}
            </strong>
          </div>
        </div>

        {/* Tabla de Pagos del Coach */}
        <section className="rounded-xl border border-slate-800 bg-slate-900/50 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950 text-slate-400 uppercase tracking-wider border-b border-slate-800">
                <tr>
                  <th className="px-6 py-3.5">Referencia</th>
                  <th className="px-6 py-3.5">Fecha de Pago</th>
                  <th className="px-6 py-3.5">Atleta</th>
                  <th className="px-6 py-3.5">Método</th>
                  <th className="px-6 py-3.5">Próximo Vencimiento</th>
                  <th className="px-6 py-3.5 text-right">Monto</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 font-mono">
                {payments.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-8 text-center font-sans text-slate-500">
                      Aún no tienes cobros registrados en tu historial.
                    </td>
                  </tr>
                ) : (
                  payments.map((p) => (
                    <tr key={p.id} className="hover:bg-slate-800/40 transition">
                      <td className="px-6 py-4 text-emerald-400 font-semibold">
                        {p.reference}
                      </td>
                      <td className="px-6 py-4 text-slate-400">
                        {new Date(p.paymentDate).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 font-sans font-medium text-white">
                        {p.client.name}
                      </td>
                      <td className="px-6 py-4 font-sans">
                        <span className="bg-slate-800 px-2 py-0.5 rounded text-[11px] text-slate-300 border border-slate-700">
                          {p.paymentMethod}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-amber-400">
                        {new Date(p.nextDueDate).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 text-right font-bold text-white text-sm">
                        ${p.amount.toLocaleString()}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </main>
  );
}