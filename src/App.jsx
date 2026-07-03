import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import ErrorBoundary from './components/ErrorBoundary';
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
import NotFound from './pages/NotFound';

function AppContent() {
  const { user } = useAuth();
  const [showSignup, setShowSignup] = useState(false);

  if (!user) {
    if (showSignup) {
      return <Signup onSwitchToLogin={() => setShowSignup(false)} />;
    }
    return <Login onSwitchToSignup={() => setShowSignup(true)} />;
  }

  return (
    <div className="app-layout">
      <Sidebar />
      <div className="main-area">
        <TopBar />
        <div className="page-content">
          <ErrorBoundary>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/scam-sentinel" element={<ScamSentinel />} />
              <Route path="/notesure" element={<NoteSure />} />
              <Route path="/fraudgraph" element={<FraudGraph />} />
              <Route path="/crimemap" element={<CrimeMap />} />
              <Route path="/nagrikshield" element={<NagrikShield />} />
              <Route path="/architecture" element={<Architecture />} />
              <Route path="/404" element={<NotFound />} />
              <Route path="*" element={<Navigate to="/404" replace />} />
            </Routes>
          </ErrorBoundary>
        </div>
      </div>
    </div>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <BrowserRouter>
          <AppContent />
        </BrowserRouter>
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;
