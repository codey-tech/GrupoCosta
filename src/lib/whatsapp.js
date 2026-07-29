// Número comercial com WhatsApp ativo — apenas dígitos, com DDI 55
export const WHATSAPP_NUMBER = "555121294040";

/**
 * Número da Funerária Costa e do Memórias de 4 Patas.
 *
 * É deliberadamente separado do número geral do Grupo Costa: só foi
 * confirmado para essas duas frentes. Clínica, ambulâncias, plano e home
 * seguem em WHATSAPP_NUMBER até haver confirmação.
 */
export const WHATSAPP_FUNERARIA = "5551981211131";

/**
 * Monta um link wa.me válido, com mensagem pré-preenchida opcional.
 * O número DEVE incluir o DDI 55.
 * @param {string} [message] - Texto que já aparece digitado na conversa
 * @param {string} [number] - Número alternativo; padrão é o do Grupo Costa
 * @returns {string} URL completa do wa.me
 */
export function whatsappLink(message, number = WHATSAPP_NUMBER) {
  const base = `https://wa.me/${number}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
}

/** Mensagens contextuais por rota do site institucional */
export const WHATSAPP_MESSAGES = {
  home: "Olá! Vim pelo site do Grupo Costa e gostaria de mais informações.",
  plano: "Olá! Vim pelo site e gostaria de saber mais sobre o Plano Costa.",
  centroClinico:
    "Olá! Vim pelo site e gostaria de agendar uma consulta no Centro Clínico.",
  ambulancias:
    "Olá! Vim pelo site e preciso de informações sobre Costa Ambulâncias.",
  funeraria: "Olá! Vim pelo site e gostaria de falar com a Funerária Costa.",
  memorial:
    "Olá! Vim pelo site e gostaria de informações sobre o Memorial da Paz.",
  memorias4patas:
    "Olá! Vim pelo site e gostaria de informações sobre o Memórias de 4 Patas.",
};
