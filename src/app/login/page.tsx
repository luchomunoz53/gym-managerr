'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Dumbbell, ShieldCheck, UserCheck, Activity } from 'lucide-react';
import Link from 'next/link';

export default function LoginPage() {
  const router = useRouter();
  const [roleType, setRoleType] = useState<'staff' | 'athlete'>('staff');
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (roleType === 'athlete') {
        // Validación directa del atleta
        const res = await fetch(`/api/routines?clientId=check&search=${encodeURIComponent(identifier)}`);
        // Redirección directa al portal del atleta pasando su búsqueda
        router.push(`/portal?search=${encodeURIComponent(identifier)}`);
        return;
      }

      // Validación para staff (Admin o Entrenador)
      if (identifier === 'admin@gym.com') {
        router.push('/admin');
      } else {
        router.push('/coach');
      }
    } catch (err) {
      setError('Credenciales no válidas.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-2xl space-y-6">
        <div className="text-center space-y-2">
          <div className="inline-flex p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
            <Dumbbell className="w-7 h-7" />
          </div>
          <h2 className="text-2xl font-bold text-white tracking-tight">Acceso a la Plataforma</h2>
          <p className="text-xs text-slate-400">Selecciona tu perfil para ingresar</p>
        </div>

        {/* Selector Staff vs Atleta */}
        <div className="grid grid-cols-2 p-1 bg-slate-950 rounded-xl border border-slate-800 text-xs font-semibold">
          <button
            type="button"
            onClick={() => { setRoleType('staff'); setError(''); }}
            className={`py-2 rounded-lg transition ${
              roleType === 'staff' ? 'bg-slate-800 text-white shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            Staff / Entrenador
          </button>
          <button
            type="button"
            onClick={() => { setRoleType('athlete'); setError(''); }}
            className={`py-2 rounded-lg transition ${
              roleType === 'athlete' ? 'bg-slate-800 text-white shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            Soy Atleta
          </button>
        </div>

        {error && (
          <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-xs text-red-400 text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4 text-xs">
          <div>
            <label className="block text-slate-400 font-semibold uppercase mb-1">
              {roleType === 'staff' ? 'Correo Electrónico' : 'Correo o Teléfono Registrado'}
            </label>
            <input
              required
              type={roleType === 'staff' ? 'email' : 'text'}
              placeholder={roleType === 'staff' ? 'admin@gym.com o carlos@gym.com' : '3001234567 o juan@correo.com'}
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2.5 text-white focus:outline-none focus:border-emerald-500"
            />
          </div>

          {roleType === 'staff' && (
            <div>
              <label className="block text-slate-400 font-semibold uppercase mb-1">Contraseña</label>
              <input
                required
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2.5 text-white focus:outline-none focus:border-emerald-500"
              />
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-semibold py-2.5 rounded-lg transition disabled:opacity-50 mt-2"
          >
            {loading ? 'Accediendo...' : 'Entrar a mi Panel'}
          </button>
        </form>

        <div className="border-t border-slate-800 pt-4 text-center text-xs text-slate-500">
          <Link href="/" className="hover:text-slate-400">
            ← Volver a la página principal
          </Link>
        </div>
      </div>
    </main>
  );
}