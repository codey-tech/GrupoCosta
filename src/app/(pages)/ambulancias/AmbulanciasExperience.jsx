"use client";

import { useRef, useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { ArrowUpRight } from "lucide-react";
import { FaWhatsapp, FaInstagram, FaFacebookSquare } from "react-icons/fa";
import LenisProvider from "../../components/LenisProvider";
import GrupoCostaFooter from "@/components/GrupoCostaFooter";
import PulseLine from "./PulseLine";
import {
  CONTATO,
  REDES,
  SECOES,
  ABERTURA,
  SOBRE,
  SERVICOS_INTRO,
  SERVICOS,
  SERVICOS_FECHO,
  PILARES,
  FROTA,
  FOTOS,
  BASE_OPERACIONAL,
} from "./content";

gsap.registerPlugin(ScrollTrigger, useGSAP);

/**
 * COSTA AMBULÂNCIAS
 *
 * Terceira proposta, e as duas anteriores explicam esta:
 *
 *  1. A primeira era a funerária repintada — coluna centrada, capítulos
 *     numerados, trilho de progresso. Derivada.
 *  2. A segunda tinha um painel fixo na lateral. Partia a tela em duas,
 *     comia 38% da largura numa coluna que não rolava e deixava o conteúdo
 *     espremido num app.
 *
 * Aqui a página é FULL-BLEED e FOTOGRÁFICA. Largura inteira do começo ao fim,
 * nada fixo dividindo a tela. As fotos reais da frota ocupam o quadro todo e
 * o texto vem entre elas, respirando. É o oposto exato da funerária, que é
 * tipográfica e quase sem imagem — e ambulância é objeto visual, então a foto
 * trabalha a favor.
 *
 * O 0800 fica no cabeçalho fino, que acompanha a rolagem. É o suficiente para
 * o número nunca estar a mais de um olhar de distância, sem sacrificar
 * metade da tela para isso.
 */

/** Foto em tela cheia com paralaxe. */
function Banda({ foto, altura = "h-[70svh] md:h-[86svh]", children, prioridade }) {
  return (
    <div className={`relative w-full overflow-hidden ${altura}`}>
      {/* A imagem é mais alta que o quadro para ter margem de deslocamento —
          sem isso a paralaxe deixaria uma faixa vazia numa das pontas. */}
      <div data-parallax className="absolute inset-x-0 -top-[12%] h-[124%]">
        <Image
          src={foto.src}
          alt={foto.alt}
          fill
          priority={prioridade}
          sizes="100vw"
          className="object-cover"
        />
      </div>
      <div
        aria-hidden
        className="absolute inset-0 bg-gradient-to-t from-[#0e1114] via-[#0e1114]/45 to-[#0e1114]/70"
      />
      {children}
    </div>
  );
}

export default function AmbulanciasExperience() {
  const root = useRef(null);
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduceMotion(mq.matches);
    const onChange = (e) => setReduceMotion(e.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  useGSAP(
    () => {
      if (reduceMotion) {
        gsap.set("[data-up], [data-abertura]", { opacity: 1, y: 0 });
        gsap.set("[data-parallax]", { y: 0 });
        return;
      }

      gsap.from("[data-abertura]", {
        y: 26,
        opacity: 0,
        duration: 0.7,
        ease: "power3.out",
        stagger: 0.08,
        delay: 0.15,
      });

      const REPETIR = "play none none reverse";

      gsap.utils.toArray("[data-up]").forEach((el) => {
        gsap.from(el, {
          y: 26,
          opacity: 0,
          duration: 0.5,
          ease: "power2.out",
          scrollTrigger: { trigger: el, start: "top 92%", toggleActions: REPETIR },
        });
      });

      // Paralaxe: a foto anda menos que a página, o que dá profundidade sem
      // truque nenhum. `scrub` amarra ao scroll em vez de rodar no tempo.
      gsap.utils.toArray("[data-parallax]").forEach((el) => {
        gsap.fromTo(
          el,
          { yPercent: -8 },
          {
            yPercent: 8,
            ease: "none",
            scrollTrigger: {
              trigger: el.parentElement,
              start: "top bottom",
              end: "bottom top",
              scrub: true,
            },
          }
        );
      });

      // O cabeçalho começa transparente sobre a foto e ganha fundo ao sair
      // dela — sobre imagem clara, uma barra sólida no topo mata a abertura.
      ScrollTrigger.create({
        trigger: "[data-capa]",
        start: "bottom 90px",
        onToggle: ({ isActive }) => {
          gsap.to("[data-cabecalho]", {
            backgroundColor: isActive ? "rgba(14,17,20,0)" : "rgba(14,17,20,0.92)",
            borderColor: isActive
              ? "rgba(236,238,241,0)"
              : "rgba(236,238,241,0.10)",
            duration: 0.35,
            ease: "power2.out",
          });
        },
      });
    },
    { scope: root, dependencies: [reduceMotion] }
  );

  return (
    <LenisProvider disableBelowWidth={768}>
      <main
        ref={root}
        className="amb relative bg-[#0e1114] text-[#eceef1] font-[family-name:var(--font-geist-sans)] overflow-x-clip selection:bg-[#f97316]/30"
      >
        {/* ================== CABEÇALHO ================== */}
        <header
          data-cabecalho
          className="fixed top-0 inset-x-0 z-50 border-b backdrop-blur-sm"
          style={{ backgroundColor: "rgba(14,17,20,0)", borderColor: "rgba(236,238,241,0)" }}
        >
          <div className="mx-auto flex h-16 max-w-[1600px] items-center justify-between gap-6 px-5 md:h-[72px] md:px-10">
            <Link href="/" aria-label="Início">
              <Image
                src="/assets/logopng.png"
                alt="Costa Ambulâncias"
                width={865}
                height={289}
                priority
                className="h-7 w-auto md:h-8"
              />
            </Link>

            <nav className="hidden items-center gap-8 lg:flex">
              {SECOES.map((s) => (
                <a
                  key={s.id}
                  href={`#${s.id}`}
                  className="fc-mono text-[#eceef1]/50 transition-colors hover:text-[#f97316]"
                >
                  {s.nome}
                </a>
              ))}
            </nav>

            <div className="flex items-center gap-3">
              <a
                href={CONTATO.whatsappHref}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="WhatsApp da Costa Ambulâncias"
                className="hidden h-10 w-10 items-center justify-center border border-[#eceef1]/20 text-[#eceef1]/70 transition-colors hover:border-[#f97316] hover:text-[#f97316] sm:flex"
              >
                <FaWhatsapp className="h-4 w-4" />
              </a>
              <a
                href={CONTATO.emergenciaHref}
                className="flex items-center gap-2.5 bg-[#f97316] px-4 py-2.5 text-[#0e1114] transition-opacity hover:opacity-90 md:px-5 md:py-3"
              >
                <span className="amb-pisca block h-1.5 w-1.5 rounded-full bg-[#0e1114]" />
                <span className="fc-mono">{CONTATO.emergencia}</span>
              </a>
            </div>
          </div>
        </header>

        {/* ================== CAPA ================== */}
        <section data-capa id="capa" className="relative">
          <Banda foto={FOTOS.capa} altura="h-[100svh]" prioridade>
            <PulseLine className="opacity-[0.18]" />

            <div className="relative flex h-full flex-col justify-end px-5 pb-14 md:px-10 md:pb-20">
              <div className="mx-auto w-full max-w-[1600px]">
                <span data-abertura className="fc-mono text-[#f97316]">
                  {ABERTURA.rotulo}
                </span>

                {/* A frase original é uma só e vai inteira. Eu tinha cortado
                    o "estamos prontos para você" e perdido o sentido dela. */}
                <h1
                  data-abertura
                  className="mt-6 amb-display text-[clamp(2.2rem,6.4vw,6rem)] max-w-5xl"
                >
                  {ABERTURA.titulo}
                  <br />
                  <span className="text-[#f97316]">{ABERTURA.complemento}</span>
                </h1>

                {/* No lugar de indicadores inventados, a chamada que a página
                    anterior trazia — e que é o que a pessoa precisa ler. */}
                <div
                  data-abertura
                  className="mt-10 flex flex-wrap items-baseline gap-x-8 gap-y-3 md:mt-14"
                >
                  <span className="fc-mono text-[#eceef1]/60">
                    {ABERTURA.chamada}
                  </span>
                  <a
                    href={CONTATO.emergenciaHref}
                    className="amb-display text-[clamp(1.6rem,3.6vw,2.8rem)] transition-colors hover:text-[#f97316]"
                  >
                    {CONTATO.emergencia}
                  </a>
                  <a
                    href={CONTATO.suporteHref}
                    className="fc-mono text-[#eceef1]/50 underline-offset-4 transition-colors hover:text-[#eceef1] hover:underline"
                  >
                    ou suporte {CONTATO.suporte}
                  </a>
                </div>
              </div>
            </div>
          </Banda>
        </section>

        {/* ================== ABERTURA EM TEXTO ================== */}
        <section className="px-5 py-24 md:px-10 md:py-36">
          <div className="mx-auto max-w-[1600px]">
            <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-16">
              <h2
                data-up
                className="amb-display text-[clamp(1.7rem,4vw,3.2rem)] lg:col-span-5"
              >
                Tradição e inovação
                <br />
                <span className="text-[#eceef1]/40">na saúde.</span>
              </h2>

              <div className="lg:col-span-7 lg:pt-2">
                {SOBRE.map((p, i) => (
                  <p
                    key={p}
                    data-up
                    className={`max-w-2xl text-[17px] leading-[1.65] md:text-lg ${
                      i === 0 ? "" : "mt-6"
                    } ${i === SOBRE.length - 1 ? "text-[#eceef1]/45" : "text-[#eceef1]/70"}`}
                  >
                    {p}
                  </p>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ================== SERVIÇOS ================== */}
        <section id="servicos">
          <Banda foto={FOTOS.servicos} altura="h-[52svh] md:h-[64svh]">
            <div className="relative flex h-full items-end px-5 pb-10 md:px-10 md:pb-14">
              <div className="mx-auto w-full max-w-[1600px]">
                <span data-up className="fc-mono text-[#f97316]">
                  04 frentes
                </span>
                <h2
                  data-up
                  className="mt-4 amb-display text-[clamp(2rem,6vw,4.5rem)]"
                >
                  O que fazemos
                </h2>
              </div>
            </div>
          </Banda>

          {/* Linhas largas, ocupando a tela. Nada de cartões numa grade
              apertada — a página inteira é larga, a lista acompanha. */}
          <div className="px-5 md:px-10">
            <div className="mx-auto max-w-[1600px]">
              <p
                data-up
                className="max-w-3xl pt-14 text-[17px] leading-[1.65] text-[#eceef1]/70 md:pt-20 md:text-lg"
              >
                {SERVICOS_INTRO}
              </p>

              <div className="mt-14 md:mt-20">
                {SERVICOS.map((s) => (
                  <article
                    key={s.titulo}
                    data-up
                    className="group grid grid-cols-1 items-baseline gap-x-10 gap-y-3 border-b border-[#eceef1]/12 py-9 md:grid-cols-12 md:py-12"
                  >
                    <span className="fc-mono text-[#f97316] md:col-span-1">
                      {s.n}
                    </span>
                    <h3 className="amb-display text-[clamp(1.4rem,3vw,2.4rem)] transition-colors duration-500 group-hover:text-[#f97316] md:col-span-4">
                      {s.titulo}
                    </h3>
                    <p className="text-[15px] leading-relaxed text-[#eceef1]/60 md:col-span-7 md:text-base">
                      {s.texto}
                    </p>
                  </article>
                ))}
              </div>

              <p
                data-up
                className="mt-14 max-w-3xl amb-display text-[clamp(1.2rem,2.6vw,1.9rem)] md:mt-20"
              >
                {SERVICOS_FECHO}
              </p>
            </div>
          </div>
        </section>

        {/* ================== FROTA ================== */}
        <section id="frota" className="pt-24 md:pt-36">
          <div className="px-5 md:px-10">
            <div className="mx-auto max-w-[1600px]">
              <span data-up className="fc-mono text-[#f97316]">
                Ficha técnica
              </span>
              <h2
                data-up
                className="mt-4 amb-display text-[clamp(2rem,6vw,4.5rem)] max-w-4xl"
              >
                {FROTA.titulo}
              </h2>

              {/* Os três pilares que a página anterior destacava. São
                  afirmações institucionais — ficam como frases, não como
                  células de tabela. */}
              <ul className="mt-12 grid grid-cols-1 gap-px bg-[#eceef1]/12 md:mt-16 md:grid-cols-3">
                {PILARES.map((p, i) => (
                  <li key={p} data-up className="bg-[#0e1114] px-6 py-7">
                    <span className="fc-mono text-[#f97316]">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <p className="mt-4 amb-display text-[clamp(1.05rem,2vw,1.4rem)]">
                      {p}
                    </p>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="mt-16 md:mt-24">
            <Banda foto={FOTOS.frota} altura="h-[60svh] md:h-[80svh]" />
          </div>

          <div className="px-5 pt-16 md:px-10 md:pt-24">
            <div className="mx-auto max-w-[1600px]">
              <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-16">
                <div className="lg:col-span-5">
                  <h3 data-up className="amb-display text-[clamp(1.4rem,3vw,2.2rem)]">
                    {FROTA.subtitulo}
                  </h3>
                  <p data-up className="mt-5 text-[17px] text-[#f97316] md:text-lg">
                    {FROTA.destaque}
                  </p>
                </div>

                <div className="lg:col-span-7">
                  <p
                    data-up
                    className="text-[17px] leading-[1.65] text-[#eceef1]/70 md:text-lg"
                  >
                    {FROTA.intro}
                  </p>

                  <p
                    data-up
                    className="mt-12 fc-mono text-[#f97316]"
                  >
                    {FROTA.equipamentosTitulo}
                  </p>

                  {/* Prosa, como no original. Espremer estes dois parágrafos
                      numa ficha técnica foi o que fez "monitoramento cardíaco"
                      soar como especificação de produto. */}
                  {FROTA.equipamentos.map((e) => (
                    <p
                      key={e}
                      data-up
                      className="mt-5 text-[16px] leading-[1.65] text-[#eceef1]/65"
                    >
                      {e}
                    </p>
                  ))}

                  <p
                    data-up
                    className="mt-10 text-[17px] leading-[1.6] text-[#eceef1]/45 md:text-lg"
                  >
                    {FROTA.fecho}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Par de fotos coladas, sangrando as duas bordas. */}
          <div className="mt-16 grid grid-cols-1 md:mt-24 md:grid-cols-2">
            {[FOTOS.detalhe, FOTOS.lateral].map((foto) => (
              <div
                key={foto.src}
                className="relative h-[46svh] overflow-hidden md:h-[62svh]"
              >
                <div data-parallax className="absolute inset-x-0 -top-[12%] h-[124%]">
                  <Image
                    src={foto.src}
                    alt={foto.alt}
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover"
                  />
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ================== EQUIPE ================== */}
        <section className="relative">
          <Banda foto={FOTOS.equipe} altura="h-[70svh] md:h-[88svh]">
            <div className="relative flex h-full items-center px-5 md:px-10">
              <div className="mx-auto w-full max-w-[1600px]">
                <h2
                  data-up
                  className="amb-display text-[clamp(1.8rem,5vw,4rem)] max-w-3xl"
                >
                  Profissionais capacitados,
                  <br />
                  <span className="text-[#f97316]">prontos a qualquer hora.</span>
                </h2>
              </div>
            </div>
          </Banda>
        </section>

        {/* ================== COBERTURA ================== */}
        <section id="cobertura" className="px-5 py-24 md:px-10 md:py-36">
          <div className="mx-auto max-w-[1600px]">
            <div className="flex flex-wrap items-end justify-between gap-6">
              <div>
                <span data-up className="fc-mono text-[#f97316]">
                  Base operacional
                </span>
                <h2
                  data-up
                  className="mt-4 amb-display text-[clamp(2rem,6vw,4.5rem)]"
                >
                  Onde estamos
                </h2>
              </div>

              <a
                data-up
                href={BASE_OPERACIONAL.mapsHref}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-2.5 fc-mono text-[#eceef1]/50 transition-colors hover:text-[#f97316]"
              >
                Abrir no Maps
                <ArrowUpRight
                  className="h-3.5 w-3.5 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                  strokeWidth={2}
                />
              </a>
            </div>

            <div
              data-up
              className="mt-10 grid grid-cols-1 gap-px bg-[#eceef1]/12 sm:grid-cols-3"
            >
              <div className="bg-[#0e1114] px-6 py-6">
                <span className="fc-mono text-[#eceef1]/35">Endereço</span>
                <p className="mt-2.5 text-[16px]">{BASE_OPERACIONAL.endereco}</p>
              </div>
              <div className="bg-[#0e1114] px-6 py-6">
                <span className="fc-mono text-[#eceef1]/35">Cidade</span>
                <p className="mt-2.5 text-[16px]">{BASE_OPERACIONAL.bairro}</p>
              </div>
              <div className="bg-[#0e1114] px-6 py-6">
                <span className="fc-mono text-[#eceef1]/35">CEP</span>
                <p className="mt-2.5 text-[16px]">{BASE_OPERACIONAL.cep}</p>
              </div>
            </div>
          </div>
        </section>

        <div data-up className="relative h-[46svh] w-full md:h-[60svh]">
          <iframe
            src={BASE_OPERACIONAL.mapaEmbed}
            title="Mapa da base operacional da Costa Ambulâncias em Taquari/RS"
            className="absolute inset-0 h-full w-full border-0"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            allowFullScreen
          />
        </div>

        {/* ================== CONTATO ================== */}
        <section id="contato" className="px-5 py-24 text-center md:px-10 md:py-36">
          <div className="mx-auto max-w-[1600px]">
            <span data-up className="fc-mono text-[#f97316]">
              Emergência · 24 horas
            </span>

            <a
              data-up
              href={CONTATO.emergenciaHref}
              className="mt-8 block amb-display text-[clamp(2.2rem,11vw,9rem)] leading-none whitespace-nowrap transition-colors hover:text-[#f97316]"
            >
              {CONTATO.emergencia}
            </a>

            <p data-up className="mt-6 fc-mono text-[#eceef1]/40">
              Ligação gratuita, todos os dias
            </p>

            <div
              data-up
              className="mt-12 flex flex-wrap items-center justify-center gap-4"
            >
              <a
                href={CONTATO.whatsappHref}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 bg-[#f97316] px-6 py-3.5 text-[#0e1114] fc-mono transition-opacity hover:opacity-90"
              >
                <FaWhatsapp className="h-4 w-4" />
                WhatsApp
              </a>
              <a
                href={CONTATO.suporteHref}
                className="inline-flex items-center gap-3 border border-[#eceef1]/25 px-6 py-3.5 fc-mono transition-colors hover:border-[#eceef1]/70"
              >
                Suporte {CONTATO.suporte}
              </a>
            </div>
          </div>
        </section>

        {/* ================== RODAPÉ ================== */}
        <footer className="border-t border-[#eceef1]/10 px-5 py-14 md:px-10">
          <div className="mx-auto max-w-[1600px]">
            <div className="flex flex-col items-start justify-between gap-8 md:flex-row md:items-center">
              <Image
                src="/assets/logopng.png"
                alt="Costa Ambulâncias"
                width={865}
                height={289}
                className="h-9 w-auto"
              />

              <div className="flex items-center gap-5">
                <a
                  href={REDES.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram da Costa Ambulâncias"
                  className="text-[#eceef1]/45 transition-colors hover:text-[#f97316]"
                >
                  <FaInstagram className="h-5 w-5" />
                </a>
                <a
                  href={REDES.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Facebook do Grupo Costa"
                  className="text-[#eceef1]/45 transition-colors hover:text-[#f97316]"
                >
                  <FaFacebookSquare className="h-5 w-5" />
                </a>
                <Link
                  href="/"
                  className="fc-mono text-[#eceef1]/50 transition-colors hover:text-[#eceef1]"
                >
                  ← Voltar ao Grupo Costa
                </Link>
              </div>
            </div>

            <div className="mt-12 text-[#eceef1]/60">
              <GrupoCostaFooter atual="/ambulancias" />
            </div>

            <div className="mt-14 flex flex-col items-start justify-between gap-4 border-t border-[#eceef1]/[0.06] pt-8 sm:flex-row sm:items-center">
              <span className="fc-mono text-[#eceef1]/25">
                © {new Date().getFullYear()} Costa Ambulâncias
              </span>
              <a
                href="https://codeytech.com.br"
                target="_blank"
                rel="noopener noreferrer"
                className="fc-wordmark text-base font-extrabold text-[#eceef1]/40 transition-colors hover:text-[#f97316]"
              >
                Codey Tech
              </a>
            </div>
          </div>
        </footer>
      </main>
    </LenisProvider>
  );
}
