import React, { useEffect, useState } from 'react';

interface GoodbyePageProps {
    onComplete: () => void;
}

const GoodbyePage: React.FC<GoodbyePageProps> = ({ onComplete }) => {
    const [message, setMessage] = useState("Thank you for banking with Swedish Construction Bank.");

    useEffect(() => {
        const messageTimer = setTimeout(() => {
            setMessage("Securing your session...");
        }, 1500);
        
        const completionTimer = setTimeout(onComplete, 3000);

        return () => {
            clearTimeout(messageTimer);
            clearTimeout(completionTimer);
        };
    }, [onComplete]);

    return (
        <div className="min-h-screen bg-[#1a365d] text-white flex flex-col items-center justify-center p-4 animate-fade-in-slow">
            <div className="text-center">
                <i className="fas fa-university text-6xl text-yellow-400 mb-6"></i>
                <h1 className="text-4xl font-bold mb-4 transition-opacity duration-500">
                   {message}
                </h1>
                <div className="mt-8 w-24 h-1 bg-yellow-400/20 rounded-full overflow-hidden mx-auto">
                    <div className="h-1 bg-yellow-400 animate-pulse"></div>
                </div>
            </div>
        </div>
    );
};

export default GoodbyePage;