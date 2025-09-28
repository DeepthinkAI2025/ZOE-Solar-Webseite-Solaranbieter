import React, { useState, useEffect, useRef } from 'react';
import { testimonialsData as localTestimonials } from '../data/testimonials';
import { googleReviews } from '../data/reviews';

const formatName = (fullName: string): string => {
    if (!fullName || typeof fullName !== 'string') return '';
    const parts = fullName.trim().split(/\s+/);
    if (parts.length > 1) {
        const firstName = parts[0];
        const lastNameInitial = parts[parts.length - 1].charAt(0);
        return `${firstName} ${lastNameInitial}.`;
    }
    return fullName; // Already formatted or single name
};


const allTestimonials = [
    ...localTestimonials.map(testimonial => ({
        ...testimonial,
        name: formatName(testimonial.name)
    })),
    ...googleReviews.filter(r => r.rating >= 4).map(r => ({
        quote: r.text,
        name: r.name,
        company: 'Google Bewertung',
        avatarUrl: `https://avatar.vercel.sh/${r.name.replace(/\s/g, '')}`,
        rating: r.rating
    }))
];


const StarRating: React.FC<{ rating: number }> = ({ rating }) => (
    <div className="flex text-yellow-400 mb-4">
        {[...Array(5)].map((_, i) => (
            <svg key={i} xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill={i < rating ? "currentColor" : "none"} stroke="currentColor" strokeWidth={i < rating ? 0 : 1.5} strokeLinejoin="round">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
        ))}
    </div>
);

const Testimonials: React.FC = () => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [containerHeight, setContainerHeight] = useState<number | undefined>(undefined);
    const timeoutRef = useRef<number | null>(null);
    const slideRefs = useRef<(HTMLDivElement | null)[]>([]);

    const resetTimeout = () => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }
    };
    
    useEffect(() => {
        resetTimeout();
        timeoutRef.current = window.setTimeout(
            () => setCurrentIndex((prevIndex) => (prevIndex + 1) % allTestimonials.length),
            5000 // Change slide every 5 seconds
        );
        return () => {
            resetTimeout();
        };
    }, [currentIndex]);

    useEffect(() => {
        const handleResize = () => {
            if (slideRefs.current[currentIndex]) {
                setContainerHeight(slideRefs.current[currentIndex]?.offsetHeight);
            }
        };
        handleResize(); // Set height on index change
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [currentIndex]);

    const goToSlide = (slideIndex: number) => {
        setCurrentIndex(slideIndex);
    };

    const goToPrev = () => {
        const isFirstSlide = currentIndex === 0;
        const newIndex = isFirstSlide ? allTestimonials.length - 1 : currentIndex - 1;
        setCurrentIndex(newIndex);
    };

    const goToNext = () => {
        const isLastSlide = currentIndex === allTestimonials.length - 1;
        const newIndex = isLastSlide ? 0 : currentIndex + 1;
        setCurrentIndex(newIndex);
    };

    return (
        <section id="testimonials" className="py-20 bg-slate-900 text-white">
            <div className="max-w-7xl mx-auto px-6">
                <div className="text-center mb-16 max-w-4xl mx-auto">
                    <p className="font-bold text-green-400 uppercase tracking-wider">Social Proof</p>
                    <h2 className="text-4xl lg:text-5xl font-bold text-white mt-2 testimonial-highlight">Was Familienbetriebe wie Ihrer sagen.</h2>
                    <p className="text-lg text-slate-300 mt-4">
                        Ihre Zufriedenheit ist unser Antrieb und die beste Referenz. Lesen Sie authentische Bewertungen von Familienbetrieben und Unternehmen, die wir auf ihrem Weg in eine sichere Energiezukunft begleitet haben.
                    </p>
                </div>
                
                <div className="max-w-3xl mx-auto relative">
                    <div 
                        className="relative transition-[height] duration-500 ease-in-out"
                        style={{ height: containerHeight ? `${containerHeight}px` : undefined }}
                        onMouseEnter={() => resetTimeout()}
                        onMouseLeave={() => {
                            timeoutRef.current = window.setTimeout(
                                () => setCurrentIndex((prevIndex) => (prevIndex + 1) % allTestimonials.length),
                                5000
                            );
                        }}
                    >
                        {allTestimonials.map((testimonial, index) => (
                            <div
                                key={index}
                                className={`absolute w-full top-0 left-0 transition-opacity duration-1000 ease-in-out ${index === currentIndex ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
                            >
                                {/* FIX: Changed ref callback to a block statement to ensure a void return type and fix TypeScript error. */}
                                <div ref={el => { slideRefs.current[index] = el; }}>
                                    <div className="bg-slate-800 p-8 rounded-xl border border-slate-700 shadow-lg flex flex-col relative">
                                        <div className="absolute top-4 left-6 text-8xl font-serif text-slate-700 opacity-50 z-0">“</div>
                                        <div className="relative z-10 flex flex-col flex-grow">
                                            {testimonial.rating && <StarRating rating={testimonial.rating} />}
                                            <blockquote className="text-slate-200 mb-6 italic">
                                                {testimonial.quote}
                                            </blockquote>
                                            <div className="pt-6 border-t border-slate-700 flex items-center gap-4">
                                                {testimonial.avatarUrl && <img src={testimonial.avatarUrl} alt={testimonial.name} loading="lazy" decoding="async" className="w-12 h-12 rounded-full object-cover border-2 border-slate-600"/>}
                                                <div>
                                                    <p className="font-bold text-white">{testimonial.name}</p>
                                                    <p className="text-sm text-slate-400">{testimonial.company}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Slider Controls */}
                    <button onClick={goToPrev} className="absolute top-1/2 -left-4 md:-left-12 transform -translate-y-1/2 z-20 bg-slate-700/50 hover:bg-slate-700 p-3 rounded-full transition-colors" aria-label="Vorherige Bewertung">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg>
                    </button>
                    <button onClick={goToNext} className="absolute top-1/2 -right-4 md:-right-12 transform -translate-y-1/2 z-20 bg-slate-700/50 hover:bg-slate-700 p-3 rounded-full transition-colors" aria-label="Nächste Bewertung">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
                    </button>
                </div>
                
                 {/* Dots Navigation */}
                <div className="flex justify-center gap-2 mt-8">
                    {allTestimonials.map((_, slideIndex) => (
                        <button
                            key={slideIndex}
                            onClick={() => goToSlide(slideIndex)}
                            className={`w-3 h-3 rounded-full transition-colors ${currentIndex === slideIndex ? 'bg-green-500' : 'bg-slate-600 hover:bg-slate-500'}`}
                            aria-label={`Gehe zu Bewertung ${slideIndex + 1}`}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Testimonials;