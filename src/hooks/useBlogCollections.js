import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import blogCollectionService from '../services/blogCollectionService';
import { toast } from 'react-toastify';

// Koleksiyonları getir
export const useBlogCollections = () => {
  return useQuery({
    queryKey: ['blog-collections'],
    queryFn: blogCollectionService.getMyCollections,
  });
};

// Koleksiyon detayı
export const useBlogCollection = (id) => {
  return useQuery({
    queryKey: ['blog-collection', id],
    queryFn: () => blogCollectionService.getCollectionById(id),
    enabled: !!id,
  });
};

// Yeni koleksiyon oluştur
export const useCreateBlogCollection = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: blogCollectionService.createCollection,
    onSuccess: () => {
      queryClient.invalidateQueries(['blog-collections']);
      toast.success('✅ Koleksiyon oluşturuldu!');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Koleksiyon oluşturulamadı');
    },
  });
};

// Koleksiyon sil
export const useDeleteBlogCollection = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: blogCollectionService.deleteCollection,
    onSuccess: () => {
      queryClient.invalidateQueries(['blog-collections']);
      toast.success('🗑️ Koleksiyon silindi');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Koleksiyon silinemedi');
    },
  });
};

// Blog ekle
export const useAddBlogToCollection = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ collectionId, blogId }) =>
      blogCollectionService.addBlogToCollection(collectionId, blogId),
    onSuccess: () => {
      queryClient.invalidateQueries(['blog-collections']);
      toast.success('📚 Koleksiyona eklendi!');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Eklenemedi');
    },
  });
};

// Blog çıkar
export const useRemoveBlogFromCollection = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ collectionId, blogId }) =>
      blogCollectionService.removeBlogFromCollection(collectionId, blogId),
    onSuccess: () => {
      queryClient.invalidateQueries(['blog-collections']);
      toast.success('📤 Koleksiyondan çıkarıldı');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Çıkarılamadı');
    },
  });
};