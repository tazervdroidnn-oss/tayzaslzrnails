import { useEffect, useRef, useState } from "react";
import { X } from "lucide-react";

const HIDE_KEY = "tayza-guide-hidden";
const SECTIONS = ["inicio", "sobre", "vitrine", "portfolio", "agenda", "dicas", "perfil"];

const messages: Record<string, string> = {
  inicio: "Oi, eu sou a Tayza! Vem que eu te mostro o studio.",
  sobre: "Oi, eu sou a Tayza! Aqui cada detalhe é feito com capricho.",
  "vitrine:cilios": "Na dúvida entre os volumes? Me chama que eu te ajudo a escolher o ideal para o seu olhar.",
  "vitrine:sobrancelhas": "A henna preenche falhas e deixa o desenho marcado por mais tempo.",
  "vitrine:unhas": "Unha fraca? A blindagem protege a unha natural e deixa mais resistente.",
  vitrine: "Toque nos serviços para montar seu atendimento.",
  portfolio: "Arraste para o lado. Toque em Cílios ou Unhas para ver cada técnica.",
  agenda: "Toque em um dia livre que eu já preparo sua mensagem.",
  dicas: "Cuidar em casa faz o resultado durar muito mais!",
  perfil: "Prazer! Me segue no Instagram para ver as novidades.",
};

/** Personagem guia: acompanha as seções e dá dicas em um balão de fala. */
export default function TayzaGuide({ suppressed, category }: { suppressed: boolean; category: string }) {
  const [hidden, setHidden] = useState(false);
  const [section, setSection] = useState("inicio");
  const [talking, setTalking] = useState(false);
  const [ready, setReady] = useState(false);
  const readyRef = useRef(false);
  const hideTimer = useRef<number | null>(null);

  const key = section === "vitrine" && messages["vitrine:" + category] ? "vitrine:" + category : section;

  useEffect(() => {
    try { if (sessionStorage.getItem(HIDE_KEY) === "1") setHidden(true); } catch { /* ignora */ }
  }, []);

  useEffect(() => {
    if (hidden) return;
    const targets = SECTIONS.map((id) => document.getElementById(id)).filter(Boolean) as HTMLElement[];
    if (!targets.length || !("IntersectionObserver" in window)) return;
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) setSection(entry.target.id);
      });
    }, { rootMargin: "-45% 0px -50% 0px" });
    targets.forEach((target) => observer.observe(target));
    return () => observer.disconnect();
  }, [hidden]);

  // Each new section (or price category) makes her speak for a few seconds.
  useEffect(() => {
    if (hidden) return;
    const firstDelay = document.documentElement.classList.contains("tn-skip-intro") ? 900 : 3600;
    const delay = readyRef.current ? 250 : firstDelay;
    const show = window.setTimeout(() => {
      readyRef.current = true;
      setReady(true);
      setTalking(true);
    }, delay);
    if (hideTimer.current) window.clearTimeout(hideTimer.current);
    hideTimer.current = window.setTimeout(() => setTalking(false), delay + 5600);
    return () => window.clearTimeout(show);
  }, [key, hidden]);

  useEffect(() => () => { if (hideTimer.current) window.clearTimeout(hideTimer.current); }, []);

  if (hidden) return null;

  const className = "tn-guide"
    + (ready ? " is-ready" : "")
    + (suppressed ? " is-suppressed" : "")
    + (talking ? "" : " is-quiet")
    + (section === "inicio" ? " is-hero" : "");

  return (
    <aside className={className} aria-label="Assistente do site">
      <div className={"tn-guide-bubble" + (talking ? " is-open" : "")} role="status" aria-live="polite">
        <span className="tn-guide-label">{key.startsWith("vitrine:") || key === "dicas" ? "Dica da Tayza" : "Tayza"}</span>
        <p key={key}>{messages[key] ?? messages.inicio}</p>
        <button
          type="button"
          className="tn-guide-close"
          aria-label="Esconder assistente"
          onClick={() => {
            try { sessionStorage.setItem(HIDE_KEY, "1"); } catch { /* ignora */ }
            setHidden(true);
          }}
        ><X size={12} /></button>
      </div>
      <button type="button" className="tn-guide-figure" aria-label="Ouvir a dica da assistente" onClick={() => setTalking((value) => !value)}>
        <picture>
          <source srcSet="/media/tayza-guide.webp" type="image/webp" />
          <img src="/media/tayza-guide.png" alt="" width={150} height={280} loading="lazy" decoding="async" />
        </picture>
      </button>
    </aside>
  );
}
