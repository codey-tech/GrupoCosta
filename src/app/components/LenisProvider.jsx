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

const BASE_LENIS = {
  lerp: 0.07,
  wheelMultiplier: 1.08,
  touchMultiplier: 1,
  syncTouchLerp: 0.075,
  touchInertiaMultiplier: 32,
};

/** Altura rolável do documento (evita limite Lenis curto em mobile com layout dinâmico). */
function getDocumentScrollHeight() {
  const docEl = document.documentElement;
  const body = document.body;
  return Math.max(
    docEl.scrollHeight,
    body.scrollHeight,
    docEl.offsetHeight,
    body.offsetHeight
  );
}

/**
 * Integração Lenis ↔ ScrollTrigger (recomendado pela GSAP + darkroom).
 * `scrollHeight` é obrigatório: sem ele, `_maxScroll` fica errado e o pin+scrub “morre” no meio.
 */
function attachLenisScrollerProxy(lenis) {
  const docEl = document.documentElement;
  ScrollTrigger.scrollerProxy(docEl, {
    scrollTop(value) {
      if (arguments.length) {
        lenis.scrollTo(value, { immediate: true });
      }
      return lenis.scroll;
    },
    getBoundingClientRect() {
      return {
        top: 0,
        left: 0,
        width: window.innerWidth,
        height: window.innerHeight,
      };
    },
    scrollHeight: getDocumentScrollHeight,
  });
  ScrollTrigger.refresh();
}

function clearLenisScrollerProxy() {
  ScrollTrigger.scrollerProxy(document.documentElement, null);
  ScrollTrigger.refresh();
}

/**
 * @param {object} props
 * @param {React.ReactNode} props.children
 * @param {number} [props.disableBelowWidth] — abaixo desta largura (px), scroll nativo (sem Lenis).
 * @param {boolean} [props.smoothWheel=true] — `false` desativa só o suavizado da roda (fallback raro).
 */
export default function LenisProvider({
  children,
  disableBelowWidth,
  smoothWheel = true,
}) {
  const lenisRef = useRef(null);

  useEffect(() => {
    let instance = null;
    let onTick = null;
    let stRefreshRaf = null;
    let lastViewportWidth = window.innerWidth;
    let layoutObserver = null;
    let layoutObserverDebounce = null;

    const isNarrow = () =>
      typeof disableBelowWidth === "number" && window.innerWidth < disableBelowWidth;

    const isTouchViewport = () => window.matchMedia("(max-width: 767px)").matches;

    const onScrollTriggerRefresh = () => {
      if (!instance) return;
      cancelAnimationFrame(stRefreshRaf);
      stRefreshRaf = requestAnimationFrame(() => {
        instance.resize();
        stRefreshRaf = null;
      });
    };

    const teardown = () => {
      ScrollTrigger.removeEventListener("refresh", onScrollTriggerRefresh);
      cancelAnimationFrame(stRefreshRaf);
      stRefreshRaf = null;
      clearTimeout(layoutObserverDebounce);
      layoutObserverDebounce = null;
      if (layoutObserver) {
        layoutObserver.disconnect();
        layoutObserver = null;
      }

      if (instance) {
        if (onTick) {
          gsap.ticker.remove(onTick);
          onTick = null;
        }
        clearLenisScrollerProxy();
        instance.destroy();
        instance = null;
      }
      lenisRef.current = null;
    };

    const setup = () => {
      teardown();
      if (isNarrow()) {
        ScrollTrigger.refresh();
        return;
      }

      instance = new Lenis({
        ...BASE_LENIS,
        smoothWheel,
        wheelMultiplier: smoothWheel ? BASE_LENIS.wheelMultiplier : 1,
        syncTouch: isTouchViewport(),
      });
      lenisRef.current = instance;

      instance.on("scroll", ScrollTrigger.update);

      if (smoothWheel) {
        attachLenisScrollerProxy(instance);
      } else {
        ScrollTrigger.refresh();
      }

      ScrollTrigger.addEventListener("refresh", onScrollTriggerRefresh);

      layoutObserver = new ResizeObserver(() => {
        clearTimeout(layoutObserverDebounce);
        layoutObserverDebounce = setTimeout(() => {
          layoutObserverDebounce = null;
          onScrollTriggerRefresh();
        }, 100);
      });
      layoutObserver.observe(document.documentElement);
      layoutObserver.observe(document.body);

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
      const viewportWidth = window.innerWidth;
      const widthChanged = Math.abs(viewportWidth - lastViewportWidth) > 40;
      lastViewportWidth = viewportWidth;

      if (!widthChanged) {
        instance?.resize();
        ScrollTrigger.refresh();
        return;
      }

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
      else if (el) el.scrollIntoView({ behavior: "auto", block: "start" });
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
  }, [disableBelowWidth, smoothWheel]);

  return (
    <LenisContext.Provider value={lenisRef}>{children}</LenisContext.Provider>
  );
}
