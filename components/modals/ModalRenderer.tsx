import React from 'react';
import { useModal } from './ModalProvider';
import ProductDetailModal from '../ProductDetailModal';
import ComparisonModal from '../ComparisonModal';
import { type Product } from '../../data/productTypes';

// Type definitions for modal data
type ModalData = Record<string, any>;

interface ProductDetailModalData {
  product: Product;
  comparisonList?: Product[];
  onToggleCompare?: (product: Product) => void;
  onQuote?: (product: Product) => void;
}

interface ComparisonModalData {
  products: Product[];
}
type ModalRendererComponentProps = { data?: ModalData; onClose?: () => void };

// Contact Modal Content
const ContactModalContent: React.FC<ModalRendererComponentProps> = ({ data, onClose }) => {
  return (
    <div className="p-6">
      <form className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Name
          </label>
          <input
            type="text"
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            placeholder="Ihr Name"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            E-Mail
          </label>
          <input
            type="email"
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            placeholder="ihre@email.de"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Nachricht
          </label>
          <textarea
            rows={4}
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            placeholder="Ihre Nachricht..."
          />
        </div>
        <div className="flex gap-3 pt-4">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors"
          >
            Abbrechen
          </button>
          <button
            type="submit"
            className="flex-1 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
          >
            Senden
          </button>
        </div>
      </form>
    </div>
  );
};

// Quote Modal Content
const QuoteModalContent: React.FC<ModalRendererComponentProps> = ({ data, onClose }) => {
  return (
    <div className="p-6">
      <div className="text-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h3 className="text-xl font-semibold text-slate-900 mb-2">
          Angebot anfordern
        </h3>
        <p className="text-slate-600 mb-6">
          Wir erstellen Ihnen ein unverbindliches Angebot für Ihre Solaranlage.
        </p>
        <div className="grid md:grid-cols-2 gap-4">
          <button
            onClick={() => window.location.href = 'tel:+493012345678'}
            className="flex items-center justify-center gap-2 px-4 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
            Anrufen
          </button>
          <button
            className="flex items-center justify-center gap-2 px-4 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            Chat starten
          </button>
        </div>
      </div>
    </div>
  );
};

// Gallery Modal Content
const GalleryModalContent: React.FC<ModalRendererComponentProps> = ({ data, onClose }) => {
  const images = data?.images || [];

  return (
    <div className="p-6">
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {images.map((image: any, index: number) => (
          <div
            key={index}
            className="aspect-square bg-slate-100 rounded-lg overflow-hidden cursor-pointer hover:opacity-80 transition-opacity"
          >
            <img
              src={image.url}
              alt={image.alt}
              className="w-full h-full object-cover"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

// Video Modal Content
const VideoModalContent: React.FC<ModalRendererComponentProps> = ({ data, onClose }) => {
  const videoUrl = data?.videoUrl || '';
  const videoTitle = data?.title || data?.alt || 'Video Player';

  return (
    <div className="aspect-video bg-black">
      <iframe
        src={videoUrl}
        className="w-full h-full"
        frameBorder="0"
        title={videoTitle}
        aria-label={videoTitle}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    </div>
  );
};

// Confirmation Modal Content
const ConfirmationModalContent: React.FC<ModalRendererComponentProps> = ({ data, onClose }) => {
  const { title, message, onConfirm, confirmText = 'Bestätigen', cancelText = 'Abbrechen' } = data || {};

  return (
    <div className="p-6">
      <div className="text-center">
        <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 15.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        </div>
        <h3 className="text-xl font-semibold text-slate-900 mb-2">
          {title || 'Bestätigung erforderlich'}
        </h3>
        <p className="text-slate-600 mb-6">
          {message || 'Sind Sie sicher, dass Sie diese Aktion durchführen möchten?'}
        </p>
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors"
          >
            {cancelText}
          </button>
          <button
            onClick={() => {
              onConfirm?.();
              onClose?.();
            }}
            className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

// Timer Popup Modal Content
const TimerPopupModalContent: React.FC<ModalRendererComponentProps> = ({ data, onClose }) => {
  return (
    <div className="p-6">
      <div className="text-center">
        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h3 className="text-xl font-semibold text-slate-900 mb-2">
          {data?.title || 'Zeitgesteuerte Aktion'}
        </h3>
        <p className="text-slate-600 mb-6">
          {data?.message || 'Eine zeitgesteuerte Aktion ist verfügbar.'}
        </p>
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors"
          >
            Später
          </button>
          <button
            onClick={() => {
              data?.onAction?.();
              onClose?.();
            }}
            className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            {data?.actionText || 'Jetzt starten'}
          </button>
        </div>
      </div>
    </div>
  );
};

// Black Friday Popup Modal Content
const BlackFridayPopupModalContent: React.FC<ModalRendererComponentProps> = ({ data, onClose }) => {
  return (
    <div className="p-6">
      <div className="text-center">
        <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-10 h-10 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
          </svg>
        </div>
        <h3 className="text-2xl font-bold text-red-600 mb-2">
          BLACK FRIDAY SALE!
        </h3>
        <p className="text-slate-600 mb-4">
          {data?.message || 'Spezielle Angebote nur für kurze Zeit verfügbar!'}
        </p>
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <p className="text-red-800 font-semibold">
            {data?.discount || 'Bis zu 50% Rabatt auf alle Solaranlagen!'}
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors"
          >
            Später ansehen
          </button>
          <button
            onClick={() => {
              data?.onAction?.();
              onClose?.();
            }}
            className="flex-1 px-4 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors font-semibold"
          >
            {data?.actionText || 'Jetzt sparen!'}
          </button>
        </div>
      </div>
    </div>
  );
};

// Product Detail Modal Renderer Adapter
const ProductDetailModalRenderer: React.FC<ModalRendererComponentProps> = ({ data, onClose }) => {
  const detailData = data as ProductDetailModalData | undefined;

  if (!detailData?.product) {
    console.warn('[ModalRenderer] Missing product data for product-detail modal');
    return null;
  }

  const comparisonList = detailData.comparisonList ?? [];
  const handleToggleCompare: (product: Product) => void = detailData.onToggleCompare ?? (() => {});
  const handleQuote: (product: Product) => void = detailData.onQuote ?? (() => {});

  return (
    <ProductDetailModal
      product={detailData.product}
      comparisonList={comparisonList}
      onToggleCompare={handleToggleCompare}
      onQuote={handleQuote}
      onClose={onClose ?? (() => {})}
    />
  );
};

// Comparison Modal Renderer Adapter
const ComparisonModalRenderer: React.FC<ModalRendererComponentProps> = ({ data, onClose }) => {
  const comparisonData = data as ComparisonModalData | undefined;
  const items = comparisonData?.products ?? [];

  if (items.length === 0) {
    console.warn('[ModalRenderer] No products provided for comparison modal');
  }

  return (
    <ComparisonModal
      items={items}
      onClose={onClose ?? (() => {})}
    />
  );
};

// Modal content renderers for different modal types
const modalRenderers: Record<string, React.FC<ModalRendererComponentProps>> = {
  'product-detail': ProductDetailModalRenderer,
  'comparison': ComparisonModalRenderer,
  'contact': ContactModalContent,
  'quote': QuoteModalContent,
  'gallery': GalleryModalContent,
  'video': VideoModalContent,
  'confirmation': ConfirmationModalContent,
  'timer-popup': TimerPopupModalContent,
  'black-friday-popup': BlackFridayPopupModalContent,
};

// Main Modal Renderer Component
const ModalRenderer: React.FC = () => {
  const { activeModal, closeModal } = useModal();

  if (!activeModal) return null;

  const ModalComponent = modalRenderers[activeModal.type];

  if (!ModalComponent) {
    console.warn(`No renderer found for modal type: ${activeModal.type}`);
    return null;
  }

  const handleClose = () => closeModal(activeModal.id);

  return <ModalComponent data={activeModal.data} onClose={handleClose} />;
};

export default ModalRenderer;