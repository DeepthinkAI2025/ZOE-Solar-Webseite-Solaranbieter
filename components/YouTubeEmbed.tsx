import React from 'react';

interface YouTubeEmbedProps {
    videoId: string;
}

const YouTubeEmbed: React.FC<YouTubeEmbedProps> = ({ videoId }) => {
    return (
        <div className="aspect-video w-full my-2 rounded-lg overflow-hidden shadow-md">
            <iframe
                width="100%"
                height="100%"
                src={`https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1&iv_load_policy=3`}
                title="Eingebettetes YouTube Video"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
            ></iframe>
        </div>
    );
};

export default YouTubeEmbed;