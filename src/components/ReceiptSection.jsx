export default function ReceiptSection({ title, children, className = "", pdfBlock = true }) {
  return (
    <section
      className={`receipt-section ${className}`}
      data-pdf-block={pdfBlock ? "true" : undefined}
    >
      <h2 className="receipt-section-title">{title}</h2>
      {children}
    </section>
  );
}
