import { useEffect } from 'react';
import { motion, useSpring, useTransform } from 'framer-motion';

interface CountUpProps {
    value: number;
    prefix?: string;
    suffix?: string;
    className?: string;
}

export function CountUp({ value, prefix = '', suffix = '', className }: CountUpProps) {
    const spring = useSpring(0, { mass: 0.8, stiffness: 75, damping: 15 });
    const display = useTransform(spring, (current) => {
        // Format BRL style: 1.250,50
        const formatted = current.toLocaleString('pt-BR', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        });
        return `${prefix}${formatted}${suffix}`;
    });

    useEffect(() => {
        spring.set(value);
    }, [value, spring]);

    return <motion.span className={className}>{display}</motion.span>;
}
