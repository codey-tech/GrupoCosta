"use client";

import { useRef, useState, useEffect } from "react";
import gsap from "gsap";
import { Wordmark, Dove } from "./Brand";

/**
 * Abertura da página: a capa do catálogo "Memórias e Homenagens".
 *
 * Fundo preto, a pomba da marca se desenhando em traço, o logotipo abaixo —
 * exatamente a primeira página do material impresso. Depois a cortina sobe e
 * entrega a página clara. Dura ~2s e não bloqueia nada: o conteúdo já está
 * montado por baixo.
 *
 * @param {{ onDone?: () => void }} props
 */
export default function Preloader({ onDone }) {
  const root = useRef(null);
  const [gone, setGone] = useState(false);

  useEffect(() => {
    const el = root.current;
    if (!el) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setGone(true);
      onDone?.();
      return;
    }

    const counter = el.querySelector("[data-count]");
    const path = el.querySelector("[data-dove-path]");
    const obj = { v: 0 };

    if (path) {
      const len = path.getTotalLength();
      gsap.set(path, { strokeDasharray: len, strokeDashoffset: len });
    }

    const tl = gsap.timeline({
      onComplete: () => {
        setGone(true);
        onDone?.();
      },
    });

    if (path) {
      tl.to(path, { strokeDashoffset: 0, duration: 1.5, ease: "power2.inOut" }, 0);
    }

    tl.to(
      obj,
      {
        v: 100,
        duration: 1.5,
        ease: "power2.inOut",
        onUpdate: () => {
          if (counter) counter.textContent = String(Math.round(obj.v)).padStart(3, "0");
        },
      },
      0
    )
      .from(
        el.querySelector("[data-brand]"),
        { opacity: 0, y: 14, duration: 0.7, ease: "power3.out" },
        0.9
      )
      .to(el.querySelector("[data-meta]"), { opacity: 0, duration: 0.3 }, 1.5)
      .to(el, { yPercent: -100, duration: 0.95, ease: "expo.inOut" }, 1.65);

    return () => tl.kill();
  }, [onDone]);

  if (gone) return null;

  return (
    <div
      ref={root}
      className="fc fixed inset-0 z-[100] overflow-hidden bg-[#0c0c0b] text-[#f1f0ec] flex flex-col items-center justify-center px-5"
      aria-hidden
    >
      {/* A pomba inteira se desenhando em traço contínuo — agora que o vetor
          é o original, ela vale como abertura por si só. */}
      <Dove
        className="w-[52vw] max-w-[380px] text-[#f1f0ec]"
        strokeWidth={11}
        pathProps={{ "data-dove-path": "" }}
      />

      <div data-brand className="relative mt-10 md:mt-14">
        <Wordmark className="text-lg md:text-2xl" />
      </div>

      <div
        data-meta
        className="absolute inset-x-0 bottom-8 md:bottom-10 px-5 md:px-10 flex items-center justify-between"
      >
        <span className="fc-mono opacity-40">Memórias e Homenagens</span>
        <span className="fc-mono opacity-40">
          [ <span data-count>000</span> ]
        </span>
      </div>
    </div>
  );
}
