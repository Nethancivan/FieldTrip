import { brand } from "../constants/brand";

export default function CompanyLogo({ className = "" }) {
  const handleLogoError = (event) => {
    const image = event.currentTarget;

    if (image.dataset.logoFallbackApplied === "true") {
      return;
    }

    image.dataset.logoFallbackApplied = "true";
    image.src = brand.fallbackLogoPath;
  };

  return (
    <div className={`company-logo-wrapper ${className}`.trim()}>
      <img
        className="company-logo"
        src={brand.logoPath}
        data-logo-fallback-src={brand.fallbackLogoPath}
        alt="Logo GOVIETNAMEZE"
        loading="eager"
        onError={handleLogoError}
      />
    </div>
  );
}
