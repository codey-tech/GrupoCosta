"use client";

import { useRef, useState, useEffect } from "react";

/**
 * Monitor cardíaco — fundo da abertura, e só dela.
 *
 * Fica ATRÁS do conteúdo, dentro do próprio bloco do hero. A primeira versão
 * atravessava a página inteira por cima de tudo, guiada por rolagem: virava um
 * elemento competindo com o texto em todas as seções.
 *
 * A SEGUNDA versão era uma onda de SVG deslizando de lado em velocidade
 * constante. Tecnicamente barata, mas morta — e morta por três motivos que
 * valem ficar registrados, porque são os mesmos de qualquer "linha de ECG"
 * feita em CSS:
 *
 *   1. A linha inteira acesa com o mesmo brilho. Monitor de verdade tem um
 *      FEIXE que desenha e um rastro que apaga atrás dele. Sem decaimento, não
 *      há para onde o olho ir — é papel de parede, não sinal.
 *   2. Batidas idênticas em intervalo perfeito. Coração nenhum é metrônomo: o
 *      intervalo respira junto com a respiração (arritmia sinusal respiratória)
 *      e varia de batida para batida.
 *   3. O pico do R não era um EVENTO. Numa tela viva, a batida acontece — ela
 *      estala e some.
 *
 * Esta versão é um canvas: um feixe percorre a tela desenhando a onda, o rastro
 * decai por `destination-out` (apaga alfa sem pintar fundo, então a foto do
 * hero continua aparecendo por baixo), e o brilho da cabeça acompanha a
 * amplitude — o pico do R vira um estalo de luz.
 *
 * Com `prefers-reduced-motion`, cai para um traçado estático em SVG.
 */

/** Um ciclo estático, só para o fallback sem movimento. */
const CICLO =
  "M0 50 L52 50 Q62 40 72 50 L92 50 L100 50 L106 22 L113 82 L120 50 L142 50 Q158 34 174 50 L240 50";
const CICLOS = 6;
const LARGURA_ESTATICA = 240 * CICLOS;

/** Segundos que o rastro leva para cair a ~37% do brilho (fósforo). */
const MEIA_VIDA = 2.6;
/** Segundos para o feixe atravessar a tela inteira. */
const VARREDURA = 7;

/**
 * Um batimento, com a fase indo de 0 a 1.
 *
 * Soma de gaussianas: P, Q, R, S e T. Não é fidelidade clínica — é o suficiente
 * para o olho reconhecer "isso é um ECG" e para o R dominar como pico.
 */
function batimento(t) {
  const g = (centro, largura, altura) =>
    altura * Math.exp(-((t - centro) ** 2) / (2 * largura * largura));

  return (
    g(0.17, 0.024, 0.1) - // P
    g(0.275, 0.008, 0.13) + // Q
    g(0.3, 0.0075, 1) - // R
    g(0.328, 0.011, 0.24) + // S
    g(0.5, 0.05, 0.26) // T
  );
}

export default function PulseLine({ className = "" }) {
  const container = useRef(null);
  const canvas = useRef(null);

  // Inicializador preguiçoso, não efeito: a preferência é síncrona e o React 19
  // acusa `setState` dentro de efeito como render em cascata.
  const [semMovimento, setSemMovimento] = useState(() =>
    typeof window === "undefined"
      ? false
      : window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const aoTrocar = (e) => setSemMovimento(e.matches);
    mq.addEventListener("change", aoTrocar);
    return () => mq.removeEventListener("change", aoTrocar);
  }, []);

  useEffect(() => {
    if (semMovimento) return;

    const cv = canvas.current;
    const alvo = container.current;
    if (!cv || !alvo) return;

    const ctx = cv.getContext("2d", { alpha: true });
    if (!ctx) return;

    let larg = 0;
    let alt = 0;
    let dpr = 1;

    // --- estado do feixe ---
    // DECLARADO ANTES de `dimensionar`, que zera os dois. Com `let` embaixo,
    // a primeira chamada caía na zona morta temporal e a página inteira
    // explodia com "Cannot access 'x' before initialization".
    let x = 0;
    let yAnterior = null;
    let tempo = 0;
    let tBatida = 0;
    let duracao = 0.86;
    let amplitude = 1;
    let anterior = 0;
    let quadro = 0;

    const dimensionar = () => {
      const r = alvo.getBoundingClientRect();
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      larg = Math.max(1, Math.round(r.width));
      alt = Math.max(1, Math.round(r.height));
      cv.width = Math.round(larg * dpr);
      cv.height = Math.round(alt * dpr);
      cv.style.width = `${larg}px`;
      cv.style.height = `${alt}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, larg, alt);
      x = 0;
      yAnterior = null;
    };

    const ro = new ResizeObserver(dimensionar);
    ro.observe(alvo);
    dimensionar();

    /** Cada batida sorteia a própria duração e altura. */
    const novaBatida = () => {
      // Arritmia sinusal respiratória: o intervalo abre e fecha com a
      // respiração. É a variação que mais faz o traço parecer vivo.
      const respiracao = 1 + 0.075 * Math.sin(tempo * 0.42);
      duracao = 0.86 * respiracao * (0.97 + Math.random() * 0.07);
      amplitude = 0.9 + Math.random() * 0.16;
    };
    novaBatida();

    const velocidade = () => larg / VARREDURA;

    const desenhar = (agora) => {
      quadro = requestAnimationFrame(desenhar);

      const dt = anterior ? Math.min((agora - anterior) / 1000, 0.05) : 0;
      anterior = agora;
      if (!dt) return;

      tempo += dt;
      tBatida += dt;
      if (tBatida >= duracao) {
        tBatida -= duracao;
        novaBatida();
      }

      // --- decaimento do rastro ---
      // `destination-out` remove alfa em vez de pintar por cima: o traço
      // envelhece e some, e a foto do hero continua visível por baixo.
      //
      // O alfa vem de `dt`, NÃO é uma constante por quadro. Com constante, o
      // rastro dura o dobro do tempo a 120 Hz e some no meio a 30 Hz — e a
      // primeira versão apagava tudo em ~1s de uma varredura de 7s, deixando
      // só um sétimo da onda na tela.
      ctx.globalCompositeOperation = "destination-out";
      ctx.fillStyle = `rgba(0,0,0,${1 - Math.exp(-dt / MEIA_VIDA)})`;
      ctx.fillRect(0, 0, larg, alt);

      const base = alt / 2;
      const escala = alt * 0.3;

      const xNovo = x + velocidade() * dt;
      const fase = tBatida / duracao;
      const valor = batimento(fase) * amplitude;
      // Deriva mínima da linha de base: sem ela o traço fica cravado num pixel
      // e denuncia que é desenho.
      const deriva = Math.sin(tempo * 0.6) * alt * 0.006;
      const y = base - valor * escala + deriva;

      // Faixa limpa logo à frente do feixe — é o que dá a leitura de varredura.
      ctx.fillStyle = "rgba(0,0,0,1)";
      ctx.fillRect(xNovo + 2, 0, 34, alt);
      ctx.globalCompositeOperation = "source-over";

      if (yAnterior !== null && xNovo <= larg) {
        ctx.beginPath();
        ctx.moveTo(x, yAnterior);
        ctx.lineTo(xNovo, y);
        ctx.strokeStyle = "#f97316";
        ctx.lineWidth = 2;
        ctx.lineCap = "round";
        ctx.lineJoin = "round";
        // Um sopro de brilho no próprio traço: sobre a foto da frota, uma
        // linha chapada de 2px se perde no ruído do asfalto e do céu.
        ctx.shadowColor = "rgba(249,115,22,0.85)";
        ctx.shadowBlur = 8;
        ctx.stroke();
        ctx.shadowBlur = 0;
      }

      const forca = Math.min(1, Math.abs(valor));

      // --- a cabeça do feixe ---
      // O brilho acompanha a amplitude, então o pico do R estala e some. É isso
      // que transforma a batida em evento em vez de desenho passando.
      ctx.globalCompositeOperation = "lighter";

      const halo = ctx.createRadialGradient(
        xNovo,
        y,
        0,
        xNovo,
        y,
        14 + forca * 90
      );
      halo.addColorStop(0, `rgba(255,190,120,${0.28 + forca * 0.5})`);
      halo.addColorStop(0.4, `rgba(249,115,22,${0.1 + forca * 0.2})`);
      halo.addColorStop(1, "rgba(249,115,22,0)");
      ctx.fillStyle = halo;
      ctx.beginPath();
      ctx.arc(xNovo, y, 14 + forca * 90, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = `rgba(255,236,214,${0.75 + forca * 0.25})`;
      ctx.beginPath();
      ctx.arc(xNovo, y, 1.7 + forca * 2.4, 0, Math.PI * 2);
      ctx.fill();

      ctx.globalCompositeOperation = "source-over";

      x = xNovo;
      yAnterior = y;

      if (x > larg) {
        x = 0;
        yAnterior = null;
      }
    };

    /**
     * Em aba de fundo o `requestAnimationFrame` congela. Sem zerar o relógio na
     * volta, o primeiro `dt` viria gigante e o feixe saltaria a tela inteira.
     */
    const aoVoltar = () => {
      anterior = 0;
    };
    document.addEventListener("visibilitychange", aoVoltar);

    quadro = requestAnimationFrame(desenhar);

    return () => {
      cancelAnimationFrame(quadro);
      ro.disconnect();
      document.removeEventListener("visibilitychange", aoVoltar);
    };
  }, [semMovimento]);

  return (
    <div
      ref={container}
      aria-hidden
      className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}
    >
      {semMovimento ? (
        <svg
          viewBox={`0 0 ${LARGURA_ESTATICA} 100`}
          fill="none"
          preserveAspectRatio="none"
          className="absolute top-1/2 left-0 block h-[38vh] w-full -translate-y-1/2 lg:h-[46vh]"
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
      ) : (
        <canvas ref={canvas} className="absolute inset-0 block" />
      )}
    </div>
  );
}
