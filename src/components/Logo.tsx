import React from 'react';

interface LogoProps {
  className?: string;
  showSlogan?: boolean;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export default function Logo({ className = '', showSlogan = true, size = 'md' }: LogoProps) {
  // Define custom styles and sizing parameters based on size prop
  const sizes = {
    sm: {
      name: 'text-sm md:text-base',
      slogan: 'text-[9px] md:text-[10px]',
      spacing: 'space-x-2 md:space-x-3',
      height: 'h-3.5 md:h-4',
    },
    md: {
      name: 'text-lg sm:text-2xl',
      slogan: 'text-[11px] sm:text-xs',
      spacing: 'space-x-3 sm:space-x-4',
      height: 'h-5 sm:h-6',
    },
    lg: {
      name: 'text-2xl sm:text-4xl',
      slogan: 'text-xs sm:text-base',
      spacing: 'space-x-4 sm:space-x-6',
      height: 'h-6 sm:h-8',
    },
    xl: {
      name: 'text-3xl sm:text-5xl',
      slogan: 'text-sm sm:text-xl',
      spacing: 'space-x-5 sm:space-x-8',
      height: 'h-8 sm:h-10',
    }
  };

  const style = sizes[size];

  return (
    <div 
      className={`inline-flex items-center ${style.spacing} ${className}`} 
      id="lee-brand-logo-text"
    >
      {/* Brand Name */}
      <span className={`${style.name} font-black uppercase tracking-wider text-white select-none`}>
        LEE <span className="text-cyan-400">INTEGRATIONS</span>
      </span>
      
      {/* Vertical divider */}
      {showSlogan && (
        <div className={`w-[1.5px] bg-slate-700 ${style.height}`} />
      )}

      {/* Slogan */}
      {showSlogan && (
        <span className={`${style.slogan} font-semibold uppercase tracking-[0.25em] text-slate-400 font-mono select-none`}>
          INNOVATE SMARTER
        </span>
      )}
    </div>
  );
}
