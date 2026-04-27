import { ReactNode } from 'react';
import { cn } from '@/src/lib/utils'; // I'll create this helper next

interface ButtonProps {
  children: ReactNode;
  onClick?: () => void;
  className?: string;
  variant?: 'primary' | 'outline' | 'ghost';
  disabled?: boolean;
}

export default function Button({ children, onClick, className, variant = 'primary', disabled }: ButtonProps) {
  const variants = {
    primary: "pink-gradient text-white shadow-button transform active:scale-95",
    outline: "bg-white border-2 border-primary-pink text-primary-pink active:bg-bg-pink",
    ghost: "text-gray-500 hover:text-primary-pink"
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "w-full py-4 rounded-full font-bold text-lg transition-all duration-200 disabled:opacity-50 flex items-center justify-center gap-2",
        variants[variant],
        className
      )}
    >
      {children}
    </button>
  );
}
