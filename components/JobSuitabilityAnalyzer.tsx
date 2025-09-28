import React, { useState, useCallback } from 'react';
import Card from './shared/Card';
import Button from './shared/Button';
import Loader from './shared/Loader';
import ScoreGauge from './shared/ScoreGauge';
import { analyzeSuitability } from '../services/geminiService';
import { parseResumeFile } from '../services/fileParser';
import type { JobSuitabilityAnalysis, LoadingState } from '../types';

const DocumentMagnifyingGlassIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m.75 12l3 3m0 0l3-3m-3 3v-6m-1.5-9H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
    </svg>
);

const XCircleIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);


const JobSuitabilityAnalyzer: React.FC = () => {
    const [resumeFile, setResumeFile] = useState<File | null>(null);
    const [jobDescription, setJobDescription] = useState<string>('');
    const [analysisResult, setAnalysisResult] = useState<JobSuitabilityAnalysis | null>(null);
    const [loadingState, setLoadingState] = useState<LoadingState>('idle');
    const [error, setError] = useState<string | null>(null);
    const [isDragging, setIsDragging] = useState(false);

    const handleFileChange = (files: FileList | null) => {
        if (files && files.length > 0) {
            const file = files[0];
            const fileName = file.name.toLowerCase();
            if (file.type === 'application/pdf' || fileName.endsWith('.pdf') || file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' || fileName.endsWith('.docx')) {
                setResumeFile(file);
                setError(null);
            } else {
                setError('Unsupported file type. Please upload a PDF or DOCX file.');
                setResumeFile(null);
            }
        }
    };
    
    const handleDragEnter = useCallback((e: React.DragEvent<HTMLLabelElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(true);
    }, []);

    const handleDragLeave = useCallback((e: React.DragEvent<HTMLLabelElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
    }, []);

    const handleDragOver = useCallback((e: React.DragEvent<HTMLLabelElement>) => {
        e.preventDefault();
        e.stopPropagation();
    }, []);
    
    const handleDrop = useCallback((e: React.DragEvent<HTMLLabelElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            handleFileChange(e.dataTransfer.files);
            e.dataTransfer.clearData();
        }
    }, []);

    const handleAnalyze = async () => {
        if (!resumeFile || !jobDescription.trim()) {
            setError('Please upload your resume and paste the job description.');
            return;
        }
        setLoadingState('loading');
        setError(null);
        setAnalysisResult(null);
        try {
            const resumeText = await parseResumeFile(resumeFile);
            const result = await analyzeSuitability(resumeText, jobDescription);
            setAnalysisResult(result);
            setLoadingState('success');
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An unknown error occurred.');
            setLoadingState('error');
        }
    };

    const SkillTag: React.FC<{ skill: string, type: 'match' | 'missing' }> = ({ skill, type }) => {
        const baseClasses = "inline-block px-3 py-1 text-sm font-mono ring-1 rounded-md";
        const typeClasses = type === 'match'
            ? "bg-green-500/10 text-green-300 ring-green-400/30"
            : "bg-red-500/10 text-red-300 ring-red-400/30";
        return <span className={`${baseClasses} ${typeClasses}`}>{skill}</span>;
    }

    return (
        <Card className="flex flex-col gap-6">
            <h2 className="text-3xl font-extrabold text-cyan-400 tracking-tighter">Job Suitability Analyzer</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <div className="flex flex-col gap-2">
                    <label htmlFor="resume-input" className="text-slate-300 font-semibold">Upload your resume:</label>
                    
                    {!resumeFile ? (
                         <label
                            htmlFor="resume-file-input"
                            className={`flex flex-col items-center justify-center w-full h-full p-6 border-2 border-dashed rounded-lg cursor-pointer transition-colors ${isDragging ? 'border-cyan-400 bg-slate-700/50' : 'border-slate-600 hover:border-slate-500 bg-slate-900'}`}
                            onDragEnter={handleDragEnter}
                            onDragLeave={handleDragLeave}
                            onDragOver={handleDragOver}
                            onDrop={handleDrop}
                        >
                            <DocumentMagnifyingGlassIcon className="w-10 h-10 text-slate-500 mb-2" />
                            <p className="mb-2 text-sm text-slate-400">
                                <span className="font-semibold text-cyan-400">Click to upload</span> or drag and drop
                            </p>
                            <p className="text-xs text-slate-500">PDF or DOCX</p>
                            <input id="resume-file-input" type="file" className="hidden" accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document" onChange={(e) => handleFileChange(e.target.files)} />
                        </label>
                    ) : (
                        <div className="flex items-center justify-between w-full h-full p-4 bg-slate-700 border-2 border-slate-600 rounded-lg">
                            <p className="text-slate-200 font-mono truncate">{resumeFile.name}</p>
                            <button onClick={() => setResumeFile(null)} className="text-slate-400 hover:text-red-400 transition-colors flex-shrink-0 ml-2">
                                <XCircleIcon className="w-6 h-6" />
                            </button>
                        </div>
                    )}
                </div>
                 <div className="flex flex-col gap-2">
                    <label htmlFor="jd-input-suitability" className="text-slate-300 font-semibold">Paste the job description:</label>
                    <textarea
                        id="jd-input-suitability"
                        value={jobDescription}
                        onChange={(e) => setJobDescription(e.target.value)}
                        rows={10}
                        placeholder="Paste the job description here..."
                        className="w-full p-3 bg-slate-900 border-2 border-slate-600 focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-400/50 text-white transition-colors"
                    />
                </div>
            </div>

            <Button onClick={handleAnalyze} disabled={loadingState === 'loading' || !resumeFile} Icon={DocumentMagnifyingGlassIcon}>
                {loadingState === 'loading' ? 'Analyzing...' : 'Analyze Suitability'}
            </Button>
            
            {loadingState === 'loading' && <Loader />}
            
            {error && <p className="text-red-400 bg-red-500/10 p-3 border border-red-500">{error}</p>}

            {loadingState === 'success' && analysisResult && (
                 <div className="flex flex-col gap-6 animate-fade-in border-t-2 border-slate-600 pt-6">
                    <div className="flex flex-col md:flex-row items-center gap-6">
                        <div className="flex-shrink-0">
                           <ScoreGauge score={analysisResult.suitabilityScore} />
                        </div>
                        <div className="flex-1">
                            <h3 className="text-2xl font-bold text-white mb-2">Analysis Summary</h3>
                            <p className="text-slate-300 bg-slate-900/50 p-4 border-l-4 border-cyan-400">{analysisResult.summary}</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <h4 className="text-xl font-bold text-green-400 mb-3">Matching Skills</h4>
                            <div className="flex flex-wrap gap-2">
                                {analysisResult.matchingSkills.length > 0 ? (
                                    analysisResult.matchingSkills.map((skill, i) => <SkillTag key={i} skill={skill} type="match" />)
                                ) : <p className="text-slate-400">No direct skill matches found.</p>}
                            </div>
                        </div>
                        <div>
                            <h4 className="text-xl font-bold text-red-400 mb-3">Missing Skills</h4>
                             <div className="flex flex-wrap gap-2">
                                {analysisResult.missingSkills.length > 0 ? (
                                    analysisResult.missingSkills.map((skill, i) => <SkillTag key={i} skill={skill} type="missing" />)
                                ) : <p className="text-slate-400">No critical missing skills identified.</p>}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </Card>
    );
};

export default JobSuitabilityAnalyzer;