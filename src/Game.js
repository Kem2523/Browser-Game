//import TileMap so it displays on game
import TileMap from "./TileMap.js";
//changes TileMap size
const tileSize = 32;
//changes character speed
const velocity = 2;
//reference to game area
//from W3schools https://www.w3schools.com/html/html5_canvas.asp
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
//initialize TileMap
const tileMap = new TileMap(tileSize);
const lucy = tileMap.getLucy(velocity);
const enemies = tileMap.getEnemies(velocity);

let gameOver = false;
let gameWin = false;
const gameOverSound = new Audio("../sounds/loser.mp3");
const gameWinSound = new Audio("../sounds/tadaa.mp3");
//loop to redraw screen continuously
function gameLoop() {
  tileMap.draw(ctx);
  drawGameEnd();
  lucy.draw(ctx, pause(), enemies);
  enemies.forEach((enemy) => enemy.draw(ctx, pause(), lucy));
  checkGameOver();
  checkGameWin();
}
function checkGameWin() {
  if (!gameWin) {
    gameWin = tileMap.didWin();
    if (gameWin) {
      gameWinSound.play();
    }
  }
}

function checkGameOver() {
  if (!gameOver) {
    gameOver = isGameOver();
    if (gameOver) {
      gameOverSound.play();
    }
  }
}
function isGameOver() {
  return enemies.some(
    (enemy) => !lucy.powerBallActive && enemy.collideWith(lucy)
  );
}
function pause() {
  return !lucy.madeFirstMove || gameOver || gameWin;
}

//end game shown
function drawGameEnd() {
  if (gameOver || gameWin) {
    let text = "     You win!";
    if (gameOver) {
      text = "  Game Over";
    }
    ctx.fillStyle = "black";
    ctx.fillRect(0, canvas.height / 2.9, canvas.width, 80);

    ctx.font = "80px comic sans";
    const textColor = ctx.createLinearGradient(0, 0, canvas.width, 0);
textColor.addColorStop("0", "Green");


    ctx.fillStyle = textColor;
    ctx.fillText(text, 10, canvas.height / 2);
  }
}

//set the canvas size
tileMap.setCanvasSize(canvas);
//calls the loop 75 times every 1 second to redraw screen
setInterval(gameLoop, 1000 / 75);
