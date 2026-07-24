import { formatDateTimeDisplay, getTimezoneLabel } from "../utils/datetime";

function FooterField({ label, value }) {
  return (
    <div className="receipt-field">
      <div className="receipt-field-label">{label}</div>
      <div className="receipt-field-value">{value}</div>
    </div>
  );
}

export default function ReceiptFooter({ createdAt, exportedAt }) {
  const timezone = getTimezoneLabel(createdAt);

  return (
    <footer className="receipt-footer" data-pdf-block="true">
      <div className="receipt-footer-meta">
        <FooterField
          label="Record Created At"
          value={`${formatDateTimeDisplay(createdAt)} ${timezone}`}
        />
        <FooterField
          label="Exported At"
          value={
            exportedAt
              ? `${formatDateTimeDisplay(exportedAt)} ${getTimezoneLabel(exportedAt)}`
              : "Chưa xuất PDF"
          }
        />
      </div>

      <div className="footer-credit">
        <div className="footer-label">DIRECTED BY</div>
        <div className="footer-brand">GOVIETNAMEZE</div>
        <div className="footer-product">
          Sản phẩm được phát triển bởi GOVIETNAMEZE.
        </div>
      </div>

      <div className="footer-company">
        <strong>GOVIETNAMEZE</strong>
        <div>DI SẢN - CÔNG NGHỆ - SÁNG TẠO</div>
        <div>Mã số thuế: 0319327338</div>
        <div>
          Địa chỉ: Tầng 2, số 02 Song Hành, Phường Bình Trưng, Thành phố Hồ Chí Minh, Việt Nam
        </div>
        <div>Email: contact@govietnameze.vn</div>
      </div>
    </footer>
  );
}
