import React, { useState } from 'react';
import { CustomerData } from '../../data/customerData';

interface DashboardProfileProps {
    user: CustomerData;
}

const ProfileField: React.FC<{ label: string, value: string, isEditing: boolean, onChange: (e: React.ChangeEvent<HTMLInputElement>) => void, name: string }> = ({ label, value, isEditing, onChange, name }) => (
    <div>
        <label className="block text-sm font-medium text-slate-600">{label}</label>
        {isEditing ? (
            <input 
                type="text"
                name={name}
                value={value}
                onChange={onChange}
                className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
            />
        ) : (
            <p className="text-lg text-slate-800 mt-1">{value || '-'}</p>
        )}
    </div>
);

const DashboardProfile: React.FC<DashboardProfileProps> = ({ user }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({ ...user });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSave = () => {
        // Here you would typically send the data to an API
        console.log("Saving data:", formData);
        setIsEditing(false);
        // You might want to update the parent state here if user data is managed in App.tsx
        alert('Profil erfolgreich gespeichert!');
    };

    return (
        <div>
            <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-6 gap-4">
                 <h1 className="text-3xl font-bold text-slate-800">Mein Profil</h1>
                 {!isEditing ? (
                    <button onClick={() => setIsEditing(true)} className="bg-slate-600 text-white font-bold py-2 px-5 rounded-lg hover:bg-slate-700 transition-colors">
                        Daten bearbeiten
                    </button>
                 ) : (
                    <div className="flex gap-2">
                         <button onClick={() => setIsEditing(false)} className="bg-white text-slate-700 font-bold py-2 px-5 rounded-lg border border-slate-300 hover:bg-slate-100 transition-colors">
                            Abbrechen
                        </button>
                        <button onClick={handleSave} className="bg-green-600 text-white font-bold py-2 px-5 rounded-lg hover:bg-green-700 transition-colors">
                            Änderungen speichern
                        </button>
                    </div>
                 )}
            </div>

            <div className="bg-white p-8 rounded-lg shadow-md border border-slate-200">
                <div className="grid md:grid-cols-2 gap-8">
                    <ProfileField label="Vollständiger Name" name="name" value={formData.name} isEditing={isEditing} onChange={handleChange} />
                    <ProfileField label="Firma" name="companyName" value={formData.companyName} isEditing={isEditing} onChange={handleChange} />
                    <ProfileField label="E-Mail-Adresse" name="email" value={formData.email} isEditing={isEditing} onChange={handleChange} />
                    <ProfileField label="Telefonnummer" name="phone" value={formData.phone} isEditing={isEditing} onChange={handleChange} />
                    <div className="md:col-span-2">
                        <ProfileField label="Adresse" name="address" value={formData.address} isEditing={isEditing} onChange={handleChange} />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default DashboardProfile;
