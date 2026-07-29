"use client";

import { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { DOVE_PATH, DOVE_VIEWBOX } from "./Brand";

gsap.registerPlugin(ScrollTrigger);

/**
 * A pomba da marca sobrevoando a página.
 *
 * Camada fixa, acima dos fundos das seções e abaixo da barra superior. Usa
 * `mix-blend-mode: difference` — mesma solução do cabeçalho e do trilho: assim
 * ela é legível tanto sobre o papel quanto sobre os capítulos escuros, sem
 * precisar de duas versões de cor.
 *
 * A rota NÃO é medida em fração do documento inteiro, e sim ancorada nas
 * seções: cada ponto diz "quando o capítulo X estiver em tal altura, a pomba
 * está aqui". Se o conteúdo crescer ou encolher, o voo continua batendo com a
 * leitura.
 *
 * SOBRE BATER ASA: já foi tentado e removido. O `d` desta pomba é o logotipo —
 * uma silhueta chapada, de frente, desenhada para ficar parada. Girar trechos
 * do contorno abre e fecha o "V" como uma tesoura; não vira voo, porque asa de
 * verdade muda de silhueta ao longo do ciclo (encurta no alto e no fim da
 * descida). Isso exige quadros desenhados ou um modelo com esqueleto, não
 * transformação do contorno. Se for retomar, comece por um asset animado de
 * verdade — não por mais transformação procedural deste path.
 *
 * Só monta em telas largas e com movimento permitido. Em celular a pomba
 * passaria por cima do texto numa área pequena demais — lá ficam as marcas
 * d'água estáticas.
 */

/**
 * Rota do voo.
 *
 * `id`  — seção âncora
 * `at`  — posição dentro dela (0 = topo, 1 = base)
 * `x/y` — centro da pomba em fração da viewport (pode passar de 0–1 para sair de cena)
 * `s`   — escala   `r` — inclinação em graus, sempre relativa ao sentido do voo
 * `o`   — opacidade
 * `fx`  — para onde ela olha: 1 = bico à esquerda, -1 = espelhada, bico à direita
 *
 * SAI E VOLTA PELO MESMO LADO. Ela sai de cena por uma borda, permanece fora
 * dali, se vira, e reaparece pela mesma borda. Antes ela sumia à esquerda e
 * ressurgia à direita: funcionava mecanicamente, mas não era um voo — era um
 * corte de cena. Os pontos com `o: 0` são justamente o tempo em que ela está
 * fora do quadro dando a volta.
 *
 * O ESPELHAMENTO NÃO É ENFEITE. O bico do vetor aponta para a esquerda; sem
 * inverter, o trecho em que ela cruza para a direita seria voo de ré. A troca
 * de `fx` acontece sempre num ponto invisível, então a passagem pelo perfil
 * (onde a silhueta fica de lado, quase uma linha) nunca aparece.
 *
 * A ESCALA TEM PISO. Havia aqui uma segunda forma, um chevron que representava
 * a ave vista de longe — e um piso de 0,16 de escala junto com ela. Nenhum dos
 * dois funcionou: o chevron não lia como pássaro nenhum, e nesse tamanho a
 * pomba vira um respingo. Abaixo de ~0,3 a silhueta perde bico e cauda e deixa
 * de ser reconhecível. Distância se resolve com opacidade e traço fino, não
 * encolhendo até sumir.
 */
const ROTA = [
  { id: "hero", at: 0.3, x: 0.76, y: 0.3, s: 1.0, r: -6, o: 0.16, fx: 1 },
  { id: "hero", at: 1.0, x: 0.54, y: 0.54, s: 0.8, r: 5, o: 0.14, fx: 1 },
  { id: "funeraria", at: 0.55, x: 0.16, y: 0.66, s: 0.55, r: 11, o: 0.12, fx: 1 },
  // sai pela ESQUERDA
  { id: "cuidado", at: 0.12, x: -0.32, y: 0.8, s: 0.42, r: 15, o: 0, fx: 1 },
  // continua fora de cena do MESMO lado, sobe e se vira
  { id: "cuidado", at: 0.8, x: -0.45, y: 0.32, s: 0.42, r: 6, o: 0, fx: -1 },
  // reaparece pela ESQUERDA, já dentro do quadro
  { id: "coroas", at: 0.15, x: 0.07, y: 0.22, s: 0.46, r: 4, o: 0.14, fx: -1 },
  { id: "coroas", at: 0.75, x: 0.36, y: 0.17, s: 0.5, r: 2, o: 0.14, fx: -1 },
  // atravessa a Estrutura da esquerda para a direita
  { id: "estrutura", at: 0.32, x: 0.56, y: 0.21, s: 0.52, r: -2, o: 0.13, fx: -1 },
  { id: "estrutura", at: 0.7, x: 0.86, y: 0.35, s: 0.58, r: -7, o: 0.13, fx: -1 },
  // sai pela DIREITA
  { id: "estrutura", at: 1.0, x: 1.32, y: 0.47, s: 0.62, r: -11, o: 0, fx: -1 },
  // continua fora de cena do MESMO lado, desce e se vira
  { id: "memoriais", at: 0.25, x: 1.36, y: 0.7, s: 0.48, r: -7, o: 0, fx: 1 },
  // reaparece pela DIREITA
  { id: "memoriais", at: 0.78, x: 0.86, y: 0.74, s: 0.52, r: -4, o: 0.12, fx: 1 },
  // pousa grande sobre a contagem dos anos
  { id: "legado", at: 0.45, x: 0.73, y: 0.46, s: 1.15, r: -2, o: 0.15, fx: 1 },
  { id: "contato", at: 0.35, x: 0.8, y: 0.64, s: 0.95, r: 3, o: 0.2, fx: 1 },
  { id: "contato", at: 1.0, x: 0.9, y: 0.82, s: 0.82, r: 7, o: 0.16, fx: 1 },
];

/** Largura de referência da pomba em escala 1. */
const BASE = 430;

const lerp = (a, b, t) => a + (b - a) * t;
/** Suaviza a passagem entre dois pontos, para o voo não ter quinas. */
const suave = (t) => t * t * (3 - 2 * t);

export default function DoveFlight() {
  const alvo = useRef(null);
  const traco = useRef(null);

  useEffect(() => {
    const mm = gsap.matchMedia();

    mm.add(
      {
        largo: "(min-width: 1024px)",
        movimento: "(prefers-reduced-motion: no-preference)",
      },
      (ctx) => {
        const { largo, movimento } = ctx.conditions;
        if (!largo || !movimento) return;

        const el = alvo.current;
        const path = traco.current;
        if (!el || !path) return;

        // O ponto da rota é o centro da ave, não o canto superior esquerdo.
        // Precisa ser gsap.set e não CSS: assim que o primeiro `x` for aplicado,
        // uma transform escrita à mão seria sobrescrita.
        gsap.set(el, { xPercent: -50, yPercent: -50, opacity: 0 });

        // Pontos da rota com a posição absoluta de rolagem já resolvida.
        const pontos = ROTA.map((p) => ({ ...p, sy: 0 }));

        const medir = () => {
          pontos.forEach((p) => {
            const sec = document.getElementById(p.id);
            if (!sec) return;
            const r = sec.getBoundingClientRect();
            p.sy = r.top + window.scrollY + r.height * p.at;
          });
        };
        medir();
        ScrollTrigger.addEventListener("refresh", medir);

        // quickTo dá um atraso curto entre a rolagem e a pomba: ela chega um
        // instante depois, como algo que plana em vez de estar grudado no scroll.
        const qx = gsap.quickTo(el, "x", { duration: 0.7, ease: "power3.out" });
        const qy = gsap.quickTo(el, "y", { duration: 0.7, ease: "power3.out" });
        // scaleX e scaleY separados: o X carrega o espelhamento junto da escala.
        const qsx = gsap.quickTo(el, "scaleX", { duration: 0.9, ease: "power3.out" });
        const qsy = gsap.quickTo(el, "scaleY", { duration: 0.9, ease: "power3.out" });
        const qr = gsap.quickTo(el, "rotation", { duration: 1.1, ease: "power3.out" });
        const qo = gsap.quickTo(el, "opacity", { duration: 0.5, ease: "power2.out" });

        // ---- Entrada -------------------------------------------------------
        // No topo da página não existe rolagem para dar entrada nenhuma: a
        // primeira pose já é o começo da rota. Então a chegada é um DESLOCAMENTO
        // que decai, somado à pose que a rolagem pede — e não uma animação
        // separada. Assim, se a pessoa rolar durante a entrada, os dois não
        // brigam: a base já está no lugar certo e só o desvio se dissolve.
        //
        // `p` vai de 1 (fora da página, no alto à direita) a 0 (na rota).
        const entrada = { p: 1 };
        const tlEntrada = gsap.to(entrada, {
          p: 0,
          duration: 2.9,
          ease: "power2.inOut",
          delay: 2.4, // espera a cortina do preloader subir
        });

        const quadro = () => {
          const vh = window.innerHeight;
          const vw = window.innerWidth;
          // Referência: o meio da tela. É o ponto que o leitor está olhando.
          const s = window.scrollY + vh * 0.5;

          let i = 0;
          while (i < pontos.length - 2 && s > pontos[i + 1].sy) i++;
          const a = pontos[i];
          const b = pontos[i + 1] ?? a;
          const span = b.sy - a.sy;
          const t = span > 0 ? suave(gsap.utils.clamp(0, 1, (s - a.sy) / span)) : 0;

          // Respiração lenta somada à posição, para não ficar parada quando a
          // rolagem para.
          const tempo = performance.now() / 1000;
          const bob = Math.sin(tempo * 0.5) * 9;
          const tilt = Math.sin(tempo * 0.33) * 1.6;

          const escala = lerp(a.s, b.s, t);
          // Interpola entre 1 e -1: a virada acontece sempre com opacidade 0.
          const olhar = lerp(a.fx, b.fx, t);
          const sentido = olhar < 0 ? -1 : 1;

          // Desvio da entrada: vem de fora da borda direita, mais alta e
          // menor — como algo que se aproxima de longe — e vai assentando.
          const e = entrada.p;
          const menor = 1 - e * 0.45;

          qx(lerp(a.x, b.x, t) * vw + e * vw * 0.85);
          qy(lerp(a.y, b.y, t) * vh + bob - e * vh * 0.22);
          qsx(escala * menor * olhar);
          qsy(escala * menor);
          // A inclinação é escrita em relação ao sentido do voo; quando ela
          // está espelhada, o giro precisa acompanhar, senão banca para o lado
          // errado da curva.
          qr((lerp(a.r, b.r, t) + tilt - e * 9) * sentido);
          qo(lerp(a.o, b.o, t) * (1 - e));

          // Traço mais fino quando distante, mais presente quando perto. É isto
          // — junto com a opacidade — que dá a sensação de distância, já que a
          // escala não pode encolher a ponto de descaracterizar a silhueta.
          path.setAttribute(
            "stroke-width",
            String(gsap.utils.clamp(1.0, 2.6, 0.55 + escala * 1.8))
          );
        };

        gsap.ticker.add(quadro);

        return () => {
          gsap.ticker.remove(quadro);
          ScrollTrigger.removeEventListener("refresh", medir);
          tlEntrada.kill();
        };
      }
    );

    return () => mm.revert();
  }, []);

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-30 hidden lg:block mix-blend-difference"
    >
      {/* A transformação vai no <div>, não no <svg>: elemento HTML tem
          comportamento previsível de transform em todos os navegadores. */}
      <div
        ref={alvo}
        className="absolute left-0 top-0 opacity-0"
        style={{ width: BASE, willChange: "transform, opacity" }}
      >
        <svg viewBox={DOVE_VIEWBOX} fill="none" className="w-full h-auto block">
          <path
            ref={traco}
            d={DOVE_PATH}
            stroke="#ffffff"
            strokeWidth={2.4}
            strokeLinecap="round"
            strokeLinejoin="round"
            vectorEffect="non-scaling-stroke"
          />
        </svg>
      </div>
    </div>
  );
}
