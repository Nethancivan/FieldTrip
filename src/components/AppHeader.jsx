import { brand } from "../constants/brand";
import { copy } from "../constants/copy";

export default function AppHeader() {
  return (
    <header className="app-header">
      <div className="brand-lockup">
        <img className="brand-logo" src={brand.logoPath} alt="Logo GOVIETNAMEZE" />
        <div>
          <p className="section-note">{brand.companyName}</p>
          <h1 className="app-title">{brand.productName}</h1>
        </div>
      </div>
      <p className="app-description">{copy.privacyMessage}</p>
    </header>
  );
}
