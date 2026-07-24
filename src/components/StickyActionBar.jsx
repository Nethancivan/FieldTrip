import { copy } from "../constants/copy";
import LoadingSpinner from "./LoadingSpinner";

export default function StickyActionBar({
  disabled,
  isGenerating,
  liveMessage,
  liveTone,
  onGenerate,
}) {
  return (
    <div className="sticky-action mobile-submit-bar" aria-label="Khu vực thao tác chính">
      <div className="sticky-action-inner">
        <p
          className={`sticky-action-status ${liveTone === "error" ? "live-region-error" : ""} ${liveTone === "success" ? "live-region-success" : ""}`}
          aria-live="polite"
        >
          {liveMessage}
        </p>
        <button className="btn btn-primary" type="button" disabled={disabled} onClick={onGenerate}>
          {isGenerating ? <LoadingSpinner label={copy.generating} /> : copy.generate}
        </button>
      </div>
    </div>
  );
}
