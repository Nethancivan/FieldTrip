export default function ReceiptFooter() {
  return (
    <footer className="receipt-footer" data-pdf-block="true">
      <div className="receipt-footer-credit">
        <span className="receipt-footer-label">DIRECTED BY</span>
        <strong className="receipt-footer-brand">GOVIETNAMEZE</strong>
        <p className="receipt-footer-note">
          Phiếu chi được tạo bởi GOVIETNAMEZE.
        </p>
      </div>

      <div className="receipt-footer-company">
        <strong>
          CÔNG TY TNHH TRUYỀN THÔNG VÀ QUẢNG BÁ VĂN HÓA GOVIETNAMEZE
        </strong>
        <span className="receipt-footer-tagline">
          DI SẢN · CÔNG NGHỆ · SÁNG TẠO
        </span>

        <div className="receipt-footer-contact">
          <span>Mã số thuế: 0319327338</span>
          <span>Điện thoại: 0356437530</span>
          <span>Email: contact@govietnameze.vn</span>
        </div>

        <p>
          Địa chỉ: Tầng 2, số 02 Song Hành, Phường Bình Trưng, Thành phố Hồ Chí Minh, Việt Nam
        </p>
      </div>
    </footer>
  );
}
