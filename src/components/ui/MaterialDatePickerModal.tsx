import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Pencil } from 'lucide-react';
import { format, addMonths, subMonths, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, isToday, getDay } from 'date-fns';
import { enUS } from 'date-fns/locale';
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

    const handleClear = () => {
        setSelectedDate(new Date());
        setViewDate(new Date());
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
                onClick={onClose}
            />

            {/* Modal Card */}
            <div className="relative w-[320px] bg-white rounded-[28px] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col font-sans select-none">

                {/* Header */}
                <div className="px-6 pt-5 pb-3 bg-white">
                    <span className="text-[12px] font-medium text-gray-600 tracking-wide block mb-0.5">Select date</span>
                    <div className="flex items-center justify-between">
                        <h2 className="text-[32px] leading-tight font-normal text-gray-900">
                            {format(selectedDate, 'EEE, MMM d', { locale: enUS })}
                        </h2>
                        <button className="text-gray-500 hover:text-black transition-colors rounded-full p-1 hover:bg-gray-50">
                            <Pencil size={20} />
                        </button>
                    </div>
                </div>

                {/* Calendar View */}
                <div className="px-3 pb-2">
                    {/* Month Navigation */}
                    <div className="flex items-center justify-between py-2 px-1 mb-2">
                        <div className="flex items-center gap-1 cursor-pointer hover:bg-gray-50 px-2 py-1 rounded-md transition-colors group">
                            <span className="text-[14px] font-bold text-gray-800">
                                {format(viewDate, 'MMMM yyyy', { locale: enUS })}
                            </span>
                            <svg className="w-2.5 h-2.5 text-gray-600 group-hover:text-black" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                            </svg>
                        </div>
                        <div className="flex items-center gap-2 pr-1">
                            <button onClick={handlePrevMonth} className="text-gray-600 hover:text-black hover:bg-gray-100 rounded-full p-1.5 transition-colors">
                                <ChevronLeft size={20} />
                            </button>
                            <button onClick={handleNextMonth} className="text-gray-600 hover:text-black hover:bg-gray-100 rounded-full p-1.5 transition-colors">
                                <ChevronRight size={20} />
                            </button>
                        </div>
                    </div>

                    {/* Week Days */}
                    <div className="grid grid-cols-7 mb-2 text-center">
                        {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map(day => (
                            <span key={day} className="text-[12px] text-gray-500 font-medium py-1">
                                {day}
                            </span>
                        ))}
                    </div>

                    {/* Days Grid */}
                    <div className="grid grid-cols-7 gap-y-1">
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
                                    className="w-10 h-10 mx-auto flex items-center justify-center relative group"
                                >
                                    <span className={cn(
                                        "w-9 h-9 flex items-center justify-center text-[13px] rounded-full transition-all",
                                        isSelected
                                            ? "bg-[#D7FF00] text-gray-900 font-bold shadow-sm" // Lime selected
                                            : isCurrentDay
                                                ? "border border-[#8B5CF6] text-[#8B5CF6] font-bold" // Purple outline
                                                : "text-gray-700 hover:bg-black/5 hover:text-black font-medium"
                                    )}>
                                        {format(date, 'd')}
                                    </span>
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Footer Buttons */}
                <div className="px-3 pb-3 pt-2 flex items-center justify-between mt-1">
                    <button
                        onClick={handleClear}
                        className="text-[14px] font-bold text-gray-800 hover:bg-gray-50 px-4 py-2 rounded-lg transition-colors"
                    >
                        Clear
                    </button>
                    <div className="flex items-center gap-0">
                        <button
                            onClick={onClose}
                            className="text-[14px] font-bold text-gray-800 hover:bg-gray-50 px-4 py-2 rounded-lg transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleApply}
                            className="text-[14px] font-bold text-gray-800 hover:bg-gray-50 px-4 py-2 rounded-lg transition-colors"
                        >
                            OK
                        </button>
                    </div>
                </div>

            </div>
        </div>
    );
}
