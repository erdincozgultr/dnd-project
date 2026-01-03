// src/pages/blog/BlogPage.jsx

import React, { useState } from "react";
import { Helmet } from "react-helmet-async";
import { BookOpen, Search, Filter, Loader, FileText, ChevronRight } from "lucide-react";
import BlogCard from "../../components/blog/list/BlogCard";
import { useBlogList, usePrefetchBlog } from "../../hooks/useBlogQueries";
import {
  getCategoryOptions,
  BLOG_PAGINATION,
} from "../../constants/blogConstants";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

const BlogPage = () => {
  // State
   const { isAuthenticated } = useSelector(state => state.auth);
  const [page, setPage] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  // TanStack Query
  const { data, isLoading, error } = useBlogList(
    page,
    BLOG_PAGINATION.DEFAULT_SIZE,
    selectedCategory
  );

  const prefetchBlog = usePrefetchBlog();

  // Pagination bilgileri
  const totalPages = data?.totalPages || 0;
  const blogs = data?.content || [];

  // Frontend search filter (backend search yerine basit)
  const filteredBlogs = searchQuery
    ? blogs.filter(
        (blog) =>
          blog.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          blog.content?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : blogs;

  return (
    <>
      <Helmet>
        <title>Blog - Zar & Kule</title>
        <meta
          name="description"
          content="D&D içerikleri, rehberler, macera senaryoları ve kampanya günlükleri. Türkiye'nin en büyük Dungeons & Dragons topluluğu."
        />
      </Helmet>

      <div className="min-h-screen bg-mbg">
        {/* Hero Section */}
        <div className="bg-gradient-to-br from-purple-900 via-red-900 to-purple-900 text-white py-16">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex items-center gap-3 mb-4">
              <BookOpen size={40} />
              <h1 className="text-4xl md:text-5xl font-black">Blog</h1>
            </div>
            <p className="text-xl text-white/80 max-w-2xl">
              D&D maceralarınızı paylaşın, deneyimlerinizden öğrenin. Rehberler,
              senaryolar ve kampanya günlükleri.
            </p>
          </div>
        </div>

        {/* Filters & Search */}
        <div className="bg-white border-b border-cbg sticky top-0 z-10 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 py-4">
            <div className="flex flex-col md:flex-row gap-4">
                 {/* BLOGLARIM LİNKİ - Authenticated kullanıcılar için */}
              {isAuthenticated && (
                <Link
                  to="/blog/bloglarim"
                  className="flex items-center gap-2 px-4 py-2.5 bg-white border-2 border-cbg hover:border-purple-500 hover:text-purple-500 text-mtf rounded-xl font-bold text-sm transition-all"
                >
                  <FileText size={18} />
                  Bloglarım
                  <ChevronRight size={16} />
                </Link>
              )}

              {/* Search Bar */}
              <div className="flex-1 relative">
                <Search
                  size={20}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-sti"
                />
                <input
                  type="text"
                  placeholder="Blog ara... (başlık veya içerik)"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-mbg border border-cbg rounded-xl text-mtf placeholder:text-sti outline-none focus:border-cta transition-colors"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-sti hover:text-mtf"
                  >
                    ✕
                  </button>
                )}
              </div>

              {/* Category Filter */}
              <div className="relative">
                <Filter
                  size={20}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-sti pointer-events-none"
                />
                <select
                  value={selectedCategory || ""}
                  onChange={(e) => {
                    setSelectedCategory(e.target.value || null);
                    setPage(0); // Reset page
                  }}
                  className="pl-12 pr-10 py-3 bg-mbg border border-cbg rounded-xl text-mtf outline-none focus:border-cta transition-colors appearance-none cursor-pointer min-w-[200px]"
                >
                  <option value="">Tüm Kategoriler</option>
                  {getCategoryOptions().map((cat) => (
                    <option key={cat.value} value={cat.value}>
                      {cat.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Active Filters Info */}
            {(selectedCategory || searchQuery) && (
              <div className="mt-3 flex items-center gap-2 text-sm text-sti">
                <span>Filtreleniyor:</span>
                {selectedCategory && (
                  <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded-lg">
                    {
                      getCategoryOptions().find(
                        (c) => c.value === selectedCategory
                      )?.label
                    }
                  </span>
                )}
                {searchQuery && (
                  <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-lg">
                    "{searchQuery}"
                  </span>
                )}
                <button
                  onClick={() => {
                    setSelectedCategory(null);
                    setSearchQuery("");
                    setPage(0);
                  }}
                  className="ml-2 text-cta hover:underline font-medium"
                >
                  Temizle
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Blog Grid */}
        <div className="max-w-7xl mx-auto px-4 py-12">
          {/* Loading State */}
          {isLoading && (
            <div className="flex flex-col items-center justify-center py-20">
              <Loader size={48} className="text-cta animate-spin mb-4" />
              <p className="text-sti">Bloglar yükleniyor...</p>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
              <p className="text-red-700 font-bold mb-2">❌ Hata</p>
              <p className="text-red-600 text-sm">
                {error.message || "Bloglar yüklenirken bir hata oluştu"}
              </p>
            </div>
          )}

          {/* Empty State */}
          {!isLoading && !error && filteredBlogs.length === 0 && (
            <div className="text-center py-20">
              <BookOpen size={64} className="mx-auto text-sti mb-4" />
              <p className="text-xl font-bold text-mtf mb-2">
                {searchQuery || selectedCategory
                  ? "Blog bulunamadı"
                  : "Henüz blog yok"}
              </p>
              <p className="text-sti">
                {searchQuery || selectedCategory
                  ? "Farklı bir arama veya kategori deneyin."
                  : "İlk blogu siz yazın!"}
              </p>
            </div>
          )}

          {/* Blog Grid */}
          {!isLoading && !error && filteredBlogs.length > 0 && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredBlogs.map((blog) => (
                  <BlogCard
                    key={blog.id}
                    blog={blog}
                    onMouseEnter={() => prefetchBlog(blog.slug)}
                  />
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="mt-12 flex justify-center items-center gap-2">
                  {/* Previous Button */}
                  <button
                    onClick={() => setPage((p) => Math.max(0, p - 1))}
                    disabled={page === 0}
                    className="px-4 py-2 border border-cbg rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-mbg transition-colors"
                  >
                    ← Önceki
                  </button>

                  {/* Page Numbers */}
                  <div className="flex gap-2">
                    {[...Array(totalPages)].map((_, i) => (
                      <button
                        key={i}
                        onClick={() => setPage(i)}
                        className={`w-10 h-10 rounded-lg font-bold transition-colors ${
                          i === page
                            ? "bg-cta text-white"
                            : "border border-cbg hover:bg-mbg"
                        }`}
                      >
                        {i + 1}
                      </button>
                    ))}
                  </div>

                  {/* Next Button */}
                  <button
                    onClick={() =>
                      setPage((p) => Math.min(totalPages - 1, p + 1))
                    }
                    disabled={page === totalPages - 1}
                    className="px-4 py-2 border border-cbg rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-mbg transition-colors"
                  >
                    Sonraki →
                  </button>
                </div>
              )}

              {/* Results Info */}
              <div className="mt-8 text-center text-sm text-sti">
                <p>
                  {filteredBlogs.length} blog gösteriliyor
                  {totalPages > 1 && ` (Sayfa ${page + 1} / ${totalPages})`}
                </p>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default BlogPage;
