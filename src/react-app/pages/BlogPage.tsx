



/**
 * @description This file defines the BlogPage, which serves as the main page for displaying all blog posts.
 * It uses the Header and Footer components to maintain a consistent user interface across the site.
 * The main content is rendered by the BlogGrid component, which is set to display all blog articles.
 */
import React from 'react';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { BlogGrid } from '../components/BlogGrid';

export const BlogPage: React.FC = () => {
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
                BLOG & ANÁLISES
              </h1>
            </div>
            <p className="text-dark-grey text-xl max-w-3xl mx-auto leading-relaxed">
              Insights, opiniões e análises aprofundadas sobre o setor bancário angolano
            </p>
          </div>
        </section>

        {/* Blog Content */}
        <div className="bg-white">
          <BlogGrid showTitle={false} />
        </div>
      </main>
      <Footer />
    </div>
  );
};
  


