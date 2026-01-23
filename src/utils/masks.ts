export const formatCurrencyMask = (value: string | number) => {
    // Convert to string and remove non-digits
    const numericValue = value.toString().replace(/\D/g, "");

    // Convert to float (cents)
    const floatValue = Number(numericValue) / 100;

    // Format
    return floatValue.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL",
    });
};

export const parseCurrencyToNumber = (maskedValue: string): number => {
    const numericValue = maskedValue.replace(/\D/g, "");
    return Number(numericValue) / 100;
};
