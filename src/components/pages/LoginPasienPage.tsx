import { useState } from "react";
import { Eye, EyeOff, HeartHandshake } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { auth, db } from "@/src/services/firebase/config"; // Sesuaikan dengan path config Firebase SDK-mu
import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

export default function LoginPasienPage() {
	const navigate = useNavigate();
	const [showPassword, setShowPassword] = useState(false);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState("");

	// Mengubah label state menjadi 'email' agar klop dengan metode otentikasi Firebase Auth
	const [form, setForm] = useState({ email: "", password: "" });

	const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		setError("");

		if (!form.email || !form.password) {
			setError("Email dan password wajib diisi.");
			return;
		}

		try {
			setLoading(true);

			// 1. Otentikasi murni lewat Firebase Authentication SDK (Sangat Aman)
			const userCredential = await signInWithEmailAndPassword(auth, form.email.trim(), form.password);
			const user = userCredential.user;

			// 2. Lakukan validasi opsional ke Firestore untuk memastikan yang login adalah 'pasien', bukan 'kader'
			const userDocRef = doc(db, "users", user.uid);
			const userDoc = await getDoc(userDocRef);

			if (userDoc.exists()) {
				const userData = userDoc.data();

				if (userData.role !== "pasien") {
					setError("Akses ditolak. Halaman ini khusus untuk login Pasien.");
					return;
				}

				// 3. Alihkan navigasi (sesuaikan rute dashboard pasien milikmu, misalnya '/dashboard' atau '/')
				navigate("/pasien");
			} else {
				setError("Profil data pengguna tidak ditemukan di sistem.");
			}
		} catch (err: any) {
			console.error("Login Pasien Error:", err);
			// Pemetaan kode error agar ramah dibaca pengguna lokal
			if (err.code === "auth/user-not-found" || err.code === "auth/wrong-password" || err.code === "auth/invalid-credential") {
				setError("Email atau password yang Anda masukkan salah.");
			} else if (err.code === "auth/invalid-email") {
				setError("Format alamat email tidak valid.");
			} else {
				setError(err.message || "Login gagal, terjadi kesalahan sistem.");
			}
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
						<label className="block text-lg font-medium text-gray-950 mb-2">Email Pasien</label>
						<input
							value={form.email}
							onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))}
							type="email"
							required
							placeholder="Masukkan alamat email terdaftar"
							className="w-full rounded-2xl border border-pink-200 bg-[#fff7fb] px-5 py-4 text-lg outline-none transition focus:border-[#e6007e] focus:ring-4 focus:ring-pink-100"
						/>
					</div>

					<div>
						<label className="block text-lg font-medium text-gray-950 mb-2">Password</label>
						<div className="relative">
							<input
								value={form.password}
								onChange={(e) => setForm((prev) => ({ ...prev, password: e.target.value }))}
								type={showPassword ? "text" : "password"}
								required
								placeholder="Masukkan password"
								className="w-full rounded-2xl border border-pink-200 bg-[#fff7fb] px-5 py-4 pr-14 text-lg outline-none transition focus:border-[#e6007e] focus:ring-4 focus:ring-pink-100"
							/>
							<button type="button" onClick={() => setShowPassword((prev) => !prev)} className="absolute right-5 top-1/2 -translate-y-1/2 text-pink-900">
								{showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
							</button>
						</div>
						<div className="mt-3 text-right">
							<Link to="/forgot-password" className="text-[#ff1493] hover:underline">
								Lupa Password?
							</Link>
						</div>
					</div>

					{error && <p className="rounded-2xl bg-red-50 px-4 py-3 text-sm font-semibold text-red-600 animate-fadeIn">{error}</p>}

					<button
						type="submit"
						disabled={loading}
						className="mt-2 w-full rounded-2xl bg-[#e6007e] py-4 text-xl font-bold text-white shadow-lg shadow-pink-200 transition hover:bg-[#d00072] active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-70"
					>
						{loading ? "Masuk Sesi..." : "Login"}
					</button>
				</form>

				<div className="mt-8 text-center space-y-5">
					<p className="text-lg text-slate-500">Mengalami kendala masuk?</p>
					<a href="https://wa.me/6281234567890" className="block text-xl font-bold text-[#d00072] hover:underline">
						Hubungi Admin Puskesmas
					</a>
					<p className="text-lg text-slate-500">
						Belum punya akun?{" "}
						<Link to="/register" className="font-bold text-[#ff1493] hover:underline">
							Register
						</Link>
					</p>
				</div>
			</section>
		</main>
	);
}
