// src/components/blog/comments/CommentForm.jsx

import React, { useState } from 'react';
import { Send } from 'lucide-react';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';

const CommentForm = ({ blogId, onSubmit, isSubmitting }) => {
  const { isAuthenticated } = useSelector((state) => state.auth);
  const [content, setContent] = useState('');
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!isAuthenticated) {
      toast.info('Yorum yapmak için giriş yapmalısın');
      return;
    }
    
    const trimmedContent = content.trim();
    
    if (!trimmedContent) {
      toast.error('Lütfen yorum yazın');
      return;
    }
    
    if (trimmedContent.length < 3) {
      toast.error('Yorum en az 3 karakter olmalıdır');
      return;
    }
    
    if (trimmedContent.length > 1000) {
      toast.error('Yorum en fazla 1000 karakter olabilir');
      return;
    }
    
    try {
      await onSubmit({ blogId, content: trimmedContent });
      setContent(''); // Form temizle
    } catch (error) {
      // Error handling useBlogQueries'de yapılıyor
    }
  };
  
  return (
    <div className="bg-white rounded-xl border border-cbg p-4">
      <form onSubmit={handleSubmit}>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder={
            isAuthenticated 
              ? "Yorumunuzu yazın..." 
              : "Yorum yapmak için giriş yapın"
          }
          disabled={!isAuthenticated || isSubmitting}
          className="w-full min-h-[100px] p-3 border border-cbg rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-cta/50 disabled:bg-gray-50 disabled:text-gray-400"
          maxLength={1000}
        />
        
        <div className="flex items-center justify-between mt-3">
          <span className="text-xs text-sti">
            {content.length}/1000 karakter
          </span>
          
          <button
            type="submit"
            disabled={!isAuthenticated || !content.trim() || isSubmitting}
            className="flex items-center gap-2 px-4 py-2 bg-cta text-white rounded-lg font-bold hover:bg-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send size={16} />
            {isSubmitting ? 'Gönderiliyor...' : 'Gönder'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CommentForm;