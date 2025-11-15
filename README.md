*Erin Noelle Ambuo - IDEA9103: Creative Coding Group Major Project Individual Part*

# Untitled (Bull) (1973) by Elaine de Kooning 
### Derived Individual Code by Erin Ambulo
<br>
<b>Expressing Movement through Perlin Noise</b>
<br>My individual work modifies the background of the group code by replacing the geometric grid pattern with a Perlin-noise-driven particle field. This creates a smooth, directional flow behind the bull while keeping the original foreground animation intact. The result is a layered composition where foreground and background behave differently yet cohesively.

---

### Part 1: How to Interact with the Artwork
<br>This artwork begins animating automatically when the page loads. No user interaction (clicking, dragging, mouse movement) is required. The animation runs continuously and indefinitely until the browser tab is closed or refreshed. The sketch is also fully responsive; resizing the browser window triggers the work to redraw and re-scale itself according to the new screen dimensions.

<br>In short:
> Open the page → the animation starts → it evolves forever.
<br>

---

### Part 2: My Individual Approach
<br>For my individual component, I chose Perlin Noise as my core animation driver. My goal was to extend the group’s concept of separating the foreground (bull) from the background, while making the background feel more alive, dynamic, and expressive.

***My Focus:***
- Keep the bull intact as the main identifiable subject
- Transform the background into a flowing, painterly motion field
- Preserve the original colour palette sampled from our group’s background image
- Animate using noise-driven particles to communicate directional movement
- Create contrast between foreground and background motions

***Why Perlin Noise?***
- smooth randomness
- organic movement patterns
- fluid transitions rather than sharp jittery changes

<br>This allowed me to create a background that feels like a living environment behind the bull.

#### Visual Inspirations
I drew direct inspiration from generative artworks on OpenProcessing that use:
- circular particle systems
- directional flow fields
- palette-derived gradients
- Perlin-noise-driven motion

#### 1. Growing Patients
*by Mascaria*

<img width="500" height="350" alt="Growing Patients" src="https://i.imgur.com/LdAAbkT.png" />

[OpenProcessing Source](https://openprocessing.org/sketch/2049655)

Uses swarms of dots to build colour through repeated layering, creating thick atmospheric gradients.
<br>
<br>
#### 2. Tumbled Grouped
*by Mascaria*

<img width="500" height="350" alt="Tumbled Grouped" src="https://i.imgur.com/EZKe8xo.png" />

[OpenProcessing Source](https://openprocessing.org/sketch/2064912)

Shows how noise-driven circular particles can form visually coherent direction, rhythm, and colour density.
<br>
<br>

Both helped me understand how to:
> - blend large numbers of particles into a single visual mass
> - control the “flow direction” of a noisy field
> - maintain palette consistency while producing organic visual complexity

<br>My final background mimics a rising diagonal movement “/”, echoing the implied upward momentum of the bull.

#### Distinction from Group Members
<br>To ensure my work is clearly differentiated:

***My Background:***
- uses 3,000 Perlin-noise-driven particles
- each particle carries a colour sampled from our background image
- particles move with a blended directional bias (up-right)
- thick opacity layers create a gradient-painterly environment
- motion is fluid, smooth, and perpetual
- the animation is not grid-based (unlike the original)

***My Foreground (Bull):***
- still uses the group’s grid-based rendering
- but I adjusted:
> - rate values
> - amplitude
> - size multiplier
- resulting in a slightly tighter, more contained movement
- providing clarity: calm bull vs energetic background

<br>Where the group code animates both layers similarly, my version introduces two visually distinct animation systems.

---

### Part 3: Technical Explanation of Individual Code
<br>My individual contribution happened across four major commits, each deepening the technique and evolving the output.

#### Commit 1: Minimal Perlin Noise Integration
*Goal*: test Perlin noise with the existing grid-based background.
I added:
- ```noiseScale```
- ```noiseTimeScale```
- modified ```drawBgPattern()``` to use noise instead of sine oscillations.

*Outcome*: The change was too subtle. The background still behaved like static grid tiles with only small movement variations. This made it clear that I needed to break free from the grid system entirely to achieve the fluid, gradient-like movement I envisioned.

<img width="500" height="500" alt="Growing Patients" src="https://i.imgur.com/mL35fRW.png" />

<details>
  <summary>Core Code Implementations - animate.js</summary>
  <br><pre>
// =====================================
// 1. Animation Parameters
// =====================================

// Extra settings for Perlin noise background
let noiseScale = 0.1;     // how zoomed in the noise field is (bigger = smoother blobs)
let noiseTimeScale = 0.05; // how fast the noise field evolves over time

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
    //  seg.amp comes from assignAnimationParams()
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
  </pre>
</details>

<br>

#### Commit 2: Introduction of Particle System
*Goal*: introduce a new architecture
I added:
- ```BgParticle``` class
- ```bgParticles[]``` array
- ```buildPaletteFromBgSegments()``` function
- ```createBgParticles()``` function

I replaced the background renderer with thousands of small ellipses animated individually.

*Outcome*: This commit transformed the project’s background from a rigid grid into a dynamic field, similar to the OpenProcessing artworks I studied.

<img width="500" height="350" alt="Growing Patients" src="https://i.imgur.com/GiwzAcZ.png" />

<details>
  <summary>Core Code Implementations - animate.js</summary>
  <br><pre>
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
  </pre>
</details>

<details>
  <summary>Core Code Implementations - sketch.js</summary>
  <br><pre>
  // ====================
// 1. GLOBAL VARIABLES
// ====================

// images setup
let bgImg, bullImg;

// segment setup for grid cells
let bgSegments = [];
let bullSegments = [];

let gridSize = 30; // how many grid cells across and down
let shapeSize = 3.0; // size of each shape (multiplier)
let backColor = 250; // backrgound colour (light grey)

// =====================================
// 2. PRELOAD - load images before setup
// =====================================

function preload() {
  bgImg = loadImage('bull_background.png'); // background link
  bullImg = loadImage('bull_foreground.png'); // foreground link
}

// =========================
// 3. SETUP - runs at start
// =========================

function setup() {
  createCanvas(windowWidth, windowHeight); // full screen canvas
 
  // loading pixel data of both images to grab the sample colours
  bgImg.loadPixels();
  bullImg.loadPixels();
 
  // create data structures for grid
  createBgSegments();
  createBullSegments();

  // ADDED ATTEMP #2
  buildPaletteFromBgSegments();
  createBgParticles();
  assignAnimationParams();

  buildPaletteFromBgSegments();
  createBgParticles();
 
  // draw once when starting
  drawAll();
}

// ======================================================================
// 4. CREATE BACKGROUND SEGMENTS - break background image into grid cells
// ======================================================================

function createBgSegments() {
  bgSegments = [];
 
  // each cell's width over height in pixels of the image
  let segmentWidth = bgImg.width / gridSize;
  let segmentHeight = bgImg.height / gridSize;
 
  for (let row = 0; row < gridSize; row++) {
    for (let col = 0; col < gridSize; col++) {
     
   // find the pixel roughly in the middle of each grid cell
      let x = col * segmentWidth + segmentWidth / 2;
      let y = row * segmentHeight + segmentHeight / 2;
     
  // sample pixel colour drom the image
      let segmentColor = bgImg.get(x, y);
     
  // randomly pick between circle or square
      let shapeType = floor(random(2));
     
  // stored data as one segment object
      bgSegments.push({
        row: row,
        col: col,
        color: segmentColor,
        shape: shapeType
      });
    }
  }
}

// ======================================================================
// 5. CREATE BULL SEGMENTS - break the foreground image into grid cells
// ======================================================================

function createBullSegments() {
  bullSegments = [];

  // each cell's width over height in pixels of the image
  let segmentWidth = bullImg.width / gridSize;
  let segmentHeight = bullImg.height / gridSize;
 
  for (let row = 0; row < gridSize; row++) {
    for (let col = 0; col < gridSize; col++) {
     
  // find the pixel roughly in the middle of each grid cell
      let x = col * segmentWidth + segmentWidth / 2;
      let y = row * segmentHeight + segmentHeight / 2;
     
  // sample pixel colour drom the image
      let segmentColor = bullImg.get(x, y);
     
  // randomly pick between circle or square
      let shapeType = floor(random(2));
     
  // stored data as one segment object
      bullSegments.push({
        row: row,
        col: col,
        color: segmentColor,
        shape: shapeType
      });
    }
  }
}

// ======================================================================
// 6. DRAW - p5.js main loop, background & bull foreground
// ======================================================================

function draw() {
  drawAll();
}

function drawAll() {
  background(backColor); // clear canvas each frame
  drawBgPattern(); // draw geometric background
  drawBullPattern(); // draw the bull foreground layer on top
}

// =============================
// 7. DRAW - background pattern
// =============================

function drawBgPattern() {
  noStroke(); // to make sure all shapes have no outline
  let size = min(width, height); // keep square aspect ratio = no stretching
  let startX = (width - size) / 2; // center horizontally
  let startY = (height - size) / 2; // center vertically


  // loop for each background segment
  for (let i = 0; i < bgSegments.length; i++) {
    let seg = bgSegments[i];
   
  let cellSize = size / gridSize;
  let x = startX + (seg.col + 0.5) * cellSize;
  let y = startY + (seg.row + 0.5) * cellSize;
   
   // shape size
    let w = cellSize * shapeSize;
    let h = cellSize * shapeSize;
   
   fill(seg.color); // fill colour grabbed from image palette
   
   // randomiser to pick between circle or suare
    if (seg.shape == 0) {
      ellipse(x, y, w, h);
    } else {
      rectMode(CENTER);
      rect(x, y, w, h);
    }
  }
}

// =======================
// 8. DRAW - bull pattern
// =======================

function drawBullPattern() {
  noStroke();

  // scales the bull image to fit the canvas with no stretch
  let scale = min(width / bullImg.width, height / bullImg.height) * 0.8;
  let patternWidth = bullImg.width * scale;
  let patternHeight = bullImg.height * scale;
  let startX = (width - patternWidth) / 2;
  let startY = (height - patternHeight) / 2;
 
  // loops bull segments
  for (let i = 0; i < bullSegments.length; i++) {
    let seg = bullSegments[i];
   
   // scaled pattern calculated from each cell's position
    let cellW = patternWidth / gridSize;
    let cellH = patternHeight / gridSize;
    let x = startX + (seg.col + 0.5) * cellW;
    let y = startY + (seg.row + 0.5) * cellH;
   
   // shape size
    let cellSize = min(cellW, cellH);
    let w = cellSize * shapeSize;
    let h = cellSize * shapeSize;
 
   fill(seg.color);
 
  if (seg.shape == 0) {
      ellipse(x, y, w, h);
    } else {
      rectMode(CENTER);
      rect(x, y, w, h);
    }
  }
}

// ===============================================================
// 9. RESPONSIVENESS - redraw everything when window size changes
// ===============================================================

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);  // resize the canvas itself
 
  // recreate everything based on the new canvas size
  createBgSegments();
  createBullSegments();
 
  // redraw all layers
  drawAll();

  assignAnimationParams();
}
  </pre>
</details>
<br>

#### Commit 3: Smoothing & Density Improvements
*Goal*: refine the motion to feel more fluid
I added:
- decreased ```noiseScale``` and ```noiseTimeScale``` to much smaller values
- increased particle count to 3,000
- increased particle size (10–55) for better blending
- darkened alpha to 140 for richer colour
- added a soft fade rectangle ```(fill(..., 30))``` to blend trails

I also lightly modified the bull’s animation parameters to keep the foreground crisp.

*Outcome*: achieved the first truly painterly, fluid gradient background.

<img width="530" height="430" alt="Growing Patients" src="https://i.imgur.com/u5vp0ON.png" />

<details>
  <summary>Core Code Implementations - animate.js</summary>
  <br><pre>
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
  </pre>
</details>
<details>
  <summary>Core Code Implementations - sketch.js</summary>
  <br><pre>
// ====================
// 1. GLOBAL VARIABLES
// ====================

// images setup
let bgImg, bullImg;


// segment setup for grid cells
let bgSegments = [];
let bullSegments = [];

let gridSize = 75; // how many grid cells across and down
let shapeSize = 1.75; // size of each shape (multiplier)
let backColor = 250; // backrgound colour (light grey)

// =====================================
// 2. PRELOAD - load images before setup
// =====================================

function preload() {
  bgImg = loadImage('bull_background.png'); // background link
  bullImg = loadImage('bull_foreground.png'); // foreground link
}

// =========================
// 3. SETUP - runs at start
// =========================

function setup() {
  createCanvas(windowWidth, windowHeight); // full screen canvas
 
  // loading pixel data of both images to grab the sample colours
  bgImg.loadPixels();
  bullImg.loadPixels();
 
  // create data structures for grid
  createBgSegments();
  createBullSegments();

  // ADDED ATTEMP #2
  buildPaletteFromBgSegments();
  createBgParticles();
  assignAnimationParams();

  buildPaletteFromBgSegments();
  createBgParticles();
 
  // draw once when starting
  drawAll();

}

// ======================================================================
// 4. CREATE BACKGROUND SEGMENTS - break background image into grid cells
// ======================================================================

function createBgSegments() {
  bgSegments = [];
 
  // each cell's width over height in pixels of the image
  let segmentWidth = bgImg.width / gridSize;
  let segmentHeight = bgImg.height / gridSize;
 
  for (let row = 0; row < gridSize; row++) {
    for (let col = 0; col < gridSize; col++) {
     
  // find the pixel roughly in the middle of each grid cell
      let x = col * segmentWidth + segmentWidth / 2;
      let y = row * segmentHeight + segmentHeight / 2;
     
  // sample pixel colour drom the image
      let segmentColor = bgImg.get(x, y);
     
  // randomly pick between circle or square
      let shapeType = floor(random(2));
     
  // stored data as one segment object
      bgSegments.push({
        row: row,
        col: col,
        color: segmentColor,
        shape: shapeType
      });
    }
  }
}

// ======================================================================
// 5. CREATE BULL SEGMENTS - break the foreground image into grid cells
// ======================================================================

function createBullSegments() {
  bullSegments = [];

  // each cell's width over height in pixels of the image
  let segmentWidth = bullImg.width / gridSize;
  let segmentHeight = bullImg.height / gridSize;
 
  for (let row = 0; row < gridSize; row++) {
    for (let col = 0; col < gridSize; col++) {
     
  // find the pixel roughly in the middle of each grid cell
      let x = col * segmentWidth + segmentWidth / 2;
      let y = row * segmentHeight + segmentHeight / 2;
     
  // sample pixel colour drom the image
      let segmentColor = bullImg.get(x, y);
     
  // randomly pick between circle or square
      let shapeType = floor(random(2));
     
  // stored data as one segment object
      bullSegments.push({
        row: row,
        col: col,
        color: segmentColor,
        shape: shapeType
      });
    }
  }
}

// ======================================================================
// 6. DRAW - p5.js main loop, background & bull foreground
// ======================================================================

function draw() {
  drawAll();
}

function drawAll() {
  background(backColor); // clear canvas each frame
  drawBgPattern(); // draw geometric background
  drawBullPattern(); // draw the bull foreground layer on top
}

// =============================
// 7. DRAW - background pattern
// =============================

function drawBgPattern() {
  noStroke(); // to make sure all shapes have no outline
  let size = min(width, height); // keep square aspect ratio = no stretching
  let startX = (width - size) / 2; // center horizontally
  let startY = (height - size) / 2; // center vertically

  // loop for each background segment
  for (let i = 0; i < bgSegments.length; i++) {
    let seg = bgSegments[i];
   
  let cellSize = size / gridSize;
  let x = startX + (seg.col + 0.5) * cellSize;
  let y = startY + (seg.row + 0.5) * cellSize;
   
  // shape size
    let w = cellSize * shapeSize;
    let h = cellSize * shapeSize;
   
  fill(seg.color); // fill colour grabbed from image palette
   
  // randomiser to pick between circle or suare
    if (seg.shape == 0) {
      ellipse(x, y, w, h);
    } else {
      rectMode(CENTER);
      rect(x, y, w, h);
    }
  }
}

// =======================
// 8. DRAW - bull pattern
// =======================

function drawBullPattern() {
  noStroke();

  // scales the bull image to fit the canvas with no stretch
  let scale = min(width / bullImg.width, height / bullImg.height) * 0.8;
  let patternWidth = bullImg.width * scale;
  let patternHeight = bullImg.height * scale;
  let startX = (width - patternWidth) / 2;
  let startY = (height - patternHeight) / 2;
 
  // loops bull segments
  for (let i = 0; i < bullSegments.length; i++) {
    let seg = bullSegments[i];
   
  // scaled pattern calculated from each cell's position
    let cellW = patternWidth / gridSize;
    let cellH = patternHeight / gridSize;
    let x = startX + (seg.col + 0.5) * cellW;
    let y = startY + (seg.row + 0.5) * cellH;
   
   // shape size
    let cellSize = min(cellW, cellH);
    let w = cellSize * shapeSize;
    let h = cellSize * shapeSize;
 
  fill(seg.color);
 
  if (seg.shape == 0) {
      ellipse(x, y, w, h);
    } else {
      rectMode(CENTER);
      rect(x, y, w, h);
    }
  }
}

// ===============================================================
// 9. RESPONSIVENESS - redraw everything when window size changes
// ===============================================================

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);  // resize the canvas itself
 
  // recreate everything based on the new canvas size
  createBgSegments();
  createBullSegments();
 
  // redraw all layers
  drawAll();

  assignAnimationParams();
}
  </pre>
</details>
<br>

#### Commit 4: Directional Flow & Final Polish
*Goal*: adding deliberate motion in a diagonal upward-right direction.
I rewrote ```BgParticle.update()``` to blend:
- 25% Perlin noise direction
- 75% fixed directional vector (1, -1)

This created the clear “/” directional movement I wanted.

*Outcome*: increased opacity to 230 for the particles so the background became more solid and unified, while still fading over time.

<img width="500" height="500" alt="Growing Patients" src="https://i.imgur.com/l0RLege.png" />

<details>
  <summary>Core Code Implementations - animate.js</summary>
  <br><pre>
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
    seg.rate = random(0.5, 0.1);
    seg.amp = random(0.5, 0.5);
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
  // 1) Get noise-based direction
  let angle = noise(
    this.x * noiseScale,
    this.y * noiseScale,
    frameCount * noiseTimeScale
  ) * TWO_PI * 2;

  let dx = cos(angle);
  let dy = sin(angle);

  // 2) Strong diagonal bias: up-right "/"
  // biasX > 0  = right
  // biasY < 0  = up
  let biasX = 1.0;
  let biasY = -1.0;

  // 3) Blend noise + bias
  // mixNoise small = mostly diagonal, slightly wobbly
  let mixNoise = 0.25;         // 25% noise
  let mixBias  = 1.0 - mixNoise; // 75% diagonal

  let moveX = (dx * mixNoise + biasX * mixBias);
  let moveY = (dy * mixNoise + biasY * mixBias);

  // 4) Apply movement
  this.x += moveX * this.speed;
  this.y += moveY * this.speed;

  // 5) Respawn if off-screen
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
    fill(red(c), green(c), blue(c), 230);
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
  </pre>
</details>
<details>
  <summary>Core Code Implementations - sketch.js</summary>
  <br><pre>
  // ====================
// 1. GLOBAL VARIABLES
// ====================

// images setup
let bgImg, bullImg;

// segment setup for grid cells
let bgSegments = [];
let bullSegments = [];

let gridSize = 75; // how many grid cells across and down
let shapeSize = 1.75; // size of each shape (multiplier)
let backColor = 250; // backrgound colour (light grey)

// =====================================
// 2. PRELOAD - load images before setup
// =====================================

function preload() {
  bgImg = loadImage('bull_background.png'); // background link
  bullImg = loadImage('bull_foreground.png'); // foreground link
}

// =========================
// 3. SETUP - runs at start
// =========================

function setup() {
  createCanvas(windowWidth, windowHeight); // full screen canvas
 
  // loading pixel data of both images to grab the sample colours
  bgImg.loadPixels();
  bullImg.loadPixels();
 
  // create data structures for grid
  createBgSegments();
  createBullSegments();


  // ADDED ATTEMP #2
  buildPaletteFromBgSegments();
  createBgParticles();
  assignAnimationParams();


  buildPaletteFromBgSegments();
  createBgParticles();
 
  // draw once when starting
  drawAll();

}

// ======================================================================
// 4. CREATE BACKGROUND SEGMENTS - break background image into grid cells
// ======================================================================

function createBgSegments() {
  bgSegments = [];
 
  // each cell's width over height in pixels of the image
  let segmentWidth = bgImg.width / gridSize;
  let segmentHeight = bgImg.height / gridSize;
 
  for (let row = 0; row < gridSize; row++) {
    for (let col = 0; col < gridSize; col++) {
     
  // find the pixel roughly in the middle of each grid cell
      let x = col * segmentWidth + segmentWidth / 2;
      let y = row * segmentHeight + segmentHeight / 2;
     
  // sample pixel colour drom the image
      let segmentColor = bgImg.get(x, y);
     
  // randomly pick between circle or square
      let shapeType = floor(random(2));
     
  // stored data as one segment object
      bgSegments.push({
        row: row,
        col: col,
        color: segmentColor,
        shape: shapeType
      });
    }
  }
}

// ======================================================================
// 5. CREATE BULL SEGMENTS - break the foreground image into grid cells
// ======================================================================

function createBullSegments() {
  bullSegments = [];

  // each cell's width over height in pixels of the image
  let segmentWidth = bullImg.width / gridSize;
  let segmentHeight = bullImg.height / gridSize;
 
  for (let row = 0; row < gridSize; row++) {
    for (let col = 0; col < gridSize; col++) {
     
  // find the pixel roughly in the middle of each grid cell
      let x = col * segmentWidth + segmentWidth / 2;
      let y = row * segmentHeight + segmentHeight / 2;
     
  // sample pixel colour drom the image
      let segmentColor = bullImg.get(x, y);
     
  // randomly pick between circle or square
      let shapeType = floor(random(2));
     
  // stored data as one segment object
      bullSegments.push({
        row: row,
        col: col,
        color: segmentColor,
        shape: shapeType
      });
    }
  }
}

// ======================================================================
// 6. DRAW - p5.js main loop, background & bull foreground
// ======================================================================

function draw() {
  drawAll();
}

function drawAll() {
  background(backColor); // clear canvas each frame
  drawBgPattern(); // draw geometric background
  drawBullPattern(); // draw the bull foreground layer on top
}

// =============================
// 7. DRAW - background pattern
// =============================

function drawBgPattern() {
  noStroke(); // to make sure all shapes have no outline
  let size = min(width, height); // keep square aspect ratio = no stretching
  let startX = (width - size) / 2; // center horizontally
  let startY = (height - size) / 2; // center vertically

  // loop for each background segment
  for (let i = 0; i < bgSegments.length; i++) {
    let seg = bgSegments[i];
   
  let cellSize = size / gridSize;
  let x = startX + (seg.col + 0.5) * cellSize;
  let y = startY + (seg.row + 0.5) * cellSize;
   
  // shape size
    let w = cellSize * shapeSize;
    let h = cellSize * shapeSize;
   
  fill(seg.color); // fill colour grabbed from image palette
   
  // randomiser to pick between circle or suare
    if (seg.shape == 0) {
      ellipse(x, y, w, h);
    } else {
      rectMode(CENTER);
      rect(x, y, w, h);
    }
  }
}

// =======================
// 8. DRAW - bull pattern
// =======================

function drawBullPattern() {
  noStroke();

  // scales the bull image to fit the canvas with no stretch
  let scale = min(width / bullImg.width, height / bullImg.height) * 0.8;
  let patternWidth = bullImg.width * scale;
  let patternHeight = bullImg.height * scale;
  let startX = (width - patternWidth) / 2;
  let startY = (height - patternHeight) / 2;
 
  // loops bull segments
  for (let i = 0; i < bullSegments.length; i++) {
    let seg = bullSegments[i];
   
  // scaled pattern calculated from each cell's position
    let cellW = patternWidth / gridSize;
    let cellH = patternHeight / gridSize;
    let x = startX + (seg.col + 0.5) * cellW;
    let y = startY + (seg.row + 0.5) * cellH;
   
  // shape size
    let cellSize = min(cellW, cellH);
    let w = cellSize * shapeSize;
    let h = cellSize * shapeSize;
 
  fill(seg.color);
 
  if (seg.shape == 0) {
      ellipse(x, y, w, h);
    } else {
      rectMode(CENTER);
      rect(x, y, w, h);
    }
  }
}

// ===============================================================
// 9. RESPONSIVENESS - redraw everything when window size changes
// ===============================================================

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);  // resize the canvas itself
 
  // recreate everything based on the new canvas size
  createBgSegments();
  createBullSegments();
 
  // redraw all layers
  drawAll();

  assignAnimationParams();
}
  </pre>
</details>


---

<b>AI Utilisation Disclosure</b>
<br>In completing this assessment, our group used AI tools such as ChatGPT and Grammarly to support the development process. ChatGPT assisted us in exploring, comparing, and breaking down possible coding approaches based on our initial concepts. Its use was intentionally limited to the scope of IDEA9103’s taught lessons to ensure all derived code remained aligned with our existing skills, knowledge, and coursework framework, with only minimal flexibility for techniques outside the syllabus. Grammarly was used solely to refine our writing by reducing redundancy and improving clarity and conciseness.
