import React, { useState } from 'react';
import { ConfigurableField } from '../data/services';

interface ConfigSliderProps {
    field: ConfigurableField;
    onConfirm: (value: number) => void;
}

const ConfigSlider: React.FC<ConfigSliderProps> = ({ field, onConfirm }) => {
    const [value, setValue] = useState(field.defaultValue);

    return (
        <div className="space-y-3 text-sm animate-fade-in p-3 bg-slate-100 rounded-2xl">
            <div className="flex justify-between items-center text-sm">
                <label className="font-semibold text-slate-700">{field.label}</label>
                <div className="font-mono font-bold text-green-700 bg-white px-3 py-1 rounded-md border">
                    {value.toLocaleString('de-DE')} {field.unit}
                </div>
            </div>
            <input
                type="range"
                min={field.min}
                max={field.max}
                step={field.step}
                value={value}
                onChange={(e) => setValue(Number(e.target.value))}
                className="w-full h-2 bg-slate-300 rounded-lg appearance-none cursor-pointer accent-green-500"
            />
            <button
                onClick={() => onConfirm(value)}
                className="w-full bg-green-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-green-700 transition-colors text-sm mt-2"
            >
                Bestätigen
            </button>
        </div>
    );
};

export default React.memo(ConfigSlider);
export { ConfigSlider };