import apiClient from "../../../services/apiClient";
import { API_ENDPOINTS } from "../../../services/apiEndpoints";

export const ownerEnquiriesApi = {
    /**
     * Fetch enquiries associated with the owner
     * @param {Object} params - Query parameters (search, status, page, limit)
     */
    getEnquiries: async (params = {}) => {
        const response = await apiClient.get(API_ENDPOINTS.ENQUIRIES.LIST, { params });
        return response.data;
    },

    /**
     * Update the status/notes of a specific enquiry
     */
    updateEnquiryStatus: async (id, data) => {
        // data: { status, notes }
        const response = await apiClient.put(API_ENDPOINTS.ENQUIRIES.STATUS(id), data);
        return response.data;
    }
};
