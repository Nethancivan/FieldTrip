import ReceiptFooter from "./ReceiptFooter";
import ReceiptHeader from "./ReceiptHeader";
import ReceiptSection from "./ReceiptSection";
import { formatVnd } from "../utils/currency";
import { formatDateDisplay } from "../utils/datetime";

function ReceiptField({ label, value, className = "", amount = false }) {
  return (
    <div className={`receipt-field ${className}`}>
      <div className="receipt-field-label">{label}</div>
      <div className={`receipt-field-value ${amount ? "receipt-field-value--amount" : ""}`}>
        {value}
      </div>
    </div>
  );
}

export default function ReceiptDocument({ snapshot, exportedAt, mode = "preview", documentRef }) {
  const location = snapshot.location || "Không ghi nhận";
  const evidenceClass =
    snapshot.photos.length === 1
      ? "receipt-evidence-grid receipt-evidence-grid--single"
      : "receipt-evidence-grid";

  return (
    <article
      className={`receipt-document receipt-document--${mode}`}
      ref={documentRef}
      aria-label={`Phiếu chi phí ${snapshot.receiptId}`}
    >
      <ReceiptHeader receiptId={snapshot.receiptId} />

      <ReceiptSection title="Employee and Fieldtrip Information">
        <div className="receipt-fields">
          <ReceiptField label="Employee" value={snapshot.employee} />
          <ReceiptField label="Fieldtrip" value={snapshot.fieldtrip} />
          <ReceiptField label="Location" value={location} />
        </div>
      </ReceiptSection>

      <ReceiptSection title="Expense Information">
        <div className="receipt-fields receipt-fields--expense">
          <ReceiptField label="Category" value={snapshot.category} />
          <ReceiptField label="Amount" value={formatVnd(snapshot.amountRaw)} amount />
          <ReceiptField label="Expense Date" value={formatDateDisplay(snapshot.expenseDate)} />
          <ReceiptField label="Expense Time" value={snapshot.expenseTime} />
          <ReceiptField
            label="Description"
            value={snapshot.description}
            className="receipt-field--wide"
          />
        </div>
      </ReceiptSection>

      <ReceiptSection title="EVIDENCE PHOTOS">
        <div className={evidenceClass}>
          {snapshot.photos.map((photo, index) => (
            <figure className="receipt-evidence-item" key={photo.id}>
              <img src={photo.dataUrl} alt={`Evidence photo ${index + 1}`} loading="eager" />
            </figure>
          ))}
        </div>
      </ReceiptSection>

      <ReceiptFooter createdAt={snapshot.createdAt} exportedAt={exportedAt} />
    </article>
  );
}
