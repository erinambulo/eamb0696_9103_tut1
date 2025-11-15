// =====================================
// 1. Animation Parameters
// =====================================

//ADDED ATTEMPT #1

// Extra settings for Perlin noise background
let noiseScale = 0.1;     // how zoomed in the noise field is (bigger = smoother blobs)
let noiseTimeScale = 0.05; // how fast the noise field evolves over time

//ADDED ATTEMPT #1

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
// 2. Background Pattern (updated with perlin noise approach) ADDED ATTEMPT #1
// =====================================

function drawBgPattern() {
  noStroke();                    // no outlines around shapes
  let size = min(width, height); // keep square aspect ratio
  let startX = (width - size) / 2;
  let startY = (height - size) / 2;

  for (let seg of bgSegments) {
    // 1) Base grid position (same as group code)
    let cellSize = size / gridSize;
    let baseX = startX + (seg.col + 0.5) * cellSize;
    let baseY = startY + (seg.row + 0.5) * cellSize;

    // 2) Sample Perlin noise in 3D: (x, y, time)
    let noiseVal = noise(
      seg.col * noiseScale,          // spatial X in noise space
      seg.row * noiseScale,          // spatial Y in noise space
      frameCount * noiseTimeScale    // time dimension
    );

    // 3) Use noise to decide how much to move + how big to be
    //    seg.amp comes from assignAnimationParams()
    let maxOffset = cellSize * seg.amp;                 // how far shapes can drift
    let offsetAmount = map(noiseVal, 0, 1, -maxOffset, maxOffset);
    let sizeFactor   = map(noiseVal, 0, 1, 0.7, 1.3);   // scales size between 70% and 130%

    // 4) Convert noise value into an angle (direction of drift)
    let angle = map(noiseVal, 0, 1, 0, TWO_PI);
    let offsetX = cos(angle) * offsetAmount;
    let offsetY = sin(angle) * offsetAmount;

    // Final position after drift
    let x = baseX + offsetX;
    let y = baseY + offsetY;

    // 5) Base size taken from grid cell, then scaled
    let baseSize = cellSize * shapeSize;
    let w = baseSize * sizeFactor;
    let h = baseSize * sizeFactor;

    // 6) Optional: slightly modulate alpha / brightness with noise
    let r = red(seg.color);
    let g = green(seg.color);
    let b = blue(seg.color);
    let alpha = map(noiseVal, 0, 1, 160, 255);

    fill(r, g, b, alpha);

    // 7) Draw either circle or square (same logic as group base)
    if (seg.shape === 0) {
      ellipse(x, y, w, h); // circle
    } else {
      rectMode(CENTER);
      rect(x, y, w, h);    // square
    }
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
// 4. DRAW EVERYTHING TOGETHER
// =====================================

function drawAll() {
  background(backColor); // clear canvas
  drawBgPattern();       // draw animated background
  drawBullPattern();     // draw animated bull foreground
}
