import { brand } from "../constants/brand";
import { copy } from "../constants/copy";
import CompanyLogo from "./CompanyLogo";

export default function AppHeader() {
  return (
    <header className="app-header">
      <div className="brand-lockup">
        <CompanyLogo className="company-logo-wrapper--app" />
        <div>
          <p className="section-note">{brand.companyName}</p>
          <h1 className="app-title">{brand.productName}</h1>
        </div>
      </div>
      <p className="app-description">{copy.privacyMessage}</p>
    </header>
  );
}
