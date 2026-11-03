import { useCallback, useEffect, useRef, useState } from "react";
import "./TayzaPreloader.css";

const VIDEO_SRC = "/media/tayza-preloader.mp4";
const SESSION_KEY = "tayza-intro-watched-v1";

/**
 * A static-camera, full-screen cinematic intro.
 * The original 7.93s clip owns all character movement; GSAP only reveals the website.
 */
export default function TayzaPreloader() {
  const [visible, setVisible] = useState(true);
  const [progress, setProgress] = useState(0);
  const overlayRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const finishedRef = useRef(false);
  const playingRef = useRef(false);

  const finish = useCallback(() => {
    if (finishedRef.current) return;
    finishedRef.current = true;
    setProgress(100);
    videoRef.current?.pause();

    const complete = () => {
      try { sessionStorage.setItem(SESSION_KEY, "1"); } catch { /* storage may be blocked */ }
      setVisible(false);
      window.dispatchEvent(new Event("tayza:intro-complete"));
    };

    const overlay = overlayRef.current;
    if (!overlay || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      complete();
      return;
    }

    import("gsap")
      .then(({ gsap }) => {
        if (!overlay.isConnected) { complete(); return; }
        const timeline = gsap.timeline({ onComplete: complete });
        // The camera remains fixed throughout the clip. Only the final page reveal moves.
        timeline.to(overlay, {
          autoAlpha: 0,
          yPercent: -2.5,
          duration: 0.62,
          ease: "power2.inOut",
        });
        // A discreet entrance of the real hero completes the handoff from the character.
        const hero = document.querySelector<HTMLElement>(".tn-cover");
        if (hero) timeline.fromTo(hero,
          { autoAlpha: 0.84, y: 18 },
          { autoAlpha: 1, y: 0, duration: 0.88, ease: "power2.out", clearProps: "opacity,visibility,transform" },
          0.16
        );
      })
      .catch(complete);
  }, []);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let previouslyViewed = false;
    try { previouslyViewed = sessionStorage.getItem(SESSION_KEY) === "1"; } catch { /* no-op */ }
    // ?intro=1 lets clients replay the cinematic opening without clearing session storage.
    const previewIntro = new URLSearchParams(window.location.search).get("intro") === "1";
    if (reduced || (previouslyViewed && !previewIntro)) {
      finishedRef.current = true;
      setVisible(false);
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.documentElement.classList.add("tn-intro-active");

    // Never trap visitors behind a broken download, codec or browser autoplay policy.
    const maxWait = window.setTimeout(finish, 14000);
    const startWait = window.setTimeout(() => {
      if (!playingRef.current && videoRef.current?.readyState !== undefined &&
          videoRef.current.readyState < HTMLMediaElement.HAVE_CURRENT_DATA) finish();
    }, 4500);

    const video = videoRef.current;
    if (video) {
      video.muted = true;
      video.play().catch(finish);
    }

    return () => {
      window.clearTimeout(maxWait);
      window.clearTimeout(startWait);
      document.body.style.overflow = previousOverflow;
      document.documentElement.classList.remove("tn-intro-active");
    };
  }, [finish]);

  if (!visible) return null;

  return (
    <div className="tn-intro" ref={overlayRef} role="status" aria-label="Abrindo o Tayza Nails Studio">
      <video
        ref={videoRef}
        className="tn-intro-video"
        src={VIDEO_SRC}
        muted
        playsInline
        autoPlay
        preload="auto"
        disablePictureInPicture
        onPlaying={() => { playingRef.current = true; }}
        onEnded={finish}
        onError={finish}
        onTimeUpdate={(event) => {
          const element = event.currentTarget;
          if (Number.isFinite(element.duration) && element.duration > 0) {
            setProgress(Math.min(100, (element.currentTime / element.duration) * 100));
          }
        }}
        aria-hidden="true"
      />
      <div className="tn-intro-bottom" aria-hidden="true">
        <span className="tn-intro-brand">TAYZA <span>NAILS STUDIO</span></span>
        <span className="tn-intro-percent">{String(Math.round(progress)).padStart(2, "0")}%</span>
      </div>
      <div className="tn-intro-progress" aria-hidden="true">
        <span style={{ transform: `scaleX(${progress / 100})` }} />
      </div>
      <button type="button" className="tn-intro-skip" onClick={finish} aria-label="Pular introdução">
        Pular introdução <span aria-hidden="true">→</span>
      </button>
    </div>
  );
}
