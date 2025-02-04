const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

let bird = {
    x: 50,
    y: 150,
    velocity: 0,
    gravity: 0.1,
    size: 20,
    width: 44, // Set the width of your bird image
    height: 34 // Set the height of your bird image
};

let pipes = [];
let score = 0;
let gameRunning = true;

const birdImage = new Image();
birdImage.src = 'bird.png'; // Path to your bird image

birdImage.onload = () => {
    update(); // Start the game loop only after the image is loaded
};

function createPipe() {
    let topHeight = Math.random() * 200 + 100;
    let bottomHeight = canvas.height - topHeight - 150; // Gap of 150
    pipes.push({
        x: canvas.width,
        topHeight: topHeight,
        bottomHeight: bottomHeight,
        width: 50,
        passed: false // Track if the bird has passed the pipe
    });
}

function drawBird() {
    ctx.drawImage(birdImage, bird.x - bird.width/2, bird.y - bird.height/2, bird.width, bird.height); // Draw the image
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

    bird.velocity += bird.gravity;
    bird.y += bird.velocity;

    if (bird.y + bird.size / 2 > canvas.height || bird.y - bird.size / 2 < 0) {
        gameOver();
    }

    if (pipes.length === 0 || pipes[pipes.length - 1].x < canvas.width - 200) {
        createPipe();
    }

    for (let i = 0; i < pipes.length; i++) {
        let p = pipes[i];
        p.x -= 2;
        if (p.x < -p.width) {
            pipes.splice(i, 1);
            i--;
        }
    
        // Collision detection (using image dimensions)
        if (bird.x + bird.width/2 > p.x && bird.x - bird.width/2 < p.x + p.width) {
            if (bird.y - bird.height/2 < p.topHeight || bird.y + bird.height/2 > canvas.height - p.bottomHeight) {
                gameOver();
            }
            if (!p.passed && bird.x > p.x + p.width) {
                score++;
                p.passed = true;
            }
        }
    }
    drawPipes();
    drawBird();

    ctx.fillStyle = "black";
    ctx.font = "20px Arial";
    ctx.textAlign = "left";
    ctx.fillText("Score: " + score, 10, 20);

    if (gameRunning) {
        requestAnimationFrame(update);
    }
}

function gameOver() {
    gameRunning = false;
    ctx.fillStyle = "red";
    ctx.font = "30px Arial";
    ctx.fillText("Game Over!", canvas.width / 2 - 80, canvas.height / 2);
}

// Event listener for keyboard
document.addEventListener('keydown', (e) => {
    if (e.code === 'Space' && gameRunning) {
        bird.velocity = -3;
    }
    if(e.code === 'Space' && !gameRunning){
        location.reload();
    }
});

// Event listener for touch (Tap to jump)
document.addEventListener('touchstart', () => {
    if (gameRunning) {
        bird.velocity = -3;
    } else {
        location.reload();
    }
});

update();
