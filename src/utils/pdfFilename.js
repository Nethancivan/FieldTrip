import { formatTimestampForFilename } from "./datetime";

function removeVietnameseMarks(value) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D");
}

function safeSegment(value, fallback) {
  const cleaned = removeVietnameseMarks(value || fallback)
    .replace(/[\\/:*?"<>|]+/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^A-Za-z0-9_-]/g, "");
  return cleaned || fallback;
}

function getEmployeeFinalName(employee) {
  const parts = String(employee || "").trim().split(/\s+/).filter(Boolean);
  return parts[parts.length - 1] || "Nhan-su";
}

export function createPdfFilename(snapshot, exportedAt) {
  const timestamp = formatTimestampForFilename(exportedAt);
  const receiptId = safeSegment(snapshot.receiptId, "EXP");
  const employee = safeSegment(getEmployeeFinalName(snapshot.employee), "Nhan-su");
  const amount = String(snapshot.amountRaw || "0").replace(/\D/g, "");
  return `${timestamp}_${receiptId}_${employee}_${amount}.pdf`;
}
