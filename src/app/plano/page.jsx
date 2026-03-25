"use client";
import React, { useRef, useState, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import LenisProvider from '../components/LenisProvider';
import CheckoutModal from '../components/CheckoutModal';
import { 
  Shield, Stethoscope, Truck, Heart, Briefcase, 
  MapPin, Plus, Microscope, Activity, ShoppingBag, 
  Hospital, Info, Check, ChevronDown, Building, Users, 
  FlaskConical, Map, Accessibility, Percent, MessageCircle, Phone
} from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

export default function page() {
  const container = useRef();
  const [isScrolled, setIsScrolled] = useState(false);
  const [openFaq, setOpenFaq] = useState(0);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [selectedPlanForCheckout, setSelectedPlanForCheckout] = useState(null);

  // Controle do background do Header dinâmico no scroll
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 80);
    };
    
    window.addEventListener('scroll', handleScroll);
    handleScroll(); 
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useGSAP(() => {
    // 1. Animação de entrada do Hero
    gsap.from(".hero-text", {
      y: 50,
      opacity: 0,
      duration: 1,
      stagger: 0.15,
      ease: "power3.out",
      delay: 0.1
    });

    // 2. Animação de entrada suave dos blocos gerais
    gsap.utils.toArray('.fade-up').forEach((elem) => {
      gsap.from(elem, {
        scrollTrigger: {
          trigger: elem,
          start: "top 85%", 
          toggleActions: "play none none none"
        },
        y: 40,
        opacity: 0,
        duration: 0.8,
        ease: "power3.out"
      });
    });

    // 3. ANIMAÇÃO ESTILO "LENIS BRINGS THE HEAT" (Agora com 4 cards otimizados)
    const cards = gsap.utils.toArray('.stack-card');

    // Verifica se é mobile (telas menores que 768px)
    const isMobile = window.innerWidth < 768;
    
    if (cards.length > 0) {
      gsap.set(cards, {
        x: "100vw", // Fora da tela à direita
        y: "50vh",  // Baixo
        opacity: 0,
        rotation: 15, // Leve rotação inicial
      });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: ".stacking-container",
          start: "top top", 
          end: `+=${cards.length * 100}%`, // Duração ajustada perfeitamente para 4 cards
          pin: true, 
          scrub: 1, 
        }
      });

    cards.forEach((card, index) => {
      tl.to(card, {
        // Se for mobile, X é 0 (fica reto). Se for desktop, faz a diagonal (index * 40)
        x: isMobile ? 0 : index * 40, 
        
        // Y levemente menor no mobile para não ocupar muito espaço da tela
        y: isMobile ? index * 20 : index * 25, 
        
        opacity: 1,
        rotation: 0, 
        duration: 0.4, 
        ease: "power3.out"
      })
      .to({}, { duration: 0.6 }); // Pausa para o scroll
    });
    }

  }, { scope: container });

  const faqs = [
    {
      q: "Quando poderei acessar os benefícios do Plano Costa?",
      a: "Imediatamente após contratar o serviço. Não há carência para começar a utilizar os nossos descontos em consultas e exames."
    },
    {
      q: "A ambulância 24h possui algum custo?",
      a: "A nossa ambulância é totalmente gratuita exclusivamente para casos de emergência ocorridos dentro do perímetro urbano de Taquari."
    },
    {
      q: "Como funciona a locação de equipamentos?",
      a: "Associados têm acesso facilitado e valores especiais para locação de itens como andadores, cadeiras de rodas, camas hospitalares, muletas e nebulizadores."
    },
    {
      q: "Onde o plano oferece cobertura?",
      a: "Nossa rede de parceiros abrange diversas cidades, incluindo Taquari, Lajeado, Estrela, Montenegro, Canoas, Porto Alegre, Tabaí, Triunfo, Teutônia e Paverama."
    }
  ];

  // AGRUPAMENTO ESTRATÉGICO: 12 Benefícios transformados em 4 Pilares
  const beneficiosAgrupados = [
    {
      title: "Medicina & Hospitalar",
      icon: <Hospital size={40} strokeWidth={1.5} />,
      items: [
        "Acesso à internações hospitalares",
        "Tratamentos médicos especializados",
        "Atendimento humanizado e próximo"
      ]
    },
    {
      title: "Saúde Integrada & Exames",
      icon: <Microscope size={40} strokeWidth={1.5} />,
      items: [
        "Tratamentos Odontológicos e Profissionais de Saúde",
        "Acesso à Exames Complementares",
        "Acesso à Exames Laboratoriais"
      ]
    },
    {
      title: "Cobertura & Estrutura",
      icon: <MapPin size={40} strokeWidth={1.5} />,
      items: [
        "Acesso à Ampla Rede de Convênios",
        "Ampla Área de Abrangência Estadual",
        "Serviços de Ambulância 24h"
      ]
    },
    {
      title: "Apoio & Vantagens",
      icon: <Heart size={40} strokeWidth={1.5} />,
      items: [
        "Equipamentos Ortopédicos e Hospitalares",
        "Acesso à Descontos no Comércio",
        "Auxílio Funeral de até R$ 5.000"
      ]
    }
  ];

  const planos = [
    {
      name: "Topázio",
      tagline: "Cuidado essencial para você e sua família",
      price: "19,99",
      users: "1 + 1",
      usersDetail: "Titular + cônjuge, filho(a), pai ou mãe",
      network: "Rede Local",
      networkDetail: "Acesso à rede de convênios em Taquari",
      ambulance: "Ambulância 24h",
      ambulanceDetail: "Remoções intra-hospitalares e urbanas valor exclusivo",
      funeral: "R$ 1.000,00",
      color: "text-orange-500",
      border: "border-orange-200",
      bg: "bg-orange-50",
      button: "bg-orange-500 hover:bg-orange-600",
      featured: false
    },
    {
      name: "Esmeralda",
      tagline: "Proteção ampliada para toda a sua família",
      price: "39,99",
      users: "1 + 4",
      usersDetail: "Inclui sogros, sobrinhos e tios",
      network: "Local + Regional",
      networkDetail: "Cobertura expandida na região",
      ambulance: "Ambulância 24h",
      ambulanceDetail: "Gratuita para casos de emergência dentro do perímetro urbano de Taquari",
      funeral: "R$ 3.000,00",
      color: "text-emerald-500",
      border: "border-emerald-200",
      bg: "bg-emerald-50",
      button: "bg-emerald-500 hover:bg-emerald-600",
      featured: true
    },
    {
      name: "Diamante",
      tagline: "Cuidado completo para quem busca o melhor",
      price: "59,99",
      users: "1 + 7",
      usersDetail: "Família completa com máxima abrangência",
      network: "Local + Regional",
      networkDetail: "Prioridade em especialistas",
      ambulance: "Ambulância 24h",
      ambulanceDetail: "Gratuita para casos de emergência dentro do perímetro urbano de Taquari",
      funeral: "R$ 5.000,00",
      color: "text-blue-500",
      border: "border-blue-200",
      bg: "bg-blue-50",
      button: "bg-blue-600 hover:bg-blue-700",
      featured: false
    }
  ];

  const openCheckout = (plan) => {
    setSelectedPlanForCheckout(plan);
    setIsCheckoutOpen(true);
  };

  return (
    <LenisProvider>
    <div ref={container} className="min-h-screen bg-[#fafafa] text-slate-900 font-sans selection:bg-purple-200">
      
      {/* NAVBAR */}
      <nav 
        className={`fixed top-0 w-full z-50 transition-all duration-500 ease-in-out ${
          isScrolled 
            ? 'bg-slate-950/95 backdrop-blur-md py-4 px-6 shadow-xl text-white' 
            : 'bg-transparent py-6 px-6 text-white'
        }`}
      >
        <div className="flex justify-between items-center max-w-7xl mx-auto">
          <div className="text-xl font-black tracking-tighter uppercase">Plano<span className="italic font-light">Costa</span></div>
          <div className="hidden lg:flex gap-10 text-[11px] font-bold uppercase tracking-[0.2em]">
            <a href="#beneficios" className="hover:opacity-50 transition-opacity">Benefícios</a>
            <a href="#empresas" className="hover:opacity-50 transition-opacity">Empresas</a>
            <a href="#planos" className="hover:opacity-50 transition-opacity">Família</a>
            <a href="#faq" className="hover:opacity-50 transition-opacity">Dúvidas</a>
            <a href="#contato" className="hover:opacity-50 transition-opacity">Contato</a>
          </div>
          <button 
            className={`px-6 py-3 rounded-full text-[10px] font-black uppercase tracking-widest transition-all duration-300 ${
              isScrolled 
                ? 'bg-purple-600 text-white hover:bg-white hover:text-black' 
                : 'bg-white text-black hover:scale-105'
            }`}
          >
            Central: (51) 2129-4040
          </button>
        </div>
      </nav>

      {/* HERO SECTION */}
      <section className="relative h-screen flex flex-col justify-center px-6 md:px-12 bg-slate-950">
        <div className="absolute inset-0 z-0">
          <video autoPlay muted loop playsInline className="w-full h-full object-cover opacity-40">
            <source src="/hero.mp4" type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-gradient-to-t from-[#fafafa] via-transparent to-transparent" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto w-full pt-20">
          <div className="overflow-hidden mb-6">
            <h1 className="hero-text text-5xl md:text-7xl lg:text-[6.5vw] leading-[1] font-black tracking-tighter text-white">
              Conectando você a <br/> serviços de saúde de <br/> <span className="text-purple-400 italic">excelência.</span>
            </h1>
          </div>
          
          <div className="hero-text flex flex-col md:flex-row justify-between items-start md:items-end gap-8 mt-8">
            <p className="text-xl text-slate-300 max-w-xl font-medium leading-relaxed">
              Planos assistenciais acessíveis e completos, com cobertura que vai além do essencial.
            </p>
            <div className="flex items-center gap-6">
              <div className="w-16 h-16 rounded-full border border-purple-500/30 flex items-center justify-center animate-[spin_10s_linear_infinite]">
                <Plus className="text-purple-400" />
              </div>
              <div>
                <div className="text-[10px] font-black uppercase tracking-[0.2em] text-purple-400 mb-1">Emergência 24h</div>
                <div className="text-2xl font-black text-white">0800-000-4356</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* BENEFÍCIOS - LENIS STYLE STACKING CARDS OTIMIZADOS (4 CARDS) */}
      <section id="beneficios" className="stacking-container h-screen w-full bg-slate-50 flex items-center justify-center md:justify-start relative overflow-hidden border-y border-slate-200">
        
        {/* Título de Fundo */}
        <div className="absolute top-30 md:top-32 md:right-20 text-center md:text-right opacity-20 pointer-events-none">
          <h2 className="text-5xl md:text-[8vw] font-black tracking-tighter leading-none text-slate-400 uppercase">
            Nossos <br/> Benefícios
          </h2>
        </div>

        <div className=" mt-40 md:mt-0 relative w-[300px] h-[500px] md:h-[600px] flex items-center pt-20">
          {beneficiosAgrupados.map((ben, index) => (
            <div 
              key={index} 
              // Cards um pouco mais largos para acomodar a lista com elegância
              className="stack-card absolute top-4 md:top-16 mx-auto md:left-20 w-[300px] h-[380px] md:w-[420px] md:h-[400px] p-8 md:p-10 rounded-[2rem] shadow-2xl border border-slate-200 bg-white/80 backdrop-blur-lg flex flex-col justify-between"
              style={{ zIndex: index }}
            >
              {/* Número Gigante ao fundo do card */}
              <div className="absolute top-4 right-6 text-6xl md:text-8xl font-black text-purple-100 tracking-tighter pointer-events-none select-none z-0">
                {(index + 1).toString().padStart(2, '0')}
              </div>
              
              <div className="relative z-10 w-full flex flex-col h-full">
                <div className="w-16 h-16 bg-purple-50 rounded-2xl flex items-center justify-center text-purple-600 mb-6 border border-purple-100">
                  {ben.icon}
                </div>
                
                <h4 className="text-2xl md:text-3xl font-black tracking-tighter text-slate-900 leading-tight mb-6">
                  {ben.title}
                </h4>

                {/* Lista de sub-benefícios */}
                <ul className="space-y-3 mt-auto">
                  {ben.items.map((item, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm font-bold text-slate-600">
                      <Check size={18} className="text-purple-600 shrink-0 mt-0.5" />
                      <span className="leading-snug">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* REDE DE CONVÊNIOS */}
      <section id="rede" className="py-24 bg-slate-950 text-white relative">
        <div className="max-w-7xl mx-auto px-6 flex flex-col lg:flex-row items-start gap-16 relative">
          
          {/* COLUNA ESQUERDA - STICKY MAPA DO RS */}
          <div className="lg:w-1/3 lg:sticky lg:top-32 space-y-8 fade-up z-10 pb-12">
            <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-purple-500">Área de Abrangência</h2>
            <h3 className="text-5xl font-black tracking-tighter leading-tight">
              Nossa estrutura de <span className="text-purple-400 italic font-light">atendimento.</span>
            </h3>
            <p className="text-lg text-slate-400 font-medium mb-6">
              O Plano Costa garante amparo nas principais cidades da Região Metropolitana e Vale do Taquari.
            </p>
            
            {/* Box Limpo com Cidades */}
            <div className="p-8 bg-white/5 backdrop-blur-md rounded-[2rem] border border-white/10">
              <h4 className="text-xs font-black uppercase tracking-widest mb-6 text-purple-400 flex items-center gap-2">
                <MapPin size={16} /> Atendimentos em:
              </h4>
              <ul className="grid grid-cols-2 gap-y-4 gap-x-2 font-bold text-sm text-slate-300">
                <li className="flex items-center gap-2.5">
                  <div className="w-1.5 h-1.5 bg-purple-500 rounded-full shadow-[0_0_8px_rgba(168,85,247,0.8)]" /> Taquari
                </li>
                <li className="flex items-center gap-2.5">
                  <div className="w-1.5 h-1.5 bg-purple-500 rounded-full shadow-[0_0_8px_rgba(168,85,247,0.8)]" /> Porto Alegre
                </li>
                <li className="flex items-center gap-2.5">
                  <div className="w-1.5 h-1.5 bg-purple-500 rounded-full shadow-[0_0_8px_rgba(168,85,247,0.8)]" /> Lajeado
                </li>
                <li className="flex items-center gap-2.5">
                  <div className="w-1.5 h-1.5 bg-purple-500 rounded-full shadow-[0_0_8px_rgba(168,85,247,0.8)]" /> Tabaí
                </li>
                <li className="flex items-center gap-2.5">
                  <div className="w-1.5 h-1.5 bg-purple-500 rounded-full shadow-[0_0_8px_rgba(168,85,247,0.8)]" /> Estrela
                </li>
                <li className="flex items-center gap-2.5">
                  <div className="w-1.5 h-1.5 bg-purple-500 rounded-full shadow-[0_0_8px_rgba(168,85,247,0.8)]" /> Triunfo
                </li>
                <li className="flex items-center gap-2.5">
                  <div className="w-1.5 h-1.5 bg-purple-500 rounded-full shadow-[0_0_8px_rgba(168,85,247,0.8)]" /> Montenegro
                </li>
                <li className="flex items-center gap-2.5">
                  <div className="w-1.5 h-1.5 bg-purple-500 rounded-full shadow-[0_0_8px_rgba(168,85,247,0.8)]" /> Teutônia
                </li>
                <li className="flex items-center gap-2.5">
                  <div className="w-1.5 h-1.5 bg-purple-500 rounded-full shadow-[0_0_8px_rgba(168,85,247,0.8)]" /> Canoas
                </li>
                <li className="flex items-center gap-2.5">
                  <div className="w-1.5 h-1.5 bg-purple-500 rounded-full shadow-[0_0_8px_rgba(168,85,247,0.8)]" /> Paverama
                </li>
              </ul>
            </div>
          </div>

          {/* COLUNA DIREITA */}
          <div className="lg:w-2/3 flex flex-col space-y-12 pt-12 lg:pt-0">
            
            <div className="p-10 bg-white/5 border border-white/10 rounded-[2.5rem] hover:bg-white/10 transition-colors duration-500 fade-up">
              <div className="flex items-center gap-4 mb-8">
                <div className="p-4 bg-purple-500/20 rounded-2xl text-purple-400"><Hospital size={28} /></div>
                <h4 className="text-2xl font-black tracking-tighter italic">Hospitais e Diagnóstico</h4>
              </div>
              <p className="text-slate-400 font-medium mb-6">Amparo regional garantido com as principais instituições do Vale.</p>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-6 text-sm font-bold text-slate-300">
                <li className="flex items-start gap-3"><Check size={16} className="text-purple-400 mt-0.5 shrink-0"/> Hospital São José (Taquari)</li>
                <li className="flex items-start gap-3"><Check size={16} className="text-purple-400 mt-0.5 shrink-0"/> Hospital Ouro Branco (Teutônia)</li>
                <li className="flex items-start gap-3"><Check size={16} className="text-purple-400 mt-0.5 shrink-0"/> Hospital Bruno Born (Lajeado)</li>
                <li className="flex items-start gap-3"><Check size={16} className="text-purple-400 mt-0.5 shrink-0"/> Clínica Diagnóstica (Taquari)</li>
                <li className="flex items-start gap-3"><Check size={16} className="text-purple-400 mt-0.5 shrink-0"/> Clínica EspaçoRad (Lajeado)</li>
                <li className="flex items-start gap-3"><Check size={16} className="text-purple-400 mt-0.5 shrink-0"/> Clínica Unimagem (Estrela)</li>
                <li className="flex items-start gap-3"><Check size={16} className="text-purple-400 mt-0.5 shrink-0"/> Laboratório Grams</li>
                <li className="flex items-start gap-3"><Check size={16} className="text-purple-400 mt-0.5 shrink-0"/> Laboratório Laborvida</li>
              </ul>
            </div>

            <div className="p-10 bg-white/5 border border-white/10 rounded-[2.5rem] hover:bg-white/10 transition-colors duration-500 fade-up">
              <div className="flex items-center gap-4 mb-8">
                <div className="p-4 bg-purple-500/20 rounded-2xl text-purple-400"><Stethoscope size={28} /></div>
                <h4 className="text-2xl font-black tracking-tighter italic">Especialidades Clínicas</h4>
              </div>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-6 text-sm font-bold text-slate-300">
                <li className="flex items-start gap-3"><Check size={16} className="text-purple-400 mt-0.5 shrink-0"/> Cardiologia</li>
                <li className="flex items-start gap-3"><Check size={16} className="text-purple-400 mt-0.5 shrink-0"/> Dermatologia</li>
                <li className="flex items-start gap-3"><Check size={16} className="text-purple-400 mt-0.5 shrink-0"/> Endocrinologia</li>
                <li className="flex items-start gap-3"><Check size={16} className="text-purple-400 mt-0.5 shrink-0"/> Gastroenterologia</li>
                <li className="flex items-start gap-3"><Check size={16} className="text-purple-400 mt-0.5 shrink-0"/> Ginecologia e Obstetrícia</li>
                <li className="flex items-start gap-3"><Check size={16} className="text-purple-400 mt-0.5 shrink-0"/> Hematologia</li>
                <li className="flex items-start gap-3"><Check size={16} className="text-purple-400 mt-0.5 shrink-0"/> Mastologia</li>
                <li className="flex items-start gap-3"><Check size={16} className="text-purple-400 mt-0.5 shrink-0"/> Neurologia</li>
                <li className="flex items-start gap-3"><Check size={16} className="text-purple-400 mt-0.5 shrink-0"/> Pediatria</li>
                <li className="flex items-start gap-3"><Check size={16} className="text-purple-400 mt-0.5 shrink-0"/> Pneumologia</li>
                <li className="flex items-start gap-3"><Check size={16} className="text-purple-400 mt-0.5 shrink-0"/> Psiquiatria</li>
                <li className="flex items-start gap-3"><Check size={16} className="text-purple-400 mt-0.5 shrink-0"/> Reumatologia</li>
              </ul>
            </div>

            <div className="p-10 bg-white/5 border border-white/10 rounded-[2.5rem] hover:bg-white/10 transition-colors duration-500 fade-up">
              <div className="flex items-center gap-4 mb-8">
                <div className="p-4 bg-purple-500/20 rounded-2xl text-purple-400"><Activity size={28} /></div>
                <h4 className="text-2xl font-black tracking-tighter italic">Cirurgia e Trauma</h4>
              </div>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-6 text-sm font-bold text-slate-300">
                <li className="flex items-start gap-3"><Check size={16} className="text-purple-400 mt-0.5 shrink-0"/> Ortopedia e Traumatologia</li>
                <li className="flex items-start gap-3"><Check size={16} className="text-purple-400 mt-0.5 shrink-0"/> Urologia</li>
                <li className="flex items-start gap-3"><Check size={16} className="text-purple-400 mt-0.5 shrink-0"/> Cirurgia Geral</li>
                <li className="flex items-start gap-3"><Check size={16} className="text-purple-400 mt-0.5 shrink-0"/> Cirurgia Plástica</li>
                <li className="flex items-start gap-3"><Check size={16} className="text-purple-400 mt-0.5 shrink-0"/> Cirurgia Pediátrica</li>
                <li className="flex items-start gap-3"><Check size={16} className="text-purple-400 mt-0.5 shrink-0"/> Coloproctologia</li>
                <li className="flex items-start gap-3"><Check size={16} className="text-purple-400 mt-0.5 shrink-0"/> Cirurgia Vascular</li>
                <li className="flex items-start gap-3"><Check size={16} className="text-purple-400 mt-0.5 shrink-0"/> Otorrinolaringologia</li>
                <li className="flex items-start gap-3"><Check size={16} className="text-purple-400 mt-0.5 shrink-0"/> Oftalmologia</li>
                <li className="flex items-start gap-3"><Check size={16} className="text-purple-400 mt-0.5 shrink-0"/> Medicina da Dor</li>
              </ul>
            </div>

            <div className="p-10 bg-white/5 border border-white/10 rounded-[2.5rem] hover:bg-white/10 transition-colors duration-500 fade-up">
              <div className="flex items-center gap-4 mb-8">
                <div className="p-4 bg-purple-500/20 rounded-2xl text-purple-400"><Heart size={28} /></div>
                <h4 className="text-2xl font-black tracking-tighter italic">Saúde e Bem-Estar</h4>
              </div>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-6 text-sm font-bold text-slate-300">
                <li className="flex items-start gap-3"><Check size={16} className="text-purple-400 mt-0.5 shrink-0"/> Fisioterapia</li>
                <li className="flex items-start gap-3"><Check size={16} className="text-purple-400 mt-0.5 shrink-0"/> Psicologia</li>
                <li className="flex items-start gap-3"><Check size={16} className="text-purple-400 mt-0.5 shrink-0"/> Nutrição</li>
                <li className="flex items-start gap-3"><Check size={16} className="text-purple-400 mt-0.5 shrink-0"/> Fonoaudiologia</li>
                <li className="flex items-start gap-3"><Check size={16} className="text-purple-400 mt-0.5 shrink-0"/> Osteopatia e Pilates</li>
                <li className="flex items-start gap-3"><Check size={16} className="text-purple-400 mt-0.5 shrink-0"/> Acupuntura e Massoterapia</li>
                <li className="flex items-start gap-3"><Check size={16} className="text-purple-400 mt-0.5 shrink-0"/> Psicopedagogia</li>
                <li className="flex items-start gap-3"><Check size={16} className="text-purple-400 mt-0.5 shrink-0"/> Neuropsicologia</li>
              </ul>
            </div>

            <div className="p-10 bg-white/5 border border-white/10 rounded-[2.5rem] hover:bg-white/10 transition-colors duration-500 fade-up">
              <div className="flex items-center gap-4 mb-8">
                <div className="p-4 bg-purple-500/20 rounded-2xl text-purple-400"><Microscope size={28} /></div>
                <h4 className="text-2xl font-black tracking-tighter italic">Odonto & Imagem</h4>
              </div>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-6 text-sm font-bold text-slate-300">
                <li className="flex items-start gap-3"><Check size={16} className="text-purple-400 mt-0.5 shrink-0"/> Cirurgia Geral Odonto</li>
                <li className="flex items-start gap-3"><Check size={16} className="text-purple-400 mt-0.5 shrink-0"/> Ortodontia e Endodontia</li>
                <li className="flex items-start gap-3"><Check size={16} className="text-purple-400 mt-0.5 shrink-0"/> Bucomaxilofacial</li>
                <li className="flex items-start gap-3"><Check size={16} className="text-purple-400 mt-0.5 shrink-0"/> Ressonância Magnética</li>
                <li className="flex items-start gap-3"><Check size={16} className="text-purple-400 mt-0.5 shrink-0"/> Tomografia Computadorizada</li>
                <li className="flex items-start gap-3"><Check size={16} className="text-purple-400 mt-0.5 shrink-0"/> Ecografias e Mamografia</li>
                <li className="flex items-start gap-3"><Check size={16} className="text-purple-400 mt-0.5 shrink-0"/> Endoscopia Digestiva</li>
                <li className="flex items-start gap-3"><Check size={16} className="text-purple-400 mt-0.5 shrink-0"/> Radiografias (RX)</li>
              </ul>
            </div>
            
          </div>
        </div>
      </section>

      {/* PLANOS EMPRESARIAIS - REFORMULADO (PREMIUM B2B) */}
      <section id="empresas" className="py-32 px-6 bg-slate-50">
        <div className="max-w-7xl mx-auto bg-white rounded-[3rem] border border-slate-200 p-8 md:p-16 flex flex-col lg:flex-row items-center gap-16 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.05)] fade-up overflow-hidden relative">
          
          {/* Elemento Decorativo de Fundo */}
          <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-bl from-purple-50 via-transparent to-transparent pointer-events-none" />

          {/* LADO ESQUERDO: Copywriting focado em Valor */}
          <div className="lg:w-1/2 relative z-10">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-100 text-slate-600 text-[10px] font-black tracking-widest uppercase mb-6 border border-slate-200">
              <Building size={14} className="text-purple-600" /> Para o seu negócio
            </div>
            
            <h3 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tighter text-slate-950 mb-6 leading-[0.95]">
              O melhor investimento é a <span className="italic text-purple-600">saúde do seu time.</span>
            </h3>
            
            <p className="text-lg text-slate-500 font-medium mb-8 leading-relaxed max-w-lg">
              Atraia talentos, reduza faltas e ofereça segurança real. O Plano Costa adapta-se ao tamanho da sua empresa, oferecendo suporte prioritário para o seu setor de RH gerenciar tudo sem dor de cabeça.
            </p>
            
            <ul className="space-y-5 mb-10 text-sm font-bold text-slate-700">
              <li className="flex items-start gap-4">
                <div className="w-6 h-6 rounded-full bg-purple-100 flex items-center justify-center shrink-0 mt-0.5">
                  <Check className="text-purple-600" size={14} strokeWidth={3} />
                </div>
                <span>Planos customizáveis para PMEs e Grandes Empresas do Vale do Taquari.</span>
              </li>
              <li className="flex items-start gap-4">
                <div className="w-6 h-6 rounded-full bg-purple-100 flex items-center justify-center shrink-0 mt-0.5">
                  <Check className="text-purple-600" size={14} strokeWidth={3} />
                </div>
                <span>Extensão completa dos benefícios para cônjuges e dependentes.</span>
              </li>
              <li className="flex items-start gap-4">
                <div className="w-6 h-6 rounded-full bg-purple-100 flex items-center justify-center shrink-0 mt-0.5">
                  <Check className="text-purple-600" size={14} strokeWidth={3} />
                </div>
                <span>Gestão simplificada com faturamento unificado para a empresa.</span>
              </li>
            </ul>
            
            <a href="https://wa.me/5121294040" target="_blank" rel="noreferrer" className="inline-flex items-center gap-3 px-8 py-4 bg-slate-950 text-white rounded-xl font-black text-[10px] uppercase tracking-[0.2em] hover:bg-purple-600 hover:shadow-xl hover:shadow-purple-500/30 transition-all duration-300">
              Falar com um Consultor <ChevronDown className="-rotate-90" size={16} />
            </a>
          </div>

          {/* LADO DIREITO: Composição Premium (Floating Cards) */}
          <div className="lg:w-1/2 w-full flex justify-center relative z-10 min-h-[400px]">
            <div className="relative w-full max-w-md h-full flex items-center justify-center">
              
              {/* Card Principal Central (Estilo Cartão Black) */}
              <div className="relative z-20 w-[280px] md:w-[320px] aspect-[1.6/1] bg-gradient-to-br from-purple-600 to-slate-900 rounded-3xl p-6 shadow-2xl shadow-purple-900/40 border border-white/10 flex flex-col justify-between transform transition-transform hover:-translate-y-2 duration-500">
                <div className="flex justify-between items-start">
                  <div className="text-white/80 text-[10px] font-black uppercase tracking-widest">Corporativo</div>
                  <Shield size={24} className="text-purple-300" />
                </div>
                <div>
                  <div className="text-3xl font-black text-white tracking-tighter italic mb-1">PlanoCosta</div>
                  <div className="text-purple-200/60 text-xs font-medium tracking-widest font-mono">EMPRESARIAL</div>
                </div>
              </div>

              {/* Elemento Flutuante 1 (Gestão RH) - Topo Esquerda */}
              <div className="absolute -top-4 -left-4 md:-left-12 z-30 p-4 bg-white/90 backdrop-blur-xl rounded-2xl border border-slate-200 shadow-xl flex items-center gap-4">
                <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center text-green-600">
                  <Activity size={20} strokeWidth={2} />
                </div>
                <div>
                  <div className="text-[9px] font-black uppercase tracking-widest text-slate-400">- Absenteísmo</div>
                  <div className="text-sm font-bold text-slate-900">+ Produtividade</div>
                </div>
              </div>

              {/* Elemento Flutuante 2 (Dependentes) - Base Direita */}
              <div className="absolute -bottom-8 -right-4 md:-right-8 z-30 p-4 bg-white/90 backdrop-blur-xl rounded-2xl border border-slate-200 shadow-xl flex items-center gap-4">
                <div className="w-10 h-10 bg-purple-50 rounded-xl flex items-center justify-center text-purple-600">
                  <Users size={20} strokeWidth={2} />
                </div>
                <div>
                  <div className="text-[9px] font-black uppercase tracking-widest text-slate-400">Amparo Total</div>
                  <div className="text-sm font-bold text-slate-900">Família Protegida</div>
                </div>
              </div>

              {/* Círculo de Desfoque ao fundo para dar volume */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-purple-400/20 blur-[80px] rounded-full z-0" />

            </div>
          </div>

        </div>
      </section>

      <section id="planos" className="py-32 px-6 max-w-7xl mx-auto">
        <div className="text-center mb-20 fade-up">
          <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-purple-600 mb-4">Para Você e Sua Família</h2>
          <h3 className="text-4xl md:text-6xl font-black tracking-tighter text-slate-950 mb-8">Nossas Modalidades.</h3>
          <div className="inline-flex items-center gap-3 px-6 py-3 bg-slate-50 border border-slate-200 rounded-full text-xs font-bold text-slate-600 shadow-sm">
            <Info size={16} className="text-purple-600"/> Na abertura é cobrada a taxa de adesão de R$ 49,99 + proporcional aos dias restantes do mês.
          </div>
        </div>

        {/* Grid de Planos */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 fade-up">
          {planos.map((plan, index) => (
            <div 
              key={index}
              className={`relative p-8 lg:p-10 rounded-[2.5rem] border transition-all duration-500 hover:-translate-y-2 flex flex-col ${
                plan.featured 
                ? 'bg-white border-emerald-400 shadow-2xl shadow-emerald-900/10 lg:scale-105 z-10' 
                : 'bg-white border-slate-200 shadow-xl shadow-slate-200/50'
              }`}
            >
              {plan.featured && (
                <span className="absolute -top-4 left-1/2 -translate-x-1/2 bg-emerald-500 text-white px-6 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg shadow-emerald-500/30">
                  Mais Popular
                </span>
              )}

              <div className="mb-8">
                <h4 className={`text-sm font-black uppercase tracking-[0.2em] ${plan.color} mb-3`}>
                  Plano {plan.name}
                </h4>
                <p className="text-slate-500 text-xs font-medium leading-relaxed h-8">{plan.tagline}</p>
              </div>

              <div className="mb-8">
                <div className="flex items-baseline gap-1">
                  <span className="text-5xl font-black text-slate-900 tracking-tighter">R${plan.price}</span>
                  <span className="text-slate-400 text-xs font-bold uppercase tracking-widest">/mês</span>
                </div>
              </div>

              <hr className="border-slate-100 mb-8" />

              <ul className="space-y-6 mb-10 flex-grow">
                {/* Usuários */}
                <li className="flex gap-4">
                  <div className={`flex-shrink-0 w-12 h-12 rounded-2xl ${plan.bg} flex items-center justify-center ${plan.color} border ${plan.border}`}>
                    <Users size={20} strokeWidth={1.5} />
                  </div>
                  <div className="flex flex-col justify-center">
                    <p className="text-xs font-black text-slate-900 mb-0.5">{plan.users} Pessoas</p>
                    <p className="text-[10px] text-slate-500 font-medium leading-snug">{plan.usersDetail}</p>
                  </div>
                </li>

                {/* Rede */}
                <li className="flex gap-4">
                  <div className={`flex-shrink-0 w-12 h-12 rounded-2xl ${plan.bg} flex items-center justify-center ${plan.color} border ${plan.border}`}>
                    <Check size={20} strokeWidth={1.5} />
                  </div>
                  <div className="flex flex-col justify-center">
                    <p className="text-xs font-black text-slate-900 mb-0.5">{plan.network}</p>
                    <p className="text-[10px] text-slate-500 font-medium leading-snug">{plan.networkDetail}</p>
                  </div>
                </li>

                {/* Ambulância (Corrigido para não prometer gratuidade) */}
                <li className="flex gap-4">
                  <div className={`flex-shrink-0 w-12 h-12 rounded-2xl ${plan.bg} flex items-center justify-center ${plan.color} border ${plan.border}`}>
                    <Truck size={20} strokeWidth={1.5} />
                  </div>
                  <div className="flex flex-col justify-center">
                    <p className="text-xs font-black text-slate-900 mb-0.5">{plan.ambulance}</p>
                    <p className="text-[10px] text-slate-500 font-medium leading-snug">{plan.ambulanceDetail}</p>
                  </div>
                </li>

                {/* Funeral */}
                <li className="flex gap-4">
                  <div className={`flex-shrink-0 w-12 h-12 rounded-2xl ${plan.bg} flex items-center justify-center ${plan.color} border ${plan.border}`}>
                    <Heart size={20} strokeWidth={1.5} />
                  </div>
                  <div className="flex flex-col justify-center">
                    <p className="text-xs font-black text-slate-900 mb-0.5">Auxílio Funeral</p>
                    <p className="text-[10px] text-slate-500 font-medium leading-snug">Até {plan.funeral} de cobertura</p>
                  </div>
                </li>
              </ul>

              <button
               onClick={() => openCheckout(plan)}
               className={`w-full py-5 rounded-2xl text-white font-black text-[10px] uppercase tracking-[0.2em] transition-all shadow-lg active:scale-95 ${plan.button}`}
              >
                Contratar {plan.name}
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-24 px-6 bg-slate-50 border-t border-slate-200">
        <div className="max-w-4xl mx-auto fade-up">
          <div className="text-center mb-16">
            <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-purple-600 mb-4">Dúvidas Frequentes</h2>
            <h3 className="text-4xl font-black tracking-tighter text-slate-900">Como podemos ajudar?</h3>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div 
                key={index} 
                className="bg-white border border-slate-200 rounded-2xl overflow-hidden transition-all shadow-sm"
              >
                <button 
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                  className="w-full flex items-center justify-between p-6 text-left focus:outline-none"
                >
                  <span className="font-bold text-slate-800 pr-4">{faq.q}</span>
                  <ChevronDown className={`text-purple-600 transition-transform duration-300 ${openFaq === index ? 'rotate-180' : ''}`} size={20} />
                </button>
                <div 
                  className={`px-6 overflow-hidden transition-all duration-300 ease-in-out ${openFaq === index ? 'max-h-40 pb-6 opacity-100' : 'max-h-0 opacity-0'}`}
                >
                  <p className="text-sm text-slate-600 leading-relaxed">{faq.a}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <p className="text-sm text-slate-500 font-medium">Equipe especializada para agendamentos e orientações.</p>
            <a href="https://wa.me/5121294040" className="inline-flex items-center gap-2 mt-4 text-purple-600 font-bold hover:text-purple-800 transition-colors">
              Fale conosco no WhatsApp <ChevronDown className="-rotate-90" size={16}/>
            </a>
          </div>
        </div>
      </section>

      {/* CONTATO & MAPA */}
      <section id="contato" className="py-32 px-6 bg-slate-50 border-t border-slate-200">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-12 lg:gap-16 items-stretch">
          
          {/* Lado Esquerdo: Textos e Botões de Ação */}
          <div className="lg:w-1/2 flex flex-col justify-between fade-up">
            <div className="mb-12">
              <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-purple-600 mb-4">Fale Conosco</h2>
              <h3 className="text-5xl md:text-7xl font-black tracking-tighter text-slate-950 mb-6 leading-[0.9]">
                Estamos aqui <br/><span className="italic text-purple-600">por você.</span>
              </h3>
              <p className="text-lg text-slate-500 font-medium leading-relaxed max-w-md">
                Equipe especializada pronta para tirar suas dúvidas, agendar consultas e oferecer o suporte que sua família merece.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-auto">
              <a href="https://wa.me/5121294040" target="_blank" rel="noreferrer" className="p-8 bg-white border border-slate-200 rounded-[2rem] hover:border-purple-300 hover:shadow-xl transition-all group cursor-pointer flex flex-col justify-center">
                <div className="w-14 h-14 bg-purple-50 rounded-2xl flex items-center justify-center text-purple-600 mb-6 group-hover:scale-110 transition-transform">
                  <MessageCircle size={28} strokeWidth={1.5} />
                </div>
                <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Suporte & WhatsApp</h4>
                <div className="text-2xl font-black text-slate-900 group-hover:text-purple-600 transition-colors">(51) 2129-4040</div>
              </a>

              <div className="p-8 bg-slate-950 border border-slate-800 rounded-[2rem] hover:shadow-xl transition-all group text-white flex flex-col justify-center">
                <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center text-white mb-6 group-hover:scale-110 transition-transform">
                  <Phone size={28} strokeWidth={1.5} />
                </div>
                <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Emergências 24h</h4>
                <div className="text-2xl font-black text-white">0800-000-4356</div>
              </div>
            </div>
          </div>

          {/* Lado Direito: Mapa e Endereço da Sede */}
          <div className="lg:w-1/2 w-full fade-up">
            <div className="bg-white border border-slate-200 rounded-[2rem] overflow-hidden hover:shadow-xl transition-shadow flex flex-col h-full min-h-[450px]">
              
              {/* Iframe do Google Maps */}
              <div className="flex-grow bg-slate-200 relative w-full h-[300px] md:h-[350px]">
                <iframe 
                  src="https://maps.google.com/maps?q=Rua+Sete+de+Setembro,+2356+-+Centro,+Taquari+-+RS&t=&z=16&ie=UTF8&iwloc=&output=embed" 
                  className="absolute inset-0 w-full h-full border-0 grayscale-[20%] contrast-125" 
                  allowFullScreen="" 
                  loading="lazy" 
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Mapa Plano Costa"
                ></iframe>
              </div>
              
              <div className="p-8 flex items-center gap-6 bg-white z-10 relative">
                <div className="w-14 h-14 bg-purple-50 rounded-2xl flex items-center justify-center text-purple-600 shrink-0">
                  <MapPin size={28} strokeWidth={1.5} />
                </div>
                <div>
                  <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Sede Central</h4>
                  <div className="text-lg font-bold text-slate-900 leading-tight">Rua Sete de Setembro, n°2356 <br/> Centro - Taquari/RS</div>
                </div>
              </div>
              
            </div>
          </div>

        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-20 px-6 border-t border-slate-200 bg-white">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-end gap-12">
          <div>
            <div className="text-3xl font-black tracking-tighter uppercase mb-6">Plano<span className="text-purple-600 italic font-light">Costa</span></div>
            <div className="text-xs font-bold text-slate-500 uppercase tracking-widest leading-loose">
              Suporte: (51) 2129-4040<br/>
              Emergência: 0800-000-4356<br/>
              Sede: Rua Sete de Setembro, n°2356
            </div>
          </div>
          <div className="text-right">
            <div className="text-[8px] font-black uppercase tracking-[0.4em] text-slate-400 mb-2">Desenvolvido por</div>
            <a href="https://codeytech.com.br" className="text-xl font-black text-slate-900 hover:text-purple-600 transition-colors italic">Codey Tech.</a>
          </div>
        </div>
      </footer>

    </div>
      {/* RENDERIZA O MODAL POR CIMA DE TUDO QUANDO ABERTO */}
      {isCheckoutOpen && (
        <CheckoutModal 
          isOpen={isCheckoutOpen} 
          onClose={() => setIsCheckoutOpen(false)} 
          plan={selectedPlanForCheckout} 
        />
      )}
    </LenisProvider>
  );
};