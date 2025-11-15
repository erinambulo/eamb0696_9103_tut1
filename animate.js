// =====================================
// 1. Animation Parameters
// =====================================

// ADDED ATTEMPT #2

// Particles + palette for Perlin-noise background
let bgParticles = [];
let palette = [];

// Perlin noise settings for the flow field
let noiseScale = 50;      // spatial scale (smaller = smoother, bigger blobs)
let noiseTimeScale = 100;  // how fast the flow changes over time


// Build a colour palette using the colours from bgSegments
function buildPaletteFromBgSegments() {
  palette = [];
  for (let i = 0; i < bgSegments.length; i += 3) {
    palette.push(bgSegments[i].color);
  }
  if (palette.length === 0) {
    palette.push(color(200, 200, 200));
  }
}

// ==================================================
// Perlin-noise background particle class
// ==================================================
class BgParticle {
  constructor() {
    this.reset();
  }

  reset() {
    this.x = random(width);
    this.y = random(height);
    this.speed = random(0.5, 2);
    this.size = random(10, 35);
    this.color = random(palette);
  }

  update() {
    let angle = noise(
      this.x * noiseScale,
      this.y * noiseScale,
      frameCount * noiseTimeScale
    ) * TWO_PI * 2;

    this.x += cos(angle) * this.speed;
    this.y += sin(angle) * this.speed;

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
    fill(red(c), green(c), blue(c), 60);
    ellipse(this.x, this.y, this.size, this.size);
  }
}

function createBgParticles() {
  bgParticles = [];
  let count = 400; // increase for a denser look

  for (let i = 0; i < count; i++) {
    bgParticles.push(new BgParticle());
  }
}

// ADDED ATTEMPT #2

function assignAnimationParams() {
  for (let seg of bgSegments) {
    seg.rate = random(0.01, 0.03);   // rate
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
// 2. Background Pattern (updated with perlin noise approach) REVISED ATTEMPT #2
// =====================================

function drawBgPattern() {
  for (let p of bgParticles) {
    p.update();
    p.draw();
  }
}

// =====================================
// 3. ANIMATION
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
// 4. DRAW EVERYTHING TOGETHER - REVISED ATTEMPT 2
// =====================================

function drawAll() {
  // soft fading background so trails appear
  noStroke();
  fill(
    red(backColor),
    green(backColor),
    blue(backColor),
    40
  );
  rect(0, 0, width, height);

  // new fluid noise background
  drawBgPattern();

  // original bull foreground
  drawBullPattern();
}
