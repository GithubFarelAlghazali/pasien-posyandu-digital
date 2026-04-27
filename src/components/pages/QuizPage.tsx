import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '@/src/context/UserContext';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronRight, Check, X } from 'lucide-react';
import Button from '@/src/components/atoms/Button';

export default function QuizPage() {
  const navigate = useNavigate();
  const { addExp } = useUser();
  const [selected, setSelected] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);

  const options = [
    { id: 1, label: 'Nasi Goreng', icon: '🍳', correct: false },
    { id: 2, label: 'Sereal Manis', icon: '🥣', correct: false },
    { id: 3, label: 'Telur Rebus', icon: '🥚', correct: true },
    { id: 4, label: 'Keripik', icon: '🍟', correct: false },
  ];

  const handleSelect = (id: number) => {
    if (showResult) return;
    setSelected(id);
    setShowResult(true);
    if (options.find(o => o.id === id)?.correct) {
      addExp(20);
    }
  };

  return (
    <div className="flex flex-col min-h-screen p-8 bg-bg-pink">
      <div className="bg-white rounded-xl py-2 px-4 flex items-center self-start gap-2 mb-12 shadow-sm border border-primary-pink/10">
        <div className="w-6 h-6 bg-yellow-300 rounded-lg"></div>
        <span className="font-bold text-gray-700">Kuis Kesehatan</span>
      </div>

      <h1 className="text-4xl font-black text-gray-800 leading-snug mb-16 text-center">
        Makanan mana yang paling sehat untuk sarapan?
      </h1>

      <div className="grid grid-cols-2 gap-4">
        {options.map((opt) => (
          <motion.div
            key={opt.id}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleSelect(opt.id)}
            className={`bg-white rounded-3xl border-2 p-6 flex flex-col items-center justify-center gap-4 transition-all cursor-pointer h-48 relative ${
              selected === opt.id 
                ? (opt.correct ? 'border-green-400' : 'border-red-400') 
                : 'border-primary-pink opacity-80'
            }`}
          >
            <span className="text-6xl">{opt.icon}</span>
            <span className="font-bold text-gray-700">{opt.label}</span>
            
            <AnimatePresence>
              {selected === opt.id && (
                <motion.div 
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className={`absolute -bottom-4 bg-white rounded-full p-2 border-2 ${
                    opt.correct ? 'border-green-400 text-green-500' : 'border-red-400 text-red-500'
                  }`}
                >
                  {opt.correct ? <Check size={32} strokeWidth={4} /> : <X size={32} strokeWidth={4} />}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>

      {showResult && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mt-auto pt-8">
           <Button onClick={() => navigate('/profile')}>
            Selesai Kuis
            <ChevronRight className="w-6 h-6" />
          </Button>
        </motion.div>
      )}
    </div>
  );
}
