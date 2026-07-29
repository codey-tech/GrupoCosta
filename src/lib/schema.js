/**
 * Dados estruturados JSON-LD do Grupo Costa.
 * Só contém informação alinhada aos dados oficiais do cliente / visível no site.
 */

export const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": "https://grupocosta.online/#organization",
  name: "Grupo Costa",
  legalName: "Costa Plano de Assistência Familiar e Empresarial Ltda",
  taxID: "08.070.693/0001-09",
  url: "https://grupocosta.online",
  logo: "https://grupocosta.online/logogrupo.png",
  image: "https://grupocosta.online/og-image.jpg",
  description:
    "Plano Costa, Centro Clínico, Costa Ambulâncias, Funerária Costa e Memorial da Paz. Há décadas cuidando das famílias de Taquari, Tabaí e região.",
  telephone: "+555121294040",
  address: {
    "@type": "PostalAddress",
    streetAddress: "Rua Sete de Setembro, 2356",
    addressLocality: "Taquari",
    addressRegion: "RS",
    postalCode: "95860-000",
    addressCountry: "BR",
  },
  geo: {
    "@type": "GeoCoordinates",
    latitude: -29.795961853191617,
    longitude: -51.8659568556274,
  },
  sameAs: [
    "https://www.instagram.com/planocosta/",
    "https://www.facebook.com/planocosta/",
    "https://www.instagram.com/costa.ambulancias/",
  ],
  subOrganization: [
    {
      "@type": "Organization",
      name: "Plano Costa",
      url: "https://grupocosta.online/plano",
    },
    {
      "@type": "Organization",
      name: "Centro Clínico Costa",
      url: "https://grupocosta.online/centro-clinico",
    },
    {
      "@type": "Organization",
      name: "Costa Ambulâncias",
      url: "https://grupocosta.online/ambulancias",
    },
    {
      "@type": "Organization",
      name: "Funerária Costa",
      url: "https://grupocosta.online/funeraria",
    },
    {
      "@type": "Organization",
      name: "Memorial da Paz",
      url: "https://grupocosta.online/memorial",
    },
  ],
};

export const planoSchema = {
  "@context": "https://schema.org",
  "@type": "InsuranceAgency",
  "@id": "https://grupocosta.online/plano#business",
  name: "Plano Costa",
  url: "https://grupocosta.online/plano",
  parentOrganization: { "@id": "https://grupocosta.online/#organization" },
  telephone: "+555121294040",
  address: {
    "@type": "PostalAddress",
    streetAddress: "Rua Sete de Setembro, 2356",
    addressLocality: "Taquari",
    addressRegion: "RS",
    postalCode: "95860-000",
    addressCountry: "BR",
  },
  geo: {
    "@type": "GeoCoordinates",
    latitude: -29.795961853191617,
    longitude: -51.8659568556274,
  },
  areaServed: [
    "Taquari",
    "Tabaí",
    "Lajeado",
    "Estrela",
    "Teutônia",
    "Montenegro",
    "Venâncio Aires",
    "Porto Alegre",
  ],
};

export const planoFaqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "Quando poderei acessar os benefícios do Plano Costa?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Imediatamente após aderir ao plano. Não há carência para começar a utilizar os serviços com planos familiares. 30 dias após a adesão no caso do plano individual.",
      },
    },
    {
      "@type": "Question",
      name: "A ambulância 24h possui algum custo?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "A nossa ambulância é totalmente gratuita exclusivamente para casos de emergência ocorridos dentro do perímetro urbano de Taquari para clientes dos planos familiares.",
      },
    },
    {
      "@type": "Question",
      name: "Como funciona a locação de equipamentos?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Clientes têm acesso facilitado e valores especiais para locação de itens como andadores, cadeiras de rodas, camas hospitalares, muletas e nebulizadores.",
      },
    },
    {
      "@type": "Question",
      name: "Onde o plano oferece cobertura?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Nossa rede de parceiros abrange diversas cidades, incluindo Taquari, Lajeado, Estrela, Montenegro, Venâncio Aires, Porto Alegre, Tabaí, Teutônia.",
      },
    },
  ],
};

export const centroClinicoSchema = {
  "@context": "https://schema.org",
  "@type": "MedicalClinic",
  "@id": "https://grupocosta.online/centro-clinico#business",
  name: "Centro Clínico Costa",
  url: "https://grupocosta.online/centro-clinico",
  parentOrganization: { "@id": "https://grupocosta.online/#organization" },
  telephone: "+555121294040",
  address: {
    "@type": "PostalAddress",
    streetAddress: "Rua Sete de Setembro, 2356",
    addressLocality: "Taquari",
    addressRegion: "RS",
    postalCode: "95860-000",
    addressCountry: "BR",
  },
  geo: {
    "@type": "GeoCoordinates",
    latitude: -29.795961853191617,
    longitude: -51.8659568556274,
  },
};

export const ambulanciasSchema = {
  "@context": "https://schema.org",
  "@type": "EmergencyService",
  "@id": "https://grupocosta.online/ambulancias#business",
  name: "Costa Ambulâncias",
  url: "https://grupocosta.online/ambulancias",
  parentOrganization: { "@id": "https://grupocosta.online/#organization" },
  telephone: "+555121294040",
  address: {
    "@type": "PostalAddress",
    streetAddress: "Travessa Quatro de Julho, 30",
    addressLocality: "Taquari",
    addressRegion: "RS",
    postalCode: "95860-000",
    addressCountry: "BR",
  },
};

export const funerariaSchema = {
  "@context": "https://schema.org",
  "@type": "FuneralHome",
  "@id": "https://grupocosta.online/funeraria#business",
  name: "Funerária Costa",
  url: "https://grupocosta.online/funeraria",
  parentOrganization: { "@id": "https://grupocosta.online/#organization" },
  telephone: "+555121294040",
  address: {
    "@type": "PostalAddress",
    streetAddress: "Travessa Quatro de Julho, 30",
    addressLocality: "Taquari",
    addressRegion: "RS",
    postalCode: "95860-000",
    addressCountry: "BR",
  },
};

export const memorialSchema = {
  "@context": "https://schema.org",
  "@type": "FuneralHome",
  "@id": "https://grupocosta.online/memorial#business",
  name: "Memorial da Paz",
  url: "https://grupocosta.online/memorial",
  parentOrganization: { "@id": "https://grupocosta.online/#organization" },
  telephone: "+555121294040",
  address: {
    "@type": "PostalAddress",
    streetAddress: "Rua da Paz, 35",
    addressLocality: "Taquari",
    addressRegion: "RS",
    addressCountry: "BR",
  },
};
