import { useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import heroTayzaAsset from "@/assets/hero-tayza.jpg.asset.json";
import galleryNailsAsset from "@/assets/gallery-brown-gold.jpeg.asset.json";
import galleryLashesCloseupAsset from "@/assets/gallery-lashes-closeup.jpg.asset.json";
const galleryLashesCloseup = galleryLashesCloseupAsset.url;
import galleryLashesTayzaAsset from "@/assets/gallery-lashes-tayza.jpg.asset.json";
import galleryLashesBrownAsset from "@/assets/gallery-lashes-brown.jpg.asset.json";
import galleryBrazilianBrownTayzaAsset from "@/assets/gallery-brazilian-brown-tayza.jpg.asset.json";

const heroTayza = heroTayzaAsset.url;
const galleryNails = galleryNailsAsset.url;
const galleryLashesTayza = galleryLashesTayzaAsset.url;
const galleryLashesBrown = galleryLashesBrownAsset.url;
const galleryBrazilianBrownTayza = galleryBrazilianBrownTayzaAsset.url;

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

const WHATSAPP_URL = "https://wa.me/5599991110535";
const INSTAGRAM_URL = "https://instagram.com/tayzaslzr_nails";

function Index() {
  const [flashServices, setFlashServices] = useState(false);

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

      <div className="relative mx-auto max-w-6xl px-5 sm:px-8">
        {/* Nav */}
        <nav className="flex items-center justify-between py-7">
          <a href="/" className="flex items-center gap-2.5">
            <span className="grid size-10 place-items-center rounded-full bg-gold-gradient font-display text-xl font-semibold text-primary-foreground shadow-gold">
              ✦
            </span>
            <span className="relative inline-block border-b-2 border-gold/80 pb-1 font-[cursive] text-2xl font-semibold italic tracking-wide text-gold-gradient drop-shadow-[0_2px_14px_rgba(212,175,55,0.6)] sm:text-3xl">tayzaslzr_nails<span aria-hidden="true" className="absolute -right-2 -top-7 z-20 block text-2xl not-italic leading-none drop-shadow-[0_2px_9px_rgba(212,175,55,0.65)]">💅</span><span aria-hidden="true" className="absolute -bottom-[5px] left-1/2 h-px w-3/4 -translate-x-1/2 bg-gold-gradient shadow-gold" /></span>
          </a>
          <div className="hidden items-center gap-8 text-sm font-medium text-muted-foreground md:flex">
            <a href="#servicos" className="transition hover:text-gold">Serviços</a>
            <a href="#resultados" className="transition hover:text-gold">Resultados</a>
            <a href="#manutencao" className="transition hover:text-gold">Manutenção</a>
          </div>
          <a
            href="#agendar"
            className="rounded-full border border-gold/40 bg-surface px-5 py-2 text-sm font-semibold text-gold backdrop-blur-xl transition hover:border-gold hover:shadow-gold"
          >
            Agendar
          </a>
        </nav>

        {/* Hero */}
        <section className="grid items-center gap-14 py-14 lg:grid-cols-[1.05fr_.95fr] lg:py-20">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-gold/30 bg-surface px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-gold backdrop-blur-xl">
              UNHAS · CÍLIOS · SOMBRACELHAS · MANUTENÇÃO
            </span>
            <h1 className="mt-7 font-display text-6xl leading-[0.88] tracking-[-0.035em] sm:text-7xl lg:text-[6.5rem]">
              <span className="relative inline-block text-gold-gradient font-semibold italic drop-shadow-[0_4px_22px_rgba(0,0,0,0.32)]">
                A arte de
                <br />
                <span className="not-italic">cuidar de você</span>
                <span aria-hidden="true" className="absolute -bottom-3 left-1/2 h-1 w-28 -translate-x-1/2 rounded-full bg-gold-gradient shadow-gold" />
              </span>
            </h1>
            <p className="mt-6 max-w-md text-lg leading-relaxed text-muted-foreground">
              Alongamento, volume russo e manutenção no ritmo certo — um ritual de
              beleza feito com técnica, delicadeza e acabamento impecável.
            </p>
            <div className="mt-9 flex flex-wrap gap-4">
              <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noreferrer"
                className="rounded-full bg-gold-gradient px-7 py-3.5 text-sm font-semibold text-primary-foreground shadow-gold transition hover:-translate-y-0.5"
              >
                Agendar horário
              </a>
              <a
                href="#servicos"
                className="rounded-full border border-gold/40 bg-surface px-7 py-3.5 text-sm font-semibold text-gold backdrop-blur-xl transition hover:border-gold"
              >
                Ver serviços
              </a>
            </div>
            <div className="mt-12 flex divide-x divide-gold/25">
              <div className="pr-7">
                <p className="font-display text-4xl text-gold">1.2k</p>
                <p className="mt-1 text-xs uppercase tracking-[0.14em] text-muted-foreground">Clientes felizes</p>
              </div>
              <div className="px-7">
                <p className="font-display text-4xl text-gold">4,9</p>
                <p className="mt-1 text-xs uppercase tracking-[0.14em] text-muted-foreground">Avaliação</p>
              </div>
              <div className="pl-7">
                <p className="font-display text-4xl text-gold">3+</p>
                <p className="mt-1 text-xs uppercase tracking-[0.14em] text-muted-foreground">Anos de arte</p>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="relative z-10 overflow-hidden rounded-[2.5rem] border border-gold/30 shadow-deep">
              <img
                src={heroTayza}
                alt="Unhas em gel nude com nail art dourada, trabalho do studio"
                className="aspect-[4/5] w-full object-cover"
                width={1024}
                height={1024}
              />
            </div>
            <div className="absolute -left-4 top-10 z-20 w-52 rounded-2xl border border-gold/30 bg-surface p-4 shadow-deep backdrop-blur-2xl sm:-left-8">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-gold">Agora no studio</p>
              <p className="mt-2 font-display text-2xl font-bold leading-tight text-gold-gradient">Alongamento em gel molde f1</p>
              <p className="mt-1 text-sm text-muted-foreground">R$ 100 · 2h</p>
            </div>
            <div className="absolute -right-2 bottom-8 z-20 flex items-center gap-3 rounded-2xl border border-gold/30 bg-surface px-4 py-3 shadow-deep backdrop-blur-2xl sm:-right-6">
              <span className="grid size-9 place-items-center rounded-full bg-gold-gradient text-primary-foreground">✦</span>
              <div>
                <p className="text-sm font-semibold text-foreground">Horário livre hoje</p>
                <p className="text-xs text-muted-foreground">14:30 · 16:00</p>
              </div>
            </div>
          </div>
        </section>

        {/* Serviços */}
        <section id="servicos" data-flash={flashServices ? "on" : undefined} className="scroll-mt-8 py-16">
          <div className="mb-12 flex items-end justify-between gap-4">
            <h2 className="font-display text-4xl font-semibold tracking-tight sm:text-5xl">
              <span className="text-gold-gradient">O que o studio faz</span>
            </h2>
            <span className="hidden text-sm text-muted-foreground sm:block">4 serviços</span>
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
              { name: "Volume 6D", price: "R$ 145,00", image: galleryLashesCloseup, alt: "Referência visual de extensão de cílios volume 6D" },
              { name: "Volume Mega 6D", price: "R$ 155,00", image: galleryLashesTayza, alt: "Referência visual de extensão de cílios volume mega 6D" },
              { name: "Volume Fox Yes", price: "R$ 150,00", image: galleryLashesBrown, alt: "Referência visual de extensão de cílios Fox Yes" },
              { name: "Volume Mega Fox Yes", price: "R$ 165,00", image: "/img_0978_original-3d3ce70083377f7f7817519383757048-480-0.jpeg", alt: "Referência visual de extensão de cílios mega Fox Yes" },
              { name: "Volume Brasileiro", price: "R$ 90,00", image: galleryLashesTayza, alt: "Referência visual de extensão de cílios volume brasileiro" },
              { name: "Volume Brasileiro Marrom", price: "R$ 85,00", image: galleryBrazilianBrownTayza, alt: "Cílios volume brasileiro marrom, close-up do olhar, trabalho do studio" },
              { name: "Volume Mega Brasileiro", price: "R$ 100,00", image: galleryLashesCloseup, alt: "Referência visual de extensão de cílios mega brasileiro" },
              { name: "Volume 5D", price: "R$ 125,00", image: galleryLashesTayza, alt: "Referência visual de extensão de cílios volume 5D" },
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
