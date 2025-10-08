


/**
 * @description This file defines the ContatoPage, a dedicated contact page for user inquiries.
 * It includes the Header and Footer for a consistent site-wide experience.
 * The page features a CustomForm for submissions, which integrates with the backend to store data and send email notifications.
 */
import React, { useState } from 'react';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { CustomForm } from '../components/CustomForm';
import { formTheme } from '../components/CustomForm/formThemes';
import { Mail, Phone, MapPin } from 'lucide-react';
import allConfigs from '../../shared/form-configs.json';

export const ContatoPage: React.FC = () => {
  const [contactFormData, setContactFormData] = useState({});

  const handleContactFormChange = (data: any, errors: any) => {
    setContactFormData(data);
  };

  const handleContactSubmit = async (formData: any) => {
    try {
      const response = await fetch('/api/forms/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ formId: 'contact_form', ...formData }),
      });

      const result = await response.json();
      if (result.success) {
        alert('Mensagem enviada com sucesso! Entraremos em contato consigo brevemente.');
        setContactFormData({});
      } else {
        alert('Erro ao enviar mensagem. Tente novamente.');
      }
    } catch (error) {
      console.error('Contact form submission failed:', error);
      alert('Erro ao enviar mensagem. Tente novamente.');
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="pt-16">
        <section className="py-16 bg-warm-grey">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-dark-teal mb-4" style={{ fontFamily: 'Inter, Goldman Sans, sans-serif' }}>
                Entre em Contato
              </h2>
              <p className="text-dark-grey text-lg max-w-2xl mx-auto">
                Tem alguma questão ou sugestão? A nossa equipa está pronta para ajudar.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
              {/* Contact Form */}
              <div className="bg-white p-8 rounded-lg border border-light-grey shadow-modern">
                <CustomForm
                  id="contact_form"
                  schema={allConfigs.contact_form.jsonSchema}
                  formData={contactFormData}
                  onChange={handleContactFormChange}
                  onSubmit={handleContactSubmit}
                  theme={formTheme}
                />
              </div>

              {/* Contact Info */}
              <div className="space-y-8">
                <div className="bg-white rounded-lg p-6 border border-light-grey shadow-md">
                  <div className="flex items-center space-x-4">
                    <div className="bg-gold rounded-full p-3">
                      <Mail className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-dark-teal" style={{ fontFamily: 'Inter, Goldman Sans, sans-serif' }}>
                        E-mail
                      </h3>
                      <a href="mailto:contato@serbancario.ao" className="text-dark-grey hover:text-gold transition-colors">contato@serbancario.ao</a>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-lg p-6 border border-light-grey shadow-md">
                  <div className="flex items-center space-x-4">
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
                  <div className="flex items-center space-x-4">
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
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};



