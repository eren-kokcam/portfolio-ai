import { useState } from 'react';
import { supabase } from '../services/supabaseClient';
import Spline from '@splinetool/react-spline';

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
                const { error } = await supabase.auth.signUp({
                    email,
                    password,
                    options: {
                        data: {
                            full_name: name
                        }
                    }
                });
                if (error) throw error;
            }
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="relative min-h-screen w-full bg-black overflow-hidden">
            {/* Spline */}
            <div className="absolute right-0 top-0 w-2/3 h-full" style={{ pointerEvents: 'auto' }}>
                <Spline scene="https://prod.spline.design/KaQFqxuJcDmNrgiC/scene.splinecode" />
            </div>

            {/* Sol gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-transparent z-[1] pointer-events-none" />

            {/* İçerik */}
            <div className="relative z-10 min-h-screen flex flex-col justify-center px-16 max-w-lg">
                
                {/* Logo */}
                <div className="mb-16">
                    <span className="text-white/40 text-xs tracking-[0.3em] uppercase">Portfolio AI</span>
                </div>

                {/* Başlık */}
                <div className="mb-12">
                    <h1 className="text-7xl font-bold text-white leading-none tracking-tight mb-4">
                        {isLogin ? 'Giriş\nYap' : 'Kayıt\nOl'}
                    </h1>
                    <p className="text-white/30 text-sm">
                        {isLogin 
                            ? 'Portföyünüzü analiz etmeye devam edin' 
                            : 'AI destekli portföy analizine başlayın'}
                    </p>
                </div>

                {/* Form */}
                <div className="space-y-4 mb-8">
                    {!isLogin && (
                        <div>
                            <input
                                type="text"
                                placeholder="İsim"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full bg-transparent border-b border-white/15 py-3 text-white text-sm placeholder-white/25 focus:outline-none focus:border-white/50 transition-colors"
                            />
                        </div>
                    )}
                    <div>
                        <input
                            type="email"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full bg-transparent border-b border-white/15 py-3 text-white text-sm placeholder-white/25 focus:outline-none focus:border-white/50 transition-colors"
                        />
                    </div>
                    <div>
                        <input
                            type="password"
                            placeholder="Şifre"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full bg-transparent border-b border-white/15 py-3 text-white text-sm placeholder-white/25 focus:outline-none focus:border-white/50 transition-colors"
                        />
                    </div>
                </div>

                {error && <p className="text-red-400 text-xs mb-4">{error}</p>}

                {/* Buton */}
                <button
                    onClick={handleSubmit}
                    disabled={loading}
                    className="w-full bg-white text-black text-sm font-semibold py-4 rounded-xl hover:bg-white/90 active:scale-[0.98] transition-all disabled:opacity-40 mb-6"
                >
                    {loading ? '...' : isLogin ? 'Giriş Yap →' : 'Hesap Oluştur →'}
                </button>

                {/* Switch */}
                <p className="text-white/25 text-xs">
                    {isLogin ? 'Hesabın yok mu?' : 'Zaten hesabın var mı?'}
                    <button
                        onClick={() => setIsLogin(!isLogin)}
                        className="text-white/60 ml-2 hover:text-white transition-colors"
                    >
                        {isLogin ? 'Kayıt ol' : 'Giriş yap'}
                    </button>
                </p>
            </div>
        </div>
    );
};

export default AuthPage;