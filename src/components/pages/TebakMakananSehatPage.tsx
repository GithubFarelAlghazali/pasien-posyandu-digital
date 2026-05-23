import { ArrowLeft, Check, HeartPulse, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import logoPosyandu from "@/src/assets/logo-posyandu.png";

export default function TebakMakananSehatPage() {
	const navigate = useNavigate();
	const [selected, setSelected] = useState<number | null>(null);

	const foods = [
		{ id: 1, name: "Apel", icon: "🍎", healthy: true },
		{ id: 2, name: "Sayur", icon: "🥦", healthy: true },
		{ id: 3, name: "Soda", icon: "🥤", healthy: false },
		{ id: 4, name: "Permen", icon: "🍬", healthy: false },
	];

	const chosen = foods.find((food) => food.id === selected);

	return (
		<div className="bg-gray-50 min-h-screen p-5">
			<div className="flex items-center justify-between mb-8">
				<button onClick={() => navigate(-1)} className="w-11 h-11 rounded-2xl bg-pink-50 flex items-center justify-center">
					<ArrowLeft className="text-secondary-pink" />
				</button>
				<div className="flex items-center gap-2">
					<img src={logoPosyandu} alt="Logo CAKET" className="w-9 h-9 object-contain" />
					<div>
						<p className="text-secondary-pink font-black text-sm">Pasien - CAKET</p>
						<p className="text-[10px] text-gray-400 font-bold">Catatan Kesehatan</p>
					</div>
				</div>
				<div className="w-11" />
			</div>

			<motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="pink-gradient rounded-[36px] p-7 text-white mb-6 shadow-xl shadow-primary-pink/20">
				<div className="w-16 h-16 bg-white/20 rounded-3xl flex items-center justify-center mb-4">
					<HeartPulse className="w-8 h-8" />
				</div>
				<h1 className="text-3xl font-black leading-tight">Tebak Makanan Sehat</h1>
				<p className="text-white/80 font-medium mt-2">Pilih makanan yang baik untuk tubuhmu.</p>
			</motion.div>

			<div className="grid grid-cols-2 gap-4">
				{foods.map((food, idx) => (
					<motion.button
						key={food.id}
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: idx * 0.08 }}
						onClick={() => setSelected(food.id)}
						className={`bg-white rounded-[32px] p-5 h-44 border-2 shadow-sm flex flex-col items-center justify-center gap-3 relative ${
							selected === food.id ? (food.healthy ? "border-green-400" : "border-red-400") : "border-pink-50"
						}`}
					>
						<span className="text-6xl">{food.icon}</span>
						<span className="font-black text-gray-800 text-lg">{food.name}</span>

						<AnimatePresence>
							{selected === food.id && (
								<motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className={`absolute -bottom-4 bg-white rounded-full p-2 border-2 ${food.healthy ? "border-green-400 text-green-500" : "border-red-400 text-red-500"}`}>
									{food.healthy ? <Check size={28} strokeWidth={4} /> : <X size={28} strokeWidth={4} />}
								</motion.div>
							)}
						</AnimatePresence>
					</motion.button>
				))}
			</div>

			{chosen && (
				<motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className={`mt-8 rounded-[32px] p-6 text-center ${chosen.healthy ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"}`}>
					<p className="font-black text-xl">{chosen.healthy ? "Benar! 🎉" : "Kurang tepat 😅"}</p>
					<p className="font-medium text-sm mt-1">{chosen.healthy ? `${chosen.name} termasuk makanan sehat.` : `${chosen.name} sebaiknya tidak terlalu sering dikonsumsi.`}</p>
				</motion.div>
			)}
		</div>
	);
}
