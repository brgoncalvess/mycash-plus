import { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, X } from 'lucide-react';
import { format, addMonths, subMonths, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, isToday, getDay, isWithinInterval, isAfter } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { cn } from '../../../utils/cn';

interface DateRange {
    from: Date;
    to: Date | undefined;
}

interface DateRangePopoverProps {
    isOpen: boolean;
    onClose: () => void;
    onApply: (range: DateRange) => void;
    initialRange: { start: Date; end: Date };
}

export function DateRangePopover({ isOpen, onClose, onApply, initialRange }: DateRangePopoverProps) {
    const [range, setRange] = useState<DateRange>({ from: initialRange.start, to: initialRange.end });
    const [viewDate, setViewDate] = useState<Date>(initialRange.start);
    const popoverRef = useRef<HTMLDivElement>(null);

    // Close on click outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (popoverRef.current && !popoverRef.current.contains(event.target as Node)) {
                onClose();
            }
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen, onClose]);

    // Reset when opening
    useEffect(() => {
        if (isOpen) {
            setRange({ from: initialRange.start, to: initialRange.end });
            setViewDate(initialRange.start);
        }
    }, [isOpen, initialRange]);

    const handlePrevMonth = () => setViewDate(prev => subMonths(prev, 1));
    const handleNextMonth = () => setViewDate(prev => addMonths(prev, 1));

    const monthStart = startOfMonth(viewDate);
    const monthEnd = endOfMonth(viewDate);
    const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });
    const startDayOfWeek = getDay(monthStart);
    const paddingDays = Array.from({ length: startDayOfWeek });

    const handleDateClick = (date: Date) => {
        if (range.from && !range.to && isAfter(date, range.from)) {
            // Complete range
            setRange({ from: range.from, to: date });
        } else {
            // Start new range
            setRange({ from: date, to: undefined });
        }
    };

    const isSelected = (date: Date) => {
        if (isSameDay(date, range.from)) return true;
        if (range.to && isSameDay(date, range.to)) return true;
        return false;
    };

    const isInRange = (date: Date) => {
        if (range.from && range.to) {
            return isWithinInterval(date, { start: range.from, end: range.to });
        }
        return false;
    };

    const handleApplyClick = () => {
        if (range.from && range.to) {
            onApply(range);
            onClose();
        }
    };

    const handleCancelClick = () => {
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div
            ref={popoverRef}
            className="absolute top-full left-0 mt-2 z-50 w-[340px] bg-white rounded-[24px] shadow-2xl border border-gray-100 p-6 animate-in fade-in slide-in-from-top-2 duration-200"
        >
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#fde047]/20 flex items-center justify-center">
                        <CalendarIcon size={20} className="text-[#a3e635]" />
                    </div>
                    <h2 className="text-lg font-bold text-gray-900">Selecionar Período</h2>
                </div>
                <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                    <X size={20} />
                </button>
            </div>

            {/* Calendar */}
            <div className="mb-6">
                <div className="flex items-center justify-between mb-4 px-2">
                    <span className="text-base font-bold text-gray-900 capitalize">
                        {format(viewDate, 'MMMM yyyy', { locale: ptBR })}
                    </span>
                    <div className="flex items-center gap-2">
                        <button onClick={handlePrevMonth} className="text-blue-600 hover:bg-blue-50 p-1 rounded-full"><ChevronLeft size={20} /></button>
                        <button onClick={handleNextMonth} className="text-blue-600 hover:bg-blue-50 p-1 rounded-full"><ChevronRight size={20} /></button>
                    </div>
                </div>

                <div className="grid grid-cols-7 mb-2 text-center">
                    {['dom', 'seg', 'ter', 'qua', 'qui', 'sex', 'sab'].map(day => (
                        <span key={day} className="text-xs text-gray-400 font-medium capitalize">{day}</span>
                    ))}
                </div>

                <div className="grid grid-cols-7 gap-y-1">
                    {paddingDays.map((_, i) => <div key={`padding-${i}`} />)}
                    {daysInMonth.map(date => {
                        const selected = isSelected(date);
                        const inRange = isInRange(date);
                        const isCurrentDay = isToday(date);

                        let bgClass = "bg-transparent";
                        let textClass = "text-gray-700";
                        let roundedClass = "rounded-full";

                        if (selected) {
                            bgClass = "bg-blue-600";
                            textClass = "text-white font-bold";
                        } else if (inRange) {
                            bgClass = "bg-blue-50";
                            textClass = "text-blue-600 font-medium";
                            roundedClass = "rounded-none";
                            // Add rounded corners for start/end of weeks if needed, but for simplicity square inside
                        } else if (isCurrentDay) {
                            textClass = "text-blue-600 font-bold";
                        }

                        return (
                            <button
                                key={date.toISOString()}
                                onClick={() => handleDateClick(date)}
                                className={cn(
                                    "w-9 h-9 mx-auto flex items-center justify-center text-sm transition-all relative",
                                    roundedClass,
                                    bgClass,
                                    textClass,
                                    !selected && !inRange && "hover:bg-gray-100"
                                )}
                            >
                                {format(date, 'd')}
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Selected Range Display */}
            <div className="mb-6">
                <span className="text-xs font-medium text-gray-500 mb-2 block">Período selecionado:</span>
                <div className="w-full h-12 flex items-center justify-center border border-gray-200 rounded-xl bg-white px-4 text-center">
                    <span className="text-sm font-bold text-gray-900 truncate">
                        {range.from ? format(range.from, "dd 'de' MMM", { locale: ptBR }) : '...'}
                        {' - '}
                        {range.to ? format(range.to, "dd 'de' MMM, yyyy", { locale: ptBR }) : '...'}
                    </span>
                </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between">
                <button onClick={handleCancelClick} className="px-6 h-10 rounded-full border border-gray-200 text-sm font-bold text-gray-600 hover:bg-gray-50">
                    Cancelar
                </button>
                <button
                    onClick={handleApplyClick}
                    disabled={!range.from || !range.to}
                    className="px-6 h-10 rounded-full bg-[#0F172A] text-white text-sm font-bold hover:bg-black disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                    Aplicar
                </button>
            </div>
        </div>
    );
}
