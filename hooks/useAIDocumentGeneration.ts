import { useCallback } from 'react';
import { ContactFormData } from '../types';
import { RoofAnalysisData } from './useAIChatState';

interface DocumentData {
    formData: Partial<ContactFormData>;
    roofAnalysisData?: RoofAnalysisData | null;
    messages?: Array<{ sender: string; text?: string; timestamp?: Date }>;
    customContent?: string;
}

interface UseAIDocumentGenerationReturn {
    generatePDFProposal: (data: DocumentData) => Promise<Blob | null>;
    generateSummaryDocument: (data: DocumentData) => Promise<Blob | null>;
    generateChatTranscript: (messages: Array<{ sender: string; text?: string; timestamp?: Date }>) => Promise<Blob | null>;
    downloadDocument: (blob: Blob, filename: string) => void;
}

export const useAIDocumentGeneration = (): UseAIDocumentGenerationReturn => {

    const generatePDFProposal = useCallback(async (data: DocumentData): Promise<Blob | null> => {
        try {
            // This would typically use a PDF library like jsPDF or react-pdf
            // For now, we'll create a simple HTML-based document
            const { formData, roofAnalysisData } = data;

            const htmlContent = `
                <!DOCTYPE html>
                <html>
                <head>
                    <meta charset="utf-8">
                    <title>ZOE Solar - Angebot</title>
                    <style>
                        body { font-family: Arial, sans-serif; line-height: 1.6; margin: 40px; }
                        .header { border-bottom: 3px solid #10b981; padding-bottom: 20px; margin-bottom: 30px; }
                        .logo { font-size: 24px; font-weight: bold; color: #10b981; }
                        .section { margin-bottom: 25px; }
                        .section-title { font-size: 18px; font-weight: bold; margin-bottom: 10px; color: #1f2937; }
                        .field { margin-bottom: 8px; }
                        .label { font-weight: bold; color: #6b7280; }
                        .roof-analysis { background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0; }
                        .footer { margin-top: 40px; padding-top: 20px; border-top: 1px solid #e5e7eb; font-size: 12px; color: #6b7280; }
                    </style>
                </head>
                <body>
                    <div class="header">
                        <div class="logo">ZOE Solar</div>
                        <div>Ihre persönliche Solaranlage-Lösung</div>
                    </div>

                    <div class="section">
                        <div class="section-title">Kundendaten</div>
                        <div class="field"><span class="label">Name:</span> ${formData.contactPerson || 'Nicht angegeben'}</div>
                        <div class="field"><span class="label">E-Mail:</span> ${formData.email || 'Nicht angegeben'}</div>
                        <div class="field"><span class="label">Telefon:</span> ${formData.phone || 'Nicht angegeben'}</div>
                        <div class="field"><span class="label">Projekttyp:</span> ${formData.userType === 'commercial' ? 'Gewerblich' : 'Privat'}</div>
                        <div class="field"><span class="label">Interesse an:</span> ${formData.serviceType || 'Nicht angegeben'}</div>
                    </div>

                    ${roofAnalysisData ? `
                    <div class="roof-analysis">
                        <div class="section-title">Dachanalyse</div>
                        <div class="field"><span class="label">Nutzbare Fläche:</span> ca. ${roofAnalysisData.usableAreaSqm} m²</div>
                        <div class="field"><span class="label">Störelemente:</span> ${roofAnalysisData.obstructions.join(', ') || 'Keine'}</div>
                        <div class="field"><span class="label">Geschätzte Modulanzahl:</span> ${roofAnalysisData.estimatedModuleCount} Stück</div>
                    </div>
                    ` : ''}

                    <div class="section">
                        <div class="section-title">Ihre Anfrage</div>
                        <div class="field">${formData.message || 'Keine zusätzliche Nachricht'}</div>
                    </div>

                    <div class="footer">
                        <div>ZOE Solar GmbH</div>
                        <div>Dieses Dokument wurde automatisch am ${new Date().toLocaleDateString('de-DE')} erstellt.</div>
                    </div>
                </body>
                </html>
            `;

            // Convert HTML to blob (in production, you'd use a proper PDF library)
            const blob = new Blob([htmlContent], { type: 'text/html' });
            return blob;

        } catch (error) {
            console.error('Error generating PDF proposal:', error);
            return null;
        }
    }, []);

    const generateSummaryDocument = useCallback(async (data: DocumentData): Promise<Blob | null> => {
        try {
            const { formData, messages, customContent } = data;

            const htmlContent = `
                <!DOCTYPE html>
                <html>
                <head>
                    <meta charset="utf-8">
                    <title>ZOE Solar - Gesprächszusammenfassung</title>
                    <style>
                        body { font-family: Arial, sans-serif; line-height: 1.6; margin: 40px; }
                        .header { border-bottom: 3px solid #10b981; padding-bottom: 20px; margin-bottom: 30px; }
                        .logo { font-size: 24px; font-weight: bold; color: #10b981; }
                        .message { margin-bottom: 15px; padding: 10px; border-radius: 8px; }
                        .user-message { background-color: #dcfce7; margin-left: 20%; }
                        .ai-message { background-color: #f3f4f6; margin-right: 20%; }
                        .sender { font-weight: bold; margin-bottom: 5px; }
                        .custom-content { background-color: #fef3c7; padding: 20px; border-radius: 8px; margin: 20px 0; }
                    </style>
                </head>
                <body>
                    <div class="header">
                        <div class="logo">ZOE Solar - Gesprächszusammenfassung</div>
                        <div>Kunde: ${formData.contactPerson || 'Unbekannt'}</div>
                        <div>Erstellt am: ${new Date().toLocaleDateString('de-DE')}</div>
                    </div>

                    ${customContent ? `
                    <div class="custom-content">
                        <div class="section-title">Zusammenfassung</div>
                        <div>${customContent}</div>
                    </div>
                    ` : ''}

                    ${messages && messages.length > 0 ? `
                    <div class="section">
                        <div class="section-title">Gesprächsverlauf</div>
                        ${messages.map(msg => `
                            <div class="message ${msg.sender === 'user' ? 'user-message' : 'ai-message'}">
                                <div class="sender">${msg.sender === 'user' ? 'Kunde' : 'ZOE Assistent'}:</div>
                                <div>${msg.text || 'Keine Textnachricht'}</div>
                                ${msg.timestamp ? `<div style="font-size: 12px; color: #6b7280; margin-top: 5px;">${msg.timestamp.toLocaleString('de-DE')}</div>` : ''}
                            </div>
                        `).join('')}
                    </div>
                    ` : ''}

                    <div class="footer">
                        <div>ZOE Solar GmbH - Ihr Partner für Solarlösungen</div>
                    </div>
                </body>
                </html>
            `;

            const blob = new Blob([htmlContent], { type: 'text/html' });
            return blob;

        } catch (error) {
            console.error('Error generating summary document:', error);
            return null;
        }
    }, []);

    const generateChatTranscript = useCallback(async (messages: Array<{ sender: string; text?: string; timestamp?: Date }>): Promise<Blob | null> => {
        try {
            let transcriptContent = `ZOE Solar - Gesprächsprotokoll\n`;
            transcriptContent += `Erstellt am: ${new Date().toLocaleDateString('de-DE')}\n\n`;

            messages.forEach((msg, index) => {
                const sender = msg.sender === 'user' ? 'Kunde' : msg.sender === 'ai' ? 'ZOE Assistent' : 'System';
                const timestamp = msg.timestamp ? `[${msg.timestamp.toLocaleString('de-DE')}] ` : '';
                transcriptContent += `${index + 1}. ${timestamp}${sender}:\n${msg.text || 'Keine Textnachricht'}\n\n`;
            });

            const blob = new Blob([transcriptContent], { type: 'text/plain' });
            return blob;

        } catch (error) {
            console.error('Error generating chat transcript:', error);
            return null;
        }
    }, []);

    const downloadDocument = useCallback((blob: Blob, filename: string) => {
        try {
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = filename;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
        } catch (error) {
            console.error('Error downloading document:', error);
        }
    }, []);

    return {
        generatePDFProposal,
        generateSummaryDocument,
        generateChatTranscript,
        downloadDocument,
    };
};