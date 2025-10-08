

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, MapPin, Clock, Users, ArrowRight, X } from 'lucide-react';
import { CustomForm } from '../components/CustomForm';
import allConfigs from "../../shared/form-configs.json";

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

interface EventsListProps {
  limit?: number;
  showTitle?: boolean;
  upcomingOnly?: boolean;
}

export const EventsList: React.FC<EventsListProps> = ({ limit, showTitle = true, upcomingOnly = true }) => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [bookingFormData, setBookingFormData] = useState({});

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('/api/events');
      if (!response.ok) {
        throw new Error('Failed to fetch events');
      }
      
      const data = await response.json();
      
      // Ensure data is an array
      if (!Array.isArray(data)) {
        throw new Error('Invalid data format received');
      }
      
      let filteredEvents = data;
      
      if (upcomingOnly) {
        const now = new Date();
        filteredEvents = data.filter((event: Event) => {
          try {
            return new Date(event.event_date) >= now;
          } catch {
            return false; // Skip events with invalid dates
          }
        });
      }
      
      if (limit && limit > 0) {
        filteredEvents = filteredEvents.slice(0, limit);
      }
      
      setEvents(filteredEvents);
    } catch (err) {
      setError('Erro ao carregar eventos');
      console.error('Error fetching events:', err);
      setEvents([]);
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

  const getExcerpt = (html: string, maxLength: number = 120) => {
    const text = html.replace(/<[^>]*>/g, '');
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  };

  const handleBookEvent = (event: Event) => {
    setSelectedEvent(event);
    setShowBookingModal(true);
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
          event_id: selectedEvent?.id,
          event_title: selectedEvent?.title,
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
      <div className="space-y-6">
        {[...Array(3)].map((_, index) => (
          <div key={index} className="bg-gray-900 rounded-lg p-6 animate-pulse">
            <div className="flex flex-col md:flex-row md:items-center justify-between">
              <div className="flex-1">
                <div className="h-6 bg-gray-800 rounded mb-2 w-3/4"></div>
                <div className="h-4 bg-gray-800 rounded mb-4 w-1/2"></div>
                <div className="flex space-x-4">
                  <div className="h-4 bg-gray-800 rounded w-24"></div>
                  <div className="h-4 bg-gray-800 rounded w-32"></div>
                </div>
              </div>
              <div className="h-10 bg-gray-800 rounded w-32 mt-4 md:mt-0"></div>
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
          onClick={fetchEvents}
          className="px-6 py-3 bg-gold text-white rounded-lg hover:bg-deep-teal transition-colors duration-300"
          style={{ fontFamily: 'Inter, Goldman Sans, sans-serif' }}
        >
          Tentar Novamente
        </button>
      </div>
    );
  }

  if (events.length === 0) {
    return (
      <div className="text-center py-12">
        <Calendar className="h-16 w-16 text-gray-600 mx-auto mb-4" />
        <p className="text-gray-400 text-lg">Nenhum evento encontrado</p>
      </div>
    );
  }

  return (
    <>
      {!showTitle ? (
        /* Compact Events List for Homepage */
        <div className="space-y-4">
          {events.map((event) => (
            <div 
              key={event.id}
              className="bg-white rounded-lg p-6 border border-light-grey hover:border-gold transition-smooth hover:transform hover:scale-[1.01] shadow-modern hover:shadow-modern-lg group"
            >
              {/* Event Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-dark-teal group-hover:text-gold transition-colors duration-300 mb-2" 
                      style={{ fontFamily: 'Inter, Goldman Sans, sans-serif' }}>
                    <Link to={`/eventos/${event.slug}`}>
                      {event.title}
                    </Link>
                  </h3>
                  <p className="text-dark-grey text-sm mb-3 line-clamp-2">
                    {getExcerpt(event.description_html, 80)}
                  </p>
                </div>
                
                {/* Date Badge */}
                <div className="bg-light-gold border border-gold rounded-lg px-3 py-2 ml-4">
                  <div className="text-center">
                    <div className="text-deep-teal font-bold text-lg">
                      {new Date(event.event_date).getDate()}
                    </div>
                    <div className="text-deep-teal text-xs font-medium">
                      {new Date(event.event_date).toLocaleDateString('pt-PT', { month: 'short' }).toUpperCase()}
                    </div>
                  </div>
                </div>
              </div>

              {/* Event Details */}
              <div className="flex flex-wrap items-center gap-4 text-sm text-medium-grey mb-4">
                <div className="flex items-center space-x-1">
                  <Clock className="h-3 w-3 text-gold" />
                  <span>{formatTime(event.event_time)}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <MapPin className="h-3 w-3 text-gold" />
                  <span>{event.location}</span>
                </div>
              </div>

              {/* Reserve Button */}
              <div className="flex justify-end">
                <button
                  onClick={() => handleBookEvent(event)}
                  className="px-6 py-2 bg-gold text-white font-semibold text-sm rounded hover:bg-deep-teal transition-all duration-300 shadow-md"
                  style={{ fontFamily: 'Inter, Goldman Sans, sans-serif' }}
                >
                  Reservar Vaga
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Full Events Page Layout */
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {showTitle && (
              <div className="text-center mb-12">
                <div className="flex items-center justify-center space-x-3 mb-4">
                  <Calendar className="h-8 w-8 text-primary" />
                  <h2 className="text-4xl font-bold text-text-primary" style={{ fontFamily: 'Inter, Goldman Sans, sans-serif' }}>
                    {upcomingOnly ? 'Próximos Eventos' : 'Todos os Eventos'}
                  </h2>
                </div>
                <p className="text-text-secondary text-lg max-w-2xl mx-auto">
                  Participe dos principais eventos do setor bancário angolano
                </p>
              </div>
            )}

            <div className="space-y-6">
              {events.map((event) => (
                <div 
                  key={event.id}
                  className="bg-white rounded-lg p-6 border border-light-grey hover:border-gold transition-all duration-300 hover:transform hover:scale-[1.01] hover:shadow-lg"
                >
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between">
                    <div className="flex-1 lg:pr-8">
                      {/* Event Title */}
                      <h3 className="text-xl font-bold text-dark-teal mb-2 hover:text-gold transition-colors duration-300" 
                          style={{ fontFamily: 'Inter, Goldman Sans, sans-serif' }}>
                        <Link to={`/eventos/${event.slug}`}>
                          {event.title}
                        </Link>
                      </h3>

                      {/* Event Description */}
                      <p className="text-dark-grey mb-4">
                        {getExcerpt(event.description_html)}
                      </p>

                      {/* Event Details */}
                      <div className="flex flex-col sm:flex-row sm:space-x-6 space-y-2 sm:space-y-0 text-sm text-medium-grey">
                        <div className="flex items-center space-x-2">
                          <Calendar className="h-4 w-4 text-gold" />
                          <span>{formatDate(event.event_date)}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Clock className="h-4 w-4 text-gold" />
                          <span>{formatTime(event.event_time)}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <MapPin className="h-4 w-4 text-gold" />
                          <span>{event.location}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Users className="h-4 w-4 text-gold" />
                          <span>{event.capacity} vagas</span>
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3 mt-6 lg:mt-0">
                      <Link
                        to={`/eventos/${event.slug}`}
                        className="inline-flex items-center justify-center px-6 py-3 border-2 border-deep-teal text-deep-teal font-medium rounded-lg hover:bg-deep-teal hover:text-white transition-all duration-300"
                        style={{ fontFamily: 'Inter, Goldman Sans, sans-serif' }}
                      >
                        Saber Mais
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                      
                      <button
                        onClick={() => handleBookEvent(event)}
                        className="inline-flex items-center justify-center px-6 py-3 bg-gold text-white font-semibold rounded-lg hover:bg-deep-teal transition-all duration-300 shadow-md"
                        style={{ fontFamily: 'Inter, Goldman Sans, sans-serif' }}
                      >
                        Reservar Vaga
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* View All Button */}
            {limit && (
              <div className="text-center mt-12">
                <Link
                  to="/eventos"
                  className="inline-flex items-center px-8 py-4 bg-gold text-white font-semibold rounded-lg hover:bg-deep-teal transition-all duration-300 group shadow-md"
                  style={{ fontFamily: 'Inter, Goldman Sans, sans-serif' }}
                >
                  Ver Todos os Eventos
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
                </Link>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Booking Modal */}
      {showBookingModal && selectedEvent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-gray-900 rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto border border-gray-700">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-700">
              <div>
                <h3 className="text-xl font-bold text-white" style={{ fontFamily: 'Inter, Goldman Sans, sans-serif' }}>
                  Reservar Vaga
                </h3>
                <p className="text-sm text-gray-400 mt-1">{selectedEvent.title}</p>
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

