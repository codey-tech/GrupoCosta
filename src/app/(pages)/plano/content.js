// Conteúdo do Plano Costa.
//
// FONTE: a página anterior do site (material aprovado pelo cliente). Preços,
// número de dependentes, valores de auxílio funeral, taxa de adesão, rede
// credenciada e FAQ vieram todos de lá.
//
// ATENÇÃO — esta é a única página do site que VENDE. Preço errado aqui não é
// erro de texto, é problema comercial. Antes de qualquer publicação, confirme
// com o cliente: valores mensais, taxa de adesão, limites de dependentes e os
// valores do auxílio funeral. Não altere nenhum destes números por conta.
import { whatsappLink, WHATSAPP_MESSAGES } from "@/lib/whatsapp";

export const CONTATO = {
  central: "(51) 2129-4040",
  centralHref: "tel:+555121294040",
  emergencia: "0800 000 4356",
  emergenciaHref: "tel:08000004356",
  whatsappHref: whatsappLink(WHATSAPP_MESSAGES.plano),
};

export const REDES = {
  instagram: "https://www.instagram.com/planocosta/",
  facebook: "https://www.facebook.com/planocosta/",
};

/** Endereço do Plano — NÃO é o mesmo da Costa Ambulâncias. */
export const ENDERECO = {
  rua: "Rua Sete de Setembro, 2356",
  bairro: "Centro — Taquari/RS",
  mapsHref:
    "https://www.google.com/maps/search/?api=1&query=Rua+Sete+de+Setembro,+2356,+Centro,+Taquari+RS",
  mapaEmbed:
    "https://maps.google.com/maps?q=Rua+Sete+de+Setembro,+2356+-+Centro,+Taquari+-+RS&t=&z=16&ie=UTF8&iwloc=&output=embed",
};

/** Âncoras da navegação, na ordem em que aparecem na página. */
export const SECOES = [
  { id: "beneficios", nome: "Benefícios" },
  { id: "rede", nome: "Rede" },
  { id: "planos", nome: "Família" },
  { id: "faq", nome: "Dúvidas" },
  { id: "contato", nome: "Contato" },
];

/** Títulos e textos de abertura de cada seção. */
export const TEXTOS = {
  heroTitulo: ["Conectando você a", "cuidados de saúde de"],
  heroDestaque: "excelência.",
  heroResumo:
    "Planos assistenciais acessíveis e completos, com cobertura que vai além do essencial.",

  beneficiosTitulo: ["Nossos", "Benefícios"],

  redeRotulo: "Rede de Convênios",
  redeTitulo: "Estrutura de",
  redeDestaque: "Atendimento.",
  redeResumo:
    "Conexão direta com as principais instituições e profissionais de saúde da região.",

  planosRotulo: "Para você e sua família",
  planosTitulo: "Escolha sua",
  planosDestaque: "modalidade.",

  faqRotulo: "Dúvidas frequentes",
  faqTitulo: "Tudo o que você",
  faqDestaque: "precisa saber.",
  faqResumo:
    "Ainda tem alguma dúvida sobre os benefícios, coberturas ou como funciona a adesão ao Plano Costa?",

  contatoRotulo: "Fale conosco",
  contatoTitulo: "Estamos aqui",
  contatoDestaque: "por você.",
  contatoResumo:
    "Equipe especializada pronta para tirar suas dúvidas, agendar consultas e oferecer o suporte que sua família merece.",
};

export const TAXA_ADESAO = {
  valor: "R$ 49,99",
  detalhe: "taxa de adesão + proporcional ao mês na abertura",
};

/**
 * Os três planos.
 *
 * `comparaveis` são os campos que entram na matriz de comparação, na mesma
 * ordem para os três — é o que permite ler a tabela na horizontal e enxergar
 * a diferença. Não reordene um plano sem reordenar os outros.
 */
export const PLANOS = [
  {
    id: "topazio",
    nome: "Topázio",
    resumo: "Cuidado essencial para você e sua família",
    preco: "19,99",
    dependentes: 1,
    destaque: false,
    comparaveis: {
      pessoas: "1 + 1",
      pessoasDetalhe: "Titular + cônjuge, filho(a) ou pais",
      rede: "Rede local",
      redeDetalhe: "Convênios em Taquari",
      ambulancia: "Ambulância 24h",
      ambulanciaDetalhe: "Valores exclusivos para associados",
      funeral: "R$ 1.000,00",
    },
  },
  {
    id: "esmeralda",
    nome: "Esmeralda",
    resumo: "A proteção mais inteligente e procurada",
    preco: "39,99",
    dependentes: 4,
    destaque: true,
    comparaveis: {
      pessoas: "1 + 4",
      pessoasDetalhe: "Inclui sogros, sobrinhos e tios",
      rede: "Local + regional",
      redeDetalhe: "Cobertura expandida em toda a região",
      ambulancia: "Ambulância 24h gratuita",
      ambulanciaDetalhe: "Emergências no perímetro urbano",
      funeral: "R$ 3.000,00",
    },
  },
  {
    id: "diamante",
    nome: "Diamante",
    resumo: "Cuidado VIP para quem não abre mão do melhor",
    preco: "59,99",
    dependentes: 6,
    destaque: false,
    comparaveis: {
      pessoas: "1 + 6",
      pessoasDetalhe: "Família completa com máxima abrangência",
      rede: "Premium regional",
      redeDetalhe: "Prioridade absoluta em especialistas",
      ambulancia: "Ambulância 24h gratuita",
      ambulanciaDetalhe: "Emergências no perímetro urbano",
      funeral: "R$ 5.000,00",
    },
  },
];

/**
 * Linhas da matriz de comparação. A ordem aqui é a ordem da tabela.
 * `chave` bate com uma chave de `comparaveis`; `detalhe` é a segunda linha,
 * menor, que explica o valor.
 */
export const LINHAS_COMPARACAO = [
  { rotulo: "Pessoas cobertas", chave: "pessoas", detalhe: "pessoasDetalhe" },
  { rotulo: "Rede credenciada", chave: "rede", detalhe: "redeDetalhe" },
  { rotulo: "Ambulância", chave: "ambulancia", detalhe: "ambulanciaDetalhe" },
  { rotulo: "Auxílio funeral", chave: "funeral" },
];

/** O que vale para todos os planos — dito uma vez, fora da tabela. */
export const BENEFICIOS = [
  {
    titulo: "Medicina & hospitalar",
    itens: [
      "Acesso a internações hospitalares",
      "Tratamentos médicos especializados",
      "Atendimento humanizado e próximo",
    ],
  },
  {
    titulo: "Saúde integrada & exames",
    itens: [
      "Tratamentos odontológicos e profissionais de saúde",
      "Acesso a exames complementares",
      "Acesso a exames laboratoriais",
    ],
  },
  {
    titulo: "Cobertura & estrutura",
    itens: [
      "Acesso a ampla rede de convênios",
      "Ampla área de abrangência estadual",
      "Serviços de ambulância 24h",
    ],
  },
  {
    titulo: "Apoio & vantagens",
    itens: [
      "Equipamentos ortopédicos e hospitalares",
      "Acesso a descontos no comércio",
      "Auxílio funeral de até R$ 5.000",
    ],
  },
];

export const REDE_CIDADES = [
  "Taquari",
  "Lajeado",
  "Estrela",
  "Montenegro",
  "Venâncio Aires",
  "Porto Alegre",
  "Tabaí",
  "Teutônia",
];

export const REDE_CATEGORIAS = [
  {
    id: "hospitalar",
    titulo: "Hospitais e diagnóstico",
    resumo: "Amparo regional garantido com as principais instituições do Vale.",
    itens: [
      "Hospital São José (Taquari)",
      "Hospital Ouro Branco (Teutônia)",
      "Hospital Bruno Born (Lajeado)",
      "Clínica Diagnóstica (Taquari)",
      "Clínica EspaçoRad (Lajeado)",
      "Clínica Unimagem (Estrela)",
      "Laboratório Grams",
      "Laboratório Laborvida",
    ],
  },
  {
    id: "clinicas",
    titulo: "Especialidades clínicas",
    resumo: "Corpo clínico completo para acompanhamento e prevenção.",
    itens: [
      "Cardiologia",
      "Dermatologia",
      "Endocrinologia",
      "Gastroenterologia",
      "Ginecologia e Obstetrícia",
      "Hematologia",
      "Mastologia",
      "Neurologia",
      "Pediatria",
      "Pneumologia",
      "Psiquiatria",
      "Reumatologia",
    ],
  },
  {
    id: "cirurgia",
    titulo: "Cirurgia e trauma",
    resumo: "Intervenções cirúrgicas com profissionais de alta precisão.",
    itens: [
      "Ortopedia e Traumatologia",
      "Urologia",
      "Cirurgia Geral",
      "Cirurgia Plástica",
      "Cirurgia Pediátrica",
      "Coloproctologia",
      "Cirurgia Vascular",
      "Otorrinolaringologia",
      "Oftalmologia",
      "Medicina da Dor",
    ],
  },
  {
    id: "bemestar",
    titulo: "Saúde e bem-estar",
    resumo: "Cuidado multidisciplinar para qualidade de vida diária.",
    itens: [
      "Fisioterapia",
      "Psicologia",
      "Nutrição",
      "Fonoaudiologia",
      "Osteopatia e Pilates",
      "Acupuntura e Massoterapia",
      "Psicopedagogia",
      "Neuropsicologia",
    ],
  },
  {
    id: "odonto",
    titulo: "Odonto & imagem",
    resumo: "Tecnologia de ponta para laudos exatos e saúde bucal.",
    itens: [
      "Cirurgia Geral Odonto",
      "Ortodontia e Endodontia",
      "Bucomaxilofacial",
      "Ressonância Magnética",
      "Tomografia Computadorizada",
      "Ecografias e Mamografia",
      "Endoscopia Digestiva",
      "Radiografias (RX)",
    ],
  },
];

export const FAQS = [
  {
    p: "Quando poderei acessar os benefícios do Plano Costa?",
    r: "Imediatamente após aderir ao plano. Não há carência para começar a utilizar os serviços com planos familiares. 30 dias após a adesão no caso do plano individual.",
  },
  {
    p: "A ambulância 24h possui algum custo?",
    r: "A nossa ambulância é totalmente gratuita exclusivamente para casos de emergência ocorridos dentro do perímetro urbano de Taquari para clientes dos planos familiares.",
  },
  {
    p: "Como funciona a locação de equipamentos?",
    r: "Clientes têm acesso facilitado e valores especiais para locação de itens como andadores, cadeiras de rodas, camas hospitalares, muletas e nebulizadores.",
  },
  {
    p: "Onde o plano oferece cobertura?",
    r: "Nossa rede de parceiros abrange diversas cidades, incluindo Taquari, Lajeado, Estrela, Montenegro, Venâncio Aires, Porto Alegre, Tabaí, Teutônia.",
  },
];
