import { useState, useEffect } from 'react';
import { supabase } from './services/supabaseClient';
import AuthPage from './pages/AuthPage';
import PortfolioPage from './pages/PortfolioPage';
import LandingPage from './pages/LandingPage';

function App() {
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showLanding, setShowLanding] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setShowLanding(true); // her giriş yapınca landing göster
    });
  }, []);

  if (loading) return <div className="min-h-screen bg-black" />;

  if (!session) return <AuthPage />;

  if (showLanding) return <LandingPage 
    user={session.user} 
    onStart={() => setShowLanding(false)} 
  />;

  return <PortfolioPage />;
}

export default App;