import MovingDirection from "./Move.js";

export default class Enemy {
  constructor(x, y, tileSize, velocity, tileMap) {
    this.x = x;
    this.y = y;
    this.tileSize = tileSize;
    this.velocity = velocity;
    this.tileMap = tileMap;

    this.#loadImages();

    this.movingDirection = Math.floor(
      Math.random() * Object.keys(MovingDirection).length);

      this.directionTimerDefault = this.#random(1,3);
      this.directionTimer = this.directionTimerDefault;

      this.scaredAboutToExpireTimerDefault= 10;
      this.scaredAboutToExpireTimer= this.scaredAboutToExpireTimerDefault;
  }
  draw(ctx, pause, lucy) {
    if(!pause){
      this.#move();
      this.#changeDirection();
    }
    this.#setImage(ctx, lucy);
    ctx.drawImage(this.image, this.x, this.y, this.tileSize, this.tileSize);
  }
  #setImage(ctx, lucy){
    if(lucy.powerBallActive){
      this.#setImageWhenPowerBallIsActive(lucy);
    }
    else{
      this.image = this.normalGopher;
    }
    ctx.drawImage(this.image, this.x, this.y, this.tileSize, this.tileSize);
  }
  #setImageWhenPowerBallIsActive(lucy){
    if (lucy.powerBallAboutToExpire){
      this.scaredAboutToExpireTimer--;
      if(this.scaredAboutToExpireTimer === 0){
        this.scaredAboutToExpireTimer = this.scaredAboutToExpireTimerDefault;
        if (this.image === this.scaredGopher){
          this.image = this.blinkGopher;
        }
        else{
          this.image = this.scaredGopher;
        }
      }
    }
    else{
      this.image = this.scaredGopher;
    }
  
  }
  #changeDirection() {
    this.directionTimer--;
    let newMoveDirection = null;
    if (this.directionTimer == 0) {
      this.directionTimer = this.directionTimerDefault;
      newMoveDirection = Math.floor(
        Math.random() * Object.keys(MovingDirection).length);
      
    }

    if(newMoveDirection != null && this.movingDirection != newMoveDirection){
      if(
        Number.isInteger(this.x / this.tileSize) && 
        Number.isInteger (this.y / this.tileSize)
        ){
        if(
          !this.tileMap.didCollideWithEnvironment(
          this.x, 
          this.y, 
          newMoveDirection
          )
          ){
this.movingDirection = newMoveDirection;
        }
      }

    }
  }
#move(){
    if(!this.tileMap.didCollideWithEnvironment(this.x, this.y, this.movingDirection))
    {
      switch(this.movingDirection){
        case MovingDirection.up:
        this.y -= this.velocity;
        break;
        case MovingDirection.down:
        this.y += this.velocity;
        break;
        case MovingDirection.left:
        this.x -= this.velocity;
        break;
        case MovingDirection.right:
        this.x += this.velocity;
        break;
      }
    }
  
  }
#random(min, max){
  return Math.floor(Math.random() * (max-min + 1)) + min;
}
//collision detection
//https://developer.mozilla.org/en-US/docs/Games/Techniques/2D_collision_detection
  collideWith(lucy){
    const size = this.tileSize / 2;
    if (this.x < lucy.x + size &&
      this.x + size > lucy.x &&
      this.y < lucy.y + size &&
      this.y + size > lucy.y
      ){
return true;
      }
      else{
        return false;
      }
  }



#loadImages() {
    this.normalGopher = new Image();
    this.normalGopher.src = "../images/Gopher.png";

    this.scaredGopher = new Image();
    this.scaredGopher.src = "../images/scaredGopher.png";

    this.blinkGopher = new Image();
    this.blinkGopher.src = "../images/blinkGopher.png";

    this.image = this.normalGopher;
  }
}
