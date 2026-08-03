"use client";

import { useEffect } from "react";

/**
 * Voltar/avançar do navegador e bfcache quebram GSAP/Lenis/CSS transitions.
 * Forçamos load completo nesses casos.
 *
 * O listener de `pageshow` precisa existir FORA do `useEffect`: no restore do
 * bfcache o React não remonta e um listener registrado só no effect chega
 * depois do evento — a home voltava congelada (links ok, hover morto).
 */
function recarregarSeCache(e) {
  if (e.persisted) window.location.reload();
}

if (typeof window !== "undefined") {
  window.addEventListener("pageshow", recarregarSeCache);
}

export default function ReloadOnHistoryNav() {
  useEffect(() => {
    const chaveRota = () =>
      window.location.pathname + window.location.search;

    let rota = chaveRota();
    let armado = false;
    let ignorarPopState = false;

    const hardLoad = (url) => {
      window.location.assign(url);
    };

    const sincronizarRota = () => {
      rota = chaveRota();
    };

    // pushState/replaceState (âncoras do Lenis) não disparam popstate —
    // acompanhamos para não confundir hash com troca de página.
    const pushState = history.pushState.bind(history);
    const replaceState = history.replaceState.bind(history);
    history.pushState = (...args) => {
      const r = pushState(...args);
      sincronizarRota();
      return r;
    };
    history.replaceState = (...args) => {
      const r = replaceState(...args);
      sincronizarRota();
      return r;
    };

    const arm = window.setTimeout(() => {
      armado = true;
    }, 0);

    const onPopState = () => {
      if (!armado) return;
      if (ignorarPopState) {
        ignorarPopState = false;
        sincronizarRota();
        return;
      }
      const proxima = chaveRota();
      if (proxima === rota) return; // só hash
      rota = proxima;
      hardLoad(window.location.href);
    };
    window.addEventListener("popstate", onPopState);

    const nav = window.navigation;
    let onNavigate = null;
    if (nav && typeof nav.addEventListener === "function") {
      onNavigate = (e) => {
        if (e.navigationType !== "traverse") return;

        const destino = new URL(e.destination.url);
        if (
          destino.pathname === window.location.pathname &&
          destino.search === window.location.search
        ) {
          return;
        }

        if (e.canIntercept) {
          ignorarPopState = true;
          e.intercept({
            handler: async () => {
              hardLoad(e.destination.url);
            },
          });
        }
      };
      nav.addEventListener("navigate", onNavigate);
    }

    return () => {
      window.clearTimeout(arm);
      window.removeEventListener("popstate", onPopState);
      history.pushState = pushState;
      history.replaceState = replaceState;
      if (nav && onNavigate) nav.removeEventListener("navigate", onNavigate);
    };
  }, []);

  return null;
}
