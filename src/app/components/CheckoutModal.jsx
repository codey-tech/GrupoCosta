import React, { useState } from 'react';
import { X, ChevronRight, ChevronLeft, UserPlus, CheckCircle, Trash2, ShieldCheck, Info, Send } from 'lucide-react';

const CheckoutModal = ({ isOpen, onClose, plan }) => {
  const [step, setStep] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const [titular, setTitular] = useState({
    nome: '', cpf: '', telefone: '', endereco: ''
  });
  const [dependentes, setDependentes] = useState([]);

  if (!isOpen || !plan) return null;

  // Lógica de Dependentes
  const maxDependents = plan.name === 'Topázio' ? 1 : plan.name === 'Esmeralda' ? 4 : 7;
  
  const handleAddDependente = () => {
    if (dependentes.length < maxDependents) {
      setDependentes([...dependentes, { nome: '', cpf: '' }]);
    }
  };

  const handleRemoveDependente = (index) => {
    setDependentes(dependentes.filter((_, i) => i !== index));
  };

  const handleDependenteChange = (index, field, value) => {
    const newDeps = [...dependentes];
    newDeps[index][field] = value;
    setDependentes(newDeps);
  };

  // ==========================================
  // CÁLCULOS FINANCEIROS (Pró-rata visual)
  // ==========================================
  const hoje = new Date();
  const diaAtual = hoje.getDate();
  const diasNoMes = new Date(hoje.getFullYear(), hoje.getMonth() + 1, 0).getDate();
  const diasRestantes = diasNoMes - diaAtual;

  const taxaAdesao = 49.99;
  const mensalidadeCheia = parseFloat(plan.price.replace(',', '.'));
  const mensalidadeProporcional = (mensalidadeCheia / diasNoMes) * diasRestantes;
  
  const totalHoje = (taxaAdesao + mensalidadeProporcional).toFixed(2).replace('.', ',');
  const mensalidadeFormatada = mensalidadeProporcional.toFixed(2).replace('.', ',');

  // ==========================================
  // ENVIO DOS DADOS PARA O BACKEND
  // ==========================================
  const handleSubmit = async () => {
    setIsProcessing(true);
    
    try {
      const response = await fetch('/api/solicitacao', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          titular,
          dependentes,
          plano: plan.name,
          totalHoje,
        })
      });

      const data = await response.json();

      if (data.success) {
        setIsSuccess(true);
      } else {
        alert("Ocorreu um erro ao enviar sua solicitação. Tente novamente.");
      }
    } catch (error) {
      alert("Erro de conexão. Verifique sua internet.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
      <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm" onClick={onClose} />

      <div className="relative w-full max-w-4xl bg-white rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col md:flex-row min-h-[600px] animate-in fade-in zoom-in duration-300">
        
        {/* LADO ESQUERDO: Resumo */}
        <div className="w-full md:w-1/3 bg-slate-950 p-8 md:p-10 text-white flex flex-col justify-between">
          <div>
            <button onClick={onClose} className="md:hidden absolute top-6 right-6 text-white/50 hover:text-white">
              <X size={24} />
            </button>
            <div className="text-[10px] font-black uppercase tracking-widest text-purple-400 mb-2">Resumo da Assinatura</div>
            <h3 className="text-3xl font-black tracking-tighter mb-8">Plano {plan.name}</h3>

            <div className="space-y-4 mb-8">
              <div className="flex justify-between text-sm font-medium text-slate-400 items-center">
                <span className="flex items-center gap-1.5">
                  Proporcional <span className="text-[10px] bg-white/10 px-2 py-0.5 rounded-full">{diasRestantes} dias</span>
                </span>
                <span>R$ {mensalidadeFormatada}</span>
              </div>
              <div className="flex justify-between text-sm font-medium text-slate-400">
                <span>Taxa de Adesão</span>
                <span>R$ 49,99</span>
              </div>
              <div className="pt-4 border-t border-white/10 flex justify-between text-lg font-black text-white">
                <span>Total Hoje</span>
                <span className="text-purple-400">R$ {totalHoje}</span>
              </div>
            </div>
            
            <div className="flex items-start gap-3 p-4 bg-white/5 rounded-2xl border border-white/10 mb-4">
              <Info className="text-purple-400 shrink-0" size={20} />
              <p className="text-[11px] text-slate-400 leading-relaxed font-medium">
                No próximo mês, a mensalidade passará a ser o valor integral do plano escolhido (R$ {plan.price}).
              </p>
            </div>

            <div className="flex items-start gap-3 p-4 bg-white/5 rounded-2xl border border-white/10">
              <ShieldCheck className="text-emerald-400 shrink-0" size={20} />
              <p className="text-[11px] text-slate-400 leading-relaxed font-medium">
                Seus dados estão protegidos e serão utilizados apenas para a confecção do seu contrato e carteirinha.
              </p>
            </div>
          </div>
        </div>

        {/* LADO DIREITO: Stepper e Formulários */}
        <div className="w-full md:w-2/3 bg-white p-8 md:p-12 flex flex-col relative">
          <button onClick={onClose} className="hidden md:block absolute top-8 right-8 text-slate-400 hover:text-slate-900 transition-colors">
            <X size={24} />
          </button>

          {!isSuccess && (
            <div className="flex items-center gap-2 mb-10">
              {[1, 2].map((i) => (
                <div key={i} className="flex items-center gap-2">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-black transition-colors ${step >= i ? 'bg-purple-600 text-white' : 'bg-slate-100 text-slate-400'}`}>
                    {i}
                  </div>
                  {i < 2 && <div className={`w-8 h-1 rounded-full ${step > i ? 'bg-purple-600' : 'bg-slate-100'}`} />}
                </div>
              ))}
            </div>
          )}

          <div className="flex-grow flex flex-col justify-center">
            
            {step === 1 && !isSuccess && (
              <div className="animate-in fade-in slide-in-from-right-4 duration-300">
                <h4 className="text-2xl font-black text-slate-900 mb-2">Dados do Titular</h4>
                <p className="text-sm text-slate-500 font-medium mb-6">Preencha com atenção os dados do responsável financeiro.</p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1 mb-1 block">Nome Completo</label>
                    <input type="text" value={titular.nome} onChange={(e) => setTitular({...titular, nome: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-purple-600 focus:ring-2 focus:ring-purple-100 outline-none transition-all font-medium" placeholder="Ex: João da Silva" />
                  </div>
                  <div>
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1 mb-1 block">CPF</label>
                    <input type="text" value={titular.cpf} onChange={(e) => setTitular({...titular, cpf: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-purple-600 focus:ring-2 focus:ring-purple-100 outline-none transition-all font-medium" placeholder="000.000.000-00" />
                  </div>
                  <div>
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1 mb-1 block">Telefone / WhatsApp</label>
                    <input type="text" value={titular.telefone} onChange={(e) => setTitular({...titular, telefone: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-purple-600 focus:ring-2 focus:ring-purple-100 outline-none transition-all font-medium" placeholder="(51) 99999-9999" />
                  </div>
                  <div className="md:col-span-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1 mb-1 block">Endereço Completo</label>
                    <input type="text" value={titular.endereco} onChange={(e) => setTitular({...titular, endereco: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-purple-600 focus:ring-2 focus:ring-purple-100 outline-none transition-all font-medium" placeholder="Rua, Número, Bairro, Cidade - RS" />
                  </div>
                </div>
              </div>
            )}

            {step === 2 && !isSuccess && (
              <div className="animate-in fade-in slide-in-from-right-4 duration-300">
                <h4 className="text-2xl font-black text-slate-900 mb-2">Dependentes</h4>
                <p className="text-sm text-slate-500 font-medium mb-6">O Plano {plan.name} permite até {maxDependents} dependentes. Você adicionou {dependentes.length}.</p>

                <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2">
                  {dependentes.map((dep, index) => (
                    <div key={index} className="p-4 bg-slate-50 border border-slate-200 rounded-2xl relative group">
                      <button onClick={() => handleRemoveDependente(index)} className="absolute top-4 right-4 text-slate-400 hover:text-red-500 transition-colors">
                        <Trash2 size={18} />
                      </button>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                        <div>
                          <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1 mb-1 block">Nome do Dependente</label>
                          <input type="text" value={dep.nome} onChange={(e) => handleDependenteChange(index, 'nome', e.target.value)} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white focus:border-purple-600 focus:ring-2 focus:ring-purple-100 outline-none transition-all font-medium text-sm" placeholder="Nome completo" />
                        </div>
                        <div>
                          <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1 mb-1 block">CPF</label>
                          <input type="text" value={dep.cpf} onChange={(e) => handleDependenteChange(index, 'cpf', e.target.value)} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white focus:border-purple-600 focus:ring-2 focus:ring-purple-100 outline-none transition-all font-medium text-sm" placeholder="000.000.000-00" />
                        </div>
                      </div>
                    </div>
                  ))}

                  {dependentes.length < maxDependents && (
                    <button onClick={handleAddDependente} className="w-full py-4 border-2 border-dashed border-slate-300 rounded-2xl text-slate-500 font-black text-xs uppercase tracking-widest hover:border-purple-400 hover:text-purple-600 hover:bg-purple-50 transition-all flex items-center justify-center gap-2">
                      <UserPlus size={16} /> Adicionar Dependente
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* TELA DE SUCESSO (Mensagem atualizada para o fluxo manual) */}
            {isSuccess && (
              <div className="text-center py-10 animate-in zoom-in duration-500">
                <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-500 mx-auto mb-6">
                  <CheckCircle size={40} strokeWidth={3} />
                </div>
                <h4 className="text-3xl font-black text-slate-900 mb-4">Solicitação Enviada!</h4>
                <p className="text-slate-500 font-medium max-w-sm mx-auto mb-8">
                  Recebemos os seus dados. Nossa equipe fará a conferência e chamará você no WhatsApp informado para enviar o link de pagamento e emitir sua carteirinha virtual.
                </p>
                <button onClick={onClose} className="px-8 py-4 bg-slate-950 text-white rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-purple-600 transition-colors shadow-lg">
                  Voltar ao Início
                </button>
              </div>
            )}

          </div>

          {/* RODAPÉ DO MODAL */}
          {!isSuccess && (
            <div className="mt-8 pt-6 border-t border-slate-100 flex justify-between items-center">
              {step > 1 ? (
                <button onClick={() => setStep(step - 1)} className="text-xs font-black uppercase tracking-widest text-slate-400 hover:text-slate-900 flex items-center gap-1 transition-colors">
                  <ChevronLeft size={16} /> Voltar
                </button>
              ) : <div />}

              {step < 2 ? (
                <button onClick={() => setStep(step + 1)} className="px-8 py-4 bg-purple-600 text-white rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-slate-950 transition-colors shadow-lg shadow-purple-200 flex items-center gap-2">
                  Próximo Passo <ChevronRight size={16} />
                </button>
              ) : (
                <button onClick={handleSubmit} disabled={isProcessing} className="px-8 py-4 bg-emerald-500 text-white rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-emerald-600 transition-colors shadow-lg shadow-emerald-200 flex items-center gap-2 w-full md:w-auto justify-center">
                  {isProcessing ? 'Enviando...' : 'Enviar Solicitação'} <Send size={16} />
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CheckoutModal;