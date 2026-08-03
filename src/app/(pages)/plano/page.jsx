import { whatsappLink, WHATSAPP_MESSAGES } from "@/lib/whatsapp";
import PlanoExperience from "./PlanoExperience";
import {
  CONTATO,
  ENDERECO,
  TAXA_ADESAO,
  PLANOS,
  BENEFICIOS,
  REDE_CIDADES,
  REDE_CATEGORIAS,
  FAQS,
} from "./content";

/**
 * Camada semântica: a experiência é fortemente animada (vídeo na abertura,
 * cartões empilhando com pin, cartões de plano em perspectiva). Este bloco
 * `sr-only` traz o mesmo conteúdo em texto corrido, na ordem das seções, para
 * buscadores e leitores de tela.
 *
 * O JSON-LD (`planoSchema` e `planoFaqSchema`) fica no `layout.jsx`.
 */
export default function PlanoPage() {
  return (
    <>
      <div className="sr-only">
        <h1>Plano Costa — Assistência Familiar em Taquari/RS</h1>
        <p>
          Planos assistenciais acessíveis e completos, com cobertura que vai
          além do essencial. Central de atendimento{" "}
          <a href={CONTATO.centralHref}>{CONTATO.central}</a> e emergência 24
          horas <a href={CONTATO.emergenciaHref}>{CONTATO.emergencia}</a>.
        </p>

        <h2>Benefícios</h2>
        {BENEFICIOS.map((b) => (
          <div key={b.titulo}>
            <h3>{b.titulo}</h3>
            <ul>
              {b.itens.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        ))}

        <h2>Rede de convênios</h2>
        <p>
          Conexão direta com as principais instituições e profissionais de saúde
          da região. Área de abrangência: {REDE_CIDADES.join(", ")}.
        </p>
        {REDE_CATEGORIAS.map((cat) => (
          <div key={cat.id}>
            <h3>{cat.titulo}</h3>
            <p>{cat.resumo}</p>
            <ul>
              {cat.itens.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        ))}

        <h2>Planos familiares</h2>
        <p>
          Taxa de adesão de {TAXA_ADESAO.valor} + proporcional ao mês na
          abertura.
        </p>
        {PLANOS.map((p) => (
          <div key={p.id}>
            <h3>
              Plano {p.nome} — R$ {p.preco} por mês
            </h3>
            <p>{p.resumo}</p>
            <ul>
              <li>
                {p.comparaveis.pessoas} pessoas — {p.comparaveis.pessoasDetalhe}
              </li>
              <li>
                {p.comparaveis.rede} — {p.comparaveis.redeDetalhe}
              </li>
              <li>
                {p.comparaveis.ambulancia} — {p.comparaveis.ambulanciaDetalhe}
              </li>
              <li>Auxílio funeral: {p.comparaveis.funeral}</li>
            </ul>
          </div>
        ))}

        <h2>Dúvidas frequentes</h2>
        {FAQS.map((f) => (
          <div key={f.p}>
            <h3>{f.p}</h3>
            <p>{f.r}</p>
          </div>
        ))}

        <h2>Contato</h2>
        <p>
          {ENDERECO.rua}, {ENDERECO.bairro}. Suporte e WhatsApp{" "}
          <a href={CONTATO.centralHref}>{CONTATO.central}</a>, emergências 24
          horas <a href={CONTATO.emergenciaHref}>{CONTATO.emergencia}</a> ou pelo{" "}
          <a href={whatsappLink(WHATSAPP_MESSAGES.plano)}>WhatsApp</a>.
        </p>
      </div>

      <PlanoExperience />
    </>
  );
}
