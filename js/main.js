/* Rendering and behavior. Reads everything from data.js; contains no content. */

function el(tag, className, html) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (html !== undefined) node.innerHTML = html;
  return node;
}
const byId = id => document.getElementById(id);
const reduceMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/* ---------- Phone frame with screenshots ---------- */
function buildPhone(shots, name) {
  const phone = el("div", "phone");
  const screens = el("div", "screens");
  screens.tabIndex = 0;
  screens.setAttribute("role", "group");
  screens.setAttribute("aria-label", name + " screenshots");
  if (shots.length) {
    shots.forEach((src, i) => {
      const img = el("img");
      img.src = src; img.alt = name + " screenshot " + (i + 1);
      img.loading = i ? "lazy" : "eager"; img.draggable = false;
      screens.appendChild(img);
    });
  } else {
    screens.appendChild(el("div", "ph", name.charAt(0)));
  }
  phone.appendChild(screens);
  return { phone, screens };
}

function buildGalleryNav(screens, count) {
  const bar = el("div", "gallery-nav");
  const prev = el("button", "nav-btn", "‹");
  const next = el("button", "nav-btn", "›");
  prev.type = next.type = "button";
  prev.setAttribute("aria-label", "Previous screenshot");
  next.setAttribute("aria-label", "Next screenshot");
  const dots = el("div", "dots");
  const dotEls = Array.from({ length: count }, () => dots.appendChild(el("span", "dot")));
  const go = dir => screens.scrollBy({ left: dir * screens.clientWidth, behavior: reduceMotion() ? "auto" : "smooth" });
  prev.addEventListener("click", () => go(-1));
  next.addEventListener("click", () => go(1));
  const sync = () => {
    const i = Math.round(screens.scrollLeft / screens.clientWidth);
    dotEls.forEach((d, n) => d.classList.toggle("on", n === i));
    prev.disabled = i === 0; next.disabled = i === count - 1;
  };
  screens.addEventListener("scroll", sync, { passive: true });
  sync();
  bar.append(prev, dots, next);
  return bar;
}

/* ---------- Lightbox ---------- */
const lightbox = { shots: [], index: 0, name: "" };
function showLightbox() {
  const img = byId("lb-img");
  img.src = lightbox.shots[lightbox.index];
  img.alt = lightbox.name + " screenshot " + (lightbox.index + 1);
  const many = lightbox.shots.length > 1;
  byId("lb-prev").hidden = byId("lb-next").hidden = !many;
}
function openLightbox(project, index) {
  Object.assign(lightbox, { shots: project.shots, index, name: project.name });
  showLightbox();
  byId("lightbox").showModal();
}
function stepLightbox(dir) {
  const n = lightbox.shots.length;
  lightbox.index = (lightbox.index + dir + n) % n;
  showLightbox();
}
function initLightbox() {
  const dlg = byId("lightbox");
  byId("lb-prev").addEventListener("click", () => stepLightbox(-1));
  byId("lb-next").addEventListener("click", () => stepLightbox(1));
  byId("lb-close").addEventListener("click", () => dlg.close());
  dlg.addEventListener("click", e => { if (e.target === dlg || e.target.classList.contains("lb")) dlg.close(); });
  dlg.addEventListener("keydown", e => {
    if (e.key === "ArrowLeft") stepLightbox(-1);
    if (e.key === "ArrowRight") stepLightbox(1);
  });
}

/* ---------- Sections ---------- */
function renderHero(profile, projects) {
  byId("h-title").textContent = profile.headline;
  byId("h-intro").textContent = profile.intro;
  byId("h-stack").textContent = profile.stack;
  const cta = byId("h-cta");
  const primary = el("a", "btn primary", "View my work"); primary.href = "#work";
  cta.appendChild(primary);
  if (profile.cv) { const a = el("a", "btn", "Download CV"); a.href = profile.cv; a.download = ""; cta.appendChild(a); }
  const mail = el("a", "btn", "Email me"); mail.href = "mailto:" + profile.email; cta.appendChild(mail);

  const host = byId("h-phone");
  if (profile.photo) {
    const img = el("img", "photo"); img.src = profile.photo; img.alt = profile.name; host.appendChild(img);
  } else {
    const lead = projects.find(p => p.shots.length) || projects[0];
    host.appendChild(buildPhone(lead && lead.shots.length ? [lead.shots[0]] : [], lead ? lead.name : "U").phone);
  }
}

function renderProject(p) {
  const article = el("article", "project");
  const stage = el("div", "stage");
  stage.style.setProperty("--tint", p.color || "var(--accent)");
  const col = el("div");
  const { phone, screens } = buildPhone(p.shots, p.name);
  screens.addEventListener("click", e => {
    if (e.target.tagName === "IMG") openLightbox(p, [...screens.children].indexOf(e.target));
  });
  col.appendChild(phone);
  if (p.shots.length > 1) col.appendChild(buildGalleryNav(screens, p.shots.length));
  stage.appendChild(col);

  const info = el("div", "info");
  info.style.setProperty("--t", p.color || "var(--accent)");
  const title = el("div", "title");
  const badge = el("span", "badge");
  if (p.icon) { const i = el("img"); i.src = p.icon; i.alt = ""; badge.appendChild(i); } else { badge.textContent = p.name.charAt(0); }
  title.append(badge, el("h3", "", p.name));
  info.append(title, el("p", "role", p.role), el("p", "", p.summary));
  const pts = el("ul"); p.points.forEach(t => pts.appendChild(el("li", "", t))); info.appendChild(pts);
  const tags = el("ul", "tags"); p.tags.forEach(t => tags.appendChild(el("li", "", t))); info.appendChild(tags);

  const hasLinks = p.links && p.links.length;
  if (p.caseStudy || hasLinks || p.note) {
    const actions = el("div", "actions");
    if (p.caseStudy) {
      const b = el("button", "btn primary", "Read case study");
      b.type = "button";
      b.addEventListener("click", () => openCase(p));
      actions.appendChild(b);
    }
    (p.links || []).forEach(l => {
      const a = el("a", "btn", l.label);
      a.href = l.url; a.target = "_blank"; a.rel = "noopener"; actions.appendChild(a);
    });
    if (!hasLinks && p.note) actions.appendChild(el("span", "note", p.note));
    info.appendChild(actions);
  }
  article.append(stage, info);
  return article;
}

function renderAbout(profile, experience) {
  byId("about-text").textContent = profile.about;
  const list = byId("timeline");
  experience.forEach(x => {
    const li = el("li");
    li.append(el("h3", "", x.role), el("p", "meta", x.org + " · " + x.period), el("p", "", x.text));
    list.appendChild(li);
  });
}

function renderSkills(groups) {
  const host = byId("skill-groups");
  Object.entries(groups).forEach(([name, items]) => {
    const box = el("div");
    box.appendChild(el("h3", "", name));
    const ul = el("ul", "tags"); items.forEach(t => ul.appendChild(el("li", "", t)));
    box.appendChild(ul); host.appendChild(box);
  });
}

function renderContact(profile) {
  const host = byId("links");
  const items = [["Email me", "mailto:" + profile.email, true], ["GitHub", profile.github], ["LinkedIn", profile.linkedin]];
  if (profile.cv) items.splice(1, 0, ["Download CV", profile.cv]);
  items.forEach(([label, href, primary]) => {
    const a = el("a", "btn" + (primary ? " primary" : ""), label);
    a.href = href;
    if (href.startsWith("http")) { a.target = "_blank"; a.rel = "noopener"; }
    host.appendChild(a);
  });
}

/* ---------- Case studies ---------- */
const slugify = name => name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

function openCase(project) {
  const c = project.caseStudy;
  const body = byId("case-body");
  body.innerHTML = "";
  body.append(el("p", "role", project.role), el("h2", "", project.name + ": case study"));
  const section = (title, ...nodes) => {
    const s = el("section", "case-section");
    s.append(el("h3", "", title), ...nodes);
    body.appendChild(s);
  };
  section("The problem", el("p", "", c.problem));
  section("My role", el("p", "", c.role));
  section("Key decisions", ...c.decisions.map(d => {
    const item = el("div", "decision");
    item.append(el("h4", "", d.title), el("p", "", d.text));
    return item;
  }));
  if (c.result) section("Result", el("p", "", c.result));
  const tags = el("ul", "tags");
  project.tags.forEach(t => tags.appendChild(el("li", "", t)));
  section("Built with", tags);
  byId("case").showModal();
  history.replaceState(null, "", "#case-" + slugify(project.name));
}

function initCase(projects) {
  const dlg = byId("case");
  byId("case-close").addEventListener("click", () => dlg.close());
  dlg.addEventListener("click", e => { if (e.target === dlg) dlg.close(); });
  dlg.addEventListener("close", () => {
    if (location.hash.startsWith("#case-")) history.replaceState(null, "", location.pathname + location.search);
  });
  const match = projects.find(p => p.caseStudy && "#case-" + slugify(p.name) === location.hash);
  if (match) openCase(match);
}

/* ---------- Contact form ---------- */
/* Sending options, in order: Web3Forms (web3formsKey), Formspree (formEndpoint), or the visitor's email app. */
async function sendMessage(profile, data) {
  if (profile.web3formsKey) {
    const res = await fetch("https://api.web3forms.com/submit", {
      method: "POST",
      headers: { "Content-Type": "application/json", "Accept": "application/json" },
      body: JSON.stringify({
        access_key: profile.web3formsKey,
        subject: "Portfolio message from " + data.name,
        from_name: "Portfolio website",
        name: data.name, email: data.email, message: data.message
      })
    });
    const out = await res.json();
    if (!res.ok || !out.success) throw new Error(out.message || "Request failed");
    return true;
  }
  if (profile.formEndpoint) {
    const res = await fetch(profile.formEndpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json", "Accept": "application/json" },
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error("Request failed");
    return true;
  }
  return false;                                      // nothing configured
}

function initForm(profile) {
  const form = byId("contact-form");
  const status = byId("form-status");
  const button = form.querySelector("button");
  form.addEventListener("submit", async e => {
    e.preventDefault();
    if (!form.reportValidity()) return;
    const data = Object.fromEntries(new FormData(form));
    if (data._gotcha) return;                        // spam trap: real visitors never fill this field
    button.disabled = true;
    status.textContent = "Sending…";
    try {
      const sent = await sendMessage(profile, data);
      if (sent) {
        form.reset();
        status.textContent = "Thanks, your message was sent. I’ll reply by email.";
      } else {                                       // fallback: open the visitor's email app
        const body = data.message + "\n\n" + data.name + " (" + data.email + ")";
        location.href = "mailto:" + profile.email + "?subject=" + encodeURIComponent("Portfolio message from " + data.name) + "&body=" + encodeURIComponent(body);
        status.textContent = "Opening your email app…";
      }
    } catch (err) {
      status.textContent = "The message could not be sent. Please email " + profile.email + " instead.";
    }
    button.disabled = false;
  });
}

/* ---------- Theme and nav ---------- */
function initTheme() {
  const btn = byId("theme");
  const root = document.documentElement;
  const apply = t => { root.dataset.theme = t; btn.textContent = t === "dark" ? "Light" : "Dark"; };
  let saved = null;
  try { saved = localStorage.getItem("theme"); } catch (e) {}
  apply(saved || (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"));
  btn.addEventListener("click", () => {
    const next = root.dataset.theme === "dark" ? "light" : "dark";
    apply(next);
    try { localStorage.setItem("theme", next); } catch (e) {}
  });
}

function initNavHighlight() {
  const links = [...document.querySelectorAll("#nav a")];
  const sections = links.map(a => document.querySelector(a.getAttribute("href")));
  const io = new IntersectionObserver(entries => {
    entries.forEach(en => {
      if (!en.isIntersecting) return;
      links.forEach(a => a.removeAttribute("aria-current"));
      const i = sections.indexOf(en.target);
      if (i > -1) links[i].setAttribute("aria-current", "true");
    });
  }, { rootMargin: "-40% 0px -55% 0px" });
  sections.forEach(s => s && io.observe(s));
}

/* ---------- Start ---------- */
renderHero(PROFILE, PROJECTS);
PROJECTS.forEach(p => byId("projects").appendChild(renderProject(p)));
renderAbout(PROFILE, EXPERIENCE);
renderSkills(SKILLS);
renderContact(PROFILE);
byId("yr").textContent = new Date().getFullYear();
initLightbox(); initCase(PROJECTS); initForm(PROFILE); initTheme(); initNavHighlight();
