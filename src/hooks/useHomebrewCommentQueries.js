// src/hooks/useHomebrewCommentQueries.js
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { homebrewCommentService } from '../services/homebrewCommentService';

/**
 * Homebrew yorumları
 */
export const useHomebrewComments = (homebrewId, page = 0, size = 20) => {
  return useQuery({
    queryKey: ['homebrew-comments', homebrewId, page, size],
    queryFn: async () => {
      const response = await homebrewCommentService.getComments(homebrewId, page, size);
      return response.data;
    },
    staleTime: 1 * 60 * 1000, // 1 dk
    enabled: !!homebrewId,
  });
};

/**
 * Yorum ekle
 */
export const useAddHomebrewComment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data) => homebrewCommentService.addComment(data),
    
    onSuccess: (_, variables) => {
      // Homebrew yorumlarını invalidate et
      queryClient.invalidateQueries(['homebrew-comments', variables.homebrewId]);
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
export const useDeleteHomebrewComment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (commentId) => homebrewCommentService.deleteComment(commentId),
    
    onSuccess: () => {
      // Tüm comment query'lerini invalidate et
      queryClient.invalidateQueries(['homebrew-comments']);
      toast.success('🗑️ Yorum silindi');
    },
    
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Yorum silinemedi');
    },
  });
};