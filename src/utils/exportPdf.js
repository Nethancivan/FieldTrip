import { toPng } from "html-to-image";
import { jsPDF } from "jspdf";
import { waitForFrames } from "./datetime";
import { waitForImagesInElement } from "./imageLoading";

const PDF_MARGIN_MM = 14;
const PDF_BLOCK_GAP_MM = 4;

function getCssColor(variableName, fallback) {
  const value = getComputedStyle(document.documentElement).getPropertyValue(variableName).trim();
  return value || fallback;
}

function loadRenderedImage(dataUrl) {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error("Không thể đọc nội dung PDF đã render."));
    image.src = dataUrl;
  });
}

async function renderBlock(block) {
  const dataUrl = await toPng(block, {
    backgroundColor: getCssColor("--brand-surface", "white"),
    cacheBust: true,
    pixelRatio: 2,
  });
  const image = await loadRenderedImage(dataUrl);
  return {
    dataUrl,
    width: image.naturalWidth || image.width,
    height: image.naturalHeight || image.height,
  };
}

function addBlockToPdf(pdf, renderedBlock, cursor) {
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  const contentWidth = pageWidth - PDF_MARGIN_MM * 2;
  const contentHeight = pageHeight - PDF_MARGIN_MM * 2;
  let drawWidth = contentWidth;
  let drawHeight = (renderedBlock.height / renderedBlock.width) * drawWidth;

  if (drawHeight > contentHeight) {
    drawHeight = contentHeight;
    drawWidth = (renderedBlock.width / renderedBlock.height) * drawHeight;
  }

  if (cursor.hasContent && cursor.y + drawHeight > pageHeight - PDF_MARGIN_MM) {
    pdf.addPage();
    cursor.y = PDF_MARGIN_MM;
    cursor.hasContent = false;
  }

  const x = PDF_MARGIN_MM + (contentWidth - drawWidth) / 2;
  pdf.addImage(renderedBlock.dataUrl, "PNG", x, cursor.y, drawWidth, drawHeight, undefined, "FAST");
  cursor.y += drawHeight + PDF_BLOCK_GAP_MM;
  cursor.hasContent = true;
}

export async function exportReceiptPdf(receiptElement, filename) {
  if (!receiptElement) {
    throw new Error("Không tìm thấy nội dung phiếu để tạo PDF.");
  }

  if (document.fonts?.ready) {
    await document.fonts.ready;
  }
  await waitForFrames(2);
  await waitForImagesInElement(receiptElement);
  await waitForFrames(2);

  const blocks = Array.from(receiptElement.querySelectorAll("[data-pdf-block='true']")).filter(
    (block) => block.getBoundingClientRect().height > 0,
  );

  if (!blocks.length) {
    throw new Error("Không có nội dung phiếu để tạo PDF.");
  }

  const pdf = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
    compress: true,
  });

  const cursor = {
    y: PDF_MARGIN_MM,
    hasContent: false,
  };

  for (const block of blocks) {
    const renderedBlock = await renderBlock(block);
    addBlockToPdf(pdf, renderedBlock, cursor);
  }

  pdf.save(filename);
}
