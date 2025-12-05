# Agapay AI: The Distributed Clinical Operating System 🇵🇭

**Agapay AI** is a next-generation health platform designed to bridge the "Last Mile Disconnect" in the Philippine healthcare supply chain. It empowers Barangay Health Workers (BHWs) with AI tools, connects citizens to care, and provides Local Government Units (LGUs) with predictive intelligence.

## 🏥 The Core Problem
In the Philippines, the Barangay Health Center is the first line of defense, but it is often the weakest link due to:
1.  **Data Silos:** Paper logbooks don't sync with city servers.
2.  **Clinical Blindness:** Volunteers lack immediate doctor supervision for complex triage.
3.  **Resource Asymmetry:** Medicine expires in one warehouse while another barangay runs out.

## 🚀 The Solution: Three Integrated Modules

### 1. The BHW Interface ("Clinical Co-Pilot")
*Target User: Barangay Health Workers (Volunteers)*
*   **AI-Driven CDSS:** Uses **Gemini 2.5 Flash** to analyze symptoms and vitals, guiding BHWs through physical exams (e.g., "Check for McBurney's Point tenderness").
*   **Risk Stratification:** Automatically categorizes patients into GREEN (Home Care), YELLOW (Teleconsult), or RED (Emergency Referral).
*   **Offline-First Records:** Saves patient data to local storage, packetized for eventual sync via "Agapay Mesh" (Bluetooth/Network).
*   **Digital Referral Ticket:** Generates a QR code containing the full triage history for hospital ERs to scan.

### 2. The Citizen Interface ("Continuum Companion")
*Target User: Residents / Patients*
*   **Medication Tracker:** Visual tracking of prescriptions (e.g., Losartan, Antibiotics) with adherence monitoring.
*   **Agapay Assistant (AI Chat):** A Taglish-speaking health bot that provides non-diagnostic home care advice and triage guidance.
*   **Syndromic Surveillance:** Allows citizens to anonymously report symptoms (Fever, Diarrhea), creating a real-time heat map for the LGU.

### 3. The Admin Interface ("Supply Chain Brain")
*Target User: City Health Officers / Logistics*
*   **Predictive Inventory:** Analyzes the correlation between reported symptoms and stock levels to predict runouts before they happen.
*   **Triage-Prioritized Queue:** Reorders the telehealth waiting list based on the AI's risk assessment (Red Priority first).
*   **Intelligence Reports:** Generates executive summaries and logistics recommendations using Generative AI.

---

## 🛠️ Tech Stack

*   **Frontend:** React 19 (TypeScript), Tailwind CSS
*   **AI Model:** Google Gemini API (`gemini-2.5-flash`) via `@google/genai` SDK
*   **Routing:** React Router (MemoryRouter for sandbox compatibility)
*   **Visualization:** Recharts for data analytics
*   **Icons:** Lucide React
*   **Utilities:** `react-qr-code`, LocalStorage for persistence

---

## ⚡ Setup & Installation

1.  **Clone the repository**
    ```bash
    git clone https://github.com/your-repo/agapay-ai.git
    cd agapay-ai
    ```

2.  **Install Dependencies**
    ```bash
    npm install
    ```

3.  **Configure API Key**
    Create a `.env` file in the root directory and add your Google Gemini API key:
    ```env
    API_KEY=your_google_genai_api_key_here
    ```

4.  **Run the Application**
    ```bash
    npm start
    ```

---

## 🤖 AI Features Implementation

*   **Clinical Assessment:** The BHW module sends structured prompts including age, gender, and vitals to Gemini to receive a JSON response containing risk levels and specific physical exam instructions.
*   **Taglish Chat:** The Citizen module uses a specific system instruction to ensure the AI speaks in a relatable mix of Tagalog and English and strictly adheres to non-diagnostic safety rails.
*   **Logistics Intelligence:** The Admin module feeds raw JSON inventory data into Gemini to generate text-based strategic insights.

---

## ⚠️ Disclaimer
**Agapay AI is a prototype Clinical Decision Support System.** It is intended to assist, not replace, medical professionals. All AI assessments should be verified by a licensed physician.
