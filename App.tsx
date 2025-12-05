import React from 'react';
import { MemoryRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import BHWModule from './components/bhw/BHWModule';
import CitizenModule from './components/citizen/CitizenModule';
import AdminModule from './components/admin/AdminModule';
import { Stethoscope, User, BarChart3, Activity } from 'lucide-react';

const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-800 to-slate-900 flex items-center justify-center p-6">
      <div className="max-w-4xl w-full">
        <div className="text-center mb-12">
            <div className="flex justify-center mb-4">
                <div className="bg-white p-4 rounded-full shadow-2xl">
                    <Activity className="h-12 w-12 text-teal-700" />
                </div>
            </div>
            <h1 className="text-5xl font-extrabold text-white mb-4 tracking-tight">Agapay AI</h1>
            <p className="text-xl text-teal-100 max-w-2xl mx-auto">
                The Distributed Clinical Operating System for the Philippines. 
                Connecting BHWs, Citizens, and LGUs to bridge the Last Mile Disconnect.
            </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Link to="/bhw" className="group">
                <div className="bg-white/10 backdrop-blur-md border border-white/20 p-8 rounded-2xl hover:bg-white/20 transition-all cursor-pointer transform hover:-translate-y-2 h-full flex flex-col items-center text-center">
                    <div className="bg-teal-500 p-4 rounded-full mb-6 group-hover:scale-110 transition-transform">
                        <Stethoscope className="h-8 w-8 text-white" />
                    </div>
                    <h2 className="text-2xl font-bold text-white mb-2">BHW Interface</h2>
                    <p className="text-teal-100 text-sm">
                        "Clinical Co-Pilot" for Barangay Health Workers. AI-driven triage and offline-ready patient records.
                    </p>
                </div>
            </Link>

            <Link to="/citizen" className="group">
                <div className="bg-white/10 backdrop-blur-md border border-white/20 p-8 rounded-2xl hover:bg-white/20 transition-all cursor-pointer transform hover:-translate-y-2 h-full flex flex-col items-center text-center">
                    <div className="bg-indigo-500 p-4 rounded-full mb-6 group-hover:scale-110 transition-transform">
                        <User className="h-8 w-8 text-white" />
                    </div>
                    <h2 className="text-2xl font-bold text-white mb-2">Citizen App</h2>
                    <p className="text-indigo-100 text-sm">
                        "Continuum Companion" for patients. Track medication adherence and report community health signals.
                    </p>
                </div>
            </Link>

            <Link to="/admin" className="group">
                <div className="bg-white/10 backdrop-blur-md border border-white/20 p-8 rounded-2xl hover:bg-white/20 transition-all cursor-pointer transform hover:-translate-y-2 h-full flex flex-col items-center text-center">
                    <div className="bg-slate-700 p-4 rounded-full mb-6 group-hover:scale-110 transition-transform">
                        <BarChart3 className="h-8 w-8 text-white" />
                    </div>
                    <h2 className="text-2xl font-bold text-white mb-2">LGU Command</h2>
                    <p className="text-slate-300 text-sm">
                        "Supply Chain Brain" for City Health. Predictive inventory load balancing and triage-prioritized queues.
                    </p>
                </div>
            </Link>
        </div>
        
        <div className="mt-12 text-center">
            <p className="text-white/30 text-xs">Powered by Gemini 2.5 Flash • DOH Guideline Compliant • Offline-First Architecture</p>
        </div>
      </div>
    </div>
  );
};

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const location = useLocation();
    const isHome = location.pathname === "/";

    return (
        <div>
            {!isHome && (
                 <nav className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-black/80 backdrop-blur-md text-white px-6 py-3 rounded-full shadow-2xl z-50 flex gap-6 text-xs font-medium border border-white/10">
                    <Link to="/" className="hover:text-teal-300 transition-colors">Home</Link>
                    <Link to="/bhw" className="hover:text-teal-300 transition-colors">BHW</Link>
                    <Link to="/citizen" className="hover:text-teal-300 transition-colors">Citizen</Link>
                    <Link to="/admin" className="hover:text-teal-300 transition-colors">Admin</Link>
                 </nav>
            )}
            {children}
        </div>
    )
}

const App: React.FC = () => {
  return (
    <Router>
        <Layout>
            <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/bhw" element={<BHWModule />} />
                <Route path="/citizen" element={<CitizenModule />} />
                <Route path="/admin" element={<AdminModule />} />
            </Routes>
        </Layout>
    </Router>
  );
};

export default App;