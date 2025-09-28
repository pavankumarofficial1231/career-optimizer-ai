export interface HeadlineAnalysis {
  quality: 'Strong' | 'Medium' | 'Weak';
  analysis: string;
  suggestions: string[];
  missingSkills?: string[];
}

export enum SwotCategory {
  Strengths = 'strengths',
  Weaknesses = 'weaknesses',
  Opportunities = 'opportunities',
  Threats = 'threats'
}

export type SwotData = {
  [K in SwotCategory]: string[];
};

export interface SwotAnalysis extends SwotData {
  recommendations: {
    [K in SwotCategory]: string;
  };
}

export type LoadingState = 'idle' | 'loading' | 'success' | 'error';

export interface JobSuitabilityAnalysis {
  suitabilityScore: number;
  summary: string;
  matchingSkills: string[];
  missingSkills: string[];
}
