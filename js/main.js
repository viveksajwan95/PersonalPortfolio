/* ============================================================
   Vivek Sajwan — Portfolio (Ruixen-style replica)
   Theme, TTS + mute, contribution graph, scroll, mobile menu
   ============================================================ */

(function () {
  "use strict";
  var NS = "http://www.w3.org/2000/svg";

  /* ---------- Theme ---------- */
  var root = document.documentElement;
  var stored = null;
  try {
    stored = localStorage.getItem("theme");
  } catch (e) {
    stored = null;
  }

  var theme =
    stored ||
    (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");

  root.setAttribute("data-theme", theme);
  var metaTheme = document.querySelector('meta[name="theme-color"]');
  if (metaTheme) {
    metaTheme.setAttribute("content", theme === "dark" ? "#09090b" : "#ffffff");
  }

  var themeToggle = document.getElementById("theme-toggle");
  if (themeToggle) {
    themeToggle.addEventListener("click", function () {
      theme = theme === "dark" ? "light" : "dark";
      root.setAttribute("data-theme", theme);
      if (metaTheme) {
        metaTheme.setAttribute("content", theme === "dark" ? "#09090b" : "#ffffff");
      }
      try {
        localStorage.setItem("theme", theme);
      } catch (e) {
        /* ignore */
      }
    });
  }

  /* ---------- Mute ---------- */
  var muted = false;
  try {
    muted = localStorage.getItem("muted") === "1";
  } catch (e) {
    muted = false;
  }
  if (muted) {
    document.body.classList.add("muted");
  }

  var muteBtn = document.getElementById("mute-btn");
  if (muteBtn) {
    muteBtn.addEventListener("click", function () {
      muted = !muted;
      document.body.classList.toggle("muted", muted);
      try {
        localStorage.setItem("muted", muted ? "1" : "0");
      } catch (e) {
        /* ignore */
      }
      if (muted && "speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
    });
  }

  /* ---------- Pronounce my name (TTS) ---------- */
  var nameBtn = document.getElementById("name-tts");
  if (nameBtn) {
    nameBtn.addEventListener("click", function () {
      if (muted) return;
      if (!("speechSynthesis" in window)) return;
      window.speechSynthesis.cancel();
      var u = new SpeechSynthesisUtterance("Vivek Sajwan");
      u.lang = "en-US";
      u.rate = 0.92;
      u.onstart = function () {
        nameBtn.classList.add("speaking");
      };
      u.onend = u.onerror = function () {
        nameBtn.classList.remove("speaking");
      };
      window.speechSynthesis.speak(u);
    });
  }

  /* ---------- Scroll to top ---------- */
  var scrollBtn = document.getElementById("scroll-top");
  var lastY = window.scrollY;

  function onScroll() {
    var y = window.scrollY;
    if (scrollBtn) {
      scrollBtn.setAttribute("data-visible", y > 480 ? "true" : "false");
      scrollBtn.setAttribute(
        "data-scroll-direction",
        y > lastY ? "down" : "up"
      );
    }
    lastY = y;
  }

  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  if (scrollBtn) {
    scrollBtn.addEventListener("click", function () {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  /* ---------- Mobile menu ---------- */
  var menuBtn = document.getElementById("menu-btn");
  var menu = document.getElementById("mobile-menu");

  function closeMenu() {
    if (menu) menu.classList.remove("open");
  }

  if (menuBtn && menu) {
    menuBtn.addEventListener("click", function () {
      menu.classList.toggle("open");
    });
    menu.addEventListener("click", function (e) {
      if (e.target.tagName === "A") closeMenu();
    });
    document.addEventListener("click", function (e) {
      if (
        menu.classList.contains("open") &&
        !menu.contains(e.target) &&
        !menuBtn.contains(e.target)
      ) {
        closeMenu();
      }
    });
  }

  /* ---------- Reveal ---------- */
  var revealEls = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );
    revealEls.forEach(function (el) {
      io.observe(el);
    });
  } else {
    revealEls.forEach(function (el) {
      el.classList.add("visible");
    });
  }

})();
