function applyLogoFallback(image) {
  const fallbackSrc = image.dataset.logoFallbackSrc;

  if (!fallbackSrc || image.dataset.logoFallbackApplied === "true") {
    return false;
  }

  image.dataset.logoFallbackApplied = "true";
  image.src = fallbackSrc;
  return true;
}

function waitForImage(image) {
  if (image.complete && image.naturalWidth > 0) {
    return image.decode ? image.decode().catch(() => undefined) : Promise.resolve();
  }

  if (image.complete && image.naturalWidth === 0 && applyLogoFallback(image)) {
    return waitForImage(image);
  }

  return new Promise((resolve, reject) => {
    const cleanup = () => {
      image.removeEventListener("load", onLoad);
      image.removeEventListener("error", onError);
    };
    const onLoad = () => {
      cleanup();
      if (image.decode) {
        image.decode().then(resolve).catch(() => resolve());
      } else {
        resolve();
      }
    };
    const onError = () => {
      cleanup();
      if (applyLogoFallback(image)) {
        waitForImage(image).then(resolve).catch(reject);
        return;
      }
      reject(new Error("Không thể tải hình ảnh trong phiếu."));
    };
    image.addEventListener("load", onLoad, { once: true });
    image.addEventListener("error", onError, { once: true });
  });
}

export async function waitForImagesInElement(element) {
  const images = Array.from(element.querySelectorAll("img"));
  await Promise.all(images.map(waitForImage));
}
