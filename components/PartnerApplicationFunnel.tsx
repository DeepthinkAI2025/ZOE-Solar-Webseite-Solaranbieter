import React, { useState, useEffect } from 'react';

interface PartnerApplicationFunnelProps {
    onClose: () => void;
}

const bundeslaender = [
    "Baden-Württemberg", "Bayern", "Berlin", "Brandenburg", "Bremen", "Hamburg",
    "Hessen", "Mecklenburg-Vorpommern", "Niedersachsen", "Nordrhein-Westfalen",
    "Rheinland-Pfalz", "Saarland", "Sachsen", "Sachsen-Anhalt", "Schleswig-Holstein", "Thüringen"
];

const FunnelStepper: React.FC<{ currentStep: number; totalSteps: number; steps: string[] }> = ({ currentStep, totalSteps, steps }) => (
    <div className="flex items-center justify-between px-2 mb-8">
        {steps.map((label, index) => {
            const stepNumber = index + 1;
            const isActive = currentStep >= stepNumber;
            return (
                <React.Fragment key={stepNumber}>
                    <div className="flex flex-col items-center text-center w-1/4">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300 font-bold ${isActive ? 'bg-green-600 border-green-600 text-white' : 'bg-white border-slate-300 text-slate-500'}`}>
                            {currentStep > stepNumber ? '✓' : stepNumber}
                        </div>
                        <p className={`mt-2 text-xs font-semibold transition-colors duration-300 ${isActive ? 'text-green-700' : 'text-slate-500'}`}>{label}</p>
                    </div>
                    {stepNumber < totalSteps && <div className={`flex-1 h-1 mx-2 transition-colors duration-300 ${currentStep > stepNumber ? 'bg-green-600' : 'bg-slate-200'}`}></div>}
                </React.Fragment>
            );
        })}
    </div>
);

const InputWithIcon: React.FC<{ icon: React.ReactNode; children: React.ReactNode }> = ({ icon, children }) => (
    <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
            {icon}
        </div>
        {children}
    </div>
);


const PartnerApplicationFunnel: React.FC<PartnerApplicationFunnelProps> = ({ onClose }) => {
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        companyName: '',
        contactPerson: '',
        email: '',
        phone: '',
        specialization: '',
        states: [] as string[],
        employees: '',
        experience: '',
    });

    const totalSteps = 4;

    const handleNext = () => setStep(prev => prev + 1);
    const handleBack = () => setStep(prev => prev - 1);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };
    
    const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { value, checked } = e.target;
        setFormData(prev => {
            const newStates = checked
                ? [...prev.states, value]
                : prev.states.filter(state => state !== value);
            return { ...prev, states: newStates };
        });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log("Submitting Partner Application:", formData);
        setStep(totalSteps + 1);
    };
    
    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                onClose();
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [onClose]);

    const isStepValid = () => {
        switch (step) {
            case 1:
                return formData.companyName && formData.contactPerson && formData.email.includes('@') && formData.phone;
            case 2:
                return !!formData.specialization;
            case 3:
                return formData.states.length > 0;
            case 4:
                return formData.employees && formData.experience;
            default:
                return true;
        }
    };

    const inputBaseClasses = "pl-12 block w-full px-4 py-3 bg-slate-800 border border-slate-600 rounded-lg text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500";


    const renderStepContent = () => {
        switch (step) {
            case 1:
                return (
                    <div className="space-y-6 animate-fade-in">
                        <h3 className="text-2xl font-bold text-slate-800 text-center">Ihre Kontaktdaten</h3>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Firma</label>
                            <InputWithIcon icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a1 1 0 110 2h-3a1 1 0 01-1-1v-2a1 1 0 00-1-1H9a1 1 0 00-1 1v2a1 1 0 01-1 1H4a1 1 0 110-2V4zm3 1h2v2H7V5zm2 4H7v2h2V9zm2-4h2v2h-2V5zm2 4h-2v2h2V9z" clipRule="evenodd" /></svg>}>
                                <input type="text" name="companyName" value={formData.companyName} onChange={handleChange} required className={inputBaseClasses} />
                            </InputWithIcon>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Ansprechpartner</label>
                             <InputWithIcon icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" /></svg>}>
                                <input type="text" name="contactPerson" value={formData.contactPerson} onChange={handleChange} required className={inputBaseClasses} />
                            </InputWithIcon>
                        </div>
                         <div className="grid sm:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">E-Mail</label>
                                <InputWithIcon icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" /><path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" /></svg>}>
                                    <input type="email" name="email" value={formData.email} onChange={handleChange} required className={inputBaseClasses} />
                                </InputWithIcon>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Telefon</label>
                                <InputWithIcon icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" /></svg>}>
                                    <input type="tel" name="phone" value={formData.phone} onChange={handleChange} required className={inputBaseClasses} />
                                </InputWithIcon>
                            </div>
                        </div>
                    </div>
                );
            case 2:
                return (
                    <div className="animate-fade-in">
                        <h3 className="text-2xl font-bold text-slate-800 mb-6 text-center">Was ist Ihr Fachbereich?</h3>
                        <div className="grid sm:grid-cols-3 gap-4">
                            {[
                                { val: 'Elektroinstallation (AC)', label: 'Elektro (AC)' },
                                { val: 'Dachmontage (DC)', label: 'Montage (DC)' },
                                { val: 'Beides', label: 'Beides' }
                            ].map(option => (
                                <label key={option.val} className={`p-6 border-2 rounded-xl cursor-pointer flex flex-col items-center justify-center text-center transition-colors ${formData.specialization === option.val ? 'bg-green-50 border-green-500' : 'bg-white hover:bg-slate-100'}`}>
                                    <input type="radio" name="specialization" value={option.val} checked={formData.specialization === option.val} onChange={handleChange} className="sr-only" />
                                    <span className="font-bold text-lg text-slate-800">{option.label}</span>
                                </label>
                            ))}
                        </div>
                    </div>
                );
            case 3:
                return (
                    <div className="animate-fade-in">
                        <h3 className="text-2xl font-bold text-slate-800 mb-6 text-center">In welchen Bundesländern sind Sie tätig?</h3>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 max-h-72 overflow-y-auto pr-2 bg-white p-4 rounded-lg border border-slate-200">
                            {bundeslaender.map(state => (
                                <label key={state} className={`p-3 border rounded-md cursor-pointer text-sm flex items-center transition-colors has-[:checked]:bg-green-50 has-[:checked]:border-green-500 ${formData.states.includes(state) ? 'bg-green-50 border-green-500' : 'bg-white hover:bg-slate-100'}`}>
                                    <input type="checkbox" value={state} checked={formData.states.includes(state)} onChange={handleCheckboxChange} className="h-4 w-4 text-green-600 border-slate-300 rounded focus:ring-green-500" />
                                    <span className="ml-2 text-slate-700">{state}</span>
                                </label>
                            ))}
                        </div>
                    </div>
                );
            case 4:
                return (
                    <div className="space-y-6 animate-fade-in">
                        <h3 className="text-2xl font-bold text-slate-800 text-center">Firmengröße & Erfahrung</h3>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Anzahl der Mitarbeiter</label>
                            <select name="employees" value={formData.employees} onChange={handleChange} required className="block w-full px-4 py-3 border border-slate-300 rounded-lg shadow-sm">
                                <option value="">Bitte wählen</option>
                                <option value="1-5">1 - 5</option>
                                <option value="6-10">6 - 10</option>
                                <option value="11-20">11 - 20</option>
                                <option value="21-50">21 - 50</option>
                                <option value="50+">50+</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Jahre Erfahrung in der Solarbranche</label>
                            <input type="number" name="experience" min="0" step="1" value={formData.experience} onChange={handleChange} required className="block w-full px-4 py-3 border border-slate-300 rounded-lg shadow-sm" />
                        </div>
                    </div>
                );
            case 5:
                return (
                     <div className="text-center animate-fade-in flex flex-col items-center justify-center h-full">
                         <div className="mx-auto flex items-center justify-center h-20 w-20 rounded-full bg-green-100 mb-5">
                            <svg className="h-12 w-12 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
                        </div>
                        <h3 className="text-2xl font-bold text-slate-800">Bewerbung erfolgreich!</h3>
                        <p className="text-slate-600 mt-2 max-w-md">Vielen Dank für Ihr Interesse an einer Partnerschaft. Wir werden Ihre Angaben prüfen und uns in Kürze bei Ihnen melden.</p>
                        <button onClick={onClose} className="mt-8 w-full max-w-xs bg-green-600 text-white font-bold py-3 rounded-lg hover:bg-green-700 transition-colors">Schließen</button>
                    </div>
                );
            default:
                return null;
        }
    };
    
    return (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 animate-fade-in" role="dialog" aria-modal="true">
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose}></div>
            <div className="relative z-10 w-full max-w-2xl bg-slate-50 rounded-2xl shadow-2xl overflow-hidden flex flex-col h-auto max-h-[90vh]">
                <header className="p-6 border-b border-slate-200 flex justify-between items-center bg-white flex-shrink-0">
                    <h2 className="text-2xl font-bold text-slate-800">Partner-Bewerbung</h2>
                     <button onClick={onClose} className="p-1 text-slate-500 hover:text-slate-800" aria-label="Schließen">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                </header>
                
                {step <= totalSteps && (
                    <div className="p-6 flex-shrink-0">
                        <FunnelStepper currentStep={step} totalSteps={totalSteps} steps={['Kontakt', 'Fachbereich', 'Gebiet', 'Details']} />
                    </div>
                )}

                <main className="p-8 flex-grow overflow-y-auto min-h-[400px]">
                    <form onSubmit={handleSubmit}>
                        {renderStepContent()}
                    </form>
                </main>
                
                {step <= totalSteps && (
                    <footer className="p-6 bg-white border-t border-slate-200 flex justify-between items-center flex-shrink-0">
                        <button type="button" onClick={handleBack} disabled={step === 1} className="bg-slate-200 text-slate-700 font-bold py-3 px-6 rounded-lg hover:bg-slate-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
                            Zurück
                        </button>
                        {step < totalSteps ? (
                             <button type="button" onClick={handleNext} disabled={!isStepValid()} className="bg-green-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-green-700 disabled:bg-slate-400 disabled:cursor-not-allowed transition-colors">
                                Weiter
                            </button>
                        ) : (
                             <button type="submit" onClick={handleSubmit} disabled={!isStepValid()} className="bg-green-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-green-700 disabled:bg-slate-400 disabled:cursor-not-allowed transition-colors">
                                Bewerbung absenden
                            </button>
                        )}
                    </footer>
                )}
            </div>
        </div>
    );
};
export default PartnerApplicationFunnel;