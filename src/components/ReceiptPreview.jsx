import { copy } from "../constants/copy";
import LoadingSpinner from "./LoadingSpinner";
import ReceiptDocument from "./ReceiptDocument";

export default function ReceiptPreview({
  snapshot,
  exportedAt,
  isDirty,
  isExporting,
  exportMessage,
  exportTone,
  onDownload,
  canDownload,
}) {
  return (
    <section className="surface-panel panel-section" aria-labelledby="receipt-preview-title">
      <h2 className="section-heading" id="receipt-preview-title">
        {copy.previewTitle}
      </h2>
      <p className="section-note">
        Bản xem trước có thể co giãn theo màn hình. File tải xuống là PDF A4 được tạo trực tiếp trên thiết bị.
      </p>

      {snapshot ? (
        <>
          {isDirty ? <p className="outdated-message" role="status">{copy.outdated}</p> : null}
          <div className="receipt-preview-stage">
            <ReceiptDocument snapshot={snapshot} exportedAt={exportedAt} />
          </div>
          <div className="preview-actions">
            <p
              className={`live-region ${exportTone === "error" ? "live-region-error" : ""} ${exportTone === "success" ? "live-region-success" : ""}`}
              aria-live="polite"
            >
              {isExporting ? copy.downloading : exportMessage}
            </p>
            <button
              className="btn btn-secondary"
              type="button"
              disabled={!canDownload || isExporting}
              onClick={onDownload}
            >
              {isExporting ? <LoadingSpinner label={copy.downloading} /> : copy.download}
            </button>
          </div>
        </>
      ) : (
        <div className="empty-preview">{copy.emptyPreview}</div>
      )}
    </section>
  );
}
