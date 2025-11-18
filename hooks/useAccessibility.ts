import { useEffect, useRef, useCallback, useState } from 'react';

// Accessibility preferences and state
interface AccessibilityState {
  highContrast: boolean;
  reducedMotion: boolean;
  largeText: boolean;
  screenReader: boolean;
  keyboardNavigation: boolean;
  focusVisible: boolean;
}

export const useAccessibility = () => {
  const [state, setState] = useState<AccessibilityState>({
    highContrast: false,
    reducedMotion: false,
    largeText: false,
    screenReader: false,
    keyboardNavigation: false,
    focusVisible: false,
  });

  const lastInteractionTime = useRef<number>(Date.now());
  const focusableElementsRef = useRef<HTMLElement[]>([]);

  // Detect user preferences and system settings
  useEffect(() => {
    const detectPreferences = () => {
      const mediaQueries = {
        highContrast: window.matchMedia('(prefers-contrast: high)'),
        reducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)'),
        largeText: window.matchMedia('(prefers-reduced-data: reduce)'),
      };

      setState(prev => ({
        ...prev,
        highContrast: mediaQueries.highContrast.matches,
        reducedMotion: mediaQueries.reducedMotion.matches,
        largeText: mediaQueries.largeText.matches,
        screenReader: detectScreenReader(),
      }));

      // Listen for changes
      Object.values(mediaQueries).forEach(mq => {
        mq.addEventListener('change', detectPreferences);
      });

      return () => {
        Object.values(mediaQueries).forEach(mq => {
          mq.removeEventListener('change', detectPreferences);
        });
      };
    };

    const cleanup = detectPreferences();
    return cleanup;
  }, []);

  // Detect if screen reader is being used
  const detectScreenReader = (): boolean => {
    // Heuristics for screen reader detection
    return (
      window.speechSynthesis !== undefined ||
      navigator.userAgent.includes('NVDA') ||
      navigator.userAgent.includes('JAWS') ||
      navigator.userAgent.includes('VoiceOver')
    );
  };

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Tab key indicates keyboard navigation
      if (e.key === 'Tab') {
        setState(prev => ({ ...prev, keyboardNavigation: true }));
        lastInteractionTime.current = Date.now();
      }

      // Escape key
      if (e.key === 'Escape') {
        // Handle escape functionality
        handleEscape(e);
      }

      // Keyboard shortcuts
      handleKeyboardShortcuts(e);
    };

    const handleMouseDown = () => {
      // Mouse interaction detected
      setState(prev => ({ ...prev, keyboardNavigation: false }));
    };

    const handleFocusIn = (e: FocusEvent) => {
      const target = e.target as HTMLElement;
      if (target && isFocusable(target)) {
        setState(prev => ({ ...prev, focusVisible: true }));
        updateFocusableElements();
      }
    };

    const handleFocusOut = (e: FocusEvent) => {
      // Delay hiding focus indicator to allow for tab navigation
      setTimeout(() => {
        const timeSinceLastInteraction = Date.now() - lastInteractionTime.current;
        if (timeSinceLastInteraction > 100) {
          setState(prev => ({ ...prev, focusVisible: false }));
        }
      }, 200);
    };

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('focusin', handleFocusIn);
    document.addEventListener('focusout', handleFocusOut);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('mousedown', handleMouseDown);
      document.removeEventListener('focusin', handleFocusIn);
      document.removeEventListener('focusout', handleFocusOut);
    };
  }, []);

  // Handle escape key functionality
  const handleEscape = useCallback((e: KeyboardEvent) => {
    // Close modals, dropdowns, etc.
    const activeElement = document.activeElement as HTMLElement;
    if (activeElement) {
      const closeButton = activeElement.closest('[data-escape-close]') as HTMLElement;
      if (closeButton) {
        closeButton.click();
      }
    }
  }, []);

  // Handle keyboard shortcuts
  const handleKeyboardShortcuts = useCallback((e: KeyboardEvent) => {
    // Skip if user is typing in input
    const activeElement = document.activeElement as HTMLElement;
    if (activeElement?.tagName === 'INPUT' || activeElement?.tagName === 'TEXTAREA') {
      return;
    }

    // Skip if modifier keys are pressed
    if (e.ctrlKey || e.altKey || e.metaKey) {
      return;
    }

    // Define shortcuts
    const shortcuts: Record<string, () => void> = {
      'h': () => announceNavigation('Hauptnavigation'),
      'm': () => announceNavigation('Hauptmenü'),
      'c': () => announceNavigation('Inhalt'),
      'f': () => announceNavigation('Fußzeile'),
      's': () => {
        const searchInput = document.querySelector('input[type="search"]') as HTMLInputElement;
        if (searchInput) {
          searchInput.focus();
          announceToScreenReader('Suchfeld fokussiert');
        }
      },
      '/': () => {
        e.preventDefault();
        const searchInput = document.querySelector('input[type="search"]') as HTMLInputElement;
        if (searchInput) {
          searchInput.focus();
          announceToScreenReader('Suche mit Slash-Taste geöffnet');
        }
      },
    };

    const handler = shortcuts[e.key.toLowerCase()];
    if (handler) {
      e.preventDefault();
      handler();
    }
  }, []);

  // Check if element is focusable
  const isFocusable = (element: HTMLElement): boolean => {
    const focusableSelectors = [
      'button:not([disabled])',
      'input:not([disabled])',
      'select:not([disabled])',
      'textarea:not([disabled])',
      'a[href]',
      '[tabindex]:not([tabindex="-1"])',
      '[contenteditable="true"]',
    ];

    return focusableSelectors.some(selector => {
      try {
        return element.matches(selector);
      } catch {
        return false;
      }
    });
  };

  // Update list of focusable elements
  const updateFocusableElements = useCallback(() => {
    const focusableSelectors = [
      'button:not([disabled])',
      'input:not([disabled])',
      'select:not([disabled])',
      'textarea:not([disabled])',
      'a[href]',
      '[tabindex]:not([tabindex="-1"])',
      '[contenteditable="true"]',
    ].join(', ');

    focusableElementsRef.current = Array.from(
      document.querySelectorAll<HTMLElement>(focusableSelectors)
    );
  }, []);

  // Trap focus within a container
  const trapFocus = useCallback((container: HTMLElement) => {
    const focusableElements = container.querySelectorAll<HTMLElement>(
      'button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), a[href], [tabindex]:not([tabindex="-1"])'
    );

    if (focusableElements.length === 0) return;

    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    const handleTabKey = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;

      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          e.preventDefault();
          lastElement.focus();
        }
      } else {
        if (document.activeElement === lastElement) {
          e.preventDefault();
          firstElement.focus();
        }
      }
    };

    container.addEventListener('keydown', handleTabKey);

    return () => {
      container.removeEventListener('keydown', handleTabKey);
    };
  }, []);

  // Announce messages to screen readers
  const announceToScreenReader = useCallback((message: string, priority: 'polite' | 'assertive' = 'polite') => {
    const announcement = document.createElement('div');
    announcement.setAttribute('aria-live', priority);
    announcement.setAttribute('aria-atomic', 'true');
    announcement.className = 'sr-only';
    announcement.textContent = message;

    document.body.appendChild(announcement);

    // Remove after announcement
    setTimeout(() => {
      document.body.removeChild(announcement);
    }, 1000);
  }, []);

  // Announce navigation changes
  const announceNavigation = useCallback((section: string) => {
    announceToScreenReader(`${section} erreicht`, 'polite');
  }, [announceToScreenReader]);

  // Set focus to element
  const setFocus = useCallback((element: HTMLElement | null, options: { preventScroll?: boolean } = {}) => {
    if (!element) return;

    setTimeout(() => {
      element.focus({
        preventScroll: options.preventScroll || false,
      });
    }, 100);
  }, []);

  // Generate unique IDs for accessibility
  const generateId = useCallback((prefix: string) => {
    return `${prefix}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }, []);

  // Skip links functionality
  const createSkipLinks = useCallback(() => {
    const skipLinksHTML = `
      <div class="skip-links">
        <a href="#main-content" class="skip-link">Zum Hauptinhalt springen</a>
        <a href="#navigation" class="skip-link">Zur Navigation springen</a>
        <a href="#footer" class="skip-link">Zur Fußzeile springen</a>
      </div>
    `;

    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = skipLinksHTML;
    const skipLinks = tempDiv.firstElementChild;

    if (skipLinks && !document.querySelector('.skip-links')) {
      document.body.insertBefore(skipLinks, document.body.firstChild);
    }
  }, []);

  // Initialize skip links
  useEffect(() => {
    createSkipLinks();
  }, [createSkipLinks]);

  // Get accessibility classes based on state
  const getAccessibilityClasses = useCallback(() => {
    return {
      'high-contrast': state.highContrast,
      'reduced-motion': state.reducedMotion,
      'large-text': state.largeText,
      'keyboard-nav': state.keyboardNavigation,
      'focus-visible': state.focusVisible,
      'screen-reader': state.screenReader,
    };
  }, [state]);

  // Apply accessibility styles
  useEffect(() => {
    const root = document.documentElement;
    const classes = getAccessibilityClasses();

    Object.entries(classes).forEach(([className, shouldApply]) => {
      if (shouldApply) {
        root.classList.add(className);
      } else {
        root.classList.remove(className);
      }
    });
  }, [getAccessibilityClasses]);

  return {
    state,
    isFocusable,
    trapFocus,
    announceToScreenReader,
    announceNavigation,
    setFocus,
    generateId,
    focusableElements: focusableElementsRef.current,
    getAccessibilityClasses,
  };
};

// Custom hook for ARIA attributes
export const useAriaAttributes = () => {
  const generateId = useAccessibility().generateId;

  return {
    // Generate IDs for labelledby relationships
    createLabelId: (prefix: string) => generateId(`label-${prefix}`),
    createDescribedById: (prefix: string) => generateId(`desc-${prefix}`),

    // Common ARIA attributes
    getExpanded: (isExpanded: boolean) => ({ 'aria-expanded': isExpanded }),
    getSelected: (isSelected: boolean) => ({ 'aria-selected': isSelected }),
    getDisabled: (isDisabled: boolean) => ({ 'aria-disabled': isDisabled, disabled: isDisabled }),
    getHidden: (isHidden: boolean) => ({ 'aria-hidden': isHidden, hidden: isHidden }),

    // Complex attributes
    getCombobox: (isOpen: boolean, inputId: string, listboxId: string) => ({
      role: 'combobox',
      'aria-expanded': isOpen,
      'aria-haspopup': 'listbox',
      'aria-controls': listboxId,
      'aria-autocomplete': 'list',
      id: inputId,
    }),

    getMenu: (menuId: string, labelledBy?: string) => ({
      role: 'menu',
      id: menuId,
      'aria-labelledby': labelledBy,
    }),

    getMenuItem: (isSelected: boolean, isDisabled: boolean = false) => ({
      role: 'menuitem',
      'aria-selected': isSelected,
      'aria-disabled': isDisabled,
      tabIndex: isDisabled ? -1 : 0,
    }),

    getTabs: (tabListId: string) => ({
      role: 'tablist',
      id: tabListId,
    }),

    getTab: (tabId: string, panelId: string, isSelected: boolean) => ({
      role: 'tab',
      id: tabId,
      'aria-controls': panelId,
      'aria-selected': isSelected,
      tabIndex: isSelected ? 0 : -1,
    }),

    getTabPanel: (panelId: string, tabId: string, isSelected: boolean) => ({
      role: 'tabpanel',
      id: panelId,
      'aria-labelledby': tabId,
      hidden: !isSelected,
    }),

    getModal: (modalId: string, labelledBy?: string) => ({
      role: 'dialog',
      id: modalId,
      'aria-modal': 'true',
      'aria-labelledby': labelledBy,
    }),

    getTooltip: (tooltipId: string, describedBy?: string) => ({
      id: tooltipId,
      role: 'tooltip',
      'aria-describedby': describedBy,
    }),
  };
};

export default useAccessibility;