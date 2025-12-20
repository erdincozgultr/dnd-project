import axiosClient from '../api/axiosClient';

const VENUE_URL = '/venues'; // axiosClient zaten /api prefixine sahip

const venueService = {
  getPublicVenues: () => axiosClient.get(`${VENUE_URL}/public`),
  
  // Madde 1: Yakındakiler özelliği (Backend parametre isimleri: lat, lon, dist)
  getNearbyVenues: (lat, lon, dist = 20) => 
    axiosClient.get(`${VENUE_URL}/nearby`, { params: { lat, lon, dist } }),

  getVenueById: (id) => axiosClient.get(`${VENUE_URL}/${id}`),

  // Madde 2: VenueRequest.java ile tam uyumlu create
  createVenue: (venueRequest) => axiosClient.post(VENUE_URL, venueRequest),

  claimVenue: (id, claimRequest) => axiosClient.post(`${VENUE_URL}/${id}/claim`, claimRequest),

  addReview: (id, reviewRequest) => axiosClient.post(`${VENUE_URL}/${id}/reviews`, reviewRequest)
};

export default venueService;