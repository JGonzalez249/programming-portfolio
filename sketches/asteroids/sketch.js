//const num = 1;
const numOfRocks = 3;
let playerScore = 0;
let playerLives = 3;
//let playerSpawn = [{ x: 0, y: 0 }];
let player;
let bullets = [];
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
    text("Score: " + playerScore, windowWidth / 1.2, windowHeight / 10)
    //text("Lives: " + playerLives, windowWidth / 1.2, windowHeight / 8)

    // Draw Player
    player.display();
    player.turn();
    player.update();
    player.wrap();

    // This is for better player response than keyPressed
    // D,A,and W keys in that order
    if (keyIsDown(68)) player.setRotation(0.1);
    if (keyIsDown(65)) player.setRotation(-0.1);
    if (keyIsDown(87)) player.thrusting(true);

    // Draw Asteroid
    for (let i = 0; i < asteroids.length; i++) {
        if (player.collides(asteroids[i])) {
            playerScore = 0;
        }
        asteroids[i].display();
        asteroids[i].updateMovement();
        asteroids[i].wrap();
    }

    // Draw Bullets
    for (let i = bullets.length - 1; i >= 0; i--) {
        bullets[i].display();
        bullets[i].update();

        // Removes bullets when left screen
        // else when collides with asteroids, removes both asteroid and bullet
        // add scorea
        if (bullets[i].offscreen()) {
            bullets.splice(i, 1);
        } else {
            for (let j = asteroids.length - 1; j >= 0; j--) {
                if (bullets[i].collides(asteroids[j])) {
                    if (asteroids[j].radius > 10) {
                        let newAsteroids = asteroids[j].breakup();
                        asteroids = asteroids.concat(newAsteroids);
                        playerScore += 10;
                    }
                    asteroids.splice(j, 1);
                    bullets.splice(i, 1);
                    break;
                }
            }
        }
    }
}
// Fire button
function keyPressed() {
    if (key === ' ') {
        bullets.push(new Bullet(player.playerPos, player.playerDir));
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
        this.playerRot = 0;
        this.playerVel = createVector(0, 0);
        this.isUsingThrust = false;
    }
    // Updates player Velocity every frame
    update() {
        if (this.isUsingThrust) {
            this.thrust();
        }
        this.playerPos.add(this.playerVel);
        this.playerVel.mult(0.99);
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
    // Sets player rotation while key is pressed in keyIsDown/Released function
    setRotation(a) {
        this.playerRot = a;
    }
    // Changes player direction by adding player rotation
    turn() {
        this.playerDir += this.playerRot;
    }
    // When player is using the Space key
    thrusting(t) {
        this.isUsingThrust = t;
    }
    // Adds force towards where the player is facing
    thrust() {
        let force = p5.Vector.fromAngle(this.playerDir);
        force.mult(0.2);
        this.playerVel.add(force);
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
    collides(asteroid) {
        let d = dist(this.playerPos.x, this.playerPos.y, asteroid.asterPos.x, asteroid.asterPos.y)
        if (d < this.radius + asteroid.radius) {
            return true;
        } else {
            return false;
        }
    }
    respawn() {
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
            return true;
        } else {
            return false;
        }
    }
    offscreen() {
        if (this.bulPos.x > windowWidth || this.bulPos.x < 0) {
            return true;
        }
        if (this.bulPos.y > windowHeight || this.bulPos.y < 0) {
            return true;
        }
        return false;
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
        if (radius) {
            this.radius = radius * 0.5
        } else {
            // Change these values to either make infinite shapes
            // or shapes that are destroyed and don't spawn more
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