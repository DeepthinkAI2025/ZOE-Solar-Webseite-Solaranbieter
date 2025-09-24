import React, { useRef, useEffect, useState } from 'react';

const AnimatedSection: React.FC<{children: React.ReactNode, className?: string}> = ({ children, className }) => {
    const ref = useRef<HTMLDivElement>(null);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const observer = new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting) {
                setIsVisible(true);
                observer.unobserve(entry.target);
            }
        }, { threshold: 0.1 });

        const currentElement = ref.current;
        if (currentElement) {
            observer.observe(currentElement);
        }
        return () => {
            if (currentElement) {
                observer.unobserve(currentElement);
            }
        };
    }, []);

    return (
        <div ref={ref} className={`animate-section ${isVisible ? 'is-visible' : ''} ${className || ''}`}>
            {children}
        </div>
    );
};

export default AnimatedSection;