"use client";

import React, { useState } from 'react';
import { Users, FileText, CheckCircle, Clock, Search, LogOut, ChevronRight, Activity, Heart, Shield } from 'lucide-react';

// Dados Fictícios (No futuro, virão do Banco de Dados)
const mockLeads = [
  { id: 1, nome: "Carlos Eduardo Oliveira", cpf: "111.222.333-44", telefone: "(51) 99888-7777", plano: "Diamante", status: "Pendente", data: "25 Mar 2026", dependentes: 3, total: "R$ 109,98" },
  { id: 2, nome: "Ana Paula Silva", cpf: "555.666.777-88", telefone: "(51) 98888-1111", plano: "Esmeralda", status: "SIA Atualizado", data: "25 Mar 2026", dependentes: 2, total: "R$ 89,98" },
  { id: 3, nome: "Roberto Costa", cpf: "999.000.111-22", telefone: "(51) 97777-2222", plano: "Topázio", status: "Concluído", data: "24 Mar 2026", dependentes: 1, total: "R$ 69,98" },
];

export default function PainelAdmin() {
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <div className="min-h-screen bg-slate-50 flex">
      
      {/* MENU LATERAL (SIDEBAR) */}
      <aside className="w-64 bg-slate-950 text-slate-400 flex flex-col fixed h-full z-10">
        <div className="p-6 border-b border-white/10">
          <div className="text-xl font-black tracking-tighter uppercase text-white">Plano<span className="italic text-purple-500 font-light">Costa</span></div>
          <div className="text-[9px] uppercase tracking-widest mt-1 text-slate-500">Painel Interno</div>
        </div>
        
        <nav className="flex-1 p-4 space-y-2">
          <a href="#" className="flex items-center gap-3 px-4 py-3 bg-purple-600/10 text-purple-400 rounded-xl font-bold transition-colors">
            <Users size={18} /> Novas Adesões
          </a>
          <a href="#" className="flex items-center gap-3 px-4 py-3 hover:bg-white/5 hover:text-white rounded-xl font-bold transition-colors">
            <FileText size={18} /> Relatórios SIA
          </a>
        </nav>

        <div className="p-6 border-t border-white/10">
          <button className="flex items-center gap-3 text-sm font-bold hover:text-white transition-colors w-full">
            <LogOut size={18} /> Sair do Sistema
          </button>
        </div>
      </aside>

      {/* CONTEÚDO PRINCIPAL */}
      <main className="flex-1 ml-64 p-8 md:p-12">
        
        <header className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tighter">Gestão de Adesões</h1>
            <p className="text-sm text-slate-500 font-medium mt-1">Gerencie os novos clientes vindos do site.</p>
          </div>
          
          {/* Caixa de Pesquisa */}
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

        {/* CARDS DE RESUMO (MÉTRICAS) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 bg-amber-50 text-amber-500 rounded-xl flex items-center justify-center"><Clock size={24} /></div>
            <div>
              <div className="text-[10px] font-black uppercase tracking-widest text-slate-400">Aguardando SIA</div>
              <div className="text-2xl font-black text-slate-900">12</div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-50 text-blue-500 rounded-xl flex items-center justify-center"><Activity size={24} /></div>
            <div>
              <div className="text-[10px] font-black uppercase tracking-widest text-slate-400">Novos (Hoje)</div>
              <div className="text-2xl font-black text-slate-900">05</div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 bg-emerald-50 text-emerald-500 rounded-xl flex items-center justify-center"><CheckCircle size={24} /></div>
            <div>
              <div className="text-[10px] font-black uppercase tracking-widest text-slate-400">Ativos no Mês</div>
              <div className="text-2xl font-black text-slate-900">48</div>
            </div>
          </div>
        </div>

        {/* TABELA DE CLIENTES */}
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-[10px] uppercase tracking-widest text-slate-500">
                  <th className="p-4 font-black">Data</th>
                  <th className="p-4 font-black">Titular</th>
                  <th className="p-4 font-black">Plano</th>
                  <th className="p-4 font-black text-center">Dependentes</th>
                  <th className="p-4 font-black">Valor (Adesão+Pró)</th>
                  <th className="p-4 font-black">Status</th>
                  <th className="p-4 font-black text-right">Ação</th>
                </tr>
              </thead>
              <tbody className="text-sm font-medium text-slate-700 divide-y divide-slate-100">
                {mockLeads.map((lead) => (
                  <tr key={lead.id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="p-4 text-slate-500">{lead.data}</td>
                    <td className="p-4">
                      <div className="font-bold text-slate-900">{lead.nome}</div>
                      <div className="text-xs text-slate-400">{lead.telefone} • {lead.cpf}</div>
                    </td>
                    <td className="p-4">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-widest ${
                        lead.plano === 'Diamante' ? 'bg-blue-50 text-blue-600' : 
                        lead.plano === 'Esmeralda' ? 'bg-emerald-50 text-emerald-600' : 
                        'bg-orange-50 text-orange-600'
                      }`}>
                        {lead.plano}
                      </span>
                    </td>
                    <td className="p-4 text-center font-bold text-slate-900">{lead.dependentes}</td>
                    <td className="p-4 font-bold text-slate-900">{lead.total}</td>
                    <td className="p-4">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${
                        lead.status === 'Pendente' ? 'bg-amber-50 text-amber-600 border-amber-200' : 
                        lead.status === 'Concluído' ? 'bg-emerald-50 text-emerald-600 border-emerald-200' : 
                        'bg-blue-50 text-blue-600 border-blue-200'
                      }`}>
                        <div className={`w-1.5 h-1.5 rounded-full ${
                          lead.status === 'Pendente' ? 'bg-amber-500' : 
                          lead.status === 'Concluído' ? 'bg-emerald-500' : 
                          'bg-blue-500'
                        }`} />
                        {lead.status}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <button className="p-2 text-slate-400 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors">
                        <ChevronRight size={20} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </main>
    </div>
  );
}