import Link from "next/link";

const UNIDADES = [
  { href: "/plano", nome: "Plano Costa" },
  { href: "/centro-clinico", nome: "Centro Clínico Costa" },
  { href: "/ambulancias", nome: "Costa Ambulâncias" },
  { href: "/funeraria", nome: "Funerária Costa" },
  { href: "/memorial", nome: "Memorial da Paz" },
];

/**
 * Bloco de navegação entre as unidades do Grupo Costa.
 * Presente em todas as rotas — é o que dá hierarquia ao site para o Google.
 * @param {{ atual?: string, className?: string }} props - rota atual, ex: "/plano"
 */
export default function GrupoCostaFooter({ atual, className = "" }) {
  return (
    <nav
      aria-label="Unidades do Grupo Costa"
      className={`w-full ${className}`.trim()}
    >
      <p className="text-[10px] md:text-xs font-light tracking-wide mb-4">
        Faz parte do{" "}
        <Link href="/" className="font-semibold underline-offset-2 hover:underline">
          Grupo Costa
        </Link>
      </p>
      <ul className="flex flex-wrap gap-x-5 gap-y-2 text-xs md:text-sm font-light">
        {UNIDADES.map(({ href, nome }) => (
          <li key={href}>
            {href === atual ? (
              <span aria-current="page" className="font-semibold opacity-90">
                {nome}
              </span>
            ) : (
              <Link
                href={href}
                className="opacity-70 hover:opacity-100 underline-offset-2 hover:underline transition-opacity"
              >
                {nome}
              </Link>
            )}
          </li>
        ))}
      </ul>
      <p className="mt-4 text-[10px] md:text-xs font-light tracking-wide">
        <Link
          href="/politica-de-privacidade"
          className="opacity-70 underline-offset-2 hover:opacity-100 hover:underline"
        >
          Política de privacidade
        </Link>
      </p>
      <p className="mt-3 text-[10px] md:text-xs font-light tracking-wide opacity-70">
        Costa Assistencial Ltda · CNPJ 25.529.733/0001-49
      </p>
    </nav>
  );
}
