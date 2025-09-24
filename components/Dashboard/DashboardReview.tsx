import React, { useState } from 'react';

const Star: React.FC<{ filled: boolean; onClick: () => void; onMouseEnter: () => void; onMouseLeave: () => void }> = ({ filled, onClick, onMouseEnter, onMouseLeave }) => (
    <button
        type="button"
        onClick={onClick}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        className="text-yellow-400 focus:outline-none"
        aria-label={`Rate ${filled ? 'filled' : 'empty'} star`}
    >
        <svg className="w-10 h-10" fill={filled ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
    </button>
);

const DashboardReview: React.FC = () => {
    const [rating, setRating] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);
    
    // NOTE: Replace with your actual Google Place ID
    const GOOGLE_PLACE_ID = 'ChIJN1t_tDeuEmsRUsoyG83frY4'; // Example Place ID for Brandenburg Gate
    const reviewUrl = `https://search.google.com/local/writereview?placeid=${GOOGLE_PLACE_ID}`;

    const handleReviewClick = () => {
        window.open(reviewUrl, '_blank', 'noopener,noreferrer');
    };

    return (
        <div>
            <h1 className="text-3xl font-bold text-slate-800 mb-6">Bewertung abgeben</h1>
            <div className="bg-white p-8 rounded-lg shadow-md border border-slate-200">
                <h2 className="text-2xl font-bold text-slate-800 text-center">Wie zufrieden sind Sie mit ZOE Solar?</h2>
                <p className="text-slate-600 text-center mt-2 mb-6">Ihre Meinung hilft uns und anderen Kunden. Mit einem Klick werden Sie zu Google weitergeleitet, um Ihre Bewertung öffentlich zu teilen.</p>
                
                <div className="flex justify-center items-center gap-2 mb-8" onMouseLeave={() => setHoverRating(0)}>
                    {[1, 2, 3, 4, 5].map(index => (
                        <Star 
                            key={index}
                            filled={hoverRating >= index || rating >= index}
                            onClick={() => setRating(index)}
                            onMouseEnter={() => setHoverRating(index)}
                            onMouseLeave={() => setHoverRating(0)} // This is handled by the parent div
                        />
                    ))}
                </div>

                <div className="text-center">
                    <button 
                        onClick={handleReviewClick}
                        disabled={rating === 0}
                        className="bg-green-600 text-white font-bold py-3 px-8 rounded-lg text-lg hover:bg-green-700 transition-all duration-300 shadow-lg transform hover:-translate-y-1 disabled:bg-slate-400 disabled:cursor-not-allowed disabled:shadow-none disabled:transform-none"
                    >
                        Bewertung auf Google abgeben
                    </button>
                    <p className="text-xs text-slate-400 mt-3">Sie werden zu Google weitergeleitet. Es gelten die dortigen Datenschutzbestimmungen.</p>
                </div>
            </div>
        </div>
    );
};

export default DashboardReview;
