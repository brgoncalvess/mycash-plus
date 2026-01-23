import { motion } from 'framer-motion';
import type { ReactNode } from 'react';

interface AnimatedListProps<T> {
    items: T[];
    renderItem: (item: T, index: number) => ReactNode;
    className?: string;
    staggerDelay?: number;
    initialY?: number;
}

export function AnimatedList<T>({
    items,
    renderItem,
    className,
    staggerDelay = 0.05,
    initialY = 20
}: AnimatedListProps<T>) {
    return (
        <motion.div
            initial="hidden"
            animate="visible"
            className={className}
            variants={{
                visible: {
                    transition: {
                        staggerChildren: staggerDelay
                    }
                }
            }}
        >
            {items.map((item, index) => (
                <motion.div
                    key={index}
                    variants={{
                        hidden: { opacity: 0, y: initialY },
                        visible: { opacity: 1, y: 0, transition: { duration: 0.3, ease: 'easeOut' } }
                    }}
                >
                    {renderItem(item, index)}
                </motion.div>
            ))}
        </motion.div>
    );
}
