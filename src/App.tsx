import React, { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { PaywallModal } from './components/PaywallModal';
import { Dashboard } from './pages/Dashboard';
import { PublicReviewPage } from './pages/PublicReviewPage';

export const App: React.FC = () => {
  const [isPaywallOpen, setIsPaywallOpen] = useState(false);

  return (
    <BrowserRouter>
      <div style={{ minHeight: '100vh', backgroundColor: '#FFFFFF' }}>
        <Routes>
          {/* Public Customer Review Handoff Route (Without Admin Navbar) */}
          <Route path="/review/:locationId" element={<PublicReviewPage />} />

          {/* Admin B2B SaaS Dashboard Routes (With Navbar & Paywall Modal) */}
          <Route
            path="*"
            element={
              <>
                <Navbar onOpenPaywall={() => setIsPaywallOpen(true)} />
                <main>
                  <Routes>
                    <Route path="/" element={<Dashboard />} />
                    <Route path="/dashboard" element={<Dashboard />} />
                  </Routes>
                </main>
                <PaywallModal isOpen={isPaywallOpen} onClose={() => setIsPaywallOpen(false)} />
              </>
            }
          />
        </Routes>
      </div>
    </BrowserRouter>
  );
};

export default App;
