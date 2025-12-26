
import { GoogleGenAI, Type } from "@google/genai";
import { HealthMetrics, RiskAssessmentResult, DietDay, SymptomAnalysis, MedicalHistory, EducationalSource } from "../types.ts";

// Initialize client securely using the environment variable directly as per guidelines.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const analyzeRisk = async (metrics: HealthMetrics, history?: MedicalHistory): Promise<RiskAssessmentResult> => {
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
    Analyze the following health metrics for a pregnant woman to detect antenatal complications:
    - Systolic BP: ${metrics.systolicBP} mmHg
    - Diastolic BP: ${metrics.diastolicBP} mmHg
    - Fasting Blood Sugar: ${metrics.bloodSugar} mg/dL
    - Hemoglobin: ${metrics.hemoglobin} g/dL
    - Weight: ${metrics.weight} kg
    - Age: ${metrics.age}
    - Pregnancy Week: ${metrics.weekOfPregnancy}
    
    ${historyContext}

    Perform a detailed multi-class classification.
    1. Classify Risk Level: "Low Risk" (Healthy), "Moderate Risk" (Borderline), "High Risk" (Requires attention), "Critical" (Emergency).
    2. Calculate a Risk Score from 0 (Perfect health) to 100 (Severe danger).
    3. Identify Potential Conditions (e.g., Preeclampsia, Gestational Diabetes, Anemia, Hypertension) based on standard medical thresholds and the provided history.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            riskLevel: { type: Type.STRING, enum: ["Low Risk", "Moderate Risk", "High Risk", "Critical"] },
            riskScore: { type: Type.NUMBER, description: "Risk score from 0-100" },
            potentialConditions: { 
                type: Type.ARRAY, 
                items: { type: Type.STRING },
                description: "List of specific conditions detected (e.g., Anemia, GDM)"
            },
            reasoning: { type: Type.STRING },
            recommendations: { 
              type: Type.ARRAY, 
              items: { type: Type.STRING } 
            }
          },
          required: ["riskLevel", "riskScore", "potentialConditions", "reasoning", "recommendations"]
        }
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");
    
    return JSON.parse(text) as RiskAssessmentResult;
  } catch (error) {
    console.error("Error analyzing risk:", error);
    return {
      riskLevel: "High Risk",
      riskScore: 85,
      potentialConditions: ["Unknown Error"],
      reasoning: "Unable to connect to AI analysis service. Defaulting to caution due to potential API error.",
      recommendations: ["Consult a doctor immediately", "Check internet connection", "Monitor BP manually"]
    };
  }
};

export const analyzeSymptoms = async (symptoms: string): Promise<SymptomAnalysis> => {
    const prompt = `
      A pregnant woman is describing the following symptoms: "${symptoms}".
      
      Analyze the severity and urgency.
      1. Severity: 
         - "Self-Care" (Minor issues like mild nausea)
         - "Consult Doctor" (Non-emergency but needs attention, like fever or persistent headache)
         - "Immediate Emergency" (Critical signs like bleeding, severe pain, reduced fetal movement)
      2. List possible medical causes.
      3. Provide a clear, short action plan.
    `;
  
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
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
  
      const text = response.text;
      if (!text) throw new Error("No response from AI");
      return JSON.parse(text) as SymptomAnalysis;
    } catch (error) {
      console.error("Error analyzing symptoms:", error);
      return {
          severity: "Consult Doctor",
          possibleCauses: ["Unknown"],
          actionRequired: "Please consult a healthcare provider directly as the AI service is currently unavailable."
      };
    }
};

export const generateDietPlan = async (metrics: HealthMetrics, foodPreference: string): Promise<DietDay[]> => {
  const prompt = `
    Create a 7-day weekly diet plan for a pregnant woman (Week ${metrics.weekOfPregnancy}) with:
    - Blood Sugar: ${metrics.bloodSugar} (Consider gestational diabetes if > 95 fasting)
    - Hemoglobin: ${metrics.hemoglobin}
    - Preference: ${foodPreference}
    
    Focus on locally available nutritious foods in rural India.
    Return the output as a structured JSON array representing the weekly schedule.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              day: { type: Type.STRING, description: "Day of the week (e.g., Monday)" },
              breakfast: { type: Type.STRING },
              lunch: { type: Type.STRING },
              snack: { type: Type.STRING },
              dinner: { type: Type.STRING },
              calories: { type: Type.STRING, description: "Approximate calories for the day" }
            },
            required: ["day", "breakfast", "lunch", "snack", "dinner", "calories"]
          }
        }
      }
    });
    
    const text = response.text;
    if (!text) return [];
    return JSON.parse(text) as DietDay[];
  } catch (error) {
    console.error("Error generating diet:", error);
    return [];
  }
};

export const getChatResponse = async (history: {role: string, parts: {text: string}[]}[], message: string): Promise<string> => {
    try {
      const chat = ai.chats.create({
        model: 'gemini-2.5-flash',
        history: history,
        config: {
            systemInstruction: "You are 'GN7 Assistant', a helpful and empathetic AI medical assistant for pregnant women in rural India. Keep answers simple, encouraging, and focused on maternal health. Always advise consulting a doctor for serious symptoms."
        }
      });
  
      const result = await chat.sendMessage({ message });
      return result.text || "I didn't understand that.";
    } catch (error) {
      console.error("Chat error:", error);
      return "I'm having trouble connecting right now. Please check your internet.";
    }
  };

export const transcribeAudio = async (audioBase64: string): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: {
        parts: [
          { inlineData: { mimeType: "audio/webm", data: audioBase64 } },
          { text: "Transcribe the spoken audio to text. Return only the transcription text, no other commentary." }
        ]
      }
    });
    return response.text || "";
  } catch (error) {
    console.error("Transcription error:", error);
    return "";
  }
};

export const extractMetricsFromAudio = async (audioBase64: string): Promise<{ metrics: Partial<HealthMetrics>, history: Partial<MedicalHistory> }> => {
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: {
                parts: [
                    { inlineData: { mimeType: "audio/webm", data: audioBase64 } },
                    { text: "Listen to the medical dictation. Extract numeric health metrics (systolicBP, diastolicBP, bloodSugar, hemoglobin, weight, age, weekOfPregnancy) AND medical history text (conditions, surgeries, allergies). Return a JSON object containing 'metrics' and 'history'." }
                ]
            },
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        metrics: {
                            type: Type.OBJECT,
                            properties: {
                                systolicBP: { type: Type.NUMBER },
                                diastolicBP: { type: Type.NUMBER },
                                bloodSugar: { type: Type.NUMBER },
                                hemoglobin: { type: Type.NUMBER },
                                weight: { type: Type.NUMBER },
                                age: { type: Type.NUMBER },
                                weekOfPregnancy: { type: Type.NUMBER }
                            }
                        },
                        history: {
                            type: Type.OBJECT,
                            properties: {
                                conditions: { type: Type.STRING },
                                surgeries: { type: Type.STRING },
                                allergies: { type: Type.STRING }
                            }
                        }
                    }
                }
            }
        });
        
        const text = response.text;
        if (!text) return { metrics: {}, history: {} };
        return JSON.parse(text);
    } catch (error) {
        console.error("Extraction error:", error);
        return { metrics: {}, history: {} };
    }
}

export const getEducationalContent = async (query: string): Promise<{ text: string, sources: EducationalSource[] }> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Provide detailed maternal health advice and tips for: "${query}". Focus on reputable medical guidelines and clear, actionable steps for a pregnant woman. Ensure the tone is supportive and professional.`,
      config: {
        tools: [{ googleSearch: {} }],
      },
    });

    const text = response.text || "No information found.";
    const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
    const sources: EducationalSource[] = chunks
      .filter((chunk: any) => chunk.web)
      .map((chunk: any) => ({
        uri: chunk.web.uri,
        title: chunk.web.title || "Reference Article",
      }));

    return { text, sources };
  } catch (error) {
    console.error("Error fetching educational content:", error);
    return { 
      text: "Unable to fetch content. Please try a different topic or check your connection.", 
      sources: [] 
    };
  }
};
