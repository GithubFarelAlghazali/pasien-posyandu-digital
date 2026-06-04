import { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Bell, Calendar, Activity, Info, CalendarClock } from "lucide-react";
import BottomNav from "@/src/components/organisms/BottomNav";
import { motion } from "motion/react";
import logoPosyandu from "@/src/assets/logo-posyandu.png";
import { useAuth } from "@/src/context/AuthContext";
import { db } from "@/src/services/firebase/config";
import { collection, query, where, onSnapshot, orderBy, limit } from "firebase/firestore";

interface MedicalRecord {
	beratBadan: number | null;
	tinggiBadan: number | null;
	gulaDarah: number | null;
	tekananDarah?: {
		sistolik: number | null;
		distolik: number | null;
	};
	status: string;
	catatanKeluhan?: string;
}

interface ScheduleEvent {
	id: string;
	tanggal: string;
	nama_kegiatan: string;
	lokasi: string;
}

// Koleksi Bank Data Tips Sehat Variatif
const TIPS_BANK = [
	{ title: "Jangan lupa sarapan sehat 🍽️", text: "Pilih makanan bergizi seimbang yang memuat karbohidrat, lauk berprotein, dan sayur segar agar energi tubuh tetap terjaga optimal." },
	{ title: "Cukupi kebutuhan air putih 💧", text: "Minum minimal 8 gelas atau sekitar 2 liter air putih setiap hari untuk menjaga hidrasi tubuh dan fungsi organ tetap maksimal." },
	{ title: "Batasi konsumsi gula berlebih 🍬", text: "Menjaga asupan makanan dan minuman manis dapat melindungi Anda dari risiko diabetes melitus dan menjaga kestabilan gula darah." },
	{ title: "Sempatkan olahraga ringan 🏃‍♂️", text: "Berjalan kaki 15-30 menit sehari sangat membantu menjaga kelenturan pembuluh darah dan kesehatan jantung Anda." },
	{ title: "Istirahat yang berkualitas 😴", text: "Tidur 7-8 jam di malam hari membantu tubuh melakukan regenerasi sel secara optimal dan meningkatkan imunitas." },
];

export default function AdultDashboardPage() {
	const navigate = useNavigate();
	const { user, userData } = useAuth();

	const [record, setRecord] = useState<MedicalRecord | null>(null);
	const [nextSchedule, setNextSchedule] = useState<ScheduleEvent | null>(null);
	const [loadingRecord, setLoadingRecord] = useState(true);
	const [loadingSchedule, setLoadingSchedule] = useState(true);

	// Mengisolasi Tips secara acak (Variasi setiap kali halaman dibuka)
	const randomTip = useMemo(() => {
		const randomIndex = Math.floor(Math.random() * TIPS_BANK.length);
		return TIPS_BANK[randomIndex];
	}, []);

	const hariIniStr = useMemo(() => new Date().toISOString().split("T")[0], []);

	// 1. Listen data pemeriksaan terakhir milik pasien secara real-time
	useEffect(() => {
		if (!user?.uid) return;

		const q = query(collection(db, "healthRecord"), where("patient_uid", "==", user.uid), orderBy("tanggalSaja", "desc"), limit(1));

		const unsubscribe = onSnapshot(
			q,
			(snapshot) => {
				if (!snapshot.empty) {
					setRecord(snapshot.docs[0].data() as MedicalRecord);
				} else {
					setRecord(null);
				}
				setLoadingRecord(false);
			},
			(error) => {
				console.error("Gagal menarik rekam medis dashboard:", error);
				setLoadingRecord(false);
			},
		);

		return () => unsubscribe();
	}, [user]);

	// 2. Listen data jadwal terdekat jika data pemeriksaan masih kosong
	useEffect(() => {
		if (!loadingRecord && record) {
			setLoadingSchedule(false);
			return; // Lewati pencarian jadwal jika pasien sudah punya riwayat periksa
		}

		const qSchedule = query(collection(db, "schedules"), where("tanggal", ">=", hariIniStr), where("status", "==", "aktif"), orderBy("tanggal", "asc"), limit(1));

		const unsubscribe = onSnapshot(
			qSchedule,
			(snapshot) => {
				if (!snapshot.empty) {
					setNextSchedule({ id: snapshot.docs[0].id, ...snapshot.docs[0].data() } as ScheduleEvent);
				} else {
					setNextSchedule(null);
				}
				setLoadingSchedule(false);
			},
			(error) => {
				console.error("Gagal memuat jadwal terdekat:", error);
				setLoadingSchedule(false);
			},
		);

		return () => unsubscribe();
	}, [loadingRecord, record, hariIniStr]);

	// 3. Kalkulator Logika Indeks Massa Tubuh (IMT) Otomatis
	const bmiData = useMemo(() => {
		if (!record?.beratBadan || !record?.tinggiBadan) return null;

		const tinggiMeter = record.tinggiBadan / 100;
		const bmiValue = Number((record.beratBadan / (tinggiMeter * tinggiMeter)).toFixed(1));

		let category = "Normal";
		let colorClass = "bg-green-500 text-white border-green-100";
		let textDescription = "Berat badan Anda berada di rentang ideal. Tetap pertahankan gaya hidup sehat!";

		if (bmiValue < 18.5) {
			category = "Kurus / Kurang";
			colorClass = "bg-amber-500 text-white border-amber-100";
			textDescription = "Berat badan Anda kurang dari batas ideal. Tingkatkan asupan kalori dan nutrisi seimbang.";
		} else if (bmiValue >= 25.1 && bmiValue <= 27.0) {
			category = "Kelebihan Berat Badan";
			colorClass = "bg-orange-500 text-white border-orange-100";
			textDescription = "Anda berada di ambang batas kelebihan berat badan. Batasi gorengan dan rajin berolahraga.";
		} else if (bmiValue > 27.0) {
			category = "Obesitas";
			colorClass = "bg-red-500 text-white border-red-100";
			textDescription = "Indikator menunjukkan kondisi obesitas. Disarankan konsultasi dengan kader atau dokter umum.";
		}

		return { score: bmiValue, category, colorClass, textDescription };
	}, [record]);

	// Helper memformat string tanggal ISO/Stripped ke format lokal pendek
	const formatReadableDate = (dateStr: string) => {
		const date = new Date(dateStr);
		return date.toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" });
	};

	return (
		<div className="bg-gray-50 min-h-screen pb-24">
			{/* Top Bar Navigation */}
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
				{/* Welcome User Header */}
				<motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
					<h1 className="text-4xl font-black text-gray-800 mb-1 leading-tight tracking-tight">Halo, {userData?.nama || "Pasien"}!</h1>
					<p className="text-gray-400 font-bold mb-8">Semoga sehat selalu hari ini 🌸</p>
				</motion.div>

				{/* MONITORING PARAMETER UTAMA */}
				{loadingRecord ? (
					<div className="py-12 text-center text-secondary-pink font-bold animate-pulse">Menghubungkan rekam medis...</div>
				) : (
					<>
						{record ? (
							<>
								{/* Banner Utama Berat & Tinggi Badan */}
								<motion.div
									initial={{ scale: 0.95, opacity: 0 }}
									animate={{ scale: 1, opacity: 1 }}
									className="pink-gradient rounded-[40px] p-8 text-white flex justify-between items-center mb-8 shadow-xl shadow-primary-pink/20"
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
										<span className="text-2xl">{record?.status === "Risiko" ? "😟" : record?.status === "Perhatian" ? "😐" : "😊"}</span>
									</div>
								</motion.div>

								{/* Grid Data Vital Signs */}
								<div className="grid grid-cols-2 gap-4 mb-8">
									<motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-white rounded-[32px] p-6 border border-gray-100 shadow-sm">
										<p className="text-[10px] text-gray-400 font-bold uppercase mb-2">Tekanan Darah</p>
										<p className="text-4xl font-black text-gray-800 leading-tight italic">
											{record?.tekananDarah?.sistolik && record?.tekananDarah?.distolik ? `${record.tekananDarah.sistolik}/${record.tekananDarah.distolik}` : "-- / --"}
										</p>
										<p className="text-2xl font-black text-gray-800 italic opacity-40">mmHg</p>
									</motion.div>

									<motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-white rounded-[32px] p-6 border border-gray-100 shadow-sm">
										<p className="text-[10px] text-gray-400 font-bold uppercase mb-2">Gula darah</p>
										<p className="text-4xl font-black text-gray-800 leading-tight italic">{record?.gulaDarah ?? "--"}</p>
										<p className="text-2xl font-black text-gray-800 italic opacity-40">mg/dl</p>
									</motion.div>
								</div>
							</>
						) : (
							<motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-[32px] p-6 border border-pink-100 shadow-sm mb-8">
								{loadingSchedule ? (
									<p className="text-xs text-center text-gray-400 animate-pulse font-medium">Mencari info agenda terdekat...</p>
								) : nextSchedule ? (
									<div className="flex items-start gap-4">
										<div className="w-12 h-12 rounded-xl bg-pink-50 flex items-center justify-center text-pink-600 shrink-0 shadow-sm">
											<CalendarClock className="w-6 h-6" />
										</div>
										<div className="min-w-0 flex-1">
											<p className="text-[10px] text-pink-600 font-black uppercase tracking-wider mb-0.5">Jadwal Pemeriksaan Terdekat</p>
											<h4 className="text-base font-black text-gray-800 truncate">{nextSchedule.nama_kegiatan}</h4>
											<p className="text-xs text-gray-500 font-medium mt-1">
												🗓️ {formatReadableDate(nextSchedule.tanggal)} • 📍 {nextSchedule.lokasi}
											</p>
										</div>
									</div>
								) : (
									<div className="flex items-start gap-4">
										<div className="w-12 h-12 rounded-xl bg-gray-50 flex items-center justify-center text-gray-400 shrink-0">
											<Calendar className="w-6 h-6" />
										</div>
										<div className="flex-1">
											<p className="text-[10px] text-gray-400 font-black uppercase tracking-wider mb-0.5">Informasi Kunjungan</p>
											<h4 className="text-sm font-bold text-gray-700 leading-relaxed">Anda belum menjalani pemeriksaan klinis bulan ini.</h4>
											<button onClick={() => navigate("/schedule")} className="text-xs font-black text-secondary-pink mt-2 uppercase tracking-wide hover:underline inline-block">
												Buka Tab Kalender Posyandu →
											</button>
										</div>
									</div>
								)}
							</motion.div>
						)}

						{/* STATUS DIAGNOSIS & KELUHAN KADER */}
						{record && (
							<motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="bg-white rounded-[32px] p-6 border border-pink-50 shadow-sm mb-8">
								<div className="flex items-start gap-4">
									<div className="w-14 h-14 rounded-2xl bg-pink-100 flex items-center justify-center text-2xl shrink-0">💗</div>
									<div>
										<p className="text-xs text-gray-400 font-bold uppercase mb-1">Status Kesehatan</p>
										<h3 className="text-xl font-black text-gray-800 mb-1">Kondisi kamu terlihat {record.status.toLowerCase()}</h3>
										<p className="text-sm text-gray-500 font-medium leading-relaxed">
											{record.catatanKeluhan ? `Catatan Kader: "${record.catatanKeluhan}"` : "Tetap jaga pola makan, minum air putih yang cukup, dan rutin cek kesehatan di Posyandu."}
										</p>
									</div>
								</div>
							</motion.div>
						)}

						{/* VISUALISASI STATUS INDEKS MASSA TUBUH (IMT) */}
						{bmiData && (
							<motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-[32px] p-6 border border-gray-100 shadow-sm mb-8 space-y-4">
								<div className="flex items-center gap-2.5 text-gray-800">
									<Info className="w-5 h-5 text-secondary-pink" />
									<h3 className="text-base font-black tracking-tight">Analisis Indeks Massa Tubuh (IMT)</h3>
								</div>

								<div className="flex items-center gap-4 bg-gray-50 p-4 rounded-2xl border border-gray-100/40">
									<div className="text-center shrink-0">
										<p className="text-[9px] text-gray-400 font-black uppercase tracking-wider mb-0.5">Skor IMT</p>
										<p className="text-3xl font-black text-gray-800 italic leading-none">{bmiData.score}</p>
									</div>
									<div className="w-px h-10 bg-gray-200" />
									<div>
										<p className="text-[9px] text-gray-400 font-black uppercase tracking-wider mb-1">Kategori Massa Tubuh</p>
										<span className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wide border ${bmiData.colorClass}`}>{bmiData.category}</span>
									</div>
								</div>
								<p className="text-xs text-gray-500 font-medium leading-relaxed px-1">{bmiData.textDescription}</p>
							</motion.div>
						)}
					</>
				)}

				{/* VARIATING TIPS & TRICKS BOX BAR */}
				<motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="bg-pink-50 rounded-[32px] p-6 mb-8">
					<p className="text-xs text-secondary-pink font-black uppercase mb-2">Tips Hari Ini</p>
					<h3 className="text-xl font-black text-gray-800 mb-2">{randomTip.title}</h3>
					<p className="text-sm text-gray-500 font-medium leading-relaxed">{randomTip.text}</p>
				</motion.div>

				{/* AKSES CEPAT GRID MENU */}
				<div className="space-y-6">
					<h3 className="text-xl font-bold text-gray-800 px-2 tracking-tight">Akses Cepat</h3>

					<div className="grid grid-cols-2 gap-4">
						<motion.button onClick={() => navigate("/schedule")} whileTap={{ scale: 0.95 }} className="bg-pink-100/50 rounded-[32px] p-8 flex flex-col items-center justify-center gap-4 transition-all hover:bg-pink-100">
							<div className="p-4 bg-white rounded-2xl shadow-sm italic font-black text-2xl">🗓️</div>
							<span className="font-bold text-gray-800 text-lg">Jadwal</span>
						</motion.button>

						<motion.button onClick={() => navigate("/education")} whileTap={{ scale: 0.95 }} className="bg-pink-100/50 rounded-[32px] p-8 flex flex-col items-center justify-center gap-4 transition-all hover:bg-pink-100">
							<div className="p-4 bg-white rounded-2xl shadow-sm italic font-black text-2xl">💉</div>
							<span className="font-bold text-gray-800 text-lg">Imunisasi</span>
						</motion.button>

						<motion.button onClick={() => navigate("/history")} whileTap={{ scale: 0.95 }} className="bg-pink-100/50 rounded-[32px] p-8 flex flex-col items-center justify-center gap-4 transition-all hover:bg-pink-100">
							<div className="p-4 bg-white rounded-2xl shadow-sm italic font-black text-2xl">📋</div>
							<span className="font-bold text-gray-800 text-lg">Riwayat</span>
						</motion.button>

						<motion.button onClick={() => navigate("/profile")} whileTap={{ scale: 0.95 }} className="bg-pink-100/50 rounded-[32px] p-8 flex flex-col items-center justify-center gap-4 transition-all hover:bg-pink-100">
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
