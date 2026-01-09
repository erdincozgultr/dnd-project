// src/services/homebrewCommentService.js
import axiosClient from '../api/axiosClient';

const BASE_URL = '/homebrew-comments';

/**
 * Homebrew Comment Service
 */
export const homebrewCommentService = {
  /**
   * Homebrew yorumları (pagination)
   * GET /api/homebrew-comments/homebrew/{homebrewId}?page=0&size=20
   */
  getComments: (homebrewId, page = 0, size = 20) =>
    axiosClient.get(`${BASE_URL}/homebrew/${homebrewId}`, { 
      params: { page, size } 
    }),

  /**
   * Yorum ekle
   * POST /api/homebrew-comments
   * 
   * @param {Object} data
   * @param {number} data.homebrewId - Homebrew ID
   * @param {string} data.content - Yorum içeriği
   */
  addComment: (data) =>
    axiosClient.post(BASE_URL, data),

  /**
   * Yorum sil (kendi yorumunu)
   * DELETE /api/homebrew-comments/{id}
   */
  deleteComment: (id) =>
    axiosClient.delete(`${BASE_URL}/${id}`),

  /**
   * Yorum onayla (MODERATOR/ADMIN)
   * PATCH /api/homebrew-comments/{id}/approve
   */
  approveComment: (id) =>
    axiosClient.patch(`${BASE_URL}/${id}/approve`),

  /**
   * Onay bekleyen yorumlar (MODERATOR/ADMIN)
   * GET /api/homebrew-comments/pending?page=0&size=20
   */
  getPendingComments: (page = 0, size = 20) =>
    axiosClient.get(`${BASE_URL}/pending`, { 
      params: { page, size } 
    }),
};

export default homebrewCommentService;