"use client";
import React, { useState, useRef, useEffect, useSyncExternalStore } from 'react';
import { createPortal } from 'react-dom';
import Link from 'next/link';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { X, LayoutGrid, HeartPulse, ArrowRight, Activity, Bird, Ambulance, Heart } from 'lucide-react';

const emptySubscribe = () => () => {};

const GroupSwitcher = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeSide, setActiveSide] = useState("saude");
  const overlayRef = useRef();
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
    if (!overlayRef.current) return;

    if (isOpen) {
      // Revela o fundo principal
      gsap.to(overlayRef.current, {
        display: 'flex',
        opacity: 1,
        duration: 0.4,
        ease: "power2.out"
      });
      // Anima os itens internos subindo
      gsap.fromTo(".menu-anim", 
        { y: 40, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.7, stagger: 0.1, ease: "power3.out", delay: 0.2 }
      );
    } else {
      gsap.to(overlayRef.current, {
        opacity: 0,
        duration: 0.3,
        ease: "power2.in",
        onComplete: () => gsap.set(overlayRef.current, { display: 'none' })
      });
    }
  }, [isOpen]);

  const groupData = {
    saude: [
      { name: "Plano Costa", icon: <HeartPulse size={18} />, url: "/plano" },
      { name: "Centro Clínico", icon: <Activity size={18} />, url: "/centro-clinico" },
      { name: "Ambulâncias", icon: <Ambulance size={18} />, url: "/ambulancias" },
    ],
    luto: [
      { name: "Funerária Costa", icon: <Heart size={18} />, url: "/funeraria" },
      { name: "Memorial da Paz", icon: <Bird size={18} />, url: "/memorial" },
    ]
  };

  const saudeExpanded = activeSide === "saude";
  const lutoExpanded = activeSide === "luto";
  const openMenu = () => {
    setActiveSide("saude");
    setIsOpen(true);
  };

  return (
    <>
      {/* TRIGGER DESKTOP (inline no header) */}
      <button 
        onClick={openMenu}
        className="hidden md:flex items-center gap-2 px-4 py-2 rounded-full border border-[#CAC6BC] hover:bg-[#1C1C15] hover:text-[#FDF9EE] transition-all duration-300 group"
      >
        <LayoutGrid size={16} className="group-hover:rotate-90 transition-transform duration-500" />
        <span className="text-[10px] font-bold uppercase tracking-widest">Grupo Costa</span>
      </button>

      {/* TRIGGER MOBILE (flutuante, otimiza espaço no header) */}
      <button
        onClick={openMenu}
        aria-label="Abrir Group Switcher"
        className="md:hidden fixed bottom-5 right-5 z-[9998] h-12 w-12 rounded-full bg-[#1C1C15] text-[#FDF9EE] shadow-xl border border-white/15 flex items-center justify-center active:scale-95 transition-transform"
      >
        <LayoutGrid size={18} />
      </button>

      {/* OVERLAY SPLIT-SCREEN */}
      {mounted && createPortal(
      <div
        ref={overlayRef}
        className="fixed inset-0 z-[99999] hidden h-[100dvh] w-screen flex-col md:flex-row bg-[#000] overflow-y-auto md:overflow-hidden"
      >
        {/* BOTÃO FECHAR GLOBAL */}
        <button 
          onClick={() => setIsOpen(false)}
          className="absolute top-6 right-6 md:top-8 md:right-8 z-50 p-3 bg-black/20 md:bg-white/10 backdrop-blur-md text-white rounded-full hover:rotate-90 transition-transform duration-300"
        >
          <X size={24} strokeWidth={1.5} />
        </button>

        {/* =========================================
            COLUNA SAÚDE (Lado Esquerdo - Claro)
        ========================================== */}
        <div
          onMouseEnter={() => setActiveSide("saude")}
          className={`w-full bg-[#F8FAFC] p-8 md:p-16 lg:p-24 flex flex-col justify-center relative min-h-[50vh] md:min-h-screen transition-all duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] ${
            activeSide === "luto" ? "md:w-[15%]" : "md:w-[85%]"
          }`}
        >
          <div className="max-w-md w-full md:mx-auto">
            
            <div className="menu-anim mb-10">
              <span className="block text-xs tracking-[0.3em] text-blue-900/50 mb-3 uppercase font-light">Vitalidade & Cuidado</span>
              <h3 className="text-5xl md:text-7xl font-serif text-blue-950 tracking-tighter">Saúde.</h3>
            </div>

            <div
              className={`flex flex-col gap-4 transition-all duration-300 ${
                saudeExpanded ? "opacity-100 md:translate-x-0" : "opacity-100 md:opacity-0 md:pointer-events-none md:translate-x-4"
              }`}
            >
              {groupData.saude.map((item, i) => (
                <Link key={i} href={item.url} className="menu-anim group flex items-center justify-between p-5 md:p-6 rounded-2xl bg-white border border-blue-900/10 hover:border-blue-900/30 hover:shadow-xl hover:shadow-blue-900/5 transition-all duration-500">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-blue-950/5 text-blue-950 flex items-center justify-center group-hover:bg-blue-950 group-hover:text-white transition-colors duration-500">
                      {item.icon}
                    </div>
                    <span className="text-lg md:text-xl font-medium text-blue-950 tracking-tight">{item.name}</span>
                  </div>
                  <ArrowRight className="text-blue-950 opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-500" />
                </Link>
              ))}
            </div>

          </div>
        </div>

        {/* =========================================
            COLUNA LUTO (Lado Direito - Escuro)
        ========================================== */}
        <div
          onMouseEnter={() => setActiveSide("luto")}
          className={`w-full bg-[#121212] p-8 md:p-16 lg:p-24 flex flex-col justify-center relative border-t md:border-t-0 md:border-l border-white/5 min-h-[50vh] md:min-h-screen transition-all duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] ${
            activeSide === "luto" ? "md:w-[85%]" : "md:w-[15%]"
          }`}
        >
          <div className="max-w-md w-full md:mx-auto">
            
            <div className="menu-anim mb-10">
              <span className="block text-xs tracking-[0.3em] text-white/30 mb-3 uppercase font-light">Respeito & Memória</span>
              <h3 className="text-5xl md:text-7xl font-serif text-white tracking-tighter">Luto.</h3>
            </div>

            <div
              className={`flex flex-col gap-4 transition-all duration-300 ${
                lutoExpanded ? "opacity-100 md:translate-x-0" : "opacity-100 md:opacity-0 md:pointer-events-none md:translate-x-4"
              }`}
            >
              {groupData.luto.map((item, i) => (
                <Link key={i} href={item.url} className="menu-anim group flex items-center justify-between p-5 md:p-6 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 hover:border-white/20 transition-all duration-500">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-white/5 text-white flex items-center justify-center group-hover:bg-white group-hover:text-[#121212] transition-colors duration-500">
                      {item.icon}
                    </div>
                    <span className="text-lg md:text-xl font-medium text-white tracking-tight">{item.name}</span>
                  </div>
                  <ArrowRight className="text-white opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-500" />
                </Link>
              ))}
            </div>

          </div>
        </div>

        {/* MARCA CENTRAL & LINK PORTAL */}
        <div className="menu-anim absolute bottom-6 md:bottom-10 left-1/2 -translate-x-1/2 z-50 mix-blend-difference pointer-events-auto">
          <Link href="/" className="flex flex-col items-center gap-2 group">
            <span className="text-white text-[10px] tracking-[0.5em] font-light uppercase opacity-50 group-hover:opacity-100 transition-opacity">
              Grupo Costa
            </span>
            <div className="h-[1px] w-0 bg-white group-hover:w-full transition-all duration-500"></div>
          </Link>
        </div>

      </div>,
      document.body
      )}
    </>
  );
};

export default GroupSwitcher;