import { useEffect, useMemo, useRef, useState, type PointerEvent as ReactPointerEvent } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { ArrowUpRight, Check, Clock3, Instagram, MapPin, Plus, Wallet, X } from "lucide-react";
import studioContent from "@/data/studio-content.json";
import TayzaIntro from "@/components/TayzaIntro";
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
  const [name, setName] = useState("");
  const [date, setDate] = useState("");
  const [note, setNote] = useState("");
  const [minDate, setMinDate] = useState("");
  const stackRef = useRef<HTMLDivElement>(null);

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

  // 3D tilt on the hero photo stack, only for mouse/trackpad users.
  function tilt(event: ReactPointerEvent<HTMLDivElement>) {
    if (event.pointerType !== "mouse") return;
    const stack = stackRef.current;
    if (!stack) return;
    const rect = stack.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;
    stack.style.setProperty("--ry", (x * 14).toFixed(2) + "deg");
    stack.style.setProperty("--rx", (y * -10).toFixed(2) + "deg");
  }

  function resetTilt() {
    stackRef.current?.style.removeProperty("--ry");
    stackRef.current?.style.removeProperty("--rx");
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
      <TayzaIntro images={content.hero.images} />
      <a href="#conteudo" className="tn-skip-link">Pular para o conteúdo</a>

      <header className={"tn-header" + (scrolled ? " is-solid" : "")}>
        <div className="tn-wrap tn-header-row">
          <a href="#inicio" className="tn-logo" onClick={(event) => { event.preventDefault(); goTo("inicio"); }} aria-label="Tayza Nails, início">
            <span className="tn-logo-word">Tayza</span>
            <span className="tn-logo-tag">Nails Studio</span>
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
        <section className="tn-hero" id="inicio" aria-labelledby="tn-hero-title">
          <div className="tn-snow" aria-hidden="true">
            {Array.from({ length: 18 }, (_, index) => <i key={index} />)}
          </div>
          <div className="tn-wrap tn-hero-grid">
            <div className="tn-hero-copy">
              <p className="tn-season" data-hero style={{ ["--i" as string]: 0 }}>
                <Star className="tn-season-star" /> Agenda de Natal aberta
              </p>
              <p className="tn-eyebrow" data-hero style={{ ["--i" as string]: 1 }}>{content.hero.eyebrow}</p>
              <h1 id="tn-hero-title" className="tn-hero-title" data-hero style={{ ["--i" as string]: 2 }}>
                {content.hero.title} <em>{content.hero.emphasis}</em>
              </h1>
              <p className="tn-hero-lead" data-hero style={{ ["--i" as string]: 3 }}>{content.hero.intro}</p>
              <div className="tn-hero-actions" data-hero style={{ ["--i" as string]: 4 }}>
                <button type="button" className="tn-btn tn-btn--gold" onClick={() => setBookingOpen(true)}>
                  Agendar horário <ArrowUpRight size={17} aria-hidden="true" />
                </button>
                <a href="#vitrine" className="tn-btn tn-btn--line" onClick={(event) => { event.preventDefault(); goTo("vitrine"); }}>
                  Ver valores
                </a>
              </div>
              <ul className="tn-hero-facts" data-hero style={{ ["--i" as string]: 5 }}>
                <li><span>Seg a Sáb</span>08h às 17h30</li>
                {lowestPrice && <li><span>A partir de</span>{lowestPrice}</li>}
                <li><span>Pagamento</span>{paymentLabels.join(", ")}</li>
              </ul>
            </div>

            <div className="tn-hero-visual" onPointerMove={tilt} onPointerLeave={resetTilt}>
              <div className="tn-stack" ref={stackRef}>
                {content.hero.images.slice(0, 3).map((src, index) => (
                  <figure className={"tn-stack-card tn-stack-card--" + (index + 1)} key={src + index}>
                    <img src={src} alt={index === 0 ? "Trabalho de unhas da Tayza Nails" : ""} loading={index === 0 ? "eager" : "lazy"} decoding="async" />
                  </figure>
                ))}
                <span className="tn-stack-seal" aria-hidden="true"><Star /> <b>Edição</b> Natal</span>
              </div>
            </div>
          </div>
        </section>

        <section className="tn-vitrine" id="vitrine" aria-labelledby="tn-vitrine-title">
          <div className="tn-wrap">
            <div className="tn-head" data-reveal>
              <p className="tn-eyebrow tn-eyebrow--dark">Vitrine</p>
              <h2 id="tn-vitrine-title" className="tn-title">Tabela de <em>valores</em></h2>
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
                <img src={category.image} alt={"Serviço de " + category.title.toLowerCase() + " da Tayza Nails"} loading="lazy" decoding="async" />
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

        <section className="tn-portfolio" id="portfolio" aria-labelledby="tn-portfolio-title">
          <div className="tn-wrap">
            <div className="tn-head tn-head--split" data-reveal>
              <div>
                <p className="tn-eyebrow">Portfólio</p>
                <h2 id="tn-portfolio-title" className="tn-title tn-title--light">Feito por <em>Tayza</em></h2>
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

        <section className="tn-info" id="info" aria-labelledby="tn-info-title">
          <div className="tn-wrap">
            <h2 id="tn-info-title" className="sr-only">Informações de atendimento</h2>
            <div className="tn-info-grid">
              <article data-reveal style={{ ["--i" as string]: 0 }}>
                <Clock3 size={20} strokeWidth={1.5} aria-hidden="true" />
                <h3>Horário</h3>
                <p>Segunda a sábado<br />08h00 às 17h30</p>
              </article>
              <article data-reveal style={{ ["--i" as string]: 1 }}>
                <Wallet size={20} strokeWidth={1.5} aria-hidden="true" />
                <h3>Pagamento</h3>
                <p>{paymentLabels.join(" · ")}</p>
              </article>
              <article data-reveal style={{ ["--i" as string]: 2 }}>
                <MapPin size={20} strokeWidth={1.5} aria-hidden="true" />
                <h3>Endereço</h3>
                <button type="button" className="tn-link" onClick={() => openWhatsApp("Olá, Tayza! Pode me enviar a localização do studio?")}>
                  Pedir localização <ArrowUpRight size={14} aria-hidden="true" />
                </button>
              </article>
              <article data-reveal style={{ ["--i" as string]: 3 }}>
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
                <h2 className="tn-title tn-title--light">Chegue nas festas <em>pronta.</em></h2>
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
          <span className="tn-logo tn-logo--small"><span className="tn-logo-word">Tayza</span><span className="tn-logo-tag">Nails Studio</span></span>
          <span>© {new Date().getFullYear()} {content.brand}</span>
          <a href={instagramUrl} target="_blank" rel="noreferrer">@{content.contact.instagram}</a>
        </div>
      </footer>

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
        !bookingOpen && (
          <button type="button" className="tn-wa" aria-label="Conversar no WhatsApp" onClick={() => openWhatsApp("Olá, Tayza! Gostaria de saber mais sobre os horários.")}>
            <WhatsAppIcon />
          </button>
        )
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
