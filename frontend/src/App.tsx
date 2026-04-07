import { useState, useEffect } from 'react';
import { supabase } from './services/supabaseClient';
import AuthPage from './pages/AuthPage';
import PortfolioPage from './pages/PortfolioPage';

function App() {
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
  }, []);

  if (loading) return <div className="min-h-screen flex items-center justify-center">Yükleniyor...</div>;

  return session ? <PortfolioPage /> : <AuthPage />;
}

export default App;