

/**
 * @description This file defines the BlogDetailPage, which renders the full content of a single blog post.
 * It fetches the specific blog post from the API using the URL slug.
 * The component provides a rich reading experience with a clear layout, including author and date metadata, and is styled consistently with the rest of the site.
 */

import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { Calendar, User, ArrowLeft, Loader, Share2, BookOpen } from 'lucide-react';

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

export const BlogDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (slug) {
      fetchPost(slug);
    }
  }, [slug]);

  const fetchPost = async (postSlug: string) => {
    try {
      setLoading(true);
      const response = await fetch(`/api/blog/${postSlug}`);
      if (!response.ok) {
        throw new Error('Failed to fetch blog post');
      }
      const data = await response.json();
      setPost(data);
    } catch (err) {
      setError('Erro ao carregar post do blog');
      console.error('Error fetching blog post:', err);
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
        title: post?.title,
        text: post?.subtitle,
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
      <div className="min-h-screen bg-black">
        <Header />
        <main className="pt-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="flex items-center justify-center min-h-[400px]">
              <div className="text-center">
                <Loader className="h-8 w-8 animate-spin text-yellow-400 mx-auto mb-4" />
                <p className="text-gray-400">Carregando post...</p>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="min-h-screen bg-black">
        <Header />
        <main className="pt-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="text-center">
              <p className="text-red-400 mb-4">{error || 'Post não encontrado'}</p>
              <Link
                to="/blog"
                className="inline-flex items-center px-6 py-3 bg-yellow-400 text-black rounded-lg hover:bg-yellow-300 transition-colors duration-300"
                style={{ fontFamily: 'Inter, Goldman Sans, sans-serif' }}
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Voltar ao Blog
              </Link>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      <Header />
      <main className="pt-16">
        {/* Back Navigation */}
        <div className="bg-gray-950 border-b border-gray-800">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <Link
              to="/blog"
              className="inline-flex items-center text-gray-400 hover:text-yellow-400 transition-colors duration-300"
              style={{ fontFamily: 'Inter, Goldman Sans, sans-serif' }}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Voltar ao Blog
            </Link>
          </div>
        </div>

        {/* Article Content */}
        <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          {/* Article Header */}
          <header className="mb-8">
            <div className="mb-4">
              <span className="bg-yellow-400 text-black px-3 py-1 rounded-full text-sm font-semibold flex items-center space-x-1 w-fit">
                <BookOpen className="h-3 w-3" />
                <span>Blog</span>
              </span>
            </div>

            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 leading-tight" 
                style={{ fontFamily: 'Inter, Goldman Sans, sans-serif' }}>
              {post.title}
            </h1>

            {post.subtitle && (
              <p className="text-xl text-gray-400 mb-6 leading-relaxed">
                {post.subtitle}
              </p>
            )}

            {/* Meta Information */}
            <div className="flex flex-wrap items-center gap-6 text-sm text-gray-500 mb-8">
              <div className="flex items-center space-x-2">
                <Calendar className="h-4 w-4" />
                <span>{formatDate(post.publication_date)}</span>
              </div>
              <div className="flex items-center space-x-2">
                <User className="h-4 w-4" />
                <span>{post.author}</span>
              </div>
              {post.categories && (
                <span className="bg-gray-800 text-yellow-400 px-3 py-1 rounded-full text-xs">
                  {post.categories}
                </span>
              )}
            </div>

            {/* Article Image */}
            <div className="mb-8">
              <img
                src="https://heyboss.heeyo.ai/1758897508-e3099f0c.webp"
                alt={post.title}
                className="w-full h-64 md:h-80 object-cover rounded-lg"
              />
            </div>
          </header>

          {/* Article Body */}
          <div 
            className="prose prose-lg prose-invert max-w-none mb-8"
            dangerouslySetInnerHTML={{ __html: post.body_html }}
            style={{
              color: '#e5e7eb',
              lineHeight: '1.8'
            }}
          />

          {/* Tags */}
          {post.tags && (
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-white mb-4" 
                  style={{ fontFamily: 'Inter, Goldman Sans, sans-serif' }}>
                Tags
              </h3>
              <div className="flex flex-wrap gap-2">
                {post.tags.split(',').map((tag, index) => (
                  <span 
                    key={index}
                    className="text-sm bg-gray-800 text-gray-300 px-3 py-1 rounded-full"
                  >
                    #{tag.trim()}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Share Button */}
          <div className="flex items-center justify-between border-t border-gray-800 pt-8">
            <button
              onClick={handleShare}
              className="inline-flex items-center px-6 py-3 border-2 border-yellow-400 text-yellow-400 font-medium rounded-lg hover:bg-yellow-400 hover:text-black transition-all duration-300"
              style={{ fontFamily: 'Inter, Goldman Sans, sans-serif' }}
            >
              <Share2 className="mr-2 h-4 w-4" />
              Compartilhar
            </button>

            <Link
              to="/blog"
              className="inline-flex items-center px-6 py-3 bg-yellow-400 text-black font-semibold rounded-lg hover:bg-yellow-300 transition-all duration-300"
              style={{ fontFamily: 'Inter, Goldman Sans, sans-serif' }}
            >
              Ver Mais Artigos
            </Link>
          </div>
        </article>
      </main>
      <Footer />
    </div>
  );
};

