import React, { useState, useRef, useEffect } from 'react';
import { Pill, AlertTriangle, MapPin, Check, Plus, MessageCircle, Send, Bot, Calendar, Activity, Thermometer, User, Home, ArrowRight } from 'lucide-react';
import { chatWithAgapay } from '../../services/geminiService';

const CitizenModule: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'meds' | 'report' | 'chat'>('meds');
  
  // Mock Data
  const [meds, setMeds] = useState([
    { id: '1', name: 'Losartan', dosage: '50mg', frequency: 'Daily (8 AM)', remaining: 8, total: 30, takenToday: false, color: 'border-indigo-500' },
    { id: '2', name: 'Amoxicillin', dosage: '500mg', frequency: '3x a day', remaining: 14, total: 21, takenToday: true, color: 'border-emerald-500' },
  ]);

  const [reports, setReports] = useState<string[]>([]);
  
  // Chat State
  const [chatInput, setChatInput] = useState('');
  const [messages, setMessages] = useState<{role: 'user' | 'model', text: string}[]>([
    { role: 'model', text: 'Kamusta! Ako si Agapay. Anong nararamdaman mo ngayon?' }
  ]);
  const [isChatLoading, setIsChatLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleTakeMed = (id: string) => {
    setMeds(meds.map(m => m.id === id ? { ...m, takenToday: true, remaining: m.remaining - 1 } : m));
  };

  const handleReport = (symptom: string) => {
    setReports([...reports, symptom]);
    alert(`Report submitted: ${symptom}. Thank you for helping Barangay San Jose!`);
  };

  const handleSendMessage = async () => {
    if (!chatInput.trim()) return;
    
    const newMessages = [...messages, { role: 'user' as const, text: chatInput }];
    setMessages(newMessages);
    setChatInput('');
    setIsChatLoading(true);

    const response = await chatWithAgapay(chatInput, newMessages);
    
    setMessages([...newMessages, { role: 'model', text: response || "Sorry, try again." }]);
    setIsChatLoading(false);
  };

  return (
    <div className="max-w-md mx-auto bg-slate-50 min-h-screen pb-24 flex flex-col font-sans relative overflow-hidden">
      
      {/* Header */}
      <div className="bg-white px-6 pt-12 pb-6 flex justify-between items-end border-b border-slate-100 sticky top-0 z-20">
        <div>
          <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-1">Good Morning</p>
          <h1 className="text-2xl font-bold text-slate-800">Maria Clara</h1>
        </div>
        <div className="bg-indigo-100 p-2 rounded-full">
            <User className="h-6 w-6 text-indigo-600" />
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto px-5 py-6 space-y-6">
        
        {activeTab === 'meds' && (
          <div className="space-y-6 animate-fade-in">
            {/* Meds Header */}
            <div className="flex items-center justify-between">
                <h2 className="font-bold text-slate-800 flex items-center gap-2 text-lg">
                    <Calendar className="h-5 w-5 text-indigo-600" /> Today's Schedule
                </h2>
                <span className="text-xs bg-slate-100 px-2 py-1 rounded-md text-slate-500 font-medium">Nov 24, 2024</span>
            </div>

            {/* Med Cards */}
            <div className="space-y-4">
                {meds.map(med => {
                    const progress = (med.remaining / med.total) * 100;
                    return (
                        <div key={med.id} className={`bg-white p-5 rounded-2xl shadow-sm border-l-[6px] ${med.color} relative overflow-hidden group`}>
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h3 className="font-bold text-slate-800 text-lg">{med.name}</h3>
                                    <p className="text-sm text-slate-500 font-medium">{med.dosage} • <span className="text-indigo-600">{med.frequency}</span></p>
                                </div>
                                <button 
                                    onClick={() => handleTakeMed(med.id)}
                                    disabled={med.takenToday}
                                    className={`h-12 w-12 rounded-full flex items-center justify-center transition-all shadow-md ${med.takenToday ? 'bg-green-500 text-white' : 'bg-slate-100 text-slate-400 hover:bg-indigo-600 hover:text-white'}`}
                                >
                                    {med.takenToday ? <Check className="h-6 w-6" /> : <Plus className="h-6 w-6" />}
                                </button>
                            </div>
                            
                            {/* Stock Bar */}
                            <div className="w-full bg-slate-100 h-1.5 rounded-full mt-2 overflow-hidden">
                                <div className="h-full bg-slate-300 rounded-full" style={{ width: `${progress}%` }}></div>
                            </div>
                            <div className="flex justify-between mt-1 text-[10px] font-bold text-slate-400 uppercase tracking-wide">
                                <span>{med.remaining} tablets left</span>
                                {med.remaining < 10 && <span className="text-red-500">Refill Soon</span>}
                            </div>
                        </div>
                    );
                })}
            </div>
            
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-xl border border-blue-100 flex items-start gap-3">
              <div className="bg-white p-2 rounded-full shadow-sm text-blue-600 mt-1"><Activity className="h-4 w-4" /></div>
              <div>
                 <h4 className="text-sm font-bold text-blue-800">Health Tip</h4>
                 <p className="text-xs text-blue-600 mt-1 leading-relaxed">Don't forget to check your blood pressure at the Barangay Hall this Friday. Dr. Cruz will be visiting.</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'report' && (
          <div className="space-y-6 animate-fade-in">
             <div className="bg-orange-50 p-5 rounded-2xl border border-orange-100">
              <h4 className="font-bold text-orange-900 mb-2 flex items-center gap-2">
                <MapPin className="h-5 w-5 text-orange-600" /> Community Sentinel
              </h4>
              <p className="text-sm text-orange-800/80 leading-relaxed">
                Help us protect Barangay San Jose. Tap a symptom below to anonymously report an outbreak in your area.
              </p>
            </div>

            <h3 className="font-bold text-slate-800 mb-2 px-1">I am experiencing...</h3>
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: 'Fever', icon: <Thermometer className="h-6 w-6 text-red-500" /> },
                { label: 'Cough', icon: <Activity className="h-6 w-6 text-orange-500" /> },
                { label: 'Stomach Pain', icon: <AlertTriangle className="h-6 w-6 text-amber-500" /> },
                { label: 'Difficulty Breathing', icon: <Activity className="h-6 w-6 text-purple-500" /> },
              ].map((item) => (
                <button
                  key={item.label}
                  onClick={() => handleReport(item.label)}
                  className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:border-indigo-500 hover:shadow-md transition-all flex flex-col items-center gap-3 group"
                >
                  <div className="p-3 bg-slate-50 rounded-full group-hover:bg-indigo-50 transition-colors">
                    {item.icon}
                  </div>
                  <span className="font-semibold text-slate-700 text-sm">{item.label}</span>
                </button>
              ))}
            </div>

            <button className="w-full bg-red-50 text-red-600 font-bold py-4 rounded-xl flex items-center justify-center gap-2 border border-red-100 mt-4 hover:bg-red-100 transition-colors">
               <AlertTriangle className="h-5 w-5" />
               Emergency Hotline
            </button>
          </div>
        )}

        {activeTab === 'chat' && (
          <div className="flex flex-col h-[75vh] -mt-4 animate-fade-in">
             <div className="bg-indigo-50 p-4 rounded-xl mb-4 flex items-center gap-3 border border-indigo-100">
                <div className="relative">
                    <div className="bg-indigo-600 p-2 rounded-full text-white"><Bot className="h-5 w-5" /></div>
                    <div className="absolute bottom-0 right-0 h-2.5 w-2.5 bg-green-500 border-2 border-white rounded-full"></div>
                </div>
                <div>
                    <h3 className="font-bold text-indigo-900 text-sm">Agapay AI Assistant</h3>
                    <p className="text-[10px] text-indigo-700">Always here to help (Tagalog/English)</p>
                </div>
             </div>

            <div className="flex-1 overflow-y-auto space-y-4 px-2 py-2 custom-scrollbar">
              {messages.map((msg, idx) => (
                <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] rounded-2xl px-5 py-3 text-sm leading-relaxed shadow-sm ${
                    msg.role === 'user' 
                      ? 'bg-indigo-600 text-white rounded-br-none' 
                      : 'bg-white border border-slate-200 text-slate-700 rounded-bl-none'
                  }`}>
                    {msg.text}
                  </div>
                </div>
              ))}
              {isChatLoading && (
                <div className="flex justify-start">
                   <div className="bg-white border border-slate-100 shadow-sm rounded-2xl rounded-bl-none px-4 py-3 flex gap-1.5">
                      <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></span>
                      <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce delay-100"></span>
                      <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce delay-200"></span>
                   </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
            
            <div className="mt-4 flex gap-2 items-center bg-white p-2 rounded-full border border-slate-200 shadow-sm">
              <input 
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Type your message..." 
                className="flex-1 pl-4 py-2 bg-transparent focus:outline-none text-sm text-slate-700"
              />
              <button 
                onClick={handleSendMessage}
                disabled={!chatInput.trim() || isChatLoading}
                className="bg-indigo-600 text-white p-3 rounded-full hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:hover:bg-indigo-600"
              >
                <Send className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Modern Bottom Navigation */}
      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 bg-white/90 backdrop-blur-md p-1.5 rounded-full shadow-2xl border border-slate-200 flex gap-1 z-30">
          <button 
            onClick={() => setActiveTab('meds')}
            className={`px-5 py-2.5 rounded-full text-xs font-bold transition-all flex items-center gap-2 ${activeTab === 'meds' ? 'bg-slate-800 text-white shadow-md' : 'text-slate-500 hover:bg-slate-100'}`}
          >
            <Home className="h-4 w-4" />
            <span className={activeTab === 'meds' ? 'inline' : 'hidden'}>Home</span>
          </button>
          <button 
            onClick={() => setActiveTab('report')}
            className={`px-5 py-2.5 rounded-full text-xs font-bold transition-all flex items-center gap-2 ${activeTab === 'report' ? 'bg-orange-500 text-white shadow-md' : 'text-slate-500 hover:bg-slate-100'}`}
          >
            <Activity className="h-4 w-4" />
            <span className={activeTab === 'report' ? 'inline' : 'hidden'}>Report</span>
          </button>
           <button 
            onClick={() => setActiveTab('chat')}
            className={`px-5 py-2.5 rounded-full text-xs font-bold transition-all flex items-center gap-2 ${activeTab === 'chat' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-500 hover:bg-slate-100'}`}
          >
            <MessageCircle className="h-4 w-4" />
            <span className={activeTab === 'chat' ? 'inline' : 'hidden'}>Chat</span>
          </button>
      </div>
    </div>
  );
};

export default CitizenModule;