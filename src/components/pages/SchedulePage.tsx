import { Calendar as CalendarIcon, Bell, Ticket } from 'lucide-react';
import BottomNav from '@/src/components/organisms/BottomNav';
import { motion } from 'motion/react';

export default function SchedulePage() {
  return (
    <div className="bg-gray-50 min-h-screen pb-24">
      {/* Header */}
      <div className="bg-white p-6 flex justify-between items-center border-b border-gray-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center p-1.5 overflow-hidden">
             <div className="w-full h-full bg-white rounded-sm"></div>
          </div>
          <span className="text-secondary-pink font-bold text-xl">Posyandu Kita</span>
        </div>
        <Bell className="text-pink-300" />
      </div>

      <div className="p-6">
        <h1 className="text-2xl font-black text-gray-800 mb-1">Antrean & Jadwal</h1>
        <p className="text-gray-400 font-medium mb-8">Pantau antrean dan jadwal Posyandu Anda.</p>

        {/* Queue Card */}
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="bg-white rounded-3xl p-6 shadow-sm border-2 border-pink-50 relative mb-8"
        >
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="text-secondary-pink font-bold text-sm uppercase">Posyandu Mawar 1</h3>
              <p className="text-gray-500 font-medium text-xs">Sesi Imunisasi & Timbang</p>
            </div>
            <div className="bg-pink-100 text-secondary-pink px-3 py-1 rounded-full text-[10px] font-bold flex items-center gap-1">
               <div className="w-1.5 h-1.5 bg-secondary-pink rounded-full"></div>
               Sedang Berjalan
            </div>
          </div>

          <div className="flex justify-between mb-8">
            <div className="text-center flex-1 border-r border-gray-100">
               <p className="text-[10px] text-gray-400 font-bold uppercase mb-1">Antrean Saat Ini</p>
               <p className="text-4xl font-black text-gray-800 italic">014</p>
            </div>
            <div className="text-center flex-1">
               <p className="text-[10px] text-gray-400 font-bold uppercase mb-1">Sisa Antrean</p>
               <p className="text-4xl font-black text-primary-pink italic">8</p>
            </div>
          </div>

          <button className="w-full pink-gradient text-white py-4 rounded-3xl font-bold flex items-center justify-center gap-2 shadow-lg active:scale-95 transition-transform">
             <Ticket className="w-5 h-5 -rotate-45" />
             Ambil Antrean
          </button>
        </motion.div>

        {/* Monthly Schedule */}
        <div className="flex justify-between items-center mb-6">
           <h3 className="text-xl font-bold text-gray-800">Jadwal Bulan Ini</h3>
           <div className="bg-white border border-gray-200 rounded-full px-4 py-2 flex items-center gap-2 text-sm font-bold text-gray-600">
              Oktober 2023
           </div>
        </div>

        {/* Dummy Calendar Grid UI */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 mb-8">
           <div className="grid grid-cols-7 gap-y-4 text-center">
              {['Min','Sen','Sel','Rab','Kam','Jum','Sab'].map(d=><span key={d} className="text-[10px] font-bold text-gray-400 uppercase">{d}</span>)}
              {[...Array(31)].map((_, i) => {
                const day = i + 1;
                const isToday = day === 18;
                const isSelected = day === 10;
                return (
                  <div key={i} className="flex flex-col items-center">
                    <div className={`w-10 h-10 flex items-center justify-center rounded-full font-bold transition-all ${
                      isSelected ? 'bg-secondary-pink text-white shadow-lg' : 
                      isToday ? 'border-2 border-secondary-pink text-secondary-pink' : 'text-gray-700'
                    }`}>
                      {day}
                    </div>
                    {(day === 9 || day === 15) && <div className="w-1 h-1 bg-secondary-pink rounded-full mt-1"></div>}
                  </div>
                );
              })}
           </div>
        </div>
      </div>
      <BottomNav />
    </div>
  );
}
