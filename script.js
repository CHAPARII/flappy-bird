const gameContainer = document.getElementById("game-container");
const bird = document.getElementById("bird");
const scoreDisplay = document.getElementById("score");
const restartButton = document.getElementById("restart-btn");
const flapSound = document.getElementById("flap-sound");
const collisionSound = document.getElementById("collision-sound");

let birdY = 250;
let gravity = 2;
let isGameOver = false;
let pipeSpeed = 2;
let score = 0;
const pipes = [];

function startGame() {
  document.addEventListener("keydown", flap);
  document.addEventListener("touchstart", flap); // Mobile touch support
  createPipe();
  setInterval(updateGame, 20);
}

function flap() {
  if (isGameOver) return;
  birdY -= 40; // Bird moves up when flapping
  flapSound.play(); // Play flap sound
}

function createPipe() {
  if (isGameOver) return;

  const pipeTop = document.createElement("div");
  const pipeBottom = document.createElement("div");
  const pipeGap = 150;
  const pipeHeight = Math.floor(Math.random() * 200) + 50;

  pipeTop.style.width = "50px";
  pipeTop.style.height = `${pipeHeight}px`;
  pipeTop.style.backgroundColor = "green";
  pipeTop.style.position = "absolute";
  pipeTop.style.right = "0";
  pipeTop.style.top = "0";

  pipeBottom.style.width = "50px";
  pipeBottom.style.height = `${400 - pipeHeight - pipeGap}px`;
  pipeBottom.style.backgroundColor = "green";
  pipeBottom.style.position = "absolute";
  pipeBottom.style.right = "0";
  pipeBottom.style.bottom = "0";

  gameContainer.appendChild(pipeTop);
  gameContainer.appendChild(pipeBottom);

  pipes.push({ top: pipeTop, bottom: pipeBottom, x: 400 });

  setTimeout(createPipe, 2000); // Spawn pipes every 2 seconds
}

function updateGame() {
  if (isGameOver) return;

  // Update bird position
  birdY += gravity;
  bird.style.top = `${birdY}px`;

  // Check for collisions
  if (birdY >= 570 || birdY <= 0) {
    gameOver();
  }

  // Move pipes and check collisions
  pipes.forEach((pipe, index) => {
    pipe.x -= pipeSpeed;
    pipe.top.style.right = `${400 - pipe.x}px`;
    pipe.bottom.style.right = `${400 - pipe.x}px`;

    if (pipe.x < -50) {
      // Remove pipes out of view
      gameContainer.removeChild(pipe.top);
      gameContainer.removeChild(pipe.bottom);
      pipes.splice(index, 1);
      score++;
      scoreDisplay.textContent = `Score: ${score}`;
    }

    // Check for collision with pipes
    if (
      pipe.x < 80 &&
      pipe.x > 30 &&
      (birdY < parseInt(pipe.top.style.height) ||
        birdY > 600 - parseInt(pipe.bottom.style.height) - 40)
    ) {
      gameOver();
    }
  });
}

function gameOver() {
  isGameOver = true;
  collisionSound.play();
  alert(`Game Over! Your score: ${score}`);
  restartButton.style.display = "block";
  restartButton.addEventListener("click", resetGame);
}

function resetGame() {
  window.location.reload(); // Reload the page
}

startGame();
