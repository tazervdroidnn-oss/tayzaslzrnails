import { useEffect, useRef, useState } from "react";
import { X } from "lucide-react";

const HIDE_KEY = "tayza-guide-hidden";

const messages: Record<string, string> = {
  inicio: "Oi, eu sou a Tayza! Vem que eu te mostro o studio.",
  sobre: "Oi, eu sou a Tayza! Aqui cada detalhe é feito com capricho.",
  vitrine: "Toque nos serviços para montar seu atendimento.",
  portfolio: "Arrasta pro lado e vê alguns dos meus trabalhos.",
  info: "Te espero de segunda a sábado, das 8h às 17h30!",
};

/** Personagem guia: acompanha as seções com um balão de fala. */
export default function TayzaGuide({ suppressed }: { suppressed: boolean }) {
  const [hidden, setHidden] = useState(false);
  const [section, setSection] = useState("inicio");
  const [talking, setTalking] = useState(false);
  const [ready, setReady] = useState(false);
  const timer = useRef<number | null>(null);

  useEffect(() => {
    try { if (sessionStorage.getItem(HIDE_KEY) === "1") setHidden(true); } catch { /* ignora */ }
  }, []);

  useEffect(() => {
    if (hidden) return;
    const ids = Object.keys(messages);
    const targets = ids.map((id) => document.getElementById(id)).filter(Boolean) as HTMLElement[];
    if (!targets.length || !("IntersectionObserver" in window)) return;
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) setSection(entry.target.id);
      });
    }, { rootMargin: "-45% 0px -50% 0px" });
    targets.forEach((target) => observer.observe(target));
    return () => observer.disconnect();
  }, [hidden]);

  useEffect(() => {
    if (hidden) return;
    const startDelay = document.documentElement.classList.contains("tn-skip-intro") ? 900 : 3600;
    const delay = ready ? 250 : startDelay;
    const show = window.setTimeout(() => { setReady(true); setTalking(true); }, delay);
    if (timer.current) window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setTalking(false), delay + 5200);
    return () => window.clearTimeout(show);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [section, hidden]);

  if (hidden) return null;

  return (
    <aside className={"tn-guide" + (ready ? " is-ready" : "") + (suppressed ? " is-suppressed" : "") + (talking ? "" : " is-quiet") + (section === "inicio" ? " is-hero" : "")} aria-label="Assistente do site">
      <div className={"tn-guide-bubble" + (talking ? " is-open" : "")} role="status" aria-live="polite">
        <p key={section}>{messages[section] ?? messages.inicio}</p>
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
      <button type="button" className="tn-guide-figure" aria-label="Falar com a assistente" onClick={() => setTalking((value) => !value)}>
        <picture>
          <source srcSet="/media/tayza-guide.webp" type="image/webp" />
          <img src="/media/tayza-guide.png" alt="" width={150} height={280} loading="lazy" decoding="async" />
        </picture>
      </button>
    </aside>
  );
}
