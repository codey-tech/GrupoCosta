// Política de Privacidade do site institucional do Grupo Costa.
//
// FONTE: o que o próprio código coleta e transmite — formulário de adesão
// (`CheckoutModal` → `/api/solicitacao`), contato da clínica
// (`/api/contato-clinica`), banner de cookies, Google Analytics / Vercel
// Analytics e links `wa.me`. Controladora e endereço vêm de `src/lib/schema.js`.
// Canais de contato são os já usados no site. Nada aqui é inventado: sem DPO,
// sem e-mail exclusivo de privacidade, sem prazo de retenção.

export const POLITICA = {
  titulo: "Política de Privacidade",
  atualizadoEm: "17 de agosto de 2026",
  intro:
    "Esta política descreve quais dados pessoais o site grupocosta.online coleta, para que são usados e como você pode pedir acesso, correção ou exclusão. Ela vale para as páginas do Grupo Costa: Plano Costa, Centro Clínico Costa, Costa Ambulâncias, Funerária Costa e Memorial da Paz.",
  secoes: [
    {
      titulo: "Quem controla os dados",
      paragrafos: [
        "A controladora é a Costa Plano de Assistência Familiar e Empresarial Ltda, CNPJ 08.070.693/0001-09, com endereço na Rua Sete de Setembro, 2356, Centro, Taquari/RS, CEP 95860-000.",
        "O site reúne as unidades do Grupo Costa. Os dados enviados pelos formulários são tratados por essa empresa para atender a solicitação feita.",
      ],
    },
    {
      titulo: "Quais dados coletamos",
      paragrafos: [
        "Você não precisa criar conta para navegar. Coletamos dados pessoais quando você os envia ou quando aceita cookies de medição.",
        "Na solicitação de adesão ao Plano Costa: nome, CPF, data de nascimento, nome da mãe e do pai, e-mail, telefone, endereço (rua, número, bairro, cidade e UF), o plano escolhido e, se houver, os mesmos dados de dependentes.",
        "No formulário de contato do Centro Clínico Costa: nome, telefone e a mensagem que você escrever.",
        "Na navegação, se você aceitar cookies de medição: informações técnicas de uso do site (páginas visitadas, dispositivo, origem da visita e cidade aproximada), por meio do Google Analytics e do Vercel Analytics.",
        "Quando você clica em um botão de WhatsApp, a conversa acontece no aplicativo da Meta. O site só abre o link; o conteúdo da conversa não fica armazenado neste site.",
      ],
    },
    {
      titulo: "Para que usamos",
      paragrafos: [
        "Os dados da adesão servem para montar o contrato interno do plano e para a equipe entrar em contato, em geral pelo WhatsApp, e concluir o cadastro.",
        "Os dados do contato da clínica servem para retornar o pedido (agendamento ou informação).",
        "Os dados de medição, só se você aceitar, servem para entender como o site é usado e melhorar as páginas. Recusar não impede a navegação nem o envio dos formulários.",
      ],
    },
    {
      titulo: "Com quem compartilhamos",
      paragrafos: [
        "As solicitações de adesão e os contatos da clínica são gravados em banco hospedado na Supabase, para a equipe consultar no painel interno.",
        "Se você aceitar cookies de medição, o Google (Analytics) e a Vercel (Analytics) recebem dados de navegação.",
        "Se você clicar em WhatsApp, Instagram ou Facebook, passa a tratar com a Meta nesses serviços.",
        "Não vendemos dados pessoais. Não há pagamento online neste site: a adesão é uma ficha, não um checkout financeiro.",
      ],
    },
    {
      titulo: "Cookies",
      paragrafos: [
        "O site guarda no seu navegador a escolha do banner de cookies (aceitar ou recusar). Isso é necessário para lembrar a decisão.",
        "Cookies e ferramentas de medição de audiência só são carregados depois que você aceita. Você pode recusar no banner. Para mudar a escolha depois, limpe os dados deste site no navegador e recarregue a página.",
      ],
    },
    {
      titulo: "Seus direitos",
      paragrafos: [
        "Nos termos da Lei Geral de Proteção de Dados (Lei nº 13.709/2018), você pode pedir confirmação de tratamento, acesso, correção, anonimização, portabilidade, informação sobre compartilhamentos, oposição e exclusão dos dados que nos enviou, quando couber.",
        "Para exercer esses direitos, fale com a central pelo (51) 2129-4040 ou pelo WhatsApp do número geral do Grupo Costa. Em emergência, o 0800 000 4356 permanece disponível; pedidos de privacidade devem ir à central, não à linha de emergência.",
      ],
    },
    {
      titulo: "Dependentes e menores",
      paragrafos: [
        "A ficha de adesão permite incluir dependentes. Quem envia o formulário declara ter autorização para informar os dados dessas pessoas, inclusive de menores, quando for o caso.",
      ],
    },
    {
      titulo: "Atualizações",
      paragrafos: [
        "Se esta política mudar, a data no topo da página será atualizada. O uso do site após a alteração significa que a versão vigente passou a valer para aquele uso.",
      ],
    },
  ],
};
