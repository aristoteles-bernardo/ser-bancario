




/**
 * @description This file defines the NoticiasPage, which serves as the main page for displaying all news articles.
 * It integrates the Header and Footer components for consistent site navigation and layout.
 * The core content is provided by the NewsGrid component, configured to show all available news with brand styling.
 */
import React from 'react';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { NewsGrid } from '../components/NewsGrid';

export const NoticiasPage: React.FC = () => {
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
                NOTÍCIAS
              </h1>
            </div>
            <p className="text-dark-grey text-xl max-w-3xl mx-auto leading-relaxed">
              Mantenha-se informado sobre as principais novidades e desenvolvimentos do setor bancário angolano
            </p>
          </div>
        </section>

        {/* News Content */}
        <div className="bg-white">
          <NewsGrid showTitle={false} />
        </div>
      </main>
      <Footer />
    </div>
  );
};
  



