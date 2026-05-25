(function () {
  "use strict";

  // --- Background Canvas (stars + shooting stars, fixed full-page) ---
  function initHeroCanvas() {
    const canvas = document.getElementById("gradient-canvas");
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    let animFrame = null;
    let tick = 0;
    const stars = [];
    const shooters = [];

    function resize() {
      const dpr = window.devicePixelRatio || 1;
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = window.innerWidth + "px";
      canvas.style.height = window.innerHeight + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      buildStars();
    }

    function buildStars() {
      stars.length = 0;
      for (let i = 0; i < 180; i++) {
        stars.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          r: Math.random() * 1.2 + 0.2,
          baseOpacity: Math.random() * 0.55 + 0.2,
          rate: Math.random() * 0.025 + 0.004,
          phase: Math.random() * Math.PI * 2,
        });
      }
    }

    function spawnShooter() {
      const angle = (Math.random() * 25 + 20) * (Math.PI / 180);
      const speed = Math.random() * 7 + 5;
      shooters.push({
        x: Math.random() * canvas.width * 0.7,
        y: Math.random() * canvas.height * 0.4,
        dx: Math.cos(angle) * speed,
        dy: Math.sin(angle) * speed,
        tail: Math.random() * 100 + 60,
        life: 1.0,
        decay: Math.random() * 0.008 + 0.005,
      });
    }

    function draw() {
      const w = canvas.width;
      const h = canvas.height;

      ctx.fillStyle = "#050505";
      ctx.fillRect(0, 0, w, h);

      stars.forEach((s) => {
        const flicker = (Math.sin(tick * s.rate + s.phase) + 1) * 0.5;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,${s.baseOpacity * (0.5 + flicker * 0.5)})`;
        ctx.fill();
      });

      if (tick > 0 && tick % 210 === 0) spawnShooter();

      for (let i = shooters.length - 1; i >= 0; i--) {
        const s = shooters[i];
        const tx = s.x - s.dx * (s.tail / 8);
        const ty = s.y - s.dy * (s.tail / 8);
        const g = ctx.createLinearGradient(tx, ty, s.x, s.y);
        g.addColorStop(0, "rgba(255,255,255,0)");
        g.addColorStop(1, `rgba(255,255,255,${s.life * 0.85})`);

        ctx.beginPath();
        ctx.moveTo(tx, ty);
        ctx.lineTo(s.x, s.y);
        ctx.strokeStyle = g;
        ctx.lineWidth = 1.2;
        ctx.stroke();

        s.x += s.dx;
        s.y += s.dy;
        s.life -= s.decay;

        if (s.life <= 0 || s.x > w + 150 || s.y > h + 150) {
          shooters.splice(i, 1);
        }
      }

      tick++;
      animFrame = requestAnimationFrame(draw);
    }

    function start() {
      if (animFrame === null) draw();
    }
    function stop() {
      if (animFrame !== null) {
        cancelAnimationFrame(animFrame);
        animFrame = null;
      }
    }

    resize();
    start();
    window.addEventListener("resize", resize, { passive: true });
    document.addEventListener("visibilitychange", () => {
      document.hidden ? stop() : start();
    });
  }

  // --- Sketch Stars ---
  function initSketchStars() {
    const hero = document.getElementById("hero");
    if (!hero) return;

    const configs = [
      { top: "10%", left: "6%", size: 90, rotate: -12, opacity: 0.22 },
      { top: "13%", right: "8%", size: 68, rotate: 18, opacity: 0.17 },
      { bottom: "16%", left: "7%", size: 74, rotate: -6, opacity: 0.18 },
      { bottom: "13%", right: "6%", size: 84, rotate: 10, opacity: 0.2 },
    ];

    let uid = 0;

    function buildStar() {
      const id = "sc-" + ++uid;
      const ns = "http://www.w3.org/2000/svg";
      const svg = document.createElementNS(ns, "svg");
      svg.setAttribute("viewBox", "0 0 100 100");
      svg.setAttribute("aria-hidden", "true");

      const pts = "50,4 62,34 95,34 69,55 80,90 50,71 20,90 31,55 5,34 38,34";

      const defs = document.createElementNS(ns, "defs");
      const cp = document.createElementNS(ns, "clipPath");
      cp.setAttribute("id", id);
      const cpPoly = document.createElementNS(ns, "polygon");
      cpPoly.setAttribute("points", pts);
      cp.appendChild(cpPoly);
      defs.appendChild(cp);
      svg.appendChild(defs);

      const g = document.createElementNS(ns, "g");
      g.setAttribute("clip-path", "url(#" + id + ")");
      g.setAttribute("stroke", "white");
      g.setAttribute("stroke-width", "1.4");

      for (let i = -80; i <= 130; i += 9) {
        const line = document.createElementNS(ns, "line");
        line.setAttribute("x1", i);
        line.setAttribute("y1", "0");
        line.setAttribute("x2", i + 100);
        line.setAttribute("y2", "100");
        g.appendChild(line);
      }
      svg.appendChild(g);

      const poly = document.createElementNS(ns, "polygon");
      poly.setAttribute("points", pts);
      poly.setAttribute("fill", "none");
      poly.setAttribute("stroke", "white");
      poly.setAttribute("stroke-width", "2.2");
      poly.setAttribute("stroke-linejoin", "round");
      svg.appendChild(poly);

      return svg;
    }

    configs.forEach((cfg) => {
      const svg = buildStar();
      svg.style.cssText = [
        "position:absolute",
        cfg.top ? "top:" + cfg.top : "",
        cfg.bottom ? "bottom:" + cfg.bottom : "",
        cfg.left ? "left:" + cfg.left : "",
        cfg.right ? "right:" + cfg.right : "",
        "width:" + cfg.size + "px",
        "height:" + cfg.size + "px",
        "opacity:" + cfg.opacity,
        "transform:rotate(" + cfg.rotate + "deg)",
        "pointer-events:none",
        "z-index:1",
      ]
        .filter(Boolean)
        .join(";");
      hero.appendChild(svg);
    });
  }

  // --- Nav ---
  function initNav() {
    const nav = document.querySelector("nav");
    if (!nav) return;

    window.addEventListener(
      "scroll",
      () => {
        nav.classList.toggle("scrolled", window.scrollY > 112);
      },
      { passive: true },
    );

    nav.addEventListener("click", (e) => {
      const link = e.target.closest('a[href^="#"]');
      if (!link) return;
      const target = document.querySelector(link.getAttribute("href"));
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: "smooth" });
    });
  }

  // --- Music Section ---
  let tracks = [
    {
      id: "3GwsPY8HRsUdDu2ViAmrlP",
      title: "Chuva de Diamantes",
      album: "Chuva de Diamantes",
      year: "2026",
      duration: "3:15",
      spotifyUrl: "https://open.spotify.com/track/3GwsPY8HRsUdDu2ViAmrlP",
      cover: "https://i.scdn.co/image/ab67616d0000b273283629991f3b16015fb4123d",
      previewUrl: "assets/audio/Alomally-Chuva-de-Diamantes.mp3",
    },
    {
      id: "5vDpBrMS1ZupNYUnBVcexm",
      title: "carta desabafo",
      album: "carta desabafo",
      year: "2026",
      duration: "3:03",
      spotifyUrl: "https://open.spotify.com/track/5vDpBrMS1ZupNYUnBVcexm",
      cover: "https://i.scdn.co/image/ab67616d0000b2736e6e2fecc8c9bd51ca6c3e35",
      previewUrl: "assets/audio/Alomally-carta-desabafo_Media.mp3",
    },
    {
      id: "490NVzfgYnVyLPbpe7ZaOm",
      title: "anomalia cósmica",
      album: "anomalia cósmica",
      year: "2025",
      duration: "3:03",
      spotifyUrl: "https://open.spotify.com/track/490NVzfgYnVyLPbpe7ZaOm",
      cover: "https://i.scdn.co/image/ab67616d0000b273c70970af99b82197cfbeec6a",
      previewUrl: "assets/audio/Alomally-anomalia-cosmica_Media.mp3",
    },
    {
      id: "1iJCU8SwT9Rgqp2mE9z7hm",
      title: "Olha pra mim",
      album: "Olha pra mim",
      year: "2026",
      duration: "3:12",
      spotifyUrl: "https://open.spotify.com/track/1iJCU8SwT9Rgqp2mE9z7hm",
      cover: "https://i.scdn.co/image/ab67616d0000b2738c9735efa7577ff5295d33aa",
      previewUrl: "assets/audio/Alomally-Olha-pra-mim_Media.mp3",
    },
    {
      id: "73pg6bw2oobBVfyZmSRYtK",
      title: "mentiras covardes",
      album: "mentiras covardes",
      year: "2025",
      duration: "2:20",
      spotifyUrl: "https://open.spotify.com/track/73pg6bw2oobBVfyZmSRYtK",
      cover: "https://i.scdn.co/image/ab67616d0000b273695efb1afeac17c0863c1d4a",
      previewUrl: "assets/audio/Alomally-mentiras-covardes_Media.mp3",
    },
  ];

  const audio = new Audio();
  audio.preload = "none";

  function initMusicSection() {
    const section = document.getElementById("music");
    if (!section) return;

    const display = section.querySelector(".track-display");
    const titleEl = section.querySelector(".track-title");
    const numberEl = section.querySelector(".track-number");
    const metaEl = section.querySelector(".track-meta");
    const cursorEl = section.querySelector(".scrubber-cursor");
    const ticksEl = section.querySelector(".scrubber-ticks");
    const scrubber = section.querySelector(".track-scrubber");
    const videoBg = section.querySelector(".track-video-bg");
    const videoOverlay = section.querySelector(".track-video-overlay");
    const coverImgEl = section.querySelector(".track-cover-img");
    let currentIndex = -1;
    let pending = null;
    let activeVideoId = null;

    let playPromise = null;
    let loopTimer = null;
    let fadeId = null;
    let stopTimer = null;

    function clearFade() {
      if (fadeId) {
        clearInterval(fadeId);
        fadeId = null;
      }
    }

    function clearStopTimer() {
      if (stopTimer) {
        clearTimeout(stopTimer);
        stopTimer = null;
      }
    }

    function fadeVol(target, ms, cb) {
      clearFade();
      const steps = 20;
      const start = audio.volume;
      const delta = (target - start) / steps;
      let step = 0;
      fadeId = setInterval(() => {
        step++;
        audio.volume = Math.max(0, Math.min(1, start + delta * step));
        if (step >= steps) {
          clearFade();
          if (cb) cb();
        }
      }, ms / steps);
    }

    function doPlay(track) {
      if (!track.previewUrl) return;
      if (playPromise) playPromise.catch(() => {});
      audio.src = track.previewUrl;
      audio.volume = 0;
      audio.load();
      playPromise = audio.play();
      if (playPromise)
        playPromise
          .then(() => {
            fadeVol(1, 1500, () => {
              stopTimer = setTimeout(
                () => fadeVol(0, 2000, () => audio.pause()),
                45000,
              );
            });
          })
          .catch(() => {});
    }

    function startPreview(track) {
      if (!track.previewUrl) return;
      if (loopTimer) {
        clearTimeout(loopTimer);
        loopTimer = null;
      }
      clearFade();
      clearStopTimer();
      if (!audio.paused) {
        fadeVol(0, 300, () => {
          audio.pause();
          doPlay(track);
        });
      } else {
        doPlay(track);
      }
    }

    audio.addEventListener("ended", () => {
      if (currentIndex < 0 || currentIndex >= tracks.length) return;
      clearStopTimer();
      const loopTrack = tracks[currentIndex]; // snapshot now, before timeout fires
      loopTimer = setTimeout(() => startPreview(loopTrack), 5000);
    });

    function setVideoBg(videoId) {
      if (videoId === activeVideoId) return;
      activeVideoId = videoId;

      if (videoId) {
        videoBg.innerHTML = "";
        const iframe = document.createElement("iframe");
        iframe.src =
          "https://www.youtube.com/embed/" +
          videoId +
          "?autoplay=1&mute=1&loop=1&controls=0&rel=0" +
          "&modestbranding=1&playsinline=1&playlist=" +
          videoId;
        iframe.allow = "autoplay; encrypted-media";
        iframe.setAttribute("aria-hidden", "true");
        iframe.title = "";
        videoBg.appendChild(iframe);
        videoBg.classList.add("active");
        videoOverlay.classList.add("active");
      } else {
        videoBg.classList.remove("active");
        videoOverlay.classList.remove("active");
      }
    }

    // Build tick marks
    tracks.forEach((_, i) => {
      const tick = document.createElement("span");
      tick.className = "scrubber-tick";
      tick.style.left = (i / (tracks.length - 1)) * 100 + "%";
      ticksEl.appendChild(tick);
    });

    const ticks = Array.from(ticksEl.querySelectorAll(".scrubber-tick"));

    function applyTrack(index) {
      const t = tracks[index];
      titleEl.textContent = t.title;
      numberEl.textContent =
        String(index + 1).padStart(2, "0") +
        " / " +
        String(tracks.length).padStart(2, "0");
      metaEl.textContent = t.year + " · " + t.duration;
      display.classList.remove("switching");
      setVideoBg(t.videoId || null);

      if (coverImgEl) {
        if (t.cover) {
          coverImgEl.src = t.cover;
          coverImgEl.classList.add("visible");
        } else {
          coverImgEl.classList.remove("visible");
        }
      }

      startPreview(t);

      const spotifyLink = section.querySelector("#spotify-open-link");
      if (spotifyLink && t.spotifyUrl) spotifyLink.href = t.spotifyUrl;

      pending = null;
    }

    function showTrack(index) {
      if (index === currentIndex) return;
      currentIndex = index;
      ticks.forEach((t, i) => t.classList.toggle("active", i === index));
      if (pending) clearTimeout(pending);
      display.classList.add("switching");
      pending = setTimeout(() => applyTrack(index), 120);
    }

    function handleMove(clientX) {
      const rect = section.getBoundingClientRect();
      const ratio = Math.max(
        0,
        Math.min(1, (clientX - rect.left) / rect.width),
      );
      const index = Math.min(
        Math.floor(ratio * tracks.length),
        tracks.length - 1,
      );
      const sRect = scrubber.getBoundingClientRect();
      const sRatio = Math.max(
        0,
        Math.min(1, (clientX - sRect.left) / sRect.width),
      );
      cursorEl.style.left = (sRatio * 100).toFixed(2) + "%";
      showTrack(index);
    }

    section.addEventListener("mousemove", (e) => handleMove(e.clientX));

    section.addEventListener("click", () => {
      if (currentIndex >= 0 && tracks[currentIndex]?.previewUrl) {
        startPreview(tracks[currentIndex]);
      }
    });

    section.addEventListener("mouseleave", () => {
      if (pending) {
        clearTimeout(pending);
        applyTrack(currentIndex);
      }
      clearFade();
      clearStopTimer();
      if (loopTimer) {
        clearTimeout(loopTimer);
        loopTimer = null;
      }
      if (playPromise) {
        playPromise
          .then(() => fadeVol(0, 400, () => audio.pause()))
          .catch(() => audio.pause());
      } else if (!audio.paused) {
        audio.pause();
      }
    });

    let touchStartX = 0;
    let touchStartY = 0;
    let swipeActive = false;

    section.addEventListener("touchstart", (e) => {
      touchStartX = e.touches[0].clientX;
      touchStartY = e.touches[0].clientY;
      swipeActive = false;
    }, { passive: true });

    section.addEventListener(
      "touchmove",
      (e) => {
        const dx = e.touches[0].clientX - touchStartX;
        const dy = e.touches[0].clientY - touchStartY;
        if (!swipeActive && Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 8) {
          swipeActive = true;
        }
        if (swipeActive) e.preventDefault();
      },
      { passive: false },
    );

    section.addEventListener("touchend", (e) => {
      const dx = e.changedTouches[0].clientX - touchStartX;
      const dy = e.changedTouches[0].clientY - touchStartY;

      if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy)) {
        const base = currentIndex < 0 ? 0 : currentIndex;
        const next = dx < 0
          ? Math.min(base + 1, tracks.length - 1)
          : Math.max(base - 1, 0);
        showTrack(next);
      }

      clearFade();
      clearStopTimer();
      if (loopTimer) {
        clearTimeout(loopTimer);
        loopTimer = null;
      }
      if (playPromise) {
        playPromise
          .then(() => fadeVol(0, 400, () => audio.pause()))
          .catch(() => audio.pause());
      } else if (!audio.paused) {
        fadeVol(0, 400, () => audio.pause());
      }
    });

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          if (currentIndex === -1) {
            showTrack(0);
          }
          setTimeout(() => {
            if (
              currentIndex >= 0 &&
              tracks[currentIndex]?.previewUrl &&
              audio.paused
            ) {
              doPlay(tracks[currentIndex]);
            }
          }, 150);
        } else {
          if (playPromise) {
            playPromise
              .then(() => {
                audio.pause();
              })
              .catch(() => {});
          } else if (!audio.paused) {
            audio.pause();
          }
        }
      },
      { threshold: 0.3 },
    );
    observer.observe(section);
  }

  // --- Discography ---
  let releases = [];

  function buildCard(release) {
    const a = document.createElement("a");
    a.className = "release-card";
    a.href = release.spotifyUrl || "#";
    a.setAttribute("data-spotify-id", release.spotifyId || "");

    if (release.spotifyUrl) {
      a.target = "_blank";
      a.rel = "noopener noreferrer";
    }

    const coverDiv = document.createElement("div");
    coverDiv.className = "release-cover";

    if (release.cover) {
      const img = document.createElement("img");
      img.src = release.cover;
      img.alt = release.title + " cover art";
      coverDiv.appendChild(img);
    } else {
      const placeholder = document.createElement("div");
      placeholder.className = "release-cover-placeholder";
      placeholder.setAttribute("aria-hidden", "true");
      coverDiv.appendChild(placeholder);
    }

    const info = document.createElement("div");
    info.className = "release-info";

    const title = document.createElement("p");
    title.className = "release-title";
    title.textContent = release.title;

    const meta = document.createElement("div");
    meta.className = "release-meta";

    const year = document.createElement("span");
    year.textContent = release.year;

    const type = document.createElement("span");
    type.className = "release-type";
    type.textContent = release.type;

    meta.appendChild(year);
    meta.appendChild(type);
    info.appendChild(title);
    info.appendChild(meta);
    a.appendChild(coverDiv);
    a.appendChild(info);

    return a;
  }

  function initDiscography() {
    const grid = document.querySelector(".discography-grid");
    if (!grid) return;
    releases.forEach((r) => grid.appendChild(buildCard(r)));
  }

  // --- Scroll Reveal ---
  function initScrollReveal() {
    const elements = document.querySelectorAll(".reveal");
    if (!elements.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.15 },
    );

    elements.forEach((el) => observer.observe(el));
  }

  // --- Section Fade ---
  function initSectionFade() {
    const els = document.querySelectorAll(".section-fade");
    if (!els.length) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          entry.target.classList.toggle("visible", entry.isIntersecting);
        });
      },
      { threshold: 0.08 },
    );
    els.forEach((el) => observer.observe(el));
  }

  // --- Contact Form ---
  function initContactForm() {
    const form = document.querySelector(".contact-form");
    if (!form) return;
    const successEl = document.querySelector(".form-success");

    function setError(name, msg) {
      const el = form.querySelector('[data-error="' + name + '"]');
      if (el) el.textContent = msg;
    }

    function clearErrors() {
      form.querySelectorAll(".form-error").forEach((el) => {
        el.textContent = "";
      });
    }

    function isValidEmail(val) {
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);
    }

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      clearErrors();

      const name = form.querySelector("#field-name").value.trim();
      const email = form.querySelector("#field-email").value.trim();
      const message = form.querySelector("#field-message").value.trim();
      let valid = true;

      if (!name) {
        setError("name", "Name is required.");
        valid = false;
      }

      if (!email) {
        setError("email", "Email is required.");
        valid = false;
      } else if (!isValidEmail(email)) {
        setError("email", "Enter a valid email address.");
        valid = false;
      }

      if (!message) {
        setError("message", "Message is required.");
        valid = false;
      }

      if (!valid) return;

      const submitBtn = form.querySelector(".form-submit");
      submitBtn.disabled = true;
      submitBtn.textContent = "Sending…";

      fetch("/", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          "form-name": "contact",
          name,
          email,
          message,
        }).toString(),
      })
        .then(() => {
          form.style.display = "none";
          if (successEl) successEl.classList.add("visible");
        })
        .catch(() => {
          submitBtn.disabled = false;
          submitBtn.textContent = "Send";
          setError("message", "Something went wrong. Please try again.");
        });
    });
  }

  // --- Spotify Data ---
  async function initSpotify() {
    try {
      const res = await fetch("data/spotify.json");
      if (res.ok) {
        const data = await res.json();
        tracks = data.tracks;
        releases = data.releases;
      }
    } catch (_) {
      // JSON not found — keep placeholder data
    }
    initMusicSection();
    initDiscography();
  }

  // --- Vinheta (VHS Intro Overlay) ---
  function initVinheta() {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const vinheta     = document.querySelector(".vinheta");
    const noiseCanvas = vinheta.querySelector(".vinheta__noise");
    const logoBtn     = vinheta.querySelector(".vinheta__logo-btn");
    const strips      = vinheta.querySelectorAll(".vinheta__glitch-strip");
    const afterglow   = vinheta.querySelector(".vinheta__afterglow");

    if (!vinheta || !noiseCanvas || !logoBtn) return;

    // ── VHS HUD clock — Brasília (America/Sao_Paulo) ──────────────────────
    const vhsDateEl = document.getElementById("vhs-date");
    const vhsTimeEl = document.getElementById("vhs-time");
    let vhsClockTimer = null;
    if (vhsDateEl && vhsTimeEl) {
      const updateVHSClock = () => {
        const now = new Date();
        vhsDateEl.textContent = now.toLocaleDateString("pt-BR", {
          timeZone: "America/Sao_Paulo",
          day: "2-digit", month: "2-digit", year: "2-digit"
        });
        vhsTimeEl.textContent = now.toLocaleTimeString("pt-BR", {
          timeZone: "America/Sao_Paulo",
          hour: "2-digit", minute: "2-digit", second: "2-digit",
          hour12: false
        });
      };
      updateVHSClock();
      vhsClockTimer = setInterval(updateVHSClock, 1000);
    }

    // Prevent scroll while overlay is active
    document.body.style.overflow = "hidden";

    // Mark all background content as inert — prevents AT from reading behind the dialog
    const bgElements = Array.from(document.querySelectorAll("body > *:not(.vinheta)"));
    bgElements.forEach((el) => el.setAttribute("inert", ""));

    // ── Noise canvas ──────────────────────────────────────────────────────
    const nCtx = noiseCanvas.getContext("2d");
    let noiseFrame = null;

    const resizeNoise = () => {
      const dpr = window.devicePixelRatio || 1;
      noiseCanvas.width  = window.innerWidth  * dpr;
      noiseCanvas.height = window.innerHeight * dpr;
    };

    const drawNoise = () => {
      const w = noiseCanvas.width;
      const h = noiseCanvas.height;
      const imageData = nCtx.createImageData(w, h);
      const data = imageData.data;
      for (let i = 0; i < data.length; i += 4) {
        const v = Math.random() * 255 | 0;
        data[i]     = v;
        data[i + 1] = v;
        data[i + 2] = v;
        data[i + 3] = 18; // ~7% alpha; mix-blend-mode:overlay amplifies in CSS
      }
      nCtx.putImageData(imageData, 0, 0);
      noiseFrame = requestAnimationFrame(drawNoise);
    };

    if (!prefersReducedMotion) {
      resizeNoise();
      drawNoise();
      window.addEventListener("resize", resizeNoise, { passive: true });
    }

    // ── Glitch strips ─────────────────────────────────────────────────────
    // Each strip fires independently on a 2–4s random interval.
    // Three strips with different mix-blend-modes produce chromatic aberration.
    const glitchTimers = [];
    let glitchActive = false;

    const fireStrip = (strip) => {
      const top      = (Math.random() * 90 + 2).toFixed(1) + "%";
      const height   = (Math.random() * 18 + 2).toFixed(0) + "px";
      // % of vinheta width so shift scales across viewport sizes — per CLAUDE.md rule
      const parentW  = vinheta.clientWidth || window.innerWidth;
      const txPx     = (Math.random() * 18 + 2) * (Math.random() < 0.5 ? 1 : -1);
      const tx       = ((txPx / parentW) * 100).toFixed(2);
      const hue      = (Math.random() * 40 - 20).toFixed(0);
      const sat      = (Math.random() * 1.5 + 1).toFixed(1);
      const duration = (Math.random() * 120 + 80) | 0;

      strip.style.top       = top;
      strip.style.height    = height;
      strip.style.transform = `translateX(${tx}%)`;
      strip.style.filter    = `hue-rotate(${hue}deg) saturate(${sat})`;
      strip.style.opacity   = "1";

      const offTimer = setTimeout(() => {
        strip.style.opacity   = "0";
        strip.style.transform = "";
        strip.style.filter    = "";
      }, duration);

      glitchTimers.push(offTimer);
    };

    const scheduleStrip = (strip) => {
      const delay = (Math.random() * 500 + 250) | 0;
      const t = setTimeout(() => {
        if (!glitchActive) {
          fireStrip(strip);
          scheduleStrip(strip);
        }
      }, delay);
      glitchTimers.push(t);
    };

    if (!prefersReducedMotion) {
      strips.forEach((strip) => scheduleStrip(strip));
    }

    // Move focus to button so keyboard users can activate immediately
    logoBtn.focus({ preventScroll: true });

    // ── Cleanup ───────────────────────────────────────────────────────────
    const cleanup = () => {
      cancelAnimationFrame(noiseFrame);
      noiseFrame = null;
      glitchTimers.forEach(clearTimeout);
      glitchTimers.length = 0;
      window.removeEventListener("resize", resizeNoise);
      if (vhsClockTimer) { clearInterval(vhsClockTimer); vhsClockTimer = null; }
    };

    // ── Exit sequence ─────────────────────────────────────────────────────
    let exiting = false;

    const beginExit = () => {
      if (exiting) return;
      exiting = true;

      // Immediate dismissal for reduced-motion users — no animation sequence
      if (prefersReducedMotion) {
        cleanup();
        bgElements.forEach((el) => el.removeAttribute("inert"));
        vinheta.style.display = "none";
        document.body.style.overflow = "";
        const firstFocusable = document.querySelector('a[href], button, [tabindex="0"]');
        if (firstFocusable) firstFocusable.focus({ preventScroll: true });
        return;
      }

      glitchActive = true;

      // Phase 1 (0–300ms): brightness + rapid glitch burst
      vinheta.classList.add("vinheta--clicking");
      strips.forEach((strip) => {
        fireStrip(strip);
        const t1 = setTimeout(() => fireStrip(strip), 80);
        const t2 = setTimeout(() => fireStrip(strip), 160);
        const t3 = setTimeout(() => fireStrip(strip), 240);
        glitchTimers.push(t1, t2, t3);
      });

      // Phase 2 (300ms): scaleY collapse + white flash via CSS transition
      const collapseTimer = setTimeout(() => {
        vinheta.classList.remove("vinheta--clicking");
        vinheta.classList.add("vinheta--collapsing");
        cancelAnimationFrame(noiseFrame);
        noiseFrame = null;
      }, 300);

      // Afterglow (750ms): phosphor remnant line appears then fades
      const afterglowShowTimer = setTimeout(() => {
        afterglow.style.opacity = "1";
      }, 750);

      const afterglowHideTimer = setTimeout(() => {
        afterglow.style.transition = "opacity 0.3s linear";
        afterglow.style.opacity    = "0";
      }, 800);

      // Phase 3 (1100ms): remove overlay, unlock scroll, restore inert
      const removeTimer = setTimeout(() => {
        cleanup();
        bgElements.forEach((el) => el.removeAttribute("inert"));
        vinheta.style.display        = "none";
        document.body.style.overflow = "";
        // Return focus to the first meaningful interactive element
        const firstFocusable = document.querySelector("a[href], button, [tabindex=\"0\"]");
        if (firstFocusable) firstFocusable.focus({ preventScroll: true });
      }, 1100);

      glitchTimers.push(collapseTimer, afterglowShowTimer, afterglowHideTimer, removeTimer);
    };

    // Click on logo button (primary action)
    logoBtn.addEventListener("click", beginExit);

    // Keyboard: Enter or Space on focused button
    logoBtn.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        beginExit();
      }
    });

    // Focus trap — required for role="dialog" + aria-modal per ARIA APG
    vinheta.addEventListener("keydown", (e) => {
      if (e.key === "Tab") {
        e.preventDefault();
        logoBtn.focus({ preventScroll: true });
      }
    });
  }

  // --- Init ---
  document.addEventListener("DOMContentLoaded", () => {
    initVinheta();
    initHeroCanvas();
    initSketchStars();
    initNav();
    initSpotify();
    initScrollReveal();
    initSectionFade();
    initContactForm();
  });
})();
