/**
 * Default curated fallback images for properties, rooms, and avatars
 */
export const DEFAULT_PROPERTY_IMAGE =
  "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80";

export const DEFAULT_ROOM_IMAGE =
  "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=800&q=80";

export const DEFAULT_AVATAR_IMAGE = "";

/**
 * Resolves an image URL whether it's absolute, relative (/uploads/...), Windows-style path, or an image object.
 */
export function getImageUrl(img, fallback = DEFAULT_PROPERTY_IMAGE) {
  if (!img) return fallback;

  let raw = "";
  if (typeof img === "string") {
    raw = img.trim();
  } else if (typeof img === "object") {
    raw =
      img.cdn_url ||
      img.thumbnail_url ||
      img.image_url ||
      img.url ||
      img.file_path ||
      img.storage_path ||
      img.cover_image ||
      (Array.isArray(img.images) && img.images.length > 0
        ? typeof img.images[0] === "string"
          ? img.images[0]
          : img.images[0]?.cdn_url ||
            img.images[0]?.file_path ||
            img.images[0]?.image_url ||
            img.images[0]?.thumbnail_url
        : "") ||
      (img.storage_key
        ? `/uploads/${img.storage_bucket || "properties"}/${img.storage_key}`
        : "");
  }

  if (!raw || typeof raw !== "string") return fallback;
  raw = raw.trim();

  // Normalize Windows backslashes to forward slashes
  raw = raw.replace(/\\/g, "/");

  // Fix stale port 5000 localhost URLs to current backend host
  if (raw.includes("localhost:5000")) {
    const apiBase =
      import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api/v1";
    const backendHost = apiBase.replace(/\/api\/v1\/?$/, "");
    raw = raw.replace("http://localhost:5000", backendHost);
  }

  // If mock seed domain cdn.konkantrip.com is present (non-existent domain in local dev), map gracefully
  if (raw.includes("cdn.konkantrip.com")) {
    if (
      raw.includes("room") ||
      raw.includes("bedroom") ||
      raw.includes("interior") ||
      raw.includes("bathroom")
    ) {
      return DEFAULT_ROOM_IMAGE;
    }
    return DEFAULT_PROPERTY_IMAGE;
  }

  // Already absolute URL or blob / data URI
  if (
    raw.startsWith("http://") ||
    raw.startsWith("https://") ||
    raw.startsWith("blob:") ||
    raw.startsWith("data:")
  ) {
    return raw;
  }

  // Ensure relative upload paths have leading slash
  if (!raw.startsWith("/")) {
    raw = "/" + raw;
  }

  // If the path starts with /properties/, /rooms/, /documents/, /profiles/ without /uploads prefix, prepend /uploads
  if (
    raw.startsWith("/properties/") ||
    raw.startsWith("/rooms/") ||
    raw.startsWith("/documents/") ||
    raw.startsWith("/profiles/") ||
    raw.startsWith("/general/")
  ) {
    raw = "/uploads" + raw;
  }

  // In dev / production, return the clean relative path (which Vite proxy handles automatically) or full backend URL
  const apiBase =
    import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api/v1";
  const backendHost = apiBase.replace(/\/api\/v1\/?$/, "");

  // If running directly on different host or static build, prefix with backendHost
  if (backendHost && !backendHost.includes(window.location?.host)) {
    return `${backendHost}${raw}`;
  }

  return raw;
}

/**
 * Image error handler to safely switch to fallback placeholder if an image fails to load
 */
export function handleImageError(e, fallback = DEFAULT_PROPERTY_IMAGE) {
  if (e?.currentTarget) {
    e.currentTarget.onerror = null;
    if (fallback) {
      e.currentTarget.src = fallback;
    }
  }
}
