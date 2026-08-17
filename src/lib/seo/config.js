export const SITE_URL = "https://grupocosta.online";

export const SITE_NAME = "Grupo Costa";

export const DEFAULT_OG_IMAGE = "/og-image.jpg";

export const HOME_TITLE =
  "Grupo Costa | Saúde e Serviços Funerários em Taquari/RS";

export const HOME_DESCRIPTION =
  "Plano Costa, Centro Clínico, Costa Ambulâncias, Funerária Costa e Memorial. Há décadas cuidando das famílias de Taquari, Tabaí e região.";

/** @param {string} path */
export function absoluteUrl(path = "/") {
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `${SITE_URL}${normalized}`;
}

/**
 * @param {object} params
 * @param {string} params.title
 * @param {string} params.description
 * @param {string} params.path
 */
export function buildPageMetadata({ title, description, path }) {
  const url = absoluteUrl(path);

  return {
    title,
    description,
    alternates: {
      canonical: path,
    },
    openGraph: {
      title,
      description,
      url,
      siteName: SITE_NAME,
      locale: "pt_BR",
      type: "website",
      images: [
        {
          url: DEFAULT_OG_IMAGE,
          width: 1200,
          height: 630,
          alt: SITE_NAME,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [DEFAULT_OG_IMAGE],
    },
  };
}

export const PAGE_METADATA = {
  home: buildPageMetadata({
    title: HOME_TITLE,
    description: HOME_DESCRIPTION,
    path: "/",
  }),
  plano: buildPageMetadata({
    title: "Plano Costa | Assistência Familiar e Empresarial em Taquari/RS",
    description:
      "Plano de assistência com rede de convênios em saúde, auxílio funeral, ambulância e Centro Clínico próprio. Proteja sua família em Taquari e região.",
    path: "/plano",
  }),
  funeraria: buildPageMetadata({
    title: "Funerária Costa | Atendimento 24 horas em Taquari e Região",
    description:
      "Serviços funerários completos em Taquari/RS: atendimento 24h, translado, coroas de flores naturais e assistência à família. Acionamento 24h: 0800 000 4356.",
    path: "/funeraria",
  }),
  centroClinico: buildPageMetadata({
    title:
      "Centro Clínico Costa | Consultas e Especialidades em Taquari/RS",
    description:
      "Consultas médicas, especialidades e exames em Taquari/RS. Atendimento humanizado, particular e convênio Plano Costa. Agende pelo (51) 2129-4040.",
    path: "/centro-clinico",
  }),
  ambulancias: buildPageMetadata({
    title:
      "Costa Ambulâncias | Remoções e Transporte de Pacientes — Taquari/RS",
    description:
      "Remoções e transporte de pacientes 24h em Taquari e região. Frota equipada, equipe qualificada. Emergência: 0800 000 4356.",
    path: "/ambulancias",
  }),
  memorial: buildPageMetadata({
    title: "Memorial | Grupo Costa — Taquari/RS",
    description:
      "Memorial da Paz em Taquari/RS: espaço de respeito, memória e acolhimento às famílias. Parte do Grupo Costa, ao lado da Funerária Costa.",
    path: "/memorial",
  }),
  privacidade: buildPageMetadata({
    title: "Política de Privacidade | Grupo Costa",
    description:
      "Como o site do Grupo Costa coleta e usa dados pessoais: adesão ao Plano Costa, contato do Centro Clínico, cookies e seus direitos pela LGPD.",
    path: "/politica-de-privacidade",
  }),
};
