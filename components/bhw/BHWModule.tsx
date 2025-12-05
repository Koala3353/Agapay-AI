import React, { useState, useEffect } from 'react';
import { Activity, Thermometer, Heart, Wind, AlertCircle, CheckCircle, Smartphone, WifiOff, RefreshCw, History, Clock, User, ChevronRight, Stethoscope, FileText, ArrowLeft, Save } from 'lucide-react';
import QRCode from 'react-qr-code';
import { Vitals, ClinicalAssessment, RiskLevel, PatientRecord } from '../../types';
import { assessPatientCondition } from '../../services/geminiService';

const BHWModule: React.FC = () => {
  const [step, setStep] = useState<'intake' | 'assessment' | 'referral'>('intake');
  const [isLoading, setIsLoading] = useState(false);
  const [symptoms, setSymptoms] = useState('');
  const [vitals, setVitals] = useState<Vitals>({
    temp: 36.5,
    bpSystolic: 120,
    bpDiastolic: 80,
    pulse: 75,
    oxygen: 98
  });
  const [patientInfo, setPatientInfo] = useState({ name: 'Juan Dela Cruz', age: 45, gender: 'M' });
  const [assessment, setAssessment] = useState<ClinicalAssessment | null>(null);
  const [history, setHistory] = useState<PatientRecord[]>([]);

  useEffect(() => {
    const key = `agapay_patient_${patientInfo.name.trim().toLowerCase()}`;
    const stored = localStorage.getItem(key);
    if (stored) {
      try {
        setHistory(JSON.parse(stored));
      } catch (e) {
        setHistory([]);
      }
    } else {
      setHistory([]);
    }
  }, [patientInfo.name]);

  const saveRecord = () => {
    if (!assessment) return;

    const newRecord: PatientRecord = {
      id: Date.now().toString(),
      name: patientInfo.name,
      age: patientInfo.age,
      gender: patientInfo.gender as 'M' | 'F',
      barangay: 'San Jose',
      symptoms: symptoms.split(',').map(s => s.trim()),
      vitals: vitals,
      assessment: assessment,
      timestamp: new Date().toISOString()
    };

    const key = `agapay_patient_${patientInfo.name.trim().toLowerCase()}`;
    const newHistory = [newRecord, ...history];
    localStorage.setItem(key, JSON.stringify(newHistory));
    setHistory(newHistory);
  };

  const handleAnalyze = async () => {
    setIsLoading(true);
    const result = await assessPatientCondition(
      symptoms.split(','),
      vitals,
      patientInfo.age,
      patientInfo.gender
    );
    setAssessment(result);
    setStep('assessment');
    setIsLoading(false);
  };

  const handleCreateReferral = () => {
    saveRecord();
    setStep('referral');
  };

  const getRiskColorInfo = (level?: RiskLevel) => {
    switch (level) {
      case RiskLevel.RED: return { bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-200', icon: 'text-red-500', badge: 'bg-red-100 text-red-800' };
      case RiskLevel.YELLOW: return { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200', icon: 'text-amber-500', badge: 'bg-amber-100 text-amber-800' };
      case RiskLevel.GREEN: return { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200', icon: 'text-emerald-500', badge: 'bg-emerald-100 text-emerald-800' };
      default: return { bg: 'bg-gray-50', text: 'text-gray-700', border: 'border-gray-200', icon: 'text-gray-500', badge: 'bg-gray-100 text-gray-800' };
    }
  };

  const riskInfo = getRiskColorInfo(assessment?.riskLevel);

  return (
    <div className="max-w-md mx-auto bg-slate-50 min-h-screen pb-24 shadow-2xl relative font-sans text-slate-800">
      {/* Modern Gradient Header */}
      <div className="bg-gradient-to-br from-teal-700 via-teal-600 to-emerald-600 text-white p-6 rounded-b-[2.5rem] shadow-lg sticky top-0 z-20">
        <div className="flex justify-between items-center mb-2">
          <div>
            <h1 className="font-bold text-xl tracking-tight flex items-center gap-2">
              <Stethoscope className="h-5 w-5 opacity-80" /> Agapay BHW
            </h1>
            <p className="text-xs text-teal-100 font-medium opacity-90">Brgy. San Jose • Online Mode</p>
          </div>
          <div className="bg-white/20 p-2 rounded-full backdrop-blur-sm">
            <User className="h-5 w-5 text-white" />
          </div>
        </div>
        
        {/* Progress Stepper */}
        <div className="flex justify-between items-center mt-6 px-4">
          <div className={`flex flex-col items-center gap-1 ${step === 'intake' ? 'opacity-100' : 'opacity-60'}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${step === 'intake' ? 'bg-white text-teal-700' : 'bg-teal-800 text-teal-300'}`}>1</div>
            <span className="text-[10px] font-medium tracking-wider">INTAKE</span>
          </div>
          <div className="h-[2px] w-12 bg-teal-800/50"></div>
          <div className={`flex flex-col items-center gap-1 ${step === 'assessment' ? 'opacity-100' : 'opacity-60'}`}>
             <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${step === 'assessment' ? 'bg-white text-teal-700' : 'bg-teal-800 text-teal-300'}`}>2</div>
             <span className="text-[10px] font-medium tracking-wider">ASSESS</span>
          </div>
           <div className="h-[2px] w-12 bg-teal-800/50"></div>
          <div className={`flex flex-col items-center gap-1 ${step === 'referral' ? 'opacity-100' : 'opacity-60'}`}>
             <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${step === 'referral' ? 'bg-white text-teal-700' : 'bg-teal-800 text-teal-300'}`}>3</div>
             <span className="text-[10px] font-medium tracking-wider">REFER</span>
          </div>
        </div>
      </div>

      <div className="p-5 space-y-6 -mt-4 relative z-10">
        
        {step === 'intake' && (
          <div className="space-y-5 animate-fade-in">
            {/* Patient Card */}
            <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Patient Demographics</h3>
              <div className="grid grid-cols-6 gap-3">
                <div className="col-span-6">
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                    <input 
                      value={patientInfo.name}
                      onChange={(e) => setPatientInfo({...patientInfo, name: e.target.value})}
                      className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500 outline-none text-sm font-medium transition-all" 
                      placeholder="Full Name" 
                    />
                  </div>
                </div>
                <div className="col-span-3">
                   <input 
                    type="number"
                    value={patientInfo.age}
                    onChange={(e) => setPatientInfo({...patientInfo, age: parseInt(e.target.value)})}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500 outline-none text-sm font-medium transition-all" 
                    placeholder="Age" 
                  />
                </div>
                <div className="col-span-3">
                   <select 
                    value={patientInfo.gender}
                    onChange={(e) => setPatientInfo({...patientInfo, gender: e.target.value})}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500 outline-none text-sm font-medium transition-all"
                  >
                    <option value="M">Male</option>
                    <option value="F">Female</option>
                  </select>
                </div>
              </div>
            </div>

            {/* History Timeline */}
            <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100">
               <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 flex items-center justify-between">
                <span>Recent History</span>
                <History className="h-3 w-3" />
              </h3>
              {history.length > 0 ? (
                <div className="relative pl-2 border-l-2 border-slate-100 space-y-4">
                  {history.slice(0, 3).map((record) => (
                    <div key={record.id} className="relative pl-4">
                      <div className={`absolute -left-[9px] top-1 h-4 w-4 rounded-full border-2 bg-white ${
                         record.assessment?.riskLevel === 'RED' ? 'border-red-400' : 
                         record.assessment?.riskLevel === 'YELLOW' ? 'border-amber-400' : 'border-emerald-400'
                      }`}></div>
                      <div className="flex justify-between items-start">
                        <span className="text-xs font-bold text-slate-700">{new Date(record.timestamp).toLocaleDateString()}</span>
                        <span className="text-[10px] text-slate-400">{record.assessment?.riskLevel}</span>
                      </div>
                      <p className="text-xs text-slate-500 truncate">{record.assessment?.provisionalClassification}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-4 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                  <span className="text-xs text-slate-400">No prior records for {patientInfo.name}</span>
                </div>
              )}
            </div>

            {/* Vitals Input */}
            <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                <Activity className="h-3 w-3" /> Vitals Monitor
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 focus-within:ring-2 focus-within:ring-teal-500 focus-within:bg-white transition-all">
                  <label className="text-[10px] uppercase text-slate-400 font-bold mb-1 block">Temperature</label>
                  <div className="flex items-end gap-1">
                    <Thermometer className="h-5 w-5 text-teal-500 mb-0.5" />
                    <input 
                      type="number" 
                      className="w-full bg-transparent outline-none font-bold text-lg text-slate-700"
                      value={vitals.temp}
                      onChange={(e) => setVitals({...vitals, temp: parseFloat(e.target.value)})}
                    />
                    <span className="text-xs text-slate-400 mb-1">°C</span>
                  </div>
                </div>
                 <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 focus-within:ring-2 focus-within:ring-teal-500 focus-within:bg-white transition-all">
                  <label className="text-[10px] uppercase text-slate-400 font-bold mb-1 block">O2 Saturation</label>
                  <div className="flex items-end gap-1">
                    <Wind className="h-5 w-5 text-blue-500 mb-0.5" />
                    <input 
                      type="number" 
                      className="w-full bg-transparent outline-none font-bold text-lg text-slate-700"
                      value={vitals.oxygen}
                      onChange={(e) => setVitals({...vitals, oxygen: parseFloat(e.target.value)})}
                    />
                    <span className="text-xs text-slate-400 mb-1">%</span>
                  </div>
                </div>
                 <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 focus-within:ring-2 focus-within:ring-teal-500 focus-within:bg-white transition-all">
                  <label className="text-[10px] uppercase text-slate-400 font-bold mb-1 block">Heart Rate</label>
                  <div className="flex items-end gap-1">
                    <Heart className="h-5 w-5 text-rose-500 mb-0.5" />
                    <input 
                      type="number" 
                      className="w-full bg-transparent outline-none font-bold text-lg text-slate-700"
                      value={vitals.pulse}
                      onChange={(e) => setVitals({...vitals, pulse: parseFloat(e.target.value)})}
                    />
                    <span className="text-xs text-slate-400 mb-1">bpm</span>
                  </div>
                </div>
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 focus-within:ring-2 focus-within:ring-teal-500 focus-within:bg-white transition-all">
                  <label className="text-[10px] uppercase text-slate-400 font-bold mb-1 block">Blood Pressure</label>
                  <div className="flex items-end gap-1">
                    <input 
                      type="number" 
                      className="w-10 bg-transparent outline-none font-bold text-lg text-slate-700 text-center"
                      value={vitals.bpSystolic}
                      onChange={(e) => setVitals({...vitals, bpSystolic: parseFloat(e.target.value)})}
                    />
                    <span className="text-slate-300 text-xl font-light">/</span>
                    <input 
                      type="number" 
                      className="w-10 bg-transparent outline-none font-bold text-lg text-slate-700 text-center"
                      value={vitals.bpDiastolic}
                      onChange={(e) => setVitals({...vitals, bpDiastolic: parseFloat(e.target.value)})}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Symptoms Input */}
            <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100">
               <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 block">Primary Complaints</label>
               <textarea 
                className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500 outline-none text-sm transition-all"
                rows={3}
                placeholder="Describe symptoms (e.g., severe headache, vomiting since last night...)"
                value={symptoms}
                onChange={(e) => setSymptoms(e.target.value)}
              />
            </div>

            <button 
              onClick={handleAnalyze}
              disabled={isLoading || !symptoms}
              className="w-full bg-teal-600 hover:bg-teal-700 active:scale-[0.98] text-white font-bold py-4 rounded-2xl shadow-lg shadow-teal-500/30 flex justify-center items-center gap-3 transition-all disabled:opacity-50 disabled:shadow-none"
            >
              {isLoading ? (
                <>
                  <RefreshCw className="h-5 w-5 animate-spin" /> 
                  <span className="text-sm">Consulting AI Model...</span>
                </>
              ) : (
                <>
                  <span className="text-sm">Generate AI Assessment</span>
                  <ChevronRight className="h-5 w-5" />
                </>
              )}
            </button>
          </div>
        )}

        {step === 'assessment' && assessment && (
          <div className="space-y-5 animate-fade-in">
             <button 
                onClick={() => setStep('intake')}
                className="flex items-center gap-1 text-xs font-bold text-slate-500 hover:text-teal-600 transition-colors"
              >
                <ArrowLeft className="h-3 w-3" /> Edit Intake
              </button>

            {/* Risk Card */}
            <div className={`p-6 rounded-2xl border-l-8 shadow-md ${riskInfo.bg} ${riskInfo.border} ${riskInfo.text}`}>
              <div className="flex justify-between items-start mb-2">
                <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${riskInfo.badge}`}>
                  {assessment.riskLevel} PRIORITY
                </span>
                {assessment.riskLevel === 'RED' && <AlertCircle className={`h-6 w-6 ${riskInfo.icon}`} />}
              </div>
              <h2 className="text-xl font-bold mb-1">{assessment.provisionalClassification}</h2>
              <p className="text-sm opacity-80 leading-relaxed">{assessment.reasoning}</p>
            </div>

            {/* AI Physical Exam Guide */}
            {assessment.physicalExamPrompts.length > 0 && (
              <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
                <h3 className="font-bold text-slate-800 text-sm mb-4 flex items-center gap-2">
                   <div className="p-1.5 bg-teal-100 rounded-lg text-teal-700"><Stethoscope className="h-4 w-4" /></div>
                   AI Guided Physical Exam
                </h3>
                <div className="space-y-4">
                  {assessment.physicalExamPrompts.map((exam, idx) => (
                    <div key={idx} className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                      <p className="text-sm font-semibold text-slate-800 mb-2">{exam.prompt}</p>
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 text-xs">
                        <span className="text-slate-500">Look for: <span className="font-medium text-teal-700">{exam.expectedFinding}</span></span>
                        <div className="flex gap-2 w-full sm:w-auto">
                           <button className="flex-1 sm:flex-none px-4 py-1.5 bg-white border border-slate-200 rounded-lg shadow-sm hover:border-red-300 hover:text-red-600 hover:bg-red-50 transition-all font-medium">Positive</button>
                           <button className="flex-1 sm:flex-none px-4 py-1.5 bg-white border border-slate-200 rounded-lg shadow-sm hover:border-emerald-300 hover:text-emerald-600 hover:bg-emerald-50 transition-all font-medium">Negative</button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
              <h3 className="font-bold text-slate-800 text-sm mb-3 flex items-center gap-2">
                 <div className="p-1.5 bg-blue-100 rounded-lg text-blue-700"><FileText className="h-4 w-4" /></div>
                 Immediate Actions
              </h3>
              <ul className="space-y-2">
                {assessment.immediateActions.map((action, i) => (
                  <li key={i} className="text-sm text-slate-600 flex items-start gap-2">
                     <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-blue-400 flex-shrink-0"></span>
                     {action}
                  </li>
                ))}
              </ul>
            </div>

            <button 
              onClick={handleCreateReferral}
              className="w-full bg-slate-800 text-white font-bold py-4 rounded-2xl shadow-lg flex justify-center items-center gap-3 hover:bg-slate-900 transition-all"
            >
              <Save className="h-5 w-5" />
              Generate Referral Ticket
            </button>
          </div>
        )}

        {step === 'referral' && assessment && (
          <div className="flex flex-col items-center space-y-6 animate-fade-in pt-4">
            <div className="bg-white p-8 rounded-3xl shadow-xl border border-slate-100 flex flex-col items-center w-full max-w-sm">
              <div className="mb-4 text-center">
                 <h2 className="text-lg font-bold text-slate-800">Digital Referral Ticket</h2>
                 <p className="text-xs text-slate-400">Scan at City Health Office / ER</p>
              </div>
              
              <div className="p-3 bg-white border-2 border-dashed border-slate-300 rounded-xl">
                <QRCode 
                  value={JSON.stringify({
                    id: Date.now().toString(),
                    patient: patientInfo.name,
                    risk: assessment.riskLevel,
                    dx: assessment.provisionalClassification,
                    vitals: vitals
                  })} 
                  size={180} 
                  className="rounded-lg"
                />
              </div>

              <div className="mt-6 w-full text-center space-y-2">
                <div className={`inline-block px-4 py-1.5 rounded-full text-xs font-bold tracking-wide ${riskInfo.badge}`}>
                  {assessment.riskLevel} PRIORITY
                </div>
                <div className="text-xs text-slate-400 font-mono bg-slate-50 py-1 px-3 rounded-lg inline-block">ID: {Date.now().toString().slice(-8)}</div>
              </div>
            </div>

            <div className="w-full bg-blue-50/50 border border-blue-100 p-4 rounded-2xl flex items-start gap-3">
              <div className="p-2 bg-blue-100 rounded-full text-blue-600"><WifiOff className="h-4 w-4" /></div>
              <div>
                <h4 className="font-bold text-blue-800 text-sm">Offline Mode Active</h4>
                <p className="text-xs text-blue-600/80 mt-1 leading-relaxed">
                  Data packet securely saved to local storage. Can be transferred via Bluetooth Mesh if connectivity fails.
                </p>
              </div>
            </div>

            <button 
              onClick={() => {
                setStep('intake');
                setSymptoms('');
                setAssessment(null);
              }}
              className="w-full py-4 text-slate-500 font-medium text-sm hover:text-teal-600 transition-colors"
            >
              Start New Patient Intake
            </button>
          </div>
        )}

      </div>
    </div>
  );
};

export default BHWModule;