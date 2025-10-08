*Erin Noelle Ambuo - IDEA9103: Creative Coding Weekly Quiz #8*

# Fluidness & Gradients

Taking inspiration from creative coding projects on OpenProcessing, I was drawn to works that visualise fluid motion and colourful gradients with soft, grainy textures. These pieces could serve as strong references for an abstract approach that focuses on expressing motion rather than form. The resulting aesthetic evokes water ripples: smooth, ambient, and easy on the eyes.

### **Part 1: Imaging Technique Inspiration**
I've found four different open source projects that have similar themes:
1. Crazy Colors Chladni Patterns
2. Genuary 2024 Day 30 - Shaders
3. Rainflower Stone
4. My Sketch

---

#### 1. Crazy Colors Chladni Patterns
*by jcponcemath*

<img width="350" height="350" alt="Screenshot 2025-10-08 223712" src="https://github.com/user-attachments/assets/be2878b5-242f-4b16-800a-1f8de8ec0a84" />

[OpenProcessing Source](https://openprocessing.org/sketch/2334874)

Technique: Chladni-style sine/cosine equations create moving interference lines; mouse input shifts the pattern.
<br>
<br>
#### 2. Genuary 2024 Day 30 - Shaders
*by Project Somedays*

<img width="350" height="350" alt="Screenshot 2025-10-08 223724" src="https://github.com/user-attachments/assets/7151d3e2-b697-4545-9b36-00ca6b50fe76" />


[OpenProcessing Source](https://openprocessing.org/sketch/2328299)

Technique: Fragment shader mixing interference patterns with gradient mapping; interactive sliders control parameters.
<br>
<br>
#### 3. Rainflower Stone
*by Richard Bourne*

<img width="350" height="350" alt="Screenshot 2025-10-08 223742" src="https://github.com/user-attachments/assets/71bbe86c-4862-4801-b9c6-ee54497c7b0c" />

[OpenProcessing Source](https://openprocessing.org/sketch/2404908)

Technique: Overlapping, noise-steered shapes blend with transparency to form marbled, fluid colour fields (mouse to change pattern).
<br>
<br>
#### 4. My Sketch
*by ngsm*

<img width="350" height="350" alt="Screenshot 2025-10-08 223750" src="https://github.com/user-attachments/assets/b3f743b1-bdc5-490f-bd6a-a13a70b26b68" />

[OpenProcessing Source](https://openprocessing.org/sketch/2503031)

Technique: Particles flow through a noise-based vector field, creating smooth gradients and continuous fluid motion.

---

### **Part 2: Coding Technique Exploration**
All the referenced OpenProcessing artworks openly share how their visuals were coded, revealing a common use of field-based motion to simulate fluidity. It seems that many of the artworks use field-based motion to simulate fluidity. They share techniques like **Perlin Noise, Sine/Cosine Equations and Shader Gradient Mapping** to create the appearance of continous colour transitions. 

Using these as inspirations, I imagine that with an approach like this; the group may need to explore noise-driven flow fields in p5.js where particles move through vectors derived from `noise()`. This should create the same ambient, fluid motion as shaders or wave equations but easier to customise in 2D.
<br>
<br>
#### Flow Field Example
*by adal10086*

<img width="350" height="350" alt="Screenshot 2025-10-08 234301" src="https://github.com/user-attachments/assets/cf81a4ad-26d3-4697-8531-6cd0cd3322c9" />

[p5js Source](https://editor.p5js.org/ada10086/sketches/r1gmVaE07)
        

```
var num = 2000;
var noiseScale=500, noiseStrength=1;
var particles = [num];

function setup() {
  createCanvas(windowWidth, windowHeight);
  noStroke();
  for (let i=0; i<num; i++) {
    //x value start slightly outside the right of canvas, z value how close to viewer
    var loc = createVector(random(width*1.2), random(height), 2);
    var angle = 0; //any value to initialize
    var dir = createVector(cos(angle), sin(angle));
    var speed = random(0.5,2);
    // var speed = random(5,map(mouseX,0,width,5,20));   // faster
    particles[i]= new Particle(loc, dir, speed);
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
function draw() {
  // background(0);
  fill(0, 10);
  noStroke();
  rect(0, 0, width, height);
  for (let i=0; i<particles.length; i++) {
    particles[i].run();
  }
}

class Particle{
  constructor(_loc,_dir,_speed){
    this.loc = _loc;
    this.dir = _dir;
    this.speed = _speed;
  	// var col;
  }
  run() {
    this.move();
    this.checkEdges();
    this.update();
  }
  move(){
    let angle=noise(this.loc.x/noiseScale, this.loc.y/noiseScale, frameCount/noiseScale)*TWO_PI*noiseStrength; //0-2PI
    this.dir.x = cos(angle);
    this.dir.y = sin(angle);
    var vel = this.dir.copy();
    var d =1;  //direction change 
    vel.mult(this.speed*d); //vel = vel * (speed*d)
    this.loc.add(vel); //loc = loc + vel
  }
  checkEdges(){
    //float distance = dist(width/2, height/2, loc.x, loc.y);
    //if (distance>150) {
    if (this.loc.x<0 || this.loc.x>width || this.loc.y<0 || this.loc.y>height) {    
      this.loc.x = random(width*1.2);
      this.loc.y = random(height);
    }
  }
  update(){
    fill(255);
    ellipse(this.loc.x, this.loc.y, this.loc.z);
  }
}
```
