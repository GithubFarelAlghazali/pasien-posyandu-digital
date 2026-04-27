import { ArrowLeft, User, Send } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { motion } from 'motion/react';
import Button from '@/src/components/atoms/Button';

export default function FeedbackPage() {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState('Pelayanan');
  const [rating, setRating] = useState(0);

  const categories = ['Pelayanan', 'Fasilitas', 'Aplikasi', 'Lainnya'];

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="bg-white px-6 py-4 flex items-center gap-4">
        <button onClick={() => navigate(-1)} className="p-2 -ml-2">
          <ArrowLeft className="text-gray-800" />
        </button>
        <h1 className="text-xl font-bold text-gray-800 text-center flex-1">Keluhan & Feedback</h1>
        <div className="w-10 h-10 bg-pink-100 rounded-full flex items-center justify-center">
            <User className="text-secondary-pink" />
        </div>
      </div>

      <div className="p-8 space-y-8">
        <div className="text-center space-y-2">
          <h2 className="text-3xl font-black text-gray-800 italic">Bagaimana pelayanan kami hari ini?</h2>
          <p className="text-gray-400 font-medium text-xs px-8">Masukan Anda sangat berarti bagi kami untuk terus meningkatkan kualitas pelayanan Posyandu Kita.</p>
        </div>

        {/* Category Wrap */}
        <div className="bg-white rounded-[32px] p-8 shadow-sm border border-gray-100">
           <p className="text-xs font-bold text-gray-800 mb-6 uppercase tracking-wider">Kategori Feedback</p>
           <div className="grid grid-cols-2 gap-3 pb-4">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`py-4 px-2 rounded-xl text-sm font-bold transition-all border-2 ${
                    selectedCategory === cat 
                      ? 'bg-pink-100 border-secondary-pink text-gray-800 shadow-inner' 
                      : 'bg-gray-50 border-gray-100 text-gray-400'
                  }`}
                >
                  {cat}
                </button>
              ))}
           </div>
        </div>

        {/* Rating Card */}
        <div className="bg-white rounded-[32px] p-8 shadow-sm border border-gray-100 flex flex-col items-center">
           <p className="text-xs font-bold text-gray-800 mb-6 uppercase tracking-wider">Penilaian Anda</p>
           <div className="flex gap-4">
              {[1,2,3,4,5].map(i => (
                <button key={i} onClick={() => setRating(i)}>
                  <span className={`text-4xl transition-all ${i <= rating ? 'grayscale-0 scale-125' : 'grayscale'}`}>⭐</span>
                </button>
              ))}
           </div>
        </div>

        {/* Comment Box */}
        <div className="bg-white rounded-[32px] p-8 shadow-sm border border-gray-100">
           <p className="text-xs font-bold text-gray-800 mb-6 uppercase tracking-wider">Masukan atau Keluhan</p>
           <textarea 
            placeholder="Ceritakan pengalaman Anda di sini..."
            className="w-full h-40 bg-gray-50 rounded-2xl p-6 text-gray-600 outline-none border-2 border-transparent focus:border-pink-100 transition-all resize-none font-sans"
           />
        </div>

        <Button className="h-16 flex items-center justify-center gap-4">
           Kirim Feedback
           <Send className="w-5 h-5 -rotate-45" />
        </Button>
      </div>
    </div>
  );
}
