import React, { useState } from 'react';
import { Page } from '../types';

interface LoginPageProps {
    onLogin: (email: string) => void;
    setPage: (page: Page) => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLogin, setPage }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        // Simulate network delay
        setTimeout(() => {
            // Mock authentication check
            if ((email === 'kunde@test.de' && password === 'password') || (email === 'demo' && password === 'demo')) {
                onLogin(email);
            } else {
                setError('Ungültige E-Mail-Adresse oder Passwort.');
                setIsLoading(false);
            }
        }, 1000);
    };

    const handleDemoLogin = () => {
        setIsLoading(true);
        setEmail('demo');
        setPassword('demo');
        setTimeout(() => {
            onLogin('demo');
        }, 500); // Shorter delay for demo
    };


    return (
        <div className="py-20 bg-slate-50 min-h-screen flex items-center justify-center">
            <div className="w-full max-w-md">
                <div className="bg-white p-8 md:p-12 rounded-lg shadow-2xl border border-slate-200 form-on-light">
                    <div className="text-center">
                        <div className="font-bold text-slate-900 text-3xl mb-2">
                           ZOE <span className="text-green-500">Solar</span>
                        </div>
                        <h2 className="text-2xl font-bold text-slate-800">Kunden-Portal</h2>
                        <p className="text-slate-500 mt-2">Willkommen zurück.</p>
                    </div>
                    
                    <form onSubmit={handleSubmit} className="mt-8 space-y-6">
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-slate-700">E-Mail-Adresse</label>
                            <input
                                id="email"
                                name="email"
                                type="text"
                                autoComplete="email"
                                required
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                className="mt-1 block w-full px-4 py-3 border border-slate-300 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                                placeholder="z.B. kunde@test.de oder demo"
                            />
                        </div>

                        <div>
                            <label htmlFor="password"  className="block text-sm font-medium text-slate-700">Passwort</label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                autoComplete="current-password"
                                required
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                className="mt-1 block w-full px-4 py-3 border border-slate-300 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                                placeholder="•••••••• oder demo"
                            />
                        </div>

                        {error && <p className="text-sm text-red-600 text-center">{error}</p>}

                        <div>
                            <button 
                                type="submit" 
                                disabled={isLoading}
                                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-lg font-bold text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:bg-slate-400 disabled:cursor-not-allowed transition-all duration-200"
                            >
                                {isLoading ? 'Anmeldung läuft...' : 'Anmelden'}
                            </button>
                        </div>
                        
                        <div className="relative flex items-center">
                            <div className="flex-grow border-t border-slate-300"></div>
                            <span className="flex-shrink mx-4 text-slate-500 text-sm">Oder</span>
                            <div className="flex-grow border-t border-slate-300"></div>
                        </div>

                        <div>
                            <button
                                type="button"
                                onClick={handleDemoLogin}
                                disabled={isLoading}
                                className="w-full flex justify-center items-center gap-2 py-3 px-4 border border-slate-300 rounded-md shadow-sm text-base font-bold text-slate-700 bg-white hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:bg-slate-200 disabled:cursor-not-allowed transition-colors"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M18 8a6 6 0 11-12 0 6 6 0 0112 0zM7 8a1 1 0 11-2 0 1 1 0 012 0zm9 0a1 1 0 11-2 0 1 1 0 012 0z" clipRule="evenodd" /><path d="M5.5 16a3.5 3.5 0 016-1.414 3.5 3.5 0 016 1.414 1 1 0 01-1.828.53A1.5 1.5 0 0013 16h-2a1.5 1.5 0 00-1.672.53 1 1 0 01-1.828-.53z" /></svg>
                                Als Demo-Benutzer anmelden
                            </button>
                        </div>
                    </form>

                     <p className="mt-6 text-center text-sm text-slate-500">
                        Noch kein Kunde?{' '}
                        <a onClick={() => document.dispatchEvent(new CustomEvent('open-chat'))} className="font-medium text-green-600 hover:text-green-500 cursor-pointer">
                            Starten Sie hier Ihre Anfrage.
                        </a>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;