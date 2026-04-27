import { useUser } from '@/src/context/UserContext';
import { motion } from 'motion/react';
import { Zap, BookOpen, Trophy } from 'lucide-react';
import BottomNav from '@/src/components/organisms/BottomNav';

export default function ProfilePage() {
  const { profile } = useUser();

  return (
    <div className="p-6 bg-gray-50 min-h-screen pb-24">
      {/* Profile Header Card */}
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="pink-gradient rounded-[40px] p-8 text-white relative mb-8 shadow-2xl overflow-hidden"
      >
        <div className="flex items-center gap-6 mb-8">
          <div className="w-24 h-24 bg-white rounded-3xl flex items-center justify-center text-6xl shadow-inner border-2 border-white/20">
            {profile.character === 'boy' ? '👦' : '👧'}
          </div>
          <div>
            <h2 className="text-3xl font-black italic">{profile.name}</h2>
            <div className="flex items-center gap-2 text-white/90">
              <div className="w-2 h-2 bg-white rounded-full"></div>
              <span className="font-bold">Petualang Muda</span>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between font-bold text-sm">
            <span>LEVEL {profile.level}</span>
            <span>{profile.exp}/100 EXP</span>
          </div>
          <div className="w-full h-8 bg-black/10 rounded-full p-1 border border-white/20">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${profile.exp}%` }}
              className="h-full bg-white rounded-full shadow-sm"
            />
          </div>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-3 gap-3 mb-8">
        {[
          { icon: <Zap className="text-yellow-400 fill-yellow-400" />, value: profile.energy, label: 'ENERGI' },
          { icon: <BookOpen className="text-blue-500 fill-blue-500" />, value: `${profile.completedStories}/10`, label: 'Cerita Selesai' },
          { icon: <Trophy className="text-yellow-600 fill-yellow-600" />, value: profile.achievements.length, label: 'Pencapaian' }
        ].map((item, idx) => (
          <motion.div 
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="bg-white border-2 border-primary-pink/20 rounded-3xl p-4 flex flex-col items-center justify-center gap-2 shadow-sm"
          >
            {item.icon}
            <span className="text-xl font-bold text-gray-800">{item.value}</span>
            <span className="text-[10px] font-bold text-gray-400 uppercase text-center leading-tight">{item.label}</span>
          </motion.div>
        ))}
      </div>

      {/* Achievements List */}
      <div className="space-y-4">
        <h3 className="text-xl font-bold text-gray-800 mb-4 px-2">Pencapaian</h3>
        {profile.achievements.map((ach, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="bg-white border-2 border-primary-pink/20 rounded-2xl p-6 font-bold text-gray-700 text-center shadow-sm"
          >
            {ach}
          </motion.div>
        ))}
      </div>

      <BottomNav />
    </div>
  );
}
