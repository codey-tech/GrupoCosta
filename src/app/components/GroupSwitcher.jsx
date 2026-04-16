"use client";
import React, { useState, useRef, useEffect, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import {
  X,
  LayoutGrid,
  HeartPulse,
  ArrowRight,
  Activity,
  Bird,
  Ambulance,
  Heart,
} from "lucide-react";

const emptySubscribe = () => () => {};

const GroupSwitcher = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeSide, setActiveSide] = useState("saude");
  const overlayRef = useRef(null);
  const mounted = useSyncExternalStore(emptySubscribe, () => true, () => false);

  useEffect(() => {
    if (!isOpen) return;

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKeyDown = (e) => {
      if (e.key === "Escape") setIsOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [isOpen]);

  useGSAP(() => {
    const el = overlayRef.current;
    if (!el) return;

    if (isOpen) {
      gsap.to(el, {
        display: "flex",
        opacity: 1,
        duration: 0.4,
        ease: "power2.out",
      });
      gsap.fromTo(
        ".menu-anim",
        { y: 28, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.65, stagger: 0.08, ease: "power3.out", delay: 0.15 }
      );
    } else {
      gsap.to(el, {
        opacity: 0,
        duration: 0.28,
        ease: "power2.in",
        onComplete: () => gsap.set(el, { display: "none" }),
      });
    }
  }, { scope: overlayRef, dependencies: [isOpen] });

  const groupData = {
    saude: [
      { name: "Plano Costa", icon: <HeartPulse size={18} className="shrink-0" />, url: "/plano" },
      { name: "Centro Clínico", icon: <Activity size={18} className="shrink-0" />, url: "/centro-clinico" },
      { name: "Ambulâncias", icon: <Ambulance size={18} className="shrink-0" />, url: "/ambulancias" },
    ],
    luto: [
      { name: "Funerária Costa", icon: <Heart size={18} className="shrink-0" />, url: "/funeraria" },
      { name: "Memorial da Paz", icon: <Bird size={18} className="shrink-0" />, url: "/memorial" },
    ],
  };

  const saudeExpanded = activeSide === "saude";
  const lutoExpanded = activeSide === "luto";
  const openMenu = () => {
    setActiveSide("saude");
    setIsOpen(true);
  };

  const linkCardClass =
    "menu-anim group flex min-h-[3.25rem] w-full max-w-full items-center justify-between gap-3 rounded-2xl border transition-all duration-300 active:scale-[0.99] md:gap-4";

  return (
    <>
      {/* TRIGGER DESKTOP */}
      <button
        type="button"
        onClick={openMenu}
        className="group hidden items-center gap-2 rounded-full border border-[#CAC6BC] px-4 py-2 transition-all duration-300 hover:bg-[#1C1C15] hover:text-[#FDF9EE] md:flex"
      >
        <LayoutGrid size={16} className="transition-transform duration-500 group-hover:rotate-90" />
        <span className="text-[10px] font-bold uppercase tracking-widest">Grupo Costa</span>
      </button>

      {/* TRIGGER MOBILE — respeita safe area e evita colisão com home indicator */}
      <button
        type="button"
        onClick={openMenu}
        aria-label="Abrir menu Grupo Costa"
        className="fixed z-[9998] flex h-12 w-12 items-center justify-center rounded-full border border-white/15 bg-[#1C1C15] text-[#FDF9EE] shadow-xl transition-transform active:scale-95 md:hidden"
        style={{
          right: "max(1rem, env(safe-area-inset-right, 0px))",
          bottom: "max(1rem, env(safe-area-inset-bottom, 0px))",
        }}
      >
        <LayoutGrid size={18} aria-hidden />
      </button>

      {mounted &&
        createPortal(
          <div
            ref={overlayRef}
            role="dialog"
            aria-modal="true"
            aria-label="Navegação Grupo Costa"
            className="fixed inset-0 z-[99999] hidden max-w-[100dvw] flex-col overflow-x-hidden overflow-y-auto overscroll-contain bg-[#000] md:h-[100dvh] md:w-full md:flex-row md:overflow-hidden"
            style={{
              paddingTop: "env(safe-area-inset-top, 0px)",
              paddingBottom: "env(safe-area-inset-bottom, 0px)",
            }}
          >
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              aria-label="Fechar menu"
              className="absolute right-[max(1rem,env(safe-area-inset-right,0px))] top-[max(0.75rem,env(safe-area-inset-top,0px))] z-[60] rounded-full bg-black/35 p-2.5 text-white backdrop-blur-md transition-transform hover:rotate-90 md:right-8 md:top-8 md:bg-white/10 md:p-3"
            >
              <X size={22} strokeWidth={1.5} aria-hidden />
            </button>

            {/* SAÚDE */}
            <div
              onMouseEnter={() => setActiveSide("saude")}
              className={`relative flex w-full min-w-0 flex-col justify-center px-4 pb-8 pt-[3.25rem] sm:px-6 md:min-h-screen md:px-16 lg:p-24 ${
                activeSide === "luto" ? "md:w-[15%]" : "md:w-[85%]"
              } bg-[#F8FAFC] transition-all duration-700 ease-[cubic-bezier(0.23,1,0.32,1)]`}
            >
              <div className="mx-auto w-full max-w-md min-w-0">
                <div className="menu-anim mb-6 md:mb-10">
                  <span className="mb-2 block text-[10px] font-light uppercase tracking-[0.28em] text-blue-900/50 sm:text-xs sm:tracking-[0.3em]">
                    Vitalidade & Cuidado
                  </span>
                  <h3 className="font-serif text-3xl font-normal tracking-tighter text-blue-950 sm:text-4xl md:text-7xl">
                    Saúde.
                  </h3>
                </div>

                <div
                  className={`flex flex-col gap-3 sm:gap-4 md:gap-4 ${
                    saudeExpanded
                      ? "opacity-100 md:translate-x-0"
                      : "opacity-100 md:pointer-events-none md:translate-x-4 md:opacity-0"
                  } transition-all duration-300`}
                >
                  {groupData.saude.map((item, i) => (
                    <Link
                      key={i}
                      href={item.url}
                      onClick={() => setIsOpen(false)}
                      className={`${linkCardClass} border-blue-900/10 bg-white p-4 hover:border-blue-900/30 hover:shadow-xl hover:shadow-blue-900/5 md:p-6`}
                    >
                      <div className="flex min-w-0 flex-1 items-center gap-3 md:gap-4">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-950/5 text-blue-950 transition-colors duration-500 group-hover:bg-blue-950 group-hover:text-white">
                          {item.icon}
                        </div>
                        <span className="min-w-0 truncate text-left text-base font-medium tracking-tight text-blue-950 md:text-xl">
                          {item.name}
                        </span>
                      </div>
                      <ArrowRight
                        className="shrink-0 text-blue-950 opacity-60 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100 md:-translate-x-2 md:opacity-0 md:group-hover:translate-x-0"
                        size={20}
                        aria-hidden
                      />
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            {/* LUTO */}
            <div
              onMouseEnter={() => setActiveSide("luto")}
              className={`relative flex w-full min-w-0 flex-col justify-center border-t border-white/5 px-4 pb-10 pt-8 sm:px-6 md:min-h-screen md:border-l md:border-t-0 md:px-16 lg:p-24 ${
                activeSide === "luto" ? "md:w-[85%]" : "md:w-[15%]"
              } bg-[#121212] transition-all duration-700 ease-[cubic-bezier(0.23,1,0.32,1)]`}
            >
              <div className="mx-auto w-full max-w-md min-w-0">
                <div className="menu-anim mb-6 md:mb-10">
                  <span className="mb-2 block text-[10px] font-light uppercase tracking-[0.28em] text-white/35 sm:text-xs sm:tracking-[0.3em]">
                    Respeito & Memória
                  </span>
                  <h3 className="font-serif text-3xl font-normal tracking-tighter text-white sm:text-4xl md:text-7xl">
                    Luto.
                  </h3>
                </div>

                <div
                  className={`flex flex-col gap-3 sm:gap-4 md:gap-4 ${
                    lutoExpanded
                      ? "opacity-100 md:translate-x-0"
                      : "opacity-100 md:pointer-events-none md:translate-x-4 md:opacity-0"
                  } transition-all duration-300`}
                >
                  {groupData.luto.map((item, i) => (
                    <Link
                      key={i}
                      href={item.url}
                      onClick={() => setIsOpen(false)}
                      className={`${linkCardClass} border-white/10 bg-white/5 p-4 hover:border-white/20 hover:bg-white/10 md:p-6`}
                    >
                      <div className="flex min-w-0 flex-1 items-center gap-3 md:gap-4">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/5 text-white transition-colors duration-500 group-hover:bg-white group-hover:text-[#121212]">
                          {item.icon}
                        </div>
                        <span className="min-w-0 truncate text-left text-base font-medium tracking-tight text-white md:text-xl">
                          {item.name}
                        </span>
                      </div>
                      <ArrowRight
                        className="shrink-0 text-white/90 opacity-70 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100 md:-translate-x-2 md:opacity-0 md:group-hover:translate-x-0"
                        size={20}
                        aria-hidden
                      />
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            {/* Rodapé: no fluxo no mobile (não sobrepõe); absoluto só no desktop */}
            <div className="menu-anim pointer-events-auto shrink-0 border-t border-white/10 bg-[#0c0c0c] py-5 md:absolute md:bottom-10 md:left-1/2 md:right-auto md:w-auto md:-translate-x-1/2 md:border-t-0 md:bg-transparent md:py-0 md:mix-blend-difference w-full">
              <Link
                href="/"
                onClick={() => setIsOpen(false)}
                className="group mx-auto flex max-w-full flex-col items-center gap-2 px-4"
              >
                <span className="text-center text-[9px] font-light uppercase tracking-[0.35em] text-white/70 transition-opacity group-hover:opacity-100 sm:text-[10px] sm:tracking-[0.45em] md:tracking-[0.5em]">
                  Grupo Costa
                </span>
                <div className="h-px w-12 bg-white/40 transition-all duration-500 group-hover:w-24 group-hover:bg-white md:w-0 md:group-hover:w-full" />
              </Link>
            </div>
          </div>,
          document.body
        )}
    </>
  );
};

export default GroupSwitcher;
