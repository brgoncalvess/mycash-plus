/**
 * Utilitários para formatação e manipulação de valores monetários.
 */

/**
 * Formata um número como moeda brasileira (BRL).
 * @param value Valor numérico a ser formatado.
 * @returns String formatada (ex: "R$ 1.234,56").
 * 
 * @example
 * formatCurrency(1234.56) // "R$ 1.234,56"
 */
export function formatCurrency(value: number): string {
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    }).format(value);
}

/**
 * Formata valores grandes de forma compacta.
 * @param value Valor numérico a ser formatado.
 * @returns String compacta (ex: "R$ 2,5k", "R$ 1,2M").
 * 
 * @example
 * formatCompactCurrency(2500) // "R$ 2,5k"
 * formatCompactCurrency(1200000) // "R$ 1,2M"
 */
export function formatCompactCurrency(value: number): string {
    const formatter = new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
        notation: 'compact',
        compactDisplay: 'short',
        maximumFractionDigits: 1
    });
    return formatter.format(value);
}

/**
 * Converte uma string de input monetário em número limpo.
 * Remove "R$", pontos de milhar e converte vírgula decimal para ponto.
 * @param input String de entrada (ex: "R$ 1.234,56").
 * @returns Número float (ex: 1234.56).
 * 
 * @example
 * parseCurrencyInput("R$ 1.234,56") // 1234.56
 */
export function parseCurrencyInput(input: string): number {
    if (!input) return 0;

    // Remove tudo que não é dígito, vírgula ou sinal de menos
    const cleanStr = input.replace(/[^\d,-]/g, '').replace(',', '.');

    // Se houver múltiplas vírgulas ou pontos, pode ser necessário lógica mais robusta,
    // mas assumindo formato pt-BR onde só existe uma vírgula decimal:
    // O replace acima removeu pontos de milhar (que eram . antes).
    // Esperamos input como "1.234,56" -> replace -> "1234.56"

    // ATENÇÃO: Se o input vier como "1.234,56", o regex [^\d,-] remove o ponto.
    // Sobra "1234,56". Replace ',' por '.' -> "1234.56". Correto.

    const value = parseFloat(cleanStr);
    return isNaN(value) ? 0 : value;
}

/**
 * Calcula porcentagem de um valor em relação ao total.
 * @param partial Valor parcial.
 * @param total Valor total.
 * @returns Percentual com 1 casa decimal (ex: 12.5).
 */
export function calculatePercentage(partial: number, total: number): number {
    if (total === 0) return 0;
    return Math.round((partial / total) * 1000) / 10;
}

/**
 * Calcula o valor da parcela.
 * @param total Valor total.
 * @param installments Número de parcelas.
 * @returns Valor da parcela arredondado.
 */
export function calculateInstallmentValue(total: number, installments: number): number {
    if (installments === 0) return total;
    return Math.round((total / installments) * 100) / 100;
}
