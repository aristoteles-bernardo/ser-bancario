


/**
 * @description This file defines the NewsDetailPage, which displays the full content of a single news article.
 * It fetches the specific article data from the API based on the URL slug.
 * The component includes a detailed layout with brand color palette for sophisticated banking credibility.
 */

import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { Calendar, User, ArrowLeft, Loader, Share2, TrendingUp } from 'lucide-react';

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

export const NewsDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [article, setArticle] = useState<NewsArticle | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (slug) {
      fetchArticle(slug);
    }
  }, [slug]);

  const fetchArticle = async (articleSlug: string) => {
    try {
      setLoading(true);
      const response = await fetch(`/api/news/${articleSlug}`);
      if (!response.ok) {
        throw new Error('Failed to fetch news article');
      }
      const data = await response.json();
      setArticle(data);
    } catch (err) {
      setError('Erro ao carregar artigo');
      console.error('Error fetching news article:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-PT', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: article?.title,
        text: article?.subtitle,
        url: window.location.href,
      });
    } else {
      // Fallback to copy URL to clipboard
      navigator.clipboard.writeText(window.location.href);
      alert('Link copiado para a área de transferência!');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <main className="pt-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="flex items-center justify-center min-h-[400px]">
              <div className="text-center">
                <Loader className="h-8 w-8 animate-spin text-gold mx-auto mb-4" />
                <p className="text-medium-grey">Carregando artigo...</p>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <main className="pt-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="text-center">
              <p className="text-alert-red mb-4">{error || 'Artigo não encontrado'}</p>
              <Link
                to="/noticias"
                className="inline-flex items-center px-6 py-3 bg-gold text-white rounded-lg hover:bg-gold/90 transition-colors duration-300"
                style={{ fontFamily: 'Inter, Goldman Sans, sans-serif' }}
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Voltar às Notícias
              </Link>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="pt-16">
        {/* Back Navigation */}
        <div className="bg-warm-grey border-b border-light-grey">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <Link
              to="/noticias"
              className="inline-flex items-center text-medium-grey hover:text-gold transition-colors duration-300"
              style={{ fontFamily: 'Inter, Goldman Sans, sans-serif' }}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Voltar às Notícias
            </Link>
          </div>
        </div>

        {/* Article Content */}
        <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          {/* Article Header */}
          <header className="mb-8">
            {article.is_featured === 1 && (
              <div className="mb-4">
                <span className="bg-gold text-white px-3 py-1 rounded-full text-sm font-semibold flex items-center space-x-1 w-fit">
                  <TrendingUp className="h-3 w-3" />
                  <span>Destaque</span>
                </span>
              </div>
            )}

            <h1 className="text-4xl md:text-5xl font-bold text-dark-teal mb-4 leading-tight" 
                style={{ fontFamily: 'Inter, Goldman Sans, sans-serif' }}>
              {article.title}
            </h1>

            {article.subtitle && (
              <p className="text-xl text-dark-grey mb-6 leading-relaxed">
                {article.subtitle}
              </p>
            )}

            {/* Meta Information */}
            <div className="flex flex-wrap items-center gap-6 text-sm text-medium-grey mb-8">
              <div className="flex items-center space-x-2">
                <Calendar className="h-4 w-4" />
                <span>{formatDate(article.publication_date)}</span>
              </div>
              <div className="flex items-center space-x-2">
                <User className="h-4 w-4" />
                <span>{article.author}</span>
              </div>
              {article.categories && (
                <span className="bg-light-gold text-deep-teal px-3 py-1 rounded-full text-xs border border-light-grey">
                  {article.categories}
                </span>
              )}
            </div>

            {/* Article Image */}
            <div className="mb-8">
              <img
                src="https://heyboss.heeyo.ai/1758897508-a34aa3b4.webp"
                alt={article.title}
                className="w-full h-64 md:h-80 object-cover rounded-lg border border-light-grey shadow-modern"
              />
            </div>
          </header>

          {/* Article Body */}
          <div 
            className="prose prose-lg max-w-none mb-8"
            dangerouslySetInnerHTML={{ __html: article.body_html }}
            style={{
              color: '#2C2C2C',
              lineHeight: '1.8',
              fontSize: '1.125rem'
            }}
          />

          {/* Tags */}
          {article.tags && (
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-dark-teal mb-4" 
                  style={{ fontFamily: 'Inter, Goldman Sans, sans-serif' }}>
                Tags
              </h3>
              <div className="flex flex-wrap gap-2">
                {article.tags.split(',').map((tag, index) => (
                  <span 
                    key={index}
                    className="text-sm bg-warm-grey text-dark-grey px-3 py-1 rounded-full border border-light-grey"
                  >
                    #{tag.trim()}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Share Button */}
          <div className="flex items-center justify-between border-t border-light-grey pt-8">
            <button
              onClick={handleShare}
              className="inline-flex items-center px-6 py-3 border-2 border-deep-teal text-deep-teal font-medium rounded-lg hover:bg-deep-teal hover:text-white transition-all duration-300"
              style={{ fontFamily: 'Inter, Goldman Sans, sans-serif' }}
            >
              <Share2 className="mr-2 h-4 w-4" />
              Compartilhar
            </button>

            <Link
              to="/noticias"
              className="inline-flex items-center px-6 py-3 bg-gold text-white font-semibold rounded-lg hover:bg-gold/90 transition-all duration-300"
              style={{ fontFamily: 'Inter, Goldman Sans, sans-serif' }}
            >
              Ver Mais Notícias
            </Link>
          </div>
        </article>
      </main>
      <Footer />
    </div>
  );
};


