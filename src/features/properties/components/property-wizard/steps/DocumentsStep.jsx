import { useId, useMemo, useState } from "react";
import {
  AlertCircle,
  ArrowLeft,
  CheckCircle2,
  ChevronRight,
  Clock,
  FileCheck,
  FileText,
  Trash2,
  UploadCloud,
  X,
} from "lucide-react";

import {
  useDeletePropertyDocument,
  useDocumentTypes,
  usePropertyDocuments,
  useUploadPropertyDocument,
} from "../../../hooks/usePropertyDocuments.js";

const DEFAULT_DOCUMENT_TYPES = [
  { document_type_id: 1, document_name: "Property Registration Certificate" },
  { document_type_id: 2, document_name: "Owner Identity Proof (Aadhaar / PAN)" },
  { document_type_id: 3, document_name: "GST Registration Certificate" },
  { document_type_id: 4, document_name: "Trade License / FSSAI License" },
  { document_type_id: 5, document_name: "Property Tax Receipt / Utility Bill" },
];

const ACCEPTED_TYPES = [
  "application/pdf",
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

function formatBytes(bytes) {
  if (!bytes || bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
}

// Read file as Data URL base64 string
function readFileAsDataURL(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = (err) => reject(err);
    reader.readAsDataURL(file);
  });
}

function StatusBadge({ status }) {
  const s = (status || "Pending").toLowerCase();
  if (s === "verified") {
    return (
      <span className="inline-flex items-center gap-1 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-0.5 text-xs font-semibold text-emerald-700">
        <CheckCircle2 className="h-3.5 w-3.5" />
        Verified
      </span>
    );
  }
  if (s === "rejected") {
    return (
      <span className="inline-flex items-center gap-1 rounded-full border border-red-200 bg-red-50 px-2.5 py-0.5 text-xs font-semibold text-red-700">
        <AlertCircle className="h-3.5 w-3.5" />
        Rejected
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 rounded-full border border-amber-200 bg-amber-50 px-2.5 py-0.5 text-xs font-semibold text-amber-700">
      <Clock className="h-3.5 w-3.5" />
      {status || "Pending Review"}
    </span>
  );
}

function DocumentsStep({
  propertyId,
  onSubmit,
  onBack,
  isEditingFromReview = false,
  isSubmitting = false,
  serverError = "",
}) {
  const fileInputId = useId();
  const [selectedTypeId, setSelectedTypeId] = useState("1");
  const [documentNumber, setDocumentNumber] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileError, setFileError] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [deletingDocId, setDeletingDocId] = useState(null);

  // Document types master lookup
  const docTypesQuery = useDocumentTypes();
  const docTypes =
    docTypesQuery.data?.data && docTypesQuery.data.data.length > 0
      ? docTypesQuery.data.data
      : DEFAULT_DOCUMENT_TYPES;

  // Property documents query
  const documentsQuery = usePropertyDocuments(propertyId);
  const documents = useMemo(
    () => (Array.isArray(documentsQuery.data?.data) ? documentsQuery.data.data : []),
    [documentsQuery.data]
  );

  // Mutations
  const uploadDocMutation = useUploadPropertyDocument(propertyId);
  const deleteDocMutation = useDeletePropertyDocument(propertyId);

  const handleFileSelect = (file) => {
    setFileError("");
    if (!file) return;

    if (!ACCEPTED_TYPES.includes(file.type.toLowerCase())) {
      setFileError("Unsupported file format. Please upload PDF, JPG, PNG, or WEBP files.");
      return;
    }
    if (file.size > MAX_FILE_SIZE) {
      setFileError(`"${file.name}" is too large. Maximum size is 10MB.`);
      return;
    }

    setSelectedFile(file);
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!selectedFile || !propertyId) {
      setFileError("Please select a document file to upload.");
      return;
    }

    setIsUploading(true);
    setFileError("");

    try {
      const dataUrl = await readFileAsDataURL(selectedFile);
      const ext = selectedFile.name.split(".").pop() || "pdf";
      const selectedType = docTypes.find(
        (t) => String(t.document_type_id) === String(selectedTypeId)
      );

      await uploadDocMutation.mutateAsync({
        propertyId,
        documentData: {
          document_type_id: Number(selectedTypeId),
          document_number: documentNumber.trim() || undefined,
          document_title: selectedType?.document_name || selectedFile.name,
          original_file_name: selectedFile.name,
          stored_file_name: `${Date.now()}-${selectedFile.name}`,
          file_extension: ext,
          mime_type: selectedFile.type,
          file_size: selectedFile.size,
          cdn_url: dataUrl,
          verification_status: "Pending",
        },
      });

      // Clear upload form after success
      setSelectedFile(null);
      setDocumentNumber("");
    } catch (err) {
      const status = err?.response?.status;
      if (status === 413) {
        setFileError("File is too large.");
      } else if (status === 415) {
        setFileError("Unsupported file format.");
      } else {
        setFileError(
          err?.response?.data?.message || "Unable to upload the document. Please try again."
        );
      }
    } finally {
      setIsUploading(false);
    }
  };

  const confirmDeleteDocument = async () => {
    if (!deletingDocId) return;

    try {
      await deleteDocMutation.mutateAsync({
        propertyId,
        documentId: deletingDocId,
      });
      setDeletingDocId(null);
    } catch (err) {
      console.error("Failed to delete document:", err);
    }
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (typeof onSubmit === "function") {
      onSubmit(documents);
    }
  };

  const isLoading = documentsQuery.isLoading;

  return (
    <form onSubmit={handleFormSubmit} className="space-y-8" noValidate>
      {/* Header */}
      <section>
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-emerald-700">
            <FileCheck className="h-5 w-5" />
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-emerald-700">
              Step 7
            </p>

            <h2 className="text-xl font-semibold text-slate-900">
              Documents
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Upload the required documents for property verification.
            </p>
          </div>
        </div>
      </section>

      {/* Server & Upload Errors */}
      {(serverError || fileError) && (
        <div
          className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700"
          role="alert"
        >
          {serverError || fileError}
        </div>
      )}

      {/* Upload Document Form Card */}
      <section className="space-y-5 rounded-xl border border-slate-200 bg-slate-50/50 p-5 sm:p-6">
        <h3 className="text-base font-semibold text-slate-900">
          Upload New Document
        </h3>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          {/* Document Type Selector */}
          <div>
            <label htmlFor="document_type_id" className="mb-2 block text-sm font-medium text-slate-700">
              Document Type <span className="text-red-500">*</span>
            </label>
            <select
              id="document_type_id"
              value={selectedTypeId}
              onChange={(e) => setSelectedTypeId(e.target.value)}
              className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
            >
              {docTypes.map((type) => (
                <option key={type.document_type_id} value={type.document_type_id}>
                  {type.document_name}
                </option>
              ))}
            </select>
          </div>

          {/* Document / License Number */}
          <div>
            <label htmlFor="document_number" className="mb-2 block text-sm font-medium text-slate-700">
              Document / Registration Number (Optional)
            </label>
            <input
              id="document_number"
              type="text"
              placeholder="e.g. GSTIN, License No, PAN"
              value={documentNumber}
              onChange={(e) => setDocumentNumber(e.target.value)}
              className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
            />
          </div>
        </div>

        {/* Dropzone / File Picker */}
        <div>
          <label
            htmlFor={fileInputId}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              e.preventDefault();
              if (e.dataTransfer.files?.[0]) handleFileSelect(e.dataTransfer.files[0]);
            }}
            className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-300 bg-white px-6 py-8 text-center transition hover:border-emerald-500 hover:bg-emerald-50/20"
          >
            <UploadCloud className="mb-2 h-8 w-8 text-emerald-700" />
            <p className="text-sm font-medium text-slate-800">
              {selectedFile ? (
                <span className="font-semibold text-emerald-700">{selectedFile.name} ({formatBytes(selectedFile.size)})</span>
              ) : (
                <>Drag and drop file here, or <span className="text-emerald-700 underline">click to browse</span></>
              )}
            </p>
            <p className="mt-1 text-xs text-slate-400">
              Supported formats: PDF, JPG, PNG, WEBP (Max 10MB)
            </p>

            <input
              id={fileInputId}
              type="file"
              accept=".pdf,.jpg,.jpeg,.png,.webp,application/pdf,image/*"
              onChange={(e) => e.target.files?.[0] && handleFileSelect(e.target.files[0])}
              className="hidden"
            />
          </label>
        </div>

        {/* Upload Action Button */}
        {selectedFile && (
          <div className="flex justify-end pt-2">
            <button
              type="button"
              onClick={handleUpload}
              disabled={isUploading}
              className="inline-flex items-center gap-2 rounded-lg bg-emerald-700 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-800 disabled:opacity-60"
            >
              {isUploading ? "Uploading..." : "Upload Document"}
            </button>
          </div>
        )}
      </section>

      {/* Uploaded Documents Gallery */}
      <section className="space-y-4 border-t border-slate-200 pt-6">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-semibold text-slate-900">
            Uploaded Property Documents ({documents.length})
          </h3>

          {isLoading && <span className="text-xs text-emerald-700">Loading documents...</span>}
        </div>

        {/* Loading Spinner */}
        {isLoading && (
          <div className="py-12 text-center">
            <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-slate-200 border-t-emerald-600" />
            <p className="mt-3 text-sm text-slate-500">Loading documents...</p>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && documents.length === 0 && (
          <div className="rounded-xl border border-dashed border-slate-300 bg-white p-8 text-center">
            <FileText className="mx-auto mb-2 h-8 w-8 text-slate-400" />
            <h4 className="text-base font-semibold text-slate-800">No documents uploaded yet</h4>
            <p className="mx-auto mt-1 max-w-sm text-sm text-slate-500">
              Upload required verification documents to proceed.
            </p>
          </div>
        )}

        {/* Documents Table / Cards */}
        {!isLoading && documents.length > 0 && (
          <div className="space-y-3">
            {documents.map((doc, idx) => (
              <div
                key={doc.document_id || doc.property_document_id || idx}
                className="flex flex-col gap-4 rounded-xl border border-slate-200 bg-white p-4 shadow-xs transition hover:border-slate-300 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="flex items-start gap-3 min-w-0">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-600">
                    <FileText className="h-5 w-5" />
                  </div>

                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="truncate text-sm font-semibold text-slate-900">
                        {doc.document_name || doc.document_title || "Property Document"}
                      </p>
                      <StatusBadge status={doc.verification_status} />
                    </div>

                    <p className="mt-1 truncate text-xs text-slate-500">
                      File: <span className="font-medium text-slate-700">{doc.original_file_name}</span>
                      {doc.document_number && ` • Reg No: ${doc.document_number}`}
                      {doc.file_size && ` • ${formatBytes(doc.file_size)}`}
                    </p>

                    {doc.rejection_reason && (
                      <p className="mt-1.5 text-xs text-red-600 font-medium">
                        Rejection reason: {doc.rejection_reason}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0 self-end sm:self-center">
                  <button
                    type="button"
                    onClick={() => setDeletingDocId(doc.document_id)}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:border-red-300 hover:bg-red-50 hover:text-red-600"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Delete Confirmation Modal */}
      {deletingDocId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-semibold text-slate-900">
                Delete Document?
              </h3>
              <button
                type="button"
                onClick={() => setDeletingDocId(null)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <p className="text-sm text-slate-600">
              Are you sure you want to remove this document? This action cannot be undone.
            </p>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setDeletingDocId(null)}
                className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmDeleteDocument}
                disabled={deleteDocMutation.isPending}
                className="rounded-lg bg-red-600 px-4 py-2 text-xs font-semibold text-white transition hover:bg-red-700 disabled:opacity-60"
              >
                {deleteDocMutation.isPending ? "Deleting..." : "Delete Document"}
              </button>
            </div>
          </div>
        </div>
      )}

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

export default DocumentsStep;
