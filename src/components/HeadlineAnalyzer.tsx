import React, { useState } from 'react';
import Card from './shared/Card';
import Button from './shared/Button';
import Loader from './shared/Loader';
import { analyzeHeadline } from '../services/geminiService';
import type { HeadlineAnalysis, LoadingState } from '../types';

const SparklesIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.898 20.572L16.5 21.75l-.398-1.178a3.375 3.375 0 00-2.456-2.456L12.5 18l1.178-.398a3.375 3.375 0 002.456-2.456L16.5 14.25l.398 1.178a3.375 3.375 0 002.456 2.456L20.5 18l-1.178.398a3.375 3.375 0 00-2.456 2.456z" />
    </svg>
);

const QualityBadge: React.FC<{ quality: HeadlineAnalysis['quality'] }> = ({ quality }) => {
    const qualityStyles = {
        Strong: 'bg-green-500/20 text-green-400 border-green-500',
        Medium: 'bg-yellow-500/20 text-yellow-400 border-yellow-500',
        Weak: 'bg-red-500/20 text-red-400 border-red-500',
    };
    return (
        <span className={`px-3 py-1 text-sm font-bold uppercase tracking-wider border ${qualityStyles[quality]}`}>
            {quality}
        </span>
    );
};

const HighlightedSuggestion: React.FC<{ text: string; keywords: string[] }> = ({ text, keywords }) => {
    if (!keywords || keywords.length === 0) {
        return <>{text}</>;
    }

    // Sort keywords by length descending to correctly handle cases where one keyword is a substring of another (e.g., "Engineer" vs "Software Engineer").
    const sortedKeywords = [...keywords].sort((a, b) => b.length - a.length);
    // Escape any special regex characters from the keywords.
    const escapedKeywords = sortedKeywords.map(kw => kw.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));

    if (escapedKeywords.length === 0) {
        return <>{text}</>;
    }

    const regex = new RegExp(`(${escapedKeywords.join('|')})`, 'gi');
    const parts = text.split(regex);

    return (
        <>
            {parts.map((part, index) =>
                // The regex is case-insensitive ('gi'), so we perform a case-insensitive check to see if the part is one of the keywords to be highlighted.
                sortedKeywords.some(keyword => keyword.toLowerCase() === part.toLowerCase()) ? (
                    <strong key={index} className="not-italic font-bold text-slate-900 bg-cyan-400 px-1.5 py-0.5 rounded-md mx-0.5">
                        {part}
                    </strong>
                ) : (
                    <span key={index}>{part}</span>
                )
            )}
        </>
    );
};


const HeadlineAnalyzer: React.FC = () => {
    const [headline, setHeadline] = useState<string>('');
    const [jobDescription, setJobDescription] = useState<string>('');
    const [analysisResult, setAnalysisResult] = useState<HeadlineAnalysis | null>(null);
    const [loadingState, setLoadingState] = useState<LoadingState>('idle');
    const [error, setError] = useState<string | null>(null);

    const handleAnalyze = async () => {
        if (!headline.trim()) {
            setError('Please enter a headline to analyze.');
            return;
        }
        setLoadingState('loading');
        setError(null);
        setAnalysisResult(null);
        try {
            const result = await analyzeHeadline(headline, jobDescription);
            setAnalysisResult(result);
            setLoadingState('success');
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An unknown error occurred.');
            setLoadingState('error');
        }
    };

    return (
        <Card className="flex flex-col gap-6">
            <h2 className="text-3xl font-extrabold text-cyan-400 tracking-tighter">LinkedIn Headline Optimizer</h2>
            <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-2">
                    <label htmlFor="headline-input" className="text-slate-300 font-semibold">Enter your current headline:</label>
                    <input
                        id="headline-input"
                        type="text"
                        value={headline}
                        onChange={(e) => setHeadline(e.target.value)}
                        placeholder="e.g., Software Engineer at Tech Corp"
                        className="w-full p-3 bg-slate-900 border-2 border-slate-600 focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-400/50 text-white transition-colors"
                    />
                </div>
                 <div className="flex flex-col gap-2">
                    <label htmlFor="jd-input" className="text-slate-300 font-semibold">
                        Paste Job Description (Optional)
                        <span className="text-slate-400 font-normal"> - for tailored suggestions</span>
                    </label>
                    <textarea
                        id="jd-input"
                        value={jobDescription}
                        onChange={(e) => setJobDescription(e.target.value)}
                        rows={6}
                        placeholder="Paste the job description here to get headline suggestions tailored for the role..."
                        className="w-full p-3 bg-slate-900 border-2 border-slate-600 focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-400/50 text-white transition-colors"
                    />
                </div>
            </div>
            <Button onClick={handleAnalyze} disabled={loadingState === 'loading'} Icon={SparklesIcon}>
                {loadingState === 'loading' ? 'Analyzing...' : 'Analyze Headline'}
            </Button>
            
            {loadingState === 'loading' && <Loader />}
            
            {error && <p className="text-red-400 bg-red-500/10 p-3 border border-red-500">{error}</p>}
            
            {loadingState === 'success' && analysisResult && (
                <div className="flex flex-col gap-6 animate-fade-in">
                    <div className="border-t-2 border-slate-600 pt-6">
                        <h3 className="text-2xl font-bold text-white mb-3">Analysis Result</h3>
                        <div className="flex items-center gap-4 mb-4">
                            <span className="font-semibold text-slate-300">Overall Quality:</span>
                            <QualityBadge quality={analysisResult.quality} />
                        </div>
                        <p className="text-slate-300 bg-slate-900/50 p-4 border-l-4 border-cyan-400">{analysisResult.analysis}</p>
                    </div>

                    <div>
                        <h3 className="text-2xl font-bold text-white mb-3">Suggested Headlines</h3>
                         {analysisResult.missingSkills && analysisResult.missingSkills.length > 0 && (
                            <div className="mb-4 p-4 bg-slate-700/50 border border-slate-600 rounded-lg">
                                <p className="font-semibold text-slate-300 flex flex-wrap items-center gap-2">
                                    <span className="font-bold text-cyan-300">Keywords to add:</span>
                                    {analysisResult.missingSkills.map((skill, i) => (
                                       <span key={i} className="inline-block bg-slate-800 text-cyan-300 px-2 py-1 text-sm font-mono ring-1 ring-cyan-400/20 rounded-md">{skill}</span>
                                    ))}
                                </p>
                            </div>
                        )}
                        <ul className="flex flex-col gap-3">
                            {analysisResult.suggestions.map((suggestion, index) => (
                                <li key={index} className="p-4 bg-slate-700 border-2 border-transparent hover:border-cyan-400 transition-colors group">
                                    <p className="text-slate-200 group-hover:text-white">
                                        <HighlightedSuggestion text={suggestion} keywords={analysisResult.missingSkills || []} />
                                    </p>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            )}
        </Card>
    );
};

export default HeadlineAnalyzer;