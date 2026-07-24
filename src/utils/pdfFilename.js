function safeReceiptCode(receiptCode) {
  const cleaned = String(receiptCode || "EXP")
    .replace(/[<>:"/\\|?*\u0000-\u001f]/g, "-")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^\.+|\.+$/g, "");

  return cleaned || "EXP";
}

function safeFinalAmount(snapshot) {
  const rawAmount = snapshot?.finalAmountRaw ?? snapshot?.amountRaw ?? 0;
  const numericAmount = Number(String(rawAmount).replace(/[^\d.-]/g, ""));

  if (Number.isFinite(numericAmount)) {
    return Math.round(Math.max(0, numericAmount)).toString();
  }

  return String(rawAmount).replace(/\D/g, "") || "0";
}

export function createPdfFilename(snapshot) {
  return `${safeReceiptCode(snapshot?.receiptId)}_${safeFinalAmount(snapshot)}.pdf`;
}
