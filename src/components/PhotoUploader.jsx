import { MAX_PHOTOS } from "../utils/imageProcessing";
import { copy } from "../constants/copy";
import FormField from "./FormField";
import LoadingSpinner from "./LoadingSpinner";
import PhotoGrid from "./PhotoGrid";

export default function PhotoUploader({
  photos,
  error,
  photoMessage,
  isProcessingPhotos,
  onAddPhotos,
  onRemovePhoto,
}) {
  const id = "photos";

  const handleChange = (event) => {
    const input = event.currentTarget;
    const selectedFiles = Array.from(input.files || []);
    Promise.resolve(onAddPhotos(selectedFiles)).finally(() => {
      input.value = "";
    });
  };

  return (
    <FormField
      id={id}
      label={copy.fields.photos}
      required
      error={error}
      note={copy.photoHelp}
      className="span-full"
    >
      {({ describedBy }) => (
        <div className="upload-zone">
          <div className="photo-toolbar">
            <span className="photo-count">{photos.length}/{MAX_PHOTOS}</span>
            {isProcessingPhotos ? <LoadingSpinner label="Đang xử lý ảnh..." /> : null}
          </div>
          <input
            id={id}
            className="upload-input"
            type="file"
            accept="image/jpeg,image/png,image/webp"
            multiple
            aria-invalid={error ? "true" : "false"}
            aria-describedby={describedBy}
            disabled={isProcessingPhotos || photos.length >= MAX_PHOTOS}
            onChange={handleChange}
          />
          {photoMessage ? (
            <p
              className={`photo-status ${photoMessage.startsWith("Đã thêm") ? "photo-status-success" : ""}`}
              aria-live="polite"
            >
              {photoMessage}
            </p>
          ) : null}
          <PhotoGrid photos={photos} onRemove={onRemovePhoto} />
        </div>
      )}
    </FormField>
  );
}
