"use client";
import { useState } from "react";

export default function Home() {
  const [hovered, setHovered] = useState(null);

  return (
    <main className="relative flex h-screen w-full overflow-hidden bg-[#000] transition-colors duration-700">
      {/* SEÇÃO SAÚDE */}
      <section
        onMouseEnter={() => setHovered("saude")}
        onMouseLeave={() => setHovered(null)}
        className={`relative flex flex-col justify-center transition-all duration-1000 ease-[cubic-bezier(0.23,1,0.32,1)] 
          ${hovered === "luto" ? "w-[10%]" : hovered === "saude" ? "w-[90%]" : "w-1/2"} 
          bg-[#F8FAFC] p-12 md:p-24`}
      >
        <div className={`transition-opacity duration-500 ${hovered === "luto" ? "opacity-0" : "opacity-100"}`}>
          <span className="block text-xs tracking-[0.3em] text-blue-900/50 mb-4 uppercase font-light">Vitalidade & Cuidado</span>
          <h2 className="text-6xl md:text-8xl font-serif text-blue-950 mb-12 tracking-tighter">Saúde.</h2>

          <nav className={`flex flex-col gap-6 transition-all delay-200 duration-700 ${hovered === "saude" ? "translate-x-0 opacity-100" : "-translate-x-10 opacity-0"}`}>
            <a href="/plano" className="group text-xl text-blue-950/70 hover:text-blue-950 flex items-center gap-4">
              <span className="h-[1px] w-0 group-hover:w-8 bg-blue-950 transition-all duration-300"></span>
              Plano Costa
            </a>
            <a href="/centro-clinico" className="group text-xl text-blue-950/70 hover:text-blue-950 flex items-center gap-4">
              <span className="h-[1px] w-0 group-hover:w-8 bg-blue-950 transition-all duration-300"></span>
              Centro Clínico Costa
            </a>
            <a href="/ambulancias" className="group text-xl text-blue-950/70 hover:text-blue-950 flex items-center gap-4">
              <span className="h-[1px] w-0 group-hover:w-8 bg-blue-950 transition-all duration-300"></span>
              Costa Ambulâncias
            </a>
          </nav>
        </div>
      </section>

      {/* SEÇÃO LUTO */}
      <section
        onMouseEnter={() => setHovered("luto")}
        onMouseLeave={() => setHovered(null)}
        className={`relative flex flex-col justify-center transition-all duration-1000 ease-[cubic-bezier(0.23,1,0.32,1)] 
          ${hovered === "saude" ? "w-[10%]" : hovered === "luto" ? "w-[90%]" : "w-1/2"} 
          bg-[#121212] p-12 md:p-24 border-l border-white/5`}
      >
        <div className={`transition-opacity duration-500 ${hovered === "saude" ? "opacity-0" : "opacity-100"}`}>
          <span className="block text-xs tracking-[0.3em] text-white/30 mb-4 uppercase font-light">Respeito & Memória</span>
          <h2 className="text-6xl md:text-8xl font-serif text-white mb-12 tracking-tighter">Luto.</h2>

          <nav className={`flex flex-col gap-6 transition-all delay-200 duration-700 ${hovered === "luto" ? "translate-x-0 opacity-100" : "translate-x-10 opacity-0"}`}>
            <a href="/funeraria" className="group text-xl text-white/50 hover:text-white flex items-center gap-4">
              Funerária Costa
              <span className="h-[1px] w-0 group-hover:w-8 bg-white transition-all duration-300"></span>
            </a>
            <a href="/memorial" className="group text-xl text-white/50 hover:text-white flex items-center gap-4">
              Memorial da Paz
              <span className="h-[1px] w-0 group-hover:w-8 bg-white transition-all duration-300"></span>
            </a>
          </nav>
        </div>
      </section>

      {/* MARCA CENTRAL - FIXA E MINIMALISTA */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-50 mix-blend-difference">
        <h1 className="text-white text-sm tracking-[0.5em] font-light uppercase opacity-50">Grupo Costa</h1>
      </div>
    </main>
  );
}
