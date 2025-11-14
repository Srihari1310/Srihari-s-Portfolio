import React, { useState, useEffect, useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';

const Cursor: React.FC = () => {
    const [isHovered, setIsHovered] = useState(false);
    const cursorRef = useRef<HTMLDivElement>(null);
    const lastHoveredElement = useRef<Element | null>(null);

    const cursorX = useMotionValue(-100);
    const cursorY = useMotionValue(-100);

    const springConfig = { damping: 25, stiffness: 400, mass: 0.5 };
    const cursorXSpring = useSpring(cursorX, springConfig);
    const cursorYSpring = useSpring(cursorY, springConfig);

    const velocityX = useMotionValue(0);
    const velocityY = useMotionValue(0);
    const smoothedVelocityX = useSpring(velocityX, { damping: 20, stiffness: 200 });
    const smoothedVelocityY = useSpring(velocityY, { damping: 20, stiffness: 200 });

    const rotate = useTransform(
      [smoothedVelocityX, smoothedVelocityY],
      ([vx, vy]: [number, number]) => {
        const angle = Math.atan2(vy, vx) * (180 / Math.PI);
        return isHovered ? 0 : angle + 90;
      }
    );

    const scaleX = useTransform(
      [smoothedVelocityX, smoothedVelocityY],
      ([vx, vy]: [number, number]) => {
        const speed = Math.sqrt(vx * vx + vy * vy);
        const baseScale = 1;
        const stretch = Math.min(speed / 200, 1);
        return isHovered ? 1 : baseScale + stretch;
      }
    );

    const scaleY = useTransform(
      [smoothedVelocityX, smoothedVelocityY],
      ([vx, vy]: [number, number]) => {
        const speed = Math.sqrt(vx * vx + vy * vy);
        const baseScale = 1;
        const stretch = Math.min(speed / 200, 1);
        return isHovered ? 1 : baseScale - stretch / 2;
      }
    );

    useEffect(() => {
        let lastX = 0;
        let lastY = 0;

        const handleMouseMove = (e: MouseEvent) => {
            const { clientX, clientY } = e;
            cursorX.set(clientX);
            cursorY.set(clientY);

            velocityX.set(clientX - lastX);
            velocityY.set(clientY - lastY);
            lastX = clientX;
            lastY = clientY;

            const target = e.target as HTMLElement;
            const isTextElement = target.closest('p, h1, h2, h3, h4, h5, h6, a, span, li, button');
            setIsHovered(!!isTextElement);

            if (isTextElement) {
                if(lastHoveredElement.current !== isTextElement) {
                    lastHoveredElement.current?.classList.remove('text-glow-hover');
                    isTextElement.classList.add('text-glow-hover');
                    lastHoveredElement.current = isTextElement;
                }
            } else {
                 if (lastHoveredElement.current) {
                    lastHoveredElement.current.classList.remove('text-glow-hover');
                    lastHoveredElement.current = null;
                }
            }
        };

        window.addEventListener('mousemove', handleMouseMove);

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
        };
    }, [cursorX, cursorY, velocityX, velocityY]);

    const scale = isHovered ? 4 : 1;

    return (
        <motion.div
            ref={cursorRef}
            className={`cursor ${isHovered ? 'hovered' : ''}`}
            style={{
                translateX: cursorXSpring,
                translateY: cursorYSpring,
                x: '-50%',
                y: '-50%',
                rotate,
                scale,
                scaleX,
                scaleY,
            }}
        />
    );
};

export default Cursor;
