export default function LoadingSpinner({ label = "Đang xử lý" }) {
  return (
    <span className="inline-flex items-center gap-2" aria-label={label}>
      <span className="spinner" aria-hidden="true" />
      <span>{label}</span>
    </span>
  );
}
