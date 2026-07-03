import EmConstrucao from "../../components/EmConstrucao";
import JsonLd from "@/components/JsonLd";
import { PAGE_METADATA } from "@/lib/seo/config";
import { funerariaLocalBusinessJsonLd } from "@/lib/seo/jsonld";

export const metadata = PAGE_METADATA.funeraria;

export default function FunerariaPage() {
  return (
    <>
      <JsonLd data={funerariaLocalBusinessJsonLd()} />
      <div className="sr-only">
        <p>
          A Funerária Costa, em Taquari/RS, oferece serviços funerários completos
          com atendimento humanizado e disponível 24 horas por dia, todos os dias
          da semana. Nossa equipe acompanha a família em cada etapa, com respeito
          e discrição.
        </p>
        <p>
          Realizamos translado, organização de velório, coroas de flores naturais
          e assistência em Taquari, Tabaí, Triunfo e região. Estamos na Travessa
          4 de Julho, 30, Centro, Taquari/RS.
        </p>
        <p>
          Para acionar nosso atendimento imediato, ligue{" "}
          <a href="tel:+555136533045">(51) 3653-3045</a> ou fale conosco pelo{" "}
          <a href="https://wa.me/555136533045">WhatsApp</a>.
        </p>
      </div>
      <EmConstrucao
        titulo="Funerária Costa"
        subtitulo="Estamos preparando uma experiência digna e acolhedora. Em breve, novidades por aqui."
      />
    </>
  );
}
