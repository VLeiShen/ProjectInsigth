const $ = (i) => document.getElementById(i);

/* ===== Iconos SVG (trazo 24x24) reutilizados por las tarjetas ===== */
const ICON = {
  video: '<rect x="2.5" y="6" width="13.5" height="12" rx="2"/><path d="m16 11 5-3.2v8.4L16 13z"/>',
  audio: '<path d="M4 10v4h3l4 3.5v-11L7 10z"/><path d="M15.5 9.4a4 4 0 0 1 0 5.2M18 7a7.6 7.6 0 0 1 0 10"/>'
};

const HERO_ICONS = {
  lander: '<path d="M7 17h10l2 3H5l2-3Z"/><path d="m8 17 2-8h4l2 8M9 10 6 7m9 3 3-3M12 9V5m-2 0h4"/><path d="m7 17-2 2m12-2 2 2"/>',
  "lunar-rover": '<path d="M6 9h12v5H6zM6 10 2.5 8.5v4L6 14m12-4 3.5-1.5v4L18 14"/><circle cx="7" cy="17" r="2"/><circle cx="17" cy="17" r="2"/><path d="M10 9V6h4v3m-2-3V4"/>',
  "mars-rover": '<path d="M5 13h14l-2-5H8l-3 5Zm2 0-1 4m11-4 1 4M9 8V5h2v3m-5 5v4m12-4v4"/><circle cx="6" cy="18" r="1.5"/><circle cx="18" cy="18" r="1.5"/><path d="M10 5h4l2 3H8l2-3Z"/>',
  helicopter: '<path d="M4 6h16M12 6v5m-3 1h6l2 3H7l2-3Zm-1 5-2 3m10-3 2 3M5 4h14"/><circle cx="12" cy="12" r="1.2"/>',
  probe: '<path d="m8 12 4-4 4 4-4 4-4-4Zm4-4V3m-2 0h4m-4 17h4m-2-4v4"/><path d="M8 10 4 7 2 9l5 4m9-3 4-3 2 2-5 4M8 14l-4 3-2-2 5-4m9 3 4 3 2-2-5-4"/>'
};

const icon = (d) => `<span class="card-icon" aria-hidden="true"><svg viewBox="0 0 24 24" focusable="false">${d}</svg></span>`;

/* Renderizado de Héroes */
let hh = "", last = "";
H.forEach((m, i) => {
  if (m.w !== last) {
    hh += `<h3 class="hero-world">${m.w}</h3>`;
    last = m.w;
  }
  hh += `<button type="button" class="hero-item" data-hero="${i}" aria-pressed="false">
        <span class="hero-item-icon" aria-hidden="true"><svg viewBox="0 0 24 24" focusable="false">${HERO_ICONS[m.icon]}</svg></span>
        <span class="hero-item-label">${m.n}</span><span class="hero-item-arrow" aria-hidden="true">↗</span></button>`;
});
$("heroes").innerHTML = hh;

document.querySelectorAll(".hero-vessel-card").forEach(card => {
  card.addEventListener("click", () => {
    const expand = !card.classList.contains("is-expanded");
    document.querySelectorAll(".hero-vessel-card").forEach(item => {
      item.classList.toggle("is-expanded", item === card && expand);
      item.setAttribute("aria-pressed", item === card && expand ? "true" : "false");
    });
  });
});

function showHero(m) {
  const missionImage = m.img
    ? `<figure class="hero-mission-image"><img src="${m.img}" alt="${m.imgAlt}" loading="lazy" decoding="async"><figcaption>${m.imgCaption}</figcaption></figure>`
    : "";
  const visual = m.visual
    ? `<figure class="hero-visual"><span class="hero-visual-label">${m.visualLabel}</span><img src="${m.visual}" alt="${m.visualAlt}" loading="lazy" decoding="async"><figcaption>${m.visualCaption}</figcaption></figure>`
    : `<div class="hero-visual hero-person-placeholder"><span class="hero-visual-label">${m.visualLabel}</span><span class="hero-initials" aria-hidden="true">${m.personInitials}</span><b>${m.c}</b><small>Imagen de retrato no disponible</small></div>`;
  const sources = (m.source
    ? `<a class="hero-source" href="${m.source}" target="_blank" rel="noopener noreferrer">Imagen de misión ↗</a>`
    : "") + (m.visualSource
    ? `<a class="hero-source" href="${m.visualSource}" target="_blank" rel="noopener noreferrer">Imagen complementaria ↗</a>`
    : "");

  $("hero-detail").innerHTML = `
    <div class="hero-detail-content">
      <header class="hero-detail-header">
        <div><span class="hero-detail-eyebrow${m.status ? " is-active" : ""}">${m.w} · ${m.status || "MISIÓN"}</span><h3 id="hero-detail-title">${m.n}</h3></div>
        <p><span>${m.personLabel || "Persona clave"}</span><b>${m.c}</b></p>
      </header>
      <div class="hero-detail-grid">
        <article class="hero-story">
          <span class="hero-story-label">${m.storyLabel || "Quién la creó y qué hizo"}</span>
          <h4>${m.c}</h4>
          <p class="hero-role">${m.r}</p>
          <blockquote class="mission-message">
            <span>MENSAJE IMAGINADO DE LA MISIÓN</span>
            <p>“${m.voz || m.hizo}”</p>
          </blockquote>
          <details class="hero-fact"><summary>¿Qué hizo?</summary><p>${m.hizo}</p></details>
          <details class="hero-fact"><summary>¿Qué quedó?</summary><p>${m.quedo}</p></details>
          ${missionImage}
        </article>
        ${visual}
      </div>
      <footer class="hero-detail-footer"><span>${m.cred}</span><div class="hero-source-links">${sources}
        ${m.infoSource ? `<a class="hero-source" href="${m.infoSource}" target="_blank" rel="noopener noreferrer">Ficha NASA ↗</a>` : ""}
      </div></footer>
    </div>`;
}

document.querySelectorAll("#heroes .hero-item").forEach(button => {
  button.onclick = () => {
    document.querySelectorAll("#heroes .hero-item").forEach(item => {
      const selected = item === button;
      item.classList.toggle("is-selected", selected);
      item.setAttribute("aria-pressed", selected ? "true" : "false");
    });
    showHero(H[+button.dataset.hero]);
  };
});

/* Renderizado de Línea de tiempo, Ciencia, Medios y Créditos */
$("tl").innerHTML = TL.map((t, i) =>
  `<li data-rv style="--i:${i % 6}">
    <span class="tl-node" aria-hidden="true"></span>
    <b>${t.year}</b>
    <figure class="tl-visual">
      <img src="${t.image}" alt="${t.alt}" loading="lazy" decoding="async">
      <figcaption>${t.credit}</figcaption>
    </figure>
    <h3>${t.title}</h3>
    <p>${t.description}</p>
    <a class="tl-source" href="${t.source}" target="_blank" rel="noopener noreferrer">Ver imagen NASA <span aria-hidden="true">↗</span></a>
  </li>`).join("");

$("sci").innerHTML = SC.map((s, i) =>
  `<article class="card sci-card" data-rv style="--i:${i % 6}">
    <figure class="sci-visual">
      <img src="${s.image}" alt="${s.alt}" loading="lazy" decoding="async">
      <figcaption>${s.credit}</figcaption>
    </figure>
    <div class="sci-card-body">
      <span class="sci-category">${s.category}</span>
      <h3>${s.title}</h3>
      <details class="sci-discovery">
        <summary>¿Cómo lo averiguaron?</summary>
        <p>${s.description}</p>
      </details>
      <a class="sci-source" href="${s.source}" target="_blank" rel="noopener noreferrer">Explorar fuente NASA <span aria-hidden="true">↗</span></a>
    </div>
  </article>`).join("");

$("media").innerHTML = MED.map((m, i) => {
  const e = m.src
    ? (m.k === "video" ? `<div class="ph"><video controls src="${m.src}"></video></div>` : `<audio controls src="${m.src}"></audio>`)
    : `<div class="ph">Archivo pendiente</div>`;
  return `<div class="card" data-rv style="--i:${i}">${icon(m.k === "video" ? ICON.video : ICON.audio)}<b>${m.t}</b>${e}<div class="cap">${m.cred}</div></div>`;
}).join("");

$("cred").innerHTML = H.map(m => `<li>${m.n}: ${m.cred}</li>`).join("");

/* Navegación SPA */
const V = [
  ["portada", "Inicio", '<path d="m3 10 9-7 9 7v10a1 1 0 0 1-1 1h-6v-6h-4v6H4a1 1 0 0 1-1-1z"/>'],
  ["heroes", "Héroes", '<path d="M12 3c3 3 5 6 5 10l-5 8-5-8c0-4 2-7 5-10Z"/><circle cx="12" cy="12" r="1.5"/><path d="m7 13-3 2 1 3 3-2m9-3 3 2-1 3-3-2"/>'],
  ["tiempo", "Tiempo", '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>'],
  ["ciencia", "Ciencia", '<circle cx="12" cy="12" r="2"/><ellipse cx="12" cy="12" rx="9" ry="4" transform="rotate(30 12 12)"/><ellipse cx="12" cy="12" rx="9" ry="4" transform="rotate(-30 12 12)"/>'],
  ["medios", "Medios", '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m10 9 5 3-5 3z"/>'],
  ["juego", "Juego", '<path d="M7 9h10a4 4 0 0 1 3.8 5l-.7 2.4a2 2 0 0 1-3.3 1l-2-1.8h-5l-2 1.8a2 2 0 0 1-3.3-1L4.8 14A4 4 0 0 1 7 9Z"/><path d="M8 12v4m-2-2h4m6-1h.01M18 15h.01"/>'],
  ["creditos", "Créditos", '<path d="M6 3h8l4 4v14H6a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2Z"/><path d="M14 3v5h5m-11 4h6m-6 4h6"/>']
];

$("nav").innerHTML = `<div class="nav-brand"><a href="#portada" aria-label="Space Trace, portada"><span class="nav-brand-mark" aria-hidden="true">✦</span><span>SPACE TRACE</span></a></div>` +
  V.filter(v => v[0] !== "portada")
   .map(v => `<a href="#${v[0]}"><svg class="nav-icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false">${v[2]}</svg><span>${v[1]}</span></a>`)
   .join("");

/* ===== Bitácora local de exploración ===== */
const EXPLORE_KEY = "space-trace.exploration.v1";
const EXPLORE_SECTIONS = ["heroes", "tiempo", "ciencia", "medios", "juego"];
let exploredSections = [];

try {
  const savedProgress = window.localStorage.getItem(EXPLORE_KEY);
  if (savedProgress) {
    const parsedProgress = JSON.parse(savedProgress);
    if (Array.isArray(parsedProgress)) {
      exploredSections = EXPLORE_SECTIONS.filter(section => parsedProgress.includes(section));
    } else {
      console.warn("La bitácora guardada no tiene un formato válido; se iniciará una nueva.");
    }
  }
} catch (error) {
  console.warn("No se pudo leer la bitácora guardada; el progreso estará disponible durante esta visita.", error);
}

function updateExplorationProgress() {
  const count = exploredSections.length;
  $("exploration-count").textContent = count === EXPLORE_SECTIONS.length
    ? "¡Bitácora completa!"
    : `${count}/5 archivos`;
  $("exploration-meter").value = count;
  document.querySelectorAll("[data-explore-step]").forEach(step => {
    const complete = exploredSections.includes(step.dataset.exploreStep);
    step.classList.toggle("is-complete", complete);
    if (complete) step.setAttribute("aria-label", `${step.textContent}: explorado`);
    else step.removeAttribute("aria-label");
  });
}

function recordExploration(section) {
  if (!EXPLORE_SECTIONS.includes(section) || exploredSections.includes(section)) return;
  exploredSections.push(section);
  updateExplorationProgress();
  try {
    window.localStorage.setItem(EXPLORE_KEY, JSON.stringify(exploredSections));
  } catch (error) {
    console.warn("No se pudo guardar la bitácora; el progreso se conservará durante esta visita.", error);
  }
}

updateExplorationProgress();

/* ===== Aparición progresiva de tarjetas al entrar en pantalla ===== */
const rvObs = "IntersectionObserver" in window
  ? new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add("in");
          rvObs.unobserve(e.target);
        }
      });
    }, { threshold: .1, rootMargin: "0px 0px -6% 0px" })
  : null;

function reveals() {
  document.querySelectorAll("[data-rv]:not(.in)").forEach(el => {
    if (rvObs) rvObs.observe(el);
    else el.classList.add("in");
  });
}

/* ===== Mascota guía: Oppi ===== */
const OPPI_MSG = {
  portada: "¡Hola! Soy Oppi, tu guía espacial. 🤖 Tócame y te llevo de recorrido por todo el archivo.",
  heroes: "Cada misión guarda la historia de quien la hizo posible. ¡Toca una tarjeta para descubrirla!",
  tiempo: "Aquí viajamos por el tiempo: desliza la línea y encuentra los momentos clave. ⏳",
  ciencia: "Estos son los hallazgos más asombrosos. Abre «¿Cómo lo averiguaron?» para ver el secreto. 🔬",
  medios: "Estas son las señales recuperadas: videos y sonidos de las misiones. 📡",
  juego: "¡Hora de jugar! Hay tres desafíos esperándote. ¿Los superas todos? 🚀",
  creditos: "Estas son nuestras fuentes. ¡Los buenos exploradores citan su trabajo! 📚"
};

/* Recorrido guiado: Oppi nos lleva por cada sección (y por las partes de Héroes). */
const OPPI_TOUR = [
  { h: "heroes", sel: "#heroes", msg: "¡Empecemos por los Héroes! 👉 Estas son las cinco misiones que la NASA dejó atrás. Toca una tarjeta para conocerla." },
  { h: "heroes", sel: "#hero-detail", msg: "Aquí aparece su historia completa: quién la creó, qué hizo y qué quedó. 👉 Prueba con otra misión." },
  { h: "tiempo", sel: "#tl", msg: "Ahora viajemos en el Tiempo. 👉 Desliza la línea y descubre los momentos clave de la exploración espacial." },
  { h: "ciencia", sel: "#sci", msg: "Estos son los hallazgos que dejaron. 👉 Abre «¿Cómo lo averiguaron?» para ver el secreto científico." },
  { h: "medios", sel: "#media", msg: "Aquí están las señales recuperadas: videos y sonidos de las misiones. 📡" },
  { h: "juego", sel: "#menu", msg: "¡Y ahora a jugar! 👉 Tienes tres desafíos: rescatar al rover, ser detective y el mini-quiz." },
  { h: "creditos", sel: "#v-creditos .card", msg: "Por último, las fuentes. 📚 ¡Los buenos exploradores citan su trabajo!" }
];

const oppi = (() => {
  const GUIA_KEY = "space-trace.guide.v1";

  const wrap = document.createElement("div");
  wrap.className = "oppi";
  wrap.innerHTML = `
    <div class="oppi-bubble"><span class="oppi-step" hidden></span><p></p></div>
    <button class="oppi-body" type="button" aria-label="Hablar con Oppi, la mascota guía">
      <svg viewBox="0 0 64 64" aria-hidden="true" focusable="false">
        <path d="M32 20v-7M24 13h16"/>
        <rect x="16" y="20" width="32" height="26" rx="9"/>
        <circle cx="25" cy="32" r="3.2"/>
        <circle cx="39" cy="32" r="3.2"/>
        <path d="M27 40h10M16 31H9m39 0h7M22 46l-4 8m24-8 4 8"/>
      </svg>
    </button>`;
  document.body.appendChild(wrap);

  const bubble = wrap.querySelector(".oppi-bubble");
  const texto = bubble.querySelector("p");
  const paso = bubble.querySelector(".oppi-step");
  const boton = wrap.querySelector(".oppi-body");
  let ocultar = null, idx = -1, navGuia = false, resaltado = null, siguiendo = false, programado = false, programadoTid = null;
  const reducido = matchMedia("(prefers-reduced-motion:reduce)").matches;

  function say(mensaje, fijo, pasoTexto) {
    texto.textContent = mensaje;
    paso.hidden = !pasoTexto;
    if (pasoTexto) paso.textContent = pasoTexto;
    bubble.classList.add("show");
    clearTimeout(ocultar);
    if (!fijo) ocultar = setTimeout(() => bubble.classList.remove("show"), 9500);
  }

  function limpiarResaltado() {
    if (resaltado) {
      resaltado.classList.remove("guide-focus");
      resaltado = null;
    }
  }

  function destacar(sel) {
    limpiarResaltado();
    const el = sel ? document.querySelector(sel) : null;
    if (el) {
      el.classList.add("guide-focus");
      resaltado = el;
    }
  }

  function saltar() {
    wrap.classList.remove("saltando");
    void wrap.offsetWidth;
    wrap.classList.add("saltando");
  }

  /* Desplaza a Oppi hasta quedar junto al elemento indicado */
  function colocar(el, instantaneo) {
    if (!el) return;
    const margen = 16;
    const bw = boton.offsetWidth || 62;
    wrap.style.transition = "none";
    wrap.style.transform = "none";
    void wrap.offsetWidth;
    const base = wrap.getBoundingClientRect();
    const r = el.getBoundingClientRect();
    const objY = Math.min(Math.max(r.top + r.height / 2, base.height / 2 + 8), innerHeight - base.height / 2 - 8);
    const dy = objY - (base.top + base.height / 2);
    let left = r.left - margen - bw;
    if (left < 8) left = r.right + margen;
    left = Math.min(Math.max(left, 8), Math.max(8, innerWidth - base.width - 8));
    const dx = left - base.left;
    wrap.style.transition = instantaneo || reducido ? "none" : "transform .85s cubic-bezier(.34, .82, .3, 1)";
    wrap.style.transform = `translate(${Math.round(dx)}px, ${Math.round(dy)}px)`;
  }

  /* Si el usuario desplaza la página, Oppi sigue pegado a su objetivo */
  function seguirObjetivo() {
    if (idx < 0 || programado || siguiendo) return;
    siguiendo = true;
    requestAnimationFrame(() => {
      siguiendo = false;
      const p = OPPI_TOUR[idx];
      const el = p && p.sel ? document.querySelector(p.sel) : null;
      if (el) colocar(el, true);
    });
  }

  addEventListener("scroll", seguirObjetivo, { passive: true });
  addEventListener("resize", seguirObjetivo, { passive: true });

  function mostrarPaso() {
    const p = OPPI_TOUR[idx];
    const el = p.sel ? document.querySelector(p.sel) : null;
    destacar(p.sel);
    say(p.msg, true, `Paso ${idx + 1} de ${OPPI_TOUR.length}`);
    saltar();
    if (el) {
      programado = true;
      el.scrollIntoView({ block: "center", behavior: "auto" });
      colocar(el, false);
      clearTimeout(programadoTid);
      programadoTid = setTimeout(() => { programado = false; }, 950);
    }
  }

  function irA() {
    const p = OPPI_TOUR[idx];
    const actual = location.hash.slice(1) || "portada";
    if (actual !== p.h) {
      navGuia = true;
      location.hash = p.h;
    } else {
      mostrarPaso();
    }
  }

  function cerrarGuia(mensaje, guardar) {
    idx = -1;
    limpiarResaltado();
    paso.hidden = true;
    clearTimeout(programadoTid);
    programado = false;
    wrap.style.transition = reducido ? "none" : "transform .85s cubic-bezier(.34, .82, .3, 1)";
    wrap.style.transform = "";
    if (guardar) {
      try { window.localStorage.setItem(GUIA_KEY, "done"); } catch (e) {}
    }
    if (mensaje) say(mensaje, false);
  }

  function guiaVista() {
    try { return window.localStorage.getItem(GUIA_KEY) === "done"; } catch (e) { return false; }
  }

  boton.onclick = () => {
    if (typeof bp === "function") bp(720);

    if (idx >= 0) {
      idx++;
      if (idx >= OPPI_TOUR.length) {
        if (typeof bp === "function") bp(990);
        cerrarGuia("¡Recorrido completo! 🎉 Ya conoces todo el archivo. Tócame cuando quieras un dato curioso.", true);
        return;
      }
      irA();
      return;
    }

    if (!guiaVista()) {
      idx = 0;
      irA();
      return;
    }

    say("¿Sabías que…? " + SABIAS[Math.floor(Math.random() * SABIAS.length)]);
  };

  return {
    route(h) {
      if (idx >= 0) cerrarGuia(null, false);
      say(OPPI_MSG[h] || OPPI_MSG.portada, h === "portada");
    },
    continuarTour() {
      if (idx >= 0) mostrarPaso();
    },
    consumeNav() {
      const v = navGuia;
      navGuia = false;
      return v;
    }
  };
})();

/* ===== Volver arriba ===== */
const toTop = document.createElement("button");
toTop.type = "button";
toTop.id = "toTop";
toTop.className = "chip";
toTop.setAttribute("aria-label", "Volver arriba");
toTop.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M12 19V6m-6 6 6-6 6 6"/></svg>';
document.body.appendChild(toTop);
toTop.onclick = () => {
  const suave = !matchMedia("(prefers-reduced-motion:reduce)").matches;
  scrollTo({ top: 0, behavior: suave ? "smooth" : "auto" });
};

function route() {
  const h = location.hash.slice(1) || "portada";
  const target = $("v-" + h) || $("v-portada");
  recordExploration(target.id.replace("v-", ""));
  document.querySelectorAll(".v").forEach(s => s.classList.toggle("on", s === target));

  $("nav").classList.add("on");
  document.body.classList.toggle("home", h === "portada");

  document.querySelectorAll("#nav > a").forEach(a => {
    const activo = a.getAttribute("href") === "#" + h;
    a.classList.toggle("on", activo);
    if (activo) a.setAttribute("aria-current", "page");
    else a.removeAttribute("aria-current");
  });

  reveals();
  onScroll();
  scrollTo(0, 0);
  if (oppi.consumeNav()) oppi.continuarTour();
  else oppi.route(h);
}

function onScroll() {
  toTop.classList.toggle("on", window.scrollY > 420);
}

window.addEventListener("scroll", onScroll, { passive: true });
window.addEventListener("hashchange", route);
$("start").onclick = () => { location.hash = "heroes"; };
route();
