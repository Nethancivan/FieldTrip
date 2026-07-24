import { brand } from "../constants/brand";
import CompanyLogo from "./CompanyLogo";

export default function ReceiptHeader({ receiptId }) {
  return (
    <div className="receipt-topline" data-pdf-block="true">
      <div className="receipt-logo-lockup">
        <CompanyLogo />
        <div>
          <p className="receipt-company">{brand.companyName}</p>
          <h2 className="receipt-title">PHIẾU THỰC CHI</h2>
          <p className="receipt-subtitle">FIELDTRIP EXPENSE RECORD</p>
        </div>
      </div>
      <div className="receipt-id-block">
        <div className="receipt-id-label">Mã phiếu</div>
        <div className="receipt-id-value">{receiptId}</div>
      </div>
    </div>
  );
}
