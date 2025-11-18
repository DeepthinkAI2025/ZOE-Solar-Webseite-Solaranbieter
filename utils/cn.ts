import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Utility function to combine class names with Tailwind CSS classes
 * Handles conditional classes and merges conflicting Tailwind classes properly
 *
 * @param inputs - Class names, objects, or arrays to be merged
 * @returns Combined string of class names
 *
 * @example
 * cn('base-class', { 'conditional-class': condition }, 'another-class')
 * cn('px-4 py-2', isActive && 'bg-blue-500', 'text-white')
 * cn(['class1', 'class2'], { 'class3': true })
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

/**
 * Type-safe utility for conditional class names
 *
 * @param condition - Boolean condition
 * @param className - Class name to apply if condition is true
 * @returns Class name or empty string
 *
 * @example
 * cn('base-class', conditional('is-active', isActive))
 */
export function conditional(condition: boolean, className: string): string {
  return condition ? className : '';
}

/**
 * Utility for responsive class prefixes
 *
 * @param classes - Object with breakpoint keys
 * @returns Responsive class string
 *
 * @example
 * responsive({
 *   sm: 'text-sm',
 *   md: 'text-base',
 *   lg: 'text-lg',
 *   xl: 'text-xl'
 * })
 */
export function responsive(classes: Record<string, string>): string {
  return Object.entries(classes)
    .map(([breakpoint, className]) => {
      return breakpoint === 'base'
        ? className
        : `${breakpoint}:${className}`;
    })
    .join(' ');
}

/**
 * Utility for variant-based styling
 *
 * @param variant - Current variant
 * @param variants - Object mapping variants to class names
 * @param defaultClass - Default class name if variant not found
 * @returns Variant-specific class name
 *
 * @example
 * variantClass('primary', {
 *   primary: 'bg-blue-500 text-white',
 *   secondary: 'bg-gray-500 text-white',
 *   danger: 'bg-red-500 text-white'
 * }, 'bg-gray-200 text-gray-800')
 */
export function variantClass<T extends string>(
  variant: T,
  variants: Record<T, string>,
  defaultClass?: string
): string {
  return variants[variant] || defaultClass || '';
}

export default cn;