import JsonLd from "@/components/JsonLd";
import { PAGE_METADATA } from "@/lib/seo/config";
import { funerariaSchema } from "@/lib/schema";
import {
  whatsappLink,
  WHATSAPP_MESSAGES,
  WHATSAPP_FUNERARIA,
} from "@/lib/whatsapp";
import FunerariaExperience from "./FunerariaExperience";

export const metadata = PAGE_METADATA.funeraria;

export default function FunerariaPage() {
  return (
    <>
      <JsonLd data={funerariaSchema} />

      {/* Camada semântica para buscadores e leitores de tela: a experiência
          visual é fortemente tipográfica e animada, então o conteúdo em texto
          corrido vive aqui, completo e em ordem. */}
      <div className="sr-only">
        <h2>Funerária Costa — Taquari e Tabaí/RS</h2>
        <p>
          A Funerária Costa está há 30 anos no mercado, oferecendo serviços
          funerários com excelência, respeito e dedicação, com atendimento
          humanizado disponível 24 horas por dia, todos os dias da semana.
        </p>
        <p>
          Com matriz em Taquari e filial em Tabaí, nossa missão é proporcionar
          apoio e cuidado em momentos difíceis, garantindo homenagens dignas e
          personalizadas para os entes queridos.
        </p>
        <p>
          Contamos com uma ampla linha de serviços: translado com frota própria,
          preparação e organização do cerimonial, organização de velórios, apoio
          na obtenção de documentos, serviço de copa, coroas de flores e
          ornamentações.
        </p>
        <p>
          Nossas coroas: Crisântemos e Gérberas, Gérberas e Astromélias,
          Crisântemos, Rosas, Gérberas e Corbélias, montadas com flores naturais
          e fita personalizada de homenagem.
        </p>
        <p>
          A Funerária Costa disponibiliza também o Memorial Costa, uma capela
          acolhedora e preparada para proporcionar conforto e tranquilidade às
          famílias durante o cerimonial.
        </p>
        <p>
          O Grupo Costa disponibiliza o Memorial da Paz — Cemitério Ecumênico
          Luterano, um empreendimento ecumênico com um novo conceito de acolher
          a saudade, em um ambiente sereno para homenagens e despedidas.
        </p>
        <p>
          Memórias de 4 Patas é o serviço de cremação pet da Funerária Costa,
          com todo o amor e cuidado que o seu pet merece, para que as lembranças
          do seu companheiro sejam eternizadas.
        </p>
        <p>
          Matriz: Rua 14 de Julho, 30, em frente ao Hospital São José,
          Taquari/RS. Filial: Rua Vinte e Oito de Dezembro, 333, Tabaí/RS.
        </p>
        <p>
          Para acionar nosso atendimento imediato, ligue gratuitamente para o{" "}
          <a href="tel:08000004356">0800 000 4356</a>, disponível 24 horas por
          dia, todos os dias. Também atendemos pelo{" "}
          <a
            href={whatsappLink(WHATSAPP_MESSAGES.funeraria, WHATSAPP_FUNERARIA)}
          >
            WhatsApp (51) 98121-1131
          </a>
          .
        </p>
      </div>

      <FunerariaExperience />
    </>
  );
}
