function hasLoadedDimensions(image) {
  return image.complete && image.naturalWidth > 0 && image.naturalHeight > 0;
}

export async function waitForImage(image) {
  if (hasLoadedDimensions(image)) {
    if (typeof image.decode === "function") {
      try {
        await image.decode();
      } catch {
        // Some Safari versions reject decode() after a valid image load.
      }
    }
    return;
  }

  if (image.complete && (!image.naturalWidth || !image.naturalHeight)) {
    throw new Error("Co hinh anh chua duoc tai hoan tat.");
  }

  await new Promise((resolve, reject) => {
    const cleanup = () => {
      image.removeEventListener("load", handleLoad);
      image.removeEventListener("error", handleError);
    };

    const handleLoad = () => {
      cleanup();
      resolve();
    };

    const handleError = () => {
      cleanup();
      reject(new Error("Khong the tai hinh anh trong phieu."));
    };

    image.addEventListener("load", handleLoad, { once: true });
    image.addEventListener("error", handleError, { once: true });
  });

  if (typeof image.decode === "function") {
    try {
      await image.decode();
    } catch {
      // Do not block Safari when the image already has valid dimensions.
    }
  }

  if (!image.naturalWidth || !image.naturalHeight) {
    throw new Error("Co hinh anh chua duoc tai hoan tat.");
  }
}

export async function waitForImagesInElement(element) {
  const images = Array.from(element.querySelectorAll("img"));
  await Promise.all(images.map(waitForImage));

  const invalidImage = images.find(
    (image) => image.naturalWidth === 0 || image.naturalHeight === 0,
  );

  if (invalidImage) {
    throw new Error("Co hinh anh chua duoc tai hoan tat.");
  }
}
