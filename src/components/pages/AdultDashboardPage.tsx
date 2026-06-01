import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Bell } from "lucide-react";
import BottomNav from "@/src/components/organisms/BottomNav";
import { motion } from "motion/react";
import logoPosyandu from "@/src/assets/logo-posyandu.png";

export default function AdultDashboardPage() {
	const navigate = useNavigate();
	const [user, setUser] = useState<any>(null);

	useEffect(() => {
		const savedUser = localStorage.getItem("pasien");

		if (savedUser) {
			setUser(JSON.parse(savedUser));
		}
	}, []);

	return (
		<div className="bg-gray-50 min-h-screen pb-24">
			<div className="bg-white px-6 py-4 flex justify-between items-center shadow-sm">
				<div className="flex items-center gap-3">
					<div className="w-10 h-10 rounded-full overflow-hidden border-2 border-primary-pink/20 bg-white flex items-center justify-center p-1">
						<img src={logoPosyandu} alt="Logo Posyandu" className="w-full h-full object-contain" />
					</div>
					<div>
						<p className="text-secondary-pink font-black text-base leading-tight">Pasien - CAKET</p>
						<p className="text-[10px] text-gray-400 font-bold">Catatan Kesehatan</p>
					</div>
				</div>

				<div className="relative">
					<Bell className="text-primary-pink" />
					<div className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full border border-white"></div>
				</div>
			</div>

			<div className="p-6">
				<motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
					<h1 className="text-4xl font-black text-gray-800 mb-1 leading-tight tracking-tight">
						Halo, {user?.username || user?.nama || "Pasien"}!
					</h1>
					<p className="text-gray-400 font-bold mb-8">
						Semoga sehat selalu hari ini 🌸
					</p>
				</motion.div>

				<motion.div
					initial={{ scale: 0.95, opacity: 0 }}
					animate={{ scale: 1, opacity: 1 }}
					className="pink-gradient rounded-[40px] p-8 text-white flex justify-between items-center mb-8 shadow-xl shadow-primary-pink/20"
				>
					<div className="flex gap-8">
						<div>
							<p className="text-[10px] font-bold opacity-80 uppercase mb-2">Berat Badan</p>
							<div className="flex items-baseline gap-1">
								<span className="text-4xl font-black italic">65</span>
								<span className="text-sm font-bold opacity-80">Kg</span>
							</div>
						</div>

						<div>
							<p className="text-[10px] font-bold opacity-80 uppercase mb-2">Tinggi Badan</p>
							<div className="flex items-baseline gap-1">
								<span className="text-4xl font-black italic">175</span>
								<span className="text-sm font-bold opacity-80">Cm</span>
							</div>
						</div>
					</div>

					<div className="w-16 h-16 rounded-full border-[3px] border-white/30 flex items-center justify-center bg-white/10 backdrop-blur-sm">
						<span className="text-2xl">😊</span>
					</div>
				</motion.div>

				<div className="grid grid-cols-2 gap-4 mb-8">
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: 0.1 }}
						className="bg-white rounded-[32px] p-6 border border-gray-100 shadow-sm"
					>
						<p className="text-[10px] text-gray-400 font-bold uppercase mb-2">Tekanan Darah</p>
						<p className="text-4xl font-black text-gray-800 leading-tight italic">120/80</p>
						<p className="text-2xl font-black text-gray-800 italic opacity-40">mmHg</p>
					</motion.div>

					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: 0.2 }}
						className="bg-white rounded-[32px] p-6 border border-gray-100 shadow-sm"
					>
						<p className="text-[10px] text-gray-400 font-bold uppercase mb-2">Gula darah</p>
						<p className="text-4xl font-black text-gray-800 leading-tight italic">100</p>
						<p className="text-2xl font-black text-gray-800 italic opacity-40">mg/dl</p>
					</motion.div>
				</div>

				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 0.3 }}
					className="bg-white rounded-[32px] p-6 border border-pink-50 shadow-sm mb-8"
				>
					<div className="flex items-start gap-4">
						<div className="w-14 h-14 rounded-2xl bg-pink-100 flex items-center justify-center text-2xl">
							💗
						</div>

						<div>
							<p className="text-xs text-gray-400 font-bold uppercase mb-1">Status Kesehatan</p>
							<h3 className="text-xl font-black text-gray-800 mb-1">
								Kondisi kamu terlihat stabil
							</h3>
							<p className="text-sm text-gray-500 font-medium leading-relaxed">
								Tetap jaga pola makan, minum air putih yang cukup, dan rutin cek kesehatan di Posyandu.
							</p>
						</div>
					</div>
				</motion.div>

				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 0.4 }}
					className="bg-pink-50 rounded-[32px] p-6 mb-8"
				>
					<p className="text-xs text-secondary-pink font-black uppercase mb-2">Tips Hari Ini</p>
					<h3 className="text-xl font-black text-gray-800 mb-2">
						Jangan lupa sarapan sehat 🍽️
					</h3>
					<p className="text-sm text-gray-500 font-medium leading-relaxed">
						Pilih makanan bergizi seperti nasi, lauk berprotein, sayur, buah, dan air putih agar tubuh tetap bertenaga.
					</p>
				</motion.div>

				<div className="space-y-6">
					<h3 className="text-xl font-bold text-gray-800 px-2 tracking-tight">Akses Cepat</h3>

					<div className="grid grid-cols-2 gap-4">
						<motion.button
							onClick={() => navigate("/schedule")}
							whileTap={{ scale: 0.95 }}
							className="bg-pink-100/50 rounded-[32px] p-8 flex flex-col items-center justify-center gap-4 transition-all hover:bg-pink-100"
						>
							<div className="p-4 bg-white rounded-2xl shadow-sm italic font-black text-2xl">🗓️</div>
							<span className="font-bold text-gray-800 text-lg">Jadwal</span>
						</motion.button>

						<motion.button
							onClick={() => navigate("/education")}
							whileTap={{ scale: 0.95 }}
							className="bg-pink-100/50 rounded-[32px] p-8 flex flex-col items-center justify-center gap-4 transition-all hover:bg-pink-100"
						>
							<div className="p-4 bg-white rounded-2xl shadow-sm italic font-black text-2xl">💉</div>
							<span className="font-bold text-gray-800 text-lg">Imunisasi</span>
						</motion.button>

						<motion.button
							onClick={() => navigate("/history")}
							whileTap={{ scale: 0.95 }}
							className="bg-pink-100/50 rounded-[32px] p-8 flex flex-col items-center justify-center gap-4 transition-all hover:bg-pink-100"
						>
							<div className="p-4 bg-white rounded-2xl shadow-sm italic font-black text-2xl">📋</div>
							<span className="font-bold text-gray-800 text-lg">Riwayat</span>
						</motion.button>

						<motion.button
							onClick={() => navigate("/profile")}
							whileTap={{ scale: 0.95 }}
							className="bg-pink-100/50 rounded-[32px] p-8 flex flex-col items-center justify-center gap-4 transition-all hover:bg-pink-100"
						>
							<div className="p-4 bg-white rounded-2xl shadow-sm italic font-black text-2xl">👤</div>
							<span className="font-bold text-gray-800 text-lg">Profil</span>
						</motion.button>
					</div>
				</div>
			</div>

			<BottomNav />
		</div>
	);
}