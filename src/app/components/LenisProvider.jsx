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

export default function LenisProvider({ children }) {
  const lenisRef = useRef(null);

  useEffect(() => {
    const instance = new Lenis(LENIS_OPTIONS);
    lenisRef.current = instance;

    instance.on("scroll", ScrollTrigger.update);

    const onTick = (time) => {
      instance.raf(time * 1000);
    };
    gsap.ticker.add(onTick);
    gsap.ticker.lagSmoothing(0);

    const onDocClick = (e) => {
      const link = e.target?.closest?.('a[href="#contato"]');
      if (!link) return;
      e.preventDefault();
      const el = document.getElementById("contato");
      if (el) instance.scrollTo(el, { offset: 0, duration: 1.2 });
    };
    document.addEventListener("click", onDocClick, true);

    const refreshSt = () => {
      ScrollTrigger.refresh();
    };
    const t1 = setTimeout(refreshSt, 100);
    const t2 = setTimeout(refreshSt, 500);

    return () => {
      document.removeEventListener("click", onDocClick, true);
      clearTimeout(t1);
      clearTimeout(t2);
      instance.destroy();
      lenisRef.current = null;
      gsap.ticker.remove(onTick);
    };
  }, []);

  return (
    <LenisContext.Provider value={lenisRef}>{children}</LenisContext.Provider>
  );
}
