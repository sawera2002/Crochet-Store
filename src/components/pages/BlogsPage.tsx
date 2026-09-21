import React, { useState } from 'react';
import { BLOG_POSTS, getWhatsAppUrl } from '../../data/contentData';
import { BlogPost } from '../../types';
import { useStore } from '../../context/StoreContext';
import {
  BookOpen,
  Clock,
  Sparkles,
  ArrowRight,
  MessageCircle,
  X,
  Share2
} from 'lucide-react';

export const BlogsPage: React.FC = () => {
  const { settings } = useStore();
  const [selectedBlog, setSelectedBlog] = useState<BlogPost | null>(null);

  const handleWhatsAppShare = (post: BlogPost) => {
    const text = `Check out this crochet guide by Zarsal Karachi: "${post.title}"`;
    const url = getWhatsAppUrl(settings.whatsappNumber, text);
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="bg-[#faf8f2] text-[#012f3d] py-10 sm:py-14">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Page Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-[#6ac8c1]/40 text-[#012f3d] text-xs font-semibold uppercase tracking-wider shadow-2xs">
            <Sparkles className="w-3.5 h-3.5 text-[#6ac8c1]" />
            <span>Crochet Guides &amp; Handcraft Journal</span>
          </div>

          <h1 className="font-serif text-4xl sm:text-5xl font-bold text-[#012f3d] tracking-tight">
            Zarsal Handcraft Journal
          </h1>

          <p className="text-[#2d5560] text-sm leading-relaxed">
            Washing instructions, styling tips for milk cotton accessories, and stories behind traditional handmade crochet art.
          </p>
        </div>

        {/* Blogs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {BLOG_POSTS.map((post) => (
            <article
              key={post.id}
              className="bg-white rounded-2xl border border-[#6ac8c1]/30 hover:border-[#012f3d] overflow-hidden shadow-2xs hover:shadow-md transition-all duration-300 flex flex-col justify-between group"
            >
              <div>
                {/* Blog Image */}
                <div className="relative aspect-16/10 overflow-hidden bg-[#f5f1e8]">
                  <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute top-3 left-3 px-2.5 py-1 rounded-lg bg-[#012f3d] text-[#faf8f2] text-[10px] font-bold tracking-wider uppercase">
                    {post.category}
                  </div>
                </div>

                {/* Content info */}
                <div className="p-6">
                  <div className="flex items-center gap-2 text-[11px] text-[#4a707a] mb-2 font-medium">
                    <span>{post.date}</span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-[#6ac8c1]" />
                      {post.readTime}
                    </span>
                  </div>

                  <h2 className="font-serif font-bold text-xl text-[#012f3d] leading-snug group-hover:text-[#024357] transition">
                    {post.title}
                  </h2>

                  <p className="text-xs text-[#2d5560] mt-2 line-clamp-3 leading-relaxed">
                    {post.subtitle}
                  </p>
                </div>
              </div>

              {/* Action */}
              <div className="px-6 pb-6 pt-2 flex items-center justify-between border-t border-[#f1ede1] mt-2">
                <button
                  onClick={() => setSelectedBlog(post)}
                  className="text-xs font-bold text-[#012f3d] hover:text-[#024357] flex items-center gap-1.5 cursor-pointer underline underline-offset-4"
                >
                  <span>Read Full Guide</span>
                  <ArrowRight className="w-3.5 h-3.5 text-[#6ac8c1]" />
                </button>

                <button
                  onClick={() => handleWhatsAppShare(post)}
                  className="p-2 rounded-xl text-[#012f3d] hover:bg-[#25D366]/15 hover:text-[#25D366] transition cursor-pointer"
                  title="Ask on WhatsApp"
                >
                  <MessageCircle className="w-4 h-4" />
                </button>
              </div>
            </article>
          ))}
        </div>

        {/* Full Blog Reading Modal */}
        {selectedBlog && (
          <div className="fixed inset-0 z-50 bg-[#012f3d]/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white w-full max-w-2xl max-h-[85vh] rounded-3xl overflow-hidden shadow-2xl flex flex-col border border-[#6ac8c1]/40 animate-in fade-in zoom-in-95 duration-200">
              {/* Modal Header */}
              <div className="p-5 border-b border-[#f1ede1] flex items-center justify-between bg-[#faf8f2]">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-md bg-[#012f3d] text-[#faf8f2] text-[10px] font-bold uppercase">
                    {selectedBlog.category}
                  </span>
                  <span className="text-xs text-[#4a707a]">{selectedBlog.readTime}</span>
                </div>
                <button
                  onClick={() => setSelectedBlog(null)}
                  className="w-8 h-8 rounded-full bg-white hover:bg-[#012f3d] text-[#012f3d] hover:text-white flex items-center justify-center border border-[#6ac8c1]/30 transition cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-6 overflow-y-auto space-y-4">
                <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#012f3d] leading-tight">
                  {selectedBlog.title}
                </h2>
                <p className="text-sm font-medium text-[#2d5560] italic border-l-2 border-[#6ac8c1] pl-3 py-1">
                  {selectedBlog.subtitle}
                </p>

                <div className="rounded-2xl overflow-hidden aspect-16/9 bg-[#faf8f2] my-4">
                  <img
                    src={selectedBlog.image}
                    alt={selectedBlog.title}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="space-y-3 text-xs sm:text-sm text-[#012f3d] leading-relaxed">
                  {selectedBlog.content.map((paragraph, idx) => (
                    <p key={idx} className="leading-relaxed">
                      {paragraph}
                    </p>
                  ))}
                </div>
              </div>

              {/* Modal Footer */}
              <div className="p-4 border-t border-[#f1ede1] bg-[#faf8f2] flex items-center justify-between">
                <span className="text-xs text-[#4a707a]">
                  Published by Zarsal Karachi Studio
                </span>
                <button
                  onClick={() => handleWhatsAppShare(selectedBlog)}
                  className="px-4 py-2 bg-[#25D366] hover:bg-[#20b858] text-white rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-xs transition"
                >
                  <MessageCircle className="w-3.5 h-3.5 fill-white" />
                  <span>Discuss on WhatsApp</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
