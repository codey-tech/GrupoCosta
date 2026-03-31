"use client";
import { createContext, useContext, useEffect, useRef } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/** Ref estável com `.current` = instância Lenis ou null (após destroy). */
const LenisContext = createContext(null);

export function useLenis() {
  return useContext(LenisContext);
}

const LENIS_OPTIONS = {
  lerp: 0.07,
  smoothWheel: true,
};

/**
 * @param {object} props
 * @param {React.ReactNode} props.children
 * @param {number} [props.disableBelowWidth] — abaixo desta largura (px), usa scroll nativo (melhor em mobile + ScrollTrigger).
 */
export default function LenisProvider({ children, disableBelowWidth }) {
  const lenisRef = useRef(null);

  useEffect(() => {
    let instance = null;
    let onTick = null;

    const isNarrow = () =>
      typeof disableBelowWidth === "number" && window.innerWidth < disableBelowWidth;

    const teardown = () => {
      if (instance && onTick) {
        gsap.ticker.remove(onTick);
        instance.destroy();
        instance = null;
        onTick = null;
      }
      lenisRef.current = null;
    };

    const setup = () => {
      teardown();
      if (isNarrow()) {
        ScrollTrigger.refresh();
        return;
      }

      instance = new Lenis(LENIS_OPTIONS);
      lenisRef.current = instance;

      instance.on("scroll", ScrollTrigger.update);

      onTick = (time) => {
        instance.raf(time * 1000);
      };
      gsap.ticker.add(onTick);
      gsap.ticker.lagSmoothing(0);
      ScrollTrigger.refresh();
    };

    setup();

    let resizeT;
    const onResize = () => {
      clearTimeout(resizeT);
      resizeT = setTimeout(setup, 160);
    };
    window.addEventListener("resize", onResize, { passive: true });

    const onDocClick = (e) => {
      const link = e.target?.closest?.('a[href="#contato"]');
      if (!link) return;
      e.preventDefault();
      const el = document.getElementById("contato");
      const lenis = lenisRef.current;
      if (el && lenis) lenis.scrollTo(el, { offset: 0, duration: 1.2 });
      else if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    };
    document.addEventListener("click", onDocClick, true);

    const refreshSt = () => {
      ScrollTrigger.refresh();
    };
    const t1 = setTimeout(refreshSt, 100);
    const t2 = setTimeout(refreshSt, 500);

    return () => {
      clearTimeout(resizeT);
      window.removeEventListener("resize", onResize);
      document.removeEventListener("click", onDocClick, true);
      clearTimeout(t1);
      clearTimeout(t2);
      teardown();
    };
  }, [disableBelowWidth]);

  return (
    <LenisContext.Provider value={lenisRef}>{children}</LenisContext.Provider>
  );
}
