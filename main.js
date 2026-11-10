import { categories, experience, principles, profile, projects } from "./content.js";

const grid = document.querySelector("#project-grid");
const filterList = document.querySelector("#filter-list");
const count = document.querySelector("#work-count");
const videoDialog = document.querySelector("#video-dialog");
const videoStage = document.querySelector("#video-stage");
const videoClose = document.querySelector("#dialog-close");
const offerDialog = document.querySelector("#offer-dialog");
const offerClose = document.querySelector("#offer-close");
const offerSend = document.querySelector("#offer-send");
const offerSendNow = document.querySelector("#offer-send-now");
const visitCounter = document.querySelector("#visit-counter");
const visitCounterLabel = document.querySelector("#visit-counter-label");
const visitCounterValue = document.querySelector("#visit-counter-value");
const visitCounterTotal = document.querySelector("#visit-counter-total");
const celebrationLayer = document.querySelector("#celebration-layer");
const contactDialog = document.querySelector("#contact-dialog");
const contactOpen = document.querySelector("#contact-open");
const contactClose = document.querySelector("#contact-close");
const contactMethods = document.querySelector("#contact-methods");
const contactFeedback = document.querySelector("#contact-feedback");
const pageProgressCurrent = document.querySelector("#page-progress-current");
const pageProgressTotal = document.querySelector("#page-progress-total");
const pageProgressFill = document.querySelector("#page-progress-fill");
let activeCategory = "all";
const freeViewLimit = 3;
const viewedProjectIds = new Set();
let offerUnlocked = false;
let pendingOfferProject = null;
let celebrationTimer = 0;
const hoverPreviewEnabled = window.matchMedia("(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)").matches;

function cardsPerRow() {
  if (window.innerWidth <= 370) return 1;
  if (window.innerWidth <= 980) return 2;
  return 3;
}

function pageStops() {
  const header = document.querySelector(".site-header");
  const topInset = header?.getBoundingClientRect().height || 0;
  const maxScroll = Math.max(0, document.documentElement.scrollHeight - window.innerHeight);
  const raw = [...document.querySelectorAll("[data-scroll-stop]")].map((element) => {
    const absoluteTop = element.getBoundingClientRect().top + window.scrollY;
    return Math.max(0, Math.min(maxScroll, absoluteTop - topInset));
  });
  raw.push(maxScroll);
  return raw.sort((a, b) => a - b).filter((value, index, list) => index === 0 || value - list[index - 1] > 42);
}

function nearestPageIndex(stops = pageStops()) {
  let nearest = 0;
  let distance = Number.POSITIVE_INFINITY;
  stops.forEach((position, index) => {
    const nextDistance = Math.abs(position - window.scrollY);
    if (nextDistance < distance) {
      nearest = index;
      distance = nextDistance;
    }
  });
  return nearest;
}

function updatePageProgress() {
  if (!pageProgressCurrent || !pageProgressTotal || !pageProgressFill) return;
  const stops = pageStops();
  const current = nearestPageIndex(stops);
  const total = Math.max(1, stops.length);
  pageProgressCurrent.textContent = String(current + 1).padStart(2, "0");
  pageProgressTotal.textContent = String(total).padStart(2, "0");
  pageProgressFill.style.setProperty("--page-progress", `${((current + 1) / total) * 100}%`);
  pageProgressCurrent.setAttribute("aria-label", `第 ${current + 1} 屏，共 ${total} 屏`);
}

function setupPageScrolling() {
  let wheelAmount = 0;
  let lockedUntil = 0;
  let previousColumns = cardsPerRow();
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

  const goToPage = (direction) => {
    const stops = pageStops();
    const current = nearestPageIndex(stops);
    const next = Math.max(0, Math.min(stops.length - 1, current + direction));
    if (next === current) return;
    lockedUntil = Date.now() + 900;
    wheelAmount = 0;
    window.scrollTo({ top: stops[next], behavior: reduceMotion.matches ? "auto" : "smooth" });
    updatePageProgress();
  };

  window.addEventListener("wheel", (event) => {
    if (event.ctrlKey || document.querySelector("dialog[open]") || event.target.closest?.("input, textarea, select, [contenteditable='true']")) return;
    if (Math.abs(event.deltaY) < 1) return;
    event.preventDefault();
    if (Date.now() < lockedUntil) return;
    wheelAmount += event.deltaY;
    if (Math.abs(wheelAmount) < 42) return;
    goToPage(Math.sign(wheelAmount));
  }, { passive: false });

  window.addEventListener("keydown", (event) => {
    if (document.querySelector("dialog[open]") || event.altKey || event.ctrlKey || event.metaKey) return;
    if (["PageDown", "ArrowDown", " "].includes(event.key) && !event.target.closest?.("button, a, input, textarea, select, [contenteditable='true']")) {
      event.preventDefault();
      goToPage(1);
    } else if (["PageUp", "ArrowUp"].includes(event.key) && !event.target.closest?.("button, a, input, textarea, select, [contenteditable='true']")) {
      event.preventDefault();
      goToPage(-1);
    } else if (event.key === "Home") {
      event.preventDefault();
      window.scrollTo({ top: 0, behavior: reduceMotion.matches ? "auto" : "smooth" });
    } else if (event.key === "End") {
      event.preventDefault();
      const stops = pageStops();
      window.scrollTo({ top: stops.at(-1) || 0, behavior: reduceMotion.matches ? "auto" : "smooth" });
    }
  });

  document.querySelectorAll("a[href^='#']").forEach((link) => {
    link.addEventListener("click", (event) => {
      const target = document.querySelector(link.getAttribute("href"));
      if (!target) return;
      const stop = target.matches("[data-scroll-stop]") ? target : target.closest("[data-scroll-stop]") || document.querySelector("[data-scroll-stop]");
      if (!stop) return;
      event.preventDefault();
      history.replaceState(null, "", link.getAttribute("href"));
      const topInset = document.querySelector(".site-header")?.getBoundingClientRect().height || 0;
      const top = Math.max(0, stop.getBoundingClientRect().top + window.scrollY - topInset);
      lockedUntil = Date.now() + 900;
      window.scrollTo({ top, behavior: reduceMotion.matches ? "auto" : "smooth" });
      updatePageProgress();
    });
  });

  let scrollFrame = 0;
  window.addEventListener("scroll", () => {
    if (scrollFrame) return;
    scrollFrame = requestAnimationFrame(() => {
      scrollFrame = 0;
      updatePageProgress();
    });
  }, { passive: true });

  window.addEventListener("resize", () => {
    const nextColumns = cardsPerRow();
    if (nextColumns !== previousColumns) {
      previousColumns = nextColumns;
      renderProjects();
    }
    updatePageProgress();
  }, { passive: true });
  updatePageProgress();
}

document.querySelector("#profile-name").textContent = profile.name;
document.querySelector("#profile-class-year").textContent = profile.classYear;
document.querySelector("#profile-school").textContent = profile.school;
document.querySelector("#profile-major").textContent = profile.major;
document.querySelector("#profile-education-years").textContent = profile.educationYears;
document.querySelector("#profile-rank").textContent = profile.rank.replace("专业排名", "").trim();
document.querySelector("#profile-rank-note").textContent = `简历注明 · ${profile.rankNote.replace("简历注明：", "")}`;

function safeHttpUrl(value) {
  try {
    const url = new URL(value, window.location.href);
    return url.protocol === "https:" || url.protocol === "http:" ? url.href : "";
  } catch {
    return "";
  }
}

function updateVisitCounter() {
  const totalWorks = projects.filter((project) => !project.placeholder && safeHttpUrl(project.videoUrl)).length;
  const viewedCount = Math.min(viewedProjectIds.size, totalWorks);
  const displayedLimit = offerUnlocked ? totalWorks : Math.min(freeViewLimit, totalWorks);
  visitCounterLabel.textContent = offerUnlocked ? "本次已解锁" : "本次免费查看";
  visitCounterValue.textContent = String(viewedCount).padStart(2, "0");
  visitCounterTotal.textContent = `/ ${String(displayedLimit).padStart(2, "0")}`;
  visitCounter.dataset.unlocked = String(offerUnlocked);
  visitCounter.setAttribute("aria-label", `${visitCounterLabel.textContent} ${viewedCount} / ${displayedLimit}`);
}

function isDirectVideo(url) {
  return /\.(mp4|webm|ogg)(\?|#|$)/i.test(url);
}

function makePoster(project, className = "") {
  if (!project.poster) return null;
  const poster = document.createElement("img");
  poster.className = className;
  poster.src = project.poster;
  poster.alt = "";
  poster.loading = "lazy";
  poster.decoding = "async";
  return poster;
}

function makePendingPreview(project) {
  const pending = document.createElement("div");
  pending.className = "preview-pending";
  const marker = document.createElement("span");
  marker.className = "pending-icon";
  marker.setAttribute("aria-hidden", "true");
  const heading = document.createElement("strong");
  heading.textContent = project.placeholder ? "第六席 · 待更新" : "预览未能加载";
  const note = document.createElement("small");
  note.textContent = project.placeholder ? "后续作品将在这里补充" : "仍可尝试打开完整视频";
  pending.append(marker, heading, note);
  return pending;
}

function restorePoster(preview, project) {
  preview.replaceChildren();
  const poster = makePoster(project, "preview-poster");
  preview.append(poster || makePendingPreview(project));
  preview.classList.remove("has-video");
}

function clearCardPreview(card, project) {
  const preview = card.querySelector(".project-preview");
  if (!preview) return;
  const video = preview.querySelector("video");
  if (video) {
    video.pause();
    video.removeAttribute("src");
    video.load();
  }
  restorePoster(preview, project);
}

function showCardPreview(card, project) {
  if (!hoverPreviewEnabled || project.placeholder) return;
  const preview = card.querySelector(".project-preview");
  const url = safeHttpUrl(project.previewUrl);
  if (!preview || !url || preview.querySelector("video")) return;
  preview.replaceChildren();
  const video = document.createElement("video");
  video.src = url;
  video.poster = safeHttpUrl(project.poster);
  video.muted = true;
  video.loop = true;
  video.playsInline = true;
  video.autoplay = true;
  video.preload = "none";
  video.setAttribute("aria-hidden", "true");
  video.addEventListener("canplay", () => preview.classList.add("has-video"), { once: true });
  preview.append(video);
  video.play().catch(() => {});
}

function renderFilters() {
  filterList.replaceChildren();
  categories.forEach((category) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "filter-button";
    button.textContent = category.label;
    button.setAttribute("aria-pressed", String(activeCategory === category.id));
    button.addEventListener("click", () => {
      activeCategory = category.id;
      renderFilters();
      renderProjects();
      updatePageProgress();
    });
    filterList.append(button);
  });
}

function openProject(project) {
  const url = safeHttpUrl(project.videoUrl);
  if (!url) return false;
  document.querySelector("#dialog-title").textContent = project.title;
  document.querySelector("#dialog-label").textContent = `${project.categoryLabel} / ${project.duration}`;
  document.querySelector("#dialog-lead").textContent = project.summary;
  videoStage.replaceChildren();

  if (isDirectVideo(url)) {
    const video = document.createElement("video");
    video.src = url;
    video.poster = safeHttpUrl(project.poster);
    video.controls = true;
    video.playsInline = true;
    video.preload = "metadata";
    video.setAttribute("aria-label", `${project.title}完整视频`);
    videoStage.append(video);
    videoDialog.showModal();
    video.play().catch(() => {});
  } else {
    const frame = document.createElement("iframe");
    frame.src = url;
    frame.title = `${project.title}视频作品`;
    frame.allow = "autoplay; encrypted-media; picture-in-picture; fullscreen";
    frame.allowFullscreen = true;
    videoStage.append(frame);
    videoDialog.showModal();
  }
  return true;
}

function requestProjectAccess(project) {
  const isNewWork = !viewedProjectIds.has(project.id);
  if (isNewWork && !offerUnlocked && viewedProjectIds.size >= freeViewLimit) {
    pendingOfferProject = project;
    if (!offerDialog.open) offerDialog.showModal();
    return;
  }

  if (openProject(project) && isNewWork) {
    viewedProjectIds.add(project.id);
    updateVisitCounter();
  }
}

function triggerCelebration() {
  window.clearTimeout(celebrationTimer);
  celebrationLayer.replaceChildren();
  celebrationLayer.classList.add("is-celebrating");
  const colors = ["#c53c34", "#e6c67e", "#fff4df", "#6f9fae", "#9b7042"];

  for (let index = 0; index < 34; index += 1) {
    const piece = document.createElement("i");
    piece.className = "celebration-confetti";
    piece.style.setProperty("--x", `${Math.random() * 100}%`);
    piece.style.setProperty("--drift", `${Math.round(Math.random() * 180 - 90)}px`);
    piece.style.setProperty("--fall", `${Math.round(260 + Math.random() * 260)}px`);
    piece.style.setProperty("--spin", `${Math.round(Math.random() * 780 - 390)}deg`);
    piece.style.setProperty("--delay", `${Math.round(Math.random() * 190)}ms`);
    piece.style.setProperty("--duration", `${Math.round(820 + Math.random() * 480)}ms`);
    piece.style.setProperty("--piece-color", colors[index % colors.length]);
    celebrationLayer.append(piece);
  }

  ["left", "middle", "right"].forEach((position) => {
    const spark = document.createElement("span");
    spark.className = `celebration-firework celebration-firework-${position}`;
    celebrationLayer.append(spark);
  });

  const stamp = document.createElement("span");
  stamp.className = "celebration-stamp";
  stamp.textContent = "OFFER ACCEPTED · 档案已解锁";
  celebrationLayer.append(stamp);
  celebrationTimer = window.setTimeout(() => {
    celebrationLayer.classList.remove("is-celebrating");
    celebrationLayer.replaceChildren();
  }, 1600);
}

function unlockWithOffer() {
  offerUnlocked = true;
  const nextProject = pendingOfferProject;
  pendingOfferProject = null;
  if (offerDialog.open) offerDialog.close();
  updateVisitCounter();

  if (nextProject && openProject(nextProject)) {
    viewedProjectIds.add(nextProject.id);
    updateVisitCounter();
    triggerCelebration();
  }
}

function renderProjects() {
  const visible = projects.filter((project) => activeCategory === "all" || project.category === activeCategory);
  const uploaded = visible.filter((project) => !project.placeholder).length;
  count.textContent = String(uploaded).padStart(2, "0");
  grid.replaceChildren();
  const columns = cardsPerRow();
  let row = null;

  visible.forEach((project, index) => {
    if (index % columns === 0) {
      row = document.createElement("div");
      row.className = "project-row";
      if (index > 0) row.dataset.scrollStop = "";
      grid.append(row);
    }
    const card = document.createElement("article");
    card.className = `project-card reveal${project.placeholder ? " project-card-reserved" : ""}`;
    card.style.setProperty("--card-order", String(index));

    const flip = document.createElement("div");
    flip.className = "project-flip";

    const front = document.createElement("div");
    front.className = "project-face project-front";

    const cover = document.createElement("button");
    cover.type = "button";
    cover.className = `project-cover${project.placeholder ? " project-cover-reserved" : ""}`;
    cover.setAttribute("aria-expanded", "false");
    cover.setAttribute("aria-label", `${project.title}，翻开卡牌查看${project.placeholder ? "预留作品位" : "动效预览"}`);
    const poster = makePoster(project, "cover-image");
    if (poster) cover.append(poster);
    const wash = document.createElement("span");
    wash.className = "cover-wash";
    const frame = document.createElement("span");
    frame.className = "viewfinder";
    frame.setAttribute("aria-hidden", "true");
    const coverTop = document.createElement("span");
    coverTop.className = "cover-topline";
    const coverBrand = document.createElement("span");
    coverBrand.textContent = project.placeholder ? "作品档案 / RESERVED" : `作品档案 / ${project.id}`;
    const coverCue = document.createElement("span");
    coverCue.className = "cover-cue";
    coverCue.textContent = project.placeholder ? "NEXT / 06" : "悬停翻面 ↻";
    coverTop.append(coverBrand, coverCue);
    const coverBottom = document.createElement("span");
    coverBottom.className = "cover-bottomline";
    const coverNumber = document.createElement("strong");
    coverNumber.textContent = project.id;
    const coverDuration = document.createElement("span");
    coverDuration.textContent = project.duration;
    coverBottom.append(coverNumber, coverDuration);
    cover.append(wash, frame, coverTop, coverBottom);

    const meta = document.createElement("div");
    meta.className = "project-meta";
    const number = document.createElement("span");
    number.className = "project-number";
    number.textContent = `作品 ${project.id}`;
    const category = document.createElement("span");
    category.className = "project-category";
    category.textContent = project.categoryLabel;
    meta.append(number, category);

    const title = document.createElement("h3");
    title.textContent = project.title;
    const summary = document.createElement("p");
    summary.className = "project-summary";
    summary.textContent = project.summary;
    front.append(cover, meta, title, summary);

    const back = document.createElement("div");
    back.className = "project-face project-back";
    const backTop = document.createElement("div");
    backTop.className = "back-topline";
    const backIndex = document.createElement("span");
    backIndex.textContent = `动效预览 / ${project.id}`;
    const backStatus = document.createElement("span");
    backStatus.className = project.placeholder ? "back-status is-reserved" : "back-status";
    backStatus.textContent = project.placeholder ? "待更新" : "● 动态片段";
    backTop.append(backIndex, backStatus);

    const preview = document.createElement("div");
    preview.className = "project-preview";
    restorePoster(preview, project);

    const backBottom = document.createElement("div");
    backBottom.className = "back-bottomline";
    const backInfo = document.createElement("div");
    backInfo.className = "back-info";
    const focusLabel = document.createElement("small");
    focusLabel.textContent = project.placeholder ? "作品状态" : "动效观察点";
    const focusList = document.createElement("p");
    focusList.className = "focus-list";
    focusList.textContent = project.focus.join(" / ");
    backInfo.append(focusLabel, focusList);

    const actions = document.createElement("div");
    actions.className = "back-actions";
    const returnButton = document.createElement("button");
    returnButton.type = "button";
    returnButton.className = "return-button";
    returnButton.textContent = "返回封面";
    const watchButton = document.createElement("button");
    watchButton.type = "button";
    watchButton.className = "watch-button";
    watchButton.textContent = project.placeholder ? "待补充" : "完整播放 ↗";
    watchButton.disabled = !safeHttpUrl(project.videoUrl);
    watchButton.setAttribute("aria-label", `${project.title}${watchButton.disabled ? "，作品待补充" : "，播放完整视频"}`);
    actions.append(returnButton, watchButton);
    backBottom.append(backInfo, actions);
    back.append(backTop, preview, backBottom);

    flip.append(front, back);
    card.append(flip);

    cover.addEventListener("focus", () => card.classList.add("is-front-focused"));
    cover.addEventListener("click", () => {
      card.classList.add("is-flipped");
      card.classList.remove("is-front-focused");
      cover.setAttribute("aria-expanded", "true");
      if (hoverPreviewEnabled) showCardPreview(card, project);
      requestAnimationFrame(() => watchButton.focus({ preventScroll: true }));
    });
    returnButton.addEventListener("click", () => {
      card.classList.remove("is-flipped");
      cover.setAttribute("aria-expanded", "false");
      clearCardPreview(card, project);
      cover.focus({ preventScroll: true });
    });
    watchButton.addEventListener("click", () => {
      clearCardPreview(card, project);
      requestProjectAccess(project);
    });

    card.addEventListener("mouseenter", () => showCardPreview(card, project));
    card.addEventListener("mouseleave", () => {
      if (!card.matches(":focus-within")) {
        cover.setAttribute("aria-expanded", "false");
        clearCardPreview(card, project);
      }
    });
    card.addEventListener("focusin", (event) => {
      if (event.target === cover) {
        card.classList.add("is-front-focused");
      } else {
        card.classList.remove("is-front-focused");
        if (event.target === watchButton) showCardPreview(card, project);
      }
    });
    card.addEventListener("focusout", (event) => {
      if (!card.contains(event.relatedTarget)) {
        card.classList.remove("is-flipped", "is-front-focused");
        cover.setAttribute("aria-expanded", "false");
        clearCardPreview(card, project);
      }
    });
    row.append(card);
  });

  const cards = grid.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver((entries, currentObserver) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          currentObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08 });
    cards.forEach((card) => observer.observe(card));
  } else {
    cards.forEach((card) => card.classList.add("is-visible"));
  }
}

function renderExperience() {
  const list = document.querySelector("#experience-list");
  list.replaceChildren();
  experience.forEach((item, index) => {
    const article = document.createElement("article");
    article.className = "experience-item";
    const rail = document.createElement("div");
    rail.className = "experience-rail";
    const period = document.createElement("time");
    period.textContent = item.period;
    const type = document.createElement("span");
    type.textContent = item.type;
    rail.append(period, type);
    const body = document.createElement("div");
    body.className = "experience-body";
    const title = document.createElement("h3");
    title.textContent = item.title;
    const lead = document.createElement("strong");
    lead.textContent = item.lead;
    const detail = document.createElement("p");
    detail.textContent = item.detail;
    const tags = document.createElement("div");
    tags.className = "experience-tags";
    item.tags.forEach((tagText) => {
      const tag = document.createElement("span");
      tag.textContent = tagText;
      tags.append(tag);
    });
    body.append(title, lead, detail, tags);
    article.append(rail, body);
    article.style.setProperty("--experience-order", String(index));
    list.append(article);
  });

  const skillList = document.querySelector("#skill-list");
  skillList.replaceChildren();
  profile.skills.forEach((skill) => {
    const chip = document.createElement("span");
    chip.textContent = skill;
    skillList.append(chip);
  });

  const methodList = document.querySelector("#method-list");
  methodList.replaceChildren();
  principles.forEach((principle) => {
    const item = document.createElement("article");
    item.className = "method-item";
    const number = document.createElement("span");
    number.className = "method-number";
    number.textContent = principle.no;
    const title = document.createElement("h3");
    title.textContent = principle.title;
    const text = document.createElement("p");
    text.textContent = principle.text;
    item.append(number, title, text);
    methodList.append(item);
  });
}

function renderContacts() {
  const items = [
    { id: "wechat", label: "微信号", value: profile.contacts.wechat, kind: "copy", icon: "微", action: "点击复制" },
    { id: "email", label: "QQ 邮箱", value: profile.contacts.email, kind: "email", icon: "邮", action: "发送邮件" },
    { id: "phone", label: "手机号", value: profile.contacts.phone, kind: "phone", icon: "电", action: "拨打电话" }
  ];
  contactMethods.replaceChildren();
  items.forEach((item) => {
    const card = document.createElement(item.kind === "copy" ? "button" : "a");
    card.className = "contact-method";
    if (item.kind === "copy") {
      card.type = "button";
      card.addEventListener("click", async () => {
        try {
          await navigator.clipboard.writeText(item.value);
          contactFeedback.textContent = "微信号已复制。";
        } catch {
          contactFeedback.textContent = "微信号已显示，可长按号码复制。";
        }
      });
    } else {
      card.href = item.kind === "email" ? `mailto:${item.value}` : `tel:${item.value}`;
    }
    const icon = document.createElement("span");
    icon.className = "contact-method-icon";
    icon.setAttribute("aria-hidden", "true");
    icon.textContent = item.icon;
    const label = document.createElement("small");
    label.textContent = item.label;
    const value = document.createElement("strong");
    value.textContent = item.value;
    const action = document.createElement("span");
    action.className = "contact-method-action";
    action.textContent = item.action;
    card.append(icon, label, value, action);
    contactMethods.append(card);
  });
}

videoClose.addEventListener("click", () => videoDialog.close());
videoDialog.addEventListener("click", (event) => {
  if (event.target === videoDialog) videoDialog.close();
});
videoDialog.addEventListener("close", () => {
  videoStage.querySelectorAll("video").forEach((video) => {
    video.pause();
    video.removeAttribute("src");
    video.load();
  });
  videoStage.replaceChildren();
  window.clearTimeout(celebrationTimer);
  celebrationLayer.classList.remove("is-celebrating");
  celebrationLayer.replaceChildren();
});

offerClose.addEventListener("click", () => offerDialog.close());
offerDialog.addEventListener("click", (event) => {
  if (event.target === offerDialog) offerDialog.close();
});
offerDialog.addEventListener("close", () => {
  if (!offerUnlocked) pendingOfferProject = null;
});
offerSend.addEventListener("click", unlockWithOffer);
offerSendNow.addEventListener("click", unlockWithOffer);

contactOpen.addEventListener("click", () => {
  contactFeedback.textContent = "";
  contactDialog.showModal();
});
contactClose.addEventListener("click", () => contactDialog.close());
contactDialog.addEventListener("click", (event) => {
  if (event.target === contactDialog) contactDialog.close();
});

renderFilters();
renderProjects();
renderExperience();
renderContacts();
updateVisitCounter();
setupPageScrolling();

window.addEventListener("pageshow", (event) => {
  if (!event.persisted) return;
  viewedProjectIds.clear();
  offerUnlocked = false;
  pendingOfferProject = null;
  if (offerDialog.open) offerDialog.close();
  updateVisitCounter();
});
