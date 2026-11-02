import { useEffect, useRef, useState, type PointerEvent } from "react";
import { createFileRoute } from "@tanstack/react-router";
import {
  ArrowRight, ArrowUpRight, Banknote, CalendarDays, ChevronLeft, ChevronRight,
  Clock3, CreditCard, Instagram, Menu, QrCode, ShieldCheck, Sparkles, X,
} from "lucide-react";
import heroPortrait from "@/assets/hero.jpg";
import galleryNails from "@/assets/gallery-nails.jpg";
import galleryMaintenance from "@/assets/gallery-maintenance.jpg";
import studioContent from "@/data/studio-content.json";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Tayza Nails | Beleza em cada detalhe" },
      { name: "description", content: "Unhas, cílios e cuidados personalizados no Tayza Nails. Conheça nossos trabalhos e consulte horários pelo WhatsApp." },
      { property: "og:title", content: "Tayza Nails | Beleza em cada detalhe" },
      { property: "og:description", content: "Um espaço dedicado à sua beleza. Veja unhas, cílios, serviços e agende seu horário." },
      { property: "og:type", content: "website" },
    ],
  }),
  component: TayzaHome,
});

const whatsAppBase = "https://wa.me/" + studioContent.contact.whatsapp;
const instagramUrl = "https://instagram.com/" + studioContent.contact.instagram;
const bookingOptions = [
  ...studioContent.services.map((service) => service.name),
  ...studioContent.nails.map((item) => item.name),
  ...studioContent.lashes.map((item) => item.name),
  "Quero conversar sobre um serviço",
];
const nailGallery = [
  ...studioContent.nails,
  ...studioContent.hero.images.map((image, index) => ({
    id: "alongamento-" + index,
    name: "Alongamento em gel",
    price: "",
    image,
    alt: "Trabalho de alongamento em gel realizado pelo Tayza Nails",
  })),
  { id: "inspiracao", name: "Detalhes que encantam", price: "", image: galleryNails, alt: "Detalhe de unhas com acabamento delicado" },
];
const serviceImages = [
  studioContent.hero.images[0] || galleryNails,
  studioContent.lashes[0]?.image || heroPortrait,
  galleryMaintenance,
  heroPortrait,
];
const paymentOptions = [
  { label: "Cartão", detail: "Crédito e débito", icon: CreditCard, enabled: studioContent.payments.card },
  { label: "Pix", detail: "Pagamento prático", icon: QrCode, enabled: studioContent.payments.pix },
  { label: "Dinheiro", detail: "Pagamento presencial", icon: Banknote, enabled: studioContent.payments.cash },
].filter((option) => option.enabled);

function WhatsAppLogo({ size = 25 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="currentColor" aria-hidden="true">
      <path d="M16.02 2.66A13.25 13.25 0 0 0 4.66 22.7L2.7 29.33l6.81-1.82a13.34 13.34 0 0 0 6.5 1.7h.01c7.33 0 13.31-5.95 13.31-13.28A13.31 13.31 0 0 0 16.02 2.66Zm0 24.2a10.9 10.9 0 0 1-5.56-1.52l-.4-.23-4.05 1.08 1.08-3.94-.26-.41a10.92 10.92 0 1 1 9.19 5.02Zm6.01-8.19c-.33-.16-1.95-.96-2.25-1.07-.3-.11-.52-.16-.74.17-.22.33-.85 1.07-1.04 1.29-.19.22-.38.25-.71.09-.33-.17-1.39-.51-2.64-1.64-.98-.87-1.64-1.95-1.83-2.28-.19-.33-.02-.51.14-.67.15-.15.33-.38.49-.57.16-.19.22-.33.33-.55.11-.22.05-.41-.03-.58-.08-.16-.74-1.79-1.02-2.45-.27-.64-.54-.55-.74-.56h-.63c-.22 0-.58.08-.88.41s-1.16 1.13-1.16 2.75 1.19 3.19 1.35 3.41c.16.22 2.32 3.54 5.62 4.97.78.34 1.39.54 1.86.69.78.25 1.49.21 2.05.13.62-.09 1.95-.8 2.23-1.57.28-.77.28-1.44.2-1.57-.08-.14-.3-.22-.63-.39Z" />
    </svg>
  );
}

function TayzaHome() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [bookingOpen, setBookingOpen] = useState(false);
  const [bookingService, setBookingService] = useState("");
  const [bookingName, setBookingName] = useState("");
  const [bookingDate, setBookingDate] = useState("");
  const [bookingNote, setBookingNote] = useState("");
  const [scrolled, setScrolled] = useState(false);
  const [activeNail, setActiveNail] = useState(0);
  const [floatPosition, setFloatPosition] = useState<{ x: number; y: number } | null>(null);
  const sliderRef = useRef<HTMLDivElement>(null);
  const sliderDrag = useRef({ active: false, x: 0, scroll: 0, moved: false });
  const whatsappDrag = useRef({ active: false, x: 0, y: 0, left: 0, top: 0, moved: false });
  const suppressWhatsAppClick = useRef(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 30);
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const nodes = document.querySelectorAll<HTMLElement>("[data-reveal]");
    if (!("IntersectionObserver" in window)) {
      nodes.forEach((node) => node.classList.add("is-visible"));
      return;
    }
    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      }
    }, { threshold: 0.11, rootMargin: "0px 0px -35px 0px" });
    nodes.forEach((node) => observer.observe(node));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!bookingOpen && !menuOpen) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setBookingOpen(false);
        setMenuOpen(false);
      }
    };
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKey);
    };
  }, [bookingOpen, menuOpen]);

  useEffect(() => {
    if (!floatPosition) return;
    const keepInView = () => {
      setFloatPosition((current) => current ? {
        x: Math.min(Math.max(8, current.x), Math.max(8, window.innerWidth - 68)),
        y: Math.min(Math.max(8, current.y), Math.max(8, window.innerHeight - 68)),
      } : null);
    };
    window.addEventListener("resize", keepInView);
    return () => window.removeEventListener("resize", keepInView);
  }, [floatPosition !== null]);

  function openBooking(service = "") {
    setBookingService(service);
    setMenuOpen(false);
    setBookingOpen(true);
  }

  function goTo(id: string) {
    setMenuOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth", block: "start" });
  }

  function sendBooking() {
    const parts = [
      "Olá, Tayza! Gostaria de consultar um horário.",
      bookingName.trim() ? "Meu nome: " + bookingName.trim() : "",
      bookingService ? "Procedimento: " + bookingService : "Gostaria de saber os serviços disponíveis.",
      bookingDate ? "Data de preferência: " + bookingDate.split("-").reverse().join("/") : "",
      bookingNote.trim() ? "Observação: " + bookingNote.trim() : "",
      "Pode me informar a disponibilidade?",
    ].filter(Boolean);
    window.open(whatsAppBase + "?text=" + encodeURIComponent(parts.join("\n")), "_blank", "noopener,noreferrer");
    setBookingOpen(false);
  }

  function moveCarousel(direction: number) {
    const slider = sliderRef.current;
    if (!slider) return;
    const card = slider.querySelector<HTMLElement>(".tn-nail-card");
    slider.scrollBy({ left: direction * (card?.offsetWidth || slider.clientWidth / 2) + direction * 16, behavior: "smooth" });
  }

  function updateSlide() {
    const slider = sliderRef.current;
    if (!slider) return;
    const first = slider.querySelector<HTMLElement>(".tn-nail-card");
    const step = (first?.offsetWidth || 1) + 16;
    setActiveNail(Math.min(nailGallery.length - 1, Math.max(0, Math.round(slider.scrollLeft / step))));
  }

  function nailPointerDown(event: PointerEvent<HTMLDivElement>) {
    if (event.pointerType !== "mouse" || event.button !== 0) return;
    const slider = sliderRef.current;
    if (!slider) return;
    sliderDrag.current = { active: true, x: event.clientX, scroll: slider.scrollLeft, moved: false };
    slider.classList.add("is-dragging");
  }

  function nailPointerMove(event: PointerEvent<HTMLDivElement>) {
    const drag = sliderDrag.current;
    if (!drag.active || !sliderRef.current) return;
    const distance = event.clientX - drag.x;
    if (Math.abs(distance) > 5) drag.moved = true;
    sliderRef.current.scrollLeft = drag.scroll - distance;
  }

  function nailPointerUp() {
    sliderDrag.current.active = false;
    sliderRef.current?.classList.remove("is-dragging");
  }

  function onWhatsappDown(event: PointerEvent<HTMLButtonElement>) {
    if (event.pointerType === "mouse" && event.button !== 0) return;
    const rect = event.currentTarget.getBoundingClientRect();
    whatsappDrag.current = { active: true, x: event.clientX, y: event.clientY, left: rect.left, top: rect.top, moved: false };
    suppressWhatsAppClick.current = false;
    event.currentTarget.setPointerCapture(event.pointerId);
  }

  function onWhatsappMove(event: PointerEvent<HTMLButtonElement>) {
    const drag = whatsappDrag.current;
    if (!drag.active) return;
    const dx = event.clientX - drag.x;
    const dy = event.clientY - drag.y;
    if (Math.abs(dx) + Math.abs(dy) > 7) drag.moved = true;
    if (!drag.moved) return;
    setFloatPosition({
      x: Math.max(8, Math.min(window.innerWidth - 68, drag.left + dx)),
      y: Math.max(8, Math.min(window.innerHeight - 68, drag.top + dy)),
    });
  }

  function onWhatsappUp() {
    suppressWhatsAppClick.current = whatsappDrag.current.moved;
    whatsappDrag.current.active = false;
  }

  const navigation = [
    { id: "inicio", label: "Início" },
    { id: "servicos", label: "Serviços" },
    { id: "unhas", label: "Unhas" },
    { id: "cilios", label: "Cílios" },
    { id: "sobre", label: "Sobre" },
  ];

  return (
    <div className="tn-page" id="inicio">
      <a href="#conteudo" className="tn-skip">Pular para o conteúdo</a>
      <header className={"tn-header " + (scrolled ? "tn-header--solid" : "")}>
        <div className="tn-container tn-header-inner">
          <a className="tn-logo" href="#inicio" aria-label="Tayza Nails — início" onClick={(event) => { event.preventDefault(); goTo("inicio"); }}>
            <strong>TAYZA<span>.</span></strong>
            <small>NAILS STUDIO</small>
          </a>
          <nav className="tn-nav-desktop" aria-label="Navegação principal">
            {navigation.map((item) => (
              <a key={item.id} href={"#" + item.id} onClick={(event) => { event.preventDefault(); goTo(item.id); }}>{item.label}</a>
            ))}
          </nav>
          <div className="tn-header-actions">
            <button className="tn-header-book" type="button" onClick={() => openBooking()}>Agendar horário <ArrowUpRight size={15} /></button>
            <button className="tn-menu-toggle" type="button" onClick={() => setMenuOpen(true)} aria-label="Abrir menu" aria-expanded={menuOpen}><Menu size={26} /></button>
          </div>
        </div>
      </header>

      <main id="conteudo">
        <section className="tn-hero" aria-labelledby="tn-hero-title">
          <div className="tn-hero-image" style={{ backgroundImage: "url(" + heroPortrait + ")" }} aria-hidden="true" />
          <div className="tn-hero-shade" aria-hidden="true" />
          <div className="tn-container tn-hero-inner">
            <div className="tn-hero-content">
              <p className="tn-eyebrow tn-eyebrow--light"><span className="tn-line" /> A ESSÊNCIA DA SUA BELEZA</p>
              <h1 id="tn-hero-title">BELEZA EM <em>CADA</em> DETALHE.</h1>
              <div className="tn-small-rule" />
              <p className="tn-hero-description">Unhas impecáveis, um olhar marcante e o cuidado que você merece. Cada detalhe pensado para valorizar quem você é.</p>
              <button className="tn-button tn-button--beige" type="button" onClick={() => openBooking()}>AGENDE SUA EXPERIÊNCIA <ArrowUpRight size={17} /></button>
              <p className="tn-hero-caption">UNHAS <span>·</span> CÍLIOS <span>·</span> BELEZA</p>
            </div>
          </div>
          <div className="tn-hero-stamp" aria-hidden="true"><span>TN</span><small>BELEZA & AUTOESTIMA</small></div>
          <button type="button" className="tn-scroll-hint" onClick={() => goTo("servicos")}>DESLIZE PARA EXPLORAR <span>↓</span></button>
        </section>

        <section className="tn-section tn-section--cream tn-services" id="servicos">
          <div className="tn-container">
            <div className="tn-section-top" data-reveal>
              <div>
                <p className="tn-eyebrow">MUITO ALÉM DA BELEZA</p>
                <h2>UM CUIDADO <span>EXCLUSIVO.</span></h2>
              </div>
              <p className="tn-section-lead">Do clássico ao sofisticado, descubra serviços que valorizam a sua beleza natural e fazem você se sentir ainda mais confiante.</p>
            </div>
            <div className="tn-service-grid">
              {studioContent.services.map((service, index) => (
                <article className="tn-service-card" data-service={service.id} key={service.id} data-reveal style={{ transitionDelay: (index % 2) * 110 + "ms" }}>
                  <div className="tn-service-photo">
                    <img className="tn-photo-subject" src={serviceImages[index] || galleryNails} alt={"Foto do serviço de " + service.name + " do Tayza Nails"} loading="lazy" />
                    <span className="tn-service-number">0{index + 1}</span>
                    <span className="tn-service-photo-label">TAYZA NAILS <span>—</span> BELEZA EM DETALHES</span>
                  </div>
                  <div className="tn-service-body">
                    <div className="tn-service-info">
                      <h3>{service.name}</h3>
                      <p>{service.description}</p>
                      <strong>A partir de {service.startingPrice}</strong>
                    </div>
                    <button type="button" className="tn-service-cta" onClick={() => openBooking(service.name)} aria-label={"Agendar " + service.name}>
                      <span>Agendar horário</span><ArrowUpRight size={18} />
                    </button>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="tn-section tn-section--dark tn-nails" id="unhas">
          <div className="tn-container">
            <div className="tn-carousel-heading" data-reveal>
              <div>
                <p className="tn-eyebrow tn-eyebrow--light">ARTE NA PONTA DOS DEDOS</p>
                <h2>UNHAS QUE <span>ENCANTAM.</span></h2>
                <p>Resultados, cores e acabamentos que falam por você. Arraste para descobrir mais.</p>
              </div>
              <div className="tn-carousel-controls">
                <button type="button" onClick={() => moveCarousel(-1)} aria-label="Ver unhas anteriores"><ChevronLeft size={22} /></button>
                <button type="button" onClick={() => moveCarousel(1)} aria-label="Ver próximas unhas"><ChevronRight size={22} /></button>
              </div>
            </div>
            <div className="tn-nail-track" ref={sliderRef} onScroll={updateSlide} onPointerDown={nailPointerDown} onPointerMove={nailPointerMove} onPointerUp={nailPointerUp} onPointerCancel={nailPointerUp} onPointerLeave={nailPointerUp} aria-label="Galeria de unhas, deslize horizontalmente">
              {nailGallery.map((item, index) => (
                <article className="tn-nail-card" key={item.id}>
                  <div className="tn-nail-image">
                    <img className="tn-photo-subject" src={item.image} alt={item.alt} loading={index < 2 ? "eager" : "lazy"} draggable={false} />
                    <span className="tn-photo-index">0{index + 1} / 0{nailGallery.length}</span>
                  </div>
                  <div className="tn-nail-details">
                    <div><h3>{item.name}</h3>{item.price ? <p>{item.price}</p> : <p>Conheça nosso trabalho</p>}</div>
                    <button type="button" onClick={() => { if (!sliderDrag.current.moved) openBooking(item.name); }} aria-label={"Agendar " + item.name}><ArrowUpRight size={20} /></button>
                  </div>
                </article>
              ))}
            </div>
            <div className="tn-carousel-footer">
              <div className="tn-slider-progress"><span style={{ width: ((activeNail + 2) / nailGallery.length * 100) + "%" }} /></div>
              <span>{String(Math.min(activeNail + 1, nailGallery.length)).padStart(2, "0")} <i>/</i> {String(nailGallery.length).padStart(2, "0")}</span>
              <span className="tn-swipe-tip">← ARRASTE PARA O LADO →</span>
            </div>
          </div>
        </section>

        <section className="tn-section tn-section--cream tn-lashes" id="cilios">
          <div className="tn-container">
            <div className="tn-section-top" data-reveal>
              <div>
                <p className="tn-eyebrow">OLHARES QUE MARCAM</p>
                <h2>SEU OLHAR, <span>SEU ESTILO.</span></h2>
              </div>
              <p className="tn-section-lead">De um efeito delicado ao volume mais intenso, cada técnica é escolhida para realçar sua expressão com elegância.</p>
            </div>
            <div className="tn-lash-grid">
              {studioContent.lashes.map((style, index) => (
                <article className="tn-lash-card" key={style.id} data-reveal style={{ transitionDelay: (index % 2) * 85 + "ms" }}>
                  <div className="tn-lash-photo">
                    <img className="tn-photo-subject" src={style.image} alt={style.alt} loading="lazy" />
                    <span className="tn-lash-chip">CÍLIOS</span>
                  </div>
                  <div className="tn-lash-info">
                    <div><h3>{style.name}</h3><p>{style.price}</p></div>
                    <button type="button" aria-label={"Agendar " + style.name} onClick={() => openBooking(style.name)}><ArrowUpRight size={21} /></button>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="tn-experience" id="sobre">
          <div className="tn-experience-photo" data-reveal><img src={galleryNails} alt="Detalhe de unhas elegantes com acabamento artístico" loading="lazy" /></div>
          <div className="tn-experience-copy" data-reveal>
            <p className="tn-eyebrow tn-eyebrow--light">PORQUE VOCÊ MERECE O MELHOR</p>
            <h2>SEU MOMENTO <span>DE BRILHAR.</span></h2>
            <div className="tn-small-rule" />
            <p>Mais do que um procedimento, uma experiência de autocuidado. Aqui, cada detalhe é pensado com carinho, técnica e atenção para você sair se sentindo ainda mais bonita.</p>
            <button type="button" className="tn-button tn-button--beige" onClick={() => openBooking()}>RESERVE SEU MOMENTO <ArrowUpRight size={18} /></button>
            <div className="tn-perks">
              <div><Sparkles size={25} strokeWidth={1.4} /><span>ACABAMENTO<br />CUIDADOSO</span></div>
              <div><ShieldCheck size={25} strokeWidth={1.4} /><span>ATENDIMENTO<br />DEDICADO</span></div>
              <div><Clock3 size={25} strokeWidth={1.4} /><span>SEU TEMPO<br />IMPORTA</span></div>
            </div>
          </div>
        </section>

        <section className="tn-section tn-section--cream tn-book" id="agendar">
          <div className="tn-container tn-book-layout">
            <div data-reveal>
              <p className="tn-eyebrow">ESSE MOMENTO É SEU</p>
              <h2>VAMOS CUIDAR <span>DE VOCÊ?</span></h2>
              <p>Escolha o serviço que deseja, informe sua preferência de data e envie uma mensagem pronta diretamente para o nosso WhatsApp.</p>
            </div>
            <div className="tn-book-action" data-reveal>
              <span><CalendarDays size={29} strokeWidth={1.4} /></span>
              <p>Seu próximo momento de beleza começa aqui.</p>
              <button type="button" className="tn-button tn-button--dark" onClick={() => openBooking()}>AGENDAR MEU HORÁRIO <ArrowRight size={19} /></button>
              <small>Os horários são confirmados diretamente pelo atendimento.</small>
            </div>
          </div>
        </section>

        <section className="tn-payments" id="pagamento">
          <div className="tn-container">
            <div className="tn-payments-heading" data-reveal>
              <p className="tn-eyebrow tn-eyebrow--light">FACILIDADE PARA VOCÊ</p>
              <h2>FORMAS DE <span>PAGAMENTO.</span></h2>
              <p>Mais praticidade na hora de cuidar da sua beleza.</p>
            </div>
            <div className="tn-payment-grid">
              {paymentOptions.map(({ label, detail, icon: Icon }, index) => (
                <div className="tn-payment-card" key={label} data-reveal style={{ transitionDelay: index * 90 + "ms" }}>
                  <Icon size={31} strokeWidth={1.4} />
                  <h3>{label}</h3><p>{detail}</p>
                </div>
              ))}
            </div>
            <p className="tn-payment-note">Consulte condições de pagamento e disponibilidade no agendamento.</p>
          </div>
        </section>
      </main>

      <footer className="tn-footer">
        <div className="tn-container tn-footer-inner">
          <div><a className="tn-logo tn-logo--footer" href="#inicio" onClick={(event) => { event.preventDefault(); goTo("inicio"); }}><strong>TAYZA<span>.</span></strong><small>NAILS STUDIO</small></a><p>Beleza que inspira confiança.</p></div>
          <div className="tn-footer-links"><a href="#servicos" onClick={(event) => { event.preventDefault(); goTo("servicos"); }}>Serviços</a><a href="#unhas" onClick={(event) => { event.preventDefault(); goTo("unhas"); }}>Unhas</a><a href="#cilios" onClick={(event) => { event.preventDefault(); goTo("cilios"); }}>Cílios</a><button type="button" onClick={() => openBooking()}>Agendar</button></div>
          <a href={instagramUrl} className="tn-social" target="_blank" rel="noreferrer" aria-label={"Instagram @" + studioContent.contact.instagram}><Instagram size={20} /><span>@{studioContent.contact.instagram}</span></a>
        </div>
        <div className="tn-container tn-footer-bottom"><span>© {new Date().getFullYear()} {studioContent.brand}. Todos os direitos reservados.</span><span>Feito com cuidado, em cada detalhe.</span></div>
      </footer>

      <button type="button" className="tn-whatsapp-float" aria-label="Abrir WhatsApp. Arraste para reposicionar o botão." title="WhatsApp — arraste para mover" style={floatPosition ? { left: floatPosition.x, top: floatPosition.y, right: "auto", bottom: "auto" } : undefined} onPointerDown={onWhatsappDown} onPointerMove={onWhatsappMove} onPointerUp={onWhatsappUp} onPointerCancel={onWhatsappUp} onClick={() => { if (suppressWhatsAppClick.current) { suppressWhatsAppClick.current = false; return; } window.open(whatsAppBase + "?text=" + encodeURIComponent("Olá, Tayza! Gostaria de saber mais sobre os serviços e horários."), "_blank", "noopener,noreferrer"); }}><WhatsAppLogo /></button>

      {menuOpen && (
        <div className="tn-menu-overlay" onMouseDown={(event) => { if (event.target === event.currentTarget) setMenuOpen(false); }}>
          <div className="tn-mobile-menu" role="dialog" aria-label="Menu de navegação" aria-modal="true">
            <div className="tn-mobile-menu-top"><span>TAYZA NAILS</span><button type="button" onClick={() => setMenuOpen(false)} aria-label="Fechar menu"><X size={24} /></button></div>
            <nav>{navigation.map((item, index) => <a key={item.id} href={"#" + item.id} onClick={(event) => { event.preventDefault(); goTo(item.id); }}><small>0{index + 1}</small>{item.label}<ArrowUpRight size={19} /></a>)}</nav>
            <button type="button" className="tn-button tn-button--beige" onClick={() => openBooking()}>AGENDAR HORÁRIO <ArrowUpRight size={17} /></button>
          </div>
        </div>
      )}

      {bookingOpen && (
        <div className="tn-modal-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) setBookingOpen(false); }}>
          <div className="tn-booking-modal" role="dialog" aria-modal="true" aria-labelledby="tn-booking-title">
            <button type="button" className="tn-modal-close" aria-label="Fechar agendamento" onClick={() => setBookingOpen(false)}><X size={23} /></button>
            <p className="tn-eyebrow">AGENDE SUA EXPERIÊNCIA</p>
            <h2 id="tn-booking-title">SEU MOMENTO <span>COMEÇA AQUI.</span></h2>
            <p className="tn-modal-intro">Preencha suas preferências. Vamos abrir uma conversa no WhatsApp para confirmar a disponibilidade.</p>
            <form onSubmit={(event) => { event.preventDefault(); sendBooking(); }}>
              <label>Seu nome <input type="text" placeholder="Como podemos chamar você?" maxLength={80} value={bookingName} onChange={(event) => setBookingName(event.target.value)} /></label>
              <label>Procedimento <select value={bookingService} onChange={(event) => setBookingService(event.target.value)}><option value="">Selecione o serviço desejado</option>{bookingOptions.map((option, index) => <option key={option + index} value={option}>{option}</option>)}</select></label>
              <label>Data de preferência <input type="date" min={new Date().toLocaleDateString("en-CA")} value={bookingDate} onChange={(event) => setBookingDate(event.target.value)} /></label>
              <label>Observações (opcional) <textarea rows={2} maxLength={220} placeholder="Conte o que você procura..." value={bookingNote} onChange={(event) => setBookingNote(event.target.value)} /></label>
              <button type="submit" className="tn-button tn-button--dark">CONTINUAR NO WHATSAPP <ArrowUpRight size={18} /></button>
              <p className="tn-modal-disclaimer">O envio da mensagem não garante a reserva. A confirmação é feita pelo atendimento.</p>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
