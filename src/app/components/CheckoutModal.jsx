import React, { useState, useEffect } from 'react';
import { X, ChevronRight, ChevronLeft, UserPlus, CheckCircle, Trash2, ShieldCheck, Info, Send, ChevronDown, AlertCircle } from 'lucide-react';
import { useLenis } from './LenisProvider';

// ==========================================
// FUNÇÃO VALIDADORA DE CPF
// ==========================================
const isValidCPF = (cpf) => {
  const cleanCPF = cpf.replace(/[^\d]+/g, '');
  if (cleanCPF.length !== 11 || !!cleanCPF.match(/(\d)\1{10}/)) return false;
  
  const calc = (x) => {
    let sum = 0;
    for (let i = 0; i < x; i++) sum += parseInt(cleanCPF.charAt(i)) * (x + 1 - i);
    let remainder = 11 - (sum % 11);
    return remainder === 10 || remainder === 11 ? 0 : remainder;
  };
  
  return calc(9) === parseInt(cleanCPF.charAt(9)) && calc(10) === parseInt(cleanCPF.charAt(10));
};

// ==========================================
// COMPONENTE DE CAMPOS
// ==========================================
const FormFields = ({ data, onChange }) => (
  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
    <div className="md:col-span-2">
      <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1 mb-1 block">Nome Completo *</label>
      <input type="text" value={data.nome} onChange={(e) => onChange('nome', e.target.value)} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-purple-600 outline-none text-sm font-medium" placeholder="Nome completo" />
    </div>
    <div className="md:col-span-1">
      <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1 mb-1 block">CPF</label>
      <input type="text" value={data.cpf} onChange={(e) => onChange('cpf', e.target.value)} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-purple-600 outline-none text-sm font-medium" placeholder="000.000.000-00" />
    </div>
    <div className="md:col-span-1">
      <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1 mb-1 block">Nascimento *</label>
      <input type="text" value={data.nascimento} onChange={(e) => onChange('nascimento', e.target.value)} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-purple-600 outline-none text-sm font-medium" placeholder="DD/MM/AAAA" />
    </div>
    
    <div className="md:col-span-2">
      <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1 mb-1 block">Nome da Mãe</label>
      <input type="text" value={data.nomeMae} onChange={(e) => onChange('nomeMae', e.target.value)} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-purple-600 outline-none text-sm font-medium" placeholder="Nome completo da mãe" />
    </div>
    <div className="md:col-span-2">
      <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1 mb-1 block">Nome do Pai</label>
      <input type="text" value={data.nomePai} onChange={(e) => onChange('nomePai', e.target.value)} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-purple-600 outline-none text-sm font-medium" placeholder="Nome completo do pai (Opcional)" />
    </div>

    <div className="md:col-span-2">
      <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1 mb-1 block">E-mail</label>
      <input type="email" value={data.email} onChange={(e) => onChange('email', e.target.value)} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-purple-600 outline-none text-sm font-medium" placeholder="seu@email.com" />
    </div>
    <div className="md:col-span-2">
      <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1 mb-1 block">Telefone / WhatsApp</label>
      <input type="text" value={data.telefone} onChange={(e) => onChange('telefone', e.target.value)} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-purple-600 outline-none text-sm font-medium" placeholder="(51) 99999-9999" />
    </div>

    <div className="md:col-span-2">
      <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1 mb-1 block">Rua / Logradouro</label>
      <input type="text" value={data.rua} onChange={(e) => onChange('rua', e.target.value)} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-purple-600 outline-none text-sm font-medium" placeholder="Rua, Avenida..." />
    </div>
    <div className="md:col-span-1">
      <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1 mb-1 block">Número</label>
      <input type="text" value={data.numero} onChange={(e) => onChange('numero', e.target.value)} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-purple-600 outline-none text-sm font-medium" placeholder="123" />
    </div>
    <div className="md:col-span-1">
      <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1 mb-1 block">Bairro</label>
      <input type="text" value={data.bairro} onChange={(e) => onChange('bairro', e.target.value)} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-purple-600 outline-none text-sm font-medium" placeholder="Centro" />
    </div>

    <div className="md:col-span-3">
      <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1 mb-1 block">Cidade</label>
      <input type="text" value={data.cidade} onChange={(e) => onChange('cidade', e.target.value)} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-purple-600 outline-none text-sm font-medium" placeholder="Taquari" />
    </div>
    <div className="md:col-span-1">
      <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1 mb-1 block">UF</label>
      <input type="text" value={data.uf} onChange={(e) => onChange('uf', e.target.value)} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-purple-600 outline-none text-sm font-medium" placeholder="RS" />
    </div>
  </div>
);

// ==========================================
// COMPONENTE PRINCIPAL
// ==========================================
const CheckoutModal = ({ isOpen, onClose, plan }) => {
  const lenisRef = useLenis();
  const [step, setStep] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  
  const [openDependentIndex, setOpenDependentIndex] = useState(0);

  const initialPersonState = {
    nome: '', cpf: '', nascimento: '', nomeMae: '', nomePai: '',
    email: '', telefone: '', rua: '', numero: '', bairro: '', cidade: '', uf: ''
  };

  const [titular, setTitular] = useState({ ...initialPersonState });
  const [dependentes, setDependentes] = useState([]);

  // Trava o scroll da página sem `position: fixed` + `scrollTo`.
  // Com Lenis, isso evitava salto pro topo e scroll suave de “volta” à seção de planos ao fechar.
  useEffect(() => {
    if (!isOpen) return;

    const html = document.documentElement;
    const prevHtmlOverflow = html.style.overflow;
    const prevBodyOverflow = document.body.style.overflow;
    html.style.overflow = 'hidden';
    document.body.style.overflow = 'hidden';

    const lenis = lenisRef?.current;
    lenis?.stop();

    return () => {
      html.style.overflow = prevHtmlOverflow;
      document.body.style.overflow = prevBodyOverflow;
      lenis?.start();
    };
  }, [isOpen, lenisRef]);

  if (!isOpen || !plan) return null;

  const maxDependents = plan.name === 'Topázio' ? 1 : plan.name === 'Esmeralda' ? 4 : 7;
  
  const handleAddDependente = () => {
    if (dependentes.length < maxDependents) {
      setDependentes([...dependentes, { ...initialPersonState }]);
      setOpenDependentIndex(dependentes.length); 
      setTimeout(() => {
        const modalArea = document.getElementById('scrollable-area');
        if (modalArea) modalArea.scrollTo({ top: modalArea.scrollHeight, behavior: 'smooth' });
      }, 100);
    }
  };

  const handleRemoveDependente = (index) => {
    const newDeps = dependentes.filter((_, i) => i !== index);
    setDependentes(newDeps);
    if (openDependentIndex === index) {
      setOpenDependentIndex(Math.max(0, newDeps.length - 1));
    } else if (openDependentIndex > index) {
      setOpenDependentIndex(openDependentIndex - 1);
    }
  };

  const handleDependenteChange = (index, field, value) => {
    const newDeps = [...dependentes];
    newDeps[index][field] = value;
    setDependentes(newDeps);
  };

  const toggleAccordion = (index) => {
    setOpenDependentIndex(openDependentIndex === index ? null : index);
  };

  // ==========================================
  // VALIDAÇÕES
  // ==========================================
  const validateStep1 = () => {
    setErrorMsg('');
    if (!titular.nome.trim()) return "O nome do titular é obrigatório.";
    if (!titular.nascimento.trim()) return "A data de nascimento do titular é obrigatória.";
    if (!titular.cpf.trim() || !isValidCPF(titular.cpf)) return "O CPF do titular é inválido ou está vazio.";
    return null; // Sem erros
  };

  const validateStep2 = () => {
    setErrorMsg('');
    for (let i = 0; i < dependentes.length; i++) {
      if (!dependentes[i].nome.trim()) return `O nome do Dependente ${i + 1} é obrigatório.`;
      if (!dependentes[i].nascimento.trim()) return `A data de nascimento do Dependente ${i + 1} é obrigatória.`;
      
      // Valida o CPF do dependente APENAS se ele tiver digitado algo
      const cleanCPF = dependentes[i].cpf.replace(/\D/g, '');
      if (cleanCPF.length > 0 && !isValidCPF(dependentes[i].cpf)) {
        return `O CPF do Dependente ${i + 1} é inválido.`;
      }
    }
    return null; // Sem erros
  };

  const handleNextStep = () => {
    const error = validateStep1();
    if (error) {
      setErrorMsg(error);
      return;
    }
    setStep(2);
  };

  const handleSubmit = async () => {
    const error = validateStep2();
    if (error) {
      setErrorMsg(error);
      return;
    }

    setIsProcessing(true);
    setErrorMsg('');
    
    try {
      const response = await fetch('/api/solicitacao', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          titular,
          dependentes,
          plano: plan.name
        })
      });

      const data = await response.json();
      if (data.success) {
        setIsSuccess(true);
      } else {
        setErrorMsg("Erro ao enviar: " + data.message);
      }
    } catch (error) {
      setErrorMsg("Erro de conexão. Verifique sua internet.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
      <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm" onClick={onClose} />

      <div className="relative w-full max-w-5xl bg-white rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col md:flex-row h-[90vh] md:h-[800px] animate-in fade-in zoom-in duration-300">
        
        {/* LADO ESQUERDO: Resumo Limpo */}
        <div className="w-full md:w-1/3 bg-slate-950 p-8 md:p-10 text-white flex flex-col justify-between shrink-0 overflow-y-auto relative">
          
          {/* Elemento Decorativo de Fundo */}
          <div className="absolute top-0 right-0 w-full h-1/2 bg-gradient-to-bl from-purple-600/20 via-transparent to-transparent pointer-events-none" />

          <div className="relative z-10">
            <button onClick={onClose} className="md:hidden absolute top-0 right-0 text-white/50 hover:text-white">
              <X size={24} />
            </button>
            <div className="text-[10px] font-black uppercase tracking-widest text-purple-400 mb-2">Plano Selecionado</div>
            <h3 className="text-4xl font-black tracking-tighter mb-8">Plano {plan.name}</h3>
            
            <div className="space-y-4">
              <div className="flex items-start gap-4 p-5 bg-white/5 rounded-2xl border border-white/10">
                <CheckCircle className="text-emerald-400 shrink-0" size={24} />
                <div>
                  <h4 className="text-sm font-bold text-white mb-1">Amparo Completo</h4>
                  <p className="text-[11px] text-slate-400 leading-relaxed font-medium">Você e sua família estarão cobertos nas melhores clínicas e hospitais da região.</p>
                </div>
              </div>
              <div className="flex items-start gap-4 p-5 bg-white/5 rounded-2xl border border-white/10">
                <ShieldCheck className="text-purple-400 shrink-0" size={24} />
                <div>
                  <h4 className="text-sm font-bold text-white mb-1">Dados Protegidos</h4>
                  <p className="text-[11px] text-slate-400 leading-relaxed font-medium">As informações desta ficha são sigilosas e serão usadas apenas para confecção de contrato interno.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* LADO DIREITO: Stepper e Formulários */}
        <div className="w-full md:w-2/3 bg-white p-8 md:p-10 flex flex-col relative h-full">
          <button onClick={onClose} className="hidden md:block absolute top-8 right-8 text-slate-400 hover:text-slate-900 transition-colors z-10">
            <X size={24} />
          </button>

          {!isSuccess && (
            <div className="flex items-center gap-2 mb-8 shrink-0">
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

          <div id="scrollable-area" className="flex-grow overflow-y-auto pr-2 custom-scrollbar pb-4 overscroll-contain" onWheel={(e) => e.stopPropagation()}>
            
            {step === 1 && !isSuccess && (
              <div className="animate-in fade-in slide-in-from-right-4 duration-300">
                <h4 className="text-2xl font-black text-slate-900 mb-2">Dados do Titular</h4>
                <p className="text-sm text-slate-500 font-medium mb-8">Preencha com atenção a ficha de cadastro completa.</p>
                
                <FormFields data={titular} onChange={(field, value) => setTitular({...titular, [field]: value})} />
              </div>
            )}

            {step === 2 && !isSuccess && (
              <div className="animate-in fade-in slide-in-from-right-4 duration-300">
                <h4 className="text-2xl font-black text-slate-900 mb-2">Dependentes</h4>
                <p className="text-sm text-slate-500 font-medium mb-6">O Plano {plan.name} permite até {maxDependents} dependentes. Adicionados: {dependentes.length}</p>

                <div className="space-y-4">
                  {dependentes.map((dep, index) => {
                    const isOpen = openDependentIndex === index;
                    return (
                      <div key={index} className={`bg-slate-50 border border-slate-200 rounded-2xl overflow-hidden transition-all duration-300 ${isOpen ? 'shadow-sm' : 'hover:border-purple-300'}`}>
                        <div className="flex justify-between items-center p-5 cursor-pointer select-none bg-white/50" onClick={() => toggleAccordion(index)}>
                          <div className="flex items-center gap-3">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-black transition-colors ${isOpen ? 'bg-purple-100 text-purple-600' : 'bg-slate-100 text-slate-400'}`}>
                              {index + 1}
                            </div>
                            <h5 className="text-sm font-bold text-slate-700">{dep.nome ? dep.nome : `Novo Dependente`}</h5>
                          </div>
                          <div className="flex items-center gap-2">
                            <button onClick={(e) => { e.stopPropagation(); handleRemoveDependente(index); }} className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors" title="Remover dependente">
                              <Trash2 size={18} />
                            </button>
                            <div className={`text-slate-400 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}><ChevronDown size={20} /></div>
                          </div>
                        </div>
                        <div className={`px-6 transition-all duration-500 ease-in-out ${isOpen ? 'max-h-[1200px] opacity-100 pb-6 pt-2 border-t border-slate-100' : 'max-h-0 opacity-0 overflow-hidden'}`}>
                          <FormFields data={dep} onChange={(field, value) => handleDependenteChange(index, field, value)} />
                        </div>
                      </div>
                    );
                  })}

                  {dependentes.length < maxDependents && (
                    <button onClick={handleAddDependente} className="w-full py-5 mt-4 border-2 border-dashed border-slate-300 rounded-2xl text-slate-500 font-black text-sm uppercase tracking-widest hover:border-purple-400 hover:text-purple-600 hover:bg-purple-50 transition-all flex items-center justify-center gap-2 shadow-sm">
                      <UserPlus size={20} /> Adicionar Dependente
                    </button>
                  )}
                </div>
              </div>
            )}

            {isSuccess && (
              <div className="text-center py-20 animate-in zoom-in duration-500 flex flex-col items-center justify-center h-full">
                <div className="w-24 h-24 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-500 mx-auto mb-8">
                  <CheckCircle size={48} strokeWidth={3} />
                </div>
                <h4 className="text-4xl font-black text-slate-900 mb-4">Ficha Recebida!</h4>
                <p className="text-slate-500 font-medium max-w-md mx-auto mb-10 leading-relaxed">
                  Recebemos seus dados com sucesso. Nossa equipe realizará a validação no sistema e entrará em contato via WhatsApp para finalizar o seu cadastro.
                </p>
                <button onClick={onClose} className="px-10 py-5 bg-slate-950 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-purple-600 transition-colors shadow-xl">
                  Voltar ao Site
                </button>
              </div>
            )}
          </div>

          {/* MENSAGEM DE ERRO (Se a validação falhar) */}
          {errorMsg && !isSuccess && (
            <div className="mt-4 px-4 py-3 bg-red-50 border border-red-200 text-red-600 rounded-xl flex items-center gap-2 text-sm font-bold animate-in fade-in slide-in-from-bottom-2">
              <AlertCircle size={18} /> {errorMsg}
            </div>
          )}

          {/* RODAPÉ DO MODAL */}
          {!isSuccess && (
            <div className="mt-4 pt-6 border-t border-slate-100 flex justify-between items-center shrink-0 bg-white">
              {step > 1 ? (
                <button onClick={() => { setStep(step - 1); setErrorMsg(''); }} className="text-xs font-black uppercase tracking-widest text-slate-400 hover:text-slate-900 flex items-center gap-1 transition-colors">
                  <ChevronLeft size={16} /> Voltar
                </button>
              ) : <div />}

              {step < 2 ? (
                <button onClick={handleNextStep} className="px-8 py-4 bg-purple-600 text-white rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-slate-950 transition-colors shadow-lg shadow-purple-200 flex items-center gap-2">
                  Próximo Passo <ChevronRight size={16} />
                </button>
              ) : (
                <button onClick={handleSubmit} disabled={isProcessing} className="px-8 py-4 bg-emerald-500 text-white rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-emerald-600 transition-colors shadow-lg shadow-emerald-200 flex items-center gap-2 w-full md:w-auto justify-center">
                  {isProcessing ? 'Enviando Ficha...' : 'Finalizar Cadastro'} <Send size={16} />
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