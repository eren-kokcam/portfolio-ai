import Spline from '@splinetool/react-spline';

interface LandingPageProps {
    user: any;
    onStart: () => void;
}

const LandingPage = ({ user, onStart }: LandingPageProps) => {
    const firstName = user?.user_metadata?.full_name 
    || user?.email?.split('@')[0] 
    || 'Kullanıcı';

    return (
        <div className="relative min-h-screen w-full bg-black overflow-hidden">
            {/* Spline arka plan */}
            <div className="absolute inset-0" style={{ pointerEvents: 'auto' }}>
                <Spline scene="https://prod.spline.design/R-hci9nLlLCt9eZA/scene.splinecode" />
            </div>

            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent pointer-events-none" />

            {/* İçerik */}
            <div className="relative z-10 min-h-screen flex flex-col items-center justify-end pb-24 px-8 text-center pointer-events-none">
                <p className="text-white/40 text-xs tracking-widest uppercase mb-4">
                    Hoş geldin
                </p>
                <h1 className="text-6xl font-bold text-white tracking-tight mb-3">
                    {firstName}
                </h1>
                <p className="text-white/30 text-sm mb-12 max-w-sm">
                    Yapay zeka destekli portföy analizine hazır mısın?
                </p>
                <button
                    onClick={onStart}
                    className="pointer-events-auto bg-white text-black text-sm font-semibold px-10 py-4 rounded-xl hover:bg-white/90 active:scale-[0.98] transition-all"
                >
                    Başla →
                </button>
            </div>

            {/* Logo */}
            <div className="absolute top-8 left-8 z-10">
                <span className="text-white/30 text-xs tracking-widest uppercase">Portfolio AI</span>
            </div>
        </div>
    );
};

export default LandingPage;