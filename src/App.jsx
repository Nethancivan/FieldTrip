import { useCallback, useEffect, useRef, useState } from "react";
import { flushSync } from "react-dom";
import AppHeader from "./components/AppHeader";
import ExpenseForm from "./components/ExpenseForm";
import ReceiptDocument from "./components/ReceiptDocument";
import ReceiptPreview from "./components/ReceiptPreview";
import StickyActionBar from "./components/StickyActionBar";
import { copy } from "./constants/copy";
import { useExpenseForm } from "./hooks/useExpenseForm";
import { waitForFrames } from "./utils/datetime";
import { waitForImagesInElement } from "./utils/imageLoading";
import { createPdfFilename } from "./utils/pdfFilename";
import { createReceiptId } from "./utils/receiptId";

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
    fieldtripCode: form.fieldtripCode.trim(),
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
  const [areReceiptAssetsReady, setAreReceiptAssetsReady] = useState(false);

  const formApi = useExpenseForm({
    onDirty: useCallback(() => {
      setSnapshot((current) => {
        if (current) {
          setIsDirty(true);
          setAreReceiptAssetsReady(false);
          setExportTone("error");
          setExportMessage(copy.outdated);
        }
        return current;
      });
    }, []),
  });

  useEffect(() => {
    let cancelled = false;
    setAreReceiptAssetsReady(false);

    if (!snapshot || isDirty) {
      return () => {
        cancelled = true;
      };
    }

    const prepareAssets = async () => {
      try {
        await waitForFrames(2);
        if (!exportRef.current) {
          return;
        }
        if (document.fonts?.ready) {
          await document.fonts.ready;
        }
        await waitForImagesInElement(exportRef.current);
        if (!cancelled) {
          setAreReceiptAssetsReady(true);
          if (!exportMessage) {
            setExportTone("neutral");
          }
        }
      } catch (error) {
        if (!cancelled) {
          setExportTone("error");
          setExportMessage(copy.assetLoadError);
        }
      }
    };

    prepareAssets();

    return () => {
      cancelled = true;
    };
  }, [snapshot, isDirty, exportMessage]);

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
    setAreReceiptAssetsReady(false);
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
    if (!snapshot || isDirty || isExporting || !exportRef.current || !areReceiptAssetsReady) {
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

      await waitForFrames(2);
      const { exportReceiptPdf } = await import("./utils/exportPdf");
      await exportReceiptPdf(
        exportRef.current,
        createPdfFilename(snapshot, nextExportedAt),
      );
      setExportTone("success");
      setExportMessage(copy.exportSuccess);
    } catch (error) {
      setExportTone("error");
      setExportMessage(copy.exportError);
    } finally {
      setIsExporting(false);
    }
  }, [areReceiptAssetsReady, isDirty, isExporting, snapshot]);

  const canDownload = Boolean(snapshot) && !isDirty && !isExporting && areReceiptAssetsReady;

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
