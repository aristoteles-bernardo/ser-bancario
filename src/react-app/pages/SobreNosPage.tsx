


/**
 * @description This file defines the SobreNosPage, which provides information about the "Ser Bancário" organization.
 * It features a standard layout with a Header and Footer for sitewide consistency.
 * The content includes a mission statement, vision, and values, presented in a clean, professional format.
 */
import React from 'react';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { Building, Target, Eye, Users, Award, TrendingUp } from 'lucide-react';

export const SobreNosPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="pt-20 bg-white">
        {/* Hero Section */}
        <section className="py-20 bg-warm-grey border-b border-light-grey">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="flex items-center justify-center space-x-3 mb-8">
              <div className="w-1 h-16 bg-gold"></div>
              <h1 className="text-5xl font-bold text-dark-teal" style={{ fontFamily: 'Inter, Goldman Sans, sans-serif' }}>
                SOBRE NÓS
              </h1>
            </div>
            <p className="text-xl text-dark-grey max-w-4xl mx-auto leading-relaxed mb-8">
              Ser Bancário é o principal portal de notícias e análises do setor financeiro de Angola. 
              Nossa missão é fornecer informações precisas, insights profundos e uma plataforma para 
              o diálogo construtivo que impulsiona o futuro da banca no país.
            </p>
          </div>
        </section>

        {/* Mission, Vision, Values */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="bg-white rounded-xl p-8 border-2 border-light-grey hover:border-gold transition-all duration-300 shadow-modern hover:shadow-modern-lg">
                <div className="bg-gold rounded-full p-4 w-16 h-16 flex items-center justify-center mb-6">
                  <Target className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-dark-teal mb-4" style={{ fontFamily: 'Inter, Goldman Sans, sans-serif' }}>
                  Nossa Missão
                </h3>
                <p className="text-dark-grey leading-relaxed">
                  Capacitar profissionais e instituições do setor financeiro com informações e análises 
                  de alta qualidade, promovendo a transparência, a inovação e o crescimento sustentável 
                  da economia angolana.
                </p>
              </div>

              <div className="bg-white rounded-xl p-8 border-2 border-light-grey hover:border-gold transition-all duration-300 shadow-modern hover:shadow-modern-lg">
                <div className="bg-deep-teal rounded-full p-4 w-16 h-16 flex items-center justify-center mb-6">
                  <Eye className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-dark-teal mb-4" style={{ fontFamily: 'Inter, Goldman Sans, sans-serif' }}>
                  Nossa Visão
                </h3>
                <p className="text-dark-grey leading-relaxed">
                  Ser a referência indispensável e a voz mais respeitada no debate sobre o futuro do 
                  setor bancário em Angola, conectando líderes, inovadores e reguladores.
                </p>
              </div>

              <div className="bg-white rounded-xl p-8 border-2 border-light-grey hover:border-gold transition-all duration-300 shadow-modern hover:shadow-modern-lg">
                <div className="bg-gold rounded-full p-4 w-16 h-16 flex items-center justify-center mb-6">
                  <Building className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-dark-teal mb-4" style={{ fontFamily: 'Inter, Goldman Sans, sans-serif' }}>
                  Nossos Valores
                </h3>
                <p className="text-dark-grey leading-relaxed">
                  Integridade, Excelência, Inovação, Colaboração e Compromisso com o desenvolvimento 
                  de Angola e seu setor financeiro.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Our Commitment Section */}
        <section className="py-16 bg-warm-grey">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-dark-teal mb-4" style={{ fontFamily: 'Inter, Goldman Sans, sans-serif' }}>
                Nosso Compromisso
              </h2>
              <p className="text-dark-grey text-lg max-w-2xl mx-auto">
                Trabalhamos todos os dias para entregar conteúdo de qualidade e promover o desenvolvimento do setor bancário
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="bg-white rounded-full p-6 w-20 h-20 flex items-center justify-center mx-auto mb-4 shadow-modern">
                  <Users className="h-10 w-10 text-gold" />
                </div>
                <h3 className="text-xl font-semibold text-dark-teal mb-3" style={{ fontFamily: 'Inter, Goldman Sans, sans-serif' }}>
                  Comunidade
                </h3>
                <p className="text-medium-grey">
                  Conectamos profissionais do setor bancário para troca de conhecimentos e experiências
                </p>
              </div>

              <div className="text-center">
                <div className="bg-white rounded-full p-6 w-20 h-20 flex items-center justify-center mx-auto mb-4 shadow-modern">
                  <Award className="h-10 w-10 text-gold" />
                </div>
                <h3 className="text-xl font-semibold text-dark-teal mb-3" style={{ fontFamily: 'Inter, Goldman Sans, sans-serif' }}>
                  Excelência
                </h3>
                <p className="text-medium-grey">
                  Comprometemo-nos com a qualidade e precisão em todas as nossas publicações e análises
                </p>
              </div>

              <div className="text-center">
                <div className="bg-white rounded-full p-6 w-20 h-20 flex items-center justify-center mx-auto mb-4 shadow-modern">
                  <TrendingUp className="h-10 w-10 text-gold" />
                </div>
                <h3 className="text-xl font-semibold text-dark-teal mb-3" style={{ fontFamily: 'Inter, Goldman Sans, sans-serif' }}>
                  Inovação
                </h3>
                <p className="text-medium-grey">
                  Promovemos discussões sobre novas tecnologias e tendências que moldam o futuro bancário
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Contact CTA Section */}
        <section className="py-16 bg-white border-t border-light-grey">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold text-dark-teal mb-4" style={{ fontFamily: 'Inter, Goldman Sans, sans-serif' }}>
              Faça Parte da Nossa Comunidade
            </h2>
            <p className="text-dark-grey text-lg mb-8 max-w-2xl mx-auto">
              Junte-se aos profissionais que confiam no Ser Bancário para se manterem informados sobre o setor financeiro angolano
            </p>
            <a
              href="/contato"
              className="inline-flex items-center px-8 py-4 bg-gold text-white font-bold rounded-lg hover:bg-deep-teal transition-all duration-300 shadow-modern"
              style={{ fontFamily: 'Inter, Goldman Sans, sans-serif' }}
            >
              Entre em Contato
            </a>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};
  

