"use client";
import { useState } from "react";

export default function Home() {
  const [hovered, setHovered] = useState(null);

  const handleInteraction = (section) => {
    setHovered(hovered === section ? null : section);
  };

  return (
    <main className="relative flex flex-row h-[100dvh] w-full overflow-hidden bg-[#000]">
      
      {/* SEÇÃO SAÚDE (LADO ESQUERDO) */}
      <section
        onMouseEnter={() => setHovered("saude")}
        onMouseLeave={() => setHovered(null)}
        onClick={() => handleInteraction("saude")}
        className={`relative flex flex-col justify-center overflow-hidden cursor-pointer group
          transition-all duration-1000 ease-[cubic-bezier(0.23,1,0.32,1)] will-change-[width]
          ${hovered === "luto" ? "w-[15%] md:w-[15%]" : hovered === "saude" ? "w-[85%] md:w-[85%]" : "w-1/2"} 
          bg-[#F8FAFC] p-6 sm:p-8 md:p-12 lg:p-24`}
      >
        <div className={`w-full max-w-2xl mx-auto transition-all duration-700 transform-gpu ease-out
          ${hovered === "luto" ? "opacity-0 scale-95 pointer-events-none" : "opacity-100 scale-100"}
        `}>
          <span className="block text-[8px] sm:text-[10px] md:text-xs tracking-[0.2em] md:tracking-[0.3em] text-blue-900/50 mb-3 md:mb-4 uppercase font-light whitespace-nowrap">
            Vitalidade & Cuidado
          </span>
          <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-8xl font-serif text-blue-950 mb-8 md:mb-12 tracking-tighter whitespace-nowrap">
            Saúde.
          </h2>

          <nav className={`flex flex-col gap-4 md:gap-6 transition-all duration-700 ease-out transform-gpu
            ${hovered === "saude" 
              ? "translate-x-0 opacity-100 delay-200" 
              : "-translate-x-12 opacity-0 pointer-events-none"
            }`}
          >
            <a href="/plano" onClick={(e) => e.stopPropagation()} className="group/link text-base sm:text-lg md:text-xl text-blue-950/70 hover:text-blue-950 flex items-center gap-3 md:gap-4 w-fit whitespace-nowrap">
              <span className="h-[1px] w-0 group-hover/link:w-6 md:group-hover/link:w-8 bg-blue-950 transition-all duration-300"></span>
              Plano Costa
            </a>
            <a href="/centro-clinico" onClick={(e) => e.stopPropagation()} className="group/link text-base sm:text-lg md:text-xl text-blue-950/70 hover:text-blue-950 flex items-center gap-3 md:gap-4 w-fit whitespace-nowrap">
              <span className="h-[1px] w-0 group-hover/link:w-6 md:group-hover/link:w-8 bg-blue-950 transition-all duration-300"></span>
              Centro Clínico Costa
            </a>
            <a href="/ambulancias" onClick={(e) => e.stopPropagation()} className="group/link text-base sm:text-lg md:text-xl text-blue-950/70 hover:text-blue-950 flex items-center gap-3 md:gap-4 w-fit whitespace-nowrap">
              <span className="h-[1px] w-0 group-hover/link:w-6 md:group-hover/link:w-8 bg-blue-950 transition-all duration-300"></span>
              Costa Ambulâncias
            </a>
          </nav>
        </div>
      </section>

      {/* SEÇÃO LUTO (LADO DIREITO) */}
      <section
        onMouseEnter={() => setHovered("luto")}
        onMouseLeave={() => setHovered(null)}
        onClick={() => handleInteraction("luto")}
        className={`relative flex flex-col justify-center overflow-hidden cursor-pointer group
          transition-all duration-1000 ease-[cubic-bezier(0.23,1,0.32,1)] will-change-[width]
          ${hovered === "saude" ? "w-[15%] md:w-[15%]" : hovered === "luto" ? "w-[85%] md:w-[85%]" : "w-1/2"} 
          bg-[#121212] p-6 sm:p-8 md:p-12 lg:p-24 border-l border-white/5`}
      >
        <div className={`w-full max-w-2xl mx-auto transition-all duration-700 transform-gpu ease-out
          ${hovered === "saude" ? "opacity-0 scale-95 pointer-events-none" : "opacity-100 scale-100"}
        `}>
          <span className="block text-[8px] sm:text-[10px] md:text-xs tracking-[0.2em] md:tracking-[0.3em] text-white/30 mb-3 md:mb-4 uppercase font-light whitespace-nowrap">
            Respeito & Memória
          </span>
          <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-8xl font-serif text-white mb-8 md:mb-12 tracking-tighter whitespace-nowrap">
            Luto.
          </h2>

          <nav className={`flex flex-col gap-4 md:gap-6 transition-all duration-700 ease-out transform-gpu
            ${hovered === "luto" 
              ? "translate-x-0 opacity-100 delay-200" 
              : "translate-x-12 opacity-0 pointer-events-none"
            }`}
          >
            <a href="/funeraria" onClick={(e) => e.stopPropagation()} className="group/link text-base sm:text-lg md:text-xl text-white/50 hover:text-white flex items-center gap-3 md:gap-4 w-fit whitespace-nowrap">
              Funerária Costa
              <span className="h-[1px] w-0 group-hover/link:w-6 md:group-hover/link:w-8 bg-white transition-all duration-300"></span>
            </a>
            <a href="/memorial" onClick={(e) => e.stopPropagation()} className="group/link text-base sm:text-lg md:text-xl text-white/50 hover:text-white flex items-center gap-3 md:gap-4 w-fit whitespace-nowrap">
              Memorial da Paz
              <span className="h-[1px] w-0 group-hover/link:w-6 md:group-hover/link:w-8 bg-white transition-all duration-300"></span>
            </a>
          </nav>
        </div>
      </section>

      {/* MARCA CENTRAL - SOME NO HOVER */}
      <div 
        className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-50 mix-blend-difference transition-opacity duration-700 ease-in-out
        ${hovered ? "opacity-0" : "opacity-60"}`}
      >
        <h1 className="text-white text-[10px] md:text-sm tracking-[0.4em] md:tracking-[0.5em] font-light uppercase whitespace-nowrap">
          Grupo Costa
        </h1>
      </div>
      
    </main>
  );
}