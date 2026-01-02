// src/hooks/useBlogQueries.js

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { blogService, blogCommentService } from '../services/blogService';
import axiosClient from '../api/axiosClient';
import { BLOG_LIKE_TARGET_TYPE } from '../constants/blogConstants';

/**
 * ========================================
 * BLOG QUERIES
 * ========================================
 */

/**
 * Blog listesi (pagination + cache)
 * Cache: 5 dakika
 */
export const useBlogList = (page = 0, size = 12, category = null) => {
  return useQuery({
    queryKey: ['blogs', page, size, category],
    queryFn: async () => {
      const response = await blogService.getPublishedBlogs(page, size);
      return response.data;
    },
    staleTime: 5 * 60 * 1000, // 5 dk
    keepPreviousData: true, // Sayfa değişirken eski data göster
  });
};

/**
 * Blog detay (slug ile)
 * Cache: 10 dakika
 */
export const useBlogDetail = (slug) => {
  return useQuery({
    queryKey: ['blog', slug],
    queryFn: async () => {
      const response = await blogService.getBlogBySlug(slug);
      return response.data;
    },
    staleTime: 10 * 60 * 1000, // 10 dk
    enabled: !!slug, // Slug varsa fetch et
  });
};

/**
 * Blog arama
 */
export const useBlogSearch = (query) => {
  return useQuery({
    queryKey: ['blogs', 'search', query],
    queryFn: async () => {
      const response = await blogService.searchBlogs(query);
      return response.data;
    },
    enabled: !!query && query.length >= 2, // Min 2 karakter
    staleTime: 3 * 60 * 1000, // 3 dk
  });
};

/**
 * Kendi bloglarım
 * Cache: 2 dakika
 */
export const useMyBlogs = (page = 0, size = 10) => {
  return useQuery({
    queryKey: ['my-blogs', page, size],
    queryFn: async () => {
      const response = await blogService.getMyBlogs(page, size);
      return response.data;
    },
    staleTime: 2 * 60 * 1000, // 2 dk
    keepPreviousData: true,
  });
};

/**
 * ========================================
 * BLOG MUTATIONS
 * ========================================
 */

/**
 * Blog oluştur
 */
export const useCreateBlog = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data) => blogService.createBlog(data),
    onSuccess: (response) => {
      // Cache'leri invalidate et
      queryClient.invalidateQueries(['blogs']);
      queryClient.invalidateQueries(['my-blogs']);
      
      toast.success(
        response.data.status === 'PUBLISHED' 
          ? '🎉 Blog yayınlandı!' 
          : '📝 Blog taslak olarak kaydedildi!'
      );
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Blog oluşturulamadı');
    },
  });
};

/**
 * Blog güncelle
 */
export const useUpdateBlog = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }) => blogService.updateBlog(id, data),
    onSuccess: (response, variables) => {
      // İlgili cache'leri invalidate et
      queryClient.invalidateQueries(['blogs']);
      queryClient.invalidateQueries(['my-blogs']);
      queryClient.invalidateQueries(['blog', response.data.slug]);
      
      toast.success('✓ Blog güncellendi!');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Blog güncellenemedi');
    },
  });
};

/**
 * Blog sil
 */
export const useDeleteBlog = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id) => blogService.deleteBlog(id),
    onSuccess: () => {
      queryClient.invalidateQueries(['blogs']);
      queryClient.invalidateQueries(['my-blogs']);
      
      toast.success('🗑️ Blog silindi');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Blog silinemedi');
    },
  });
};

/**
 * Blog beğen/beğenmeden çıkar (Optimistic update)
 */
export const useLikeBlog = (blogId) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => 
      axiosClient.post('/likes', {
        targetType: BLOG_LIKE_TARGET_TYPE,
        targetId: blogId
      }),
    
    // Optimistic update - butona basıldığında hemen UI'ı güncelle
    onMutate: async () => {
      // Mevcut query'leri iptal et
      await queryClient.cancelQueries(['blog', blogId]);

      // Önceki data'yı al (rollback için)
      const previousBlog = queryClient.getQueryData(['blog', blogId]);

      // Optimistic update yap
      queryClient.setQueryData(['blog', blogId], (old) => {
        if (!old) return old;
        return {
          ...old,
          liked: !old.liked,
          likeCount: old.liked ? old.likeCount - 1 : old.likeCount + 1
        };
      });

      // Rollback için önceki data'yı döndür
      return { previousBlog };
    },

    // Hata olursa rollback
    onError: (err, variables, context) => {
      if (context?.previousBlog) {
        queryClient.setQueryData(['blog', blogId], context.previousBlog);
      }
      toast.error('Beğeni işlemi başarısız');
    },

    // Success sonrası cache'i invalidate et (backend'den güncel data)
    onSettled: () => {
      queryClient.invalidateQueries(['blog', blogId]);
    },
  });
};

/**
 * ========================================
 * COMMENT QUERIES
 * ========================================
 */

/**
 * Blog yorumları
 */
export const useBlogComments = (blogId, page = 0, size = 20) => {
  return useQuery({
    queryKey: ['comments', blogId, page, size],
    queryFn: async () => {
      const response = await blogCommentService.getComments(blogId, page, size);
      return response.data;
    },
    staleTime: 1 * 60 * 1000, // 1 dk (yorumlar real-time hissi için)
    enabled: !!blogId,
  });
};

/**
 * ========================================
 * COMMENT MUTATIONS
 * ========================================
 */

/**
 * Yorum ekle
 */
export const useAddComment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data) => blogCommentService.addComment(data),
    
    onSuccess: (_, variables) => {
      // Blog yorumlarını invalidate et
      queryClient.invalidateQueries(['comments', variables.blogId]);
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
export const useDeleteComment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (commentId) => blogCommentService.deleteComment(commentId),
    
    onSuccess: () => {
      // Tüm comment query'lerini invalidate et
      queryClient.invalidateQueries(['comments']);
      toast.success('🗑️ Yorum silindi');
    },
    
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Yorum silinemedi');
    },
  });
};

/**
 * ========================================
 * UTILITY HOOKS
 * ========================================
 */

/**
 * Prefetch blog detail (link'e hover edildiğinde)
 */
export const usePrefetchBlog = () => {
  const queryClient = useQueryClient();

  return (slug) => {
    queryClient.prefetchQuery({
      queryKey: ['blog', slug],
      queryFn: async () => {
        const response = await blogService.getBlogBySlug(slug);
        return response.data;
      },
      staleTime: 10 * 60 * 1000,
    });
  };
};