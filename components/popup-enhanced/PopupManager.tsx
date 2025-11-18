import React, { useState, useEffect, useCallback, useRef } from 'react';
import TimerPopup from './TimerPopup';
import BlackFridayPopup from './BlackFridayPopup';
import { popupAnalyticsService } from '../../services/popupAnalyticsService';

interface PopupManagerProps {
  children?: React.ReactNode;
}

interface PopupState {
  timerPopup: boolean;
  blackFridayPopup: boolean;
  lastInteraction: number;
  pageViewTime: number;
  scrollDepth: number;
  exitIntentTriggered: boolean;
  timerTriggered: boolean;
}

const PopupManager: React.FC<PopupManagerProps> = ({ children }) => {
  const [popupState, setPopupState] = useState<PopupState>({
    timerPopup: false,
    blackFridayPopup: false,
    lastInteraction: Date.now(),
    pageViewTime: Date.now(),
    scrollDepth: 0,
    exitIntentTriggered: false,
    timerTriggered: false
  });

  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // 30-Sekunden Timer Popup Trigger
  useEffect(() => {
    const timer = setTimeout(() => {
      const hasSeenTimerPopup = localStorage.getItem('zoe_solar_timer_popup_seen');
      const hasSeenAnyPopup = localStorage.getItem('zoe_solar_popup_session');

      if (!hasSeenTimerPopup && !hasSeenAnyPopup) {
        setPopupState(prev => ({ ...prev, timerPopup: true, timerTriggered: true }));
        localStorage.setItem('zoe_solar_timer_popup_seen', new Date().toISOString());
        localStorage.setItem('zoe_solar_popup_session', 'true');

        // Analytics Track
        if (typeof window !== 'undefined' && window.gtag) {
          window.gtag('event', 'popup_trigger', {
            event_category: 'conversion',
            event_label: '30_second_timer_trigger',
            value: 1
          });
        }
      }
    }, 30000); // 30 Sekunden

    return () => clearTimeout(timer);
  }, []);

  // Exit Intent Detection
  useEffect(() => {
    const handleMouseLeave = (e: MouseEvent) => {
      if (e.clientY <= 0 && !popupState.exitIntentTriggered) {
        const hasSeenExitPopup = localStorage.getItem('zoe_solar_exit_popup_seen');
        const hasSeenAnyPopup = localStorage.getItem('zoe_solar_popup_session');

        if (!hasSeenExitPopup && !hasSeenAnyPopup) {
          setPopupState(prev => ({
            ...prev,
            blackFridayPopup: true,
            exitIntentTriggered: true
          }));

          localStorage.setItem('zoe_solar_exit_popup_seen', new Date().toISOString());
          localStorage.setItem('zoe_solar_popup_session', 'true');

          // Analytics Track
          if (typeof window !== 'undefined' && window.gtag) {
            window.gtag('event', 'popup_trigger', {
              event_category: 'conversion',
              event_label: 'exit_intent_trigger',
              value: 1
            });
          }
        }
      }
    };

    const handleMouseMove = () => {
      setPopupState(prev => ({ ...prev, lastInteraction: Date.now() }));
    };

    const handleScroll = () => {
      const scrollPercentage = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
      setPopupState(prev => ({
        ...prev,
        scrollDepth: Math.max(prev.scrollDepth, scrollPercentage)
      }));
    };

    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('scroll', handleScroll);

    return () => {
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', handleScroll);
    };
  }, [popupState.exitIntentTriggered]);

  // User Inactivity Detection (optional - after 5 minutes of inactivity)
  useEffect(() => {
    const inactivityTimer = setTimeout(() => {
      const timeSinceLastInteraction = Date.now() - popupState.lastInteraction;
      const timeOnPage = Date.now() - popupState.pageViewTime;

      if (timeSinceLastInteraction >= 300000 && timeOnPage >= 60000) { // 5 min inactivity, 1 min on page
        const hasSeenInactivityPopup = localStorage.getItem('zoe_solar_inactivity_popup_seen');

        if (!hasSeenInactivityPopup) {
          setPopupState(prev => ({ ...prev, timerPopup: true }));
          localStorage.setItem('zoe_solar_inactivity_popup_seen', new Date().toISOString());
        }
      }
    }, 300000); // 5 minutes

    return () => clearTimeout(inactivityTimer);
  }, [popupState.lastInteraction, popupState.pageViewTime]);

  const handleTimerPopupClose = useCallback(() => {
    setPopupState(prev => ({ ...prev, timerPopup: false }));

    // Analytics Track
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'popup_close', {
        event_category: 'conversion',
        event_label: 'timer_popup_close',
        value: 1
      });
    }
  }, []);

  const handleBlackFridayPopupClose = useCallback(() => {
    setPopupState(prev => ({ ...prev, blackFridayPopup: false }));

    // Analytics Track
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'popup_close', {
        event_category: 'conversion',
        event_label: 'black_friday_popup_close',
        value: 1
      });
    }
  }, []);

  const handleTimerAction = useCallback((action: 'consultation' | 'ai-chat' | 'callback') => {
    switch (action) {
      case 'ai-chat':
        // Öffne KI-Chat (falls vorhanden)
        if (typeof window !== 'undefined' && window.openAIChat) {
          window.openAIChat();
        } else {
          // Fallback: Navigiere zur Kontaktseite
          window.location.href = '/kontakt?source=timer_popup_ai_chat';
        }
        break;
      case 'consultation':
        // Navigiere zur Kontaktseite mit Beratung
        window.location.href = '/kontakt?source=timer_popup_consultation&type=consultation';
        break;
      case 'callback':
        // Navigiere zur Kontaktseite mit Rückrufwunsch
        window.location.href = '/kontakt?source=timer_popup_callback&type=callback';
        break;
    }

    // Analytics Track
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'popup_conversion', {
        event_category: 'conversion',
        event_label: `timer_popup_${action}_conversion`,
        value: 1
      });
    }
  }, []);

  const handleBlackFridayAction = useCallback((action: 'claim-deal' | 'get-quote') => {
    switch (action) {
      case 'claim-deal':
        // Navigiere zu Sonderaktionen mit Black Friday Deal
        window.location.href = '/sonderaktionen?source=black_friday_popup&deal=20percent';
        break;
      case 'get-quote':
        // Navigiere zu Konfigurator/Angebot
        window.location.href = '/kontakt?source=black_friday_popup&type=quote';
        break;
    }

    // Analytics Track
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'popup_conversion', {
        event_category: 'conversion',
        event_label: `black_friday_popup_${action}_conversion`,
        value: 1
      });
    }
  }, []);

  // Reset session storage nach 30 Minuten
  useEffect(() => {
    const resetTimer = setTimeout(() => {
      localStorage.removeItem('zoe_solar_popup_session');
    }, 30 * 60 * 1000); // 30 Minuten

    return () => clearTimeout(resetTimer);
  }, []);

  return (
    <>
      {children}

      {/* Timer Popup (30 Sekunden) */}
      <TimerPopup
        isVisible={popupState.timerPopup}
        onClose={handleTimerPopupClose}
        onAction={handleTimerAction}
      />

      {/* Black Friday Exit Intent Popup */}
      <BlackFridayPopup
        isVisible={popupState.blackFridayPopup}
        onClose={handleBlackFridayPopupClose}
        onAction={handleBlackFridayAction}
      />
    </>
  );
};

// Global type declarations for window
declare global {
  interface Window {
    gtag?: (command: string, action: string, options: any) => void;
    openAIChat?: () => void;
  }
}

export default PopupManager;