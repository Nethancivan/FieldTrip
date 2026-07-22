import { categories } from "../constants/categories";
import { copy } from "../constants/copy";
import { employees } from "../constants/employees";
import { fieldtrips } from "../constants/fieldtrips";
import AmountInput from "./AmountInput";
import FormField from "./FormField";
import LoadingSpinner from "./LoadingSpinner";
import PhotoUploader from "./PhotoUploader";

export default function ExpenseForm({
  formApi,
  isGenerating,
  onGenerate,
  liveMessage,
  liveTone,
}) {
  const {
    form,
    errors,
    photos,
    photoMessage,
    isProcessingPhotos,
    updateField,
    addPhotos,
    removePhoto,
  } = formApi;
  const descriptionLength = form.description.length;

  const handleFieldtripBlur = (event) => {
    const value = event.target.value.trim();
    updateField("fieldtrip", value);
    const matchedFieldtrip = fieldtrips.find((fieldtrip) => fieldtrip.name === value);
    if (matchedFieldtrip && !form.fieldtripCode.trim()) {
      updateField("fieldtripCode", matchedFieldtrip.code);
    }
  };

  return (
    <section className="surface-panel panel-section" aria-labelledby="expense-form-title">
      <h2 className="section-heading" id="expense-form-title">
        {copy.formTitle}
      </h2>
      <p className="section-note">{copy.formDescription}</p>

      <form className="form-grid" noValidate onSubmit={(event) => {
        event.preventDefault();
        onGenerate();
      }}>
        <FormField id="employee" label={copy.fields.employee} required error={errors.employee}>
          {({ describedBy }) => (
            <select
              id="employee"
              className="form-control"
              value={form.employee}
              aria-invalid={errors.employee ? "true" : "false"}
              aria-describedby={describedBy}
              onChange={(event) => updateField("employee", event.target.value)}
            >
              <option value="">{copy.placeholders.employee}</option>
              {employees.map((employee) => (
                <option key={employee} value={employee}>
                  {employee}
                </option>
              ))}
            </select>
          )}
        </FormField>

        <FormField id="fieldtrip" label={copy.fields.fieldtrip} required error={errors.fieldtrip}>
          {({ describedBy }) => (
            <>
              <input
                id="fieldtrip"
                className="form-control"
                type="text"
                list="fieldtrip-suggestions"
                value={form.fieldtrip}
                placeholder={copy.placeholders.fieldtrip}
                aria-invalid={errors.fieldtrip ? "true" : "false"}
                aria-describedby={describedBy}
                onChange={(event) => updateField("fieldtrip", event.target.value)}
                onBlur={handleFieldtripBlur}
              />
              <datalist id="fieldtrip-suggestions">
                {fieldtrips.map((fieldtrip) => (
                  <option key={fieldtrip.code} value={fieldtrip.name} label={fieldtrip.code} />
                ))}
              </datalist>
            </>
          )}
        </FormField>

        <FormField id="fieldtripCode" label={copy.fields.fieldtripCode} error={errors.fieldtripCode}>
          {({ describedBy }) => (
            <input
              id="fieldtripCode"
              className="form-control"
              type="text"
              value={form.fieldtripCode}
              placeholder={copy.placeholders.fieldtripCode}
              aria-invalid={errors.fieldtripCode ? "true" : "false"}
              aria-describedby={describedBy}
              onChange={(event) => updateField("fieldtripCode", event.target.value)}
              onBlur={(event) => updateField("fieldtripCode", event.target.value.trim())}
            />
          )}
        </FormField>

        <FormField id="expenseDate" label={copy.fields.expenseDate} required error={errors.expenseDate}>
          {({ describedBy }) => (
            <input
              id="expenseDate"
              className="form-control"
              type="date"
              value={form.expenseDate}
              aria-invalid={errors.expenseDate ? "true" : "false"}
              aria-describedby={describedBy}
              onChange={(event) => updateField("expenseDate", event.target.value)}
            />
          )}
        </FormField>

        <FormField id="expenseTime" label={copy.fields.expenseTime} required error={errors.expenseTime}>
          {({ describedBy }) => (
            <input
              id="expenseTime"
              className="form-control"
              type="time"
              value={form.expenseTime}
              aria-invalid={errors.expenseTime ? "true" : "false"}
              aria-describedby={describedBy}
              onChange={(event) => updateField("expenseTime", event.target.value)}
            />
          )}
        </FormField>

        <FormField id="amount" label={copy.fields.amount} required error={errors.amountRaw}>
          {({ describedBy }) => (
            <AmountInput
              id="amount"
              value={form.amountRaw}
              error={errors.amountRaw}
              describedBy={describedBy}
              onChange={(value) => updateField("amountRaw", value)}
            />
          )}
        </FormField>

        <FormField id="category" label={copy.fields.category} required error={errors.category}>
          {({ describedBy }) => (
            <select
              id="category"
              className="form-control"
              value={form.category}
              aria-invalid={errors.category ? "true" : "false"}
              aria-describedby={describedBy}
              onChange={(event) => updateField("category", event.target.value)}
            >
              <option value="">{copy.placeholders.category}</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          )}
        </FormField>

        <FormField
          id="description"
          label={copy.fields.description}
          required
          error={errors.description}
          className="span-full"
        >
          {({ describedBy }) => (
            <>
              <textarea
                id="description"
                className="form-control"
                value={form.description}
                placeholder={copy.placeholders.description}
                maxLength={500}
                aria-invalid={errors.description ? "true" : "false"}
                aria-describedby={describedBy}
                onChange={(event) => updateField("description", event.target.value)}
              />
              <span className="textarea-meta">{descriptionLength}/500</span>
            </>
          )}
        </FormField>

        <FormField id="location" label={copy.fields.location} error={errors.location} className="span-full">
          {({ describedBy }) => (
            <input
              id="location"
              className="form-control"
              type="text"
              value={form.location}
              placeholder={copy.placeholders.location}
              aria-invalid={errors.location ? "true" : "false"}
              aria-describedby={describedBy}
              onChange={(event) => updateField("location", event.target.value)}
              onBlur={(event) => updateField("location", event.target.value.trim())}
            />
          )}
        </FormField>

        <PhotoUploader
          photos={photos}
          error={errors.photos}
          photoMessage={photoMessage}
          isProcessingPhotos={isProcessingPhotos}
          onAddPhotos={addPhotos}
          onRemovePhoto={removePhoto}
        />

        <div className="span-full button-row desktop-action">
          <p className={`live-region ${liveTone === "error" ? "live-region-error" : ""} ${liveTone === "success" ? "live-region-success" : ""}`} aria-live="polite">
            {liveMessage}
          </p>
          <button className="btn btn-primary" type="submit" disabled={isGenerating || isProcessingPhotos}>
            {isGenerating ? <LoadingSpinner label={copy.generating} /> : copy.generate}
          </button>
        </div>
      </form>
    </section>
  );
}
