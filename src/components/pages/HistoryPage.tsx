import { Bell, ChevronRight, Filter } from 'lucide-react';
import BottomNav from '@/src/components/organisms/BottomNav';
import { motion } from 'motion/react';

export default function HistoryPage() {
  const records = [
    { 
      date: '12 Okt', 
      title: 'Pemeriksaan Rutin', 
      location: 'Posyandu Melati', 
      status: 'Normal',
      weight: '12.5',
      height: '85.0',
      active: true
    },
    { 
      date: '08 Sep', 
      title: 'Imunisasi Campak', 
      location: 'Puskesmas Kecamatan', 
      status: 'Normal',
      weight: '12.2',
      height: '83.5',
      active: false
    },
    { 
      date: '14 Agt', 
      title: 'Pemeriksaan Rutin', 
      location: 'Posyandu Melati', 
      status: 'Normal',
      weight: '11.8',
      height: '82.0',
      active: false
    }
  ];

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

      <div className="p-8">
        <div className="flex justify-between items-start mb-8">
           <div>
              <h1 className="text-4xl font-black text-gray-800 leading-tight italic">Riwayat</h1>
              <p className="text-gray-400 font-bold">Catatan pemeriksaan anak.</p>
           </div>
           <button className="bg-white border border-gray-100 rounded-2xl px-4 py-2 flex items-center gap-2 text-xs font-bold text-secondary-pink shadow-sm">
              Semua <Filter className="w-3 h-3" />
           </button>
        </div>

        <div className="space-y-6">
           {records.map((rec, i) => (
             <motion.div 
              key={i}
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: i * 0.1 }}
              className="bg-white rounded-[40px] p-8 shadow-sm border border-gray-100 flex flex-col gap-8"
             >
                <div className="flex justify-between items-center">
                   <div className="flex items-center gap-4">
                      <div className={`w-16 h-16 rounded-full flex flex-col items-center justify-center shadow-lg ${rec.active ? 'bg-secondary-pink text-white' : 'bg-gray-100 text-gray-400'}`}>
                         <span className="text-xl font-black italic">{rec.date.split(' ')[0]}</span>
                         <span className="text-[10px] font-bold uppercase">{rec.date.split(' ')[1]}</span>
                      </div>
                      <div>
                         <h3 className="text-xl font-bold text-gray-800 leading-none mb-1">{rec.title}</h3>
                         <p className="text-sm text-gray-400 font-medium">{rec.location}</p>
                      </div>
                   </div>
                   <div className="bg-secondary-pink text-white px-4 py-1 rounded-full text-[10px] font-bold uppercase">
                      {rec.status}
                   </div>
                </div>

                <div className="bg-gray-50 rounded-3xl p-6 flex justify-between items-center border border-gray-100">
                   <div className="text-center flex-1 border-r border-gray-200/50">
                      <div className="flex items-center justify-center gap-2 mb-1 grayscale opacity-50">
                        ⚖️ <span className="text-[8px] font-bold uppercase text-gray-400">Berat Badan</span>
                      </div>
                      <p className="text-2xl font-black text-gray-800 flex items-baseline justify-center gap-1">
                        {rec.weight} <span className="text-xs font-bold opacity-40">kg</span>
                      </p>
                   </div>
                   <div className="text-center flex-1">
                      <div className="flex items-center justify-center gap-2 mb-1 grayscale opacity-50">
                        📏 <span className="text-[8px] font-bold uppercase text-gray-400">Tinggi Badan</span>
                      </div>
                      <p className="text-2xl font-black text-gray-800 flex items-baseline justify-center gap-1">
                        {rec.height} <span className="text-xs font-bold opacity-40">cm</span>
                      </p>
                   </div>
                </div>

                <button className={`w-full py-4 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all ${rec.active ? 'bg-pink-50 text-secondary-pink' : 'bg-gray-50 text-gray-400'}`}>
                   Lihat Detail Pemeriksaan
                   <ChevronRight className="w-5 h-5" />
                </button>
             </motion.div>
           ))}
        </div>
      </div>
      <BottomNav />
    </div>
  );
}
