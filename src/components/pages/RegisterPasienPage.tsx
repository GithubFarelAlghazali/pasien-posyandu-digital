import { useState } from 'react';
import { Eye, EyeOff, UserPlus } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { registerPasien } from '@/src/services/firebaseRest';

export default function RegisterPasienPage() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    username: '',
    email: '',
    nik: '',
    alamat: '',
    tanggalLahir: '',
    telp: '',
    password: '',
    confirmPassword: '',
  });

  const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');

    if (!form.username || !form.email || !form.nik || !form.alamat || !form.tanggalLahir || !form.telp || !form.password) {
      setError('Semua field wajib diisi.');
      return;
    }

    if (form.password.length < 8) {
      setError('Password minimal 8 karakter.');
      return;
    }

    if (form.password !== form.confirmPassword) {
      setError('Konfirmasi password tidak sama.');
      return;
    }

    try {
      setLoading(true);
      await registerPasien({
        username: form.username.trim(),
        email: form.email.trim(),
        nik: form.nik.trim(),
        alamat: form.alamat.trim(),
        tanggalLahir: form.tanggalLahir,
        telp: form.telp.trim(),
        password: form.password,
        role: 'pasien',
      });

      alert('Registrasi pasien berhasil. Silakan login.');
      navigate('/login');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registrasi gagal.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#fff4fa] flex items-center justify-center px-5 py-10">
      <section className="w-full max-w-[480px] bg-white rounded-[24px] shadow-xl px-8 py-9">
        <div className="flex justify-center mb-2 text-[#e6007e]">
          <UserPlus size={38} strokeWidth={2.5} />
        </div>

        <h1 className="text-3xl font-bold text-center text-gray-950 mb-5">Daftar Akun Pasien</h1>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block text-base font-medium text-gray-950 mb-1.5">Username</label>
            <input name="username" value={form.username} onChange={handleChange} type="text" placeholder="Masukkan Nama Lengkap" className="w-full rounded-2xl border border-pink-200 bg-[#fff7fb] px-4 py-3.5 text-base outline-none transition focus:border-[#e6007e] focus:ring-4 focus:ring-pink-100" />
          </div>

          <div>
            <label className="block text-base font-medium text-gray-950 mb-1.5">Email</label>
            <input name="email" value={form.email} onChange={handleChange} type="email" placeholder="Masukkan Email Aktif" className="w-full rounded-2xl border border-pink-200 bg-[#fff7fb] px-4 py-3.5 text-base outline-none transition focus:border-[#e6007e] focus:ring-4 focus:ring-pink-100" />
          </div>

          <div>
            <label className="block text-base font-medium text-gray-950 mb-1.5">NIK</label>
            <input name="nik" value={form.nik} onChange={handleChange} type="text" placeholder="Masukkan NIK" className="w-full rounded-2xl border border-pink-200 bg-[#fff7fb] px-4 py-3.5 text-base outline-none transition focus:border-[#e6007e] focus:ring-4 focus:ring-pink-100" />
          </div>

          <div>
            <label className="block text-base font-medium text-gray-950 mb-1.5">Alamat</label>
            <textarea name="alamat" value={form.alamat} onChange={handleChange} placeholder="Masukkan alamat" rows={2} className="w-full resize-none rounded-2xl border border-pink-200 bg-[#fff7fb] px-4 py-3.5 text-base outline-none transition focus:border-[#e6007e] focus:ring-4 focus:ring-pink-100" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-base font-medium text-gray-950 mb-1.5">Tanggal Lahir</label>
              <input name="tanggalLahir" value={form.tanggalLahir} onChange={handleChange} type="date" className="w-full rounded-2xl border border-pink-200 bg-[#fff7fb] px-4 py-3.5 text-base outline-none transition focus:border-[#e6007e] focus:ring-4 focus:ring-pink-100" />
            </div>
            <div>
              <label className="block text-base font-medium text-gray-950 mb-1.5">No. Telepon</label>
              <input name="telp" value={form.telp} onChange={handleChange} type="tel" placeholder="08xxxxxxxxxx" className="w-full rounded-2xl border border-pink-200 bg-[#fff7fb] px-4 py-3.5 text-base outline-none transition focus:border-[#e6007e] focus:ring-4 focus:ring-pink-100" />
            </div>
          </div>

          <div>
            <label className="block text-base font-medium text-gray-950 mb-1.5">Password</label>
            <div className="relative">
              <input name="password" value={form.password} onChange={handleChange} type={showPassword ? 'text' : 'password'} placeholder="Min. 8 karakter" className="w-full rounded-2xl border border-pink-200 bg-[#fff7fb] px-4 py-3.5 pr-12 text-base outline-none transition focus:border-[#e6007e] focus:ring-4 focus:ring-pink-100" />
              <button type="button" onClick={() => setShowPassword((prev) => !prev)} className="absolute right-4 top-1/2 -translate-y-1/2 text-pink-900">
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <div className="relative">
            <input name="confirmPassword" value={form.confirmPassword} onChange={handleChange} type={showConfirmPassword ? 'text' : 'password'} placeholder="Ulangi kata sandi" className="w-full rounded-2xl border border-pink-200 bg-[#fff7fb] px-4 py-3.5 pr-12 text-base outline-none transition focus:border-[#e6007e] focus:ring-4 focus:ring-pink-100" />
            <button type="button" onClick={() => setShowConfirmPassword((prev) => !prev)} className="absolute right-4 top-1/2 -translate-y-1/2 text-pink-900">
              {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          {error && <p className="rounded-2xl bg-red-50 px-4 py-3 text-sm font-semibold text-red-600">{error}</p>}

          <button type="submit" disabled={loading} className="w-full rounded-2xl bg-[#e6007e] py-4 text-lg font-bold text-white shadow-lg shadow-pink-200 transition hover:bg-[#d00072] active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-70">
            {loading ? 'Mendaftarkan...' : 'Register'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-500">
          Sudah punya akun? <Link to="/login" className="font-bold text-[#ff1493] hover:underline">Login</Link>
        </p>
      </section>
    </main>
  );
}
