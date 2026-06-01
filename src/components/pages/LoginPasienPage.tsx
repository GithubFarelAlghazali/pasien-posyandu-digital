import { useState } from 'react';
import { Eye, EyeOff, HeartHandshake } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { findPasienByLogin } from '@/src/services/firebaseRest';

export default function LoginPasienPage() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({ username: '', password: '' });

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');

    if (!form.username || !form.password) {
      setError('Username/email dan password wajib diisi.');
      return;
    }

    try {
      setLoading(true);
      const pasien = await findPasienByLogin(form.username.trim(), form.password);

      if (!pasien) {
        setError('Akun pasien tidak ditemukan atau password salah.');
        return;
      }

      localStorage.setItem('pasien', JSON.stringify(pasien));
      navigate('/');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login gagal.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#fff4fa] flex items-center justify-center px-5 py-10">
      <section className="w-full max-w-[560px] bg-white rounded-[28px] shadow-xl px-10 py-12">
        <div className="flex justify-center mb-3 text-[#e6007e]">
          <HeartHandshake size={42} strokeWidth={2.5} />
        </div>

        <h1 className="text-3xl font-bold text-center text-gray-950 mb-7">Login Pasien</h1>

        <form className="space-y-5" onSubmit={handleSubmit}>
          <div>
            <label className="block text-lg font-medium text-gray-950 mb-2">Username / Email</label>
            <input value={form.username} onChange={(e) => setForm((prev) => ({ ...prev, username: e.target.value }))} type="text" placeholder="Masukkan username atau email" className="w-full rounded-2xl border border-pink-200 bg-[#fff7fb] px-5 py-4 text-lg outline-none transition focus:border-[#e6007e] focus:ring-4 focus:ring-pink-100" />
          </div>

          <div>
            <label className="block text-lg font-medium text-gray-950 mb-2">Password</label>
            <div className="relative">
              <input value={form.password} onChange={(e) => setForm((prev) => ({ ...prev, password: e.target.value }))} type={showPassword ? 'text' : 'password'} placeholder="Masukkan password" className="w-full rounded-2xl border border-pink-200 bg-[#fff7fb] px-5 py-4 pr-14 text-lg outline-none transition focus:border-[#e6007e] focus:ring-4 focus:ring-pink-100" />
              <button type="button" onClick={() => setShowPassword((prev) => !prev)} className="absolute right-5 top-1/2 -translate-y-1/2 text-pink-900">
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            <div className="mt-3 text-right">
              <Link to="/forgot-password" className="text-[#ff1493] hover:underline">Lupa Password?</Link>
            </div>
          </div>

          {error && <p className="rounded-2xl bg-red-50 px-4 py-3 text-sm font-semibold text-red-600">{error}</p>}

          <button type="submit" disabled={loading} className="mt-2 w-full rounded-2xl bg-[#e6007e] py-4 text-xl font-bold text-white shadow-lg shadow-pink-200 transition hover:bg-[#d00072] active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-70">
            {loading ? 'Masuk...' : 'Login'}
          </button>
        </form>

        <div className="mt-8 text-center space-y-5">
          <p className="text-lg text-slate-500">Mengalami kendala masuk?</p>
          <a href="https://wa.me/6281234567890" className="block text-xl font-bold text-[#d00072] hover:underline">Hubungi Admin Puskesmas</a>
          <p className="text-lg text-slate-500">
            Belum punya akun? <Link to="/register" className="font-bold text-[#ff1493] hover:underline">Register</Link>
          </p>
        </div>
      </section>
    </main>
  );
}
