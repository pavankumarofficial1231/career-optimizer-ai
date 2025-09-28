import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  Icon?: React.ElementType;
}

const Button: React.FC<ButtonProps> = ({ children, Icon, ...props }) => {
  return (
    <button
      className="group relative inline-flex items-center justify-center w-full px-6 py-3 text-lg font-bold text-white uppercase bg-slate-700 border-2 border-cyan-400 transition-all duration-200 ease-in-out hover:bg-cyan-400 hover:text-slate-900 active:translate-x-1 active:translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed"
      {...props}
    >
        <span className="absolute bottom-0 left-0 w-0 h-0 transition-all duration-200 border-b-2 border-white group-hover:w-full ease"></span>
        <span className="absolute top-0 left-0 w-full h-0 transition-all duration-300 delay-200 -translate-y-full bg-cyan-400 group-hover:translate-y-0 ease"></span>
        <span className="relative flex items-center gap-2 transition-colors group-hover:text-slate-900">
            {Icon && <Icon className="w-5 h-5" />}
            {children}
        </span>
    </button>
  );
};

export default Button;