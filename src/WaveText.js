import React, { useRef, useEffect } from 'react';
import './WaveText.css'; // Import your CSS file for styling

const WaveText = ({ text }) => {
    const containerRef = useRef(null);
    const startTimeRef = useRef(Date.now());

    useEffect(() => {
        const animate = () => {
            const now = Date.now();
            const time = (now - startTimeRef.current) / 300; // seconds
            const container = containerRef.current;
            const spans = container.querySelectorAll('span');

            spans.forEach((span, index) => {
                const frequency = .5; // Controls the wave frequency
                const amplitude = 5; // Controls the wave height
                const offset = 0; // Horizontal offset for animation

                const yOffset = Math.sin(-1 * (index + offset) * frequency + time) * amplitude;
                span.style.transform = `translateY(${yOffset}px)`;
            });

            requestAnimationFrame(animate);
        };

        animate();
    }, []);

    return (
        <div className="wave-text" ref={containerRef}>
            {text.split('').map((char, index) => (
                <span key={index}>{char}</span>
            ))}
        </div>
    );
};

export default WaveText;