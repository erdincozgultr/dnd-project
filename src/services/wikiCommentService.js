// src/services/wikiCommentService.js
import axiosClient from '../api/axiosClient';

const BASE_URL = '/wiki-comments';

/**
 * Wiki Comment Service
 */
export const wikiCommentService = {
  /**
   * Wiki yorumları (pagination)
   * GET /api/wiki-comments/wiki/{wikiId}?page=0&size=20
   */
  getComments: (wikiId, page = 0, size = 20) =>
    axiosClient.get(`${BASE_URL}/wiki/${wikiId}`, { 
      params: { page, size } 
    }),

  /**
   * Yorum ekle
   * POST /api/wiki-comments
   * 
   * @param {Object} data
   * @param {number} data.wikiId - Wiki ID
   * @param {string} data.content - Yorum içeriği
   */
  addComment: (data) =>
    axiosClient.post(BASE_URL, data),

  /**
   * Yorum sil (kendi yorumunu)
   * DELETE /api/wiki-comments/{id}
   */
  deleteComment: (id) =>
    axiosClient.delete(`${BASE_URL}/${id}`),

  /**
   * Yorum onayla (MODERATOR/ADMIN)
   * PATCH /api/wiki-comments/{id}/approve
   */
  approveComment: (id) =>
    axiosClient.patch(`${BASE_URL}/${id}/approve`),

  /**
   * Onay bekleyen yorumlar (MODERATOR/ADMIN)
   * GET /api/wiki-comments/pending?page=0&size=20
   */
  getPendingComments: (page = 0, size = 20) =>
    axiosClient.get(`${BASE_URL}/pending`, { 
      params: { page, size } 
    }),
};

export default wikiCommentService;