// Pháo hoa - đơn giản demo (bạn có thể thay bằng hiệu ứng phức tạp hơn)
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

let fireworks = [];
let particles = [];

function resize() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
window.addEventListener('resize', resize);
resize();

class Firework {
  constructor(sx, sy, tx, ty) {
    this.x = sx;
    this.y = sy;
    this.sx = sx;
    this.sy = sy;
    this.tx = tx;
    this.ty = ty;
    this.distanceToTarget = Math.hypot(tx - sx, ty - sy);
    this.distanceTraveled = 0;
    this.speed = 5;
    this.angle = Math.atan2(ty - sy, tx - sx);
    this.brightness = Math.random() * 0.5 + 0.5;
    this.targetReached = false;
  }
  update() {
    const vx = Math.cos(this.angle) * this.speed;
    const vy = Math.sin(this.angle) * this.speed;
    this.x += vx;
    this.y += vy;
    this.distanceTraveled = Math.hypot(this.x - this.sx, this.y - this.sy);
    if (this.distanceTraveled >= this.distanceToTarget) {
      this.targetReached = true;
      this.createParticles();
    }
  }
  draw() {
    ctx.beginPath();
    ctx.moveTo(this.x, this.y);
    ctx.lineTo(this.x - Math.cos(this.angle) * 10, this.y - Math.sin(this.angle) * 10);
    ctx.strokeStyle = `rgba(255, 255, 255, ${this.brightness})`;
    ctx.stroke();
  }
  createParticles() {
    const particleCount = 30;
    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle(this.tx, this.ty));
    }
  }
}

class Particle {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.speed = Math.random() * 5 + 2;
    this.angle = Math.random() * Math.PI * 2;
    this.gravity = 0.05;
    this.friction = 0.95;
    this.brightness = Math.random() * 0.5 + 0.5;
    this.alpha = 1;
    this.decay = Math.random() * 0.015 + 0.01;
  }
  update() {
    this.speed *= this.friction;
    this.x += Math.cos(this.angle) * this.speed;
    this.y += Math.sin(this.angle) * this.speed + this.gravity;
    this.alpha -= this.decay;
  }
  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, 3, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(255, 150, 0, ${this.alpha * this.brightness})`;
    ctx.fill();
  }
}

function loop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  for (let i = fireworks.length - 1; i >= 0; i--) {
    fireworks[i].draw();
    fireworks[i].update();
    if (fireworks[i].targetReached) {
      fireworks.splice(i, 1);
    }
  }

  for (let i = particles.length - 1; i >= 0; i--) {
    particles[i].draw();
    particles[i].update();
    if (particles[i].alpha <= 0) {
      particles.splice(i, 1);
    }
  }

  requestAnimationFrame(loop);
}

loop();

// Hoa nở khi bấm vào link rồi chuyển trang
document.addEventListener('DOMContentLoaded', () => {
  const flowerLink = document.getElementById('flowerLink');

  flowerLink.addEventListener('click', (e) => {
    e.preventDefault();

    const flower = document.createElement('div');
    flower.id = 'flowerEffect';
    document.body.appendChild(flower);

    setTimeout(() => {
      window.location.href = flowerLink.href;
    }, 1000);
  });

  // Khi click bất kỳ vị trí nào trên body thì tạo pháo hoa
  document.body.addEventListener('click', (e) => {
    // Ngăn nhấn link bắn pháo hoa 2 lần
    if(e.target === flowerLink) return;

    const x = e.clientX;
    const y = e.clientY;
    const fw = new Firework(canvas.width / 2, canvas.height, x, y);
    fireworks.push(fw);
  });
});
