// =====================================
// 0. INDIVIDUAL: Perlin-noise background
// =====================================

let bgParticles = [];
let palette = [];

// Perlin noise settings
let noiseScale = 0.001;      // spatial smoothness
let noiseTimeScale = 0.001;  // animation speed

// =====================================
// 1. Animation Parameters (group code)
// =====================================

function assignAnimationParams() {
  for (let seg of bgSegments) {
    seg.rate = random(0.01, 0.05);   // rate
    seg.amp = random(0.2, 0.5);      // amplitude/how big the change is
    seg.phase = random(TWO_PI);      // where the shape starts in its cycle
  }
  for (let seg of bullSegments) {
    seg.rate = random(0.02, 0.06);
    seg.amp = random(0.3, 0.7);
    seg.phase = random(TWO_PI);
  }
}

// =====================================
// 2. Palette + Particles for Background
// =====================================

// Build a colour palette from existing bgSegments
function buildPaletteFromBgSegments() {
  palette = [];

  // sample every 3rd segment to avoid massive arrays
  for (let i = 0; i < bgSegments.length; i += 3) {
    palette.push(bgSegments[i].color);
  }

  // fallback if something goes weird
  if (palette.length === 0) {
    palette.push(color(200)); // neutral grey
  }
}

// Simple particle class driven by Perlin noise
class BgParticle {
  constructor() {
    this.reset();
  }

  reset() {
    this.x = random(width);
    this.y = random(height);
    this.speed = random(0.5, 2);
    this.size = random(10, 55);
    this.color = random(palette);
  }

  update() {
    // direction comes from 3D Perlin noise (x, y, time)
    let angle = noise(
      this.x * noiseScale,
      this.y * noiseScale,
      frameCount * noiseTimeScale
    ) * TWO_PI * 2; // *2 = more interesting flow

    this.x += cos(angle) * this.speed;
    this.y += sin(angle) * this.speed;

    // if it drifts off-screen, respawn it
    if (
      this.x < -50 || this.x > width + 50 ||
      this.y < -50 || this.y > height + 50
    ) {
      this.reset();
    }
  }

  draw() {
    noStroke();
    let c = this.color;
    // low alpha so overlaps create gradients
    fill(red(c), green(c), blue(c), 140);
    ellipse(this.x, this.y, this.size, this.size);
  }
}

// Create the swarm of background particles
function createBgParticles() {
  bgParticles = [];
  let count = 3000; // increase for denser background

  for (let i = 0; i < count; i++) {
    bgParticles.push(new BgParticle());
  }
}

// Make sure palette + particles exist (called from draw)
function ensureBgParticles() {
  if (bgParticles.length === 0 && bgSegments.length > 0) {
    buildPaletteFromBgSegments();
    createBgParticles();
  }
}

// =====================================
// 3. Background Pattern (Perlin field)
// =====================================

function drawBgPattern() {
  ensureBgParticles();

  for (let p of bgParticles) {
    p.update();
    p.draw();
  }
}

// =====================================
// 4. Bull Animation (group code, unchanged)
// =====================================

function drawBullPattern() {
  noStroke();

  let scale = min(width / bullImg.width, height / bullImg.height) * 0.8;
  let patternWidth = bullImg.width * scale;
  let patternHeight = bullImg.height * scale;
  let startX = (width - patternWidth) / 2;
  let startY = (height - patternHeight) / 2;

  for (let seg of bullSegments) {
    let cellW = patternWidth / gridSize;
    let cellH = patternHeight / gridSize;
    let x = startX + (seg.col + 0.5) * cellW;
    let y = startY + (seg.row + 0.5) * cellH;

    let cellSize = min(cellW, cellH);

    let pulse = sin(frameCount * seg.rate + seg.phase) * seg.amp;

    let w = cellSize * (shapeSize + pulse);
    let h = cellSize * (shapeSize + pulse);

    fill(seg.color);

    if (seg.shape === 0) {
      ellipse(x, y, w, h);
    } else {
      rectMode(CENTER);
      rect(x, y, w, h);
    }
  }
}

// =====================================
// 5. DRAW EVERYTHING TOGETHER
// =====================================

function drawAll() {
  // First frame: hard reset so we don't keep the default white canvas
  if (frameCount === 1) {
    background(backColor);
  }

  // Soft fade to background colour (covers the WHOLE canvas)
  noStroke();
  rectMode(CORNER);
  fill(
    red(backColor),
    green(backColor),
    blue(backColor),
    30 // tweak: higher = faster fade
  );
  rect(0, 0, width, height);

  // Then draw fluid noise background + bull on top
  drawBgPattern();
  drawBullPattern();
}
