

/**
 * @description This file defines the HeroSection component featuring a full-width financial background image with a dark overlay and gold headline text.
 * It uses the provided financial district images and creates a premium, editorial feel inspired by Goldman Sachs design language.
 * The component includes call-to-action buttons and uses responsive design for optimal display across all devices.
 */

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, TrendingUp, Calendar, BookOpen } from 'lucide-react';

interface Banner {
  id: number;
  title: string;
  subtitle?: string;
  banner_image_url: string;
  link_url?: string;
  display_order: number;
  is_active: number;
  created_at: string;
  updated_at: string;
}

export const HeroSection: React.FC = () => {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [currentBanner, setCurrentBanner] = useState<Banner | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBanners();
  }, []);

  const fetchBanners = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/banners');
      if (!response.ok) {
        throw new Error('Failed to fetch banners');
      }
      const data = await response.json();
      
      // Ensure data is an array and has valid content
      if (Array.isArray(data) && data.length > 0) {
        setBanners(data);
        setCurrentBanner(data[0]); // Use first active banner
      } else {
        // Use fallback banner when no data is available
        setFallbackBanner();
      }
    } catch (err) {
      console.error('Error fetching banners:', err);
      setFallbackBanner();
    } finally {
      setLoading(false);
    }
  };

  const setFallbackBanner = () => {
    const fallbackBanner: Banner = {
      id: 1,
      title: 'O PORTAL DO SETOR BANCÁRIO ANGOLANO',
      subtitle: 'Informação de qualidade, análises aprofundadas e as últimas novidades do mercado financeiro em Angola',
      banner_image_url: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80',
      link_url: '/noticias',
      display_order: 1,
      is_active: 1,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    setCurrentBanner(fallbackBanner);
    setBanners([fallbackBanner]);
  };

  if (loading || !currentBanner) {
    return (
      <section className="relative h-screen flex items-center justify-center overflow-hidden bg-black">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Loading...</p>
        </div>
      </section>
    );
  }

  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden bg-gray-50">
      {/* Background Image - Using appropriate financial background */}
      <div className="absolute inset-0">
        <img
          src="https://heyboss.heeyo.ai/1759403689-2e88aa22.webp"
          alt={currentBanner.title}
          className="w-full h-full object-cover"
          onError={(e) => {
            // Fallback to banking/finance image if the primary image fails to load
            const target = e.target as HTMLImageElement;
            target.src = "https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80";
          }}
        />
        {/* Light overlay with subtle gradient for readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-white/85 via-white/70 to-white/90"></div>
      </div>

      {/* Content - Centered with gold accents */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="max-w-5xl mx-auto">
          {/* Main Headline - Gold accent with dark text for contrast */}
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-dark-teal mb-8 leading-tight" 
              style={{ fontFamily: 'Inter, Goldman Sans, sans-serif' }}>
            {currentBanner.title.split(' ').map((word, index) => (
              <span key={index} className={index % 3 === 0 ? 'text-gold' : 'text-dark-teal'}>
                {word}{' '}
              </span>
            ))}
          </h1>

          {/* Subtitle - Dark text with good contrast */}
          {currentBanner.subtitle && (
            <p className="text-xl md:text-2xl text-dark-grey mb-12 leading-relaxed max-w-4xl mx-auto font-medium">
              {currentBanner.subtitle}
            </p>
          )}

          {/* Call-to-Action Button - Gold button with white text */}
          <div className="mb-16">
            <Link
              to={currentBanner.link_url || "/noticias"}
              className="inline-flex items-center px-12 py-5 bg-gold text-white font-bold text-lg rounded-lg hover:bg-deep-teal transition-all duration-300 transform hover:scale-105 group shadow-lg"
              style={{ fontFamily: 'Inter, Goldman Sans, sans-serif' }}
            >
              Ler Mais
              <ChevronRight className="ml-2 h-6 w-6 group-hover:translate-x-1 transition-transform duration-300" />
            </Link>
          </div>

          {/* Premium Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 max-w-5xl mx-auto">
            <div className="text-center">
              <div className="bg-white border-2 border-gold/30 rounded-lg p-6 shadow-lg hover:shadow-xl transition-shadow duration-300">
                <TrendingUp className="h-12 w-12 text-gold mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-dark-teal mb-3" 
                    style={{ fontFamily: 'Inter, Goldman Sans, sans-serif' }}>
                  Notícias Exclusivas
                </h3>
                <p className="text-dark-grey leading-relaxed">
                  Cobertura completa das principais mudanças no setor bancário
                </p>
              </div>
            </div>

            <div className="text-center">
              <div className="bg-white border-2 border-gold/30 rounded-lg p-6 shadow-lg hover:shadow-xl transition-shadow duration-300">
                <BookOpen className="h-12 w-12 text-gold mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-dark-teal mb-3" 
                    style={{ fontFamily: 'Inter, Goldman Sans, sans-serif' }}>
                  Análises Profundas
                </h3>
                <p className="text-dark-grey leading-relaxed">
                  Insights e opinião de especialistas do mercado financeiro
                </p>
              </div>
            </div>

            <div className="text-center">
              <div className="bg-white border-2 border-gold/30 rounded-lg p-6 shadow-lg hover:shadow-xl transition-shadow duration-300">
                <Calendar className="h-12 w-12 text-gold mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-dark-teal mb-3" 
                    style={{ fontFamily: 'Inter, Goldman Sans, sans-serif' }}>
                  Eventos Premium
                </h3>
                <p className="text-dark-grey leading-relaxed">
                  Networking e conhecimento nos principais eventos do setor
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-8 h-8 rounded-full border-2 border-gold flex items-center justify-center bg-white shadow-md">
            <ChevronRight className="h-4 w-4 text-gold rotate-90" />
          </div>
        </div>
      </div>
    </section>
  );
};

