import { useEffect, useState } from "react";

export const INTRO_SESSION_KEY = "tayza-intro-v2";
const INTRO_DURATION = 4200;

/**
 * Entrada cinematográfica em 3D feita só com CSS (perspectiva, translateZ e rotateX).
 * A sequência inteira vive em styles.css, então a página nunca fica presa atrás da
 * abertura, mesmo sem JavaScript. Este componente só cuida do botão "Pular", da
 * memória da sessão e de liberar a rolagem.
 */
export default function TayzaIntro({ images }: { images: string[] }) {
  const [mounted, setMounted] = useState(true);

  useEffect(() => {
    const root = document.documentElement;
    if (root.classList.contains("tn-skip-intro")) {
      setMounted(false);
      return;
    }
    try { sessionStorage.setItem(INTRO_SESSION_KEY, "1"); } catch { /* armazenamento bloqueado */ }
    root.classList.add("tn-intro-active");
    const timer = window.setTimeout(() => {
      root.classList.remove("tn-intro-active");
      setMounted(false);
    }, INTRO_DURATION);
    return () => {
      window.clearTimeout(timer);
      root.classList.remove("tn-intro-active");
    };
  }, []);

  function skip() {
    const root = document.documentElement;
    root.classList.add("tn-skip-intro");
    root.classList.remove("tn-intro-active");
    setMounted(false);
  }

  if (!mounted) return null;

  const cards = images.slice(0, 3);

  return (
    <div className="tn-intro">
      <div className="tn-intro-curtain tn-intro-curtain--top" aria-hidden="true" />
      <div className="tn-intro-curtain tn-intro-curtain--bottom" aria-hidden="true" />
      <div className="tn-intro-stage" aria-hidden="true">
        <div className="tn-intro-camera">
          {cards.map((src, index) => (
            <div className={"tn-intro-card tn-intro-card--" + (index + 1)} key={src + index}>
              <img src={src} alt="" decoding="async" />
            </div>
          ))}
          <div className="tn-intro-word">
            {Array.from("Tayza").map((letter, index) => (
              <span key={index} style={{ animationDelay: 0.55 + index * 0.11 + "s" }}>{letter}</span>
            ))}
          </div>
          <span className="tn-intro-rule" />
          <p className="tn-intro-sub">Nails · Lashes · Brows</p>
        </div>
      </div>
      <button type="button" className="tn-intro-skip" onClick={skip}>
        Pular abertura
      </button>
    </div>
  );
}
