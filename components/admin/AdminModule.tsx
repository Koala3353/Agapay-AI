import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, LineChart, Line, Legend } from 'recharts';
import { Package, Truck, Phone, AlertOctagon, Map, Users, BrainCircuit, Sparkles, X } from 'lucide-react';
import { generateLogisticsIntel } from '../../services/geminiService';
import ReactMarkdown from 'react-dom'; // Note: In standard env we might use react-markdown, but we'll stick to simple rendering if pkg not available or use pre-wrap

const AdminModule: React.FC = () => {
  const [isAnalysing, setIsAnalysing] = useState(false);
  const [aiReport, setAiReport] = useState<string | null>(null);

  // Mock Data for Predictive Inventory
  const inventoryData = [
    { name: 'San Jose', cases: 65, stock: 20, predictedDemand: 80, urgency: 'HIGH' },
    { name: 'Poblacion', cases: 40, stock: 120, predictedDemand: 45, urgency: 'LOW' },
    { name: 'Santa Maria', cases: 12, stock: 50, predictedDemand: 15, urgency: 'LOW' },
    { name: 'Del Pilar', cases: 55, stock: 30, predictedDemand: 60, urgency: 'MED' },
  ];

  const syndromicTrend = [
    { day: 'Mon', fever: 12, cough: 8 },
    { day: 'Tue', fever: 18, cough: 12 },
    { day: 'Wed', fever: 45, cough: 22 }, // Spike
    { day: 'Thu', fever: 52, cough: 28 },
    { day: 'Fri', fever: 58, cough: 35 },
  ];

  const telehealthQueue = [
    { id: 101, name: 'R. Magsaysay', age: 62, risk: 'RED', condition: 'Hypertensive Crisis', waitTime: '2m' },
    { id: 102, name: 'L. Tiago', age: 8, risk: 'RED', condition: 'High Fever / Dengue Suspicion', waitTime: '5m' },
    { id: 103, name: 'J. Cruz', age: 45, risk: 'YELLOW', condition: 'Persistent Cough', waitTime: '15m' },
    { id: 104, name: 'M. Clara', age: 28, risk: 'GREEN', condition: 'Prenatal Checkup', waitTime: '45m' },
  ];

  const handleGenerateIntel = async () => {
    setIsAnalysing(true);
    setAiReport(null);
    const report = await generateLogisticsIntel(inventoryData, syndromicTrend);
    setAiReport(report);
    setIsAnalysing(false);
  };

  return (
    <div className="bg-slate-900 min-h-screen text-slate-100 p-6 font-sans relative">
      <header className="flex justify-between items-center mb-8 border-b border-slate-700 pb-4">
        <div>
          <h1 className="text-2xl font-bold text-teal-400 tracking-tight">AGAPAY LGU COMMAND CENTER</h1>
          <p className="text-slate-400 text-sm">City Health Office • Operations Dashboard</p>
        </div>
        <div className="flex gap-4 items-center">
            <button 
                onClick={handleGenerateIntel}
                disabled={isAnalysing}
                className="bg-purple-600 hover:bg-purple-500 text-white px-4 py-2 rounded-lg border border-purple-400 flex items-center gap-2 shadow-lg shadow-purple-500/20 transition-all"
            >
                {isAnalysing ? <Sparkles className="h-4 w-4 animate-spin" /> : <BrainCircuit className="h-4 w-4" />}
                {isAnalysing ? "Generating Intel..." : "Generate AI Analysis"}
            </button>
            <div className="bg-slate-800 px-4 py-2 rounded-lg border border-slate-700 flex items-center gap-2">
                <div className="h-3 w-3 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-mono hidden md:inline">SYSTEM: ONLINE</span>
            </div>
        </div>
      </header>

      {/* AI Report Overlay/Section */}
      {aiReport && (
        <div className="mb-6 animate-fade-in">
           <div className="bg-gradient-to-r from-slate-800 to-slate-900 p-6 rounded-xl border border-purple-500/50 shadow-2xl relative">
              <button onClick={() => setAiReport(null)} className="absolute top-4 right-4 text-slate-400 hover:text-white">
                <X className="h-5 w-5" />
              </button>
              <h2 className="text-purple-300 font-bold text-lg mb-4 flex items-center gap-2">
                <Sparkles className="h-5 w-5" /> DOH Operations Intelligence Report
              </h2>
              <div className="prose prose-invert prose-sm max-w-none text-slate-300 whitespace-pre-line leading-relaxed">
                 {aiReport}
              </div>
           </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Col: Supply Chain Brain */}
        <div className="lg:col-span-2 space-y-6">
            
            {/* Predictive Alerts */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-slate-800 p-4 rounded-xl border-l-4 border-red-500 shadow-lg">
                    <div className="flex justify-between items-start mb-2">
                        <h3 className="font-bold text-lg flex items-center gap-2"><Truck className="h-5 w-5 text-red-500"/> Supply Chain Alert</h3>
                        <span className="bg-red-500/20 text-red-400 text-xs px-2 py-1 rounded">CRITICAL</span>
                    </div>
                    <p className="text-sm text-slate-300 mb-3">
                        <span className="font-bold text-white">Barangay San Jose</span> is projected to run out of <span className="font-bold text-white">Paracetamol & Amoxicillin</span> in <span className="text-red-400 font-bold">24 hours</span> due to a 300% spike in fever cases.
                    </p>
                    <button className="w-full bg-red-600 hover:bg-red-700 text-white py-2 rounded text-sm font-medium transition-colors">
                        Deploy Emergency Restock (Drone/Van)
                    </button>
                </div>
                
                <div className="bg-slate-800 p-4 rounded-xl border-l-4 border-blue-500 shadow-lg">
                     <div className="flex justify-between items-start mb-2">
                        <h3 className="font-bold text-lg flex items-center gap-2"><AlertOctagon className="h-5 w-5 text-blue-500"/> Syndromic Surge</h3>
                        <span className="bg-blue-500/20 text-blue-400 text-xs px-2 py-1 rounded">WARNING</span>
                    </div>
                    <p className="text-sm text-slate-300 mb-3">
                        Abnormal cluster of "Diarrhea" reports detected in <span className="font-bold text-white">Sitio Maligaya</span> (Citizen App Reports). Water testing recommended.
                    </p>
                    <button className="w-full bg-slate-700 hover:bg-slate-600 text-white py-2 rounded text-sm font-medium transition-colors">
                        Notify Sanitation Team
                    </button>
                </div>
            </div>

            {/* Charts */}
            <div className="bg-slate-800 p-6 rounded-xl border border-slate-700">
                <h3 className="font-bold text-slate-300 mb-6 flex items-center gap-2">
                    <Map className="h-5 w-5" /> Resource Distribution vs Demand
                </h3>
                <div className="h-64 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={inventoryData}>
                            <XAxis dataKey="name" stroke="#94a3b8" />
                            <YAxis stroke="#94a3b8" />
                            <Tooltip 
                                contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#f1f5f9' }}
                                itemStyle={{ color: '#f1f5f9' }}
                            />
                            <Legend />
                            <Bar dataKey="stock" fill="#3b82f6" name="Current Stock" />
                            <Bar dataKey="predictedDemand" fill="#f43f5e" name="Predicted Demand (48h)" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            <div className="bg-slate-800 p-6 rounded-xl border border-slate-700">
                 <h3 className="font-bold text-slate-300 mb-6 flex items-center gap-2">
                    <Users className="h-5 w-5" /> Syndromic Surveillance Trend (Last 5 Days)
                </h3>
                 <div className="h-64 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={syndromicTrend}>
                            <XAxis dataKey="day" stroke="#94a3b8" />
                            <YAxis stroke="#94a3b8" />
                            <Tooltip contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155' }} />
                            <Legend />
                            <Line type="monotone" dataKey="fever" stroke="#f43f5e" strokeWidth={3} />
                            <Line type="monotone" dataKey="cough" stroke="#fbbf24" strokeWidth={3} />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>

        {/* Right Col: Telehealth Queue */}
        <div className="bg-slate-800 rounded-xl border border-slate-700 flex flex-col h-full">
            <div className="p-4 border-b border-slate-700 bg-slate-800/50 rounded-t-xl">
                <h3 className="font-bold text-lg text-white flex items-center gap-2">
                    <Phone className="h-5 w-5 text-teal-400" /> 
                    Triage-Prioritized Queue
                </h3>
                <p className="text-xs text-slate-400 mt-1">AI-Ranked based on Severity</p>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {telehealthQueue.map((patient) => (
                    <div key={patient.id} className={`p-4 rounded-lg border-l-4 flex justify-between items-center transition-transform hover:scale-[1.02] cursor-pointer bg-slate-700/50 ${
                        patient.risk === 'RED' ? 'border-red-500' : 
                        patient.risk === 'YELLOW' ? 'border-yellow-500' : 'border-green-500'
                    }`}>
                        <div>
                            <div className="flex items-center gap-2">
                                <span className="font-bold text-white">{patient.name}</span>
                                <span className="text-xs text-slate-400">({patient.age}y)</span>
                            </div>
                            <p className="text-sm text-slate-300 font-medium">{patient.condition}</p>
                            <div className="flex items-center gap-2 mt-2">
                                <span className={`text-[10px] px-2 py-0.5 rounded font-bold uppercase ${
                                    patient.risk === 'RED' ? 'bg-red-500/20 text-red-400' : 
                                    patient.risk === 'YELLOW' ? 'bg-yellow-500/20 text-yellow-400' : 'bg-green-500/20 text-green-400'
                                }`}>
                                    {patient.risk} PRIORITY
                                </span>
                            </div>
                        </div>
                        <div className="text-right">
                             <p className="text-xs text-slate-400">Wait Time</p>
                             <p className="text-lg font-mono font-bold text-white">{patient.waitTime}</p>
                             <button className="mt-2 bg-teal-600 hover:bg-teal-500 text-white p-2 rounded-full shadow-lg">
                                <Phone className="h-4 w-4" />
                             </button>
                        </div>
                    </div>
                ))}
            </div>
            <div className="p-4 border-t border-slate-700 bg-slate-800/50 rounded-b-xl text-center">
                <button className="text-sm text-teal-400 hover:text-teal-300">View All Pending Requests</button>
            </div>
        </div>

      </div>
    </div>
  );
};

export default AdminModule;