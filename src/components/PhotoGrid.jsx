export default function PhotoGrid({ photos, onRemove }) {
  if (!photos.length) {
    return null;
  }

  return (
    <div className="photo-grid" aria-label="Danh sách ảnh chứng từ đã tải lên">
      {photos.map((photo, index) => (
        <div className="photo-tile" key={photo.id}>
          <img
            src={photo.dataUrl}
            alt={`Ảnh chứng từ ${index + 1}: ${photo.name}`}
            decoding="async"
            loading="eager"
          />
          <button
            className="photo-delete"
            type="button"
            onClick={() => onRemove(photo.id)}
            aria-label={`Xóa ảnh chứng từ ${index + 1}`}
          >
            Xóa
          </button>
        </div>
      ))}
    </div>
  );
}
