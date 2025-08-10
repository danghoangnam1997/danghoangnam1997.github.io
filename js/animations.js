// animations.js
document.addEventListener("DOMContentLoaded", () => {
  if (typeof gsap === "undefined") return;

  // ====== Reveal Animations ======
  const revealEls = document.querySelectorAll("[data-reveal]");
  revealEls.forEach((el) => {
    const direction = el.dataset.reveal || "up";
    const delay = parseFloat(el.dataset.delay) || 0;
    let x = 0,
      y = 0;
    if (direction === "up") y = 30;
    if (direction === "down") y = -30;
    if (direction === "left") x = 30;
    if (direction === "right") x = -30;

    gsap.from(el, {
      scrollTrigger: {
        trigger: el,
        start: "top 85%",
      },
      opacity: 0,
      x,
      y,
      duration: 0.8,
      delay,
      ease: "power3.out",
    });
  });

  // ====== Page Transition ======
  const pageTransition = document.getElementById("page-transition");
  if (pageTransition) {
    document.querySelectorAll("a[href]").forEach((link) => {
      const url = new URL(link.href, location.href);
      if (url.origin === location.origin) {
        link.addEventListener("click", (e) => {
          if (
            link.target === "_blank" ||
            link.hasAttribute("download") ||
            link.href.includes("#")
          )
            return;
          e.preventDefault();
          gsap.to(pageTransition, {
            opacity: 1,
            duration: 0.4,
            onComplete: () => {
              window.location.href = link.href;
            },
          });
        });
      }
    });

    window.addEventListener("pageshow", () => {
      gsap.to(pageTransition, { opacity: 0, duration: 0.4 });
    });
  }

  // ====== Preloader ======
  const preloader = document.getElementById("preloader");
  if (preloader) {
    window.addEventListener("load", () => {
      gsap.to(preloader, {
        opacity: 0,
        duration: 0.5,
        onComplete: () => preloader.remove(),
      });
    });
  }
});