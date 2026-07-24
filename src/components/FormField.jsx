export default function FormField({
  id,
  label,
  required = false,
  error,
  note,
  children,
  className = "",
}) {
  const errorId = `${id}-error`;
  const noteId = `${id}-note`;

  return (
    <div className={["field-stack", "form-field", className].filter(Boolean).join(" ")}>
      <label className="field-label form-label" htmlFor={id}>
        {label}
        {required ? <span className="required-mark"> *</span> : null}
      </label>
      {children({ describedBy: [note ? noteId : "", error ? errorId : ""].filter(Boolean).join(" ") || undefined })}
      {note ? (
        <p className="field-note" id={noteId}>
          {note}
        </p>
      ) : null}
      {error ? (
        <p className="field-error" id={errorId} role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}
