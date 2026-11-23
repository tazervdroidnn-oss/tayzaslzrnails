import { useEffect, useState } from "react";

export const INTRO_SESSION_KEY = "tayza-intro-v2";
const INTRO_DURATION = 3000;

/**
 * A abertura 3D acontece no próprio topo do site (styles.css): as fotos voam em
 * profundidade e o nome "Tayza Nails" se monta no lugar onde fica. Nada é trocado
 * no final, então não há salto de imagem. Este componente só trava a rolagem
 * durante a abertura, lembra que ela já foi vista e oferece o botão "Pular".
 */
export default function TayzaIntro() {
  const [active, setActive] = useState(false);

  useEffect(() => {
    const root = document.documentElement;
    if (root.classList.contains("tn-skip-intro")) return;
    try { sessionStorage.setItem(INTRO_SESSION_KEY, "1"); } catch { /* armazenamento bloqueado */ }
    root.classList.add("tn-intro-active");
    setActive(true);
    const timer = window.setTimeout(() => {
      root.classList.remove("tn-intro-active");
      setActive(false);
    }, INTRO_DURATION);
    return () => {
      window.clearTimeout(timer);
      root.classList.remove("tn-intro-active");
    };
  }, []);

  if (!active) return null;

  return (
    <button
      type="button"
      className="tn-intro-skip"
      onClick={() => {
        const root = document.documentElement;
        root.classList.add("tn-skip-intro");
        root.classList.remove("tn-intro-active");
        setActive(false);
      }}
    >
      Pular abertura
    </button>
  );
}
