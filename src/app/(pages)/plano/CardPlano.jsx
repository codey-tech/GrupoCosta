"use client";

import { Users, Map, Truck, Accessibility, ChevronRight } from "lucide-react";

/**
 * Cartão de um plano.
 *
 * O plano em destaque inverte para fundo escuro e sobe um pouco na grade —
 * é o que faz o olho parar nele sem precisar de selo gritando. O selo
 * "Mais escolhido" existe, mas é o segundo sinal, não o primeiro.
 *
 * Os quatro itens são sempre os mesmos e na mesma ordem nos três cartões:
 * é isso que permite comparar na horizontal mesmo sem uma tabela.
 *
 * @param {{ plano: object, onContratar: (plano: object) => void }} props
 */
export default function CardPlano({ plano, onContratar }) {
  const destaque = plano.destaque;
  const c = plano.comparaveis;

  const itens = [
    { Icone: Users, titulo: c.pessoas + " pessoas", detalhe: c.pessoasDetalhe },
    { Icone: Map, titulo: c.rede, detalhe: c.redeDetalhe },
    { Icone: Truck, titulo: c.ambulancia, detalhe: c.ambulanciaDetalhe },
    { Icone: Accessibility, titulo: "Auxílio funeral", detalhe: c.funeral },
  ];

  return (
    <article
      data-plano
      className={`relative flex h-full flex-col rounded-[2.5rem] p-8 lg:p-10 ${
        destaque
          ? "z-10 border border-slate-800 bg-slate-950 text-white shadow-2xl shadow-purple-900/30 lg:-my-8"
          : "border border-slate-200 bg-white text-slate-900 shadow-xl shadow-slate-200/50 transition-colors hover:border-purple-200"
      }`}
    >
      {destaque && (
        <span className="absolute -top-4 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-gradient-to-r from-purple-500 to-indigo-500 px-5 py-1.5 text-[10px] font-black uppercase tracking-widest text-white shadow-lg shadow-purple-500/40">
          Mais escolhido
        </span>
      )}

      <header className="mb-8">
        <h3
          className={`text-xl font-black tracking-tighter ${
            destaque ? "text-white" : "text-slate-900"
          }`}
        >
          Plano {plano.nome}
        </h3>
        <p
          className={`mt-2 min-h-[32px] text-xs font-medium leading-relaxed ${
            destaque ? "text-slate-400" : "text-slate-500"
          }`}
        >
          {plano.resumo}
        </p>
      </header>

      <p className="mb-8 flex items-end gap-1">
        <span className="mb-2 text-sm font-bold text-purple-500">R$</span>
        <span
          className={`text-6xl font-black leading-none tracking-tighter ${
            destaque ? "text-white" : "text-slate-900"
          }`}
        >
          {plano.preco}
        </span>
        <span
          className={`mb-1.5 ml-1 text-xs font-bold uppercase tracking-widest ${
            destaque ? "text-slate-500" : "text-slate-400"
          }`}
        >
          /mês
        </span>
      </p>

      <hr
        className={`mb-8 border-t ${
          destaque ? "border-slate-800" : "border-slate-100"
        }`}
      />

      <ul className="mb-12 flex-grow space-y-6">
        {itens.map(({ Icone, titulo, detalhe }) => (
          <li key={titulo} className="flex items-start gap-4">
            <Icone
              size={18}
              className={`mt-0.5 shrink-0 ${
                destaque ? "text-purple-400" : "text-purple-600"
              }`}
            />
            <div className="flex flex-col">
              <span
                className={`text-sm font-bold ${
                  destaque ? "text-slate-200" : "text-slate-800"
                }`}
              >
                {titulo}
              </span>
              <span className="mt-0.5 text-xs font-medium text-slate-500">
                {detalhe}
              </span>
            </div>
          </li>
        ))}
      </ul>

      <button
        type="button"
        onClick={() => onContratar(plano)}
        className={`group flex w-full items-center justify-center gap-2 rounded-2xl py-5 text-[10px] font-black uppercase tracking-[0.2em] transition-all duration-300 ${
          destaque
            ? "bg-purple-500 text-white hover:bg-purple-400 hover:shadow-lg hover:shadow-purple-500/25"
            : "border border-slate-200 bg-slate-50 text-slate-900 hover:border-slate-950 hover:bg-slate-950 hover:text-white"
        }`}
      >
        Contratar {plano.nome}
        <ChevronRight
          size={14}
          className="transition-transform group-hover:translate-x-1"
        />
      </button>
    </article>
  );
}
