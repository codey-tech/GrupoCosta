@AGENTS.md

# Grupo Costa — site institucional

Next.js 16 (App Router) + Tailwind v4 + GSAP/ScrollTrigger + Lenis. Site de um
grupo de Taquari/RS com cinco unidades: Plano, Centro Clínico, Ambulâncias,
Funerária e Memorial da Paz.

Trabalho de desenvolvimento acontece na branch **`develop`**. `main` é produção.

```bash
npm run dev     # localhost:3000
npm run build
npm run lint
```

---

## A regra que mais importa: não invente conteúdo

Este site é de um negócio real, em segmento sensível. **Nenhuma afirmação sobre
a empresa pode ser inventada** — nem tempo de resposta, nem quantidade de
atendimentos, nem certificação, nem ano de fundação.

Cada página tem uma fonte declarada no topo do seu `content.js`. Se a informação
não está lá, ela não entra. Se parecer que falta alguma coisa, **pergunte**.

Erros reais já cometidos aqui: "nada é terceirizado", "respondemos em minutos",
"desde 1995" na Funerária; indicadores fabricados no topo das Ambulâncias.
Nenhum existia.

**Corolário sobre formato:** um erro mais sutil é manter o texto e trocar o
formato de um jeito que o distorce. "Monitoramento cardíaco avançado, garantindo
acompanhamento dos sinais vitais em tempo real" virou a célula `Monitoramento |
Cardíaco` numa tabela — o dado sobreviveu, o sentido não. Se um texto não couber
num formato, **troque o formato, não o texto**.

---

## Contatos — cada unidade tem a sua regra

Não unifique. Estão separados de propósito, em `src/lib/whatsapp.js`.

| Unidade | Voz | WhatsApp |
|---|---|---|
| Funerária | `0800 000 4356` | `(51) 98121-1131` — **só WhatsApp, não atende ligação** |
| Ambulâncias | `0800 000 4356` (emergência) + `(51) 2129-4040` (suporte) | número geral |
| Plano | `(51) 2129-4040` (central) + `0800 000 4356` (emergência 24h) | número geral |
| Demais | — | `WHATSAPP_NUMBER` (`555121294040`) |

**Nunca coloque o 98121-1131 num `href="tel:"`.** Por isso o campo se chama
`whatsappNumero` e não tem href de voz.

**Endereços são diferentes por unidade.** Plano: Rua Sete de Setembro, 2356.
Ambulâncias: Tv. Quatro de Julho, 30. Funerária: Rua 14 de Julho, 30. Não
reaproveite.

---

## Cada página tem identidade própria

Não replique o layout de uma unidade em outra. São irmãs em qualidade, não em
forma.

**Referências visuais** de algumas páginas: [indigo-laboratory.it](https://indigo-laboratory.it),
[sohub.digital](https://sohub.digital), [noth.in](https://www.noth.in).

### Funerária (`/funeraria`) — pronta

Um **livro**: coluna centrada, seis capítulos numerados, trilho de progresso,
rótulos verticais nas margens, revelações longas (≈1s). Papel `#f1f0ec`, tinta
`#0c0c0b`, dourado `#a98850`. Display em **Fraunces 300** — serifada leve
carrega luto. Fonte: catálogo `Memórias e Homenagens` (jan/2025), de onde saíram
fotos e o vetor da pomba. `DoveFlight.jsx` leva a pomba pela página.

### Ambulâncias (`/ambulancias`) — pronta

**Full-bleed e fotográfica**: bandas de foto em tela cheia alternando com blocos
de texto, paralaxe, animações curtas (0,4–0,6s). Carvão `#0e1114`, laranja
`#f97316`, display em **Archivo**. Sem preloader — cortina em página de
emergência é o oposto do que ela precisa fazer.

**O monitor cardíaco (`PulseLine.jsx`)** fica só na abertura, atrás do conteúdo.
É um **canvas**, não CSS. A versão em SVG deslizando de lado foi rejeitada por
parecer morta, e os três motivos valem para qualquer "linha de ECG" em CSS:

1. Linha inteira acesa com o mesmo brilho. Monitor de verdade tem um **feixe**
   que desenha e um rastro que apaga atrás dele; sem decaimento não há para
   onde o olho ir.
2. Batidas idênticas em intervalo perfeito. Coração não é metrônomo — aqui o
   intervalo respira (arritmia sinusal) e varia a cada batida.
3. O pico do R não era um **evento**. Agora o brilho da cabeça acompanha a
   amplitude, e o R estala.

Detalhes que custaram depuração:

- O rastro decai por `destination-out`, que **remove alfa sem pintar fundo** —
  é o que deixa a foto do hero aparecer por baixo.
- O alfa do decaimento vem de `dt` (`1 - exp(-dt/τ)`), nunca uma constante por
  quadro: com constante, o rastro dura o dobro a 120 Hz e some a 30 Hz.
- O estado do feixe (`x`, `yAnterior`) é declarado **antes** de `dimensionar`,
  que zera os dois. Com `let` embaixo, a primeira chamada caía na zona morta
  temporal e a página explodia inteira.
- A opacidade no chamador subiu de `0.18` para `0.5`: com o rastro decaindo, a
  média de tinta na tela é muito menor que a da onda antiga, e em 0.18 o
  estalo do R não aparecia.

### Plano (`/plano`) — pronta

A única página que **vende**: preço, comparação e checkout. Base **clara**
(`#fafafa`/slate-50/white) com blocos escuros pontuais, roxo como acento, vídeo
de família na abertura (`/hero.mp4`).

Duas tentativas de redesenho foram rejeitadas antes desta — ambas escuras do
início ao fim e paradas demais. **O calor e o movimento não são enfeite aqui:**
plano de saúde se vende com família e cor, não com grade preta. Se for mexer,
preserve o vídeo, o empilhamento dos benefícios e a alternância claro/escuro.

Componentes: `StackBeneficios.jsx` (pin + empilhamento no desktop, cascata
simples no celular), `CardPlano.jsx`, `CheckoutModal` (espera `name` e
`maxDependents` — a tradução do português acontece na fronteira, em
`PlanoExperience`).

### Home (`/`) — pronta

**Uma tela só. Não rola. É navegação, e nada além disso.**

A tela é partida por uma **costura diagonal dourada**: SAÚDE em luz (Plano,
Centro Clínico, Ambulâncias), LUTO em sombra (Funerária, Memorial). A divisão
é a própria interação — ao apontar para um lado, ele avança sobre o outro, a
costura desliza e o lado recuado **encolhe em `scale`**. Cada nome usa a fonte
da página de destino e acende no acento dela; escolher inunda a tela com essa
cor e só então navega.

Por que dois territórios e não cinco itens soltos: quem procura plano de saúde
não pode cair sem aviso na funerária, e quem acabou de perder alguém não
deveria atravessar publicidade de consultas para achar o telefone.

**Três tentativas foram rejeitadas antes desta** — faixas de identidade, cinco
nomes gigantes com foto trocando no hover, e a mesma abertura com conteúdo
institucional rolando abaixo. O veredito foi sempre "genérico". Se for mexer,
**não devolva a rolagem** e não transforme isto num menu de cartões.

Detalhes que não são estéticos:

- Os recortes usam `clip-path` com o **mesmo número de vértices** nos dois
  lados. É o que deixa o browser interpolar numa transição de CSS pura — sem
  GSAP, sem WebGL e sem um único `requestAnimationFrame`. Depois de três
  versões cheias de bug, a simplicidade aqui é decisão, não preguiça.
- Há **duas fórmulas de recorte**, horizontal e vertical, trocadas por
  `matchMedia("(max-width: 1023px)")` — que precisa bater com o `lg:` do
  Tailwind no layout do conteúdo. Se as duas se desencontrarem, o conteúdo
  vira coluna enquanto o recorte segue diagonal, e a tela quebra.
- No celular a costura **não desliza**: sem ponteiro não existe "inclinar-se",
  e esconder metade seria esconder metade do grupo.
- Os acentos do lado claro são um grau mais fechados que os das páginas, porque
  ali pousam sobre papel e não sobre carvão.
- O 0800 fica fora dos dois territórios, sempre visível, em
  `mix-blend-difference` para atravessar claro e escuro.
- A camada `sr-only` em `page.jsx` carrega as cinco unidades em texto: as
  frases só existem em `:hover`, e buscador nenhum passa o ponteiro.

Conteúdo em `src/app/home-content.js`. As fotos em `/public/home` estão em
**1760×990**.

### Demais rotas

`/centro-clinico`, `/painel` — anteriores, estilo antigo.
`/memorial` — só `EmConstrucao`.
`/memorias-4-patas` — **não existe e é linkada** pela Funerária → 404.

---

## Armadilhas já pagas

Cada item custou depuração. Leia antes de mexer em animação ou CSS.

### CSS

**Classes utilitárias em `@layer components`.** Toda classe `.fc-*` / `.amb-*` /
`.pl-*` vive dentro de `@layer components` no `globals.css`. Fora de camada elas
entram depois dos utilitários do Tailwind e, com a mesma especificidade, ganham
por ordem de origem: `.fc-mask { display: block }` anulava `md:hidden` e as duas
versões do logotipo apareciam empilhadas.

**`overflow-x-clip`, nunca `overflow-x-hidden`.** `hidden` faz o browser computar
`overflow-y: auto`, o que transforma o elemento em contêiner de rolagem e **mata
todo `position: sticky` lá dentro**.

**Cache de CSS do dev server.** O Turbopack às vezes serve CSS obsoleto. Force
com uma alteração real no arquivo ou reinicie o dev. Se algo "não fez efeito",
verifique isso antes de refazer o trabalho.

**Link em `flex` é largo como a linha inteira.** Um `<a className="flex ...">`
é flex de **nível de bloco** e ocupa 100% da largura, mesmo com o texto
ocupando um terço. Na home viraram cinco faixas invisíveis empilhadas cobrindo
a tela: o fundo trocava ao mover o ponteiro em qualquer lugar e um clique no
vazio à direita levava para dentro de uma unidade. Use `w-fit`.

**Coluna que estreita quebra nome em duas linhas.** Na home, "Centro Clínico
Costa" partia ao meio quando o território recuava para 35% da tela. Encolher
por `scale` resolve sem refluxo e ainda diz a coisa certa; `whitespace-nowrap`
sozinho só empurra o texto para fora da caixa.

### R3F / WebGL

**`alpha: false` no `<Canvas>` mata qualquer fallback por baixo.** O canvas
fica opaco e pinta por cima da camada de `<Image>` durante todo o carregamento
das texturas — e para sempre, se uma falhar. Era a "tela cinza" da home. Use
`alpha: true` sempre que houver imagem de fallback embaixo.

**`useLoader` suspende.** Sem um `<Suspense>` **dentro** do `<Canvas>`, a
suspensão sobe e apaga a árvore inteira enquanto as texturas baixam.

**Capacidade de WebGL não se descobre em `useEffect`.** É síncrona e não muda:
use inicializador preguiçoso do `useState`. O React 19 acusa `setState` em
efeito como render em cascata, e o lint quebra.

### GSAP / ScrollTrigger

**Nunca ponha estado nas dependências do `useGSAP` quando houver pin.** O efeito
roda de novo e registra um **segundo pin** sobre a mesma seção; os pin-spacers
somam e o trecho de rolagem dobra. Use `useRef` + callback.

**`end` com percentual em seção com pin compõe a cada refresh.** `"+=120%"` é
resolvido contra o pin-spacer que o próprio pin criou. Use função ancorada na
viewport: `end: () => "+=" + window.innerHeight * 1.15`.

**Contadores vêm do progresso do ScrollTrigger**, não de um objeto interpolado
sob `scrub` — o proxy tem vida própria e dessincroniza.

**`toggleActions: "play none none reverse"`** em tudo que revela por rolagem. O
padrão toca uma vez e quem volta ao topo encontra tudo estático.

**Anime só com a aba visível.** Em aba de fundo o `requestAnimationFrame`
congela e um `gsap.from` trava no estado inicial — quem abre o link vindo do
WhatsApp encontra a tela em branco.

**`gsap.matchMedia()` não é revertido pelo contexto do `useGSAP`.** Chame
`mm.revert()` na limpeza.

**Ids de seção são carga estrutural.** As rotas da pomba e do ECG ancoram por
`getElementById`. A seção do hero da Funerária não tinha `id="hero"` e o voo
inteiro andava deslocado.

### JSX

Comentário `//` **dentro** de uma tag de abertura JSX é frágil. Use `{/* */}`
acima do elemento.

---

## A pomba (Funerária)

O `d` em `Brand.jsx` **veio do vetor original** do catálogo, convertido com
`pdftocairo -svg`. **Não substitua por aproximação:** duas tentativas de
redesenhar de olho falharam, porque a capa mostra a pomba *sangrada* e a
silhueta recortada lê como uma cadeia de morros.

**Não anime as asas por transformação do contorno.** Já foi tentado e removido —
girar trechos do path abre e fecha o "V" como uma tesoura. Asa de verdade muda
de silhueta ao longo do ciclo; isso exige quadros desenhados ou um modelo com
rig. Se for retomar, comece por um asset animado de verdade.

Falta o **vetor do logotipo completo** (lockup + pomba) — peça ao cliente.

---

## Convenções

- **Português nos comentários e nos nomes de domínio.** Nomes técnicos seguem
  inglês.
- **Comentário explica o porquê.** Vários registram uma armadilha específica —
  não os apague ao refatorar; são o motivo de o código estar daquele jeito.
- **Conteúdo em `content.js`**, separado do componente, com a fonte no topo.
- **Camada `sr-only` em toda página nova**, com o conteúdo em texto corrido, na
  ordem das seções.
- **SEO** em `src/lib/seo/config.js` e `src/lib/schema.js`. Rota nova precisa de
  entrada nos dois.
- **`prefers-reduced-motion`** respeitado em tudo.
- **Imagens** em `next/image` com `sizes` correspondente à largura real.

---

## Pendências conhecidas

- `/memorias-4-patas` não existe e é linkada → 404.
- `/memorial` é só placeholder.
- `/centro-clinico` e `/painel` seguem no estilo antigo.
- Falta o vetor do logotipo completo da Funerária.
- Não há foto aprovada do Memórias de 4 Patas.
- **Preços do Plano precisam de confirmação comercial** antes de qualquer
  publicação: mensalidades, taxa de adesão, limites de dependentes e valores de
  auxílio funeral foram copiados da versão anterior, mas não conferidos com o
  cliente.
- As peças editoriais (`Mark`, `Gutter`, `Rule`, `MaskLine`) estão duplicadas
  entre Funerária e Ambulâncias, de propósito. **Na terceira página nesse
  sistema, extraia.**
