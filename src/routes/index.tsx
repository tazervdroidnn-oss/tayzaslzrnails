import { Fragment, useEffect, useMemo, useRef, useState, type PointerEvent as ReactPointerEvent } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { ArrowUpRight, Check, Instagram, MapPin, Plus, Wallet, X } from "lucide-react";
import studioContent from "@/data/studio-content.json";
import TayzaIntro from "@/components/TayzaIntro";
import TayzaGuide from "@/components/TayzaGuide";
import type { StudioContent } from "@/lib/studio-content-schema";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Tayza Nails | Unhas, cílios e sobrancelhas" },
      { name: "description", content: "Unhas, cílios e sobrancelhas com acabamento premium. Veja a tabela de valores e agende pelo WhatsApp." },
      { property: "og:title", content: "Tayza Nails | Unhas, cílios e sobrancelhas" },
      { property: "og:description", content: "Tabela de valores, portfólio e agendamento pelo WhatsApp." },
      { property: "og:type", content: "website" },
      { property: "og:image", content: "https://tayzanails.vercel.app/tayza-unhas.png" },
      { name: "theme-color", content: "#1a0810" },
    ],
  }),
  component: TayzaHome,
});

const content: StudioContent = studioContent;
const whatsAppBase = "https://wa.me/" + content.contact.whatsapp;
const instagramUrl = "https://instagram.com/" + content.contact.instagram;
const brl = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });

/** "R$ 1.234,50" → 1234.5; returns null for anything that is not a plain price. */
function parsePrice(label: string): number | null {
  const match = label.trim().match(/^R\$\s*([\d.]+)(?:,(\d{1,2}))?$/);
  if (!match) return null;
  return Number(match[1].replace(/\./g, "") + "." + (match[2] || "0"));
}

/** Shows "R$ 90" instead of "R$ 90,00" when there are no cents, for a cleaner list. */
function shortPrice(label: string) {
  return label.replace(/,00$/, "");
}

const allItems = content.menu.flatMap((category) =>
  category.items.map((item) => ({ ...item, key: category.id + ":" + item.id, category: category.title })));
const itemByKey = new Map(allItems.map((item) => [item.key, item]));

const portfolio = [
  ...content.nails.map((item) => ({ ...item, kind: "unhas" as const })),
  ...content.lashes.map((item) => ({ ...item, kind: "cilios" as const })),
];

const prices = allItems.map((item) => parsePrice(item.price)).filter((value): value is number => value !== null);
const lowestPrice = prices.length ? brl.format(Math.min(...prices)).replace(/,00$/, "") : "";

const paymentLabels = [
  content.payments.pix && "Pix",
  content.payments.card && "Cartão",
  content.payments.cash && "Dinheiro",
].filter(Boolean) as string[];

const navigation = [
  { id: "vitrine", label: "Valores" },
  { id: "portfolio", label: "Portfólio" },
  { id: "info", label: "Informações" },
];

function openWhatsApp(text: string) {
  window.open(whatsAppBase + "?text=" + encodeURIComponent(text), "_blank", "noopener,noreferrer");
}

function Star({ className = "" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 1.5c.5 5.6 4.9 10 10.5 10.5-5.6.5-10 4.9-10.5 10.5C11.5 16.9 7.1 12.5 1.5 12 7.1 11.5 11.5 7.1 12 1.5Z" fill="currentColor" />
    </svg>
  );
}

/** Splits a heading into words for the blur-in reveal (Figma "smart animate" feel). */
function Words({ text }: { text: string }) {
  return (
    <>
      {text.split(/\s+/).filter(Boolean).map((word, index) => (
        <Fragment key={index}>
          {index > 0 && " "}
          <span className="tn-w" style={{ ["--w" as string]: index }}>{word}</span>
        </Fragment>
      ))}
    </>
  );
}

function Seam({ tone }: { tone: "dark" | "light" }) {
  return (
    <div className={"tn-seam tn-seam--" + tone} aria-hidden="true">
      <div><span /><b><Star /></b><span /></div>
    </div>
  );
}

const COOKIE_KEY = "tayza-cookies";
const [brandFirst, ...brandRest] = content.brand.trim().split(/\s+/);
const brandSecond = brandRest.join(" ") || "Nails";

function WhatsAppIcon({ size = 22 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="currentColor" aria-hidden="true">
      <path d="M16.02 2.66A13.25 13.25 0 0 0 4.66 22.7L2.7 29.33l6.81-1.82a13.34 13.34 0 0 0 6.5 1.7h.01c7.33 0 13.31-5.95 13.31-13.28A13.31 13.31 0 0 0 16.02 2.66Zm0 24.2a10.9 10.9 0 0 1-5.56-1.52l-.4-.23-4.05 1.08 1.08-3.94-.26-.41a10.92 10.92 0 1 1 9.19 5.02Zm6.01-8.19c-.33-.16-1.95-.96-2.25-1.07-.3-.11-.52-.16-.74.17-.22.33-.85 1.07-1.04 1.29-.19.22-.38.25-.71.09-.33-.17-1.39-.51-2.64-1.64-.98-.87-1.64-1.95-1.83-2.28-.19-.33-.02-.51.14-.67.15-.15.33-.38.49-.57.16-.19.22-.33.33-.55.11-.22.05-.41-.03-.58-.08-.16-.74-1.79-1.02-2.45-.27-.64-.54-.55-.74-.56h-.63c-.22 0-.58.08-.88.41s-1.16 1.13-1.16 2.75 1.19 3.19 1.35 3.41c.16.22 2.32 3.54 5.62 4.97.78.34 1.39.54 1.86.69.78.25 1.49.21 2.05.13.62-.09 1.95-.8 2.23-1.57.28-.77.28-1.44.2-1.57-.08-.14-.3-.22-.63-.39Z" />
    </svg>
  );
}

function TayzaHome() {
  const [scrolled, setScrolled] = useState(false);
  const [activeCategory, setActiveCategory] = useState(content.menu[0]?.id ?? "");
  const [filter, setFilter] = useState<"todos" | "unhas" | "cilios">("todos");
  const [selected, setSelected] = useState<string[]>([]);
  const [bookingOpen, setBookingOpen] = useState(false);
  const [cookieOpen, setCookieOpen] = useState(false);
  const [name, setName] = useState("");
  const [date, setDate] = useState("");
  const [note, setNote] = useState("");
  const [minDate, setMinDate] = useState("");
  const tiltRef = useRef<HTMLDivElement>(null);
  const clockRef = useRef<HTMLDivElement>(null);

  const category = content.menu.find((entry) => entry.id === activeCategory) ?? content.menu[0];
  const visiblePortfolio = filter === "todos" ? portfolio : portfolio.filter((item) => item.kind === filter);

  const total = useMemo(() => {
    const values = selected.map((key) => parsePrice(itemByKey.get(key)?.price ?? ""));
    return values.some((value) => value === null) ? null : values.reduce<number>((sum, value) => sum + (value ?? 0), 0);
  }, [selected]);

  const dateInvalid = Boolean(date && ((minDate && date < minDate) || new Date(date + "T12:00:00").getDay() === 0));

  useEffect(() => {
    const today = new Date();
    setMinDate([today.getFullYear(), String(today.getMonth() + 1).padStart(2, "0"), String(today.getDate()).padStart(2, "0")].join("-"));
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Cookie notice: shown once, after the opening has finished.
  useEffect(() => {
    let decided = false;
    try { decided = Boolean(localStorage.getItem(COOKIE_KEY)); } catch { /* sem armazenamento: mostra o aviso */ }
    if (decided) return;
    const wait = document.documentElement.classList.contains("tn-skip-intro") ? 1400 : 4200;
    const timer = window.setTimeout(() => setCookieOpen(true), wait);
    return () => window.clearTimeout(timer);
  }, []);

  // Scroll reveal. Content is visible by default; the "tn-js" class (set before paint) enables the effect.
  useEffect(() => {
    const elements = Array.from(document.querySelectorAll<HTMLElement>("[data-reveal]:not(.is-in)"));
    if (!("IntersectionObserver" in window)) {
      elements.forEach((element) => element.classList.add("is-in"));
      return;
    }
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-in");
        observer.unobserve(entry.target);
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.08 });
    elements.forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, [filter]);

  // Opening hours count up from 00 when the clock scrolls into view.
  useEffect(() => {
    const clock = clockRef.current;
    if (!clock || !("IntersectionObserver" in window)) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const digits = Array.from(clock.querySelectorAll<HTMLElement>("[data-count]"));
    let frame = 0;
    const observer = new IntersectionObserver((entries) => {
      if (!entries.some((entry) => entry.isIntersecting)) return;
      observer.disconnect();
      clock.classList.add("is-counting");
      const start = performance.now();
      const duration = 1900;
      const step = (now: number) => {
        const t = Math.min(1, (now - start) / duration);
        const eased = 1 - Math.pow(1 - t, 3);
        digits.forEach((digit) => {
          digit.textContent = String(Math.round(Number(digit.dataset.count) * eased)).padStart(2, "0");
        });
        if (t < 1) frame = requestAnimationFrame(step);
        else { clock.classList.remove("is-counting"); clock.classList.add("is-counted"); }
      };
      frame = requestAnimationFrame(step);
    }, { threshold: 0.6 });
    observer.observe(clock);
    return () => { observer.disconnect(); cancelAnimationFrame(frame); };
  }, []);

  useEffect(() => {
    if (!bookingOpen) return;
    const onKey = (event: KeyboardEvent) => { if (event.key === "Escape") setBookingOpen(false); };
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", onKey);
    };
  }, [bookingOpen]);

  // Subtle 3D parallax on the opening scene, only for mouse/trackpad users.
  function tilt(event: ReactPointerEvent<HTMLDivElement>) {
    if (event.pointerType !== "mouse") return;
    const scene = tiltRef.current;
    if (!scene) return;
    const rect = scene.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;
    scene.style.setProperty("--ry", (x * 8).toFixed(2) + "deg");
    scene.style.setProperty("--rx", (y * -6).toFixed(2) + "deg");
  }

  function resetTilt() {
    tiltRef.current?.style.removeProperty("--ry");
    tiltRef.current?.style.removeProperty("--rx");
  }

  function toggle(key: string) {
    setSelected((items) => items.includes(key) ? items.filter((item) => item !== key) : [...items, key]);
  }

  function goTo(id: string) {
    const target = document.getElementById(id);
    if (!target) return;
    const top = id === "inicio" ? 0 : target.getBoundingClientRect().top + window.scrollY - 64;
    window.scrollTo({ top, behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
    window.history.replaceState(window.history.state, "", "#" + id);
  }

  function decideCookies(value: "all" | "essential") {
    try { localStorage.setItem(COOKIE_KEY, value); } catch { /* ignora */ }
    setCookieOpen(false);
  }

  function sendBooking() {
    if (dateInvalid) return;
    const services = selected.map((key) => itemByKey.get(key)).filter(Boolean)
      .map((item) => "• " + item!.name + " (" + shortPrice(item!.price) + ")");
    const lines = [
      "Olá, Tayza! Gostaria de agendar um horário.",
      name.trim() && "Nome: " + name.trim(),
      services.length ? "Serviços:\n" + services.join("\n") : "Ainda estou escolhendo o serviço.",
      total !== null && services.length ? "Total estimado: " + brl.format(total) : "",
      date && "Data de preferência: " + date.split("-").reverse().join("/"),
      note.trim() && "Observação: " + note.trim(),
    ].filter(Boolean);
    openWhatsApp(lines.join("\n"));
    setBookingOpen(false);
  }

  return (
    <div className="tn-page">
      <TayzaIntro />
      <a href="#conteudo" className="tn-skip-link">Pular para o conteúdo</a>

      <header className={"tn-header" + (scrolled ? " is-solid" : "")}>
        <div className="tn-wrap tn-header-row">
          <a href="#inicio" className="tn-logo" onClick={(event) => { event.preventDefault(); goTo("inicio"); }} aria-label={content.brand + ", início"}>
            <span className="tn-logo-word">{brandFirst}</span>
            <span className="tn-logo-tag">{brandSecond}</span>
          </a>
          <nav className="tn-nav" aria-label="Seções">
            {navigation.map((item) => (
              <a key={item.id} href={"#" + item.id} onClick={(event) => { event.preventDefault(); goTo(item.id); }}>{item.label}</a>
            ))}
          </nav>
          <button type="button" className="tn-btn tn-btn--ghost tn-header-cta" onClick={() => setBookingOpen(true)}>
            Agendar <ArrowUpRight size={15} aria-hidden="true" />
          </button>
        </div>
      </header>

      <main id="conteudo">
        <section className="tn-hero" id="inicio" aria-label={content.brand}>
          <div className="tn-snow" aria-hidden="true">
            {Array.from({ length: 18 }, (_, index) => <i key={index} />)}
          </div>

          <p className="tn-season" data-hero style={{ ["--i" as string]: 0 }}>
            <Star className="tn-season-star" /> Agenda de Natal aberta
          </p>

          <div className="tn-stage" onPointerMove={tilt} onPointerLeave={resetTilt}>
            <div className="tn-cam">
              <div className="tn-tilt" ref={tiltRef}>
                {content.hero.images.slice(0, 3).map((src, index) => (
                  <figure className={"tn-card tn-card--" + (index + 1)} key={src + index}>
                    <div className="tn-card-inner">
                      <img src={src} alt={index === 0 ? "Trabalho da " + content.brand : ""} loading="eager" decoding="async" />
                    </div>
                  </figure>
                ))}
                <h1 className="tn-mark" aria-label={content.brand}>
                  <span className="tn-mark-word" aria-hidden="true">
                    {Array.from(brandFirst).map((letter, index) => (
                      <span key={index} style={{ ["--l" as string]: index }}>{letter}</span>
                    ))}
                  </span>
                  <span className="tn-mark-sub" aria-hidden="true"><i />{brandSecond}<i /></span>
                </h1>
                <p className="tn-mark-tag">{content.hero.eyebrow}</p>
              </div>
            </div>
          </div>

          <div className="tn-hero-foot" data-hero style={{ ["--i" as string]: 1 }}>
            <div className="tn-hero-actions">
              <button type="button" className="tn-btn tn-btn--gold" onClick={() => setBookingOpen(true)}>
                Agendar horário <ArrowUpRight size={17} aria-hidden="true" />
              </button>
              <a href="#vitrine" className="tn-btn tn-btn--line" onClick={(event) => { event.preventDefault(); goTo("vitrine"); }}>
                Ver valores
              </a>
            </div>
            <ul className="tn-hero-facts">
              <li><span>Seg a Sáb</span>08h às 17h30</li>
              {lowestPrice && <li><span>A partir de</span>{lowestPrice}</li>}
              <li><span>Pagamento</span>{paymentLabels.join(", ")}</li>
            </ul>
          </div>
        </section>

        <section className="tn-about" id="sobre" aria-labelledby="tn-about-title">
          <div className="tn-wrap tn-about-inner" data-reveal>
            <p className="tn-eyebrow">O studio</p>
            <h2 id="tn-about-title" className="tn-title tn-title--light tn-about-title">
              <Words text={content.hero.title} /> <em><Words text={content.hero.emphasis} /></em>
            </h2>
            <p className="tn-about-lead">{content.hero.intro}</p>
          </div>
        </section>

        <Seam tone="light" />
        <section className="tn-vitrine" id="vitrine" aria-labelledby="tn-vitrine-title">
          <div className="tn-wrap">
            <div className="tn-head" data-reveal>
              <p className="tn-eyebrow tn-eyebrow--dark">Vitrine</p>
              <h2 id="tn-vitrine-title" className="tn-title"><Words text="Tabela de" /> <em><Words text="valores" /></em></h2>
              <p className="tn-head-note">Toque nos serviços para montar seu atendimento e enviar tudo de uma vez pelo WhatsApp.</p>
            </div>

            <div className="tn-tabs" role="tablist" aria-label="Categorias" data-reveal>
              {content.menu.map((entry) => (
                <button
                  key={entry.id}
                  type="button"
                  role="tab"
                  id={"tab-" + entry.id}
                  aria-selected={entry.id === category.id}
                  aria-controls="tn-menu-panel"
                  className={entry.id === category.id ? "is-active" : ""}
                  onClick={() => setActiveCategory(entry.id)}
                >
                  {entry.title}<small>{entry.items.length}</small>
                </button>
              ))}
            </div>

            <div className="tn-menu" id="tn-menu-panel" role="tabpanel" aria-labelledby={"tab-" + category.id} key={category.id}>
              <figure className="tn-menu-cover">
                <img src={category.image} alt={"Serviço de " + category.title.toLowerCase() + " da " + content.brand} loading="lazy" decoding="async" />
                <figcaption>
                  <strong>{category.title}</strong>
                  <span>{category.subtitle}</span>
                </figcaption>
              </figure>
              <ul className="tn-menu-list">
                {category.items.map((item, index) => {
                  const key = category.id + ":" + item.id;
                  const isOn = selected.includes(key);
                  return (
                    <li key={key} style={{ ["--i" as string]: index }}>
                      <button type="button" className={"tn-row" + (isOn ? " is-on" : "")} aria-pressed={isOn} onClick={() => toggle(key)}>
                        <span className="tn-row-name">
                          {item.name}
                          {item.note && <small>{item.note}</small>}
                        </span>
                        <span className="tn-row-dots" aria-hidden="true" />
                        <span className="tn-row-price">{shortPrice(item.price)}</span>
                        <span className="tn-row-add" aria-hidden="true">{isOn ? <Check size={15} /> : <Plus size={15} />}</span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
            <p className="tn-fineprint">Valores por sessão. Horário e valor final confirmados no atendimento.</p>
          </div>
        </section>

        <Seam tone="dark" />
        <section className="tn-portfolio" id="portfolio" aria-labelledby="tn-portfolio-title">
          <div className="tn-wrap">
            <div className="tn-head tn-head--split" data-reveal>
              <div>
                <p className="tn-eyebrow">Portfólio</p>
                <h2 id="tn-portfolio-title" className="tn-title tn-title--light"><Words text="Feito por" /> <em><Words text={brandFirst} /></em></h2>
              </div>
              <div className="tn-filters" role="group" aria-label="Filtrar portfólio">
                {([["todos", "Todos"], ["unhas", "Unhas"], ["cilios", "Cílios"]] as const).map(([id, label]) => (
                  <button key={id} type="button" aria-pressed={filter === id} className={filter === id ? "is-active" : ""} onClick={() => setFilter(id)}>{label}</button>
                ))}
              </div>
            </div>
          </div>
          <div className="tn-reel" tabIndex={0} aria-label="Galeria de trabalhos, role para o lado">
            {visiblePortfolio.map((item, index) => (
              <figure className="tn-shot" key={item.kind + item.id} data-reveal style={{ ["--i" as string]: index % 4 }}>
                <div className="tn-shot-frame">
                  <img src={item.image} alt={item.alt} loading="lazy" decoding="async" draggable={false} />
                </div>
                <figcaption>
                  <span>{item.kind === "unhas" ? "Unhas" : "Cílios"}</span>
                  {item.name}
                </figcaption>
              </figure>
            ))}
          </div>
          <div className="tn-wrap">
            <a className="tn-insta" href={instagramUrl} target="_blank" rel="noreferrer">
              <Instagram size={17} aria-hidden="true" /> Mais trabalhos em @{content.contact.instagram} <ArrowUpRight size={15} aria-hidden="true" />
            </a>
          </div>
        </section>

        <Seam tone="light" />
        <section className="tn-info" id="info" aria-labelledby="tn-info-title">
          <div className="tn-wrap">
            <div className="tn-hours" data-reveal>
              <div className="tn-hours-head">
                <p className="tn-eyebrow tn-eyebrow--dark">Atendimento</p>
                <h2 id="tn-info-title" className="tn-title"><Words text="Horário do" /> <em><Words text="studio" /></em></h2>
                <ul className="tn-days" aria-label="Segunda a sábado">
                  {["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"].map((day, index) => (
                    <li key={day} className={index === 6 ? "is-off" : ""} style={{ ["--i" as string]: index }}>{day}</li>
                  ))}
                </ul>
              </div>
              <div className="tn-clock" ref={clockRef} role="img" aria-label="Das 08h00 às 17h30">
                <div className="tn-time" aria-hidden="true">
                  <small>Abre</small>
                  <span><b data-count="8">08</b><i>h</i><b data-count="0">00</b></span>
                </div>
                <span className="tn-clock-line" aria-hidden="true"><span /></span>
                <div className="tn-time" aria-hidden="true">
                  <small>Fecha</small>
                  <span><b data-count="17">17</b><i>h</i><b data-count="30">30</b></span>
                </div>
              </div>
            </div>

            <div className="tn-info-grid">
              <article data-reveal style={{ ["--i" as string]: 0 }}>
                <Wallet size={20} strokeWidth={1.5} aria-hidden="true" />
                <h3>Pagamento</h3>
                <p>{paymentLabels.join(" · ")}</p>
              </article>
              <article data-reveal style={{ ["--i" as string]: 1 }}>
                <MapPin size={20} strokeWidth={1.5} aria-hidden="true" />
                <h3>Endereço</h3>
                <button type="button" className="tn-link" onClick={() => openWhatsApp("Olá, Tayza! Pode me enviar a localização do studio?")}>
                  Pedir localização <ArrowUpRight size={14} aria-hidden="true" />
                </button>
              </article>
              <article data-reveal style={{ ["--i" as string]: 2 }}>
                <Instagram size={20} strokeWidth={1.5} aria-hidden="true" />
                <h3>Instagram</h3>
                <a className="tn-link" href={instagramUrl} target="_blank" rel="noreferrer">
                  @{content.contact.instagram} <ArrowUpRight size={14} aria-hidden="true" />
                </a>
              </article>
            </div>

            <div className="tn-xmas" data-reveal>
              <Star className="tn-xmas-star" />
              <div>
                <p className="tn-eyebrow">Dezembro</p>
                <h2 className="tn-title tn-title--light"><Words text="Chegue nas festas" /> <em><Words text="pronta." /></em></h2>
                <p>Os horários de dezembro costumam esgotar primeiro. Reserve o seu com antecedência.</p>
              </div>
              <button type="button" className="tn-btn tn-btn--gold" onClick={() => setBookingOpen(true)}>
                Reservar horário <ArrowUpRight size={17} aria-hidden="true" />
              </button>
            </div>
          </div>
        </section>
      </main>

      <footer className="tn-footer">
        <div className="tn-wrap tn-footer-row">
          <span className="tn-logo tn-logo--small"><span className="tn-logo-word">{brandFirst}</span><span className="tn-logo-tag">{brandSecond}</span></span>
          <a href={instagramUrl} target="_blank" rel="noreferrer">@{content.contact.instagram}</a>
        </div>
        <div className="tn-wrap tn-footer-base">
          <span>© {new Date().getFullYear()} {content.brand}</span>
          <button type="button" onClick={() => setCookieOpen(true)}>Cookies</button>
          <a href="https://instagram.com/joaodstudio" target="_blank" rel="noreferrer">Site por @joaodstudio</a>
        </div>
      </footer>

      <TayzaGuide suppressed={bookingOpen || cookieOpen || selected.length > 0} />

      {selected.length > 0 && !bookingOpen ? (
        <aside className="tn-dock" aria-label="Seu atendimento">
          <div className="tn-dock-info">
            <strong>{selected.length} {selected.length === 1 ? "serviço" : "serviços"}</strong>
            <span aria-live="polite">{total !== null ? brl.format(total) : "Sob consulta"}</span>
          </div>
          <button type="button" className="tn-dock-clear" onClick={() => setSelected([])} aria-label="Limpar seleção"><X size={16} /></button>
          <button type="button" className="tn-btn tn-btn--gold tn-dock-cta" onClick={() => setBookingOpen(true)}>
            Agendar <ArrowUpRight size={16} aria-hidden="true" />
          </button>
        </aside>
      ) : (
        !bookingOpen && !cookieOpen && (
          <button type="button" className="tn-wa" aria-label="Conversar no WhatsApp" onClick={() => openWhatsApp("Olá, Tayza! Gostaria de saber mais sobre os horários.")}>
            <WhatsAppIcon />
          </button>
        )
      )}

      {cookieOpen && !bookingOpen && (
        <div className="tn-cookie" role="dialog" aria-label="Aviso de cookies">
          <p><strong>Cookies</strong> Usamos apenas armazenamento essencial para o site funcionar bem, como lembrar que você já viu a abertura. Não usamos cookies de anúncio.</p>
          <div>
            <button type="button" className="tn-cookie-ghost" onClick={() => decideCookies("essential")}>Só essenciais</button>
            <button type="button" className="tn-btn tn-btn--gold" onClick={() => decideCookies("all")}>Aceitar</button>
          </div>
        </div>
      )}

      {bookingOpen && (
        <div className="tn-modal-bg" onMouseDown={(event) => { if (event.target === event.currentTarget) setBookingOpen(false); }}>
          <div className="tn-modal" role="dialog" aria-modal="true" aria-labelledby="tn-modal-title">
            <button type="button" className="tn-modal-close" onClick={() => setBookingOpen(false)} aria-label="Fechar"><X size={20} /></button>
            <p className="tn-eyebrow tn-eyebrow--dark">Agendamento</p>
            <h2 id="tn-modal-title" className="tn-title tn-title--modal">Seu <em>horário</em></h2>
            <form onSubmit={(event) => { event.preventDefault(); sendBooking(); }}>
              <label className="tn-field">
                <span>Nome</span>
                <input type="text" value={name} maxLength={80} autoComplete="given-name" placeholder="Como podemos te chamar?" onChange={(event) => setName(event.target.value)} />
              </label>
              <fieldset className="tn-field">
                <legend>Serviços</legend>
                {content.menu.map((group) => (
                  <div className="tn-chips" key={group.id}>
                    <small>{group.title}</small>
                    <div>
                      {group.items.map((item) => {
                        const key = group.id + ":" + item.id;
                        const isOn = selected.includes(key);
                        return (
                          <button type="button" key={key} aria-pressed={isOn} className={isOn ? "is-on" : ""} onClick={() => toggle(key)}>
                            {item.name}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </fieldset>
              <label className="tn-field">
                <span>Data de preferência</span>
                <input type="date" value={date} min={minDate || undefined} aria-invalid={dateInvalid} aria-describedby="tn-date-hint" onChange={(event) => setDate(event.target.value)} />
                <small id="tn-date-hint" className={dateInvalid ? "is-error" : ""}>
                  {dateInvalid ? "Escolha uma data futura, de segunda a sábado." : "Atendimento de segunda a sábado."}
                </small>
              </label>
              <label className="tn-field">
                <span>Observação <i>(opcional)</i></span>
                <textarea rows={2} maxLength={220} value={note} placeholder="Cor, formato, referência..." onChange={(event) => setNote(event.target.value)} />
              </label>
              <div className="tn-modal-foot">
                <div>
                  <small>Total estimado</small>
                  <strong>{selected.length === 0 ? "—" : total !== null ? brl.format(total) : "Sob consulta"}</strong>
                </div>
                <button type="submit" className="tn-btn tn-btn--wine" disabled={dateInvalid}>
                  <WhatsAppIcon size={18} /> Enviar no WhatsApp
                </button>
              </div>
              <p className="tn-modal-note">A reserva é confirmada pela Tayza na conversa.</p>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
