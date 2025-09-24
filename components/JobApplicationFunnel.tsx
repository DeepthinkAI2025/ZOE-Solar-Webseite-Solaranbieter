import React, { useState, useEffect } from 'react';

interface JobApplicationFunnelProps {
    onClose: () => void;
    jobTitle: string;
}

const FunnelStepper: React.FC<{ currentStep: number; totalSteps: number; steps: string[] }> = ({ currentStep, totalSteps, steps }) => (
    <div className="flex items-center justify-between px-2 mb-8">
        {steps.map((label, index) => {
            const stepNumber = index + 1;
            const isActive = currentStep >= stepNumber;
            return (
                <React.Fragment key={stepNumber}>
                    <div className="flex flex-col items-center text-center w-1/3">
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

const JobApplicationFunnel: React.FC<JobApplicationFunnelProps> = ({ onClose, jobTitle }) => {
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        coverLetter: '',
        cvFile: null as File | null,
        dataPrivacy: false,
    });

    const totalSteps = 3;

    const handleNext = () => setStep(prev => prev + 1);
    const handleBack = () => setStep(prev => prev - 1);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            setFormData(prev => ({ ...prev, cvFile: e.target.files![0] }));
        }
    };
    
    const removeFile = () => {
        setFormData(prev => ({ ...prev, cvFile: null }));
        const fileInput = document.querySelector('input[name="cvFile"]') as HTMLInputElement;
        if (fileInput) {
            fileInput.value = "";
        }
    };

    const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, checked } = e.target;
        setFormData(prev => ({ ...prev, [name]: checked }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log("Submitting Job Application:", { jobTitle, ...formData });
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
                return formData.name && formData.email.includes('@') && formData.phone;
            case 2:
                return true; // CV and cover letter are optional
            case 3:
                return formData.dataPrivacy;
            default:
                return true;
        }
    };

    const inputBaseClasses = "pl-12 block w-full px-4 py-3 bg-slate-800 border border-slate-600 rounded-lg text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500";
    const textareaBaseClasses = "block w-full px-4 py-3 bg-slate-800 border border-slate-600 rounded-lg text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500";


    const renderStepContent = () => {
        switch (step) {
            case 1:
                return (
                    <div className="space-y-6 animate-fade-in">
                        <h3 className="text-2xl font-bold text-slate-800 text-center">Ihre Kontaktdaten</h3>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Vollständiger Name</label>
                            <InputWithIcon icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" /></svg>}>
                                <input type="text" name="name" value={formData.name} onChange={handleChange} required className={inputBaseClasses} />
                            </InputWithIcon>
                        </div>
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
                );
            case 2:
                return (
                     <div className="space-y-6 animate-fade-in">
                        <h3 className="text-2xl font-bold text-slate-800 text-center">Ihre Dokumente</h3>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">Lebenslauf (optional, PDF, max. 5MB)</label>
                            {formData.cvFile ? (
                                <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg">
                                    <span className="text-sm font-semibold text-green-800 truncate">{formData.cvFile.name}</span>
                                    <button onClick={removeFile} type="button" className="text-red-600 hover:text-red-800 font-bold text-lg">&times;</button>
                                </div>
                            ) : (
                                <label className="w-full flex flex-col items-center justify-center px-4 py-6 bg-white text-slate-700 rounded-lg shadow-sm tracking-wide border-2 border-dashed border-slate-300 cursor-pointer hover:border-green-500 hover:text-green-600 transition-colors">
                                    <svg className="w-10 h-10 text-slate-400" fill="currentColor" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M16.88 9.1A4 4 0 0 1 16 17H5a5 5 0 0 1-1-9.9V7a3 3 0 0 1 4.52-2.59A4.98 4.98 0 0 1 17 8c0 .38-.04.74-.12 1.1zM11 11h3l-4 4-4-4h3V3h2v8z" /></svg>
                                    <span className="mt-2 text-base font-semibold">Datei hochladen...</span>
                                    <input type='file' name="cvFile" onChange={handleFileChange} className="hidden" accept=".pdf" />
                                </label>
                            )}
                        </div>
                         <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Anschreiben / Kurze Nachricht (optional)</label>
                            <textarea name="coverLetter" value={formData.coverLetter} onChange={handleChange} rows={6} className={textareaBaseClasses} />
                        </div>
                    </div>
                );
            case 3:
                return (
                    <div className="animate-fade-in text-center">
                        <h3 className="text-2xl font-bold text-slate-800">Fast geschafft!</h3>
                        <p className="text-slate-600 mt-2 mb-6">Bitte bestätigen Sie die Datenschutzbestimmungen, um Ihre Bewerbung abzuschließen.</p>
                        <label className="flex items-start gap-4 cursor-pointer p-4 bg-white rounded-lg border-2 border-slate-200 has-[:checked]:border-green-500 has-[:checked]:bg-green-50 transition-colors">
                            <input type="checkbox" name="dataPrivacy" checked={formData.dataPrivacy} onChange={handleCheckboxChange} required className="h-6 w-6 mt-0.5 text-green-600 border-slate-300 rounded focus:ring-green-500 flex-shrink-0" />
                            <span className="text-sm text-slate-600 text-left">Ich stimme der Verarbeitung meiner Daten zum Zwecke des Bewerbungsprozesses gemäß der <a href="#" onClick={(e) => e.preventDefault()} className="text-green-600 hover:underline">Datenschutzerklärung</a> zu.</span>
                        </label>
                    </div>
                );
            case 4:
                return (
                    <div className="text-center animate-fade-in flex flex-col items-center justify-center h-full">
                         <div className="mx-auto flex items-center justify-center h-20 w-20 rounded-full bg-green-100 mb-5">
                            <svg className="h-12 w-12 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
                        </div>
                        <h3 className="text-2xl font-bold text-slate-800">Bewerbung erfolgreich!</h3>
                        <p className="text-slate-600 mt-2 max-w-md">Vielen Dank für Ihre Bewerbung auf die Stelle als "{jobTitle}". Wir werden Ihre Unterlagen prüfen und uns in Kürze bei Ihnen melden.</p>
                        <button onClick={onClose} className="mt-8 w-full max-w-xs bg-green-600 text-white font-bold py-3 rounded-lg hover:bg-green-700 transition-colors">Schließen</button>
                    </div>
                );
            default: return null;
        }
    };

    return (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 animate-fade-in" role="dialog" aria-modal="true">
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose}></div>
            <div className="relative z-10 w-full max-w-2xl bg-slate-50 rounded-2xl shadow-2xl overflow-hidden flex flex-col h-auto max-h-[90vh]">
                <header className="p-6 border-b border-slate-200 flex justify-between items-center bg-white flex-shrink-0">
                    <div>
                        <h2 className="text-2xl font-bold text-slate-800">Bewerbung</h2>
                        <p className="text-slate-500">Für die Position: {jobTitle}</p>
                    </div>
                    <button onClick={onClose} className="p-1 text-slate-500 hover:text-slate-800" aria-label="Schließen">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                </header>
                
                {step <= totalSteps && (
                    <div className="p-6 flex-shrink-0">
                        <FunnelStepper currentStep={step} totalSteps={totalSteps} steps={['Kontaktdaten', 'Dokumente', 'Abschluss']} />
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

export default JobApplicationFunnel;