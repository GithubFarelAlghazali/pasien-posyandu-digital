import { motion } from 'motion/react';
import { ReactNode } from 'react';

interface LayoutProps {
  children: ReactNode;
  showNav?: boolean;
}

export default function MobileLayout({ children, showNav }: LayoutProps) {
  return (
    <div className="flex justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-[440px] bg-white relative flex flex-col shadow-2xl overflow-hidden min-h-screen">
        <motion.main 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="flex-1 overflow-y-auto no-scrollbar pb-24"
        >
          {children}
        </motion.main>
      </div>
    </div>
  );
}
