import { SITE_URL } from "./config";

/** @param {Record<string, unknown>} data */
export function toJsonLd(data) {
  return JSON.stringify(data);
}

export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Grupo Costa",
    url: SITE_URL,
    logo: `${SITE_URL}/logogrupo.png`,
    description:
      "Grupo de saúde e serviços funerários em Taquari/RS: Plano Costa, Centro Clínico, Costa Ambulâncias, Funerária Costa e Memorial.",
    areaServed: [
      { "@type": "City", name: "Taquari" },
      { "@type": "City", name: "Tabaí" },
      { "@type": "City", name: "Triunfo" },
    ],
    subOrganization: [
      {
        "@type": "Organization",
        name: "Plano Costa",
        url: `${SITE_URL}/plano`,
      },
      {
        "@type": "Organization",
        name: "Centro Clínico Costa",
        url: `${SITE_URL}/centro-clinico`,
      },
      {
        "@type": "Organization",
        name: "Costa Ambulâncias",
        url: `${SITE_URL}/ambulancias`,
      },
      {
        "@type": "Organization",
        name: "Funerária Costa",
        url: `${SITE_URL}/funeraria`,
      },
      {
        "@type": "Organization",
        name: "Memorial da Paz",
        url: `${SITE_URL}/memorial`,
      },
    ],
  };
}

export function funerariaLocalBusinessJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: "Funerária Costa Taquari",
    url: `${SITE_URL}/funeraria`,
    telephone: "+555136533045",
    image: `${SITE_URL}/logogrupo.png`,
    address: {
      "@type": "PostalAddress",
      streetAddress: "Travessa 4 de Julho, 30",
      addressLocality: "Taquari",
      addressRegion: "RS",
      postalCode: "95860-000",
      addressCountry: "BR",
    },
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: [
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday",
          "Sunday",
        ],
        opens: "00:00",
        closes: "23:59",
      },
    ],
    areaServed: [
      { "@type": "City", name: "Taquari" },
      { "@type": "City", name: "Tabaí" },
      { "@type": "City", name: "Triunfo" },
    ],
  };
}

export function planoLocalBusinessJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: "Costa Plano de Assistência Familiar e Empresarial",
    url: `${SITE_URL}/plano`,
    telephone: "+555121294040",
    image: `${SITE_URL}/logogrupo.png`,
    address: {
      "@type": "PostalAddress",
      streetAddress: "Rua Sete de Setembro, 2356",
      addressLocality: "Taquari",
      addressRegion: "RS",
      postalCode: "95860-000",
      addressCountry: "BR",
    },
    areaServed: [
      { "@type": "City", name: "Taquari" },
      { "@type": "City", name: "Tabaí" },
      { "@type": "City", name: "Lajeado" },
      { "@type": "City", name: "Estrela" },
    ],
  };
}

export function centroClinicoJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "MedicalClinic",
    name: "Centro Clínico Costa",
    url: `${SITE_URL}/centro-clinico`,
    telephone: "+555121294040",
    image: `${SITE_URL}/logos/centroclinico.svg`,
    address: {
      "@type": "PostalAddress",
      streetAddress: "Rua Sete de Setembro, 2356",
      addressLocality: "Taquari",
      addressRegion: "RS",
      postalCode: "95860-000",
      addressCountry: "BR",
    },
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        opens: "08:00",
        closes: "18:00",
      },
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: "Saturday",
        opens: "08:00",
        closes: "12:00",
      },
    ],
    areaServed: { "@type": "City", name: "Taquari" },
  };
}

export function ambulanciasLocalBusinessJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: "Costa Ambulâncias",
    url: `${SITE_URL}/ambulancias`,
    telephone: "+555121294040",
    image: `${SITE_URL}/assets/logopng.png`,
    address: {
      "@type": "PostalAddress",
      streetAddress: "Travessa 4 de Julho, 30",
      addressLocality: "Taquari",
      addressRegion: "RS",
      postalCode: "95860-000",
      addressCountry: "BR",
    },
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: [
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday",
          "Sunday",
        ],
        opens: "00:00",
        closes: "23:59",
      },
    ],
    areaServed: [
      { "@type": "City", name: "Taquari" },
      { "@type": "City", name: "Tabaí" },
      { "@type": "City", name: "Triunfo" },
    ],
  };
}

export function memorialJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Cemetery",
    name: "Memorial da Paz",
    url: `${SITE_URL}/memorial`,
    parentOrganization: {
      "@type": "Organization",
      name: "Grupo Costa",
      url: SITE_URL,
    },
    address: {
      "@type": "PostalAddress",
      addressLocality: "Taquari",
      addressRegion: "RS",
      postalCode: "95860-000",
      addressCountry: "BR",
    },
    areaServed: { "@type": "City", name: "Taquari" },
  };
}
