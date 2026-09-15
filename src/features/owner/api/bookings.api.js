import apiClient from "../../../services/apiClient";
import { API_ENDPOINTS } from "../../../services/apiEndpoints";

export const ownerBookingsApi = {
    /**
     * Fetch bookings associated with the owner
     * @param {Object} params - Query parameters (search, status, page, limit)
     */
    getBookings: async (params = {}) => {
        const response = await apiClient.get(API_ENDPOINTS.BOOKINGS.LIST, { params });
        return response.data;
    },

    /**
     * Update the status of a specific booking
     */
    updateBookingStatus: async (id, status) => {
        const response = await apiClient.put(API_ENDPOINTS.BOOKINGS.STATUS(id), { status });
        return response.data;
    }
};
