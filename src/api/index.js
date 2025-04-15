import axios from "./axios";

const API_BASE_URL = 'http://127.0.0.1:8000/api';

{/* User display section */}
export const getBlogList = () => {
    return axios.request({
        url: "/blog",
        method: "get",
    });
};

export const getToken = (userData) => {
    return axios.request({
        url: "/customUser/token/",
        method: "post",
        data: userData,
    });
};

export const getMe = () => {
    return axios.request({
        url: "/customUser/me/",
        method: "get",
    });
};

export const createUser = (userData) => {
    return axios.request({
        url: "/customUser/create/",
        method: "post",
        data: userData,
    });
};

{/* Accommodation display section */}
export const getAccommodations = () => {
    return axios.request({
        url: '/accommodation/accommodations/',
        method: 'get'
    });
};

export const getAccommodationById = (id) => {
    return axios.request({
        url: `/accommodation/accommodations/${id}/`,
        method: 'get'
    });
};

export const getRoomType = () => {
    return axios.request({
        url: '/accommodation/room-types/',
        method: 'get'
    });
};

export const getGuestService = () => {
    return axios.request({
        url: '/accommodation/guest-services/',
        method: 'get'
    });
};

export const postRoomBooking = (data) => {
    return axios.request({
        url: '/accommodation/room-bookings/',
        method: 'post',
        data
    });
};

export const postFeedbackReview = (data) => {
    return axios.request({
        url: '/accommodation/feedback-reviews/',
        method: 'post',
        data
    });
};

// Get accommodation feedback
export const getAccommodationFeedback = (id) => {
    return axios.request({
        url: `/accommodation/feedback-reviews/accommodation/${id}/`,
        method: "get"
    });
};

// Delete booking
export const deleteRoomBooking = (id) => {
    return axios.request({
        url: `/accommodation/room-bookings/${id}/`,
        method: "delete"
    });
};

// Delete room type
export const deleteRoomType = (id) => {
    return axios.request({
        url: `/accommodation/room-types/${id}/`,
        method: "delete"
    });
};

// Delete feedback
export const deleteFeedback = (id) => {
    return axios.request({
        url: `/accommodation/feedback-reviews/${id}/`,
        method: "delete"
    });
};

// Get room types for specific accommodation
export const getAccommodationRoomTypes = (id) => {
    return axios.request({
        url: `/accommodation/room-types/?accommodation_id=${id}`,
        method: "get"
    });
};

{/* Event display section */}
export const getEvents = () => {
    return axios.request({
        url: "/event-organizers/event/",
        method: "get",
    });
};

export const postEvents = (EventData) => {
    return axios.request({
        url: "/event-organizers/event/",
        method: "post",
        data: EventData,
    });
};

export const getEventById = (id) => {
    return axios.request({
        url: `/event-organizers/event/${id}/`,
        method: "get",
    });
};

export const getEventPromotion = () => {
    return axios.request({
        url: "/event-organizers/event-promotion/",
        method: "get",
    });
};

export const getEventNotification = () => {
    return axios.request({
        url: "/tourism-info/event-notifications/",
        method: "get",
    });
};

export const postVenueBooking = (VenueData) => {
    return axios.request({
        url: "/event-organizers/venue-booking/",
        method: "post",
        data: VenueData
    });
};

export const calculateVenueBookingPrice = (data) => {
    return axios.request({
        url: "/event-organizers/venue-booking/calculate-price/",
        method: "post",
        data
    });
};

export const deleteEvent = (id) => {
    return axios.request({
        url: `/event-organizers/event/${id}/`,
        method: "delete"
    });
};

export const cancelVenueBooking = (bookingId) => {
    return axios.request({
        url: `/event-organizers/venue-booking/${bookingId}/`,
        method: "delete"
    });
};

// Get user venue bookings
export const getUserVenueBookings = (eventId) => {
    return axios.request({
        url: `/event-organizers/venue-booking/?event_id=${eventId}`,
        method: "get"
    });
};

{/* TourismInfo display section */}
// Get destinations information
export const getDestinations = () => {
    return axios.request({
        url: '/information-center/destinations/',
        method: 'get'
    });
};

export const getDestinationById = (id) => {
    return axios.request({
        url: `/information-center/destinations/${id}/`,
        method: 'get'
    });
};

// Get tour information
export const getTours = () => {
    return axios.request({
        url: '/information-center/tours/',
        method: 'get'
    });
};

export const getTourById = (id) => {
    return axios.request({
        url: `/information-center/tours/${id}/`,
        method: 'get'
    });
};

// Create tour booking
export const postTourBooking = (data) => {
    return axios.request({
        url: '/information-center/tour-bookings/',
        method: 'post',
        data
    });
};

// Delete tour booking
export const deleteTourBooking = (id) => {
    return axios.request({
        url: `/information-center/tour-bookings/${id}/`,
        method: 'delete'
    });
};

// Get event notifications
export const getEventNotifications = () => {
    return axios.request({
        url: '/information-center/event-notifications/',
        method: 'get'
    });
};

// Get user tour booking list
export const getUserTourBookings = () => {
    return axios.request({
        url: '/information-center/tour-bookings/',
        method: 'get'
    });
};

{/* Restaurant display section */}
export const getRestaurants = () => {
    return axios.request({
        url: '/restaurant/restaurants/',
        method: 'get'
    });
};

export const getRestaurantById = (id) => {
    return axios.request({
        url: `/restaurant/restaurants/${id}/`,
        method: 'get'
    });
};

export const getRestaurantMenus = (restaurantId) => {
    return axios.request({
        url: `/restaurant/menus/?restaurant=${restaurantId}`,
        method: 'get'
    });
};

export const getRestaurantMenuById = (id) => {
    return axios.request({
        url: `/restaurant/menus/${id}/`,
        method: 'get'
    });
};

export const getOnlineOrders = () => {
    return axios.request({
        url: '/restaurant/online-orders/',
        method: 'get'
    });
};

export const deleteOnlineOrder = (id) => {
    return axios.request({
        url: `/restaurant/online-orders/${id}/`,
        method: 'delete'
    });
};

// Get table reservations
export const getTableReservations = () => {
    return axios.request({
        url: '/restaurant/table-reservations/',
        method: 'get'
    });
};

// Delete table reservation
export const deleteTableReservation = (id) => {
    return axios.request({
        url: `/restaurant/table-reservations/${id}/`,
        method: 'delete'
    });
};

// Create table reservation
export const postTableReservation = (data) => {
    return axios.request({
        url: '/restaurant/table-reservations/',
        method: 'post',
        data
    });
};

{/* Transport display section */}
// Get transportation service provider list
export const getTransportation = () => {
    return axios.request({
        url: "/local-transportation/transportation-provider/",
        method: "get",
    });
};

// Get specific transportation service provider
export const getProviderById = (id) => {
    return axios.request({
        url: `/local-transportation/transportation-provider/${id}/`,
        method: "get",
    });
};

// Get traffic updates
export const getTrafficUpdate = () => {
    return axios.request({
        url: "/local-transportation/traffic-update/",
        method: "get",
    });
};

// Get route planning
export const getRoutePlan = () => {
    return axios.request({
        url: "/local-transportation/route-planning/",
        method: "get",
    });
};

// Create ride booking
export const postRideBooking = (data) => {
    return axios.request({
        url: "/local-transportation/ride-booking/",
        method: "post",
        data
    });
};

// Delete ride booking
export const deleteRideBooking = (id) => {
    return axios.request({
        url: `/local-transportation/ride-booking/${id}/`,
        method: "delete"
    });
};

// Get user ride booking list
export const getUserRideBookings = () => {
    return axios.request({
        url: "/local-transportation/ride-booking/",
        method: "get",
    });
};