import { useMemo, useState, useEffect } from "react";
import { Bell, Ticket, ChevronLeft, ChevronRight } from "lucide-react";
import BottomNav from "@/src/components/organisms/BottomNav";
import { motion } from "motion/react";
import logoPosyandu from "@/src/assets/logo-posyandu.png";
import { getSchedules, Schedule } from "@/src/services/firebaseRest";

export default function SchedulePage() {
	const today = new Date();

	const [currentDate, setCurrentDate] = useState(new Date());
	const [selectedDate, setSelectedDate] = useState(today.getDate());
	const [schedules, setSchedules] = useState<Schedule[]>([]);
	const [loading, setLoading] = useState(true);

	const monthNames = [
		"Januari", "Februari", "Maret", "April", "Mei", "Juni",
		"Juli", "Agustus", "September", "Oktober", "November", "Desember",
	];

	const days = ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"];

	const year = currentDate.getFullYear();
	const month = currentDate.getMonth();

	useEffect(() => {
		const loadSchedules = async () => {
			try {
				setLoading(true);
				const data = await getSchedules();
				setSchedules(data);
			} catch (error) {
				console.error(error);
			} finally {
				setLoading(false);
			}
		};

		loadSchedules();
	}, []);

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

	const scheduleDays = monthSchedules.map((item) => {
		const date = new Date(item.tanggal);
		return date.getDate();
	});

	const selectedSchedule = schedules.find((item) => {
		const date = new Date(item.tanggal);

		return (
			date.getDate() === selectedDate &&
			date.getMonth() === month &&
			date.getFullYear() === year
		);
	});

	const isSelectedToday =
		selectedDate === today.getDate() &&
		month === today.getMonth() &&
		year === today.getFullYear();

	const nextMonth = () => {
		setCurrentDate(new Date(year, month + 1, 1));
		setSelectedDate(1);
	};

	const prevMonth = () => {
		setCurrentDate(new Date(year, month - 1, 1));
		setSelectedDate(1);
	};

	const isToday = (day: number) =>
		day === today.getDate() &&
		month === today.getMonth() &&
		year === today.getFullYear();

	return (
		<div className="bg-gray-50 min-h-screen pb-24">
			<div className="bg-white p-6 flex justify-between items-center border-b border-gray-100">
				<div className="flex items-center gap-3">
					<div className="w-11 h-11 rounded-full bg-white border-2 border-pink-100 p-1.5 flex items-center justify-center shadow-sm">
						<img src={logoPosyandu} alt="Logo CAKET" className="w-full h-full object-contain" />
					</div>

					<div>
						<p className="text-secondary-pink font-black text-base leading-tight">
							Pasien - CAKET
						</p>
						<p className="text-[10px] text-gray-400 font-bold">
							Catatan Kesehatan
						</p>
					</div>
				</div>

				<Bell className="text-pink-300" />
			</div>

			<div className="p-6">
				<h1 className="text-2xl font-black text-gray-800 mb-1">
					Antrean & Jadwal
				</h1>
				<p className="text-gray-400 font-medium mb-8">
					Pantau antrean dan jadwal Posyandu Anda.
				</p>

				<motion.div
					initial={{ y: 20, opacity: 0 }}
					animate={{ y: 0, opacity: 1 }}
					className="bg-white rounded-3xl p-6 shadow-sm border-2 border-pink-50 relative mb-8"
				>
					<div className="flex justify-between items-center mb-6">
						<div>
							<h3 className="text-secondary-pink font-bold text-sm uppercase">
								{selectedSchedule?.nama_kegiatan || "Pilih Tanggal Jadwal"}
							</h3>
							<p className="text-gray-500 font-medium text-xs">
								{selectedSchedule?.lokasi || "Data agenda akan muncul di sini"}
							</p>
						</div>

						<div className="bg-pink-100 text-secondary-pink px-3 py-1 rounded-full text-[10px] font-bold flex items-center gap-1">
							<div className="w-1.5 h-1.5 bg-secondary-pink rounded-full"></div>
							{selectedSchedule?.status || "Tidak Ada Jadwal"}
						</div>
					</div>

					<div className="flex justify-between mb-8">
						<div className="text-center flex-1 border-r border-gray-100">
							<p className="text-[10px] text-gray-400 font-bold uppercase mb-1">
								Total Pendaftar
							</p>
							<p className="text-4xl font-black text-gray-800 italic">
								{selectedSchedule?.total_pendaftar ?? 0}
							</p>
						</div>

						<div className="text-center flex-1">
							<p className="text-[10px] text-gray-400 font-bold uppercase mb-1">
								Sisa Kuota
							</p>
							<p className="text-4xl font-black text-primary-pink italic">
								{selectedSchedule
									? selectedSchedule.kuota_maksimal - selectedSchedule.total_pendaftar
									: 0}
							</p>
						</div>
					</div>

					{selectedSchedule && isSelectedToday ? (
						<button className="w-full pink-gradient text-white py-4 rounded-3xl font-bold flex items-center justify-center gap-2 shadow-lg active:scale-95 transition-transform">
							<Ticket className="w-5 h-5 -rotate-45" />
							Ambil Antrean
						</button>
					) : selectedSchedule ? (
						<p className="text-center text-sm font-bold text-gray-400 bg-gray-100 py-4 rounded-3xl">
							Antrean hanya bisa diambil pada hari jadwal berlangsung.
						</p>
					) : (
						<p className="text-center text-sm font-bold text-gray-400 bg-gray-100 py-4 rounded-3xl">
							Pilih tanggal yang memiliki jadwal.
						</p>
					)}
				</motion.div>

				<div className="flex justify-between items-center mb-6">
					<h3 className="text-xl font-bold text-gray-800">Jadwal Bulan Ini</h3>

					<div className="bg-white border border-gray-200 rounded-full px-4 py-2 text-sm font-bold text-gray-600">
						{monthNames[month]} {year}
					</div>
				</div>

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
						<p className="text-center text-gray-400 font-bold py-8">
							Memuat jadwal...
						</p>
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
												selectedDate === day
													? "bg-secondary-pink text-white shadow-lg"
													: isToday(day)
													? "border-2 border-secondary-pink text-secondary-pink"
													: "text-gray-700"
											}`}
										>
											{day}
										</button>
									) : (
										<div className="w-10 h-10" />
									)}

									{day && scheduleDays.includes(day) && (
										<div className="w-1.5 h-1.5 bg-secondary-pink rounded-full mt-1"></div>
									)}
								</div>
							))}
						</div>
					)}
				</div>

				<div className="bg-white rounded-[32px] p-6 shadow-sm border border-pink-50">
					<p className="text-xs text-gray-400 font-bold uppercase mb-2">
						Tanggal Dipilih
					</p>

					<h3 className="text-2xl font-black text-gray-800">
						{selectedDate} {monthNames[month]} {year}
					</h3>

					{selectedSchedule ? (
						<div className="mt-4">
							<h4 className="font-black text-lg text-secondary-pink">
								{selectedSchedule.nama_kegiatan}
							</h4>

							<p className="text-sm text-gray-500 mt-2">
								📍 {selectedSchedule.lokasi}
							</p>

							<p className="text-sm text-gray-500">
								🕒 {selectedSchedule.waktu_mulai} - {selectedSchedule.waktu_selesai}
							</p>

							<p className="text-sm text-gray-500">
								👥 {selectedSchedule.total_pendaftar}/{selectedSchedule.kuota_maksimal}
							</p>

							<p className="text-sm text-gray-500">
								Status: {selectedSchedule.status}
							</p>
						</div>
					) : (
						<p className="text-gray-500 text-sm font-medium mt-2">
							Belum ada jadwal pada tanggal ini.
						</p>
					)}
				</div>
			</div>

			<BottomNav />
		</div>
	);
}