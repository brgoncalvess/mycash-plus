import { useState, useEffect } from 'react';
import { X, Check } from 'lucide-react';
import { useFinance } from '../../../context/FinanceContext';
import { cn } from '../../../utils/cn';
import { DayPicker, type DateRange } from 'react-day-picker';
import { ptBR } from 'date-fns/locale';
import 'react-day-picker/dist/style.css';

interface FiltersMobileModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export function FiltersMobileModal({ isOpen, onClose }: FiltersMobileModalProps) {
    const { filters, setFilters, members } = useFinance();
    const [isVisible, setIsVisible] = useState(false);

    // Local State for filters
    const [localType, setLocalType] = useState(filters.transactionType);
    const [localMemberId, setLocalMemberId] = useState<string | null>(filters.memberId);
    const [localDateRange, setLocalDateRange] = useState<DateRange | undefined>({
        from: filters.dateRange.start,
        to: filters.dateRange.end
    });

    useEffect(() => {
        if (isOpen) {
            setIsVisible(true);
            document.body.style.overflow = 'hidden';
            // Sync local state with global on open
            setLocalType(filters.transactionType);
            setLocalMemberId(filters.memberId);
            setLocalDateRange({ from: filters.dateRange.start, to: filters.dateRange.end });
        } else {
            setIsVisible(false);
            document.body.style.overflow = 'unset';
            // Use timeout to allow exit animation to finish before unmounting (handled by parent logic usually, but here we handle "visible" state)
        }
    }, [isOpen, filters]);

    const handleApply = () => {
        setFilters({
            transactionType: localType,
            memberId: localMemberId,
            dateRange: localDateRange?.from && localDateRange?.to ? { start: localDateRange.from, end: localDateRange.to } : filters.dateRange
        });
        handleClose();
    };

    const handleClose = () => {
        setIsVisible(false);
        setTimeout(() => {
            onClose();
        }, 300);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[60] flex flex-col justify-end lg:hidden">
            {/* Overlay */}
            <div
                className={cn(
                    "absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300",
                    isVisible ? "opacity-100" : "opacity-0"
                )}
                onClick={handleClose}
            />

            {/* Modal Sheet */}
            <div
                className={cn(
                    "relative w-full bg-white rounded-t-[32px] shadow-2xl flex flex-col max-h-[95vh] transition-transform duration-300 ease-out",
                    isVisible ? "translate-y-0" : "translate-y-full"
                )}
            >
                {/* Fixed Header */}
                <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between shrink-0">
                    <h2 className="text-xl font-bold text-secondary">Filtros</h2>
                    <button
                        onClick={handleClose}
                        className="w-11 h-11 flex items-center justify-center -mr-2 text-gray-400 hover:text-secondary active:scale-95 transition-all"
                    >
                        <X size={24} />
                    </button>
                </div>

                {/* Scrollable Content */}
                <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-8 pb-24">

                    {/* Transaction Type */}
                    <div className="space-y-3">
                        <label className="text-sm font-bold text-secondary block">
                            Tipo de Transação
                        </label>
                        <div className="grid grid-cols-3 gap-3">
                            {[
                                { value: 'all', label: 'Todos' },
                                { value: 'income', label: 'Receitas' },
                                { value: 'expense', label: 'Despesas' }
                            ].map((type) => (
                                <button
                                    key={type.value}
                                    onClick={() => setLocalType(type.value as any)}
                                    className={cn(
                                        "h-12 rounded-2xl text-sm font-bold transition-all border",
                                        localType === type.value
                                            ? "bg-secondary border-secondary text-white shadow-md"
                                            : "bg-white border-gray-200 text-gray-500 hover:border-gray-300"
                                    )}
                                >
                                    {type.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Members */}
                    <div className="space-y-3">
                        <label className="text-sm font-bold text-secondary block">
                            Membro da Família
                        </label>
                        <div className="flex flex-wrap gap-2">
                            <button
                                onClick={() => setLocalMemberId(null)}
                                className={cn(
                                    "h-12 px-6 rounded-full text-sm font-bold transition-all border flex items-center gap-2",
                                    localMemberId === null
                                        ? "bg-secondary border-secondary text-white shadow-md"
                                        : "bg-white border-gray-200 text-gray-500 hover:border-gray-300"
                                )}
                            >
                                <span className={cn(
                                    "w-8 h-8 rounded-full border-2 flex items-center justify-center bg-gray-100",
                                    localMemberId === null ? "border-white/20 bg-white/10" : "border-gray-100"
                                )}>
                                    <Check size={14} className={localMemberId === null ? "opacity-100" : "opacity-0"} />
                                </span>
                                Todos
                            </button>

                            {members.map(member => (
                                <button
                                    key={member.id}
                                    onClick={() => setLocalMemberId(member.id)}
                                    className={cn(
                                        "h-12 pl-2 pr-4 rounded-full text-sm font-bold transition-all border flex items-center gap-2",
                                        localMemberId === member.id
                                            ? "bg-secondary border-secondary text-white shadow-md"
                                            : "bg-white border-gray-200 text-gray-500 hover:border-gray-300"
                                    )}
                                >
                                    <img
                                        src={member.avatarUrl || `https://i.pravatar.cc/150?u=${member.id}`}
                                        alt={member.name}
                                        className={cn(
                                            "w-8 h-8 rounded-full object-cover border-2",
                                            localMemberId === member.id ? "border-white" : "border-transparent"
                                        )}
                                    />
                                    {member.name.split(' ')[0]}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Date Range */}
                    <div className="space-y-3">
                        <label className="text-sm font-bold text-secondary block">
                            Período
                        </label>
                        <div className="bg-white rounded-2xl border border-gray-200 p-2 flex justify-center">
                            <DayPicker
                                mode="range"
                                selected={localDateRange}
                                onSelect={setLocalDateRange}
                                locale={ptBR}
                                classNames={{
                                    months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
                                    month: "space-y-4",
                                    caption: "flex justify-center pt-1 relative items-center",
                                    caption_label: "text-sm font-bold text-secondary capitalize",
                                    nav: "space-x-1 flex items-center",
                                    nav_button: "h-7 w-7 bg-transparent hover:bg-gray-100 p-0 rounded-full flex items-center justify-center text-gray-500 hover:text-secondary transition-colors",
                                    nav_button_previous: "absolute left-1",
                                    nav_button_next: "absolute right-1",
                                    table: "w-full border-collapse space-y-1",
                                    head_row: "flex",
                                    head_cell: "text-gray-400 rounded-md w-9 font-normal text-[0.8rem] capitalize",
                                    row: "flex w-full mt-2",
                                    cell: "text-center text-sm p-0 relative [&:has([aria-selected])]:bg-gray-50 first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
                                    day: "h-9 w-9 p-0 font-normal aria-selected:opacity-100 hover:bg-gray-100 rounded-full cursor-pointer transition-colors",
                                    day_selected: "!bg-secondary !text-white hover:!bg-secondary hover:!text-white",
                                    day_today: "bg-gray-100 text-secondary",
                                    day_outside: "text-gray-300 opacity-50",
                                    day_disabled: "text-gray-300 opacity-50",
                                    day_range_middle: "!bg-gray-100 !text-secondary !rounded-none",
                                    day_hidden: "invisible",
                                }}
                            />
                        </div>
                    </div>

                </div>

                {/* Footer */}
                <div className="p-6 border-t border-gray-100 bg-white absolute bottom-0 left-0 right-0 rounded-b-[32px]">
                    <button
                        onClick={handleApply}
                        className="w-full h-14 bg-secondary text-white rounded-xl text-base font-bold shadow-lg active:scale-95 transition-all flex items-center justify-center"
                    >
                        Aplicar Filtros
                    </button>
                </div>
            </div>
        </div>
    );
}
