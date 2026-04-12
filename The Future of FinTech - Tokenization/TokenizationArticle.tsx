import { useEffect, useRef } from 'react';
import './tokenization.css';

export default function TokenizationArticle() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    // 1. Reading Progress Bar
    const progressBar = document.getElementById('progress-bar');
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (progressBar) progressBar.style.width = docHeight > 0 ? (scrollTop / docHeight * 100) + '%' : '0%';
    };
    window.addEventListener('scroll', handleScroll, { passive: true });

    // 2. Scroll Reveal
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) entry.target.classList.add('visible');
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });
    document.querySelectorAll('.reveal, .reveal-left').forEach(el => revealObserver.observe(el));

    // 3. Active Side Nav
    const sections = document.querySelectorAll('section[id]');
    const navDots = document.querySelectorAll('.nav-dot');
    const sectionObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute('id');
          navDots.forEach(dot => {
            const active = dot.getAttribute('data-section') === id;
            dot.classList.toggle('active', active);
            const icon = dot.querySelector('.dot-icon');
            if (icon) (icon as HTMLElement).style.color = active ? 'white' : '';
          });
        }
      });
    }, { threshold: 0.4 });
    sections.forEach(s => sectionObserver.observe(s));

    // 4. Animated Stat Counters
    function animateCounter(el: Element) {
      const target   = parseInt(el.getAttribute('data-target') || '0');
      const prefix   = el.getAttribute('data-prefix') || '';
      const suffix   = el.getAttribute('data-suffix') || '';
      const duration = 1800;
      const start    = performance.now();
      function update(now: number) {
        const elapsed  = now - start;
        const progress = Math.min(elapsed / duration, 1);
        const eased    = 1 - Math.pow(1 - progress, 3);
        el.textContent = prefix + Math.floor(eased * target) + suffix;
        if (progress < 1) requestAnimationFrame(update);
        else el.textContent = prefix + target + suffix;
      }
      requestAnimationFrame(update);
    }
    const statsObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.querySelectorAll('[data-target]').forEach(animateCounter);
          statsObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });
    const statsSection = document.getElementById('stats-section');
    if (statsSection) statsObserver.observe(statsSection);

    // 5. Timeline Drag + Wheel Scroll
    const track = document.querySelector('.timeline-track') as HTMLElement | null;
    let isDragging = false, startX = 0, scrollStart = 0;
    let mouseMoveHandler: (e: MouseEvent) => void;
    let mouseUpHandler: () => void;
    if (track) {
      const wheelHandler = (e: WheelEvent) => {
        if (e.deltaY !== 0) { e.preventDefault(); track.scrollLeft += e.deltaY; }
      };
      track.addEventListener('wheel', wheelHandler, { passive: false });
      const mouseDownHandler = (e: MouseEvent) => {
        isDragging = true;
        startX = e.pageX - track.offsetLeft;
        scrollStart = track.scrollLeft;
        track.style.cursor = 'grabbing';
      };
      mouseUpHandler = () => { isDragging = false; track.style.cursor = 'grab'; };
      mouseMoveHandler = (e: MouseEvent) => {
        if (!isDragging) return;
        e.preventDefault();
        const x = e.pageX - track.offsetLeft;
        track.scrollLeft = scrollStart - (x - startX);
      };
      track.addEventListener('mousedown', mouseDownHandler);
      document.addEventListener('mouseup', mouseUpHandler);
      document.addEventListener('mousemove', mouseMoveHandler);
      track.style.cursor = 'grab';
    }

    // 6. Friction Bars
    const frictionObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.querySelectorAll('.friction-bar-fill').forEach(bar => {
            const w = bar.getAttribute('data-width');
            requestAnimationFrame(() => {
              setTimeout(() => { (bar as HTMLElement).style.width = w || '0%'; }, 200);
            });
          });
          frictionObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.3 });
    document.querySelectorAll('#road-ahead').forEach(s => frictionObserver.observe(s));

    // 7. Canvas Network Animation
    const canvas = canvasRef.current;
    let animFrame: number;
    if (canvas) {
      const ctx = canvas.getContext('2d')!;
      let W: number, H: number;
      interface Node { x: number; y: number; vx: number; vy: number; r: number; pulse: number; highlight: boolean; }
      let nodes: Node[];
      const NODE_COUNT = 55;
      const MAX_DIST   = 160;
      const NODE_SPEED = 0.3;

      function resizeCanvas() {
        W = canvas.offsetWidth;
        H = canvas.offsetHeight;
        canvas.width  = W;
        canvas.height = H;
      }
      function createNodes() {
        nodes = Array.from({ length: NODE_COUNT }, () => ({
          x: Math.random() * W,
          y: Math.random() * H,
          vx: (Math.random() - 0.5) * NODE_SPEED,
          vy: (Math.random() - 0.5) * NODE_SPEED,
          r:  1 + Math.random() * 2,
          pulse:     Math.random() * Math.PI * 2,
          highlight: Math.random() < 0.12,
        }));
      }
      function drawNetwork() {
        ctx.clearRect(0, 0, W, H);
        ctx.fillStyle = '#0e0e0e';
        ctx.fillRect(0, 0, W, H);
        for (let i = 0; i < nodes.length; i++) {
          for (let j = i + 1; j < nodes.length; j++) {
            const dx   = nodes[i].x - nodes[j].x;
            const dy   = nodes[i].y - nodes[j].y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < MAX_DIST) {
              const alpha = (1 - dist / MAX_DIST) * 0.25;
              ctx.strokeStyle = `rgba(242,223,210,${alpha})`;
              ctx.lineWidth = 0.5;
              ctx.beginPath();
              ctx.moveTo(nodes[i].x, nodes[i].y);
              ctx.lineTo(nodes[j].x, nodes[j].y);
              ctx.stroke();
            }
          }
        }
        nodes.forEach(node => {
          node.pulse += 0.025;
          const pa = 0.5 + Math.sin(node.pulse) * 0.3;
          if (node.highlight) {
            const grad = ctx.createRadialGradient(node.x, node.y, 0, node.x, node.y, node.r * 6);
            grad.addColorStop(0, `rgba(242,223,210,${pa * 0.4})`);
            grad.addColorStop(1, 'rgba(242,223,210,0)');
            ctx.fillStyle = grad;
            ctx.beginPath();
            ctx.arc(node.x, node.y, node.r * 6, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillStyle = `rgba(242,223,210,${pa})`;
          } else {
            ctx.fillStyle = `rgba(180,170,160,${pa * 0.5})`;
          }
          ctx.beginPath();
          ctx.arc(node.x, node.y, node.r, 0, Math.PI * 2);
          ctx.fill();
          node.x += node.vx; node.y += node.vy;
          if (node.x < -20) node.x = W + 20;
          if (node.x > W + 20) node.x = -20;
          if (node.y < -20) node.y = H + 20;
          if (node.y > H + 20) node.y = -20;
        });
      }
      function animate() { drawNetwork(); animFrame = requestAnimationFrame(animate); }

      resizeCanvas();
      createNodes();
      animate();

      const canvasObserver = new IntersectionObserver(entries => {
        entries.forEach(entry => {
          if (!entry.isIntersecting) cancelAnimationFrame(animFrame);
          else { resizeCanvas(); animate(); }
        });
      });
      canvasObserver.observe(canvas);
    }

    return () => {
      window.removeEventListener('scroll', handleScroll);
      revealObserver.disconnect();
      sectionObserver.disconnect();
      statsObserver.disconnect();
      frictionObserver.disconnect();
      if (animFrame) cancelAnimationFrame(animFrame);
      if (track && mouseMoveHandler && mouseUpHandler) {
        document.removeEventListener('mousemove', mouseMoveHandler);
        document.removeEventListener('mouseup', mouseUpHandler);
      }
    };
  }, []);

  return (
    <div className="bg-[#131313] text-[#e5e2e1] font-sans overflow-x-hidden" style={{ fontFamily: "'Manrope',sans-serif" }}>

      {/* Reading Progress Bar */}
      <div id="progress-bar" />

      {/* NAV */}
      <nav className="fixed top-1 w-full z-50 bg-[#131313]/95 backdrop-blur-sm flex justify-between items-center px-8 py-6 max-w-[1920px] mx-auto" style={{ left: 0, right: 0 }}>
        <div />
        <div className="hidden md:flex items-center gap-10">
          <a className="text-zinc-500 font-sans uppercase text-[12px] tracking-widest hover:text-zinc-300" href="#intro">Theory</a>
          <a className="text-zinc-500 font-sans uppercase text-[12px] tracking-widest hover:text-zinc-300" href="#process">Process</a>
          <a className="text-zinc-500 font-sans uppercase text-[12px] tracking-widest hover:text-zinc-300" href="#assets">Markets</a>
          <a className="text-zinc-500 font-sans uppercase text-[12px] tracking-widest hover:text-zinc-300" href="#road-ahead">Outlook</a>
        </div>
        <div />
      </nav>

      {/* SIDE NAV */}
      <aside className="fixed top-1/2 -translate-y-1/2 z-40 hidden lg:flex flex-col gap-8 bg-transparent pointer-events-none" style={{ left: '10px', width: '20px' }}>
        <a href="#intro" className="nav-dot flex items-center justify-center cursor-pointer no-underline pointer-events-auto" data-section="intro">
          <span className="material-symbols-outlined dot-icon text-white" style={{ fontVariationSettings: "'FILL' 1", fontSize: '14px' }}>radio_button_checked</span>
        </a>
        <a href="#definition" className="nav-dot flex items-center justify-center cursor-pointer no-underline pointer-events-auto" data-section="definition">
          <span className="material-symbols-outlined dot-icon" style={{ fontSize: '14px' }}>token</span>
        </a>
        <a href="#process" className="nav-dot flex items-center justify-center cursor-pointer no-underline pointer-events-auto" data-section="process">
          <span className="material-symbols-outlined dot-icon" style={{ fontSize: '14px' }}>schema</span>
        </a>
        <a href="#assets" className="nav-dot flex items-center justify-center cursor-pointer no-underline pointer-events-auto" data-section="assets">
          <span className="material-symbols-outlined dot-icon" style={{ fontSize: '14px' }}>grid_view</span>
        </a>
        <a href="#milestones" className="nav-dot flex items-center justify-center cursor-pointer no-underline pointer-events-auto" data-section="milestones">
          <span className="material-symbols-outlined dot-icon" style={{ fontSize: '14px' }}>timeline</span>
        </a>
        <a href="#road-ahead" className="nav-dot flex items-center justify-center cursor-pointer no-underline pointer-events-auto" data-section="road-ahead">
          <span className="material-symbols-outlined dot-icon" style={{ fontSize: '14px' }}>rocket_launch</span>
        </a>
      </aside>

      <main className="pt-24">

        {/* ── HERO ── */}
        <section id="intro" className="min-h-screen flex flex-col justify-center px-8 md:px-24 lg:px-48 pb-24 relative">
          <div className="mb-8 reveal">
            <span className="font-sans text-[11px] font-bold tracking-[0.3em] uppercase text-[#f2dfd2]">Editorial Series No. 04</span>
          </div>
          <h1 className="font-serif italic text-7xl md:text-9xl leading-[0.85] tracking-tighter text-white mb-12 max-w-5xl reveal" style={{ fontFamily: "'Newsreader',serif" }}>
            The Architectural<br />Reconfiguration<br /><span className="text-zinc-500">of Capital.</span>
          </h1>
          <div className="flex flex-col md:flex-row items-end justify-between gap-12">
            <div className="reveal reveal-delay-2">
              <p className="font-sans text-sm md:text-base text-zinc-400 max-w-md leading-relaxed mb-6">
                How tokenization is turning analog assets into programmable value rewriting the rules of ownership, settlement, and access for every asset class on earth.
              </p>
              <div className="flex items-center gap-4">
                <span className="font-sans text-[11px] tracking-[0.2em] uppercase text-zinc-400">By</span>
                <span className="font-sans text-[12px] tracking-[0.15em] uppercase text-zinc-400">Mohamad Noor-Chowdhury</span>
                <span className="text-zinc-700">·</span>
                <span className="font-sans text-[11px] tracking-[0.15em] uppercase text-zinc-400">18 min read</span>
              </div>
            </div>
            <div className="flex flex-col items-end reveal reveal-delay-3">
              <span className="font-sans text-[12px] tracking-widest text-zinc-500 uppercase mb-2">Scroll to explore</span>
              <div className="w-px h-24 bg-gradient-to-b from-white to-transparent" />
            </div>
          </div>
          <div className="absolute inset-0 pointer-events-none overflow-hidden" style={{ zIndex: -1 }}>
            <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="hero-grid" width="60" height="60" patternUnits="userSpaceOnUse">
                  <path d="M 60 0 L 0 0 0 60" fill="none" stroke="rgba(255,255,255,0.03)" strokeWidth="1" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#hero-grid)" />
            </svg>
          </div>
        </section>

        {/* ── BLEED Network Canvas ── */}
        <section className="w-full relative overflow-hidden" style={{ height: '640px' }}>
          <canvas ref={canvasRef} id="network-canvas" className="absolute inset-0 w-full h-full" />
          <div className="absolute inset-0 bg-gradient-to-b from-[#131313]/60 via-transparent to-[#131313]/80 pointer-events-none" />
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center px-8">
            <span className="font-sans text-[12px] tracking-[0.35em] uppercase text-white/60 block mb-6">01</span>
            <span className="font-serif italic text-white/60 leading-tight" style={{ fontFamily: "'Newsreader',serif", fontSize: 'clamp(3rem, 8vw, 7rem)' }}>What Is<br />Tokenization</span>
          </div>
          <div className="absolute bottom-12 left-1/2 -translate-x-1/2 text-center pointer-events-none">
            <span className="font-sans text-[11px] tracking-[0.35em] uppercase text-zinc-400">Distributed Ledger Network Visualization</span>
          </div>
        </section>

        {/* ── DEFINITION ── */}
        <section id="definition" className="py-32 px-8 md:px-24 lg:px-48 bg-[#131313]">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
            <div className="lg:col-span-5 pt-12">
              <span className="font-sans text-[12px] tracking-[0.3em] uppercase text-zinc-400 block mb-8 reveal">Definition</span>
              <h2 className="font-serif italic text-4xl text-white leading-tight mb-8 reveal" style={{ fontFamily: "'Newsreader',serif" }}>
                From rigid assets to programmable primitives.
              </h2>
              <p className="font-sans text-base text-zinc-400 leading-relaxed mb-6 reveal reveal-delay-1">
                Tokenization is the process of recording the rights to a real-world asset onto a decentralized blockchain ledger. The result: assets become as fluid, composable, and instantly transferable as digital data. Think of it this way: a $10 million building is like a whole pizza. Most people can't buy a whole pizza. Tokenization cuts it into 10,000 slices. The blockchain is the receipt system that proves, irrefutably, which slices belong to whom.
              </p>
              <p className="font-sans text-base text-zinc-400 leading-relaxed mb-6 reveal reveal-delay-2">
                Unlike cryptocurrency, which creates entirely new asset classes, tokenization brings existing value real estate, bonds, gold, private equity into the on-chain economy. Real estate that once required a $5M minimum becomes accessible at $1,000 per token. Private credit funds closed to all but institutional desks open to algorithmically-compliant global investors.
              </p>
              <p className="font-sans text-base text-zinc-400 leading-relaxed reveal reveal-delay-3">
                This shift is as transformative to money as the move from DVDs to streaming was for television turning static, clunky assets into liquid, programmable digital streams.
              </p>
              <div className="mt-12 border-l-2 border-[#f2dfd2] pl-6 reveal reveal-delay-4">
                <span className="font-sans text-[11px] tracking-[0.25em] uppercase text-zinc-400 block mb-2">The Legal Wrapper</span>
                <p className="font-sans text-sm text-zinc-300 leading-relaxed">The <em>Token</em> is the technical proof of ownership. The <em>Legal Wrapper</em> is the proof recognized by courts. These two must be fused so that a digital transfer is legally binding in the physical world.</p>
              </div>
            </div>

            <div className="lg:col-span-7 flex items-center reveal reveal-delay-3">
              <div className="border-l-2 border-[#f2dfd2] pl-8">
                <span className="font-sans font-bold text-[11px] tracking-widest uppercase text-zinc-400 block mb-3">McKinsey Projection</span>
                <span className="font-serif italic leading-none block mb-4 text-[#f2dfd2]" style={{ fontFamily: "'Newsreader',serif", fontSize: 'clamp(4rem,8vw,7rem)' }}>$2T</span>
                <span className="font-sans text-sm text-zinc-500 leading-relaxed block max-w-xs">Conservative tokenized market estimate by 2030. Upper bound (BCG): $30 trillion.</span>
              </div>
            </div>
          </div>

          {/* 3-Panel Flow Diagram */}
          <div className="mt-20 reveal" style={{ display: 'grid', gridTemplateColumns: '1fr 56px 1fr 56px 1fr', alignItems: 'center', gap: 0 }}>
            {/* Panel 1 */}
            <div className="flex flex-col items-center gap-8 p-12 border border-zinc-800" style={{ background: 'rgba(255,255,255,0.015)' }}>
              <svg viewBox="0 0 200 230" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', maxWidth: '240px', height: 'auto' }}>
                <polygon points="100,30 148,57 100,84 52,57" fill="rgba(242,223,210,0.07)" stroke="rgba(242,223,210,0.35)" strokeWidth="1" />
                <polygon points="100,84 148,57 148,170 100,197" fill="rgba(242,223,210,0.04)" stroke="rgba(242,223,210,0.25)" strokeWidth="1" />
                <polygon points="52,57 100,84 100,197 52,170" fill="rgba(242,223,210,0.02)" stroke="rgba(242,223,210,0.15)" strokeWidth="1" />
                <line x1="52" y1="170" x2="148" y2="170" stroke="rgba(242,223,210,0.12)" strokeWidth="0.5" strokeDasharray="3,3" />
                <circle cx="130" cy="105" r="2" fill="rgba(242,223,210,0.3)" />
                <circle cx="130" cy="120" r="2" fill="rgba(242,223,210,0.3)" />
                <circle cx="130" cy="135" r="2" fill="rgba(242,223,210,0.3)" />
                <circle cx="115" cy="112" r="2" fill="rgba(242,223,210,0.2)" />
                <circle cx="115" cy="127" r="2" fill="rgba(242,223,210,0.2)" />
                <circle cx="70" cy="105" r="2" fill="rgba(242,223,210,0.15)" />
                <circle cx="70" cy="120" r="2" fill="rgba(242,223,210,0.15)" />
                <circle cx="85" cy="112" r="2" fill="rgba(242,223,210,0.1)" />
                <line x1="148" y1="57" x2="162" y2="50" stroke="rgba(242,223,210,0.15)" strokeWidth="0.5" />
                <line x1="148" y1="170" x2="162" y2="163" stroke="rgba(242,223,210,0.15)" strokeWidth="0.5" />
                <line x1="162" y1="50" x2="162" y2="163" stroke="rgba(242,223,210,0.15)" strokeWidth="0.5" />
                <line x1="158" y1="50" x2="166" y2="50" stroke="rgba(242,223,210,0.15)" strokeWidth="0.5" />
                <line x1="158" y1="163" x2="166" y2="163" stroke="rgba(242,223,210,0.15)" strokeWidth="0.5" />
              </svg>
              <div className="text-center">
                <span className="font-sans text-[12px] tracking-[0.25em] uppercase text-zinc-500 block mb-2">Step 01</span>
                <span className="font-serif italic text-2xl text-zinc-200" style={{ fontFamily: "'Newsreader',serif" }}>The Asset</span>
                <p className="font-sans text-sm text-zinc-500 mt-3 leading-relaxed">Real estate, bonds,<br />gold, art, private credit</p>
              </div>
            </div>
            {/* Arrow 1 */}
            <div className="flex items-center justify-center">
              <svg viewBox="0 0 56 24" xmlns="http://www.w3.org/2000/svg" style={{ width: '56px', height: '24px' }}>
                <line x1="4" y1="12" x2="42" y2="12" stroke="rgba(242,223,210,0.25)" strokeWidth="1" />
                <polygon points="52,12 40,7 40,17" fill="rgba(242,223,210,0.25)" />
              </svg>
            </div>
            {/* Panel 2 */}
            <div className="flex flex-col items-center gap-8 p-12 border border-zinc-800" style={{ background: 'rgba(255,255,255,0.015)' }}>
              <svg viewBox="0 0 200 230" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', maxWidth: '240px', height: 'auto' }}>
                <rect x="28" y="95" width="38" height="120" fill="rgba(242,223,210,0.03)" stroke="rgba(242,223,210,0.25)" strokeWidth="1" />
                <rect x="134" y="95" width="38" height="120" fill="rgba(242,223,210,0.03)" stroke="rgba(242,223,210,0.25)" strokeWidth="1" />
                <path d="M28,95 C28,12 172,12 172,95" fill="none" stroke="rgba(242,223,210,0.35)" strokeWidth="1" />
                <path d="M46,95 C46,36 154,36 154,95" fill="none" stroke="rgba(242,223,210,0.15)" strokeWidth="0.75" strokeDasharray="4,3" />
                <circle cx="47" cy="115" r="3" fill="none" stroke="rgba(242,223,210,0.4)" strokeWidth="1" />
                <circle cx="47" cy="135" r="3" fill="none" stroke="rgba(242,223,210,0.3)" strokeWidth="1" />
                <circle cx="47" cy="155" r="3" fill="none" stroke="rgba(242,223,210,0.2)" strokeWidth="1" />
                <line x1="47" y1="118" x2="47" y2="132" stroke="rgba(242,223,210,0.2)" strokeWidth="0.75" />
                <line x1="47" y1="138" x2="47" y2="152" stroke="rgba(242,223,210,0.2)" strokeWidth="0.75" />
                <circle cx="153" cy="115" r="3" fill="none" stroke="rgba(242,223,210,0.4)" strokeWidth="1" />
                <circle cx="153" cy="135" r="3" fill="none" stroke="rgba(242,223,210,0.3)" strokeWidth="1" />
                <circle cx="153" cy="155" r="3" fill="none" stroke="rgba(242,223,210,0.2)" strokeWidth="1" />
                <line x1="153" y1="118" x2="153" y2="132" stroke="rgba(242,223,210,0.2)" strokeWidth="0.75" />
                <line x1="153" y1="138" x2="153" y2="152" stroke="rgba(242,223,210,0.2)" strokeWidth="0.75" />
                <line x1="100" y1="62" x2="100" y2="180" stroke="rgba(242,223,210,0.3)" strokeWidth="1" strokeDasharray="5,4" />
                <polygon points="100,190 95,178 105,178" fill="rgba(242,223,210,0.3)" />
              </svg>
              <div className="text-center">
                <span className="font-sans text-[12px] tracking-[0.25em] uppercase text-zinc-500 block mb-2">Step 02</span>
                <span className="font-serif italic text-2xl text-zinc-200" style={{ fontFamily: "'Newsreader',serif" }}>The Ledger</span>
                <p className="font-sans text-sm text-zinc-500 mt-3 leading-relaxed">Smart contract encodes<br />rights, compliance, yield</p>
              </div>
            </div>
            {/* Arrow 2 */}
            <div className="flex items-center justify-center">
              <svg viewBox="0 0 56 24" xmlns="http://www.w3.org/2000/svg" style={{ width: '56px', height: '24px' }}>
                <line x1="4" y1="12" x2="42" y2="12" stroke="rgba(242,223,210,0.4)" strokeWidth="1" />
                <polygon points="52,12 40,7 40,17" fill="rgba(242,223,210,0.4)" />
              </svg>
            </div>
            {/* Panel 3 */}
            <div className="flex flex-col items-center gap-8 p-12 border border-zinc-800" style={{ background: 'rgba(242,223,210,0.02)' }}>
              <svg viewBox="0 0 200 160" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', maxWidth: '240px', height: 'auto' }}>
                <polygon points="100,51 118,60 100,69 82,60" fill="rgba(242,223,210,0.06)" stroke="rgba(242,223,210,0.2)" strokeWidth="0.5" />
                <polygon points="100,69 118,60 118,78 100,87" fill="rgba(242,223,210,0.04)" stroke="rgba(242,223,210,0.15)" strokeWidth="0.5" />
                <polygon points="82,60 100,69 100,87 82,78" fill="rgba(242,223,210,0.02)" stroke="rgba(242,223,210,0.1)" strokeWidth="0.5" />
                <polygon points="82,60 100,69 82,78 64,69" fill="rgba(242,223,210,0.06)" stroke="rgba(242,223,210,0.2)" strokeWidth="0.5" />
                <polygon points="82,78 100,69 100,87 82,96" fill="rgba(242,223,210,0.04)" stroke="rgba(242,223,210,0.15)" strokeWidth="0.5" />
                <polygon points="64,69 82,78 82,96 64,87" fill="rgba(242,223,210,0.02)" stroke="rgba(242,223,210,0.1)" strokeWidth="0.5" />
                <polygon points="118,60 136,69 118,78 100,69" fill="rgba(242,223,210,0.06)" stroke="rgba(242,223,210,0.2)" strokeWidth="0.5" />
                <polygon points="118,78 136,69 136,87 118,96" fill="rgba(242,223,210,0.04)" stroke="rgba(242,223,210,0.15)" strokeWidth="0.5" />
                <polygon points="100,69 118,78 118,96 100,87" fill="rgba(242,223,210,0.02)" stroke="rgba(242,223,210,0.1)" strokeWidth="0.5" />
                {/* accent */}
                <polygon points="100,69 118,78 100,87 82,78" fill="rgba(242,223,210,0.13)" stroke="rgba(242,223,210,0.45)" strokeWidth="0.75" />
                <polygon points="100,87 118,78 118,96 100,105" fill="rgba(242,223,210,0.08)" stroke="rgba(242,223,210,0.35)" strokeWidth="0.75" />
                <polygon points="82,78 100,87 100,105 82,96" fill="rgba(242,223,210,0.05)" stroke="rgba(242,223,210,0.25)" strokeWidth="0.75" />
                <polygon points="100,87 118,96 100,105 82,96" fill="rgba(242,223,210,0.13)" stroke="rgba(242,223,210,0.45)" strokeWidth="0.75" />
                <polygon points="100,105 118,96 118,114 100,123" fill="rgba(242,223,210,0.08)" stroke="rgba(242,223,210,0.35)" strokeWidth="0.75" />
                <polygon points="82,96 100,105 100,123 82,114" fill="rgba(242,223,210,0.05)" stroke="rgba(242,223,210,0.25)" strokeWidth="0.75" />
                <polygon points="100,105 118,114 100,123 82,114" fill="rgba(242,223,210,0.13)" stroke="rgba(242,223,210,0.45)" strokeWidth="0.75" />
                <polygon points="100,123 118,114 118,132 100,141" fill="rgba(242,223,210,0.08)" stroke="rgba(242,223,210,0.35)" strokeWidth="0.75" />
                <polygon points="82,114 100,123 100,141 82,132" fill="rgba(242,223,210,0.05)" stroke="rgba(242,223,210,0.25)" strokeWidth="0.75" />
              </svg>
              <div className="text-center">
                <span className="font-sans text-[12px] tracking-[0.25em] uppercase text-zinc-500 block mb-2">Step 03</span>
                <span className="font-serif italic text-2xl text-[#f2dfd2]" style={{ fontFamily: "'Newsreader',serif" }}>The Token</span>
                <p className="font-sans text-sm text-zinc-500 mt-3 leading-relaxed">Fractional, liquid,<br />24/7 globally tradeable</p>
              </div>
            </div>
          </div>
        </section>

        {/* ── STATS STRIP ── */}
        <section className="border-t border-b border-zinc-800 bg-[#0e0e0e] py-0" id="stats-section">
          <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-zinc-800">
            <div className="flex flex-col items-center justify-center py-16 px-12 text-center reveal">
              <span className="stat-number text-6xl text-white mb-3" data-target="30" data-prefix="$" data-suffix="T">$0T</span>
              <span className="font-sans text-[12px] tracking-[0.2em] uppercase text-zinc-500 leading-loose">Upper-bound tokenized market<br />projection by 2030</span>
              <span className="font-sans text-[11px] text-zinc-700 mt-3 uppercase tracking-widest">Source: BCG / McKinsey</span>
            </div>
            <div className="flex flex-col items-center justify-center py-16 px-12 text-center reveal reveal-delay-2">
              <span className="stat-number text-6xl text-white mb-3" data-target="85" data-suffix="%">0%</span>
              <span className="font-sans text-[12px] tracking-[0.2em] uppercase text-zinc-500 leading-loose">Reduction in settlement time<br />vs. traditional T+2 systems</span>
              <span className="font-sans text-[11px] text-zinc-700 mt-3 uppercase tracking-widest">Atomic Settlement Standard</span>
            </div>
            <div className="flex flex-col items-center justify-center py-16 px-12 text-center reveal reveal-delay-3">
              <span className="stat-number text-6xl text-white mb-3" data-target="61" data-suffix="%">0%</span>
              <span className="font-sans text-[12px] tracking-[0.2em] uppercase text-zinc-500 leading-loose">Of tokenized asset volume<br />is Private Credit in 2025</span>
              <span className="font-sans text-[11px] text-zinc-700 mt-3 uppercase tracking-widest">Source: RWA.xyz, 2025</span>
            </div>
          </div>
        </section>

        {/* ── COMPARISON TABLE ── */}
        <section className="py-24 px-8 md:px-24 lg:px-48 bg-[#1c1b1b]">
          <div className="mb-16 reveal">
            <span className="font-sans text-[11px] font-bold tracking-[0.3em] uppercase text-zinc-500 block mb-4">Side by Side</span>
            <h2 className="font-serif italic text-4xl text-white" style={{ fontFamily: "'Newsreader',serif" }}>The Old World vs. The Agility of the New</h2>
          </div>
          <div className="border border-zinc-800 reveal">
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', borderBottom: '1px solid #27272a' }}>
              <div className="comp-cell font-sans text-[11px] tracking-[0.2em] uppercase text-zinc-700" />
              <div className="comp-cell font-sans text-[11px] tracking-[0.2em] uppercase text-zinc-500">Legacy Infrastructure</div>
              <div className="comp-cell font-sans text-[11px] tracking-[0.2em] uppercase text-[#f2dfd2]">Tokenized Networks</div>
            </div>
            <div className="comp-row">
              <div className="comp-cell text-zinc-500 font-bold text-[13px] tracking-wider uppercase">Market Hours</div>
              <div className="comp-cell text-zinc-400">Mon–Fri, 9–5. Trading halts on weekends, holidays, and after hours.</div>
              <div className="comp-cell text-[#f2dfd2] font-medium">24/7/365 global availability, no scheduled downtime.</div>
            </div>
            <div className="comp-row">
              <div className="comp-cell text-zinc-500 font-bold text-[13px] tracking-wider uppercase">Settlement Speed</div>
              <div className="comp-cell text-zinc-400">T+2 to T+5 days. Manual reconciliation, custody chains, correspondent banks.</div>
              <div className="comp-cell text-[#f2dfd2] font-medium">Near-instant Atomic Settlement. Payment and asset transfer in one transaction or neither.</div>
            </div>
            <div className="comp-row">
              <div className="comp-cell text-zinc-500 font-bold text-[13px] tracking-wider uppercase">Accessibility</div>
              <div className="comp-cell text-zinc-400">Institutional-only entry points. A $100M PE fund requires a $1M minimum commitment.</div>
              <div className="comp-cell text-[#f2dfd2] font-medium">Democratized & fractional. A $100M asset split into 100,000 tokens at $1,000 each.</div>
            </div>
            <div className="comp-row">
              <div className="comp-cell text-zinc-500 font-bold text-[13px] tracking-wider uppercase">Asset Mobility</div>
              <div className="comp-cell text-zinc-400">Siloed & fragmented. Assets locked in jurisdiction-specific, custodian-specific silos.</div>
              <div className="comp-cell text-[#f2dfd2] font-medium">Composable & interoperable. Use a tokenized gold bar as collateral to borrow a tokenized bond.</div>
            </div>
            <div className="comp-row" style={{ borderBottom: 'none' }}>
              <div className="comp-cell text-zinc-500 font-bold text-[13px] tracking-wider uppercase">Compliance</div>
              <div className="comp-cell text-zinc-400">Manual & audited after the fact. Compliance failures discovered weeks later.</div>
              <div className="comp-cell text-[#f2dfd2] font-medium">Automated via smart contracts. A trade that fails compliance never executes.</div>
            </div>
          </div>
        </section>

        {/* ── PULL QUOTE Larry Fink ── */}
        <section className="py-48 bg-[#1c1b1b]">
          <div className="max-w-5xl mx-auto px-8 text-center">
            <div className="reveal">
              <div className="quote-line" />
              <blockquote className="font-serif italic text-4xl md:text-6xl text-white leading-tight mb-12" style={{ fontFamily: "'Newsreader',serif" }}>
                "I believe the next generation of markets, the next generation of securities, will be <span className="text-[#f2dfd2]">tokenized securities</span>. Every asset can be tokenized."
              </blockquote>
              <cite className="font-sans text-[11px] font-bold tracking-[0.3em] uppercase text-zinc-500">: Larry Fink, CEO, BlackRock</cite>
            </div>
          </div>
        </section>

        {/* ── 5-STAGE PROCESS ── */}
        <section id="process" className="py-32 px-8 md:px-24 lg:px-48 bg-[#131313]">
          <div className="mb-24 flex flex-col items-start reveal">
            <span className="font-sans text-[11px] font-bold tracking-[0.3em] uppercase text-zinc-500 mb-4">Digital Alchemy</span>
            <h2 className="font-serif italic text-5xl text-white max-w-2xl leading-tight" style={{ fontFamily: "'Newsreader',serif" }}>How an Asset Moves from the Physical World to the Digital Ledger</h2>
          </div>

          {/* Stage 01 */}
          <div className="stage-step reveal" style={{ paddingTop: '4rem', paddingBottom: 0, overflow: 'hidden' }}>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pb-8">
              <div className="lg:col-span-2">
                <span className="stage-number text-8xl">01</span>
              </div>
              <div className="lg:col-span-4 flex flex-col justify-center">
                <span className="font-sans text-[11px] tracking-[0.25em] uppercase text-zinc-400 block mb-3">Asset Identification &amp; Selection</span>
                <h3 className="font-serif italic text-2xl text-white mb-4" style={{ fontFamily: "'Newsreader',serif" }}>Choosing What Gets Tokenized</h3>
                <p className="font-sans text-sm text-zinc-500 leading-relaxed">The journey begins in the physical world. While almost anything with definable ownership can be tokenized, four primary classes currently lead the market each solving a specific liquidity or accessibility problem.</p>
              </div>
              <div className="lg:col-span-6 flex flex-col">
                <p className="font-sans text-[11px] tracking-[0.2em] uppercase text-zinc-600 mb-3">Source: RWA.xyz — Tokenized asset volume breakdown, 2025</p>
                <div style={{ display: 'grid', gridTemplateColumns: '61fr 39fr', gap: '2px', flex: 1, minHeight: '220px' }}>
                  <div className="treemap-block flex flex-col justify-end p-6" style={{ background: '#1a2535' }}>
                    <span className="font-serif italic text-5xl text-white/80 mb-2 leading-none" style={{ fontFamily: "'Newsreader',serif" }}>61%</span>
                    <h3 className="font-sans font-bold text-[11px] tracking-wider uppercase text-zinc-300 mb-1">Private Credit</h3>
                    <p className="font-sans text-sm text-zinc-400 leading-snug">The dominant tokenized asset class, utilizing smart contracts for automated yields and dynamic collateral.</p>
                  </div>
                  <div style={{ display: 'grid', gridTemplateRows: '30fr 9fr', gap: '2px' }}>
                    <div className="treemap-block flex flex-col justify-end p-4" style={{ background: '#1e2d1e' }}>
                      <span className="font-serif italic text-3xl text-white/80 mb-1 leading-none" style={{ fontFamily: "'Newsreader',serif" }}>30%</span>
                      <h3 className="font-sans font-bold text-[11px] tracking-wider uppercase text-zinc-300 mb-1">Treasuries</h3>
                      <p className="font-sans text-sm text-zinc-400 leading-snug">Foundational, yield-bearing liquidity primitives in digital markets.</p>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '7fr 2fr', gap: '2px' }}>
                      <div className="treemap-block flex flex-col justify-end p-3" style={{ background: '#2a1f14' }}>
                        <span className="font-serif italic text-lg text-white/80 mb-1 leading-none" style={{ fontFamily: "'Newsreader',serif" }}>7%</span>
                        <h3 className="font-sans font-bold text-[11px] tracking-wider uppercase text-zinc-400 mb-1">Commodities</h3>
                        <p className="font-sans text-[11px] text-zinc-500 leading-snug">Tokenized gold, $6B+ market cap.</p>
                      </div>
                      <div className="treemap-block flex flex-col justify-end p-3" style={{ background: '#242424' }}>
                        <span className="font-serif italic text-base text-white/60 mb-1 leading-none" style={{ fontFamily: "'Newsreader',serif" }}>2%</span>
                        <h3 className="font-sans font-bold text-[10px] tracking-wider uppercase text-zinc-400 mb-1">Funds</h3>
                        <p className="font-sans text-[10px] text-zinc-500 leading-snug">Institutional</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Stage 02 */}
          <div className="stage-step py-16 reveal">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-8">
              <div className="lg:col-span-2">
                <span className="stage-number text-8xl">02</span>
              </div>
              <div className="lg:col-span-4">
                <span className="font-sans text-[11px] tracking-[0.25em] uppercase text-zinc-400 block mb-3">Digital Representation &amp; Compliance</span>
                <h3 className="font-serif italic text-2xl text-white mb-4" style={{ fontFamily: "'Newsreader',serif" }}>Building the Digital Blueprint</h3>
                <p className="font-sans text-sm text-zinc-500 leading-relaxed mb-6">This isn't just an entry on a list. The digital blueprint is sophisticated software that acts as a container for the asset's rights. By integrating ISO-20022 messaging standards, tokens speak the same language as traditional banking systems like SWIFT enabling real-time reconciliation across institutional networks.</p>
                <ul className="space-y-3">
                  <li className="flex gap-3">
                    <span className="text-[#f2dfd2] mt-0.5 flex-shrink-0">·</span>
                    <p className="font-sans text-sm text-zinc-300 leading-relaxed"><span className="text-white font-medium">ISO-20022</span> is the global language banks use to send payment messages. Think of it as a universal translator that lets blockchain tokens talk directly to the world's banking systems.</p>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-[#f2dfd2] mt-0.5 flex-shrink-0">·</span>
                    <p className="font-sans text-sm text-zinc-300 leading-relaxed"><span className="text-white font-medium">SWIFT</span> is the network that moves $8 trillion between banks every day. Tokenized assets that speak ISO-20022 can plug directly into it with no manual reconciliation required.</p>
                  </li>
                </ul>
              </div>
              <div className="lg:col-span-6">
                <div className="space-y-0 border border-zinc-800">
                  {[
                    { label: 'Key Information', text: 'Asset type, issuer identity, and unique on-chain identifiers that distinguish this token from all others.' },
                    { label: 'Embedded Rights', text: 'Voter participation rights, interest payment schedules, dividend distributions encoded directly into the token\'s logic.' },
                    { label: 'Compliance Rules', text: 'Jurisdiction-specific transfer restrictions e.g., accredited investor requirements automatically enforced at the protocol level.' },
                    { label: 'Provenance', text: 'A complete ownership family tree immutable, tamper-proof, and auditable by any party with ledger access.' },
                  ].map((item, i) => (
                    <div key={i} className={`p-5 ${i < 3 ? 'border-b border-zinc-800' : ''} hover:bg-[#2a2a2a] transition-colors cursor-default`}>
                      <span className="font-sans font-bold text-[12px] tracking-wider uppercase text-zinc-400 block mb-1">{item.label}</span>
                      <p className="font-sans text-sm text-zinc-400">{item.text}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Stage 03 */}
          <div className="stage-step py-16 reveal">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-8">
              <div className="lg:col-span-2">
                <span className="stage-number text-8xl">03</span>
              </div>
              <div className="lg:col-span-4">
                <span className="font-sans text-[11px] tracking-[0.25em] uppercase text-zinc-400 block mb-3">The Logic Layer</span>
                <h3 className="font-serif italic text-2xl text-white mb-4" style={{ fontFamily: "'Newsreader',serif" }}>Smart Contracts as Execution Engine</h3>
                <p className="font-sans text-sm text-zinc-500 leading-relaxed">A smart contract is code that runs automatically when conditions are met, removing the friction of manual approval entirely. Think of tokenized assets like apps on a smartphone. They all run on the same operating system, so they can share data, talk to each other, and combine in ways a single app never could alone. Use your tokenized gold to back a loan, earn yield on a tokenized bond, and settle in a stablecoin, all in one transaction.</p>
                <div className="mt-6 border-l-2 border-[#f2dfd2] pl-4">
                  <span className="font-sans text-[11px] tracking-widest uppercase text-zinc-400 block mb-1">Atomic Settlement</span>
                  <p className="font-sans text-sm text-zinc-500">Simultaneous delivery of asset and payment. If the payment isn't there, the asset never moves. Settlement risk: eliminated.</p>
                </div>
              </div>
              <div className="lg:col-span-6">
                <div className="grid grid-cols-1 gap-0.5 bg-zinc-800">
                  {[
                    { icon: 'bolt', title: 'Automation of Dividends', text: 'Rent or interest is distributed automatically to token holders the moment it is received no fund administrator required.' },
                    { icon: 'balance', title: 'Real-Time Reconciliation', text: 'The contract keeps the books balanced every second. No overnight settlement batches, no reconciliation failures at month-end.' },
                    { icon: 'shield', title: 'Compliance Enforcement', text: 'A trade that violates jurisdiction rules or Know Your Customer and Anti-Money Laundering requirements is rejected at the protocol level before it can execute.' },
                  ].map((item, i) => (
                    <div key={i} className="bg-[#131313] p-8 hover:bg-[#1c1b1b] transition-colors cursor-default flex gap-6 items-start">
                      <span className="material-symbols-outlined text-[#f2dfd2]" style={{ fontSize: '24px', flexShrink: 0 }}>{item.icon}</span>
                      <div>
                        <h4 className="font-sans font-bold text-[11px] tracking-wider uppercase text-zinc-300 mb-2">{item.title}</h4>
                        <p className="font-sans text-sm text-zinc-400 leading-relaxed">{item.text}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Stage 04 */}
          <div className="stage-step py-16 reveal">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-8">
              <div className="lg:col-span-2">
                <span className="stage-number text-8xl">04</span>
              </div>
              <div className="lg:col-span-10">
                <span className="font-sans text-[11px] tracking-[0.25em] uppercase text-zinc-400 block mb-3">Immobilization &amp; Asset Locking</span>
                <h3 className="font-serif italic text-2xl text-white mb-6" style={{ fontFamily: "'Newsreader',serif" }}>Solving the Double-Spend Problem</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div>
                    <p className="font-sans text-sm text-zinc-500 leading-relaxed">To ensure trust, the physical asset must be secured so it cannot be sold in the real world while simultaneously being traded as a token. Reference-backed tokenization places a gold bar in a secure vault the token becomes the only tradeable digital receipt for that gold.</p>
                  </div>
                  <div>
                    <h4 className="font-sans font-bold text-[12px] tracking-wider uppercase text-zinc-400 mb-3">On-Chain Issuance</h4>
                    <p className="font-sans text-sm text-zinc-500 leading-relaxed">Native digital bonds are born entirely on the blockchain with no physical counterpart no vault required. The ledger <em>is</em> the asset's existence.</p>
                  </div>
                  <div className="border border-zinc-800 p-6">
                    <h4 className="font-sans font-bold text-[12px] tracking-wider uppercase text-[#f2dfd2] mb-3">Bankruptcy Remoteness</h4>
                    <p className="font-sans text-sm text-zinc-500 leading-relaxed">Critical for investor protection. In jurisdictions without clear digital-asset laws, tokens risk being pooled with a bankrupt issuer's general debts. A bankruptcy-remote structure ensures the physical asset belongs to token holders not the company's creditors.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Stage 05 */}
          <div className="stage-step py-16 reveal" style={{ borderBottom: '1px solid #27272a' }}>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-8">
              <div className="lg:col-span-2">
                <span className="stage-number text-8xl">05</span>
              </div>
              <div className="lg:col-span-5">
                <span className="font-sans text-[11px] tracking-[0.25em] uppercase text-zinc-400 block mb-3">Minting, Distribution &amp; Lifecycle</span>
                <h3 className="font-serif italic text-2xl text-white mb-4" style={{ fontFamily: "'Newsreader',serif" }}>The Token Goes Live</h3>
                <p className="font-sans text-sm text-zinc-500 leading-relaxed">Minting is the official creation of tokens on the ledger. They are distributed to investors' digital wallets and enter a lifecycle of 24/7 secondary trading automatically collecting coupons until maturity, when the token is burned in exchange for the underlying physical value. The market is currently split between two competing infrastructure models.</p>
              </div>
              <div className="lg:col-span-5">
                <div className="space-y-0.5">
                  {[
                    { label: 'Permissioned Networks', pct: '50.6%', desc: 'Private "consortium" ledgers preferred by banks for privacy. JPMorgan Kinexys, Goldman DAP, HSBC Orion operate here.', accent: false },
                    { label: 'Permissionless Networks', pct: '51.6%', desc: 'Public networks (Ethereum, Polygon, Avalanche) open to global liquidity. Growth rate (CAGR) now exceeds permissioned rails.', accent: true },
                  ].map((item, i) => (
                    <div key={i} className="bg-[#201f1f] p-8 hover:bg-[#2a2a2a] transition-colors cursor-default">
                      <div className="flex items-start justify-between mb-3">
                        <h4 className="font-sans font-bold text-[12px] tracking-wider uppercase text-zinc-300">{item.label}</h4>
                        <span className="font-serif italic text-2xl" style={{ fontFamily: "'Newsreader',serif", color: item.accent ? '#f2dfd2' : '#a1a1aa' }}>{item.pct}</span>
                      </div>
                      <p className="font-sans text-sm text-zinc-400 leading-relaxed">{item.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── HOW IT ACTUALLY WORKS ── */}
        <section className="py-32 px-8 md:px-24 lg:px-48 bg-[#1c1b1b]">
          <div className="mb-24 flex flex-col items-start reveal">
            <h2 className="font-serif italic text-5xl text-white" style={{ fontFamily: "'Newsreader',serif" }}>How It Actually Works</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-0.5 bg-zinc-800">
            {[
              { icon: 'apartment', title: 'Fractional Ownership', text: 'A $100M asset divided into 100,000 programmable tokens at $1,000 each. Lowers the barrier to entry, increases secondary market liquidity by an estimated 30–40%, and broadens investor bases from institutions to individuals.', tag: '$326T addressable market', delay: 1 },
              { icon: 'contract', title: 'Smart Contract Logic', text: 'Self-executing agreements that enforce ownership rules, automate dividend payments, and govern voting rights with no lawyers, no custodians, no delays. Compliance is embedded in the code, not bolted on afterward.', tag: 'T+0 atomic settlement', delay: 2 },
              { icon: 'water_drop', title: 'Decentralized Liquidity', text: 'Markets that never close. Permissionless networks open tokenized assets to global capital pools with algorithmic market-makers replacing the floor specialist and DeFi protocols providing on-demand liquidity.', tag: '24/7 global trading', delay: 3 },
            ].map((item, i) => (
              <div key={i} className={`pillar-card bg-[#1c1b1b] p-12 hover:bg-[#2a2a2a] transition-colors group cursor-default reveal reveal-delay-${item.delay}`}>
                <span className="material-symbols-outlined text-[#f2dfd2] text-4xl mb-8 group-hover:scale-110 transition-transform inline-block">{item.icon}</span>
                <h3 className="font-serif italic text-2xl text-white mb-6" style={{ fontFamily: "'Newsreader',serif" }}>{item.title}</h3>
                <p className="font-sans text-sm text-zinc-500 leading-relaxed mb-8">{item.text}</p>
                <span className="font-sans text-[11px] tracking-[0.25em] uppercase text-zinc-700">{item.tag}</span>
              </div>
            ))}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-0.5 bg-zinc-800 mt-0.5">
            {[
              { icon: 'security', title: 'ISO-20022 Interoperability', text: 'The universal translator that lets blockchain tokens communicate with traditional banking systems like SWIFT. Real-time reconciliation between on-chain activity and off-chain ledgers the technical bridge that makes institutional adoption possible.', delay: 2 },
              { icon: 'hub', title: 'Composable Finance', text: 'Think of tokenized assets like apps on a smartphone. They all run on the same operating system, so they can share data, talk to each other, and combine in ways a single app never could alone. Use your tokenized gold to back a loan, earn yield on a tokenized bond, and settle in a stablecoin, all in one transaction.', delay: 3 },
            ].map((item, i) => (
              <div key={i} className={`pillar-card bg-[#1c1b1b] p-12 hover:bg-[#2a2a2a] transition-colors group cursor-default reveal reveal-delay-${item.delay}`}>
                <span className="material-symbols-outlined text-[#f2dfd2] text-4xl mb-8 group-hover:scale-110 transition-transform inline-block">{item.icon}</span>
                <h3 className="font-serif italic text-2xl text-white mb-6" style={{ fontFamily: "'Newsreader',serif" }}>{item.title}</h3>
                <p className="font-sans text-sm text-zinc-500 leading-relaxed">{item.text}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── BLEED 02 ── */}
        <section className="w-full relative overflow-hidden noise-overlay" style={{ height: '480px', background: '#0e0e0e' }}>
          <div className="absolute top-0 left-1/4 w-96 h-96 rounded-full opacity-10" style={{ background: 'radial-gradient(circle, rgba(242,223,210,0.6) 0%, transparent 70%)', filter: 'blur(60px)', transform: 'translate(-50%,-30%)' }} />
          <div className="absolute bottom-0 right-1/4 w-64 h-64 rounded-full opacity-8" style={{ background: 'radial-gradient(circle, rgba(180,160,140,0.5) 0%, transparent 70%)', filter: 'blur(40px)', transform: 'translate(50%,30%)' }} />
          <div className="absolute inset-0 opacity-15" style={{ backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.6) 1px, transparent 1px)', backgroundSize: '24px 24px' }} />
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center px-8">
            <span className="font-sans text-[12px] tracking-[0.35em] uppercase text-white/60 block mb-6">02</span>
            <span className="font-serif italic text-white/60 leading-tight" style={{ fontFamily: "'Newsreader',serif", fontSize: 'clamp(3rem, 8vw, 7rem)' }}>Where Capital<br />Is Flowing</span>
          </div>
        </section>

        {/* ── ASSET CLASSES ── */}
        <section id="assets" className="py-32 px-8 md:px-24 lg:px-48 bg-[#131313]">
          <div className="mb-20 flex flex-col md:flex-row md:items-end md:justify-between gap-8">
            <div className="reveal">
              <span className="font-sans text-[11px] font-bold tracking-[0.3em] uppercase text-zinc-500 block mb-4">Tokenizable Universe</span>
              <h2 className="font-serif italic text-5xl text-white" style={{ fontFamily: "'Newsreader',serif" }}>Every Asset Class,<br />On-Chain</h2>
            </div>
            <p className="font-sans text-sm text-zinc-500 max-w-xs leading-relaxed reveal reveal-delay-2">
              The tokenization thesis extends far beyond real estate. Six primary classes are being rewritten by distributed ledger technology each with different drivers, market sizes, and stages of adoption.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-0.5 bg-zinc-800">
            {[
              { icon: 'apartment', num: '01', title: 'Real Estate', text: 'Commercial towers, residential developments, and REITs fractionalized into micro-shares with automated rental yield distribution. Holds 30.12% of the tokenized asset market solving the "liquidity trap" of property.', label1: 'Global Market', val1: '$326T', label2: 'Token Share', val2: '30.12%', delay: 1 },
              { icon: 'account_balance', num: '02', title: 'Private Credit', text: 'The dominant tokenized asset class 61% of total volume. Smart contracts automate yields and enable dynamic collateral management. Centrifuge alone has brought billions of private credit on-chain for institutional DeFi borrowers.', label1: 'Volume Share', val1: '61%', label2: 'Growth', val2: 'Dominant', delay: 2 },
              { icon: 'description', num: '03', title: 'Treasuries & Fixed Income', text: 'Government and corporate bonds issued on-chain. BlackRock\'s BUIDL fund tokenized US Treasuries across Ethereum, Polygon, and Avalanche crossed $500M in 40 days. Franklin Templeton and Ondo Finance are collectively issuing billions in yield-bearing digital assets.', label1: 'Market Share', val1: '30%', label2: 'YoY Growth', val2: '+782%', delay: 3 },
              { icon: 'diamond', num: '04', title: 'Commodities', text: 'Gold, silver, and carbon credits tokenized for inflation hedging and ESG liability management. Tokenized gold has surpassed a $6 billion market cap enabling fractional ownership of physical bullion with 100% verified custody.', label1: 'Market Share', val1: '7%', label2: 'Gold Market Cap', val2: '$6B+', delay: 1 },
              { icon: 'palette', num: '05', title: 'Art & Collectibles', text: 'Blue-chip art fractionally owned by thousands, with provenance permanently encoded on-chain. Blockchain provides an unchangeable ownership history eliminating the forgery risk that plagues traditional art markets. Christie\'s is paying attention.', label1: 'Global Market', val1: '$1.7T', label2: 'Tokenized', val2: 'Early Stage', delay: 2 },
              { icon: 'settings_input_antenna', num: '06', title: 'Infrastructure & Funds', text: 'Toll roads, data centers, and institutional funds tokenized for fractional investor access. Institutional funds currently represent 2% of tokenized volume but the infrastructure layer beneath all tokenization (ledgers, custody, compliance) represents the largest long-term opportunity.', label1: 'Fund Share', val1: '2%', label2: 'Trajectory', val2: 'Accelerating', delay: 3 },
            ].map((item, i) => (
              <div key={i} className={`asset-card bg-[#131313] p-10 reveal reveal-delay-${item.delay}`}>
                <div className="flex items-start justify-between mb-6">
                  <span className="material-symbols-outlined text-[#f2dfd2]" style={{ fontSize: '32px' }}>{item.icon}</span>
                  <span className="font-serif italic text-3xl text-zinc-800" style={{ fontFamily: "'Newsreader',serif" }}>{item.num}</span>
                </div>
                <h3 className="font-serif italic text-xl text-white mb-3" style={{ fontFamily: "'Newsreader',serif" }}>{item.title}</h3>
                <p className="font-sans text-sm text-zinc-400 leading-relaxed mb-6">{item.text}</p>
                <div className="flex items-end justify-between border-t border-zinc-800 pt-6 mt-auto">
                  <div><span className="font-sans text-[10px] tracking-widest uppercase text-zinc-700 block mb-1">{item.label1}</span><span className="font-sans text-sm font-bold text-zinc-300">{item.val1}</span></div>
                  <div className="text-right"><span className="font-sans text-[10px] tracking-widest uppercase text-zinc-700 block mb-1">{item.label2}</span><span className="font-sans text-sm font-bold text-[#f2dfd2]">{item.val2}</span></div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── TIMELINE ── */}
        <section id="milestones" className="py-32 bg-[#1c1b1b] overflow-hidden">
          <div className="px-8 md:px-24 lg:px-48 mb-20">
            <span className="font-sans text-[11px] font-bold tracking-[0.3em] uppercase text-zinc-500 block mb-4 reveal">Chronology</span>
            <h2 className="font-serif italic text-5xl text-white reveal" style={{ fontFamily: "'Newsreader',serif" }}>The Tokenization<br />Timeline</h2>
          </div>
          <div className="pl-8 md:pl-24 lg:pl-48 reveal">
            <div className="timeline-track pb-8">
              {[
                { year: '2015', title: 'Ethereum Launches', text: 'Programmable smart contracts make tokenization of real-world assets theoretically possible for the first time.' },
                { year: '2017', title: 'First STOs Emerge', text: 'Security Token Offerings provide the first regulatory-compliant framework for tokenizing traditional securities and equity stakes.' },
                { year: '2020', title: 'DeFi Summer', text: 'Decentralized Finance protocols prove automated lending and yield distribution at scale. The infrastructure case is proven viable.' },
                { year: '2022', title: 'Institutional Entry', text: "JPMorgan's Onyx and Goldman Sachs' Digital Asset Platform (DAP) launch tokenized repo transactions for institutional clients. The era of experimentation begins." },
                { year: '2023–24', title: 'BlackRock Validates', text: "BlackRock's Blockchain USD Institutional Digital Liquidity fund (BUIDL) crosses $500M in 40 days. Franklin Templeton, Ondo, and Centrifuge collectively issue billions. Total tokenized Real World Assets surpass $900 billion. Regulatory clarity arrives in the EU, UAE, and Singapore." },
                { year: '2025', title: 'The GENIUS Act', text: 'US legislation establishes long-awaited "rules of the road" for digital assets and stablecoins removing compliance fears that had kept the largest capital pools on the sideline.' },
                { year: '2026', title: 'Clarity Act', text: 'Comprehensive digital asset framework cements the interoperability between on-chain and traditional financial systems. Swift begins live cross-chain transfers with BNY Mellon and Citi.' },
                { year: '2030 ↗', title: '$16T–$30T Horizon', text: "BCG projects 10% of global GDP held as on-chain tokens. $27B in annual operational savings for banks. The distinction between TradFi and DeFi effectively dissolves.", accent: true },
              ].map((item, i) => (
                <div key={i} className="timeline-item" style={item.accent ? { borderTopColor: 'rgba(242,223,210,0.3)' } : {}}>
                  <span className="font-sans text-[11px] tracking-[0.3em] uppercase text-[#f2dfd2] block mb-4">{item.year}</span>
                  <h3 className="font-serif italic text-xl text-white mb-3" style={{ fontFamily: "'Newsreader',serif" }}>{item.title}</h3>
                  <p className="font-sans text-sm text-zinc-400 leading-relaxed">{item.text}</p>
                </div>
              ))}
              <div className="min-w-32 md:min-w-48" />
            </div>
            <div className="flex items-center gap-3 mt-4 reveal">
              <span className="material-symbols-outlined text-zinc-400 text-base">arrow_forward</span>
              <span className="font-sans text-[11px] tracking-[0.2em] uppercase text-zinc-400">Drag or scroll to traverse timeline</span>
            </div>
          </div>
        </section>

        {/* ── THE ARCHITECTS ── */}
        <section className="py-32 px-8 md:px-24 lg:px-48 bg-[#131313]">
          <div className="mb-16 reveal">
            <span className="font-sans text-[11px] font-bold tracking-[0.3em] uppercase text-zinc-500 block mb-4">The Incumbent Halo Effect</span>
            <h2 className="font-serif italic text-5xl text-white" style={{ fontFamily: "'Newsreader',serif" }}>The Architects of the<br />New Master Ledger</h2>
          </div>

          <div className="mb-16 reveal">
            <div style={{ borderRadius: '4px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.06)', boxShadow: '0 24px 64px rgba(0,0,0,0.55)' }}>
              <img src="/masterledger.png" alt="The Architects of the New Master Ledger — layered infrastructure diagram" style={{ width: '100%', height: 'auto', display: 'block', filter: 'brightness(0.92) contrast(1.04)' }} />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-0.5 bg-zinc-800 mb-0.5">
            {[
              { name: 'BlackRock', tag: 'BUIDL', quote: '"Every asset can be tokenized."', text: "Launched BUIDL tokenized US Treasuries deployed across Ethereum, Polygon, and Avalanche. Crossed $500M TVL within 40 days. The signal that no other institution could ignore.", delay: 1 },
              { name: 'J.P. Morgan', tag: 'Kinexys', text: "Executing intraday repo transactions via the Kinexys digital asset platform with BNP Paribas settling complex transactions in minutes rather than days. Processes billions in daily cross-border flows.", footer: 'Previously: Onyx Platform', delay: 2 },
              { name: 'Securitize', tag: 'Platform', text: "Leading the institutional charge: has tokenized over $4 billion in assets and secured a $1.25 billion valuation via SPAC merger. The primary compliance and issuance infrastructure behind BlackRock's BUIDL fund.", footer: '$4B+ tokenized', delay: 3 },
            ].map((item, i) => (
              <div key={i} className={`arch-card bg-[#131313] p-10 hover:bg-[#1c1b1b] cursor-default reveal reveal-delay-${item.delay}`}>
                <div className="flex items-start justify-between mb-6">
                  <span className="font-sans font-bold text-[12px] tracking-wider uppercase text-zinc-500">{item.name}</span>
                  <span className="font-sans text-[11px] tracking-widest uppercase text-[#f2dfd2]">{item.tag}</span>
                </div>
                {item.quote && <blockquote className="font-serif italic text-base text-zinc-300 leading-relaxed mb-6" style={{ fontFamily: "'Newsreader',serif" }}>{item.quote}</blockquote>}
                <p className="font-sans text-sm text-zinc-400 leading-relaxed">{item.text}</p>
                {item.footer && <div className="mt-6 border-t border-zinc-800 pt-4"><span className="font-sans text-[11px] tracking-widest uppercase text-zinc-700">{item.footer}</span></div>}
              </div>
            ))}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-0.5 bg-zinc-800">
            {[
              { name: 'tZERO', tag: 'ATS', text: 'Expanding compliant secondary trading through its FINRA-approved Alternative Trading System for corporate debt the regulated marketplace where tokenized securities find their secondary liquidity.', delay: 1 },
              { name: 'Ondo Finance & Franklin Templeton', tag: 'Treasuries', text: 'Pioneers in tokenized US Treasuries collectively issuing billions in yield-bearing digital assets accessible to on-chain investors globally, with T+0 settlement and composability with DeFi protocols.', delay: 2 },
              { name: 'Centrifuge', tag: 'Private Credit', text: 'Providing the infrastructure to bring real-world private credit on-chain enabling asset originators (trade receivables, mortgages, microfinance) to borrow from DeFi liquidity pools against tokenized collateral.', delay: 3 },
            ].map((item, i) => (
              <div key={i} className={`arch-card bg-[#131313] p-10 hover:bg-[#1c1b1b] cursor-default reveal reveal-delay-${item.delay}`}>
                <div className="flex items-start justify-between mb-6">
                  <span className="font-sans font-bold text-[12px] tracking-wider uppercase text-zinc-500">{item.name}</span>
                  <span className="font-sans text-[11px] tracking-widest uppercase text-[#f2dfd2]">{item.tag}</span>
                </div>
                <p className="font-sans text-sm text-zinc-400 leading-relaxed">{item.text}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── PULL QUOTE 02 ── */}
        <section className="py-48 bg-[#131313] relative overflow-hidden">
          <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse at 50% 50%, rgba(242,223,210,0.04) 0%, transparent 70%)' }} />
          <div className="max-w-5xl mx-auto px-8 text-center">
            <div className="reveal">
              <div className="quote-line" />
              <blockquote className="font-serif italic text-4xl md:text-6xl text-white leading-tight mb-12" style={{ fontFamily: "'Newsreader',serif" }}>
                "Tokenization is not about replacing the global financial system. It is about <span className="text-[#f2dfd2]">rebuilding it</span> with superior, programmable infrastructure."
              </blockquote>
              <cite className="font-sans text-[11px] font-bold tracking-[0.3em] uppercase text-zinc-500">: The Tokenization Research Consensus, 2025</cite>
            </div>
          </div>
        </section>

        {/* ── ROAD AHEAD ── */}
        <section id="road-ahead" className="py-32 px-8 md:px-24 lg:px-48 bg-[#0e0e0e]">
          <div className="mb-24 reveal">
            <span className="font-sans text-[11px] font-bold tracking-[0.3em] uppercase text-zinc-500 block mb-4">Outlook</span>
            <h2 className="font-serif italic text-5xl text-white" style={{ fontFamily: "'Newsreader',serif" }}>The Road Ahead</h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-24">
            {/* Friction Points */}
            <div className="reveal reveal-left">
              <h3 className="font-serif italic text-2xl text-white mb-10 pb-6 border-b border-zinc-800" style={{ fontFamily: "'Newsreader',serif" }}>Friction Remaining in the System</h3>
              {[
                { label: 'Regulatory Uncertainty', pct: '73%', width: '73%', text: 'Cited as the top barrier by financial institutions. A tokenized bond compliant in Singapore may be illegal to sell in Germany. Absent global harmonization, arbitrage opportunity and systemic risk grow simultaneously.' },
                { label: 'Legacy System Integration', pct: '54%', width: '54%', text: 'The severe technical challenge of linking analog back-office systems to decentralized ledgers. Decades of siloed infrastructure don\'t upgrade overnight and the cost of the bridge is significant.' },
                { label: 'Smart Contract Vulnerabilities', pct: '49%', width: '49%', text: 'Cybersecurity risks inherent in programmable code. A single exploit in a contract managing $200M in tokenized real estate is not an abstraction it is a systemic failure with physical-world consequences.' },
                { label: 'Market Adoption Inertia', pct: '44%', width: '44%', text: 'Projects trapped in perpetual pilot phases. Many tokens see daily trade volumes below 5% of issued supply the Cold Start Liquidity Paradox: issuers won\'t tokenize without buyers; buyers won\'t come without volume.' },
              ].map((item, i) => (
                <div key={i} className={i < 3 ? 'mb-10' : ''}>
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-sans text-sm font-bold text-zinc-300 uppercase tracking-wider">{item.label}</h4>
                    <span className="font-serif italic text-xl text-white" style={{ fontFamily: "'Newsreader',serif" }}>{item.pct}</span>
                  </div>
                  <div className="h-px bg-zinc-800 mb-3">
                    <div className="friction-bar-fill" style={{ width: '0%' }} data-width={item.width} />
                  </div>
                  <p className="font-sans text-sm text-zinc-400 leading-relaxed">{item.text}</p>
                </div>
              ))}
            </div>

            {/* Catalysts */}
            <div className="reveal">
              <h3 className="font-serif italic text-2xl text-white mb-10 pb-6 border-b border-zinc-800" style={{ fontFamily: "'Newsreader',serif" }}>Catalysts Clearing the Path to Scale</h3>
              <div className="space-y-10">
                {[
                  { label: 'Legislative Clarity', text: 'The GENIUS Act (2025) and Clarity Act (2026) establish long-awaited "rules of the road" for digital assets and stablecoins removing compliance fears and unlocking the largest pools of institutional capital.' },
                  { label: 'Cross-Network Interoperability', text: 'Swift is actively testing cross-network asset transfers with Chainlink and major banks BNY Mellon, Citi to connect fragmented blockchains. Network effects are achieved only when external catalysts force the flywheel to turn.' },
                  { label: 'Settlement Infrastructure', text: 'ISO-20022 integration is enabling seamless communication between traditional bank messaging and on-chain activities the universal translator that lets tokenized markets speak to the $8 trillion/day SWIFT network.' },
                  { label: 'The $27B Savings Argument', text: 'Estimated $27 billion in annual operational savings for banks by 2030. At that scale, tokenization is no longer a strategic experiment it is a fiduciary requirement. Institutions that delay face structural cost disadvantages.' },
                ].map((item, i) => (
                  <div key={i} className="flex gap-6">
                    <span className="font-sans text-zinc-700 text-lg leading-none mt-1 flex-shrink-0">+</span>
                    <div>
                      <h4 className="font-sans text-sm font-bold text-zinc-300 mb-2 uppercase tracking-wider">{item.label}</h4>
                      <p className="font-sans text-sm text-zinc-400 leading-relaxed">{item.text}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Editorial Closing */}
          <div className="mt-32 pt-16 border-t border-zinc-800 reveal">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              <div className="lg:col-span-2">
                <span className="font-sans text-[11px] tracking-[0.3em] uppercase text-zinc-700">Editorial View</span>
              </div>
              <div className="lg:col-span-10">
                <p className="font-serif italic text-2xl text-zinc-300 leading-relaxed" style={{ fontFamily: "'Newsreader',serif" }}>
                  The era of siloed, paper-heavy systems is ending. The next decade belongs to institutions that embrace a compliance-first, interoperable approach to make capital as fluid and programmable as the data that defines our modern world. This is not a speculative boom it is the mathematical result of scalable infrastructure, clear legislative frameworks, and incumbent capital finally aligning. The question is not <em>whether</em> it happens. The question is who builds the infrastructure that decides <em>who benefits</em>.
                </p>
              </div>
            </div>
          </div>
        </section>

      </main>

      {/* FOOTER */}
      <footer className="w-full border-t border-zinc-800 bg-[#0e0e0e] text-zinc-400 font-sans text-[12px] tracking-widest uppercase">
        <div className="max-w-[1920px] mx-auto px-12 pt-16 pb-12">
          <div className="flex flex-col gap-4 mb-16 pb-16 border-b border-zinc-900">
            <span className="text-zinc-700 text-[11px]">Series</span>
            <div className="flex flex-wrap gap-8">
              <a className="hover:text-white transition-colors" href="#">The Future of FinTech</a>
              <a className="hover:text-white transition-colors" href="#">DeFi Architecture</a>
              <a className="hover:text-white transition-colors" href="#">Central Bank Digital Currencies</a>
              <a className="hover:text-white transition-colors" href="#">Climate Finance</a>
            </div>
          </div>
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex flex-wrap gap-8">
              <a className="hover:text-white transition-colors" href="#">Privacy Policy</a>
              <a className="hover:text-white transition-colors" href="#">Terms of Service</a>
            </div>
            <div className="text-zinc-700">© 2025 Mohamad Noor-Chowdhury. All rights reserved.</div>
          </div>
        </div>
      </footer>

    </div>
  );
}
