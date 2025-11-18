import React from 'react';
import { ContactFormData } from '../types';

interface ConfirmationFormProps {
    formData: Partial<ContactFormData>;
    onUpdate: (data: Partial<ContactFormData>) => void;
    onSubmit: () => void;
    onBack: () => void;
}

const ConfirmationForm: React.FC<ConfirmationFormProps> = ({ formData, onUpdate, onSubmit, onBack }) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        onUpdate({ ...formData, [e.target.name]: e.target.value });
    };

    return (
        <div className="space-y-3 text-sm animate-fade-in p-3 bg-slate-100 rounded-2xl">
            <div className="p-3 bg-white rounded-lg border">
                <label className="block text-xs font-medium text-slate-500">Name</label>
                <input
                    type="text"
                    name="contactPerson"
                    value={formData.contactPerson || ''}
                    onChange={handleChange}
                    className="w-full bg-transparent font-semibold text-slate-800 focus:outline-none"
                />
            </div>
            <div className="p-3 bg-white rounded-lg border">
                <label className="block text-xs font-medium text-slate-500">E-Mail</label>
                <input
                    type="email"
                    name="email"
                    value={formData.email || ''}
                    onChange={handleChange}
                    className="w-full bg-transparent font-semibold text-slate-800 focus:outline-none"
                />
            </div>
            <div className="p-3 bg-white rounded-lg border">
                <label className="block text-xs font-medium text-slate-500">Telefon</label>
                <input
                    type="tel"
                    name="phone"
                    value={formData.phone || ''}
                    onChange={handleChange}
                    className="w-full bg-transparent font-semibold text-slate-800 focus:outline-none"
                />
            </div>
            <div className="flex gap-2 mt-4">
                <button
                    onClick={onBack}
                    className="flex-1 bg-slate-200 text-slate-700 font-bold py-2 px-4 rounded-lg hover:bg-slate-300 transition-colors text-sm"
                >
                    Zurück
                </button>
                <button
                    onClick={onSubmit}
                    className="flex-1 bg-green-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-green-700 transition-colors text-sm"
                >
                    Anfrage senden
                </button>
            </div>
        </div>
    );
};

export default React.memo(ConfirmationForm);