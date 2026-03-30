"use client";
import React, { useRef, useState, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import LenisProvider from '../../components/LenisProvider';
import { 
  Stethoscope, Microscope, Activity, 
  MapPin, Clock, ArrowRight, Shield, 
  Phone, Sparkles, HeartPulse, Brain,
  Baby, Smile, Dumbbell, UserRound, Plus,
} from 'lucide-react';
import { FaInstagram, FaFacebook } from 'react-icons/fa';

gsap.registerPlugin(ScrollTrigger);
ScrollTrigger.config({ ignoreMobileResize: true });

const SOBRE_BG_IMAGE = "/clinica/clinica.webp";

export default function CentroClinicoLight() {
  const container = useRef();
  
  // Refs
  const heroSectionRef = useRef();
  const heroTextRef = useRef();
  const sobrePinRef = useRef();
  const sobreBgParallaxRef = useRef(); 
  const sobreBgRef = useRef();
  const sobreContentRef = useRef();
  const badgeRef = useRef();
  const shape1Ref = useRef();
  const shape2Ref = useRef();
  const shape3Ref = useRef();
  const shape4Ref = useRef();
  const horizontalContainerRef = useRef(); 
  const horizontalWrapperRef = useRef(); 
  const teamGridRef = useRef(null);
  
  const [isLoading, setIsLoading] = useState(true);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    if (isLoading) {
      document.body.style.overflow = 'hidden';
      const timer = setTimeout(() => setIsLoading(false), 2500);
      return () => clearTimeout(timer);
    } else {
      document.body.style.overflow = '';
      const syncLenisAndGSAP = () => {
        ScrollTrigger.refresh();
        window.dispatchEvent(new Event('resize'));
      };
      setTimeout(syncLenisAndGSAP, 100);
      setTimeout(syncLenisAndGSAP, 500);
      setTimeout(syncLenisAndGSAP, 1000);
    }
  }, [isLoading]);

  // EFEITO MAGNÉTICO (MOUSE PARALLAX)
  useEffect(() => {
    if (isLoading) return;
    const xToBadge = gsap.quickTo(badgeRef.current, "x", { duration: 0.4, ease: "power2" });
    const yToBadge = gsap.quickTo(badgeRef.current, "y", { duration: 0.4, ease: "power2" });
    const xToS1 = gsap.quickTo(shape1Ref.current, "x", { duration: 0.8, ease: "power3" });
    const yToS1 = gsap.quickTo(shape1Ref.current, "y", { duration: 0.8, ease: "power3" });
    const xToS2 = gsap.quickTo(shape2Ref.current, "x", { duration: 0.9, ease: "power3" });
    const yToS2 = gsap.quickTo(shape2Ref.current, "y", { duration: 0.9, ease: "power3" });
    const xToS3 = gsap.quickTo(shape3Ref.current, "x", { duration: 1.2, ease: "power3" });
    const yToS3 = gsap.quickTo(shape3Ref.current, "y", { duration: 1.2, ease: "power3" });

    const handleMouseMove = (e) => {
      const { innerWidth, innerHeight } = window;
      const x = e.clientX - innerWidth / 2;
      const y = e.clientY - innerHeight / 2;
      xToBadge(x * 0.02); yToBadge(y * 0.02);
      xToS1(x * 0.05); yToS1(y * 0.05);
      xToS2(x * -0.04); yToS2(y * -0.04);
      xToS3(x * 0.03); yToS3(y * 0.03);
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [isLoading]);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useGSAP(() => {
    if (isLoading) return;

    ScrollTrigger.addEventListener("refresh", () => {
      window.dispatchEvent(new Event("resize"));
    });

    // 1. Idle Animation
    gsap.utils.toArray('.floating-shape').forEach((shape) => {
      gsap.to(shape, {
        y: "random(-20, 20)", x: "random(-15, 15)", rotation: "random(-15, 15)",
        duration: "random(3, 5)", repeat: -1, yoyo: true, ease: "sine.inOut",
      });
    });

    // 2. Hero Reveal
    const tl = gsap.timeline();
    tl.fromTo(".hero-line span", 
      { y: 100, opacity: 0, skewY: 5 },
      { y: 0, opacity: 1, skewY: 0, duration: 1.2, stagger: 0.1, ease: "power4.out", delay: 0.2 }
    )
    .fromTo(".hero-fade", 
      { opacity: 0, y: 20 }, 
      { opacity: 1, y: 0, duration: 1, ease: "power2.out" }, "-=0.8"
    )
    .fromTo(".floating-shape", 
      { opacity: 0, scale: 0 }, 
      { opacity: 1, scale: 1, duration: 1, stagger: 0.1, ease: "back.out(1.5)" }, "-=0.5"
    );

    // 3. Parallax Text Hero
    const heroParallaxTargets = [heroTextRef.current, ".floating-shape"].filter(Boolean);
    gsap.to(heroParallaxTargets.length ? heroParallaxTargets : ".floating-shape", {
      y: -250, opacity: 0, ease: "none",
      scrollTrigger: { trigger: heroSectionRef.current, start: "top top", end: "bottom top", scrub: true }
    });

    // 3.5 Efeito Cortina Seguro (Set + To para consistência)
    if (sobreBgParallaxRef.current) {
      gsap.set(sobreBgParallaxRef.current, { yPercent: -40 });
      gsap.to(sobreBgParallaxRef.current, {
        yPercent: 0, 
        ease: "none", 
        scrollTrigger: { trigger: heroSectionRef.current, start: "top top", end: "bottom top", scrub: true }
      });
    }

    // ------------------------------------------------------------------------
    // 4. Seção Sobre - ESTRUTURA BLINDADA (SEM FROMTO NAS TIMELINES DE SCROLL)
    // ------------------------------------------------------------------------
    const viewportRef = Math.max(window.innerWidth, window.innerHeight);
    const initialSobreScale = Math.max(36, viewportRef / 52);
    
    // Configura todo o estado inicial rigidamente antes de animar
    gsap.set(".zoom-target", { svgOrigin: "960 600", scale: initialSobreScale, x: 0, y: -240 });
    gsap.set(".sobre-overlay", { opacity: 0 });
    gsap.set(".color-text", { fill: "transparent" });
    gsap.set(".y-mover", { y: 0 });
    if (sobreBgRef.current) gsap.set(sobreBgRef.current, { scale: 1.15 });
    if (sobreContentRef.current) gsap.set(sobreContentRef.current, { opacity: 0, y: 100 });

    ScrollTrigger.getById("centro-sobre")?.kill();
    const sobreScrollTl = gsap.timeline({
      scrollTrigger: {
        id: "centro-sobre", 
        trigger: sobrePinRef.current, 
        start: "top top", 
        end: "+=280%", 
        pin: true, 
        pinSpacing: true, 
        scrub: true, // true em vez de 1 garante o travamento imediato quando o scroll para
        invalidateOnRefresh: true
      }
    });

    const delayZoom = 1.5; 
    sobreScrollTl.to({}, { duration: delayZoom }); 

    // Agora todas as animações têm ease: "none" para mapear perfeitamente ao movimento do dedo/mouse
    sobreScrollTl
      .to(".zoom-target", { scale: 1, x: 0, y: 0, duration: 3.5, ease: "none" }, delayZoom)
      .to(".sobre-overlay", { opacity: 1, duration: 0.9, ease: "none" }, delayZoom);

    if (sobreBgRef.current) {
      sobreScrollTl.to(sobreBgRef.current, { scale: 1, duration: 3.5, ease: "none" }, delayZoom);
    }

    sobreScrollTl
      .to(".color-text", { fill: "#1C1C15", duration: 0.3, ease: "none" }, delayZoom + 3.0)
      .to(".y-mover", { y: -300, duration: 1.5, ease: "none" }, delayZoom + 3.5)
      .to(sobreContentRef.current, { opacity: 1, y: 0, duration: 1.5, ease: "none" }, delayZoom + 3.8);

    // 5. Parallax Imagens Internas
    gsap.utils.toArray('.img-parallax').forEach(img => {
      if (horizontalContainerRef.current && horizontalContainerRef.current.contains(img)) return;
      gsap.to(img, {
        yPercent: 15, ease: "none",
        scrollTrigger: { trigger: img.parentElement, start: "top bottom", end: "bottom top", scrub: true }
      });
    });

    // Grid da equipe — cascata (stagger) com gatilho estável + sem flash inicial
    ScrollTrigger.getById("team-grid-cascade")?.kill();
    const teamCards = teamGridRef.current
      ? teamGridRef.current.querySelectorAll(".team-card")
      : [];
    if (teamCards.length) {
      gsap.set(teamCards, { opacity: 0, y: 56, scale: 0.98 });
      gsap.to(teamCards, {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.75,
        ease: "power3.out",
        stagger: { each: 0.1, from: "start" },
        scrollTrigger: {
          id: "team-grid-cascade",
          trigger: teamGridRef.current,
          start: "top 82%",
          toggleActions: "play none none none",
          once: true,
          invalidateOnRefresh: true,
        },
      });
    }

    // 6. HORIZONTAL SCROLL
    if (horizontalWrapperRef.current && horizontalContainerRef.current) {
      ScrollTrigger.getById("centro-horizontal")?.kill();
      const wrapper = horizontalWrapperRef.current;
      const scrollContainer = horizontalContainerRef.current;
      
      gsap.to(wrapper, {
        x: "-200vw", ease: "none",
        scrollTrigger: {
          id: "centro-horizontal", trigger: scrollContainer, start: "top top",
          end: () => `+=${window.innerWidth * 2}`, pin: true, pinSpacing: true, scrub: true, invalidateOnRefresh: true
        }
      });
    }

    // 7. Reveal seções (Este pode manter o ease porque não tem scrub)
    gsap.utils.toArray('.fade-up').forEach((elem) => {
      gsap.from(elem, {
        scrollTrigger: { trigger: elem, start: "top 85%" },
        y: 50, opacity: 0, duration: 1, ease: "power3.out"
      });
    });

  }, { scope: container, dependencies: [isLoading] });

  const profissionais = [
    { name: "Dr. Anderson Silveira", spec: "Clínica Geral", img: "/profissionais/anderson.jpeg" },
    { name: "Dra. Lívia Morsch", spec: "Otorrinolaringologia", img: "/profissionais/livia.jpeg" },
    { name: "Dr. Giuliano Chagas", spec: "Traumatologia e Ortopedia", img: "/profissionais/giuliano.jpeg" },
    { name: "Dra. Mariana Bellonci", spec: "Endocrinologia", img: "/profissionais/mariana.jpeg" },
    { name: "Dr. Guilherme Vogt", spec: "Cardiologia", img: "/profissionais/guilherme.jpeg" },
    { name: "Dra. Ianka Thamylla", spec: "Ginecologia", img: "/profissionais/ianka.jpeg" },
    { name: "Dr. Cristiano Sbruzzi", spec: "Dermatologia", img: "/profissionais/cristiano.jpeg" },
    { name: "Dr. Luiz Augusto", spec: "Psiquiatria", img: "/profissionais/luis.jpeg" }
  ];

  const exames = ["ECG", "Teste Ergométrico", "Holter", "MAPA", "Espirometria", "Eletroencefalograma (Vigília)"];

  return (
    <LenisProvider>
    <div className={`fixed inset-0 z-[99999] bg-[#FDF9EE] flex flex-col items-center justify-center transition-all duration-1000 ease-[cubic-bezier(0.76,0,0.24,1)] ${isLoading ? 'translate-y-0' : '-translate-y-full'}`}>
      <div className="overflow-hidden">
        <div className={`text-4xl md:text-5xl font-light tracking-tighter text-[#1C1C15] flex items-center gap-2 transition-transform duration-1000 delay-300 ${isLoading ? 'translate-y-0' : 'translate-y-full'}`}>
          Centro Clínico <span className="font-bold italic text-[#605E56]">Costa.</span>
        </div>
      </div>
      <div className="w-48 h-[1px] bg-[#E6E2D7] mt-8 relative overflow-hidden">
        <div className="absolute top-0 left-0 h-full bg-[#1C1C15] w-full origin-left animate-[scaleX_2.5s_ease-in-out]" />
      </div>
    </div>

    <div ref={container} className="bg-[#FDF9EE] text-[#1C1C15] font-sans selection:bg-[#CAC6BC] selection:text-[#1C1C15]">
      
      <nav className={`fixed top-0 w-full z-50 transition-all duration-700 ease-out ${isScrolled ? 'bg-[#FDF9EE]/90 backdrop-blur-xl py-4 px-6 border-b border-[#E6E2D7]' : 'bg-transparent py-8 px-6'}`}>
        <div className="flex justify-between items-center max-w-7xl mx-auto">
          <div className="text-xl tracking-tighter text-[#1C1C15]">
            <span className="font-light">Centro Clínico</span> <span className="font-bold italic text-[#48473F]">Costa</span>
          </div>
          <div className="hidden lg:flex gap-12 text-xs font-semibold uppercase tracking-[0.2em]">
            {['Sobre', 'Estrutura', 'Corpo Clínico', 'Contato'].map(item => (
              <a key={item} href={`#${item.toLowerCase().replace(' ', '-').replace('í', 'i')}`} className="relative group overflow-hidden text-[#605E56] hover:text-[#1C1C15] transition-colors">
                {item}
                <span className="absolute bottom-0 left-0 w-full h-[1px] bg-[#1C1C15] transform -translate-x-[101%] group-hover:translate-x-0 transition-transform duration-300" />
              </a>
            ))}
          </div>
          <a href="https://wa.me/5121294040" target="_blank" rel="noreferrer" className={`px-8 py-3 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all duration-500 hover:scale-105 ${isScrolled ? 'bg-[#1C1C15] text-[#FDF9EE] hover:bg-[#323129]' : 'bg-[#1C1C15] text-[#FDF9EE] hover:bg-[#323129]'}`}>
            Agendar Consulta
          </a>
        </div>
      </nav>

      {/* HERO SECTION Z-INDEX 20 */}
      <section ref={heroSectionRef} className="relative h-screen flex flex-col justify-center px-6 bg-[#FDF9EE] z-20 shadow-[0_20px_50px_rgba(28,28,21,0.1)]">
        <div className="absolute inset-0 z-0 overflow-clip pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-[50vw] h-[50vw] bg-[#EFEBE0]/60 rounded-full blur-[100px]" />
          <div ref={shape1Ref} className="floating-shape absolute top-[20%] right-[15%] text-[#E6E2D7] opacity-0"><Plus size={80} strokeWidth={1} /></div>
          <div ref={shape2Ref} className="floating-shape absolute bottom-[25%] left-[10%] w-16 h-8 rounded-full border border-[#CAC6BC] bg-[#F5F0E5] opacity-0 rotate-12" />
          <div ref={shape3Ref} className="floating-shape absolute top-[30%] left-[20%] w-8 h-8 rounded-full bg-[#E6E2D7] opacity-0" />
          <div ref={shape4Ref} className="floating-shape absolute bottom-[20%] right-[25%] text-[#CAC6BC] opacity-0"><Activity size={40} strokeWidth={1.5} /></div>
        </div>

        <div ref={heroTextRef} className="relative z-10 max-w-7xl mx-auto w-full flex flex-col items-center text-center mt-10">
          <div ref={badgeRef} className="hero-fade inline-flex items-center gap-2 px-5 py-2 rounded-full border border-[#CAC6BC] bg-[#F5F0E5]/80 backdrop-blur-md text-[10px] font-bold tracking-[0.3em] uppercase text-[#605E56] mb-8 will-change-transform">
            <HeartPulse size={14} className="text-[#323129]" /> Cuidado & Tecnologia
          </div>
          <h1 className="text-5xl md:text-7xl lg:text-[6vw] leading-[0.95] tracking-tighter text-[#1C1C15] flex flex-col items-center">
            <div className="overflow-hidden hero-line pb-2"><span className="inline-block font-light">Cuidar de você é a</span></div>
            <div className="overflow-hidden hero-line pb-2"><span className="inline-block font-black italic text-[#323129]">nossa prioridade.</span></div>
          </h1>
          <p className="hero-fade mt-8 text-lg md:text-2xl text-[#605E56] max-w-2xl font-light leading-relaxed">
            Atendimento humanizado e saúde de qualidade, <strong className="font-semibold text-[#1C1C15]">todos os dias.</strong>
          </p>
          <div className="mt-16 flex flex-col items-center gap-3 hero-fade opacity-70">
            <div className="text-[9px] uppercase tracking-widest text-[#79776E]">Role para descobrir</div>
            <div className="w-[1px] h-12 bg-[#E6E2D7] relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1/2 bg-[#323129] animate-[slideDown_2s_infinite]" />
            </div>
          </div>
        </div>
      </section>

      {/* SEÇÃO SOBRE */}
      <section ref={sobrePinRef} id="sobre" className="h-screen w-full relative bg-[#F5F0E5] overflow-clip border-t border-[#E6E2D7]">
        <div className="absolute inset-0 w-full h-full z-0 overflow-clip pointer-events-none">
          <div ref={sobreBgParallaxRef} className="w-full h-full will-change-transform">
            <div ref={sobreBgRef} className="w-full h-full bg-cover bg-center will-change-transform" style={{ backgroundImage: `url('${SOBRE_BG_IMAGE}')` }} />
          </div>
        </div>
        
        <svg className="absolute inset-0 w-full h-full z-10 pointer-events-none" viewBox="0 0 1920 1080" preserveAspectRatio="xMidYMid slice">
          <defs>
            <mask id="gta-true-mask">
              <rect x="0" y="0" width="1920" height="1080" fill="white" />
              <g className="y-mover">
                <g className="zoom-target will-change-transform">
                  <text x="960" y="480" textAnchor="middle" dominantBaseline="middle" fill="black" className="sobre-line-1 font-light " fontSize="80" style={{ fontFamily: 'inherit' }}>Sobre o</text>
                  <text x="960" y="600" textAnchor="middle" dominantBaseline="middle" fill="black" className="sobre-line-2 font-black italic " fontSize="130" style={{ fontFamily: 'inherit' }}>Centro Clínico Costa</text>
                </g>
              </g>
            </mask>
          </defs>
          <rect className="sobre-overlay" x="0" y="0" width="1920" height="1080" fill="#F5F0E5" mask="url(#gta-true-mask)" />
          <g className="y-mover">
            <g className="zoom-target color-text will-change-transform">
              <text x="960" y="480" textAnchor="middle" dominantBaseline="middle" className="sobre-line-1 font-light" fontSize="80" style={{ fontFamily: 'inherit' }}>Sobre o</text>
              <text x="960" y="600" textAnchor="middle" dominantBaseline="middle" className="sobre-line-2 font-black italic" fontSize="130" style={{ fontFamily: 'inherit' }}>Centro Clínico Costa</text>
            </g>
          </g>
        </svg>

        <div ref={sobreContentRef} className="absolute inset-0 w-full h-full z-20 flex flex-col justify-end pb-[10vh] px-6 opacity-0 pointer-events-auto">
          <div className="max-w-7xl mx-auto w-full flex flex-col md:flex-row gap-12 items-center">
            <div className="w-full md:w-1/2 space-y-5">
              <h2 className="text-[10px] font-bold tracking-[0.4em] uppercase text-[#79776E] mb-2">Nossa História</h2>
              <p className="text-lg md:text-xl text-[#605E56] font-light leading-relaxed">
                O Centro Clínico Costa nasceu com a missão de oferecer atendimento de saúde humanizado e de qualidade para toda a família. Com uma equipe qualificada e diversas especialidades, estamos sempre próximos de você, cuidando do que mais importa: a sua saúde.
              </p>
              <p className="text-lg md:text-xl text-[#605E56] font-light leading-relaxed">
                Além disso, somos um espaço moderno que oferece salas para médicos autônomos trabalharem com autonomia e conforto, promovendo um ambiente colaborativo e profissional.
              </p>
            </div>
            <div className="w-full md:w-1/2 flex justify-center md:justify-end relative mt-8 md:mt-0">
               <div className="w-full max-w-lg aspect-video md:aspect-[4/3] bg-[#EFEBE0] rounded-[2rem] overflow-hidden relative border border-[#E6E2D7] shadow-xl">
                  <div className="absolute inset-0 opacity-80 mix-blend-multiply bg-[url('/clinica/fachada.webp')] bg-cover bg-center img-parallax scale-125" />
               </div>
               <div className="absolute -bottom-6 -left-4 md:-left-8 bg-[#FDF9EE] p-5 md:p-6 rounded-3xl shadow-xl border border-[#E6E2D7] flex items-center gap-4">
                 <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-[#1C1C15] text-[#FDF9EE] flex items-center justify-center">
                   <Shield size={20} />
                 </div>
                 <div>
                   <div className="text-[9px] md:text-[10px] font-bold tracking-widest uppercase text-[#79776E]">Integração Total</div>
                   <div className="font-black text-[#1C1C15] text-sm md:text-base">Plano Costa</div>
                 </div>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* HORIZONTAL SCROLL - ESTRUTURA */}
      <section ref={horizontalContainerRef} id="estrutura" className="h-[100vh] w-full overflow-clip bg-[#1C1C15] text-[#FDF9EE] relative z-30">
        <div ref={horizontalWrapperRef} className="flex flex-nowrap h-full w-[300vw] will-change-transform">
          
          <div className="h-panel w-[100vw] h-full shrink-0 flex items-center justify-center px-6 md:px-20 relative border-r border-[#323129]">
            <div className="max-w-3xl text-center flex flex-col items-center">
              <Activity className="text-[#939187] mb-8" size={48} strokeWidth={1} />
              <h2 className="text-[10px] font-bold tracking-[0.4em] uppercase text-[#CAC6BC] mb-6">Nossa Estrutura</h2>
              <h3 className="text-5xl md:text-7xl font-light tracking-tighter leading-tight mb-8">
                Foco no paciente, <br/><span className="font-black italic text-white">agilidade no diagnóstico.</span>
              </h3>
              <p className="text-xl text-[#AEABA1] font-light leading-relaxed mb-10 max-w-2xl">
                Nossas instalações foram planejadas para garantir um fluxo de atendimento inteligente. Segurança médica e respeito ao seu tempo em um ambiente de alto padrão.
              </p>
            </div>
          </div>

          <div className="h-panel w-[100vw] h-full shrink-0 flex flex-col md:flex-row items-center px-6 md:px-20 gap-12 relative border-r border-[#323129]">  
            {/* TEXTO (MANTIDO IGUAL) */}
            <div className="w-full md:w-1/2 max-w-xl">
                <div className="inline-flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-full border border-[#605E56] flex items-center justify-center text-[#FDF9EE]">
                    <Stethoscope size={20} />
                </div>
                <span className="text-[#AEABA1] font-bold uppercase tracking-widest text-xs">03 Consultórios</span>
                </div>
                <h3 className="text-4xl md:text-5xl font-black tracking-tighter mb-6 text-white">
                Atendimento <br/><span className="font-light italic text-[#939187]">Autônomo & Confortável</span>
                </h3>
                <p className="text-lg text-[#AEABA1] font-light leading-relaxed mb-8">
                Salas projetadas para acolhimento e avaliação clínica. Oferecemos estrutura para médicos autônomos trabalharem com total independência, garantindo um ambiente colaborativo.
                </p>
            </div>

            {/* DUAS FOTOS COM EFEITO DESALINHADO E VIVAS */}
            <div className="w-full md:w-1/2 h-[50vh] md:h-[70vh] flex gap-4 md:gap-6">
                
                {/* Consultório 1 - Alinhado ao topo, opacidade total */}
                <div className="w-1/2 h-[85%] rounded-[2rem] overflow-hidden relative self-start group">
                <div className="absolute inset-0 bg-[#323129]" />
                <div className="absolute inset-0 opacity-100 bg-[url('/clinica/consultorio2.webp')] bg-cover bg-center img-parallax scale-125" />
                </div>

                {/* Consultório 2 - Alinhado na base, opacidade total */}
                <div className="w-1/2 h-[85%] rounded-[2rem] overflow-hidden relative self-end group">
                <div className="absolute inset-0 bg-[#323129]" />
                <div className="absolute inset-0 opacity-100 bg-[url('/clinica/consultorio1.webp')] bg-cover bg-center img-parallax scale-125" />
                </div>
            </div>
        </div>

          <div className="h-panel w-[100vw] h-full shrink-0 flex flex-col md:flex-row items-center px-6 md:px-20 gap-12 relative">
            <div className="w-full md:w-1/2 h-[50vh] md:h-[70vh] rounded-[2rem] overflow-hidden relative order-2 md:order-1">
              <div className="absolute inset-0 bg-[#323129]" />
              <div className="absolute inset-0 opacity-60 mix-blend-overlay bg-[url('https://images.unsplash.com/photo-1579684385127-1ef15d508118?q=80&w=2080&auto=format&fit=crop')] bg-cover bg-center img-parallax scale-125" />
            </div>
            <div className="w-full md:w-1/2 max-w-xl order-1 md:order-2">
              <div className="inline-flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-full border border-[#605E56] flex items-center justify-center text-[#FDF9EE]">
                  <Microscope size={20} />
                </div>
                <span className="text-[#AEABA1] font-bold uppercase tracking-widest text-xs">01 Sala Técnica</span>
              </div>
              <h3 className="text-4xl md:text-5xl font-black tracking-tighter mb-6 text-white">Centro de <br/><span className="font-light italic text-[#939187]">Diagnóstico</span></h3>
              <p className="text-lg text-[#AEABA1] font-light leading-relaxed mb-8">
                Equipada para avaliações complementares imediatas. Tecnologia médica confiável para direcionar o seu tratamento sem precisar sair da clínica.
              </p>
              <div className="flex flex-wrap gap-2">
                {exames.map((exame, i) => (
                  <span key={i} className="px-4 py-2 bg-[#323129] border border-[#48473F] rounded-full text-xs font-bold text-[#CAC6BC]">
                    {exame}
                  </span>
                ))}
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* EQUIPE MÉDICA */}
      <section id="corpo-clinico" className="py-32 px-6 bg-[#FDF9EE] relative z-40 border-t border-[#E6E2D7] w-full overflow-x-hidden">
        <div className="max-w-7xl mx-auto mb-16 fade-up text-center md:text-left px-0">
          <h2 className="text-[10px] font-bold tracking-[0.4em] uppercase text-[#79776E] mb-4">Especialistas em Taquari</h2>
          <h3 className="text-4xl md:text-5xl font-light tracking-tighter text-[#1C1C15] leading-tight">
            Conheça os profissionais que fazem <br /> parte do nosso <span className="font-black italic text-[#323129]">Centro Clínico.</span>
          </h3>
          <p className="text-[#605E56] font-medium mt-4 max-w-lg mx-auto md:mx-0">
            Profissionais altamente capacitados prontos para oferecer o melhor atendimento nas mais diversas áreas da saúde.
          </p>
        </div>

        <div ref={teamGridRef} className="team-grid max-w-7xl mx-auto w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {profissionais.map((prof, i) => (
            <a
              key={prof.name}
              href="#contato"
              className="team-card group relative min-w-0 w-full rounded-3xl overflow-hidden bg-[#EFEBE0] shadow-md hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 cursor-pointer"
            >
              <div className="aspect-[4/5] overflow-hidden relative">
                <img
                  src={prof.img}
                  alt={prof.name}
                  className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-700 ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1C1C15]/90 via-[#1C1C15]/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-500" />
              </div>

              <div className="absolute bottom-0 left-0 w-full p-6 flex flex-col justify-end">
                <h4 className="text-[10px] font-bold tracking-widest uppercase text-[#CAC6BC] mb-1">{prof.spec}</h4>
                <h5 className="text-xl font-black text-[#FDF9EE] leading-tight mb-4">{prof.name}</h5>
                <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#E6E2D7] group-hover:text-white transition-colors">
                  Agendar <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </a>
          ))}
        </div>
      </section>

      {/* NOVA SEÇÃO DE CONTATO */}
      <section id="contato" className="py-32 px-6 bg-[#F5F0E5] relative z-40 border-t border-[#E6E2D7]">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-16 items-center">
          
          <div className="w-full lg:w-1/2 fade-up">
            <h2 className="text-[10px] font-bold tracking-[0.4em] uppercase text-[#79776E] mb-4">Fale Conosco</h2>
            <h3 className="text-5xl md:text-7xl font-light tracking-tighter text-[#1C1C15] leading-[0.9] mb-8">
              Agende sua <br/> <span className="font-black italic text-[#323129]">consulta.</span>
            </h3>
            <p className="text-lg text-[#605E56] font-light mb-12 max-w-md leading-relaxed">
              Atendemos na modalidade <strong className="font-semibold text-[#1C1C15]">Particular</strong> e através do convênio <strong className="font-semibold text-[#1C1C15]">Plano Costa</strong>. Entre em contato para verificar horários disponíveis.
            </p>
            
            <div className="flex flex-col gap-8">
              <div className="flex items-center gap-6 group cursor-pointer">
                <div className="w-14 h-14 bg-[#1C1C15] rounded-full flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform"><Phone className="text-[#FDF9EE]" size={24} /></div>
                <div>
                  <div className="text-[10px] font-bold uppercase tracking-widest text-[#79776E] mb-1">Telefone / WhatsApp</div>
                  <div className="text-2xl font-black text-[#1C1C15]">(51) 2129-4040</div>
                </div>
              </div>
              <div className="flex items-center gap-6">
                <div className="w-14 h-14 bg-[#1C1C15] rounded-full flex items-center justify-center shrink-0"><MapPin className="text-[#FDF9EE]" size={24} /></div>
                <div>
                  <div className="text-[10px] font-bold uppercase tracking-widest text-[#79776E] mb-1">Endereço</div>
                  <div className="text-base font-medium text-[#1C1C15]">Rua Sete de Setembro, 2356 - Centro, Taquari/RS</div>
                </div>
              </div>
            </div>
          </div>

          <div className="w-full lg:w-1/2 fade-up">
            <form className="bg-[#FDF9EE] p-8 md:p-12 rounded-[2.5rem] border border-[#E6E2D7] shadow-xl relative overflow-hidden">
               <div className="absolute top-0 right-0 w-32 h-32 bg-[#EFEBE0] rounded-bl-full -z-0 opacity-50 pointer-events-none" />
               <div className="relative z-10 flex flex-col gap-6">
                  <div>
                    <label className="text-xs font-bold uppercase tracking-widest text-[#79776E] mb-2 block">Nome Completo</label>
                    <input type="text" className="w-full bg-transparent border-b border-[#CAC6BC] py-3 text-[#1C1C15] focus:outline-none focus:border-[#1C1C15] transition-colors placeholder:text-[#AEABA1]" placeholder="Como podemos te chamar?" />
                  </div>
                  <div>
                    <label className="text-xs font-bold uppercase tracking-widest text-[#79776E] mb-2 block">Telefone</label>
                    <input type="tel" className="w-full bg-transparent border-b border-[#CAC6BC] py-3 text-[#1C1C15] focus:outline-none focus:border-[#1C1C15] transition-colors placeholder:text-[#AEABA1]" placeholder="(51) 90000-0000" />
                  </div>
                  <div>
                    <label className="text-xs font-bold uppercase tracking-widest text-[#79776E] mb-2 block">Mensagem ou Especialidade</label>
                    <textarea rows="3" className="w-full bg-transparent border-b border-[#CAC6BC] py-3 text-[#1C1C15] focus:outline-none focus:border-[#1C1C15] transition-colors resize-none placeholder:text-[#AEABA1]" placeholder="Qual a sua necessidade hoje?"></textarea>
                  </div>
                  <button type="button" className="group relative w-full flex items-center justify-center gap-2 bg-[#1C1C15] text-[#FDF9EE] py-5 rounded-full font-bold text-xs uppercase tracking-[0.2em] hover:bg-[#323129] transition-all duration-300 mt-4 overflow-hidden">
                    <span className="relative z-10">Solicitar Contato</span>
                    <ArrowRight size={16} className="relative z-10 group-hover:translate-x-1 transition-transform" />
                  </button>
               </div>
            </form>
          </div>

        </div>
      </section>

      {/* FOOTER PADRÃO TRADICIONAL */}
      <footer className="bg-[#1C1C15] text-[#FDF9EE] pt-24 pb-12 px-6 relative z-50 rounded-t-[3rem] -mt-10 overflow-hidden">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 mb-16">
          
          <div className="flex flex-col gap-6 lg:pr-8">
             <div className="text-2xl tracking-tighter text-[#FDF9EE]">
               <span className="font-light">Centro Clínico</span> <span className="font-bold italic text-[#CAC6BC]">Costa</span>
             </div>
             <p className="text-[#AEABA1] font-light text-sm leading-relaxed">
               Nascemos com a missão de oferecer atendimento de saúde humanizado e de qualidade, focado no bem-estar de toda a sua família.
             </p>
             <div className="flex gap-4 mt-2">
               <a href="#" className="w-10 h-10 rounded-full border border-[#48473F] flex items-center justify-center text-[#CAC6BC] hover:bg-[#FDF9EE] hover:text-[#1C1C15] transition-colors">
                  <FaInstagram size={18} />
               </a>
               <a href="#" className="w-10 h-10 rounded-full border border-[#48473F] flex items-center justify-center text-[#CAC6BC] hover:bg-[#FDF9EE] hover:text-[#1C1C15] transition-colors">
                  <FaFacebook size={18} />
               </a>
             </div>
          </div>

          <div>
             <h4 className="text-xs font-bold uppercase tracking-widest text-[#79776E] mb-6">Navegação</h4>
             <ul className="flex flex-col gap-4 text-[#CAC6BC] font-light text-sm">
               <li><a href="#sobre" className="hover:text-[#FDF9EE] transition-colors">Nossa História</a></li>
               <li><a href="#estrutura" className="hover:text-[#FDF9EE] transition-colors">Nossa Estrutura</a></li>
               <li><a href="#corpo-clinico" className="hover:text-[#FDF9EE] transition-colors">Corpo Clínico</a></li>
               <li><a href="#contato" className="hover:text-[#FDF9EE] transition-colors">Agendamentos</a></li>
             </ul>
          </div>

          <div>
             <h4 className="text-xs font-bold uppercase tracking-widest text-[#79776E] mb-6">Especialidades</h4>
             <ul className="flex flex-col gap-4 text-[#CAC6BC] font-light text-sm">
               <li>Clínica Geral</li>
               <li>Cardiologia</li>
               <li>Pediatria</li>
               <li>Ginecologia</li>
               <li>Dermatologia</li>
             </ul>
          </div>

          <div>
             <h4 className="text-xs font-bold uppercase tracking-widest text-[#79776E] mb-6">Horário de Atendimento</h4>
             <ul className="flex flex-col gap-4 text-[#CAC6BC] font-light text-sm">
               <li className="flex justify-between border-b border-[#323129] pb-3">
                  <span>Segunda a Sexta</span>
                  <span className="font-bold text-[#FDF9EE]">08:00 - 18:00</span>
               </li>
               <li className="flex justify-between border-b border-[#323129] pb-3">
                  <span>Sábado</span>
                  <span className="font-bold text-[#FDF9EE]">08:00 - 12:00</span>
               </li>
               <li className="flex justify-between pt-1">
                  <span>Domingo</span>
                  <span className="font-bold text-[#FDF9EE]">Fechado</span>
               </li>
             </ul>
          </div>
          
        </div>
        
        <div className="max-w-7xl mx-auto pt-8 border-t border-[#323129] flex flex-col md:flex-row justify-between items-center gap-6 text-[10px] font-bold uppercase tracking-widest text-[#79776E]">
           <div className="text-center md:text-left">© {new Date().getFullYear()} Centro Clínico Costa. Todos os direitos reservados. Taquari/RS.</div>
           <div className="flex gap-6">
              <a href="#" className="hover:text-[#CAC6BC] transition-colors">Termos de Uso</a>
              <a href="#" className="hover:text-[#CAC6BC] transition-colors">Política de Privacidade</a>
           </div>
        </div>
      </footer>

    </div>
    </LenisProvider>
  );
}