import React from 'react';
import { productCatalog } from '../data/products.generated';
import { Manufacturer } from '../data/productTypes';
import ImageWithFallback from './ImageWithFallback';

interface ManufacturerNavigationProps {
    currentManufacturer: Manufacturer;
    onSelectHersteller: (slug: string) => void;
}

const { manufacturers } = productCatalog;

const ManufacturerNavigation: React.FC<ManufacturerNavigationProps> = ({ currentManufacturer, onSelectHersteller }) => {
    // FIX: Corrected filter logic to check if category array includes the current category.
    const relevantManufacturers = manufacturers.filter(m => m.category.includes(currentManufacturer.category[0]));

    return (
        <aside className="lg:col-span-1">
            <div className="sticky top-28 bg-white p-4 rounded-lg shadow-md border border-slate-200">
                <h3 className="font-bold text-slate-800 mb-4 px-2">Hersteller für: {currentManufacturer.category}</h3>
                <nav className="space-y-1">
                    {relevantManufacturers.map(manufacturer => (
                        <button
                            key={manufacturer.slug}
                            onClick={() => onSelectHersteller(manufacturer.slug)}
                            className={`w-full flex items-center gap-3 p-3 rounded-md text-left font-semibold transition-colors duration-200 ${
                                currentManufacturer.slug === manufacturer.slug
                                    ? 'bg-green-100 text-green-800'
                                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                            }`}
                        >
                            <ImageWithFallback
                                src={manufacturer.logoUrl}
                                alt={manufacturer.name}
                                className="h-6 w-auto object-contain flex-shrink-0"
                                fallbackText={manufacturer.name.substring(0, 2).toUpperCase()}
                            />
                            <span>{manufacturer.name}</span>
                        </button>
                    ))}
                </nav>
            </div>
        </aside>
    );
};

export default ManufacturerNavigation;