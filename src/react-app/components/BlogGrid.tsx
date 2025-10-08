

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, User, ArrowRight, MessageCircle, Clock, BookOpen } from 'lucide-react';

interface BlogPost {
  id: number;
  slug: string;
  title: string;
  subtitle?: string;
  body_html: string;
  categories?: string;
  tags?: string;
  publication_date: string;
  author: string;
  social_links?: string;
  created_at: string;
  updated_at: string;
}

interface BlogGridProps {
  limit?: number;
  showTitle?: boolean;
}

export const BlogGrid: React.FC<BlogGridProps> = ({ limit, showTitle = true }) => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchBlogPosts();
  }, []);

  const fetchBlogPosts = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('/api/blog');
      if (!response.ok) {
        throw new Error('Failed to fetch blog posts');
      }
      
      const data = await response.json();
      
      // Ensure data is an array
      if (!Array.isArray(data)) {
        throw new Error('Invalid data format received');
      }
      
      let filteredPosts = data;
      if (limit && limit > 0) {
        filteredPosts = data.slice(0, limit);
      }
      
      setPosts(filteredPosts);
    } catch (err) {
      setError('Erro ao carregar posts do blog');
      console.error('Error fetching blog posts:', err);
      setPosts([]);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-PT', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getExcerpt = (html: string, maxLength: number = 160) => {
    const text = html.replace(/<[^>]*>/g, '');
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {[...Array(6)].map((_, index) => (
          <div key={index} className="bg-gray-900 rounded-lg overflow-hidden animate-pulse border border-gray-800 shadow-modern">
            <div className="h-48 bg-warm-grey"></div>
            <div className="p-6">
              <div className="h-4 bg-warm-grey rounded mb-2"></div>
              <div className="h-4 bg-warm-grey rounded mb-4 w-3/4"></div>
              <div className="h-3 bg-warm-grey rounded mb-2"></div>
              <div className="h-3 bg-warm-grey rounded w-1/2"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-alert-red mb-4">{error}</p>
        <button 
          onClick={fetchBlogPosts}
          className="px-6 py-3 bg-gold text-white rounded-lg hover:bg-deep-teal transition-colors duration-300"
          style={{ fontFamily: 'Inter, Goldman Sans, sans-serif' }}
        >
          Tentar Novamente
        </button>
      </div>
    );
  }

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {showTitle && (
          <div className="text-center mb-12">
            <div className="flex items-center justify-center space-x-3 mb-4">
              <BookOpen className="h-8 w-8 text-gold" />
              <h2 className="text-4xl font-bold text-dark-teal" style={{ fontFamily: 'Inter, Goldman Sans, sans-serif' }}>
                Blog & Análises
              </h2>
            </div>
            <p className="text-dark-grey text-lg max-w-2xl mx-auto">
              Insights, opiniões e análises aprofundadas sobre o setor bancário angolano
            </p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post, index) => (
            <article 
              key={post.id}
              className={`bg-white rounded-lg overflow-hidden hover:transform hover:scale-105 transition-smooth border border-light-grey hover:border-gold shadow-modern hover:shadow-modern-lg group ${
                index === 0 && !limit ? 'md:col-span-2 lg:col-span-1' : ''
              }`}
            >
              {/* Post Image */}
              <div className="relative h-48 bg-gradient-to-br from-light-gold to-warm-grey overflow-hidden">
                <img
                  src="https://heyboss.heeyo.ai/1758897508-e3099f0c.webp"
                  alt={post.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-white/10 group-hover:bg-white/0 transition-colors duration-300"></div>
                
                {/* Blog Badge */}
                <div className="absolute top-4 left-4">
                  <span className="bg-deep-teal text-white px-3 py-1 rounded-full text-xs font-semibold flex items-center space-x-1">
                    <BookOpen className="h-3 w-3" />
                    <span>Blog</span>
                  </span>
                </div>

                {/* Category */}
                {post.categories && (
                  <div className="absolute bottom-4 left-4">
                    <span className="bg-white/90 text-deep-teal px-3 py-1 rounded-full text-xs font-medium border border-deep-teal/20">
                      {post.categories}
                    </span>
                  </div>
                )}
              </div>

              {/* Post Content */}
              <div className="p-6">
                {/* Meta Information */}
                <div className="flex items-center space-x-4 text-xs text-medium-grey mb-3">
                  <div className="flex items-center space-x-1">
                    <Calendar className="h-3 w-3" />
                    <span>{formatDate(post.publication_date)}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <User className="h-3 w-3" />
                    <span>{post.author}</span>
                  </div>
                </div>

                {/* Title */}
                <h3 className="font-bold text-dark-teal mb-2 group-hover:text-gold transition-colors duration-300 line-clamp-2" 
                    style={{ fontFamily: 'Inter, Goldman Sans, sans-serif' }}>
                  {post.title}
                </h3>

                {/* Subtitle */}
                {post.subtitle && (
                  <p className="text-dark-grey text-sm mb-3 line-clamp-2">
                    {post.subtitle}
                  </p>
                )}

                {/* Excerpt */}
                <p className="text-medium-grey text-sm mb-4 line-clamp-3">
                  {getExcerpt(post.body_html)}
                </p>

                {/* Tags */}
                {post.tags && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {post.tags.split(',').slice(0, 3).map((tag, idx) => (
                      <span 
                        key={idx}
                        className="text-xs bg-light-gold text-deep-teal px-2 py-1 rounded-full border border-light-grey"
                      >
                        #{tag.trim()}
                      </span>
                    ))}
                  </div>
                )}

                {/* Read More Link */}
                <Link
                  to={`/blog/${post.slug}`}
                  className="inline-flex items-center text-gold hover:text-deep-teal font-medium text-sm group-hover:gap-2 transition-all duration-300"
                  style={{ fontFamily: 'Inter, Goldman Sans, sans-serif' }}
                >
                  Ler Artigo Completo
                  <ArrowRight className="ml-1 h-4 w-4 group-hover:translate-x-1 transition-transform duration-300" />
                </Link>
              </div>
            </article>
          ))}
        </div>

        {/* View All Button */}
        {limit && (
          <div className="text-center mt-12">
            <Link
              to="/blog"
              className="inline-flex items-center px-8 py-4 bg-gold text-white font-semibold rounded-lg hover:bg-deep-teal transition-all duration-300 group shadow-md"
              style={{ fontFamily: 'Inter, Goldman Sans, sans-serif' }}
            >
              Ver Todos os Artigos
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
            </Link>
          </div>
        )}
      </div>
    </section>
  );
};

