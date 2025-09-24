import React, { useState, useEffect, useRef } from 'react';
import { GoogleGenAI } from "@google/genai";

interface ImageWithFallbackProps extends React.ImgHTMLAttributes<HTMLImageElement> {
    // Must provide alt text for fallback generation
    alt: string;
    // Provide dimensions for correct aspect ratio
    imgWidth?: number;
    imgHeight?: number;
}

const ImageWithFallback: React.FC<ImageWithFallbackProps> = ({ src, alt, imgWidth, imgHeight, ...props }) => {
    const [imgSrc, setImgSrc] = useState(src);
    const [isLoading, setIsLoading] = useState(false);
    const hasTriedFallback = useRef(false);
    const ai = useRef<GoogleGenAI | null>(null);

    useEffect(() => {
        ai.current = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
    }, []);

    const getAspectRatio = (width?: number, height?: number): "1:1" | "4:3" | "3:4" | "16:9" | "9:16" => {
        if (!width || !height || width === 0 || height === 0) return '1:1';
        const ratio = width / height;
        const ratios: Record<"1:1" | "4:3" | "3:4" | "16:9" | "9:16", number> = {
            '1:1': 1,
            '4:3': 4/3,
            '3:4': 3/4,
            '16:9': 16/9,
            '9:16': 9/16,
        };
        
        const closest = (Object.keys(ratios) as Array<keyof typeof ratios>).reduce((a, b) => {
            return Math.abs(ratios[b] - ratio) < Math.abs(ratios[a] - ratio) ? b : a;
        });
        return closest;
    }

    const handleError = async () => {
        if (hasTriedFallback.current || !ai.current || !alt) return;
        hasTriedFallback.current = true;
        setIsLoading(true);
        console.log(`Image failed to load: ${src}. Generating fallback for: ${alt}`);

        try {
            const aspectRatio = getAspectRatio(imgWidth, imgHeight);
            
            const response = await ai.current.models.generateImages({
                model: 'imagen-4.0-generate-001',
                prompt: `Photorealistic image of: ${alt}. For a professional corporate website about solar energy. High quality, clean, modern aesthetic. Aspect ratio ${aspectRatio}.`,
                config: {
                    numberOfImages: 1,
                    outputMimeType: 'image/jpeg',
                    aspectRatio: aspectRatio,
                },
            });

            if (response && response.generatedImages && response.generatedImages.length > 0 && response.generatedImages[0].image?.imageBytes) {
                const base64ImageBytes: string = response.generatedImages[0].image.imageBytes;
                const imageUrl = `data:image/jpeg;base64,${base64ImageBytes}`;
                setImgSrc(imageUrl);
            } else {
                throw new Error("API returned no images or image data was missing.");
            }
        } catch (error) {
            console.error('Error generating fallback image:', error);
            // Fallback to a placeholder if Gemini fails
            setImgSrc(`https://via.placeholder.com/${imgWidth || 400}x${imgHeight || 300}.png?text=Bild+nicht+gefunden`);
        } finally {
            setIsLoading(false);
        }
    };
    
    useEffect(() => {
        // Reset state if the src prop changes
        setImgSrc(src);
        hasTriedFallback.current = false;
    }, [src]);

    if (isLoading) {
        return <div className={`w-full h-full bg-slate-200 animate-pulse ${props.className}`}></div>;
    }

    return <img src={imgSrc} alt={alt} onError={handleError} {...props} />;
};

export default ImageWithFallback;