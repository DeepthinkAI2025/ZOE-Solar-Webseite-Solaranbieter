import React, { createContext, useContext, useReducer, useCallback, useEffect } from 'react';
import { AnimatePresence, motion, type Variants } from 'framer-motion';
import { createPortal } from 'react-dom';

// Modal Types
export type ModalType = 'product-detail' | 'comparison' | 'contact' | 'quote' | 'gallery' | 'video' | 'confirmation' | 'timer-popup' | 'black-friday-popup';

export interface ModalConfig {
  id: string;
  type: ModalType;
  title?: string;
  content: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  closable?: boolean;
  backdropClose?: boolean;
  preventClose?: boolean;
  customClass?: string;
  onClose?: () => void;
  onOpen?: () => void;
  data?: Record<string, any>;
}

interface ModalState {
  modals: ModalConfig[];
  activeModalId: string | null;
  history: string[];
}

type ModalAction =
  | { type: 'OPEN_MODAL'; payload: ModalConfig }
  | { type: 'CLOSE_MODAL'; payload: { id: string; force?: boolean } }
  | { type: 'CLOSE_ALL_MODALS' }
  | { type: 'GO_BACK' }
  | { type: 'UPDATE_MODAL'; payload: { id: string; updates: Partial<ModalConfig> } };

// Modal reducer
const modalReducer = (state: ModalState, action: ModalAction): ModalState => {
  switch (action.type) {
    case 'OPEN_MODAL':
      return {
        ...state,
        modals: [...state.modals, action.payload],
        activeModalId: action.payload.id,
        history: [...state.history, action.payload.id],
      };

    case 'CLOSE_MODAL': {
      const { id, force = false } = action.payload;
      const modal = state.modals.find(m => m.id === id);

      if (modal && modal.preventClose && !force) {
        return state;
      }

      const newModals = state.modals.filter(m => m.id !== id);
      const newHistory = state.history.filter(h => h !== id);
      const fallbackId = newModals[newModals.length - 1]?.id ?? null;
      const nextHistoryId = newHistory[newHistory.length - 1] ?? fallbackId;

      return {
        ...state,
        modals: newModals,
        history: newHistory,
        activeModalId: nextHistoryId ?? null,
      };
    }

    case 'CLOSE_ALL_MODALS':
      return {
        ...state,
        modals: [],
        activeModalId: null,
        history: [],
      };

    case 'GO_BACK': {
      if (state.history.length <= 1) {
        return {
          ...state,
          modals: [],
          activeModalId: null,
          history: [],
        };
      }

      const newGoBackHistory = [...state.history];
      newGoBackHistory.pop(); // Remove current
      const previousId = newGoBackHistory[newGoBackHistory.length - 1] ?? null;

      if (!previousId) {
        return {
          ...state,
          modals: [],
          activeModalId: null,
          history: newGoBackHistory,
        };
      }

      return {
        ...state,
        modals: state.modals.filter(m => m.id === previousId),
        activeModalId: previousId,
        history: newGoBackHistory,
      };
    }

    case 'UPDATE_MODAL':
      return {
        ...state,
        modals: state.modals.map(m =>
          m.id === action.payload.id
            ? { ...m, ...action.payload.updates }
            : m
        ),
      };

    default:
      return state;
  }
};

// Modal Context
interface ModalContextType {
  modals: ModalConfig[];
  activeModal: ModalConfig | null;
  openModal: (modal: Omit<ModalConfig, 'id'>) => string;
  closeModal: (id?: string) => void;
  closeAllModals: () => void;
  goBack: () => void;
  updateModal: (id: string, updates: Partial<ModalConfig>) => void;
  isModalOpen: (id: string) => boolean;
}

const ModalContext = createContext<ModalContextType | undefined>(undefined);
const canUseDOM = typeof window !== 'undefined' && typeof document !== 'undefined';
let hasWarnedAboutMissingProvider = false;

const warnMissingProvider = () => {
  if (!hasWarnedAboutMissingProvider) {
    console.warn('[ModalProvider] useModal was called outside of a ModalProvider. Returning no-op handlers.');
    hasWarnedAboutMissingProvider = true;
  }
};

const fallbackContext: ModalContextType = {
  modals: [],
  activeModal: null,
  openModal: () => {
    warnMissingProvider();
    return `modal-fallback-${Date.now()}`;
  },
  closeModal: () => warnMissingProvider(),
  closeAllModals: () => warnMissingProvider(),
  goBack: () => warnMissingProvider(),
  updateModal: () => warnMissingProvider(),
  isModalOpen: () => false,
};

// Modal Provider Component
export const ModalProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(modalReducer, {
    modals: [],
    activeModalId: null,
    history: [],
  });

  const activeModal = state.modals.find(m => m.id === state.activeModalId) || null;

  // Generate unique ID for modals
  const generateId = useCallback(() => {
    return `modal-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }, []);

  // Open modal
  const openModal = useCallback((modalConfig: Omit<ModalConfig, 'id'>) => {
    const id = generateId();
    const modal: ModalConfig = { id, ...modalConfig };

    dispatch({ type: 'OPEN_MODAL', payload: modal });

    // Call onOpen callback
    modal.onOpen?.();

    return id;
  }, [generateId]);

  // Close modal
  const closeModal = useCallback((id?: string) => {
    const modalId = id || state.activeModalId;
    if (modalId) {
      const modal = state.modals.find(m => m.id === modalId);
      modal?.onClose?.();
      dispatch({ type: 'CLOSE_MODAL', payload: { id: modalId } });
    }
  }, [state.activeModalId, state.modals]);

  // Close all modals
  const closeAllModals = useCallback(() => {
    state.modals.forEach(modal => modal.onClose?.());
    dispatch({ type: 'CLOSE_ALL_MODALS' });
  }, [state.modals]);

  // Go back in modal history
  const goBack = useCallback(() => {
    if (state.history.length > 1) {
      const currentId = state.activeModalId;
      const currentModal = state.modals.find(m => m.id === currentId);
      currentModal?.onClose?.();
      dispatch({ type: 'GO_BACK' });
    }
  }, [state.history, state.activeModalId, state.modals]);

  // Update modal
  const updateModal = useCallback((id: string, updates: Partial<ModalConfig>) => {
    dispatch({ type: 'UPDATE_MODAL', payload: { id, updates } });
  }, []);

  // Check if modal is open
  const isModalOpen = useCallback((id: string) => {
    return state.modals.some(m => m.id === id);
  }, [state.modals]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!state.activeModalId) return;

      const activeModal = state.modals.find(m => m.id === state.activeModalId);
      if (!activeModal) return;

      switch (e.key) {
        case 'Escape':
          if (!activeModal.preventClose && activeModal.closable !== false) {
            closeModal();
          }
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [state.activeModalId, state.modals, closeModal]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (state.modals.length > 0) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [state.modals.length]);

  const contextValue: ModalContextType = {
    modals: state.modals,
    activeModal,
    openModal,
    closeModal,
    closeAllModals,
    goBack,
    updateModal,
    isModalOpen,
  };

  return (
    <ModalContext.Provider value={contextValue}>
      {children}
      {canUseDOM && document?.body && createPortal(
        <AnimatePresence mode="wait">
          {state.modals.map((modal) => (
            <ModalContainer
              key={modal.id}
              modal={modal}
              isActive={modal.id === state.activeModalId}
              onClose={() => closeModal(modal.id)}
            />
          ))}
        </AnimatePresence>,
        document.body
      )}
    </ModalContext.Provider>
  );
};

// Modal Container Component
const ModalContainer: React.FC<{
  modal: ModalConfig;
  isActive: boolean;
  onClose: () => void;
}> = ({ modal, isActive, onClose }) => {
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget && modal.backdropClose !== false) {
      onClose();
    }
  };

  // Size classes
  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
    full: 'max-w-7xl',
  };

  const modalVariants: Variants = {
    hidden: {
      opacity: 0,
      scale: 0.9,
      y: -50,
      transition: { duration: 0.2, ease: 'easeOut' }
    },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        duration: 0.3,
        ease: [0.04, 0.62, 0.23, 0.98],
        staggerChildren: 0.1
      }
    },
    exit: {
      opacity: 0,
      scale: 0.9,
      y: 50,
      transition: { duration: 0.2, ease: 'easeIn' }
    }
  };

  const backdropVariants: Variants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
    exit: { opacity: 0 }
  };

  return (
    <div className="fixed inset-0 z-[1100] flex items-center justify-center">
      {/* Backdrop */}
      <motion.div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        variants={backdropVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        onClick={handleBackdropClick}
      />

      {/* Modal */}
      <motion.div
        className={`
          relative w-full mx-4 max-h-[90vh] overflow-hidden
          ${sizeClasses[modal.size || 'md']}
          ${modal.customClass || ''}
        `}
        variants={modalVariants}
        initial="hidden"
        animate={isActive ? "visible" : "hidden"}
        exit="exit"
        layout
      >
        {/* Modal Content */}
        <div className="bg-white rounded-2xl shadow-2xl border border-slate-200/50 overflow-hidden flex flex-col max-h-[90vh]">
          {/* Modal Header */}
          {(modal.title || modal.closable !== false) && (
            <div className="flex items-center justify-between p-6 border-b border-slate-200 bg-gradient-to-r from-slate-50 to-white">
              {modal.title && (
                <h2 className="text-xl font-bold text-slate-900">{modal.title}</h2>
              )}

              {modal.closable !== false && (
                <button
                  onClick={onClose}
                  className="p-2 rounded-lg hover:bg-slate-100 transition-colors duration-200 group"
                  aria-label="Modal schließen"
                >
                  <svg className="w-5 h-5 text-slate-500 group-hover:text-slate-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
          )}

          {/* Modal Body */}
          <div className="flex-1 overflow-y-auto">
            {modal.content}
          </div>
        </div>

      </motion.div>
    </div>
  );
};

// Hook for using modals
export const useModal = () => {
  const context = useContext(ModalContext);
  if (!context) {
    warnMissingProvider();
    return fallbackContext;
  }
  return context;
};

// Convenience hooks
export const useModalOpener = () => {
  const { openModal } = useModal();
  return openModal;
};

export const useModalCloser = () => {
  const { closeModal, closeAllModals } = useModal();
  return { closeModal, closeAllModals };
};

// Modal type hooks
export const useProductDetailModal = () => {
  const openModal = useModalOpener();

  return useCallback((product: any) => {
    return openModal({
      type: 'product-detail',
      title: product.name,
      content: null, // Will be rendered by ModalRenderer
      size: 'lg',
      data: { product },
    });
  }, [openModal]);
};

export const useComparisonModal = () => {
  const openModal = useModalOpener();

  return useCallback((products: any[]) => {
    return openModal({
      type: 'comparison',
      title: 'Produktvergleich',
      content: null,
      size: 'xl',
      data: { products },
    });
  }, [openModal]);
};

export const useContactModal = () => {
  const openModal = useModalOpener();

  return useCallback(() => {
    return openModal({
      type: 'contact',
      title: 'Kontakt aufnehmen',
      content: null,
      size: 'md',
    });
  }, [openModal]);
};

export default ModalProvider;