import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '@/src/context/UserContext';
import { motion, AnimatePresence } from 'motion/react';
import { Zap, Menu } from 'lucide-react';
import Button from '@/src/components/atoms/Button';

export default function StoryPage() {
  const navigate = useNavigate();
  const { profile, updateEnergy } = useUser();
  const [step, setStep] = useState(0);

  const dialogs = [
    {
      speaker: 'child',
      text: 'Bunda, kenapa hari ini rame banget ya di balai desa?',
    },
    {
      speaker: 'mother',
      text: `Eh, ${profile.name}, hari ini ada pemeriksaan kesehatan rutin. Kamu kelihatan agak pucat deh... ikut ke Posyandu yuk?`,
    }
  ];

  const handleChoice = (isCorrect: boolean) => {
    if (!isCorrect) updateEnergy(-5);
    setStep(prev => prev + 1);
  };

  return (
    <div className="flex flex-col h-screen">
      {/* Header */}
      <div className="flex justify-between items-center px-6 py-4">
        <div className="bg-bg-pink border-2 border-primary-pink rounded-full px-4 py-2 flex items-center gap-2">
          <Zap className="text-yellow-400 fill-yellow-400 w-5 h-5 shadow-sm" />
          <span className="text-secondary-pink font-bold">Energy : {profile.energy}</span>
        </div>
        <button className="text-secondary-pink font-bold text-lg">Menu</button>
      </div>

      <div className="flex-1 px-4 py-8 space-y-6 flex flex-col justify-center">
        {/* Dialogue View */}
        <AnimatePresence mode="popLayout">
          {dialogs.slice(0, step + 1).map((d, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: d.speaker === 'child' ? 20 : -20 }}
              animate={{ opacity: 1, x: 0 }}
              className={`flex items-start gap-4 ${d.speaker === 'child' ? 'flex-row-reverse' : 'flex-row'}`}
            >
              <div className="w-16 h-16 rounded-full bg-bg-pink border-2 border-primary-pink flex items-center justify-center text-4xl shrink-0">
                {d.speaker === 'child' ? (profile.character === 'boy' ? '👦' : '👧') : '👩'}
              </div>
              <div className={d.speaker === 'child' ? 'bubble-right' : 'bubble-left'}>
                <p className="font-bold text-gray-800 leading-tight">{d.text}</p>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Action / Choices */}
        {step === 1 && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col gap-4 mt-8"
          >
            <p className="text-center font-bold text-gray-500 uppercase tracking-widest text-sm mb-2">Pilih Jawabanmu</p>
            <button 
              onClick={() => handleChoice(true)}
              className="bg-green-100 border-2 border-green-300 rounded-2xl py-6 px-4 text-green-800 font-bold text-xl hover:bg-green-200 transition-colors"
            >
              Oke, aku ikut bunda
            </button>
            <button 
              onClick={() => handleChoice(false)}
              className="relative bg-red-100 border-2 border-red-300 rounded-2xl py-6 px-4 text-red-800 font-bold text-xl transition-all"
            >
              Ah nanti saja, aku capek bun
              <span className="absolute bottom-2 right-4 text-[10px] text-red-500 font-medium">
                -5 energy jika salah
              </span>
            </button>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-6"
          >
            <motion.div className="flex items-start gap-4 flex-row-reverse">
              <div className="w-16 h-16 rounded-full bg-bg-pink border-2 border-primary-pink flex items-center justify-center text-4xl">
                 {profile.character === 'boy' ? '👦' : '👧'}
              </div>
              <div className="bubble-right">
                <p className="font-bold text-gray-800 leading-tight">
                  Ternyata Posyandu seru juga ya! Bagus buat jaga kesehatan.
                </p>
              </div>
            </motion.div>

            <Button onClick={() => navigate('/quiz')} className="text-white text-2xl h-20">
              Lanjut ke Kuis!
            </Button>
          </motion.div>
        )}
      </div>
    </div>
  );
}
