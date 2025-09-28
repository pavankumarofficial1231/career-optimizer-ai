import React, { useState } from 'react';
import Card from '../../components/Card';
import Button from '../../components/Button';
import Loader from '../../components/Loader';
import SwotMatrix from './SwotMatrix';
import { analyzeSwot } from '../../services/geminiService';
import type { SwotAnalysis, LoadingState } from '../../types';

const BrainIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.898 20.572L16.5 21.75l-.398-1.178a3.375 3.375 0 00-2.456-2.456L12.5 18l1.178-.398a3.375 3.375 0 002.456-2.456L16.5 14.25l.398 1.178a3.375 3.375 0 002.456 2.456L20.5 18l-1.178.398a3.375 3.375 0 00-2.456 2.456z" />
  </svg>
);

const InitialStateDisplay: React.FC = () => (
    <div className="text-center py-8 px-4 border-2 border-dashed border-slate-700 rounded-lg">
        <BrainIcon className="w-12 h-12 text-slate-600 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-slate-400">Discover Your Strategic Self</h3>
        <p className="text-slate-500">
            List your skills, goals, and traits. The AI will generate a complete SWOT analysis to reveal your professional landscape.
        </p>
    </div>
);

const RocketLaunchIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.59 14.37a6 6 0 01-5.84 7.38v-4.82m5.84-2.56a14.95 14.95 0 00-5.84-2.56m0 0a14.95 14.95 0 00-5.84 2.56m5.84-2.56V4.72a2.25 2.25 0 012.25-2.25h1.5a2.25 2.25 0 012.25 2.25v2.25m-7.5 0v-4.82a2.25 2.25 0 00-2.25-2.25h-1.5a2.25 2.25 0 00-2.25 2.25v2.25" />
    </svg>
);

const WrenchScrewdriverIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M11.42 15.17L17.25 21A2.652 2.652 0 0021 17.25l-5.877-5.877M11.42 15.17l2.472-2.472a3.75 3.75 0 00-5.303-5.303L6.25 9.75M11.42 15.17L6.25 9.75m5.17 5.42l.51-1.933a2.25 2.25 0 00-3.2-.518l-1.933.51" />
    </svg>
);

const LightBulbIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.53 16.122a3 3 0 00-5.78 1.128 2.25 2.25 0 01-2.4 2.245 4.5 4.5 0 008.4-2.245c0-.399-.078-.78-.22-1.128zm0 0a15.998 15.998 0 003.388-1.62m-5.043-.025a15.998 15.998 0 011.622-3.385m5.043.025a15.998 15.998 0 001.622-3.385m-5.043-.025a15.998 15.998 0 013.388-1.62m-7.964-.025a15.998 15.998 0 01-1.622-3.385m7.964.025a15.998 15.998 0 00-1.622-3.385M5.042 21.025a15.998 15.998 0 01-1.622-3.385m7.964.025a15.998 15.998 0 00-3.388-1.62" />
    </svg>
);

const ShieldExclamationIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
    </svg>
);

const ActionableRecommendations: React.FC<{ recommendations: SwotAnalysis['recommendations'] }> = ({ recommendations }) => {
    const recConfig = {
        strengths: { title: 'Leverage Strengths', color: 'border-green-400', textColor: 'text-green-400', Icon: RocketLaunchIcon },
        weaknesses: { title: 'Address Weaknesses', color: 'border-yellow-400', textColor: 'text-yellow-400', Icon: WrenchScrewdriverIcon },
        opportunities: { title: 'Seize Opportunities', color: 'border-blue-400', textColor: 'text-blue-400', Icon: LightBulbIcon },
        threats: { title: 'Mitigate Threats', color: 'border-red-400', textColor: 'text-red-400', Icon: ShieldExclamationIcon },
    };

    return (
        <div className="mt-8">
            <h3 className="text-2xl font-bold text-white mb-6">Actionable Recommendations</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {(Object.keys(recommendations) as Array<keyof typeof recommendations>).map((key) => {
                    const config = recConfig[key];
                    if (!recommendations[key]) return null;
                    return (
                        <div 
                            key={key} 
                            className={`bg-slate-900 p-5 rounded-lg border-2 ${config.color} shadow-lg shadow-slate-900/50 transition-all duration-300 hover:transform hover:-translate-y-1 hover:shadow-cyan-400/20`}
                        >
                            <div className="flex items-center gap-4 mb-3">
                                <config.Icon className={`w-8 h-8 flex-shrink-0 ${config.textColor}`} />
                                <h4 className={`text-xl font-bold ${config.textColor}`}>{config.title}</h4>
                            </div>
                            <p className="text-slate-300 md:pl-12">{recommendations[key]}</p>
                        </div>
                    );
                })}
            </div>
        </div>
    )
};

const SwotAnalyzer: React.FC = () => {
    const [userInfo, setUserInfo] = useState<string>('');
    const [swotResult, setSwotResult] = useState<SwotAnalysis | null>(null);
    const [loadingState, setLoadingState] = useState<LoadingState>('idle');
    const [error, setError] = useState<string | null>(null);

    const handleAnalyze = async () => {
        if (!userInfo.trim()) {
            setError('Please enter some information to generate a SWOT analysis.');
            return;
        }
        setLoadingState('loading');
        setError(null);
        setSwotResult(null);
        try {
            const result = await analyzeSwot(userInfo);
            setSwotResult(result);
            setLoadingState('success');
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An unknown error occurred.');
            setLoadingState('error');
        }
    };

    return (
        <Card className="flex flex-col gap-6">
            <h2 className="text-3xl font-extrabold text-cyan-400 tracking-tighter">Personal SWOT Analyzer</h2>
            <div className="flex flex-col gap-2">
                <label htmlFor="swot-input" className="text-slate-300 font-semibold">
                    Enter your skills, goals, and traits:
                </label>
                <textarea
                    id="swot-input"
                    value={userInfo}
                    onChange={(e) => setUserInfo(e.target.value)}
                    rows={6}
                    placeholder="e.g., Proficient in React & TypeScript, want to move into a leadership role, sometimes I procrastinate on documentation..."
                    className="w-full p-3 bg-slate-900 border-2 border-slate-600 focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-400/50 text-white transition-colors"
                />
            </div>
            <Button onClick={handleAnalyze} disabled={loadingState === 'loading'} Icon={BrainIcon}>
                {loadingState === 'loading' ? 'Generating...' : 'Generate SWOT'}
            </Button>

            {loadingState === 'idle' && <InitialStateDisplay />}

            {loadingState === 'loading' && <Loader />}
            
            {error && <p className="text-red-400 bg-red-500/10 p-3 border border-red-500">{error}</p>}
            
            {loadingState === 'success' && swotResult && (
                <div className="flex flex-col gap-6 animate-fade-in">
                    <SwotMatrix swotData={swotResult} />
                    <ActionableRecommendations recommendations={swotResult.recommendations} />
                </div>
            )}
        </Card>
    );
};

export default SwotAnalyzer;
