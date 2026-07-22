const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const header = document.querySelector("[data-header]");
const menuButton = document.querySelector("[data-menu]");
const nav = document.querySelector("[data-nav]");
const menuLinks = [...nav.querySelectorAll("a")];
const progressBar = document.querySelector(".page-progress span");
const mobileMenuQuery = window.matchMedia("(max-width: 900px)");
const introWasSeen = document.documentElement.classList.contains("intro-seen");

document.querySelector("[data-year]").textContent = new Date().getFullYear();
try {
  sessionStorage.setItem("portfolio-intro-seen", "true");
} catch (_) {
  // The intro still works when session storage is unavailable.
}

function updatePageChrome() {
  header.classList.toggle("scrolled", window.scrollY > 32);
  const scrollableHeight = document.documentElement.scrollHeight - window.innerHeight;
  const progress = scrollableHeight > 0 ? window.scrollY / scrollableHeight : 0;
  progressBar.style.transform = `scaleX(${Math.min(1, Math.max(0, progress))})`;
}

let scrollFramePending = false;
function requestPageChromeUpdate() {
  if (scrollFramePending) return;
  scrollFramePending = true;
  requestAnimationFrame(() => {
    updatePageChrome();
    scrollFramePending = false;
  });
}

updatePageChrome();
window.addEventListener("scroll", requestPageChromeUpdate, { passive: true });
window.addEventListener("resize", requestPageChromeUpdate, { passive: true });

function setMenuState(open, restoreFocus = true) {
  document.body.classList.toggle("menu-open", open);
  document.documentElement.classList.toggle("menu-open", open);
  menuButton.setAttribute("aria-expanded", String(open));
  menuButton.setAttribute("aria-label", open ? "Stäng meny" : "Öppna meny");

  if (open) {
    requestAnimationFrame(() => menuLinks[0]?.focus({ preventScroll: true }));
  } else if (restoreFocus) {
    menuButton.focus({ preventScroll: true });
  }
}

menuButton.addEventListener("click", () => {
  setMenuState(!document.body.classList.contains("menu-open"));
});

nav.addEventListener("click", (event) => {
  if (!event.target.matches("a")) return;
  setMenuState(false, false);
});

document.addEventListener("keydown", (event) => {
  if (!document.body.classList.contains("menu-open")) return;

  if (event.key === "Escape") {
    event.preventDefault();
    setMenuState(false);
    return;
  }

  if (event.key !== "Tab") return;
  const focusableElements = [...menuLinks, menuButton];
  const first = focusableElements[0];
  const last = focusableElements[focusableElements.length - 1];

  if (event.shiftKey && document.activeElement === first) {
    event.preventDefault();
    last.focus();
  } else if (!event.shiftKey && document.activeElement === last) {
    event.preventDefault();
    first.focus();
  }
});

mobileMenuQuery.addEventListener("change", (event) => {
  if (!event.matches && document.body.classList.contains("menu-open")) {
    setMenuState(false, false);
  }
});

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("in-view");
      revealObserver.unobserve(entry.target);
    });
  },
  { threshold: 0.1, rootMargin: "0px 0px -7%" },
);

document.querySelectorAll(".reveal").forEach((element, index) => {
  if (element.closest(".hero")) {
    const baseDelay = introWasSeen ? 0.05 : 0.78;
    element.style.transitionDelay = `${baseDelay + index * 0.07}s`;
  }
  revealObserver.observe(element);
});

const sections = [...document.querySelectorAll("main section[id]")];
const navLinks = [...document.querySelectorAll(".nav a")];
const sectionObserver = new IntersectionObserver(
  (entries) => {
    const visible = entries.find((entry) => entry.isIntersecting);
    if (!visible) return;
    navLinks.forEach((link) => {
      link.classList.toggle("active", link.hash === `#${visible.target.id}`);
    });
  },
  { rootMargin: "-30% 0px -60%", threshold: 0 },
);
sections.forEach((section) => sectionObserver.observe(section));

if (!reducedMotion && window.matchMedia("(pointer: fine)").matches) {
  window.addEventListener(
    "pointermove",
    (event) => {
      document.documentElement.style.setProperty("--mouse-x", `${event.clientX}px`);
      document.documentElement.style.setProperty("--mouse-y", `${event.clientY}px`);
    },
    { passive: true },
  );

  document.querySelectorAll("[data-tilt]").forEach((card) => {
    card.addEventListener("pointermove", (event) => {
      const rect = card.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width - 0.5;
      const y = (event.clientY - rect.top) / rect.height - 0.5;
      card.style.transform = `perspective(1100px) rotateX(${y * -2.5}deg) rotateY(${x * 3}deg)`;
    });
    card.addEventListener("pointerleave", () => {
      card.style.transform = "perspective(1100px) rotateX(0) rotateY(0)";
    });
  });

  document.querySelectorAll(".magnetic").forEach((element) => {
    element.addEventListener("pointermove", (event) => {
      const rect = element.getBoundingClientRect();
      const x = event.clientX - rect.left - rect.width / 2;
      const y = event.clientY - rect.top - rect.height / 2;
      element.style.transform = `translate(${x * 0.08}px, ${y * 0.12}px)`;
    });
    element.addEventListener("pointerleave", () => {
      element.style.transform = "translate(0, 0)";
    });
  });

  const cursorOrb = document.querySelector(".cursor-orb");
  window.addEventListener(
    "pointermove",
    (event) => {
      cursorOrb.style.left = `${event.clientX}px`;
      cursorOrb.style.top = `${event.clientY}px`;
    },
    { passive: true },
  );
  document.addEventListener("pointerover", (event) => {
    const target = event.target.closest("[data-cursor]");
    if (!target) return;
    cursorOrb.querySelector("span").textContent = target.dataset.cursor || "Öppna";
    cursorOrb.classList.add("is-visible");
  });
  document.addEventListener("pointerout", (event) => {
    const target = event.target.closest("[data-cursor]");
    if (!target || target.contains(event.relatedTarget)) return;
    cursorOrb.classList.remove("is-visible");
  });
  document.documentElement.addEventListener("mouseleave", () => cursorOrb.classList.remove("is-visible"));
}

const heroFocusContent = {
  backend: "API:er, datalager och validering.",
  frontend: "Responsiva gränssnitt i React och Next.js.",
  integration: "Systemintegration, Azure och CI/CD.",
};
const heroFocusButtons = [...document.querySelectorAll("[data-hero-focus]")];
const heroFocusCopy = document.querySelector("[data-hero-focus-copy]");
const routeNodes = [...document.querySelectorAll("[data-route-node]")];
const routeOrder = ["idea", "backend", "frontend", "integration"];

heroFocusButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const focus = button.dataset.heroFocus;
    heroFocusButtons.forEach((item) => {
      const active = item === button;
      item.classList.toggle("is-active", active);
      item.setAttribute("aria-pressed", String(active));
    });
    const focusIndex = routeOrder.indexOf(focus);
    routeNodes.forEach((node) => node.classList.toggle("is-active", routeOrder.indexOf(node.dataset.routeNode) <= focusIndex));
    heroFocusCopy.animate?.(
      [
        { opacity: 0, transform: "translateY(5px)" },
        { opacity: 1, transform: "translateY(0)" },
      ],
      { duration: reducedMotion ? 1 : 280, easing: "ease-out" },
    );
    heroFocusCopy.textContent = heroFocusContent[focus];
  });
});

const projectFilterButtons = [...document.querySelectorAll("[data-project-filter]")];
const projects = [...document.querySelectorAll(".project[data-category]")];
const projectStatus = document.querySelector("[data-project-status]");

projectFilterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const filter = button.dataset.projectFilter;
    const updateProjects = () => {
      let visibleCount = 0;
      projects.forEach((project) => {
        const visible = filter === "all" || project.dataset.category === filter;
        project.hidden = !visible;
        if (visible) visibleCount += 1;
      });
      projectFilterButtons.forEach((item) => {
        const active = item === button;
        item.classList.toggle("is-active", active);
        item.setAttribute("aria-pressed", String(active));
      });
      projectStatus.textContent = filter === "all" ? "Visar alla 9 projekt" : `Visar ${visibleCount} projekt`;
    };

    if (!reducedMotion && document.startViewTransition) {
      try {
        document.startViewTransition(updateProjects);
      } catch (_) {
        updateProjects();
      }
      return;
    }
    updateProjects();
  });
});

const processDeck = document.querySelector("[data-process-deck]");
const processCards = [...document.querySelectorAll("[data-process-card]")];
const processCount = document.querySelector("[data-process-count]");
const processProgress = document.querySelector("[data-process-progress]");
const processPrevious = document.querySelector("[data-process-prev]");
const processNext = document.querySelector("[data-process-next]");
let processIndex = 0;
let processStartX = 0;
let processDragX = 0;
let suppressProcessClickUntil = 0;

function updateProcessDeck(nextIndex) {
  processIndex = (nextIndex + processCards.length) % processCards.length;
  processCards.forEach((card, cardIndex) => {
    const position = (cardIndex - processIndex + processCards.length) % processCards.length;
    card.dataset.position = String(position);
    card.classList.toggle("is-active", position === 0);
    card.setAttribute("aria-hidden", String(position !== 0));
    card.style.removeProperty("--drag-x");
    card.style.removeProperty("--drag-r");
  });
  processCount.textContent = `${String(processIndex + 1).padStart(2, "0")} / 03`;
  processProgress.style.transform = `scaleX(${(processIndex + 1) / processCards.length})`;
}

processPrevious.addEventListener("click", () => updateProcessDeck(processIndex - 1));
processNext.addEventListener("click", () => updateProcessDeck(processIndex + 1));
processDeck.addEventListener("click", (event) => {
  if (Date.now() < suppressProcessClickUntil || event.target.closest("button")) return;
  updateProcessDeck(processIndex + 1);
});
processDeck.addEventListener("keydown", (event) => {
  if (!["ArrowLeft", "ArrowRight", "Enter", " "].includes(event.key)) return;
  event.preventDefault();
  updateProcessDeck(event.key === "ArrowLeft" ? processIndex - 1 : processIndex + 1);
});

processCards.forEach((card) => {
  card.addEventListener("pointerdown", (event) => {
    if (card.dataset.position !== "0" || event.button !== 0) return;
    processStartX = event.clientX;
    processDragX = 0;
    card.classList.add("is-dragging");
    card.setPointerCapture(event.pointerId);
  });
  card.addEventListener("pointermove", (event) => {
    if (!card.classList.contains("is-dragging")) return;
    processDragX = event.clientX - processStartX;
    card.style.setProperty("--drag-x", `${processDragX}px`);
    card.style.setProperty("--drag-r", `${processDragX * 0.018}deg`);
  });
  card.addEventListener("pointerup", (event) => {
    if (!card.classList.contains("is-dragging")) return;
    card.classList.remove("is-dragging");
    card.releasePointerCapture(event.pointerId);
    if (Math.abs(processDragX) > 65) {
      suppressProcessClickUntil = Date.now() + 350;
      updateProcessDeck(processDragX < 0 ? processIndex + 1 : processIndex - 1);
    } else {
      card.style.removeProperty("--drag-x");
      card.style.removeProperty("--drag-r");
    }
  });
  card.addEventListener("pointercancel", () => {
    card.classList.remove("is-dragging");
    card.style.removeProperty("--drag-x");
    card.style.removeProperty("--drag-r");
  });
});
updateProcessDeck(0);

const stackContent = {
  backend: {
    label: "BACKEND",
    title: "Backend",
    description: "C#, ASP.NET Core, Web API, Entity Framework och SQL.",
    pipeline: ["C#", "ASP.NET Core", "Web API"],
    tools: ["C#", "ASP.NET Core", "Razor Pages", "Web API", "Entity Framework", "SQL"],
  },
  frontend: {
    label: "FRONTEND",
    title: "Frontend",
    description: "TypeScript, JavaScript, React, Next.js, HTML och CSS.",
    pipeline: ["TypeScript", "React / Next.js", "UI"],
    tools: ["TypeScript", "JavaScript", "React", "Next.js", "HTML", "CSS"],
  },
  delivery: {
    label: "LEVERANS OCH INTEGRATION",
    title: "Integration och leverans",
    description: "Azure, Azure DevOps, CI/CD, Docker, Git, Umbraco, Optimizely och Swish.",
    pipeline: ["Integration", "Azure / CI/CD", "Live"],
    tools: ["Azure", "Azure DevOps", "CI/CD", "Docker", "Git", "Umbraco", "Optimizely", "Swish"],
  },
};
const stackTabs = [...document.querySelectorAll("[data-stack-tab]")];
const stackPanel = document.querySelector(".stack-panel");
const stackPipeline = document.querySelector("[data-stack-pipeline]");
const stackLabel = document.querySelector("[data-stack-label]");
const stackTitle = document.querySelector("[data-stack-title]");
const stackDescription = document.querySelector("[data-stack-description]");
const stackTools = document.querySelector("[data-stack-tools]");

function selectStack(tab, focusPanel = false) {
  const content = stackContent[tab.dataset.stackTab];
  stackTabs.forEach((item) => {
    const active = item === tab;
    item.classList.toggle("is-active", active);
    item.setAttribute("aria-selected", String(active));
    item.tabIndex = active ? 0 : -1;
  });
  stackLabel.textContent = content.label;
  stackTitle.textContent = content.title;
  stackDescription.textContent = content.description;
  stackPipeline.innerHTML = content.pipeline.map((item, index) => `${index ? "<i></i>" : ""}<span>${item}</span>`).join("");
  stackTools.innerHTML = content.tools.map((item) => `<span>${item}</span>`).join("");
  stackPanel.setAttribute("aria-labelledby", tab.id);
  stackPipeline.classList.remove("is-animating");
  requestAnimationFrame(() => stackPipeline.classList.add("is-animating"));
  if (focusPanel) stackPanel.focus({ preventScroll: true });
}

stackTabs.forEach((tab, index) => {
  tab.addEventListener("click", () => selectStack(tab));
  tab.addEventListener("keydown", (event) => {
    if (!["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown", "Home", "End"].includes(event.key)) return;
    event.preventDefault();
    let nextIndex = index;
    if (["ArrowRight", "ArrowDown"].includes(event.key)) nextIndex = (index + 1) % stackTabs.length;
    if (["ArrowLeft", "ArrowUp"].includes(event.key)) nextIndex = (index - 1 + stackTabs.length) % stackTabs.length;
    if (event.key === "Home") nextIndex = 0;
    if (event.key === "End") nextIndex = stackTabs.length - 1;
    stackTabs[nextIndex].focus();
    selectStack(stackTabs[nextIndex]);
  });
});
selectStack(stackTabs[0]);

const timelineItems = [...document.querySelectorAll(".timeline__item")];
const timelineObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => entry.target.classList.toggle("is-current", entry.isIntersecting));
  },
  { rootMargin: "-38% 0px -42%", threshold: 0 },
);
timelineItems.forEach((item) => timelineObserver.observe(item));

const copyEmailButton = document.querySelector("[data-copy-email]");
const copyEmailStatus = document.querySelector("[data-copy-status]");
copyEmailButton.addEventListener("click", async () => {
  try {
    await navigator.clipboard.writeText("yaarubnassr@gmail.com");
    copyEmailButton.textContent = "Kopierad ✓";
    copyEmailButton.classList.add("is-copied");
    copyEmailStatus.textContent = "Mejladressen är kopierad.";
    window.setTimeout(() => {
      copyEmailButton.textContent = "Kopiera mejladress";
      copyEmailButton.classList.remove("is-copied");
    }, 2200);
  } catch (_) {
    copyEmailStatus.textContent = "Det gick inte att kopiera. Markera adressen och kopiera manuellt.";
  }
});
