

/**
 * @description This file defines the EventDetailPage, which provides detailed information about a specific event.
 * It fetches event data from the API using the URL slug and displays all relevant details, such as date, time, location, and a full description.
 * The component maintains the site's visual identity with a consistent Header, Footer, and styling.
 */

import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { CustomForm } from '../components/CustomForm';
import { Calendar, Clock, MapPin, Users, ArrowLeft, Loader, Share2, X } from 'lucide-react';
import allConfigs from '../../shared/form-configs.json';

interface Event {
  id: number;
  slug: string;
  title: string;
  description_html: string;
  event_date: string;
  event_time: string;
  location: string;
  map_embed_url?: string;
  capacity: number;
  created_at: string;
  updated_at: string;
}

export const EventDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [bookingFormData, setBookingFormData] = useState({});

  useEffect(() => {
    if (slug) {
      fetchEvent(slug);
    }
  }, [slug]);

  const fetchEvent = async (eventSlug: string) => {
    try {
      setLoading(true);
      const response = await fetch(`/api/events/${eventSlug}`);
      if (!response.ok) {
        throw new Error('Failed to fetch event');
      }
      const data = await response.json();
      setEvent(data);
    } catch (err) {
      setError('Erro ao carregar evento');
      console.error('Error fetching event:', err);
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

  const formatTime = (timeString: string) => {
    return timeString.substring(0, 5);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: event?.title,
        text: `Evento: ${event?.title} - ${formatDate(event?.event_date || '')}`,
        url: window.location.href,
      });
    } else {
      // Fallback to copy URL to clipboard
      navigator.clipboard.writeText(window.location.href);
      alert('Link copiado para a área de transferência!');
    }
  };

  const handleBookingFormChange = (data: any, errors: any) => {
    setBookingFormData(data);
  };

  const handleBookingSubmit = async (formData: any) => {
    try {
      const response = await fetch('/api/forms/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          formId: 'event_booking',
          event_id: event?.id,
          event_title: event?.title,
          ...formData 
        }),
      });

      const result = await response.json();
      if (result.success) {
        alert('Reserva confirmada! Você receberá um e-mail de confirmação em breve.');
        setShowBookingModal(false);
        setBookingFormData({});
      } else {
        alert('Erro ao processar reserva. Tente novamente.');
      }
    } catch (error) {
      console.error('Booking submission failed:', error);
      alert('Erro ao processar reserva. Tente novamente.');
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
                <p className="text-gray-400">Carregando evento...</p>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="min-h-screen bg-black">
        <Header />
        <main className="pt-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="text-center">
              <p className="text-red-400 mb-4">{error || 'Evento não encontrado'}</p>
              <Link
                to="/eventos"
                className="inline-flex items-center px-6 py-3 bg-yellow-400 text-black rounded-lg hover:bg-yellow-300 transition-colors duration-300"
                style={{ fontFamily: 'Inter, Goldman Sans, sans-serif' }}
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Voltar aos Eventos
              </Link>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-black">
        <Header />
        <main className="pt-16">
          {/* Back Navigation */}
          <div className="bg-gray-950 border-b border-gray-800">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
              <Link
                to="/eventos"
                className="inline-flex items-center text-gray-400 hover:text-yellow-400 transition-colors duration-300"
                style={{ fontFamily: 'Inter, Goldman Sans, sans-serif' }}
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Voltar aos Eventos
              </Link>
            </div>
          </div>

          {/* Event Content */}
          <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            {/* Event Header */}
            <header className="mb-8">
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight" 
                  style={{ fontFamily: 'Inter, Goldman Sans, sans-serif' }}>
                {event.title}
              </h1>

              {/* Event Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="space-y-4">
                  <div className="flex items-center space-x-3 text-gray-300">
                    <Calendar className="h-5 w-5 text-yellow-400" />
                    <span className="text-lg">{formatDate(event.event_date)}</span>
                  </div>
                  <div className="flex items-center space-x-3 text-gray-300">
                    <Clock className="h-5 w-5 text-yellow-400" />
                    <span className="text-lg">{formatTime(event.event_time)}</span>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3 text-gray-300">
                    <MapPin className="h-5 w-5 text-yellow-400" />
                    <span className="text-lg">{event.location}</span>
                  </div>
                  <div className="flex items-center space-x-3 text-gray-300">
                    <Users className="h-5 w-5 text-yellow-400" />
                    <span className="text-lg">{event.capacity} vagas disponíveis</span>
                  </div>
                </div>
              </div>

              {/* Event Image */}
              <div className="mb-8">
                <img
                  src="https://heyboss.heeyo.ai/1758897508-c841d1d6.webp"
                  alt={event.title}
                  className="w-full h-64 md:h-80 object-cover rounded-lg"
                />
              </div>
            </header>

            {/* Event Description */}
            <div 
              className="prose prose-lg prose-invert max-w-none mb-8"
              dangerouslySetInnerHTML={{ __html: event.description_html }}
              style={{
                color: '#e5e7eb',
                lineHeight: '1.8'
              }}
            />

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-between border-t border-gray-800 pt-8 gap-4">
              <div className="flex items-center space-x-4">
                <button
                  onClick={handleShare}
                  className="inline-flex items-center px-6 py-3 border-2 border-yellow-400 text-yellow-400 font-medium rounded-lg hover:bg-yellow-400 hover:text-black transition-all duration-300"
                  style={{ fontFamily: 'Inter, Goldman Sans, sans-serif' }}
                >
                  <Share2 className="mr-2 h-4 w-4" />
                  Compartilhar
                </button>

                <Link
                  to="/eventos"
                  className="inline-flex items-center px-6 py-3 text-gray-400 hover:text-yellow-400 transition-colors duration-300"
                  style={{ fontFamily: 'Inter, Goldman Sans, sans-serif' }}
                >
                  Ver Mais Eventos
                </Link>
              </div>

              <button
                onClick={() => setShowBookingModal(true)}
                className="inline-flex items-center px-8 py-4 bg-yellow-400 text-black font-bold rounded-lg hover:bg-yellow-300 transition-all duration-300 text-lg"
                style={{ fontFamily: 'Inter, Goldman Sans, sans-serif' }}
              >
                Reservar Vaga
              </button>
            </div>
          </article>
        </main>
        <Footer />
      </div>

      {/* Booking Modal */}
      {showBookingModal && event && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-gray-900 rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto border border-gray-700">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-700">
              <div>
                <h3 className="text-xl font-bold text-white" style={{ fontFamily: 'Inter, Goldman Sans, sans-serif' }}>
                  Reservar Vaga
                </h3>
                <p className="text-sm text-gray-400 mt-1">{event.title}</p>
              </div>
              <button
                onClick={() => setShowBookingModal(false)}
                className="text-gray-400 hover:text-white transition-colors duration-300"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6">
              <CustomForm
                id="event_booking"
                schema={allConfigs.event_booking.jsonSchema}
                formData={bookingFormData}
                onChange={handleBookingFormChange}
                onSubmit={handleBookingSubmit}
                theme={{
                  form: {
                    container: "space-y-6",
                    title: "text-xl font-bold text-white mb-4",
                    description: "text-gray-400 mb-6"
                  },
                  field: {
                    container: "space-y-2",
                    label: "block text-sm font-medium text-gray-300",
                    input: "w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400 focus:outline-none transition-all duration-300",
                    textarea: "w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400 focus:outline-none transition-all duration-300 min-h-[100px] resize-vertical",
                    select: "w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400 focus:outline-none transition-all duration-300",
                    checkbox: "w-4 h-4 text-yellow-400 bg-gray-800 border-gray-600 rounded focus:ring-yellow-400 focus:ring-2",
                    error: "text-red-400 text-sm mt-1",
                    description: "text-gray-500 text-sm mt-1"
                  },
                  button: {
                    primary: "w-full px-6 py-3 bg-yellow-400 text-black font-semibold rounded-lg hover:bg-yellow-300 transition-all duration-300",
                    secondary: "w-full px-6 py-3 border-2 border-gray-600 text-gray-300 font-medium rounded-lg hover:border-yellow-400 hover:text-yellow-400 transition-all duration-300"
                  }
                }}
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

