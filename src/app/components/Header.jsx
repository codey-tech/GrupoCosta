"use client";
import { useState } from "react";

const bgClassByKey = {
  "slate-800": "bg-slate-800",
  "slate-950": "bg-slate-950",
};

const textClassByKey = {
  white: "text-white",
  "slate-100": "text-slate-100",
};

export default function Header({ logoUrl, bgColor, textColor, className, children }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const resolvedBgClass = bgClassByKey[bgColor] ?? "bg-slate-800";
  const resolvedTextClass = textClassByKey[textColor] ?? "text-white";

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header
      className={`flex flex-col md:flex-row justify-evenly items-center w-full py-4 px-6 ${resolvedBgClass} ${className ?? ""}`}
    >
      {/* Logo e Botão do Menu (Mobile) */}
      <div className="flex justify-between items-center w-full md:w-auto">
        <img src={logoUrl} alt="Logo" className="h-16" />
        <button
          className="text-white md:hidden focus:outline-none"
          onClick={toggleMenu}
        >
          <svg
            className="w-8 h-8"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4 6h16M4 12h16m-7 6h7"
            ></path>
          </svg>
        </button>
      </div>

      {/* Menu de Navegação */}
      <nav
        className={`${
          isMenuOpen ? "block" : "hidden"
        } flex flex-col md:flex md:flex-row gap-4 md:gap-10 justify-center mt-4 md:mt-0 w-full md:w-auto`}
      >
        <a href="#sobrenos" className={`font-light ${resolvedTextClass} text-sm md:text-lg hover:underline transition-all duration-300`}>
          Sobre nós
        </a>
        {children}
        <a href="#contato" className={`font-light ${resolvedTextClass} text-sm md:text-lg hover:underline transition-all duration-300`}>
          Contato
        </a>
        <a href="#contato" className={`font-light ${resolvedTextClass} text-sm md:text-lg hover:underline transition-all duration-300`}>
          Trabalhe Conosco
        </a>
      </nav>
    </header>
  );
}