import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import wikiCollectionService from '../services/wikiCollectionService';
import { toast } from 'react-toastify';

// Koleksiyonları getir
export const useWikiCollections = () => {
  return useQuery({
    queryKey: ['wiki-collections'],
    queryFn: wikiCollectionService.getMyCollections,
  });
};

// Koleksiyon detayı
export const useWikiCollection = (id) => {
  return useQuery({
    queryKey: ['wiki-collection', id],
    queryFn: () => wikiCollectionService.getCollectionById(id),
    enabled: !!id,
  });
};

// Yeni koleksiyon oluştur
export const useCreateWikiCollection = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: wikiCollectionService.createCollection,
    onSuccess: () => {
      queryClient.invalidateQueries(['wiki-collections']);
      toast.success('✅ Koleksiyon oluşturuldu!');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Koleksiyon oluşturulamadı');
    },
  });
};

// Koleksiyon sil
export const useDeleteWikiCollection = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: wikiCollectionService.deleteCollection,
    onSuccess: () => {
      queryClient.invalidateQueries(['wiki-collections']);
      toast.success('🗑️ Koleksiyon silindi');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Koleksiyon silinemedi');
    },
  });
};

// Wiki ekle
export const useAddWikiToCollection = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ collectionId, wikiId }) =>
      wikiCollectionService.addWikiToCollection(collectionId, wikiId),
    onSuccess: () => {
      queryClient.invalidateQueries(['wiki-collections']);
      toast.success('📚 Koleksiyona eklendi!');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Eklenemedi');
    },
  });
};

// Wiki çıkar
export const useRemoveWikiFromCollection = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ collectionId, wikiId }) =>
      wikiCollectionService.removeWikiFromCollection(collectionId, wikiId),
    onSuccess: () => {
      queryClient.invalidateQueries(['wiki-collections']);
      toast.success('📤 Koleksiyondan çıkarıldı');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Çıkarılamadı');
    },
  });
};