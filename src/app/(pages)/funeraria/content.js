// Conteúdo da Funerária Costa.
//
// FONTES: catálogo oficial "Memórias e Homenagens" (Grupo Costa, jan/2025) e
// o material de divulgação do Memórias de 4 Patas. Nada aqui deve ser
// inventado — se não está em um dos dois, não entra na página.
import {
  whatsappLink,
  WHATSAPP_MESSAGES,
  WHATSAPP_FUNERARIA,
} from "@/lib/whatsapp";

/**
 * Os dois canais têm papéis distintos e NÃO devem ser trocados:
 * o 0800 é a linha de voz, o 98121-1131 responde só por WhatsApp.
 * Nunca ligue o número do WhatsApp num `href="tel:"`.
 */
export const CONTATO = {
  // Linha principal de voz, gratuita, 24h.
  tel0800: "0800 000 4356",
  tel0800Href: "tel:08000004356",
  // Só WhatsApp — este número não atende ligação.
  whatsappNumero: "(51) 98121-1131",
  whatsapp: WHATSAPP_FUNERARIA,
  whatsappHref: whatsappLink(WHATSAPP_MESSAGES.funeraria, WHATSAPP_FUNERARIA),
};

/**
 * Capítulos. A ordem define o sumário do hero, o trilho fixo do rodapé e os
 * rótulos verticais de margem. `id` precisa bater com o id da <section>.
 */
export const CAPITULOS = [
  { id: "funeraria", n: "01", nome: "A Funerária" },
  { id: "cuidado", n: "02", nome: "Cuidado" },
  { id: "coroas", n: "03", nome: "Coroas" },
  { id: "estrutura", n: "04", nome: "Estrutura" },
  { id: "memoriais", n: "05", nome: "Memoriais" },
  { id: "legado", n: "06", nome: "Legado" },
];

export const UNIDADES = [
  {
    cidade: "Taquari",
    tipo: "Matriz",
    endereco: "Rua 14 de Julho, 30",
    referencia: "Em frente ao Hospital São José",
    mapsHref:
      "https://www.google.com/maps/search/?api=1&query=Rua+14+de+Julho,+30,+Taquari+RS",
  },
  {
    cidade: "Tabaí",
    tipo: "Filial",
    endereco: "R. Vinte e Oito de Dezembro, 333",
    referencia: null,
    mapsHref:
      "https://www.google.com/maps/search/?api=1&query=Rua+Vinte+e+Oito+de+Dezembro,+333,+Tabaí+RS",
  },
];

/**
 * Capítulo 02 — o que a funerária faz.
 *
 * Substitui o antigo capítulo de urnas: a família que chega aqui precisa saber
 * o que está coberto, não escolher modelo de urna. Cada item vem da linha de
 * serviços e do cerimonial descritos no catálogo.
 */
export const CUIDADOS = [
  {
    titulo: "Translado",
    nota: "Frota própria",
    texto:
      "Veículos adequados às necessidades de cada situação, garantindo dignidade e respeito em todos os momentos.",
  },
  {
    titulo: "Cerimonial",
    nota: "Preparação e condução",
    texto:
      "Preparação e organização de todo o cerimonial, do primeiro ao último momento da despedida.",
  },
  {
    titulo: "Organização de velórios",
    nota: "Memorial Costa",
    texto:
      "Condução do velório em capela preparada para receber quem vem se despedir.",
  },
  {
    titulo: "Documentação",
    nota: "Apoio completo",
    texto:
      "Apoio na obtenção dos documentos necessários, para que a burocracia não chegue até a família.",
  },
  {
    titulo: "Serviço de copa",
    nota: "Durante o velório",
    texto:
      "Copa disponível ao longo de toda a cerimônia, para a família e para quem vem prestar homenagem.",
  },
  {
    titulo: "Coroas e ornamentações",
    nota: "Flores naturais",
    texto:
      "Coroas, corbélias e ornamentação montadas com flores naturais e fita personalizada de homenagem.",
  },
];

/** Capítulo 03 — as coroas do catálogo, com as fotos extraídas dele. */
export const COROAS = [
  {
    nome: "Crisântemos e Gérberas",
    src: "/funeraria/coroa-crisantemos-gerberas.webp",
  },
  {
    nome: "Gérberas e Astromélias",
    src: "/funeraria/coroa-gerberas-astromelias.webp",
  },
  { nome: "Crisântemos", src: "/funeraria/coroa-crisantemos.webp" },
  { nome: "Rosas", src: "/funeraria/coroa-rosas.webp" },
  { nome: "Gérberas", src: "/funeraria/coroa-gerberas.webp" },
  { nome: "Corbélias", src: "/funeraria/coroa-corbelias.webp" },
];

/**
 * Capítulo 04 — a estrutura própria da Funerária Costa.
 * O Memorial da Paz NÃO entra aqui: é do Grupo Costa e tem página própria.
 */
export const ESTRUTURAS = [
  {
    n: "01",
    titulo: "Memorial Costa",
    tipo: "Capela",
    texto:
      "A Funerária Costa disponibiliza também o Memorial Costa, uma capela acolhedora e preparada para proporcionar conforto e tranquilidade às famílias durante o cerimonial.",
    src: "/funeraria/memorial-costa.webp",
    alt: "Interior da capela do Memorial Costa, com poltronas, cruz iluminada e revestimento em madeira.",
  },
  {
    n: "02",
    titulo: "Veículos para translado",
    tipo: "Frota",
    texto:
      "Veículos para translado adequados às necessidades de cada situação, garantindo dignidade e respeito em todos os momentos.",
    src: "/funeraria/frota.webp",
    alt: "Dois veículos brancos da frota de translado da Funerária Costa.",
    contain: true,
  },
];

/**
 * Capítulo 05 — as frentes que têm página própria.
 *
 * São coisas distintas: um cemitério e um serviço de cremação pet. Não as
 * numere nem as apresente como um par de opções equivalentes — cada uma é uma
 * porta para outro lugar. A autoria (Grupo Costa / Funerária Costa) vive
 * dentro do texto, em frase corrida: como etiqueta solta não dizia nada a
 * quem está lendo.
 *
 * Aqui só cabe a apresentação. Não detalhe serviço nem preço neste bloco.
 */
export const MEMORIAIS = [
  {
    marca: "Memorial da Paz",
    tipo: "Cemitério ecumênico",
    texto:
      "Do Grupo Costa, o Memorial da Paz é um empreendimento ecumênico com um novo conceito de acolher a saudade. Administrado com respeito e cuidado, proporciona um ambiente sereno para homenagens e despedidas.",
    href: "/memorial",
    cta: "Conhecer o Memorial da Paz",
    src: "/funeraria/memorial-paz.webp",
    alt: "Jardim do Memorial da Paz, com muro de nichos florido, banco e vegetação.",
  },
  {
    marca: "Memórias de 4 Patas",
    tipo: "Cremação pet",
    texto:
      "O serviço de cremação pet da Funerária Costa. Todo o amor e cuidado que o seu Pet merece — cuidamos de todos os detalhes para que as lembranças do seu companheiro sejam eternizadas.",
    frase: "Porque o amor não tem fim, ele se transforma em memória.",
    href: "/memorias-4-patas",
    cta: "Conhecer o Memórias de 4 Patas",
    src: null,
  },
];
