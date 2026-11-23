/**
 * Decorative Christmas set for the opening scene, drawn in SVG (no image files):
 * satin waves with gold edges, a ribbon bow, swinging ornaments and the Santa hat.
 * Everything here is aria-hidden and purely visual.
 */

export function SantaHat({ className = "" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 72 60" aria-hidden="true">
      <defs>
        <linearGradient id="tn-hat-red" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#f0504f" />
          <stop offset=".55" stopColor="#c81f2c" />
          <stop offset="1" stopColor="#7d0d17" />
        </linearGradient>
        <radialGradient id="tn-hat-fur" cx=".4" cy=".3" r=".8">
          <stop offset="0" stopColor="#ffffff" />
          <stop offset="1" stopColor="#e6dfd8" />
        </radialGradient>
      </defs>
      <path d="M12 46 C 15 26, 30 8, 50 8 C 60 8, 66 16, 63 27 C 58 20, 50 21, 47 30 L 45 46 Z" fill="url(#tn-hat-red)" />
      <path d="M22 40 C 26 26, 36 15, 50 12" fill="none" stroke="#ff8a86" strokeOpacity=".35" strokeWidth="2" strokeLinecap="round" />
      <rect x="5" y="40" width="48" height="14" rx="7" fill="url(#tn-hat-fur)" />
      <path d="M10 47 h38" stroke="#d9d0c7" strokeWidth="1" strokeDasharray="2 3" strokeLinecap="round" />
      <circle cx="63" cy="30" r="7.5" fill="url(#tn-hat-fur)" />
      <circle cx="61" cy="28" r="2.2" fill="#fff" />
    </svg>
  );
}

function Ornament({ className, color }: { className: string; color: "red" | "gold" }) {
  const id = "tn-orn-" + color;
  return (
    <svg className={className} viewBox="0 0 100 240" aria-hidden="true">
      <defs>
        <radialGradient id={id} cx=".35" cy=".32" r=".75">
          {color === "red" ? (
            <>
              <stop offset="0" stopColor="#ff6f7c" />
              <stop offset=".35" stopColor="#c11d33" />
              <stop offset="1" stopColor="#4d0613" />
            </>
          ) : (
            <>
              <stop offset="0" stopColor="#fff3d4" />
              <stop offset=".35" stopColor="#d8b06a" />
              <stop offset="1" stopColor="#6e4c1c" />
            </>
          )}
        </radialGradient>
        <linearGradient id={id + "-cap"} x1="0" x2="1">
          <stop offset="0" stopColor="#8f6c35" />
          <stop offset=".5" stopColor="#f2dca8" />
          <stop offset="1" stopColor="#8f6c35" />
        </linearGradient>
      </defs>
      <line x1="50" y1="0" x2="50" y2="128" stroke="#c8a56a" strokeOpacity=".7" strokeWidth="1.2" />
      <path d="M44 126 a6 6 0 0 1 12 0" fill="none" stroke="#c8a56a" strokeWidth="2" />
      <rect x="40" y="128" width="20" height="12" rx="2" fill={"url(#" + id + "-cap)"} />
      <circle cx="50" cy="182" r="44" fill={"url(#" + id + ")"} />
      <ellipse cx="36" cy="164" rx="10" ry="6" fill="#fff" fillOpacity=".45" transform="rotate(-35 36 164)" />
      <path d="M12 190 C 30 200, 70 200, 88 190" fill="none" stroke="#f2dca8" strokeOpacity=".35" strokeWidth="1.5" />
    </svg>
  );
}

function Sprig({ className }: { className: string }) {
  const needles = Array.from({ length: 16 }, (_, index) => {
    const t = index / 15;
    const x = 20 + t * 160;
    const y = 120 - t * 70;
    const side = index % 2 ? 1 : -1;
    return <line key={index} x1={x} y1={y} x2={x + 16} y2={y + side * 22} stroke="#1f3b2e" strokeWidth="2.4" strokeLinecap="round" />;
  });
  return (
    <svg className={className} viewBox="0 0 200 140" aria-hidden="true">
      <path d="M20 120 C 70 100, 130 70, 186 48" fill="none" stroke="#2b1a10" strokeWidth="3" strokeLinecap="round" />
      {needles}
    </svg>
  );
}

export default function HeroDecor() {
  return (
    <div className="tn-decor" aria-hidden="true">
      <svg className="tn-silk" viewBox="0 0 1200 900" preserveAspectRatio="xMidYMid slice">
        <defs>
          <linearGradient id="tn-silk-a" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#7a1736" stopOpacity=".75" />
            <stop offset="1" stopColor="#2b0a16" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="tn-silk-b" x1="1" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#8a2153" stopOpacity=".55" />
            <stop offset="1" stopColor="#3a0c1f" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="tn-gold-edge" x1="0" x2="1">
            <stop offset="0" stopColor="#c8a56a" stopOpacity="0" />
            <stop offset=".35" stopColor="#f2dca8" />
            <stop offset=".7" stopColor="#c8a56a" />
            <stop offset="1" stopColor="#c8a56a" stopOpacity="0" />
          </linearGradient>
        </defs>
        <g className="tn-silk-drift tn-silk-drift--a">
          <path d="M760 -40 C 900 120, 1040 60, 1240 210 L 1240 -40 Z" fill="url(#tn-silk-b)" />
          <path d="M760 -40 C 900 120, 1040 60, 1240 210" fill="none" stroke="url(#tn-gold-edge)" strokeWidth="2" />
        </g>
        <g className="tn-silk-drift tn-silk-drift--b">
          <path d="M-60 640 C 220 520, 430 760, 700 610 S 1080 430, 1260 520 L 1260 640 C 1080 560, 900 740, 700 720 S 230 650, -60 780 Z" fill="url(#tn-silk-a)" />
          <path d="M-60 640 C 220 520, 430 760, 700 610 S 1080 430, 1260 520" fill="none" stroke="url(#tn-gold-edge)" strokeWidth="1.6" strokeOpacity=".8" />
        </g>
        <g className="tn-silk-drift tn-silk-drift--c">
          <path className="tn-silk-shine" d="M-60 880 C 260 760, 640 960, 1260 800" fill="none" stroke="url(#tn-gold-edge)" strokeWidth="3" />
          <path d="M-60 900 C 260 790, 640 990, 1260 830" fill="none" stroke="#c8a56a" strokeOpacity=".25" strokeWidth="1" />
        </g>
      </svg>

      <svg className="tn-bow" viewBox="0 0 280 320">
        <defs>
          <linearGradient id="tn-satin" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#b52a4b" />
            <stop offset=".45" stopColor="#7a1430" />
            <stop offset="1" stopColor="#3f0716" />
          </linearGradient>
          <linearGradient id="tn-satin-hi" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#ff9db0" stopOpacity="0" />
            <stop offset=".5" stopColor="#ff9db0" stopOpacity=".45" />
            <stop offset="1" stopColor="#ff9db0" stopOpacity="0" />
          </linearGradient>
        </defs>
        <path d="M-20 70 C 60 90, 90 120, 112 150 L 96 162 C 72 132, 40 112, -20 100 Z" fill="url(#tn-satin)" stroke="#d6b47a" strokeWidth="1.2" />
        <path d="M118 152 C 70 80, 20 60, 18 118 C 16 170, 80 170, 118 152 Z" fill="url(#tn-satin)" stroke="#d6b47a" strokeWidth="1.4" />
        <path d="M122 150 C 170 70, 240 70, 238 128 C 236 184, 160 176, 122 150 Z" fill="url(#tn-satin)" stroke="#d6b47a" strokeWidth="1.4" />
        <path d="M30 110 C 50 90, 80 100, 104 140" fill="none" stroke="url(#tn-satin-hi)" strokeWidth="6" strokeLinecap="round" />
        <path d="M132 140 C 160 100, 210 96, 226 120" fill="none" stroke="url(#tn-satin-hi)" strokeWidth="6" strokeLinecap="round" />
        <path d="M110 160 C 100 210, 70 260, 40 320 L 70 320 C 100 270, 120 220, 126 166 Z" fill="url(#tn-satin)" stroke="#d6b47a" strokeWidth="1.2" />
        <path d="M128 162 C 150 210, 190 250, 236 290 L 214 306 C 172 266, 140 220, 118 168 Z" fill="url(#tn-satin)" stroke="#d6b47a" strokeWidth="1.2" />
        <ellipse cx="120" cy="154" rx="17" ry="14" fill="url(#tn-satin)" stroke="#e8cc91" strokeWidth="1.6" />
        <ellipse cx="115" cy="149" rx="6" ry="3.5" fill="#ffb3c2" fillOpacity=".4" />
      </svg>

      <Sprig className="tn-sprig tn-sprig--right" />
      <Sprig className="tn-sprig tn-sprig--left" />
      <Ornament className="tn-ornament tn-ornament--right" color="red" />
      <Ornament className="tn-ornament tn-ornament--left" color="red" />
      <Ornament className="tn-ornament tn-ornament--gold" color="gold" />
    </div>
  );
}
