"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { createClient } from '@supabase/supabase-js';
import { 
  Users, FileText, CheckCircle, Clock, Search, LogOut, ChevronRight, 
  Activity, ShieldAlert, X, User, ChevronDown, Lock, ArrowRight, 
  MessageSquare, LayoutDashboard, PhoneCall, Filter, BarChart3, Globe, Eye, RefreshCw, MapPin
} from 'lucide-react';

// Inicializa o Supabase no lado do cliente
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

// ==========================================
// SENHA MESTRA DA EQUIPE INTERNA
// ==========================================
const SENHA_EQUIPE = process.env.NEXT_PUBLIC_SENHA_PAINEL || '123456'; 

export default function PainelAdmin() {
  const [isMounted, setIsMounted] = useState(false);
  
  // Estados de Autenticação
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [passwordInput, setPasswordInput] = useState('');
  const [loginError, setLoginError] = useState(false);

  // Estados de Navegação
  const [activeTab, setActiveTab] = useState('adesoes'); // 'adesoes' | 'contatos' | 'analytics'

  // Estados de Dados - Adesões
  const [leads, setLeads] = useState([]);
  const [isLoadingLeads, setIsLoadingLeads] = useState(true);
  const [selectedLead, setSelectedLead] = useState(null);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const [openDepIndex, setOpenDepIndex] = useState(null);
  const [searchTermLeads, setSearchTermLeads] = useState('');

  // Estados de Dados - Contatos Clínica
  const [contatosClinica, setContatosClinica] = useState([]);
  const [isLoadingContatos, setIsLoadingContatos] = useState(true);
  const [selectedContato, setSelectedContato] = useState(null);
  const [isUpdatingContatoStatus, setIsUpdatingContatoStatus] = useState(false);
  const [searchTermContatos, setSearchTermContatos] = useState('');

  // Estados de Dados - Analytics
  const [report, setReport] = useState(null);
  const [loadingAnalytics, setLoadingAnalytics] = useState(true);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // 1. Verifica se já está logado ao abrir a página
  useEffect(() => {
    if (!isMounted) return;
    const authStatus = localStorage.getItem('plano_costa_auth');
    if (authStatus === 'true') {
      setIsAuthenticated(true);
    }
    setIsCheckingAuth(false);
  }, [isMounted]);

  // 2. Busca os dados APENAS se estiver logado
  useEffect(() => {
    if (isAuthenticated) {
      fetchLeads();
      fetchContatosClinica();
      fetchAnalytics(); // Carrega o analytics junto
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
    setLeads([]); 
    setContatosClinica([]);
    setReport(null);
  };

  // ==========================================
  // FUNÇÕES DE DADOS: ADESÕES
  // ==========================================
  async function fetchLeads() {
    setIsLoadingLeads(true);
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
      setIsLoadingLeads(false);
    }
  }

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

  // ==========================================
  // FUNÇÕES DE DADOS: CONTATOS
  // ==========================================
  async function fetchContatosClinica() {
    setIsLoadingContatos(true);
    try {
      const { data, error } = await supabase
        .from('contatos_clinica')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setContatosClinica(data || []);
    } catch (error) {
      console.error('Erro ao buscar contatos da clinica:', error.message);
    } finally {
      setIsLoadingContatos(false);
    }
  }

  const handleUpdateContatoStatus = async (novoStatus) => {
    if (!selectedContato) return;
    setIsUpdatingContatoStatus(true);
    try {
      const { error } = await supabase
        .from('contatos_clinica')
        .update({ status: novoStatus })
        .eq('id', selectedContato.id);

      if (error) throw error;

      setContatosClinica(contatosClinica.map(c => c.id === selectedContato.id ? { ...c, status: novoStatus } : c));
      setSelectedContato({ ...selectedContato, status: novoStatus });
    } catch (error) {
      alert("Erro ao atualizar o status do contato: " + error.message);
    } finally {
      setIsUpdatingContatoStatus(false);
    }
  };

  // ==========================================
  // FUNÇÕES DE DADOS: ANALYTICS
  // ==========================================
  const fetchAnalytics = async () => {
    setLoadingAnalytics(true);
    try {
      const res = await fetch('/api/analytics');
      const data = await res.json();
      const apiOk = Boolean(data?.ok);
      const hasRows = Array.isArray(data?.rows) && data.rows.length > 0;
      setReport({
        rows: Array.isArray(data?.rows) ? data.rows : [],
        unavailable: Boolean(data?.unavailable) || !apiOk,
        message: data?.message || data?.error || (!hasRows ? 'Sem dados de analytics no período selecionado.' : ''),
      });
    } catch (err) {
      console.error("Erro ao carregar painel:", err);
      setReport({
        rows: [],
        unavailable: true,
        message: 'Não foi possível carregar analytics.',
      });
    } finally {
      setLoadingAnalytics(false);
    }
  };

  // Cálculos agregados para o Analytics
  const analyticsTotalUsers = report?.rows?.reduce((acc, row) => acc + parseInt(row.metricValues[0].value || 0), 0) || 0;
  const analyticsTotalViews = report?.rows?.reduce((acc, row) => acc + parseInt(row.metricValues[1].value || 0), 0) || 0;

  // ==========================================
  // UTILITÁRIOS & FILTROS
  // ==========================================
  const filteredLeads = leads.filter(lead => 
    lead.nome.toLowerCase().includes(searchTermLeads.toLowerCase()) ||
    lead.cpf.includes(searchTermLeads)
  );

  const filteredContatos = contatosClinica.filter((contato) =>
    contato.nome?.toLowerCase().includes(searchTermContatos.toLowerCase()) ||
    contato.telefone?.includes(searchTermContatos)
  );

  const formatarData = (dataIso) => {
    return new Date(dataIso).toLocaleDateString('pt-BR', {
      day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit'
    }).replace(',', ' às');
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
      case 'Solicitado': return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'Em Andamento': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'Concluído': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case 'Cancelado': return 'bg-red-100 text-red-700 border-red-200';
      case 'Novo': return 'bg-violet-100 text-violet-700 border-violet-200';
      case 'Atendido': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      default: return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  // ==========================================
  // RENDER: TELAS DE LOADING E LOGIN
  // ==========================================
  if (!isMounted || isCheckingAuth) {
    return <div className="min-h-screen bg-slate-950 flex items-center justify-center"></div>;
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 selection:bg-purple-200 relative overflow-hidden">
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
              {loginError && <p className="text-[10px] font-black uppercase tracking-widest text-red-500 mt-2 ml-1 animate-pulse">Senha incorreta.</p>}
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
  // RENDER: PAINEL PRINCIPAL
  // ==========================================
  return (
    <div className="min-h-screen bg-slate-50 flex overflow-hidden font-sans">
      
      {/* MENU LATERAL */}
      <aside className="w-64 bg-slate-950 text-slate-400 flex flex-col fixed h-full z-10 shrink-0 shadow-2xl">
        <div className="p-8 border-b border-white/10">
          <div className="text-2xl font-black tracking-tighter uppercase text-white">Plano<span className="italic text-purple-500 font-light">Costa</span></div>
          <div className="text-[9px] uppercase tracking-widest mt-1 text-slate-500">Painel de Gestão</div>
        </div>
        
        <nav className="flex-1 p-4 space-y-2 mt-4">
          <p className="px-4 text-[10px] font-black uppercase tracking-widest text-slate-600 mb-4">Navegação</p>
          
          <button 
            onClick={() => setActiveTab('adesoes')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all duration-200 ${activeTab === 'adesoes' ? 'bg-purple-600 text-white shadow-lg shadow-purple-900/50' : 'hover:bg-white/5 hover:text-white'}`}
          >
            <Users size={18} /> Adesões do Plano
          </button>
          
          <button 
            onClick={() => setActiveTab('contatos')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all duration-200 ${activeTab === 'contatos' ? 'bg-purple-600 text-white shadow-lg shadow-purple-900/50' : 'hover:bg-white/5 hover:text-white'}`}
          >
            <PhoneCall size={18} /> Contatos Clínica
          </button>

          <button 
            onClick={() => setActiveTab('analytics')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all duration-200 ${activeTab === 'analytics' ? 'bg-purple-600 text-white shadow-lg shadow-purple-900/50' : 'hover:bg-white/5 hover:text-white'}`}
          >
            <BarChart3 size={18} /> Google Analytics
          </button>
        </nav>

        <div className="p-6 border-t border-white/10">
          <button onClick={handleLogout} className="flex items-center gap-3 text-sm font-bold hover:text-red-400 transition-colors w-full group">
            <LogOut size={18} className="group-hover:-translate-x-1 transition-transform" /> Sair do Sistema
          </button>
        </div>
      </aside>

      {/* CONTEÚDO PRINCIPAL */}
      <main className="flex-1 ml-64 p-8 md:p-10 relative h-screen overflow-y-auto">
        
        {/* ========================================================================= */}
        {/* VIEW: ADESÕES                                                             */}
        {/* ========================================================================= */}
        {activeTab === 'adesoes' && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <header className="flex flex-col md:flex-row md:justify-between md:items-end gap-6 mb-10">
              <div>
                <h1 className="text-3xl font-black text-slate-900 tracking-tighter">Gestão de Adesões</h1>
                <p className="text-sm text-slate-500 font-medium mt-1">Gerencie os novos clientes do plano de saúde.</p>
              </div>
              
              <div className="relative w-full md:w-80">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input 
                  type="text" 
                  placeholder="Buscar CPF ou Nome..." 
                  className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-500/10 transition-all shadow-sm"
                  value={searchTermLeads}
                  onChange={(e) => setSearchTermLeads(e.target.value)}
                />
              </div>
            </header>

            {/* KPIs Adesões */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-center">
                <div className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Total Registrado</div>
                <div className="text-3xl font-black text-slate-900">{leads.length}</div>
              </div>
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-center border-b-4 border-b-amber-400">
                <div className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Novos (Solicitados)</div>
                <div className="text-3xl font-black text-amber-600">{leads.filter(l => l.status === 'Solicitado').length}</div>
              </div>
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-center border-b-4 border-b-blue-400">
                <div className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Em Andamento (SIA)</div>
                <div className="text-3xl font-black text-blue-600">{leads.filter(l => l.status === 'Em Andamento').length}</div>
              </div>
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-center border-b-4 border-b-emerald-400">
                <div className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Concluídos</div>
                <div className="text-3xl font-black text-emerald-600">{leads.filter(l => l.status === 'Concluído').length}</div>
              </div>
            </div>

            {/* Tabela Adesões */}
            <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden min-h-[400px]">
              <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/50">
                <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2"><LayoutDashboard size={16}/> Lista de Leads</h3>
                <button onClick={fetchLeads} className="text-xs font-bold text-purple-600 hover:text-purple-700 uppercase tracking-wider flex items-center gap-1">
                  <RefreshCw size={12} /> Atualizar Lista
                </button>
              </div>

              {isLoadingLeads ? (
                <div className="flex flex-col items-center justify-center h-64 text-slate-400">
                  <div className="w-8 h-8 border-4 border-slate-200 border-t-purple-600 rounded-full animate-spin mb-4" />
                  <p className="text-sm font-bold uppercase tracking-widest">Carregando dados...</p>
                </div>
              ) : filteredLeads.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-64 text-slate-400">
                  <Filter size={48} className="text-slate-200 mb-4" />
                  <p className="text-sm font-bold uppercase tracking-widest">Nenhum registro encontrado.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-white border-b border-slate-100 text-[10px] uppercase tracking-widest text-slate-400">
                        <th className="p-5 font-black">Data do Cadastro</th>
                        <th className="p-5 font-black">Cliente</th>
                        <th className="p-5 font-black">Plano Escolhido</th>
                        <th className="p-5 font-black text-center">Deps.</th>
                        <th className="p-5 font-black">Status Atual</th>
                        <th className="p-5 font-black text-right">Ação</th>
                      </tr>
                    </thead>
                    <tbody className="text-sm font-medium text-slate-700 divide-y divide-slate-50">
                      {filteredLeads.map((lead) => {
                        let deps = [];
                        try { deps = typeof lead.dependentes === 'string' ? JSON.parse(lead.dependentes) : lead.dependentes; } catch(e) {}

                        return (
                          <tr key={lead.id} className="hover:bg-slate-50 transition-colors group cursor-pointer" onClick={() => { setSelectedLead(lead); setOpenDepIndex(null); }}>
                            <td className="p-5 text-xs text-slate-500 whitespace-nowrap">{formatarData(lead.created_at)}</td>
                            <td className="p-5">
                              <div className="font-bold text-slate-900 uppercase text-xs">{lead.nome}</div>
                              <div className="text-[11px] text-slate-400 mt-1">{lead.telefone} • {lead.cpf}</div>
                            </td>
                            <td className="p-5">
                              <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-[9px] font-black uppercase tracking-widest border ${
                                lead.plano === 'Diamante' ? 'bg-sky-50 text-sky-700 border-sky-200' : 
                                lead.plano === 'Esmeralda' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 
                                'bg-orange-50 text-orange-700 border-orange-200'
                              }`}>{lead.plano}</span>
                            </td>
                            <td className="p-5 text-center">
                              <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-slate-100 text-slate-600 font-bold text-xs">
                                {deps ? deps.length : 0}
                              </span>
                            </td>
                            <td className="p-5">
                              <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border ${getStatusColor(lead.status)}`}>
                                <div className={`w-1.5 h-1.5 rounded-full bg-current`} />
                                {lead.status}
                              </span>
                            </td>
                            <td className="p-5 text-right">
                              <button className="text-slate-400 group-hover:text-purple-600 transition-colors">
                                <ChevronRight size={20} />
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
          </div>
        )}

        {/* ========================================================================= */}
        {/* VIEW: CONTATOS DA CLÍNICA                                                 */}
        {/* ========================================================================= */}
        {activeTab === 'contatos' && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <header className="flex flex-col md:flex-row md:justify-between md:items-end gap-6 mb-10">
              <div>
                <h1 className="text-3xl font-black text-slate-900 tracking-tighter">Contatos da Clínica</h1>
                <p className="text-sm text-slate-500 font-medium mt-1">Mensagens enviadas através do site do centro clínico.</p>
              </div>
              
              <div className="relative w-full md:w-80">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input 
                  type="text" 
                  placeholder="Buscar Nome ou Telefone..." 
                  className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-500/10 transition-all shadow-sm"
                  value={searchTermContatos}
                  onChange={(e) => setSearchTermContatos(e.target.value)}
                />
              </div>
            </header>

            {/* KPIs Contatos */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-center">
                <div className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Total de Mensagens</div>
                <div className="text-3xl font-black text-slate-900">{contatosClinica.length}</div>
              </div>
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-center border-b-4 border-b-violet-400">
                <div className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Novos (Não lidos)</div>
                <div className="text-3xl font-black text-violet-600">{contatosClinica.filter(c => (c.status || 'Novo') === 'Novo').length}</div>
              </div>
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-center border-b-4 border-b-emerald-400">
                <div className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Atendidos</div>
                <div className="text-3xl font-black text-emerald-600">{contatosClinica.filter(c => c.status === 'Atendido').length}</div>
              </div>
            </div>

            {/* Tabela Contatos */}
            <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden min-h-[400px]">
              <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/50">
                <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2"><MessageSquare size={16}/> Caixa de Entrada</h3>
                <button onClick={fetchContatosClinica} className="text-xs font-bold text-purple-600 hover:text-purple-700 uppercase tracking-wider flex items-center gap-1">
                  <RefreshCw size={12} /> Atualizar Lista
                </button>
              </div>

              {isLoadingContatos ? (
                <div className="flex flex-col items-center justify-center h-64 text-slate-400">
                  <div className="w-8 h-8 border-4 border-slate-200 border-t-violet-600 rounded-full animate-spin mb-4" />
                  <p className="text-sm font-bold uppercase tracking-widest">Carregando mensagens...</p>
                </div>
              ) : filteredContatos.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-64 text-slate-400">
                  <ShieldAlert size={48} className="text-slate-200 mb-4" />
                  <p className="text-sm font-bold uppercase tracking-widest">Nenhuma mensagem encontrada.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-white border-b border-slate-100 text-[10px] uppercase tracking-widest text-slate-400">
                        <th className="p-5 font-black">Data</th>
                        <th className="p-5 font-black">Nome do Paciente</th>
                        <th className="p-5 font-black">Telefone</th>
                        <th className="p-5 font-black">Prévia da Mensagem</th>
                        <th className="p-5 font-black">Status</th>
                        <th className="p-5 font-black text-right">Abrir</th>
                      </tr>
                    </thead>
                    <tbody className="text-sm font-medium text-slate-700 divide-y divide-slate-50">
                      {filteredContatos.map((contato) => (
                        <tr key={contato.id} className="hover:bg-slate-50 transition-colors cursor-pointer group" onClick={() => setSelectedContato(contato)}>
                          <td className="p-5 text-xs text-slate-500 whitespace-nowrap">{formatarData(contato.created_at)}</td>
                          <td className="p-5 font-bold text-slate-900 uppercase text-xs">{contato.nome}</td>
                          <td className="p-5 text-[12px] text-slate-600">{contato.telefone}</td>
                          <td className="p-5 text-[12px] text-slate-500 max-w-[300px]">
                            <p className="truncate">{contato.mensagem}</p>
                          </td>
                          <td className="p-5">
                            <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border ${getStatusColor(contato.status || 'Novo')}`}>
                              <div className="w-1.5 h-1.5 rounded-full bg-current" />
                              {contato.status || 'Novo'}
                            </span>
                          </td>
                          <td className="p-5 text-right">
                            <button className="text-slate-400 group-hover:text-purple-600 transition-colors">
                              <ChevronRight size={20} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* VIEW: ANALYTICS                                                           */}
        {/* ========================================================================= */}
        {activeTab === 'analytics' && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-8">
            <header className="flex flex-col md:flex-row md:justify-between md:items-end gap-6">
              <div>
                <h1 className="text-3xl font-black text-slate-900 tracking-tighter">Inteligência de Tráfego</h1>
                <p className="text-sm text-slate-500 font-medium mt-1">Análise detalhada do ecossistema Grupo Costa.</p>
              </div>
              <button onClick={fetchAnalytics} className="px-5 py-3 bg-slate-900 text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-purple-600 transition-all shadow-lg flex items-center gap-2">
                <RefreshCw size={14} className={loadingAnalytics ? "animate-spin" : ""} /> {loadingAnalytics ? 'Sincronizando...' : 'Atualizar Dados'}
              </button>
            </header>

            {/* 1. ROW DE KPIS PRINCIPAIS */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {[
                { label: 'Usuários Ativos', val: analyticsTotalUsers, icon: <Users size={20}/>, color: 'text-blue-600', bg: 'bg-blue-50' },
                { label: 'Visualizações', val: analyticsTotalViews, icon: <Eye size={20}/>, color: 'text-emerald-600', bg: 'bg-emerald-50' },
                { label: 'Tempo Médio', val: `${Math.round(report?.rows?.[0]?.metricValues[2].value || 0)}s`, icon: <Clock size={20}/>, color: 'text-amber-600', bg: 'bg-amber-50' },
                { label: 'Taxa Rejeição', val: `${(parseFloat(report?.rows?.[0]?.metricValues[3].value || 0) * 100).toFixed(1)}%`, icon: <ShieldAlert size={20}/>, color: 'text-red-600', bg: 'bg-red-50' },
              ].map((kpi, i) => (
                <div key={i} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                  <div className={`${kpi.bg} ${kpi.color} w-10 h-10 rounded-lg flex items-center justify-center mb-4`}>
                    {kpi.icon}
                  </div>
                  <div className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">{kpi.label}</div>
                  <div className="text-2xl font-black text-slate-900">{loadingAnalytics ? '...' : kpi.val}</div>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              
              {/* 2. PERFORMANCE POR EMPRESA (PÁGINA) */}
              <div className="lg:col-span-2 bg-white border border-slate-200 rounded-3xl shadow-sm overflow-hidden">
                <div className="px-6 py-5 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
                  <h3 className="text-sm font-black uppercase tracking-tighter text-slate-800 flex items-center gap-2"><Globe size={18} className="text-purple-600"/> Acessos por Landing Page</h3>
                  <span className="text-[10px] font-bold bg-purple-100 text-purple-700 px-2 py-1 rounded-md uppercase">Top Performance</span>
                </div>
                <div className="p-0 overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="text-[10px] uppercase tracking-widest text-slate-400 border-b border-slate-50">
                        <th className="px-6 py-4 font-black">Página</th>
                        <th className="px-6 py-4 font-black text-center">Acessos</th>
                        <th className="px-6 py-4 font-black">Engajamento</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                      {report?.rows?.slice(0, 8).map((row, i) => {
                        const pagePath = row.dimensionValues[0].value;
                        const views = parseInt(row.metricValues[1].value);
                        const percentage = Math.min((views / analyticsTotalViews) * 100, 100);
                        
                        return (
                          <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                            <td className="px-6 py-4">
                              <div className="text-xs font-bold text-slate-800 truncate max-w-[200px]">{pagePath === '/' ? 'Home Principal' : pagePath}</div>
                            </td>
                            <td className="px-6 py-4 text-center">
                              <span className="text-xs font-black text-slate-900">{views}</span>
                            </td>
                            <td className="px-6 py-4">
                              <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                                <div className="bg-purple-500 h-full rounded-full" style={{ width: `${percentage}%` }} />
                              </div>
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* 3. DISPOSITIVOS E ORIGEM */}
              <div className="space-y-8">
                {/* Card Dispositivos */}
                <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
                  <h3 className="text-xs font-black uppercase tracking-widest text-slate-800 mb-6 flex items-center gap-2"><Activity size={16} className="text-blue-500"/> Dispositivos</h3>
                  <div className="space-y-4">
                    {/* Aqui você faria um map real dos dados de deviceCategory, vou simular a lógica visual */}
                    {[
                      { label: 'Mobile', icon: <PhoneCall size={14}/>, color: 'bg-blue-500', pct: 75 },
                      { label: 'Desktop', icon: <Users size={14}/>, color: 'bg-slate-800', pct: 20 },
                      { label: 'Tablet', icon: <Activity size={14}/>, color: 'bg-slate-400', pct: 5 }
                    ].map((dev, i) => (
                      <div key={i}>
                        <div className="flex justify-between text-[10px] font-black uppercase mb-1">
                          <span className="flex items-center gap-1">{dev.icon} {dev.label}</span>
                          <span>{dev.pct}%</span>
                        </div>
                        <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                          <div className={`${dev.color} h-full`} style={{ width: `${dev.pct}%` }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Card Localização (Cidades) */}
                <div className="bg-slate-900 p-6 rounded-3xl shadow-xl shadow-slate-900/20 text-white">
                  <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-6 flex items-center gap-2"><MapPin size={16} className="text-emerald-400"/> Top Cidades</h3>
                  <div className="space-y-4">
                    {report?.rows?.slice(0, 4).map((row, i) => (
                      <div key={i} className="flex items-center justify-between border-b border-white/5 pb-2">
                        <span className="text-xs font-bold text-slate-200">{row.dimensionValues[3].value}</span>
                        <span className="text-[10px] font-black text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded">
                          {row.metricValues[0].value} users
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

      </main>

      {/* ========================================================================= */}
      {/* OVERLAY GLOBAL PARA OS SLIDE-OVERS                                        */}
      {/* ========================================================================= */}
      {(selectedLead || selectedContato) && (
        <div 
          className="fixed inset-0 bg-slate-950/40 backdrop-blur-sm z-40 transition-opacity"
          onClick={() => { setSelectedLead(null); setSelectedContato(null); }}
        />
      )}

      {/* ========================================================================= */}
      {/* SLIDE-OVER: FICHA DE ADESÃO COMPLETA                                      */}
      {/* ========================================================================= */}
      <div className={`fixed top-0 right-0 h-full w-full max-w-2xl bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out flex flex-col ${selectedLead ? 'translate-x-0' : 'translate-x-full'}`}>
        {selectedLead && (
          <>
            <header className="px-8 py-6 border-b border-slate-100 flex justify-between items-start bg-slate-50 shrink-0">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <h2 className="text-2xl font-black text-slate-900 uppercase">{selectedLead.nome}</h2>
                  <span className={`px-2.5 py-1 rounded-md text-[9px] font-black uppercase tracking-widest border ${
                    selectedLead.plano === 'Diamante' ? 'bg-sky-50 text-sky-700 border-sky-200' : 
                    selectedLead.plano === 'Esmeralda' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 
                    'bg-orange-50 text-orange-700 border-orange-200'
                  }`}>
                    {selectedLead.plano}
                  </span>
                </div>
                <p className="text-sm text-slate-500 font-medium">Cadastrado em {formatarData(selectedLead.created_at)}</p>
              </div>
              <button onClick={() => setSelectedLead(null)} className="p-2 bg-white rounded-full text-slate-400 hover:text-slate-900 shadow-sm border border-slate-200 hover:bg-slate-100 transition-colors">
                <X size={20} />
              </button>
            </header>

            <div className="px-8 py-4 bg-white border-b border-slate-100 flex items-center justify-between shrink-0">
              <div className="text-[10px] font-black uppercase tracking-widest text-slate-400">Alterar Status:</div>
              <div className="flex items-center gap-3">
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
              <div className="mb-8 p-6 bg-slate-900 rounded-2xl flex justify-between items-center text-white shadow-xl shadow-slate-900/10">
                <div>
                  <div className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Adesão + Pró-Rata Calculada</div>
                  <div className="text-3xl font-black text-emerald-400">R$ {selectedLead.valor_total}</div>
                </div>
              </div>

              <div className="mb-10">
                <h4 className="flex items-center gap-2 text-sm font-black uppercase tracking-widest text-slate-800 mb-6 pb-3 border-b border-slate-100">
                  <User size={18} className="text-purple-600"/> Dados do Titular
                </h4>
                <div className="grid grid-cols-2 gap-y-6 gap-x-4 bg-slate-50 p-6 rounded-2xl border border-slate-100">
                  <div><p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">CPF</p><p className="font-bold text-slate-900">{selectedLead.cpf}</p></div>
                  <div><p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Nascimento</p><p className="font-bold text-slate-900">{formatarNascimento(selectedLead.nascimento)}</p></div>
                  <div><p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Telefone</p><p className="font-bold text-slate-900">{selectedLead.telefone}</p></div>
                  <div><p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">E-mail</p><p className="font-bold text-slate-900">{selectedLead.email || '-'}</p></div>
                  <div className="col-span-2"><p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Nome da Mãe</p><p className="font-bold text-slate-900 uppercase">{selectedLead.nome_mae || '-'}</p></div>
                  <div className="col-span-2">
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Endereço Completo</p>
                    <p className="font-bold text-slate-900">
                      {selectedLead.rua || '-'}, {selectedLead.numero || '-'} - {selectedLead.bairro || '-'}. {selectedLead.cidade || '-'}/{selectedLead.uf || '-'}
                    </p>
                  </div>
                </div>
              </div>

              <div className="mb-10">
                <h4 className="flex items-center gap-2 text-sm font-black uppercase tracking-widest text-slate-800 mb-6 pb-3 border-b border-slate-100">
                  <Users size={18} className="text-emerald-600"/> Dependentes
                </h4>
                
                {(() => {
                  let deps = [];
                  try { deps = typeof selectedLead.dependentes === 'string' ? JSON.parse(selectedLead.dependentes) : selectedLead.dependentes; } catch(e) {}
                  
                  if (!deps || deps.length === 0) {
                    return <p className="text-sm font-medium text-slate-500 italic bg-slate-50 p-4 rounded-xl text-center border border-slate-100">Nenhum dependente cadastrado.</p>;
                  }

                  return (
                    <div className="space-y-4">
                      {deps.map((dep, idx) => {
                        const isOpen = openDepIndex === idx;
                        return (
                          <div key={idx} className="bg-white border border-slate-200 rounded-2xl overflow-hidden transition-all duration-300 shadow-sm">
                            <div 
                              className="flex justify-between items-center p-5 cursor-pointer hover:bg-slate-50 transition-colors"
                              onClick={() => setOpenDepIndex(isOpen ? null : idx)}
                            >
                              <div className="flex items-center gap-4">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-black transition-colors ${isOpen ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-600'}`}>
                                  {idx + 1}
                                </div>
                                <span className="font-bold text-slate-800 uppercase text-sm">
                                  {dep.nome || `Dependente ${idx + 1}`}
                                </span>
                              </div>
                              <div className={`text-slate-400 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}>
                                <ChevronDown size={20} />
                              </div>
                            </div>

                            <div className={`transition-all duration-500 ease-in-out bg-slate-50 ${isOpen ? 'max-h-[1000px] opacity-100 border-t border-slate-100' : 'max-h-0 opacity-0 overflow-hidden'}`}>
                              <div className="p-6 grid grid-cols-2 gap-y-6 gap-x-4">
                                <div className="col-span-2"><p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">CPF</p><p className="font-bold text-slate-900">{dep.cpf || '-'}</p></div>
                                <div><p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Nascimento</p><p className="font-bold text-slate-900">{formatarNascimento(dep.nascimento)}</p></div>
                                <div><p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Telefone</p><p className="font-bold text-slate-900">{dep.telefone || '-'}</p></div>
                                <div className="col-span-2"><p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Nome da Mãe</p><p className="font-bold text-slate-900 uppercase">{dep.nomeMae || '-'}</p></div>
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

      {/* ========================================================================= */}
      {/* SLIDE-OVER: MENSAGEM DO CONTATO CLÍNICA                                   */}
      {/* ========================================================================= */}
      <div className={`fixed top-0 right-0 h-full w-full max-w-md bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out flex flex-col ${selectedContato ? 'translate-x-0' : 'translate-x-full'}`}>
        {selectedContato && (
          <>
            <header className="px-6 py-6 border-b border-slate-100 flex justify-between items-start bg-slate-50 shrink-0">
              <div>
                <h2 className="text-xl font-black text-slate-900 uppercase mb-1">Detalhes do Contato</h2>
                <p className="text-xs text-slate-500 font-medium">Enviado em {formatarData(selectedContato.created_at)}</p>
              </div>
              <button onClick={() => setSelectedContato(null)} className="p-2 bg-white rounded-full text-slate-400 hover:text-slate-900 shadow-sm border border-slate-200 hover:bg-slate-100 transition-colors">
                <X size={18} />
              </button>
            </header>

            <div className="px-6 py-4 bg-white border-b border-slate-100 shrink-0">
              <div className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Status do Atendimento:</div>
              <div className="flex items-center gap-3">
                <select 
                  value={selectedContato.status || 'Novo'}
                  onChange={(e) => handleUpdateContatoStatus(e.target.value)}
                  disabled={isUpdatingContatoStatus}
                  className={`w-full appearance-none font-bold text-xs uppercase tracking-widest px-4 py-3 rounded-xl border outline-none cursor-pointer pr-10 bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cpath%20d%3D%22M6%209L12%2015L18%209%22%20stroke%3D%22%2364748B%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%2F%3E%3C%2Fsvg%3E')] bg-no-repeat bg-[position:right_10px_center] bg-[length:16px] ${getStatusColor(selectedContato.status || 'Novo')}`}
                >
                  <option value="Novo">🆕 Novo (Não lido)</option>
                  <option value="Atendido">✅ Atendido</option>
                  <option value="Cancelado">❌ Descartado</option>
                </select>
                {isUpdatingContatoStatus && <div className="w-5 h-5 border-2 border-slate-200 border-t-purple-600 rounded-full animate-spin shrink-0" />}
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6 bg-white space-y-6">
              <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100">
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Nome do Paciente</p>
                <p className="font-bold text-slate-900 text-lg uppercase">{selectedContato.nome}</p>
              </div>

              <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100">
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Telefone / WhatsApp</p>
                <div className="flex items-center justify-between">
                  <p className="font-bold text-slate-900 text-lg">{selectedContato.telefone}</p>
                  <a 
                    href={`https://wa.me/55${selectedContato.telefone?.replace(/\D/g, '')}`} 
                    target="_blank" 
                    rel="noreferrer"
                    className="px-4 py-2 bg-emerald-100 text-emerald-700 text-xs font-black uppercase tracking-widest rounded-lg hover:bg-emerald-200 transition-colors"
                  >
                    Abrir Whats
                  </a>
                </div>
              </div>

              <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100">
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3">Mensagem Recebida</p>
                <p className="text-slate-700 whitespace-pre-wrap leading-relaxed font-medium">
                  {selectedContato.mensagem || "O usuário não deixou nenhuma mensagem adicional."}
                </p>
              </div>
            </div>
          </>
        )}
      </div>

    </div>
  );
}