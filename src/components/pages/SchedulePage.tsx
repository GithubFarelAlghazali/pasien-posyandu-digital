import { useMemo, useState, useEffect } from "react";
import { Bell, Ticket, ChevronLeft, ChevronRight, CheckCircle2, Loader2 } from "lucide-react";
import BottomNav from "@/src/components/organisms/BottomNav";
import { motion, AnimatePresence } from "motion/react";
import logoPosyandu from "@/src/assets/logo-posyandu.png";
import { useAuth } from "@/src/context/AuthContext";
import { db } from "@/src/services/firebase/config";
import { collection, query, onSnapshot, doc, runTransaction, getDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

// Definisikan Interface sesuai gambar skema database kamu
interface Schedule {
	id: string;
	dibuat_oleh: string;
	dibuat_pada: string;
	kuota_maksimal: number;
	lokasi: string;
	nama_kegiatan: string;
	status: string;
	tanggal: string;
	total_pendaftar: number;
	waktu_mulai: string;
	waktu_selesai: string;
}

interface PatientQueue {
	nomor_antrean: number;
	status_antrean: "menunggu" | "dipanggil" | "selesai";
}

export default function SchedulePage() {
	const today = new Date();
	const { user, userData } = useAuth();
	const navigate = useNavigate();

	const [currentDate, setCurrentDate] = useState(new Date());
	const [selectedDate, setSelectedDate] = useState(today.getDate());
	const [schedules, setSchedules] = useState<Schedule[]>([]);
	const [myQueue, setMyQueue] = useState<PatientQueue | null>(null);

	const [loading, setLoading] = useState(true);
	const [actionLoading, setActionLoading] = useState(false);
	const [messageError, setMessageError] = useState("");

	const monthNames = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];
	const days = ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"];

	const year = currentDate.getFullYear();
	const month = currentDate.getMonth();

	// 1. Ambil data semua schedules secara real-time
	useEffect(() => {
		const q = query(collection(db, "schedules"));
		const unsubscribe = onSnapshot(
			q,
			(snapshot) => {
				const loadedSchedules: Schedule[] = snapshot.docs.map(
					(doc) =>
						({
							id: doc.id,
							...doc.data(),
						}) as Schedule,
				);
				setSchedules(loadedSchedules);
				setLoading(false);
			},
			(err) => {
				console.error("Gagal memuat jadwal:", err);
				setLoading(false);
			},
		);

		return () => unsubscribe();
	}, []);

	// Filter & dapatkan jadwal yang dipilih berdasarkan kalender
	const selectedSchedule = useMemo(() => {
		return schedules.find((item) => {
			const date = new Date(item.tanggal);
			return date.getDate() === selectedDate && date.getMonth() === month && date.getFullYear() === year;
		});
	}, [schedules, selectedDate, month, year]);

	// 2. Ambil data antrean milik pasien ini jika jadwal yang dipilih aktif
	useEffect(() => {
		if (!user?.uid || !selectedSchedule?.id) {
			setMyQueue(null);
			return;
		}

		// Document ID unik gabungan scheduleId dan patientUid
		const queueDocRef = doc(db, "queues", `${selectedSchedule.id}_${user.uid}`);

		const unsubscribe = onSnapshot(queueDocRef, (docSnap) => {
			if (docSnap.exists()) {
				setMyQueue(docSnap.data() as PatientQueue);
			} else {
				setMyQueue(null);
			}
		});

		return () => unsubscribe();
	}, [user, selectedSchedule]);

	// Logika pembantu kalender
	const calendarDays = useMemo(() => {
		const firstDay = new Date(year, month, 1).getDay();
		const totalDays = new Date(year, month + 1, 0).getDate();
		const emptyDays = Array(firstDay).fill(null);
		const daysInMonth = Array.from({ length: totalDays }, (_, i) => i + 1);
		return [...emptyDays, ...daysInMonth];
	}, [year, month]);

	const monthSchedules = schedules.filter((item) => {
		const date = new Date(item.tanggal);
		return date.getMonth() === month && date.getFullYear() === year;
	});

	const scheduleDays = monthSchedules.map((item) => new Date(item.tanggal).getDate());

	const isSelectedToday = selectedDate === today.getDate() && month === today.getMonth() && year === today.getFullYear();

	const nextMonth = () => {
		setCurrentDate(new Date(year, month + 1, 1));
		setSelectedDate(1);
	};
	const prevMonth = () => {
		setCurrentDate(new Date(year, month - 1, 1));
		setSelectedDate(1);
	};
	const isToday = (day: number) => day === today.getDate() && month === today.getMonth() && year === today.getFullYear();

	// 3. FUNGSI UTAMA: Ambil Nomor Antrean Menggunakan Firestore Transaction
	const handleAmbilAntrean = async () => {
		if (!user?.uid || !selectedSchedule) return;

		setActionLoading(true);
		setMessageError("");

		const scheduleDocRef = doc(db, "schedules", selectedSchedule.id);
		const queueDocRef = doc(db, "queues", `${selectedSchedule.id}_${user.uid}`);

		try {
			await runTransaction(db, async (transaction) => {
				// Ambil data schedule terbaru di dalam transaksi
				const scheduleSnap = await transaction.get(scheduleDocRef);
				if (!scheduleSnap.exists()) throw new Error("Jadwal tidak ditemukan.");

				const scheduleData = scheduleSnap.data() as Schedule;

				// Validasi kuota penuh
				if (scheduleData.total_pendaftar >= scheduleData.kuota_maksimal) {
					throw new Error("Maaf, kuota pendaftaran untuk jadwal ini sudah penuh.");
				}

				// Hitung nomor antrean baru (total_pendaftar saat ini + 1)
				const nomorAntreanBaru = scheduleData.total_pendaftar + 1;

				// Set data dokumen antrean baru pasien
				transaction.set(queueDocRef, {
					schedule_id: selectedSchedule.id,
					patient_uid: user.uid,
					nama_pasien: userData?.nama || "Pasien",
					nomor_antrean: nomorAntreanBaru,
					status_antrean: "menunggu",
					diambil_pada: new Date().toISOString(),
				});

				// Perbarui jumlah total_pendaftar di dokumen schedule
				transaction.update(scheduleDocRef, {
					total_pendaftar: nomorAntreanBaru,
				});
			});

			alert("Berhasil mengambil nomor antrean!");
		} catch (error: any) {
			console.error("Transaksi Antrean Gagal:", error);
			setMessageError(error.message || "Gagal mengambil antrean, silakan coba lagi.");
		} finally {
			setActionLoading(false);
		}
	};

	return (
		<div className="bg-gray-50 min-h-screen pb-24">
			{/* Header */}
			<div className="bg-white p-6 flex justify-between items-center border-b border-gray-100">
				<div className="flex items-center gap-3">
					<div className="w-11 h-11 rounded-full bg-white border-2 border-pink-100 p-1.5 flex items-center justify-center shadow-sm">
						<img src={logoPosyandu} alt="Logo CAKET" className="w-full h-full object-contain" />
					</div>
					<div>
						<p className="text-secondary-pink font-black text-base leading-tight">Pasien - CAKET</p>
						<p className="text-[10px] text-gray-400 font-bold">Catatan Kesehatan</p>
					</div>
				</div>
				<Bell className="text-pink-300" />
			</div>

			<div className="p-6">
				<h1 className="text-2xl font-black text-gray-800 mb-1">Antrean & Jadwal</h1>
				<p className="text-gray-400 font-medium mb-8">Pantau antrean dan jadwal Posyandu Anda.</p>

				{/* PANEL UTAMA JADWAL & STATUS ANTREAN */}
				<motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="bg-white rounded-3xl p-6 shadow-sm border-2 border-pink-50 relative mb-8">
					<div className="flex justify-between items-center mb-6">
						<div>
							<h3 className="text-secondary-pink font-bold text-sm uppercase">{selectedSchedule?.nama_kegiatan || "Pilih Tanggal Jadwal"}</h3>
							<p className="text-gray-500 font-medium text-xs">{selectedSchedule?.lokasi || "Data agenda akan muncul di sini"}</p>
						</div>

						<div className="bg-pink-100 text-secondary-pink px-3 py-1 rounded-full text-[10px] font-bold flex items-center gap-1">
							<div className="w-1.5 h-1.5 bg-secondary-pink rounded-full"></div>
							{selectedSchedule?.status || "Tidak Ada Jadwal"}
						</div>
					</div>

					{/* KONDISI 1: JIKA PASIEN SUDAH MENGEKSEKUSI/MEMILIKI NOMOR ANTREAN */}
					{myQueue ? (
						<div className="bg-gradient-to-br from-pink-500 to-rose-500 rounded-2xl p-6 text-white text-center space-y-4 shadow-md shadow-pink-200">
							<p className="text-xs font-bold uppercase tracking-wider opacity-90">Nomor Antrean Anda</p>
							<h2 className="text-6xl font-black italic">{myQueue.nomor_antrean}</h2>
							<div className="inline-flex items-center gap-1.5 bg-white/20 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wide">Status: {myQueue.status_antrean}</div>
							<p className="text-[11px] opacity-80 pt-1 font-medium">
								{myQueue.status_antrean === "menunggu" && "Silakan menunggu panggilan dari kader posyandu di lokasi."}
								{myQueue.status_antrean === "dipanggil" && "Nomor Anda sedang dipanggil! Silakan menuju meja pemeriksaan."}
								{myQueue.status_antrean === "selesai" && "Pemeriksaan selesai. Terima kasih telah menjaga kesehatan!"}
							</p>
						</div>
					) : (
						/* KONDISI 2: TAMPILAN INFORMASI KUOTA BIASA JIKA BELUM AMBIL ANTREAN */
						<>
							<div className="flex justify-between mb-8">
								<div className="text-center flex-1 border-r border-gray-100">
									<p className="text-[10px] text-gray-400 font-bold uppercase mb-1">Total Pendaftar</p>
									<p className="text-4xl font-black text-gray-800 italic">{selectedSchedule?.total_pendaftar ?? 0}</p>
								</div>

								<div className="text-center flex-1">
									<p className="text-[10px] text-gray-400 font-bold uppercase mb-1">Sisa Kuota</p>
									<p className="text-4xl font-black text-primary-pink italic">{selectedSchedule ? selectedSchedule.kuota_maksimal - selectedSchedule.total_pendaftar : 0}</p>
								</div>
							</div>

							{/* LOGIKA TOMBOL GENERATE ANTREAN */}
							{selectedSchedule && isSelectedToday ? (
								<button
									onClick={handleAmbilAntrean}
									disabled={actionLoading || selectedSchedule.total_pendaftar >= selectedSchedule.kuota_maksimal}
									className="w-full pink-gradient text-white py-4 rounded-3xl font-bold flex items-center justify-center gap-2 shadow-lg active:scale-95 transition-transform disabled:opacity-50 disabled:cursor-not-allowed"
								>
									{actionLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Ticket className="w-5 h-5 -rotate-45" />}
									{selectedSchedule.total_pendaftar >= selectedSchedule.kuota_maksimal ? "Kuota Habis" : "Ambil Antrean"}
								</button>
							) : selectedSchedule ? (
								<p className="text-center text-xs font-bold text-gray-400 bg-gray-100 py-4 rounded-3xl px-4">Antrean hanya bisa diambil pada hari jadwal berlangsung.</p>
							) : (
								<p className="text-center text-xs font-bold text-gray-400 bg-gray-100 py-4 rounded-3xl">Pilih tanggal yang memiliki jadwal.</p>
							)}
						</>
					)}

					{messageError && <p className="mt-4 text-center text-xs font-semibold text-red-600 bg-red-50 py-2.5 rounded-xl border border-red-100">{messageError}</p>}
				</motion.div>

				{/* Navigasi Bulan */}
				<div className="flex justify-between items-center mb-6">
					<h3 className="text-xl font-bold text-gray-800">Jadwal Bulan Ini</h3>
					<div className="bg-white border border-gray-200 rounded-full px-4 py-2 text-sm font-bold text-gray-600">
						{monthNames[month]} {year}
					</div>
				</div>

				{/* Kalender Elemen */}
				<div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 mb-8">
					<div className="flex justify-between items-center mb-6">
						<button onClick={prevMonth} className="w-10 h-10 rounded-full bg-pink-50 flex items-center justify-center">
							<ChevronLeft className="text-secondary-pink" />
						</button>
						<h4 className="font-black text-gray-800">
							{monthNames[month]} {year}
						</h4>
						<button onClick={nextMonth} className="w-10 h-10 rounded-full bg-pink-50 flex items-center justify-center">
							<ChevronRight className="text-secondary-pink" />
						</button>
					</div>

					{loading ? (
						<p className="text-center text-gray-400 font-bold py-8">Memuat jadwal...</p>
					) : (
						<div className="grid grid-cols-7 gap-y-4 text-center">
							{days.map((day) => (
								<span key={day} className="text-[10px] font-bold text-gray-400 uppercase">
									{day}
								</span>
							))}

							{calendarDays.map((day, index) => (
								<div key={index} className="flex flex-col items-center min-h-[48px]">
									{day ? (
										<button
											onClick={() => setSelectedDate(day)}
											className={`w-10 h-10 flex items-center justify-center rounded-full font-bold transition-all ${
												selectedDate === day ? "bg-secondary-pink text-white shadow-lg" : isToday(day) ? "border-2 border-secondary-pink text-secondary-pink" : "text-gray-700"
											}`}
										>
											{day}
										</button>
									) : (
										<div className="w-10 h-10" />
									)}
									{day && scheduleDays.includes(day) && <div className="w-1.5 h-1.5 bg-secondary-pink rounded-full mt-1"></div>}
								</div>
							))}
						</div>
					)}
				</div>

				{/* Informasi Detil Bagian Bawah */}
				<div className="bg-white rounded-[32px] p-6 shadow-sm border border-pink-50">
					<p className="text-xs text-gray-400 font-bold uppercase mb-2">Tanggal Dipilih</p>
					<h3 className="text-2xl font-black text-gray-800">
						{selectedDate} {monthNames[month]} {year}
					</h3>

					{selectedSchedule ? (
						<div className="mt-4 space-y-1">
							<h4 className="font-black text-lg text-secondary-pink">{selectedSchedule.nama_kegiatan}</h4>
							<p className="text-sm text-gray-500 pt-1">📍 {selectedSchedule.lokasi}</p>
							<p className="text-sm text-gray-500">
								🕒 {selectedSchedule.waktu_mulai} - {selectedSchedule.waktu_selesai} WIB
							</p>
							<p className="text-sm text-gray-500">
								👥 Pendaftar: {selectedSchedule.total_pendaftar} / {selectedSchedule.kuota_maksimal} Orang
							</p>
						</div>
					) : (
						<p className="text-gray-500 text-sm font-medium mt-2">Belum ada jadwal pada tanggal ini.</p>
					)}
				</div>
			</div>

			<BottomNav />
		</div>
	);
}
