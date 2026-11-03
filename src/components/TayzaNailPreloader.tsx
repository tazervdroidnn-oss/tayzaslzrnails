import { useEffect, useRef, useState } from "react";

/**
 * Nail-themed adaptation of the cinematic counter/curtain preloader.
 * The site's existing TanStack hero stays intact; animation uses the bundled GSAP core.
 */
export default function TayzaNailPreloader() {
  const loaderRef = useRef<HTMLDivElement>(null);
  const counterRef = useRef<HTMLSpanElement>(null);
  const firstPhotoRef = useRef<HTMLImageElement>(null);
  const secondPhotoRef = useRef<HTMLImageElement>(null);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const loader = loaderRef.current;
    const counter = counterRef.current;
    if (!loader || !counter) return;

    const MIN_DURATION = 3600;
    const MAX_WAIT = 9000;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.body.classList.add("tn-is-loading");

    let disposed = false;
    let finished = false;
    let raf = 0;
    let releaseTimer: ReturnType<typeof setTimeout> | undefined;
    let timeout: ReturnType<typeof setTimeout> | undefined;
    let animation: { kill: () => void } | undefined;
    let assetsReady = false;

    const photoReady = (image: HTMLImageElement | null) => new Promise<void>((resolve) => {
      if (!image || image.complete) { resolve(); return; }
      image.addEventListener("load", () => resolve(), { once: true });
      image.addEventListener("error", () => resolve(), { once: true });
    });

    const heroReady = new Promise<void>((resolve) => {
      const image = new Image();
      image.onload = () => resolve();
      image.onerror = () => resolve();
      image.src = "/tayza-unhas.png";
      if (image.complete) resolve();
    });

    const fontsReady = document.fonts
      ? document.fonts.ready.then(() => undefined).catch(() => undefined)
      : Promise.resolve();

    Promise.all([
      heroReady,
      photoReady(firstPhotoRef.current),
      photoReady(secondPhotoRef.current),
      fontsReady,
    ]).then(() => { assetsReady = true; });
    timeout = setTimeout(() => { assetsReady = true; }, MAX_WAIT);

    const gsapReady = import("gsap").then(({ gsap }) => {
      if (disposed) return null;
      const hero = document.querySelector<HTMLElement>(".tn-cover");
      const items = document.querySelectorAll<HTMLElement>(".tn-header .tn-nav-link, .tn-header .tn-header-book");
      if (!reduceMotion) {
        if (hero) gsap.set(hero, { yPercent: 9, scale: 1.025, transformOrigin: "50% 80%" });
        if (items.length) gsap.set(items, { y: 20, autoAlpha: 0 });
      }
      return gsap;
    }).catch(() => null);

    const finish = () => {
      if (disposed) return;
      document.body.style.overflow = previousOverflow;
      document.body.classList.remove("tn-is-loading");
      setVisible(false);
    };

    const reveal = async () => {
      if (disposed || finished) return;
      finished = true;
      const gsap = await gsapReady;
      if (disposed) return;

      const hero = document.querySelector<HTMLElement>(".tn-cover");
      const items = document.querySelectorAll<HTMLElement>(".tn-header .tn-nav-link, .tn-header .tn-header-book");

      if (!gsap) {
        loader.classList.add("tn-pl-fallback-out");
        releaseTimer = setTimeout(finish, 400);
        return;
      }

      const timeline = gsap.timeline({
        defaults: { ease: "power4.out" },
        onComplete: () => {
          if (hero) gsap.set(hero, { clearProps: "transform" });
          if (items.length) gsap.set(items, { clearProps: "transform,opacity,visibility" });
          finish();
        },
      });
      animation = timeline;

      if (reduceMotion) {
        timeline.to(loader, { autoAlpha: 0, duration: 0.4 })
          .set([hero, ...items].filter(Boolean), { clearProps: "all" });
        return;
      }

      timeline
        .to(loader.querySelector(".tn-pl-counter"), {
          yPercent: -40, autoAlpha: 0, duration: 0.5, ease: "power2.in",
        })
        .to(loader, { yPercent: -100, duration: 1.15, ease: "power4.inOut" }, "-=0.15")
        .to(loader.querySelector(".tn-pl-stage"), { yPercent: 35, duration: 1.15, ease: "power4.inOut" }, "<");
      if (hero) timeline.to(hero, { yPercent: 0, scale: 1, duration: 1.6 }, "<0.25");
      if (items.length) timeline.to(items, {
        y: 0, autoAlpha: 1, duration: 0.8, stagger: 0.06,
      }, "-=0.95");
    };

    const easeInOut = (t: number) => t < 0.5
      ? 4 * t * t * t
      : 1 - Math.pow(-2 * t + 2, 3) / 2;
    const start = performance.now();
    let current = 0;

    const frame = (now: number) => {
      if (disposed) return;
      const elapsed = now - start;
      const t = Math.min(elapsed / MIN_DURATION, 1);
      let target = easeInOut(t) * 100;
      if (!assetsReady) target = Math.min(target, 92);
      current += (target - current) * 0.14;
      if (target === 100 && 100 - current < 0.4) current = 100;
      counter.textContent = String(Math.floor(current));
      if (current < 100) raf = requestAnimationFrame(frame);
      else releaseTimer = setTimeout(() => { void reveal(); }, 250);
    };
    raf = requestAnimationFrame(frame);

    return () => {
      disposed = true;
      cancelAnimationFrame(raf);
      if (timeout) clearTimeout(timeout);
      if (releaseTimer) clearTimeout(releaseTimer);
      animation?.kill();
      document.body.style.overflow = previousOverflow;
      document.body.classList.remove("tn-is-loading");
    };
  }, []);

  if (!visible) return null;

  return (
    <div className="tn-pl" ref={loaderRef} aria-hidden="true">
      <div className="tn-pl-stage">
        <div className="tn-pl-photo-collection">
          <img
            className="tn-pl-photo tn-pl-photo--first"
            src="/gel%20na%20tips.jpg"
            alt=""
            ref={firstPhotoRef}
            loading="eager"
            fetchPriority="high"
            decoding="async"
          />
          <img
            className="tn-pl-photo tn-pl-photo--second"
            src="/alongamento2.jpeg"
            alt=""
            ref={secondPhotoRef}
            loading="eager"
            decoding="async"
          />
        </div>
      </div>
      <span className="tn-pl-brand">TAYZA NAILS <small>STUDIO</small></span>
      <div className="tn-pl-counter">
        <span className="tn-pl-num" ref={counterRef}>0</span>
        <span className="tn-pl-pct">%</span>
      </div>
    </div>
  );
}
