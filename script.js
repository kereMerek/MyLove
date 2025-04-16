let baseScale = 10;
let amplitude = 2;
let angle = 0;
let hueVal = 300;

let clickAnimTime = -1;
const clickAnimDuration = 40;

// Düşen kalplerin dizisi
let fallingHearts = [];

function setup() {
  createCanvas(windowWidth, windowHeight);
  noStroke();
  colorMode(HSB, 360, 100, 100, 100);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function drawHeartAt(x, y, scaleVal, col) {
  fill(col);
  push();
  translate(x, y);
  beginShape();
  for (let t = 0; t <= 360; t += 2) {
    let rad = radians(t);
    let X = 16 * pow(sin(rad), 3);
    let Y = 13 * cos(rad) - 5 * cos(2 * rad) - 2 * cos(3 * rad) - cos(4 * rad);
    vertex(X * scaleVal, -Y * scaleVal);
  }
  endShape(CLOSE);
  pop();
}

function draw() {
  background(0);

  // Kalp animasyonları
  let mainScale = baseScale + amplitude * sin(radians(angle));
  let extraSwing = 0;
  let extraScale = 1;

  if (clickAnimTime >= 0) {
    extraSwing = 10 * sin((8 * PI * clickAnimTime) / clickAnimDuration) * exp(-clickAnimTime / 15);
    extraScale = 1 + 0.2 * sin((PI * clickAnimTime) / clickAnimDuration);

    clickAnimTime++;
    if (clickAnimTime > clickAnimDuration) clickAnimTime = -1;
  }

  let bright = map(sin(radians(angle)), -1, 1, 50, 100);
  let heartColor = color(hueVal, 80, bright);
  let finalScale = mainScale * extraScale;

  for (let i = 8; i > 0; i--) {
    let alpha = map(i, 0, 8, 0, 20);
    let sizeFactor = finalScale + i;
    let glowColor = color(hueVal, 80, bright, alpha);
    drawHeartAt(width / 2 + extraSwing, height / 2, sizeFactor, glowColor);
  }
  drawHeartAt(width / 2 + extraSwing, height / 2, finalScale, heartColor);

  // Düşen kalplerin çizimi
  for (let i = fallingHearts.length - 1; i >= 0; i--) {
    fallingHearts[i].update();
    fallingHearts[i].show();
    if (fallingHearts[i].isOffScreen()) {
      fallingHearts.splice(i, 1);
    }
  }

  angle = (angle + 1) % 360;
}

function mouseClicked() {
  clickAnimTime = 0;

  // 10 tane rastgele konumlu düşen kalp oluştur
  for (let i = 0; i < 10; i++) {
    fallingHearts.push(new FallingHeart(random(width), random(-200, -50)));
  }
}

// Düşen kalp sınıfı
class FallingHeart {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.scale = random(1.5, 3);
    this.speed = random(1, 3);
    this.opacity = 100;
    this.offset = random(1000); // salınım için faz
  }

  update() {
    this.y += this.speed;
    this.x += 0.5 * sin(radians(frameCount * 3 + this.offset)); // hafif salınım
    this.opacity -= 0.5; // yavaşça kaybolur
  }

  show() {
    let c = color(hueVal, 80, 100, this.opacity);
    drawHeartAt(this.x, this.y, this.scale, c);
  }

  isOffScreen() {
    return this.y > height + 50 || this.opacity <= 0;
  }
}
