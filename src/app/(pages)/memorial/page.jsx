import EmConstrucao from "../../components/EmConstrucao";
import JsonLd from "@/components/JsonLd";
import { PAGE_METADATA } from "@/lib/seo/config";
import { memorialJsonLd } from "@/lib/seo/jsonld";

export const metadata = PAGE_METADATA.memorial;

export default function MemorialPage() {
  return (
    <>
      <JsonLd data={memorialJsonLd()} />
      <div className="sr-only">
        <p>
          O Memorial da Paz, do Grupo Costa, é um espaço de respeito e memória em
          Taquari/RS, dedicado a acolher famílias em momentos de despedida com
          serenidade e cuidado.
        </p>
        <p>
          Localizado na região de Taquari, o memorial integra os serviços
          funerários do Grupo Costa, ao lado da Funerária Costa, oferecendo um
          ambiente digno para homenagens e recordações.
        </p>
        <p>
          Para informações sobre o memorial e serviços relacionados, entre em
          contato com a Funerária Costa pelo{" "}
          <a href="tel:+555136533045">(51) 3653-3045</a> ou pelo{" "}
          <a href="https://wa.me/555136533045">WhatsApp</a>.
        </p>
      </div>
      <EmConstrucao
        titulo="Memorial da Paz"
        subtitulo="Em breve você poderá conhecer nosso memorial e serviços. Aguarde."
      />
    </>
  );
}
