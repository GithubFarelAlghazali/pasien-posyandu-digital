import { useState } from "react";
import { Eye, EyeOff, UserPlus } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { auth, db } from "../../services/firebase/config"; // Pastikan path config Firebase kamu sudah benar
import { createUserWithEmailAndPassword, signOut } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";

export default function RegisterPasienPage() {
	const navigate = useNavigate();
	const [showPassword, setShowPassword] = useState(false);
	const [showConfirmPassword, setShowConfirmPassword] = useState(false);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState("");

	// State form disesuaikan dengan struktur objek dokumen Firestore
	const [form, setForm] = useState({
		nama: "",
		email: "",
		nik: "",
		alamat: "",
		tanggalLahir: "",
		telepon: "",
		tipe: "anak", // Nilai default awal: [anak, hamil, dewasa, lansia]
		gender: "",
		confirmPassword: "",
	});

	const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
		const { name, value } = event.target;
		setForm((prev) => ({ ...prev, [name]: value }));
	};

<<<<<<< HEAD
	const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		setError("");
=======
    if (
      !form.username ||
      !form.email ||
      !form.nik ||
      !form.alamat ||
      !form.tanggalLahir ||
      !form.telp ||
      !form.tipe ||
      !form.password
    ) {
      setError('Semua field wajib diisi.');
      return;
    }
>>>>>>> c28250b23430fda7b1b3bb0b2ce806edc341a0b6

		// 1. Validasi Kelengkapan Field Kontrol
		if (!form.nama.trim() || !form.email.trim() || !form.nik.trim() || !form.alamat.trim() || !form.tanggalLahir || !form.telepon.trim() || !form.password) {
			setError("Semua field wajib diisi.");
			return;
		}

<<<<<<< HEAD
		// 2. Validasi Panjang NIK Lokal
		if (form.nik.trim().length !== 16 || !/^\d+$/.test(form.nik.trim())) {
			setError("NIK harus berupa 16 digit angka murni.");
			return;
		}

		// 3. Validasi Keamanan Sandi
		if (form.password.length < 8) {
			setError("Kata sandi minimal harus 8 karakter.");
			return;
		}

		if (form.password !== form.confirmPassword) {
			setError("Konfirmasi kata sandi tidak cocok.");
			return;
		}
=======
    if (form.password !== form.confirmPassword) {
      setError('Konfirmasi password tidak sama.');
      return;
    }

    const phoneRegex = /^\+62[0-9]{9,13}$/;

    if (!phoneRegex.test(form.telp.trim())) {
      setError('Nomor telepon harus diawali +62. Contoh: +6281234567890');
      return;
    }

    try {
      setLoading(true);

      await registerPasien({
        uid: crypto.randomUUID(),
        nama: form.username.trim(),
        email: form.email.trim(),
        nik: form.nik.trim(),
        alamat: form.alamat.trim(),
        tanggalLahir: form.tanggalLahir,
        telepon: form.telp.trim(),
        tipe: form.tipe as 'anak' | 'dewasa' | 'hamil' | 'lansia',
        password: form.password,
        role: 'pasien',
        dibuat_pada: new Date().toISOString(),
      });
>>>>>>> c28250b23430fda7b1b3bb0b2ce806edc341a0b6

		// 4. Validasi Pola Regex Telepon Standar +62
		const phoneRegex = /^\+628[1-9][0-9]{7,10}$/;
		if (!phoneRegex.test(form.telepon.trim())) {
			setError("Nomor telepon harus diawali +62 dan berformat valid (Contoh: +6281234567890).");
			return;
		}

		try {
			setLoading(true);

<<<<<<< HEAD
			// 5. Daftarkan Kredensial ke Firebase Authentication
			const userCredential = await createUserWithEmailAndPassword(auth, form.email.trim(), form.password);
			const user = userCredential.user;

			// 6. Petakan Payload Data ke Cloud Firestore (users collection) sesuai gambar skema kamu
			await setDoc(doc(db, "users", user.uid), {
				uid: user.uid,
				nama: form.nama.trim(),
				email: form.email.trim(),
				nik: form.nik.trim(),
				alamat: form.alamat.trim(),
				tanggalLahir: form.tanggalLahir,
				gender: form.gender,
				telepon: form.telepon.trim(),
				role: "pasien",
				tipe: form.tipe,
				dibuat_pada: new Date().toISOString(),
			});

			// 7. FORCE SIGN OUT INSTAN
			// Mencegah Firebase Auth langsung menganggap user masuk sesi browser secara otomatis
			await signOut(auth);

			alert("Registrasi akun pasien berhasil! Silakan masuk menggunakan akun Anda.");
			navigate("/login");
		} catch (err: any) {
			console.error("Register Pasien Error:", err);
			if (err.code === "auth/email-already-in-use") {
				setError("Email tersebut sudah terdaftar di sistem.");
			} else if (err.code === "auth/invalid-email") {
				setError("Format alamat email tidak valid.");
			} else {
				setError(err.message || "Terjadi kesalahan sistem saat mendaftar.");
			}
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
						<label className="block text-sm font-black text-gray-700 mb-1.5 uppercase tracking-wide">Nama Lengkap</label>
						<input
							name="nama"
							value={form.nama}
							onChange={handleChange}
							type="text"
							placeholder="Masukkan Nama Lengkap"
							className="w-full rounded-2xl border border-pink-200 bg-[#fff7fb] px-4 py-3.5 text-base outline-none transition focus:border-[#e6007e] focus:ring-4 focus:ring-pink-100 font-medium text-gray-800"
						/>
					</div>

					<div>
						<label className="block text-sm font-black text-gray-700 mb-1.5 uppercase tracking-wide">Email</label>
						<input
							name="email"
							value={form.email}
							onChange={handleChange}
							type="email"
							placeholder="Masukkan Email Aktif"
							className="w-full rounded-2xl border border-pink-200 bg-[#fff7fb] px-4 py-3.5 text-base outline-none transition focus:border-[#e6007e] focus:ring-4 focus:ring-pink-100 font-medium text-gray-800"
						/>
					</div>

					<div>
						<label className="block text-sm font-black text-gray-700 mb-1.5 uppercase tracking-wide">Gender</label>
						<select
							name="gender"
							value={form.gender}
							onChange={handleChange}
							className="w-full rounded-2xl border border-pink-200 bg-[#fff7fb] px-4 py-[15px] text-base outline-none transition focus:border-[#e6007e] focus:ring-4 focus:ring-pink-100 font-bold text-gray-700 cursor-pointer"
						>
							<option value="laki-laki">Laki-Laki</option>
							<option value="perempuan">Perempuan</option>
						</select>
					</div>

					<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
						<div>
							<label className="block text-sm font-black text-gray-700 mb-1.5 uppercase tracking-wide">NIK</label>
							<input
								name="nik"
								value={form.nik}
								onChange={handleChange}
								type="text"
								maxLength={16}
								placeholder="16 Digit NIK"
								className="w-full rounded-2xl border border-pink-200 bg-[#fff7fb] px-4 py-3.5 text-base outline-none transition focus:border-[#e6007e] focus:ring-4 focus:ring-pink-100 font-medium text-gray-800"
							/>
						</div>

						{/* INPUT SELECTION UNTUK MENENTUKAN TIPE KATEGORI PASIEN */}
						<div>
							<label className="block text-sm font-black text-gray-700 mb-1.5 uppercase tracking-wide">Kategori Peserta</label>
							<select
								name="tipe"
								value={form.tipe}
								onChange={handleChange}
								className="w-full rounded-2xl border border-pink-200 bg-[#fff7fb] px-4 py-[15px] text-base outline-none transition focus:border-[#e6007e] focus:ring-4 focus:ring-pink-100 font-bold text-gray-700 cursor-pointer"
							>
								<option value="anak">Anak / Balita</option>
								<option value="hamil">Ibu Hamil</option>
								<option value="dewasa">Umum / Dewasa</option>
								<option value="lansia">Lansia</option>
							</select>
						</div>
					</div>

					<div>
						<label className="block text-sm font-black text-gray-700 mb-1.5 uppercase tracking-wide">Alamat Domisili</label>
						<textarea
							name="alamat"
							value={form.alamat}
							onChange={handleChange}
							placeholder="Masukkan alamat lengkap domisili saat ini"
							rows={2}
							className="w-full resize-none rounded-2xl border border-pink-200 bg-[#fff7fb] px-4 py-3.5 text-base outline-none transition focus:border-[#e6007e] focus:ring-4 focus:ring-pink-100 font-medium text-gray-800"
						/>
					</div>

					<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
						<div>
							<label className="block text-sm font-black text-gray-700 mb-1.5 uppercase tracking-wide">Tanggal Lahir</label>
							<input
								name="tanggalLahir"
								value={form.tanggalLahir}
								onChange={handleChange}
								type="date"
								className="w-full rounded-2xl border border-pink-200 bg-[#fff7fb] px-4 py-3.5 text-base outline-none transition focus:border-[#e6007e] focus:ring-4 focus:ring-pink-100 font-bold text-gray-700"
							/>
						</div>
						<div>
							<label className="block text-sm font-black text-gray-700 mb-1.5 uppercase tracking-wide">No. Telepon</label>
							<input
								name="telepon"
								value={form.telepon}
								onChange={handleChange}
								type="tel"
								placeholder="+628123456789"
								className="w-full rounded-2xl border border-pink-200 bg-[#fff7fb] px-4 py-3.5 text-base outline-none transition focus:border-[#e6007e] focus:ring-4 focus:ring-pink-100 font-medium text-gray-800"
							/>
						</div>
					</div>

					<div>
						<label className="block text-sm font-black text-gray-700 mb-1.5 uppercase tracking-wide">Password</label>
						<div className="relative">
							<input
								name="password"
								value={form.password}
								onChange={handleChange}
								type={showPassword ? "text" : "password"}
								placeholder="Min. 8 karakter"
								className="w-full rounded-2xl border border-pink-200 bg-[#fff7fb] px-4 py-3.5 pr-12 text-base outline-none transition focus:border-[#e6007e] focus:ring-4 focus:ring-pink-100 font-medium text-gray-800"
							/>
							<button type="button" onClick={() => setShowPassword((prev) => !prev)} className="absolute right-4 top-1/2 -translate-y-1/2 text-pink-500">
								{showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
							</button>
						</div>
					</div>

					<div className="relative">
						<input
							name="confirmPassword"
							value={form.confirmPassword}
							onChange={handleChange}
							type={showConfirmPassword ? "text" : "password"}
							placeholder="Ulangi kata sandi"
							className="w-full rounded-2xl border border-pink-200 bg-[#fff7fb] px-4 py-3.5 pr-12 text-base outline-none transition focus:border-[#e6007e] focus:ring-4 focus:ring-pink-100 font-medium text-gray-800"
						/>
						<button type="button" onClick={() => setShowConfirmPassword((prev) => !prev)} className="absolute right-4 top-1/2 -translate-y-1/2 text-pink-500">
							{showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
						</button>
					</div>

					{error && <p className="rounded-2xl bg-red-50 px-4 py-3 text-sm font-semibold text-red-600 border border-red-100 animate-fadeIn">{error}</p>}

					<button
						type="submit"
						disabled={loading}
						className="w-full rounded-2xl bg-[#e6007e] py-4 text-lg font-bold text-white shadow-lg shadow-pink-200 transition hover:bg-[#d00072] active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-70"
					>
						{loading ? "Mendaftarkan Akun..." : "Register"}
					</button>
				</form>

				<p className="mt-6 text-center text-sm text-slate-500">
					Sudah punya akun?{" "}
					<Link to="/login" className="font-bold text-[#ff1493] hover:underline">
						Login
					</Link>
				</p>
			</section>
		</main>
	);
}
=======
        <h1 className="text-3xl font-bold text-center text-gray-950 mb-5">
          Daftar Akun Pasien
        </h1>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block text-base font-medium text-gray-950 mb-1.5">
              Nama Lengkap
            </label>
            <input
              name="username"
              value={form.username}
              onChange={handleChange}
              type="text"
              placeholder="Masukkan Nama Lengkap"
              className="w-full rounded-2xl border border-pink-200 bg-[#fff7fb] px-4 py-3.5 text-base outline-none transition focus:border-[#e6007e] focus:ring-4 focus:ring-pink-100"
            />
          </div>

          <div>
            <label className="block text-base font-medium text-gray-950 mb-1.5">
              Email
            </label>
            <input
              name="email"
              value={form.email}
              onChange={handleChange}
              type="email"
              placeholder="Masukkan Email Aktif"
              className="w-full rounded-2xl border border-pink-200 bg-[#fff7fb] px-4 py-3.5 text-base outline-none transition focus:border-[#e6007e] focus:ring-4 focus:ring-pink-100"
            />
          </div>

          <div>
            <label className="block text-base font-medium text-gray-950 mb-1.5">
              NIK
            </label>
            <input
              name="nik"
              value={form.nik}
              onChange={handleChange}
              type="text"
              placeholder="Masukkan NIK"
              className="w-full rounded-2xl border border-pink-200 bg-[#fff7fb] px-4 py-3.5 text-base outline-none transition focus:border-[#e6007e] focus:ring-4 focus:ring-pink-100"
            />
          </div>

          <div>
            <label className="block text-base font-medium text-gray-950 mb-1.5">
              Alamat
            </label>
            <textarea
              name="alamat"
              value={form.alamat}
              onChange={handleChange}
              placeholder="Masukkan alamat"
              rows={2}
              className="w-full resize-none rounded-2xl border border-pink-200 bg-[#fff7fb] px-4 py-3.5 text-base outline-none transition focus:border-[#e6007e] focus:ring-4 focus:ring-pink-100"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-base font-medium text-gray-950 mb-1.5">
                Tanggal Lahir
              </label>
              <input
                name="tanggalLahir"
                value={form.tanggalLahir}
                onChange={handleChange}
                type="date"
                className="w-full rounded-2xl border border-pink-200 bg-[#fff7fb] px-4 py-3.5 text-base outline-none transition focus:border-[#e6007e] focus:ring-4 focus:ring-pink-100"
              />
            </div>

            <div>
              <label className="block text-base font-medium text-gray-950 mb-1.5">
                No. Telepon
              </label>
              <input
                name="telp"
                value={form.telp}
                onChange={handleChange}
                type="tel"
                pattern="^\+62[0-9]{9,13}$"
                placeholder="+6281234567890"
                className="w-full rounded-2xl border border-pink-200 bg-[#fff7fb] px-4 py-3.5 text-base outline-none transition focus:border-[#e6007e] focus:ring-4 focus:ring-pink-100"
              />
            </div>
          </div>

          <div>
            <label className="block text-base font-medium text-gray-950 mb-1.5">
              Tipe Pasien
            </label>
            <select
              name="tipe"
              value={form.tipe}
              onChange={handleChange}
              className="w-full rounded-2xl border border-pink-200 bg-[#fff7fb] px-4 py-3.5 text-base outline-none transition focus:border-[#e6007e] focus:ring-4 focus:ring-pink-100"
            >
              <option value="">Pilih Tipe Pasien</option>
              <option value="anak">Anak</option>
              <option value="dewasa">Dewasa</option>
              <option value="hamil">Ibu Hamil</option>
              <option value="lansia">Lansia</option>
            </select>
          </div>

          <div>
            <label className="block text-base font-medium text-gray-950 mb-1.5">
              Password
            </label>
            <div className="relative">
              <input
                name="password"
                value={form.password}
                onChange={handleChange}
                type={showPassword ? 'text' : 'password'}
                placeholder="Min. 8 karakter"
                className="w-full rounded-2xl border border-pink-200 bg-[#fff7fb] px-4 py-3.5 pr-12 text-base outline-none transition focus:border-[#e6007e] focus:ring-4 focus:ring-pink-100"
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-pink-900"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <div className="relative">
            <input
              name="confirmPassword"
              value={form.confirmPassword}
              onChange={handleChange}
              type={showConfirmPassword ? 'text' : 'password'}
              placeholder="Ulangi kata sandi"
              className="w-full rounded-2xl border border-pink-200 bg-[#fff7fb] px-4 py-3.5 pr-12 text-base outline-none transition focus:border-[#e6007e] focus:ring-4 focus:ring-pink-100"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword((prev) => !prev)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-pink-900"
            >
              {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          {error && (
            <p className="rounded-2xl bg-red-50 px-4 py-3 text-sm font-semibold text-red-600">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-2xl bg-[#e6007e] py-4 text-lg font-bold text-white shadow-lg shadow-pink-200 transition hover:bg-[#d00072] active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-70"
          >
            {loading ? 'Mendaftarkan...' : 'Register'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-500">
          Sudah punya akun?{' '}
          <Link to="/login" className="font-bold text-[#ff1493] hover:underline">
            Login
          </Link>
        </p>
      </section>
    </main>
  );
}
>>>>>>> c28250b23430fda7b1b3bb0b2ce806edc341a0b6
