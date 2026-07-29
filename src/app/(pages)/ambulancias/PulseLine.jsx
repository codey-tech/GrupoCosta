"use client";

/**
 * Traçado de monitor cardíaco — fundo da abertura, e só dela.
 *
 * Fica ATRÁS do conteúdo, dentro do próprio bloco do hero. A primeira versão
 * atravessava a página inteira por cima de tudo, guiada por rolagem: virava um
 * elemento competindo com o texto em todas as seções, e a repetição matava o
 * efeito. Como textura de uma tela só, ele diz o que precisa e sai de cena.
 *
 * Sem JavaScript: é uma animação CSS de translação contínua. Não precisa de
 * rolagem, de ticker nem de medição — e por isso não custa nada.
 */

/** Um ciclo de ECG em 240×100, linha de base em y=50. */
const CICLO =
  "M0 50 L52 50 Q62 40 72 50 L92 50 L100 50 L106 22 L113 82 L120 50 L142 50 Q158 34 174 50 L240 50";

const CICLOS = 6;
const LARGURA = 240 * CICLOS;

export default function PulseLine({ className = "" }) {
  return (
    <div
      aria-hidden
      className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}
    >
      {/* Duas cópias de tela cheia: quando a primeira sai, a segunda já está
          no lugar, e o translate de -50% reinicia sem emenda. */}
      <div className="amb-traco absolute top-1/2 left-0 flex w-max -translate-y-1/2">
        {[0, 1].map((copia) => (
          <svg
            key={copia}
            viewBox={`0 0 ${LARGURA} 100`}
            fill="none"
            preserveAspectRatio="none"
            className="block shrink-0 w-screen h-[38vh] lg:h-[46vh]"
          >
            {Array.from({ length: CICLOS }).map((_, n) => (
              <path
                key={n}
                d={CICLO}
                transform={`translate(${n * 240} 0)`}
                stroke="#f97316"
                strokeWidth={1.5}
                strokeLinecap="round"
                strokeLinejoin="round"
                vectorEffect="non-scaling-stroke"
              />
            ))}
          </svg>
        ))}
      </div>
    </div>
  );
}
