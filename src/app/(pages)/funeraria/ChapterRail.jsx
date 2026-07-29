"use client";

import { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/**
 * Trilho fixo no rodapé: os cinco capítulos e uma barra de tinta que avança
 * conforme o scroll. Funciona como sumário e como índice de progresso —
 * a pessoa sempre sabe em que parte do documento está.
 *
 * Só aparece em telas médias para cima; em mobile ocuparia área de toque útil.
 *
 * @param {{ capitulos: {id:string, n:string, nome:string}[] }} props
 */
export default function ChapterRail({ capitulos }) {
  const root = useRef(null);

  useEffect(() => {
    const el = root.current;
    if (!el) return;

    const fill = el.querySelector("[data-fill]");
    const ctx = gsap.context(() => {
      // Progresso geral do documento.
      gsap.to(fill, {
        scaleX: 1,
        ease: "none",
        scrollTrigger: {
          trigger: document.documentElement,
          start: "top top",
          end: "bottom bottom",
          scrub: 0.4,
        },
      });

      // Capítulo ativo: destaca o rótulo enquanto a seção domina a viewport.
      capitulos.forEach((cap) => {
        const section = document.getElementById(cap.id);
        const label = el.querySelector(`[data-cap="${cap.id}"]`);
        if (!section || !label) return;

        ScrollTrigger.create({
          trigger: section,
          start: "top 55%",
          end: "bottom 55%",
          onToggle: ({ isActive }) => {
            gsap.to(label, {
              opacity: isActive ? 1 : 0.38,
              duration: 0.4,
              ease: "power2.out",
            });
          },
        });
      });
    }, root);

    return () => ctx.revert();
  }, [capitulos]);

  return (
    <div
      ref={root}
      className="fixed bottom-0 inset-x-0 z-40 hidden md:block pointer-events-none mix-blend-difference"
    >
      <div className="relative h-9 flex items-center">
        {/* Barra de progresso: preenche por trás dos rótulos. */}
        <div
          data-fill
          className="absolute inset-y-0 left-0 w-full origin-left scale-x-0 bg-white/12"
          aria-hidden
        />
        {/* Colunas derivadas da quantidade de capítulos. Um grid fixo quebrava
            em duas linhas assim que a lista crescia. */}
        <ul
          className="relative w-full grid px-5 md:px-10"
          style={{
            gridTemplateColumns: `repeat(${capitulos.length}, minmax(0, 1fr))`,
          }}
        >
          {capitulos.map((cap) => (
            <li key={cap.id} className="pointer-events-auto">
              <a
                data-cap={cap.id}
                href={`#${cap.id}`}
                className="fc-mono text-white opacity-[0.38] transition-opacity hover:!opacity-100 whitespace-nowrap"
              >
                <span className="opacity-60 mr-2">{cap.n}</span>
                {cap.nome}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
