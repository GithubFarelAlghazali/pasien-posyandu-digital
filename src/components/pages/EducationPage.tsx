import { Bell, Zap, Star, Play, FileText, Award } from "lucide-react";
import BottomNav from "@/src/components/organisms/BottomNav";
import { motion } from "motion/react";
import Button from "@/src/components/atoms/Button";

export default function EducationPage() {
	return (
		<div className="bg-gray-50 min-h-screen pb-24">
			<div className="bg-white px-6 py-4 flex justify-between items-center">
				<div className="flex items-center gap-3">
					<div className="w-10 h-10 rounded-full overflow-hidden border-2 border-gray-100 flex items-center justify-center">
						<img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Maria" alt="User" />
					</div>
					<span className="text-secondary-pink font-bold text-lg">Posyandu Kita</span>
				</div>
				<Bell className="text-pink-300" />
			</div>

			<div className="p-6">
				<h1 className="text-3xl font-black text-gray-800 mb-1 leading-tight">Pusat Edukasi</h1>
				<p className="text-gray-400 font-bold mb-8">Belajar sambil bermain untuk si kecil.</p>

				{/* Stats Section */}
				<div className="flex gap-4 mb-8">
					<div className="flex-1 bg-secondary-pink text-white rounded-3xl p-6 shadow-lg relative overflow-hidden">
						<Zap className="absolute top-2 right-2 w-10 h-10 opacity-20" />
						<p className="text-[10px] font-bold opacity-80 uppercase mb-1">Energi Belajar</p>
						<div className="flex items-baseline gap-2">
							<span className="text-3xl font-black italic">85</span>
							<span className="text-sm font-bold opacity-80">%</span>
						</div>
					</div>
					<div className="flex-1 bg-pink-100 text-secondary-pink rounded-3xl p-6 shadow-sm border border-pink-200">
						<Star className="w-5 h-5 fill-secondary-pink mb-1" />
						<p className="text-[10px] font-bold opacity-80 uppercase mb-1">Poin Reward</p>
						<div className="flex items-baseline gap-1">
							<span className="text-3xl font-black italic">1,250</span>
							<span className="text-[8px] font-bold">pts</span>
						</div>
					</div>
				</div>

				{/* Daily Quiz Card */}
				<div className="bg-white rounded-3xl p-6 border-2 border-pink-50 shadow-sm flex items-center justify-between mb-8">
					<div className="flex items-center gap-4">
						<div className="w-12 h-12 bg-secondary-pink/10 rounded-xl flex items-center justify-center">
							<FileText className="text-secondary-pink" />
						</div>
						<div>
							<p className="font-black text-gray-800">Kuis Harian</p>
							<p className="text-[10px] text-gray-400 font-bold">+50 Poin hari ini</p>
						</div>
					</div>
					<button className="bg-secondary-pink text-white px-6 py-2 rounded-full font-bold text-sm shadow-md active:scale-95 transition-transform">Mulai</button>
				</div>

				{/* Educational Game */}
				<h3 className="text-xl font-bold text-gray-800 mb-4">Game Edukasi</h3>
				<motion.div whileHover={{ scale: 1.02 }} className="relative rounded-[40px] overflow-hidden mb-8 h-64 shadow-2xl group cursor-pointer">
					<img src="https://images.unsplash.com/photo-1540331548438-50bad0c4fbbd?q=80&w=2574&auto=format&fit=crop" alt="MPASI Game" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
					<div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent p-8 flex flex-col justify-end">
						<div className="bg-black/40 backdrop-blur-md self-start px-4 py-1.5 rounded-full text-white text-[10px] font-bold border border-white/20 mb-4 flex items-center gap-2">
							<div className="w-2 h-2 bg-white rounded-full"></div> Roleplay
						</div>
						<h4 className="text-2xl font-black text-white italic mb-2">Simulasi Hidup Sehat</h4>
						<p className="text-white/70 text-xs font-medium leading-relaxed mb-6 line-clamp-2">Praktekkan cara menyusun menu MPASI yang seimbang untuk usia 6-9 bulan...</p>
						<Button
							className="h-14"
							onClick={() => {
								window.location.href = "/kids-adventure";
							}}
						>
							<Play className="fill-white w-4 h-4 mr-2" />
							Mainkan Sekarang
						</Button>
					</div>
				</motion.div>

				{/* Material */}
				<div className="flex justify-between items-center mb-6">
					<h3 className="text-xl font-bold text-gray-800">Materi Belajar</h3>
					<button className="text-secondary-pink font-bold text-sm">Lihat Semua</button>
				</div>
				<div className="grid grid-cols-2 gap-4 mb-8">
					<div className="bg-white rounded-3xl p-4 shadow-sm border border-gray-100 flex flex-col gap-4">
						<div className="relative rounded-2xl overflow-hidden aspect-square flex items-center justify-center">
							<img src="https://images.unsplash.com/photo-1505373877841-8d25f7d46678?q=80&w=2612&auto=format&fit=crop" alt="V" className="absolute inset-0 object-cover w-full h-full" />
							<div className="absolute inset-0 bg-black/30 flex items-center justify-center">
								<Play className="text-white w-8 h-8 fill-white opacity-80" />
							</div>
						</div>
						<div className="px-1">
							<p className="text-[10px] text-gray-400 font-bold uppercase mb-1">Video</p>
							<p className="font-bold text-gray-800 leading-tight">Teknik Pijat Bayi Dasar...</p>
						</div>
					</div>
					<div className="space-y-4">
						<div className="bg-white rounded-3xl p-4 shadow-sm border border-gray-100 flex items-center gap-3">
							<div className="w-10 h-10 bg-pink-100 rounded-xl flex items-center justify-center shrink-0">
								<FileText className="text-secondary-pink w-5 h-5" />
							</div>
							<div className="min-w-0">
								<p className="text-[8px] bg-gray-100 px-1.5 py-0.5 rounded-full inline-block font-black text-gray-500 mb-1">PDF</p>
								<p className="font-bold text-gray-800 text-[11px] leading-tight truncate">Resep MPASI Pertama...</p>
							</div>
						</div>
						<div className="bg-white rounded-3xl p-4 shadow-sm border border-gray-100 flex items-center gap-3">
							<div className="w-10 h-10 bg-pink-100 rounded-xl flex items-center justify-center shrink-0">
								<FileText className="text-secondary-pink w-5 h-5" />
							</div>
							<div className="min-w-0">
								<p className="text-[8px] bg-gray-100 px-1.5 py-0.5 rounded-full inline-block font-black text-gray-500 mb-1">Artikel</p>
								<p className="font-bold text-gray-800 text-[11px] leading-tight truncate">Jadwal Imunisasi Wajib...</p>
							</div>
						</div>
					</div>
				</div>

				{/* Badges */}
				<h3 className="text-xl font-bold text-gray-800 mb-6">Lencana Saya</h3>
				<div className="flex justify-between px-2 pb-8">
					{[
						{ icon: <Award className="text-pink-600" />, label: "Pemula Gizi", active: true },
						//  { icon: <Check className="text-pink-600" />, label: 'Rajin Kuis', active: true },
						{ icon: <Award />, label: "Pakar Imunisasi", active: false },
						{ icon: <Award />, label: "Master MPASI", active: false },
					].map((badge, idx) => (
						<div key={idx} className="flex flex-col items-center gap-3 w-16">
							<div className={`w-14 h-14 rounded-full flex items-center justify-center shadow-inner ${badge.active ? "bg-pink-100 border-2 border-secondary-pink/20" : "bg-gray-100 grayscale"}`}>{badge.icon}</div>
							<span className={`text-[10px] text-center font-bold leading-tight ${badge.active ? "text-gray-800" : "text-gray-400"}`}>{badge.label}</span>
						</div>
					))}
				</div>
			</div>
			<BottomNav />
		</div>
	);
}
