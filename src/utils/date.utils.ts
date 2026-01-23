import { format, formatDistanceToNow, isWithinInterval, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';

/**
 * Formata data curta.
 * @param date Data (Date obj ou string ISO).
 * @returns "DD/MM/AAAA"
 */
export function formatDate(date: Date | string): string {
    const d = typeof date === 'string' ? parseISO(date) : date;
    return format(d, 'dd/MM/yyyy', { locale: ptBR });
}

/**
 * Formata data extensa.
 * @param date Data (Date obj ou string ISO).
 * @returns "15 de janeiro de 2024"
 */
export function formatDateLong(date: Date | string): string {
    const d = typeof date === 'string' ? parseISO(date) : date;
    return format(d, "d 'de' MMMM 'de' yyyy", { locale: ptBR });
}

/**
 * Formata intervalo de datas.
 * @param start Data inicial.
 * @param end Data final.
 * @returns "01 jan - 31 jan, 2024"
 */
export function formatDateRange(start: Date | string, end: Date | string): string {
    const dStart = typeof start === 'string' ? parseISO(start) : start;
    const dEnd = typeof end === 'string' ? parseISO(end) : end;

    const startStr = format(dStart, "dd MMM", { locale: ptBR });
    const endStr = format(dEnd, "dd MMM", { locale: ptBR });
    const year = format(dEnd, "yyyy");

    return `${startStr} - ${endStr}, ${year}`;
}

/**
 * Formata data relativa.
 * @param date Data.
 * @returns "há 3 dias", "ontem", etc.
 */
export function formatRelativeDate(date: Date | string): string {
    const d = typeof date === 'string' ? parseISO(date) : date;
    return formatDistanceToNow(d, { addSuffix: true, locale: ptBR });
}

/**
 * Verifica se data está no intervalo.
 */
export function isDateInRange(date: Date | string, start: Date, end: Date): boolean {
    const d = typeof date === 'string' ? parseISO(date) : date;
    return isWithinInterval(d, { start, end });
}
