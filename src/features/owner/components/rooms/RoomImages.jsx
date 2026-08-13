import { useState } from "react";
import { Loader2, Plus, Trash2, Image as ImageIcon } from "lucide-react";

import Button from "../../../../components/ui/Button/Button.jsx";
import { 
  useRoomImages, 
  useUploadRoomImage, 
  useDeleteRoomImage, 
} from "../../hooks/useRooms.js";

function RoomImages({ roomId }) {
  const { data: imagesData, isLoading: isLoadingImages } = useRoomImages(roomId);
  
  const { mutateAsync: uploadImage, isPending: isUploading } = useUploadRoomImage();
  const { mutateAsync: deleteImage, isPending: isDeleting } = useDeleteRoomImage();

  const [errorMsg, setErrorMsg] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const images = imagesData?.data || [];

  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setErrorMsg("Please select an image file.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) { // 5MB limit
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
    // Hardcode image type to a default room image type if needed, or backend handles it.
    formData.append("room_image_type_id", "1"); // Example: 1 = Main Image, etc.
    formData.append("is_primary", images.length === 0 ? "true" : "false"); // Make first image primary

    try {
      setErrorMsg("");
      await uploadImage({ roomId, formData });
      setSelectedFile(null);
      setImagePreview(null);
    } catch (error) {
      setErrorMsg(error.response?.data?.message || "Failed to upload image.");
    }
  };

  const handleDelete = async (imageId) => {
    try {
      await deleteImage({ roomId, imageId });
    } catch (error) {
      console.error("Failed to delete image", error);
    }
  };

  if (isLoadingImages) {
    return (
      <div className="flex h-32 items-center justify-center">
        <Loader2 className="h-6 w-6 text-emerald-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">Room Images</h2>
          <p className="text-sm text-slate-500">Upload photos of this room.</p>
        </div>
      </div>

      {errorMsg && (
        <div className="rounded-md bg-red-50 p-4 border border-red-200">
          <p className="text-sm text-red-700">{errorMsg}</p>
        </div>
      )}

      {/* Upload Area */}
      <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
        <div className="flex flex-col sm:flex-row gap-4 items-center">
          <div className="w-full flex-1">
            <label 
              htmlFor="room-image-upload" 
              className={`flex w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed ${selectedFile ? 'border-emerald-500 bg-emerald-50' : 'border-slate-300 bg-white hover:bg-slate-50'} py-6`}
            >
              <div className="flex flex-col items-center justify-center pb-2 pt-1 text-center">
                <ImageIcon className="mb-2 h-8 w-8 text-slate-400" />
                <p className="text-sm text-slate-500">
                  <span className="font-semibold text-emerald-600">Click to upload</span> or drag and drop
                </p>
                <p className="text-xs text-slate-400 mt-1">SVG, PNG, JPG or GIF (MAX. 5MB)</p>
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
            <div className="flex flex-col gap-3 w-full sm:w-48 shrink-0">
              <div className="relative aspect-video w-full overflow-hidden rounded-md border border-slate-200">
                <img src={imagePreview} alt="Preview" className="h-full w-full object-cover" />
              </div>
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  onClick={() => { setSelectedFile(null); setImagePreview(null); }}
                  disabled={isUploading}
                  className="flex-1 bg-white text-xs py-1"
                >
                  Cancel
                </Button>
                <Button 
                  onClick={handleUpload}
                  disabled={isUploading}
                  className="flex-1 bg-emerald-700 text-white hover:bg-emerald-800 text-xs py-1"
                >
                  {isUploading ? <Loader2 className="h-3 w-3 animate-spin" /> : 'Upload'}
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Image Grid */}
      {images.length > 0 ? (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {images.map((image) => (
            <div 
              key={image.room_image_id} 
              className="group relative aspect-square overflow-hidden rounded-lg border border-slate-200 bg-slate-100"
            >
              <img 
                src={image.image_url} 
                alt={image.caption || "Room Image"} 
                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
              
              {image.is_primary && (
                <div className="absolute left-2 top-2 rounded-md bg-emerald-600 px-2 py-1 text-xs font-medium text-white shadow-sm">
                  Primary
                </div>
              )}
              
              <div className="absolute inset-0 bg-black/40 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                <div className="absolute right-2 top-2 flex gap-1">
                  <button
                    onClick={() => handleDelete(image.room_image_id)}
                    disabled={isDeleting}
                    className="rounded-md bg-red-600 p-1.5 text-white shadow-sm hover:bg-red-700 disabled:opacity-50"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="rounded-lg border border-slate-200 border-dashed p-8 text-center text-slate-500">
          No images uploaded for this room yet.
        </div>
      )}
    </div>
  );
}

export default RoomImages;
