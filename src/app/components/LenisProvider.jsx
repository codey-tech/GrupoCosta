"use client";
import { useEffect, useRef } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const LENIS_OPTIONS = {
  lerp: 0.07,
  smoothWheel: true,
};

export default function LenisProvider({ children }) {
  const lenisRef = useRef(null);
  const rafRef = useRef(0);

  useEffect(() => {
    const lenis = new Lenis(LENIS_OPTIONS);
    lenisRef.current = lenis;

    lenis.on("scroll", ScrollTrigger.update);

    function raf(time) {
      lenis.raf(time);
      rafRef.current = requestAnimationFrame(raf);
    }
    rafRef.current = requestAnimationFrame(raf);

    const onDocClick = (e) => {
      const link = e.target?.closest?.('a[href="#contato"]');
      if (!link) return;
      e.preventDefault();
      const el = document.getElementById("contato");
      if (el) lenis.scrollTo(el, { offset: 0, duration: 1.2 });
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
      lenis.destroy();
      lenisRef.current = null;
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return <>{children}</>;
}
