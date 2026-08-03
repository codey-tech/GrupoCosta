import JsonLd from "@/components/JsonLd";
import { organizationSchema } from "@/lib/schema";
import HomeExperience from "./HomeExperience";
import { UNIDADES, EMERGENCIA } from "./home-content";

/**
 * Camada semântica.
 *
 * A home visível é uma tela de navegação: os nomes das unidades aparecem, mas
 * as frases só existem em `:hover`, e buscador nenhum passa o ponteiro. Por
 * isso o texto corrido, com um cabeçalho por unidade, precisa viver aqui.
 *
 * Os metadados ficam em `layout.js` (`PAGE_METADATA.home`).
 */
export default function Home() {
  return (
    <>
      <JsonLd data={organizationSchema} />

      <div className="sr-only">
        <h1>Grupo Costa — Saúde e Serviços Funerários em Taquari/RS</h1>
        <p>
          O Grupo Costa reúne cinco frentes em Taquari e região: assistência
          familiar, atendimento clínico, remoções e transporte de pacientes,
          serviços funerários e cemitério. Emergência 24 horas:{" "}
          <a href={EMERGENCIA.href}>{EMERGENCIA.numero}</a>.
        </p>

        {UNIDADES.map((u) => (
          <div key={u.id}>
            <h2>{u.nome}</h2>
            <p>{u.frase}</p>
            <p>
              <a href={u.href}>Acessar {u.nome}</a>
            </p>
          </div>
        ))}
      </div>

      <HomeExperience />
    </>
  );
}
