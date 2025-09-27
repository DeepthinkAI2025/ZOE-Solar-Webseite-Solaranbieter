import React, { useState } from 'react';
import { productCatalog } from '../data/products.generated';
import { Manufacturer, Product } from '../data/productTypes';
import ProductDetailModal from '../components/ProductDetailModal';
import SubHeader from '../components/SubHeader';

interface HerstellerDetailPageProps {
    manufacturer: Manufacturer;
    comparisonList: Product[];
    onToggleCompare: (product: Product) => void;
    onSelectHersteller: (slug: string) => void;
    bannerHeight: number;
    headerHeight: number;
}

const ProductCard: React.FC<{ 
    product: Product; 
    onQuote: (product: Product) => void;
    comparisonList: Product[];
    onToggleCompare: (product: Product) => void;
    onShowDetails: (product: Product) => void;
}> = ({ product, onQuote, comparisonList, onToggleCompare, onShowDetails }) => {
    const isSelected = comparisonList.some(p => p.name === product.name);
    const isDisabled = !isSelected && (
        (comparisonList.length > 0 && comparisonList[0].category !== product.category) ||
        comparisonList.length >= 4
    );

    return (
        <div className="bg-white rounded-lg shadow-md overflow-hidden border border-slate-200 flex flex-col h-full">
            <div onClick={() => onShowDetails(product)} className="cursor-pointer group">
                <img 
                    src={product.imageUrl}
                    alt={product.name}
                    loading="lazy"
                    decoding="async"
                    className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
                />
            </div>
            <div className="p-6 flex flex-col flex-grow">
                <span className="text-sm font-semibold text-green-600 mb-1">{product.category}</span>
                <h3 onClick={() => onShowDetails(product)} className="text-xl font-bold text-slate-800 mb-2 cursor-pointer hover:text-green-600 transition-colors">{product.name}</h3>
                <p className="text-slate-600 text-sm">{product.description}</p>
                
                {product.keyFeatures && product.keyFeatures.length > 0 && (
                    <div className="my-4 pt-4 border-t border-slate-200/70">
                        <ul className="space-y-2">
                            {product.keyFeatures.map((feature, index) => (
                                <li key={index} className="flex items-start text-sm">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-green-500 mr-2 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                    </svg>
                                    <span className="text-slate-700 font-medium">{feature}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
                
                <div className="flex-grow"></div>

                {product.basePrice && (
                    <div className="my-4 text-3xl font-bold text-slate-800">
                        {product.basePrice.toLocaleString('de-DE', { style: 'currency', currency: 'EUR' })}
                        <span className="text-sm font-normal text-slate-500"> (zzgl. Installation)</span>
                    </div>
                )}

                <div className="mt-auto pt-4 border-t border-slate-200 space-y-2">
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
                        {isSelected ? 'Zum Vergleich hinzugefügt' : 'Vergleichen'}
                    </button>
                    <button 
                        onClick={() => onQuote(product)}
                        className="w-full bg-green-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-green-700 transition-colors duration-200"
                    >
                        Angebot anfragen
                    </button>
                </div>
            </div>
        </div>
    );
};

const { manufacturers } = productCatalog;

const HerstellerDetailPage: React.FC<HerstellerDetailPageProps> = ({ manufacturer, comparisonList, onToggleCompare, onSelectHersteller, bannerHeight, headerHeight }) => {
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

    const openChatWithContext = (product: Product) => {
        const detail = {
            type: 'product_quote',
            productName: product.name,
            productCategory: product.category,
            manufacturerName: manufacturer.name
        };
        document.dispatchEvent(new CustomEvent('start-chat-with-context', { detail }));
    };

    const navItems = manufacturers
        .filter(m => m.category.includes(manufacturer.category[0]))
        .map(m => ({
            id: m.slug,
            title: m.name,
            page: 'hersteller-detail', // Page type remains the same
        }));

    return (
        <div className="bg-slate-50" style={{ paddingTop: `${bannerHeight + headerHeight}px` }}>
            {selectedProduct && (
                <ProductDetailModal
                    product={selectedProduct}
                    onClose={() => setSelectedProduct(null)}
                    comparisonList={comparisonList}
                    onToggleCompare={onToggleCompare}
                    onQuote={openChatWithContext}
                />
            )}
            
             <SubHeader
                navItems={navItems}
                activeItemId={manufacturer.slug}
                onItemClick={(slug) => onSelectHersteller(slug)}
                bannerHeight={bannerHeight}
                headerHeight={headerHeight}
            />

            <div className="py-20">
                <div className="container mx-auto px-6">
                    <main className="max-w-4xl mx-auto space-y-16">
                        {/* Header / Banner */}
                        <header className="bg-white p-8 rounded-lg shadow-md border border-slate-200">
                            <div className="flex flex-col md:flex-row items-center gap-8">
                                <div className="flex-shrink-0 bg-white p-4 border border-slate-200 rounded-lg shadow-md h-32 w-64 flex items-center justify-center">
                                    <img src={manufacturer.logoUrl} alt={`${manufacturer.name} Logo`} loading="lazy" decoding="async" className="max-h-full max-w-full object-contain" />
                                </div>
                                <div>
                                    <h1 className="text-3xl md:text-4xl font-bold text-slate-900">{manufacturer.name}</h1>
                                    <p className="text-lg text-slate-600 mt-2">{manufacturer.description}</p>
                                </div>
                            </div>
                        </header>

                        {/* Company Statistics */}
                        {manufacturer.stats && (
                            <section className="bg-gradient-to-br from-green-50 to-blue-50 p-8 rounded-lg">
                                <h2 className="text-3xl font-bold text-slate-900 mb-6 text-center">Unternehmen in Zahlen</h2>
                                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                                    <div className="text-center">
                                        <div className="text-3xl font-bold text-green-600">{manufacturer.stats.foundedYear}</div>
                                        <div className="text-slate-600 font-medium">Gegründet</div>
                                    </div>
                                    <div className="text-center">
                                        <div className="text-3xl font-bold text-blue-600">{manufacturer.stats.employeesGlobal.toLocaleString()}</div>
                                        <div className="text-slate-600 font-medium">Mitarbeiter weltweit</div>
                                    </div>
                                    {manufacturer.stats.annualProduction && (
                                        <div className="text-center">
                                            <div className="text-3xl font-bold text-purple-600">{manufacturer.stats.annualProduction}</div>
                                            <div className="text-slate-600 font-medium">Jahresproduktion</div>
                                        </div>
                                    )}
                                    {manufacturer.stats.totalInstalled && (
                                        <div className="text-center">
                                            <div className="text-3xl font-bold text-orange-600">{manufacturer.stats.totalInstalled}</div>
                                            <div className="text-slate-600 font-medium">Global installiert</div>
                                        </div>
                                    )}
                                </div>
                                {manufacturer.stats.marketPresence && (
                                    <div className="mt-6 text-center">
                                        <h3 className="text-lg font-semibold text-slate-800 mb-3">Globale Präsenz</h3>
                                        <div className="flex flex-wrap justify-center gap-2">
                                            {manufacturer.stats.marketPresence.map((country, index) => (
                                                <span key={index} className="bg-white px-3 py-1 rounded-full text-sm text-slate-700 border">
                                                    {country}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </section>
                        )}

                        {/* Technical Innovations */}
                        {manufacturer.technicalInnovations && manufacturer.technicalInnovations.length > 0 && (
                            <section>
                                <h2 className="text-3xl font-bold text-slate-900 mb-6 text-center">Technische Innovationen</h2>
                                <div className="bg-white p-8 rounded-lg shadow-md border border-slate-200">
                                    <div className="grid md:grid-cols-2 gap-4">
                                        {manufacturer.technicalInnovations.map((innovation, index) => (
                                            <div key={index} className="flex items-start space-x-3">
                                                <div className="flex-shrink-0 w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mt-1">
                                                    <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                                    </svg>
                                                </div>
                                                <p className="text-slate-700 font-medium">{innovation}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </section>
                        )}

                        {/* Company History */}
                        {manufacturer.companyHistory && manufacturer.companyHistory.length > 0 && (
                            <section>
                                <h2 className="text-3xl font-bold text-slate-900 mb-6 text-center">Unternehmensgeschichte</h2>
                                <div className="space-y-6">
                                    {manufacturer.companyHistory.map((milestone, index) => (
                                        <div key={index} className="bg-white p-6 rounded-lg shadow-md border border-slate-200 flex">
                                            <div className="flex-shrink-0 w-20 text-center">
                                                <div className="text-2xl font-bold text-green-600">{milestone.year}</div>
                                            </div>
                                            <div className="flex-1 ml-6">
                                                <h3 className="text-xl font-bold text-slate-800 mb-2">{milestone.milestone}</h3>
                                                <p className="text-slate-600">{milestone.description}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}

                        {/* Sustainability & Environmental Impact */}
                        {manufacturer.sustainability && (
                            <section>
                                <h2 className="text-3xl font-bold text-slate-900 mb-6 text-center">Nachhaltigkeit & Umweltschutz</h2>
                                <div className="bg-green-50 p-8 rounded-lg border border-green-200">
                                    <div className="grid md:grid-cols-3 gap-8 mb-6">
                                        <div className="text-center">
                                            <div className={`text-4xl mb-2 ${manufacturer.sustainability.co2Neutral ? 'text-green-600' : 'text-orange-600'}`}>
                                                {manufacturer.sustainability.co2Neutral ? '✓' : '⚠'}
                                            </div>
                                            <div className="text-lg font-semibold text-slate-800">
                                                {manufacturer.sustainability.co2Neutral ? 'CO₂-Neutral' : 'CO₂-Reduzierung'}
                                            </div>
                                        </div>
                                        <div className="text-center">
                                            <div className="text-4xl font-bold text-green-600 mb-2">
                                                {manufacturer.sustainability.renewableEnergy}%
                                            </div>
                                            <div className="text-lg font-semibold text-slate-800">Erneuerbare Energie</div>
                                        </div>
                                        <div className="text-center">
                                            <div className={`text-4xl mb-2 ${manufacturer.sustainability.recyclingProgram ? 'text-green-600' : 'text-gray-400'}`}>
                                                ♻
                                            </div>
                                            <div className="text-lg font-semibold text-slate-800">
                                                {manufacturer.sustainability.recyclingProgram ? 'Recycling-Programm' : 'Kein Recycling'}
                                            </div>
                                        </div>
                                    </div>
                                    <p className="text-slate-700 text-center text-lg">{manufacturer.sustainability.description}</p>
                                    {manufacturer.sustainability.certifications.length > 0 && (
                                        <div className="mt-6">
                                            <h4 className="text-lg font-semibold text-slate-800 text-center mb-3">Umwelt-Zertifizierungen</h4>
                                            <div className="flex flex-wrap justify-center gap-2">
                                                {manufacturer.sustainability.certifications.map((cert, index) => (
                                                    <span key={index} className="bg-green-200 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                                                        {cert}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </section>
                        )}

                        {/* Quality Assurance & Certifications */}
                        {manufacturer.qualityAssurance && (
                            <section>
                                <h2 className="text-3xl font-bold text-slate-900 mb-6 text-center">Qualitätssicherung & Garantien</h2>
                                <div className="grid md:grid-cols-2 gap-8">
                                    <div className="bg-white p-6 rounded-lg shadow-md border border-slate-200">
                                        <h3 className="text-xl font-bold text-slate-800 mb-4">Qualitätsstandards</h3>
                                        {manufacturer.qualityAssurance.iso && (
                                            <div className="mb-4">
                                                <h4 className="font-semibold text-slate-700 mb-2">ISO-Zertifizierungen</h4>
                                                <div className="flex flex-wrap gap-2">
                                                    {manufacturer.qualityAssurance.iso.map((iso, index) => (
                                                        <span key={index} className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm">
                                                            {iso}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                        {manufacturer.qualityAssurance.testing && (
                                            <div>
                                                <h4 className="font-semibold text-slate-700 mb-2">Qualitätstests</h4>
                                                <ul className="space-y-1">
                                                    {manufacturer.qualityAssurance.testing.map((test, index) => (
                                                        <li key={index} className="text-slate-600 text-sm flex items-center">
                                                            <svg className="w-4 h-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                                            </svg>
                                                            {test}
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        )}
                                    </div>
                                    <div className="bg-white p-6 rounded-lg shadow-md border border-slate-200">
                                        <h3 className="text-xl font-bold text-slate-800 mb-4">Garantieleistungen</h3>
                                        {manufacturer.qualityAssurance.warranty && (
                                            <div className="space-y-4">
                                                <div className="bg-green-50 p-4 rounded-lg">
                                                    <div className="font-semibold text-green-800">{manufacturer.qualityAssurance.warranty.product}</div>
                                                    <div className="text-sm text-green-600">{manufacturer.qualityAssurance.warranty.performance}</div>
                                                </div>
                                                <p className="text-slate-600 text-sm">{manufacturer.qualityAssurance.warranty.description}</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </section>
                        )}

                        {/* Achievements & Awards */}
                        {manufacturer.achievements && manufacturer.achievements.length > 0 && (
                            <section>
                                <h2 className="text-3xl font-bold text-slate-900 mb-6 text-center">Auszeichnungen & Erfolge</h2>
                                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {manufacturer.achievements.map((achievement, index) => (
                                        <div key={index} className="bg-white p-6 rounded-lg shadow-md border border-slate-200 text-center">
                                            <div className="text-3xl mb-3">
                                                {achievement.category === 'award' && '🏆'}
                                                {achievement.category === 'certification' && '📜'}
                                                {achievement.category === 'milestone' && '🎯'}
                                                {achievement.category === 'innovation' && '💡'}
                                            </div>
                                            <h3 className="font-bold text-slate-800 mb-2">{achievement.title}</h3>
                                            <div className="text-green-600 font-semibold mb-2">{achievement.year}</div>
                                            <p className="text-slate-600 text-sm">{achievement.description}</p>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}

                        {/* Regional Partnerships */}
                        {manufacturer.regionalPartnerships && manufacturer.regionalPartnerships.length > 0 && (
                            <section>
                                <h2 className="text-3xl font-bold text-slate-900 mb-6 text-center">Regionale Partnerschaften</h2>
                                <div className="space-y-6">
                                    {manufacturer.regionalPartnerships.map((partnership, index) => (
                                        <div key={index} className="bg-white p-6 rounded-lg shadow-md border border-slate-200">
                                            <div className="flex items-center justify-between mb-4">
                                                <h3 className="text-xl font-bold text-slate-800">{partnership.region}</h3>
                                                {partnership.serviceCenter && (
                                                    <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                                                        Service-Center verfügbar
                                                    </span>
                                                )}
                                            </div>
                                            <div>
                                                <h4 className="font-semibold text-slate-700 mb-2">Partner vor Ort</h4>
                                                <div className="flex flex-wrap gap-2">
                                                    {partnership.partners.map((partner, partnerIndex) => (
                                                        <span key={partnerIndex} className="bg-slate-100 text-slate-700 px-3 py-1 rounded-full text-sm">
                                                            {partner}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}

                        {/* Why we trust this partner */}
                        <section>
                            <h2 className="text-3xl font-bold text-slate-900 mb-6 text-center">Warum wir auf {manufacturer.name} setzen</h2>
                            <div className="grid md:grid-cols-3 gap-6">
                               {manufacturer.whyWeTrust.map((reason, index) => (
                                   <div key={index} className="bg-white p-6 rounded-lg border border-slate-200 shadow-lg text-center">
                                        <svg className="w-10 h-10 text-green-500 mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                       <p className="text-slate-700 font-semibold">{reason}</p>
                                   </div>
                               ))}
                            </div>
                        </section>
                    
                        {/* Products */}
                        <section>
                            <h2 className="text-3xl font-bold text-slate-900 mb-8 text-center">Produkt-Highlights</h2>
                            {manufacturer.products.length > 0 ? (
                                <div className="grid md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-8">
                                    {manufacturer.products.map((product, index) => (
                                        <ProductCard 
                                            key={index} 
                                            product={product} 
                                            onQuote={openChatWithContext}
                                            comparisonList={comparisonList}
                                            onToggleCompare={onToggleCompare}
                                            onShowDetails={setSelectedProduct}
                                        />
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-16 bg-white rounded-lg shadow-md border">
                                    <h3 className="text-xl font-semibold text-slate-700">Keine Produkte gefunden.</h3>
                                    <p className="text-slate-500 mt-2">Für diesen Hersteller sind aktuell keine Produkte hinterlegt.</p>
                                </div>
                            )}
                        </section>
                    </main>
                </div>
            </div>
        </div>
    );
};

export default HerstellerDetailPage;
