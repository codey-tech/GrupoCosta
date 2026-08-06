import Link from "next/link";
import { HardHat } from "lucide-react";
import GrupoCostaFooter from "@/components/GrupoCostaFooter";

/**
 * Página temporária "em construção" — alinhada à seção Luto da home (#121212) e ao rodapé do Plano Costa.
 * @param {{ titulo: string, subtitulo: string, atual?: string }} props
 */
export default function EmConstrucao({ titulo, subtitulo, atual }) {
  return (
    <main className="min-h-screen flex flex-col bg-[#121212] text-white">
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-16 text-center">
        <span className="text-xs tracking-[0.3em] text-white/30 uppercase font-light mb-8">
          Página em construção
        </span>

        <div
          className="mb-10 inline-flex h-20 w-20 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04]"
          aria-hidden
        >
          <HardHat className="h-10 w-10 text-white/55" strokeWidth={1.25} />
        </div>

        <h1 className="font-serif text-5xl md:text-7xl tracking-tighter mb-5">
          {titulo}
        </h1>
        <p className="text-white/45 max-w-md text-base md:text-lg font-light leading-relaxed mb-14">
          {subtitulo}
        </p>

        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs md:text-sm tracking-[0.2em] uppercase font-light text-white/60 hover:text-white transition-colors border-b border-white/15 hover:border-white/60 pb-1"
        >
          Voltar ao Grupo Costa
        </Link>
      </div>

      <footer className="py-8 px-6 border-t border-white/[0.06]">
        {atual ? (
          <div className="max-w-7xl mx-auto mb-10 text-center sm:text-left text-white/55">
            <GrupoCostaFooter atual={atual} />
          </div>
        ) : null}
        <div className="text-center">
          <p className="text-[9px] md:text-[10px] font-bold uppercase tracking-[0.35em] text-white/25 mb-2">
            Desenvolvido por
          </p>
          <a
            href="https://codly.space"
            target="_blank"
            rel="noopener noreferrer"
            className="text-base md:text-lg font-black text-white/45 hover:text-purple-400 transition-colors italic inline-block"
          >
            codly.space
          </a>
        </div>
      </footer>
    </main>
  );
}
