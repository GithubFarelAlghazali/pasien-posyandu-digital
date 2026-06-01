import {
	Bell,
	CalendarDays,
	ChevronRight,
	Edit3,
	HeartPulse,
	MapPin,
	Phone,
	Ruler,
	ShieldCheck,
	Stethoscope,
	UserRound,
	Weight,
} from "lucide-react";
import { motion } from "motion/react";
import BottomNav from "@/src/components/organisms/BottomNav";
import logoPosyandu from "@/src/assets/logo-posyandu.png";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function hitungUsia(tanggalLahir: string) {
	if (!tanggalLahir) return "-";

	const lahir = new Date(tanggalLahir);
	const sekarang = new Date();

	let usia = sekarang.getFullYear() - lahir.getFullYear();
	const bulan = sekarang.getMonth() - lahir.getMonth();

	if (bulan < 0 || (bulan === 0 && sekarang.getDate() < lahir.getDate())) {
		usia--;
	}

	return `${usia} Tahun`;
}

export default function ProfilePage() {
		const navigate = useNavigate();

	const handleLogout = () => {
		localStorage.removeItem("pasien");
		localStorage.removeItem("pasienUser");
		localStorage.removeItem("user");
		localStorage.removeItem("currentUser");

		navigate("/login");
	};
	const [patient, setPatient] = useState<any>(null);

	useEffect(() => {
		const savedUser = localStorage.getItem("pasien");

		if (savedUser) {
			setPatient(JSON.parse(savedUser));
		}
	}, []);

	return (
		<div className="bg-gray-50 min-h-screen pb-24">
			<div className="bg-white px-6 py-4 flex justify-between items-center shadow-sm">
				<div className="flex items-center gap-3">
					<div className="w-11 h-11 rounded-full bg-white border-2 border-pink-100 p-1.5 flex items-center justify-center shadow-sm">
						<img src={logoPosyandu} alt="Logo CAKET" className="w-full h-full object-contain" />
					</div>
					<div>
						<p className="text-secondary-pink font-black text-base leading-tight">Pasien - CAKET</p>
						<p className="text-[10px] text-gray-400 font-bold">Catatan Kesehatan</p>
					</div>
				</div>

				<button className="w-10 h-10 rounded-full bg-pink-50 flex items-center justify-center">
					<Bell className="text-secondary-pink w-5 h-5" />
				</button>
			</div>

			<div className="p-6 space-y-6">
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					className="pink-gradient rounded-[40px] p-7 text-white shadow-xl shadow-primary-pink/20 relative overflow-hidden"
				>
					<div className="absolute -right-10 -top-10 w-40 h-40 bg-white/10 rounded-full" />
					<div className="absolute -left-8 -bottom-12 w-36 h-36 bg-white/10 rounded-full" />

					<div className="relative flex justify-between items-start mb-8">
						<div className="flex items-center gap-5">
							<div className="w-24 h-24 bg-white rounded-[32px] p-3 flex items-center justify-center shadow-inner">
								<img src={logoPosyandu} alt="Logo CAKET" className="w-full h-full object-contain" />
							</div>
							<div>
								<div className="bg-white/20 border border-white/20 px-3 py-1 rounded-full inline-flex items-center gap-2 mb-3">
									<ShieldCheck className="w-3.5 h-3.5" />
									<span className="text-[10px] font-bold uppercase">
										{patient?.role || "Pasien Aktif"}
									</span>
								</div>

								<h1 className="text-3xl font-black italic leading-tight">
									{patient?.nama || "Pasien"}
								</h1>

								<p className="text-white/80 text-sm font-bold">
									NIK: {patient?.nik || "-"}
								</p>
							</div>
						</div>

						<button className="w-10 h-10 rounded-full bg-white/20 border border-white/20 flex items-center justify-center">
							<Edit3 className="w-4 h-4" />
						</button>
					</div>

					<div className="grid grid-cols-3 gap-3 relative">
						<div className="bg-white/15 border border-white/20 rounded-3xl p-4 text-center">
							<UserRound className="w-5 h-5 mx-auto mb-2" />
							<p className="text-[10px] font-bold opacity-80">Usia</p>
							<p className="font-black">
								{patient?.tanggalLahir ? hitungUsia(patient.tanggalLahir) : "-"}
							</p>
						</div>

						<div className="bg-white/15 border border-white/20 rounded-3xl p-4 text-center">
							<HeartPulse className="w-5 h-5 mx-auto mb-2" />
							<p className="text-[10px] font-bold opacity-80">Darah</p>
							<p className="font-black">-</p>
						</div>

						<div className="bg-white/15 border border-white/20 rounded-3xl p-4 text-center">
							<Stethoscope className="w-5 h-5 mx-auto mb-2" />
							<p className="text-[10px] font-bold opacity-80">Status</p>
							<p className="font-black">Normal</p>
						</div>
					</div>
				</motion.div>

				<div className="grid grid-cols-2 gap-4">
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: 0.1 }}
						className="bg-white rounded-[32px] p-6 border border-pink-50 shadow-sm"
					>
						<div className="w-12 h-12 rounded-2xl bg-pink-100 flex items-center justify-center mb-4">
							<Weight className="text-secondary-pink" />
						</div>
						<p className="text-xs text-gray-400 font-bold uppercase mb-1">Berat Badan</p>
						<p className="text-3xl font-black text-gray-800 italic">- kg</p>
					</motion.div>

					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: 0.2 }}
						className="bg-white rounded-[32px] p-6 border border-pink-50 shadow-sm"
					>
						<div className="w-12 h-12 rounded-2xl bg-pink-100 flex items-center justify-center mb-4">
							<Ruler className="text-secondary-pink" />
						</div>
						<p className="text-xs text-gray-400 font-bold uppercase mb-1">Tinggi Badan</p>
						<p className="text-3xl font-black text-gray-800 italic">- cm</p>
					</motion.div>
				</div>

				<div className="bg-white rounded-[36px] p-6 border border-pink-50 shadow-sm">
					<h2 className="text-xl font-black text-gray-800 mb-5">Informasi Pasien</h2>

					<div className="space-y-4">
						<div className="flex items-center gap-4">
							<div className="w-11 h-11 rounded-2xl bg-pink-50 flex items-center justify-center">
								<Phone className="w-5 h-5 text-secondary-pink" />
							</div>
							<div>
								<p className="text-[10px] text-gray-400 font-bold uppercase">Nomor Telepon</p>
								<p className="font-bold text-gray-800">{patient?.telepon || "-"}</p>
							</div>
						</div>

						<div className="flex items-center gap-4">
							<div className="w-11 h-11 rounded-2xl bg-pink-50 flex items-center justify-center">
								<MapPin className="w-5 h-5 text-secondary-pink" />
							</div>
							<div>
								<p className="text-[10px] text-gray-400 font-bold uppercase">Alamat</p>
								<p className="font-bold text-gray-800">{patient?.alamat || "-"}</p>
							</div>
						</div>
					</div>
				</div>

				<div className="bg-white rounded-[36px] p-6 border border-pink-50 shadow-sm">
					<div className="flex justify-between items-center mb-5">
						<h2 className="text-xl font-black text-gray-800">Jadwal Kesehatan</h2>
						<button className="text-secondary-pink font-bold text-sm flex items-center gap-1">
							Detail <ChevronRight className="w-4 h-4" />
						</button>
					</div>

					<div className="grid grid-cols-2 gap-4">
						<div className="bg-gray-50 rounded-3xl p-5">
							<CalendarDays className="text-secondary-pink w-6 h-6 mb-3" />
							<p className="text-[10px] text-gray-400 font-bold uppercase mb-1">Pemeriksaan Terakhir</p>
							<p className="font-black text-gray-800">-</p>
						</div>

						<div className="bg-pink-50 rounded-3xl p-5">
							<CalendarDays className="text-secondary-pink w-6 h-6 mb-3" />
							<p className="text-[10px] text-gray-400 font-bold uppercase mb-1">Jadwal Berikutnya</p>
							<p className="font-black text-gray-800">-</p>
						</div>
					</div>
				</div>
			</div>
					<div className="px-6 pb-6">
	<div className="bg-white rounded-[36px] p-6 border border-red-100 shadow-sm">
		<button
			onClick={handleLogout}
			className="w-full flex items-center justify-center gap-3 bg-red-500 hover:bg-red-600 text-white font-bold py-4 rounded-3xl transition-all"
		>
			🚪 Logout
		</button>
	</div>
</div>

			<BottomNav />
		</div>
	);
}