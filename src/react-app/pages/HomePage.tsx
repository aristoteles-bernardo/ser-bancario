


import React, { useState } from 'react';
import { Header } from '../components/Header';
import { HeroSection } from '../components/HeroSection';
import { NewsGrid } from '../components/NewsGrid';
import { BlogGrid } from '../components/BlogGrid';
import { EventsList } from '../components/EventsList';
import { SponsorsCarousel } from '../components/SponsorsCarousel';
import { Footer } from '../components/Footer';
import { CustomForm } from '../components/CustomForm';
import { formTheme } from '../components/CustomForm/formThemes';
import { Mail, Phone, MapPin, X, Send } from 'lucide-react';
import allConfigs from '../../shared/form-configs.json';

export const HomePage: React.FC = () => {
  const [showContactModal, setShowContactModal] = useState(false);
  const [contactFormData, setContactFormData] = useState({});

  const handleContactFormChange = (data: any, errors: any) => {
    try {
      setContactFormData(data || {});
      console.log('Contact form data:', data);
      console.log('Validation errors:', errors);
    } catch (error) {
      console.error('Form change handler error:', error);
    }
  };

  const handleContactSubmit = async (formData: any) => {
    try {
      if (!formData) {
        alert('Dados do formulário inválidos.');
        return;
      }

      const response = await fetch('/api/forms/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ formId: 'contact_form', ...formData }),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const result = await response.json();
      if (result.success) {
        alert('Mensagem enviada com sucesso! Entraremos em contato consigo brevemente.');
        setShowContactModal(false);
        setContactFormData({});
      } else {
        alert(result.message || 'Erro ao enviar mensagem. Tente novamente.');
      }
    } catch (error) {
      console.error('Contact form submission failed:', error);
      alert('Erro ao enviar mensagem. Tente novamente.');
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <Header />

      {/* Hero Section */}
      <div className="hero-section-wrapper">
        <HeroSection />
      </div>

      {/* Featured News & Upcoming Events Section - Two Column Layout */}
      <section className="py-20 bg-warm-grey">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            {/* Latest News Column */}
            <div>
              <div className="flex items-center space-x-3 mb-8">
                <div className="w-1 h-8 bg-gold"></div>
                <h2 className="text-3xl font-bold text-dark-teal" style={{ fontFamily: 'Inter, Goldman Sans, sans-serif' }}>
                  ÚLTIMAS NOTÍCIAS
                </h2>
              </div>
              <div className="news-grid-wrapper">
                <NewsGrid limit={4} showTitle={false} featured={false} />
              </div>
            </div>

            {/* Upcoming Events Column */}
            <div>
              <div className="flex items-center space-x-3 mb-8">
                <div className="w-1 h-8 bg-gold"></div>
                <h2 className="text-3xl font-bold text-dark-teal" style={{ fontFamily: 'Inter, Goldman Sans, sans-serif' }}>
                  PRÓXIMOS EVENTOS
                </h2>
              </div>
              <div className="events-list-wrapper">
                <EventsList limit={3} showTitle={false} upcomingOnly={true} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Blog Section */}
      <div className="blog-grid-wrapper">
        <BlogGrid limit={3} showTitle={true} />
      </div>

      {/* Sponsors/Partners Section */}
      <div className="sponsors-carousel-wrapper">
        <SponsorsCarousel showTitle={true} autoplay={true} />
      </div>

      {/* Contact Section */}
      <section className="py-16 bg-white border-t border-light-grey">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-dark-teal mb-4" style={{ fontFamily: 'Inter, Goldman Sans, sans-serif' }}>
              Entre em Contato
            </h2>
            <p className="text-dark-grey text-lg max-w-2xl mx-auto">
              Tem alguma questão ou sugestão? Entre em contato connosco
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Contact Information */}
            <div className="lg:col-span-1 space-y-8">
              <div className="bg-white rounded-lg p-6 border border-light-grey shadow-md">
                <div className="flex items-center space-x-4 mb-4">
                  <div className="bg-gold rounded-full p-3">
                    <Mail className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-dark-teal" style={{ fontFamily: 'Inter, Goldman Sans, sans-serif' }}>
                      E-mail
                    </h3>
                    <p className="text-dark-grey">contato@serbancario.ao</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg p-6 border border-light-grey shadow-md">
                <div className="flex items-center space-x-4 mb-4">
                  <div className="bg-gold rounded-full p-3">
                    <Phone className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-dark-teal" style={{ fontFamily: 'Inter, Goldman Sans, sans-serif' }}>
                      Telefone
                    </h3>
                    <a href="tel:+244925438111" className="text-dark-grey hover:text-gold transition-colors">
                      925 438 111
                    </a>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg p-6 border border-light-grey shadow-md">
                <div className="flex items-center space-x-4 mb-4">
                  <div className="bg-gold rounded-full p-3">
                    <MapPin className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-dark-teal" style={{ fontFamily: 'Inter, Goldman Sans, sans-serif' }}>
                      Endereço
                    </h3>
                    <p className="text-dark-grey">Rua Marechal Brós Tito n° 13, apt° 5° E, Kinaxixe</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact CTA */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg p-8 border border-light-grey shadow-md">
                <h3 className="text-2xl font-bold text-dark-teal mb-4" style={{ fontFamily: 'Inter, Goldman Sans, sans-serif' }}>
                  Pronto para Conectar?
                </h3>
                <p className="text-dark-grey mb-8 leading-relaxed">
                  Se tem alguma questão sobre o setor bancário angolano, sugestões para o portal, 
                  ou interesse em parcerias, não hesite em contactar-nos. A nossa equipa está sempre 
                  disponível para fornecer informações precisas e estabelecer conexões valiosas no 
                  mercado financeiro.
                </p>
                
                <button
                  onClick={() => setShowContactModal(true)}
                  className="inline-flex items-center px-8 py-4 bg-gold text-white font-bold rounded-lg hover:bg-deep-teal transition-all duration-300 group shadow-md"
                  style={{ fontFamily: 'Inter, Goldman Sans, sans-serif' }}
                >
                  Enviar Mensagem
                  <Send className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />

      {/* Contact Modal */}
      {showContactModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-gray-200 shadow-modern-xl">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div>
                <h3 className="text-2xl font-bold text-text-primary" style={{ fontFamily: 'Inter, Goldman Sans, sans-serif' }}>
                  Entre em Contato
                </h3>
                <p className="text-sm text-text-secondary mt-1">
                  Envie-nos uma mensagem e responderemos brevemente
                </p>
              </div>
              <button
                onClick={() => setShowContactModal(false)}
                className="text-text-muted hover:text-text-primary transition-colors duration-300"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6">
              <CustomForm
                id="contact_form"
                schema={allConfigs.contact_form.jsonSchema}
                formData={contactFormData}
                onChange={handleContactFormChange}
                onSubmit={handleContactSubmit}
                theme={formTheme}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};


