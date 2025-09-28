import React from 'react';
import HeadlineAnalyzer from './components/HeadlineAnalyzer';
import SwotAnalyzer from './components/SwotAnalyzer';
import JobSuitabilityAnalyzer from './components/JobSuitabilityAnalyzer';

const App: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 font-sans p-4 md:p-8">
      <style>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.5s ease-out forwards;
        }
      `}</style>
      <header className="text-center mb-12">
        <h1 className="text-5xl md:text-6xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-lime-400">
          Career Optimizer AI
        </h1>
        <p className="text-slate-400 mt-2 max-w-2xl mx-auto">
          Harness the power of AI to refine your professional brand and uncover your unique career landscape.
        </p>
      </header>
      <main className="max-w-7xl mx-auto flex flex-col gap-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <HeadlineAnalyzer />
            <SwotAnalyzer />
        </div>
        <JobSuitabilityAnalyzer />
      </main>
      <footer className="text-center mt-12 text-slate-500 text-sm">
        <p>Powered by AI. Designed for career growth.</p>
      </footer>
    </div>
  );
};

export default App;
