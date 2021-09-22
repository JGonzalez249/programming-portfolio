let h, s, b

function setup() {
    createCanvas(710, 400);
    background(150);
    colorMode(HSB, width, height, 100);
    h = random(100);
    s = random(100);
    b = random(100);
}
//draws when mouse is pressed
function draw() {
    if (mouseIsPressed === true) {
        noStroke();
        fill(h / 2, s * 2, b * 2);
        drawShapes();
    }
}
// draws shapes with random values
function drawShapes() {
    circle(random(width), random(height), random(15), random(15));
    ellipse(random(width), random(height), random(25), random(25));
    fill(random(100));
    square(random(width), random(height), random(75), random(75));
}



