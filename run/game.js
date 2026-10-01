(() => {
  'use strict';

  const canvas = document.getElementById('game');
  const ctx = canvas.getContext('2d');
  const overlay = document.getElementById('overlay');
  const overlayTitle = document.getElementById('overlayTitle');
  const overlayText = document.getElementById('overlayText');
  const playBtn = document.getElementById('playBtn');
  const scoreEl = document.getElementById('score');
  const bestEl = document.getElementById('best');
  const coinsEl = document.getElementById('coins');
  const wrap = document.getElementById('canvasWrap');

  const W = canvas.width;
  const H = canvas.height;
  const groundY = 430;

  let state = 'ready';
  let score = 0;
  let coins = 0;
  let speed = 7;
  let spawnTimer = 0;
  let coinTimer = 0;
  let lastTime = 0;
  let best = Number(localStorage.getItem('pelocoRunBest') || 0);
  let obstacles = [];
  let coinItems = [];
  let particles = [];
  let clouds = [
    {x: 100, y: 85, s: 1},
    {x: 500, y: 130, s: .8},
    {x: 820, y: 70, s: 1.15}
  ];

  bestEl.textContent = pad(best);

  const player = {
    x: 150,
    y: groundY - 104,
    w: 74,
    h: 104,
    vy: 0,
    grounded: true,
    frame: 0,
    frameTick: 0,
    tilt: 0
  };

  function pad(n) {
    return Math.max(0, Math.floor(n)).toString().padStart(5, '0');
  }

  function reset() {
    score = 0;
    coins = 0;
    speed = 7;
    spawnTimer = 40;
    coinTimer = 120;
    obstacles = [];
    coinItems = [];
    particles = [];
    player.y = groundY - player.h;
    player.vy = 0;
    player.grounded = true;
    player.tilt = 0;
    updateHud();
  }

  function start() {
    reset();
    state = 'playing';
    overlay.classList.add('hidden');
    lastTime = performance.now();
  }

  function endGame() {
    state = 'gameover';
    if (Math.floor(score) > best) {
      best = Math.floor(score);
      localStorage.setItem('pelocoRunBest', String(best));
      bestEl.textContent = pad(best);
    }
    overlayTitle.textContent = 'RUN OVER';
    overlayText.textContent = `Score ${pad(score)} · Coins ${coins}. Tap play and try again.`;
    playBtn.textContent = 'PLAY AGAIN';
    overlay.classList.remove('hidden');
  }

  function jump() {
    if (state === 'ready' || state === 'gameover') {
      start();
      setTimeout(jump, 0);
      return;
    }
    if (state !== 'playing') return;
    if (player.grounded) {
      player.vy = -17.5;
      player.grounded = false;
      burst(player.x + 28, groundY - 2, 8, '#d8c09a');
    }
  }

  function spawnObstacle() {
    const types = [
      {w: 44, h: 54, kind: 'crate'},
      {w: 64, h: 34, kind: 'log'},
      {w: 36, h: 48, kind: 'rock'}
    ];
    const t = types[Math.floor(Math.random() * types.length)];
    obstacles.push({x: W + 40, y: groundY - t.h, w: t.w, h: t.h, kind: t.kind});
  }

  function spawnCoinArc() {
    const count = 3 + Math.floor(Math.random() * 3);
    const baseX = W + 40;
    const arcY = 300 - Math.random() * 55;
    for (let i = 0; i < count; i++) {
      coinItems.push({
        x: baseX + i * 58,
        y: arcY - Math.sin((i / Math.max(1, count - 1)) * Math.PI) * 55,
        r: 16,
        spin: Math.random() * Math.PI * 2,
        taken: false
      });
    }
  }

  function burst(x, y, count, color) {
    for (let i = 0; i < count; i++) {
      particles.push({
        x, y,
        vx: (Math.random() - .5) * 5,
        vy: -Math.random() * 4 - 1,
        life: 1,
        size: 2 + Math.random() * 4,
        color
      });
    }
  }

  function update(dt) {
    if (state !== 'playing') return;
    const step = dt / 16.6667;

    speed = Math.min(15, speed + 0.0018 * step);
    score += 0.16 * speed * step;

    player.vy += 0.9 * step;
    player.y += player.vy * step;
    player.frameTick += step;
    if (player.frameTick > 5) {
      player.frame = (player.frame + 1) % 4;
      player.frameTick = 0;
    }

    if (player.y >= groundY - player.h) {
      player.y = groundY - player.h;
      player.vy = 0;
      player.grounded = true;
      player.tilt *= .7;
    } else {
      player.tilt = Math.max(-.2, Math.min(.15, player.vy / 80));
    }

    spawnTimer -= step;
    if (spawnTimer <= 0) {
      spawnObstacle();
      spawnTimer = 78 + Math.random() * 72 - speed * 1.8;
    }

    coinTimer -= step;
    if (coinTimer <= 0) {
      spawnCoinArc();
      coinTimer = 150 + Math.random() * 110;
    }

    for (const o of obstacles) o.x -= speed * step;
    obstacles = obstacles.filter(o => o.x + o.w > -40);

    for (const c of coinItems) {
      c.x -= speed * step;
      c.spin += 0.16 * step;
      if (!c.taken && rectCircle(player.x + 10, player.y + 8, player.w - 20, player.h - 12, c.x, c.y, c.r)) {
        c.taken = true;
        coins += 1;
        score += 25;
        burst(c.x, c.y, 10, '#ffd45d');
      }
    }
    coinItems = coinItems.filter(c => !c.taken && c.x + c.r > -30);

    for (const p of particles) {
      p.x += p.vx * step;
      p.y += p.vy * step;
      p.vy += .15 * step;
      p.life -= .035 * step;
    }
    particles = particles.filter(p => p.life > 0);

    const hitbox = {x: player.x + 16, y: player.y + 12, w: player.w - 28, h: player.h - 14};
    for (const o of obstacles) {
      const ob = {x: o.x + 4, y: o.y + 4, w: o.w - 8, h: o.h - 4};
      if (overlap(hitbox, ob)) {
        burst(player.x + player.w / 2, player.y + player.h / 2, 22, '#ffb444');
        endGame();
        break;
      }
    }

    for (const c of clouds) {
      c.x -= speed * .08 * step;
      if (c.x < -140) c.x = W + 120 + Math.random() * 180;
    }

    updateHud();
  }

  function updateHud() {
    scoreEl.textContent = pad(score);
    bestEl.textContent = pad(best);
    coinsEl.textContent = String(coins);
  }

  function overlap(a, b) {
    return a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y;
  }

  function rectCircle(rx, ry, rw, rh, cx, cy, cr) {
    const nx = Math.max(rx, Math.min(cx, rx + rw));
    const ny = Math.max(ry, Math.min(cy, ry + rh));
    const dx = cx - nx;
    const dy = cy - ny;
    return dx * dx + dy * dy < cr * cr;
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);
    drawBackground();
    drawGround();

    for (const c of coinItems) drawCoin(c);
    for (const o of obstacles) drawObstacle(o);
    drawPlayer();

    for (const p of particles) {
      ctx.globalAlpha = Math.max(0, p.life);
      ctx.fillStyle = p.color;
      ctx.fillRect(p.x, p.y, p.size, p.size);
    }
    ctx.globalAlpha = 1;
  }

  function drawBackground() {
    const sky = ctx.createLinearGradient(0, 0, 0, H);
    sky.addColorStop(0, '#f9e8c7');
    sky.addColorStop(.62, '#f5dba7');
    sky.addColorStop(1, '#d8b57a');
    ctx.fillStyle = sky;
    ctx.fillRect(0, 0, W, H);

    ctx.fillStyle = '#d4b484';
    for (let i = 0; i < 9; i++) {
      const x = (i * 145 - (score * .4) % 145) - 30;
      const h = 45 + ((i * 37) % 80);
      ctx.fillRect(x, groundY - 170 - h, 90, h);
      ctx.fillStyle = '#c19b67';
      for (let wy = groundY - 155 - h; wy < groundY - 180; wy += 22) {
        ctx.fillRect(x + 14, wy, 7, 9);
        ctx.fillRect(x + 38, wy, 7, 9);
      }
      ctx.fillStyle = '#d4b484';
    }

    for (const c of clouds) drawCloud(c.x, c.y, c.s);
  }

  function drawCloud(x, y, s) {
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(s, s);
    ctx.fillStyle = 'rgba(255,255,255,.7)';
    ctx.fillRect(0, 18, 86, 18);
    ctx.beginPath();
    ctx.arc(24, 20, 20, 0, Math.PI * 2);
    ctx.arc(49, 12, 26, 0, Math.PI * 2);
    ctx.arc(72, 22, 17, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  function drawGround() {
    ctx.fillStyle = '#6e9840';
    ctx.fillRect(0, groundY, W, 18);
    ctx.fillStyle = '#4e6f2d';
    ctx.fillRect(0, groundY + 18, W, 8);
    ctx.fillStyle = '#8d643d';
    ctx.fillRect(0, groundY + 26, W, H - groundY - 26);
    ctx.fillStyle = '#6f4b2c';
    for (let x = -((score * 2) % 46); x < W; x += 46) {
      ctx.fillRect(x, groundY + 36, 28, 12);
      ctx.fillRect(x + 17, groundY + 56, 25, 11);
    }
  }

  function drawPlayer() {
    const x = player.x;
    const y = player.y;
    const bob = player.grounded ? Math.sin(player.frame * Math.PI / 2) * 2 : 0;
    ctx.save();
    ctx.translate(x + player.w / 2, y + player.h / 2 + bob);
    ctx.rotate(player.tilt);
    ctx.translate(-player.w / 2, -player.h / 2);

    // backpack
    ctx.fillStyle = '#15161a';
    roundedRect(2, 42, 20, 39, 6, true);
    ctx.fillStyle = '#6d1930';
    ctx.fillRect(4, 47, 3, 27);

    // legs / boots
    const legShift = player.grounded ? [0, 5, 0, -4][player.frame] : 1;
    ctx.fillStyle = '#121316';
    roundedRect(24, 77, 18, 22, 4, true);
    roundedRect(45, 77 + legShift, 18, 22, 4, true);
    ctx.fillStyle = '#050607';
    roundedRect(18, 94, 29, 10, 4, true);
    roundedRect(42, 94 + legShift, 29, 10, 4, true);

    // torso / jacket
    ctx.fillStyle = '#18191d';
    roundedRect(16, 42, 48, 42, 12, true);
    ctx.fillStyle = '#7d1d38';
    ctx.fillRect(18, 45, 5, 31);
    ctx.fillRect(58, 45, 5, 31);
    ctx.fillStyle = '#0c0d10';
    roundedRect(26, 48, 30, 31, 8, true);

    // arms
    ctx.fillStyle = '#17181b';
    roundedRect(6, 50, 18, 28, 7, true);
    roundedRect(57, 48, 16, 28, 7, true);
    ctx.fillStyle = '#f1b724';
    roundedRect(4, 68, 17, 16, 7, true);
    roundedRect(62, 64, 15, 16, 7, true);

    // head
    ctx.fillStyle = '#f5bf2a';
    ctx.beginPath();
    ctx.ellipse(40, 31, 33, 31, 0, 0, Math.PI * 2);
    ctx.fill();
    // cheek tufts
    ctx.fillStyle = '#f7c338';
    ctx.beginPath(); ctx.arc(13, 35, 12, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(67, 35, 12, 0, Math.PI * 2); ctx.fill();

    // crest
    ctx.fillStyle = '#f5bf2a';
    ctx.beginPath();
    ctx.moveTo(30, 8); ctx.lineTo(25, -8); ctx.lineTo(39, 4);
    ctx.lineTo(42, -12); ctx.lineTo(49, 5);
    ctx.lineTo(58, -5); ctx.lineTo(55, 12);
    ctx.closePath(); ctx.fill();

    // eyes
    ctx.fillStyle = '#fffaf0';
    roundedRect(19, 23, 21, 16, 7, true);
    roundedRect(42, 23, 21, 16, 7, true);
    ctx.fillStyle = '#3b2416';
    ctx.fillRect(30, 27, 7, 9);
    ctx.fillRect(46, 27, 7, 9);
    ctx.fillStyle = '#17100c';
    ctx.fillRect(32, 29, 4, 6);
    ctx.fillRect(47, 29, 4, 6);

    // brows
    ctx.strokeStyle = '#5a2b16';
    ctx.lineWidth = 4;
    ctx.beginPath(); ctx.moveTo(19, 20); ctx.lineTo(38, 17); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(44, 17); ctx.lineTo(62, 20); ctx.stroke();

    // cheeks
    ctx.fillStyle = '#ee718d';
    ctx.beginPath(); ctx.ellipse(17, 45, 11, 7, 0, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.ellipse(64, 45, 11, 7, 0, 0, Math.PI * 2); ctx.fill();

    // beak
    ctx.fillStyle = '#dc6a1d';
    ctx.beginPath();
    ctx.moveTo(34, 38); ctx.lineTo(48, 38); ctx.lineTo(41, 46); ctx.closePath(); ctx.fill();

    // chain and medal
    ctx.strokeStyle = '#d8a11e';
    ctx.lineWidth = 2;
    ctx.beginPath(); ctx.arc(40, 54, 13, .1, Math.PI - .1); ctx.stroke();
    ctx.fillStyle = '#e6ad25';
    ctx.beginPath(); ctx.arc(40, 64, 10, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = '#fff0a0'; ctx.lineWidth = 1.5; ctx.stroke();
    ctx.fillStyle = '#6d4100';
    ctx.font = 'bold 10px Georgia'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillText('P', 40, 64);

    ctx.restore();
  }

  function drawObstacle(o) {
    if (o.kind === 'crate') {
      ctx.fillStyle = '#8f542d';
      ctx.fillRect(o.x, o.y, o.w, o.h);
      ctx.strokeStyle = '#5f351d';
      ctx.lineWidth = 5;
      ctx.strokeRect(o.x + 2, o.y + 2, o.w - 4, o.h - 4);
      ctx.beginPath();
      ctx.moveTo(o.x + 5, o.y + 5); ctx.lineTo(o.x + o.w - 5, o.y + o.h - 5);
      ctx.moveTo(o.x + o.w - 5, o.y + 5); ctx.lineTo(o.x + 5, o.y + o.h - 5);
      ctx.stroke();
    } else if (o.kind === 'log') {
      ctx.fillStyle = '#7a4b27';
      roundedRect(o.x, o.y, o.w, o.h, 12, true);
      ctx.fillStyle = '#a2693a';
      ctx.beginPath(); ctx.arc(o.x + o.w - 8, o.y + o.h / 2, o.h / 2 - 3, 0, Math.PI * 2); ctx.fill();
      ctx.strokeStyle = '#6d3c1b'; ctx.lineWidth = 3;
      ctx.beginPath(); ctx.arc(o.x + o.w - 8, o.y + o.h / 2, o.h / 3, 0, Math.PI * 2); ctx.stroke();
    } else {
      ctx.fillStyle = '#77736d';
      ctx.beginPath();
      ctx.moveTo(o.x, o.y + o.h); ctx.lineTo(o.x + 6, o.y + 16); ctx.lineTo(o.x + 18, o.y + 2); ctx.lineTo(o.x + 30, o.y + 11); ctx.lineTo(o.x + o.w, o.y + o.h); ctx.closePath();
      ctx.fill();
      ctx.fillStyle = '#9a9690';
      ctx.beginPath(); ctx.moveTo(o.x + 8, o.y + 18); ctx.lineTo(o.x + 18, o.y + 5); ctx.lineTo(o.x + 23, o.y + 17); ctx.closePath(); ctx.fill();
    }
  }

  function drawCoin(c) {
    ctx.save();
    ctx.translate(c.x, c.y);
    const squish = .35 + Math.abs(Math.cos(c.spin)) * .65;
    ctx.scale(squish, 1);
    ctx.fillStyle = '#d69300';
    ctx.beginPath(); ctx.arc(0, 0, c.r, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#ffd65b';
    ctx.beginPath(); ctx.arc(0, 0, c.r - 3, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = '#fff0a0'; ctx.lineWidth = 2; ctx.stroke();
    ctx.fillStyle = '#7a4800';
    ctx.font = 'bold 18px Georgia'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillText('P', 0, 1);
    ctx.restore();
  }

  function roundedRect(x, y, w, h, r, fill) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + w, y, x + w, y + h, r);
    ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r);
    ctx.arcTo(x, y, x + w, y, r);
    if (fill) ctx.fill(); else ctx.stroke();
  }

  function loop(t) {
    const dt = Math.min(32, t - (lastTime || t));
    lastTime = t;
    update(dt);
    draw();
    requestAnimationFrame(loop);
  }

  playBtn.addEventListener('click', start);
  wrap.addEventListener('pointerdown', (e) => {
    if (e.target === playBtn) return;
    e.preventDefault();
    jump();
  }, {passive:false});

  window.addEventListener('keydown', (e) => {
    if (e.code === 'Space' || e.code === 'ArrowUp') {
      e.preventDefault();
      jump();
    }
  });

  draw();
  requestAnimationFrame(loop);
})();
