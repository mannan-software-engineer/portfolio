(function () {
  "use strict";

  const root = document.documentElement;
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const $ = (s, el) => (el || document).querySelector(s);
  const $$ = (s, el) => Array.from((el || document).querySelectorAll(s));

  /* ---------- Theme ---------- */
  const themeBtn = $("#theme-toggle");
  function currentTheme() {
    const set = root.getAttribute("data-theme");
    if (set) return set;
    return window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark";
  }
  themeBtn.addEventListener("click", () => {
    const next = currentTheme() === "dark" ? "light" : "dark";
    root.setAttribute("data-theme", next);
    try { localStorage.setItem("theme", next); } catch (e) {}
  });

  /* ---------- Mobile menu ---------- */
  const header = $(".site-header");
  const menuBtn = $("#menu-toggle");
  const navLinks = $("#nav-links");
  function setMenu(open) {
    navLinks.classList.toggle("open", open);
    header.classList.toggle("menu-open", open);
    menuBtn.setAttribute("aria-expanded", String(open));
    menuBtn.setAttribute("aria-label", open ? "Close menu" : "Open menu");
  }
  menuBtn.addEventListener("click", () => setMenu(!navLinks.classList.contains("open")));
  navLinks.addEventListener("click", (e) => { if (e.target.closest("a")) setMenu(false); });
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") setMenu(false); });

  /* ---------- Scroll: header, progress bar, timeline ---------- */
  const progress = $("#scroll-progress");
  const timeline = $("#timeline");
  let ticking = false;
  function onScroll() {
    const y = window.scrollY;
    const max = document.documentElement.scrollHeight - window.innerHeight;
    header.classList.toggle("scrolled", y > 10);
    progress.style.transform = "scaleX(" + (max > 0 ? y / max : 0) + ")";
    if (timeline) {
      const r = timeline.getBoundingClientRect();
      const start = window.innerHeight * 0.7;
      const p = Math.min(1, Math.max(0, (start - r.top) / r.height));
      timeline.style.setProperty("--progress", p.toFixed(3));
    }
    ticking = false;
  }
  window.addEventListener("scroll", () => {
    if (!ticking) { requestAnimationFrame(onScroll); ticking = true; }
  }, { passive: true });
  onScroll();

  /* ---------- Active nav link ---------- */
  const links = $$('.nav-links a[href^="#"]');
  const linkTargets = links.map((a) => $(a.getAttribute("href"))).filter(Boolean);

  /* ---------- Count-up ---------- */
  function countUp(el) {
    const to = parseFloat(el.dataset.to);
    if (reduceMotion) { el.textContent = to; return; }
    const dur = 1600;
    const t0 = performance.now();
    function frame(now) {
      const t = Math.min(1, (now - t0) / dur);
      const eased = 1 - Math.pow(1 - t, 4);
      el.textContent = Math.round(to * eased);
      if (t < 1) requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  }

  if ("IntersectionObserver" in window) {
    const spy = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const id = "#" + entry.target.id;
        links.forEach((a) => a.classList.toggle("active", a.getAttribute("href") === id));
      });
    }, { rootMargin: "-45% 0px -50% 0px" });
    linkTargets.forEach((s) => spy.observe(s));

    const revealer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("visible");
        $$(".count", entry.target).forEach(countUp);
        revealer.unobserve(entry.target);
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.05 });
    $$(".reveal").forEach((el) => revealer.observe(el));
  } else {
    $$(".reveal").forEach((el) => el.classList.add("visible"));
    $$(".count").forEach((el) => { el.textContent = el.dataset.to; });
  }

  /* ---------- Spotlight hover ---------- */
  $$(".spot").forEach((card) => {
    card.addEventListener("pointermove", (e) => {
      const r = card.getBoundingClientRect();
      card.style.setProperty("--mx", e.clientX - r.left + "px");
      card.style.setProperty("--my", e.clientY - r.top + "px");
    });
  });

  /* ---------- Rotating specialty ---------- */
  const rotator = $("#rotator");
  const specialties = [
    "FastAPI microservices",
    "Kubernetes & Helm",
    "CI/CD with GitHub Actions",
    "Real-time WebSocket systems",
    "Fintech & payment backends",
    "Observability with ELK",
  ];
  if (rotator && !reduceMotion) {
    let i = 0;
    setInterval(() => {
      rotator.classList.add("swap");
      setTimeout(() => {
        i = (i + 1) % specialties.length;
        rotator.textContent = specialties[i];
        rotator.classList.remove("swap");
      }, 300);
    }, 2600);
  }

  /* ---------- Terminal animation ---------- */
  const term = $("#terminal");
  const script = [
    { cmd: "git push origin main" },
    { out: '<span class="t-info">→</span> GitHub Actions: lint · tests · build', wait: 500 },
    { out: '<span class="t-ok">✓</span> lint passed · unit tests passed', wait: 600 },
    { out: '<span class="t-ok">✓</span> docker push api:latest <span class="t-dim">— image size −40%</span>', wait: 600 },
    { cmd: "helm upgrade api ./charts/api --atomic" },
    { out: '<span class="t-info">→</span> rolling update · HPA autoscaling on', wait: 500 },
    { out: '<span class="t-ok">✓</span> rollout complete <span class="t-dim">— zero downtime</span>', wait: 700 },
    { cmd: "jmeter -n -t peak-load.jmx" },
    { out: '<span class="t-warn">⚡</span> 10× peak traffic sustained · no degradation', wait: 700 },
    { out: '<span class="t-ok">✓</span> avg API response time <span class="t-ok">−30%</span>', wait: 600 },
  ];
  const PROMPT = '<span class="t-prompt">mannan@prod</span> <span class="t-dim">~</span> <span class="t-prompt">$</span> ';
  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

  function renderAll() {
    term.innerHTML = script.map((s) =>
      s.cmd ? PROMPT + '<span class="t-cmd">' + s.cmd + "</span>" : s.out
    ).join("\n") + "\n" + PROMPT + '<span class="t-cursor"></span>';
  }

  async function play() {
    if (!term) return;
    if (reduceMotion) { renderAll(); return; }
    // eslint-disable-next-line no-constant-condition
    while (true) {
      let html = "";
      for (const step of script) {
        if (step.cmd) {
          const base = html + PROMPT;
          for (let c = 1; c <= step.cmd.length; c++) {
            term.innerHTML = base + '<span class="t-cmd">' + step.cmd.slice(0, c) + '</span><span class="t-cursor"></span>';
            await sleep(32 + Math.random() * 45);
          }
          html = base + '<span class="t-cmd">' + step.cmd + "</span>\n";
          term.innerHTML = html;
          await sleep(350);
        } else {
          html += step.out + "\n";
          term.innerHTML = html + '<span class="t-cursor"></span>';
          await sleep(step.wait || 500);
        }
      }
      term.innerHTML = html + PROMPT + '<span class="t-cursor"></span>';
      await sleep(5000);
    }
  }
  play();

  /* ---------- Copy email ---------- */
  const copyBtn = $("#copy-email");
  const copyLabel = $("#copy-label");
  if (copyBtn) {
    copyBtn.addEventListener("click", async () => {
      const email = copyBtn.dataset.email;
      try {
        await navigator.clipboard.writeText(email);
        copyLabel.textContent = "Copied to clipboard ✓";
        copyBtn.classList.add("copied");
      } catch (e) {
        window.location.href = "mailto:" + email;
        return;
      }
      setTimeout(() => {
        copyLabel.textContent = email;
        copyBtn.classList.remove("copied");
      }, 2200);
    });
  }

  /* ---------- Footer year ---------- */
  const year = $("#year");
  if (year) year.textContent = new Date().getFullYear();
})();
