import { useState, useEffect } from "react";
import { DayPicker, type DateRange } from "react-day-picker";
import { X, Check, Calendar as CalendarIcon } from "lucide-react";
import { ptBR } from "date-fns/locale";
import { format } from "date-fns";
import { cn } from "../../utils/cn";
import "react-day-picker/style.css";

interface DateRangePickerModalProps {
    isOpen: boolean;
    onClose: () => void;
    initialDateRange?: DateRange;
    onApply: (range: DateRange | undefined) => void;
}

export function DateRangePickerModal({
    isOpen,
    onClose,
    initialDateRange,
    onApply
}: DateRangePickerModalProps) {
    const [range, setRange] = useState<DateRange | undefined>(initialDateRange);
    const [showExiting, setShowExiting] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setRange(initialDateRange);
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
            setShowExiting(false);
        }

        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen, initialDateRange]);

    const handleClose = () => {
        setShowExiting(true);
        setTimeout(() => {
            onClose();
            setShowExiting(false);
        }, 300);
    };

    const handleApply = () => {
        onApply(range);
        handleClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center">
            {/* Backdrop */}
            <div
                className={cn(
                    "absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity duration-300",
                    showExiting ? "opacity-0" : "opacity-100"
                )}
                onClick={handleClose}
            />

            {/* Modal Container */}
            <div
                className={cn(
                    "relative w-full max-w-md bg-white flex flex-col transition-transform duration-300 shadow-2xl overflow-hidden md:rounded-3xl",
                    showExiting ? "translate-y-full md:scale-95 md:opacity-0" : "translate-y-0 animate-in slide-in-from-bottom md:slide-in-from-bottom-5 duration-300 md:scale-100"
                )}
            >
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100 shrink-0">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-brand/20 flex items-center justify-center text-brand-dark">
                            <CalendarIcon size={20} />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-secondary">Selecionar Período</h2>
                        </div>
                    </div>

                    <button
                        onClick={handleClose}
                        className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 hover:bg-gray-100 hover:text-secondary transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto bg-gray-50/50 p-6 flex flex-col items-center">
                    <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
                        <style>{`
                          .rdp {
                              --rdp-cell-size: 40px;
                              --rdp-accent-color: #D7FF00;
                              --rdp-background-color: #f3f4f6;
                              --rdp-accent-color-dark: #c4e703; 
                              --rdp-outline: 2px solid var(--rdp-accent-color); 
                              --rdp-selected-color: #000;
                              margin: 0;
                          }
                          .rdp-day_selected:not([disabled]), .rdp-day_selected:focus:not([disabled]), .rdp-day_selected:active:not([disabled]), .rdp-day_selected:hover:not([disabled]) {
                              background-color: var(--rdp-accent-color);
                              color: #000;
                              font-weight: bold;
                          }
                          .rdp-day_range_middle {
                              background-color: #D7FF0033 !important; /* 20% opacity */
                              color: #000 !important;
                          }
                      `}</style>
                        <DayPicker
                            mode="range"
                            selected={range}
                            onSelect={setRange}
                            locale={ptBR}
                            numberOfMonths={1}
                            initialFocus
                        />
                    </div>

                    <div className="mt-6 w-full flex flex-col gap-2">
                        <p className="text-sm font-semibold text-gray-500 mb-1 ml-1">Período selecionado:</p>
                        <div className="w-full p-4 bg-white border border-gray-200 rounded-xl text-center font-bold text-secondary">
                            {range?.from ? (
                                <>
                                    {format(range.from, "dd 'de' MMM", { locale: ptBR })}
                                    {range.to && (
                                        <>
                                            {" - "}
                                            {format(range.to, "dd 'de' MMM, yyyy", { locale: ptBR })}
                                        </>
                                    )}
                                </>
                            ) : (
                                <span className="text-gray-400 font-normal">Selecione uma data</span>
                            )}
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="px-6 py-5 bg-white border-t border-gray-100 flex justify-end gap-3 shrink-0">
                    <button
                        onClick={handleClose}
                        className="px-6 h-12 rounded-full border border-gray-200 text-gray-600 font-bold hover:bg-gray-50 transition-colors"
                    >
                        Cancelar
                    </button>
                    <button
                        onClick={handleApply}
                        className="px-8 h-12 rounded-full bg-secondary text-white font-bold hover:bg-secondary/90 transition-all shadow-lg hover:shadow-xl active:scale-95 flex items-center gap-2"
                    >
                        <Check size={18} />
                        Aplicar
                    </button>
                </div>
            </div>
        </div>
    );
}
