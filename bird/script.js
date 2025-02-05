const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

let bird = {
  x: 50,
  y: 150,
  velocity: 0,
  gravity: 0.1,
  size: 20,
  width: 44, // Width of the bird image
  height: 34 // Height of the bird image
};

let pipes = [];
let score = 0;
let gameRunning = false; // Game will start after countdown

const birdImage = new Image();
birdImage.src = 'bird.png'; // Path to your bird image

// Start the countdown after the bird image loads
birdImage.onload = () => {
  startCountdown();
};

function startCountdown() {
  let countdown = 3;
  document.getElementById('countdownTimer').innerText = countdown;
  const timerInterval = setInterval(() => {
    countdown--;
    if (countdown > 0) {
      document.getElementById('countdownTimer').innerText = countdown;
    } else {
      clearInterval(timerInterval);
      // Hide the countdown overlay
      document.getElementById('countdownOverlay').style.display = 'none';
      // Start the game
      gameRunning = true;
      update();
    }
  }, 1000);
}

function createPipe() {
  let topHeight = Math.random() * 200 + 100;
  let bottomHeight = canvas.height - topHeight - 150; // Gap of 150
  pipes.push({
    x: canvas.width,
    topHeight: topHeight,
    bottomHeight: bottomHeight,
    width: 50,
    passed: false // To track if the bird has passed the pipe
  });
}

function drawBird() {
  ctx.drawImage(
    birdImage,
    bird.x - bird.width / 2,
    bird.y - bird.height / 2,
    bird.width,
    bird.height
  );
}

function drawPipes() {
  ctx.fillStyle = 'green';
  for (let i = 0; i < pipes.length; i++) {
    let p = pipes[i];
    ctx.fillRect(p.x, 0, p.width, p.topHeight);
    ctx.fillRect(p.x, canvas.height - p.bottomHeight, p.width, p.bottomHeight);
  }
}

function update() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Update bird physics
  bird.velocity += bird.gravity;
  bird.y += bird.velocity;

  // Check for collision with top or bottom of the canvas
  if (bird.y + bird.size / 2 > canvas.height || bird.y - bird.size / 2 < 0) {
    gameOver();
    return;
  }

  // Create new pipe if needed
  if (pipes.length === 0 || pipes[pipes.length - 1].x < canvas.width - 200) {
    createPipe();
  }

  // Update pipes and detect collisions
  for (let i = 0; i < pipes.length; i++) {
    let p = pipes[i];
    p.x -= 2;
    if (p.x < -p.width) {
      pipes.splice(i, 1);
      i--;
      continue;
    }

    // Collision detection using image dimensions
    if (
      bird.x + bird.width / 2 > p.x &&
      bird.x - bird.width / 2 < p.x + p.width
    ) {
      if (
        bird.y - bird.height / 2 < p.topHeight ||
        bird.y + bird.height / 2 > canvas.height - p.bottomHeight
      ) {
        gameOver();
        return;
      }
      if (!p.passed && bird.x > p.x + p.width) {
        score++;
        p.passed = true;
      }
    }
  }
  drawPipes();
  drawBird();

  // Update score display
  document.getElementById('scoreText').innerText = "Score: " + score;

  if (gameRunning) {
    requestAnimationFrame(update);
  }
}

function gameOver() {
  gameRunning = false;
  ctx.fillStyle = "red";
  ctx.font = "30px Arial";
  ctx.textAlign = "center"; // Center the Game Over text
  ctx.fillText("Game Over!", canvas.width / 2, canvas.height / 2);

  // Show the game over popup
  document.getElementById('finalScore').innerText = score;
  document.getElementById('popup').style.display = 'flex';
}

// Reset the game
document.getElementById('resetBtn').addEventListener('click', () => {
  score = 0;
  pipes = [];
  bird.y = 150;
  bird.velocity = 0;
  gameRunning = true;
  document.getElementById('popup').style.display = 'none'; // Hide popup
  update(); // Restart game loop
});

// Back to homepage
document.getElementById('backBtn').addEventListener('click', () => {
  window.location.href = '../index.html'; // Replace with your homepage URL
});

// Keyboard event listener (Space to jump)
document.addEventListener('keydown', (e) => {
  if (e.code === 'Space' && gameRunning) {
    bird.velocity = -3;
  }
  if (e.code === 'Space' && !gameRunning) {
    location.reload();
  }
});

// Touch event listener (Tap to jump)
document.addEventListener('touchstart', () => {
  if (gameRunning) {
    bird.velocity = -3;
  } else {
    location.reload();
  }
});
