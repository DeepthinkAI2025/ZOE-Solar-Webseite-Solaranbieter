import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { cn } from '../utils/cn';
import BaseCard, { CardVariant } from './cards/BaseCard';
import {
  CardTitle,
  CardContent,
  CardActions,
  CardBadge,
  CardStats,
  CardStatItem
} from './cards/CardComponents';

const DesignSystemDemo: React.FC = () => {
  const [selectedTheme, setSelectedTheme] = useState<'light' | 'dark' | 'seasonal'>('light');

  const glassVariants = [
    { name: 'Light Glass', class: 'glass-light' },
    { name: 'Medium Glass', class: 'glass-medium' },
    { name: 'Heavy Glass', class: 'glass-heavy' },
    { name: 'Solar Glass', class: 'glass-solar' },
    { name: 'Blue Glass', class: 'glass-blue' },
  ];

  const neuroVariants = [
    { name: 'Raised', class: 'neuro-raised' },
    { name: 'Pressed', class: 'neuro-pressed' },
    { name: 'Floating', class: 'neuro-floating' },
  ];

  const cardVariants: CardVariant[] = [
    'default',
    'featured',
    'promotional',
    'comparison',
    'product',
    'testimonial'
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 py-12 px-6">
      <div className="container mx-auto max-w-7xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="text-5xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent mb-4">
            Enhanced Design System Demo
          </h1>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto">
            Moderne CSS-Architektur mit Glassmorphism 2.0, Container Queries und erweitertem Grid-System
          </p>

          {/* Theme Switcher */}
          <div className="flex justify-center gap-4 mt-8">
            {(['light', 'dark', 'seasonal'] as const).map((theme) => (
              <motion.button
                key={theme}
                onClick={() => setSelectedTheme(theme)}
                className={cn(
                  'px-6 py-3 rounded-lg font-semibold transition-all duration-300',
                  selectedTheme === theme
                    ? 'bg-green-500 text-white shadow-lg'
                    : 'bg-white text-slate-700 border border-slate-300 hover:bg-slate-50'
                )}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {theme.charAt(0).toUpperCase() + theme.slice(1)} Theme
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Glassmorphism Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-16"
        >
          <h2 className="text-3xl font-bold text-slate-800 mb-8">Glassmorphism 2.0</h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
            {glassVariants.map((variant, index) => (
              <motion.div
                key={variant.name}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 + index * 0.05 }}
                className={cn(
                  'p-6 rounded-2xl text-center',
                  variant.class
                )}
              >
                <h3 className="font-bold text-slate-800 mb-2">{variant.name}</h3>
                <p className="text-slate-600 text-sm">
                  Modern glass effect with backdrop blur and transparency
                </p>
                <div className="mt-4 flex justify-center">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-blue-500 rounded-xl"></div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Neumorphism Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-16"
        >
          <h2 className="text-3xl font-bold text-slate-800 mb-8">Neumorphism System</h2>

          <div className="grid md:grid-cols-3 gap-6">
            {neuroVariants.map((variant, index) => (
              <motion.div
                key={variant.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + index * 0.1 }}
                className={cn(
                  'p-8 rounded-2xl text-center',
                  variant.class
                )}
              >
                <h3 className="font-bold text-slate-800 mb-2">{variant.name}</h3>
                <p className="text-slate-600 text-sm mb-4">
                  Soft UI with realistic depth and shadows
                </p>
                <button className={cn(
                  'px-4 py-2 rounded-lg text-sm font-medium',
                  variant.class
                )}>
                  Interactive Button
                </button>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Advanced Card System */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-16"
        >
          <h2 className="text-3xl font-bold text-slate-800 mb-8">Advanced Card System</h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {cardVariants.map((variant, index) => (
              <motion.div
                key={variant}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 + index * 0.05 }}
              >
                <BaseCard
                  variant={variant}
                  size="md"
                  hover={true}
                  featured={variant === 'featured'}
                  interactive={true}
                >
                  <div className="mb-4">
                    <CardBadge variant="success" size="sm">
                      {variant.charAt(0).toUpperCase() + variant.slice(1)}
                    </CardBadge>
                  </div>

                  <CardTitle>
                    {variant.charAt(0).toUpperCase() + variant.slice(1)} Card
                  </CardTitle>

                  <CardContent>
                    <p className="mb-4">
                      Advanced card component with modern design patterns and micro-interactions.
                    </p>

                    <CardStats columns={2}>
                      <CardStatItem label="Performance" value="98%" trend="up" />
                      <CardStatItem label="Rating" value="4.9" trend="up" />
                    </CardStats>
                  </CardContent>

                  <CardActions align="space-between">
                    <button className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors">
                      Learn More
                    </button>
                    <button className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors">
                      Get Started
                    </button>
                  </CardActions>
                </BaseCard>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Micro-interactions Demo */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-16"
        >
          <h2 className="text-3xl font-bold text-slate-800 mb-8">Micro-interactions</h2>

          <div className="grid md:grid-cols-4 gap-6">
            {['Hover Lift', 'Scale Effect', 'Rotate on Hover', 'Bounce Effect'].map((effect, index) => (
              <motion.div
                key={effect}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + index * 0.05 }}
                className="bg-white p-6 rounded-xl shadow-md border border-slate-200"
              >
                <h3 className="font-bold text-slate-800 mb-2">{effect}</h3>
                <motion.button
                  className="w-full py-3 bg-gradient-to-r from-green-500 to-blue-500 text-white rounded-lg font-semibold"
                  whileHover={{
                    scale: index === 1 ? 1.05 : 1,
                    y: index === 0 ? -4 : index === 2 ? -2 : 0,
                    rotate: index === 2 ? 2 : 0
                  }}
                  whileTap={{
                    scale: 0.95,
                    transition: { type: 'spring', damping: 10, stiffness: 400 }
                  }}
                  transition={{
                    type: index === 3 ? 'spring' : 'tween',
                    damping: index === 3 ? 10 : 20,
                    stiffness: index === 3 ? 400 : 300
                  }}
                >
                  Try {effect}
                </motion.button>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Advanced Grid Demo */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mb-16"
        >
          <h2 className="text-3xl font-bold text-slate-800 mb-8">Advanced Grid System</h2>

          {/* Masonry Grid */}
          <div className="mb-12">
            <h3 className="text-xl font-semibold text-slate-700 mb-4">Masonry Grid Layout</h3>
            <div className="grid-masonry">
              {[1, 2, 3, 4, 5, 6].map((item) => (
                <motion.div
                  key={item}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.5 + item * 0.05 }}
                  className="bg-gradient-to-br from-green-50 to-blue-50 p-6 rounded-xl border border-green-200"
                  style={{ height: `${150 + (item % 3) * 100}px` }}
                >
                  <h4 className="font-bold text-slate-800 mb-2">Card {item}</h4>
                  <p className="text-slate-600 text-sm">
                    Flexible masonry layout with responsive grid system.
                  </p>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Responsive Grid */}
          <div>
            <h3 className="text-xl font-semibold text-slate-700 mb-4">Responsive Auto-fit Grid</h3>
            <div className="grid-auto-fit">
              {[1, 2, 3, 4].map((item) => (
                <motion.div
                  key={item}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + item * 0.1 }}
                  className="glass-medium p-6 rounded-xl"
                >
                  <h4 className="font-bold text-slate-800 mb-2">Responsive {item}</h4>
                  <p className="text-slate-600 text-sm">
                    Auto-fitting grid container that adapts to available space.
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>

        {/* Typography Demo */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <h2 className="text-3xl font-bold text-slate-800 mb-8">Fluid Typography</h2>

          <div className="space-y-6 bg-white p-8 rounded-xl shadow-lg border border-slate-200">
            {[
              { class: 'text-fluid-xs', label: 'Extra Small' },
              { class: 'text-fluid-sm', label: 'Small' },
              { class: 'text-fluid-base', label: 'Base' },
              { class: 'text-fluid-lg', label: 'Large' },
              { class: 'text-fluid-xl', label: 'Extra Large' },
              { class: 'text-fluid-2xl', label: '2X Large' },
            ].map((typo, index) => (
              <motion.div
                key={typo.class}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 + index * 0.05 }}
                className="flex items-center justify-between"
              >
                <span className={cn('font-semibold text-slate-800', typo.class)}>
                  {typo.label} Text
                </span>
                <span className="text-sm text-slate-500 font-mono">
                  {typo.class}
                </span>
              </motion.div>
            ))}
          </div>
        </motion.section>
      </div>
    </div>
  );
};

export default DesignSystemDemo;