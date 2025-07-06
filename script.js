const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
let fireworks = [];
let animationFrameId;

// Resize canvas full screen
function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

// Firework particle class
class Particle {
  constructor(x, y, color, direction) {
    this.x = x;
    this.y = y;
    this.color = color;
    this.radius = 3;
    this.life = 100;
    this.direction = direction; // angle in radians
    this.speed = Math.random() * 4 + 2;
    this.gravity = 0.05;
    this.alpha = 1;
  }
  update() {
    this.speed *= 0.95;
    this.x += this.speed * Math.cos(this.direction);
    this.y += this.speed * Math.sin(this.direction) + this.gravity;
    this.alpha -= 0.02;
    this.radius *= 0.97;
    this.life--;
  }
  draw() {
    ctx.save();
    ctx.globalAlpha = this.alpha;
    ctx.beginPath();
    ctx.fillStyle = this.color;
    ctx.shadowColor = this.color;
    ctx.shadowBlur = 10;
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
}

function createFirework(x, y) {
  let colors = ['#ff4444', '#ffbb33', '#00C851', '#33b5e5', '#aa66cc'];
  for (let i = 0; i < 30; i++) {
    let angle = (Math.PI * 2 / 30) * i;
    fireworks.push(new Particle(x, y, colors[i % colors.length], angle));
  }
}

function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  fireworks.forEach((p, i) => {
    p.update();
    p.draw();
    if (p.life <= 0 || p.alpha <= 0) fireworks.splice(i, 1);
  });
  animationFrameId = requestAnimationFrame(animate);
}

// Bắt đầu animation loop
animate();

// Hiển thị pháo hoa khi click
window.addEventListener('click', (e) => {
  createFirework(e.clientX, e.clientY);
});

// Xử lý popup đếm ngược chuyển trang
const link = document.getElementById('special-link');
const popup = document.getElementById('popup');
const countdownSpan = document.getElementById('countdown');
const cancelBtn = document.getElementById('cancel-btn');

link.addEventListener('click', (e) => {
  e.preventDefault();
  popup.classList.remove('hidden');
  let countdown = 3;

  countdownSpan.textContent = countdown;

  let interval = setInterval(() => {
    countdown--;
    countdownSpan.textContent = countdown;
    if (countdown <= 0) {
      clearInterval(interval);
      window.location.href = link.href;
    }
  }, 1000);

  cancelBtn.onclick = () => {
    clearInterval(interval);
    popup.classList.add('hidden');
  };
});
