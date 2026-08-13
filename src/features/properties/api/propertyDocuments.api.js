import apiClient from "../../../services/apiClient.js";
import { API_ENDPOINTS } from "../../../services/apiEndpoints.js";

export const getPropertyDocuments = async (propertyId) => {
  const response = await apiClient.get(
    API_ENDPOINTS.PROPERTIES.DOCUMENTS(propertyId)
  );
  return response.data;
};

export const uploadPropertyDocument = async (propertyId, documentData) => {
  const response = await apiClient.post(
    API_ENDPOINTS.PROPERTIES.DOCUMENTS(propertyId),
    documentData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
  return response.data;
};

export const deletePropertyDocument = async (propertyId, documentId) => {
  const response = await apiClient.delete(
    API_ENDPOINTS.PROPERTIES.DOCUMENT_DETAIL(propertyId, documentId)
  );
  return response.data;
};

export const getDocumentTypesLookup = async () => {
  const response = await apiClient.get(API_ENDPOINTS.LOOKUPS.DOCUMENT_TYPES);
  return response.data;
};
