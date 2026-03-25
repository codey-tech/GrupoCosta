"use client";

import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { Users, FileText, CheckCircle, Clock, Search, LogOut, ChevronRight, Activity, ShieldAlert, X, User, ChevronDown, Lock, ArrowRight } from 'lucide-react';

// Inicializa o Supabase no lado do cliente
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

// ==========================================
// SENHA MESTRA DA EQUIPE INTERNA
// ==========================================
const SENHA_EQUIPE = process.env.NEXT_PUBLIC_SENHA_PAINEL; // Mude para a senha que desejar!

export default function PainelAdmin() {
  // Estados de Autenticação
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [passwordInput, setPasswordInput] = useState('');
  const [loginError, setLoginError] = useState(false);

  // Estados do Painel
  const [leads, setLeads] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [selectedLead, setSelectedLead] = useState(null);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const [openDepIndex, setOpenDepIndex] = useState(null);

  // 1. Verifica se já está logado ao abrir a página
  useEffect(() => {
    const authStatus = localStorage.getItem('plano_costa_auth');
    if (authStatus === 'true') {
      setIsAuthenticated(true);
    }
    setIsCheckingAuth(false);
  }, []);

  // 2. Busca os dados APENAS se estiver logado
  useEffect(() => {
    if (isAuthenticated) {
      fetchLeads();
    }
  }, [isAuthenticated]);

  const handleLogin = (e) => {
    e.preventDefault();
    if (passwordInput === SENHA_EQUIPE) {
      localStorage.setItem('plano_costa_auth', 'true');
      setIsAuthenticated(true);
      setLoginError(false);
    } else {
      setLoginError(true);
      setPasswordInput('');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('plano_costa_auth');
    setIsAuthenticated(false);
    setLeads([]); // Limpa os dados da memória por segurança
  };

  const fetchLeads = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('adesoes')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      const formattedData = data.map(lead => ({
        ...lead,
        status: lead.status === 'Pendente' ? 'Solicitado' : lead.status
      }));

      setLeads(formattedData || []);
    } catch (error) {
      console.error('Erro ao buscar clientes:', error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateStatus = async (novoStatus) => {
    if (!selectedLead) return;
    setIsUpdatingStatus(true);
    
    try {
      const { error } = await supabase
        .from('adesoes')
        .update({ status: novoStatus })
        .eq('id', selectedLead.id);

      if (error) throw error;

      setLeads(leads.map(l => l.id === selectedLead.id ? { ...l, status: novoStatus } : l));
      setSelectedLead({ ...selectedLead, status: novoStatus });
      
    } catch (error) {
      alert("Erro ao atualizar o status: " + error.message);
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  const filteredLeads = leads.filter(lead => 
    lead.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    lead.cpf.includes(searchTerm)
  );

  const solicitados = leads.filter(l => l.status === 'Solicitado').length;
  const emAndamento = leads.filter(l => l.status === 'Em Andamento').length;
  const concluidos = leads.filter(l => l.status === 'Concluído').length;

  const formatarData = (dataIso) => {
    return new Date(dataIso).toLocaleDateString('pt-BR', {
      day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
    }).replace(' de ', '/').replace('. de ', '/');
  };

  const formatarNascimento = (val) => {
    if (!val) return '-';
    const digits = val.replace(/\D/g, ''); 
    if (digits.length === 8) {
      return `${digits.slice(0,2)}/${digits.slice(2,4)}/${digits.slice(4,8)}`;
    }
    return val;
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'Solicitado': return 'bg-amber-50 text-amber-600 border-amber-200';
      case 'Em Andamento': return 'bg-blue-50 text-blue-600 border-blue-200';
      case 'Concluído': return 'bg-emerald-50 text-emerald-600 border-emerald-200';
      case 'Cancelado': return 'bg-red-50 text-red-600 border-red-200';
      default: return 'bg-slate-50 text-slate-600 border-slate-200';
    }
  };

  const handleOpenFicha = (lead) => {
    setSelectedLead(lead);
    setOpenDepIndex(null); 
  };

  // ==========================================
  // TELA DE CARREGAMENTO INICIAL
  // ==========================================
  if (isCheckingAuth) {
    return <div className="min-h-screen bg-slate-950 flex items-center justify-center"></div>;
  }

  // ==========================================
  // TELA DE LOGIN (Acesso Restrito)
  // ==========================================
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 selection:bg-purple-200 relative overflow-hidden">
        {/* Efeito de Fundo */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-purple-600/5 blur-[120px] rounded-full pointer-events-none" />
        
        <div className="w-full max-w-md bg-white rounded-[2.5rem] shadow-2xl p-10 md:p-12 relative z-10 border border-slate-100 animate-in fade-in slide-in-from-bottom-8 duration-500">
          <div className="w-16 h-16 bg-slate-950 rounded-2xl flex items-center justify-center text-white mb-8 mx-auto shadow-lg shadow-slate-900/20">
            <Lock size={32} />
          </div>
          
          <div className="text-center mb-10">
            <h1 className="text-2xl font-black text-slate-900 tracking-tighter uppercase">Plano<span className="italic text-purple-600 font-light">Costa</span></h1>
            <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mt-2">Painel Restrito da Equipe</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1 mb-2 block">Senha de Acesso</label>
              <input 
                type="password" 
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                className={`w-full px-5 py-4 rounded-xl border bg-slate-50 focus:bg-white outline-none text-sm font-medium transition-all ${loginError ? 'border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-100 text-red-600' : 'border-slate-200 focus:border-purple-600 focus:ring-2 focus:ring-purple-100'}`} 
                placeholder="••••••••" 
                autoFocus
              />
              {loginError && <p className="text-[10px] font-black uppercase tracking-widest text-red-500 mt-2 ml-1 animate-pulse">Senha incorreta. Tente novamente.</p>}
            </div>
            
            <button type="submit" className="w-full py-4 bg-slate-950 text-white rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-purple-600 transition-colors shadow-lg flex items-center justify-center gap-2 group">
              Acessar Painel <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </form>
        </div>
      </div>
    );
  }

  // ==========================================
  // PAINEL DE ADMINISTRAÇÃO (Usuário Logado)
  // ==========================================
  return (
    <div className="min-h-screen bg-slate-50 flex overflow-hidden">
      
      {/* MENU LATERAL */}
      <aside className="w-64 bg-slate-950 text-slate-400 flex flex-col fixed h-full z-10 shrink-0">
        <div className="p-6 border-b border-white/10">
          <div className="text-xl font-black tracking-tighter uppercase text-white">Plano<span className="italic text-purple-500 font-light">Costa</span></div>
          <div className="text-[9px] uppercase tracking-widest mt-1 text-slate-500">Painel Interno</div>
        </div>
        
        <nav className="flex-1 p-4 space-y-2">
          <a href="#" className="flex items-center gap-3 px-4 py-3 bg-purple-600/10 text-purple-400 rounded-xl font-bold transition-colors">
            <Users size={18} /> Novas Adesões
          </a>
          <a href="#" className="flex items-center gap-3 px-4 py-3 hover:bg-white/5 hover:text-white rounded-xl font-bold transition-colors cursor-not-allowed opacity-50">
            <FileText size={18} /> Relatórios SIA
          </a>
        </nav>

        {/* Botão de Logout Funcional */}
        <div className="p-6 border-t border-white/10">
          <button onClick={handleLogout} className="flex items-center gap-3 text-sm font-bold hover:text-red-400 transition-colors w-full group">
            <LogOut size={18} className="group-hover:-translate-x-1 transition-transform" /> Sair do Sistema
          </button>
        </div>
      </aside>

      {/* CONTEÚDO PRINCIPAL */}
      <main className="flex-1 ml-64 p-8 md:p-12 relative h-screen overflow-y-auto">
        
        <header className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tighter">Gestão de Adesões</h1>
            <p className="text-sm text-slate-500 font-medium mt-1">Gerencie os novos clientes vindos do site.</p>
          </div>
          
          <div className="relative w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Buscar por CPF ou Nome..." 
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-100 transition-all shadow-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </header>

        {/* CARDS DE RESUMO */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-amber-50 text-amber-500 rounded-xl flex items-center justify-center"><Clock size={24} /></div>
            <div>
              <div className="text-[10px] font-black uppercase tracking-widest text-slate-400">Novos (Solicitados)</div>
              <div className="text-3xl font-black text-slate-900 leading-none mt-1">{solicitados}</div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-blue-50 text-blue-500 rounded-xl flex items-center justify-center"><Activity size={24} /></div>
            <div>
              <div className="text-[10px] font-black uppercase tracking-widest text-slate-400">Em Andamento (SIA)</div>
              <div className="text-3xl font-black text-slate-900 leading-none mt-1">{emAndamento}</div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-emerald-50 text-emerald-500 rounded-xl flex items-center justify-center"><CheckCircle size={24} /></div>
            <div>
              <div className="text-[10px] font-black uppercase tracking-widest text-slate-400">Concluídos</div>
              <div className="text-3xl font-black text-slate-900 leading-none mt-1">{concluidos}</div>
            </div>
          </div>
        </div>

        {/* TABELA DE CLIENTES */}
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden min-h-[400px] mb-12">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center h-64 text-slate-400">
              <div className="w-8 h-8 border-4 border-slate-200 border-t-purple-600 rounded-full animate-spin mb-4" />
              <p className="text-sm font-bold uppercase tracking-widest">Carregando dados...</p>
            </div>
          ) : filteredLeads.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-slate-400">
              <ShieldAlert size={48} className="text-slate-200 mb-4" />
              <p className="text-sm font-bold uppercase tracking-widest">Nenhum cliente encontrado.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-[10px] uppercase tracking-widest text-slate-500">
                    <th className="p-4 font-black">Data</th>
                    <th className="p-4 font-black">Titular</th>
                    <th className="p-4 font-black">Plano</th>
                    <th className="p-4 font-black text-center">Dependentes</th>
                    <th className="p-4 font-black">Status</th>
                    <th className="p-4 font-black text-right">Ficha</th>
                  </tr>
                </thead>
                <tbody className="text-sm font-medium text-slate-700 divide-y divide-slate-100">
                  {filteredLeads.map((lead) => {
                    let deps = [];
                    try { deps = typeof lead.dependentes === 'string' ? JSON.parse(lead.dependentes) : lead.dependentes; } catch(e) {}

                    return (
                      <tr key={lead.id} className="hover:bg-slate-50/50 transition-colors group cursor-pointer" onClick={() => handleOpenFicha(lead)}>
                        <td className="p-4 text-xs text-slate-500 whitespace-nowrap">
                          {formatarData(lead.created_at)}
                        </td>
                        <td className="p-4">
                          <div className="font-bold text-slate-900 uppercase text-xs">{lead.nome}</div>
                          <div className="text-[11px] text-slate-400 mt-0.5">{lead.telefone} • {lead.cpf}</div>
                        </td>
                        <td className="p-4">
                          <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-[9px] font-black uppercase tracking-widest border ${
                            lead.plano === 'Diamante' ? 'bg-blue-50 text-blue-600 border-blue-100' : 
                            lead.plano === 'Esmeralda' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 
                            'bg-orange-50 text-orange-600 border-orange-100'
                          }`}>
                            {lead.plano}
                          </span>
                        </td>
                        <td className="p-4 text-center">
                          <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-slate-100 text-slate-600 font-bold text-xs">
                            {deps ? deps.length : 0}
                          </span>
                        </td>
                        <td className="p-4">
                          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border ${getStatusColor(lead.status)}`}>
                            <div className={`w-1.5 h-1.5 rounded-full bg-current`} />
                            {lead.status}
                          </span>
                        </td>
                        <td className="p-4 text-right">
                          <button className="p-2 text-slate-400 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors border border-transparent group-hover:border-purple-100">
                            <ChevronRight size={18} />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>

      {/* OVERLAY ESCURO PARA O SLIDE */}
      {selectedLead && (
        <div 
          className="fixed inset-0 bg-slate-950/20 backdrop-blur-sm z-40 transition-opacity"
          onClick={() => setSelectedLead(null)}
        />
      )}

      {/* PAINEL DESLIZANTE (SLIDE-OVER) - FICHA COMPLETA */}
      <div className={`fixed top-0 right-0 h-full w-full max-w-2xl bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out flex flex-col ${selectedLead ? 'translate-x-0' : 'translate-x-full'}`}>
        
        {selectedLead && (
          <>
            <header className="px-8 py-6 border-b border-slate-100 flex justify-between items-start bg-slate-50 shrink-0">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <h2 className="text-2xl font-black text-slate-900 uppercase">{selectedLead.nome}</h2>
                  <span className={`px-2.5 py-1 rounded-md text-[9px] font-black uppercase tracking-widest border ${
                    selectedLead.plano === 'Diamante' ? 'bg-blue-50 text-blue-600 border-blue-100' : 
                    selectedLead.plano === 'Esmeralda' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 
                    'bg-orange-50 text-orange-600 border-orange-100'
                  }`}>
                    {selectedLead.plano}
                  </span>
                </div>
                <p className="text-sm text-slate-500 font-medium">Cadastrado em {formatarData(selectedLead.created_at)}</p>
              </div>
              <button onClick={() => setSelectedLead(null)} className="p-2 bg-white rounded-full text-slate-400 hover:text-slate-900 shadow-sm border border-slate-200">
                <X size={20} />
              </button>
            </header>

            <div className="px-8 py-4 bg-white border-b border-slate-100 flex items-center justify-between shrink-0">
              <div className="text-[10px] font-black uppercase tracking-widest text-slate-400">Mudar Status da Ficha:</div>
              <div className="flex items-center gap-2">
                <select 
                  value={selectedLead.status}
                  onChange={(e) => handleUpdateStatus(e.target.value)}
                  disabled={isUpdatingStatus}
                  className={`appearance-none font-bold text-xs uppercase tracking-widest px-4 py-2.5 rounded-lg border outline-none cursor-pointer pr-10 bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cpath%20d%3D%22M6%209L12%2015L18%209%22%20stroke%3D%22%2364748B%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%2F%3E%3C%2Fsvg%3E')] bg-no-repeat bg-[position:right_10px_center] bg-[length:16px] ${getStatusColor(selectedLead.status)}`}
                >
                  <option value="Solicitado">🚨 Solicitado</option>
                  <option value="Em Andamento">⏳ Em Andamento</option>
                  <option value="Concluído">✅ Concluído</option>
                  <option value="Cancelado">❌ Cancelado</option>
                </select>
                {isUpdatingStatus && <div className="w-5 h-5 border-2 border-slate-200 border-t-purple-600 rounded-full animate-spin" />}
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-8 custom-scrollbar bg-white">
              
              <div className="mb-8 p-5 bg-slate-950 rounded-2xl flex justify-between items-center text-white shadow-xl shadow-slate-900/10">
                <div>
                  <div className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Adesão + Pró-Rata</div>
                  <div className="text-2xl font-black">R$ {selectedLead.valor_total}</div>
                </div>
              </div>

              {/* DADOS DO TITULAR */}
              <div className="mb-10">
                <h4 className="flex items-center gap-2 text-sm font-black uppercase tracking-widest text-purple-600 mb-4 border-b border-slate-100 pb-2">
                  <User size={16} /> Dados do Titular
                </h4>
                <div className="grid grid-cols-2 gap-y-6 gap-x-4">
                  <div><p className="text-[10px] font-black uppercase tracking-widest text-slate-400">CPF</p><p className="font-medium text-slate-900">{selectedLead.cpf}</p></div>
                  <div><p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Nascimento</p><p className="font-medium text-slate-900">{formatarNascimento(selectedLead.nascimento)}</p></div>
                  <div><p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Telefone</p><p className="font-medium text-slate-900">{selectedLead.telefone}</p></div>
                  <div><p className="text-[10px] font-black uppercase tracking-widest text-slate-400">E-mail</p><p className="font-medium text-slate-900">{selectedLead.email || '-'}</p></div>
                  <div className="col-span-2"><p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Nome da Mãe</p><p className="font-medium text-slate-900 uppercase">{selectedLead.nome_mae || '-'}</p></div>
                  <div className="col-span-2"><p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Nome do Pai</p><p className="font-medium text-slate-900 uppercase">{selectedLead.nome_pai || '-'}</p></div>
                  <div className="col-span-2">
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Endereço Completo</p>
                    <p className="font-medium text-slate-900">
                      {selectedLead.rua || '-'}, {selectedLead.numero || '-'} - {selectedLead.bairro || '-'}. {selectedLead.cidade || '-'}/{selectedLead.uf || '-'}
                    </p>
                  </div>
                </div>
              </div>

              {/* DADOS DOS DEPENDENTES */}
              <div className="mb-10">
                <h4 className="flex items-center gap-2 text-sm font-black uppercase tracking-widest text-emerald-600 mb-4 border-b border-slate-100 pb-2">
                  <Users size={16} /> Dependentes
                </h4>
                
                {(() => {
                  let deps = [];
                  try { deps = typeof selectedLead.dependentes === 'string' ? JSON.parse(selectedLead.dependentes) : selectedLead.dependentes; } catch(e) {}
                  
                  if (!deps || deps.length === 0) {
                    return <p className="text-sm font-medium text-slate-500 italic">Nenhum dependente cadastrado.</p>;
                  }

                  return (
                    <div className="space-y-4">
                      {deps.map((dep, idx) => {
                        const isOpen = openDepIndex === idx;
                        return (
                          <div key={idx} className="bg-white border border-slate-200 rounded-2xl overflow-hidden transition-all duration-300">
                            
                            {/* Cabeçalho do Accordion */}
                            <div 
                              className="flex justify-between items-center p-4 cursor-pointer hover:bg-slate-50 transition-colors"
                              onClick={() => setOpenDepIndex(isOpen ? null : idx)}
                            >
                              <div className="flex items-center gap-3">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-black transition-colors ${isOpen ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-100 text-slate-500'}`}>
                                  {idx + 1}
                                </div>
                                <span className="font-bold text-slate-700 uppercase text-sm">
                                  {dep.nome || `Dependente ${idx + 1}`}
                                </span>
                              </div>
                              <div className={`text-slate-400 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}>
                                <ChevronDown size={20} />
                              </div>
                            </div>

                            {/* Corpo do Accordion (Ficha Completa do Dependente) */}
                            <div className={`transition-all duration-500 ease-in-out bg-slate-50 ${isOpen ? 'max-h-[1000px] opacity-100 border-t border-slate-100' : 'max-h-0 opacity-0 overflow-hidden'}`}>
                              <div className="p-5 grid grid-cols-2 gap-y-6 gap-x-4">
                                <div className="col-span-2"><p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Nome Completo</p><p className="font-bold text-slate-900 uppercase">{dep.nome || '-'}</p></div>
                                <div><p className="text-[10px] font-black uppercase tracking-widest text-slate-400">CPF</p><p className="font-medium text-slate-900">{dep.cpf || '-'}</p></div>
                                <div><p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Nascimento</p><p className="font-medium text-slate-900">{formatarNascimento(dep.nascimento)}</p></div>
                                <div className="col-span-2"><p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Nome da Mãe</p><p className="font-medium text-slate-900 uppercase">{dep.nomeMae || '-'}</p></div>
                                <div className="col-span-2"><p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Nome do Pai</p><p className="font-medium text-slate-900 uppercase">{dep.nomePai || '-'}</p></div>
                                <div className="col-span-2"><p className="text-[10px] font-black uppercase tracking-widest text-slate-400">E-mail</p><p className="font-medium text-slate-900">{dep.email || '-'}</p></div>
                                <div className="col-span-2"><p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Telefone / WhatsApp</p><p className="font-medium text-slate-900">{dep.telefone || '-'}</p></div>
                                <div className="col-span-2">
                                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Endereço</p>
                                  <p className="font-medium text-slate-900">
                                    {dep.rua || '-'}, {dep.numero || '-'} - {dep.bairro || '-'}. {dep.cidade || '-'}/{dep.uf || '-'}
                                  </p>
                                </div>
                              </div>
                            </div>

                          </div>
                        );
                      })}
                    </div>
                  );
                })()}
              </div>

            </div>
          </>
        )}
      </div>
    </div>
  );
}