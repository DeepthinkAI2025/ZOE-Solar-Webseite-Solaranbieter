import React from 'react';

// Helper to create URL-friendly slugs from terms
const slugify = (text: string) =>
    text
        .toString()
        .toLowerCase()
        .trim()
        .replace(/\s*\(.*\)\s*/g, '') // Remove content in parentheses and surrounding spaces
        .replace(/\s+/g, '-') 
        .replace(/[^\w\-]+/g, '')
        .replace(/\-\-+/g, '-');

const GlossarLink: React.FC<{ term: string; children?: React.ReactNode }> = ({ term, children }) => {
    const slug = slugify(term);
    const handleClick = (e: React.MouseEvent) => {
        e.preventDefault();
        // Set hash first to ensure it's available when the page component mounts/updates
        window.location.hash = slug; 
        const event = new CustomEvent('set-page', { detail: 'glossar' });
        document.dispatchEvent(event);
    };

    return <a href={`#${slug}`} onClick={handleClick} className="text-green-600 hover:underline font-semibold cursor-pointer">{children || term}</a>;
};

export default GlossarLink;
