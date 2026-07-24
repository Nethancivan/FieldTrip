function waitForImage(image) {
  if (image.complete && image.naturalWidth > 0) {
    return image.decode ? image.decode().catch(() => undefined) : Promise.resolve();
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
