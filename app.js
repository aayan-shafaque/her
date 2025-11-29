// State management
const state = {
  carouselIndex: 0,
  giftOpened: false,
  cubeRotation: { x: 0, y: 0 },
  isDragging: false
};

// Initialize application
document.addEventListener('DOMContentLoaded', () => {
  initSparkles();
  initHeartCanvas();
  initCarousel();
  initCube();
  initHeartsCanvas();
  initRomanticWish();
  initGiftBox();
  initCelebration();
  initFinalHearts();
  initButtons();
});

// Sparkles Canvas (Hero Section)
function initSparkles() {
  const canvas = document.getElementById('sparkles-canvas');
  if (!canvas) return;
  
  const ctx = canvas.getContext('2d');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const sparkles = [];
  const sparkleCount = 50;

  for (let i = 0; i < sparkleCount; i++) {
    sparkles.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      size: Math.random() * 3 + 1,
      speedX: (Math.random() - 0.5) * 0.5,
      speedY: (Math.random() - 0.5) * 0.5,
      opacity: Math.random()
    });
  }

  function animateSparkles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    sparkles.forEach(sparkle => {
      ctx.beginPath();
      ctx.arc(sparkle.x, sparkle.y, sparkle.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255, 255, 255, ${sparkle.opacity})`;
      ctx.fill();

      sparkle.x += sparkle.speedX;
      sparkle.y += sparkle.speedY;
      sparkle.opacity = Math.abs(Math.sin(Date.now() * 0.001 + sparkle.x));

      if (sparkle.x < 0) sparkle.x = canvas.width;
      if (sparkle.x > canvas.width) sparkle.x = 0;
      if (sparkle.y < 0) sparkle.y = canvas.height;
      if (sparkle.y > canvas.height) sparkle.y = 0;
    });

    requestAnimationFrame(animateSparkles);
  }

  animateSparkles();

  window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  });
}

// Heart Canvas (Hero Section)
function initHeartCanvas() {
  const canvas = document.getElementById('heart-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  // Heart canvas size - adjust these values for different device sizes
  canvas.width = 300;  // Canvas width - increase for larger heart
  canvas.height = 300; // Canvas height - increase for larger heart

  // Trails
  let e = [];
  // Heart path
  let h = [];
  // Canvas dimensions
  let O = canvas.width;
  let Q = canvas.height;

  // Number of trails, particles per trail & nodes in heart path
  let v = 120; // Number of heart path nodes - increase for more detailed heart shape

  // Math object
  let M = Math;
  let R = M.random;
  let C = M.cos;
  let Y = 6.3; // close to 44/7 or Math.PI * 2 - 6.3 seems close enough.

  // Calculate heart nodes, from http://mathworld.wolfram.com/HeartCurve.html
  for (let i = 0; i < v; i++) {
    let angle = i / v * Y;
    h.push([
      O/2 + 90*M.pow(M.sin(angle), 3), // Heart shape X coordinate - adjust 90 for heart width
      Q/2 + 5 * (-(15*C(angle) - 5*C(2*angle) - 2*C(3*angle) - C(4*angle))) // Heart shape Y coordinate - adjust 5 for heart height
    ]);
  }

  let i = 0;
  while (i < v) {
    let x = R() * O;
    let y = R() * Q;

    // Create new trail
    let f = [];

    let k = 0;
    while (k < v) {
      // Create new particle
      f[k++] = {
        x: x, // position
        y: y,
        X: 0, // velocity
        Y: 0,
        R: (1 - k/v) + 1, // radius
        S: (R() + 1) * 5, // acceleration
        q: ~~(R() * v), // target node on heart path
        D: i%2*2-1, // direction around heart path
        F: R() * .2 + .7, // friction
        f: "hsla("+~~(330 + R()*20)+","+~~(80 + R()*20)+"%,75%,.3)" // colour
      };
    }

    e[i++] = f; // dots are a 2d array of trails x particles
  }

  function render(_) { // draw particle
    ctx.fillStyle = _.f;
    ctx.beginPath();
    ctx.arc(_.x, _.y, _.R, 0, Y, 1);
    ctx.closePath();
    ctx.fill();
  }

  function loop() {
    ctx.clearRect(0,0,O,Q); // clear screen with transparent background

    i = v;
    while (i--) {
      let f = e[i]; // get worm
      let u = f[0]; // get 1st particle of worm
      let q = h[u.q]; // get current node on heart path
      let D = u.x - q[0]; // calc distance
      let E = u.y - q[1];
      let G = M.sqrt((D * D) + (E * E));

      if (G < 10) { // has trail reached target node?
        if (R() > .95) { // randomly send a trail elsewhere
          u.q = ~~(R() * v);
        } else {
          if (R() > .99) u.D *= -1; // randomly change direction
          u.q += u.D;
          u.q %= v;
          if (u.q < 0) u.q += v;
        }
      }

      u.X += -D / G * u.S; // calculate velocity
      u.Y += -E / G * u.S;

      u.x += u.X; // apply velocity
      u.y += u.Y;

      render(u); // draw the first particle

      u.X *= u.F; // apply friction
      u.Y *= u.F;

      let k = 0;
      while (k < v-1) { // loop through remaining dots
        let T = f[k]; // this particle
        let N = f[++k]; // next particle

        N.x -= (N.x - T.x) * .7; // use zenos paradox to create trail
        N.y -= (N.y - T.y) * .7;

        render(N);
      }
    }
  }

  // Animation loop
  (function doit() {
    requestAnimationFrame(doit);
    loop();
  })();
}

// Carousel functionality
function initCarousel() {
  const carousel = document.getElementById('carousel-3d');
  const cards = document.querySelectorAll('.carousel-card');
  const dotsContainer = document.getElementById('carousel-dots');
  
  if (!carousel || cards.length === 0) return;

  // Create dots
  cards.forEach((_, index) => {
    const dot = document.createElement('div');
    dot.className = `dot ${index === 0 ? 'active' : ''}`;
    dot.addEventListener('click', () => goToSlide(index));
    dotsContainer.appendChild(dot);
  });

  const dots = document.querySelectorAll('.dot');
  let startX = 0;
  let isDragging = false;

  function updateCarousel() {
    const angle = 360 / cards.length;
    const radius = 280;

    cards.forEach((card, index) => {
      const theta = (index - state.carouselIndex) * angle;
      const x = Math.sin(theta * Math.PI / 180) * radius;
      const z = Math.cos(theta * Math.PI / 180) * radius - radius;
      const opacity = z > -radius / 2 ? 1 : 0.3;
      const scale = z > -radius / 2 ? 1 : 0.7;

      card.style.transform = `translate(-50%, -50%) translateX(${x}px) translateZ(${z}px) scale(${scale})`;
      card.style.opacity = opacity;
      card.style.zIndex = Math.floor(z);
    });

    dots.forEach((dot, index) => {
      dot.classList.toggle('active', index === state.carouselIndex);
    });
  }

  function goToSlide(index) {
    state.carouselIndex = index;
    updateCarousel();
  }

  function nextSlide() {
    state.carouselIndex = (state.carouselIndex + 1) % cards.length;
    updateCarousel();
  }

  // Touch and mouse events for swiping
  carousel.addEventListener('touchstart', (e) => {
    startX = e.touches[0].clientX;
    isDragging = true;
  });

  carousel.addEventListener('touchmove', (e) => {
    if (!isDragging) return;
    e.preventDefault();
  });

  carousel.addEventListener('touchend', (e) => {
    if (!isDragging) return;
    const endX = e.changedTouches[0].clientX;
    const diff = startX - endX;

    if (Math.abs(diff) > 50) {
      if (diff > 0) {
        nextSlide();
      } else {
        state.carouselIndex = (state.carouselIndex - 1 + cards.length) % cards.length;
        updateCarousel();
      }
    }
    isDragging = false;
  });

  // Mouse events
  carousel.addEventListener('mousedown', (e) => {
    startX = e.clientX;
    isDragging = true;
  });

  carousel.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    e.preventDefault();
  });

  carousel.addEventListener('mouseup', (e) => {
    if (!isDragging) return;
    const endX = e.clientX;
    const diff = startX - endX;

    if (Math.abs(diff) > 50) {
      if (diff > 0) {
        nextSlide();
      } else {
        state.carouselIndex = (state.carouselIndex - 1 + cards.length) % cards.length;
        updateCarousel();
      }
    }
    isDragging = false;
  });

  updateCarousel();

  // Auto-rotate
  setInterval(nextSlide, 4000);
}

// 3D Cube functionality
function initCube() {
  const cube = document.getElementById('cube-3d');
  if (!cube) return;

  let isDragging = false;
  let startX, startY;
  let currentRotationX = 0;
  let currentRotationY = 0;

  function handleStart(e) {
    isDragging = true;
    cube.classList.add('dragging');
    const touch = e.touches ? e.touches[0] : e;
    startX = touch.clientX;
    startY = touch.clientY;
  }

  function handleMove(e) {
    if (!isDragging) return;
    e.preventDefault();
    
    const touch = e.touches ? e.touches[0] : e;
    const deltaX = touch.clientX - startX;
    const deltaY = touch.clientY - startY;

    currentRotationY += deltaX * 0.5;
    currentRotationX -= deltaY * 0.5;

    cube.style.transform = `rotateX(${currentRotationX}deg) rotateY(${currentRotationY}deg)`;

    startX = touch.clientX;
    startY = touch.clientY;
  }

  function handleEnd() {
    isDragging = false;
    cube.classList.remove('dragging');
  }

  // Touch events
  cube.addEventListener('touchstart', handleStart);
  cube.addEventListener('touchmove', handleMove);
  cube.addEventListener('touchend', handleEnd);

  // Mouse events
  cube.addEventListener('mousedown', handleStart);
  document.addEventListener('mousemove', handleMove);
  document.addEventListener('mouseup', handleEnd);
}

// Hearts Canvas (Particles Section)
function initHeartsCanvas() {
  const canvas = document.getElementById('hearts-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const hearts = [];
  const heartCount = 30;
  let mouseX = canvas.width / 2;
  let mouseY = canvas.height / 2;

  class Heart {
    constructor() {
      this.x = Math.random() * canvas.width;
      this.y = canvas.height + Math.random() * 100;
      this.size = Math.random() * 20 + 10;
      this.speedY = Math.random() * 1 + 0.5;
      this.speedX = (Math.random() - 0.5) * 0.5;
      this.opacity = Math.random() * 0.5 + 0.3;
      this.rotation = Math.random() * Math.PI * 2;
      this.rotationSpeed = (Math.random() - 0.5) * 0.02;
    }

    draw() {
      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.rotate(this.rotation);
      ctx.globalAlpha = this.opacity;
      ctx.fillStyle = '#ff6b9d';
      ctx.font = `${this.size}px Arial`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('❤️', 0, 0);
      ctx.restore();
    }

    update() {
      this.y -= this.speedY;
      this.x += this.speedX;
      this.rotation += this.rotationSpeed;

      // Attraction to mouse
      const dx = mouseX - this.x;
      const dy = mouseY - this.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      if (distance < 100) {
        this.x += dx * 0.02;
        this.y += dy * 0.02;
      }

      if (this.y < -50) {
        this.y = canvas.height + 50;
        this.x = Math.random() * canvas.width;
      }

      if (this.x < -50) this.x = canvas.width + 50;
      if (this.x > canvas.width + 50) this.x = -50;
    }
  }

  for (let i = 0; i < heartCount; i++) {
    hearts.push(new Heart());
  }

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    hearts.forEach(heart => {
      heart.update();
      heart.draw();
    });

    requestAnimationFrame(animate);
  }

  animate();

  // Mouse tracking
  canvas.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  // Touch tracking
  canvas.addEventListener('touchmove', (e) => {
    if (e.touches[0]) {
      mouseX = e.touches[0].clientX;
      mouseY = e.touches[0].clientY;
    }
  });

  window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  });
}

// Romantic Wish Animation
function initRomanticWish() {
  const romanticWish = document.getElementById('romantic-wish');
  if (!romanticWish) return;

  // Initialize Typed.js for typewriter effect with the full message
  const typed = new Typed('#romantic-wish p', {
    strings: [
      "Happy Birthday, Shafaque Meraj 🎉<br><br>On this beautiful day, the world was blessed with your light. 21 years ago, a soul as kind, graceful, and magical as yours entered this world—and since then, it's been glowing brighter ever since. Shafaque, you are my sunshine on cloudy days, my peace in chaos, and the most precious part of my life. As you turn 21, I want you to know just how deeply I love you. My heart beats louder for you with every moment. I'm forever grateful to celebrate you—today, tomorrow, always. 💖"
    ],
    typeSpeed: 50,
    showCursor: false
  });

  // Add sparkle elements
  const sparkleCount = 15;
  for (let i = 0; i < sparkleCount; i++) {
    const sparkle = document.createElement('span');
    sparkle.className = 'sparkle';
    sparkle.style.top = Math.random() * 100 + '%';
    sparkle.style.left = Math.random() * 100 + '%';
    sparkle.style.animationDelay = Math.random() * 2 + 's';
    romanticWish.appendChild(sparkle);
  }
}

// Gift Box functionality
function initGiftBox() {
  const giftBox = document.getElementById('gift-box');
  const giftBurst = document.getElementById('gift-burst');
  const giftHint = document.getElementById('gift-hint');
  const giftTitle = document.querySelector('#gift .section-title');

  if (!giftBox) return;

  giftBox.addEventListener('click', () => {
    if (state.giftOpened) return;

    state.giftOpened = true;
    giftBox.classList.add('opened');
    if (giftTitle) giftTitle.classList.add('moved-up');
    if (giftHint) {
      giftHint.classList.add('moved-up');
      giftHint.style.opacity = '0';
    }

    // Create burst effect
    for (let i = 0; i < 20; i++) {
      const particle = document.createElement('div');
      particle.style.position = 'absolute';
      particle.style.left = '50%';
      particle.style.top = '50%';
      particle.style.fontSize = '2rem';
      particle.textContent = ['❤️', '✨', '💖', '⭐'][Math.floor(Math.random() * 4)];
      particle.style.pointerEvents = 'none';
      
      const angle = (Math.PI * 2 * i) / 20;
      const velocity = 3 + Math.random() * 2;
      const vx = Math.cos(angle) * velocity;
      const vy = Math.sin(angle) * velocity;
      
      giftBurst.appendChild(particle);

      let posX = 0;
      let posY = 0;
      let opacity = 1;
      
      function animateParticle() {
        posX += vx;
        posY += vy;
        opacity -= 0.02;
        
        particle.style.transform = `translate(${posX}px, ${posY}px)`;
        particle.style.opacity = opacity;
        
        if (opacity > 0) {
          requestAnimationFrame(animateParticle);
        } else {
          particle.remove();
        }
      }
      
      animateParticle();
    }
  });
}

// Celebration Stats Counter
function initCelebration() {
  const statNumbers = document.querySelectorAll('.stat-number[data-target]');
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && entry.target.textContent === '0') {
        animateCounter(entry.target);
      }
    });
  });

  statNumbers.forEach(el => observer.observe(el));
}

function animateCounter(element) {
  const target = parseInt(element.dataset.target);
  const duration = 2000;
  const start = Date.now();
  
  function update() {
    const now = Date.now();
    const progress = Math.min((now - start) / duration, 1);
    const value = Math.floor(progress * target);
    
    element.textContent = value;
    
    if (progress < 1) {
      requestAnimationFrame(update);
    } else {
      element.textContent = target;
    }
  }
  
  update();
}

// Final Hearts Canvas
function initFinalHearts() {
  const canvas = document.getElementById('final-hearts');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const hearts = [];

  class FinalHeart {
    constructor() {
      this.x = Math.random() * canvas.width;
      this.y = canvas.height + Math.random() * 100;
      this.size = Math.random() * 30 + 20;
      this.speedY = Math.random() * 2 + 1;
      this.opacity = Math.random() * 0.3 + 0.2;
    }

    draw() {
      ctx.globalAlpha = this.opacity;
      ctx.font = `${this.size}px Arial`;
      ctx.textAlign = 'center';
      ctx.fillText('❤️', this.x, this.y);
    }

    update() {
      this.y -= this.speedY;
      if (this.y < -50) {
        this.y = canvas.height + 50;
        this.x = Math.random() * canvas.width;
      }
    }
  }

  for (let i = 0; i < 15; i++) {
    hearts.push(new FinalHeart());
  }

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    hearts.forEach(heart => {
      heart.update();
      heart.draw();
    });
    requestAnimationFrame(animate);
  }

  animate();

  window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  });
}

// Button handlers
function initButtons() {
  const startBtn = document.getElementById('start-btn');
  const replayBtn = document.getElementById('replay-btn');

  if (startBtn) {
    startBtn.addEventListener('click', () => {
      document.getElementById('carousel').scrollIntoView({ behavior: 'smooth' });
    });
  }

  if (replayBtn) {
    replayBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      state.giftOpened = false;
      const giftBox = document.getElementById('gift-box');
      if (giftBox) {
        giftBox.classList.remove('opened');
      }
      const giftHint = document.getElementById('gift-hint');
      if (giftHint) {
        setTimeout(() => {
          giftHint.style.opacity = '0.7';
        }, 1000);
      }
    });
  }
}

// Secret reveal function
function revealSecret() {
  const msg = document.getElementById('secret-text');
  msg.classList.add('show');
}

// Prevent double-tap zoom on mobile
let lastTouchEnd = 0;
document.addEventListener('touchend', (e) => {
  const now = Date.now();
  if (now - lastTouchEnd <= 300) {
    e.preventDefault();
  }
  lastTouchEnd = now;
}, false);
