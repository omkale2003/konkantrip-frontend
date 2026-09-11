/**
 * Client-side Image Compression Utility
 * 
 * Compresses images in the browser using HTML5 Canvas before uploading to the server.
 * Preserves aspect ratio, auto-resizes to full HD dimensions, and optimizes quality.
 */

export const DEFAULT_COMPRESSION_OPTIONS = {
  maxWidth: 1920,
  maxHeight: 1080,
  quality: 0.82,
  mimeType: "image/jpeg",
  skipUnderBytes: 300 * 1024, // Skip compressing files already under 300KB
};

/**
 * Compresses an image File object in the browser.
 * 
 * @param {File} file - Original browser File object
 * @param {object} options - Custom compression options
 * @returns {Promise<File>} Compressed File object with attached statistics
 */
export async function compressImage(file, options = {}) {
  const config = { ...DEFAULT_COMPRESSION_OPTIONS, ...options };

  // Skip non-images or formats that shouldn't be compressed via canvas (e.g. SVG, GIF)
  if (!file || !file.type.startsWith("image/") || file.type === "image/svg+xml" || file.type === "image/gif") {
    return file;
  }

  // If file is already tiny, return as-is
  if (file.size <= config.skipUnderBytes) {
    file.originalSize = file.size;
    file.compressedSize = file.size;
    file.savedPercent = 0;
    return file;
  }

  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onerror = () => resolve(file); // Fallback to original on error
    reader.onload = (event) => {
      const img = new Image();
      img.onerror = () => resolve(file);
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        // Proportional resize if larger than bounds
        if (width > config.maxWidth || height > config.maxHeight) {
          if (width / height > config.maxWidth / config.maxHeight) {
            height = Math.round((height * config.maxWidth) / width);
            width = config.maxWidth;
          } else {
            width = Math.round((width * config.maxHeight) / height);
            height = config.maxHeight;
          }
        }

        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext("2d");
        if (!ctx) {
          resolve(file);
          return;
        }

        // Draw image on canvas with high-quality smoothing
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = "high";
        ctx.drawImage(img, 0, 0, width, height);

        // Determine target format
        const targetMime = file.type === "image/png" && !config.forceJpeg ? "image/jpeg" : config.mimeType;

        canvas.toBlob(
          (blob) => {
            if (!blob || blob.size >= file.size) {
              // If compression didn't save size, use original
              file.originalSize = file.size;
              file.compressedSize = file.size;
              file.savedPercent = 0;
              resolve(file);
              return;
            }

            // Create new File from blob
            const ext = targetMime === "image/jpeg" ? ".jpg" : targetMime === "image/webp" ? ".webp" : ".png";
            const baseName = file.name.replace(/\.[^/.]+$/, "");
            const newName = `${baseName}${ext}`;

            const compressedFile = new File([blob], newName, {
              type: targetMime,
              lastModified: Date.now(),
            });

            // Attach compression stats
            const savedBytes = file.size - compressedFile.size;
            compressedFile.originalSize = file.size;
            compressedFile.compressedSize = compressedFile.size;
            compressedFile.savedBytes = savedBytes;
            compressedFile.savedPercent = Math.round((savedBytes / file.size) * 100);
            compressedFile.width = width;
            compressedFile.height = height;

            resolve(compressedFile);
          },
          targetMime,
          config.quality
        );
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(file);
  });
}

/**
 * Format bytes into human-readable string (KB, MB).
 */
export function formatFileSize(bytes) {
  if (!bytes || bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
}
