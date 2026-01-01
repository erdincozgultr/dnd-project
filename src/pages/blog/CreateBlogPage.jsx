// src/pages/blog/CreateBlogPage.jsx

import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { 
  Save, Send, ArrowLeft, AlertCircle, Image as ImageIcon,
  Clock, CheckCircle 
} from 'lucide-react';
import { toast } from 'react-toastify';
import MarkdownEditor from '../../components/blog/editor/MarkdownEditor';
import { useCreateBlog, useUpdateBlog, useBlogDetail } from '../../hooks/useBlogQueries';
import { 
  getCategoryOptions, 
  BLOG_STORAGE_KEYS, 
  isValidImageUrl 
} from '../../constants/blogConstants';

const CreateBlogPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams(); // Edit mode için ID
  
  // Edit mode kontrolü
  const isEditMode = !!id;
  const blogFromState = location.state?.blog; // MyBlogsPage'den gelen data
  
  // Mutations
  const createBlogMutation = useCreateBlog();
  const updateBlogMutation = useUpdateBlog();
  
  // Edit mode için blog detail fetch et (eğer state'te yoksa)
  // Not: useBlogDetail'in enabled parametresi slug null ise otomatik disable olur
  const shouldFetchBlog = isEditMode && !blogFromState && blogFromState?.slug;
  const { data: blogDetail, isLoading: blogLoading } = useBlogDetail(
    shouldFetchBlog ? blogFromState.slug : null
  );

  // Form state
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [thumbnailUrl, setThumbnailUrl] = useState('');
  const [category, setCategory] = useState('');
  const [tags, setTags] = useState('');
  const [customSlug, setCustomSlug] = useState('');
  const [seoTitle, setSeoTitle] = useState('');
  const [seoDescription, setSeoDescription] = useState('');
  
  // UI state
  const [lastSaved, setLastSaved] = useState(null);
  const [isImageValid, setIsImageValid] = useState(true);

  // LocalStorage auto-save (her 30 saniyede bir)
  useEffect(() => {
    // Edit mode'da auto-save YAPMA (sadece create mode'da)
    if (isEditMode) return;
    
    const timer = setInterval(() => {
      if (title || content) {
        const draft = {
          title,
          content,
          thumbnailUrl,
          category,
          tags,
          customSlug,
          seoTitle,
          seoDescription,
        };
        
        localStorage.setItem(BLOG_STORAGE_KEYS.DRAFT, JSON.stringify(draft));
        localStorage.setItem(BLOG_STORAGE_KEYS.AUTO_SAVE_TIME, new Date().toISOString());
        setLastSaved(new Date());
      }
    }, 30000); // 30 seconds

    return () => clearInterval(timer);
  }, [title, content, thumbnailUrl, category, tags, customSlug, seoTitle, seoDescription, isEditMode]);

  // Load blog data in edit mode
  useEffect(() => {
    if (isEditMode) {
      const blog = blogFromState || blogDetail;
      
      if (blog) {
        setTitle(blog.title || '');
        setContent(blog.content || '');
        setThumbnailUrl(blog.thumbnailUrl || '');
        setCategory(blog.category || '');
        setTags(blog.tags ? blog.tags.join(', ') : '');
        setCustomSlug(blog.customSlug || '');
        setSeoTitle(blog.seoTitle || '');
        setSeoDescription(blog.seoDescription || '');
      }
    }
  }, [isEditMode, blogFromState, blogDetail]);

  // Load draft on mount (SADECE create mode'da)
  useEffect(() => {
    if (isEditMode) return; // Edit mode'da draft yükleme
    
    const savedDraft = localStorage.getItem(BLOG_STORAGE_KEYS.DRAFT);
    const savedTime = localStorage.getItem(BLOG_STORAGE_KEYS.AUTO_SAVE_TIME);
    
    if (savedDraft) {
      const draft = JSON.parse(savedDraft);
      
      // Show restore notification
      toast.info(
        <div>
          <p className="font-bold">Taslak bulundu!</p>
          <p className="text-sm">
            {savedTime ? `Kaydedilme: ${new Date(savedTime).toLocaleString('tr-TR')}` : ''}
          </p>
          <button
            onClick={() => {
              setTitle(draft.title || '');
              setContent(draft.content || '');
              setThumbnailUrl(draft.thumbnailUrl || '');
              setCategory(draft.category || '');
              setTags(draft.tags || '');
              setCustomSlug(draft.customSlug || '');
              setSeoTitle(draft.seoTitle || '');
              setSeoDescription(draft.seoDescription || '');
              toast.success('Taslak geri yüklendi!');
            }}
            className="mt-2 px-3 py-1 bg-white text-blue-600 rounded font-bold text-sm"
          >
            Geri Yükle
          </button>
        </div>,
        { autoClose: false }
      );
    }
  }, []);

  // Image URL validation
  useEffect(() => {
    if (thumbnailUrl) {
      setIsImageValid(isValidImageUrl(thumbnailUrl));
    } else {
      setIsImageValid(true);
    }
  }, [thumbnailUrl]);

  // Handle save as draft (or update draft)
  const handleSaveDraft = async () => {
    if (!title.trim()) {
      toast.error('Lütfen bir başlık girin');
      return;
    }

    if (!content.trim()) {
      toast.error('Lütfen içerik yazın');
      return;
    }

    const blogData = {
      title: title.trim(),
      content: content.trim(),
      thumbnailUrl: thumbnailUrl.trim() || null,
      category: category || 'OTHER',
      tags: tags ? tags.split(',').map(t => t.trim()).filter(Boolean) : [],
      status: 'DRAFT',
      customSlug: customSlug.trim() || null,
      seoTitle: seoTitle.trim() || null,
      seoDescription: seoDescription.trim() || null,
    };

    try {
      if (isEditMode) {
        // Update existing blog
        const blog = blogFromState || blogDetail;
        await updateBlogMutation.mutateAsync({
          id: blog.id,
          data: blogData
        });
      } else {
        // Create new blog
        await createBlogMutation.mutateAsync(blogData);
        
        // Clear localStorage
        localStorage.removeItem(BLOG_STORAGE_KEYS.DRAFT);
        localStorage.removeItem(BLOG_STORAGE_KEYS.AUTO_SAVE_TIME);
      }
      
      // Redirect to my blogs
      navigate('/blog/bloglarim');
    } catch (error) {
      // Error toast already shown in mutation
    }
  };

  // Handle publish (or update and publish)
  const handlePublish = async () => {
    // Validation
    if (!title.trim()) {
      toast.error('Lütfen bir başlık girin');
      return;
    }

    if (!content.trim()) {
      toast.error('Lütfen içerik yazın');
      return;
    }

    if (!category) {
      toast.error('Lütfen bir kategori seçin');
      return;
    }

    if (thumbnailUrl && !isImageValid) {
      toast.error('Geçersiz resim URL\'si');
      return;
    }

    const blogData = {
      title: title.trim(),
      content: content.trim(),
      thumbnailUrl: thumbnailUrl.trim() || null,
      category,
      tags: tags ? tags.split(',').map(t => t.trim()).filter(Boolean) : [],
      status: 'PUBLISHED',
      customSlug: customSlug.trim() || null,
      seoTitle: seoTitle.trim() || null,
      seoDescription: seoDescription.trim() || null,
    };

    try {
      let response;
      
      if (isEditMode) {
        // Update existing blog
        const blog = blogFromState || blogDetail;
        response = await updateBlogMutation.mutateAsync({
          id: blog.id,
          data: blogData
        });
      } else {
        // Create new blog
        response = await createBlogMutation.mutateAsync(blogData);
        
        // Clear localStorage
        localStorage.removeItem(BLOG_STORAGE_KEYS.DRAFT);
        localStorage.removeItem(BLOG_STORAGE_KEYS.AUTO_SAVE_TIME);
      }
      
      // Redirect to blog detail
      navigate(`/blog/${response.data.slug}`);
    } catch (error) {
      // Error toast already shown in mutation
    }
  };

  // Loading state (edit mode'da blog yüklenirken)
  if (isEditMode && blogLoading && !blogFromState) {
    return (
      <div className="min-h-screen bg-mbg flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-cta border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-sti">Blog yükleniyor...</p>
        </div>
      </div>
    );
  }

  // Mutation loading state
  const isSaving = createBlogMutation.isLoading || updateBlogMutation.isLoading;

  return (
    <>
      <Helmet>
        <title>{isEditMode ? 'Blog Düzenle' : 'Yeni Blog Yaz'} - Zar & Kule</title>
      </Helmet>

      <div className="min-h-screen bg-mbg">
        {/* Header */}
        <div className="bg-white border-b border-cbg sticky top-0 z-20 shadow-sm">
          <div className="max-w-6xl mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              {/* Back Button */}
              <button
                onClick={() => navigate(isEditMode ? '/blog/bloglarim' : '/blog')}
                className="flex items-center gap-2 text-sti hover:text-mtf transition-colors text-sm font-medium"
              >
                <ArrowLeft size={18} />
                {isEditMode ? 'Bloglarıma Dön' : 'İptal'}
              </button>

              {/* Auto-save status (sadece create mode'da) */}
              {!isEditMode && lastSaved && (
                <div className="flex items-center gap-2 text-xs text-sti">
                  <CheckCircle size={14} className="text-green-500" />
                  <span>
                    Son kayıt: {lastSaved.toLocaleTimeString('tr-TR')}
                  </span>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-3">
                <button
                  onClick={handleSaveDraft}
                  disabled={isSaving}
                  className="flex items-center gap-2 px-4 py-2 bg-white border-2 border-cbg text-mtf rounded-xl font-bold text-sm hover:border-gray-400 transition-colors disabled:opacity-50"
                >
                  <Save size={18} />
                  {isEditMode ? 'Kaydet' : 'Taslak Kaydet'}
                </button>
                
                <button
                  onClick={handlePublish}
                  disabled={isSaving}
                  className="flex items-center gap-2 px-4 py-2 bg-cta text-white rounded-xl font-bold text-sm hover:bg-red-600 transition-colors disabled:opacity-50"
                >
                  <Send size={18} />
                  {isSaving 
                    ? (isEditMode ? 'Güncelleniyor...' : 'Yayınlanıyor...') 
                    : (isEditMode ? 'Güncelle & Yayınla' : 'Yayınla')
                  }
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-6xl mx-auto px-4 py-8">
          {/* Moderation Warning (Edit Mode) */}
          {isEditMode && (
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6">
              <div className="flex gap-3">
                <AlertCircle size={20} className="text-amber-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-bold text-amber-900 mb-1">
                    ⚠️ Moderasyon Uyarısı
                  </p>
                  <p className="text-xs text-amber-700">
                    Blog güncellendiğinde moderasyon onayına gönderilecektir. 
                    Onaylanana kadar yayından kalkabilir.
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content - Left (2/3) */}
            <div className="lg:col-span-2 space-y-6">
              {/* Title */}
              <div>
                <label className="block text-sm font-bold text-mtf mb-2">
                  Blog Başlığı *
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Harika bir başlık yazın..."
                  className="w-full px-4 py-3 text-2xl font-bold bg-white border-2 border-cbg rounded-xl text-mtf placeholder:text-sti/50 outline-none focus:border-cta transition-colors"
                  maxLength={200}
                />
                <p className="mt-2 text-xs text-sti">
                  {title.length}/200 karakter
                </p>
              </div>

              {/* Markdown Editor */}
              <div>
                <label className="block text-sm font-bold text-mtf mb-2">
                  İçerik *
                </label>
                <MarkdownEditor
                  value={content}
                  onChange={setContent}
                />
              </div>
            </div>

            {/* Sidebar - Right (1/3) */}
            <div className="space-y-6">
              {/* Thumbnail */}
              <div className="bg-white border border-cbg rounded-2xl p-6">
                <label className="block text-sm font-bold text-mtf mb-3 flex items-center gap-2">
                  <ImageIcon size={16} />
                  Kapak Resmi
                </label>
                
                <input
                  type="url"
                  value={thumbnailUrl}
                  onChange={(e) => setThumbnailUrl(e.target.value)}
                  placeholder="https://i.imgur.com/abc123.png"
                  className={`w-full px-4 py-3 bg-mbg border-2 rounded-xl text-sm outline-none transition-colors ${
                    thumbnailUrl && !isImageValid
                      ? 'border-red-500 text-red-700'
                      : 'border-cbg focus:border-cta'
                  }`}
                />
                
                {thumbnailUrl && !isImageValid && (
                  <p className="mt-2 text-xs text-red-600 flex items-center gap-1">
                    <AlertCircle size={12} />
                    Geçersiz resim URL'si
                  </p>
                )}

                {thumbnailUrl && isImageValid && (
                  <div className="mt-4">
                    <img
                      src={thumbnailUrl}
                      alt="Preview"
                      className="w-full h-32 object-cover rounded-lg"
                      onError={() => setIsImageValid(false)}
                    />
                  </div>
                )}

                <details className="mt-4">
                  <summary className="text-xs text-blue-600 cursor-pointer hover:underline">
                    Resim nasıl eklerim?
                  </summary>
                  <ul className="mt-2 text-xs text-sti space-y-1 ml-4">
                    <li>1. <a href="https://imgur.com/upload" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">Imgur</a>'a yükle</li>
                    <li>2. Resme sağ tıkla → "Resim bağlantısını kopyala"</li>
                    <li>3. Buraya yapıştır</li>
                  </ul>
                </details>
              </div>

              {/* Category */}
              <div className="bg-white border border-cbg rounded-2xl p-6">
                <label className="block text-sm font-bold text-mtf mb-3">
                  Kategori *
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-4 py-3 bg-mbg border-2 border-cbg rounded-xl outline-none focus:border-cta transition-colors"
                >
                  <option value="">Seçiniz</option>
                  {getCategoryOptions().map((cat) => (
                    <option key={cat.value} value={cat.value}>
                      {cat.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Tags */}
              <div className="bg-white border border-cbg rounded-2xl p-6">
                <label className="block text-sm font-bold text-mtf mb-3">
                  Etiketler
                </label>
                <input
                  type="text"
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                  placeholder="dm, macera, rehber"
                  className="w-full px-4 py-3 bg-mbg border-2 border-cbg rounded-xl text-sm outline-none focus:border-cta transition-colors"
                />
                <p className="mt-2 text-xs text-sti">
                  Virgülle ayırın (örn: dm, macera, rehber)
                </p>
              </div>

              {/* Advanced - Optional */}
              <details className="bg-white border border-cbg rounded-2xl p-6">
                <summary className="text-sm font-bold text-mtf cursor-pointer">
                  Gelişmiş Ayarlar (Opsiyonel)
                </summary>
                
                <div className="mt-4 space-y-4">
                  {/* Custom Slug */}
                  <div>
                    <label className="block text-xs font-bold text-sti mb-2">
                      Özel URL (Slug)
                    </label>
                    <input
                      type="text"
                      value={customSlug}
                      onChange={(e) => setCustomSlug(e.target.value)}
                      placeholder="benim-blog-url"
                      className="w-full px-3 py-2 bg-mbg border border-cbg rounded-lg text-sm outline-none focus:border-cta"
                    />
                    <p className="mt-1 text-xs text-sti">
                      Boş bırakırsanız otomatik oluşturulur
                    </p>
                  </div>

                  {/* SEO Title */}
                  <div>
                    <label className="block text-xs font-bold text-sti mb-2">
                      SEO Başlığı
                    </label>
                    <input
                      type="text"
                      value={seoTitle}
                      onChange={(e) => setSeoTitle(e.target.value)}
                      placeholder="Arama motorları için başlık"
                      className="w-full px-3 py-2 bg-mbg border border-cbg rounded-lg text-sm outline-none focus:border-cta"
                      maxLength={60}
                    />
                  </div>

                  {/* SEO Description */}
                  <div>
                    <label className="block text-xs font-bold text-sti mb-2">
                      SEO Açıklaması
                    </label>
                    <textarea
                      value={seoDescription}
                      onChange={(e) => setSeoDescription(e.target.value)}
                      placeholder="Arama motorları için açıklama"
                      rows={3}
                      className="w-full px-3 py-2 bg-mbg border border-cbg rounded-lg text-sm outline-none focus:border-cta resize-none"
                      maxLength={160}
                    />
                  </div>
                </div>
              </details>

              {/* Publish Checklist */}
              <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6">
                <p className="text-sm font-bold text-amber-900 mb-3">
                  ✅ Yayınlamadan Önce Kontrol Et
                </p>
                <ul className="space-y-2 text-xs text-amber-700">
                  <li className={title ? '✓ line-through' : '○'}>
                    Başlık yazıldı mı?
                  </li>
                  <li className={content ? '✓ line-through' : '○'}>
                    İçerik yazıldı mı?
                  </li>
                  <li className={category ? '✓ line-through' : '○'}>
                    Kategori seçildi mi?
                  </li>
                  <li className={thumbnailUrl && isImageValid ? '✓ line-through' : '○'}>
                    Kapak resmi eklendi mi?
                  </li>
                  <li className={tags ? '✓ line-through' : '○'}>
                    Etiketler eklendi mi?
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CreateBlogPage;