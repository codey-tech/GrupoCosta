// Conteúdo da Costa Ambulâncias.
//
// FONTE: a cópia da página anterior do site, que é o material aprovado pelo
// cliente. Os textos abaixo são dela — em vários casos literais.
//
// LIÇÃO DE UMA VERSÃO ANTERIOR: eu havia espremido este conteúdo em formatos
// que ele não pede. "Monitoramento cardíaco avançado", virou linha de tabela
// (`Monitoramento | Cardíaco`) e passou a soar como especificação de produto,
// que não é. Também inventei indicadores para o topo e uma linha de
// "disponibilidade" que não existia. Se um texto não couber num formato,
// troque o formato — não o texto.
import { whatsappLink, WHATSAPP_MESSAGES } from "@/lib/whatsapp";

export const CONTATO = {
  // Linha de emergência, gratuita.
  emergencia: "0800 000 4356",
  emergenciaHref: "tel:08000004356",
  // Suporte administrativo.
  suporte: "(51) 2129-4040",
  suporteHref: "tel:+555121294040",
  // WhatsApp geral do Grupo Costa.
  whatsappHref: whatsappLink(WHATSAPP_MESSAGES.ambulancias),
};

export const REDES = {
  instagram: "https://www.instagram.com/costa.ambulancias/",
  facebook: "https://www.facebook.com/planocosta/",
};

/** Âncoras do cabeçalho. */
export const SECOES = [
  { id: "servicos", nome: "Serviços" },
  { id: "frota", nome: "Frota" },
  { id: "cobertura", nome: "Cobertura" },
];

/** Abertura. O título é a frase original, inteira. */
export const ABERTURA = {
  rotulo: "Remoções e transporte de pacientes · Taquari — RS",
  titulo: "Onde cada segundo importa,",
  complemento: "estamos prontos para você.",
  chamada: "Precisa de ajuda agora?",
};

/** Institucional — parágrafo original, sem cortes. */
export const SOBRE = [
  "Há anos, a Costa Ambulâncias atua com excelência no transporte de pacientes e atendimento emergencial, oferecendo serviços que aliam rapidez, segurança e cuidado.",
  "Com uma frota moderna, profissionais capacitados e uma rede de atendimento abrangente, estamos sempre prontos para garantir o melhor suporte nos momentos em que mais importa.",
  "Nosso compromisso é com a sua saúde, sua segurança e sua confiança.",
];

export const SERVICOS_INTRO =
  "Na Costa Ambulâncias, oferecemos uma gama completa de serviços para garantir o cuidado e o suporte que você precisa, a qualquer hora e em qualquer lugar.";

export const SERVICOS = [
  {
    n: "01",
    titulo: "Transporte de pacientes",
    texto:
      "Realizamos o transporte de pacientes em situações de urgência e emergência com segurança e conforto, utilizando ambulâncias equipadas e equipes qualificadas.",
  },
  {
    n: "02",
    titulo: "Atendimento emergencial 24h",
    texto:
      "Disponibilizamos atendimento de emergência a qualquer momento, com rapidez e eficiência para atender às situações mais críticas.",
  },
  {
    n: "03",
    titulo: "Cobertura de eventos",
    texto:
      "Oferecemos cobertura completa para eventos, com ambulâncias prontas para atender emergências durante eventos de pequeno ou grande porte, garantindo tranquilidade para organizadores e participantes.",
  },
  {
    n: "04",
    titulo: "Locação de ambulâncias",
    texto:
      "Oferecemos serviços de locação de ambulâncias equipadas e preparadas para atender diversas necessidades, desde transporte médico de rotina até situações de emergência.",
  },
];

export const SERVICOS_FECHO =
  "Conte com a Costa Ambulâncias para cuidar de quem você ama, a qualquer hora e em qualquer situação.";

/**
 * Os três pilares que a página anterior trazia em destaque.
 * São afirmações institucionais, não especificações — ficam como frases.
 */
export const PILARES = [
  "Frota de última geração",
  "Equipe qualificada e atendimento humanizado",
  "Abrangência regional, garantindo saúde para todos",
];

export const FROTA = {
  titulo: "Compromisso com a vida, tecnologia no atendimento.",
  subtitulo: "Frota de ponta: conforto e tecnologia em movimento.",
  destaque: "Ambulâncias equipadas para salvar vidas.",
  intro:
    "Com uma frota em operação, incluindo as 4 novas unidades recém-adquiridas, garantimos um atendimento rápido e eficiente para qualquer emergência.",
  equipamentosTitulo: "Equipamentos de última geração",
  equipamentos: [
    "Nossas ambulâncias estão equipadas com monitoramento cardíaco avançado, garantindo um acompanhamento completo dos sinais vitais dos pacientes em tempo real.",
    "Além disso, todas as unidades possuem sistemas de climatização para proporcionar conforto e bem-estar durante o transporte, independente das condições climáticas.",
  ],
  fecho:
    "Estamos prontos para oferecer um atendimento de excelência, com tecnologia e dedicação para cuidar de você e de sua família.",
};

/**
 * Fotos, nomeadas pelo papel que cumprem — não por ordem de arquivo.
 *
 * Todas são externas, da frota, em luz de dia; `equipe` é a única com pessoas
 * e por isso carrega sozinha o momento humano da página. Os textos alternativos
 * descrevem o que está na imagem de fato, não o que seria conveniente.
 */
export const FOTOS = {
  capa: {
    src: "/assets/bg-ambulancias.webp",
    alt: "Frota de ambulâncias da Costa enfileirada em dia de sol.",
  },
  servicos: {
    src: "/assets/amb3.webp",
    alt: "Ambulâncias da Costa estacionadas em frente à base, em Taquari.",
  },
  frota: {
    src: "/assets/amb4.webp",
    alt: "Ambulâncias da frota da Costa vistas de frente, enfileiradas.",
  },
  detalhe: {
    src: "/assets/amb1.webp",
    alt: "Traseira de uma ambulância da Costa, com identificação da empresa.",
  },
  lateral: {
    src: "/assets/amb2.webp",
    alt: "Ambulâncias da Costa vistas de lado, na base operacional.",
  },
  equipe: {
    src: "/assets/equipe.webp",
    alt: "Equipe da Costa Ambulâncias em frente às ambulâncias.",
  },
};

/** Onde estamos. */
export const BASE_OPERACIONAL = {
  endereco: "Tv. Quatro de Julho, 30",
  bairro: "Centro — Taquari/RS",
  cep: "95860-000",
  mapsHref:
    "https://www.google.com/maps/search/?api=1&query=Travessa+Quatro+de+Julho,+30,+Centro,+Taquari+RS",
  // Mesmo embed que já estava na página anterior.
  mapaEmbed:
    "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3462.108802520995!2d-51.8661733!3d-29.8034009!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x951b8569329b5ed9%3A0x2d5e4d3b4b3512b8!2sTv.%20Quatro%20de%20Julho%2C%2030%20-%20Centro%2C%20Taquari%20-%20RS%2C%2095860-000!5e0!3m2!1spt-BR!2sbr!4v1741808530157!5m2!1spt-BR!2sbr",
};
