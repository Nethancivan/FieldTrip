export default function ReceiptSection({ title, children }) {
  return (
    <section className="receipt-section">
      <h2 className="receipt-section-title">{title}</h2>
      {children}
    </section>
  );
}
