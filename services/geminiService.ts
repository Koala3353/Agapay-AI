import { GoogleGenAI, Type } from "@google/genai";
import { ClinicalAssessment, Vitals, RiskLevel } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const CDSS_SYSTEM_INSTRUCTION = `
You are an expert Medical Officer acting as a Clinical Decision Support System (CDSS) for Barangay Health Workers (BHWs) in the Philippines. 
BHWs are volunteers with limited training. Your goal is to:
1. Analyze symptoms and vitals.
2. Direct the BHW to perform specific, simple physical exam checks to rule out dangerous conditions (e.g., Appendicitis, Dengue, Pneumonia).
3. Triaging the patient into GREEN (Home Care), YELLOW (Teleconsult/Clinic), or RED (Emergency).
4. Provide immediate actionable advice based on DOH Clinical Practice Guidelines.

Always return the response in JSON format.
`;

export const assessPatientCondition = async (
  symptoms: string[],
  vitals: Vitals,
  age: number,
  gender: string
): Promise<ClinicalAssessment> => {
  
  const prompt = `
    Patient Profile:
    - Age: ${age}
    - Gender: ${gender}
    - Symptoms: ${symptoms.join(", ")}
    - Vitals: Temp ${vitals.temp}C, BP ${vitals.bpSystolic}/${vitals.bpDiastolic}, HR ${vitals.pulse}, SpO2 ${vitals.oxygen}%

    Provide a clinical assessment, risk classification, and specific physical exam prompts the BHW should check right now.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        systemInstruction: CDSS_SYSTEM_INSTRUCTION,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            riskLevel: { type: Type.STRING, enum: [RiskLevel.GREEN, RiskLevel.YELLOW, RiskLevel.RED] },
            provisionalClassification: { type: Type.STRING },
            reasoning: { type: Type.STRING },
            immediateActions: { 
              type: Type.ARRAY, 
              items: { type: Type.STRING } 
            },
            physicalExamPrompts: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING },
                  prompt: { type: Type.STRING, description: "Instructions for the BHW, e.g. 'Check capillary refill time'" },
                  expectedFinding: { type: Type.STRING, description: "What creates a positive finding, e.g. '> 2 seconds'" }
                },
                required: ["id", "prompt", "expectedFinding"]
              }
            },
            recommendedMedications: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            }
          },
          required: ["riskLevel", "provisionalClassification", "reasoning", "immediateActions", "physicalExamPrompts"]
        }
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");
    
    return JSON.parse(text) as ClinicalAssessment;

  } catch (error) {
    console.error("Gemini CDSS Error:", error);
    // Fallback safe mode
    return {
      riskLevel: RiskLevel.YELLOW,
      provisionalClassification: "Assessment Unavailable",
      reasoning: "AI Service Disconnected. Proceed with standard manual protocols.",
      immediateActions: ["Monitor vitals", "Consult supervisor manually"],
      physicalExamPrompts: [],
      recommendedMedications: []
    };
  }
};

export const chatWithAgapay = async (userMessage: string, history: {role: string, text: string}[]) => {
  const chatHistory = history.map(h => ({
    role: h.role,
    parts: [{ text: h.text }]
  }));

  try {
    const chat = ai.chats.create({
      model: "gemini-2.5-flash",
      history: chatHistory,
      config: {
        systemInstruction: `You are "Agapay", a friendly health assistant for Filipino citizens. 
        - Speak in "Taglish" (Tagalog-English mix) to be relatable and clear.
        - You are NOT a doctor. Do not diagnose.
        - If symptoms sound mild (Green risk), give home remedies (hydration, rest, herbal tea).
        - If symptoms sound serious (chest pain, difficulty breathing, high fever > 3 days), URGENTLY tell them to go to the Barangay Health Center or Hospital.
        - Keep answers short (under 50 words).`
      }
    });

    const result = await chat.sendMessage({ message: userMessage });
    return result.text;
  } catch (error) {
    console.error("Citizen Chat Error:", error);
    return "Pasensya na, hindi ako makakonekta sa server ngayon. Mangyaring pumunta sa Health Center kung masama ang pakiramdam.";
  }
};

export const generateLogisticsIntel = async (inventoryData: any, syndromicTrend: any) => {
  try {
    const prompt = `
      Analyze this Local Government Unit (LGU) health data:
      
      INVENTORY STATUS:
      ${JSON.stringify(inventoryData)}

      SYNDROMIC TRENDS (Last 5 days):
      ${JSON.stringify(syndromicTrend)}

      Task:
      1. Identify correlations between rising cases and stock levels.
      2. Predict immediate stockouts.
      3. Recommend specific logistics movements (e.g., "Transfer 500 units of Paracetamol from Barangay X to Barangay Y").
      4. Format the output as a clean Markdown Executive Summary.
    `;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        systemInstruction: "You are an expert Public Health Logistics Officer using predictive analytics to prevent shortages."
      }
    });

    return response.text;
  } catch (error) {
    console.error("Admin Analytics Error:", error);
    return "Unable to generate intelligence report at this time.";
  }
};