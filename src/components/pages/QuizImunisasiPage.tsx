import { ArrowLeft, Check, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import logoPosyandu from "@/src/assets/logo-posyandu.png";

export default function QuizImunisasiPage() {
	const navigate = useNavigate();
	const [selected, setSelected] = useState<number | null>(null);

	const question = {
		text: "Apa manfaat utama imunisasi untuk anak?",
		options: [
			{ id: 1, text: "Membuat anak kebal dari semua penyakit", correct: false },
			{ id: 2, text: "Membantu melindungi tubuh dari penyakit tertentu", correct: true },
			{ id: 3, text: "Menggantikan makanan sehat", correct: false },
			{ id: 4, text: "Membuat anak tidak perlu periksa kesehatan", correct: false },
		],
	};

	const selectedOption = question.options.find((item) => item.id === selected);

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

			<motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-blue-50 rounded-[36px] p-7 border border-blue-100 mb-6 relative overflow-hidden">
				<div className="absolute -right-8 -bottom-8 text-8xl">💉</div>
				<p className="text-blue-500 font-black text-xs uppercase mb-2">Quiz Imunisasi</p>
				<h1 className="text-3xl font-black text-gray-800 leading-tight w-9/12">{question.text}</h1>
			</motion.div>

			<div className="space-y-4">
				{question.options.map((option, idx) => (
					<motion.button
						key={option.id}
						initial={{ opacity: 0, x: -20 }}
						animate={{ opacity: 1, x: 0 }}
						transition={{ delay: idx * 0.08 }}
						onClick={() => setSelected(option.id)}
						className={`w-full bg-white rounded-[28px] p-5 border-2 shadow-sm flex items-center gap-4 text-left ${
							selected === option.id ? (option.correct ? "border-green-400" : "border-red-400") : "border-pink-50"
						}`}
					>
						<div className="w-10 h-10 rounded-2xl bg-pink-50 text-secondary-pink font-black flex items-center justify-center">{idx + 1}</div>
						<p className="flex-1 font-bold text-gray-800">{option.text}</p>

						<AnimatePresence>
							{selected === option.id && (
								<motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className={option.correct ? "text-green-500" : "text-red-500"}>
									{option.correct ? <Check strokeWidth={4} /> : <X strokeWidth={4} />}
								</motion.div>
							)}
						</AnimatePresence>
					</motion.button>
				))}
			</div>

			{selectedOption && (
				<motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className={`mt-8 rounded-[32px] p-6 ${selectedOption.correct ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"}`}>
					<p className="font-black text-xl">{selectedOption.correct ? "Jawaban Benar! 🎉" : "Belum Tepat 😅"}</p>
					<p className="font-medium text-sm mt-1">Imunisasi membantu tubuh membentuk perlindungan terhadap penyakit tertentu.</p>
				</motion.div>
			)}
		</div>
	);
}
