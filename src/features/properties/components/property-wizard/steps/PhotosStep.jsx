import { useId, useMemo, useState } from "react";
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Image as ImageIcon,
  Star,
  Trash2,
  UploadCloud,
  X,
} from "lucide-react";

import {
  useAddPropertyImage,
  useDeletePropertyImage,
  usePropertyImageTypes,
  usePropertyImages,
  useUpdatePropertyImage,
} from "../../../hooks/usePropertyImages.js";

const ACCEPTED_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

function formatBytes(bytes) {
  if (!bytes || bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
}

// Convert a File object to Data URL base64 string
function readFileAsDataURL(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = (err) => reject(err);
    reader.readAsDataURL(file);
  });
}

function PhotosStep({
  propertyId,
  onSubmit,
  onBack,
  isEditingFromReview = false,
  isSubmitting = false,
  serverError = "",
}) {
  const fileInputId = useId();
  const [stagedFiles, setStagedFiles] = useState([]);
  const [fileError, setFileError] = useState("");
  const [isUploading, setIsUploading] = useState(false);

  // Queries
  const imagesQuery = usePropertyImages(propertyId);
  const propertyImages = useMemo(
    () => (Array.isArray(imagesQuery.data?.data) ? imagesQuery.data.data : []),
    [imagesQuery.data]
  );

  const imageTypesQuery = usePropertyImageTypes();
  const imageTypes = imageTypesQuery.data?.data || [];
  const defaultTypeId = imageTypes[0]?.image_type_id || 1;

  // Mutations
  const addImageMutation = useAddPropertyImage(propertyId);
  const updateImageMutation = useUpdatePropertyImage(propertyId);
  const deleteImageMutation = useDeletePropertyImage(propertyId);

  const handleFileSelect = (files) => {
    setFileError("");
    const validFiles = [];

    for (const file of Array.from(files)) {
      if (!ACCEPTED_TYPES.includes(file.type.toLowerCase())) {
        setFileError("Unsupported image format. Please select JPG, PNG, or WEBP files.");
        continue;
      }
      if (file.size > MAX_FILE_SIZE) {
        setFileError(`"${file.name}" is too large. Maximum size is 10MB.`);
        continue;
      }

      const previewUrl = URL.createObjectURL(file);
      validFiles.push({
        id: `${file.name}-${Date.now()}-${Math.random()}`,
        file,
        name: file.name,
        size: file.size,
        type: file.type,
        previewUrl,
        image_title: file.name,
        image_alt_text: "",
      });
    }

    if (validFiles.length > 0) {
      setStagedFiles((prev) => [...prev, ...validFiles]);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileSelect(e.dataTransfer.files);
    }
  };

  const removeStagedFile = (id) => {
    setStagedFiles((prev) => {
      const target = prev.find((item) => item.id === id);
      if (target?.previewUrl) {
        URL.revokeObjectURL(target.previewUrl);
      }
      return prev.filter((item) => item.id !== id);
    });
  };

  const updateStagedFile = (id, field, value) => {
    setStagedFiles((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, [field]: value } : item
      )
    );
  };

  const handleUploadStagedFiles = async () => {
    if (stagedFiles.length === 0 || !propertyId) return;

    setIsUploading(true);
    setFileError("");

    try {
      for (let i = 0; i < stagedFiles.length; i++) {
        const item = stagedFiles[i];
        const dataUrl = await readFileAsDataURL(item.file);
        const ext = item.name.split(".").pop() || "jpg";
        const isFirstImage = propertyImages.length === 0 && i === 0;

        await addImageMutation.mutateAsync({
          propertyId,
          imageData: {
            image_type_id: defaultTypeId,
            image_title: item.image_title,
            image_alt_text: item.image_alt_text,
            cdn_url: dataUrl,
            mime_type: item.type,
            file_extension: ext,
            file_size: item.size,
            image_order: propertyImages.length + i + 1,
            is_cover_image: isFirstImage,
            is_active: true,
          },
        });
      }

      // Cleanup staged previews after successful upload
      for (const item of stagedFiles) {
        if (item.previewUrl) URL.revokeObjectURL(item.previewUrl);
      }
      setStagedFiles([]);
    } catch (err) {
      const status = err?.response?.status;
      if (status === 413) {
        setFileError("Image is too large.");
      } else if (status === 415) {
        setFileError("Unsupported image format.");
      } else {
        setFileError(err?.response?.data?.message || "Unable to upload image. Please try again.");
      }
    } finally {
      setIsUploading(false);
    }
  };

  const handleSetPrimary = async (imageId) => {
    try {
      await updateImageMutation.mutateAsync({
        propertyId,
        imageId,
        payload: { is_cover_image: true },
      });
    } catch (err) {
      console.error("Failed to set primary image:", err);
    }
  };

  const handleUpdateImageDetails = async (imageId, field, value) => {
    try {
      await updateImageMutation.mutateAsync({
        propertyId,
        imageId,
        payload: { [field]: value },
      });
    } catch (err) {
      console.error("Failed to update image details:", err);
    }
  };

  const handleDeleteImage = async (imageId) => {
    try {
      await deleteImageMutation.mutateAsync({
        propertyId,
        imageId,
      });
    } catch (err) {
      console.error("Failed to delete image:", err);
    }
  };

  const handleMoveImage = async (index, direction) => {
    const targetIndex = direction === "left" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= propertyImages.length) return;

    const currentImg = propertyImages[index];
    const targetImg = propertyImages[targetIndex];

    try {
      await updateImageMutation.mutateAsync({
        propertyId,
        imageId: currentImg.image_id,
        payload: { image_order: targetImg.image_order || targetIndex + 1 },
      });
      await updateImageMutation.mutateAsync({
        propertyId,
        imageId: targetImg.image_id,
        payload: { image_order: currentImg.image_order || index + 1 },
      });
    } catch (err) {
      console.error("Failed to reorder images:", err);
    }
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (typeof onSubmit === "function") {
      onSubmit(propertyImages);
    }
  };

  const isLoading = imagesQuery.isLoading;

  return (
    <form onSubmit={handleFormSubmit} className="space-y-8" noValidate>
      {/* Header */}
      <section>
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-emerald-700">
            <ImageIcon className="h-5 w-5" />
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-emerald-700">
              Step 5
            </p>

            <h2 className="text-xl font-semibold text-slate-900">
              Photos
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Add photos of your property to help guests understand what to expect.
            </p>
          </div>
        </div>
      </section>

      {/* Server & Upload Error Alert */}
      {(serverError || fileError) && (
        <div
          className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700"
          role="alert"
        >
          {serverError || fileError}
        </div>
      )}

      {/* Drag & Drop Upload Zone */}
      <section className="space-y-4 border-t border-slate-200 pt-6">
        <label
          htmlFor={fileInputId}
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop}
          className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-300 bg-slate-50/50 px-6 py-10 text-center transition hover:border-emerald-500 hover:bg-emerald-50/30"
        >
          <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-emerald-50 text-emerald-700">
            <UploadCloud className="h-6 w-6" />
          </div>

          <p className="text-sm font-semibold text-slate-800">
            Drag and drop images here, or <span className="text-emerald-700 underline">click to browse</span>
          </p>

          <p className="mt-1 text-xs text-slate-500">
            Supported formats: JPG, JPEG, PNG, WEBP (Max 10MB per image)
          </p>

          <input
            id={fileInputId}
            type="file"
            multiple
            accept="image/jpeg,image/jpg,image/png,image/webp"
            onChange={(e) => e.target.files && handleFileSelect(e.target.files)}
            className="hidden"
          />
        </label>
      </section>

      {/* Staged Previews (Files selected for upload) */}
      {stagedFiles.length > 0 && (
        <section className="space-y-3 rounded-xl border border-slate-200 bg-slate-50/50 p-4">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <h3 className="text-sm font-semibold text-slate-900">
                Selected Photos to Upload ({stagedFiles.length})
              </h3>
              <p className="mt-1 text-xs text-slate-500">
                <strong>Tip:</strong> Add a descriptive Title and Alt Text before uploading. These help improve your property's SEO and accessibility.
              </p>
            </div>

            <button
              type="button"
              onClick={handleUploadStagedFiles}
              disabled={isUploading}
              className="inline-flex items-center gap-2 rounded-lg bg-emerald-700 px-4 py-2 text-xs font-semibold text-white transition hover:bg-emerald-800 disabled:opacity-60"
            >
              {isUploading ? "Uploading..." : `Upload ${stagedFiles.length} Photos`}
            </button>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {stagedFiles.map((item) => (
              <div
                key={item.id}
                className="group relative flex flex-col rounded-lg border border-slate-200 bg-white p-2 shadow-xs"
              >
                <div className="relative aspect-4/3 w-full overflow-hidden rounded-md bg-slate-100">
                  <img
                    src={item.previewUrl}
                    alt={item.name}
                    className="h-full w-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => removeStagedFile(item.id)}
                    className="absolute right-1.5 top-1.5 flex h-6 w-6 items-center justify-center rounded-full bg-slate-900/70 text-white transition hover:bg-red-600"
                    title="Remove selected photo"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>

                <div className="mt-2 min-w-0 flex flex-col gap-1.5">
                  <input
                    type="text"
                    value={item.image_title}
                    onChange={(e) => updateStagedFile(item.id, "image_title", e.target.value)}
                    placeholder="Image Title"
                    className="w-full rounded border border-slate-200 px-2 py-1 text-xs text-slate-800 placeholder:text-slate-400 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                  <input
                    type="text"
                    value={item.image_alt_text}
                    onChange={(e) => updateStagedFile(item.id, "image_alt_text", e.target.value)}
                    placeholder="Alt Text"
                    className="w-full rounded border border-slate-200 px-2 py-1 text-xs text-slate-800 placeholder:text-slate-400 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    {formatBytes(item.size)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Uploaded Property Gallery */}
      <section className="space-y-4 border-t border-slate-200 pt-6">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h3 className="text-base font-semibold text-slate-900">
              Property Photo Gallery ({propertyImages.length})
            </h3>
            <p className="mt-1 text-xs text-slate-500 max-w-2xl">
              Click the Title and Alt Text fields below any image to edit them. A good title might be <em>"Luxury Pool View"</em>, and alt text should describe the image for screen readers (e.g., <em>"Large infinity pool at sunset"</em>).
            </p>
          </div>

          {isLoading && (
            <span className="text-xs text-emerald-700">Loading gallery...</span>
          )}
        </div>

        {/* Loading Spinner */}
        {isLoading && (
          <div className="py-12 text-center">
            <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-slate-200 border-t-emerald-600" />
            <p className="mt-3 text-sm text-slate-500">Loading property photos...</p>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && propertyImages.length === 0 && stagedFiles.length === 0 && (
          <div className="rounded-xl border border-dashed border-slate-300 bg-white p-8 text-center">
            <ImageIcon className="mx-auto mb-2 h-8 w-8 text-slate-400" />
            <h4 className="text-base font-semibold text-slate-800">No property photos yet</h4>
            <p className="mx-auto mt-1 max-w-sm text-sm text-slate-500">
              Add photos to showcase your property to guests.
            </p>
          </div>
        )}

        {/* Uploaded Image Cards */}
        {!isLoading && propertyImages.length > 0 && (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {propertyImages.map((img, index) => {
              const isCover = Boolean(img.is_cover_image);

              return (
                <div
                  key={img.image_id || img.property_image_id || index}
                  className={[
                    "group relative flex flex-col rounded-xl border bg-white p-3 transition-shadow shadow-xs hover:shadow-md",
                    isCover ? "border-emerald-500 ring-2 ring-emerald-500/20" : "border-slate-200",
                  ].join(" ")}
                >
                  {/* Thumbnail */}
                  <div className="relative aspect-4/3 w-full overflow-hidden rounded-lg bg-slate-100">
                    <img
                      src={img.cdn_url}
                      alt={img.image_title || "Property photo"}
                      className="h-full w-full object-cover"
                    />

                    {/* Primary Badge */}
                    {isCover && (
                      <span className="absolute left-2 top-2 flex items-center gap-1 rounded-md bg-emerald-700 px-2 py-1 text-[11px] font-bold text-white shadow-xs">
                        <Star className="h-3 w-3 fill-white" />
                        PRIMARY
                      </span>
                    )}
                  </div>

                  {/* Info & Title */}
                  <div className="mt-3 flex-1 flex flex-col gap-1.5">
                    <input
                      type="text"
                      defaultValue={img.image_title || ""}
                      onBlur={(e) => {
                        if (e.target.value !== (img.image_title || "")) {
                          handleUpdateImageDetails(img.image_id, "image_title", e.target.value);
                        }
                      }}
                      placeholder={`Photo ${index + 1}`}
                      className="w-full rounded border border-transparent bg-slate-50 px-2 py-1 text-xs font-medium text-slate-800 placeholder:text-slate-400 hover:border-slate-200 focus:border-emerald-500 focus:bg-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
                    />
                    <input
                      type="text"
                      defaultValue={img.image_alt_text || ""}
                      onBlur={(e) => {
                        if (e.target.value !== (img.image_alt_text || "")) {
                          handleUpdateImageDetails(img.image_id, "image_alt_text", e.target.value);
                        }
                      }}
                      placeholder="Alt text"
                      className="w-full rounded border border-transparent bg-slate-50 px-2 py-1 text-xs text-slate-800 placeholder:text-slate-400 hover:border-slate-200 focus:border-emerald-500 focus:bg-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
                    />
                    <p className="px-2 text-[11px] text-slate-400">
                      {img.image_type_name || "Gallery Photo"}
                    </p>
                  </div>

                  {/* Actions Bar */}
                  <div className="mt-3 flex items-center justify-between border-t border-slate-100 pt-2.5">
                    {/* Reorder Buttons */}
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => handleMoveImage(index, "left")}
                        disabled={index === 0 || updateImageMutation.isPending}
                        className="rounded-md border border-slate-200 p-1 text-slate-600 transition hover:bg-slate-100 disabled:opacity-30"
                        title="Move left"
                      >
                        <ChevronLeft className="h-3.5 w-3.5" />
                      </button>

                      <button
                        type="button"
                        onClick={() => handleMoveImage(index, "right")}
                        disabled={index === propertyImages.length - 1 || updateImageMutation.isPending}
                        className="rounded-md border border-slate-200 p-1 text-slate-600 transition hover:bg-slate-100 disabled:opacity-30"
                        title="Move right"
                      >
                        <ChevronRight className="h-3.5 w-3.5" />
                      </button>
                    </div>

                    {/* Primary Toggle & Delete Actions */}
                    <div className="flex items-center gap-2">
                      {!isCover && (
                        <button
                          type="button"
                          onClick={() => handleSetPrimary(img.image_id)}
                          disabled={updateImageMutation.isPending}
                          className="text-xs font-medium text-emerald-700 hover:underline"
                        >
                          Set as primary
                        </button>
                      )}

                      <button
                        type="button"
                        onClick={() => handleDeleteImage(img.image_id)}
                        disabled={deleteImageMutation.isPending}
                        className="rounded-md p-1 text-slate-400 transition hover:bg-red-50 hover:text-red-600"
                        title="Delete photo"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* Bottom Actions */}
      <div className="flex items-center justify-between border-t border-slate-200 pt-6">
        <div>
          {typeof onBack === "function" && (
            <button
              type="button"
              onClick={onBack}
              disabled={isSubmitting || isUploading}
              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </button>
          )}
        </div>

        <button
          type="submit"
          disabled={isSubmitting || isUploading}
          className="inline-flex items-center gap-2 rounded-lg bg-emerald-700 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting
            ? "Saving..."
            : isEditingFromReview
            ? "Save Changes"
            : "Save & Continue"}
          {!isSubmitting && <ChevronRight className="h-4 w-4" />}
        </button>
      </div>
    </form>
  );
}

export default PhotosStep;
