


/**
 * @description This file defines the NewsGrid component that displays news articles in a responsive grid layout.
 * It fetches real data from the Worker API and features the new brand color palette with gold, deep teal, and modern styling.
 * The component handles loading states and error handling while maintaining sophisticated banking credibility aesthetics.
 */

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, User, ArrowRight, TrendingUp } from 'lucide-react';

interface NewsArticle {
  id: number;
  slug: string;
  title: string;
  subtitle?: string;
  body_html: string;
  categories?: string;
  tags?: string;
  publication_date: string;
  author: string;
  is_featured: number;
  social_links?: string;
  created_at: string;
  updated_at: string;
}

interface NewsGridProps {
  limit?: number;
  showTitle?: boolean;
  featured?: boolean;
}

export const NewsGrid: React.FC<NewsGridProps> = ({ limit, showTitle = true, featured = false }) => {
  const [news, setNews] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchNews();
  }, []);

  const fetchNews = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('/api/news');
      if (!response.ok) {
        throw new Error('Failed to fetch news');
      }
      
      const data = await response.json();
      
      // Ensure data is an array
      if (!Array.isArray(data)) {
        throw new Error('Invalid data format received');
      }
      
      let filteredNews = data;
      if (featured) {
        filteredNews = data.filter((article: NewsArticle) => article.is_featured === 1);
      }
      
      if (limit && limit > 0) {
        filteredNews = filteredNews.slice(0, limit);
      }
      
      setNews(filteredNews);
    } catch (err) {
      setError('Erro ao carregar notícias');
      console.error('Error fetching news:', err);
      setNews([]);
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

  const getExcerpt = (html: string, maxLength: number = 150) => {
    const text = html.replace(/<[^>]*>/g, '');
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {[...Array(6)].map((_, index) => (
          <div key={index} className="bg-white rounded-lg overflow-hidden animate-pulse border border-light-grey shadow-modern">
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
          onClick={fetchNews}
          className="px-6 py-3 bg-gold text-white rounded-lg hover:bg-gold/90 transition-colors duration-300"
          style={{ fontFamily: 'Inter, Goldman Sans, sans-serif' }}
        >
          Tentar Novamente
        </button>
      </div>
    );
  }

  return (
    <>
      {!showTitle ? (
        /* Compact News Cards for Homepage */
        <div className="space-y-4">
          {news.map((article) => (
            <article 
              key={article.id}
              className="bg-white rounded-lg p-4 border border-light-grey hover:border-gold transition-all duration-300 group shadow-modern hover:shadow-modern-lg"
            >
              {/* Article Header */}
              <div className="flex items-start space-x-4">
                {/* Article Image Thumbnail */}
                <div className="relative w-20 h-20 bg-gradient-to-br from-warm-grey to-light-gold rounded-lg overflow-hidden flex-shrink-0">
                  <img
                    src="https://heyboss.heeyo.ai/1758897508-a34aa3b4.webp"
                    alt={article.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  {article.is_featured === 1 && (
                    <div className="absolute top-1 left-1">
                      <div className="w-2 h-2 bg-gold rounded-full"></div>
                    </div>
                  )}
                </div>

                {/* Article Content */}
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-dark-teal mb-1 group-hover:text-gold transition-colors duration-300 line-clamp-2" 
                      style={{ fontFamily: 'Inter, Goldman Sans, sans-serif' }}>
                    <Link to={`/noticias/${article.slug}`}>
                      {article.title}
                    </Link>
                  </h3>
                  
                  <p className="text-dark-grey text-sm mb-2 line-clamp-2">
                    {getExcerpt(article.body_html, 60)}
                  </p>

                  {/* Meta Information */}
                  <div className="flex items-center space-x-3 text-xs text-medium-grey">
                    <span>{formatDate(article.publication_date)}</span>
                    <span>•</span>
                    <span>{article.author}</span>
                    {article.categories && (
                      <>
                        <span>•</span>
                        <span className="text-gold">{article.categories}</span>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      ) : (
        /* Full News Page Layout */
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {showTitle && (
              <div className="text-center mb-12">
                <div className="flex items-center justify-center space-x-3 mb-4">
                  <TrendingUp className="h-8 w-8 text-gold" />
                  <h2 className="text-4xl font-bold text-dark-teal" style={{ fontFamily: 'Inter, Goldman Sans, sans-serif' }}>
                    {featured ? 'Notícias em Destaque' : 'Últimas Notícias'}
                  </h2>
                </div>
                <p className="text-dark-grey text-lg max-w-2xl mx-auto">
                  Mantenha-se informado sobre as principais novidades do setor bancário angolano
                </p>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {news.map((article, index) => (
                <article 
                  key={article.id}
                  className={`bg-white rounded-lg overflow-hidden hover:transform hover:scale-105 transition-all duration-300 border border-light-grey hover:border-gold shadow-modern hover:shadow-modern-lg group ${
                    index === 0 && !limit ? 'md:col-span-2 lg:col-span-1' : ''
                  }`}
                >
                  {/* Article Image */}
                  <div className="relative h-48 bg-gradient-to-br from-light-gold to-warm-grey overflow-hidden">
                    <img
                      src="https://heyboss.heeyo.ai/1758897508-a34aa3b4.webp"
                      alt={article.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-white/10 group-hover:bg-white/0 transition-colors duration-300"></div>
                    
                    {/* Featured Badge */}
                    {article.is_featured === 1 && (
                      <div className="absolute top-4 left-4">
                        <span className="bg-gold text-white px-3 py-1 rounded-full text-xs font-semibold flex items-center space-x-1">
                          <TrendingUp className="h-3 w-3" />
                          <span>Destaque</span>
                        </span>
                      </div>
                    )}

                    {/* Category */}
                    {article.categories && (
                      <div className="absolute bottom-4 left-4">
                        <span className="bg-white/90 text-deep-teal px-3 py-1 rounded-full text-xs font-medium border border-deep-teal/20">
                          {article.categories}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Article Content */}
                  <div className="p-6">
                    {/* Meta Information */}
                    <div className="flex items-center space-x-4 text-xs text-medium-grey mb-3">
                      <div className="flex items-center space-x-1">
                        <Calendar className="h-3 w-3" />
                        <span>{formatDate(article.publication_date)}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <User className="h-3 w-3" />
                        <span>{article.author}</span>
                      </div>
                    </div>

                    {/* Title */}
                    <h3 className="font-bold text-dark-teal mb-2 group-hover:text-gold transition-colors duration-300 line-clamp-2" 
                        style={{ fontFamily: 'Inter, Goldman Sans, sans-serif' }}>
                      {article.title}
                    </h3>

                    {/* Subtitle */}
                    {article.subtitle && (
                      <p className="text-dark-grey text-sm mb-3 line-clamp-2">
                        {article.subtitle}
                      </p>
                    )}

                    {/* Excerpt */}
                    <p className="text-medium-grey text-sm mb-4 line-clamp-3">
                      {getExcerpt(article.body_html)}
                    </p>

                    {/* Tags */}
                    {article.tags && (
                      <div className="flex flex-wrap gap-2 mb-4">
                        {article.tags.split(',').slice(0, 3).map((tag, idx) => (
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
                      to={`/noticias/${article.slug}`}
                      className="inline-flex items-center text-gold hover:text-deep-teal font-medium text-sm group-hover:gap-2 transition-all duration-300"
                      style={{ fontFamily: 'Inter, Goldman Sans, sans-serif' }}
                    >
                      Ler Mais
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
                  to="/noticias"
                  className="inline-flex items-center px-8 py-4 border-2 border-gold text-gold font-semibold rounded-lg hover:bg-gold hover:text-white transition-all duration-300 group shadow-md"
                  style={{ fontFamily: 'Inter, Goldman Sans, sans-serif' }}
                >
                  Ver Todas as Notícias
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
                </Link>
              </div>
            )}
          </div>
        </section>
      )}
    </>
  );
};


