const num = 1;
const numOfRocks = 5;
let player;
let bullets = [];
let removeBullets = [];
let enemy = [{ x: 0, y: 0, alive: true }]
let enemies = [];
let asteroids = [];

function setup() {
  createCanvas(windowWidth, windowHeight);
  rectMode(CENTER);
  frameRate(60);
  player = new Player();
  for (let i = 0; i < numOfRocks; i++) {
    asteroids.push(new Asteroid());
  }
}

function draw() {
  background(0);
  fill(255);
  textSize(12);
  text("Use A and D to rotate, W to move forward, Space to fire", 50, 50);
  // Draw Player
  player.display();
  player.turn();
  player.update();
  player.wrap();

  // Draw Asteroid
  for (let i = 0; i < asteroids.length; i++) {
    asteroids[i].display();
    asteroids[i].updateMovement();
    asteroids[i].wrap();
  }

  // Draw Bullets
  for (let i = bullets.length - 1; i >= 0; i--) {
    bullets[i].display();
    bullets[i].update();
    for (let j = asteroids.length - 1; j >= 0; j--) {
      if (bullets[i].collides(asteroids[j])) {
        if(asteroids[j].radius > 10){
          let newAsteroids = asteroids[j].breakup();
          asteroids = asteroids.concat(newAsteroids);
        }else{
          // Increase score
        }
        asteroids.splice(j, 1);
        bullets.splice(i, 1);
        console.log(asteroids)
        break;
      }
    }

    // Destory bullets when left screen
    for (let i = removeBullets.length; i > 0; i--) {
      bullets.splice(removeBullets[i], 1);
      console.log(bullets);
    }
  }
}

function keyPressed() {
  if (key === ' ') {
    console.log("FIRE!")
    bullets.push(new Bullet(player.playerPos, player.playerDir));
  }
  else if (key === 'd') {
    player.setRotation(0.1);
  }
  else if (key === 'a') {
    player.setRotation(-0.1);
  }
  else if (key === 'w') {
    player.thrusting(true);
  }
}

function keyReleased() {
  player.setRotation(0);
  player.thrusting(false);
}

// Player Object
class Player {
  constructor() {
    this.playerPos = createVector(windowWidth / 2, windowHeight / 2);
    this.radius = 10;
    this.thrusterRadius = 5;
    this.playerDir = 0;
    this.rotation = 0;
    this.vel = createVector(0, 0);
    this.isUsingThrust = false;
  }
  // Updates player Velocity every frame
  update() {
    if (this.isUsingThrust) {
      this.thrust();
    }
    this.playerPos.add(this.vel);
    this.vel.mult(0.99);
  }
  // What the player looks like
  display() {
    push();
    translate(this.playerPos.x, this.playerPos.y);
    rotate(this.playerDir + Math.PI / 2);
    noFill();
    stroke(255);
    triangle(
      -this.radius,
      this.radius,
      this.radius,
      this.radius,
      0,
      -this.radius
    );
    // Forms a little thurster shape when used
    if (this.isUsingThrust) {
      fill(255);
      triangle(
        this.thrusterRadius,
        this.thrusterRadius / 2 + 8,
        -this.thrusterRadius,
        this.thrusterRadius / 2 + 8,
        0,
        this.thrusterRadius * 2 + 10
      );
    }
    pop();
  }
  // Sets player rotation while key is pressed in keyPressed/Released function
  setRotation(a) {
    this.rotation = a;
  }
  // Changes player direction by adding player rotation
  turn() {
    this.playerDir += this.rotation;
  }
  // When player is using the Space key
  thrusting(t) {
    this.isUsingThrust = t;
  }
  // Adds force towards where the player is facing
  thrust() {
    let force = p5.Vector.fromAngle(this.playerDir);
    force.mult(0.2);
    this.vel.add(force);
  }
  wrap() {
    // Wrap around x-axis
    if (this.playerPos.x > windowWidth + this.radius) {
      this.playerPos.x = -this.radius;
    } else if (this.playerPos.x < -this.radius) {
      this.playerPos.x = windowWidth + this.radius;
    }
    // Wrap around y-axis
    if (this.playerPos.y > windowHeight + this.radius) {
      this.playerPos.y = - this.radius;
    } else if (this.playerPos.y < -this.radius) {
      this.playerPos.y = windowHeight + this.radius;
    }
  }
}

// Bullet Object
class Bullet {
  constructor(tempPlayer, playerAngle) {
    this.bulPos = createVector(tempPlayer.x, tempPlayer.y);
    this.bulVel = p5.Vector.fromAngle(playerAngle);
    this.bulVel.mult(10);
  }
  update() {
    this.bulPos.add(this.bulVel);
  }
  display() {
    push();
    strokeWeight(5);
    stroke(255);
    point(this.bulPos.x, this.bulPos.y);
    pop();
  }
  collides(asteroid) {
    let d = dist(
      this.bulPos.x, this.bulPos.y,
      asteroid.asterPos.x, asteroid.asterPos.y
    );
    if (d < asteroid.radius) {
      console.log("HIT")
      return true;
    } else {
      return false;
    }
  }
}

// Asteroid Object
class Asteroid {
  constructor(asterPos, radius) {
    if (asterPos) {
      this.asterPos = asterPos.copy();
    } else {
      this.asterPos = createVector(
        random(windowWidth), random(windowHeight));
    }
    if(radius){
      this.radius = radius * 0.5
    }else{
      this.radius = random(15, 30);
    }
    this.vel = p5.Vector.random2D();
  }
  display() {
    // Need to figure out how to make it look like asteroids
    push();
    stroke(255);
    noFill();
    translate(this.asterPos.x, this.asterPos.y)
    ellipse(0, 0, this.radius * 2);
    pop();
  }
  updateMovement() {
    this.asterPos.add(this.vel);
  }
  wrap() {
    // Wrap around x-axis
    if (this.asterPos.x > windowWidth + this.radius) {
      this.asterPos.x = -this.radius;
    } else if (this.asterPos.x < -this.radius) {
      this.asterPos.x = windowWidth + this.radius;
    }
    // Wrap around y-axis
    if (this.asterPos.y > windowHeight + this.radius) {
      this.asterPos.y = - this.radius;
    } else if (this.asterPos.y < -this.radius) {
      this.asterPos.y = windowHeight + this.radius;
    }
  }
  breakup() {
    let newAst = [];
    newAst[0] = new Asteroid(this.asterPos);
    newAst[1] = new Asteroid(this.asterPos);
    return newAst;
  }
}