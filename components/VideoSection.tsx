import React from 'react';
import PromoVideo from './PromoVideo';

const VideoSection: React.FC = () => {
  return (
    <section id="video" className="py-20 bg-slate-50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-12 max-w-4xl mx-auto">
          <p className="font-bold text-green-600 uppercase tracking-wider">Unsere Vision</p>
          <h2 className="text-4xl lg:text-5xl font-bold text-slate-900 mt-2">Einzigartig. Dynamisch. Für Sie generiert.</h2>
          <p className="text-lg text-slate-600 mt-4">
            Sehen Sie selbst, wie ZOE Solar die Energiewende für Unternehmen vorantreibt. Klicken Sie, um mit der Gemini-Video-API ein einzigartiges Video zu generieren, das unsere Werte und Vorteile zeigt.
          </p>
        </div>
        <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-2xl overflow-hidden border border-slate-200">
            <PromoVideo />
        </div>
      </div>
    </section>
  );
};

export default VideoSection;