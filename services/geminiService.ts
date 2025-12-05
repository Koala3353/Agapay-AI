import { ClinicalAssessment, Vitals, RiskLevel } from "../types";

const API_KEY = process.env.API_KEY;
const API_URL = "https://api.openai.com/v1/chat/completions";

// Helper function to call OpenAI API
async function callOpenAI(messages: any[], jsonMode: boolean = false, systemInstruction?: string) {
  if (!API_KEY) {
    console.error("API Key is missing. Please set process.env.API_KEY");
    throw new Error("API Key is missing");
  }

  const finalMessages = [];
  
  if (systemInstruction) {
    finalMessages.push({ role: "system", content: systemInstruction });
  }
  
  finalMessages.push(...messages);

  const body: any = {
    model: "gpt-4o", // Using gpt-4o for best performance and JSON handling
    messages: finalMessages,
    temperature: 0.7,
  };

  if (jsonMode) {
    body.response_format = { type: "json_object" };
  }

  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${API_KEY}`
      },
      body: JSON.stringify(body)
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`OpenAI API Error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    return data.choices[0].message.content;
  } catch (error) {
    console.error("OpenAI Request Failed:", error);
    throw error;
  }
}

const CDSS_SYSTEM_INSTRUCTION = `
You are an expert Medical Officer acting as a Clinical Decision Support System (CDSS) for Barangay Health Workers (BHWs) in the Philippines. 
BHWs are volunteers with limited training. Your goal is to:
1. Analyze symptoms and vitals.
2. Direct the BHW to perform specific, simple physical exam checks to rule out dangerous conditions (e.g., Appendicitis, Dengue, Pneumonia).
3. Triaging the patient into GREEN (Home Care), YELLOW (Teleconsult/Clinic), or RED (Emergency Referral).
4. Provide immediate actionable advice based on DOH Clinical Practice Guidelines.

IMPORTANT: You must return the response in strict JSON format matching this schema:
{
  "riskLevel": "GREEN" | "YELLOW" | "RED",
  "provisionalClassification": "string",
  "reasoning": "string",
  "immediateActions": ["string", "string"],
  "physicalExamPrompts": [
    {
      "id": "string",
      "prompt": "Instructions for the BHW, e.g. 'Check capillary refill time'",
      "expectedFinding": "What creates a positive finding, e.g. '> 2 seconds'"
    }
  ],
  "recommendedMedications": ["string"]
}
`;

export const assessPatientCondition = async (
  symptoms: string[],
  vitals: Vitals,
  age: number,
  gender: string
): Promise<ClinicalAssessment> => {
  
  const userPrompt = `
    Patient Profile:
    - Age: ${age}
    - Gender: ${gender}
    - Symptoms: ${symptoms.join(", ")}
    - Vitals: Temp ${vitals.temp}C, BP ${vitals.bpSystolic}/${vitals.bpDiastolic}, HR ${vitals.pulse}, SpO2 ${vitals.oxygen}%

    Provide a clinical assessment, risk classification, and specific physical exam prompts the BHW should check right now.
    Return JSON only.
  `;

  try {
    const jsonString = await callOpenAI(
      [{ role: "user", content: userPrompt }],
      true, // JSON Mode
      CDSS_SYSTEM_INSTRUCTION
    );

    return JSON.parse(jsonString) as ClinicalAssessment;

  } catch (error) {
    console.error("CDSS Service Error:", error);
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
  // Map internal role 'model' to OpenAI 'assistant'
  const chatHistory = history.map(h => ({
    role: h.role === 'model' ? 'assistant' : 'user',
    content: h.text
  }));

  const systemInstruction = `You are "Agapay", a friendly health assistant for Filipino citizens. 
  - Speak in "Taglish" (Tagalog-English mix) to be relatable and clear.
  - You are NOT a doctor. Do not diagnose.
  - If symptoms sound mild (Green risk), give home remedies (hydration, rest, herbal tea).
  - If symptoms sound serious (chest pain, difficulty breathing, high fever > 3 days), URGENTLY tell them to go to the Barangay Health Center or Hospital.
  - Keep answers short (under 50 words).`;

  try {
    const messages = [
      ...chatHistory,
      { role: "user", content: userMessage }
    ];

    const responseText = await callOpenAI(messages, false, systemInstruction);
    return responseText;
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

    const systemInstruction = "You are an expert Public Health Logistics Officer using predictive analytics to prevent shortages.";
    
    const responseText = await callOpenAI(
      [{ role: "user", content: prompt }],
      false,
      systemInstruction
    );

    return responseText;
  } catch (error) {
    console.error("Admin Analytics Error:", error);
    return "Unable to generate intelligence report at this time.";
  }
};