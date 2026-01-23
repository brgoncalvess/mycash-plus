import { useState, useEffect } from 'react';
import { BANKS, getBankLogo } from '../../constants/banks';
import { CreditCard } from 'lucide-react';
import { cn } from '../../utils/cn';

interface BankLogoProps {
    src?: string;
    bankName?: string;
    alt: string;
    className?: string; // Used for the image or fallback container
}

export function BankLogo({ src, bankName, alt, className }: BankLogoProps) {
    const [hasError, setHasError] = useState(false);

    // Reset error if src or bankName changes
    useEffect(() => {
        setHasError(false);
    }, [src, bankName]);

    const effectiveSrc = src || (bankName ? getBankLogo(bankName) : '');

    // Lookup bank metadata for fallback color
    const bankMeta = BANKS.find(b =>
        (bankName && b.name.toLowerCase() === bankName.toLowerCase()) ||
        (bankName && b.id === bankName.toLowerCase())
    ) || BANKS.find(b => bankName && b.name.toLowerCase().includes(bankName.toLowerCase()));

    if (effectiveSrc && !hasError) {
        return (
            <img
                src={effectiveSrc}
                alt={alt}
                className={cn("w-full h-full object-contain", className)}
                onError={() => setHasError(true)}
            />
        );
    }

    // Fallback UI
    // If we have bank meta, use its color. Else gray.
    const bgColor = bankMeta?.color || '#9CA3AF';
    // Initials logic: Nubank -> Nu, XP Investimentos -> XP, Inter -> In
    const initials = bankName
        ? bankName.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()
        : '';

    return (
        <div
            className={cn("w-full h-full flex items-center justify-center font-bold text-white text-xs rounded-lg overflow-hidden", className)}
            style={{ backgroundColor: bgColor }}
            title={alt}
        >
            {initials ? initials : <CreditCard size={14} />}
        </div>
    );
}
