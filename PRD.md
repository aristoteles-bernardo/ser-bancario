# Original Requirements (verbatim)
Desenvolver um portal de notícias dinâmico e interativo focado no setor bancário em Angola, com seções de notícias, blog, eventos e monetização via patrocínios. A plataforma deve ser gerenciada através de um dashboard administrativo robusto.
Layout e Design:
Paleta de Cores: Predominantemente preto (#000000), ouro (#FFD700) e cinza (#808080).
Preto: Usado para fundos, cabeçalhos, rodapés e elementos de texto de alto contraste.
Ouro: Destaque para títulos importantes, ícones, botões de ação (CTAs), bordas de elementos em destaque e elementos de branding.
Cinza: Para sub-títulos, texto secundário, linhas divisórias e fundos de seções menos proeminentes.
Tipografia: Clareza e profissionalismo. Sugerir fontes sem serifa (clean sans-serif) para o corpo do texto e talvez uma fonte com um toque mais sofisticado para títulos principais, mantendo a legibilidade.
Estrutura da Página:
Cabeçalho Fixo: Logo "Ser Bancário" (em ouro/preto), navegação principal (Notícias, Blog, Eventos, Sobre Nós, Contato), barra de pesquisa e ícones de redes sociais (linkáveis).
Banner/Hero Section: Grande área de destaque na página inicial para as notícias mais recentes ou de maior impacto, com título, pequena descrição e imagem relevante. Sobreposição sutil de cor ouro pode ser utilizada.
Seção de Notícias: Layout em grid ou masonry, exibindo manchetes recentes com miniaturas de imagens, títulos e resumos curtos. Deve haver filtros por categoria e data.
Seção de Blog: Similar à seção de notícias, mas com foco em artigos de opinião, análises e conteúdo mais aprofundado.
Seção de Eventos: Listagem de eventos futuros com data, local, descrição breve e um botão "Reservar Vaga" ou "Saber Mais". Eventos passados podem ser arquivados em uma subseção.
Área de Destaque para Patrocínios/Parceiros: Seção visível na página inicial e em outras páginas-chave, exibindo logos dos patrocinadores em um formato de carrossel ou grid, com links para seus respectivos websites. Estilo elegante e discreto.
Rodapé: Informações de contato, links para redes sociais, política de privacidade, termos de uso e links de navegação secundários.
Responsividade: O design deve ser totalmente responsivo, adaptando-se perfeitamente a desktops, tablets e smartphones.
Funcionalidades do Portal:
Publicação de Notícias:
Criação de artigos com título, subtítulo, corpo de texto (com editor rich-text para formatação, imagens, vídeos incorporados).
Atribuição de categorias e tags.
Data de publicação e autor.
Recurso de destaque para notícias na página inicial.
Integração Social: Possibilidade de linkar uma ou mais URLs de diferentes páginas de redes sociais a cada notícia ou postagem.
Publicação de Posts de Blog:
Funcionalidade idêntica à de notícias, mas com distinção clara de categoria.
Integração Social: Possibilidade de linkar uma ou mais URLs de diferentes páginas de redes sociais a cada postagem.
Gestão de Eventos:
Criação de eventos com título, descrição detalhada, data, hora, local (com mapa se possível), capacidade de vagas.
Funcionalidade de "Reservar Vaga" para usuários, coletando nome e e-mail.
Notificações por e-mail para confirmação de reserva.
Seção de Patrocínios e Parceiros:
Exibição dos logos e, opcionalmente, uma breve descrição/link para o site do parceiro.
Posicionamento estratégico para máxima visibilidade.
Pesquisa: Funcionalidade de pesquisa robusta para notícias, blog e eventos.
Compartilhamento Social: Botões de compartilhamento fácil para redes sociais em todas as notícias e posts.
Dashboard Administrativo:
Interface: Design limpo e intuitivo, utilizando a paleta de cores definida (preto, ouro, cinza) para elementos de UI.
Login Seguro: Sistema de autenticação robusto.
Gestão de Usuários (Admin):
Superadmin: Acesso total a todas as funcionalidades. Criação, edição e exclusão de contas de gestores.
Gestores: Permissão para gerenciar posts, notícias, informações da plataforma e a gestão de destaques e patrocínios. Não pode criar/excluir outros gestores ou alterar configurações de superadmin.
Módulos (Acessíveis conforme permissão):
Gestão de Notícias:
Criação, edição e exclusão de notícias.
Upload de imagens e vídeos.
Atribuição de categorias e tags.
Definição de notícias em destaque.
Gestão dos links de redes sociais associados a cada notícia.
Gestão de Blog:
Criação, edição e exclusão de posts de blog.
Upload de imagens e vídeos.
Atribuição de categorias e tags.
Gestão dos links de redes sociais associados a cada post.
Gestão de Eventos:
Criação, edição e exclusão de eventos.
Visualização da lista de reservas (com exportação de dados).
Gerenciamento da capacidade de vagas.
Gestão de Patrocínios e Parceiros:
Upload de logos dos patrocinadores.
Adição/Edição de links de destino para os patrocinadores.
Reordenação da exibição dos patrocinadores (manual).
Ativação/Desativação de patrocinadores.
Configurações Gerais (Somente Superadmin):
Gestão de categorias e tags.
Configurações de SEO.
Gerenciamento de usuários admin.
Configurações de integração com redes sociais.
Configurações de e-mail (para reservas de eventos).
Auditoria/Logs: (Opcional, mas útil) Registro de ações importantes realizadas pelos gestores.

# Single Sentence Overview:
- This project will create a sophisticated, dynamic news portal for the Angolan banking industry named "Ser Bancário," featuring sections for news, blogs, and events, with a robust admin dashboard for content management and built-in monetization through sponsorships.

# Goals & Success
- **Goal 1: Launch Public-Facing UI.** Deliver a fully styled, responsive, and interactive public portal (Home, News, Blog, Events, etc.) based on the specified layout and a world-class design system.
- **Goal 2: Implement Core User Actions.** Enable users to book events via a functional form and contact the administration through a contact form, with data correctly captured and processed.
- **Goal 3: Establish Backend Foundation.** Implement the secure login system for administrators and set up the necessary database schemas to support all content types (news, blogs, events, users, sponsors).
- **Goal 4: Admin Access Point.** The `/admin` route is secured and functional, granting access to authenticated users, leading to a placeholder page indicating the dashboard is in development.

# Scope & Priority
- **CRITICAL:** This is a full web application, not a single page. The scope includes multiple pages, a database, and authentication as explicitly requested.
- **NOW (First Coding Step):**
    - **Frontend (React + Tailwind):**
        - Build all public-facing pages: `HomePage`, `NewsPage` (listing), `BlogPage` (listing), `EventsPage` (listing), `AboutUsPage`, `ContactPage`.
        - Create reusable template pages for `SingleArticlePage` and `SingleEventPage`.
        - Implement all UI components (header, footer, hero, grids, carousels) ensuring full responsiveness.
        - The search bar in the header will be a UI component, but full search logic will be implemented later.
    - **Backend & Database:**
        - **Enable current login/auth architecture.** Create a secure `/admin/login` route.
        - After successful login, redirect to `/admin/dashboard`, which will display a "Dashboard in Development" message.
        - Create database schemas for: `News`, `BlogPosts`, `Events`, `EventBookings`, `Sponsors`, `Users` (with roles: Superadmin, Gestor).
        - Create a functional API endpoint for the **Contact Form** to receive and store submissions.
        - Create a functional API endpoint for the **Event Booking Form** to receive, store bookings, and trigger a confirmation email.
- **NEXT (Future Steps):**
    - Build the full Admin Dashboard UI for all management modules (News, Blog, Events, Sponsors, Users).
    - Implement all backend CRUD APIs to connect the dashboard to the database.
    - Implement the robust search functionality.
    - Implement the audit log system.

# World-Class Design System (tight token table)

**Style Reference:** Goldman Sachs (reason: The user requested a professional, sophisticated design for the financial industry with a black, gold, and gray palette. Goldman Sachs's digital presence is a premier example of this aesthetic, using a clean layout, premium typography, and a dark theme that exudes authority and trust).
**IP Disclaimer:** Inspiration only—no copying brand assets/logos/text; convert into neutral tokens below.

**CRITICAL STYLE MIMICKING RULE:** We will emulate the Goldman Sachs design language. This means using their **Goldman Sans** font for a modern, professional feel, adopting their clean grid system for structured content, and using high-contrast text on dark backgrounds for readability and impact. The layout will be spacious and uncluttered.

| Token | Value | Notes |
|---|---|---|
| Primary | `#FFD700` (Gold) | For CTAs, headlines, active states, and key accents. Mimics Goldman Sachs's use of accent colors. |
| Surface | `#0A0A0A` (Near Black) | Main background color, providing a premium, focused feel. A slight variation on pure black. |
| On-Surface | `#FFFFFF` (White) | High-contrast text on dark backgrounds. |
| Muted | `#808080` (Gray) | For secondary text, subtitles, and borders, as requested. |
| Radius | `4px` | Subtle rounding for a modern but sharp look, avoiding overly soft corners. |
| Shadow | `md` | Subtle shadows on elevated elements like modals, mimicking Goldman Sachs's clean layering. |
| Heading Font | `Goldman Sans` | **CRITICAL:** Use the exact Goldman Sans font for all headings to achieve the sophisticated feel. |
| Body Font | `Goldman Sans` | **CRITICAL:** Use the exact Goldman Sans font for body text, ensuring typographic consistency. |

**Signature Moment:** The Hero Section will feature a full-width, high-quality image of the financial world, with a dark translucent overlay. A large, impactful headline in **Goldman Sans Bold** and colored in Gold (`#FFD700`) will be left-aligned over the image, creating a premium, editorial feel directly inspired by the confident typography of Goldman Sachs.

# Pages & Interactions (tight table)
| Page/Section | Key Content | Primary CTA → Action |
|---|---|---|
| **Header (Fixed)** | Logo "Ser Bancário", Nav (Notícias, Blog, Eventos, Sobre Nós, Contato), Search Bar, Social Icons. | Nav links → Scroll to section or navigate to page. |
| **HomePage (`/`)** | **Hero:** Featured news. <br/> **News:** Grid of recent articles. <br/> **Blog:** Grid of recent posts. <br/> **Events:** List of upcoming events. <br/> **Sponsors:** Carousel of partner logos. | `Ver Todas as Notícias` → `/noticias` <br/> `Ver Todos os Eventos` → `/eventos` |
| **NewsPage (`/noticias`)** | Grid/list of all news articles with filters for category and date. Each item links to its single page. | `Ler Mais` → `/noticias/[slug]` |
| **SingleArticlePage (`/noticias/[slug]`)** | Article content: Title, image, rich-text body, author, date, social share buttons. | Social Share Icons → Trigger native share dialog. |
| **BlogPage (`/blog`)** | Grid/list of all blog posts with filters. | `Ler Mais` → `/blog/[slug]` |
| **SingleBlogPostPage (`/blog/[slug]`)** | Post content: Title, image, rich-text body, author, date, social share buttons. | Social Share Icons → Trigger native share dialog. |
| **EventsPage (`/eventos`)** | List of upcoming and past events. | `Saber Mais` → `/eventos/[slug]` |
| **SingleEventPage (`/eventos/[slug]`)** | Event details: Title, description, date, time, location (map embed). | `Reservar Vaga` → Open functional booking form (modal). |
| **AboutUsPage (`/sobre-nos`)** | [Inferred—Confidence: High] Placeholder content describing the mission of "Ser Bancário". | `Contato` → `/contato` |
| **ContactPage (`/contato`)** | Contact information and a functional contact form (Name, Email, Message). | `Enviar Mensagem` → Submit form data to backend API. |
| **Admin Login (`/admin/login`)** | Secure login form for administrators (Email, Password). | **Enable current login/auth architecture.** `Login` → Authenticate user and redirect to `/admin/dashboard`. |
| **Admin Dashboard (`/admin/dashboard`)** | **Protected Route.** Displays a single message: "Dashboard in Development. Full functionality coming soon." | `Logout` → End session and redirect to `/admin/login`. |
| **Footer** | Contact info, social links, Privacy Policy, Terms of Use, secondary nav. | `Made with Heyboss.ai` → `https://heyboss.ai` |

# Assumptions, Inferences & Open Questions
- **[Inferred—Confidence: High]** The "About Us" and "Contact" pages are required to fulfill the navigation links specified in the header. The content for "About Us" will be placeholder text initially.
- **[Inferred—Confidence: High]** The "Ser Bancário" logo will be created as a text-based logo using the **Goldman Sans** font in Gold (`#FFD700`) to maintain design consistency.
- **[Inferred—Confidence: Med]** The event booking form will be a modal that opens on the `SingleEventPage` to provide a seamless user experience without navigating away. It will collect `Name` and `Email`.
- **[Inferred—Confidence: Med]** The database will be pre-populated with a single `Superadmin` user account for initial setup and testing.

- **Open Questions:**
    1.  Do you have a vector file for the "Ser Bancário" logo? If not, is the text-based logo approach acceptable for the first version?
    2.  What are the initial categories we should configure for the "Notícias" and "Blog" sections (e.g., "Mercado," "Regulação," "Tecnologia," "Opinião")?
    3.  What email address should receive notifications from the contact form and serve as the sender for event booking confirmations?
    4.  Please provide the URLs for the social media profiles (LinkedIn, Twitter, etc.) to be linked in the header and footer.