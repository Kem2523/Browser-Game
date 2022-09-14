import MovingDirection from "./Move.js";
export default class Lucy {
  constructor(x, y, tileSize, velocity, tileMap) {
    this.x = x;
    this.y = y;
    this.tileSize = tileSize;
    this.velocity = velocity;
    this.tileMap = tileMap;

    this.currentMovingDirection = null;
    this.requestedMovingDirection = null;

    this.lucyAnimationTimerDefault = 10;
    this.lucyAnimationTimer = null;

    this.lucyRotation = this.Rotation.right;
    this.lucyBarkSound = new Audio("../sounds/growl.mp3");

    this.powerBallSound = new Audio("../sounds/Squeaky-toy-sound-effect.mp3");
    this.powerBallActive = false;
    this.powerBallAboutToExpire = false;
    this.timers = [];

    this.fightGopherSound = new Audio("../sounds/growl.mp3")

    this.madeFirstMove = false;

    document.addEventListener("keydown", this.#keydown);
    this.#loadLucyImages();
  }

  Rotation = {
    right: 0,
    down: 1,
    left: 2,
    up: 3,
  };

  draw(ctx, pause, enemies) {
    if(!pause){
      this.#move();
      this.#animate();
    }
    this.#getBone();
    this.#getPowerBall();
    this.#getGopher(enemies);


    const size = this.tileSize / 2;

    ctx.save();
    ctx.translate(this.x + size, this.y + size);
    ctx.rotate((this.lucyRotation * 90 * Math.PI) / 180);
    ctx.drawImage(
      this.lucyImages[this.lucyImageIndex],
      -size,
      -size,
      this.tileSize,
      this.tileSize
    );

    ctx.restore();
  }
//lucy animation so it appears she is walking
  #loadLucyImages() {
    const lucyImage1 = new Image();
    lucyImage1.src = "../images/lucy1.png";

    const lucyImage2 = new Image();
    lucyImage2.src = "../images/lucy2.png";

    const lucyImage3 = new Image();
    lucyImage3.src = "../images/lucy3.png";

    const lucyImage4 = new Image();
    lucyImage4.src = "../images/lucy4.png";
//array of the images to loop through
    this.lucyImages = [lucyImage1, lucyImage2, lucyImage3, lucyImage4];

    this.lucyImageIndex = 0;
  }
  #keydown = (event) => {
    //up
    //each key on keyboard has a number
  
    if (event.keyCode == 38) {
      //current moving direction is going down so makes it so requested option has to be up
      if (this.currentMovingDirection == MovingDirection.down)
        this.currentMovingDirection = MovingDirection.up;
      this.requestedMovingDirection = MovingDirection.up;
      this.madeFirstMove = true;
    }
    //down
  //current moving direction is going up so makes it so requested option has to be down

    if (event.keyCode == 40) {
      if (this.currentMovingDirection == MovingDirection.up)
        this.currentMovingDirection = MovingDirection.down;
      this.requestedMovingDirection = MovingDirection.down;
      this.madeFirstMove = true;
    }
    //left
   //current moving direction is going right so makes it so requested option has to be left

    if (event.keyCode == 37) {
      if (this.currentMovingDirection == MovingDirection.right)
        this.currentMovingDirection = MovingDirection.left;
      this.requestedMovingDirection = MovingDirection.left;
      this.madeFirstMove = true;
    }
    //right
        //current moving direction is going left so makes it so requested option has to be right

    if (event.keyCode == 39) {
      if (this.currentMovingDirection == MovingDirection.left)
        this.currentMovingDirection = MovingDirection.right;
      this.requestedMovingDirection = MovingDirection.right;
      this.madeFirstMove = true;
    }
  };
  
  #move() {
    if (this.currentMovingDirection !== this.requestedMovingDirection) {
      if (
        Number.isInteger(this.x / this.tileSize) &&
        Number.isInteger(this.y / this.tileSize)
      ) {
        if (
          !this.tileMap.didCollideWithEnvironment(
            this.x,
            this.y,
            this.requestedMovingDirection
          )
        )
          this.currentMovingDirection = this.requestedMovingDirection;
      }
    }

    if (
      this.tileMap.didCollideWithEnvironment(
        this.x,
        this.y,
        this.currentMovingDirection
      )
    ) {
      this.lucyAnimationTimer = null;
      //what image of lucy is shown when collision occurs
      this.lucyImageIndex = 1;
      return;
    } else if (
      this.currentMovingDirection != null &&
      this.lucyAnimationTimer == null
    ) {
      this.lucyAnimationTimer = this.lucyAnimationTimerDefault;
    }
//rotates lucy image depending on direction
    switch (this.currentMovingDirection) {
      case MovingDirection.up:
        this.y -= this.velocity;
        this.lucyRotation = this.Rotation.up;
        break;
      case MovingDirection.down:
        this.y += this.velocity;
        this.lucyRotation = this.Rotation.down;
        break;
      case MovingDirection.left:
        this.x -= this.velocity;
        this.lucyRotation = this.Rotation.left;
        break;
      case MovingDirection.right:
        this.x += this.velocity;
        this.lucyRotation = this.Rotation.right;
        break;
    }
  }
//make lucy animation. Loops through array of lucy images
  #animate() {
    if (this.lucyAnimationTimer == null) {
      return;
    }
    this.lucyAnimationTimer--;
    if (this.lucyAnimationTimer == 0) {
      this.lucyAnimationTimer = this.lucyAnimationTimerDefault;
      this.lucyImageIndex++;
      if (this.lucyImageIndex == this.lucyImages.length)
        this.lucyImageIndex = 0;
    }
  }
  #getBone() {
    if (this.tileMap.getBone(this.x, this.y)) {
      //play sound
      this.lucyBarkSound.play();
    }
  }
  #getPowerBall() {
    if (this.tileMap.getPowerBall(this.x, this.y)) {
      //gophers will be scared if lucy eats powerball
      this.powerBallSound.play();
      this.powerBallActive = true;
      this.powerBallAboutToExpire = false;
      this.timers.forEach((timer) => clearTimeout(timer));
      this.timers = [];

      let powerBallTimer = setTimeout(() => {
        this.powerBallActive = false;
        this.powerBallAboutToExpire = false;
      }, 1000 * 6);
      this.timers.push(powerBallTimer);
      let powerBallAboutToExpireTimer = setTimeout(() => {
        this.powerBallAboutToExpire = true;
      }, 1000 * 3);
      this.timers.push(powerBallAboutToExpireTimer);
    }
  }
  #getGopher(enemies){
if(this.powerBallActive){
  const collideEnemies = enemies.filter((enemy) => enemy.collideWith(this));
  collideEnemies.forEach((enemy)=>{enemies.splice(enemies.indexOf(enemy),1);
  this.fightGopherSound.play(); 
  //makes gophers come back alive 
  setTimeout(() => enemies.push(enemy), 1000 * 5);
  });
}
  }
}
