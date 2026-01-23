import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, X } from 'lucide-react';
import { format, addMonths, subMonths, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, isToday, getDay, isWithinInterval } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { cn } from '../../utils/cn';

interface MaterialDatePickerModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSelect: (date: Date) => void;
    initialDate?: Date;
}

export function MaterialDatePickerModal({ isOpen, onClose, onSelect, initialDate }: MaterialDatePickerModalProps) {
    const [selectedDate, setSelectedDate] = useState<Date>(initialDate || new Date());
    const [viewDate, setViewDate] = useState<Date>(initialDate || new Date());

    // Reset state when opening
    useEffect(() => {
        if (isOpen) {
            setSelectedDate(initialDate || new Date());
            setViewDate(initialDate || new Date());
        }
    }, [isOpen, initialDate]);

    // Navigation
    const handlePrevMonth = () => setViewDate(prev => subMonths(prev, 1));
    const handleNextMonth = () => setViewDate(prev => addMonths(prev, 1));

    // Calendar Grid Generation
    const monthStart = startOfMonth(viewDate);
    const monthEnd = endOfMonth(viewDate);
    const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });

    // Fill start padding
    const startDayOfWeek = getDay(monthStart); // 0 (Sun) to 6 (Sat)
    const paddingDays = Array.from({ length: startDayOfWeek });

    // Handlers
    const handleDateClick = (date: Date) => {
        setSelectedDate(date);
    };

    const handleApply = () => {
        onSelect(selectedDate);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200"
                onClick={onClose}
            />

            {/* Modal Card */}
            <div className="relative w-full max-w-[400px] bg-white rounded-[32px] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col p-6">

                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-[#fde047]/20 flex items-center justify-center text-[#d7ff00]"> {/* Lime tint */}
                            <CalendarIcon size={20} className="text-[#a3e635]" /> {/* Icon color adjustment to match print lime vibe if needed, or stick tobrand */}
                            {/* Actually print shows a yellow/lime icon bg. Let's use brand colors. */}
                            {/* Re-visiting print: Icon is outline Calendar inside a Light Yellow circle. Title "Selecionar Periodo". */}
                        </div>
                        <h2 className="text-xl font-bold text-gray-900">Selecionar Data</h2>
                    </div>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                        <X size={20} />
                    </button>
                </div>

                {/* Calendar View */}
                <div className="mb-6">
                    {/* Month Navigation */}
                    <div className="flex items-center justify-between mb-4 px-2">
                        <span className="text-base font-bold text-gray-900 capitalize">
                            {format(viewDate, 'MMMM yyyy', { locale: ptBR })}
                        </span>
                        <div className="flex items-center gap-2">
                            <button onClick={handlePrevMonth} className="text-blue-600 hover:bg-blue-50 p-1 rounded-full text-base font-bold">
                                <ChevronLeft size={20} />
                            </button>
                            <button onClick={handleNextMonth} className="text-blue-600 hover:bg-blue-50 p-1 rounded-full text-base font-bold">
                                <ChevronRight size={20} />
                            </button>
                        </div>
                    </div>

                    {/* Week Days */}
                    <div className="grid grid-cols-7 mb-2 text-center">
                        {['dom', 'seg', 'ter', 'qua', 'qui', 'sex', 'sab'].map(day => (
                            <span key={day} className="text-xs text-gray-400 font-medium py-1 capitalize">
                                {day}
                            </span>
                        ))}
                    </div>

                    {/* Days Grid */}
                    <div className="grid grid-cols-7 gap-y-1 gap-x-1">
                        {paddingDays.map((_, i) => (
                            <div key={`padding-${i}`} />
                        ))}
                        {daysInMonth.map(date => {
                            const isSelected = isSameDay(date, selectedDate);
                            const isCurrentDay = isToday(date);

                            return (
                                <button
                                    key={date.toISOString()}
                                    onClick={() => handleDateClick(date)}
                                    className={cn(
                                        "w-9 h-9 mx-auto rounded-full flex items-center justify-center text-sm transition-all",
                                        isSelected
                                            ? "bg-blue-600 text-white font-bold shadow-md hover:bg-blue-700" // Blue selection as in print
                                            : isCurrentDay
                                                ? "text-blue-600 font-bold bg-blue-50"
                                                : "text-gray-700 hover:bg-gray-100 font-medium"
                                    )}
                                >
                                    {format(date, 'd')}
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Selected Date Display */}
                <div className="mb-6">
                    <span className="text-xs font-medium text-gray-500 mb-2 block">Data selecionada:</span>
                    <div className="w-full h-12 flex items-center justify-center border border-gray-200 rounded-xl bg-white">
                        <span className="text-sm font-bold text-gray-900">
                            {format(selectedDate, "dd 'de' MMM, yyyy", { locale: ptBR })}
                        </span>
                    </div>
                </div>

                {/* Footer Buttons */}
                <div className="flex items-center justify-center gap-3">
                    <button
                        onClick={onClose}
                        className="px-6 h-10 rounded-full border border-gray-200 text-sm font-bold text-gray-600 hover:bg-gray-50 transition-colors"
                    >
                        Cancelar
                    </button>
                    <button
                        onClick={handleApply}
                        className="px-8 h-10 rounded-full bg-[#0F172A] text-white text-sm font-bold hover:bg-black transition-colors flex items-center gap-2 shadow-lg"
                    >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="20 6 9 17 4 12"></polyline>
                        </svg>
                        Aplicar
                    </button>
                </div>

            </div>
        </div>
    );
}
