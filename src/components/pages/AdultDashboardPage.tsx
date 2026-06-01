import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Bell, Activity, Calendar, Award } from "lucide-react";
import { motion } from "motion/react";
import { useAuth } from "../context/AuthContext"; // Pastikan path AuthContext kamu benar
import { db } from "../firebase/config";
import { collection, query, where, onSnapshot, orderBy, limit } from "firebase/firestore";
import logoPosyandu from "@/src/assets/logo-posyandu.png";
import BottomNav from "@/src/components/organisms/BottomNav";

interface MedicalRecord {
	beratBadan: number | null;
	tinggiBadan: number | null;
	gulaDarah: number | null;
	tekananDarah?: {
		sistolik: number | null;
		distolik: number | null;
	};
	status_pertumbuhan: string;
	catatanKeluhan?: string;
}

export default function AdultDashboardPage() {
	const navigate = useNavigate();
	const { user, userData } = useAuth(); // Ambil sesi user login langsung dari SDK global
	const [record, setRecord] = useState<MedicalRecord | null>(null);
	const [loading, setLoading] = useState(true);

	// Tarik data pemeriksaan klinis terakhir milik pasien ini dari healthRecord secara real-time
	useEffect(() => {
		if (!user?.uid) return;

		const q = query(collection(db, "healthRecord"), where("patient_uid", "==", user.uid), orderBy("waktuPemeriksaan", "desc"), limit(1));

		const unsubscribe = onSnapshot(
			q,
			(snapshot) => {
				if (!snapshot.empty) {
					setRecord(snapshot.docs[0].data() as MedicalRecord);
				} else {
					setRecord(null);
				}
				setLoading(false);
			},
			(error) => {
				console.error("Gagal menarik rekam medis pasien:", error);
				setLoading(false);
			},
		);

		return () => unsubscribe();
	}, [user]);

	return (
		<div className="bg-gray-50 min-h-screen pb-24">
			{/* Navbar Top App Bar */}
			<div className="bg-white px-6 py-4 flex justify-between items-center shadow-sm">
				<div className="flex items-center gap-3">
					<div className="w-10 h-10 rounded-full overflow-hidden border-2 border-pink-100 bg-white flex items-center justify-center p-1">
						<img src={logoPosyandu} alt="Logo Posyandu" className="w-full h-full object-contain" />
					</div>
					<div>
						<p className="text-pink-600 font-black text-base leading-tight">Pasien - CAKET</p>
						<p className="text-[10px] text-gray-400 font-bold">Catatan Kesehatan</p>
					</div>
				</div>

				<div className="relative">
					<Bell className="text-pink-600" />
					<div className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full border border-white"></div>
				</div>
			</div>

			<div className="p-6">
				{/* Welcome Section */}
				<motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
					<h1 className="text-4xl font-black text-gray-800 mb-1 leading-tight tracking-tight">Halo, {userData?.nama || "Pasien"}!</h1>
					<p className="text-gray-400 font-bold mb-8">Semoga sehat selalu hari ini 🌸</p>
				</motion.div>

				{loading ? (
					<div className="py-12 text-center text-pink-600 font-semibold animate-pulse">Sinkronisasi parameter klinis Anda...</div>
				) : (
					<>
						{/* Anthropometrics Banner Box */}
						<motion.div
							initial={{ scale: 0.95, opacity: 0 }}
							animate={{ scale: 1, opacity: 1 }}
							className="bg-gradient-to-r from-pink-500 to-rose-500 rounded-[40px] p-8 text-white flex justify-between items-center mb-8 shadow-xl shadow-pink-500/20"
						>
							<div className="flex gap-8">
								<div>
									<p className="text-[10px] font-bold opacity-80 uppercase mb-2">Berat Badan</p>
									<div className="flex items-baseline gap-1">
										<span className="text-4xl font-black italic">{record?.beratBadan ?? "--"}</span>
										<span className="text-sm font-bold opacity-80">Kg</span>
									</div>
								</div>

								<div>
									<p className="text-[10px] font-bold opacity-80 uppercase mb-2">Tinggi Badan</p>
									<div className="flex items-baseline gap-1">
										<span className="text-4xl font-black italic">{record?.tinggiBadan ?? "--"}</span>
										<span className="text-sm font-bold opacity-80">Cm</span>
									</div>
								</div>
							</div>

							<div className="w-16 h-16 rounded-full border-[3px] border-white/30 flex items-center justify-center bg-white/10 backdrop-blur-sm">
								<span className="text-2xl">{record?.status_pertumbuhan === "Risiko" ? "😟" : record?.status_pertumbuhan === "Perhatian" ? "😐" : "😊"}</span>
							</div>
						</motion.div>

						{/* Vital Signs Grid Data Box */}
						<div className="grid grid-cols-2 gap-4 mb-8">
							<motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-white rounded-[32px] p-6 border border-gray-100 shadow-sm">
								<p className="text-[10px] text-gray-400 font-bold uppercase mb-2">Tekanan Darah</p>
								<p className="text-3xl font-black text-gray-800 leading-tight italic">
									{record?.tekananDarah?.sistolik && record?.tekananDarah?.distolik ? `${record.tekananDarah.sistolik}/${record.tekananDarah.distolik}` : "-- / --"}
								</p>
								<p className="text-xl font-black text-gray-400 italic mt-1">mmHg</p>
							</motion.div>

							<motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-white rounded-[32px] p-6 border border-gray-100 shadow-sm">
								<p className="text-[10px] text-gray-400 font-bold uppercase mb-2">Gula darah</p>
								<p className="text-3xl font-black text-gray-800 leading-tight italic">{record?.gulaDarah ?? "--"}</p>
								<p className="text-xl font-black text-gray-400 italic mt-1">mg/dl</p>
							</motion.div>
						</div>

						{/* Status Card Diagnosis Box */}
						<motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="bg-white rounded-[32px] p-6 border border-pink-50 shadow-sm mb-8">
							<div className="flex items-start gap-4">
								<div className="w-14 h-14 rounded-2xl bg-pink-100 flex items-center justify-center text-2xl">💗</div>
								<div>
									<p className="text-xs text-gray-400 font-bold uppercase mb-1">Status Kesehatan</p>
									<h3 className="text-xl font-black text-gray-800 mb-1">{record ? `Kondisi kamu tergolong: ${record.status_pertumbuhan}` : "Belum ada riwayat periksa"}</h3>
									<p className="text-sm text-gray-500 font-medium leading-relaxed">
										{record?.catatanKeluhan ? `Keterangan kader: "${record.catatanKeluhan}"` : "Tetap jaga pola makan bergizi, penuhi asupan cairan, dan ikuti agenda rutin screening kesehatan di Posyandu terdekat."}
									</p>
								</div>
							</div>
						</motion.div>
					</>
				)}

				{/* Info Tips Hari Ini */}
				<motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="bg-pink-50 rounded-[32px] p-6 mb-8">
					<p className="text-xs text-pink-600 font-black uppercase mb-2">Tips Hari Ini</p>
					<h3 className="text-xl font-black text-gray-800 mb-2">Jangan lupa sarapan sehat 🍽️</h3>
					<p className="text-sm text-gray-500 font-medium leading-relaxed">Pilih makanan bergizi seimbang yang memuat karbohidrat, lauk berprotein, dan sayur segar agar energi tubuh tetap terjaga optimal.</p>
				</motion.div>

				{/* Menu Akses Cepat Grid */}
				<div className="space-y-6">
					<h3 className="text-xl font-bold text-gray-800 px-2 tracking-tight">Akses Cepat</h3>
					<div className="grid grid-cols-2 gap-4">
						<motion.button onClick={() => navigate("/schedule")} whileTap={{ scale: 0.95 }} className="bg-pink-50/60 rounded-[32px] p-6 flex flex-col items-center justify-center gap-3 transition-all hover:bg-pink-100/50">
							<div className="p-3.5 bg-white rounded-2xl shadow-sm italic font-black text-xl">🗓️</div>
							<span className="font-bold text-gray-800 text-md">Jadwal</span>
						</motion.button>
						<motion.button onClick={() => navigate("/education")} whileTap={{ scale: 0.95 }} className="bg-pink-50/60 rounded-[32px] p-6 flex flex-col items-center justify-center gap-3 transition-all hover:bg-pink-100/50">
							<div className="p-3.5 bg-white rounded-2xl shadow-sm italic font-black text-xl">💉</div>
							<span className="font-bold text-gray-800 text-md">Imunisasi</span>
						</motion.button>
						<motion.button onClick={() => navigate("/history")} whileTap={{ scale: 0.95 }} className="bg-pink-50/60 rounded-[32px] p-6 flex flex-col items-center justify-center gap-3 transition-all hover:bg-pink-100/50">
							<div className="p-3.5 bg-white rounded-2xl shadow-sm italic font-black text-xl">📋</div>
							<span className="font-bold text-gray-800 text-md">Riwayat</span>
						</motion.button>
						<motion.button onClick={() => navigate("/profile")} whileTap={{ scale: 0.95 }} className="bg-pink-50/60 rounded-[32px] p-6 flex flex-col items-center justify-center gap-3 transition-all hover:bg-pink-100/50">
							<div className="p-3.5 bg-white rounded-2xl shadow-sm italic font-black text-xl">👤</div>
							<span className="font-bold text-gray-800 text-md">Profil</span>
						</motion.button>
					</div>
				</div>
			</div>

			<BottomNav />
		</div>
	);
}
