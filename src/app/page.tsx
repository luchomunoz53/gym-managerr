import Link from 'next/link';
import { Dumbbell, ShieldCheck, UserCheck, ArrowRight, Activity, CalendarCheck } from 'lucide-react';

export default function HomePage() {
  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between selection:bg-emerald-500 selection:text-black">
      {/* Navbar Superior */}
      <header className="border-b border-slate-800/80 bg-slate-950/70 backdrop-blur-md px-6 py-4 flex items-center justify-between max-w-7xl mx-auto w-full">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
            <Dumbbell className="w-5 h-5" />
          </div>
          <span className="font-extrabold text-lg tracking-wider text-white">
            GYM<span className="text-emerald-400">MANAGER</span>
          </span>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/login"
            className="text-xs bg-slate-800 hover:bg-slate-700 text-slate-200 px-4 py-2 rounded-lg border border-slate-700 font-medium transition"
          >
            Iniciar Sesión
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-5xl mx-auto px-6 py-16 text-center space-y-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold">
          Plataforma Multi-Entrenador & Control de Atletas
        </div>
        <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-white max-w-3xl mx-auto leading-tight">
          Gestión inteligente para tu gimnasio y tus entrenamientos.
        </h1>
        <p className="text-sm sm:text-base text-slate-400 max-w-2xl mx-auto">
          Control de pagos, comisiones por entrenador, diseño biomecánico de rutinas y seguimiento antropométrico en un solo entorno centralizado.
        </p>

        {/* Portales de Acceso */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 pt-10 text-left">
          {/* Card Admin */}
          <div className="group rounded-2xl border border-slate-800 bg-slate-900/50 p-6 hover:border-emerald-500/40 transition flex flex-col justify-between">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20 flex items-center justify-center">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-white text-base">Super Admin</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Supervisión financiera global, comisiones del staff, métricas de facturación y alta de nuevos coaches.
              </p>
            </div>
            <Link
              href="/admin"
              className="mt-6 inline-flex items-center gap-1.5 text-xs text-purple-400 group-hover:text-purple-300 font-semibold"
            >
              Ir a Administración <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Card Entrenadores */}
          <div className="group rounded-2xl border border-slate-800 bg-slate-900/50 p-6 hover:border-emerald-500/40 transition flex flex-col justify-between">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center">
                <UserCheck className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-white text-base">Portal del Entrenador</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Gestión de atletas asignados, control de mensualidades vencidas, recibos e historial de medidas.
              </p>
            </div>
            <Link
              href="/coach"
              className="mt-6 inline-flex items-center gap-1.5 text-xs text-emerald-400 group-hover:text-emerald-300 font-semibold"
            >
              Ingresar como Coach <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Card Atletas */}
          <div className="group rounded-2xl border border-slate-800 bg-slate-900/50 p-6 hover:border-emerald-500/40 transition flex flex-col justify-between">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20 flex items-center justify-center">
                <Activity className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-white text-base">Portal del Atleta</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Revisión de rutina diaria asignada, series, repeticiones y comprobación de vigencia de mensualidad.
              </p>
            </div>
            <Link
              href="/portal"
              className="mt-6 inline-flex items-center gap-1.5 text-xs text-blue-400 group-hover:text-blue-300 font-semibold"
            >
              Acceso Atletas <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 py-6 text-center text-xs text-slate-500">
        GymManager — Sistema integral para entrenadores y gimnasios.
      </footer>
    </main>
  );
}