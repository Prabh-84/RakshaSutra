import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import Sidebar from './components/Sidebar';
import TopBar from './components/TopBar';
import Dashboard from './pages/Dashboard';
import ScamSentinel from './pages/ScamSentinel';
import NoteSure from './pages/NoteSure';
import FraudGraph from './pages/FraudGraph';
import CrimeMap from './pages/CrimeMap';
import NagrikShield from './pages/NagrikShield';
import Architecture from './pages/Architecture';
import Login from './pages/Login';
import Signup from './pages/Signup';

function AppContent() {
  const { user } = useAuth();
  const [showSignup, setShowSignup] = useState(false);

  // If not logged in, show Auth pages
  if (!user) {
    if (showSignup) {
      return <Signup onSwitchToLogin={() => setShowSignup(false)} />;
    }
    return <Login onSwitchToSignup={() => setShowSignup(true)} />;
  }

  // If logged in, show main application layout
  return (
    <div className="app-layout">
      <Sidebar />
      <div className="main-area">
        <TopBar />
        <div className="page-content">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/scam-sentinel" element={<ScamSentinel />} />
            <Route path="/notesure" element={<NoteSure />} />
            <Route path="/fraudgraph" element={<FraudGraph />} />
            <Route path="/crimemap" element={<CrimeMap />} />
            <Route path="/nagrikshield" element={<NagrikShield />} />
            <Route path="/architecture" element={<Architecture />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </div>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
