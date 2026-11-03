(() => {
  const loader  = document.getElementById("loader");
  const first   = document.getElementById("loaderImage");
  const second  = document.getElementById("loaderImage2");
  const countEl = document.getElementById("count");
  const heroImg = document.getElementById("heroImg");
  const clockEl = document.getElementById("clock");
  const MIN_DURATION = 3600;
  const MAX_WAIT = 9000;
  const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;

  const tick = () => {
    clockEl.textContent = new Date().toLocaleTimeString("pt-BR", {
      hour: "2-digit", minute: "2-digit"
    });
  };
  tick();
  setInterval(tick, 15000);

  const items = gsap.utils.toArray(".r-item");
  gsap.set(".line__inner", { yPercent: 110 });
  gsap.set(items, { y: 24, autoAlpha: 0 });
  gsap.set(".hero__img", { yPercent: 14, scale: 1.1, transformOrigin: "50% 100%" });

  const imageReady = (img) => new Promise((res) => {
    if (img.complete) return res();
    img.addEventListener("load", res, { once: true });
    img.addEventListener("error", res, { once: true });
  });
  const fontsReady = document.fonts ? document.fonts.ready : Promise.resolve();
  const timeout = new Promise((res) => setTimeout(res, MAX_WAIT));

  let assetsReady = false;
  Promise.race([Promise.all([
    imageReady(heroImg), imageReady(first), imageReady(second), fontsReady
  ]), timeout]).then(() => { assetsReady = true; });

  const easeInOut = (t) => t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  const start = performance.now();
  let current = 0;

  function frame(now) {
    const t = Math.min((now - start) / MIN_DURATION, 1);
    let target = easeInOut(t) * 100;
    if (!assetsReady) target = Math.min(target, 92);
    current += (target - current) * .14;
    if (target === 100 && 100 - current < .4) current = 100;
    countEl.textContent = Math.floor(current);
    if (current < 100) requestAnimationFrame(frame);
    else setTimeout(reveal, 250);
  }
  requestAnimationFrame(frame);

  function reveal() {
    const tl = gsap.timeline({
      defaults: { ease: "power4.out" },
      onComplete: () => {
        loader.remove();
        document.body.classList.remove("is-loading");
        document.body.style.overflow = "auto";
      }
    });
    if (reduceMotion) {
      tl.to(loader, { autoAlpha: 0, duration: .4 })
        .set([".line__inner", ...items, ".hero__img"], { clearProps: "all" });
      return;
    }
    tl.to(".loader__counter", { yPercent: -40, autoAlpha: 0, duration: .5, ease: "power2.in" })
      .to(loader, { yPercent: -100, duration: 1.15, ease: "power4.inOut" }, "-=.15")
      .to(".loader__stage", { yPercent: 35, duration: 1.15, ease: "power4.inOut" }, "<")
      .to(".hero__img", { yPercent: 0, scale: 1, duration: 1.6 }, "<.25")
      .to(".line__inner", { yPercent: 0, duration: 1.1, stagger: .12 }, "-=1.1")
      .to(items, { y: 0, autoAlpha: 1, duration: .8, stagger: .06 }, "-=.95");
  }
})();
