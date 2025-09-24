import React, { useState, useEffect, useRef } from 'react';
// FIX: Import ContactInfo and ContactAddress from types.ts to avoid redefinition.
import { ContactFormData, ContactInfo, ContactAddress } from '../types';
import { sendInquiryToFapro } from '../services/faproService';

// Add SpeechRecognition types for window
declare global {
    interface Window {
        SpeechRecognition: any;
        webkitSpeechRecognition: any;
    }
}


const ContactForm: React.FC = () => {
    const [formData, setFormData] = useState<Partial<ContactFormData>>({
        userType: 'commercial',
        serviceType: 'Photovoltaik Gewerbe',
        projectStatus: 'Information',
        dataPrivacy: false,
    });
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    const [message, setMessage] = useState('');
    const [isContactPickerSupported, setIsContactPickerSupported] = useState(false);
    const [isVoiceInputSupported, setIsVoiceInputSupported] = useState(false);
    const [isListening, setIsListening] = useState(false);
    const [activeField, setActiveField] = useState<keyof ContactFormData | null>(null);
    const recognitionRef = useRef<any | null>(null);

    useEffect(() => {
        if ('contacts' in navigator && 'ContactsManager' in window) {
            setIsContactPickerSupported(true);
        }
        
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (SpeechRecognition) {
            setIsVoiceInputSupported(true);
            const recognition = new SpeechRecognition();
            recognition.continuous = false;
            recognition.lang = 'de-DE';
            recognition.interimResults = false;

            recognition.onstart = () => {
                setIsListening(true);
            };
            
            recognition.onerror = (event: any) => {
                console.error('Speech recognition error', event.error);
                setIsListening(false);
                setActiveField(null);
            };

            recognition.onend = () => {
                setIsListening(false);
                setActiveField(null);
            };

            recognitionRef.current = recognition;
        }
    }, []);

    useEffect(() => {
        const recognition = recognitionRef.current;
        if (!recognition || !activeField) return;

        recognition.onresult = (event: any) => {
            const transcript = event.results[0][0].transcript.trim();
            if (activeField) {
                let finalTranscript = transcript;
                if (activeField === 'email') {
                    finalTranscript = finalTranscript.replace(/\s/g, '').toLowerCase();
                }
                setFormData(prev => ({ ...prev, [activeField]: finalTranscript }));
            }
        };
    }, [activeField]);

    const handleToggleListening = (fieldName: keyof ContactFormData) => {
        if (isListening && activeField === fieldName) {
            recognitionRef.current?.stop();
        } else {
            if(isListening) {
                recognitionRef.current?.stop();
            }
            setActiveField(fieldName);
            recognitionRef.current?.start();
        }
    };

    const handlePickContact = async () => {
        const props: (keyof ContactInfo)[] = ['name', 'email', 'tel', 'address'];
        const opts = { multiple: false };

        try {
            const contacts = await (navigator as any).contacts.select(props, opts);
            if (!contacts || contacts.length === 0) {
                return;
            }
            const contact = contacts[0];
            
            const newFormData: Partial<ContactFormData> = {};

            if (contact.name && contact.name.length > 0) newFormData.contactPerson = contact.name[0];
            if (contact.email && contact.email.length > 0) newFormData.email = contact.email[0];
            if (contact.tel && contact.tel.length > 0) newFormData.phone = contact.tel[0];
            if (contact.address && contact.address.length > 0) {
                const addr = contact.address[0];
                const addressParts = [
                    ...(addr.addressLine || []),
                    `${addr.postalCode || ''} ${addr.city || ''}`.trim()
                ];
                const formattedAddress = addressParts.filter(Boolean).join(', ');
                
                if (formattedAddress) newFormData.address = formattedAddress;
                if (addr.organization) newFormData.companyName = addr.organization;
            }

            setFormData(prev => ({ ...prev, ...newFormData }));

        } catch (ex) {
            console.error('Error picking contact:', ex);
            setStatus('error');
            setMessage('Kontaktdaten konnten nicht geladen werden. Bitte füllen Sie die Felder manuell aus.');
        }
    };


    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;
        if (type === 'checkbox') {
            const { checked } = e.target as HTMLInputElement;
            setFormData(prev => ({ ...prev, [name]: checked }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.dataPrivacy) {
            setStatus('error');
            setMessage('Bitte stimmen Sie der Datenschutzerklärung zu.');
            return;
        }
        
        setStatus('loading');
        setMessage('');

        try {
            // Remove dataPrivacy before sending to API
            const { dataPrivacy, ...dataToSend } = formData;
            const result = await sendInquiryToFapro(dataToSend as Omit<ContactFormData, 'dataPrivacy'>);
            setStatus('success');
            setMessage(result.message);
        } catch (error) {
            setStatus('error');
            console.error("Fehler beim Senden des Formulars:", error);
            setMessage('Ihre Anfrage konnte leider nicht gesendet werden. Bitte überprüfen Sie Ihre Eingaben und versuchen Sie es später erneut.');
        }
    };

    if (status === 'success') {
        return (
            <div className="bg-green-50 border-2 border-dashed border-green-200 p-8 rounded-lg text-center">
                <h3 className="text-2xl font-bold text-green-800 mb-3">Vielen Dank!</h3>
                <p className="text-green-700">{message}</p>
                <p className="text-green-700 mt-2">Ein Experte wird sich in Kürze bei Ihnen melden.</p>
            </div>
        );
    }
    
    const baseInputClasses = "block w-full px-4 py-3 border border-slate-300 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm";

    const VoiceInputButton: React.FC<{ fieldName: keyof ContactFormData, className?: string }> = ({ fieldName, className = '' }) => {
        if (!isVoiceInputSupported) return null;

        const isActive = isListening && activeField === fieldName;

        return (
            <button
                type="button"
                onClick={() => handleToggleListening(fieldName)}
                className={`absolute p-2 rounded-full transition-colors z-10 ${isActive ? 'bg-red-500 text-white animate-pulse' : 'text-slate-400 hover:bg-slate-100'} ${className}`}
                aria-label={`Spracheingabe für ${fieldName} ${isActive ? 'stoppen' : 'starten'}`}
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4zm4 10.93A7.001 7.001 0 0017 8a1 1 0 10-2 0A5 5 0 017 8a1 1 0 10-2 0 7.001 7.001 0 006 6.93V17H9a1 1 0 100 2h2a1 1 0 100-2h-1v-2.07z" clipRule="evenodd" />
                </svg>
            </button>
        );
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {isContactPickerSupported && (
                 <div className="mb-4">
                    <button
                        type="button"
                        onClick={handlePickContact}
                        className="w-full flex items-center justify-center gap-2 px-4 py-3 border-2 border-dashed border-slate-300 rounded-md text-slate-600 hover:border-green-500 hover:bg-green-50 hover:text-green-700 transition-all duration-200"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                           <path d="M8 9a3 3 0 100-6 3 3 0 000 6z" />
                           <path fillRule="evenodd" d="M1.646 13.854a.5.5 0 00.708 0L8 8.207l5.646 5.647a.5.5 0 00.708-.708l-6-6a.5.5 0 00-.708 0l-6 6a.5.5 0 000 .708z" clipRule="evenodd" />
                           <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zM6 8a2 2 0 100-4 2 2 0 000 4zM1.139 12.392a.5.5 0 01.707 0L8 18.586l6.155-6.194a.5.5 0 01.707.707l-6.5 6.5a.5.5 0 01-.707 0l-6.5-6.5a.5.5 0 010-.707z" clipRule="evenodd" />
                           <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                        </svg>
                        <span className="font-semibold">Aus Kontakten übernehmen</span>
                    </button>
                    <div className="relative flex items-center my-4">
                        <div className="flex-grow border-t border-slate-200"></div>
                        <span className="flex-shrink mx-4 text-slate-400 text-xs font-semibold">ODER MANUELL AUSFÜLLEN</span>
                        <div className="flex-grow border-t border-slate-200"></div>
                    </div>
                </div>
            )}
            <fieldset>
                <legend className="block text-sm font-medium text-slate-700 mb-2">Ich bin...</legend>
                 <div className="grid grid-cols-2 gap-2">
                    <label className={`p-3 border rounded-md cursor-pointer text-center text-sm font-semibold ${formData.userType === 'commercial' ? 'bg-green-50 border-green-500 ring-2 ring-green-200' : 'bg-white'}`}>
                        <input type="radio" name="userType" value="commercial" checked={formData.userType === 'commercial'} onChange={handleChange} className="sr-only" />
                        Gewerbekunde
                    </label>
                    <label className={`p-3 border rounded-md cursor-pointer text-center text-sm font-semibold ${formData.userType === 'private' ? 'bg-green-50 border-green-500 ring-2 ring-green-200' : 'bg-white'}`}>
                        <input type="radio" name="userType" value="private" checked={formData.userType === 'private'} onChange={handleChange} className="sr-only" />
                        Privatkunde
                    </label>
                </div>
            </fieldset>

            {formData.userType === 'commercial' && (
                <div>
                    <label htmlFor="companyName" className="block text-sm font-medium text-slate-700">Firma (optional)</label>
                    <div className="relative mt-1">
                        <input type="text" name="companyName" id="companyName" value={formData.companyName || ''} onChange={handleChange} autoComplete="organization" className={`${baseInputClasses} pr-12`} />
                        <VoiceInputButton fieldName="companyName" className="right-3 top-1/2 -translate-y-1/2" />
                    </div>
                </div>
            )}
            
            <div>
                <label htmlFor="contactPerson" className="block text-sm font-medium text-slate-700">Vollständiger Name</label>
                 <div className="relative mt-1">
                    <input type="text" name="contactPerson" id="contactPerson" value={formData.contactPerson || ''} onChange={handleChange} required autoComplete="name" className={`${baseInputClasses} pr-12`} />
                    <VoiceInputButton fieldName="contactPerson" className="right-3 top-1/2 -translate-y-1/2" />
                </div>
            </div>
            
            <div className="grid sm:grid-cols-2 gap-6">
                 <div>
                    <label htmlFor="email" className="block text-sm font-medium text-slate-700">E-Mail</label>
                    <div className="relative mt-1">
                        <input type="email" name="email" id="email" value={formData.email || ''} onChange={handleChange} required autoComplete="email" className={`${baseInputClasses} pr-12`} />
                        <VoiceInputButton fieldName="email" className="right-3 top-1/2 -translate-y-1/2" />
                    </div>
                </div>
                <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-slate-700">Telefon</label>
                    <div className="relative mt-1">
                        <input type="tel" name="phone" id="phone" value={formData.phone || ''} onChange={handleChange} required autoComplete="tel" className={`${baseInputClasses} pr-12`} />
                        <VoiceInputButton fieldName="phone" className="right-3 top-1/2 -translate-y-1/2" />
                    </div>
                </div>
            </div>

            <div>
                <label htmlFor="address" className="block text-sm font-medium text-slate-700">Projekt-Adresse</label>
                <div className="relative mt-1">
                    <input type="text" name="address" id="address" value={formData.address || ''} onChange={handleChange} autoComplete="street-address" placeholder="Straße, Nr, PLZ, Ort" className={`${baseInputClasses} pr-12`} />
                    <VoiceInputButton fieldName="address" className="right-3 top-1/2 -translate-y-1/2" />
                </div>
            </div>

            <div>
                <label htmlFor="message" className="block text-sm font-medium text-slate-700">Ihre Nachricht (optional)</label>
                <div className="relative mt-1">
                    <textarea name="message" id="message" value={formData.message || ''} rows={4} onChange={handleChange} className={baseInputClasses}></textarea>
                    <VoiceInputButton fieldName="message" className="right-3 top-3" />
                </div>
            </div>

            <div>
                <label className="flex items-start gap-3 cursor-pointer">
                    <input type="checkbox" name="dataPrivacy" checked={!!formData.dataPrivacy} onChange={handleChange} className="h-5 w-5 mt-0.5 text-green-600 border-slate-300 rounded focus:ring-green-500" />
                    <span className="text-sm text-slate-600">Ich stimme der Verarbeitung meiner Daten gemäß der <a href="#" onClick={(e) => e.preventDefault()} className="text-green-600 hover:underline">Datenschutzerklärung</a> zu.</span>
                </label>
            </div>

            {status === 'error' && <div role="alert"><p className="text-sm text-red-600 text-center">{message}</p></div>}

            <div>
                <button 
                    type="submit" 
                    disabled={status === 'loading'}
                    className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-lg font-bold text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:bg-slate-400 disabled:cursor-not-allowed"
                >
                    {status === 'loading' ? 'Anfrage wird gesendet...' : 'Kostenlose Analyse anfordern'}
                </button>
            </div>
        </form>
    );
};

export default ContactForm;