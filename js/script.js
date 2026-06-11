// Menu mobile simples e acessível para a primeira etapa da Home.
const navToggle = document.querySelector(".nav-toggle");
const siteNav = document.querySelector(".site-nav");

if (navToggle && siteNav) {
  const closeMenu = () => {
    navToggle.setAttribute("aria-expanded", "false");
    siteNav.classList.remove("is-open");
  };

  navToggle.addEventListener("click", () => {
    const isExpanded = navToggle.getAttribute("aria-expanded") === "true";

    navToggle.setAttribute("aria-expanded", String(!isExpanded));
    siteNav.classList.toggle("is-open");
  });

  siteNav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      closeMenu();
    });
  });

  document.addEventListener("click", (event) => {
    const isOpen = navToggle.getAttribute("aria-expanded") === "true";

    if (isOpen && !siteNav.contains(event.target) && !navToggle.contains(event.target)) {
      closeMenu();
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeMenu();
    }
  });
}
