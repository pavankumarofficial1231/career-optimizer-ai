import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

const Card: React.FC<CardProps> = ({ children, className = '' }) => {
  return (
    <div className={`bg-slate-800 border-2 border-slate-500 p-6 shadow-[8px_8px_0px_rgba(0,0,0,0.5)] transition-shadow hover:shadow-[10px_10px_0px_#0ff] ${className}`}>
      {children}
    </div>
  );
};

export default Card;