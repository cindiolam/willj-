(function () {
  var YT_ID = "NPqB5V_KS9s";

  var menuToggle = document.querySelector(".menu-toggle");
  if (menuToggle) {
    menuToggle.addEventListener("click", function () {
      var open = document.body.classList.toggle("menu-open");
      menuToggle.setAttribute("aria-expanded", String(open));
    });
    document.querySelectorAll(".nav a").forEach(function (link) {
      link.addEventListener("click", function () {
        document.body.classList.remove("menu-open");
        menuToggle.setAttribute("aria-expanded", "false");
      });
    });
    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape") {
        document.body.classList.remove("menu-open");
        menuToggle.setAttribute("aria-expanded", "false");
      }
    });
  }

  var header = document.querySelector(".site-header");
  var navLinks = Array.prototype.slice.call(document.querySelectorAll(".nav a"));
  var sections = navLinks.map(function (link) {
    return document.querySelector(link.getAttribute("href"));
  }).filter(Boolean);

  function markCurrent() {
    if (!sections.length) return;
    var marker = window.scrollY + (header ? header.offsetHeight : 0) + 32;
    var current = null;
    sections.forEach(function (section) {
      if (section.offsetTop <= marker) current = section;
    });
    navLinks.forEach(function (link) {
      var on = current && link.getAttribute("href") === "#" + current.id;
      if (on) link.setAttribute("aria-current", "true");
      else link.removeAttribute("aria-current");
    });
  }

  function onScroll() {
    if (header) header.classList.toggle("is-scrolled", window.scrollY > 8);
    markCurrent();
  }

  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  if ("IntersectionObserver" in window) {
    document.querySelectorAll(".reveal").forEach(function (el) {
      var reveal = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-in");
          reveal.unobserve(entry.target);
        });
      }, { threshold: 0.12 });
      reveal.observe(el);
    });
  } else {
    document.querySelectorAll(".reveal").forEach(function (el) {
      el.classList.add("is-in");
    });
  }

  document.querySelectorAll(".hero-person, .frame img").forEach(function (img) {
    function ready() { img.classList.add("is-ready"); }
    function fail() {
      var fb = img.getAttribute("data-fallback");
      if (fb && img.getAttribute("src") !== fb) {
        img.setAttribute("src", fb);
        return;
      }
      img.classList.remove("is-ready");
    }
    img.addEventListener("load", ready);
    img.addEventListener("error", fail);
    if (img.complete) {
      if (img.naturalWidth > 0) ready();
      else fail();
    }
  });

  /* Cover-flow */
  var stage = document.querySelector(".flow-stage");
  var cards = Array.prototype.slice.call(document.querySelectorAll(".flow-card"));
  var prevBtn = document.querySelector(".flow-prev");
  var nextBtn = document.querySelector(".flow-next");
  var infoBadge = document.querySelector(".flow-badge");
  var infoName = document.querySelector(".flow-name");
  var infoWhen = document.querySelector(".flow-when");
  var infoVenue = document.querySelector(".flow-venue");
  var infoIndex = document.querySelector(".flow-index");
  var index = 0;
  var reduced = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function decode(value) {
    var textarea = document.createElement("textarea");
    textarea.innerHTML = value || "";
    return textarea.value;
  }

  function shortestOffset(i, current, total) {
    var offset = i - current;
    if (offset > total / 2) offset -= total;
    if (offset < -total / 2) offset += total;
    return offset;
  }

  function layout() {
    if (!cards.length) return;
    var total = cards.length;
    var narrow = window.innerWidth < 900;
    var spacing = narrow ? 62 : 74;
    var neighborScale = narrow ? 0.86 : 0.84;

    cards.forEach(function (card, i) {
      var offset = shortestOffset(i, index, total);
      var abs = Math.abs(offset);
      var scale = offset === 0 ? 1 : neighborScale - Math.max(0, abs - 1) * 0.08;
      var x = offset * spacing;
      if (abs >= 2) x = offset * (spacing + (abs - 1) * 18);
      var opacity = abs === 0 ? 1 : abs === 1 ? 0.92 : abs === 2 ? 0.35 : 0;
      var blur = abs >= 2 ? "brightness(0.55)" : abs === 1 ? "brightness(0.72)" : "none";

      card.style.transform = "translate(-50%, -50%) translateX(" + x + "%) scale(" + scale + ")";
      card.style.opacity = String(opacity);
      card.style.filter = blur;
      card.style.zIndex = String(20 - abs);
      card.style.pointerEvents = abs <= 1 && opacity > 0.2 ? "auto" : "none";
      card.classList.toggle("is-center", offset === 0);
      card.setAttribute("aria-hidden", offset === 0 ? "false" : "true");
    });

    var current = cards[index];
    if (current && infoName) {
      var badge = current.getAttribute("data-badge") || "";
      infoBadge.textContent = badge;
      infoBadge.classList.toggle("is-on", Boolean(badge));
      infoName.textContent = decode(current.getAttribute("data-title") || "");
      infoWhen.textContent = decode(current.getAttribute("data-when") || "");
      infoVenue.textContent = decode(current.getAttribute("data-venue") || "");
      if (infoIndex) infoIndex.textContent = String(index + 1);
    }
  }

  function go(to) {
    if (!cards.length) return;
    index = ((to % cards.length) + cards.length) % cards.length;
    layout();
  }

  if (stage && cards.length) {
    go(0);
    window.addEventListener("resize", layout);

    if (prevBtn) prevBtn.addEventListener("click", function () { go(index - 1); });
    if (nextBtn) nextBtn.addEventListener("click", function () { go(index + 1); });

    var ignoreClick = false;
    cards.forEach(function (card, i) {
      card.addEventListener("click", function () {
        if (ignoreClick) return;
        if (i !== index) go(i);
      });
    });

    document.addEventListener("keydown", function (event) {
      var tag = (event.target && event.target.tagName) || "";
      if (tag === "INPUT" || tag === "TEXTAREA" || event.target.isContentEditable) return;
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        go(index - 1);
      } else if (event.key === "ArrowRight") {
        event.preventDefault();
        go(index + 1);
      }
    });

    var drag = null;
    function pointerX(event) {
      if (event.touches && event.touches[0]) return event.touches[0].clientX;
      return event.clientX;
    }

    stage.addEventListener("pointerdown", function (event) {
      if (event.button != null && event.button !== 0) return;
      drag = { id: event.pointerId, x: pointerX(event), moved: false };
      stage.classList.add("is-grabbing");
      if (stage.setPointerCapture) {
        try { stage.setPointerCapture(event.pointerId); } catch (err) {}
      }
    });

    stage.addEventListener("pointermove", function (event) {
      if (!drag || event.pointerId !== drag.id) return;
      if (Math.abs(pointerX(event) - drag.x) > 8) drag.moved = true;
    });

    function endDrag(event) {
      if (!drag || (event.pointerId != null && event.pointerId !== drag.id)) return;
      var dx = pointerX(event) - drag.x;
      var shouldMove = drag.moved && Math.abs(dx) > 40;
      stage.classList.remove("is-grabbing");
      drag = null;
      if (shouldMove) {
        ignoreClick = true;
        window.setTimeout(function () { ignoreClick = false; }, 250);
        go(index + (dx < 0 ? 1 : -1));
      }
    }

    stage.addEventListener("pointerup", endDrag);
    stage.addEventListener("pointercancel", function () {
      drag = null;
      stage.classList.remove("is-grabbing");
    });

    if (!("PointerEvent" in window)) {
      var touchX = null;
      stage.addEventListener("touchstart", function (event) {
        if (event.touches[0]) touchX = event.touches[0].clientX;
      }, { passive: true });
      stage.addEventListener("touchend", function (event) {
        if (touchX == null || !event.changedTouches[0]) return;
        var dx = event.changedTouches[0].clientX - touchX;
        touchX = null;
        if (Math.abs(dx) > 40) go(index + (dx < 0 ? 1 : -1));
      });
    }
  }

  /* YouTube IFrame API — attempt unmuted autoplay, retry on first gesture. No file fallback. */
  var playBtn = document.querySelector(".play");
  var seek = document.querySelector(".seek");
  var time = document.querySelector(".time");
  var hud = document.querySelector(".hud");
  var ytHost = document.getElementById("yt-host");
  var hudNote = document.querySelector(".hud-note");
  var seeking = false;
  var ytPlayer = null;
  var ytReady = false;
  var pendingPlay = false;
  var playerFailed = false;
  var gestureBound = false;

  function formatTime(seconds) {
    if (!Number.isFinite(seconds)) return "0:00";
    var whole = Math.max(0, Math.floor(seconds));
    return Math.floor(whole / 60) + ":" + String(whole % 60).padStart(2, "0");
  }

  function isPlaying() {
    if (!ytPlayer || !ytReady || !window.YT) return false;
    return ytPlayer.getPlayerState() === YT.PlayerState.PLAYING;
  }

  function syncPlayLabel() {
    if (!playBtn) return;
    var playing = isPlaying();
    playBtn.setAttribute("aria-label", playing ? "Pause" : "Play");
    playBtn.classList.toggle("is-playing", playing);
    if (hud) hud.classList.toggle("is-playing", playing);
  }

  function currentSeconds() {
    if (ytPlayer && ytReady && ytPlayer.getCurrentTime) return ytPlayer.getCurrentTime() || 0;
    return 0;
  }

  function durationSeconds() {
    if (ytPlayer && ytReady && ytPlayer.getDuration) return ytPlayer.getDuration();
    return NaN;
  }

  function paintTime() {
    if (!time || !seek) return;
    var duration = durationSeconds();
    if (!seeking && Number.isFinite(duration) && duration > 0) {
      seek.value = String(Math.round((currentSeconds() / duration) * 1000));
    }
    var total = Number.isFinite(duration) ? formatTime(duration) : "0:00";
    time.textContent = formatTime(currentSeconds()) + " / " + total;
  }

  function showPlayerNote() {
    if (hudNote) hudNote.hidden = false;
  }

  function allowIframeAutoplay() {
    var iframe = document.getElementById("yt-host");
    if (iframe && iframe.tagName === "IFRAME") {
      iframe.setAttribute("allow", "autoplay; encrypted-media; picture-in-picture");
      iframe.setAttribute("allowfullscreen", "true");
    }
  }

  function tryPlayUnmuted() {
    if (!ytPlayer || !ytReady) return false;
    try {
      if (ytPlayer.unMute) ytPlayer.unMute();
      if (ytPlayer.setVolume) ytPlayer.setVolume(100);
    } catch (err) {}
    try { ytPlayer.playVideo(); } catch (err) {}
    return true;
  }

  function bindFirstGesture() {
    if (gestureBound) return;
    gestureBound = true;
    var events = ["pointerdown", "click", "touchstart", "keydown", "scroll", "wheel"];
    function onGesture() {
      if (isPlaying()) {
        events.forEach(function (name) {
          window.removeEventListener(name, onGesture, true);
        });
        return;
      }
      if (ytReady && ytPlayer) {
        tryPlayUnmuted();
        window.setTimeout(function () {
          if (isPlaying()) {
            events.forEach(function (name) {
              window.removeEventListener(name, onGesture, true);
            });
          } else if (playerFailed || window.location.protocol === "file:") {
            showPlayerNote();
          }
        }, 400);
      } else {
        pendingPlay = true;
        if (playerFailed || window.location.protocol === "file:") showPlayerNote();
      }
    }
    events.forEach(function (name) {
      window.addEventListener(name, onGesture, { capture: true, passive: true });
    });
  }

  function bootYouTube() {
    if (window.location.protocol === "file:") showPlayerNote();
    bindFirstGesture();

    if (!ytHost) {
      showPlayerNote();
      return;
    }

    var failTimer = window.setTimeout(function () {
      if (!ytReady) playerFailed = true;
    }, 8000);

    var playerVars = {
      autoplay: 1,
      mute: 0,
      controls: 0,
      rel: 0,
      modestbranding: 1,
      playsinline: 1
    };
    if (/^https?:$/.test(window.location.protocol)) {
      playerVars.origin = window.location.origin;
    }

    window.onYouTubeIframeAPIReady = function () {
      ytPlayer = new YT.Player("yt-host", {
        width: "120",
        height: "68",
        videoId: YT_ID,
        host: "https://www.youtube.com",
        playerVars: playerVars,
        events: {
          onReady: function () {
            ytReady = true;
            window.clearTimeout(failTimer);
            if (hudNote && window.location.protocol !== "file:") hudNote.hidden = true;
            allowIframeAutoplay();
            paintTime();
            tryPlayUnmuted();
            if (pendingPlay) {
              pendingPlay = false;
              tryPlayUnmuted();
            }
            window.setTimeout(function () {
              if (!isPlaying()) bindFirstGesture();
              syncPlayLabel();
            }, 700);
          },
          onStateChange: function () {
            syncPlayLabel();
            paintTime();
          },
          onError: function () {
            playerFailed = true;
          }
        }
      });
    };

    var tag = document.createElement("script");
    tag.src = "https://www.youtube.com/iframe_api";
    tag.onerror = function () {
      window.clearTimeout(failTimer);
      playerFailed = true;
    };
    document.head.appendChild(tag);

    window.setInterval(function () {
      if (isPlaying()) paintTime();
    }, 500);
  }

  if (playBtn && seek) {
    bootYouTube();

    playBtn.addEventListener("click", function () {
      if (!ytReady || !ytPlayer) {
        pendingPlay = true;
        if (playerFailed || window.location.protocol === "file:") showPlayerNote();
        return;
      }
      if (isPlaying()) ytPlayer.pauseVideo();
      else tryPlayUnmuted();
    });

    seek.addEventListener("pointerdown", function () { seeking = true; });
    window.addEventListener("pointerup", function () { seeking = false; });
    seek.addEventListener("input", function () {
      var duration = durationSeconds();
      if (!Number.isFinite(duration) || duration <= 0) return;
      var next = (Number(seek.value) / 1000) * duration;
      if (ytPlayer && ytReady) ytPlayer.seekTo(next, true);
      paintTime();
    });
  }

  /* Curved two-row photo wall */
  var wallRoot = document.querySelector(".wall");
  var wallViewport = document.querySelector(".wall-viewport");
  var wallStage = document.querySelector(".wall-stage");
  var wallPrev = document.querySelector(".wall-prev");
  var wallNext = document.querySelector(".wall-next");
  var wallSource = Array.prototype.slice.call(document.querySelectorAll(".wall-source img"));
  var wallCols = [];
  var wallRot = 0;
  var wallTarget = null;
  var wallPaused = false;
  var wallDragging = false;
  var wallIgnoreClick = false;
  var wallRadius = 1;
  var wallLast = performance.now();
  var WALL_SPEED = 5.4;
  var WALL_REPEATS = 4;
  var WALL_GAP = 8;
  var WALL_MODULE = [
    { width: 1.16, cards: [{ i: 2, y: 0, h: 0.415 }, { i: 0, y: 0.415, h: 0.585 }] },
    { width: 0.7, cards: [{ i: 5, y: 0, h: 1 }] },
    { width: 1.3, cards: [{ i: 1, y: 0, h: 0.415 }, { i: 3, y: 0.415, h: 0.585 }] },
    { width: 0.7, cards: [{ i: 4, y: 0, h: 1 }] }
  ];

  function shortestDeg(delta) {
    var d = delta % 360;
    if (d > 180) d -= 360;
    if (d < -180) d += 360;
    return d;
  }

  function shadeWall() {
    wallCols.forEach(function (col) {
      var rel = Math.cos(((col.azimuth + wallRot) * Math.PI) / 180);
      var vis = Math.max(0, rel + 0.08);
      col.el.style.filter = "brightness(" + (0.5 + 0.5 * vis) + ")";
      col.el.style.visibility = rel < -0.2 ? "hidden" : "visible";
    });
  }

  function applyWallRot() {
    if (!wallStage) return;
    wallStage.style.setProperty("--wall-rot", wallRot + "deg");
    shadeWall();
  }

  function buildWall() {
    if (!wallStage || !wallViewport || wallSource.length < 6) return;
    var narrow = wallViewport.clientWidth < 800;
    var repeats = narrow ? 2 : 3;
    var space = wallViewport.querySelector(".wall-space");
    if (space) space.style.setProperty("--wall-perspective", narrow ? "820px" : "1050px");

    var height = wallViewport.clientHeight;
    if (height < 80) return;
    wallStage.innerHTML = "";
    wallCols = [];

    var unitCirc = 0;
    WALL_MODULE.forEach(function (col) { unitCirc += col.width * height + WALL_GAP; });
    var circ = unitCirc * repeats;
    var packedR = circ / (2 * Math.PI);
    var wantR = (wallViewport.clientWidth * 0.40) / Math.sin((narrow ? 50 : 56) * Math.PI / 180);
    var scale = wantR / packedR;
    var minH = narrow ? 188 : 250;
    var maxH = height;
    height = Math.max(minH, Math.min(maxH, height * Math.min(1.05, scale)));
    unitCirc = 0;
    WALL_MODULE.forEach(function (col) { unitCirc += col.width * height + WALL_GAP; });
    circ = unitCirc * repeats;
    wallRadius = circ / (2 * Math.PI);

    wallStage.style.setProperty("--wall-h", height + "px");
    var push = -wallRadius * (narrow ? 0.55 : 0.58);
    wallStage.style.setProperty("--wall-push", push + "px");

    var cursor = 0;
    for (var r = 0; r < repeats; r++) {
      WALL_MODULE.forEach(function (spec) {
        var colW = spec.width * height;
        var mid = cursor + colW / 2;
        var az = (mid / circ) * 360;
        var colEl = document.createElement("div");
        colEl.className = "wall-col";
        colEl.style.width = colW + "px";
        colEl.style.transform = "rotateY(" + az + "deg) translateZ(" + wallRadius + "px) translateX(-50%)";

        spec.cards.forEach(function (card) {
          var src = wallSource[card.i];
          if (!src) return;
          var article = document.createElement("article");
          article.className = "wall-card";
          var top = card.y * height;
          var h = card.h * height;
          if (spec.cards.length > 1) {
            if (card.y <= 0.001) h -= WALL_GAP / 2;
            else { top += WALL_GAP / 2; h -= WALL_GAP / 2; }
          }
          article.style.left = "0";
          article.style.width = "100%";
          article.style.top = top + "px";
          article.style.height = Math.max(8, h) + "px";
          var img = document.createElement("img");
          img.src = src.getAttribute("src");
          img.alt = r === 0 ? (src.getAttribute("alt") || "") : "";
          if (r !== 0) img.setAttribute("aria-hidden", "true");
          article.appendChild(img);
          colEl.appendChild(article);
        });

        wallStage.appendChild(colEl);
        wallCols.push({ el: colEl, azimuth: az, width: colW });
        cursor += colW + WALL_GAP;
      });
    }

    wallStage.hidden = false;
    applyWallRot();
  }

  function snapTo(az) {
    var goal = -az;
    var delta = shortestDeg(goal - wallRot);
    wallTarget = wallRot + delta;
  }

  function stepWall(dir) {
    if (!wallCols.length) return;
    var step = 360 / wallCols.length;
    var goal = wallRot - dir * step;
    var delta = shortestDeg(goal - wallRot);
    wallTarget = wallRot + delta;
  }

  function nearestCol(azWanted) {
    var best = wallCols[0];
    var bestD = 1e9;
    wallCols.forEach(function (col) {
      var d = Math.abs(shortestDeg(col.azimuth + wallRot));
      if (azWanted != null) d = Math.abs(shortestDeg(col.azimuth - azWanted));
      if (d < bestD) { bestD = d; best = col; }
    });
    return best;
  }

  if (wallViewport && wallStage && wallSource.length) {
    buildWall();
    window.addEventListener("resize", function () {
      window.clearTimeout(buildWall._t);
      buildWall._t = window.setTimeout(buildWall, 120);
    });

    if (wallRoot) {
      wallRoot.addEventListener("mouseenter", function () { wallPaused = true; });
      wallRoot.addEventListener("mouseleave", function () { if (!wallDragging) wallPaused = false; });
      wallRoot.addEventListener("focusin", function () { wallPaused = true; });
      wallRoot.addEventListener("focusout", function () { if (!wallDragging) wallPaused = false; });
    }

    if (wallPrev) wallPrev.addEventListener("click", function () { stepWall(-1); });
    if (wallNext) wallNext.addEventListener("click", function () { stepWall(1); });

    wallStage.addEventListener("click", function (event) {
      if (wallIgnoreClick) return;
      var colEl = event.target.closest(".wall-col");
      if (!colEl) return;
      var col = wallCols.filter(function (c) { return c.el === colEl; })[0];
      if (col) snapTo(col.azimuth);
    });

    var drag = null;
    wallViewport.addEventListener("pointerdown", function (event) {
      if (event.button != null && event.button !== 0) return;
      drag = { id: event.pointerId, x: event.clientX, rot: wallRot, moved: false };
      wallDragging = true;
      wallTarget = null;
      wallViewport.classList.add("is-grabbing");
      if (wallViewport.setPointerCapture) {
        try { wallViewport.setPointerCapture(event.pointerId); } catch (err) {}
      }
    });
    wallViewport.addEventListener("pointermove", function (event) {
      if (!drag || event.pointerId !== drag.id) return;
      var dx = event.clientX - drag.x;
      if (Math.abs(dx) > 6) drag.moved = true;
      wallRot = drag.rot + dx * 0.18;
      applyWallRot();
    });
    function endWallDrag(event) {
      if (!drag || (event.pointerId != null && event.pointerId !== drag.id)) return;
      if (drag.moved) {
        wallIgnoreClick = true;
        window.setTimeout(function () { wallIgnoreClick = false; }, 240);
      }
      drag = null;
      wallDragging = false;
      wallViewport.classList.remove("is-grabbing");
    }
    wallViewport.addEventListener("pointerup", endWallDrag);
    wallViewport.addEventListener("pointercancel", endWallDrag);

    function tick(now) {
      var dt = Math.min(0.05, (now - wallLast) / 1000);
      wallLast = now;
      if (wallTarget != null && !wallDragging) {
        var d = wallTarget - wallRot;
        if (Math.abs(d) < 0.12) {
          wallRot = wallTarget;
          wallTarget = null;
        } else {
          wallRot += d * Math.min(1, 0.1 + dt * 4);
        }
        applyWallRot();
      } else if (!wallPaused && !wallDragging && !reduced) {
        wallRot -= WALL_SPEED * dt;
        applyWallRot();
      }
      window.requestAnimationFrame(tick);
    }
    window.requestAnimationFrame(tick);
  }
})();
