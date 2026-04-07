import { useState } from 'react';
import { supabase } from '../services/supabaseClient';

const AuthPage = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async () => {
        setLoading(true);
        setError(null);
        try {
            if (isLogin) {
                const { error } = await supabase.auth.signInWithPassword({ email, password });
                if (error) throw error;
            } else {
                const { error } = await supabase.auth.signUp({ email, password });
                if (error) throw error;
            }
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center">
            <div className="relative w-[800px] h-[500px] bg-white rounded-2xl shadow-2xl overflow-hidden">
                
                {/* Form Paneli */}
                <div className={`absolute top-0 h-full w-1/2 flex flex-col items-center justify-center px-10 transition-all duration-600 ${isLogin ? 'left-0' : 'left-1/2'}`}>
                    <h2 className="text-2xl font-bold text-gray-800 mb-6">
                        {isLogin ? 'Giriş Yap' : 'Kayıt Ol'}
                    </h2>
                    {!isLogin && (
                        <input
                            type="text"
                            placeholder="İsim"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full border border-gray-300 rounded px-4 py-2 mb-3 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400"
                        />
                    )}
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full border border-gray-300 rounded px-4 py-2 mb-3 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400"
                    />
                    <input
                        type="password"
                        placeholder="Şifre"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full border border-gray-300 rounded px-4 py-2 mb-4 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400"
                        
                    />
                    {error && <p className="text-red-500 text-sm mb-3">{error}</p>}
                    <button
                        onClick={handleSubmit}
                        disabled={loading}
                        className="w-full bg-teal-500 hover:bg-teal-600 text-white font-medium py-2 rounded transition-colors"
                    >
                        {loading ? 'Yükleniyor...' : isLogin ? 'Giriş Yap' : 'Kayıt Ol'}
                    </button>
                </div>

                {/* Dekoratif Panel */}
                <div className={`absolute top-0 h-full w-1/2 bg-gradient-to-br from-teal-400 to-teal-600 flex flex-col items-center justify-center px-10 text-white transition-all duration-600 ${isLogin ? 'left-1/2' : 'left-0'}`}>
                    <h2 className="text-3xl font-bold mb-4">
                        {isLogin ? 'Merhaba!' : 'Tekrar Hoş Geldin!'}
                    </h2>
                    <p className="text-center text-sm mb-8 opacity-90">
                        {isLogin ? 'Hesabın yok mu? Hemen kayıt ol.' : 'Zaten hesabın var mı? Giriş yap.'}
                    </p>
                    <button
                        onClick={() => setIsLogin(!isLogin)}
                        className="border-2 border-white text-white px-8 py-2 rounded-full hover:bg-white hover:text-teal-500 transition-colors"
                    >
                        {isLogin ? 'Kayıt Ol' : 'Giriş Yap'}
                    </button>
                </div>

            </div>
        </div>
    );
};

export default AuthPage;