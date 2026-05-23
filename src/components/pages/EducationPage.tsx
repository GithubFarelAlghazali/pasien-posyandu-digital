import {
	ArrowLeft,
	Bell,
	BookOpen,
	Brain,
	ChevronRight,
	Gamepad2,
	HeartPulse,
	Play,
	ShieldCheck,
	Sparkles,
	Syringe,
	Utensils,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import BottomNav from "@/src/components/organisms/BottomNav";
import logoPosyandu from "@/src/assets/logo-posyandu.png";

export default function EducationPage() {
	const navigate = useNavigate();

	const materials = [
		{
			title: "Gizi Seimbang",
			desc: "Pelajari pola makan sehat untuk keluarga.",
			icon: <Utensils className="w-8 h-8 text-pink-600" />,
			bg: "bg-pink-50",
			border: "border-pink-100",
			emoji: "🥗",
		},
		{
			title: "Imunisasi",
			desc: "Kenali jadwal dan manfaat imunisasi.",
			icon: <Syringe className="w-8 h-8 text-blue-600" />,
			bg: "bg-blue-50",
			border: "border-blue-100",
			emoji: "💉",
		},
		{
			title: "Tumbuh Kembang",
			desc: "Pantau perkembangan si kecil.",
			icon: <HeartPulse className="w-8 h-8 text-purple-600" />,
			bg: "bg-purple-50",
			border: "border-purple-100",
			emoji: "👶",
		},
	];

	const games = [
		{
			title: "Tebak Makanan Sehat",
			desc: "Pilih makanan sehat untuk tubuhmu!",
			emoji: "🍎",
			button: "bg-secondary-pink",
			bg: "bg-pink-50",
			path: "/game/tebak-makanan-sehat",
		},
		{
			title: "Puzzle Gizi Seimbang",
			desc: "Susun piring makan sehat dengan tepat.",
			emoji: "🧩",
			button: "bg-green-500",
			bg: "bg-green-50",
			path: "/game/puzzle-gizi-seimbang",
		},
		{
			title: "Quiz Imunisasi",
			desc: "Jawab pertanyaan seputar imunisasi.",
			emoji: "📋",
			button: "bg-blue-500",
			bg: "bg-blue-50",
			path: "/game/quiz-imunisasi",
		},
	];

	return (
		<div className="bg-gray-50 min-h-screen pb-24">
			<div className="bg-white px-5 py-4 flex justify-between items-center shadow-sm sticky top-0 z-20">
				<div className="flex items-center gap-3">
					<button
						onClick={() => navigate(-1)}
						className="w-10 h-10 rounded-2xl bg-pink-50 flex items-center justify-center"
					>
						<ArrowLeft className="text-secondary-pink w-5 h-5" />
					</button>

					<div className="w-10 h-10 rounded-full bg-white border-2 border-pink-100 p-1.5 flex items-center justify-center shadow-sm">
						<img src={logoPosyandu} alt="Logo CAKET" className="w-full h-full object-contain" />
					</div>

					<div>
						<p className="text-secondary-pink font-black text-sm leading-tight">
							Pasien - CAKET
						</p>
						<p className="text-[10px] text-gray-400 font-bold">
							Catatan Kesehatan
						</p>
					</div>
				</div>

				<button className="w-10 h-10 rounded-full bg-pink-50 flex items-center justify-center relative">
					<Bell className="text-secondary-pink w-5 h-5" />
					<span className="absolute top-2 right-2 w-2 h-2 bg-secondary-pink rounded-full" />
				</button>
			</div>

			<div className="p-5 space-y-7">
				<motion.div
					initial={{ opacity: 0, y: 18 }}
					animate={{ opacity: 1, y: 0 }}
					className="bg-white rounded-[34px] p-5 shadow-sm border border-pink-50 relative overflow-hidden"
				>
					<div className="absolute -right-8 -top-8 w-28 h-28 bg-pink-100 rounded-full opacity-60" />
					<div className="absolute right-6 bottom-4 text-6xl opacity-90">
						🩺
					</div>

					<div className="relative flex items-center gap-4">
						<div className="w-16 h-16 rounded-3xl bg-pink-100 flex items-center justify-center shadow-inner">
							<BookOpen className="text-secondary-pink w-8 h-8" />
						</div>
						<div className="pr-12">
							<h1 className="text-3xl font-black text-gray-800 leading-tight">
								Edukasi Kesehatan
							</h1>
							<p className="text-gray-500 text-sm font-medium mt-1">
								Belajar kesehatan dengan cara yang menyenangkan!
							</p>
						</div>
					</div>
				</motion.div>

				<section>
					<div className="flex items-center gap-3 mb-4">
						<div className="w-10 h-10 rounded-2xl bg-pink-100 flex items-center justify-center">
							<BookOpen className="text-secondary-pink w-5 h-5" />
						</div>
						<h2 className="text-2xl font-black text-gray-800">
							Materi Edukasi
						</h2>
					</div>

					<div className="flex gap-4 overflow-x-auto pb-2 -mx-1 px-1">
						{materials.map((item, idx) => (
							<motion.div
								key={item.title}
								initial={{ opacity: 0, x: 20 }}
								animate={{ opacity: 1, x: 0 }}
								transition={{ delay: idx * 0.1 }}
								className={`${item.bg} ${item.border} min-w-[240px] rounded-[32px] p-5 border shadow-sm relative overflow-hidden`}
							>
								<div className="absolute -right-6 -bottom-6 text-8xl opacity-90">
									{item.emoji}
								</div>

								<Sparkles className="absolute top-5 right-5 w-5 h-5 text-secondary-pink opacity-60" />

								<div className="relative">
									<div className="w-12 h-12 rounded-2xl bg-white/80 flex items-center justify-center mb-5 shadow-sm">
										{item.icon}
									</div>

									<h3 className="text-2xl font-black text-gray-800 leading-tight mb-2">
										{item.title}
									</h3>

									<p className="text-sm text-gray-600 font-medium leading-relaxed mb-6 w-36">
										{item.desc}
									</p>

									<button className="bg-white text-secondary-pink px-4 py-2 rounded-full font-black text-sm shadow-sm flex items-center gap-2">
										Lihat Materi
										<ChevronRight className="w-4 h-4" />
									</button>
								</div>
							</motion.div>
						))}
					</div>
				</section>

				<section>
					<div className="flex justify-between items-center mb-4">
						<div className="flex items-center gap-3">
							<div className="w-10 h-10 rounded-2xl bg-pink-100 flex items-center justify-center">
								<Gamepad2 className="text-secondary-pink w-5 h-5" />
							</div>

							<h2 className="text-2xl font-black text-gray-800">
								Game Edukasi
							</h2>
						</div>

						<button className="text-secondary-pink font-black text-sm flex items-center gap-1">
							Lihat Semua
							<ChevronRight className="w-4 h-4" />
						</button>
					</div>

					<div className="space-y-4">
						{games.map((game, idx) => (
							<motion.div
								key={game.title}
								initial={{ opacity: 0, y: 20 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{ delay: idx * 0.12 }}
								className={`${game.bg} rounded-[34px] p-5 border border-white shadow-sm relative overflow-hidden min-h-[170px]`}
							>
								<div className="absolute -right-3 -bottom-5 text-8xl drop-shadow-sm">
									{game.emoji}
								</div>

								<div className="absolute right-20 top-5">
									<Brain className="w-9 h-9 text-secondary-pink opacity-20" />
								</div>

								<div className="relative w-7/12">
									<h3 className="text-2xl font-black text-gray-800 leading-tight mb-3">
										{game.title}
									</h3>

									<p className="text-sm text-gray-600 font-medium leading-relaxed mb-5">
										{game.desc}
									</p>

									<button
										onClick={() => navigate(game.path)}
										className={`${game.button} text-white px-5 py-3 rounded-full font-black text-sm shadow-lg flex items-center gap-2 active:scale-95 transition-transform`}
									>
										<Play className="w-4 h-4 fill-white" />
										Mainkan
									</button>
								</div>
							</motion.div>
						))}
					</div>
				</section>

				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 0.4 }}
					className="pink-gradient rounded-[34px] p-6 text-white shadow-xl shadow-primary-pink/20"
				>
					<div className="flex items-center gap-4">
						<div className="w-14 h-14 rounded-3xl bg-white/20 border border-white/20 flex items-center justify-center">
							<ShieldCheck className="w-7 h-7" />
						</div>

						<div>
							<p className="text-[10px] font-bold opacity-80 uppercase">
								Progress Belajar
							</p>
							<h3 className="text-2xl font-black">3 Materi selesai</h3>
							<p className="text-sm text-white/80 font-medium">
								Terus belajar untuk menjaga kesehatan.
							</p>
						</div>
					</div>
				</motion.div>
			</div>

			<BottomNav />
		</div>
	);
}