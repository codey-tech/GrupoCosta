"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { UNIDADES, TERRITORIOS, EMERGENCIA, ABERTURA, EMPRESA } from "./home-content";

/**
 * GRUPO COSTA — página inicial
 *
 * Uma tela só. Não rola. É navegação, e nada além disso.
 *
 * A IDEIA: a home é uma soleira entre dois mundos. A tela é partida por uma
 * costura diagonal — SAÚDE em luz, LUTO em sombra. Não é um menu com duas
 * colunas: a divisão é a própria interação. Ao se inclinar para um lado, ele
 * avança sobre o outro, a costura desliza e as unidades daquele lado ganham
 * corpo. Escolher um lado já é meio caminho da escolha.
 *
 * Por que dois territórios e não cinco itens: quem chega procurando plano de
 * saúde não pode cair sem aviso na funerária, e quem acabou de perder alguém
 * não deveria ter que atravessar publicidade de consultas para achar o
 * telefone. A parede existe para proteger os dois.
 *
 * A costura é dourada — a cor da Funerária — porque é a linha que o próprio
 * grupo atravessa.
 *
 * Decisões que não são estéticas:
 *
 *  · O 0800 fica visível sem interação nenhuma, fora dos dois territórios.
 *    Alguém em emergência pode cair na home, e nesse momento navegar é o
 *    último problema dele.
 *  · SÓ o texto de cada unidade é clicável (`w-fit`). Já houve versão em que
 *    os links ocupavam a linha inteira e um clique no vazio navegava.
 *  · No celular a tela parte na horizontal e os dois lados ficam abertos: sem
 *    ponteiro não existe "inclinar-se", e esconder metade seria esconder
 *    metade do grupo.
 *  · Com `prefers-reduced-motion` a costura não desliza; só o realce muda.
 */

/** Quanto a costura corre para o lado escolhido. 50 = repartida ao meio. */
const COSTURA_NEUTRA = 50;
const COSTURA_ATIVA = 65;
/** Inclinação da diagonal, em pontos percentuais entre o topo e a base. */
const INCLINACAO = 7;
/** Espessura da linha dourada. */
const FIO = 0.22;

export default function HomeExperience() {
  const [lado, setLado] = useState(null);
  const [unidadeAtiva, setUnidadeAtiva] = useState(null);
  const [saindo, setSaindo] = useState(null);
  const [vertical, setVertical] = useState(false);
  const [semMovimento, setSemMovimento] = useState(false);

  useEffect(() => {
    const mqMov = window.matchMedia("(prefers-reduced-motion: reduce)");
    // A quebra bate com o `lg:` do Tailwind, onde o layout vira coluna.
    const mqVert = window.matchMedia("(max-width: 1023px)");

    const sincronizar = () => {
      setSemMovimento(mqMov.matches);
      setVertical(mqVert.matches);
    };
    sincronizar();

    mqMov.addEventListener("change", sincronizar);
    mqVert.addEventListener("change", sincronizar);
    return () => {
      mqMov.removeEventListener("change", sincronizar);
      mqVert.removeEventListener("change", sincronizar);
    };
  }, []);

  /** Desktop com ponteiro fino — no mobile a costura já fica fixa via `vertical`. */
  const comHover = () =>
    window.matchMedia("(hover: hover) and (pointer: fine)").matches;

  const ativarLado = (id) => {
    if (!comHover()) return;
    setLado(id);
  };

  const ativarUnidade = (id) => {
    if (!comHover()) return;
    setUnidadeAtiva(id);
  };

  const limparLado = () => {
    if (!comHover()) return;
    setLado(null);
    setUnidadeAtiva(null);
  };

  const unidadePorId = useMemo(
    () => Object.fromEntries(UNIDADES.map((u) => [u.id, u])),
    []
  );

  /**
   * Onde a costura está agora. No layout vertical ela não se move: sem
   * ponteiro não há como "inclinar-se", e uma costura que anda sozinha no
   * celular só tiraria metade da tela de quem está lendo.
   */
  const costura =
    vertical || semMovimento || !lado
      ? COSTURA_NEUTRA
      : lado === "saude"
        ? COSTURA_ATIVA
        : 100 - COSTURA_ATIVA;

  const topo = costura + INCLINACAO;
  const base = costura - INCLINACAO;

  /**
   * Os dois recortes e o fio entre eles. Todos com o MESMO número de vértices —
   * é o que permite ao browser interpolar `clip-path` numa transição de CSS,
   * sem GSAP e sem um único `requestAnimationFrame`.
   */
  const recortes = vertical
    ? {
        primeiro: `polygon(0% 0%, 100% 0%, 100% ${topo}%, 0% ${base}%)`,
        segundo: `polygon(0% ${base}%, 100% ${topo}%, 100% 100%, 0% 100%)`,
        fio: `polygon(0% ${base}%, 100% ${topo}%, 100% ${topo + FIO}%, 0% ${
          base + FIO
        }%)`,
      }
    : {
        primeiro: `polygon(0% 0%, ${topo}% 0%, ${base}% 100%, 0% 100%)`,
        segundo: `polygon(${topo}% 0%, 100% 0%, 100% 100%, ${base}% 100%)`,
        fio: `polygon(${topo}% 0%, ${topo + FIO}% 0%, ${
          base + FIO
        }% 100%, ${base}% 100%)`,
      };

  const transicao = semMovimento
    ? "none"
    : "clip-path 0.85s cubic-bezier(0.16, 1, 0.3, 1)";

  /**
   * A cor da unidade inunda a tela e a navegação acontece atrás dela, de modo
   * que a próxima página já nasce com a tela tomada.
   *
   * `location.assign` (não `router.push`): a navegação do App Router reaproveita
   * o JS da SPA e várias animações (GSAP, Lenis, preloader) só montam direito
   * num load completo. Recarregar a página evita o estado "pela metade".
   */
  const entrar = useCallback(
    (e, unidade) => {
      if (semMovimento) return; // deixa o <a> nativo agir
      e.preventDefault();
      setSaindo(unidade);
      window.setTimeout(() => {
        window.location.assign(unidade.href);
      }, 620);
    },
    [semMovimento]
  );

  return (
    <div className="relative h-[100dvh] w-full overflow-hidden bg-[#0a0b0a]">
      {/* ============ TERRITÓRIOS (só imagem) ============ */}
      {TERRITORIOS.map((t, i) => {
        const recorte = i === 0 ? recortes.primeiro : recortes.segundo;
        const foco = lado === t.id;

        return (
          <div
            key={t.id}
            aria-hidden
            className="absolute inset-0"
            style={{ clipPath: recorte, transition: transicao }}
          >
            <Image
              src={t.foto}
              alt=""
              fill
              priority
              sizes="100vw"
              className="object-cover transition-transform duration-[1.2s] ease-out"
              style={{ transform: foco ? "scale(1.05)" : "scale(1)" }}
            />
            {/* O véu é o que define se o lado é claro ou escuro. Ele clareia
                um pouco quando o lado está em foco — a foto aparece mais. */}
            <div
              className="absolute inset-0 transition-opacity duration-700"
              style={{ backgroundColor: t.veu, opacity: foco ? 0.88 : 1 }}
            />
          </div>
        );
      })}

      {/* ============ A COSTURA ============ */}
      <div
        aria-hidden
        className="absolute inset-0 bg-[#c4a978]"
        style={{ clipPath: recortes.fio, transition: transicao }}
      />

      {/* ============ CABEÇALHO ============ */}
      {/* `mix-blend-difference` porque este cabeçalho atravessa a costura: ele
          precisa ser legível tanto sobre o lado claro quanto sobre o escuro. */}
      <header className="pointer-events-none absolute inset-x-0 top-0 z-30 flex items-start justify-between gap-6 px-5 py-6 mix-blend-difference md:px-10 md:py-8">
        <div className="text-[#f4f4f5]">
          <p className="text-[11px] font-medium uppercase tracking-[0.28em]">
            {ABERTURA.grupo}
          </p>
          <p className="mt-1.5 text-[11px] uppercase tracking-[0.28em] opacity-50">
            {ABERTURA.local}
          </p>
        </div>

        <a
          href={EMERGENCIA.href}
          className="pointer-events-auto flex items-center gap-3 text-[#f4f4f5]"
        >
          <span className="relative flex h-1.5 w-1.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-current opacity-70" />
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-current" />
          </span>
          <span className="text-[11px] uppercase tracking-[0.2em]">
            <span className="hidden sm:inline">{EMERGENCIA.rotulo} — </span>
            {EMERGENCIA.numero}
          </span>
        </a>
      </header>

      {/* ============ CONTEÚDO ============ */}
      <div className="absolute inset-0 z-20 flex flex-col lg:flex-row">
        {TERRITORIOS.map((t, i) => {
          const foco = lado === t.id;
          const recuado = lado !== null && lado !== t.id;
          const proporcao = i === 0 ? costura : 100 - costura;
          const aoDireita = i === 1;

          return (
            <section
              key={t.id}
              aria-label={t.rotulo}
              onMouseEnter={() => ativarLado(t.id)}
              onMouseMove={() => ativarLado(t.id)}
              onMouseLeave={limparLado}
              className={`flex min-h-0 min-w-0 flex-col justify-center px-6 md:px-12 ${
                aoDireita ? "items-end text-right" : "items-start"
              }`}
              style={{
                color: t.tinta,
                flexBasis: `${proporcao}%`,
                flexGrow: 0,
                flexShrink: 0,
                transition: semMovimento
                  ? "none"
                  : "flex-basis 0.85s cubic-bezier(0.16, 1, 0.3, 1)",
              }}
            >
              {/* `min-w-0` na section: sem isto o `min-width: auto` do flex
                  impede a coluna de encolher abaixo da largura dos nomes. No
                  hover do Luto a Saúde ficava maior que 35%, a soma passava
                  de 100vw e o lado direito saía da tela. */}
              {/* --- Rótulo do território --- */}
              <p
                className="flex items-center gap-3 text-[10px] uppercase tracking-[0.3em] transition-opacity duration-500"
                style={{ opacity: foco ? 1 : 0.45 }}
              >
                {aoDireita && (
                  <span
                    aria-hidden
                    className="block h-px w-8 transition-all duration-500"
                    style={{
                      backgroundColor: "currentColor",
                      width: foco ? "3rem" : "1.5rem",
                    }}
                  />
                )}
                {t.rotulo}
                {!aoDireita && (
                  <span
                    aria-hidden
                    className="block h-px transition-all duration-500"
                    style={{
                      backgroundColor: "currentColor",
                      width: foco ? "3rem" : "1.5rem",
                    }}
                  />
                )}
              </p>

              {/* --- As unidades do território --- */}
              {/* O lado do qual você se afasta ENCOLHE, em vez de espremer os
                  nomes: com a coluna a 35% da tela, "Centro Clínico Costa"
                  quebrava em duas linhas. `scale` não causa refluxo, então a
                  redução é só visual — e diz a coisa certa, que aquele lado
                  recuou. A origem fica na borda externa para o texto nunca
                  avançar sobre a costura. */}
              <ul
                className="mt-5 lg:mt-7"
                style={{
                  transform: `scale(${recuado ? 0.75 : 1})`,
                  transformOrigin: aoDireita ? "right center" : "left center",
                  transition: semMovimento
                    ? "none"
                    : "transform 0.85s cubic-bezier(0.16, 1, 0.3, 1)",
                }}
              >
                {t.unidades.map((id) => {
                  const u = unidadePorId[id];
                  const aceso = unidadeAtiva === id;

                  return (
                    <li key={id} className={aoDireita ? "flex justify-end" : ""}>
                      <a
                        href={u.href}
                        onClick={(e) => entrar(e, u)}
                        onMouseEnter={() => ativarUnidade(id)}
                        onFocus={() => {
                          setLado(t.id);
                          setUnidadeAtiva(id);
                        }}
                        aria-label={`${u.nome} — ${u.frase}`}
                        // `w-fit`: sem isto o <a> é um flex de nível de bloco,
                        // ocupa a largura toda e um clique no vazio navega.
                        className={`group flex w-fit max-w-full items-baseline gap-3 py-[0.4vh] outline-none md:gap-5 ${
                          aoDireita ? "flex-row-reverse" : ""
                        }`}
                      >
                        <span
                          className="block whitespace-nowrap leading-[1.02] tracking-[-0.025em] transition-[color,transform] duration-500 ease-out"
                          style={{
                            fontFamily: u.fonte,
                            fontWeight: u.peso,
                            fontStyle: u.italico ? "italic" : "normal",
                            // Limitado por ALTURA também: só com `vw` os nomes
                            // somavam mais que a viewport numa tela baixa e o
                            // `overflow-hidden` comia o rodapé.
                            fontSize:
                              "clamp(1.4rem, min(3.35vw, 6vh), 3.6rem)",
                            color: aceso ? u.acento : "currentColor",
                            opacity: foco || aceso ? 1 : 0.7,
                            transform: aceso
                              ? `translateX(${aoDireita ? "-0.5vw" : "0.5vw"})`
                              : "translateX(0)",
                          }}
                        >
                          {u.nome}
                        </span>

                        <ArrowUpRight
                          aria-hidden
                          className="h-4 w-4 shrink-0 transition-opacity duration-500"
                          strokeWidth={2.5}
                          style={{
                            color: u.acento,
                            opacity: aceso ? 1 : 0,
                          }}
                        />
                      </a>
                    </li>
                  );
                })}
              </ul>

              {/* --- Frase: a do território, ou a da unidade apontada --- */}
              {/* Todas as frases do território ocupam a mesma célula de grid:
                  a altura fica fixa na mais longa, e a troca é só opacidade.
                  Sem isso, uma frase de duas linhas empurra o
                  `justify-center` e os nomes saltam no hover. */}
              <div className="mt-6 grid max-w-sm text-[12px] leading-relaxed md:text-[13px]">
                {[
                  { id: t.id, texto: t.frase },
                  ...t.unidades.map((id) => ({
                    id,
                    texto: unidadePorId[id].frase,
                  })),
                ].map(({ id, texto }) => {
                  const ativa =
                    unidadeAtiva && t.unidades.includes(unidadeAtiva)
                      ? unidadeAtiva === id
                      : id === t.id;
                  return (
                    <p
                      key={id}
                      aria-hidden={!ativa}
                      className="col-start-1 row-start-1 transition-opacity duration-300 ease-out"
                      style={{
                        opacity: ativa ? (foco ? 0.75 : 0.45) : 0,
                      }}
                    >
                      {texto}
                    </p>
                  );
                })}
              </div>
            </section>
          );
        })}
      </div>

      {/* ============ DICA ============ */}
      <p
        aria-hidden
        className="pointer-events-none absolute bottom-10 left-1/2 z-30 hidden -translate-x-1/2 text-[10px] uppercase tracking-[0.3em] text-[#f4f4f5] mix-blend-difference transition-opacity duration-500 lg:block"
        style={{ opacity: lado ? 0 : 0.55 }}
      >
        {ABERTURA.dica}
      </p>

      {/* Mini rodapé legal: Meta pede razão social e CNPJ visíveis na home.
          `mix-blend-difference` para atravessar a costura, como o 0800. */}
      <footer className="pointer-events-none absolute inset-x-0 bottom-3 z-30 px-5 text-center mix-blend-difference md:bottom-4 md:px-10">
        <p className="text-[9px] leading-snug tracking-wide text-[#f4f4f5] opacity-45 md:text-[10px]">
          {EMPRESA.razaoSocial} · CNPJ {EMPRESA.cnpj}
        </p>
      </footer>

      {/* ============ SAÍDA ============ */}
      {saindo && (
        <div
          aria-hidden
          className="fixed inset-0 z-50 origin-bottom animate-[inundar_0.62s_cubic-bezier(0.76,0,0.24,1)_forwards]"
          style={{ backgroundColor: saindo.entrada }}
        />
      )}
    </div>
  );
}
