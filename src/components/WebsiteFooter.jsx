export default function WebsiteFooter() {
  return (
    <footer className="website-footer">
      <div className="website-footer-inner">
        <div className="website-footer-brand-block">
          <strong className="website-footer-brand">GOVIETNAMEZE</strong>
          <span className="website-footer-tagline">
            DI SẢN · CÔNG NGHỆ · SÁNG TẠO
          </span>
        </div>

        <div className="website-footer-information">
          <span>
            <strong>MST:</strong> 0319327338
          </span>
          <span>
            <strong>Địa chỉ:</strong> Tầng 2, số 02 Song Hành, Phường Bình Trưng, Thành phố Hồ Chí Minh, Việt Nam
          </span>
          <span>
            <strong>Điện thoại:</strong> 0356437530
          </span>
          <span>
            <strong>Email:</strong>{" "}
            <a href="mailto:contact@govietnameze.vn">contact@govietnameze.vn</a>
          </span>
        </div>

        <p className="website-footer-description">
          Sản phẩm cung cấp giải pháp số cho quy trình thanh toán được phát triển bởi GOVIETNAMEZE.
        </p>
      </div>
    </footer>
  );
}
