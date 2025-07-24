import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './index.css';
import HomePage from './pages/HomePage';
import AuthPage from './pages/AuthPage';
import Dashboard from './pages/Dashboard';
import OnboardingPage from './pages/OnboardingPage';
import EvaluationPage from './pages/EvaluationPage';
import Profile from "./pages/Profile";

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/onboarding" element={<OnboardingPage />} />
        <Route path="/evaluation" element={<EvaluationPage/>} /> 
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
