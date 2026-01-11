// src/services/wikiCollectionService.js

import axiosClient from '../api/axiosClient';

const wikiCollectionService = {
  // Kullanıcının tüm koleksiyonlarını getir
  getMyCollections: async () => {
    const response = await axiosClient.get('/wiki-collections/me');
    return response.data;
  },

  // Koleksiyon detayı getir
  getCollectionById: async (id) => {
    const response = await axiosClient.get(`/wiki-collections/${id}`);
    return response.data;
  },

  // Yeni koleksiyon oluştur
  createCollection: async (data) => {
    const response = await axiosClient.post('/wiki-collections', data);
    return response.data;
  },

  // Koleksiyon sil
  deleteCollection: async (id) => {
    await axiosClient.delete(`/wiki-collections/${id}`);
  },

  // Wiki'yi koleksiyona ekle
  addWikiToCollection: async (collectionId, wikiId) => {
    await axiosClient.post(`/wiki-collections/${collectionId}/wikis/${wikiId}`);
  },

  // Wiki'yi koleksiyondan çıkar
  removeWikiFromCollection: async (collectionId, wikiId) => {
    await axiosClient.delete(`/wiki-collections/${collectionId}/wikis/${wikiId}`);
  },

  // Kullanıcının public koleksiyonlarını getir
  getUserPublicCollections: async (userId) => {
    const response = await axiosClient.get(`/wiki-collections/user/${userId}`);
    return response.data;
  },
};

export default wikiCollectionService;