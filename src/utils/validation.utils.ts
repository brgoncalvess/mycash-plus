/**
 * Valida formato de email.
 * @param email String de email.
 */
export function isValidEmail(email: string): boolean {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

/**
 * Valida CPF (apenas estrutura básica de 11 dígitos por enquanto, sem algoritmo de dígito verificador complexo para este MVP).
 * @param cpf String de CPF.
 */
export function isValidCPF(cpf: string): boolean {
    const cleanCPF = cpf.replace(/[^\d]/g, '');
    return cleanCPF.length === 11;
}

/**
 * Gera ID único.
 */
export function generateUniqueId(): string {
    if (typeof crypto !== 'undefined' && crypto.randomUUID) {
        return crypto.randomUUID();
    }
    // Fallback simples se crypto não disponível (embora em browsers modernos seja)
    return Math.random().toString(36).substring(2) + Date.now().toString(36);
}
