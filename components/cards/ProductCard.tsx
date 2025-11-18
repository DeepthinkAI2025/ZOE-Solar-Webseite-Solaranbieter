import React, { useState } from 'react';
import { motion } from 'framer-motion';
import BaseCard from './BaseCard';
import {
  CardImage,
  CardTitle,
  CardSubtitle,
  CardContent,
  CardFooter,
  CardActions,
  CardBadge,
  CardStats,
  CardStatItem
} from './CardComponents';
import { Product } from '../../data/productTypes';

interface ProductCardProps {
  product: Product;
  onViewDetails: (product: Product) => void;
  onToggleCompare?: (product: Product) => void;
  onQuote?: (product: Product) => void;
  isInComparison?: boolean;
  canCompare?: boolean;
  showSpecs?: boolean;
  variant?: 'default' | 'compact' | 'detailed';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onViewDetails,
  onToggleCompare,
  onQuote,
  isInComparison = false,
  canCompare = true,
  showSpecs = true,
  variant = 'default',
  size = 'md',
  className = ''
}) => {
  const [isHovered, setIsHovered] = useState(false);

  const handleViewDetails = () => {
    onViewDetails(product);
  };

  const handleCompare = (e: React.MouseEvent) => {
    e.stopPropagation();
    onToggleCompare?.(product);
  };

  const handleQuote = (e: React.MouseEvent) => {
    e.stopPropagation();
    onQuote?.(product);
  };

  const getEfficiencyColor = (efficiency?: string) => {
    if (!efficiency) return 'text-slate-600';
    const value = parseFloat(efficiency.replace('%', ''));
    if (value >= 22) return 'text-green-600';
    if (value >= 20) return 'text-blue-600';
    if (value >= 18) return 'text-yellow-600';
    return 'text-slate-600';
  };

  const getRatingStars = (rating?: number) => {
    if (!rating) return null;
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <svg key={i} className="w-4 h-4 text-yellow-400 fill-current" viewBox="0 0 20 20">
          <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
        </svg>
      );
    }

    if (hasHalfStar) {
      stars.push(
        <svg key="half" className="w-4 h-4 text-yellow-400 fill-current" viewBox="0 0 20 20">
          <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0v15z" />
        </svg>
      );
    }

    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <svg key={`empty-${i}`} className="w-4 h-4 text-slate-300 fill-current" viewBox="0 0 20 20">
          <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
        </svg>
      );
    }

    return stars;
  };

  if (variant === 'compact') {
    return (
      <BaseCard
        size="sm"
        interactive
        onClick={handleViewDetails}
        className={`cursor-pointer ${className}`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="flex gap-4">
          <div className="flex-shrink-0 w-24 h-24">
            <CardImage
              src={product.imageUrl}
              alt={product.name}
              aspectRatio="square"
              className="mb-0"
              fallbackText={product.name.substring(0, 2).toUpperCase()}
            />
          </div>
          <div className="flex-grow min-w-0">
            <CardTitle size="sm">{product.name}</CardTitle>
            <CardSubtitle>{product.category}</CardSubtitle>
            <CardContent className="text-sm">
              <div className="flex items-center justify-between mt-2">
                {product.efficiency && (
                  <span className={`font-semibold ${getEfficiencyColor(product.efficiency)}`}>
                    {product.efficiency} Effizienz
                  </span>
                )}
                {product.power && (
                  <span className="font-semibold text-slate-700">{product.power}</span>
                )}
              </div>
            </CardContent>
          </div>
        </div>
      </BaseCard>
    );
  }

  return (
    <BaseCard
      size={size}
      interactive
      onClick={handleViewDetails}
      className={`cursor-pointer ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      testId={`product-card-${product.id}`}
      ariaLabel={`Produkt: ${product.name}`}
    >
      {/* Product Image */}
      <CardImage
        src={product.imageUrl}
        alt={product.name}
        aspectRatio="square"
        fallbackText={product.name.substring(0, 2).toUpperCase()}
      />

      {/* Product Category Badge */}
      <div className="mb-3">
        <CardBadge variant="info" size="sm">
          {product.category}
        </CardBadge>
      </div>

      {/* Product Title and Rating */}
      <div className="mb-3">
        <CardTitle size={size}>{product.name}</CardTitle>
        {product.rating && (
          <div className="flex items-center gap-2 mt-1">
            <div className="flex items-center gap-1">
              {getRatingStars(product.rating)}
            </div>
            <span className="text-sm text-slate-600">({product.rating.toFixed(1)})</span>
          </div>
        )}
      </div>

      {/* Product Description */}
      <CardContent>
        <p className="text-sm mb-4 line-clamp-3">{product.description}</p>

        {/* Key Specifications */}
        {showSpecs && (
          <CardStats columns={2}>
            {product.efficiency && (
              <CardStatItem
                label="Effizienz"
                value={product.efficiency}
                className={getEfficiencyColor(product.efficiency)}
              />
            )}
            {product.power && (
              <CardStatItem
                label="Leistung"
                value={product.power}
              />
            )}
            {product.warranty && (
              <CardStatItem
                label="Garantie"
                value={product.warranty}
              />
            )}
            {product.price && (
              <CardStatItem
                label="Preis"
                value={product.price}
              />
            )}
          </CardStats>
        )}

        {/* Highlight Features */}
        {product.features && product.features.length > 0 && (
          <div className="mt-4">
            <div className="flex flex-wrap gap-1">
              {product.features.slice(0, 3).map((feature, index) => (
                <span
                  key={index}
                  className="inline-block text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded-md"
                >
                  {feature}
                </span>
              ))}
              {product.features.length > 3 && (
                <span className="inline-block text-xs text-slate-500 px-2 py-1">
                  +{product.features.length - 3} mehr
                </span>
              )}
            </div>
          </div>
        )}
      </CardContent>

      {/* Card Actions */}
      <CardFooter>
        <CardActions align="space-between">
          {/* Compare Button */}
          {onToggleCompare && canCompare && (
            <motion.button
              onClick={handleCompare}
              className={`
                px-4 py-2 rounded-lg border-2 font-medium text-sm transition-all duration-200
                flex items-center gap-2
                ${isInComparison
                  ? 'bg-green-100 border-green-600 text-green-700'
                  : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-50'
                }
              `}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {isInComparison ? (
                <>
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Vergleichen
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                  </svg>
                  Vergleichen
                </>
              )}
            </motion.button>
          )}

          {/* Action Buttons */}
          <div className="flex gap-2">
            {onQuote && (
              <motion.button
                onClick={handleQuote}
                className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors duration-200 font-medium text-sm"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Angebot
              </motion.button>
            )}

            <motion.button
              onClick={handleViewDetails}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-200 font-medium text-sm"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Details
            </motion.button>
          </div>
        </CardActions>
      </CardFooter>
    </BaseCard>
  );
};

export default ProductCard;