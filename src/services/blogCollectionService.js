// src/services/blogCollectionService.js

import axiosClient from '../api/axiosClient';

const blogCollectionService = {
  // Kullanıcının tüm koleksiyonlarını getir
  getMyCollections: async () => {
    const response = await axiosClient.get('/blog-collections/me');
    return response.data;
  },

  // Koleksiyon detayı getir
  getCollectionById: async (id) => {
    const response = await axiosClient.get(`/blog-collections/${id}`);
    return response.data;
  },

  // Yeni koleksiyon oluştur
  createCollection: async (data) => {
    const response = await axiosClient.post('/blog-collections', data);
    return response.data;
  },

  // Koleksiyon sil
  deleteCollection: async (id) => {
    await axiosClient.delete(`/blog-collections/${id}`);
  },

  // Blog'u koleksiyona ekle
  addBlogToCollection: async (collectionId, blogId) => {
    await axiosClient.post(`/blog-collections/${collectionId}/blogs/${blogId}`);
  },

  // Blog'u koleksiyondan çıkar
  removeBlogFromCollection: async (collectionId, blogId) => {
    await axiosClient.delete(`/blog-collections/${collectionId}/blogs/${blogId}`);
  },

  // Kullanıcının public koleksiyonlarını getir
  getUserPublicCollections: async (userId) => {
    const response = await axiosClient.get(`/blog-collections/user/${userId}`);
    return response.data;
  },
};

export default blogCollectionService;