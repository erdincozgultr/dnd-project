// src/services/moderationService.js - FINAL VERSION with Stats

import axiosClient from '../api/axiosClient';

const moderationService = {
  // ============================================
  // STATS
  // ============================================

  getStats: () => axiosClient.get('/mod/dashboard/stats'),

  // ============================================
  // HOMEBREW MODERATION
  // ============================================

  getPendingHomebrews: (page = 0, size = 20) =>
    axiosClient.get('/mod/dashboard/homebrews/pending', { params: { page, size } }),

  getAllHomebrews: (status = null, page = 0, size = 20) => {
    const params = { page, size };
    if (status) params.status = status;
    return axiosClient.get('/mod/dashboard/homebrews', { params });
  },

  // Moderator preview endpoint (draft/pending içerikleri görüntüle)
  getHomebrewPreview: (id) =>
    axiosClient.get(`/mod/homebrews/view/${id}`),

  approveHomebrew: (id, reason, messageToUser = null) =>
    axiosClient.post(`/mod/homebrews/${id}/approve`, { reason, messageToUser }),

  rejectHomebrew: (id, reason, messageToUser = null) =>
    axiosClient.post(`/mod/homebrews/${id}/reject`, { reason, messageToUser }),

  moveHomebrewToDraft: (id, reason, messageToUser = null) =>
    axiosClient.post(`/mod/homebrews/${id}/move-to-draft`, { reason, messageToUser }),

  updateHomebrewMetadata: (id, data, reason, messageToUser = null) => {
    const params = new URLSearchParams();
    if (data.title) params.append('title', data.title);
    if (data.description) params.append('description', data.description);
    if (data.category) params.append('category', data.category);
    return axiosClient.patch(`/mod/homebrews/${id}/metadata?${params.toString()}`, {
      reason,
      messageToUser,
    });
  },

  // ============================================
  // BLOG MODERATION
  // ============================================

  getAllBlogs: (status = null, page = 0, size = 20) => {
    const params = { page, size };
    if (status) params.status = status;
    return axiosClient.get('/mod/dashboard/blogs', { params });
  },

  getPublishedBlogs: (page = 0, size = 20) =>
    axiosClient.get('/mod/dashboard/blogs/published', { params: { page, size } }),

  moveBlogToDraft: (id, reason, messageToUser = null) =>
    axiosClient.post(`/mod/blogs/${id}/move-to-draft`, { reason, messageToUser }),

  updateBlogMetadata: (id, data, reason, messageToUser = null) => {
    const params = new URLSearchParams();
    if (data.category) params.append('category', data.category);
    if (data.slug) params.append('slug', data.slug);
    if (data.tags) params.append('tags', data.tags);
    if (data.featuredImage) params.append('featuredImage', data.featuredImage);
    return axiosClient.patch(`/mod/blogs/${id}/metadata?${params.toString()}`, {
      reason,
      messageToUser,
    });
  },

  // ============================================
  // COMMENT MODERATION
  // ============================================

  deleteHomebrewComment: (commentId, reason, messageToUser = null) =>
    axiosClient.delete(`/mod/comments/homebrew/${commentId}`, {
      data: { reason, messageToUser },
    }),

  deleteWikiComment: (commentId, reason, messageToUser = null) =>
    axiosClient.delete(`/mod/comments/wiki/${commentId}`, {
      data: { reason, messageToUser },
    }),

  deleteBlogComment: (commentId, reason, messageToUser = null) =>
    axiosClient.delete(`/mod/comments/blog/${commentId}`, {
      data: { reason, messageToUser },
    }),

  // ============================================
  // GUILD MODERATION
  // ============================================

  getAllGuilds: (page = 0, size = 20) =>
    axiosClient.get('/mod/dashboard/guilds', { params: { page, size } }),

  getBannedGuilds: (page = 0, size = 20) =>
    axiosClient.get('/mod/dashboard/guilds/banned', { params: { page, size } }),

  banGuild: (id, reason, messageToUser = null) =>
    axiosClient.post(`/mod/guilds/${id}/ban`, { reason, messageToUser }),

  unbanGuild: (id, reason, messageToUser = null) =>
    axiosClient.post(`/mod/guilds/${id}/unban`, { reason, messageToUser }),

  // ============================================
  // CAMPAIGN MODERATION
  // ============================================

  getAllCampaigns: (page = 0, size = 20) =>
    axiosClient.get('/mod/dashboard/campaigns', { params: { page, size } }),

  deleteCampaign: (id, reason, messageToUser = null) =>
    axiosClient.delete(`/mod/campaigns/${id}`, {
      data: { reason, messageToUser },
    }),

  // ============================================
  // VENUE MODERATION
  // ============================================

  getPendingVenues: (page = 0, size = 20) =>
    axiosClient.get('/mod/dashboard/venues/pending', { params: { page, size } }),

  getAllVenues: (status = null, page = 0, size = 20) => {
    const params = { page, size };
    if (status) params.status = status;
    return axiosClient.get('/mod/dashboard/venues', { params });
  },

  approveVenue: (id, reason, messageToUser = null) =>
    axiosClient.post(`/mod/venues/${id}/approve`, { reason, messageToUser }),

  rejectVenue: (id, reason, messageToUser = null) =>
    axiosClient.post(`/mod/venues/${id}/reject`, { reason, messageToUser }),

  moveVenueToDraft: (id, reason, messageToUser = null) =>
    axiosClient.post(`/mod/venues/${id}/move-to-draft`, { reason, messageToUser }),

  // ============================================
  // AUDIT LOGS
  // ============================================

  getAuditLogs: (targetType, targetId) =>
    axiosClient.get('/mod/dashboard/audit', {
      params: { targetType, targetId },
    }),

  getAllAuditLogs: (page = 0, size = 50) =>
    axiosClient.get('/mod/dashboard/audit/all', { params: { page, size } }),
};

export default moderationService;