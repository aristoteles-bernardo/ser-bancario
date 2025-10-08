






/**
 * @description This file defines the Header component for the Ser Bancário portal, featuring a fixed navigation bar with Goldman Sachs-inspired design.
 * It includes the company logo, main navigation menu, search functionality, and social media icons, all styled with the black/gold/gray color palette.
 * The component handles responsive behavior and uses the Inter font as a fallback for Goldman Sans to ensure premium typography.
 */

import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Search, Menu, X, Linkedin, Twitter, Instagram, Mail } from 'lucide-react';

export const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const location = useLocation();
  const navigate = useNavigate();

  const navigation = [
    { name: 'Início', href: '/' },
    { name: 'Notícias', href: '/noticias' },
    { name: 'Blog', href: '/blog' },
    { name: 'Eventos', href: '/eventos' },
    { name: 'Sobre Nós', href: '/sobre-nos' },
    { name: 'Contato', href: '/contato' },
  ];

  const socialLinks = [
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
    { 
      name: 'Email', 
      href: 'mailto:contato@serbancario.ao', 
      icon: Mail 
    },
  ];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // For now, redirect to news page with search query
      // TODO: Implement proper search functionality
      navigate(`/noticias?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
    }
  };

  const isActivePage = (href: string) => {
    if (href === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(href);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white shadow-modern border-b border-light-grey backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo with Actual Brand Logo */}
          <div className="flex-shrink-0">
            <Link 
              to="/" 
              className="flex items-center group"
            >
              <img
                src="https://heyboss.heeyo.ai/user-assets/WhatsApp%20Image%202025-09-28%20at%2015.25.01_Rxzb_GtA.jpeg"
                alt="Ser Bancário - Portal do Setor Bancário Angolano"
                className="logo-header object-contain group-hover:opacity-90 transition-opacity duration-300"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                }}
              />
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`text-sm font-semibold transition-smooth hover:text-gold relative ${
                  isActivePage(item.href)
                    ? 'text-gold after:content-[""] after:absolute after:bottom-[-8px] after:left-0 after:right-0 after:h-1 after:bg-gold after:rounded-full'
                    : 'text-dark-teal hover:text-gold'
                }`}
                style={{ fontFamily: 'Inter, Goldman Sans, sans-serif' }}
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Search Bar */}
          <div className="hidden lg:flex items-center space-x-4">
            <form onSubmit={handleSearch} className="relative">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-medium-grey" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Pesquisar..."
                  className="w-64 pl-10 pr-4 py-2 bg-white border border-light-grey rounded-lg text-dark-grey placeholder-medium-grey focus:border-gold focus:ring-1 focus:ring-gold focus:outline-none transition-all duration-300"
                />
              </div>
            </form>

            {/* Social Media Icons */}
            <div className="flex items-center space-x-3">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  target={social.href.startsWith('http') ? '_blank' : undefined}
                  rel={social.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                  className="text-deep-teal hover:text-gold transition-colors duration-300"
                  aria-label={social.name}
                >
                  <social.icon className="h-5 w-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-medium-grey hover:text-gold transition-colors duration-300"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 border-t border-light-grey">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={() => setIsMenuOpen(false)}
                  className={`block px-3 py-3 text-base font-semibold transition-colors duration-300 rounded-md ${
                    isActivePage(item.href)
                      ? 'text-gold bg-light-gold border-l-4 border-gold'
                      : 'text-dark-teal hover:text-gold hover:bg-warm-grey'
                  }`}
                  style={{ fontFamily: 'Inter, Goldman Sans, sans-serif' }}
                >
                  {item.name}
                </Link>
              ))}

              {/* Mobile Search */}
              <form onSubmit={handleSearch} className="pt-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-medium-grey" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Pesquisar..."
                    className="w-full pl-10 pr-4 py-2 bg-white border border-light-grey rounded-lg text-dark-grey placeholder-medium-grey focus:border-deep-teal focus:ring-1 focus:ring-deep-teal focus:outline-none transition-all duration-300"
                  />
                </div>
              </form>

              {/* Mobile Social Links */}
              <div className="flex items-center space-x-4 pt-4">
                {socialLinks.map((social) => (
                  <a
                    key={social.name}
                    href={social.href}
                    target={social.href.startsWith('http') ? '_blank' : undefined}
                    rel={social.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                    className="text-medium-grey hover:text-gold transition-colors duration-300"
                    aria-label={social.name}
                  >
                    <social.icon className="h-5 w-5" />
                  </a>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};






