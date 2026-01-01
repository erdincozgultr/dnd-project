// src/services/blogService.js

import axiosClient from '../api/axiosClient';

const BASE_URL = '/blogs';
const COMMENT_URL = '/comments';

/**
 * Blog Entry Service
 */
export const blogService = {
  /**
   * Yayınlanmış blogları getir (pagination)
   * GET /api/blogs/list/public?page=0&size=12
   */
  getPublishedBlogs: (page = 0, size = 12) =>
    axiosClient.get(`${BASE_URL}/list/public`, { 
      params: { page, size } 
    }),

  /**
   * Blog ara
   * GET /api/blogs/search?q=dragon
   */
  searchBlogs: (query) =>
    axiosClient.get(`${BASE_URL}/search`, { 
      params: { q: query } 
    }),

  /**
   * Blog detay (slug ile)
   * GET /api/blogs/read/{slug}
   */
  getBlogBySlug: (slug) =>
    axiosClient.get(`${BASE_URL}/read/${slug}`),

  /**
   * Blog oluştur (WRITER/ADMIN)
   * POST /api/blogs
   * 
   * @param {Object} data - Blog data
   * @param {string} data.title - Başlık
   * @param {string} data.content - Markdown içerik
   * @param {string} data.thumbnailUrl - Kapak resmi URL
   * @param {string} data.category - Kategori (ADVENTURE, LORE, etc.)
   * @param {string[]} data.tags - Etiketler
   * @param {string} data.status - DRAFT | PUBLISHED
   * @param {string} data.customSlug - Özel slug (opsiyonel)
   * @param {string} data.seoTitle - SEO başlık (opsiyonel)
   * @param {string} data.seoDescription - SEO açıklama (opsiyonel)
   */
  createBlog: (data) =>
    axiosClient.post(BASE_URL, data),

  /**
   * Blog güncelle (WRITER/ADMIN)
   * PATCH /api/blogs/{id}
   * NOT: Full update - moderasyona gider!
   */
  updateBlog: (id, data) =>
    axiosClient.patch(`${BASE_URL}/${id}`, data),

  /**
   * Blog status güncelle (sadece status - moderasyon YOK)
   * PATCH /api/blogs/{id}/status
   * Body: { status: "ARCHIVED" }
   */
  updateBlogStatus: (id, status) =>
    axiosClient.patch(`${BASE_URL}/${id}/status`, { status }),

  /**
   * Blog sil (WRITER/ADMIN)
   * DELETE /api/blogs/{id}
   */
  deleteBlog: (id) =>
    axiosClient.delete(`${BASE_URL}/${id}`),

  /**
   * Kendi bloglarım (WRITER/ADMIN)
   * GET /api/blogs/me?page=0&size=10
   */
  getMyBlogs: (page = 0, size = 10) =>
    axiosClient.get(`${BASE_URL}/me`, { 
      params: { page, size } 
    }),
};

/**
 * Blog Comment Service
 */
export const blogCommentService = {
  /**
   * Blog yorumları (pagination)
   * GET /api/comments/blog/{blogId}?page=0&size=20
   */
  getComments: (blogId, page = 0, size = 20) =>
    axiosClient.get(`${COMMENT_URL}/blog/${blogId}`, { 
      params: { page, size } 
    }),

  /**
   * Yorum ekle
   * POST /api/comments
   * 
   * @param {Object} data
   * @param {number} data.blogId - Blog ID
   * @param {string} data.content - Yorum içeriği
   */
  addComment: (data) =>
    axiosClient.post(COMMENT_URL, data),

  /**
   * Yorum sil (kendi yorumunu)
   * DELETE /api/comments/{id}
   */
  deleteComment: (id) =>
    axiosClient.delete(`${COMMENT_URL}/${id}`),

  /**
   * Yorum onayla (MODERATOR/ADMIN)
   * PATCH /api/comments/{id}/approve
   */
  approveComment: (id) =>
    axiosClient.patch(`${COMMENT_URL}/${id}/approve`),

  /**
   * Onay bekleyen yorumlar (MODERATOR/ADMIN)
   * GET /api/comments/pending?page=0&size=20
   */
  getPendingComments: (page = 0, size = 20) =>
    axiosClient.get(`${COMMENT_URL}/pending`, { 
      params: { page, size } 
    }),
};

export default blogService;