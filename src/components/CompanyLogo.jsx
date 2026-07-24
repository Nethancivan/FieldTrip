import { brand } from "../constants/brand";

export default function CompanyLogo({ variant = "receipt", className = "" }) {
  const wrapperClass =
    variant === "website" ? "website-logo-wrapper" : "receipt-logo-wrapper";

  return (
    <div className={[wrapperClass, className].filter(Boolean).join(" ")}>
      <img
        className="govietnameze-logo"
        src={brand.logoPath}
        alt="GOVIETNAMEZE"
        loading="eager"
      />
    </div>
  );
}
