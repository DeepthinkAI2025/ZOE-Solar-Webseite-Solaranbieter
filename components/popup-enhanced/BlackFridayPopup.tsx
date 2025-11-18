import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface BlackFridayPopupProps {
  isVisible: boolean;
  onClose: () => void;
  onAction: (type: 'claim-deal' | 'get-quote') => void;
}

const BlackFridayPopup: React.FC<BlackFridayPopupProps> = ({ isVisible, onClose, onAction }) => {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [company, setCompany] = useState('');
  const [phone, setPhone] = useState('');
  const [step, setStep] = useState(1);
  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  function calculateTimeLeft() {
    const now = new Date();
    const blackFridayEnd = new Date('2025-11-11T23:59:59');
    const difference = blackFridayEnd.getTime() - now.getTime();

    if (difference > 0) {
      return {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60)
      };
    }

    return { days: 0, hours: 0, minutes: 0, seconds: 0 };
  }

  // Countdown Timer
  useEffect(() => {
    if (!isVisible) return;

    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, [isVisible]);

  // Tracking für Popup-Anzeige
  useEffect(() => {
    if (isVisible) {
      // Analytics Track
      if (typeof window !== 'undefined' && window.gtag) {
        window.gtag('event', 'popup_show', {
          event_category: 'conversion',
          event_label: 'black_friday_exit_intent_popup',
          value: 1
        });
      }
    }
  }, [isVisible]);

  const handleAction = useCallback((action: 'claim-deal' | 'get-quote') => {
    setStep(2);

    // Analytics Track
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'popup_action_click', {
        event_category: 'conversion',
        event_label: `black_friday_popup_${action}`,
        value: 1
      });
    }
  }, []);

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
        event_label: 'black_friday_popup_form_submit',
        value: 1
      });
    }

    // Speichere Lead in Local Storage für spätere Verarbeitung
    const leadData = {
      name,
      email,
      company,
      phone,
      action: 'black_friday_deal',
      timestamp: new Date().toISOString(),
      source: 'black_friday_exit_intent_popup',
      discount: '20%'
    };

    const existingLeads = JSON.parse(localStorage.getItem('zoe_solar_leads') || '[]');
    existingLeads.push(leadData);
    localStorage.setItem('zoe_solar_leads', JSON.stringify(existingLeads));

    onAction('claim-deal');
    onClose();
  }, [email, name, company, phone, onAction, onClose]);

  if (!isVisible) return null;

  const isExpired = timeLeft.days === 0 && timeLeft.hours === 0 && timeLeft.minutes === 0 && timeLeft.seconds === 0;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0, rotateX: -10 }}
          animate={{ scale: 1, opacity: 1, rotateX: 0 }}
          exit={{ scale: 0.9, opacity: 0, rotateX: -10 }}
          transition={{ type: "spring", duration: 0.6, damping: 25 }}
          className="relative w-full max-w-md bg-gradient-to-br from-black via-gray-900 to-black text-white rounded-2xl shadow-2xl overflow-hidden border border-yellow-500/30"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Animated Background Elements */}
          <div className="absolute inset-0">
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-yellow-600/10 via-transparent to-red-600/10 animate-pulse"></div>
            <div className="absolute -top-4 -right-4 w-24 h-24 bg-yellow-500/20 rounded-full blur-2xl"></div>
            <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-red-500/20 rounded-full blur-2xl"></div>
          </div>

          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 text-white/60 hover:text-white transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* Header */}
          <div className="relative p-6 text-center border-b border-yellow-500/30">
            <div className="inline-flex items-center justify-center mb-4">
              <div className="bg-yellow-500 text-black px-3 py-1 rounded-full text-sm font-bold animate-pulse">
                🔥 BLACK FRIDAY SPECIAL
              </div>
            </div>

            <h2 className="text-3xl font-bold mb-2 bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent">
              20% RABATT
            </h2>
            <p className="text-yellow-200 mb-4">
              Auf alle Solaranlagen - nur bis 11.11.2025
            </p>

            {/* Countdown Timer */}
            {!isExpired && (
              <div className="bg-black/50 rounded-lg p-3 inline-block">
                <div className="text-xs text-yellow-300 mb-1">Angebot endet in:</div>
                <div className="flex space-x-2 text-lg font-bold">
                  <div className="bg-yellow-500/20 px-2 py-1 rounded">
                    <span>{String(timeLeft.days).padStart(2, '0')}</span>
                    <span className="text-xs block text-yellow-300">Tage</span>
                  </div>
                  <div className="bg-yellow-500/20 px-2 py-1 rounded">
                    <span>{String(timeLeft.hours).padStart(2, '0')}</span>
                    <span className="text-xs block text-yellow-300">Std</span>
                  </div>
                  <div className="bg-yellow-500/20 px-2 py-1 rounded">
                    <span>{String(timeLeft.minutes).padStart(2, '0')}</span>
                    <span className="text-xs block text-yellow-300">Min</span>
                  </div>
                  <div className="bg-yellow-500/20 px-2 py-1 rounded">
                    <span>{String(timeLeft.seconds).padStart(2, '0')}</span>
                    <span className="text-xs block text-yellow-300">Sek</span>
                  </div>
                </div>
              </div>
            )}

            {isExpired && (
              <div className="bg-red-500/20 rounded-lg p-3 inline-block">
                <div className="text-red-300 font-bold">Angebot abgelaufen</div>
              </div>
            )}
          </div>

          {/* Content */}
          <div className="relative p-6">
            {step === 1 ? (
              /* Step 1: Offer Presentation */
              <div className="space-y-4">
                {!isExpired ? (
                  <>
                    <div className="text-center mb-6">
                      <div className="text-6xl mb-4">🎯</div>
                      <p className="text-gray-300 mb-6">
                        Sie verlassen die Seite? Sichern Sie sich jetzt unseren exklusiven Black Friday Deal!
                      </p>
                    </div>

                    {/* Action Buttons */}
                    <div className="space-y-3">
                      <button
                        onClick={() => handleAction('claim-deal')}
                        className="w-full p-4 bg-gradient-to-r from-yellow-500 to-yellow-600 text-black font-bold rounded-xl hover:from-yellow-600 hover:to-yellow-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                      >
                        <div className="flex items-center justify-center space-x-2">
                          <span>🎉</span>
                          <span>20% Rabatt sichern</span>
                          <span>🎉</span>
                        </div>
                      </button>

                      <button
                        onClick={() => handleAction('get-quote')}
                        className="w-full p-3 bg-gradient-to-r from-gray-700 to-gray-800 text-white rounded-lg hover:from-gray-800 hover:to-gray-900 transition-all duration-300"
                      >
                        Zuerst Angebot berechnen
                      </button>
                    </div>

                    {/* Trust Indicators */}
                    <div className="pt-4 border-t border-gray-700">
                      <div className="grid grid-cols-3 gap-4 text-center text-sm">
                        <div>
                          <div className="text-yellow-400 font-bold">20%</div>
                          <div className="text-gray-400">Rabatt</div>
                        </div>
                        <div>
                          <div className="text-yellow-400 font-bold">Bis 11.11</div>
                          <div className="text-gray-400">Gültig</div>
                        </div>
                        <div>
                          <div className="text-yellow-400 font-bold">Alle</div>
                          <div className="text-gray-400">Anlagen</div>
                        </div>
                      </div>
                    </div>
                  </>
                ) : (
                  /* Expired Message */
                  <div className="text-center">
                    <div className="text-6xl mb-4">⏰</div>
                    <h3 className="text-xl font-bold mb-2 text-red-400">Angebot abgelaufen</h3>
                    <p className="text-gray-300 mb-6">
                      Das Black Friday Angebot ist leider nicht mehr verfügbar.
                      Kontaktieren Sie uns für aktuelle Angebote!
                    </p>
                    <button
                      onClick={() => handleAction('get-quote')}
                      className="w-full p-3 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg hover:from-green-700 hover:to-green-800 transition-all duration-300"
                    >
                      Aktuelles Angebot anfordern
                    </button>
                  </div>
                )}
              </div>
            ) : (
              /* Step 2: Form */
              <form onSubmit={handleFormSubmit} className="space-y-4">
                <div className="text-center mb-4">
                  <p className="text-yellow-300 font-medium">
                    Nur noch ein Schritt zu Ihrem 20% Rabatt!
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Ihr Name <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                    placeholder="Max Mustermann"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    E-Mail-Adresse <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                    placeholder="max@example.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Unternehmen (optional)
                  </label>
                  <input
                    type="text"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                    placeholder="Firma GmbH"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Telefonnummer (optional)
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                    placeholder="+49 123 456789"
                  />
                </div>

                <div className="pt-4">
                  <button
                    type="submit"
                    className="w-full bg-gradient-to-r from-yellow-500 to-yellow-600 text-black font-bold py-3 rounded-lg hover:from-yellow-600 hover:to-yellow-700 transition-all duration-300 shadow-lg hover:shadow-xl"
                  >
                    🎉 20% Rabatt sichern
                  </button>
                </div>

                <div className="text-xs text-gray-400 text-center">
                  Wir respektieren Ihre Privatsphäre. Ihre Daten werden vertraulich behandelt.
                </div>
              </form>
            )}

            {/* Step Navigation */}
            {step === 2 && !isExpired && (
              <button
                onClick={() => setStep(1)}
                className="mt-4 text-center w-full text-gray-400 hover:text-gray-200 text-sm"
              >
                ← Zurück zum Angebot
              </button>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default BlackFridayPopup;