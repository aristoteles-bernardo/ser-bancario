



import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { AuthProvider } from "@hey-boss/users-service/react";
import { HomePage } from "./pages/HomePage";
import { AuthCallback } from "./pages/AuthCallback";
import { NoticiasPage } from "./pages/NoticiasPage";
import { BlogPage } from "./pages/BlogPage";
import { EventosPage } from "./pages/EventosPage";
import { SobreNosPage } from "./pages/SobreNosPage";
import { ContatoPage } from "./pages/ContatoPage";
import { NewsDetailPage } from "./pages/NewsDetailPage";
import { BlogDetailPage } from "./pages/BlogDetailPage";
import { EventDetailPage } from "./pages/EventDetailPage";
import { LoginPage } from "./pages/LoginPage";
import { AdminDashboardPage } from "./pages/AdminDashboardPage";

// Error Boundary Component
class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean; error?: Error }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Application Error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-black flex items-center justify-center px-4">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-white mb-4">
              Algo deu errado
            </h1>
            <p className="text-gray-400 mb-6">
              Ocorreu um erro inesperado. Por favor, recarregue a página.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-3 bg-yellow-400 text-black font-semibold rounded-lg hover:bg-yellow-300 transition-all duration-300"
            >
              Recarregar Página
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export const App = () => {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/auth/callback" element={<AuthCallback />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/admin" element={<AdminDashboardPage />} />
            <Route path="/noticias" element={<NoticiasPage />} />
            <Route path="/noticias/:slug" element={<NewsDetailPage />} />
            <Route path="/blog" element={<BlogPage />} />
            <Route path="/blog/:slug" element={<BlogDetailPage />} />
            <Route path="/eventos" element={<EventosPage />} />
            <Route path="/eventos/:slug" element={<EventDetailPage />} />
            <Route path="/sobre-nos" element={<SobreNosPage />} />
            <Route path="/contato" element={<ContatoPage />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ErrorBoundary>
  );
};
  


