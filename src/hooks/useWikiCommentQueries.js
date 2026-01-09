// src/hooks/useWikiCommentQueries.js
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { wikiCommentService } from '../services/wikiCommentService';

/**
 * Wiki yorumları
 */
export const useWikiComments = (wikiId, page = 0, size = 20) => {
  return useQuery({
    queryKey: ['wiki-comments', wikiId, page, size],
    queryFn: async () => {
      const response = await wikiCommentService.getComments(wikiId, page, size);
      return response.data;
    },
    staleTime: 1 * 60 * 1000, // 1 dk
    enabled: !!wikiId,
  });
};

/**
 * Yorum ekle
 */
export const useAddWikiComment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data) => wikiCommentService.addComment(data),
    
    onSuccess: (_, variables) => {
      // Wiki yorumlarını invalidate et
      queryClient.invalidateQueries(['wiki-comments', variables.wikiId]);
      toast.success('💬 Yorum eklendi!');
    },
    
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Yorum eklenemedi');
    },
  });
};

/**
 * Yorum sil
 */
export const useDeleteWikiComment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (commentId) => wikiCommentService.deleteComment(commentId),
    
    onSuccess: () => {
      // Tüm comment query'lerini invalidate et
      queryClient.invalidateQueries(['wiki-comments']);
      toast.success('🗑️ Yorum silindi');
    },
    
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Yorum silinemedi');
    },
  });
};