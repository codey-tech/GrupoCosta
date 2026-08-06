"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { ArrowUpRight } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";
import LenisProvider from "../../components/LenisProvider";
import GrupoCostaFooter from "@/components/GrupoCostaFooter";
import Preloader from "./Preloader";
import ChapterRail from "./ChapterRail";
import { Wordmark, DoveWatermark } from "./Brand";
import DoveFlight from "./DoveFlight";
import {
  CONTATO,
  CAPITULOS,
  UNIDADES,
  CUIDADOS,
  COROAS,
  ESTRUTURAS,
  MEMORIAIS,
} from "./content";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const VeilCanvas = dynamic(() => import("./VeilCanvas"), {
  ssr: false,
  loading: () => null,
});

/* -------------------------------------------------------------------------- */
/*  Peças tipográficas                                                        */
/* -------------------------------------------------------------------------- */

/** Rótulo mono entre parênteses — a unidade de sinalização da página. */
function Mark({ children, className = "" }) {
  return (
    <span className={`fc-mono ${className}`}>(&nbsp;{children}&nbsp;)</span>
  );
}

/**
 * Rótulo do capítulo nas duas margens, uma letra por linha.
 *
 * Some abaixo de lg: em telas estreitas não há margem sobrando e o rótulo
 * brigaria com o texto.
 */
function Gutter({ children, tone = "ink" }) {
  const color = tone === "ink" ? "text-[#0c0c0b]/30" : "text-[#f1f0ec]/30";
  const letras = [...children.replace(/\s/g, "")];

  const coluna = (lado) => (
    <div
      key={lado}
      data-reveal
      className={`fc-vertical fc-mono ${color}`}
      style={{ letterSpacing: "0.05em" }}
    >
      {letras.map((l, i) => (
        <span key={`${lado}-${i}`}>{l}</span>
      ))}
    </div>
  );

  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 hidden lg:block"
    >
      {/* Sticky para o rótulo ficar estacionado no meio da tela enquanto o
          capítulo passa. Ancorado no topo da seção, ele subia junto com a
          rolagem e ia parar em cima do cabeçalho fixo. */}
      <div className="sticky top-0 h-[100svh] flex items-center justify-between px-8">
        {coluna("e")}
        {coluna("d")}
      </div>
    </div>
  );
}

/** Linha fina que se desenha da esquerda para a direita ao entrar em cena. */
function Rule({ tone = "ink", className = "" }) {
  const bg = tone === "ink" ? "bg-[#0c0c0b]/15" : "bg-[#f1f0ec]/15";
  return <div data-rule className={`h-px w-full origin-left ${bg} ${className}`} />;
}

/** Texto que sobe de dentro de um recorte. Usado nos títulos. */
function MaskLine({ children, className = "" }) {
  return (
    <span className="fc-mask">
      <span data-mask className={`block ${className}`}>
        {children}
      </span>
    </span>
  );
}

/* -------------------------------------------------------------------------- */

export default function FunerariaExperience() {
  const root = useRef(null);
  const legadoRef = useRef(null);
  const legadoPinRef = useRef(null);
  const [reduceMotion, setReduceMotion] = useState(false);

  // Fim do preloader: guardado em refs, NUNCA em estado.
  //
  // Quando isto era um `useState` na lista de dependências do useGSAP, o efeito
  // rodava duas vezes (antes e depois da abertura) e o segundo passe registrava
  // um segundo pin sobre a mesma seção. Os pin-spacers somavam e o trecho de
  // rolagem do Legado ficava com o dobro do tamanho — a contagem chegava a 30
  // na metade do caminho e sobrava meia tela de rolagem morta.
  const aberto = useRef(false);
  const tocarHero = useRef(() => {});

  const aoAbrir = useCallback(() => {
    aberto.current = true;
    tocarHero.current();
  }, []);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduceMotion(mq.matches);
    const onChange = (e) => setReduceMotion(e.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  useGSAP(
    () => {
      const num = root.current?.querySelector("[data-legado-num]");

      if (reduceMotion) {
        gsap.set("[data-mask], [data-reveal]", { opacity: 1, y: 0, yPercent: 0 });
        gsap.set("[data-rule]", { scaleX: 1 });
        gsap.set("[data-legado-line]", { scaleX: 1 });
        gsap.set("[data-legado-frase]", { opacity: 1, yPercent: 0 });
        if (num) num.textContent = "30";
        return;
      }

      // ---- Abertura do hero -------------------------------------------------
      const tlHero = gsap.timeline({ paused: true });
      tlHero
        .from("[data-hero-word]", {
          yPercent: 108,
          duration: 1.2,
          ease: "expo.out",
          stagger: 0.07,
        })
        .from(
          "[data-hero-foot]",
          { opacity: 0, y: 16, duration: 0.9, ease: "power3.out", stagger: 0.07 },
          0.55
        );

      // Só toca quando a cortina já subiu E a aba está visível. Sem a segunda
      // condição, quem abre o link em aba de fundo (o caso mais comum vindo do
      // WhatsApp) encontra o hero em branco: o rAF é congelado e o `from` trava
      // no estado inicial.
      const tentarTocar = () => {
        if (!aberto.current || document.visibilityState !== "visible") return;
        tlHero.play();
      };
      tocarHero.current = tentarTocar;
      document.addEventListener("visibilitychange", tentarTocar);
      tentarTocar();

      // Rede de segurança: se a abertura falhar, o hero aparece assim mesmo.
      const resgate = setTimeout(() => {
        aberto.current = true;
        tentarTocar();
      }, 3500);

      // ---- Reveals genéricos ------------------------------------------------
      // `toggleActions` com `reverse` no quarto slot (onLeaveBack): ao subir, a
      // animação se desfaz e volta a acontecer na próxima descida. Sem isso o
      // padrão do ScrollTrigger é "play none none none" — toca uma única vez na
      // vida da página, e quem volta ao topo encontra tudo já revelado, estático.
      const REPETIR = "play none none reverse";

      gsap.utils.toArray("[data-mask]").forEach((el) => {
        if (el.closest("[data-hero]")) return;
        gsap.from(el, {
          yPercent: 106,
          duration: 1.05,
          ease: "expo.out",
          scrollTrigger: { trigger: el, start: "top 92%", toggleActions: REPETIR },
        });
      });

      gsap.utils.toArray("[data-reveal]").forEach((el) => {
        gsap.from(el, {
          opacity: 0,
          y: 22,
          duration: 0.9,
          ease: "power3.out",
          scrollTrigger: { trigger: el, start: "top 90%", toggleActions: REPETIR },
        });
      });

      gsap.utils.toArray("[data-rule]").forEach((el) => {
        gsap.from(el, {
          scaleX: 0,
          duration: 1.1,
          ease: "power3.inOut",
          scrollTrigger: { trigger: el, start: "top 95%", toggleActions: REPETIR },
        });
      });

      // Fotos que abrem por trás de uma cortina, em vez de aparecerem prontas.
      gsap.utils.toArray("[data-curtain]").forEach((el) => {
        gsap.fromTo(
          el,
          { clipPath: "inset(0% 0% 100% 0%)" },
          {
            clipPath: "inset(0% 0% 0% 0%)",
            duration: 1.4,
            ease: "expo.out",
            scrollTrigger: {
              trigger: el,
              start: "top 88%",
              toggleActions: REPETIR,
            },
          }
        );
      });

      // ---- Capítulo 06: a linha do tempo -----------------------------------
      // Único pin da página, e ele tem função: enquanto a seção fica presa, um
      // traço atravessa a tela e a contagem vai de 0 a 30. O gesto É o
      // conteúdo — trinta anos passando.
      //
      // O contador é lido DIRETO do progresso do ScrollTrigger, e não de um
      // objeto interpolado dentro da timeline. Interpolar um proxy sob `scrub`
      // com pin fazia o número travar, pular ou parar antes de 30: o tween tem
      // vida própria e cada `refresh` o dessincronizava. Assim o número é
      // sempre uma função pura da rolagem.
      const mm = gsap.matchMedia();

      mm.add("(min-width: 768px)", () => {
        const setNum = (p) => {
          if (num) num.textContent = String(Math.round(p * 30)).padStart(2, "0");
        };
        setNum(0);

        // Duas escutas separadas de propósito.
        //
        // A CONTAGEM começa bem antes de a seção travar: pega o momento em que
        // ela ainda está subindo pela tela e atravessa todo o trecho preso.
        // Amarrada só ao pin, ela nascia junto com a trava — os dois eventos
        // no mesmo instante davam a impressão de solavanco.
        //
        // ENTRADA (0,85 da tela) + TRECHO PRESO (1,15 da tela) = 2 telas.
        gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: {
            trigger: legadoRef.current,
            start: "top 85%",
            end: () => "+=" + Math.round(window.innerHeight * 2),
            scrub: 1.2,
            invalidateOnRefresh: true,
            onUpdate: (self) => setNum(self.progress),
            onRefresh: (self) => setNum(self.progress),
          },
        }).fromTo(
          "[data-legado-line]",
          { scaleX: 0 },
          { scaleX: 1, duration: 1 },
          0
        );

        // O PIN cuida só de prender a seção e revelar a frase.
        //
        // Distância ancorada na viewport, via função, e NÃO "+=115%": com pin,
        // o percentual relativo é resolvido contra a altura do pin-spacer —
        // que o próprio pin acabou de aumentar — e compunha a cada refresh.
        gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: {
            trigger: legadoRef.current,
            start: "top top",
            end: () => "+=" + Math.round(window.innerHeight * 1.15),
            scrub: 1.2,
            pin: legadoPinRef.current,
            pinSpacing: true,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        }).fromTo(
          "[data-legado-frase]",
          { opacity: 0, yPercent: 30 },
          { opacity: 1, yPercent: 0, duration: 0.4 },
          0.3
        );
      });

      mm.add("(max-width: 767px)", () => {
        if (num) num.textContent = "00";
        gsap.set("[data-legado-frase]", { opacity: 1, yPercent: 0 });

        const obj = { v: 0 };
        gsap.to(obj, {
          v: 30,
          duration: 1.8,
          ease: "power2.out",
          scrollTrigger: { trigger: legadoRef.current, start: "top 70%", once: true },
          onUpdate: () => {
            if (num) num.textContent = String(Math.round(obj.v)).padStart(2, "0");
          },
        });
        gsap.fromTo(
          "[data-legado-line]",
          { scaleX: 0 },
          {
            scaleX: 1,
            duration: 1.8,
            ease: "power2.out",
            scrollTrigger: { trigger: legadoRef.current, start: "top 70%", once: true },
          }
        );
      });

      return () => {
        clearTimeout(resgate);
        document.removeEventListener("visibilitychange", tentarTocar);
        tocarHero.current = () => {};
        // matchMedia não é revertido junto com o contexto do useGSAP.
        mm.revert();
      };
    },
    { scope: root, dependencies: [reduceMotion] }
  );

  return (
    <LenisProvider disableBelowWidth={768}>
      {!reduceMotion && <Preloader onDone={aoAbrir} />}

      {/*
        `overflow-x-clip` e NÃO `overflow-x-hidden`: `hidden` faz o browser
        computar `overflow-y: auto`, o que transforma o <main> em contêiner de
        rolagem e mata todo `position: sticky` lá dentro — as barras de título
        da Estrutura passavam direto em vez de grudar. `clip` recorta o
        transbordo horizontal sem criar contexto de rolagem.
      */}
      <main
        ref={root}
        className="fc fc-grain relative bg-[#f1f0ec] text-[#0c0c0b] font-[family-name:var(--font-geist-sans)] overflow-x-clip selection:bg-[#a98850]/25"
      >
        {/* Véu de luz — fixo atrás de tudo, quase imperceptível. */}
        <div className="fixed inset-0 z-0 pointer-events-none" aria-hidden>
          <VeilCanvas palette="paper" />
        </div>

        {/* ---------- Barra superior ---------- */}
        <header className="fixed top-0 inset-x-0 z-50 mix-blend-difference">
          <div className="px-5 md:px-10 h-14 md:h-16 flex items-center justify-between text-white">
            <Link href="/" aria-label="Início">
              <Wordmark className="text-[13px] md:text-sm" />
            </Link>

            {/* Indicador vivo: três traços respirando = linha aberta, 24h. */}
            <span className="hidden sm:flex items-end gap-[3px] h-3" aria-hidden>
              <i className="fc-bar block w-px h-2 bg-current [animation-delay:0ms]" />
              <i className="fc-bar block w-px h-3 bg-current [animation-delay:180ms]" />
              <i className="fc-bar block w-px h-2 bg-current [animation-delay:360ms]" />
            </span>

            <a href={CONTATO.tel0800Href} className="fc-mono">
              24h — {CONTATO.tel0800}
            </a>
          </div>
        </header>

        <ChapterRail capitulos={CAPITULOS} />

        {/* A pomba atravessa a página conforme a leitura avança. Só em telas
            largas — abaixo disso ficam as marcas d'água paradas. */}
        {!reduceMotion && <DoveFlight />}

        {/* ================= HERO ================= */}
        {/* O `id` não é decorativo: a rota da pomba ancora os pontos por
            getElementById. Sem ele os dois primeiros pontos ficavam com
            posição 0 e o voo inteiro andava deslocado desde o topo. */}
        <section
          id="hero"
          data-hero
          className="relative z-10 min-h-[100svh] overflow-hidden flex flex-col justify-between px-5 md:px-10 pt-20 md:pt-24 pb-14 md:pb-20"
        >
          {/* Deslocada para a direita, fora do eixo do logotipo — a pomba
              inteira aparece sem disputar espaço com a tipografia. */}
          <DoveWatermark className="lg:hidden right-[-5vw] top-[9vh] w-[44vw] max-w-[600px] text-[#0c0c0b] opacity-[0.055]" />

          <div data-hero-foot className="relative flex justify-between">
            {/* Sem ano de fundação: o catálogo diz "há 30 anos", nunca a data. */}
            <Mark className="text-[#0c0c0b]/45">Taquari · Tabaí — RS</Mark>
            <Mark className="text-[#a98850]">Trinta anos</Mark>
          </div>

          <div className="relative flex flex-col items-center text-center">
            {/* Duas composições do mesmo lockup. Em uma linha só, as catorze
                letras pedem quase 9em de largura e estouravam a viewport em
                tela estreita; empilhado o corpo pode crescer e ainda caber. */}
            <h1 aria-label="Funerária Costa">
              <span className="fc-mask md:hidden">
                <span data-hero-word className="block">
                  <Wordmark empilhado className="text-[clamp(2.4rem,13.5vw,4.5rem)]" />
                </span>
              </span>
              <span className="fc-mask hidden md:block">
                <span data-hero-word className="block">
                  <Wordmark className="text-[clamp(3rem,8.6vw,8rem)]" />
                </span>
              </span>
            </h1>

            <p
              data-hero-foot
              className="mt-7 md:mt-9 max-w-lg fc-display text-[clamp(1.35rem,3vw,2.35rem)] text-[#0c0c0b]/75"
            >
              Trinta anos ao lado das famílias de Taquari, Tabaí e região.
            </p>

            <ul className="mt-9 md:mt-12 flex flex-wrap justify-center gap-x-7 gap-y-2">
              {CAPITULOS.map((cap) => (
                <li key={cap.id} className="fc-mask">
                  <a
                    data-hero-word
                    href={`#${cap.id}`}
                    className="block fc-mono text-[#0c0c0b]/45 hover:text-[#a98850] transition-colors"
                  >
                    <span className="mr-1.5 opacity-60">{cap.n}</span>
                    {cap.nome}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="relative flex flex-col md:flex-row md:items-end justify-between gap-6">
            <p
              data-hero-foot
              className="max-w-xs text-[15px] leading-relaxed text-[#0c0c0b]/55"
            >
              Serviços funerários completos, com atendimento disponível 24 horas
              por dia, todos os dias.
            </p>

            <div data-hero-foot className="flex items-center gap-5">
              <a
                href={CONTATO.tel0800Href}
                className="group inline-flex items-center gap-3 bg-[#0c0c0b] text-[#f1f0ec] px-6 py-3.5 fc-mono transition-opacity hover:opacity-85"
              >
                Acionar atendimento
                <ArrowUpRight
                  className="h-3.5 w-3.5 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                  strokeWidth={2}
                />
              </a>
            </div>
          </div>
        </section>

        {/* ---------- Frase de marca ----------
            Uma linha só, parada. Repetida em rolagem infinita a frase virava
            ruído e o eco esvaziava o sentido dela. */}
        <div className="relative z-10 border-y border-[#0c0c0b]/12 px-5 md:px-10 py-6 md:py-8">
          <p
            data-reveal
            className="flex items-center justify-center gap-4 fc-mono text-center text-[#0c0c0b]/55"
          >
            <i aria-hidden className="block h-1 w-1 rounded-full bg-[#a98850]" />
            Estamos ao seu lado em todos os momentos
            <i aria-hidden className="block h-1 w-1 rounded-full bg-[#a98850]" />
          </p>
        </div>

        {/* ================= 01 · A FUNERÁRIA ================= */}
        <section
          id="funeraria"
          className="relative z-10 px-5 md:px-10 py-28 md:py-44"
        >
          <Gutter>A Funerária</Gutter>

          <div className="mx-auto max-w-5xl">
            <div data-reveal>
              <Mark className="text-[#0c0c0b]/45">01 — A Funerária</Mark>
            </div>

            <h2 className="mt-10 md:mt-14 fc-display text-[clamp(1.9rem,5.2vw,4.25rem)]">
              <MaskLine>Estar ao lado das famílias,</MaskLine>
              <MaskLine className="text-[#0c0c0b]/45">
                com humanidade e profissionalismo.
              </MaskLine>
            </h2>

            <div className="mt-14 md:mt-20 max-w-2xl">
              <p data-reveal className="text-[17px] md:text-lg leading-[1.65] text-[#0c0c0b]/70">
                A Funerária Costa está há{" "}
                <span className="text-[#a98850]">30 anos</span> no mercado,
                oferecendo serviços funerários com excelência, respeito e
                dedicação.
              </p>
              <p
                data-reveal
                className="mt-6 text-[17px] md:text-lg leading-[1.65] text-[#0c0c0b]/70"
              >
                Com matriz em Taquari e filial em Tabaí, nossa missão é
                proporcionar apoio e cuidado em momentos difíceis, garantindo
                homenagens dignas e personalizadas para os entes queridos.
              </p>
              <p
                data-reveal
                className="mt-6 text-[17px] md:text-lg leading-[1.65] text-[#0c0c0b]/45"
              >
                Nosso compromisso é oferecer soluções completas, para que a
                família precise carregar apenas a própria saudade.
              </p>
            </div>
          </div>
        </section>

        {/* ================= 02 · CUIDADO ================= */}
        <section id="cuidado" className="relative z-10 px-5 md:px-10 py-20 md:py-32">
          <Gutter>Cuidado</Gutter>

          <div className="mx-auto max-w-6xl">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
              <h2 className="fc-display text-[clamp(2rem,5.5vw,4.5rem)]">
                <MaskLine>O que fazemos</MaskLine>
              </h2>
              <div data-reveal className="md:pb-4">
                <Mark className="text-[#0c0c0b]/45">02 — Cuidado</Mark>
              </div>
            </div>

            <Rule className="mt-10 md:mt-14" />

            <ul>
              {CUIDADOS.map((item, i) => (
                <li key={item.titulo} className="group">
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-y-3 gap-x-6 py-8 md:py-11 items-baseline">
                    <span
                      data-reveal
                      className="md:col-span-1 fc-mono text-[#0c0c0b]/30 transition-colors duration-500 group-hover:text-[#a98850]"
                    >
                      {String(i + 1).padStart(2, "0")}
                    </span>

                    <h3 className="md:col-span-4 fc-display text-[clamp(1.6rem,3.4vw,2.6rem)]">
                      <MaskLine>
                        <span className="fc-underline">{item.titulo}</span>
                      </MaskLine>
                    </h3>

                    <p
                      data-reveal
                      className="md:col-span-5 text-[15px] leading-relaxed text-[#0c0c0b]/60"
                    >
                      {item.texto}
                    </p>

                    <span
                      data-reveal
                      className="md:col-span-2 fc-mono text-[#0c0c0b]/35 md:text-right"
                    >
                      {item.nota}
                    </span>
                  </div>
                  <Rule />
                </li>
              ))}
            </ul>

            <a
              data-reveal
              href={CONTATO.whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-12 inline-flex items-center gap-3 border border-[#0c0c0b]/25 px-6 py-3.5 fc-mono transition-colors hover:bg-[#0c0c0b] hover:text-[#f1f0ec]"
            >
              <FaWhatsapp className="h-4 w-4" />
              Falar com a funerária
            </a>
          </div>
        </section>

        {/* ================= 03 · COROAS ================= */}
        <section id="coroas" className="relative z-10 py-24 md:py-36">
          <Gutter>Coroas</Gutter>

          <div className="px-5 md:px-10">
            <div className="mx-auto max-w-6xl">
              <div data-reveal>
                <Mark className="text-[#0c0c0b]/45">03 — Coroas</Mark>
              </div>
              <h2 className="mt-8 md:mt-12 fc-display text-[clamp(2rem,5.5vw,4.5rem)] max-w-3xl">
                <MaskLine>Flores dizem o que</MaskLine>
                <MaskLine>as palavras não alcançam.</MaskLine>
              </h2>
              <p
                data-reveal
                className="mt-8 max-w-md text-[16px] leading-relaxed text-[#0c0c0b]/55"
              >
                Coroas e corbélias montadas com flores naturais e fita
                personalizada de homenagem.
              </p>
            </div>
          </div>

          {/* Faixa infinita das coroas do catálogo — corre sozinha, pausa no hover. */}
          <div className="fc-marquee relative mt-14 md:mt-20 overflow-hidden">
            <div className="fc-marquee-track">
              {[0, 1].map((copia) => (
                <div key={copia} className="flex shrink-0" aria-hidden={copia === 1}>
                  {COROAS.map((coroa) => (
                    <figure
                      key={`${copia}-${coroa.nome}`}
                      className="group w-[230px] md:w-[300px] shrink-0 px-4 md:px-6"
                    >
                      <div className="relative h-[230px] md:h-[300px]">
                        <Image
                          src={coroa.src}
                          alt={`Coroa de ${coroa.nome} da Funerária Costa`}
                          fill
                          sizes="(max-width: 768px) 230px, 300px"
                          className="object-contain transition-transform duration-700 group-hover:scale-105"
                        />
                      </div>
                      <figcaption className="mt-5 text-center fc-mono text-[#0c0c0b]/55 transition-colors duration-500 group-hover:text-[#a98850]">
                        {coroa.nome}
                      </figcaption>
                    </figure>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ================= 04 · ESTRUTURA ================= */}
        <section id="estrutura" className="relative z-10">
          <Gutter>Estrutura</Gutter>

          <div className="relative px-5 md:px-10 pt-28 md:pt-44 pb-10 md:pb-16">
            <div className="mx-auto max-w-6xl">
              <div data-reveal>
                <Mark className="text-[#0c0c0b]/45">04 — Estrutura</Mark>
              </div>
              <h2 className="mt-8 md:mt-12 fc-display text-[clamp(2rem,5.5vw,4.5rem)] max-w-3xl">
                <MaskLine>Estrutura própria,</MaskLine>
                <MaskLine className="text-[#0c0c0b]/45">
                  do primeiro chamado à despedida.
                </MaskLine>
              </h2>
            </div>
          </div>

          {/* Composição editorial alternada, na mesma gramática dos outros
              capítulos: filete, número, rótulo em mono, título serifado e a
              foto ocupando a outra metade. A barra escura grudada no topo era
              herança de outra referência e destoava de tudo à volta. */}
          <div className="relative px-5 md:px-10 pb-8 md:pb-16">
            <div className="mx-auto max-w-6xl">
              {ESTRUTURAS.map((e, i) => (
                <article key={e.titulo} className="pt-12 md:pt-20">
                  <Rule />

                  <div className="mt-8 md:mt-12 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
                    {/* Texto e foto trocam de lado a cada item. */}
                    <div
                      className={`lg:col-span-5 ${
                        i % 2 === 1 ? "lg:order-2 lg:col-start-8" : ""
                      }`}
                    >
                      <div className="flex items-baseline gap-5">
                        <span data-reveal className="fc-mono text-[#0c0c0b]/30">
                          {e.n}
                        </span>
                        <span data-reveal className="fc-mono text-[#a98850]">
                          {e.tipo}
                        </span>
                      </div>

                      <h3 className="mt-6 fc-display text-[clamp(1.9rem,4.4vw,3.25rem)]">
                        <MaskLine>{e.titulo}</MaskLine>
                      </h3>

                      <p
                        data-reveal
                        className="mt-6 max-w-md text-[16px] md:text-[17px] leading-[1.65] text-[#0c0c0b]/65"
                      >
                        {e.texto}
                      </p>
                    </div>

                    <div
                      className={`lg:col-span-7 ${
                        i % 2 === 1 ? "lg:order-1 lg:col-start-1" : ""
                      }`}
                    >
                      {/* A caixa acompanha o formato da imagem. O recorte da
                          frota é muito largo: num quadro 4:3 sobrava meia
                          altura vazia dos dois lados. */}
                      <div
                        data-curtain
                        className={`relative w-full overflow-hidden ${
                          e.contain
                            ? "aspect-[16/9] bg-[#e6e4de] p-6 md:p-10"
                            : "aspect-[4/3]"
                        }`}
                      >
                        <Image
                          src={e.src}
                          alt={e.alt}
                          fill
                          sizes="(max-width: 1024px) 100vw, 672px"
                          className={e.contain ? "object-contain" : "object-cover"}
                        />
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* ================= 05 · MEMORIAIS ================= */}
        <section id="memoriais" className="relative z-10 px-5 md:px-10 py-24 md:py-40">
          <Gutter>Memoriais</Gutter>

          <div className="mx-auto max-w-6xl">
            <div data-reveal>
              <Mark className="text-[#0c0c0b]/45">05 — Memoriais</Mark>
            </div>
            <h2 className="mt-8 md:mt-12 fc-display text-[clamp(2rem,5.5vw,4.5rem)] max-w-3xl">
              <MaskLine>O cuidado</MaskLine>
              <MaskLine>não termina aqui.</MaskLine>
            </h2>
            <p
              data-reveal
              className="mt-8 max-w-md text-[16px] leading-relaxed text-[#0c0c0b]/55"
            >
              Duas frentes com casa própria — cada uma com o seu espaço, a sua
              história e a sua página.
            </p>

            <div className="mt-16 md:mt-24 grid grid-cols-1 lg:grid-cols-2 gap-14 lg:gap-10">
              {MEMORIAIS.map((m) => (
                <Link
                  key={m.marca}
                  href={m.href}
                  className="group flex flex-col border-t border-[#0c0c0b]/20 pt-7"
                >
                  <span className="fc-mono text-[#0c0c0b]/40">{m.tipo}</span>

                  {/* Imagem só quando existe. O Memórias de 4 Patas ainda não
                      tem foto aprovada — melhor um campo tipográfico do que
                      uma foto de banco de imagens. */}
                  <div className="relative mt-7 h-[280px] md:h-[360px] overflow-hidden bg-[#e6e4de]">
                    {m.src ? (
                      <Image
                        src={m.src}
                        alt={m.alt}
                        fill
                        sizes="(max-width: 1024px) 100vw, 50vw"
                        className="object-cover transition-transform duration-[900ms] ease-out group-hover:scale-105"
                      />
                    ) : (
                      <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-8">
                        <span className="fc-display text-[clamp(1.6rem,4vw,2.6rem)] text-[#0c0c0b]/80">
                          memórias
                        </span>
                        <span className="fc-mono mt-2 text-[#a98850]">
                          de 4 patas
                        </span>
                      </div>
                    )}
                  </div>

                  <h3 className="mt-8 fc-display text-[clamp(1.8rem,4vw,3rem)]">
                    <span className="fc-underline">{m.marca}</span>
                  </h3>

                  <p className="mt-5 max-w-md text-[16px] leading-relaxed text-[#0c0c0b]/65">
                    {m.texto}
                  </p>

                  {m.frase && (
                    <p className="mt-5 max-w-md fc-display text-[clamp(1.05rem,2vw,1.4rem)] text-[#a98850]">
                      {m.frase}
                    </p>
                  )}

                  <span className="mt-8 inline-flex items-center gap-3 fc-mono text-[#0c0c0b]">
                    {m.cta}
                    <ArrowUpRight
                      className="h-3.5 w-3.5 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                      strokeWidth={2}
                    />
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* ================= 06 · LEGADO ================= */}
        <section id="legado" ref={legadoRef} className="relative z-10">
          <div
            ref={legadoPinRef}
            className="relative min-h-[100svh] flex flex-col justify-center px-5 md:px-10 overflow-hidden"
          >
            <DoveWatermark className="lg:hidden right-[-6vw] top-1/2 w-[46vw] max-w-[620px] -translate-y-1/2 text-[#0c0c0b] opacity-[0.05]" />

            <div className="relative mx-auto w-full max-w-6xl">
              <div data-reveal>
                <Mark className="text-[#0c0c0b]/45">06 — Legado</Mark>
              </div>

              <div className="mt-10 md:mt-14 flex items-baseline gap-5 md:gap-8">
                <span
                  data-legado-num
                  className="fc-display text-[clamp(5.5rem,24vw,20rem)] leading-[0.82] tabular-nums"
                >
                  00
                </span>
                <span className="fc-display text-[clamp(1.4rem,3.6vw,3rem)] text-[#a98850]">
                  anos
                </span>
              </div>

              {/* O traço é a linha do tempo: atravessa enquanto os anos correm. */}
              <div className="mt-10 md:mt-14 h-px w-full bg-[#0c0c0b]/12">
                <div
                  data-legado-line
                  className="h-px w-full origin-left scale-x-0 bg-[#a98850]"
                />
              </div>

              <p
                data-legado-frase
                className="mt-12 md:mt-16 max-w-2xl fc-display text-[clamp(1.4rem,3.4vw,2.75rem)] text-[#0c0c0b]/80"
              >
                Que a saudade encontre, sempre, um lugar de paz.
              </p>
            </div>
          </div>
        </section>

        {/* ================= CONTATO ================= */}
        <section
          id="contato"
          className="relative z-10 overflow-hidden bg-[#0c0c0b] text-[#f1f0ec] px-5 md:px-10 py-24 md:py-36"
        >
          <DoveWatermark className="lg:hidden right-[-7vw] bottom-[-4vh] w-[46vw] max-w-[620px] text-[#f1f0ec] opacity-[0.07]" />

          <div className="relative mx-auto max-w-6xl">
            <p data-reveal className="text-center">
              <Mark className="text-[#c4a978]">Atendimento 24 horas</Mark>
            </p>

            <h2 className="mt-7 text-center fc-display text-[clamp(1.9rem,5vw,4rem)]">
              <MaskLine>Estamos com você agora.</MaskLine>
            </h2>

            {/* A ligação gratuita ocupa o corpo grande: numa emergência, é o
                número que qualquer pessoa consegue discar sem pensar em custo. */}
            <a
              href={CONTATO.tel0800Href}
              className="mt-12 md:mt-16 block text-center fc-wordmark font-light text-[clamp(2rem,9vw,7.5rem)] whitespace-nowrap transition-colors hover:text-[#c4a978]"
            >
              {CONTATO.tel0800}
            </a>
            <p data-reveal className="mt-4 text-center fc-mono text-[#f1f0ec]/40">
              Ligação gratuita
            </p>

            <Rule tone="paper" className="mt-10 md:mt-14" />

            <div className="mt-8 flex flex-wrap justify-center items-center gap-4">
              <a
                href={CONTATO.whatsappHref}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 bg-[#f1f0ec] text-[#0c0c0b] px-6 py-3.5 fc-mono transition-colors hover:bg-[#c4a978]"
              >
                <FaWhatsapp className="h-4 w-4" />
                WhatsApp {CONTATO.whatsappNumero}
              </a>
            </div>

            {/* Unidades */}
            <div className="mt-20 md:mt-28 grid grid-cols-1 sm:grid-cols-2 gap-px bg-[#f1f0ec]/12 border border-[#f1f0ec]/12">
              {UNIDADES.map((u) => (
                <a
                  key={u.cidade}
                  href={u.mapsHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group bg-[#0c0c0b] p-8 md:p-10 transition-colors hover:bg-[#141412]"
                >
                  <div className="flex items-center justify-between">
                    <span className="fc-mono text-[#c4a978]">{u.tipo}</span>
                    <ArrowUpRight
                      className="h-4 w-4 text-[#f1f0ec]/30 transition-all duration-300 group-hover:text-[#c4a978] group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                      strokeWidth={1.75}
                    />
                  </div>
                  <h3 className="mt-6 fc-display text-[clamp(1.75rem,4vw,2.75rem)]">
                    {u.cidade}
                  </h3>
                  <p className="mt-3 text-[15px] text-[#f1f0ec]/65">{u.endereco}</p>
                  {u.referencia && (
                    <p className="mt-1 text-sm text-[#f1f0ec]/35">{u.referencia}</p>
                  )}
                </a>
              ))}
            </div>
          </div>
        </section>

        {/* ================= RODAPÉ ================= */}
        <footer className="relative z-10 bg-[#0c0c0b] text-[#f1f0ec] px-5 md:px-10 pb-24 md:pb-28">
          <div className="mx-auto max-w-6xl">
            <div className="pt-12 border-t border-[#f1f0ec]/[0.08] flex flex-col md:flex-row md:items-center justify-between gap-6">
              <Wordmark className="text-xl" />
              <Link
                href="/"
                className="fc-mono text-[#f1f0ec]/50 hover:text-[#f1f0ec] transition-colors"
              >
                ← Voltar ao Grupo Costa
              </Link>
            </div>

            <div className="mt-12 text-[#f1f0ec]/60">
              <GrupoCostaFooter atual="/funeraria" />
            </div>

            <div className="mt-14 pt-8 border-t border-[#f1f0ec]/[0.06] flex items-center justify-between">
              <span className="fc-mono text-[#f1f0ec]/25">Desenvolvido por</span>
              <a
                href="https://codly.space"
                target="_blank"
                rel="noopener noreferrer"
                className="fc-wordmark font-extrabold text-base text-[#f1f0ec]/45 hover:text-[#c4a978] transition-colors"
              >
                codly.space
              </a>
            </div>
          </div>
        </footer>
      </main>
    </LenisProvider>
  );
}
