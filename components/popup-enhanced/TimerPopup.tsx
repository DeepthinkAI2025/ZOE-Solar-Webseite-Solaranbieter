import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface TimerPopupProps {
  isVisible: boolean;
  onClose: () => void;
  onAction: (type: 'consultation' | 'ai-chat' | 'callback') => void;
}

const TimerPopup: React.FC<TimerPopupProps> = ({ isVisible, onClose, onAction }) => {
  const [timeLeft, setTimeLeft] = useState(30);
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [name, setName] = useState('');
  const [selectedAction, setSelectedAction] = useState<'consultation' | 'ai-chat' | 'callback'>('consultation');
  const [step, setStep] = useState(1);

  // 30-Sekunden Countdown Timer
  useEffect(() => {
    if (!isVisible || timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [isVisible, timeLeft]);

  // Tracking für Popup-Anzeige
  useEffect(() => {
    if (isVisible) {
      // Analytics Track
      if (typeof window !== 'undefined' && window.gtag) {
        window.gtag('event', 'popup_show', {
          event_category: 'conversion',
          event_label: '30_second_timer_popup',
          value: 1
        });
      }
    }
  }, [isVisible]);

  const handleAction = useCallback((action: 'consultation' | 'ai-chat' | 'callback') => {
    setSelectedAction(action);

    // Analytics Track
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'popup_action_click', {
        event_category: 'conversion',
        event_label: `timer_popup_${action}`,
        value: 1
      });
    }

    if (action === 'ai-chat') {
      onAction('ai-chat');
      onClose();
    } else {
      setStep(2);
    }
  }, [onAction, onClose]);

  const handleFormSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !name) {
      alert('Bitte füllen Sie alle Pflichtfelder aus.');
      return;
    }

    // Analytics Track
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'popup_form_submit', {
        event_category: 'conversion',
        event_label: `timer_popup_${selectedAction}_form`,
        value: 1
      });
    }

    // Speichere Lead in Local Storage für spätere Verarbeitung
    const leadData = {
      name,
      email,
      phone,
      action: selectedAction,
      timestamp: new Date().toISOString(),
      source: '30_second_timer_popup'
    };

    const existingLeads = JSON.parse(localStorage.getItem('zoe_solar_leads') || '[]');
    existingLeads.push(leadData);
    localStorage.setItem('zoe_solar_leads', JSON.stringify(existingLeads));

    onAction(selectedAction);
    onClose();
  }, [email, phone, name, selectedAction, onAction, onClose]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          transition={{ type: "spring", duration: 0.5 }}
          className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header mit Countdown */}
          <div className="relative bg-gradient-to-r from-green-600 to-emerald-600 text-white p-6 text-center">
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-white/80 hover:text-white transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Countdown Timer */}
            <div className="mb-4">
              <div className="text-sm font-medium mb-2">Zeitbegrenztes Angebot</div>
              <div className={`text-4xl font-bold ${timeLeft <= 10 ? 'text-red-300 animate-pulse' : ''}`}>
                {formatTime(timeLeft)}
              </div>
            </div>

            <h2 className="text-2xl font-bold mb-2">
              {step === 1 ? 'Kostenlose Solar-Analyse' : 'Ihre persönlichen Daten'}
            </h2>
            <p className="text-green-100">
              {step === 1
                ? 'Sichern Sie sich jetzt Ihre kostenlose Solarberatung!'
                : 'Geben Sie Ihre Daten ein und wir melden uns sofort bei Ihnen!'
              }
            </p>
          </div>

          {/* Content */}
          <div className="p-6">
            {step === 1 ? (
              /* Step 1: Action Selection */
              <div className="space-y-4">
                <div className="text-center mb-6">
                  <p className="text-gray-600 mb-4">
                    Wählen Sie, wie Sie von unserem Experten-Team profitieren möchten:
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="space-y-3">
                  <button
                    onClick={() => handleAction('consultation')}
                    className="w-full p-4 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl hover:from-green-600 hover:to-green-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="bg-white/20 p-2 rounded-lg">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                        </svg>
                      </div>
                      <div className="text-left">
                        <div className="font-semibold">Persönliche Beratung</div>
                        <div className="text-sm opacity-90">Rufen Sie mich zurück</div>
                      </div>
                    </div>
                  </button>

                  <button
                    onClick={() => handleAction('ai-chat')}
                    className="w-full p-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="bg-white/20 p-2 rounded-lg">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                        </svg>
                      </div>
                      <div className="text-left">
                        <div className="font-semibold">☀️ KI-Solar-Assistent</div>
                        <div className="text-sm opacity-90">Sofortige Analyse im Chat</div>
                      </div>
                    </div>
                  </button>

                  <button
                    onClick={() => handleAction('callback')}
                    className="w-full p-4 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl hover:from-orange-600 hover:to-red-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="bg-white/20 p-2 rounded-lg">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <div className="text-left">
                        <div className="font-semibold">Rückruf vereinbaren</div>
                        <div className="text-sm opacity-90">Wunschzeitpunkt auswählen</div>
                      </div>
                    </div>
                  </button>
                </div>

                {/* Trust Indicators */}
                <div className="pt-4 border-t border-gray-200">
                  <div className="flex items-center justify-center space-x-6 text-sm text-gray-500">
                    <div className="flex items-center space-x-1">
                      <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span>Kostenlos & unverbindlich</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span>Experten-Beratung</span>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              /* Step 2: Form */
              <form onSubmit={handleFormSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Ihr Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Max Mustermann"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    E-Mail-Adresse <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="max@example.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Telefonnummer (optional)
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="+49 123 456789"
                  />
                </div>

                <div className="pt-4">
                  <button
                    type="submit"
                    className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white py-3 rounded-lg hover:from-green-700 hover:to-emerald-700 transition-all duration-300 shadow-lg hover:shadow-xl font-semibold"
                  >
                    {selectedAction === 'consultation' ? 'Beratung anfordern' :
                     selectedAction === 'callback' ? 'Rückruf vereinbaren' : 'Chat starten'}
                  </button>
                </div>
              </form>
            )}

            {/* Step Navigation */}
            {step === 2 && (
              <button
                onClick={() => setStep(1)}
                className="mt-4 text-center w-full text-gray-500 hover:text-gray-700 text-sm"
              >
                ← Zurück zur Auswahl
              </button>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default TimerPopup;