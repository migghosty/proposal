// ── STARFIELD ──
const canvas = document.getElementById('starfield');
const ctx = canvas.getContext('2d');
let stars = [];
let shooters = [];

function resize() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resize();
window.addEventListener('resize', resize);

function initStars(n = 220) {
  stars = Array.from({length: n}, () => ({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    r: Math.random() * 1.4 + 0.2,
    a: Math.random(),
    speed: Math.random() * 0.008 + 0.002,
    phase: Math.random() * Math.PI * 2
  }));
}
initStars();

function spawnShooter() {
  if (Math.random() > 0.012) return;
  shooters.push({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height * 0.5,
    vx: 4 + Math.random() * 5,
    vy: 1.5 + Math.random() * 2,
    life: 1
  });
}

function drawFrame(t) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  // stars
  stars.forEach(s => {
    s.a = 0.35 + 0.55 * Math.abs(Math.sin(t * s.speed + s.phase));
    ctx.beginPath();
    ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(220,228,255,${s.a})`;
    ctx.fill();
  });
  // shooting stars
  spawnShooter();
  shooters = shooters.filter(s => s.life > 0);
  shooters.forEach(s => {
    ctx.beginPath();
    ctx.moveTo(s.x, s.y);
    ctx.lineTo(s.x - s.vx * 10, s.y - s.vy * 10);
    const g = ctx.createLinearGradient(s.x, s.y, s.x - s.vx*10, s.y - s.vy*10);
    g.addColorStop(0, `rgba(255,255,255,${s.life})`);
    g.addColorStop(1, 'rgba(255,255,255,0)');
    ctx.strokeStyle = g;
    ctx.lineWidth = 1.5;
    ctx.stroke();
    s.x += s.vx; s.y += s.vy; s.life -= 0.03;
  });
  requestAnimationFrame(drawFrame);
}
requestAnimationFrame(drawFrame);

// ── PLANET ORBITS (JS-driven so planets are always reachable) ──
const planetDefs = [
  { id: 'pg1', r: 65,  speed: 0.0008 },
  { id: 'pg2', r: 100, speed: 0.0005 },
  { id: 'pg3', r: 140, speed: 0.00033 },
  { id: 'pg4', r: 180, speed: 0.00022 },
  { id: 'pg5', r: 235, speed: 0.00015 },
];
const angles = [0, 1.2, 2.5, 4.0, 5.2];
let lastTs = null;

function animatePlanets(ts) {
  const dt = lastTs ? Math.min(ts - lastTs, 50) : 16;
  lastTs = ts;
  const sys = document.getElementById('solar-system');
  if (sys) {
    const cx = sys.offsetWidth  / 2;
    const cy = sys.offsetHeight / 2;
    planetDefs.forEach((p, i) => {
      const el = document.getElementById(p.id);
      if (!el) return;
      angles[i] += p.speed * dt;
      el.style.left = (cx + Math.cos(angles[i]) * p.r) + 'px';
      el.style.top  = (cy + Math.sin(angles[i]) * p.r) + 'px';
    });
  }
  requestAnimationFrame(animatePlanets);
}
requestAnimationFrame(animatePlanets);

// ── SCREEN NAV ──
function goTo(id) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  document.getElementById(id).classList.add('active');
}

// ── PLANET INTERACTIONS ──
const eggClicks = { Mercury: 0, Venus: 0 };

const easterEggs = {
  Mercury: [
    "☿ Mercury: Too hot, too cold, too tiny. Not the one!",
    "☿ You clicked Mercury again? Persistent! Still no though 😄",
    "☿ Mercury says: 'I have no atmosphere, unlike this moment...' 🪨",
    "☿ Okay Mercury appreciates the attention. But the message isn't here!",
  ],
  Venus: [
    "♀ Venus: Beautiful, but covered in acid clouds. Not ideal! ☁️",
    "♀ You found Venus again! She's flattered. Still not it though 😏",
    "♀ Venus is the brightest star in the sky... but not YOUR star 🌟",
    "♀ Venus whispers: 'the pink one is the one you want...' 💅",
  ],
};

const standardHints = {
  Earth: [
    "🌍 Home sweet home — but the message isn't from here!",
    "🌍 Earth again? You live here! The signal came from further out...",
    "🌍 Earth waves hello. The message is still out there! 🌊",
  ],
  Mars: [
    "🔴 Mars: cold, dusty, and not the right planet!",
    "🔴 Still checking Mars? The rovers found nothing either 😄",
    "🔴 Mars is intrigued. But nope — keep exploring! 🚀",
  ],
};
const standardClicks = { Earth: 0, Mars: 0 };

function wrongPlanet(name) {
  const hint = document.getElementById('planet-hint');

  if (easterEggs[name]) {
    const idx = eggClicks[name] % easterEggs[name].length;
    hint.textContent = easterEggs[name][idx];
    eggClicks[name]++;
    if (eggClicks[name] > 1) spawnMiniStars();
  } else if (standardHints[name]) {
    const idx = standardClicks[name] % standardHints[name].length;
    hint.textContent = standardHints[name][idx];
    standardClicks[name]++;
  }
}

function spawnMiniStars() {
  for (let i = 0; i < 6; i++) {
    const el = document.createElement('div');
    el.textContent = ['✨','💫','⭐'][Math.floor(Math.random()*3)];
    el.style.cssText = `position:fixed;left:${30+Math.random()*40}vw;top:${30+Math.random()*40}vh;font-size:1rem;pointer-events:none;z-index:999;animation:floatUp ${1+Math.random()}s ease forwards;`;
    el.style.setProperty('--float-rot', `${Math.random() > 0.5 ? '' : '-'}${Math.floor(Math.random() * 360)}deg`);
    document.body.appendChild(el);
    setTimeout(() => el.remove(), 2000);
  }
}

function revealMessage() {
  setTimeout(() => goTo('screen-message'), 400);
}

// ── NO BUTTON: 3-PHASE FLOW ──
let noPhase = 0;

const noPhases = [
  { label: 'No thanks',           subtext: '' },
  { label: 'Are you sure? 🤔',    subtext: 'ARE YOU SURE?' },
  { label: 'There\'s no going back...', subtext: 'THERE IS NO GOING BACK' },
  { label: 'Oops... 😬',          subtext: 'OOPS .. MESSAGE SENT TO THE WRONG PERSON' },
];

function handleNo() {
  noPhase++;
  const btn     = document.getElementById('btn-no');
  const subtext = document.getElementById('no-subtext');

  if (noPhase >= noPhases.length) {
    subtext.textContent = noPhases[3].subtext;
    subtext.style.opacity = '1';
    btn.disabled = true;
    btn.style.opacity = '0.2';
    btn.style.pointerEvents = 'none';
    setTimeout(() => goTo('screen-farewell'), 2200);
    return;
  }

  const phase = noPhases[noPhase];

  btn.style.transform = 'scale(0.9)';
  setTimeout(() => {
    btn.textContent = phase.label;
    btn.style.transform = 'scale(1)';
  }, 120);

  if (phase.subtext) {
    subtext.style.opacity = '0';
    setTimeout(() => {
      subtext.textContent = phase.subtext;
      subtext.style.opacity = '1';
    }, 180);
  }

  if (noPhase === 2) {
    const box = document.querySelector('#screen-message .message-box');
    box.style.animation = 'none';
    void box.offsetWidth;
    box.style.animation = 'shakeBox 0.4s ease';
  }

  if (noPhase === 3) {
    subtext.style.color = '#ff4466';
    const box = document.querySelector('#screen-message .message-box');
    box.style.animation = 'shakeBox 0.5s ease';
  }
}

// ── YES: launch confetti hearts ──
document.getElementById('screen-yes').addEventListener('transitionend', function(e) {
  if (!this.classList.contains('active')) return;
  launchHearts();
});

function launchHearts() {
  const emojis = ['💫','⭐','🌟','✨','🌙','💖','🪐'];
  for (let i = 0; i < 30; i++) {
    setTimeout(() => {
      const el = document.createElement('div');
      el.textContent = emojis[Math.floor(Math.random() * emojis.length)];
      el.style.cssText = `
        position:fixed;
        left:${Math.random()*100}vw;
        top:${100 + Math.random()*20}vh;
        font-size:${1.2 + Math.random()*1.5}rem;
        pointer-events:none;
        z-index:999;
        animation: floatUp ${2 + Math.random()*2}s ease forwards;
      `;
      el.style.setProperty('--float-rot', `${Math.random() > 0.5 ? '' : '-'}${Math.floor(Math.random() * 360)}deg`);
      document.body.appendChild(el);
      setTimeout(() => el.remove(), 4000);
    }, i * 80);
  }
}
