/**
 * Resolves an image URL whether it's absolute, relative (/uploads/...), or an image object.
 */
export function getImageUrl(img) {
  if (!img) return "";
  const raw =
    typeof img === "string"
      ? img
      : img.cdn_url ||
        img.thumbnail_url ||
        img.image_url ||
        img.url ||
        img.file_path ||
        (img.storage_key
          ? `/uploads/${img.storage_bucket || "properties"}/${img.storage_key}`
          : "");

  if (!raw) return "";

  // Already absolute or blob/data URI
  if (
    raw.startsWith("http://") ||
    raw.startsWith("https://") ||
    raw.startsWith("blob:") ||
    raw.startsWith("data:")
  ) {
    return raw;
  }

  // Relative path - prefix with backend base URL if needed
  const apiBase = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api/v1";
  const backendHost = apiBase.replace(/\/api\/v1\/?$/, "");
  return `${backendHost}${raw.startsWith("/") ? "" : "/"}${raw}`;
}
