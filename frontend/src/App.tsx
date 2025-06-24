import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import { LandingPage } from './pages/LandingPage';
import { EncryptPage } from './pages/EncryptPage';
import { DecryptPage } from './pages/DecryptPage';
import { MyFilesPage } from './pages/MyFilesPage';
export function App() {
  return <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/encrypt" element={<EncryptPage />} />
          <Route path="/decrypt/:fileId" element={<DecryptPage />} />
          <Route path="/decrypt" element={<DecryptPage />} />
          <Route path="/my-files" element={<MyFilesPage />} />
        </Routes>
      </Layout>
    </Router>;
}