import React, { useState, useEffect } from 'react';
import { SwotCategory, type SwotAnalysis } from '../../types';

interface SwotMatrixProps {
  swotData: SwotAnalysis;
}

const quadrantConfig = {
    [SwotCategory.Strengths]: { title: 'Strengths', color: 'border-green-400', textColor: 'text-green-400' },
    [SwotCategory.Weaknesses]: { title: 'Weaknesses', color: 'border-yellow-400', textColor: 'text-yellow-400' },
    [SwotCategory.Opportunities]: { title: 'Opportunities', color: 'border-blue-400', textColor: 'text-blue-400' },
    [SwotCategory.Threats]: { title: 'Threats', color: 'border-red-400', textColor: 'text-red-400' },
};

const Quadrant: React.FC<{ category: SwotCategory; items: string[]; isVisible: boolean; delay: number }> = ({ category, items, isVisible, delay }) => {
    const config = quadrantConfig[category];
    
    return (
        <div className={`p-4 bg-slate-900/50 border-t-4 ${config.color} transition-all duration-500 ease-out transform ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`} style={{ transitionDelay: `${delay}ms` }}>
            <h4 className={`text-xl font-bold mb-3 ${config.textColor}`}>{config.title}</h4>
            <ul className="space-y-2">
                {items.length > 0 ? items.map((item, index) => (
                    <li key={index} className="text-slate-300 before:content-['▸'] before:mr-2 before:text-cyan-400">{item}</li>
                )) : <li className="text-slate-500 italic">No items identified.</li>}
            </ul>
        </div>
    );
};

const SwotMatrix: React.FC<SwotMatrixProps> = ({ swotData }) => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => setIsVisible(true), 100);
        return () => clearTimeout(timer);
    }, []);

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-slate-700 border-2 border-slate-700 shadow-[4px_4px_0px_#0ff]">
            <Quadrant category={SwotCategory.Strengths} items={swotData.strengths} isVisible={isVisible} delay={0} />
            <Quadrant category={SwotCategory.Weaknesses} items={swotData.weaknesses} isVisible={isVisible} delay={150} />
            <Quadrant category={SwotCategory.Opportunities} items={swotData.opportunities} isVisible={isVisible} delay={300} />
            <Quadrant category={SwotCategory.Threats} items={swotData.threats} isVisible={isVisible} delay={450} />
        </div>
    );
};

export default SwotMatrix;
