


import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, ExternalLink } from 'lucide-react';

interface Sponsor {
  id: number;
  name: string;
  logo_url: string;
  description?: string;
  website_url: string;
  display_order: number;
  is_active: number;
  created_at: string;
  updated_at: string;
}

interface SponsorsCarouselProps {
  showTitle?: boolean;
  autoplay?: boolean;
}

export const SponsorsCarousel: React.FC<SponsorsCarouselProps> = ({ 
  showTitle = true, 
  autoplay = true 
}) => {
  const [sponsors, setSponsors] = useState<Sponsor[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(autoplay);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const carouselRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchSponsors();
  }, []);

  useEffect(() => {
    if (isPlaying && sponsors.length > 0) {
      intervalRef.current = setInterval(() => {
        setCurrentIndex((prevIndex) => 
          prevIndex >= sponsors.length - 1 ? 0 : prevIndex + 1
        );
      }, 4000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isPlaying, sponsors.length]);

  const fetchSponsors = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/sponsors');
      if (!response.ok) {
        throw new Error('Failed to fetch sponsors');
      }
      const data = await response.json();
      
      // Ensure data is an array
      if (Array.isArray(data)) {
        setSponsors(data);
      } else {
        console.warn('Invalid sponsors data format received');
        setSponsors([]);
      }
    } catch (err) {
      console.error('Error fetching sponsors:', err);
      setSponsors([]);
    } finally {
      setLoading(false);
    }
  };

  const goToNext = () => {
    if (sponsors.length === 0) return;
    setCurrentIndex((prevIndex) => 
      prevIndex >= sponsors.length - 1 ? 0 : prevIndex + 1
    );
  };

  const goToPrevious = () => {
    if (sponsors.length === 0) return;
    setCurrentIndex((prevIndex) => 
      prevIndex <= 0 ? sponsors.length - 1 : prevIndex - 1
    );
  };

  const goToSlide = (index: number) => {
    if (sponsors.length === 0 || index < 0 || index >= sponsors.length) return;
    setCurrentIndex(index);
  };

  if (loading) {
    return (
      <section className="py-16 bg-gray-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8">
            {[...Array(6)].map((_, index) => (
              <div key={index} className="bg-gray-900 rounded-lg p-6 animate-pulse">
                <div className="h-16 bg-gray-800 rounded"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (sponsors.length === 0) {
    return null;
  }

  // Calculate how many sponsors to show per view
  const sponsorsPerView = 4;
  const maxIndex = Math.max(0, sponsors.length - sponsorsPerView);

  return (
    <section className="py-20 bg-warm-grey border-t border-light-grey">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {showTitle && (
          <div className="text-center mb-16">
            <div className="flex items-center justify-center space-x-3 mb-6">
              <div className="w-1 h-8 bg-gold"></div>
              <h2 className="text-4xl font-bold text-dark-teal uppercase tracking-wider" 
                  style={{ fontFamily: 'Inter, Goldman Sans, sans-serif' }}>
                PARCEIROS & PATROCINADORES
              </h2>
            </div>
            <p className="text-dark-grey text-lg max-w-3xl mx-auto leading-relaxed">
              Em parceria com as principais instituições financeiras de Angola
            </p>
          </div>
        )}

        {/* Clean sponsors display matching inspiration footer */}
        <div className="bg-white rounded-xl p-8 shadow-modern border border-light-grey">
          <div className="flex flex-wrap items-center justify-center gap-8 md:gap-12">
            {sponsors.map((sponsor) => (
              <a
                key={sponsor.id}
                href={sponsor.website_url}
                target="_blank"
                rel="noopener noreferrer"
                className="block group transition-all duration-300 hover:scale-110"
              >
                <img
                  src={sponsor.logo_url}
                  alt={sponsor.name}
                  className="h-12 md:h-16 max-w-32 object-contain filter grayscale group-hover:grayscale-0 transition-all duration-300 opacity-70 group-hover:opacity-100"
                />
              </a>
            ))}
          </div>
        </div>

        {/* Partner CTA */}
        <div className="text-center mt-12">
          <p className="text-dark-grey mb-4">Interessado em se tornar nosso parceiro?</p>
          <a
            href="/contato"
            className="inline-flex items-center px-6 py-3 border-2 border-gold text-gold font-medium rounded-lg hover:bg-gold hover:text-white transition-all duration-300 shadow-md"
            style={{ fontFamily: 'Inter, Goldman Sans, sans-serif' }}
          >
            Entre em Contato
            <ExternalLink className="ml-2 h-4 w-4" />
          </a>
        </div>
      </div>
    </section>
  );
};


