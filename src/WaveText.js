import React, { useRef, useEffect } from 'react';
import './WaveText.css'; // Import your CSS file for styling

const WAVE_COLORS = ["#df9ee9", "#dbb54c", "#71c1c1", "#f6dbc4", "#897769", "#9e3420", "#51473f", "#51473f", "#51473f"];

const WaveText = ({ text, colored = false, size = 60 }) => {
    const containerRef = useRef(null);
    const startTimeRef = useRef(Date.now());

    useEffect(() => {
        const animate = () => {
            const now = Date.now();
            const time = (now - startTimeRef.current) / 300; // seconds
            const container = containerRef.current;
            if (!container)
                return;

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
        <div className="wave-text mx-auto text-center" ref={containerRef}>
            {text.split('').map((char, index) => (
                <span key={index} style={{ color: colored ? WAVE_COLORS[index] : undefined, fontSize: size + "px" }}>{char}</span>
            ))}
        </div>
    );
};

export default WaveText;