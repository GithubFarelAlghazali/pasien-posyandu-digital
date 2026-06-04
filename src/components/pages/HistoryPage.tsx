import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Bell, ChevronRight, Filter, Calendar, X, Activity } from "lucide-react";
import BottomNav from "@/src/components/organisms/BottomNav";
import { motion, AnimatePresence } from "motion/react";
import logoPosyandu from "@/src/assets/logo-posyandu.png";
import { useAuth } from "@/src/context/AuthContext";
import { db } from "@/src/services/firebase/config";
import { collection, query, where, onSnapshot, orderBy } from "firebase/firestore";

interface HealthRecordItem {
	id: string;
	waktuPemeriksaan?: string;
	nama?: string;
	status_pertumbuhan?: string;
	beratBadan?: number;
	tinggiBadan?: number;
	lingkarKepala?: number;
	gulaDarah?: number;
	tekananDarah?: {
		sistolik: number;
		distolik: number;
	};
	catatanKeluhan?: string;
}

export default function HistoryPage() {
	const navigate = useNavigate();
	const { user } = useAuth(); // Ambil token user login dari global context
	const [records, setRecords] = useState<HealthRecordItem[]>([]);
	const [loading, setLoading] = useState(true);
	const [selectedRecord, setSelectedRecord] = useState<HealthRecordItem | null>(null);

	// Fetching Real-time data dari koleksi healthRecord berdasarkan UID pasien
	useEffect(() => {
		if (!user?.uid) return;

		const q = query(collection(db, "healthRecord"), where("patient_uid", "==", user.uid), orderBy("tanggalSaja", "desc"));

		const unsubscribe = onSnapshot(
			q,
			(snapshot) => {
				const loadedRecords: HealthRecordItem[] = snapshot.docs.map((doc) => ({
					id: doc.id,
					...doc.data(),
				}));
				setRecords(loadedRecords);
				setLoading(false);
			},
			(error) => {
				console.error("Gagal memuat riwayat medis pasien:", error);
				setLoading(false);
			},
		);

		return () => unsubscribe();
	}, [user]);

	// Helper untuk melakukan formatting stempel waktu tanggal pendek lokal (Contoh: "12 Okt")
	const formatShortDate = (dateStr?: string) => {
		if (!dateStr) return { day: "--", month: "--" };
		const dateObj = new Date(dateStr);
		const day = dateObj.toLocaleDateString("id-ID", { day: "2-digit" });
		const month = dateObj.toLocaleDateString("id-ID", { month: "short" });
		return { day, month };
	};

	// Helper untuk melakukan formatting tanggal lengkap pada modal detail
	const formatFullDate = (dateStr?: string) => {
		if (!dateStr) return "--";
		return (
			new Date(dateStr).toLocaleDateString("id-ID", {
				day: "numeric",
				month: "long",
				year: "numeric",
				hour: "2-digit",
				minute: "2-digit",
			}) + " WIB"
		);
	};

	return (
		<div className="bg-gray-50 min-h-screen pb-24">
			{/* Top Navigation Navbar Bar */}
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
				<Bell className="text-pink-300" />
			</div>

			<div className="p-8">
				{/* Header Title Section */}
				<div className="flex justify-between items-start mb-8">
					<div>
						<h1 className="text-4xl font-black text-gray-800 leading-tight italic">Riwayat</h1>
						<p className="text-gray-400 font-bold">Catatan pemeriksaan medis Anda.</p>
					</div>
					<button className="bg-white border border-gray-100 rounded-2xl px-4 py-2 flex items-center gap-2 text-xs font-bold text-secondary-pink shadow-sm">
						Semua <Filter className="w-3 h-3" />
					</button>
				</div>

				{/* Conditional Layout Rendering */}
				{loading ? (
					<div className="py-20 text-center text-secondary-pink font-bold animate-pulse">Menyinkronkan berkas pemeriksaan rekam medis...</div>
				) : records.length === 0 ? (
					/* TAMPILAN JIKA DATA DI HEALTHRECORD MASIH KOSONG */
					<motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-white rounded-[32px] p-8 border border-pink-100 text-center shadow-sm flex flex-col items-center justify-center gap-6">
						<div className="w-20 h-20 rounded-full bg-pink-50 flex items-center justify-center text-4xl">📋</div>
						<div className="space-y-2 max-w-sm">
							<h3 className="text-xl font-black text-gray-800">Belum Ada Catatan</h3>
							<p className="text-sm text-gray-500 font-medium leading-relaxed">Anda belum menjalani pemeriksaan, silakan lihat jadwal pemeriksaan terdekat.</p>
						</div>
						<button onClick={() => navigate("/schedule")} className="bg-secondary-pink text-white font-bold px-6 py-3.5 rounded-2xl text-sm shadow-md hover:bg-pink-700 transition-colors flex items-center gap-2">
							<Calendar className="w-4 h-4" />
							Lihat Jadwal Posyandu
						</button>
					</motion.div>
				) : (
					/* TAMPILAN JIKA DATA HEALTHRECORD TERSEDIA */
					<div className="space-y-6">
						{records.map((rec, i) => {
							const { day, month } = formatShortDate(rec.waktuPemeriksaan);
							const isLatest = i === 0; // Kasih tanda aktif/highlight pada pemeriksaan paling baru

							return (
								<motion.div
									key={rec.id}
									initial={{ x: -20, opacity: 0 }}
									animate={{ x: 0, opacity: 1 }}
									transition={{ delay: i * 0.1 }}
									className="bg-white rounded-[40px] p-8 shadow-sm border border-gray-100 flex flex-col gap-6"
								>
									<div className="flex justify-between items-center">
										<div className="flex items-center gap-4">
											<div className={`w-16 h-16 rounded-full flex flex-col items-center justify-center shadow-md ${isLatest ? "bg-secondary-pink text-white" : "bg-gray-100 text-gray-400"}`}>
												<span className="text-2xl font-black italic leading-none">{day}</span>
												<span className="text-[10px] font-black uppercase tracking-wider">{month}</span>
											</div>
											<div>
												<h3 className="text-xl font-bold text-gray-800 leading-none mb-1">Pemeriksaan Berkala</h3>
												<p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Oleh Kader Posyandu</p>
											</div>
										</div>
										<div
											className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
												rec.status_pertumbuhan === "Stunting" || rec.status_pertumbuhan === "Risiko"
													? "bg-red-500 text-white"
													: rec.status_pertumbuhan === "Perhatian"
														? "bg-amber-500 text-white"
														: "bg-secondary-pink text-white"
											}`}
										>
											{rec.status_pertumbuhan || "Normal"}
										</div>
									</div>

									<div className="bg-gray-50 rounded-3xl p-5 flex justify-between items-center border border-gray-100">
										<div className="text-center flex-1 border-r border-gray-200/50">
											<div className="flex items-center justify-center gap-1.5 mb-1 opacity-60">
												⚖️ <span className="text-[9px] font-black uppercase text-gray-400 tracking-wider">Berat</span>
											</div>
											<p className="text-2xl font-black text-gray-800 flex items-baseline justify-center gap-0.5">
												{rec.beratBadan ?? "--"} <span className="text-xs font-bold opacity-40">kg</span>
											</p>
										</div>
										<div className="text-center flex-1">
											<div className="flex items-center justify-center gap-1.5 mb-1 opacity-60">
												📏 <span className="text-[9px] font-black uppercase text-gray-400 tracking-wider">Tinggi</span>
											</div>
											<p className="text-2xl font-black text-gray-800 flex items-baseline justify-center gap-0.5">
												{rec.tinggiBadan ?? "--"} <span className="text-xs font-bold opacity-40">cm</span>
											</p>
										</div>
									</div>

									<button
										onClick={() => setSelectedRecord(rec)}
										className={`w-full py-4 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all ${isLatest ? "bg-pink-50 text-secondary-pink hover:bg-pink-100/70" : "bg-gray-50 text-gray-500 hover:bg-gray-100"}`}
									>
										Lihat Detail Pemeriksaan
										<ChevronRight className="w-5 h-5" />
									</button>
								</motion.div>
							);
						})}
					</div>
				)}
			</div>

			{/* DETIL MODAL BOX PEMERIKSAAN KESEHATAN PASIEN (REAL-TIME POPUP) */}
			<AnimatePresence>
				{selectedRecord && (
					<div className="fixed inset-0 z-50 flex items-center justify-center p-5">
						{/* Overlay Background Backdrop */}
						<motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSelectedRecord(null)} className="absolute inset-0 bg-black/40 backdrop-blur-sm" />

						{/* Modal Body Container Box */}
						<motion.div
							initial={{ scale: 0.9, opacity: 0, y: 20 }}
							animate={{ scale: 1, opacity: 1, y: 0 }}
							exit={{ scale: 0.9, opacity: 0, y: 20 }}
							className="bg-white w-full max-w-md rounded-[36px] overflow-hidden shadow-2xl relative z-10 border border-gray-100 flex flex-col max-h-[85vh]"
						>
							{/* Modal Header */}
							<div className="p-6 border-b border-gray-100 flex justify-between items-center bg-pink-50/40">
								<div className="flex items-center gap-2.5 text-secondary-pink">
									<Activity className="w-5 h-5" />
									<h2 className="text-xl font-black text-gray-800 tracking-tight">Detail Rekam Medis</h2>
								</div>
								<button onClick={() => setSelectedRecord(null)} className="w-8 h-8 rounded-full bg-white shadow-sm border border-gray-100 flex items-center justify-center text-gray-400 hover:text-gray-600 transition-colors">
									<X className="w-4 h-4" />
								</button>
							</div>

							{/* Modal Content Scrollable Area */}
							<div className="p-6 overflow-y-auto space-y-6">
								<div>
									<p className="text-[10px] text-gray-400 font-black uppercase tracking-wider mb-1">Waktu Pemeriksaan</p>
									<p className="text-base font-bold text-gray-800">{formatFullDate(selectedRecord.waktuPemeriksaan)}</p>
								</div>

								{/* Grid Parameter Utama */}
								<div className="grid grid-cols-3 gap-3">
									<div className="bg-gray-50 border border-gray-100 p-3.5 rounded-2xl text-center">
										<p className="text-[9px] text-gray-400 font-bold uppercase tracking-wide mb-1">Berat Badan</p>
										<p className="text-lg font-black text-gray-800">
											{selectedRecord.beratBadan ?? "--"} <span className="text-[10px] font-bold text-gray-400">kg</span>
										</p>
									</div>
									<div className="bg-gray-50 border border-gray-100 p-3.5 rounded-2xl text-center">
										<p className="text-[9px] text-gray-400 font-bold uppercase tracking-wide mb-1">Tinggi Badan</p>
										<p className="text-lg font-black text-gray-800">
											{selectedRecord.tinggiBadan ?? "--"} <span className="text-[10px] font-bold text-gray-400">cm</span>
										</p>
									</div>
									<div className="bg-gray-50 border border-gray-100 p-3.5 rounded-2xl text-center">
										<p className="text-[9px] text-gray-400 font-bold uppercase tracking-wide mb-1">Lingkar Kepala</p>
										<p className="text-lg font-black text-gray-800">
											{selectedRecord.lingkarKepala ?? "--"} <span className="text-[10px] font-bold text-gray-400">cm</span>
										</p>
									</div>
								</div>

								{/* Grid Vital Signs Tambahan */}
								<div className="grid grid-cols-2 gap-4">
									<div className="bg-pink-50/20 border border-pink-100/50 p-4 rounded-2xl">
										<p className="text-[10px] text-gray-400 font-black uppercase tracking-wider mb-1">Tekanan Darah</p>
										<p className="text-xl font-black text-gray-800">
											{selectedRecord.tekananDarah?.sistolik && selectedRecord.tekananDarah?.distolik ? `${selectedRecord.tekananDarah.sistolik}/${selectedRecord.tekananDarah.distolik}` : "-- / --"}
											<span className="text-xs font-bold text-gray-400 ml-1">mmHg</span>
										</p>
									</div>
									<div className="bg-pink-50/20 border border-pink-100/50 p-4 rounded-2xl">
										<p className="text-[10px] text-gray-400 font-black uppercase tracking-wider mb-1">Gula Darah</p>
										<p className="text-xl font-black text-gray-800">
											{selectedRecord.gulaDarah ?? "--"}
											<span className="text-xs font-bold text-gray-400 ml-1">mg/dL</span>
										</p>
									</div>
								</div>

								{/* Catatan Kader Keluhan */}
								<div className="bg-amber-50/30 border border-amber-100 p-4 rounded-2xl space-y-1.5">
									<p className="text-[10px] text-amber-600 font-black uppercase tracking-wider">Catatan & Saran Kader Klinis</p>
									<p className="text-sm font-medium text-gray-700 leading-relaxed italic">
										{selectedRecord.catatanKeluhan ? `"${selectedRecord.catatanKeluhan}"` : "Kondisi stabil, tidak ada catatan keluhan khusus dari kader posyandu."}
									</p>
								</div>
							</div>

							{/* Modal Footer Action Button */}
							<div className="p-4 bg-gray-50 border-t border-gray-100">
								<button onClick={() => setSelectedRecord(null)} className="w-full py-3.5 bg-secondary-pink text-white font-bold rounded-xl text-sm shadow-md hover:bg-pink-700 transition-colors">
									Selesai Membaca
								</button>
							</div>
						</motion.div>
					</div>
				)}
			</AnimatePresence>

			<BottomNav />
		</div>
	);
}
