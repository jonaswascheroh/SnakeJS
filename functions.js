const SPEED = 100;
const SIZE = 20;
const COLOR1 = "#a6f1a6"; // Board Color
const COLOR2 = "#d2f8d2"; // Board Color
const COLOR3 = "black"; // Snake Color
const COLOR4 = "red"; // Fruit Color

var canvas = document.getElementById("myCanvas");
canvas.width = 400;
canvas.height = 400;
var ctx = canvas.getContext("2d");
var p_score = document.getElementById("score");
var p_highscore = document.getElementById("highscore");

var score;
var highscore = 0;

var snakePos = [];
var rightPressed;
var leftPressed;
var upPressed;
var downPressed;
var fruitEaten;
var fruitPos;

function initSnake() {
  snakePos = [];
  snakePos.push({ x: 180, y: 180 });
}

document.addEventListener("keydown", keyDownHandler, false);

function checkBorders() {
  let gameover = false;
  if (
    snakePos[0].x < 0 ||
    snakePos[0].x >= canvas.width ||
    snakePos[0].y < 0 ||
    snakePos[0].y >= canvas.height
  ) {
    gameOver();
  }
}

function gameOver() {
  let text = "GAME OVER";
  if (highscore < score) {
    highscore = score;
    text += " - NEW BEST!";
  }
  alert(text);
  init();
}

function checkSnake() {
  for (let i = 1; i < snakePos.length; i++) {
    if (snakePos[0].x == snakePos[i].x && snakePos[0].y == snakePos[i].y) {
      gameOver();
      break;
    }
  }
}

function checkFruit() {
  if (snakePos[0].x == fruitPos.x && snakePos[0].y == fruitPos.y) {
    score++;
    fruitEaten = true;
  }
}

function drawBoard() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  let x = 0;
  for (let i = 0; i < canvas.width; i += SIZE) {
    for (let j = 0; j < canvas.height; j += SIZE) {
      ctx.beginPath();
      ctx.rect(i, j, SIZE, SIZE);
      ctx.fillStyle = [COLOR1, COLOR2][x];
      ctx.fill();
      ctx.closePath();
      x = x == 0 ? 1 : 0;
    }
    x = x == 0 ? 1 : 0;
  }
}

function drawSnake() {
  for (let i = 0; i < snakePos.length; i++) {
    ctx.beginPath();
    ctx.rect(snakePos[i].x, snakePos[i].y, SIZE, SIZE);
    ctx.fillStyle = COLOR3;
    ctx.fill();
    ctx.closePath();
  }
}

function moveSnake() {
  if (downPressed || upPressed || rightPressed || leftPressed) {
    let x = snakePos[0].x;
    let y = snakePos[0].y;
    if (downPressed) {
      y += SIZE;
    } else if (upPressed) {
      y -= SIZE;
    } else if (rightPressed) {
      x += SIZE;
    } else if (leftPressed) {
      x -= SIZE;
    }
    snakePos.unshift({ x: x, y: y });
    if (!fruitEaten) {
      snakePos.pop();
    }
  }
}

function generateFruit() {
  let randomX;
  let randomY;
  while (true) {
    let free = true;
    randomX = Math.floor(Math.random() * 20) * 20;
    randomY = Math.floor(Math.random() * 20) * 20;
    for (let i = 0; i < snakePos.length; i++) {
      if (snakePos[i].x == randomX || snakePos[i].y == randomY) {
        free = false;
      }
    }
    if (free) {
      break;
    }
  }
  fruitPos = { x: randomX, y: randomY };
}

function drawFruit() {
  ctx.beginPath();
  ctx.rect(fruitPos.x, fruitPos.y, SIZE, SIZE);
  ctx.fillStyle = COLOR4;
  ctx.fill();
  ctx.closePath();
}

function keyDownHandler(e) {
  if ((e.key == "Right" || e.key == "ArrowRight") && !leftPressed) {
    rightPressed = true;
    upPressed = false;
    downPressed = false;
  } else if ((e.key == "Left" || e.key == "ArrowLeft") && !rightPressed) {
    leftPressed = true;
    upPressed = false;
    downPressed = false;
  } else if ((e.key == "Up" || e.key == "ArrowUp") && !downPressed) {
    upPressed = true;
    rightPressed = false;
    leftPressed = false;
  } else if ((e.key == "Down" || e.key == "ArrowDown") && !upPressed) {
    downPressed = true;
    rightPressed = false;
    leftPressed = false;
  }
}

function play() {
  p_score.textContent = "Score: " + score;
  p_highscore.textContent = "Highscore: " + highscore;
  drawBoard();
  drawFruit();
  checkBorders();
  checkFruit();
  checkSnake();
  moveSnake();
  if (fruitEaten) {
    generateFruit();
    fruitEaten = false;
  }
  drawSnake();
}

function init() {
  score = 0;
  initSnake();
  generateFruit();
  rightPressed = false;
  leftPressed = false;
  upPressed = false;
  downPressed = false;
  fruitEaten = false;
}
init();
var interval = setInterval(play, SPEED);
