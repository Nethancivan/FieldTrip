export const MAX_PHOTOS = 6;
export const MAX_FILE_SIZE_BYTES = 12 * 1024 * 1024;
export const SUPPORTED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];

const TARGET_LONG_EDGE = 2000;
const OUTPUT_QUALITY = 0.9;
const IMAGE_DECODE_TIMEOUT_MS = 8000;

function readFileAsDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    const timer = window.setTimeout(() => {
      reader.abort();
      reject(new Error("Quá thời gian đọc ảnh."));
    }, IMAGE_DECODE_TIMEOUT_MS);

    reader.onload = () => {
      window.clearTimeout(timer);
      resolve(reader.result);
    };
    reader.onerror = () => {
      window.clearTimeout(timer);
      reject(new Error("Không thể đọc file ảnh."));
    };
    reader.onabort = () => {
      window.clearTimeout(timer);
      reject(new Error("Quá thời gian đọc ảnh."));
    };
    reader.readAsDataURL(file);
  });
}

function readImageFromUrl(url) {
  return new Promise((resolve, reject) => {
    const image = new Image();
    const timer = window.setTimeout(() => {
      cleanup();
      reject(new Error("Quá thời gian giải mã ảnh."));
    }, IMAGE_DECODE_TIMEOUT_MS);
    const cleanup = () => {
      window.clearTimeout(timer);
      image.onload = null;
      image.onerror = null;
    };
    image.onload = () => {
      cleanup();
      resolve(image);
    };
    image.onerror = () => {
      cleanup();
      reject(new Error("Không thể đọc hình ảnh."));
    };
    image.src = url;
  });
}

async function decodeImageElement(image) {
  if (!image.decode) {
    return;
  }

  await Promise.race([
    image.decode().catch(() => undefined),
    new Promise((resolve) => window.setTimeout(resolve, IMAGE_DECODE_TIMEOUT_MS)),
  ]);
}

async function decodeWithImageElement(file) {
  const dataUrl = await readFileAsDataUrl(file);
  const image = await readImageFromUrl(dataUrl);
  await decodeImageElement(image);
  return image;
}

async function decodeFile(file) {
  return decodeWithImageElement(file);
}

function getTargetSize(width, height) {
  const longest = Math.max(width, height);
  if (longest <= TARGET_LONG_EDGE) {
    return { width, height };
  }
  const ratio = TARGET_LONG_EDGE / longest;
  return {
    width: Math.max(1, Math.round(width * ratio)),
    height: Math.max(1, Math.round(height * ratio)),
  };
}

export function validateImageFile(file) {
  if (!SUPPORTED_IMAGE_TYPES.includes(file.type)) {
    return "Định dạng không được hỗ trợ. Vui lòng chọn JPG, PNG hoặc WebP.";
  }
  if (file.size > MAX_FILE_SIZE_BYTES) {
    return "Ảnh vượt quá 12 MB. Vui lòng chọn ảnh nhỏ hơn.";
  }
  return "";
}

export async function processEvidenceImage(file) {
  const validationError = validateImageFile(file);
  if (validationError) {
    throw new Error(validationError);
  }

  const decoded = await decodeFile(file);
  const width = decoded.width || decoded.naturalWidth;
  const height = decoded.height || decoded.naturalHeight;

  if (!width || !height) {
    if (decoded.close) {
      decoded.close();
    }
    throw new Error("Ảnh bị lỗi hoặc không thể đọc được.");
  }

  const target = getTargetSize(width, height);
  const canvas = document.createElement("canvas");
  canvas.width = target.width;
  canvas.height = target.height;

  const context = canvas.getContext("2d", { alpha: false });
  if (!context) {
    throw new Error("Trình duyệt không hỗ trợ xử lý ảnh bằng canvas.");
  }
  context.fillStyle = "white";
  context.fillRect(0, 0, canvas.width, canvas.height);
  context.drawImage(decoded, 0, 0, canvas.width, canvas.height);

  if (decoded.close) {
    decoded.close();
  }

  const dataUrl = canvas.toDataURL("image/jpeg", OUTPUT_QUALITY);
  const processedImage = await readImageFromUrl(dataUrl);
  await decodeImageElement(processedImage);

  if (!processedImage.naturalWidth || !processedImage.naturalHeight) {
    throw new Error("Ảnh chứng từ chưa được tải hoàn tất.");
  }

  return {
    id: `${Date.now()}-${crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(16).slice(2)}`,
    name: file.name,
    dataUrl,
    width: target.width,
    height: target.height,
    originalSize: file.size,
  };
}
