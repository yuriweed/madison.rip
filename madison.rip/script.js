const ascii = document.getElementById("ascii");
const mainMenu = document.getElementById("mainMenu");
const bgAudio = document.getElementById("bgAudio");
const audioToggle = document.getElementById("audioToggle");
const volumeSlider = document.getElementById("volumeSlider");
const altTrackSwitch = document.getElementById("altTrackSwitch");
const bgVideo = document.getElementById("bgVideo");
const starField = document.getElementById("starField");

let playingAudio = false;
let menuOpen = false;
let usingAltTrack = false;
let audioCtx = null;

generateAsciiStars();

function generateAsciiStars(count = 300) {
  starField.innerHTML = "";
  const symbols = ['*', '.', '+', ':', '~'];
  const screenW = window.innerWidth;
  const screenH = window.innerHeight;
  const spreadW = screenW * 1.5;
  const spreadH = screenH * 1.5;
  const safeZone = { xMin: -250, xMax: 250, yMin: -150, yMax: 150 };

  let placed = 0;
  while (placed < count) {
    const x = (Math.random() - 0.5) * spreadW;
    const y = (Math.random() - 0.5) * spreadH;
    if (x >= safeZone.xMin && x <= safeZone.xMax && y >= safeZone.yMin && y <= safeZone.yMax) continue;

    const star = document.createElement("div");
    star.classList.add("ascii-star");
    star.innerText = symbols[Math.floor(Math.random() * symbols.length)];
    star.style.left = `calc(50% + ${x}px)`;
    star.style.top = `calc(50% + ${y}px)`;
    const size = 10 + Math.random() * 6;
    star.style.fontSize = `${size}px`;
    star.style.animationDuration = `${2 + Math.random() * 3}s, ${20 + Math.random() * 20}s`;
    starField.appendChild(star);
    placed++;
  }
}

document.body.addEventListener("mousemove", (e) => {
  if (menuOpen) return;
  const centerX = window.innerWidth / 2;
  const centerY = window.innerHeight / 2;
  const offsetX = (e.clientX - centerX) / -60;
  const offsetY = (e.clientY - centerY) / -60;
  const rotateX = (e.clientY - centerY) / -80;
  const rotateY = (e.clientX - centerX) / -80;
  ascii.style.transform = `translate(-50%, -50%) translate(${offsetX}px, ${offsetY}px) rotateY(${rotateY}deg) rotateX(${rotateX}deg)`;
});

ascii.addEventListener("click", () => {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    audioCtx.resume();
  }

  if (!menuOpen && !playingAudio) {
    bgAudio.play();
    playingAudio = true;
  }

  toggleMenu();
});

function toggleMenu() {
  if (!menuOpen) {
    ascii.classList.add("fade-out");
    mainMenu.classList.add("show");
  } else {
    ascii.classList.remove("fade-out");
    mainMenu.classList.remove("show");
  }
  menuOpen = !menuOpen;
}


audioToggle.addEventListener('click', () => {
  volumeSlider.classList.toggle("show");
});

volumeSlider.addEventListener('input', (e) => {
  bgAudio.volume = e.target.value;
});

altTrackSwitch.addEventListener("click", () => {
  usingAltTrack = !usingAltTrack;

  if (usingAltTrack) {
    starField.style.transition = "opacity 1s ease";
    starField.style.opacity = 0;

    bgVideo.src = "public/tropical.mov";
    bgAudio.src = "public/tropical.mp3";

    bgVideo.oncanplaythrough = () => {
      bgVideo.classList.add("show");
      bgVideo.play().catch(err => console.error("Video play error:", err));
    };
  } else {
    starField.style.display = "block";
    starField.style.transition = "opacity 1s ease";
    starField.style.opacity = 1;
    generateAsciiStars();

    bgAudio.src = "public/background.mp3";
    bgVideo.classList.remove("show");
    bgVideo.pause();
    bgVideo.removeAttribute("src");
    bgVideo.load();
  }

  bgAudio.play().catch(err => console.error("Audio play error:", err));
});
