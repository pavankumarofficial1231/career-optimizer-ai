import { GoogleGenAI, Type } from "@google/genai";
import type { HeadlineAnalysis, SwotAnalysis, JobSuitabilityAnalysis } from '../types';

// The API key MUST be provided via the `process.env.API_KEY` environment variable.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export async function analyzeHeadline(headline: string, jobDescription?: string): Promise<HeadlineAnalysis> {
    try {
        let prompt = `Analyze the following LinkedIn headline: "${headline}". Evaluate its clarity, conciseness, professional tone, and use of relevant keywords. Provide an overall quality assessment ('Strong', 'Medium', 'Weak'), a brief summary of your analysis, and suggest 3 improved versions.`;

        if (jobDescription && jobDescription.trim() !== '') {
            prompt = `Analyze the following LinkedIn headline: "${headline}". Evaluate its clarity, conciseness, professional tone, and use of relevant keywords, specifically in the context of this job description: "${jobDescription}". Provide an overall quality assessment ('Strong', 'Medium', 'Weak'), a brief analysis of how well the headline aligns with the job description, identify 2-3 critical keywords or skills from the job description that are missing from the current headline, and suggest 3 improved versions that are highly tailored to the provided job description and incorporate some of the missing skills.`;
        }
        
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        quality: { 
                            type: Type.STRING, 
                            enum: ["Strong", "Medium", "Weak"],
                            description: "The overall quality of the headline."
                        },
                        analysis: { 
                            type: Type.STRING, 
                            description: "A summary of the headline's strengths and weaknesses, considering the job description if provided." 
                        },
                        missingSkills: {
                            type: Type.ARRAY,
                            items: { type: Type.STRING },
                            description: "A list of 2-3 critical keywords or skills from the job description that are missing from the headline. This should be an empty array if no job description is provided or no critical skills are missing."
                        },
                        suggestions: {
                            type: Type.ARRAY,
                            items: { type: Type.STRING },
                            description: "3 improved headline suggestions, tailored to the job description if provided."
                        }
                    },
                    required: ["quality", "analysis", "missingSkills", "suggestions"]
                },
            },
        });
        
        const jsonText = response.text.trim();
        const parsedResponse = JSON.parse(jsonText);
        return parsedResponse as HeadlineAnalysis;

    } catch (error) {
        console.error("Error analyzing headline:", error);
        throw new Error("Failed to analyze headline. Please try again.");
    }
}


export async function analyzeSwot(userInfo: string): Promise<SwotAnalysis> {
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: `Based on the following user-provided skills, goals, and personal traits, generate a personal SWOT analysis. Categorize each point into Strengths, Weaknesses, Opportunities, or Threats. For each of the four SWOT categories, also provide one actionable recommendation. User input: "${userInfo}"`,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        strengths: {
                            type: Type.ARRAY,
                            items: { type: Type.STRING },
                            description: "List of personal strengths derived from the user input."
                        },
                        weaknesses: {
                            type: Type.ARRAY,
                            items: { type: Type.STRING },
                            description: "List of personal weaknesses derived from the user input."
                        },
                        opportunities: {
                            type: Type.ARRAY,
                            items: { type: Type.STRING },
                            description: "List of potential opportunities based on the user input and market trends."
                        },
                        threats: {
                            type: Type.ARRAY,
                            items: { type: Type.STRING },
                            description: "List of potential threats or challenges based on the user input."
                        },
                        recommendations: {
                            type: Type.OBJECT,
                            properties: {
                                strengths: { type: Type.STRING, description: "Actionable advice on how to leverage strengths." },
                                weaknesses: { type: Type.STRING, description: "Actionable advice on how to mitigate weaknesses." },
                                opportunities: { type: Type.STRING, description: "Actionable advice on how to seize opportunities." },
                                threats: { type: Type.STRING, description: "Actionable advice on how to navigate threats." }
                            },
                            required: ["strengths", "weaknesses", "opportunities", "threats"]
                        }
                    },
                    required: ["strengths", "weaknesses", "opportunities", "threats", "recommendations"]
                },
            },
        });

        const jsonText = response.text.trim();
        const parsedResponse = JSON.parse(jsonText);
        return parsedResponse as SwotAnalysis;
    } catch (error) {
        console.error("Error analyzing SWOT:", error);
        throw new Error("Failed to generate SWOT analysis. Please try again.");
    }
}

export async function analyzeSuitability(resumeText: string, jobDescription: string): Promise<JobSuitabilityAnalysis> {
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: `Analyze the provided resume text against the job description.
            - Resume: "${resumeText}"
            - Job Description: "${jobDescription}"
            
            Determine a job suitability score from 0 to 100 representing how well the resume matches the job requirements. Provide a brief summary of the candidate's fit for the role. Identify a list of key skills from the job description that are present in the resume, and a separate list of key skills from the job description that are missing from the resume.`,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        suitabilityScore: {
                            type: Type.INTEGER,
                            description: "A score from 0 to 100 indicating the match between the resume and job description."
                        },
                        summary: {
                            type: Type.STRING,
                            description: "A brief text summary explaining the score and the candidate's overall fit."
                        },
                        matchingSkills: {
                            type: Type.ARRAY,
                            items: { type: Type.STRING },
                            description: "A list of key skills found in both the resume and the job description."
                        },
                        missingSkills: {
                            type: Type.ARRAY,
                            items: { type: Type.STRING },
                            description: "A list of key skills required by the job description but not found in the resume."
                        }
                    },
                    required: ["suitabilityScore", "summary", "matchingSkills", "missingSkills"]
                },
            },
        });

        const jsonText = response.text.trim();
        const parsedResponse = JSON.parse(jsonText);
        return parsedResponse as JobSuitabilityAnalysis;
    } catch (error) {
        console.error("Error analyzing job suitability:", error);
        throw new Error("Failed to analyze job suitability. Please try again.");
    }
}
