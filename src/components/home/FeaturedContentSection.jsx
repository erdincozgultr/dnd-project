// src/components/home/FeaturedContentSection.jsx
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Sparkles, ScrollText, Flame, Eye, ChevronRight, 
  Loader2, BookOpen, Clock, User
} from 'lucide-react';
import useAxios, { METHODS } from '../../hooks/useAxios';
import UserHoverCard from '../common/UserHoverCard';

const FeaturedContentSection = () => {
  const [homebrews, setHomebrews] = useState([]);
  const [blogs, setBlogs] = useState([]);
  const { sendRequest, loading } = useAxios();

  useEffect(() => {
    // Latest Homebrews
    sendRequest({
      url: '/homebrews/public',
      method: METHODS.GET,
      params: { page: 0, size: 4 },
      callbackSuccess: (res) => setHomebrews(res.data.content || res.data),
      showErrorToast: false,
    });

    // Latest Blogs
    sendRequest({
      url: '/blogs/list/public',
      method: METHODS.GET,
      params: { page: 0, size: 3 },
      callbackSuccess: (res) => setBlogs(res.data.content || res.data),
      showErrorToast: false,
    });
  }, []);

  return (
    <section className="py-16 bg-mbg">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-600 text-sm font-bold uppercase tracking-wider mb-4">
            <Sparkles size={16} />
            Yeni Eklenenler
          </div>
          <h2 className="text-3xl md:text-4xl font-black text-mtf mb-3">
            Topluluk <span className="text-purple-600">Eserleri</span>
          </h2>
          <p className="text-sti max-w-xl mx-auto">
            Maceracıların yarattığı en yeni homebrew içerikler ve yazılar
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="animate-spin text-cta" size={40} />
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Homebrews Column */}
            <div className="lg:col-span-2">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-black text-mtf flex items-center gap-2 uppercase tracking-tight">
                  <ScrollText size={20} className="text-purple-500" />
                  Homebrew İçerikler
                </h3>
                <Link 
                  to="/wiki?tab=homebrew" 
                  className="text-sm font-bold text-cta hover:underline flex items-center gap-1"
                >
                  Tümünü Gör <ChevronRight size={16} />
                </Link>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {homebrews.slice(0, 4).map((item) => (
                  <Link
                    key={item.id}
                    to={`/homebrew/${item.slug}`}
                    className="group bg-white border border-cbg rounded-2xl overflow-hidden hover:border-purple-500/50 hover:shadow-lg hover:shadow-purple-500/10 transition-all duration-300"
                  >
                    {/* Image */}
                    <div className="h-32 bg-gradient-to-br from-purple-500/10 to-indigo-500/10 relative overflow-hidden">
                      {item.imageUrl ? (
                        <img 
                          src={item.imageUrl} 
                          alt={item.name} 
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <ScrollText size={40} className="text-purple-500/30" />
                        </div>
                      )}
                      {/* Category Badge */}
                      <span className="absolute top-3 left-3 px-2 py-1 bg-black/60 backdrop-blur-sm text-white text-[10px] font-bold uppercase rounded-lg">
                        {item.category}
                      </span>
                    </div>

                    {/* Content */}
                    <div className="p-4">
                      <h4 className="font-bold text-mtf group-hover:text-purple-600 transition-colors line-clamp-1 mb-1">
                        {item.name || item.title}
                      </h4>
                      <p className="text-xs text-sti line-clamp-2 mb-3">
                        {item.excerpt || item.description}
                      </p>

                      {/* Footer */}
                      <div className="flex items-center justify-between text-xs">
                        <UserHoverCard username={item.author?.username}>
                          <span className="text-sti hover:text-cta cursor-pointer flex items-center gap-1">
                            <User size={12} />
                            {item.author?.displayName || item.author?.username}
                          </span>
                        </UserHoverCard>
                        <div className="flex items-center gap-3 text-sti">
                          <span className="flex items-center gap-1">
                            <Flame size={12} className="text-red-400" /> {item.likeCount || 0}
                          </span>
                          <span className="flex items-center gap-1">
                            <Eye size={12} /> {item.viewCount || 0}
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* Blogs Column */}
            <div>
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-black text-mtf flex items-center gap-2 uppercase tracking-tight">
                  <BookOpen size={20} className="text-cta" />
                  Blog Yazıları
                </h3>
                <Link 
                  to="/blog" 
                  className="text-sm font-bold text-cta hover:underline flex items-center gap-1"
                >
                  Tümü <ChevronRight size={16} />
                </Link>
              </div>

              <div className="space-y-4">
                {blogs.slice(0, 3).map((blog) => (
                  <Link
                    key={blog.id}
                    to={`/blog/${blog.slug}`}
                    className="group flex gap-4 p-4 bg-white border border-cbg rounded-2xl hover:border-cta/50 hover:shadow-lg transition-all duration-300"
                  >
                    {/* Thumbnail */}
                    <div className="w-20 h-20 rounded-xl bg-gradient-to-br from-cta/10 to-orange-500/10 flex-shrink-0 overflow-hidden">
                      {blog.thumbnailUrl ? (
                        <img 
                          src={blog.thumbnailUrl} 
                          alt={blog.title} 
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <BookOpen size={24} className="text-cta/30" />
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-mtf group-hover:text-cta transition-colors line-clamp-2 text-sm mb-1">
                        {blog.title}
                      </h4>
                      <div className="flex items-center gap-3 text-[10px] text-sti">
                        <UserHoverCard username={blog.author?.username}>
                          <span className="hover:text-cta cursor-pointer">
                            {blog.author?.displayName || blog.author?.username}
                          </span>
                        </UserHoverCard>
                        <span className="flex items-center gap-1">
                          <Clock size={10} /> {blog.readingTime || 5} dk
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}

                {blogs.length === 0 && (
                  <div className="text-center py-8 bg-white border border-cbg rounded-2xl">
                    <BookOpen size={32} className="mx-auto text-cbg mb-2" />
                    <p className="text-sti text-sm">Henüz yazı yok</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default FeaturedContentSection;