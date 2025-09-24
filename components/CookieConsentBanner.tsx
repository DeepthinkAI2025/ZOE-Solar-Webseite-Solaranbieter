import React, { useState, useEffect } from 'react';

interface ConsentState {
    necessary: boolean;
    analytics: boolean;
    marketing: boolean;
}

// Cookie helper functions
const setCookie = (name: string, value: string, days: number) => {
    let expires = "";
    if (days) {
        const date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "") + expires + "; path=/; SameSite=Lax; Secure";
};

const getCookie = (name: string): string | null => {
    const nameEQ = name + "=";
    const ca = document.cookie.split(';');
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) === ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
};

const COOKIE_NAME = 'zoe-cookie-consent';

const Toggle: React.FC<{ label: string; description: string; checked: boolean; onChange: (checked: boolean) => void; disabled?: boolean }> = ({ label, description, checked, onChange, disabled }) => (
    <div className={`p-4 rounded-lg transition-colors ${disabled ? 'bg-slate-100' : 'bg-white'}`}>
        <div className="flex justify-between items-center">
            <span className={`font-bold ${disabled ? 'text-slate-500' : 'text-slate-800'}`}>{label}</span>
            <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} className="sr-only peer" disabled={disabled} />
                <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
            </label>
        </div>
        <p className={`text-sm mt-1 ${disabled ? 'text-slate-400' : 'text-slate-600'}`}>{description}</p>
    </div>
);

const CookieConsentBanner: React.FC = () => {
    const [isPanelOpen, setIsPanelOpen] = useState(false);
    const [consent, setConsent] = useState<ConsentState>({ necessary: true, analytics: true, marketing: true });

    useEffect(() => {
        const storedConsent = getCookie(COOKIE_NAME);
        if (storedConsent) {
            try {
                const parsedConsent = JSON.parse(storedConsent);
                setConsent(parsedConsent);
            } catch (e) {
                // If parsing fails, set default accepted state
                const defaultConsent = { necessary: true, analytics: true, marketing: true };
                setCookie(COOKIE_NAME, JSON.stringify(defaultConsent), 365);
                setConsent(defaultConsent);
            }
        } else {
            // User is visiting for the first time, accept by default as requested
            const defaultConsent = { necessary: true, analytics: true, marketing: true };
            setCookie(COOKIE_NAME, JSON.stringify(defaultConsent), 365);
            setConsent(defaultConsent);
        }
    }, []);

    const handleToggle = (key: keyof Omit<ConsentState, 'necessary'>, value: boolean) => {
        setConsent(prev => ({ ...prev, [key]: value }));
    };
    
    const handleSave = () => {
        setCookie(COOKIE_NAME, JSON.stringify(consent), 365);
        setIsPanelOpen(false);
        // Here you would dispatch events or call functions to enable/disable scripts based on consent
    };

    const handleAcceptAll = () => {
        const allAccepted = { necessary: true, analytics: true, marketing: true };
        setConsent(allAccepted);
        setCookie(COOKIE_NAME, JSON.stringify(allAccepted), 365);
        setIsPanelOpen(false);
    };

    return (
        <>
            {/* Cookie Icon Trigger */}
            <button
                onClick={() => setIsPanelOpen(true)}
                className="fixed bottom-6 left-6 z-[200] w-14 h-14 bg-white rounded-full shadow-lg flex items-center justify-center transition-transform hover:scale-110 border border-slate-200"
                aria-label="Cookie-Einstellungen öffnen"
            >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8 text-slate-600">
                    <path d="M12,2A10,10,0,1,0,22,12,10,10,0,0,0,12,2Zm3.5,6.5A1.5,1.5,0,1,1,14,6.5,1.5,1.5,0,0,1,15.5,8ZM8,15.5A1.5,1.5,0,1,1,9.5,14,1.5,1.5,0,0,1,8,15.5ZM9.5,9.5A1.5,1.5,0,1,1,8,8,1.5,1.5,0,0,1,9.5,9.5Zm4.5,4A1.5,1.5,0,1,1,12.5,15,1.5,1.5,0,0,1,14,13.5Z"/>
                </svg>
            </button>

            {/* Settings Panel */}
            <div 
                className={`fixed bottom-0 left-0 right-0 z-[200] transform transition-all duration-500 ease-in-out ${isPanelOpen ? 'translate-y-0' : 'translate-y-full'}`}
                role="dialog"
                aria-live="polite"
                aria-label="Cookie-Einstellungen"
                hidden={!isPanelOpen}
            >
                <div className="fixed inset-0 bg-black/30" onClick={() => setIsPanelOpen(false)}></div>
                 <div className="relative max-w-2xl mx-auto mb-6 bg-slate-50 rounded-2xl shadow-2xl border border-slate-200 p-6">
                    <h2 className="text-xl font-bold text-slate-800">Cookie-Einstellungen</h2>
                    <p className="text-sm text-slate-600 mt-2 mb-6">
                        Wir verwenden Cookies, um Ihr Surferlebnis zu verbessern. Sie haben die volle Kontrolle über Ihre Daten.
                    </p>
                    <div className="space-y-4">
                        <Toggle 
                            label="Notwendige Cookies"
                            description="Diese Cookies sind für die Grundfunktion der Webseite erforderlich und können nicht deaktiviert werden."
                            checked={true}
                            onChange={() => {}}
                            disabled={true}
                        />
                        <Toggle 
                            label="Analyse & Statistik"
                            description="Diese Cookies helfen uns zu verstehen, wie Besucher unsere Webseite nutzen, um sie stetig zu verbessern (z.B. Google Analytics)."
                            checked={consent.analytics}
                            onChange={(val) => handleToggle('analytics', val)}
                        />
                        <Toggle 
                            label="Marketing & Personalisierung"
                            description="Diese Cookies werden verwendet, um Ihnen relevantere Werbung und Inhalte auf anderen Plattformen anzuzeigen."
                            checked={consent.marketing}
                            onChange={(val) => handleToggle('marketing', val)}
                        />
                    </div>
                    <div className="mt-6 flex flex-col sm:flex-row gap-3">
                        <button onClick={handleSave} className="flex-1 bg-slate-600 hover:bg-slate-700 text-white font-bold py-3 px-6 rounded-lg transition-colors">
                            Einstellungen speichern
                        </button>
                        <button onClick={handleAcceptAll} className="flex-1 bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg transition-colors">
                            Alle akzeptieren
                        </button>
                    </div>
                 </div>
            </div>
        </>
    );
};

export default CookieConsentBanner;