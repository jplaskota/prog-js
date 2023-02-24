let ballsValue = document.getElementById("x").value;
document.getElementById("y").max = window.innerWidth * 0.5;
let lineValue = (document.getElementById("y").value = window.innerWidth * 0.2);

let animation;
const balls = [];

const fps = document.getElementById("fps");
let startTime = performance.now();
let frame = 0;

const startBtn = document.getElementById("start");
startBtn.addEventListener("click", startAnimation);

const resetBtn = document.getElementById("reset");
resetBtn.addEventListener("click", resetAnimation);

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

// set canvas size to window size
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// resize canvas on window resize
onresize = () => {
  resetAnimation();
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  document.getElementById("y").max = window.innerWidth * 0.5;
  startAnimation();
};

function startAnimation() {
  const newBallsValue = document.getElementById("x").value;
  lineValue = document.getElementById("y").value;

  if (animation && ballsValue === newBallsValue) {
    return;
  } else {
    ballsValue = newBallsValue;
  }

  createBallsArr(newBallsValue);
  cancelAnimationFrame(animation);
  updateCanvas();
}

function resetAnimation() {
  cancelAnimationFrame(animation);
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  animation = null;
  window.Animation = null;
  balls.length = 0;
}

function createBallsArr(_balls, _speed) {
  balls.length = 0;

  for (let i = 0; i < _balls; i++) {
    balls.push({
      x: Math.random() * (canvas.width - 20) + 10,
      y: Math.random() * (canvas.height - 20) + 10,
      vx: Math.random() * 1 - 2,
      vy: Math.random() * 1 - 2,
      radius: 10,
      color: "#" + Math.floor(Math.random() * 16777215).toString(16),
    });
  }
}

function updateCanvas() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // lines between balls
  for (let i = 0; i < balls.length; i++) {
    const ball1 = balls[i];
    for (let j = i + 1; j < balls.length; j++) {
      const ball2 = balls[j];
      const distance = Math.sqrt(
        (ball1.x - ball2.x) ** 2 + (ball1.y - ball2.y) ** 2
      );
      if (distance <= lineValue) {
        ctx.beginPath();
        ctx.moveTo(ball1.x, ball1.y);
        ctx.lineTo(ball2.x, ball2.y);
        ctx.strokeStyle = "#ffffff";
        ctx.stroke();
      }
    }
  }

  for (let i = 0; i < balls.length; i++) {
    const ball = balls[i];
    ball.x += ball.vx;
    ball.y += ball.vy;

    if (ball.x < ball.radius || ball.x > canvas.width - ball.radius) {
      ball.vx *= -1;
    }
    if (ball.y < ball.radius || ball.y > canvas.height - ball.radius) {
      ball.vy *= -1;
    }

    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
    ctx.fillStyle = ball.color;
    ctx.fill();
    ctx.closePath();
  }
  animation = requestAnimationFrame(updateCanvas);
}

function fpsCounter() {
  var time = performance.now();
  frame++;
  if (time - startTime > 1000) {
    fps.innerHTML = (frame / ((time - startTime) / 1000)).toFixed(0);
    startTime = time;
    frame = 0;
  }
  requestAnimationFrame(fpsCounter);
}
fpsCounter();
