


/**
 * @description This file defines the Footer component with elegant styling following the black/gold/gray color scheme.
 * It includes contact information, social media links, privacy/terms links, secondary navigation, and the mandatory Heyboss.ai credit.
 * The component features responsive design and proper link handling for all footer elements.
 */

import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Mail, 
  Phone, 
  MapPin, 
  Linkedin, 
  Twitter, 
  Instagram,
  ExternalLink
} from 'lucide-react';

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  const navigation = {
    main: [
      { name: 'Início', href: '/' },
      { name: 'Notícias', href: '/noticias' },
      { name: 'Blog', href: '/blog' },
      { name: 'Eventos', href: '/eventos' },
      { name: 'Sobre Nós', href: '/sobre-nos' },
      { name: 'Contato', href: '/contato' },
    ],
    legal: [
      { 
        name: 'Política de Privacidade', 
        href: 'https://legal.heyboss.tech/67845a5e6e6bf5ecd4a3ae47/',
        external: true 
      },
      { 
        name: 'Termos e Condições', 
        href: 'https://legal.heyboss.tech/67845cfe76f9675292514b80/',
        external: true 
      },
    ],
    social: [
      { 
        name: 'LinkedIn', 
        href: 'https://www.linkedin.com/company/heyboss-xyz/', 
        icon: Linkedin 
      },
      { 
        name: 'Twitter', 
        href: 'https://x.com/heybossAI', 
        icon: Twitter 
      },
      { 
        name: 'Instagram', 
        href: '#', 
        icon: Instagram 
      },
    ],
  };

  return (
    <footer className="bg-white border-t border-light-grey">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="lg:col-span-1">
            <div className="mb-8">
              <Link 
                to="/" 
                className="flex items-center group"
              >
                <img
                  src="https://heyboss.heeyo.ai/user-assets/WhatsApp%20Image%202025-09-28%20at%2015.25.01_Rxzb_GtA.jpeg"
                  alt="Ser Bancário - Portal do Setor Bancário Angolano"
                  className="logo-footer object-contain group-hover:opacity-90 transition-opacity duration-300"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                  }}
                />
              </Link>
            </div>
            <p className="text-medium-grey mb-8 leading-relaxed text-lg">
              O principal portal de notícias e análises do setor bancário angolano. 
              Informação de qualidade para profissionais do mercado financeiro.
            </p>
            
            {/* Social Media */}
            <div className="flex space-x-4">
              {navigation.social.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-medium-grey hover:text-gold transition-colors duration-300"
                  aria-label={item.name}
                >
                  <item.icon className="h-5 w-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Navigation Links */}
          <div className="lg:col-span-1">
            <h3 className="text-lg font-semibold text-dark-teal mb-6" 
                style={{ fontFamily: 'Inter, Goldman Sans, sans-serif' }}>
              Navegação
            </h3>
            <ul className="space-y-3">
              {navigation.main.map((item) => (
                <li key={item.name}>
                  <Link
                    to={item.href}
                    className="text-dark-grey hover:text-gold transition-colors duration-300"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div className="lg:col-span-1">
            <h3 className="text-lg font-semibold text-dark-teal mb-6" 
                style={{ fontFamily: 'Inter, Goldman Sans, sans-serif' }}>
              Contacto
            </h3>
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <Mail className="h-4 w-4 text-gold flex-shrink-0" />
                <div>
                  <p className="text-sm text-medium-grey">E-mail</p>
                  <a
                    href="mailto:contato@serbancario.ao"
                    className="text-dark-grey hover:text-gold transition-colors duration-300"
                  >
                    contato@serbancario.ao
                  </a>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="h-4 w-4 text-gold flex-shrink-0" />
                <div>
                  <p className="text-sm text-medium-grey">Telefone</p>
                  <a
                    href="tel:+244925438111"
                    className="text-dark-grey hover:text-gold transition-colors duration-300"
                  >
                    925 438 111
                  </a>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <MapPin className="h-4 w-4 text-gold flex-shrink-0" />
                <div>
                  <p className="text-sm text-medium-grey">Endereço</p>
                  <p className="text-dark-grey">Rua Marechal Brós Tito n° 13, apt° 5° E, Kinaxixe</p>
                </div>
              </div>
            </div>
          </div>

          {/* Legal Links */}
          <div className="lg:col-span-1">
            <h3 className="text-lg font-semibold text-dark-teal mb-6" 
                style={{ fontFamily: 'Inter, Goldman Sans, sans-serif' }}>
              Legal
            </h3>
            <ul className="space-y-3">
              {navigation.legal.map((item) => (
                <li key={item.name}>
                  {item.external ? (
                    <a
                      href={item.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-dark-grey hover:text-gold transition-colors duration-300 inline-flex items-center space-x-1"
                    >
                      <span>{item.name}</span>
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  ) : (
                    <Link
                      to={item.href}
                      className="text-dark-grey hover:text-gold transition-colors duration-300"
                    >
                      {item.name}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-12 pt-8 border-t border-light-grey">
          <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
            {/* Copyright */}
            <div className="text-medium-grey text-sm">
              © {currentYear} Ser Bancário. Todos os direitos reservados.
            </div>

            {/* Heyboss Credit - MANDATORY */}
            <div className="text-medium-grey text-sm">
            Produto de 
              <a
                href=" https://www.alio.ao"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-500 underline transition-colors duration-300"
              >
                 Alio Analytics
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};