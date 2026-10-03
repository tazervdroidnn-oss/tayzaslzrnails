import { useEffect, useState, type CSSProperties } from "react";
import { createFileRoute } from "@tanstack/react-router";
import heroTayza from "@/assets/hero.jpg";
import galleryNails from "@/assets/gallery-nails.jpg";

const alongamentoImages = ["/alongamento1.jpeg", "/alongamento2.jpeg"];

const galleryLashesCloseup = "/volume%20fio%20a%20fio.jpg";
const galleryLashesBrown = "/volume%205d.jpg";
const galleryBrazilianBrownTayza = "/volume%20brasileiro%20marrom.jpg";
const galleryMegaFoxYes = "/mega%20fox%20yes.jpg";
const galleryMega6D = "/mega%206d.jpg";
const galleryBrasileiro = "/volume%20brasileiro.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "A arte de cuidar de você — Unhas, Cílios e Manutenção" },
      {
        name: "description",
        content:
          "Alongamento de unhas, esmaltação em gel, volume russo e manutenção no ritmo certo. Agende seu horário pelo WhatsApp.",
      },
      { property: "og:title", content: "A arte de cuidar de você — Unhas, Cílios e Manutenção" },
      {
        property: "og:description",
        content:
          "Unhas, cílios e manutenção com acabamento impecável. Agende pelo WhatsApp.",
      },
      { property: "og:url", content: "/" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "/" }],
  }),
  component: Index,
});

const WHATSAPP_URL = "https://wa.me/5599991643916";
const INSTAGRAM_URL = "https://instagram.com/tayzaslzr_nails";

function LashIcon({ className, style }: { className?: string; style?: CSSProperties }) {
  return (
    <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth={2.6} strokeLinecap="round" className={className} style={style}>
      <path d="M10 25 Q32 39 54 25" />
      <path d="M15 29.5 L10.5 37.5" />
      <path d="M23 33.5 L20 42" />
      <path d="M32 35 L32 44" />
      <path d="M41 33.5 L44 42" />
      <path d="M49 29.5 L53.5 37.5" />
    </svg>
  );
}

function NailIcon({ className, style }: { className?: string; style?: CSSProperties }) {
  return (
    <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth={2.6} strokeLinecap="round" strokeLinejoin="round" className={className} style={style}>
      <path d="M32 5 C43 17 46 33 41 47 a11 11 0 0 1 -18 0 C18 33 21 17 32 5 Z" />
      <path d="M22.5 41 Q32 49 41.5 41" />
      <path d="M27 20 Q31 26 29 33" />
    </svg>
  );
}

function SparkleIcon({ className, style }: { className?: string; style?: CSSProperties }) {
  return (
    <svg viewBox="0 0 64 64" fill="currentColor" className={className} style={style}>
      <path d="M32 6 L36.5 27.5 L58 32 L36.5 36.5 L32 58 L27.5 36.5 L6 32 L27.5 27.5 Z" />
    </svg>
  );
}

function PolishIcon({ className, style }: { className?: string; style?: CSSProperties }) {
  return (
    <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth={2.6} strokeLinecap="round" strokeLinejoin="round" className={className} style={style}>
      <path d="M26 6 h12 v9 h-12 Z" />
      <path d="M28 15 h8 l3 8 v27 a5 5 0 0 1 -5 5 h-4 a5 5 0 0 1 -5 -5 v-27 Z" />
      <path d="M27 38 c3 -3 7 -3 10 0 v11 a3 3 0 0 1 -3 3 h-4 a3 3 0 0 1 -3 -3 Z" />
    </svg>
  );
}

function Index() {

  const [flashServices, setFlashServices] = useState(false);
  const [heroImageIndex, setHeroImageIndex] = useState(0);
  const heroImages = alongamentoImages;

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (!element) return;

    const headerOffset = 88;
    const start = window.scrollY;
    const target = Math.max(
      0,
      element.getBoundingClientRect().top + window.scrollY - headerOffset,
    );
    const distance = target - start;
    const duration = 850;
    const startTime = performance.now();

    element.classList.remove("section-focus");
    void element.offsetWidth;
    element.classList.add("section-focus");
    window.setTimeout(() => element.classList.remove("section-focus"), 1400);

    const easeInOut = (progress: number) =>
      progress < 0.5
        ? 2 * progress * progress
        : 1 - Math.pow(-2 * progress + 2, 2) / 2;

    const animateScroll = (currentTime: number) => {
      const progress = Math.min((currentTime - startTime) / duration, 1);
      window.scrollTo(0, start + distance * easeInOut(progress));

      if (progress < 1) {
        window.requestAnimationFrame(animateScroll);
      }
    };

    window.requestAnimationFrame(animateScroll);
    window.history.replaceState(null, "", "#" + id);
  };

  useEffect(() => {
    const interval = window.setInterval(() => {
      setHeroImageIndex((current) => (current + 1) % heroImages.length);
    }, 5000);
    return () => window.clearInterval(interval);
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const apply = () => {
      if (window.location.hash === "#servicos") {
        setFlashServices(false);
        requestAnimationFrame(() => setFlashServices(true));
        window.setTimeout(() => setFlashServices(false), 2600);
      }
    };
    apply();
    window.addEventListener("hashchange", apply);
    return () => window.removeEventListener("hashchange", apply);
  }, []);

  return (
    <>
      <div className="relative min-h-screen overflow-hidden bg-background">
      {/* Ambient glow */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="glow-ambient animate-float -left-40 -top-40 size-[34rem] bg-primary/25" />
        <div className="glow-ambient animate-float -right-40 top-1/3 size-[36rem] bg-accent/60" />
        <div className="glow-ambient bottom-0 left-1/4 size-[30rem] bg-primary/15" />
      </div>

      {/* Doodles minimalistas de fundo — branco com dourado */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
        <LashIcon className="absolute left-[3%] top-[2%] size-24 text-foreground opacity-[0.3] -rotate-12 animate-float drop-shadow-[0_0_14px_rgba(216,182,92,0.45)]" style={{ animationDuration: "9s" }} />
        <NailIcon className="absolute right-[5%] top-[4%] size-20 text-gold opacity-[0.5] rotate-12 animate-float" style={{ animationDuration: "11s" }} />
        <SparkleIcon className="absolute left-[13%] top-[9%] size-8 text-gold opacity-[0.6] drop-shadow-[0_0_10px_rgba(216,182,92,0.6)]" />
        <PolishIcon className="absolute right-[16%] top-[13%] size-16 text-foreground opacity-[0.3] rotate-6" />
        <LashIcon className="absolute left-[42%] top-[5%] size-14 text-gold opacity-[0.4] rotate-3 animate-float" style={{ animationDuration: "10.5s" }} />
        <SparkleIcon className="absolute right-[40%] top-[3%] size-6 text-foreground opacity-[0.35]" />
        <SparkleIcon className="absolute right-[4%] top-[22%] size-7 text-foreground opacity-[0.4]" />
        <LashIcon className="absolute right-[3%] top-[28%] size-20 text-foreground opacity-[0.3] rotate-6 animate-float drop-shadow-[0_0_14px_rgba(216,182,92,0.4)]" style={{ animationDuration: "12s" }} />
        <NailIcon className="absolute left-[4%] top-[37%] size-18 text-gold opacity-[0.5] -rotate-12 animate-float" style={{ animationDuration: "10s" }} />
        <SparkleIcon className="absolute left-[12%] top-[46%] size-6 text-gold opacity-[0.55]" />
        <PolishIcon className="absolute left-[38%] top-[42%] size-14 text-gold opacity-[0.35] -rotate-6" />
        <LashIcon className="absolute left-[6%] top-[55%] size-22 text-foreground opacity-[0.3] -rotate-6 animate-float drop-shadow-[0_0_14px_rgba(216,182,92,0.4)]" style={{ animationDuration: "13s" }} />
        <NailIcon className="absolute right-[6%] top-[52%] size-16 text-foreground opacity-[0.3] rotate-12" />
        <SparkleIcon className="absolute right-[14%] top-[60%] size-8 text-gold opacity-[0.55] drop-shadow-[0_0_10px_rgba(216,182,92,0.55)]" />
        <LashIcon className="absolute right-[3%] top-[68%] size-18 text-gold opacity-[0.45] rotate-12 animate-float" style={{ animationDuration: "9.5s" }} />
        <NailIcon className="absolute left-[8%] top-[70%] size-16 text-gold opacity-[0.45] rotate-6 animate-float" style={{ animationDuration: "11.5s" }} />
        <SparkleIcon className="absolute left-[4%] top-[80%] size-7 text-foreground opacity-[0.4]" />
        <PolishIcon className="absolute right-[10%] top-[78%] size-14 text-foreground opacity-[0.3] -rotate-3" />
        <LashIcon className="absolute left-[30%] top-[85%] size-16 text-gold opacity-[0.4] -rotate-3 animate-float" style={{ animationDuration: "10s" }} />
        <NailIcon className="absolute right-[5%] top-[88%] size-18 text-foreground opacity-[0.3] -rotate-6 animate-float drop-shadow-[0_0_14px_rgba(216,182,92,0.4)]" style={{ animationDuration: "12.5s" }} />
        <SparkleIcon className="absolute left-[6%] top-[94%] size-6 text-gold opacity-[0.6] drop-shadow-[0_0_10px_rgba(216,182,92,0.55)]" />
        <LashIcon className="absolute right-[20%] top-[96%] size-14 text-foreground opacity-[0.25] rotate-6" />
      </div>

      <div className="relative mx-auto max-w-6xl px-5 sm:px-8">
        {/* Navegação inspirada na identidade Tayza Nails */}
        <nav className="tayza-nav flex items-center justify-between gap-5 py-6">
          <a href="/" className="tayza-brand" aria-label="Tayza Nails início">
            <span className="tayza-crown" aria-hidden="true">♛</span>
            <span className="tayza-script">Tayza Nails</span>
            <span className="tayza-subbrand">NAIL DESIGNER</span>
          </a>
          <div className="hidden items-center gap-8 text-sm md:flex">
            <a href="/" className="tayza-nav-active">Início</a>
            <a href="#sobre" onClick={(event) => { event.preventDefault(); scrollToSection("sobre"); }}>Sobre</a>
            <a href="#servicos" onClick={(event) => { event.preventDefault(); scrollToSection("servicos"); }}>Serviços</a>
            <a href="#resultados" onClick={(event) => { event.preventDefault(); scrollToSection("resultados"); }}>Resultados</a>
            <a href="#agendar" onClick={(event) => { event.preventDefault(); scrollToSection("agendar"); }}>Contato</a>
          </div>
          <a href={WHATSAPP_URL} target="_blank" rel="noreferrer" className="tayza-outline-button">
            <span aria-hidden="true">◉</span> Agende seu horário
          </a>
        </nav>

        {/* Hero */}
        <section id="sobre" className="tayza-hero grid items-center gap-8 lg:grid-cols-2">
          <div className="tayza-hero-copy">
            <p className="tayza-eyebrow">UNHAS QUE REALÇAM<br />SUA BELEZA</p>
            <h1 className="tayza-headline">Cuidado, beleza e<br /><span>autoestima</span></h1>
            <p className="tayza-intro">Unhas bem feitas não são apenas um detalhe,<br className="hidden sm:block" /> são parte da sua confiança.</p>
</div>
          <div className="tayza-hero-visual" aria-label="Alongamento em gel molde F1">
            {heroImages.map((image, index) => (
              <img
                key={image}
                src={image}
                alt={index === 0 ? "Alongamento em gel molde F1 — trabalho do studio Tayza Nails" : "Segundo trabalho de alongamento em gel molde F1 — studio Tayza Nails"}
                className="tayza-f1-slide"
                style={{
                  position: "relative",
                  inset: "auto",
                  gridArea: "1 / 1",
                  width: "auto",
                  height: "auto",
                  maxWidth: "100%",
                  maxHeight: "390px",
                  objectFit: "contain",
                  objectPosition: "center",
                  opacity: heroImageIndex === index ? 1 : 0,
                  transition: "opacity 2000ms ease-in-out",
                  zIndex: heroImageIndex === index ? 2 : 1,
                  pointerEvents: "none",
                }}
                aria-hidden={heroImageIndex !== index}
              />
            ))}
          </div>
        </section>

        <section className="tayza-values" aria-label="Diferenciais do studio">
          <div><span>♢</span><p>Qualidade<br />em cada detalhe</p></div>
          <div><span>♡</span><p>Atendimento<br />personalizado</p></div>
          <div><span>♧</span><p>Higiene e<br />segurança</p></div>
          <div><span>☆</span><p>Beleza que<br />valoriza você</p></div>
        </section>

        {/* Serviços */}
        <section id="servicos" data-flash={flashServices ? "on" : undefined} className="scroll-mt-8 py-16">
          <div className="mb-12 flex items-end justify-between gap-4">
            <h2 className="font-display text-4xl font-semibold tracking-tight sm:text-5xl">
              <span className="text-gold-gradient">Tudo para suas unhas</span>
            </h2>
          </div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-3xl border border-gold/25 bg-surface p-7 backdrop-blur-2xl transition hover:border-gold/50 hover:shadow-gold">
              <span className="grid size-12 place-items-center rounded-2xl bg-gold-gradient text-xl text-primary-foreground shadow-gold">✧</span>
              <h3 className="mt-5 font-display text-3xl text-foreground">Unhas</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                Alongamento em gel, esmaltação em gel e nail art personalizada, com
                brilho de espelho e cutícula impecável.
              </p>
              <p className="mt-4 text-xs font-semibold uppercase tracking-[0.14em] text-gold">A PARTIR DE R$ 50</p>
            </div>
            <div className="rounded-3xl border border-gold/25 bg-surface p-7 backdrop-blur-2xl transition hover:border-gold/50 hover:shadow-gold">
              <span className="grid size-12 place-items-center rounded-2xl bg-gold-gradient text-xl text-primary-foreground shadow-gold">❀</span>
              <h3 className="mt-5 font-display text-3xl text-foreground">Cílios</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                Alongamento fio a fio e volume russo sob medida, com curvatura e
                espessura pensadas para o seu olhar.
              </p>
              <p className="mt-4 text-xs font-semibold uppercase tracking-[0.14em] text-gold">A PARTIR DE R$ 75</p>
            </div>
            <div className="rounded-3xl border border-gold/25 bg-surface p-7 backdrop-blur-2xl transition hover:border-gold/50 hover:shadow-gold">
              <span className="grid size-12 place-items-center rounded-2xl bg-gold-gradient text-xl text-primary-foreground shadow-gold">✦</span>
              <h3 className="mt-5 font-display text-3xl text-foreground">Manutenção</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                Preenchimento, repreenchimento e hidratação no intervalo ideal —
                para o seu resultado durar muito mais.
              </p>
              <p className="mt-4 text-xs font-semibold uppercase tracking-[0.14em] text-gold">A PARTIR DE R$ 55</p>
            </div>
            <div className="rounded-3xl border border-gold/25 bg-surface p-7 backdrop-blur-2xl transition hover:border-gold/50 hover:shadow-gold">
              <span className="grid size-12 place-items-center rounded-2xl bg-gold-gradient text-xl text-primary-foreground shadow-gold">❁</span>
              <h3 className="mt-5 font-display text-3xl text-foreground">Sombrancelha com henna</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                Design de sombrancelha com henna, alinhando formato, preenchimento
                e simetria para um olhar marcado e natural.
              </p>
              <p className="mt-4 text-xs font-semibold uppercase tracking-[0.14em] text-gold">A PARTIR DE R$ 45</p>
            </div>
          </div>
        </section>

        {/* Resultados */}
        <section id="resultados" className="scroll-mt-8 py-16">
          <div className="mb-12 flex items-end justify-between gap-4">
            <h2 className="font-display text-4xl font-semibold tracking-tight sm:text-5xl">
              <span className="text-gold-gradient">Resultados reais</span>
            </h2>
            <span className="hidden text-sm text-muted-foreground sm:block">@tayzaslzr_nails</span>
          </div>

          <div className="mt-10 grid grid-cols-2 gap-4 sm:gap-5 lg:grid-cols-3">
            {[
              { name: "Volume Fio a Fio Efeito Molhado", price: "R$ 145,00", image: galleryLashesCloseup, alt: "Referência visual de extensão de cílios fio a fio efeito molhado" },
              { name: "Volume Mega 6D", price: "R$ 155,00", image: galleryMega6D, alt: "Cílios volume mega 6D, close-up do olhar, trabalho do studio" },
              { name: "Volume Mega Fox Yes", price: "R$ 165,00", image: galleryMegaFoxYes, alt: "Cílios volume mega fox yes, close-up do olhar, trabalho do studio" },
              { name: "Volume Brasileiro", price: "R$ 90,00", image: galleryBrasileiro, alt: "Cílios volume brasileiro, close-up do rosto, trabalho do studio" },
              { name: "Volume Brasileiro Marrom", price: "R$ 85,00", image: galleryBrazilianBrownTayza, alt: "Cílios volume brasileiro marrom, close-up do olhar, trabalho do studio" },
              { name: "Volume 5D", price: "R$ 125,00", image: galleryLashesBrown, alt: "Cílios volume 5D com sobrancelhas desenhadas, close-up do rosto, trabalho do studio" },
            ].map((style) => (
              <article key={style.name} className="group overflow-hidden rounded-2xl border border-gold/35 bg-surface shadow-deep transition duration-300 hover:-translate-y-1 hover:border-gold/70 hover:shadow-gold">
                <div className="relative aspect-[4/5] overflow-hidden">
                  <img src={style.image} alt={style.alt} loading="lazy" className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 via-black/55 to-transparent px-2 pb-3 pt-10 text-center sm:px-4 sm:pb-4">
                    <h3 className="font-display text-base font-semibold italic tracking-wide text-gold-gradient drop-shadow-[0_2px_10px_rgba(212,175,55,0.5)] sm:text-xl">{style.name}</h3>
                    <p className="mx-auto mt-1.5 inline-block rounded-full border border-gold/70 bg-black/70 px-3 py-1 text-xs font-bold tracking-wide text-gold sm:text-sm">{style.price}</p>
                  </div>
                </div>
              </article>
            ))}
          </div>

          <div className="mt-16">
            <div className="mb-8 flex items-center justify-center">
              <h3 className="font-display text-3xl font-semibold tracking-tight text-center sm:text-4xl">
                <span className="text-gold-gradient">Unhas</span>
              </h3>
            </div>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
              {[
                { id: "unhas-1", name: "Banho de Gel", price: "R$ 55,00", image: "/banho%20de%20gel.jpg", alt: "Trabalho de unhas — banho de gel" },
                { id: "unhas-2", name: "Gel na Tips", price: "R$ 100,00", image: "/gel%20na%20tips.jpg", alt: "Trabalho de unhas — gel na tips" },
                { id: "unhas-3", name: "Postiça Realista", price: "R$ 55,00", image: "/postiça%20realista.jpg", alt: "Trabalho de unhas — postiça realista" },
              ].map((item) => (
                <article key={item.id} className="group overflow-hidden rounded-2xl border border-gold/35 bg-surface shadow-deep transition duration-300 hover:-translate-y-1 hover:border-gold/70 hover:shadow-gold">
                  <div className="relative aspect-[4/5] overflow-hidden">
                    <img src={item.image} alt={item.alt} loading="lazy" className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 via-black/55 to-transparent px-4 pb-4 pt-10">
                      <p
                        className="font-display text-xl font-semibold italic tracking-wide text-white drop-shadow-[0_2px_5px_rgba(0,0,0,0.85)]"
                        style={{ WebkitTextStroke: "0.35px rgba(214,175,74,0.9)" }}
                      >
                        {item.name}
                      </p>
                      <p
                        className="mt-1 inline-block rounded-full border border-gold/80 bg-black/55 px-3 py-1 text-sm font-semibold tracking-wide text-gold drop-shadow-[0_1px_3px_rgba(0,0,0,0.9)]"
                        style={{ WebkitTextStroke: "0.2px rgba(255,255,255,0.35)" }}
                      >
                        {item.price}
                      </p>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* Manutenção */}
        <section id="manutencao" className="scroll-mt-8 py-16">
          <div className="grid items-center gap-12 rounded-[2.5rem] border border-gold/25 bg-surface p-10 shadow-deep backdrop-blur-2xl lg:grid-cols-2 lg:p-14">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gold">Cadência de manutenção</p>
              <h2 className="mt-3 font-display text-4xl font-semibold tracking-tight sm:text-5xl">
                <span className="text-gold-gradient">O brilho que dura</span>
              </h2>
              <p className="mt-4 max-w-md leading-relaxed text-muted-foreground">
                Cada serviço tem seu ritmo. Encaixe a manutenção no tempo certo e
                seu resultado nunca perde o acabamento.
              </p>
              <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noreferrer"
                className="mt-7 inline-flex rounded-full bg-gold-gradient px-7 py-3.5 text-sm font-semibold text-primary-foreground shadow-gold transition hover:-translate-y-0.5"
              >
                Agendar manutenção
              </a>
            </div>
            <ul className="divide-y divide-gold/20">
              {[
                { label: "Retoque Design com Henna", cadence: "em 7 em 7 dias" },
                { label: "Manunteção de unhas", cadence: "de 20 a 35 dias" },
                { label: "Manunteção de cílios", cadence: "de 15 a 20 dias" },
              ].map((item) => (
                <li key={item.label} className="flex items-center justify-between gap-4 py-4">
                  <span className="font-medium text-foreground">{item.label}</span>
                  <span className="text-sm text-muted-foreground">{item.cadence}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Agendar */}
        <section id="agendar" className="scroll-mt-8 py-20">
          <div className="flex flex-col items-center rounded-[2.5rem] border border-gold/30 bg-surface p-12 text-center shadow-deep backdrop-blur-2xl">
            <span className="grid size-14 place-items-center rounded-full bg-gold-gradient text-2xl text-primary-foreground shadow-gold">✦</span>
            <h2 className="mt-6 font-display text-5xl italic leading-tight sm:text-6xl">
              <span className="text-gold-gradient">Pronta para brilhar?</span>
            </h2>
            <p className="mt-4 max-w-sm text-muted-foreground">
              Me chama no WhatsApp ou pelo Instagram — respondo em horário de
              atendimento.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noreferrer"
                className="rounded-full bg-gold-gradient px-9 py-4 text-sm font-semibold text-primary-foreground shadow-gold transition hover:-translate-y-0.5"
              >
                Chamar no WhatsApp
              </a>
              <a
                href={INSTAGRAM_URL}
                target="_blank"
                rel="noreferrer"
                className="rounded-full border border-gold/40 px-9 py-4 text-sm font-semibold text-gold transition hover:border-gold hover:shadow-gold"
              >
                @tayzaslzr_nails
              </a>
            </div>
          </div>
        </section>

        {/* Pagamento */}
        <section id="pagamento" className="scroll-mt-8 py-16">
          <div className="rounded-[2.5rem] border border-gold/30 bg-surface p-10 text-center shadow-deep backdrop-blur-2xl sm:p-14">
            <span className="grid size-14 mx-auto place-items-center rounded-full bg-gold-gradient text-2xl text-primary-foreground shadow-gold">💳</span>
            <h2 className="mt-5 font-display text-4xl font-semibold sm:text-5xl">
              <span className="text-gold-gradient">Formas de pagamento</span>
            </h2>
            <p className="mt-3 text-muted-foreground">Aceitamos cartão, Pix e dinheiro em espécie.</p>
            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              <div className="rounded-2xl border border-gold/20 bg-background/40 p-5">
                <p className="text-2xl">💳</p>
                <p className="mt-2 font-semibold text-foreground">Cartão</p>
              </div>
              <div className="rounded-2xl border border-gold/20 bg-background/40 p-5">
                <p className="text-2xl">📱</p>
                <p className="mt-2 font-semibold text-foreground">Pix</p>
              </div>
              <div className="rounded-2xl border border-gold/20 bg-background/40 p-5">
                <p className="text-2xl">💵</p>
                <p className="mt-2 font-semibold text-foreground">Dinheiro em espécie</p>
              </div>
            </div>
            <p className="mt-8 border-t border-gold/20 pt-6 font-display text-2xl italic text-gold-gradient sm:text-3xl">
              “Tudo é possível com Deus.”
            </p>
          </div>
        </section>

        {/* Footer */}
        <footer className="flex flex-col items-center justify-between gap-3 border-t border-gold/20 py-8 text-sm text-muted-foreground sm:flex-row">
          <span className="font-display text-xl font-semibold italic text-gold-gradient">tayzaslzr_nails ✨</span>
          <span>Unhas · Cílios · Manutenção</span>
        </footer>
      </div>
      </div>
    </>
  );
}
