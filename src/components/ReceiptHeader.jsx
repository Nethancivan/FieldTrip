import { brand } from "../constants/brand";

export default function ReceiptHeader({ receiptId }) {
  return (
    <div className="receipt-topline">
      <div className="receipt-logo-lockup">
        <img className="receipt-logo" src={brand.logoPath} alt="Logo GOVIETNAMEZE" />
        <div>
          <p className="receipt-company">{brand.companyName}</p>
          <h2 className="receipt-title">FIELDTRIP EXPENSE RECORD</h2>
        </div>
      </div>
      <div className="receipt-id-block">
        <div className="receipt-id-label">Receipt ID</div>
        <div className="receipt-id-value">{receiptId}</div>
      </div>
    </div>
  );
}
