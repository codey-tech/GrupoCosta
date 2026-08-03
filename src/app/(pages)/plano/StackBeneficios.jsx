"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { BENEFICIOS, TEXTOS } from "./content";

gsap.registerPlugin(ScrollTrigger, useGSAP);

/**
 * Os quatro blocos de benefício entrando e se empilhando.
 *
 * É o momento de maior impacto da página e o motivo de ela não ser só uma
 * lista. No desktop a seção prende (`pin`) enquanto os cartões voam da direita
 * e se acomodam em leque; no celular não há pin nenhum — ali um trecho preso
 * atrapalha a rolagem por toque e o efeito não compensa o custo.
 *
 * O `gsap.matchMedia` é revertido à mão na limpeza: o contexto do `useGSAP`
 * não faz isso, e sem o revert o pin fica registrado duas vezes ao trocar de
 * faixa de largura.
 */
export default function StackBeneficios() {
  const secao = useRef(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      // ---- Desktop: prende e empilha -------------------------------------
      mm.add("(min-width: 768px) and (prefers-reduced-motion: no-preference)", () => {
        const cartoes = gsap.utils.toArray("[data-cartao]", secao.current);
        if (!cartoes.length) return;

        gsap.set(cartoes, { xPercent: 140, yPercent: 60, opacity: 0, rotate: 14 });

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: secao.current,
            start: "top top",
            // Ancorado na viewport, e não em percentual: com pin, um `+=N%`
            // é resolvido contra o pin-spacer que o próprio pin acabou de
            // criar, e o valor cresce a cada refresh.
            end: () => "+=" + window.innerHeight * cartoes.length * 0.9,
            scrub: 1,
            pin: true,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        });

        cartoes.forEach((cartao, i) => {
          tl.to(cartao, {
            xPercent: i * 9,
            yPercent: i * 7,
            opacity: 1,
            rotate: 0,
            duration: 0.4,
            ease: "power3.out",
          }).to({}, { duration: 0.55 });
        });
      });

      // ---- Celular e movimento reduzido: sobe em cascata ------------------
      mm.add(
        "(max-width: 767px), (prefers-reduced-motion: reduce)",
        () => {
          const cartoes = gsap.utils.toArray("[data-cartao]", secao.current);
          gsap.set(cartoes, { clearProps: "all" });
          gsap.from(cartoes, {
            y: 28,
            opacity: 0,
            duration: 0.5,
            stagger: 0.08,
            ease: "power2.out",
            scrollTrigger: {
              trigger: secao.current,
              start: "top 78%",
              toggleActions: "play none none reverse",
            },
          });
        }
      );

      return () => mm.revert();
    },
    { scope: secao }
  );

  return (
    <section
      ref={secao}
      id="beneficios"
      className="relative w-full overflow-hidden border-b border-slate-200 bg-slate-50 py-20 md:flex md:h-[100dvh] md:items-center md:py-0"
    >
      {/* Título gigante em marca d'água, atrás dos cartões. */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-8 z-0 -translate-x-1/2 text-center opacity-20 md:left-auto md:right-16 md:top-28 md:translate-x-0 md:text-right"
      >
        <p className="text-5xl font-black uppercase leading-none tracking-tighter text-slate-400 md:text-[8vw]">
          {TEXTOS.beneficiosTitulo[0]}
          <br />
          {TEXTOS.beneficiosTitulo[1]}
        </p>
      </div>

      <div className="relative z-10 flex w-full flex-col items-center gap-6 px-6 md:ml-[6vw] md:h-[420px] md:w-[420px] md:block md:px-0">
        {BENEFICIOS.map((ben, i) => (
          <article
            key={ben.titulo}
            data-cartao
            style={{ zIndex: i }}
            className="relative flex w-full max-w-[360px] flex-col justify-between rounded-[2rem] border border-slate-200 bg-white p-8 shadow-2xl md:absolute md:left-0 md:top-0 md:h-[400px] md:w-[420px] md:bg-white/85 md:p-10 md:backdrop-blur-lg"
          >
            <span
              aria-hidden
              className="pointer-events-none absolute right-6 top-4 select-none text-6xl font-black tracking-tighter text-purple-100 md:text-8xl"
            >
              {String(i + 1).padStart(2, "0")}
            </span>

            <div className="relative">
              <h3 className="text-2xl font-black tracking-tighter text-slate-900 md:text-3xl">
                {ben.titulo}
              </h3>

              <ul className="mt-6 space-y-3.5">
                {ben.itens.map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-3 text-sm font-medium leading-snug text-slate-600"
                  >
                    <span className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full bg-purple-500" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
