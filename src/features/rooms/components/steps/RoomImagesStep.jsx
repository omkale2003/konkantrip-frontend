import { useState } from "react";
import { Image as ImageIcon, Upload, Trash2, Star, Loader2 } from "lucide-react";
import {
  useRoomImages,
  useUploadRoomImage,
  useUpdateRoomImage,
  useDeleteRoomImage,
  useRoomLookups,
} from "../../hooks/useRooms.js";
import { getImageUrl, handleImageError, DEFAULT_ROOM_IMAGE } from "../../../../utils/imageUrl.js";

function RoomImagesStep({ roomId, onSubmitNext }) {
  const { data: imagesData, isLoading: isLoadingImages } = useRoomImages(roomId);
  const { data: imageTypesData } = useRoomLookups("ROOM_IMAGE_TYPES");

  const { mutateAsync: uploadImage, isPending: isUploading } = useUploadRoomImage();
  const { mutateAsync: updateImage, isPending: isUpdating } = useUpdateRoomImage();
  const { mutateAsync: deleteImage, isPending: isDeleting } = useDeleteRoomImage();

  const [selectedFile, setSelectedFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [imageTypeId, setImageTypeId] = useState("");
  const [imageTitle, setImageTitle] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const images = imagesData?.data || [];
  const imageTypes = imageTypesData?.data || [];

  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setErrorMsg("Please select a valid image file.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setErrorMsg("Image size must be less than 5MB.");
      return;
    }

    setSelectedFile(file);
    setImagePreview(URL.createObjectURL(file));
    setErrorMsg("");
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    const formData = new FormData();
    formData.append("file", selectedFile);
    if (imageTypeId) {
      formData.append("room_image_type_id", imageTypeId);
    }
    if (imageTitle) {
      formData.append("image_title", imageTitle);
    }
    formData.append("is_primary", images.length === 0 ? "true" : "false");
    formData.append("is_cover_image", images.length === 0 ? "true" : "false");

    try {
      setErrorMsg("");
      await uploadImage({ roomId, formData });
      setSelectedFile(null);
      setImagePreview(null);
      setImageTitle("");
    } catch (err) {
      setErrorMsg(err.response?.data?.message || "Failed to upload image.");
    }
  };

  const handleSetCover = async (image) => {
    try {
      await updateImage({
        roomId,
        imageId: image.room_image_id,
        data: { is_cover_image: true, is_primary: true },
      });
    } catch (err) {
      console.error("Failed to set cover image", err);
    }
  };

  const handleDeleteImage = async (imageId) => {
    try {
      await deleteImage({ roomId, imageId });
    } catch (err) {
      console.error("Failed to delete image", err);
    }
  };

  if (isLoadingImages) {
    return (
      <div className="flex h-48 items-center justify-center">
        <Loader2 className="h-7 w-7 text-emerald-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Hidden dummy form for stepper trigger */}
      <form id="room-step-form" onSubmit={(e) => { e.preventDefault(); onSubmitNext(); }}>
        <button type="submit" className="hidden" />
      </form>

      {/* Header */}
      <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
          <ImageIcon className="h-5 w-5" />
        </div>
        <div>
          <h2 className="text-base font-bold text-slate-900">Room Images</h2>
          <p className="text-xs text-slate-500">Upload and manage photos of this room</p>
        </div>
      </div>

      {errorMsg && (
        <div className="rounded-lg bg-red-50 p-3.5 border border-red-200 text-xs text-red-700">
          {errorMsg}
        </div>
      )}

      {/* Upload Dropzone & Controls */}
      <div className="rounded-xl border border-slate-200 bg-slate-50/50 p-4 space-y-4">
        <div className="flex flex-col sm:flex-row gap-4 items-center">
          <div className="w-full flex-1">
            <label
              htmlFor="room-image-upload"
              className={`flex w-full cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed ${
                selectedFile
                  ? "border-emerald-500 bg-emerald-50/50"
                  : "border-slate-300 bg-white hover:bg-slate-50"
              } py-6 transition-all`}
            >
              <div className="flex flex-col items-center justify-center text-center">
                <Upload className="mb-2 h-8 w-8 text-slate-400" />
                <p className="text-xs font-semibold text-slate-700">
                  <span className="text-emerald-700">Click to upload</span> or drag and drop
                </p>
                <p className="text-[11px] text-slate-400 mt-1">PNG, JPG, WEBP (MAX. 5MB)</p>
              </div>
              <input
                id="room-image-upload"
                type="file"
                className="hidden"
                accept="image/*"
                onChange={handleFileSelect}
                disabled={isUploading}
              />
            </label>
          </div>

          {selectedFile && (
            <div className="flex flex-col gap-3 w-full sm:w-56 shrink-0 bg-white p-3 rounded-xl border border-slate-200 shadow-sm">
              <div className="relative aspect-video w-full overflow-hidden rounded-lg border border-slate-200 bg-slate-100">
                <img src={imagePreview} alt="Preview" className="h-full w-full object-cover" />
              </div>

              <div className="space-y-2">
                <select
                  value={imageTypeId}
                  onChange={(e) => setImageTypeId(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 py-1.5 px-2.5 text-xs text-slate-800 focus:border-emerald-500 focus:outline-none"
                >
                  <option value="">Image Category</option>
                  {imageTypes.map((t) => (
                    <option key={t.room_image_type_id} value={t.room_image_type_id.toString()}>
                      {t.image_type_name}
                    </option>
                  ))}
                </select>

                <input
                  type="text"
                  value={imageTitle}
                  onChange={(e) => setImageTitle(e.target.value)}
                  placeholder="Image Title / Caption"
                  className="w-full rounded-lg border border-slate-300 py-1.5 px-2.5 text-xs text-slate-800 focus:border-emerald-500 focus:outline-none"
                />

                <div className="flex gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedFile(null);
                      setImagePreview(null);
                    }}
                    disabled={isUploading}
                    className="flex-1 rounded-lg border border-slate-300 bg-white py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleUpload}
                    disabled={isUploading}
                    className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-lg bg-emerald-700 py-1.5 text-xs font-semibold text-white hover:bg-emerald-800 disabled:opacity-50"
                  >
                    {isUploading ? <Loader2 className="h-3 w-3 animate-spin" /> : "Upload"}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Uploaded Images Grid */}
      {images.length > 0 ? (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {images.map((image) => (
            <div
              key={image.room_image_id}
              className="group relative aspect-square overflow-hidden rounded-xl border border-slate-200 bg-slate-100 shadow-sm"
            >
              <img
                src={getImageUrl(image, DEFAULT_ROOM_IMAGE)}
                alt={image.image_title || "Room Image"}
                onError={(e) => handleImageError(e, DEFAULT_ROOM_IMAGE)}
                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
              />

              {image.is_cover_image || image.is_primary ? (
                <div className="absolute left-2.5 top-2.5 inline-flex items-center gap-1 rounded-md bg-emerald-700 px-2 py-0.5 text-[10px] font-bold text-white shadow-sm">
                  <Star className="h-3 w-3 fill-current" /> Cover Image
                </div>
              ) : null}

              <div className="absolute inset-0 bg-black/40 opacity-0 transition-opacity duration-200 group-hover:opacity-100 flex items-center justify-center gap-2">
                {!image.is_cover_image && (
                  <button
                    type="button"
                    onClick={() => handleSetCover(image)}
                    disabled={isUpdating}
                    className="rounded-lg bg-white/90 p-2 text-xs font-semibold text-slate-900 shadow hover:bg-white transition-colors"
                    title="Set as Cover"
                  >
                    <Star className="h-4 w-4 text-amber-500" />
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => handleDeleteImage(image.room_image_id)}
                  disabled={isDeleting}
                  className="rounded-lg bg-red-600 p-2 text-white shadow hover:bg-red-700 transition-colors disabled:opacity-50"
                  title="Delete Image"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="rounded-xl border border-dashed border-slate-300 p-8 text-center bg-slate-50/50">
          <ImageIcon className="mx-auto h-8 w-8 text-slate-400" />
          <h4 className="mt-2 text-sm font-bold text-slate-900">No Images Uploaded</h4>
          <p className="mt-1 text-xs text-slate-500">Upload photos of this room to attract bookings.</p>
        </div>
      )}
    </div>
  );
}

export default RoomImagesStep;
