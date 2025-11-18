import React from 'react';
import { motion } from 'framer-motion';
import BaseCard, { CardVariant } from './BaseCard';
import {
  CardImage,
  CardTitle,
  CardSubtitle,
  CardContent,
  CardFooter,
  CardActions,
  CardBadge
} from './CardComponents';
import { Offer } from '../../data/offers';
import { Page } from '../../types';

interface OfferCardProps {
  offer: Offer;
  onCtaClick: (offer: Offer) => void;
  size?: 'sm' | 'md' | 'lg';
  showConditions?: boolean;
  className?: string;
}

const OfferCard: React.FC<OfferCardProps> = ({
  offer,
  onCtaClick,
  size = 'md',
  showConditions = true,
  className = ''
}) => {
  const isExpired = offer.status === 'expired';
  const isActive = offer.status === 'active';

  const handleCtaClick = () => {
    if (!isExpired) {
      onCtaClick(offer);
    }
  };

  const getVariant = (): CardVariant => {
    if (offer.isFeatured) return 'featured';
    if (isExpired) return 'default';
    return 'promotional';
  };

  const getStatusBadge = () => {
    if (isExpired) {
      return (
        <CardBadge variant="error" size="md">
          Abgelaufen
        </CardBadge>
      );
    }
    if (offer.isFeatured) {
      return (
        <CardBadge variant="success" size="md">
          Top-Angebot
        </CardBadge>
      );
    }
    return (
      <CardBadge variant="success" size="md">
        Aktuell
      </CardBadge>
    );
  };

  const getCtaText = () => {
    if (isExpired) return 'Nicht mehr verfügbar';
    if (offer.ctaText) return offer.ctaText;
    return 'Angebot anfordern';
  };

  const getCtaVariant = () => {
    if (isExpired) return 'secondary';
    if (offer.isFeatured) return 'primary';
    return 'success';
  };

  return (
    <BaseCard
      variant={getVariant()}
      size={size}
      featured={offer.isFeatured}
      interactive={!isExpired}
      disabled={isExpired}
      className={className}
      onClick={handleCtaClick}
      testId={`offer-card-${offer.id}`}
      ariaLabel={`Angebot: ${offer.title}`}
    >
      {/* Card Image Section */}
      <CardImage
        src={offer.imageUrl}
        alt={offer.title}
        variant={getVariant()}
        featured={offer.isFeatured}
        aspectRatio="video"
        fallbackText={offer.title.substring(0, 2).toUpperCase()}
      />

      {/* Status Badge */}
      <div className="flex justify-between items-start mb-3">
        <div className="flex-1">
          {getStatusBadge()}
        </div>
        {offer.expiryDate && (
          <span className="text-xs text-slate-500 ml-2">
            Gültig bis: {new Date(offer.expiryDate).toLocaleDateString('de-DE')}
          </span>
        )}
      </div>

      {/* Card Title and Subtitle */}
      <CardTitle variant={getVariant()} size={size} featured={offer.isFeatured}>
        {offer.title}
      </CardTitle>

      <CardSubtitle variant={getVariant()} featured={offer.isFeatured}>
        {offer.subtitle}
      </CardSubtitle>

      {/* Card Content */}
      <CardContent variant={getVariant()}>
        <p className="mb-4">{offer.description}</p>

        {/* Price/Savings Highlight */}
        {offer.savings && (
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-3 mb-4 border border-green-200">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-green-800">Ihre Ersparnis:</span>
              <span className="text-xl font-bold text-green-600">{offer.savings}</span>
            </div>
          </div>
        )}

        {/* Conditions Section */}
        {showConditions && offer.conditions.length > 0 && (
          <div className="mb-4">
            <h4 className="font-bold text-slate-700 mb-3 text-sm uppercase tracking-wide">
              Konditionen:
            </h4>
            <ul className="space-y-2">
              {offer.conditions.map((condition, index) => (
                <li key={index} className="flex items-start text-sm group">
                  <div className="flex-shrink-0 mr-2 mt-1">
                    <div className={`w-4 h-4 rounded-full flex items-center justify-center ${
                      isExpired
                        ? 'bg-slate-300'
                        : 'bg-green-500'
                    }`}>
                      <svg className="w-2.5 h-2.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </div>
                  <span className={`${
                    isExpired ? 'text-slate-400 line-through' : 'text-slate-600'
                  } group-hover:text-slate-800 transition-colors`}>
                    {condition}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Urgency Indicator */}
        {offer.urgency && !isExpired && (
          <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-lg p-3 border border-orange-200">
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-orange-500 animate-pulse" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
              <span className="text-sm font-semibold text-orange-700">{offer.urgency}</span>
            </div>
          </div>
        )}
      </CardContent>

      {/* Card Footer with CTA */}
      <CardFooter variant={getVariant()}>
        <CardActions align="center">
          <motion.button
            onClick={handleCtaClick}
            disabled={isExpired}
            className={`
              w-full py-3 px-6 rounded-lg font-bold text-white transition-all duration-300
              flex items-center justify-center gap-2
              ${isExpired
                ? 'bg-slate-300 cursor-not-allowed'
                : offer.isFeatured
                  ? 'bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5'
                  : 'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 shadow-md hover:shadow-lg'
              }
            `}
            whileHover={!isExpired ? { scale: 1.05 } : {}}
            whileTap={!isExpired ? { scale: 0.95 } : {}}
          >
            {isExpired ? (
              <>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
                {getCtaText()}
              </>
            ) : (
              <>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                {getCtaText()}
              </>
            )}
          </motion.button>
        </CardActions>
      </CardFooter>
    </BaseCard>
  );
};

export default OfferCard;