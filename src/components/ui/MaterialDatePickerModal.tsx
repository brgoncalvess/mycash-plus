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
    const [isYearSelection, setIsYearSelection] = useState(false);

    // Reset state when opening
    useEffect(() => {
        if (isOpen) {
            setSelectedDate(initialDate || new Date());
            setViewDate(initialDate || new Date());
            setIsYearSelection(false);
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

    const handleOk = () => {
        onSelect(selectedDate);
        onClose();
    };

    const handleClear = () => {
        // Option: clear selection or reset to today? Usually clear means no date, but for transaction valid date required.
        // Let's reset to today for now or handle as null if allowed. Assuming mandatory date -> Today.
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
            <div className="relative w-full max-w-[328px] bg-white rounded-[28px] shadow-xl overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col">

                {/* Header */}
                <div className="bg-white px-6 pt-4 pb-4 border-b border-gray-100">
                    <span className="text-sm font-medium text-gray-500 block mb-1">Select date</span>
                    <div className="flex items-center justify-between">
                        <h2 className="text-[32px] leading-tight font-normal text-secondary">
                            {format(selectedDate, 'EEE, MMM d', { locale: enUS })}
                        </h2>
                        <button className="text-gray-400 hover:text-secondary transition-colors">
                            <Pencil size={20} />
                        </button>
                    </div>
                </div>

                {/* Calendar View */}
                <div className="p-4 flex-1">
                    {/* Month Navigation */}
                    <div className="flex items-center justify-between mb-4 px-2">
                        <div
                            className="flex items-center gap-1 cursor-pointer hover:bg-gray-100 px-2 py-1 rounded-md transition-colors"
                            onClick={() => setIsYearSelection(!isYearSelection)} // Toggle Year/Month view feature usually
                        >
                            <span className="text-sm font-semibold text-secondary">
                                {format(viewDate, 'MMMM yyyy', { locale: enUS })}
                            </span>
                            <svg width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M1 1L5 5L9 1" stroke="#374151" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </div>
                        <div className="flex items-center gap-4">
                            <button onClick={handlePrevMonth} className="text-gray-500 hover:text-secondary p-1">
                                <ChevronLeft size={20} />
                            </button>
                            <button onClick={handleNextMonth} className="text-gray-500 hover:text-secondary p-1">
                                <ChevronRight size={20} />
                            </button>
                        </div>
                    </div>

                    {/* Week Days */}
                    <div className="grid grid-cols-7 mb-2 text-center">
                        {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map(day => (
                            <span key={day} className="text-xs text-gray-400 font-medium py-2">
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
                                    className={cn(
                                        "w-9 h-9 mx-auto rounded-full flex items-center justify-center text-sm transition-all",
                                        isSelected
                                            ? "bg-[#D7FF00] text-secondary font-bold" // Brand/Lime
                                            : isCurrentDay
                                                ? "border border-[#8B5CF6] text-secondary font-medium" // Purple outline as in print
                                                : "text-secondary hover:bg-gray-100"
                                    )}
                                >
                                    {format(date, 'd')}
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Footer */}
                <div className="p-4 flex items-center justify-between pt-2">
                    <button
                        onClick={handleClear}
                        className="text-sm font-medium text-secondary px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                        Clear
                    </button>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={onClose}
                            className="text-sm font-medium text-secondary px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleOk}
                            className="text-sm font-medium text-secondary px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                            OK
                        </button>
                    </div>
                </div>

            </div>
        </div>
    );
}
