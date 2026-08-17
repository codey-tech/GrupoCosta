import Link from "next/link";
import { PAGE_METADATA } from "@/lib/seo/config";
import { POLITICA } from "./content";

export const metadata = PAGE_METADATA.privacidade;

export default function PoliticaDePrivacidadePage() {
  return (
    <main className="min-h-dvh bg-[#f7f6f3] text-[#14100c] font-[family-name:var(--font-geist-sans)]">
      <article className="mx-auto max-w-2xl px-6 py-16 md:py-24">
        <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-[#14100c]/45">
          Grupo Costa
        </p>
        <h1 className="mt-4 text-3xl font-semibold tracking-tight md:text-4xl">
          {POLITICA.titulo}
        </h1>
        <p className="mt-3 text-sm text-[#14100c]/50">
          Atualizada em {POLITICA.atualizadoEm}
        </p>
        <p className="mt-8 text-[15px] leading-relaxed text-[#14100c]/80 md:text-base">
          {POLITICA.intro}
        </p>

        {POLITICA.secoes.map((secao) => (
          <section key={secao.titulo} className="mt-10">
            <h2 className="text-lg font-semibold tracking-tight">
              {secao.titulo}
            </h2>
            {secao.paragrafos.map((p) => (
              <p
                key={p}
                className="mt-3 text-[15px] leading-relaxed text-[#14100c]/75 md:text-base"
              >
                {p}
              </p>
            ))}
          </section>
        ))}

        <p className="mt-14">
          <Link
            href="/"
            className="text-sm font-medium text-[#14100c]/55 underline-offset-4 hover:text-[#14100c] hover:underline"
          >
            ← Voltar ao Grupo Costa
          </Link>
        </p>
      </article>
    </main>
  );
}
