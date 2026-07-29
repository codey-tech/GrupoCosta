import JsonLd from "@/components/JsonLd";
import { PAGE_METADATA } from "@/lib/seo/config";
import { ambulanciasSchema } from "@/lib/schema";
import { whatsappLink, WHATSAPP_MESSAGES } from "@/lib/whatsapp";
import AmbulanciasExperience from "./AmbulanciasExperience";

export const metadata = PAGE_METADATA.ambulancias;

export default function AmbulanciasPage() {
  return (
    <>
      <JsonLd data={ambulanciasSchema} />

      {/* Camada semântica para buscadores e leitores de tela: a experiência
          visual é fortemente tipográfica e animada, então o conteúdo em texto
          corrido vive aqui, completo e em ordem. */}
      <div className="sr-only">
        <h2>Costa Ambulâncias — Taquari/RS e região</h2>
        <p>
          Há anos, a Costa Ambulâncias atua com excelência no transporte de
          pacientes e atendimento emergencial, oferecendo serviços que aliam
          rapidez, segurança e cuidado. Com uma frota moderna, profissionais
          capacitados e uma rede de atendimento abrangente, estamos sempre
          prontos para garantir o melhor suporte nos momentos em que mais
          importa.
        </p>
        <p>
          Nossos serviços: transporte de pacientes em situações de urgência e
          emergência, atendimento emergencial 24 horas, cobertura de eventos de
          pequeno e grande porte e locação de ambulâncias equipadas.
        </p>
        <p>
          Com uma frota em operação, incluindo as 4 novas unidades
          recém-adquiridas, garantimos um atendimento rápido e eficiente para
          qualquer emergência. Nossas ambulâncias estão equipadas com
          monitoramento cardíaco avançado, garantindo um acompanhamento completo
          dos sinais vitais dos pacientes em tempo real, e todas as unidades
          possuem sistemas de climatização.
        </p>
        <p>
          Nossa base operacional fica na Tv. Quatro de Julho, 30 — Centro,
          Taquari/RS, CEP 95860-000.
        </p>
        <p>
          Para emergências, ligue gratuitamente para{" "}
          <a href="tel:08000004356">0800 000 4356</a>, disponível 24 horas por
          dia. Para assuntos administrativos, fale com o suporte pelo{" "}
          <a href="tel:+555121294040">(51) 2129-4040</a> ou pelo{" "}
          <a href={whatsappLink(WHATSAPP_MESSAGES.ambulancias)}>WhatsApp</a>.
        </p>
      </div>

      <AmbulanciasExperience />
    </>
  );
}
