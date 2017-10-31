
const xFactor = 101,
      xMove = 1,
      xMin = 0,
      xMax = 4,
      yFactor = 42,
      yMove = 2,
      yMin = -1,
      yMax = 9,
      enemyPositions = [62, 144, 226, 308],
      enemyBasePositions = [1, 3, 5, 7];

// Base class fot enemies and player
var ScreenObject =  function () {
    this.x = 0;
    this.y = 0;
    this.position = {
        x: 0,
        y: 0
    };
};

var allEnemies = [];
var enemyNumber = 4;

//Method to render entities on the screen
function renderEntity() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
}

ScreenObject.prototype.render = renderEntity;

// Enemies our player must avoid
var Enemy = function(yPosition, speed) {
    ScreenObject.call(this, arguments);
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started
    this.position.x = xMin - 180;// Subtract 180 to leave the initial position off screen
    this.position.y = yPosition;
    this.speed = speed ? speed : 1;
    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    this.sprite = 'images/enemy-bug.png';
};

Enemy.prototype = Object.create(ScreenObject.prototype);
Enemy.prototype.constructor = Enemy;

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.

    this.position.x += this.speed;

    if(this.position.x > (xMax * xFactor) + 100){
        this.position.x = xMin - 180;
    }

    this.x = this.position.x * xMove;

    this.y = this.position.y;
};

// Draw the enemy on the screen, required method for game

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.

var Player = function () {
    ScreenObject.call(this, arguments); 
    this.reset(); //Set the player on the initial position

    this.sprite = 'images/char-boy.png';
    this.level = 1;
    this.score = 0;
    this.lives = 3;
};

Player.prototype = Object.create(ScreenObject.prototype);
Player.prototype.constructor = Player;


// Specific render for the player with score e lives
Player.prototype.render = function () {
    renderEntity.call(this);
    ctx.font = "20px Impact";
    ctx.clearRect(0, 0, canvas.width, 25);
    ctx.fillText('Lives: '+ this.lives, 15, 25);
    ctx.fillText('Level: '+ this.level, 100, 25);
    ctx.fillText('Score: '+ this.score, canvas.width/2, 25);

     if(this.lives === 0){
        ctx.font = "66px Impact";
        ctx.fillText('GAME OVER!', 100, (canvas.height/2) +30);
     }

};

// Set the initial position for the player
Player.prototype.reset = function () {
    this.position.x = 2;
    this.position.y = 9;
};

// Decrease the lives and the player position back to the inicial position
Player.prototype.setCollision = function () {
    this.lives--;
    this.reset();
};

// Update the player's position, score and game level
Player.prototype.update = function() {
    this.x = this.position.x * xFactor;
    this.y = this.position.y * yFactor;
    this.y = this.y <= 0 ?  -10 : this.y;

   if(this.position.y === yMin){ // if the player reached the water increase the score and level
        this.score += 100 * this.level;
        this.level++;
        addEnemy(this.level);
        this.reset();
   }
};

//Handles the keyboard imputs
Player.prototype.handleInput = function (action) {

    if(action && this.lives > 0){
        switch(action) {
            case 'left':
                    if(this.position.x > xMin){
                        this.position.x -= xMove;
                    }
                break;
            case 'up':
                if(this.position.y > yMin) {
                    this.position.y -= yMove;
                }
                break;
            case 'right':
                if(this.position.x < xMax) {
                    this.position.x += xMove;
                }
                break;
            case 'down':
                if(this.position.y < yMax) {
                    this.position.y += yMove;
                }
                break;
        }
    }
};

// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player


// Calculates a random position for new enemies
function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
}

//Add a new enemy on the game
function addEnemy(level, yPos){
    var enemy, speed;

    switch (yPos){
        case 0:
            speed = 4;
            break;
        case 1:
            speed = 3;
            break;
        case 2:
            speed = 2;
            break;
        case 3:
            speed = 1;
            break;
        default:
            yPos = getRandomInt(0, 4);
            speed = yPos + level;
    }
    enemy = new Enemy(enemyPositions[yPos], speed);
    enemy.yBasePosition = enemyBasePositions[yPos];
    allEnemies.push(enemy);
}

// Deploy the initial enemies
function DeployEnemies() {

    allEnemies = allEnemies.splice(0,allEnemies.length);
    for(var i = 0; i < enemyNumber; i++){
        addEnemy(1, i);
    }
}

DeployEnemies();

var player = new Player();

// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});
