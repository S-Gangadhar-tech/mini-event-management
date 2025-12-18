import apiClient from "../api/apiClient";

const EventService = {
    getAll: () => apiClient.get("/events"),
    getUpcoming: () => apiClient.get("/events/upcoming"),
    getMyEvents: () => apiClient.get("/events/my-events"),

    // Fetch single event by ID for Edit Page
    getById: (id) => apiClient.get(`/events/${id}`),

    create: (data) => apiClient.post("/events", data),

    // Update using ID in URL and FormData for image handling
    update: (id, data) => apiClient.put(`/events/${id}`, data),

    delete: (id) => apiClient.delete(`/events/${id}`),

    join: (id) => apiClient.post(`/events/${id}/join`),
    leave: (id) => apiClient.post(`/events/${id}/leave`),
};

export default EventService;