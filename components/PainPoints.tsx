import React, { useState, useEffect, useRef } from 'react';
import { painPointsData } from '../data/painPoints';

const Icon: React.FC<{ name: string; className: string }> = ({ name, className }) => {
    const strokeWidth = 1.5;
    
    const icons: { [key: string]: React.ReactNode } = {
        lock: <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={strokeWidth}><path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 00-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" /></svg>,
        subcontract: <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={strokeWidth}><path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-4.663l.353.353" /><path strokeLinecap="round" strokeLinejoin="round" d="M12 8.25a2.25 2.25 0 100 4.5 2.25 2.25 0 000-4.5z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 21a3 3 0 100-6 3 3 0 000 6z" /></svg>,
        expensive: <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={strokeWidth}><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33" /></svg>,
        bad_service: <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={strokeWidth}><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" /></svg>,
        independent: <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={strokeWidth}><path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418" /></svg>,
        team: <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={strokeWidth}><path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m-7.5-2.962A3.375 3.375 0 0110.5 9.75v-.75a3.375 3.375 0 013.375-3.375s-1.543.425-2.25 1.5c-.296.346-.45.743-.45 1.125v.75m-3.375 0c-.296.346-.45.743-.45 1.125v.75m-3.375 0c-.296.346-.45.743-.45 1.125v.75M6.375 12v.75a3.375 3.375 0 01-3.375 3.375c-1.386 0-2.595-.57-3.375-1.5m15.75-3.375c.296-.346.45-.743.45-1.125v-.75m3.375 0c-.296-.346.45-.743.45-1.125v-.75m3.375 0c-.296-.346.45-.743.45-1.125v-.75M9 12.75h6" /></svg>,
        all_in_one: <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={strokeWidth}><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" /></svg>,
        partner: <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={strokeWidth}><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 12c0-1.232-.046-2.453-.138-3.662a4.006 4.006 0 00-3.7-3.7 48.678 48.678 0 00-7.324 0 4.006 4.006 0 00-3.7 3.7c-.092 1.21-.138 2.43-.138 3.662v4.286a4.006 4.006 0 003.7 3.7 48.656 48.656 0 007.324 0 4.006 4.006 0 003.7-3.7v-4.286zM12 15a3 3 0 100-6 3 3 0 000 6z" /></svg>,
        weather: <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={strokeWidth}><path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg>,
        revenue: <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={strokeWidth}><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-5.94-2.28m5.94 2.28l-2.28 5.941" /></svg>,
    };
    return icons[name] || null;
};

const PainPoints: React.FC = () => {
    const sectionRef = useRef<HTMLDivElement>(null);
    const [scrollProgress, setScrollProgress] = useState(0);

    const STEP_HEIGHT_VH = 25; // Shorten scroll track for a tighter animation
    const scrollHeight = `${100 + (painPointsData.length - 1) * STEP_HEIGHT_VH}vh`;

    useEffect(() => {
        const handleScroll = () => {
            const el = sectionRef.current;
            if (!el) return;

            const scrollableHeight = el.scrollHeight - window.innerHeight;
            const top = el.getBoundingClientRect().top;

            if (scrollableHeight > 0) {
                const progress = Math.max(0, Math.min(1, -top / scrollableHeight));
                setScrollProgress(progress);
            }
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        handleScroll();
        
        return () => window.removeEventListener('scroll', handleScroll);
    }, [scrollHeight]);

    const numAnimatingCards = painPointsData.length - 1;

    return (
        <section ref={sectionRef} id="der-unterschied" className="relative bg-slate-50 text-slate-900 overflow-x-clip" style={{ height: scrollHeight }}>
            <div className="sticky top-0 flex h-auto min-h-[90vh] items-center overflow-hidden py-20">
                <div className="max-w-7xl mx-auto w-full px-6">
                    <div>
                        <div className="text-center max-w-4xl mx-auto relative z-50 mb-8 md:mb-12">
                            <p className="font-bold text-green-600 uppercase tracking-wider">Der ZOE Solar Vorteil</p>
                            <h2 className="text-4xl lg:text-5xl font-bold text-slate-900 mt-2">Sicherheit für Ihre Familie.</h2>
                            <p className="text-lg text-slate-600 mt-4">
                               Unsere Garantien für Ihre Zukunft. Sehen Sie, wie wir typische Sorgen ausräumen und Sicherheit für Ihre langfristige Planung schaffen.
                            </p>
                        </div>

                        <div className="relative w-full flex items-center justify-center" style={{ minHeight: '420px' }}>
                            {painPointsData.map((item, index) => {
                                let opacity = 0;
                                let translateY = 75;

                                if (index === 0) {
                                    opacity = 1;
                                    translateY = 0;
                                } else {
                                    const startProgress = (index - 1) / numAnimatingCards;
                                    const endProgress = index / numAnimatingCards;
                                    
                                    const animationStart = startProgress;
                                    const animationEnd = endProgress;

                                    if (scrollProgress >= animationEnd) {
                                        opacity = 1;
                                        translateY = 0;
                                    } else if (scrollProgress >= animationStart) {
                                        const animationProgress = (scrollProgress - animationStart) / (animationEnd - animationStart);
                                        opacity = Math.min(1, animationProgress * 20); // Opaque after 5%
                                        translateY = 75 * (1 - animationProgress);
                                    }
                                }

                                return (
                                    <div
                                        key={item.id}
                                        className="absolute w-full max-w-6xl"
                                        style={{
                                            zIndex: 2 + index,
                                            opacity: opacity,
                                            transform: `translateY(${translateY}px)`,
                                            willChange: 'transform, opacity',
                                        }}
                                    >
                                        <div className="relative w-full bg-white rounded-3xl p-8 md:p-12 flex items-center border border-slate-200 shadow-2xl">
                                            <div className="absolute -top-8 -right-8 text-[12rem] font-bold text-slate-200/60 select-none z-0">
                                                {item.number}
                                            </div>
                                            <div className="grid md:grid-cols-2 gap-8 lg:gap-12 w-full relative z-10">
                                                {/* Problem Column */}
                                                <div className="space-y-3">
                                                    <div className="flex items-center gap-4">
                                                        <div className="bg-red-50 p-3 rounded-xl border border-red-200">
                                                            <Icon name={item.problem.icon} className="w-12 h-12 text-red-500 flex-shrink-0" />
                                                        </div>
                                                        <div>
                                                            <h4 className="text-sm font-bold text-red-600 uppercase tracking-wider">Markt-Risiko</h4>
                                                            <h3 className="text-2xl lg:text-3xl font-bold text-slate-900">{item.problem.title}</h3>
                                                        </div>
                                                    </div>
                                                    <p className="text-slate-600 text-lg leading-relaxed pt-2">{item.problem.description}</p>
                                                </div>

                                                {/* Solution Column */}
                                                <div className="space-y-3 border-t-2 md:border-t-0 md:border-l-2 border-green-300 pt-8 md:pt-0 md:pl-8">
                                                    <div className="flex items-center gap-4">
                                                        <div className="bg-green-50 p-3 rounded-xl border border-green-200">
                                                            <Icon name={item.solution.icon} className="w-12 h-12 text-green-500 flex-shrink-0" />
                                                        </div>
                                                        <div>
                                                            <h4 className="text-sm font-bold text-green-600 uppercase tracking-wider">Der ZOE Solar Standard</h4>
                                                            <h3 className="text-2xl lg:text-3xl font-bold text-slate-900">{item.solution.title}</h3>
                                                        </div>
                                                    </div>
                                                    <p className="text-slate-600 text-lg leading-relaxed pt-2">{item.solution.description}</p>
                                                    {item.solution.guarantee && (
                                                        <div className="mt-6 pt-6 border-t border-dashed border-slate-300">
                                                             <div className="flex items-center gap-3">
                                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
                                                                <h5 className="font-bold text-green-800">{item.solution.guarantee.title}</h5>
                                                             </div>
                                                             <p className="text-green-900/90 font-semibold italic mt-2 pl-9">
                                                                "{item.solution.guarantee.text}"
                                                             </p>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default PainPoints;