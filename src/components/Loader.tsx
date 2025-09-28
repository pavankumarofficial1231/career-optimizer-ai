import React from 'react';

const Loader: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center gap-4 my-8">
        <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-cyan-400"></div>
        <p className="text-cyan-400 font-semibold tracking-wider">ANALYZING...</p>
    </div>
  );
};

export default Loader;
