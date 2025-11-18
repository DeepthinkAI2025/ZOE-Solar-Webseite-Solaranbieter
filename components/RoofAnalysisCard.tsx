import React from 'react';
import { RoofAnalysisData } from '../hooks/useAIChatState';

interface RoofAnalysisCardProps {
    imageDataUrl: string;
    analysisData: RoofAnalysisData;
    onConfirm: () => void;
    onReject: () => void;
    t: Record<string, string>;
}

const RoofAnalysisCard: React.FC<RoofAnalysisCardProps> = ({
    imageDataUrl,
    analysisData,
    onConfirm,
    onReject,
    t,
}) => {
    return (
        <div className="space-y-3 text-sm animate-fade-in p-3 bg-slate-100 rounded-2xl">
            <p className="font-semibold text-slate-700">{t.analysisResultPrompt}</p>
            <img
                src={imageDataUrl}
                alt="Satellitenbild des Daches"
                className="rounded-lg border-4 border-white shadow-md"
            />
            <div className="p-3 bg-white rounded-lg border space-y-2">
                <div className="flex justify-between">
                    <span className="text-slate-500">Nutzbare Fläche:</span>
                    <span className="font-bold text-slate-800">ca. {analysisData.usableAreaSqm} m²</span>
                </div>
                <div className="flex justify-between">
                    <span className="text-slate-500">Störelemente:</span>
                    <span className="font-bold text-slate-800">
                        {analysisData.obstructions.join(', ') || 'Keine'}
                    </span>
                </div>
                <div className="flex justify-between">
                    <span className="text-slate-500">Mögliche Module:</span>
                    <span className="font-bold text-slate-800">{analysisData.estimatedModuleCount} Stk.</span>
                </div>
            </div>
            <div className="flex flex-col gap-2 mt-2">
                <button
                    onClick={onConfirm}
                    className="w-full bg-green-600 text-white font-bold py-2.5 px-4 rounded-lg hover:bg-green-700 transition-colors"
                >
                    {t.confirmYes}
                </button>
                <button
                    onClick={onReject}
                    className="w-full bg-slate-200 text-slate-700 font-bold py-2.5 px-4 rounded-lg hover:bg-slate-300 transition-colors"
                >
                    {t.confirmNo}
                </button>
            </div>
        </div>
    );
};

export default React.memo(RoofAnalysisCard);