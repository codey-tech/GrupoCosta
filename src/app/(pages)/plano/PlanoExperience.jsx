"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import {
  Plus,
  Info,
  Shield,
  Phone,
  Clipboard,
  MessageCircle,
  ChevronDown,
  MapPin,
} from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";
import CopyToClipboard from "react-copy-to-clipboard";
import { toast, ToastContainer } from "react-toastify";
import LenisProvider from "../../components/LenisProvider";
import CheckoutModal from "../../components/CheckoutModal";
import GrupoCostaFooter from "@/components/GrupoCostaFooter";
import StackBeneficios from "./StackBeneficios";
import CardPlano from "./CardPlano";
import {
  CONTATO,
  ENDERECO,
  SECOES,
  TEXTOS,
  TAXA_ADESAO,
  PLANOS,
  REDE_CIDADES,
  REDE_CATEGORIAS,
  FAQS,
} from "./content";

gsap.registerPlugin(ScrollTrigger, useGSAP);

/**
 * PLANO COSTA
 *
 * Reconstrução da página que estava em produção, mantendo a identidade dela:
 * base clara, vídeo de família na abertura, roxo como acento, os benefícios
 * empilhando, a rede num bloco escuro e os três planos em cartões.
 *
 * Duas tentativas anteriores foram descartadas por errarem justamente isso —
 * eram escuras do início ao fim e paradas demais. O calor e o movimento não
 * são enfeite aqui: plano de saúde se vende com família e cor, não com grade
 * preta. Se for mexer, preserve o vídeo, o empilhamento e a alternância entre
 * claro e escuro.
 *
 * O que mudou por baixo: conteúdo saiu para `content.js`, o preloader deixou
 * de depender de um estado que reexecutava o GSAP, as animações repetem ao
 * subir e o `matchMedia` é revertido à mão.
 */
export default function PlanoExperience() {
  const root = useRef(null);
  const [reduceMotion, setReduceMotion] = useState(false);
  const [rolou, setRolou] = useState(false);
  const [faqAberta, setFaqAberta] = useState(0);
  const [checkoutAberto, setCheckoutAberto] = useState(false);
  const [planoEscolhido, setPlanoEscolhido] = useState(null);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduceMotion(mq.matches);
    const onChange = (e) => setReduceMotion(e.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  // Fundo do cabeçalho ao sair da abertura. Sobre o vídeo ele é transparente;
  // barra sólida em cima de imagem clara mata o hero.
  useEffect(() => {
    let travado = false;
    const aoRolar = () => {
      if (travado) return;
      travado = true;
      requestAnimationFrame(() => {
        setRolou(window.scrollY > 80);
        travado = false;
      });
    };
    window.addEventListener("scroll", aoRolar, { passive: true });
    aoRolar();
    return () => window.removeEventListener("scroll", aoRolar);
  }, []);

  /**
   * O CheckoutModal espera `name` e `maxDependents`, nomes herdados da versão
   * anterior. A tradução acontece aqui, na fronteira, e não espalhada.
   */
  const contratar = useCallback((plano) => {
    setPlanoEscolhido({
      ...plano,
      name: plano.nome,
      maxDependents: plano.dependentes,
      price: plano.preco,
    });
    setCheckoutAberto(true);
  }, []);

  useGSAP(
    () => {
      if (reduceMotion) {
        gsap.set("[data-entra], [data-sobe], [data-plano]", {
          opacity: 1,
          y: 0,
          rotationX: 0,
        });
        return;
      }

      gsap.from("[data-entra]", {
        y: 46,
        opacity: 0,
        duration: 0.9,
        stagger: 0.14,
        ease: "power3.out",
        delay: 0.25,
      });

      const REPETIR = "play none none reverse";

      gsap.utils.toArray("[data-sobe]").forEach((el) => {
        gsap.from(el, {
          y: 38,
          opacity: 0,
          duration: 0.7,
          ease: "power3.out",
          scrollTrigger: { trigger: el, start: "top 88%", toggleActions: REPETIR },
        });
      });

      // Os cartões de plano entram com uma inclinação em perspectiva — é o
      // gesto que a versão anterior tinha e que dava presença à seção.
      ScrollTrigger.batch("[data-plano]", {
        start: "top 82%",
        onEnter: (lote) =>
          gsap.from(lote, {
            y: 90,
            opacity: 0,
            rotationX: -14,
            transformOrigin: "top center",
            duration: 0.9,
            stagger: 0.16,
            ease: "back.out(1.4)",
            overwrite: true,
          }),
      });
    },
    { scope: root, dependencies: [reduceMotion] }
  );

  return (
    <LenisProvider disableBelowWidth={768}>
      <div
        ref={root}
        className="min-h-screen bg-[#fafafa] font-sans text-slate-900 selection:bg-purple-200"
      >
        {/* ================== NAVBAR ================== */}
        <nav
          className={`fixed inset-x-0 top-0 z-50 px-6 transition-all duration-500 ${
            rolou
              ? "bg-slate-950/95 py-4 text-white shadow-xl backdrop-blur-md"
              : "bg-transparent py-6 text-white"
          }`}
        >
          <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
            <span className="text-xl font-black uppercase tracking-tighter">
              Plano<span className="font-light italic">Costa</span>
            </span>

            <div className="hidden gap-10 text-[11px] font-bold uppercase tracking-[0.2em] lg:flex">
              {SECOES.map((s) => (
                <a
                  key={s.id}
                  href={`#${s.id}`}
                  className="transition-opacity hover:opacity-50"
                >
                  {s.nome}
                </a>
              ))}
            </div>

            <a
              href={CONTATO.centralHref}
              className={`whitespace-nowrap rounded-full px-6 py-3 text-[10px] font-black uppercase tracking-widest transition-all duration-300 ${
                rolou
                  ? "bg-purple-600 text-white hover:bg-white hover:text-black"
                  : "bg-white text-black hover:scale-105"
              }`}
            >
              Central: {CONTATO.central}
            </a>
          </div>
        </nav>

        {/* ================== HERO ================== */}
        <section className="relative flex h-[100dvh] flex-col justify-center bg-slate-950 px-6 md:px-12">
          <div className="absolute inset-0 z-0">
            <video
              autoPlay
              muted
              loop
              playsInline
              poster="/assets/equipe.webp"
              className="h-full w-full object-cover opacity-40"
            >
              <source src="/hero.mp4" type="video/mp4" />
            </video>
            <div className="absolute inset-0 bg-gradient-to-t from-[#fafafa]/80 via-transparent to-transparent" />
          </div>

          <div className="relative z-10 mx-auto w-full max-w-7xl pt-20">
            <h1
              data-entra
              className="text-5xl font-black leading-[1] tracking-tighter text-white md:text-7xl lg:text-[6.5vw]"
            >
              {TEXTOS.heroTitulo[0]}
              <br />
              {TEXTOS.heroTitulo[1]}
              <br />
              <span className="italic text-purple-400">{TEXTOS.heroDestaque}</span>
            </h1>

            <div
              data-entra
              className="mt-8 flex flex-col items-start justify-between gap-8 md:flex-row md:items-end"
            >
              <p className="select-copy max-w-xl text-xl font-medium leading-relaxed text-slate-300">
                {TEXTOS.heroResumo}
              </p>

              <div className="select-copy flex items-center gap-6">
                <span className="flex h-16 w-16 animate-[spin_10s_linear_infinite] items-center justify-center rounded-full border border-purple-500/30">
                  <Plus className="text-purple-400" />
                </span>
                <div>
                  <p className="mb-1 text-[10px] font-black uppercase tracking-[0.2em] text-purple-400">
                    Emergência 24h
                  </p>
                  <a
                    href={CONTATO.emergenciaHref}
                    className="text-2xl font-black text-white transition-colors hover:text-purple-300"
                  >
                    {CONTATO.emergencia}
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ================== BENEFÍCIOS ================== */}
        <StackBeneficios />

        {/* ================== REDE ================== */}
        <section
          id="rede"
          className="relative overflow-hidden border-b border-slate-800 bg-slate-950 px-6 py-28 text-white md:py-36"
        >
          <div
            aria-hidden
            className="pointer-events-none absolute -left-40 top-0 h-[600px] w-[600px] rounded-full bg-purple-700/20 blur-[140px]"
          />

          <div className="relative mx-auto flex max-w-7xl flex-col gap-14 lg:flex-row lg:gap-20">
            <div className="lg:w-1/3" data-sobe>
              <p className="mb-4 text-[10px] font-black uppercase tracking-[0.4em] text-purple-400">
                {TEXTOS.redeRotulo}
              </p>
              <h2 className="text-4xl font-black leading-[0.95] tracking-tighter md:text-5xl">
                {TEXTOS.redeTitulo}
                <br />
                <span className="bg-gradient-to-r from-purple-400 to-indigo-400 bg-clip-text font-light italic text-transparent">
                  {TEXTOS.redeDestaque}
                </span>
              </h2>
              <p className="select-copy mt-6 text-lg font-medium leading-relaxed text-slate-400">
                {TEXTOS.redeResumo}
              </p>

              <div className="relative mt-8 overflow-hidden rounded-[2rem] border border-white/10 bg-white/5 p-8 shadow-2xl">
                <span
                  aria-hidden
                  className="absolute left-0 top-0 h-1 w-full bg-gradient-to-r from-purple-500 to-transparent"
                />
                <h3 className="mb-6 text-xs font-black uppercase tracking-widest text-slate-300">
                  Área de abrangência
                </h3>
                <ul className="select-copy grid grid-cols-2 gap-x-2 gap-y-5 text-sm font-bold text-slate-400">
                  {REDE_CIDADES.map((cidade) => (
                    <li key={cidade} className="group flex items-center gap-3">
                      <span className="relative flex h-2 w-2 items-center justify-center">
                        <span className="absolute h-4 w-4 animate-ping rounded-full bg-purple-400/40" />
                        <span className="absolute h-full w-full rounded-full bg-purple-500 transition-transform group-hover:scale-150" />
                      </span>
                      <span className="transition-colors group-hover:text-white">
                        {cidade}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="flex flex-col gap-8 lg:w-2/3">
              {REDE_CATEGORIAS.map((cat) => (
                <article
                  key={cat.id}
                  data-sobe
                  className="group rounded-[2.5rem] border border-white/10 bg-slate-900/40 p-8 transition-all duration-500 hover:-translate-y-1.5 hover:border-white/20 hover:bg-slate-800/60 md:p-10"
                >
                  <h3 className="text-2xl font-black italic tracking-tighter md:text-3xl">
                    {cat.titulo}
                  </h3>
                  <p className="select-copy mt-2 text-sm font-medium text-slate-400">
                    {cat.resumo}
                  </p>

                  <div
                    aria-hidden
                    className="my-8 h-px w-full bg-gradient-to-r from-white/10 via-white/5 to-transparent"
                  />

                  <ul className="select-copy grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-2">
                    {cat.itens.map((item) => (
                      <li key={item} className="group/item flex items-start gap-3">
                        <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-purple-500 transition-transform group-hover/item:scale-150" />
                        <span className="text-sm font-bold text-slate-400 transition-colors group-hover/item:text-white">
                          {item}
                        </span>
                      </li>
                    ))}
                  </ul>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* ================== PLANOS ================== */}
        <section
          id="planos"
          className="relative overflow-hidden bg-slate-50 px-6 py-32"
        >
          <div
            aria-hidden
            className="pointer-events-none absolute left-1/2 top-0 -z-10 h-full w-full max-w-3xl -translate-x-1/2 bg-gradient-to-b from-purple-100/60 to-transparent blur-3xl"
          />

          <div className="mx-auto max-w-7xl">
            <header data-sobe className="mb-20 text-center">
              <p className="mb-4 flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-[0.4em] text-purple-600">
                <Shield size={14} /> {TEXTOS.planosRotulo}
              </p>
              <h2 className="mb-6 text-4xl font-black tracking-tighter text-slate-950 md:text-6xl">
                {TEXTOS.planosTitulo}{" "}
                <span className="font-light italic text-purple-600">
                  {TEXTOS.planosDestaque}
                </span>
              </h2>
              <p className="select-copy inline-flex items-center gap-3 rounded-full border border-slate-200 bg-white px-6 py-3 text-xs font-bold text-slate-600 shadow-sm">
                <Info size={16} className="text-purple-600" />
                Taxa de adesão de {TAXA_ADESAO.valor} + proporcional ao mês na
                abertura.
              </p>
            </header>

            <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-3 lg:gap-6">
              {PLANOS.map((plano) => (
                <CardPlano
                  key={plano.id}
                  plano={plano}
                  onContratar={contratar}
                />
              ))}
            </div>
          </div>
        </section>

        {/* ================== DÚVIDAS ================== */}
        <section
          id="faq"
          className="relative overflow-hidden border-t border-slate-200 bg-white px-6 py-32"
        >
          <div className="relative z-10 mx-auto flex max-w-7xl flex-col gap-16 lg:flex-row lg:gap-24">
            <div data-sobe className="h-fit lg:sticky lg:top-40 lg:w-5/12">
              <p className="mb-6 inline-flex items-center gap-2 border-l-2 border-purple-600 bg-purple-50 px-4 py-1.5 text-[10px] font-black uppercase tracking-[0.2em] text-purple-600">
                <MessageCircle size={14} /> {TEXTOS.faqRotulo}
              </p>
              <h2 className="mb-6 text-4xl font-black leading-[0.95] tracking-tighter text-slate-950 md:text-5xl lg:text-6xl">
                {TEXTOS.faqTitulo}{" "}
                <span className="font-light italic text-purple-600">
                  {TEXTOS.faqDestaque}
                </span>
              </h2>
              <p className="select-copy max-w-md text-lg font-medium leading-relaxed text-slate-500">
                {TEXTOS.faqResumo}
              </p>
            </div>

            <div className="flex flex-col gap-4 lg:w-7/12">
              {FAQS.map((f, i) => {
                const aberta = faqAberta === i;
                return (
                  <div
                    key={f.p}
                    data-sobe
                    className={`relative overflow-hidden rounded-[2rem] border transition-colors ${
                      aberta
                        ? "border-purple-200 bg-purple-50/40"
                        : "border-slate-200 bg-white hover:border-slate-300"
                    }`}
                  >
                    <span
                      aria-hidden
                      className={`absolute left-0 top-0 w-1.5 rounded-l-[2rem] bg-gradient-to-b from-purple-400 to-purple-600 transition-all duration-500 ${
                        aberta ? "h-full opacity-100" : "h-0 opacity-0"
                      }`}
                    />

                    <button
                      type="button"
                      onClick={() => setFaqAberta(aberta ? null : i)}
                      aria-expanded={aberta}
                      className="flex w-full items-center justify-between gap-6 p-7 text-left md:p-8"
                    >
                      <span className="text-lg font-black tracking-tight text-slate-900 md:text-xl">
                        {f.p}
                      </span>
                      <ChevronDown
                        size={20}
                        className={`shrink-0 text-purple-600 transition-transform duration-300 ${
                          aberta ? "rotate-180" : ""
                        }`}
                      />
                    </button>

                    {/* `grid-rows` de 0fr a 1fr anima a altura sem precisar
                        medir o conteúdo nem chutar um `max-height`. */}
                    <div
                      className={`grid transition-[grid-template-rows] duration-500 ease-out ${
                        aberta ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                      }`}
                    >
                      <div className="overflow-hidden">
                        <p className="select-copy px-7 pb-7 text-base font-medium leading-relaxed text-slate-500 md:px-8 md:pb-8">
                          {f.r}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ================== CONTATO ================== */}
        <section
          id="contato"
          className="border-t border-slate-200 bg-slate-50 px-6 py-32"
        >
          <div className="mx-auto flex max-w-7xl flex-col items-stretch gap-12 lg:flex-row lg:gap-16">
            <div data-sobe className="flex flex-col justify-between lg:w-1/2">
              <div className="mb-12">
                <p className="mb-4 text-[10px] font-black uppercase tracking-[0.4em] text-purple-600">
                  {TEXTOS.contatoRotulo}
                </p>
                <h2 className="mb-6 text-5xl font-black leading-[0.9] tracking-tighter text-slate-950 md:text-7xl">
                  {TEXTOS.contatoTitulo}
                  <br />
                  <span className="italic text-purple-600">
                    {TEXTOS.contatoDestaque}
                  </span>
                </h2>
                <p className="select-copy max-w-md text-lg font-medium leading-relaxed text-slate-500">
                  {TEXTOS.contatoResumo}
                </p>
              </div>

              <div className="mt-auto grid grid-cols-1 gap-6 sm:grid-cols-2">
                <a
                  href={CONTATO.whatsappHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="select-copy group flex flex-col justify-center rounded-[2rem] border border-slate-200 bg-white p-8 transition-all hover:border-purple-300 hover:shadow-xl"
                >
                  <span className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-purple-50 text-purple-600 transition-transform group-hover:scale-110">
                    <FaWhatsapp size={28} />
                  </span>
                  <span className="mb-2 text-[10px] font-black uppercase tracking-widest text-slate-400">
                    Suporte & WhatsApp
                  </span>
                  <span className="text-2xl font-black text-slate-900 transition-colors group-hover:text-purple-600">
                    {CONTATO.central}
                  </span>
                </a>

                <div className="select-copy group flex flex-col justify-center rounded-[2rem] border border-slate-800 bg-slate-950 p-8 text-white transition-all hover:shadow-xl">
                  <span className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10 transition-transform group-hover:scale-110">
                    <Phone size={28} />
                  </span>
                  <span className="mb-2 text-[10px] font-black uppercase tracking-widest text-slate-400">
                    Emergências 24h
                  </span>
                  <span className="flex items-center gap-3 text-xl font-black">
                    <a
                      href={CONTATO.emergenciaHref}
                      className="transition-colors hover:text-purple-300"
                    >
                      {CONTATO.emergencia}
                    </a>
                    <CopyToClipboard
                      text={CONTATO.emergencia}
                      onCopy={() =>
                        toast("Número copiado para a área de transferência")
                      }
                    >
                      <button
                        type="button"
                        aria-label="Copiar número de emergência"
                        className="text-slate-400 transition-colors hover:text-white"
                      >
                        <Clipboard size={18} />
                      </button>
                    </CopyToClipboard>
                  </span>
                </div>
              </div>
            </div>

            <div data-sobe className="w-full lg:w-1/2">
              <div className="flex h-full min-h-[450px] flex-col overflow-hidden rounded-[2rem] border border-slate-200 bg-white transition-shadow hover:shadow-xl">
                <div className="relative h-[300px] w-full flex-grow bg-slate-200 md:h-[350px]">
                  <iframe
                    src={ENDERECO.mapaEmbed}
                    title="Mapa do Plano Costa em Taquari/RS"
                    className="absolute inset-0 h-full w-full border-0 contrast-125 grayscale-[20%]"
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    allowFullScreen
                  />
                </div>

                <a
                  href={ENDERECO.mapsHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-start gap-4 p-8"
                >
                  <MapPin
                    size={22}
                    className="mt-0.5 shrink-0 text-purple-600"
                  />
                  <span>
                    <span className="block text-[10px] font-black uppercase tracking-widest text-slate-400">
                      Nosso endereço
                    </span>
                    <span className="mt-2 block text-lg font-black text-slate-900 transition-colors group-hover:text-purple-600">
                      {ENDERECO.rua}
                    </span>
                    <span className="block text-sm font-medium text-slate-500">
                      {ENDERECO.bairro}
                    </span>
                  </span>
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* ================== RODAPÉ ================== */}
        <footer className="border-t border-slate-200 bg-white px-6 py-16">
          <div className="mx-auto max-w-7xl">
            <div className="flex flex-col items-start justify-between gap-8 md:flex-row md:items-center">
              <span className="text-2xl font-black uppercase tracking-tighter text-slate-950">
                Plano<span className="font-light italic text-purple-600">Costa</span>
              </span>
              <Link
                href="/"
                className="text-[11px] font-bold uppercase tracking-[0.2em] text-slate-400 transition-colors hover:text-slate-950"
              >
                ← Voltar ao Grupo Costa
              </Link>
            </div>

            <div className="mt-12 text-slate-600">
              <GrupoCostaFooter atual="/plano" />
            </div>

            <div className="mt-12 flex flex-col items-start justify-between gap-4 border-t border-slate-200 pt-8 sm:flex-row sm:items-center">
              <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                © {new Date().getFullYear()} Plano Costa
              </span>
              <a
                href="https://codeytech.com.br"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm font-black italic text-slate-400 transition-colors hover:text-purple-600"
              >
                Codey Tech.
              </a>
            </div>
          </div>
        </footer>

        <CheckoutModal
          isOpen={checkoutAberto}
          onClose={() => setCheckoutAberto(false)}
          plan={planoEscolhido}
        />

        <ToastContainer position="bottom-center" theme="dark" autoClose={2200} />
      </div>
    </LenisProvider>
  );
}
