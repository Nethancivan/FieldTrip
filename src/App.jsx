import { useCallback, useRef, useState } from "react";
import { flushSync } from "react-dom";
import { toPng } from "html-to-image";
import AppHeader from "./components/AppHeader";
import ExpenseForm from "./components/ExpenseForm";
import ReceiptDocument from "./components/ReceiptDocument";
import ReceiptPreview from "./components/ReceiptPreview";
import StickyActionBar from "./components/StickyActionBar";
import { copy } from "./constants/copy";
import { useExpenseForm } from "./hooks/useExpenseForm";
import { createDownloadFilename } from "./utils/filename";
import { waitForImagesInElement } from "./utils/imageLoading";
import { createReceiptId } from "./utils/receiptId";
import { waitForFrames } from "./utils/datetime";

function getCssColor(variableName, fallback) {
  const value = getComputedStyle(document.documentElement).getPropertyValue(variableName).trim();
  return value || fallback;
}

function focusFirstInvalidField() {
  requestAnimationFrame(() => {
    const firstInvalid = document.querySelector('[aria-invalid="true"]');
    if (firstInvalid) {
      firstInvalid.scrollIntoView({ behavior: "smooth", block: "center" });
      firstInvalid.focus({ preventScroll: true });
    }
  });
}

function buildSnapshot(form, photos, createdAt) {
  return {
    employee: form.employee,
    fieldtrip: form.fieldtrip.trim(),
    expenseDate: form.expenseDate,
    expenseTime: form.expenseTime,
    amountRaw: form.amountRaw,
    category: form.category,
    description: form.description.trim(),
    location: form.location.trim(),
    photos: photos.map((photo) => ({ ...photo })),
    receiptId: createReceiptId(createdAt),
    createdAt,
  };
}

function triggerDownload(dataUrl, filename) {
  const link = document.createElement("a");
  link.href = dataUrl;
  link.download = filename;
  link.rel = "noopener";
  document.body.appendChild(link);
  link.click();
  link.remove();

  if (!("download" in HTMLAnchorElement.prototype)) {
    window.open(dataUrl, "_blank", "noopener,noreferrer");
  }
}

export default function App() {
  const previewRef = useRef(null);
  const exportRef = useRef(null);
  const [snapshot, setSnapshot] = useState(null);
  const [isDirty, setIsDirty] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [liveMessage, setLiveMessage] = useState("");
  const [liveTone, setLiveTone] = useState("neutral");
  const [exportedAt, setExportedAt] = useState(null);
  const [isExporting, setIsExporting] = useState(false);
  const [exportMessage, setExportMessage] = useState("");
  const [exportTone, setExportTone] = useState("neutral");

  const formApi = useExpenseForm({
    onDirty: useCallback(() => {
      setSnapshot((current) => {
        if (current) {
          setIsDirty(true);
          setExportTone("error");
          setExportMessage(copy.outdated);
        }
        return current;
      });
    }, []),
  });

  const handleGenerate = useCallback(async () => {
    setIsGenerating(true);
    setLiveMessage("");
    setLiveTone("neutral");

    const errors = formApi.validateAll();
    if (Object.keys(errors).length > 0) {
      setIsGenerating(false);
      setLiveTone("error");
      setLiveMessage(copy.validationSummary);
      focusFirstInvalidField();
      return;
    }

    const createdAt = new Date();
    const nextSnapshot = buildSnapshot(formApi.form, formApi.photos, createdAt);
    setSnapshot(nextSnapshot);
    setIsDirty(false);
    setExportedAt(null);
    setExportTone("neutral");
    setExportMessage("");
    setLiveTone("success");
    setLiveMessage(copy.generatedSuccess);
    setIsGenerating(false);

    requestAnimationFrame(() => {
      previewRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }, [formApi]);

  const handleDownload = useCallback(async () => {
    if (!snapshot || isDirty || isExporting || !exportRef.current) {
      return;
    }

    setIsExporting(true);
    setExportTone("neutral");
    setExportMessage("");

    const nextExportedAt = new Date();
    try {
      flushSync(() => {
        setExportedAt(nextExportedAt);
      });

      if (document.fonts?.ready) {
        await document.fonts.ready;
      }
      await waitForFrames(2);
      await waitForImagesInElement(exportRef.current);
      await waitForFrames(2);

      const dataUrl = await toPng(exportRef.current, {
        backgroundColor: getCssColor("--brand-surface", "white"),
        cacheBust: true,
        pixelRatio: 1,
      });
      triggerDownload(dataUrl, createDownloadFilename(snapshot, nextExportedAt));
      setExportTone("success");
      setExportMessage(copy.exportSuccess);
    } catch (error) {
      setExportTone("error");
      setExportMessage(copy.exportError);
    } finally {
      setIsExporting(false);
    }
  }, [isDirty, isExporting, snapshot]);

  const canDownload = Boolean(snapshot) && !isDirty && !isExporting;

  return (
    <main className="app-shell">
      <div className="app-container">
        <AppHeader />
        <div className="workspace-grid">
          <ExpenseForm
            formApi={formApi}
            isGenerating={isGenerating}
            onGenerate={handleGenerate}
            liveMessage={liveMessage}
            liveTone={liveTone}
          />
          <div ref={previewRef}>
            <ReceiptPreview
              snapshot={snapshot}
              exportedAt={exportedAt}
              isDirty={isDirty}
              isExporting={isExporting}
              exportMessage={exportMessage}
              exportTone={exportTone}
              onDownload={handleDownload}
              canDownload={canDownload}
            />
          </div>
        </div>
      </div>

      <StickyActionBar
        disabled={isGenerating || formApi.isProcessingPhotos}
        isGenerating={isGenerating}
        liveMessage={liveMessage}
        liveTone={liveTone}
        onGenerate={handleGenerate}
      />

      <div className="receipt-export-host" aria-hidden="true">
        {snapshot ? (
          <ReceiptDocument
            snapshot={snapshot}
            exportedAt={exportedAt}
            mode="export"
            documentRef={exportRef}
          />
        ) : null}
      </div>
    </main>
  );
}
