import { useNavigate, useLocation } from 'react-router-dom';
import { Home, BookOpen, LayoutList, User, Calendar } from 'lucide-react';
import { cn } from '@/src/lib/utils';

export default function BottomNav() {
  const navigate = useNavigate();
  const location = useLocation();

  const tabs = [
    { icon: <Home />, label: 'Beranda', path: '/' },
    { icon: <LayoutList />, label: 'Riwayat', path: '/history' },
    { icon: <Calendar />, label: 'Jadwal', path: '/schedule' },
    { icon: <BookOpen />, label: 'Edukasi', path: '/education' },
    { icon: <User />, label: 'Kids Mode', path: '/onboarding' }
  ];

  return (
    <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[440px] bg-white border-t border-gray-100 px-6 py-4 flex justify-between items-center z-50 rounded-t-3xl shadow-[0_-10px_30px_rgba(0,0,0,0.05)]">
      {tabs.map((tab) => {
        const isActive = location.pathname === tab.path;
        return (
          <button
            key={tab.path}
            onClick={() => navigate(tab.path)}
            className="flex flex-col items-center gap-1 group"
          >
            <div className={cn(
              "p-2 rounded-xl transition-all duration-300",
              isActive ? "text-primary-pink bg-bg-pink" : "text-gray-400 group-hover:text-primary-pink/60"
            )}>
              {tab.icon}
            </div>
            <span className={cn(
              "text-[10px] font-bold transition-all",
              isActive ? "text-primary-pink scale-110" : "text-gray-400"
            )}>
              {tab.label}
            </span>
            {isActive && (
               <div className="w-6 h-1 bg-primary-pink rounded-full mt-1" />
            )}
          </button>
        );
      })}
    </div>
  );
}
