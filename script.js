const START_DATE = new Date("2026-09-11T22:00:00+07:00");

const treeScene = document.getElementById("treeScene");
const letterScene = document.getElementById("letterScene");
const finalScene = document.getElementById("finalScene");
const startBtn = document.getElementById("startBtn");
const pauseBtn = document.getElementById("pauseBtn");
const letterButton = document.getElementById("letterButton");
const trunk = document.getElementById("trunk");
const branches = document.getElementById("branches");
const heartCrown = document.getElementById("heartCrown");
const finalHeartCrown = document.getElementById("finalHeartCrown");
const typedText = document.getElementById("typedText");
const timer = document.getElementById("timer");

const heartColors = ["#ff1744","#ff4081","#e91e63","#ff9800","#ffc107","#f06292"];

function makeHeartTree(container, count = 520) {
  container.innerHTML = "";

  // Classic upright heart:
  // x^2 + (y - cbrt(x^2))^2 <= 1, sampled and mapped
  // so the notch is at the top and the point is at the bottom.
  const points = [];
  let attempts = 0;

  while (points.length < count && attempts < count * 80) {
    attempts++;

    // x: -1..1, y: -1.15..1.05 (negative = top)
    const x = Math.random() * 2 - 1;
    const y = Math.random() * 2.2 - 1.15;

    // Implicit heart approximation.
    const boundary =
      Math.pow(x * x + y * y - 1, 3) - x * x * Math.pow(y, 3);

    if (boundary <= 0) {
      points.push([x, y]);
    }
  }

  points.forEach(([x, y]) => {
    const h = document.createElement("span");
    h.className = "particle";

    const r = Math.random();
    h.textContent = r > .45 ? "♥" : (r > .10 ? "❤" : "❣");

    // y is deliberately NOT inverted: negative y stays near the top,
    // positive y reaches the bottom point.
    h.style.left = `${50 + x * 42}%`;
    h.style.top = `${50 + y * 39}%`;

    const palette = [
      "#ff1744", "#ff2f68", "#ff4081", "#e91e63",
      "#f50057", "#ff6f91", "#ff9800", "#ffc107"
    ];

    h.style.color = palette[Math.floor(Math.random() * palette.length)];
    h.style.fontSize = `${7 + Math.random() * 14}px`;
    h.style.setProperty("--duration", `${1.8 + Math.random() * 3.2}s`);
    h.style.setProperty("--delay", `${Math.random() * 2.5}s`);

    if (Math.random() < .045) h.classList.add("big");
    if (Math.random() < .025) h.classList.add("gold");
    if (Math.random() < .012) h.classList.add("white");

    container.appendChild(h);
  });
}

makeHeartTree(heartCrown, 520);
makeHeartTree(finalHeartCrown, 500);

function showScene(scene) {
  [treeScene, letterScene, finalScene].forEach(s => s.classList.remove("active"));
  scene.classList.add("active");
}

function startExperience() {
  startBtn.style.display = "none";
  trunk.classList.add("grow");

  setTimeout(() => branches.classList.add("show"), 800);
  setTimeout(() => heartCrown.classList.add("show"), 1800);

  // Move to letter scene after the tree has grown.
  setTimeout(() => {
    showMessageThenFinal();
  }, 5200);
}

startBtn.addEventListener("click", startExperience);

function showMessageThenFinal() {
  showScene(letterScene);
  setTimeout(() => showScene(finalScene), 5200);
}

function updateTimer() {
  const now = new Date();
  let diff = now - START_DATE;

  if (diff < 0) diff = 0;

  const totalSeconds = Math.floor(diff / 1000);

  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  document.getElementById("days").textContent = days;
  document.getElementById("hours").textContent = String(hours).padStart(2, "0");
  document.getElementById("minutes").textContent = String(minutes).padStart(2, "0");
  document.getElementById("seconds").textContent = String(seconds).padStart(2, "0");
}

setInterval(updateTimer, 1000);
updateTimer();

// Prevent the sound button from pretending to play audio before an audio file exists.
const bgMusic = document.getElementById("bgMusic");
const soundBtn = document.getElementById("soundBtn");

soundBtn.addEventListener("click", async () => {
  try {
    if (bgMusic.paused) {
      await bgMusic.play();
      soundBtn.classList.add("playing");
      soundBtn.textContent = "♫";
    } else {
      bgMusic.pause();
      soundBtn.classList.remove("playing");
      soundBtn.textContent = "♪";
    }
  } catch (e) {
    alert("File musik belum ada. Masukkan file musik yang kamu miliki secara legal ke assets/ dengan nama: komang-raim-laode.mp3");
  }
});

// Browser biasanya memblokir autoplay. Mulai musik setelah klik pertama.
startBtn.addEventListener("click", async () => {
  try {
    await bgMusic.play();
    soundBtn.classList.add("playing");
    soundBtn.textContent = "♫";
  } catch (e) {}
}, { once: true });
