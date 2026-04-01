import { FaAmbulance } from "react-icons/fa";
const logoUrl = "/assets/logopng.png";
const vctUrl = "/assets/Vector.svg";
const ambimg = "/assets/equipe.jpeg";
const ambimg1 = "/assets/amb1.jpeg";
const ambimg2 = "/assets/amb2.jpeg";
const ambimg3 = "/assets/amb3.jpeg";
const ambimg4 = "/assets/amb4.jpeg";
import { PiAmbulanceFill } from "react-icons/pi";
import { TbUrgent } from "react-icons/tb";
import { MdHealthAndSafety } from "react-icons/md";
import { FaInstagram, FaFacebookSquare } from "react-icons/fa";
import { FaCalendarDays } from "react-icons/fa6";
import Header from "../../components/Header";

export default function page() {

  return (
    <>
      {/* Header */}
      <Header logoUrl={logoUrl} bgColor="slate-800" textColor="white" className="scroll-smooth">
        <a href="#servicos" className="font-light text-white text-sm md:text-lg hover:underline transition duration-300">
          Nossos Serviços
        </a>
        <a href="#frota" className="font-light text-white text-sm md:text-lg hover:underline transition duration-300">
          Frota
        </a>
        <a href="#onde-estamos" className="font-light text-white text-sm md:text-lg hover:underline transition duration-300">
          Regiões Atendidas
        </a>
      </Header>

      {/* Hero Section */}
      <section className="relative min-h-[100dvh] flex items-center justify-center bg-cover bg-center" style={{ backgroundImage: "url('/assets/bg-ambulancias.jpeg')" }}>
        <div className="absolute top-0 left-1/2 -translate-x-1/2 md:left-auto md:right-8 md:translate-x-0 p-2 bg-orange-500 rounded-b-lg flex items-center text-center gap-2 z-50">
          <FaAmbulance className="text-white size-6"/>
          <p className="text-white font-light">0800 000 4356</p>
        </div>
        <div className="bg-slate-800 opacity-80 absolute h-full w-full"></div>
        <div className="relative text-center text-white flex flex-col items-center gap-8 px-4">
          <h1 className="text-3xl md:text-5xl font-bold max-w-3xl" data-aos="fade-down">Onde cada segundo importa, estamos prontos para você.</h1>
          <div className="border-2 border-orange-500 rounded-2xl p-4 max-w-xs" data-aos="fade-up">
            <p className="font-bold text-xl md:text-2xl mb-1">Precisa de ajuda agora?</p>
            <p className="font-light leading-tight">Ligue para 0800 000 4356 ou fale com nosso suporte em (51) 2129-4040.</p>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="sobrenos" className="flex flex-col md:flex-row bg-gray-200">
        <div className="w-full md:w-1/2 bg-orange-500 rounded-tr-4xl relative min-h-48 md:min-h-0">
        <div 
          className="absolute -top-24 md:top-4 left-1/2 transform -translate-x-1/2 md:left-1/2 md:-translate-x-1/2 h-52 w-52 md:h-96 md:w-96 rounded-full bg-cover bg-center shadow-2xl" 
          data-aos="fade-right" 
          style={{ backgroundImage: "url('/assets/amb-img.jpg')" }}
        >
          {/* Segunda imagem no fundo */}
          <img src={ambimg1} alt="" className="absolute inset-0 w-full h-full object-cover z-0 rounded-full" />

          {/* Primeira imagem sobreposta */}
          <img src={vctUrl} alt="Vector" className="relative z-10" />
        </div>
        </div>
        <div className="w-full md:w-1/2 py-12 px-6 md:px-16 mt-24 md:mt-0" data-aos="fade-left">
          <h3 className="font-bold text-xl md:text-2xl mb-4">Tradição e Inovação na Saúde</h3>
          <p className="font-light text-left">Há anos, a Costa Ambulâncias atua com excelência no transporte de pacientes e atendimento emergencial, oferecendo serviços que aliam rapidez, segurança e cuidado. Com uma frota moderna, profissionais capacitados e uma rede de atendimento abrangente, estamos sempre prontos para garantir o melhor suporte nos momentos em que mais importa. Nosso compromisso é com a sua saúde, sua segurança e sua confiança.</p>
        </div>
      </section>

      {/* Services Section */}
      <section id="servicos" className="bg-slate-800 flex flex-col items-center py-16 md:pt-32 px-6 scroll-smooth">
        <div className="text-center text-white max-w-2xl" data-aos="zoom-in">
          <h4 className="font-bold text-2xl md:text-3xl mb-4">O que fazemos por você:</h4>
          <p className="font-medium text-lg md:text-xl">Na Costa Ambulâncias, oferecemos uma gama completa de serviços para garantir o cuidado e o suporte que você precisa, a qualquer hora e em qualquer lugar.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-10 max-w-6xl w-full">
          {[
            { icon: <PiAmbulanceFill className="text-white size-16 md:size-14 mb-4" />, title: "Transporte de Pacientes", description: "Realizamos o transporte de pacientes em situações de urgência e emergência com segurança e conforto, utilizando ambulâncias equipadas e equipes qualificadas." },
            { icon: <TbUrgent className="text-white size-16 md:size-14 mb-4" />, title: "Atendimento Emergencial 24h", description: "Disponibilizamos atendimento de emergência a qualquer momento, com rapidez e eficiência para atender às situações mais críticas." },
            { icon: <MdHealthAndSafety className="text-white size-16 md:size-14 mb-4" />, title: "Cobertura de Eventos", description: "Oferecemos cobertura completa para eventos, com ambulâncias prontas para atender emergências durante eventos de pequeno ou grande porte, garantindo tranquilidade para organizadores e participantes." },
            { icon: <FaCalendarDays className="text-white size-16 md:size-14 mb-4" />, title: "Locação de Ambuâncias", description: "Oferecemos serviços de locação de ambulâncias equipadas e preparadas para atender diversas necessidades, desde transporte médico de rotina até situações de emergência." },
          ].map((service, index) => (
            <div key={index} className="flex flex-col items-center w-full"  data-aos="zoom-in-up">
              {service.icon}
              <div className="py-8 px-4 border border-orange-500 rounded-2xl text-center text-white"  data-aos="zoom-in-up">
                <p className="font-light"><span className="font-bold">{service.title}:</span> {service.description}</p>
              </div>
            </div>
          ))}
        </div>
        <p className="font-bold text-2xl text-white max-w-3xl text-center mt-10" data-aos="zoom-in">Conte com a Costa Ambulâncias para cuidar de quem você ama, a qualquer hora e em qualquer situação!</p>
      </section>

      {/* Fleet Section */}
      <section id="frota" className="w-full relative overflow-hidden">
        <img src={vctUrl} alt="vector" className="hidden md:inline md:absolute -left-0 top-1/2 transform -translate-y-1/2 w-auto h-[80%] -translate-x-1/2 z-50" data-aos="fade-right"/>
        <div className="bg-gray-200 py-16 flex flex-col md:flex-row px-6 md:px-10 gap-10">
          <div className="flex flex-col gap-4 w-full md:w-1/2 lg:w-2/5 md:pl-8 lg:pl-14">
            <p className="text-slate-800 text-left font-bold text-2xl md:text-3xl max-w-md md:w-3/4" data-aos="fade-right">Compromisso com a vida, tecnologia no atendimento.</p>
            <div className="w-full px-2 py-3 bg-orange-500 text-center text-white rounded-lg font-medium hover:bg-orange-600 hover:scale-105 transition" data-aos="fade-right" data-aos-delay="100">Frota de última geração</div>
            <div className="w-full px-2 py-3 bg-orange-500 text-center text-white rounded-lg font-medium hover:bg-orange-600 hover:scale-105 transition" data-aos="fade-right" data-aos-delay="200">Equipe qualificada e atendimento humanizado.</div>
            <div className="w-full px-2 py-3 bg-orange-500 text-center text-white rounded-lg font-medium hover:bg-orange-600 hover:scale-105 transition" data-aos="fade-right" data-aos-delay="300">Abrangência regional, garantindo saúde para todos.</div>
          </div>
          <div className="flex items-center justify-center p-2 md:p-4 w-full md:w-1/2" data-aos="fade-left">
              <div className="grid grid-cols-2 grid-rows-2 gap-2 h-[300px] sm:h-[360px] w-full max-w-[520px] rounded-lg overflow-hidden md:ml-0">
                
                <div className="col-span-1 row-span-1 bg-slate-800 rounded-lg">
                  <img
                    src={ambimg}
                    alt="Imagem 1"
                    className="w-full h-full object-cover rounded-lg opacity-25 hover:opacity-100 hover:brightness-90 hover:scale-105 transition duration:500"
                  />
                </div>

               
                <div className="col-span-1 row-span-2 bg-slate-800 rounded-lg">
                  <img
                    src={ambimg1}
                    alt="Imagem 2"
                    className="w-full h-full object-cover rounded-lg opacity-25 hover:opacity-100 hover:brightness-90 hover:scale-105 transition duration:500"
                  />
                </div>

               
                <div className="col-span-1 row-span-1 flex gap-2">
                  <div className="col-span-1 row-span-2 bg-slate-800 rounded-lg">
                    <img
                      src={ambimg2}
                      alt="Imagem 3"
                      className="w-full h-full object-cover rounded-lg opacity-25 hover:opacity-100 hover:brightness-90 hover:scale-105 transition duration:500"
                    />
                  </div>
                  <div className="col-span-1 row-span-2 bg-slate-800 rounded-lg">
                    <img
                      src={ambimg3}
                      alt="Imagem 4"
                      className="w-full h-full object-cover rounded-lg opacity-25 hover:opacity-100 hover:brightness-90 hover:scale-105 transition duration:500"
                    />
                  </div>
                </div>
              </div>
            </div>
        </div>
        <div className="bg-gray-100 pt-16 pb-10 flex flex-col items-center md:flex-row px-6 md:px-10 lg:px-16 gap-10" data-aos="zoom-out">
          {/* Coluna da Esquerda */}
          <div className="flex flex-col w-full md:w-1/2 lg:w-2/5 gap-4">
            <p className="text-slate-800 text-left font-bold text-2xl md:text-3xl">
              <span className="text-orange-500">Frota de ponta: </span>conforto e tecnologia em movimento.
            </p>
            <p className="text-xl font-bold text-slate-800 w-full md:w-3/4 mb-4">
              Ambulâncias equipadas para salvar vidas.
            </p>
            <div className="bg-slate-800 rounded-2xl h-48 md:w-80 md:h-40">
              <img
                src={ambimg4}
                alt="Imagem 1"
                className="w-full h-full object-cover rounded-2xl opacity-25 hover:opacity-100 hover:brightness-90 hover:scale-105 transition duration:500"
              />
            </div>
          </div>

          {/* Coluna da Direita */}
          <div className="w-full md:w-1/2 lg:w-3/5 mt-2 md:mt-0 leading-6">
            <p className="text-slate-800">
              Com uma frota ambulâncias em operação, incluindo as 4 novas unidades recém-adquiridas, garantimos um atendimento rápido e eficiente para qualquer emergência. <br />
              <br />
              <span className="font-bold">Equipamentos de Última Geração</span> <br />
              <br />
              Nossas ambulâncias estão equipadas com monitoramento cardíaco avançado, garantindo um acompanhamento completo dos sinais vitais dos pacientes em tempo real. <br />
              <br />
              Além disso, todas as unidades possuem sistemas de climatização para proporcionar conforto e bem-estar durante o transporte, independente das condições climáticas.<br />
              <br />
              Estamos prontos para oferecer um atendimento de excelência, com tecnologia e dedicação para cuidar de você e de sua família!<br />
            </p>
          </div>
        </div>
      </section>

      {/* Onde Estamos */}
      <section id="onde-estamos" className="bg-gray-200 py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-800 text-center mb-8" data-aos="fade-down">
            Onde Estamos
          </h2>
          <div className="p-4 rounded-lg overflow-hidden" data-aos="zoom-in">
            {/* Mapa do Google */}
            <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3462.108802520995!2d-51.8661733!3d-29.8034009!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x951b8569329b5ed9%3A0x2d5e4d3b4b3512b8!2sTv.%20Quatro%20de%20Julho%2C%2030%20-%20Centro%2C%20Taquari%20-%20RS%2C%2095860-000!5e0!3m2!1spt-BR!2sbr!4v1741808530157!5m2!1spt-BR!2sbr" className="b-0 m-auto w-full h-96 rounded-xl shadow-lg" allowFullScreen="" loading="lazy" referrerPolicy="no-referrer-when-downgrade"></iframe>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer id="contato" className="bg-slate-800 flex flex-col md:flex-row gap-8 py-12 px-6 md:justify-evenly">
        <div className="flex flex-col items-center">
          <img src={logoUrl} alt="Logo" className="h-20" />
          <div className="flex gap-4 mt-4">
            <a href="https://www.instagram.com/costa.ambulancias/"><FaInstagram className="text-white size-8" /></a>
            <a href="https://www.facebook.com/planocosta/"><FaFacebookSquare className="text-white size-8" /></a>
          </div>
        </div>
        <nav className="md:border-l border-white flex flex-col gap-2 md:pl-6 py-2 text-center md:text-left">
          <a href="#sobrenos" className="font-light text-white text-sm">Sobre nós</a>
          <a href="#servicos" className="font-light text-white text-sm">Nossos serviços</a>
          <a href="#frota" className="font-light text-white text-sm">Frota</a>
          <a href="#onde-estamos" className="font-light text-white text-sm">Regiões atendidas</a>
          <a href="#contato" className="font-light text-white text-sm">Contato</a>
          <a href="#trabalheconosco" className="font-light text-white text-sm">Trabalhe conosco</a>
        </nav>
        <div className="border-2 border-orange-500 rounded-2xl p-6 w-full md:w-1/3 md:ml-0">
          <h6 className="text-center font-bold text-white text-2xl mb-2">Precisa de ajuda agora?</h6>
          <p className="text-center font-light text-white text-lg">Ligue para 0800 000 4356 ou fale com nosso suporte em (51) 2129-4040.</p>
        </div>
      </footer>
      <div className="bg-gray-100 text-center py-4">
        <p className="text-slate-800 font-normal text-lg">© 2024 Costa Ambulâncias. Todos os direitos reservados.</p>
      </div>
    </>
  );
}