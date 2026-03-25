import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const data = await request.json();
    const { titular, dependentes, plano, totalHoje } = data;

    // Formata a mensagem bonitinha que vai chegar para a equipe
    let mensagem = `🚨 **NOVA SOLICITAÇÃO DE PLANO!** 🚨\n`;
    mensagem += `**Plano Escolhido:** ${plano}\n`;
    mensagem += `**Total a Cobrar Hoje (Adesão + Pró-rata):** R$ ${totalHoje}\n\n`;
    
    mensagem += `**🧑 DADOS DO TITULAR:**\n`;
    mensagem += `- **Nome:** ${titular.nome || 'Não informado'}\n`;
    mensagem += `- **CPF:** ${titular.cpf || 'Não informado'}\n`;
    mensagem += `- **WhatsApp:** ${titular.telefone || 'Não informado'}\n`;
    mensagem += `- **Endereço:** ${titular.endereco || 'Não informado'}\n\n`;

    mensagem += `**👨‍👩‍👧 DEPENDENTES (${dependentes.length}):**\n`;
    if (dependentes.length === 0) {
      mensagem += `- Nenhum dependente informado.\n`;
    } else {
      dependentes.forEach((dep, index) => {
        mensagem += `${index + 1}. ${dep.nome || 'Nome vazio'} (CPF: ${dep.cpf || 'Vazio'})\n`;
      });
    }

    mensagem += `\n*Ação:* Chamar o cliente no WhatsApp, gerar a cobrança no SIA/Banco e emitir carteirinha.`;

    // ==============================================================
    // ENVIO PARA O DISCORD/SLACK VIA WEBHOOK
    // ==============================================================
    const WEBHOOK_URL = process.env.WEBHOOK_URL; // Coloque sua URL no .env.local

    if (WEBHOOK_URL) {
      await fetch(WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        // O Discord exige que a mensagem vá dentro de um campo chamado "content"
        body: JSON.stringify({ content: mensagem }) 
      });
    } else {
      // Se você não tiver colocado a URL no .env ainda, ele apenas "printa" no terminal do seu Cursor para você ver funcionando.
      console.log("WEBHOOK NÃO CONFIGURADO. Dados recebidos:");
      console.log(mensagem);
    }

    // Retorna sucesso para o frontend exibir a tela verde
    return NextResponse.json({ success: true });

  } catch (error) {
    console.error("Erro ao enviar solicitação:", error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}