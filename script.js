// ==========================
// 🎈 Rialo Balloon Game (Smooth Move + Shake Effect)
// ==========================

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// Ball setup
let ball = {
  x: 250,
  y: 250,
  dx: 2,
  dy: 2,
  radius: 25,
};

// Paddle setup
let paddle = {
  x: 200,
  y: 480,
  width: 100,
  height: 10,
  dx: 8,
};

// Game state
let score = 0;
let gameOver = false;
let isPaused = false;
let isStarted = false;
let moveLeft = false;
let moveRight = false;

// Shake effect
let shakeTime = 0;
let shakeIntensity = 4;

// Load logo
const logo = new Image();
logo.src = "logo.png";

// --- Draw logo ball ---
function drawBall() {
  ctx.save();
  ctx.beginPath();
  ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
  ctx.clip();
  ctx.drawImage(
    logo,
    ball.x - ball.radius,
    ball.y - ball.radius,
    ball.radius * 2,
    ball.radius * 2
  );
  ctx.restore();
}

// --- Draw paddle ---
function drawPaddle() {
  ctx.fillStyle = "#00bfff";
  ctx.fillRect(paddle.x, paddle.y, paddle.width, paddle.height);
}

// --- Draw score & title ---
function drawScore() {
  ctx.font = "16px Arial";
  ctx.fillStyle = "white";
  ctx.textAlign = "left";
  ctx.fillText("Score: " + score, 10, 20);

  ctx.font = "14px Arial";
  ctx.fillStyle = "red";
  ctx.fillText("🎈 Rialo Balloon Game", 10, 40);
}

// --- Draw Game Over ---
function drawGameOver() {
  ctx.font = "30px Arial";
  ctx.fillStyle = "red";
  ctx.textAlign = "center";
  ctx.fillText("💥 GAME OVER", canvas.width / 2, canvas.height / 2 - 30);

  ctx.font = "20px Arial";
  ctx.fillStyle = "white";
  ctx.fillText("Final Score: " + score, canvas.width / 2, canvas.height / 2);

  ctx.font = "16px Arial";
  ctx.fillStyle = "yellow";
  ctx.fillText("Press R to Restart", canvas.width / 2, canvas.height / 2 + 40);

  ctx.textAlign = "left";
}

// --- Reset game ---
function resetGame() {
  ball.x = 250;
  ball.y = 250;
  ball.dx = 2;
  ball.dy = 2;
  score = 0;
  gameOver = false;
  isStarted = false;
}

// --- Key controls ---
document.addEventListener("keydown", (e) => {
  if (e.code === "ArrowRight") moveRight = true;
  if (e.code === "ArrowLeft") moveLeft = true;

  if (!isStarted && e.key !== "r" && e.key !== "R") {
    isStarted = true;
    draw();
  }

  if (e.code === "Space" && isStarted && !gameOver) {
    isPaused = !isPaused;
  }

  if (e.key === "r" || e.key === "R") {
    if (gameOver) resetGame();
  }
});

document.addEventListener("keyup", (e) => {
  if (e.code === "ArrowRight") moveRight = false;
  if (e.code === "ArrowLeft") moveLeft = false;
});

// --- Click nút Play ---
canvas.addEventListener("click", (e) => {
  if (!isStarted) {
    const textX = canvas.width / 2;
    const textY = canvas.height / 2;
    const textWidth = 100;
    const textHeight = 40;

    // Kiểm tra click vào vùng chữ Play
    if (
      e.offsetX > textX - textWidth / 2 &&
      e.offsetX < textX + textWidth / 2 &&
      e.offsetY > textY - textHeight / 2 &&
      e.offsetY < textY + textHeight / 2
    ) {
      isStarted = true;
      draw();
    }
  }
});

// --- Cập nhật chuyển động ---
function update() {
  if (isPaused || gameOver || !isStarted) return;

  if (moveRight && paddle.x + paddle.width < canvas.width) {
    paddle.x += paddle.dx;
  }
  if (moveLeft && paddle.x > 0) {
    paddle.x -= paddle.dx;
  }

  ball.x += ball.dx;
  ball.y += ball.dy;

  // Va chạm tường
  if (ball.x + ball.radius > canvas.width || ball.x - ball.radius < 0)
    ball.dx *= -1;
  if (ball.y - ball.radius < 0) ball.dy *= -1;

  // Va chạm paddle
  if (
    ball.y + ball.radius >= paddle.y &&
    ball.y + ball.radius <= paddle.y + paddle.height &&
    ball.x > paddle.x &&
    ball.x < paddle.x + paddle.width
  ) {
    // Đặt bóng lên trên paddle
    ball.y = paddle.y - ball.radius;
    // Bật lên
    ball.dy = -Math.abs(ball.dy);
    // Tăng điểm
    score++;

    // Hiệu ứng rung
    shakeTime = 10;
  }

  // Bóng rơi
  if (ball.y - ball.radius > canvas.height) {
    gameOver = true;
  }
}

// --- Hiệu ứng rung màn hình ---
function applyShake() {
  if (shakeTime > 0) {
    const dx = (Math.random() - 0.5) * shakeIntensity;
    const dy = (Math.random() - 0.5) * shakeIntensity;
    ctx.setTransform(1, 0, 0, 1, dx, dy);
    shakeTime--;
  } else {
    ctx.setTransform(1, 0, 0, 1, 0, 0);
  }
}

// --- Vẽ game ---
function draw() {
  applyShake();
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Màn hình mở đầu
  if (!isStarted) {
    ctx.font = "26px Arial";
    ctx.fillStyle = "white";
    ctx.textAlign = "center";
    ctx.fillText(
      "🎈 Rialo Balloon Game",
      canvas.width / 2,
      canvas.height / 2 - 40
    );

    // Nút Play
    ctx.fillStyle = "#00bfff";
    ctx.fillRect(canvas.width / 2 - 50, canvas.height / 2 - 20, 100, 40);
    ctx.fillStyle = "white";
    ctx.font = "20px Arial";
    ctx.fillText("Play", canvas.width / 2, canvas.height / 2 + 8);

    ctx.textAlign = "left";
    return;
  }

  // Khi thua
  if (gameOver) {
    drawGameOver();
    return;
  }

  // Khi pause
  if (isPaused) {
    ctx.font = "28px Arial";
    ctx.fillStyle = "orange";
    ctx.textAlign = "center";
    ctx.fillText("⏸ Paused", canvas.width / 2, canvas.height / 2);
    ctx.textAlign = "left";
    return;
  }

  // Game đang chạy
  drawBall();
  drawPaddle();
  drawScore();
}

// --- Game loop ---
function loop() {
  update();
  draw();
  requestAnimationFrame(loop);
}

logo.onload = () => {
  console.log("✅ Logo loaded!");
  draw();
};

loop();