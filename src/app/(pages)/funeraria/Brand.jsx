/**
 * Elementos de marca da Funerária Costa, redesenhados a partir do catálogo
 * oficial "Memórias e Homenagens".
 *
 * Não invente variações: o logotipo é o lockup FUNERÁRIA + COSTA sem espaço,
 * com o primeiro termo leve e o segundo pesado, e a marca gráfica é a pomba
 * em traço contínuo da capa.
 */

/**
 * Lockup FUNERÁRIACOSTA — leve + pesado, sem espaço, caixa-alta.
 *
 * @param {{ className?: string, empilhado?: boolean }} props
 *   `empilhado` quebra em duas linhas. Em uma linha só, as catorze letras
 *   ocupam quase 9em: em tela estreita o lockup estoura a viewport muito antes
 *   de chegar a um corpo que tenha presença. Empilhado, cabe e cresce.
 */
export function Wordmark({ className = "", empilhado = false }) {
  if (empilhado) {
    return (
      <span className={`fc-wordmark block ${className}`}>
        <span className="block font-light">FUNERÁRIA</span>
        <span className="block font-extrabold">COSTA</span>
      </span>
    );
  }

  return (
    <span className={`fc-wordmark whitespace-nowrap ${className}`}>
      <span className="font-light">FUNERÁRIA</span>
      <span className="font-extrabold">COSTA</span>
    </span>
  );
}

/**
 * Pomba da marca — traço extraído do vetor original.
 *
 * Este `d` NÃO foi desenhado à mão: veio do arquivo do catálogo "Memórias e
 * Homenagens", convertido de PDF para SVG e normalizado. As tentativas de
 * redesenhar de olho falharam porque a capa mostra a pomba SANGRADA — só o
 * topo da asa aparece, e a silhueta recortada lê como uma cadeia de morros.
 * A ave inteira tem bico à esquerda, asa erguida em V e cauda longa à direita.
 *
 * Não substitua por aproximação. Se precisar de outra versão, extraia de novo
 * do material oficial.
 *
 * viewBox acomoda metade da espessura do traço nas quatro bordas, para a
 * ponta do bico e da cauda não serem cortadas.
 *
 * @param {{ className?: string, strokeWidth?: number, pathProps?: object }} props
 */
export const DOVE_VIEWBOX = "-1 -1 486 438";

export const DOVE_PATH =
  "M 16.76 234.76 C 35.26 230.84 72.36 253.12 77.67 257.48 C 89.32 267.61 99.2 278.27 108.75 288.58 C 136.71 318.76 163.1 347.29 222.59 345.2 C 268.9 343.59 298.04 364.95 331.81 389.69 C 348.09 401.63 364.93 413.96 385.16 424.98 C 385.28 425.03 385.38 425.1 385.51 425.15 C 390.16 427.37 398.09 428.94 409.37 423.79 C 437.57 410.89 476.14 358.91 466.87 323.97 C 463 309.32 449.51 292.66 407.26 296.45 C 343.61 302.08 302.63 295.79 285.47 277.74 C 277.82 269.67 274.99 259.24 276.86 245.83 C 278.63 233.15 286.6 219.77 295.04 205.6 C 307.83 184.22 322.28 159.99 321.6 129.31 C 321.21 112.52 326.95 24.07 327.9 16.65 C 328.29 15.07 328.14 13.33 327.39 11.75 C 325.65 8.06 321.28 6.46 317.59 8.17 C 317.53 8.17 317.51 8.18 317.5 8.2 C 292.22 20.13 244.42 63.95 215.86 90.12 C 214.4 91.47 213 92.76 211.64 93.99 C 180 42.08 135.63 22.01 133.66 21.14 C 131.31 20.1 128.62 20.34 126.48 21.79 C 124.36 23.23 123.15 25.66 123.26 28.22 C 123.26 28.99 126.19 106.07 123.17 142.06 C 121.97 156.22 118.16 162.79 108.55 167.17 C 98.72 171.67 82.45 173.96 61.03 176.04 C 54.28 176.69 48.85 178.01 44.38 180.04 C 32.6 185.43 29.88 194.86 27.51 203.19 C 25.59 209.86 16.17 216.17 9.81 222.2 C 6.84 225.02 6.7 229.71 9.5 232.69 C 11.43 234.72 14.22 235.43 16.76 234.78 Z";

export function Dove({ className = "", strokeWidth = 15, pathProps = {} }) {
  return (
    <svg
      viewBox="-1 -1 486 438"
      fill="none"
      className={className}
      aria-hidden
      focusable="false"
    >
      <path
        d={DOVE_PATH}
        stroke="currentColor"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
        {...pathProps}
      />
    </svg>
  );
}

/**
 * Marca d'água: a pomba inteira, em traço fino e quase apagada.
 *
 * Diferente das versões anteriores, aqui ela aparece INTEIRA — com a ave certa
 * não é mais preciso sangrar a borda para disfarçar a silhueta.
 *
 * @param {{ className?: string, strokeWidth?: number }} props
 *   posicionamento e tamanho vêm pelo className.
 */
export function DoveWatermark({ className = "", strokeWidth = 9 }) {
  return (
    <div aria-hidden className={`pointer-events-none absolute ${className}`}>
      <Dove className="w-full h-auto" strokeWidth={strokeWidth} />
    </div>
  );
}
