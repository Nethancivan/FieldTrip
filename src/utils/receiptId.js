import { formatTimestampForId } from "./datetime";

export function createReceiptId(date = new Date()) {
  return `EXP-${formatTimestampForId(date)}`;
}
