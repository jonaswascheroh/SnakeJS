const SPEED = 100;
const SIZE = 20;
const COLOR1 = '#a6f1a6'; // Board Color
const COLOR2 = '#d2f8d2'; // Board Color
const COLOR3 = 'black'; // Snake Color
const COLOR4 = 'red'; // Fruit Color

const canvas = document.getElementById('myCanvas');
canvas.width = 400;
canvas.height = 400;
const ctx = canvas.getContext('2d');
const pScore = document.getElementById('score');
const pHighscore = document.getElementById('highscore');

let score;
let highscore = 0;

let snakePos = [];
let rightPressed;
let leftPressed;
let upPressed;
let downPressed;
let fruitPos;

function keyDownHandler(e) {
  if ((e.key === 'Right' || e.key === 'ArrowRight') && !leftPressed) {
    rightPressed = true;
    upPressed = false;
    downPressed = false;
  } else if ((e.key === 'Left' || e.key === 'ArrowLeft') && !rightPressed) {
    leftPressed = true;
    upPressed = false;
    downPressed = false;
  } else if ((e.key === 'Up' || e.key === 'ArrowUp') && !downPressed) {
    upPressed = true;
    rightPressed = false;
    leftPressed = false;
  } else if ((e.key === 'Down' || e.key === 'ArrowDown') && !upPressed) {
    downPressed = true;
    rightPressed = false;
    leftPressed = false;
  }
}

document.addEventListener('keydown', keyDownHandler, false);

function initSnake() {
  snakePos = [];
  snakePos.push({ x: 180, y: 180 });
}

function generateFruit() {
  let randomX;
  let randomY;
  let free = true;
  do {
    randomX = Math.floor(Math.random() * 20) * 20;
    randomY = Math.floor(Math.random() * 20) * 20;
    for (let i = 0; i < snakePos.length; i += 1) {
      if (snakePos[i].x === randomX || snakePos[i].y === randomY) {
        free = false;
        break;
      }
    }
  } while (free);
  fruitPos = { x: randomX, y: randomY };
}

/** @description Resets the game.
 */
function init() {
  score = 0;
  initSnake();
  generateFruit();
  rightPressed = false;
  leftPressed = false;
  upPressed = false;
  downPressed = false;
}

/** @description Called when the game is over.
 */
function gameOver() {
  let text = 'GAME OVER';
  if (highscore < score) {
    highscore = score;
    text += ' - NEW BEST!';
  }
  alert(text);
  init();
}

/** @description Checks if the snake hits the borders of the board.
 */
function checkBorders() {
  if (
    snakePos[0].x < 0
    || snakePos[0].x >= canvas.width
    || snakePos[0].y < 0
    || snakePos[0].y >= canvas.height
  ) {
    gameOver();
  }
}

/** @description Checks if the snake hits parts of itself.
 */
function checkSnake() {
  for (let i = 1; i < snakePos.length; i += 1) {
    if (snakePos[0].x === snakePos[i].x && snakePos[0].y === snakePos[i].y) {
      gameOver();
      break;
    }
  }
}

/** @description Checks if the snake hits the fruit.
 */
function checkFruit() {
  if (snakePos[0].x === fruitPos.x && snakePos[0].y === fruitPos.y) {
    score += 1;
    return true;
  }
  return false;
}

/** @description Draws the game board on the canvas.
 */
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
      x = x === 0 ? 1 : 0;
    }
    x = x === 0 ? 1 : 0;
  }
}

/** @description Draws the snake on the canvas.
 */
function drawSnake() {
  for (let i = 0; i < snakePos.length; i += 1) {
    ctx.beginPath();
    ctx.rect(snakePos[i].x, snakePos[i].y, SIZE, SIZE);
    ctx.fillStyle = COLOR3;
    ctx.fill();
    ctx.closePath();
  }
}

/** @description Draws the fruit on the canvas.
 */
function drawFruit() {
  ctx.beginPath();
  ctx.rect(fruitPos.x, fruitPos.y, SIZE, SIZE);
  ctx.fillStyle = COLOR4;
  ctx.fill();
  ctx.closePath();
}

/** @description Moves the snake every frame in one of the directions.
 */
function moveSnake(fruitEaten) {
  if (downPressed || upPressed || rightPressed || leftPressed) {
    let { x } = snakePos[0];
    let { y } = snakePos[0];
    if (downPressed) {
      y += SIZE;
    } else if (upPressed) {
      y -= SIZE;
    } else if (rightPressed) {
      x += SIZE;
    } else if (leftPressed) {
      x -= SIZE;
    }
    snakePos.unshift({ x, y });
    if (!fruitEaten) {
      snakePos.pop();
    }
  }
}

/** @description Function which is called for every frame.
 */
function play() {
  pScore.textContent = `Score: ${score}`;
  pHighscore.textContent = `Highscore: ${highscore}`;
  drawBoard();
  drawFruit();
  checkBorders();
  checkSnake();
  const fruitEaten = checkFruit();
  moveSnake(fruitEaten);
  if (fruitEaten) {
    generateFruit();
  }
  drawSnake();
}

init();
setInterval(play, SPEED);
