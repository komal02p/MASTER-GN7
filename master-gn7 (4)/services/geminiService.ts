
import { GoogleGenAI, Type } from "@google/genai";
import { HealthMetrics, RiskAssessmentResult, DietDay, SymptomAnalysis, MedicalHistory, EducationalSource, Language } from "../types.ts";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateAppLogo = async (): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: [{
        parts: [{ text: "A professional, minimalist circular logo for a maternal health AI application called MASTER GN7. The logo should feature a stylised, elegant silhouette of a mother embracing a child. Primary color: Teal (#14b8a6). Clean lines, medical aesthetic, modern, trustworthy, high contrast, minimalist flat design, isolated on a white background. Do not include any emojis or text characters." }]
      }],
      config: {
        imageConfig: {
          aspectRatio: "1:1",
        }
      }
    });
    
    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        return `data:image/png;base64,${part.inlineData.data}`;
      }
    }
    return "https://img.icons8.com/ios-filled/100/14b8a6/mother-and-child.png";
  } catch (error) {
    console.error("Error generating app logo:", error);
    return "https://img.icons8.com/ios-filled/100/14b8a6/mother-and-child.png";
  }
};

export const generateMealImage = async (prompt: string): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: prompt,
      config: {
        imageConfig: {
          aspectRatio: "1:1",
        }
      }
    });
    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        return `data:image/png;base64,${part.inlineData.data}`;
      }
    }
    return "";
  } catch (error) {
    console.error("Error generating meal image:", error);
    return "";
  }
};

export const transcribeAudio = async (audioBase64: string): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: 'audio/webm',
              data: audioBase64,
            },
          },
          { text: "Transcribe this audio recording precisely. Only return the transcribed text, no other commentary." }
        ],
      },
    });
    return response.text || "";
  } catch (error) {
    console.error("Error transcribing audio:", error);
    return "";
  }
};

export const generateHealthBriefing = async (metrics: HealthMetrics, lang: Language = 'English'): Promise<{ title: string, message: string }> => {
  try {
    const prompt = `Based on these pregnancy metrics: BP ${metrics.systolicBP}/${metrics.diastolicBP}, Sugar ${metrics.bloodSugar}, Hemoglobin ${metrics.hemoglobin}, Week ${metrics.weekOfPregnancy}. 
    Generate a very short, encouraging clinical daily briefing (max 15 words) in ${lang}. DO NOT use emojis.`;
    
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            message: { type: Type.STRING }
          },
          required: ["title", "message"]
        }
      }
    });
    return JSON.parse(response.text!) as { title: string, message: string };
  } catch (error) {
    return { title: "Daily Health Check", message: "Stay hydrated and monitor your vitals today." };
  }
};

export const analyzeRisk = async (metrics: HealthMetrics, history?: MedicalHistory, lang: Language = 'English'): Promise<RiskAssessmentResult> => {
  let historyContext = "";
  if (history) {
    historyContext = `
    Patient Medical History:
    - Pre-existing Conditions: ${history.conditions || "None reported"}
    - Previous Surgeries: ${history.surgeries || "None reported"}
    - Allergies: ${history.allergies || "None reported"}
    `;
  }

  const prompt = `
    Act as a world-class maternal health diagnostic AI. Your goal is 98% accuracy in clinical risk assessment.
    Analyze the following health metrics for a pregnant woman:
    - Systolic BP: ${metrics.systolicBP} mmHg
    - Diastolic BP: ${metrics.diastolicBP} mmHg
    - Fasting Blood Sugar: ${metrics.bloodSugar} mg/dL
    - Hemoglobin: ${metrics.hemoglobin} g/dL
    - Weight: ${metrics.weight} kg
    - Age: ${metrics.age}
    - Pregnancy Week: ${metrics.weekOfPregnancy}
    - HIV Status: ${metrics.hivStatus}
    - Blood Group Rh Factor: ${metrics.rhFactor}
    
    ${historyContext}

    IMPORTANT: Provide the "reasoning" and "recommendations" in ${lang}.
    DO NOT use any emojis.
    
    Perform a high-fidelity diagnostic classification.
    1. Classify Risk Level: "Low Risk", "Moderate Risk", "High Risk", "Critical".
    2. Calculate a precise Risk Score from 0 to 100 based on standard WHO maternal health protocols.
    3. Identify specific potential conditions (e.g. Pre-eclampsia, Gestational Diabetes, Anemia).
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            riskLevel: { type: Type.STRING, enum: ["Low Risk", "Moderate Risk", "High Risk", "Critical"] },
            riskScore: { type: Type.NUMBER },
            potentialConditions: { type: Type.ARRAY, items: { type: Type.STRING } },
            reasoning: { type: Type.STRING },
            recommendations: { type: Type.ARRAY, items: { type: Type.STRING } }
          },
          required: ["riskLevel", "riskScore", "potentialConditions", "reasoning", "recommendations"]
        }
      }
    });

    return JSON.parse(response.text!) as RiskAssessmentResult;
  } catch (error) {
    console.error("Error analyzing risk:", error);
    return {
      riskLevel: "High Risk",
      riskScore: 85,
      potentialConditions: ["Clinical Timeout"],
      reasoning: "AI processing encountered a latency error. Given maternal health critical nature, we assume elevated risk. Please consult a clinician.",
      recommendations: ["Seek immediate medical attention"]
    };
  }
};

export const analyzeSymptoms = async (symptoms: string, lang: Language = 'English'): Promise<SymptomAnalysis> => {
    const prompt = `
      Analyze symptoms: "${symptoms}" with 98% clinical accuracy target.
      Provide response in ${lang}. DO NOT use emojis.
      1. Severity: "Self-Care", "Consult Doctor", "Immediate Emergency"
      2. Possible medical causes based on pregnancy physiology.
      3. Short clinical action plan.
    `;
  
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              severity: { type: Type.STRING, enum: ["Self-Care", "Consult Doctor", "Immediate Emergency"] },
              possibleCauses: { type: Type.ARRAY, items: { type: Type.STRING } },
              actionRequired: { type: Type.STRING }
            },
            required: ["severity", "possibleCauses", "actionRequired"]
          }
        }
      });
      return JSON.parse(response.text!) as SymptomAnalysis;
    } catch (error) {
      console.error("Error analyzing symptoms:", error);
      return { severity: "Consult Doctor", possibleCauses: [], actionRequired: "Connection Error." };
    }
};

export const generateDietPlan = async (metrics: HealthMetrics, foodPreference: string, lang: Language = 'English'): Promise<DietDay[]> => {
  const prompt = `
    Create a highly personalized 7-day weekly diet plan for a pregnant woman (Week ${metrics.weekOfPregnancy}) in ${lang}.
    Preference: ${foodPreference}.
    Health Status:
    - Hemoglobin: ${metrics.hemoglobin} g/dL (Target: 11+)
    - Blood Pressure: ${metrics.systolicBP}/${metrics.diastolicBP} mmHg
    - Blood Sugar: ${metrics.bloodSugar} mg/dL
    
    Clinical Protocol:
    1. High Iron for low Hemoglobin.
    2. DASH diet principles for high BP.
    3. Low Glycemic Index for high sugar.
    
    Return JSON array of 7 days. DO NOT use emojis.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              day: { type: Type.STRING },
              breakfast: { type: Type.STRING },
              lunch: { type: Type.STRING },
              snack: { type: Type.STRING },
              dinner: { type: Type.STRING },
              calories: { type: Type.STRING }
            },
            required: ["day", "breakfast", "lunch", "snack", "dinner", "calories"]
          }
        }
      }
    });
    return JSON.parse(response.text!) as DietDay[];
  } catch (error) {
    console.error("Error generating diet:", error);
    return [];
  }
};

export const getChatResponse = async (history: {role: string, parts: {text: string}[]}[], message: string, lang: Language = 'English'): Promise<string> => {
    try {
      const chat = ai.chats.create({
        model: 'gemini-3-flash-preview',
        history: history,
        config: {
            systemInstruction: `You are Janaki, a world-class maternal health AI assistant. Your goal is 98% accuracy in providing medical guidance. Respond in ${lang}. DO NOT USE EMOJIS. Maintain a professional yet empathetic clinical tone.`
        }
      });
      const result = await chat.sendMessage({ message });
      return result.text || "Connection Error.";
    } catch (error) {
      return "Unable to connect to the medical knowledge base.";
    }
  };

export const getEducationalContent = async (query: string, lang: Language = 'English'): Promise<{ text: string, sources: EducationalSource[] }> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Search maternal health advice in ${lang} for: "${query}". Do not use emojis. Providing accurate, evidence-based data.`,
      config: { tools: [{ googleSearch: {} }] },
    });
    const sources: EducationalSource[] = (response.candidates?.[0]?.groundingMetadata?.groundingChunks || [])
      .filter((chunk: any) => chunk.web)
      .map((chunk: any) => ({ uri: chunk.web.uri, title: chunk.web.title || "Clinical Reference" }));
    return { text: response.text || "Information unavailable.", sources };
  } catch (error) {
    return { text: "Knowledge retrieval error.", sources: [] };
  }
};
