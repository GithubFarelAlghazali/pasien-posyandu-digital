import { ArrowLeft, CheckCircle2, RotateCcw } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { motion } from "motion/react";
import logoPosyandu from "@/src/assets/logo-posyandu.png";

export default function PuzzleGiziSeimbangPage() {
	const navigate = useNavigate();
	const [selected, setSelected] = useState<string[]>([]);

	const items = [
		{ name: "Nasi", icon: "🍚", type: "Karbohidrat" },
		{ name: "Telur", icon: "🥚", type: "Protein" },
		{ name: "Sayur", icon: "🥦", type: "Vitamin" },
		{ name: "Susu", icon: "🥛", type: "Kalsium" },
	];

	const isComplete = selected.length === items.length;

	const toggleItem = (name: string) => {
		setSelected((prev) => (prev.includes(name) ? prev.filter((item) => item !== name) : [...prev, name]));
	};

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

			<motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-green-50 rounded-[36px] p-7 border border-green-100 mb-6 relative overflow-hidden">
				<div className="absolute -right-8 -bottom-8 text-8xl">🧩</div>
				<h1 className="text-3xl font-black text-gray-800 leading-tight">Puzzle Gizi Seimbang</h1>
				<p className="text-gray-500 font-medium mt-2 w-8/12">Pilih semua komponen untuk membuat piring sehat.</p>
			</motion.div>

			<div className="bg-white rounded-[36px] p-6 border border-pink-50 shadow-sm mb-6">
				<p className="text-center text-gray-400 font-bold text-xs uppercase mb-4">Piring Sehat Kamu</p>
				<div className="grid grid-cols-2 gap-3">
					{items.map((item) => (
						<div key={item.name} className={`h-24 rounded-3xl flex items-center justify-center text-4xl border-2 ${selected.includes(item.name) ? "bg-green-50 border-green-300" : "bg-gray-50 border-dashed border-gray-200"}`}>
							{selected.includes(item.name) ? item.icon : "?"}
						</div>
					))}
				</div>
			</div>

			<div className="grid grid-cols-2 gap-4">
				{items.map((item, idx) => (
					<motion.button
						key={item.name}
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: idx * 0.08 }}
						onClick={() => toggleItem(item.name)}
						className={`rounded-[30px] p-5 border-2 shadow-sm text-left ${selected.includes(item.name) ? "bg-green-100 border-green-300" : "bg-white border-pink-50"}`}
					>
						<div className="text-5xl mb-3">{item.icon}</div>
						<p className="font-black text-gray-800">{item.name}</p>
						<p className="text-xs text-gray-400 font-bold">{item.type}</p>
					</motion.button>
				))}
			</div>

			<div className="mt-8 flex gap-3">
				<button onClick={() => setSelected([])} className="w-16 h-16 rounded-3xl bg-white border border-gray-100 flex items-center justify-center shadow-sm">
					<RotateCcw className="text-gray-500" />
				</button>
				<div className={`flex-1 h-16 rounded-3xl flex items-center justify-center gap-2 font-black text-white shadow-lg ${isComplete ? "bg-green-500" : "bg-gray-300"}`}>
					<CheckCircle2 />
					{isComplete ? "Piring Sehat Lengkap!" : "Lengkapi Puzzle"}
				</div>
			</div>
		</div>
	);
}
