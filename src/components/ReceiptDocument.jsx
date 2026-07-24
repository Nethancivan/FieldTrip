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
  const fieldtripCode = snapshot.fieldtripCode || "Không ghi nhận";
  const expenseDateTime = `${formatDateDisplay(snapshot.expenseDate)} ${snapshot.expenseTime}`;
  const displayAmount = snapshot.finalAmountRaw || snapshot.amountRaw;

  return (
    <article
      className={`receipt-document receipt-document--${mode}`}
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

      <ReceiptFooter createdAt={snapshot.createdAt} exportedAt={exportedAt} />
    </article>
  );
}
