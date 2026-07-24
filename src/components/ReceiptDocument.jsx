import ReceiptFooter from "./ReceiptFooter";
import ReceiptHeader from "./ReceiptHeader";
import ReceiptSection from "./ReceiptSection";
import { formatVnd } from "../utils/currency";
import { formatDateDisplay, formatDateTimeDisplay, getTimezoneLabel } from "../utils/datetime";

function ReceiptField({ label, value, className = "", amount = false }) {
  const isLongValue = className.includes("receipt-field--wide");
  const valueClassName = [
    "receipt-field-value",
    "receipt-value",
    amount ? "receipt-field-value--amount receipt-amount" : "",
    isLongValue ? "receipt-value-long receipt-detail" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={`receipt-field ${className}`}>
      <div className="receipt-field-label receipt-label">{label}</div>
      <div className={valueClassName}>{value}</div>
    </div>
  );
}

function ReceiptAuditTrail({ createdAt, exportedAt }) {
  return (
    <section className="receipt-section receipt-audit receipt-metadata" data-pdf-block="true">
      <div className="receipt-fields receipt-fields--audit">
        <ReceiptField
          label="Record Created At"
          value={`${formatDateTimeDisplay(createdAt)} ${getTimezoneLabel(createdAt)}`}
        />
        <ReceiptField
          label="Exported At"
          value={
            exportedAt
              ? `${formatDateTimeDisplay(exportedAt)} ${getTimezoneLabel(exportedAt)}`
              : "Chưa xuất PDF"
          }
        />
      </div>
    </section>
  );
}

export default function ReceiptDocument({ snapshot, exportedAt, mode = "preview", documentRef }) {
  const location = snapshot.location || "Không ghi nhận";
  const fieldtripCode = snapshot.fieldtripCode || "Không ghi nhận";
  const expenseDateTime = `${formatDateDisplay(snapshot.expenseDate)} ${snapshot.expenseTime}`;
  const displayAmount = snapshot.finalAmountRaw || snapshot.amountRaw;

  return (
    <article
      className={`receipt-document receipt-body receipt-document--${mode}`}
      id={mode === "export" ? "receipt-document" : undefined}
      ref={documentRef}
      aria-label={`Phiếu thực chi ${snapshot.receiptId}`}
    >
      <ReceiptHeader receiptId={snapshot.receiptId} />

      <ReceiptSection title="Thông tin chuyến công tác">
        <div className="receipt-fields">
          <ReceiptField label="Nhân sự" value={snapshot.employee} />
          <ReceiptField label="Chuyến công tác" value={snapshot.fieldtrip} />
          <ReceiptField label="Mã chuyến công tác" value={fieldtripCode} />
        </div>
      </ReceiptSection>

      <ReceiptSection title="Thông tin thực chi">
        <div className="receipt-fields receipt-fields--expense">
          <ReceiptField label="Hạng mục chi phí" value={snapshot.category} />
          <ReceiptField label="Số tiền" value={formatVnd(displayAmount)} amount />
          <ReceiptField label="Ngày và giờ phát sinh" value={expenseDateTime} />
          <ReceiptField label="Địa điểm" value={location} />
          <ReceiptField
            label="Nội dung chi tiết"
            value={snapshot.description}
            className="receipt-field--wide"
          />
        </div>
      </ReceiptSection>

      <section className="receipt-section receipt-section--evidence" data-pdf-block="false">
        <h2 className="receipt-section-title" data-pdf-block="true">
          Hình ảnh chứng từ
        </h2>
        <div className="receipt-evidence-list">
          {snapshot.photos.map((photo, index) => (
            <figure
              className="receipt-image-wrapper"
              data-pdf-block="true"
              key={photo.id}
            >
              <img
                className="receipt-image"
                src={photo.dataUrl}
                alt={`Ảnh chứng từ ${index + 1}`}
                loading="eager"
              />
            </figure>
          ))}
        </div>
      </section>

      <ReceiptAuditTrail createdAt={snapshot.createdAt} exportedAt={exportedAt} />
      <ReceiptFooter />
    </article>
  );
}
