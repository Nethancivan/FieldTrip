export function digitsOnly(value) {
  return String(value || "").replace(/\D/g, "");
}

export function normalizeAmount(value) {
  const digits = digitsOnly(value).replace(/^0+(?=\d)/, "");
  return digits === "0" ? "0" : digits;
}

export function formatAmountInput(rawValue) {
  const digits = normalizeAmount(rawValue);
  if (!digits) {
    return "";
  }
  return digits.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

export function formatVnd(rawValue) {
  const formatted = formatAmountInput(rawValue);
  return formatted ? `${formatted} VNĐ` : "";
}

export function isPositiveIntegerAmount(rawValue) {
  return /^\d+$/.test(rawValue) && Number(rawValue) > 0;
}

export function calculateVatTotals(rawValue, isVatIncluded) {
  const inputAmount = Number(normalizeAmount(rawValue) || 0);
  const vatAmount = isVatIncluded ? 0 : Math.round(inputAmount * 0.1);
  const finalAmount = isVatIncluded ? inputAmount : inputAmount + vatAmount;

  return {
    inputAmountRaw: String(inputAmount),
    vatAmountRaw: String(vatAmount),
    finalAmountRaw: String(Math.round(finalAmount)),
  };
}
