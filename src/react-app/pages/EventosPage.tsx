


/**
 * @description This file defines the EventosPage, which is dedicated to listing all company events.
 * It includes the standard Header and Footer for consistent navigation and branding.
 * The core functionality is provided by the EventsList component, configured to display all events, both upcoming and past.
 */
import React from 'react';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { EventsList } from '../components/EventsList';

export const EventosPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="pt-20 bg-white">
        {/* Page Header Section */}
        <section className="py-16 bg-warm-grey border-b border-light-grey">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="flex items-center justify-center space-x-3 mb-6">
              <div className="w-1 h-12 bg-gold"></div>
              <h1 className="text-5xl font-bold text-dark-teal" style={{ fontFamily: 'Inter, Goldman Sans, sans-serif' }}>
                EVENTOS
              </h1>
            </div>
            <p className="text-dark-grey text-xl max-w-3xl mx-auto leading-relaxed">
              Participe dos principais eventos do setor bancário angolano
            </p>
          </div>
        </section>

        {/* Events Content */}
        <div className="bg-white">
          <EventsList showTitle={false} />
        </div>
      </main>
      <Footer />
    </div>
  );
};


