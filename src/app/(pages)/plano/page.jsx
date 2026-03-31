"use client";
import React, { useRef, useState, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import LenisProvider from '../../components/LenisProvider';
import CheckoutModal from '../../components/CheckoutModal';
import { 
  Shield, Stethoscope, Truck, Heart, Briefcase, 
  MapPin, Plus, Microscope, Activity, ShoppingBag, 
  Hospital, Info, Check, ChevronDown, Building, Users, 
  FlaskConical, Map, Accessibility, Percent, MessageCircle, Phone,
  Clipboard
} from 'lucide-react';
import Image from 'next/image';
import { FaWhatsapp, FaInstagram, FaFacebook } from 'react-icons/fa';
import CopyToClipboard from 'react-copy-to-clipboard';
import { toast, ToastContainer } from 'react-toastify';

gsap.registerPlugin(ScrollTrigger);
ScrollTrigger.config({ ignoreMobileResize: true });

export default function Page() {
  const container = useRef();
  
  // ESTADOS
  const [isLoading, setIsLoading] = useState(true); // Controla a tela de loading
  const [isScrolled, setIsScrolled] = useState(false);
  const [openFaq, setOpenFaq] = useState(0);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [selectedPlanForCheckout, setSelectedPlanForCheckout] = useState(null);

  // Fallback de segurança para o Loading: se o vídeo demorar mais de 3.5s, libera o site.
  useEffect(() => {
    if (isLoading) {
      document.body.style.overflow = 'hidden';
      
      // Fallback de segurança: libera após 3.5s caso o vídeo trave (comum no 3G)
      const timer = setTimeout(() => setIsLoading(false), 3500);
      return () => clearTimeout(timer);
    } else {
      document.body.style.overflow = '';
      
      // Quando o loading sai, damos 100ms para a tela se acomodar e mandamos o GSAP recalcular as alturas
      setTimeout(() => {
        ScrollTrigger.refresh();
      }, 100);
    }
  }, [isLoading]);

  // Controle do background do Header dinâmico no scroll
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 80);
    };
    
    window.addEventListener('scroll', handleScroll);
    handleScroll(); 
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // ÚNICO BLOCO GSAP (Cérebro das Animações)
  useGSAP(() => {
    // 🚨 REGRA DE OURO: Não roda a animação de entrada até o loading terminar
    if (isLoading) return;

    // 1. Animação de entrada do Hero (Agora sincronizada com a saída do loading)
    gsap.from(".hero-text", {
      y: 50,
      opacity: 0,
      duration: 1,
      stagger: 0.15,
      ease: "power3.out",
      delay: 0.5 // Dá tempo da "cortina" de loading subir antes do texto aparecer
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

    // 3. ANIMAÇÃO ESTILO "LENIS BRINGS THE HEAT" (Cards Benefícios)
    const cards = gsap.utils.toArray('.stack-card');
    const isMobile = window.innerWidth < 768;
    
    if (cards.length > 0) {
      gsap.set(cards, {
        x: "100vw",
        y: "50vh",
        opacity: 0,
        rotation: 15,
      });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: ".stacking-container",
          start: "top top", 
          end: `+=${cards.length * 100}%`,
          pin: true, 
          scrub: 1, 
        }
      });

      cards.forEach((card, index) => {
        tl.to(card, {
          x: isMobile ? 0 : index * 40, 
          y: isMobile ? index * 20 : index * 25, 
          opacity: 1,
          rotation: 0, 
          duration: 0.4, 
          ease: "power3.out"
        })
        .to({}, { duration: 0.6 }); 
      });
    }

    // 4. ANIMAÇÃO 3D DOS PLANOS (Modalidades)
    gsap.from(".plan-card", {
      scrollTrigger: {
        trigger: "#planos", 
        start: "top 80%", 
      },
      y: 100,
      opacity: 0,
      rotationX: -15, 
      transformOrigin: "top center",
      stagger: 0.2, 
      duration: 1,
      ease: "back.out(1.5)",
      clearProps: "all"
    });

  }, { scope: container, dependencies: [isLoading] }); // <-- Adicionamos isLoading nas dependências do GSAP!

  const faqs = [
    {
      q: "Quando poderei acessar os benefícios do Plano Costa?",
      a: "Imediatamente após aderir ao plano. Não há carência para começar a utilizar os serviços com planos familiares. 30 dias após a adesão no caso do plano individual."
    },
    {
      q: "A ambulância 24h possui algum custo?",
      a: "A nossa ambulância é totalmente gratuita exclusivamente para casos de emergência ocorridos dentro do perímetro urbano de Taquari para clientes dos planos familiares."
    },
    {
      q: "Como funciona a locação de equipamentos?",
      a: "Clientes têm acesso facilitado e valores especiais para locação de itens como andadores, cadeiras de rodas, camas hospitalares, muletas e nebulizadores."
    },
    {
      q: "Onde o plano oferece cobertura?",
      a: "Nossa rede de parceiros abrange diversas cidades, incluindo Taquari, Lajeado, Estrela, Montenegro, Canoas, Porto Alegre, Tabaí, Teutônia."
    }
  ];

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

  const especialidadesRede = [
    {
      id: "hospitalar",
      icon: Hospital,
      title: "Hospitais e Diagnóstico",
      desc: "Amparo regional garantido com as principais instituições do Vale.",
      color: "from-purple-500 to-indigo-600",
      shadow: "shadow-purple-500/20",
      items: [
        "Hospital São José (Taquari)", "Hospital Ouro Branco (Teutônia)", 
        "Hospital Bruno Born (Lajeado)", "Clínica Diagnóstica (Taquari)",
        "Clínica EspaçoRad (Lajeado)", "Clínica Unimagem (Estrela)",
        "Laboratório Grams", "Laboratório Laborvida"
      ]
    },
    {
      id: "clinicas",
      icon: Stethoscope,
      title: "Especialidades Clínicas",
      desc: "Corpo clínico completo para acompanhamento e prevenção.",
      color: "from-blue-500 to-cyan-500",
      shadow: "shadow-blue-500/20",
      items: [
        "Cardiologia", "Dermatologia", "Endocrinologia", "Gastroenterologia",
        "Ginecologia e Obstetrícia", "Hematologia", "Mastologia", "Neurologia",
        "Pediatria", "Pneumologia", "Psiquiatria", "Reumatologia"
      ]
    },
    {
      id: "cirurgia",
      icon: Activity,
      title: "Cirurgia e Trauma",
      desc: "Intervenções cirúrgicas com profissionais de alta precisão.",
      color: "from-emerald-500 to-teal-600",
      shadow: "shadow-emerald-500/20",
      items: [
        "Ortopedia e Traumatologia", "Urologia", "Cirurgia Geral", "Cirurgia Plástica",
        "Cirurgia Pediátrica", "Coloproctologia", "Cirurgia Vascular",
        "Otorrinolaringologia", "Oftalmologia", "Medicina da Dor"
      ]
    },
    {
      id: "bemestar",
      icon: Heart,
      title: "Saúde e Bem-Estar",
      desc: "Cuidado multidisciplinar para qualidade de vida diária.",
      color: "from-rose-500 to-pink-600",
      shadow: "shadow-rose-500/20",
      items: [
        "Fisioterapia", "Psicologia", "Nutrição", "Fonoaudiologia",
        "Osteopatia e Pilates", "Acupuntura e Massoterapia", 
        "Psicopedagogia", "Neuropsicologia"
      ]
    },
    {
      id: "odonto",
      icon: Microscope,
      title: "Odonto & Imagem",
      desc: "Tecnologia de ponta para laudos exatos e saúde bucal.",
      color: "from-amber-500 to-orange-500",
      shadow: "shadow-amber-500/20",
      items: [
        "Cirurgia Geral Odonto", "Ortodontia e Endodontia", "Bucomaxilofacial",
        "Ressonância Magnética", "Tomografia Computadorizada", 
        "Ecografias e Mamografia", "Endoscopia Digestiva", "Radiografias (RX)"
      ]
    }
  ];

  const planos = [
    {
      name: "Topázio",
      tagline: "Cuidado essencial para você e sua família",
      price: "19,99",
      users: "1 + 1 Pessoas",
      usersDetail: "Titular + cônjuge, filho(a) ou pais",
      network: "Rede Local",
      networkDetail: "Acesso à rede de convênios em Taquari",
      ambulance: "Ambulância 24h",
      ambulanceDetail: "Valores exclusivos para associados",
      funeral: "Auxílio de R$ 1.000,00",
      featured: false
    },
    {
      name: "Esmeralda",
      tagline: "A proteção mais inteligente e procurada",
      price: "39,99",
      users: "1 + 4 Pessoas",
      usersDetail: "Inclui sogros, sobrinhos e tios",
      network: "Local + Regional",
      networkDetail: "Cobertura expandida em toda a região",
      ambulance: "Ambulância 24h Gratuita",
      ambulanceDetail: "Para emergências no perímetro urbano",
      funeral: "Auxílio de R$ 3.000,00",
      featured: true
    },
    {
      name: "Diamante",
      tagline: "Cuidado VIP para quem não abre mão do melhor",
      price: "59,99",
      users: "1 + 7 Pessoas",
      usersDetail: "Família completa com máxima abrangência",
      network: "Premium Regional",
      networkDetail: "Prioridade absoluta em especialistas",
      ambulance: "Ambulância 24h Gratuita",
      ambulanceDetail: "Para emergências no perímetro urbano",
      funeral: "Auxílio de R$ 5.000,00",
      featured: false
    }
  ];

  const openCheckout = (plan) => {
    setSelectedPlanForCheckout(plan);
    setIsCheckoutOpen(true);
  };

  return (
    <LenisProvider>
    
    {/* =========================================
        PRELOADER PREMIUM (TELA DE CARREGAMENTO)
        ========================================= */}
    <div 
      // 👇 Adicionado opacity e pointer-events-none na condição do isLoading
      className={`fixed inset-0 z-[99999] bg-slate-950 flex flex-col items-center justify-center transition-all duration-[1200ms] ease-[cubic-bezier(0.76,0,0.24,1)] ${
        isLoading ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0 pointer-events-none'
      }`}
    >
      <div className={`flex flex-col items-center gap-8 transition-opacity duration-500 delay-200 ${isLoading ? 'opacity-100' : 'opacity-0'}`}>
        
        {/* Ícone Pulsante */}
        <div className="relative w-24 h-24 flex items-center justify-center">
          <div className="absolute inset-0 bg-purple-600 rounded-full animate-ping opacity-20" />
          <div className="absolute inset-2 bg-purple-500/20 rounded-full animate-pulse" />
          <Image src="/logogrupo.png" alt="Logo" width={60} height={60} className="relative z-10" />
        </div>

        {/* Logo */}
        <div className="text-4xl font-black tracking-tighter uppercase text-white flex flex-col items-center gap-1">
          <div>Plano<span className="text-purple-600 italic font-light">Costa</span></div>
          <div className="text-[10px] font-bold tracking-[0.4em] text-slate-500 uppercase mt-2">Preparando Experiência</div>
        </div>

      </div>
    </div>

    <div ref={container} className={`select-none min-h-screen bg-[#fafafa] text-slate-900 font-sans selection:bg-purple-200 ${isLoading ? 'h-screen overflow-hidden' : ''}`}>
      
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
      <section className="relative h-[100dvh] flex flex-col justify-center px-6 md:px-12 bg-slate-950">
        <div className="absolute inset-0 z-0">
          <video 
            autoPlay 
            muted 
            loop 
            playsInline 
            className="w-full h-full object-cover opacity-40"
            // 👇 GATILHO QUE AVISA QUE O VÍDEO CARREGOU 👇
            onCanPlayThrough={() => setIsLoading(false)}
          >
            <source src="/hero.mp4" type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-gradient-to-t from-slate-50/80 via-transparent to-transparent" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto w-full pt-20">
          <div className="overflow-hidden mb-6">
            <h1 className="hero-text text-5xl md:text-7xl lg:text-[6.5vw] leading-[1] font-black tracking-tighter text-white">
              Conectando você a <br/> cuidados de saúde de <br/> <span className="text-purple-400 italic">excelência.</span>
            </h1>
          </div>
          
          <div className="hero-text flex flex-col md:flex-row justify-between items-start md:items-end gap-8 mt-8">
            <p className="select-copy text-xl text-slate-300 max-w-xl font-medium leading-relaxed">
              Planos assistenciais acessíveis e completos, com cobertura que vai além do essencial.
            </p>
            <div className="select-copy flex items-center gap-6">
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

      {/* BENEFÍCIOS */}
      <section id="beneficios" className="stacking-container h-[100dvh] w-full bg-slate-50 flex items-center justify-center md:justify-start relative overflow-hidden border-b border-slate-200">
        <div className="absolute top-30 md:top-32 md:right-20 text-center md:text-right opacity-20 pointer-events-none">
          <h2 className="text-5xl md:text-[8vw] font-black tracking-tighter leading-none text-slate-400 uppercase">
            Nossos <br/> Benefícios
          </h2>
        </div>

        <div className=" mt-40 md:mt-0 relative w-[300px] h-[500px] md:h-[600px] flex items-center pt-20">
          {beneficiosAgrupados.map((ben, index) => (
            <div 
              key={index} 
              className="stack-card absolute top-4 md:top-16 mx-auto md:left-20 w-[300px] h-[380px] md:w-[420px] md:h-[400px] p-8 md:p-10 rounded-[2rem] shadow-2xl border border-slate-200 bg-white/80 backdrop-blur-lg flex flex-col justify-between"
              style={{ zIndex: index }}
            >
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

                <ul className="select-copy space-y-3 mt-auto">
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

      {/* REDE DE CONVÊNIOS - MÓDULOS HOLOGRÁFICOS 3D */}
      <section id="rede" className="py-32 bg-slate-950 text-white relative">
        
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)]" />
          <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-purple-600/10 blur-[150px] rounded-full" />
        </div>

        <div className="max-w-7xl mx-auto px-6 flex flex-col lg:flex-row items-start gap-16 relative z-10">
          
          <div className="lg:w-1/3 lg:sticky lg:top-32 space-y-8 fade-up z-10 pb-12 perspective-[1000px]">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-500/10 text-purple-400 text-[10px] font-black tracking-[0.3em] uppercase mb-2 border border-purple-500/20 backdrop-blur-md">
              <MapPin size={12} /> Malha de Cobertura
            </div>
            
            <h3 className="text-5xl lg:text-6xl font-black tracking-tighter leading-[0.9]">
              Estrutura de <br/> <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-400 italic font-light">Atendimento.</span>
            </h3>
            
            <p className="select-copy text-lg text-slate-400 font-medium mb-6 leading-relaxed">
              Conexão direta com as principais instituições e profissionais de saúde da região.
            </p>
            
            <div className="relative p-8 bg-white/5 backdrop-blur-xl rounded-[2rem] border border-white/10 shadow-2xl overflow-hidden transform-style-3d hover:rotate-y-[5deg] hover:rotate-x-[2deg] transition-transform duration-700">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 to-transparent" />
              
              <h4 className="text-xs font-black uppercase tracking-widest mb-6 text-slate-300 flex items-center gap-2">
                Área de Abrangência:
              </h4>
              <ul className="select-copy grid grid-cols-2 gap-y-5 gap-x-2 font-bold text-sm text-slate-400">
                {["Taquari", "Porto Alegre", "Lajeado", "Tabaí", "Estrela", "Montenegro", "Teutônia", "Canoas"].map((cidade, i) => (
                  <li key={i} className="flex items-center gap-3 group cursor-default">
                    <div className="relative w-2 h-2 flex items-center justify-center">
                      <div className="absolute w-full h-full bg-purple-500 rounded-full group-hover:scale-150 transition-transform" />
                      <div className="absolute w-4 h-4 bg-purple-400/50 rounded-full animate-ping opacity-75" />
                    </div>
                    <span className="group-hover:text-white transition-colors">{cidade}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="lg:w-2/3 flex flex-col space-y-10 w-full perspective-[1500px]">
            {especialidadesRede.map((categoria, index) => {
              const Icon = categoria.icon;
              
              return (
                <div 
                  key={categoria.id} 
                  className="fade-up relative w-full group cursor-crosshair"
                  style={{ transformStyle: 'preserve-3d' }}
                >
                  <div className="relative p-8 md:p-10 bg-slate-900/40 backdrop-blur-md border border-white/10 rounded-[2.5rem] transition-all duration-700 ease-out group-hover:bg-slate-800/60 group-hover:border-white/20 group-hover:shadow-[0_0_50px_rgba(0,0,0,0.5)] group-hover:-translate-y-2 group-hover:rotate-x-[-2deg]"
                       style={{ transformStyle: 'preserve-3d' }}>
                    
                    <div className="flex flex-col md:flex-row md:items-center gap-6 mb-8 transform transition-transform duration-700 group-hover:translate-z-[30px]">
                      
                      <div className="relative w-16 h-16 shrink-0 perspective-[500px]" style={{ transformStyle: 'preserve-3d' }}>
                        <div className="absolute inset-0 bg-black/50 rounded-2xl blur-md transform translate-z-[-10px] group-hover:translate-z-[-20px] transition-transform duration-700" />
                        <div className={`absolute inset-0 bg-gradient-to-br ${categoria.color} opacity-20 rounded-2xl border border-white/10 transform translate-z-[0px]`} />
                        <div className="absolute inset-0 flex items-center justify-center text-white transform translate-z-[20px] group-hover:translate-z-[40px] transition-transform duration-700 drop-shadow-[0_0_15px_rgba(255,255,255,0.5)]">
                          <Icon size={32} strokeWidth={1.5} />
                        </div>
                      </div>

                      <div>
                        <h4 className="text-2xl md:text-3xl font-black tracking-tighter italic text-white mb-2">
                          {categoria.title}
                        </h4>
                        <p className="select-copy text-sm text-slate-400 font-medium">
                          {categoria.desc}
                        </p>
                      </div>
                    </div>

                    <div className="w-full h-px bg-gradient-to-r from-white/10 via-white/5 to-transparent mb-8 transform transition-transform duration-700 group-hover:translate-z-[10px]" />

                    <ul 
                      className="select-copy grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-6 transform transition-transform duration-700 group-hover:translate-z-[50px]"
                      style={{ transformStyle: 'preserve-3d' }}
                    >
                      {categoria.items.map((item, i) => (
                        <li key={i} className="flex items-start gap-3 group/item">
                          <div className={`mt-1 shrink-0 w-1.5 h-1.5 rounded-full bg-gradient-to-r ${categoria.color} group-hover/item:scale-150 transition-transform shadow-lg ${categoria.shadow}`} />
                          <span className="text-sm font-bold text-slate-400 group-hover/item:text-white transition-colors">
                            {item}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* PLANOS EMPRESARIAIS - CORPORATIVO FORMAL & 3D */}
      {/* 
      <section id="empresas" className="py-32 px-6 bg-white relative overflow-hidden border-t border-slate-200">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-16 fade-up">
          
          <div className="lg:w-1/2 relative z-10">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-sm bg-slate-100 text-slate-600 text-[10px] font-black tracking-[0.2em] uppercase mb-6 border-l-2 border-purple-600">
              <Briefcase size={14} className="text-purple-600" /> Soluções Corporativas
            </div>
            
            <h3 className="text-4xl md:text-5xl lg:text-5xl font-black tracking-tighter text-slate-950 mb-6 leading-[1.1]">
              Solidez e proteção para a sua empresa.
            </h3>
            
            <p className="select-copy text-lg text-slate-600 font-medium mb-10 leading-relaxed max-w-lg">
              Garantimos o bem-estar dos seus colaboradores com uma gestão de saúde eficiente, rede credenciada de excelência e suporte dedicado para a sua organização.
            </p>
            
            <div className="space-y-6 mb-12">
              <div className="flex items-start gap-4">
                <div className="mt-1">
                  <Check className="text-purple-600" size={20} strokeWidth={2.5} />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900 mb-1">Cobertura Adaptável</h4>
                  <p className="select-copy text-sm text-slate-500 font-medium">Planos desenhados para PMEs e Grandes Empresas, estendidos a dependentes.</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="mt-1">
                  <Check className="text-purple-600" size={20} strokeWidth={2.5} />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900 mb-1">Gestão Simplificada para o RH</h4>
                  <p className="select-copy text-sm text-slate-500 font-medium">Faturamento unificado e canal de atendimento prioritário para a sua equipe.</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="mt-1">
                  <Check className="text-purple-600" size={20} strokeWidth={2.5} />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900 mb-1">Segurança Ocupacional</h4>
                  <p className="select-copy text-sm text-slate-500 font-medium">Redução de absenteísmo através de prevenção e atendimento rápido.</p>
                </div>
              </div>
            </div>
            
            <a href="https://wa.me/5121294040" target="_blank" rel="noreferrer" className="inline-flex items-center gap-3 px-8 py-4 bg-slate-950 text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] hover:bg-purple-700 transition-colors duration-300">
              Solicitar Proposta <ChevronDown className="-rotate-90" size={16} />
            </a>
          </div>

          <div className="lg:w-1/2 w-full flex justify-center relative z-10 py-12 lg:py-0">
            <div 
              className="relative w-full max-w-sm aspect-square mx-auto group" 
              style={{ perspective: '1000px' }}
            >
              <div 
                className="w-full h-full relative transition-all duration-1000 ease-out group-hover:-translate-y-6" 
                style={{ transformStyle: 'preserve-3d', transform: 'rotateX(55deg) rotateZ(-45deg)' }}
              >
                
                <div 
                  className="absolute inset-0 bg-slate-100/80 rounded-3xl shadow-[0_0_50px_rgba(0,0,0,0.1)] border border-white" 
                  style={{ transform: 'translateZ(0px)' }}
                ></div>
                
                <div 
                  className="absolute inset-0 bg-white/40 backdrop-blur-md rounded-3xl border border-white/80 shadow-xl flex items-center justify-center transition-transform duration-1000 group-hover:bg-white/60" 
                  style={{ transform: 'translateZ(40px)' }}
                >
                  <div className="w-[80%] h-[80%] border border-slate-200/50 rounded-2xl grid grid-cols-2 grid-rows-2">
                    <div className="border-r border-b border-slate-200/50"></div>
                    <div className="border-b border-slate-200/50"></div>
                    <div className="border-r border-slate-200/50"></div>
                    <div></div>
                  </div>
                </div>

                <div 
                  className="absolute inset-0 bg-slate-950 rounded-3xl shadow-2xl border border-slate-800 flex flex-col items-center justify-center gap-4 text-white transition-transform duration-1000 group-hover:shadow-purple-900/40" 
                  style={{ transform: 'translateZ(80px)' }}
                >
                  <div className="w-16 h-16 bg-purple-500/10 rounded-2xl flex items-center justify-center border border-purple-500/20">
                    <Shield size={32} className="text-purple-400" strokeWidth={1.5} />
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-black tracking-tighter italic">PlanoCosta</div>
                    <div className="text-[9px] font-bold tracking-[0.3em] text-purple-400 mt-1 uppercase">Corporate</div>
                  </div>
                </div>

                <div 
                  className="absolute -top-4 -right-4 bg-white px-4 py-2 rounded-lg shadow-lg border border-slate-100 flex items-center gap-2"
                  style={{ transform: 'translateZ(120px) rotateX(-55deg) rotateZ(45deg)' }}
                >
                  <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                  <span className="text-[9px] font-black uppercase tracking-widest text-slate-800">Suporte Ativo</span>
                </div>

              </div>
            </div>
            
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-slate-200 blur-[80px] rounded-full z-0 pointer-events-none" />
          </div>

        </div>
      </section>
      */}

      {/* PLANOS FAMILIARES - REDESIGN PREMIUM */}
      <section id="planos" className="py-32 px-6 bg-slate-50 relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-3xl h-full bg-gradient-to-b from-purple-100/50 to-transparent blur-3xl pointer-events-none -z-10" />

        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20 fade-up">
            <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-purple-600 mb-4 flex items-center justify-center gap-2">
              <Shield size={14} /> Para Você e Sua Família
            </h2>
            <h3 className="text-4xl md:text-6xl font-black tracking-tighter text-slate-950 mb-6">
              Escolha sua <span className="italic font-light text-purple-600">modalidade.</span>
            </h3>
            <div className="select-copy inline-flex items-center gap-3 px-6 py-3 bg-white border border-slate-200 rounded-full text-xs font-bold text-slate-600 shadow-sm">
              <Info size={16} className="text-purple-600"/> 
              Taxa de adesão de R$ 49,99 + proporcional ao mês na abertura.
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-6 items-center">
            {planos.map((plan, index) => {
              const isFeatured = plan.featured;

              return (
                <div 
                  key={index}
                  className={`plan-card relative rounded-[2.5rem] p-8 lg:p-10 transition-colors transition-shadow duration-300 flex flex-col h-full ${
                    isFeatured 
                      ? 'bg-slate-950 text-white border border-slate-800 shadow-2xl shadow-purple-900/30 lg:-my-8 z-10' 
                      : 'bg-white text-slate-900 border border-slate-200 shadow-xl shadow-slate-200/50 hover:border-purple-200'
                  }`}
                >
                  {isFeatured && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-purple-500 to-indigo-500 text-white px-6 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg shadow-purple-500/40 whitespace-nowrap">
                      Mais Escolhido
                    </div>
                  )}

                  <div className="mb-8">
                    <h4 className={`text-xl font-black tracking-tighter mb-2 ${isFeatured ? 'text-white' : 'text-slate-900'}`}>
                      Plano {plan.name}
                    </h4>
                    <p className={`select-copy text-xs font-medium leading-relaxed min-h-[32px] ${isFeatured ? 'text-slate-400' : 'text-slate-500'}`}>
                      {plan.tagline}
                    </p>
                  </div>

                  <div className="mb-8 flex items-end gap-1">
                    <span className="text-sm font-bold text-purple-500 mb-2">R$</span>
                    <span className={`text-6xl font-black tracking-tighter leading-none ${isFeatured ? 'text-white' : 'text-slate-900'}`}>
                      {plan.price}
                    </span>
                    <span className={`text-xs font-bold uppercase tracking-widest mb-1.5 ml-1 ${isFeatured ? 'text-slate-500' : 'text-slate-400'}`}>
                      /mês
                    </span>
                  </div>

                  <hr className={`mb-8 border-t ${isFeatured ? 'border-slate-800' : 'border-slate-100'}`} />

                  <ul className="select-copy space-y-6 mb-12 flex-grow">
                    {[
                      { icon: <Users size={18}/>, title: plan.users, desc: plan.usersDetail },
                      { icon: <Map size={18}/>, title: plan.network, desc: plan.networkDetail },
                      { icon: <Truck size={18}/>, title: plan.ambulance, desc: plan.ambulanceDetail },
                      { icon: <Accessibility size={18}/>, title: "Auxílio Funeral", desc: plan.funeral }
                    ].map((item, i) => (
                      <li key={i} className="flex gap-4 items-start">
                        <div className={`mt-0.5 shrink-0 ${isFeatured ? 'text-purple-400' : 'text-purple-600'}`}>
                          {item.icon}
                        </div>
                        <div className="flex flex-col">
                          <span className={`text-sm font-bold ${isFeatured ? 'text-slate-200' : 'text-slate-800'}`}>
                            {item.title}
                          </span>
                          <span className={`text-xs font-medium mt-0.5 ${isFeatured ? 'text-slate-500' : 'text-slate-500'}`}>
                            {item.desc}
                          </span>
                        </div>
                      </li>
                    ))}
                  </ul>

                  <button
                    onClick={() => openCheckout(plan)}
                    className={`w-full py-5 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] transition-all duration-300 group flex items-center justify-center gap-2 ${
                      isFeatured 
                        ? 'bg-purple-500 text-white hover:bg-purple-400 hover:shadow-lg hover:shadow-purple-500/25' 
                        : 'bg-slate-50 text-slate-900 hover:bg-slate-950 hover:text-white border border-slate-200 hover:border-slate-950'
                    }`}
                  >
                    Contratar {plan.name} 
                    <ChevronDown className="-rotate-90 transition-transform group-hover:translate-x-1" size={14} />
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* FAQ - DESIGN PREMIUM DE DUAS COLUNAS */}
      <section id="faq" className="py-32 px-6 bg-white relative overflow-hidden border-t border-slate-200">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-bl from-slate-50 to-transparent pointer-events-none" />
        
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-16 lg:gap-24 relative z-10">
          
          <div className="lg:w-5/12 lg:sticky lg:top-40 h-fit fade-up">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-sm bg-purple-50 text-purple-600 text-[10px] font-black tracking-[0.2em] uppercase mb-6 border-l-2 border-purple-600">
              <MessageCircle size={14} /> Dúvidas Frequentes
            </div>
            
            <h3 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tighter text-slate-950 mb-6 leading-[0.95]">
              Tudo o que você <span className="italic text-purple-600 font-light">precisa saber.</span>
            </h3>
            
            <p className="select-copy text-lg text-slate-500 font-medium mb-10 leading-relaxed max-w-md">
              Ainda tem alguma dúvida sobre os benefícios, coberturas ou como funciona a adesão ao Plano Costa?
            </p>

            <div className="p-8 bg-slate-50 border border-slate-200 rounded-[2rem] flex flex-col gap-6 relative overflow-hidden group hover:border-purple-300 transition-colors duration-500">
              <div className="absolute top-0 right-0 w-32 h-32 bg-purple-400/10 blur-2xl rounded-full group-hover:scale-150 transition-transform duration-700" />
              
              <div className="flex -space-x-4 relative z-10">
                <div className="w-12 h-12 rounded-full border-2 border-slate-50 bg-gradient-to-br from-purple-400 to-indigo-500 flex items-center justify-center text-white shadow-md"><Users size={20}/></div>
                <div className="w-12 h-12 rounded-full border-2 border-slate-50 bg-gradient-to-br from-slate-800 to-slate-950 flex items-center justify-center text-white shadow-md"><Phone size={20}/></div>
              </div>
              
              <div className="relative z-10">
                <h4 className="text-sm font-bold text-slate-900 mb-1">Precisa de ajuda humana?</h4>
                <p className="select-copy text-xs text-slate-500 font-medium mb-6 leading-relaxed">Nossa equipe de especialistas está pronta para te atender e orientar agora mesmo.</p>
                <a href="https://wa.me/5121294040" target="_blank" rel="noreferrer" className="select-copy inline-flex w-full justify-center items-center gap-3 px-6 py-4 bg-white border border-slate-200 text-slate-900 rounded-xl font-black text-[10px] uppercase tracking-[0.2em] hover:bg-purple-600 hover:text-white hover:border-purple-600 transition-all duration-300">
                  <FaWhatsapp size={16} /> Chamar no WhatsApp
                </a>
              </div>
            </div>
          </div>

          <div className="lg:w-7/12 flex flex-col gap-4 fade-up">
            {faqs.map((faq, index) => {
              const isOpen = openFaq === index;
              return (
                <div 
                  key={index} 
                  className={`group relative overflow-hidden rounded-[2rem] transition-all duration-500 border ${
                    isOpen 
                      ? 'bg-white border-purple-200 shadow-[0_20px_40px_-15px_rgba(168,85,247,0.15)]' 
                      : 'bg-slate-50 border-slate-200 hover:border-purple-300 hover:bg-white hover:shadow-lg hover:shadow-slate-200/50'
                  }`}
                >
                  <button 
                    onClick={() => setOpenFaq(isOpen ? null : index)}
                    className="w-full flex items-center justify-between p-6 md:p-8 text-left focus:outline-none z-10 relative cursor-pointer"
                  >
                    <span className={`text-lg md:text-xl font-black tracking-tight pr-8 transition-colors duration-300 ${isOpen ? 'text-purple-600' : 'text-slate-800 group-hover:text-purple-600'}`}>
                      {faq.q}
                    </span>
                    
                    <div className={`shrink-0 w-12 h-12 rounded-full flex items-center justify-center transition-all duration-500 border ${
                      isOpen 
                        ? 'bg-purple-600 border-purple-600 text-white' 
                        : 'bg-white border-slate-200 text-slate-400 group-hover:border-purple-300 group-hover:text-purple-600'
                    }`}>
                      <ChevronDown size={20} strokeWidth={2.5} className={`transition-transform duration-500 ${isOpen ? 'rotate-180' : '-rotate-90'}`} />
                    </div>
                  </button>
                  
                  <div 
                    className={`grid transition-all duration-500 ease-in-out ${
                      isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
                    }`}
                  >
                    <div className="overflow-hidden">
                      <div className="select-copy p-6 md:p-8 pt-0 text-slate-500 font-medium leading-relaxed text-sm md:text-base">
                        {faq.a}
                      </div>
                    </div>
                  </div>
                  
                  <div className={`absolute top-0 left-0 w-1.5 bg-gradient-to-b from-purple-400 to-purple-600 transition-all duration-500 ease-out rounded-l-[2rem] ${
                    isOpen ? 'h-full opacity-100' : 'h-0 opacity-0'
                  }`} />
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* CONTATO & MAPA */}
      <section id="contato" className="py-32 px-6 bg-slate-50 border-t border-slate-200">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-12 lg:gap-16 items-stretch">
          
          <div className="lg:w-1/2 flex flex-col justify-between fade-up">
            <div className="mb-12">
              <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-purple-600 mb-4">Fale Conosco</h2>
              <h3 className="text-5xl md:text-7xl font-black tracking-tighter text-slate-950 mb-6 leading-[0.9]">
                Estamos aqui <br/><span className="italic text-purple-600">por você.</span>
              </h3>
              <p className="select-copy text-lg text-slate-500 font-medium leading-relaxed max-w-md">
                Equipe especializada pronta para tirar suas dúvidas, agendar consultas e oferecer o suporte que sua família merece.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-auto">
              <a href="https://wa.me/5121294040" target="_blank" rel="noreferrer" className="select-copy p-8 bg-white border border-slate-200 rounded-[2rem] hover:border-purple-300 hover:shadow-xl transition-all group cursor-pointer flex flex-col justify-center">
                <div className="w-14 h-14 bg-purple-50 rounded-2xl flex items-center justify-center text-purple-600 mb-6 group-hover:scale-110 transition-transform">
                  <FaWhatsapp size={28} strokeWidth={1.5} />
                </div>
                <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Suporte & WhatsApp</h4>
                <div className="text-2xl font-black text-slate-900 group-hover:text-purple-600 transition-colors">(51) 2129-4040</div>
              </a>

              <div className="select-copy p-8 bg-slate-950 border border-slate-800 rounded-[2rem] hover:shadow-xl transition-all group text-white flex flex-col justify-center">
                <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center text-white mb-6 group-hover:scale-110 transition-transform">
                  <Phone size={28} strokeWidth={1.5} />
                </div>
                <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Emergências 24h</h4>
                <div className="text-xl font-black text-white flex items-center gap-2">0800-000-4356
                <CopyToClipboard text="0800-000-4356" onCopy={() => toast('Número copiado para área de transferência')}>
                  <Clipboard className="text-white text-xs font-bold uppercase tracking-widest"></Clipboard>
                </CopyToClipboard>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:w-1/2 w-full fade-up">
            <div className="bg-white border border-slate-200 rounded-[2rem] overflow-hidden hover:shadow-xl transition-shadow flex flex-col h-full min-h-[450px]">
              
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
              
              <div className="select-copy p-8 flex items-center gap-6 bg-white z-10 relative">
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
      <footer className="bg-slate-950 text-white pt-20 md:pt-24 pb-10 md:pb-12 px-6 relative z-50 rounded-t-[2.5rem] md:rounded-t-[3rem] -mt-6 md:-mt-10 overflow-hidden border-t border-slate-800">
        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 lg:gap-8 mb-12 md:mb-16 text-center sm:text-left">
          <div className="flex flex-col gap-4 md:gap-6 lg:pr-8 items-center sm:items-start">
            <div className="text-xl md:text-2xl tracking-tighter text-white">
              <span className="font-light">Plano</span> <span className="font-bold italic text-purple-400">Costa</span>
            </div>
            <p className="select-copy text-slate-400 font-light text-xs md:text-sm leading-relaxed max-w-[250px] sm:max-w-none">
              Planos acessíveis e completos para cuidar de quem importa, com cobertura regional e suporte dedicado.
            </p>
            <div className="flex gap-4 mt-2 justify-center sm:justify-start">
              <a href="https://wa.me/5121294040" target="_blank" rel="noopener noreferrer" aria-label="WhatsApp" className="w-10 h-10 rounded-full border border-slate-700 flex items-center justify-center text-slate-300 hover:bg-[#25D366] hover:text-white hover:border-[#25D366] transition-colors">
                <FaWhatsapp size={18} />
              </a>
              <a href="https://www.instagram.com/planocosta/" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="w-10 h-10 rounded-full border border-slate-700 flex items-center justify-center text-slate-300 hover:bg-white hover:text-slate-950 transition-colors">
                <FaInstagram size={18} />
              </a>
              <a href="https://www.facebook.com/planocosta/?locale=pt_BR" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="w-10 h-10 rounded-full border border-slate-700 flex items-center justify-center text-slate-300 hover:bg-white hover:text-slate-950 transition-colors">
                <FaFacebook size={18} />
              </a>
            </div>
          </div>

          <div>
            <h4 className="text-[10px] md:text-xs font-bold uppercase tracking-widest text-slate-500 mb-4 md:mb-6">Navegação</h4>
            <ul className="flex flex-col gap-3 md:gap-4 text-slate-300 font-light text-xs md:text-sm items-center sm:items-start">
              <li><a href="#beneficios" className="hover:text-white transition-colors">Benefícios</a></li>
              <li><a href="#rede" className="hover:text-white transition-colors">Rede Credenciada</a></li>
              <li><a href="#planos" className="hover:text-white transition-colors">Planos</a></li>
              <li><a href="#contato" className="hover:text-white transition-colors">Contato</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-[10px] md:text-xs font-bold uppercase tracking-widest text-slate-500 mb-4 md:mb-6">Atendimento</h4>
            <ul className="select-copy flex flex-col gap-3 md:gap-4 text-slate-300 font-light text-xs md:text-sm w-full max-w-[240px] mx-auto sm:mx-0">
              <li className="flex justify-between border-b border-slate-800 pb-2 md:pb-3">
                <span>Suporte</span>
                <span className="font-bold text-white">(51) 2129-4040</span>
              </li>
              <li className="flex justify-between border-b border-slate-800 pb-2 md:pb-3">
                <span>Emergência</span>
                <span className="font-bold text-white">0800-000-4356</span>
              </li>
              <li className="flex justify-between pt-1 gap-4">
                <span>Sede</span>
                <span className="font-bold text-white text-right">Taquari/RS</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="max-w-7xl mx-auto pt-6 md:pt-8 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center md:items-end gap-8">
          <div className="flex flex-col sm:flex-row sm:flex-wrap sm:items-center justify-center md:justify-start gap-4 sm:gap-6 text-[9px] md:text-[10px] font-bold uppercase tracking-widest text-slate-500 text-center md:text-left">
            <div className="select-copy">© {new Date().getFullYear()} Plano Costa. Taquari/RS.</div>
          </div>
          <div className="text-center md:text-right shrink-0">
            <div className="text-[8px] font-black uppercase tracking-[0.4em] text-slate-500 mb-2">Desenvolvido por</div>
            <a href="https://codeytech.com.br" target="_blank" rel="noopener noreferrer" className="text-lg md:text-xl font-black text-white hover:text-purple-400 transition-colors italic inline-block">Codey Tech.</a>
          </div>
        </div>
      </footer>

    </div>
      {isCheckoutOpen && (
        <CheckoutModal 
          isOpen={isCheckoutOpen} 
          onClose={() => setIsCheckoutOpen(false)} 
          plan={selectedPlanForCheckout} 
        />
      )}
      <ToastContainer />
    </LenisProvider>
  );
};