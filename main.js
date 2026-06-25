/* ============================================================
   Pooja Singhal — Portfolio interactions
   ============================================================ */
(function () {
  "use strict";

  const nav = document.getElementById("nav");
  const navToggle = document.getElementById("navToggle");
  const navLinks = document.getElementById("navLinks");
  const links = Array.from(document.querySelectorAll(".nav__link"));
  const sections = links
    .map((l) => document.querySelector(l.getAttribute("href")))
    .filter(Boolean);

  /* ---- sticky nav shadow on scroll ---- */
  const onScroll = () => {
    if (window.scrollY > 30) nav.classList.add("scrolled");
    else nav.classList.remove("scrolled");
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---- mobile menu ---- */
  const closeMenu = () => {
    navLinks.classList.remove("open");
    navToggle.classList.remove("open");
    navToggle.setAttribute("aria-expanded", "false");
  };
  navToggle.addEventListener("click", () => {
    const open = navLinks.classList.toggle("open");
    navToggle.classList.toggle("open", open);
    navToggle.setAttribute("aria-expanded", String(open));
  });
  navLinks.addEventListener("click", (e) => {
    if (e.target.closest("a")) closeMenu();
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeMenu();
  });

  /* ---- scroll reveal ---- */
  const revealEls = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    const revObs = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("in");
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );
    revealEls.forEach((el) => revObs.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add("in"));
  }

  /* ---- active nav link highlighting ---- */
  if ("IntersectionObserver" in window && sections.length) {
    const spyObs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = entry.target.getAttribute("id");
            links.forEach((l) =>
              l.classList.toggle("active", l.getAttribute("href") === "#" + id)
            );
          }
        });
      },
      { threshold: 0.5, rootMargin: "-80px 0px -55% 0px" }
    );
    sections.forEach((s) => spyObs.observe(s));
  }

  /* ---- animated metric counters ---- */
  const counters = document.querySelectorAll(".metric__num");
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const animateCount = (el) => {
    const target = parseFloat(el.dataset.target);
    const prefix = el.dataset.prefix || "";
    const suffix = el.dataset.suffix || "";
    if (reduceMotion || isNaN(target)) {
      el.textContent = prefix + target + suffix;
      return;
    }
    const duration = 1300;
    const start = performance.now();
    const step = (now) => {
      const p = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3); // easeOutCubic
      const val = Math.round(target * eased);
      el.textContent = prefix + val + suffix;
      if (p < 1) requestAnimationFrame(step);
      else el.textContent = prefix + target + suffix;
    };
    requestAnimationFrame(step);
  };

  if ("IntersectionObserver" in window) {
    const countObs = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            animateCount(entry.target);
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.6 }
    );
    counters.forEach((c) => countObs.observe(c));
  }

  /* ---- contact form (Formspree, AJAX submit) ---- */
  const form = document.getElementById("contactForm");
  const status = document.getElementById("formStatus");
  if (form && status) {
    form.addEventListener("submit", async (e) => {
      e.preventDefault();

      // Not configured yet -> fall back to a mailto so the form is never a dead end.
      if (form.action.indexOf("YOUR_FORM_ID") !== -1) {
        const data = new FormData(form);
        const subject = encodeURIComponent("Portfolio contact from " + (data.get("name") || ""));
        const body = encodeURIComponent(
          (data.get("message") || "") + "\n\n— " + (data.get("name") || "") + " (" + (data.get("email") || "") + ")"
        );
        window.location.href =
          "mailto:singhal.pooja9@gmail.com?subject=" + subject + "&body=" + body;
        return;
      }

      const btn = form.querySelector("button[type=submit]");
      const original = btn.textContent;
      btn.disabled = true;
      btn.textContent = "Sending…";
      status.textContent = "";
      status.className = "contact-form__status";

      try {
        const res = await fetch(form.action, {
          method: "POST",
          body: new FormData(form),
          headers: { Accept: "application/json" },
        });
        if (res.ok) {
          form.reset();
          status.textContent = "Thanks! Your message is on its way. I'll reply soon.";
          status.classList.add("is-ok");
        } else {
          const j = await res.json().catch(() => ({}));
          status.textContent =
            (j.errors && j.errors.map((x) => x.message).join(", ")) ||
            "Something went wrong. Please email me directly.";
          status.classList.add("is-err");
        }
      } catch (_) {
        status.textContent = "Network error. Please email me directly.";
        status.classList.add("is-err");
      } finally {
        btn.disabled = false;
        btn.textContent = original;
      }
    });
  }
})();
