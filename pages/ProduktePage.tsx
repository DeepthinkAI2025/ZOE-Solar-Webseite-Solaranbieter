import React, { useState, useMemo } from 'react';
import { productCatalog } from '../data/products.generated';
import { ProductCategory, Product } from '../data/productTypes';
import ProductDetailModal from '../components/ProductDetailModal';
import AIRecommender from '../components/AIRecommender';
import SubHeader from '../components/SubHeader';
import AnimatedSection from '../components/AnimatedSection';
import ServiceWizard from '../components/ServiceWizard';
import ProductsPreview from '../components/ProductsPreview';

interface ProduktePageProps {
    onSelectHersteller: (slug: string) => void;
    comparisonList: Product[];
    onToggleCompare: (product: Product) => void;
    bannerHeight: number;
    headerHeight: number;
}


const ProductCard: React.FC<{ 
    product: Product & { manufacturerName: string }; 
    onQuote: (product: Product) => void;
    comparisonList: Product[];
    onToggleCompare: (product: Product) => void;
    onShowDetails: (product: Product) => void;
    onSelectHersteller: (slug: string) => void;
}> = ({ product, onQuote, comparisonList, onToggleCompare, onShowDetails, onSelectHersteller }) => {
    const isSelected = comparisonList.some(p => p.name === product.name);
    const isDisabled = !isSelected && (
        (comparisonList.length > 0 && comparisonList[0].category !== product.category) ||
        comparisonList.length >= 4
    );

    return (
        <div className="bg-white rounded-xl shadow-lg border border-slate-200 flex flex-col h-full transform transition-all duration-300 hover:shadow-2xl hover:-translate-y-1">
            <div onClick={() => onShowDetails(product)} className="cursor-pointer group relative overflow-hidden">
                <img 
                    src={product.imageUrl}
                    alt={product.name}
                    loading="lazy"
                    decoding="async"
                    className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-105"
                />
                {/* AI Badge */}
                {product.aiBadge && (
                    <div className={`absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-bold text-white shadow-lg z-10 ${
                        product.aiBadge.color === 'green' ? 'bg-green-500' :
                        product.aiBadge.color === 'blue' ? 'bg-blue-500' :
                        product.aiBadge.color === 'yellow' ? 'bg-yellow-500' : 'bg-gray-500'
                    }`}>
                        {product.aiBadge.label}
                    </div>
                )}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <div className="bg-white/80 backdrop-blur-sm text-slate-800 font-bold py-2 px-4 rounded-full text-sm">
                        Details ansehen
                    </div>
                </div>
            </div>
            <div className="p-4 flex flex-col flex-grow">
                 <button onClick={(e) => { e.stopPropagation(); onSelectHersteller(product.manufacturerSlug); }} className="text-xs font-semibold text-slate-500 hover:text-green-600 self-start mb-2">
                    {product.manufacturerName}
                </button>
                <h3 onClick={() => onShowDetails(product)} className="text-base font-bold text-slate-800 mb-2 cursor-pointer hover:text-green-600 transition-colors flex-grow leading-snug">{product.name}</h3>
                
                {product.basePrice && (
                    <div className="my-3 text-2xl font-bold text-slate-800">
                        {product.basePrice.toLocaleString('de-DE', { style: 'currency', currency: 'EUR' })}
                    </div>
                )}
                
                <div className="mt-auto pt-4 border-t border-slate-100 space-y-2">
                     <button 
                        onClick={() => onQuote(product)}
                        className="w-full bg-green-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-green-700 transition-colors duration-200 text-sm"
                    >
                        Angebot anfragen
                    </button>
                    <button
                        onClick={() => onToggleCompare(product)}
                        disabled={isDisabled}
                        className={`w-full flex items-center justify-center gap-2 border-2 font-bold py-2 px-4 rounded-lg transition-colors duration-200 text-sm ${
                            isSelected 
                            ? 'bg-green-100 border-green-600 text-green-700' 
                            : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-50 disabled:bg-slate-100 disabled:text-slate-400 disabled:cursor-not-allowed'
                        }`}
                        title={isDisabled ? "Sie können nur Produkte derselben Kategorie vergleichen oder haben das Limit von 4 Produkten erreicht." : ""}
                    >
                         {isSelected ? (
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
                        ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
                        )}
                        {isSelected ? 'Vergleichen' : 'Vergleichen'}
                    </button>
                </div>
            </div>
        </div>
    );
};

const ProdukteHero = () => (
    <section className="produkte-hero bg-slate-50 overflow-hidden">
        <div className="container mx-auto px-6 py-20 lg:py-16">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
                {/* Left Column: Text Content */}
                <div className="text-center lg:text-left">
                    <h1 className="text-5xl md:text-6xl font-extrabold text-slate-900 tracking-tighter animate-slide-in-up" style={{ animationDelay: '0.2s' }}>
                        Technologie, die überzeugt.
                    </h1>
                    <h2 className="text-5xl md:text-6xl font-extrabold text-green-600 tracking-tighter mt-2 animate-slide-in-up" style={{ animationDelay: '0.4s' }}>
                        Komponenten, die performen.
                    </h2>
                    <p className="mt-6 text-lg text-slate-600 max-w-xl mx-auto lg:mx-0 animate-slide-in-up" style={{ animationDelay: '0.6s' }}>
                        Wir sind herstellerunabhängig. Das bedeutet für Sie: Nur die besten, effizientesten und langlebigsten Produkte des Weltmarkts für Ihre maximale Rendite.
                    </p>
                    <div className="mt-8 animate-slide-in-up" style={{ animationDelay: '0.7s' }}>
                        <ul className="space-y-3 text-left max-w-md mx-auto lg:mx-0">
                            <li className="flex items-start">
                                <svg className="w-6 h-6 text-green-500 mr-3 flex-shrink-0 mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                <span><strong>Herstellerunabhängige Auswahl:</strong> Nur die beste Technik für Ihre Ziele.</span>
                            </li>
                            <li className="flex items-start">
                                <svg className="w-6 h-6 text-green-500 mr-3 flex-shrink-0 mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                <span><strong>Geprüfte Tier-1-Komponenten:</strong> Wir setzen auf Langlebigkeit und höchste Garantien.</span>
                            </li>
                            <li className="flex items-start">
                                <svg className="w-6 h-6 text-green-500 mr-3 flex-shrink-0 mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                <span><strong>Maximale Performance:</strong> Perfekt aufeinander abgestimmte Systeme für höchste Erträge.</span>
                            </li>
                        </ul>
                    </div>
                    <div className="mt-8 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 animate-slide-in-up" style={{ animationDelay: '0.9s' }}>
                        <a href="#product-catalog" className="w-full sm:w-auto bg-green-600 text-white font-bold py-3 px-8 rounded-lg text-lg hover:bg-green-700 transition-all duration-300 shadow-lg cta-button-glow">
                            Zum Produktkatalog
                        </a>
                        <button onClick={() => document.dispatchEvent(new CustomEvent('open-chat'))} className="w-full sm:w-auto bg-white text-slate-700 font-bold py-3 px-8 rounded-lg hover:bg-slate-200 transition-colors border border-slate-300 shadow-md">
                            KI-Berater starten
                        </button>
                    </div>
                </div>

                {/* Right Column: Image Collage */}
                <div className="hidden lg:block relative h-96">
                    <div className="absolute inset-0">
                        <div className="floating-hero-img img-1">
                            <img src="https://images.unsplash.com/photo-1628453483958-c8a709249a26?q=80&w=400&auto=format&fit=crop" alt="Solarmodul" className="w-full h-full object-cover" />
                            <div className="floating-hero-img-label">Solarmodul</div>
                        </div>
                        <div className="floating-hero-img img-2">
                            <img src="https://images.unsplash.com/photo-1632930603299-8a93917c9171?q=80&w=400&auto=format&fit=crop" alt="Wechselrichter" className="w-full h-full object-cover" />
                            <div className="floating-hero-img-label">Wechselrichter</div>
                        </div>
                        <div className="floating-hero-img img-3">
                            <img src="https://images.unsplash.com/photo-1633711124238-52260c6f5d81?q=80&w=400&auto=format&fit=crop" alt="Batteriespeicher" className="w-full h-full object-cover" />
                            <div className="floating-hero-img-label">Batteriespeicher</div>
                        </div>
                        <div className="floating-hero-img img-4">
                            <img src="https://images.unsplash.com/photo-1675883196884-35805ac51268?q=80&w=400&auto=format&fit=crop" alt="Ladestation" className="w-full h-full object-cover" />
                            <div className="floating-hero-img-label">Ladestation</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
);

const { manufacturers, allCategories } = productCatalog;

const ProduktePage: React.FC<ProduktePageProps> = ({ onSelectHersteller, comparisonList, onToggleCompare, bannerHeight, headerHeight }) => {
    const [selectedCategory, setSelectedCategory] = useState<ProductCategory>('Module');
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

    const allProducts = useMemo(() => {
        return manufacturers.flatMap(m => 
            m.products.map(p => ({ ...p, manufacturerName: m.name }))
        );
    }, []);

    const filteredProducts = useMemo(() => {
        return allProducts.filter(p => p.category === selectedCategory);
    }, [allProducts, selectedCategory]);

    const openChatWithContext = (product: Product) => {
        const manufacturer = manufacturers.find(m => m.slug === product.manufacturerSlug);
        const detail = {
            type: 'product_quote',
            productName: product.name,
            productCategory: product.category,
            manufacturerName: manufacturer ? manufacturer.name : 'Unknown'
        };
        document.dispatchEvent(new CustomEvent('start-chat-with-context', { detail }));
    };
    
    const openChatWithCustomProductRequest = () => {
        const detail = {
            type: 'custom_product_inquiry',
            context: "Der Kunde konnte sein Wunschprodukt nicht im Katalog finden und startet eine individuelle Anfrage."
        };
        document.dispatchEvent(new CustomEvent('start-chat-with-context', { detail }));
    };

    const navItems = allCategories.map(cat => ({
        id: cat,
        title: cat,
        page: 'produkte'
    }));

    const handleCategoryClick = (id: string) => {
        setSelectedCategory(id as ProductCategory);
        const catalogElement = document.getElementById('product-catalog');
        if (catalogElement) {
            catalogElement.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <div className="bg-slate-50">
            {selectedProduct && (
                <ProductDetailModal
                    product={selectedProduct}
                    onClose={() => setSelectedProduct(null)}
                    comparisonList={comparisonList}
                    onToggleCompare={onToggleCompare}
                    onQuote={openChatWithContext}
                />
            )}
            <div style={{ paddingTop: `${bannerHeight + headerHeight}px` }}>
                <ProdukteHero />
            </div>
            <ProductsPreview
                setPage={(page) => {
                    if (page === 'produkte') {
                        document.getElementById('product-catalog')?.scrollIntoView({ behavior: 'smooth' });
                    } else {
                        document.dispatchEvent(new CustomEvent('set-page', { detail: page }));
                    }
                }}
                onSelectHersteller={onSelectHersteller}
            />
             <SubHeader
                navItems={navItems}
                activeItemId={selectedCategory}
                onItemClick={(id) => handleCategoryClick(id)}
                bannerHeight={bannerHeight}
                headerHeight={headerHeight}
            />
            <div id="product-catalog" className="py-20 scroll-mt-24">
                <div className="container mx-auto px-6">
                    <AIRecommender />
                    
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 mt-12">
                        {filteredProducts.map(product => (
                            <ProductCard 
                                key={product.name}
                                product={product}
                                onQuote={openChatWithContext}
                                comparisonList={comparisonList}
                                onToggleCompare={onToggleCompare}
                                onShowDetails={setSelectedProduct}
                                onSelectHersteller={onSelectHersteller}
                            />
                        ))}
                    </div>
                </div>
            </div>
             <section className="py-20 bg-white">
                <div className="container mx-auto px-6">
                    <div className="bg-slate-800 rounded-2xl p-8 md:p-12 text-white grid lg:grid-cols-2 gap-12 items-center">
                        <div className="text-center lg:text-left">
                            <h2 className="text-3xl lg:text-4xl font-bold mb-4">
                                Ihr Wunschprodukt ist nicht dabei?
                            </h2>
                            <p className="text-slate-300 text-lg mb-6">
                                Kein Problem. Als herstellerunabhängiger Partner können wir praktisch jede am Markt verfügbare Komponente für Ihr Projekt beschaffen. Sagen Sie uns einfach, was Sie benötigen.
                            </p>
                            <ul className="space-y-3 mb-8 text-left max-w-md mx-auto lg:mx-0">
                                <li className="flex items-start">
                                    <svg className="w-6 h-6 text-green-400 mr-3 flex-shrink-0 mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                    <span>Zugriff auf den gesamten Weltmarkt</span>
                                </li>
                                <li className="flex items-start">
                                    <svg className="w-6 h-6 text-green-400 mr-3 flex-shrink-0 mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                    <span>Garantie für das beste Preis-Leistungs-Verhältnis</span>
                                </li>
                                <li className="flex items-start">
                                    <svg className="w-6 h-6 text-green-400 mr-3 flex-shrink-0 mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                    <span>Maßgeschneiderte Lösungen statt Standard von der Stange</span>
                                </li>
                            </ul>
                            <button
                                onClick={openChatWithCustomProductRequest}
                                className="bg-green-500 text-white font-bold py-4 px-8 rounded-lg text-lg hover:bg-green-600 transition-all duration-300 shadow-xl cta-button-glow transform hover:-translate-y-1"
                            >
                                Individuelle Anfrage starten
                            </button>
                        </div>
                        <div className="hidden lg:block">
                            <img
                                src="https://images.unsplash.com/photo-1581092916376-023961f31b34?q=80&w=1974&auto=format&fit=crop"
                                alt="Experte prüft Solarkomponenten"
                                className="rounded-xl shadow-2xl w-full h-auto object-cover aspect-square"
                            />
                        </div>
                    </div>
                </div>
            </section>
            <AnimatedSection>
                <section id="service-finder" className="py-20 bg-slate-50">
                    <div className="max-w-7xl mx-auto px-6">
                        <div className="text-center mb-16 max-w-4xl mx-auto">
                            <p className="font-bold text-green-600 uppercase tracking-wider">Lösungsfinder</p>
                            <h2 className="text-4xl lg:text-5xl font-bold text-slate-900 mt-2">Finden Sie den richtigen Service.</h2>
                            <p className="text-lg text-slate-600 mt-4">
                                Unsicher, welche Dienstleistung Sie benötigen? Beschreiben Sie Ihr Anliegen in einfachen Worten oder wählen Sie direkt einen Bereich, um Ihre Anfrage zu präzisieren.
                            </p>
                        </div>
                        <ServiceWizard />
                    </div>
                </section>
            </AnimatedSection>
        </div>
    );
};

export default ProduktePage;