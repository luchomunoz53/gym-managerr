'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Dumbbell, ShieldCheck, UserCheck, Activity, CreditCard, LogOut } from 'lucide-react';

export function Navbar() {
  const pathname = usePathname();

  if (pathname === '/login') return null;

  const isAdmin = pathname.startsWith('/admin');
  const isCoach = pathname.startsWith('/coach');
  const isAthlete = pathname.startsWith('/portal');

  return (
    <header className="border-b border-slate-800 bg-slate-950/90 backdrop-blur-md sticky top-0 z-40 text-slate-200">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Logotipo */}
        <Link href="/" className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
            <Dumbbell className="w-5 h-5" />
          </div>
          <span className="font-extrabold text-base tracking-wider text-white">
            GYM<span className="text-emerald-400">MANAGER</span>
          </span>
        </Link>

        {/* Enlaces según perfil activo */}
        <nav className="flex items-center gap-1 sm:gap-2 text-xs font-medium">
          {/* Navegación Super Admin: Solo gestión de usuarios */}
          {isAdmin && (
            <Link
              href="/admin"
              className="px-3 py-1.5 rounded-lg bg-slate-800 text-white font-semibold flex items-center gap-1.5"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              Gestión de Entrenadores
            </Link>
          )}

          {/* Navegación Entrenador: Gestión de clientes, banco y sus cobros */}
          {isCoach && (
            <>
              <Link
                href="/coach"
                className={`px-3 py-1.5 rounded-lg transition ${
                  pathname === '/coach'
                    ? 'bg-slate-800 text-white font-semibold'
                    : 'text-slate-400 hover:text-white hover:bg-slate-900'
                }`}
              >
                Mis Atletas
              </Link>
              <Link
                href="/coach/exercises"
                className={`px-3 py-1.5 rounded-lg transition flex items-center gap-1.5 ${
                  pathname === '/coach/exercises'
                    ? 'bg-slate-800 text-white font-semibold'
                    : 'text-slate-400 hover:text-white hover:bg-slate-900'
                }`}
              >
                <Dumbbell className="w-3.5 h-3.5 text-emerald-400" />
                Banco Ejercicios
              </Link>
              <Link
                href="/coach/payments"
                className={`px-3 py-1.5 rounded-lg transition flex items-center gap-1.5 ${
                  pathname === '/coach/payments'
                    ? 'bg-slate-800 text-white font-semibold'
                    : 'text-slate-400 hover:text-white hover:bg-slate-900'
                }`}
              >
                <CreditCard className="w-3.5 h-3.5 text-emerald-400" />
                Historial de Cobros
              </Link>
            </>
          )}

          {/* Navegación Atleta */}
          {isAthlete && (
            <span className="px-3 py-1.5 rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/20 flex items-center gap-1">
              <Activity className="w-3.5 h-3.5" /> Mi Rutina y Membresía
            </span>
          )}

          {/* Selector de bienvenida si está en la landing */}
          {!isAdmin && !isCoach && !isAthlete && (
            <div className="flex gap-2">
              <Link href="/admin" className="text-slate-400 hover:text-white px-2 py-1">Admin</Link>
              <Link href="/coach" className="text-slate-400 hover:text-white px-2 py-1">Coach</Link>
              <Link href="/portal" className="text-slate-400 hover:text-white px-2 py-1">Atleta</Link>
            </div>
          )}

          {/* Botón Salir */}
          <Link
            href="/login"
            className="ml-2 sm:ml-4 p-1.5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-slate-900 transition"
            title="Cambiar de sesión o salir"
          >
            <LogOut className="w-4 h-4" />
          </Link>
        </nav>
      </div>
    </header>
  );
}