// Conteúdo da página inicial do Grupo Costa.
//
// FONTES: cada frase vem da página da própria unidade ou do metadado de SEO
// dela, ambos material já aprovado. Nada aqui é escrito do zero — a home não é
// lugar de estrear afirmação sobre a empresa.
//
// A HOME NÃO ROLA. É uma tela só, de navegação, dividida em dois territórios.
// Não acrescente seção institucional aqui: se precisar de texto sobre o grupo,
// ele vive nas páginas das unidades.
//
// A PALETA DE CADA UNIDADE É A PALETA DA PÁGINA DE DESTINO. Não invente cor
// nova aqui: se a Funerária mudar de papel para outro tom, a home muda junto,
// senão ela passa a prometer uma coisa e entregar outra.
//
// AS IMAGENS EM /public/home ESTÃO TODAS EM 1760×990. A do Plano é um quadro
// extraído de `/hero.mp4`.

/**
 * As cinco unidades, na ordem do arco de uma vida:
 * prevenção → cuidado → urgência → despedida → memória.
 *
 * Não é ordem de importância comercial nem alfabética. É a ordem em que uma
 * família encontra o Grupo Costa ao longo do tempo.
 *
 * `acento` — realce do nome no hover (pousa sobre papel ou carvão da home).
 * `entrada` — cor da cortina ao sair da home. Tem que ser a mesma do preloader
 * ou do primeiro frame da página de destino, senão o salto fica visível
 * (ex.: dourado na home → preto no loader da Funerária).
 */
export const UNIDADES = [
  {
    id: "plano",
    foto: "/home/plano.webp",
    fotoAlt: "Família reunida ao entardecer.",
    href: "/plano",
    nome: "Plano Costa",
    curto: "Plano",
    momento: "Prevenção",
    frase:
      "Assistência familiar com rede credenciada, ambulância 24h e auxílio funeral.",
    acento: "#6d28d9",
    entrada: "#fafafa",
    fonte: "var(--font-geist-sans)",
    peso: "800",
    italico: true,
  },
  {
    id: "centro-clinico",
    foto: "/home/centro-clinico.webp",
    fotoAlt: "Fachada do Centro Clínico Costa iluminada ao anoitecer.",
    href: "/centro-clinico",
    nome: "Centro Clínico Costa",
    curto: "Centro Clínico",
    momento: "Cuidado",
    frase:
      "Consultas médicas, especialidades e exames, com atendimento humanizado.",
    acento: "#0e7490",
    entrada: "#FDF9EE",
    fonte: "var(--font-geist-sans)",
    peso: "800",
    italico: false,
  },
  {
    id: "ambulancias",
    foto: "/home/ambulancias.webp",
    fotoAlt: "Frota de ambulâncias da Costa enfileirada em dia de sol.",
    href: "/ambulancias",
    nome: "Costa Ambulâncias",
    curto: "Ambulâncias",
    momento: "Urgência",
    frase: "Remoções e transporte de pacientes, 24 horas por dia.",
    acento: "#c2410c",
    entrada: "#0e1114",
    fonte: "var(--font-archivo)",
    peso: "600",
    italico: false,
  },
  {
    id: "funeraria",
    foto: "/home/funeraria.webp",
    fotoAlt: "Interior da capela do Memorial Costa.",
    href: "/funeraria",
    nome: "Funerária Costa",
    curto: "Funerária",
    momento: "Despedida",
    frase: "Serviços funerários completos, com atendimento 24 horas.",
    acento: "#c4a978",
    entrada: "#0c0c0b",
    fonte: "var(--font-fraunces)",
    peso: "300",
    italico: false,
  },
  {
    id: "memorial",
    foto: "/home/memorial.webp",
    fotoAlt: "Jardim do Memorial da Paz.",
    href: "/memorial",
    nome: "Memorial da Paz",
    curto: "Memorial",
    momento: "Memória",
    frase:
      "Cemitério Ecumênico Luterano — um ambiente sereno para homenagens e despedidas.",
    // Dourado e verde amostrados do logotipo oficial do Memorial da Paz. O
    // verde-sálvia que estava aqui não existia em lugar nenhum da marca.
    acento: "#b89860",
    entrada: "#15251b",
    fonte: "var(--font-fraunces)",
    peso: "300",
    italico: true,
  },
];

/**
 * Os dois territórios da tela.
 *
 * A divisão é literal: SAÚDE em luz, LUTO em sombra, separados por uma costura
 * diagonal. Não é enfeite — é a linha que o próprio grupo atravessa, e é o que
 * orienta quem chega. Ninguém que procura plano de saúde deve cair sem aviso
 * na funerária.
 *
 * Os acentos das unidades foram ESCURECIDOS no lado claro (roxo, azul e laranja
 * mais fechados que os das páginas) porque ali eles pousam sobre papel, não
 * sobre carvão. Continuam sendo a cor da página de destino, um grau abaixo.
 */
export const TERRITORIOS = [
  {
    id: "saude",
    rotulo: "Saúde",
    frase: "Prevenção, cuidado e urgência.",
    foto: "/home/clinica.webp",
    fotoAlt: "Fachada do Centro Clínico Costa iluminada ao anoitecer.",
    // Véu claro sobre a foto: o lado da vida é o lado iluminado.
    veu: "rgba(244,242,237,0.84)",
    tinta: "#14100c",
    unidades: ["plano", "centro-clinico", "ambulancias"],
  },
  {
    id: "luto",
    rotulo: "Luto",
    frase: "Despedida e memória.",
    foto: "/home/funeraria.webp",
    fotoAlt: "Interior da capela do Memorial Costa.",
    veu: "rgba(10,11,10,0.80)",
    tinta: "#ebe8e2",
    unidades: ["funeraria", "memorial"],
  },
];

/** Emergência, sempre alcançável a partir da home. */
export const EMERGENCIA = {
  numero: "0800 000 4356",
  href: "tel:08000004356",
  rotulo: "Emergência 24h",
};

export const ABERTURA = {
  grupo: "Grupo Costa",
  local: "Taquari — RS",
  dica: "Escolha um lado",
};
