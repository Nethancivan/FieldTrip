import { useCallback, useEffect, useRef, useState } from "react";
import { getLocalDateInputValue, getLocalTimeInputValue } from "../utils/datetime";
import { normalizeAmount } from "../utils/currency";
import { MAX_PHOTOS, processEvidenceImage, validateImageFile } from "../utils/imageProcessing";
import { validateExpenseForm, validateField } from "../utils/validation";

const PHOTO_PROCESSING_TIMEOUT_MS = 12000;

function createInitialForm() {
  const openedAt = new Date();
  return {
    employee: "",
    fieldtrip: "",
    fieldtripCode: "",
    expenseDate: getLocalDateInputValue(openedAt),
    expenseTime: getLocalTimeInputValue(openedAt),
    amountRaw: "",
    category: "",
    description: "",
    location: "",
  };
}

function processPhotoWithTimeout(file) {
  return new Promise((resolve, reject) => {
    const timer = window.setTimeout(
      () => reject(new Error("Quá thời gian xử lý ảnh. Vui lòng thử ảnh khác.")),
      PHOTO_PROCESSING_TIMEOUT_MS,
    );

    processEvidenceImage(file)
      .then((image) => {
        window.clearTimeout(timer);
        resolve(image);
      })
      .catch((error) => {
        window.clearTimeout(timer);
        reject(error);
      });
  });
}

export function useExpenseForm({ onDirty }) {
  const [form, setForm] = useState(createInitialForm);
  const [photos, setPhotos] = useState([]);
  const [errors, setErrors] = useState({});
  const [photoMessage, setPhotoMessage] = useState("");
  const [isProcessingPhotos, setIsProcessingPhotos] = useState(false);
  const mountedRef = useRef(true);

  useEffect(() => {
    return () => {
      mountedRef.current = false;
    };
  }, []);

  const markDirty = useCallback(() => {
    onDirty?.();
  }, [onDirty]);

  const clearFieldErrorIfValid = useCallback((fieldName, value, nextForm, nextPhotos) => {
    setErrors((current) => {
      if (!current[fieldName]) {
        return current;
      }
      const error = validateField(fieldName, value, nextForm, nextPhotos);
      if (error) {
        return current;
      }
      const updated = { ...current };
      delete updated[fieldName];
      return updated;
    });
  }, []);

  const updateField = useCallback(
    (fieldName, value) => {
      const normalized =
        fieldName === "amountRaw" ? normalizeAmount(value) : value;

      setForm((current) => {
        if (current[fieldName] === normalized) {
          return current;
        }
        const next = { ...current, [fieldName]: normalized };
        clearFieldErrorIfValid(fieldName, normalized, next, photos);
        markDirty();
        return next;
      });
    },
    [clearFieldErrorIfValid, markDirty, photos],
  );

  const addPhotos = useCallback(
    async (fileList) => {
      const files = Array.from(fileList || []);
      if (!files.length) {
        return;
      }

      const availableSlots = MAX_PHOTOS - photos.length;
      const messages = [];

      if (availableSlots <= 0) {
        setPhotoMessage("Bạn đã tải tối đa 6 ảnh chứng từ.");
        return;
      }

      const acceptedCandidates = files.slice(0, availableSlots);
      if (files.length > availableSlots) {
        messages.push("Chỉ thêm được tối đa 6 ảnh. Các ảnh vượt giới hạn đã được bỏ qua.");
      }

      const validFiles = [];
      acceptedCandidates.forEach((file) => {
        const error = validateImageFile(file);
        if (error) {
          messages.push(`${file.name}: ${error}`);
        } else {
          validFiles.push(file);
        }
      });

      if (!validFiles.length) {
        setPhotoMessage(messages.join(" "));
        return;
      }

      setIsProcessingPhotos(true);
      setPhotoMessage("Đang xử lý ảnh trên thiết bị...");

      const processed = [];
      try {
        for (const file of validFiles) {
          try {
            const image = await processPhotoWithTimeout(file);
            processed.push(image);
          } catch (error) {
            messages.push(`${file.name}: ${error.message || "Không thể xử lý ảnh."}`);
          }
        }

        if (!mountedRef.current) {
          return;
        }

        setPhotos((current) => {
          const next = [...current, ...processed].slice(0, MAX_PHOTOS);
          if (processed.length) {
            clearFieldErrorIfValid("photos", next, form, next);
          }
          return next;
        });

        setPhotoMessage(
          processed.length
            ? [`Đã thêm ${processed.length} ảnh chứng từ.`, ...messages].join(" ")
            : messages.join(" "),
        );

        if (processed.length) {
          markDirty();
        }
      } finally {
        if (mountedRef.current) {
          setIsProcessingPhotos(false);
        }
      }
    },
    [clearFieldErrorIfValid, form, markDirty, photos.length],
  );

  const removePhoto = useCallback(
    (photoId) => {
      setPhotos((current) => {
        const next = current.filter((photo) => photo.id !== photoId);
        setErrors((existing) => {
          const error = validateField("photos", next, form, next);
          if (error) {
            return { ...existing, photos: error };
          }
          const updated = { ...existing };
          delete updated.photos;
          return updated;
        });
        return next;
      });
      setPhotoMessage("Ảnh chứng từ đã được xóa.");
      markDirty();
    },
    [form, markDirty],
  );

  const validateAll = useCallback(() => {
    const nextErrors = validateExpenseForm(form, photos);
    setErrors(nextErrors);
    return nextErrors;
  }, [form, photos]);

  return {
    form,
    photos,
    errors,
    photoMessage,
    isProcessingPhotos,
    updateField,
    addPhotos,
    removePhoto,
    validateAll,
  };
}
