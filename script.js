// --- PHÁO HOA CANVAS ---
(() => {
  const canvas = document.getElementById('canvas');
  const ctx = canvas.getContext('2d');
  let W, H;
  function resize() {
    W = window.innerWidth;
    H = window.innerHeight;
    canvas.width = W;
    canvas.height = H;
  }
  window.addEventListener('resize', resize);
  resize();

  class Firework {
    constructor() {
      this.x = Math.random() * W;
      this.y = H;
      this.targetY = Math.random() * H/2;
      this.speed = 5 + Math.random() * 3;
      this.radius = 2;
      this.exploded = false;
      this.particles = [];
    }
    update() {
      if (!this.exploded) {
        this.y -= this.speed;
        if (this.y <= this.targetY) {
          this.exploded = true;
          for(let i=0; i<50; i++) {
            this.particles.push(new Particle(this.x, this.y));
          }
        }
      }
      this.particles.forEach(p => p.update());
      this.particles = this.particles.filter(p => !p.dead);
    }
    draw() {
      if (!this.exploded) {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI*2);
        ctx.fillStyle = 'white';
        ctx.fill();
      }
      this.particles.forEach(p => p.draw());
    }
    done() {
      return this.exploded && this.particles.length === 0;
    }
  }

  class Particle {
    constructor(x, y) {
      this.x = x;
      this.y = y;
      this.radius = 2 + Math.random() * 2;
      this.speedX = (Math.random() - 0.5) * 10;
      this.speedY = (Math.random() - 0.5) * 10;
      this.gravity = 0.2;
      this.life = 50 + Math.random()*20;
      this.dead = false;
      this.color = `hsl(${Math.random()*360}, 100%, 60%)`;
    }
    update() {
      this.speedY += this.gravity;
      this.x += this.speedX;
      this.y += this.speedY;
      this.life--;
      if (this.life <= 0) this.dead = true;
    }
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI*2);
      ctx.fillStyle = this.color;
      ctx.fill();
    }
  }

  let fireworks = [];

  function loop() {
    ctx.clearRect(0, 0, W, H);
    if (Math.random() < 0.05) fireworks.push(new Firework());
    fireworks.forEach(fw => {
      fw.update();
      fw.draw();
    });
    fireworks = fireworks.filter(fw => !fw.done());
    requestAnimationFrame(loop);
  }
  loop();
})();

// --- HIỆU ỨNG BÔNG HOA NỞ TRƯỚC KHI ĐỔI TRANG ---
document.querySelectorAll('#info a').forEach(link => {
  link.addEventListener('click', function(event) {
    event.preventDefault();

    const flower = document.getElementById('flower-bloom');
    flower.classList.add('active');

    setTimeout(() => {
      window.open(this.href, '_blank'); // mở link mới
      flower.classList.remove('active');
    }, 700);
  });
});
