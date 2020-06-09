const canvas = document.getElementById('mycanvas');
const ctx = canvas.getContext('2d');    //return a drawing context on the canvas
const width = canvas.width = window.innerWidth;
const height = canvas.height = window.innerHeight;

function random(min, max) {
    const num = Math.floor(Math.random() * (max - min + 1)) + min;
    return num;
}

function random_cos() {
    const degree = 2 * Math.random(min, max) * Math.PI;
    return degree
}

// build the 'Ball' object
function Ball(x, y, velX, velY, color, size) {
    //(x, y) coordinate
    this.x = x;
    this.y = y;
    //(velX, velY) velocity, corresponding to the chnages of coordinates
    this.velX = velX;
    this.velY = velY;
    this.color = color;
    this.size = size;
}

Ball.prototype.draw = function () {
    ctx.beginPath(); // create a new path
    ctx.fillStyle = this.color;
    ctx.arc(this.x, this.y, this.size, 0, 2*Math.PI); // trace the arc shape on the paper
    ctx.fill();
}

// let testBall = new Ball(50, 100, 4, 4, 'blue', 10);
// testBall.x;
// testBall.y;
// testBall.size;
// testBall.color;
// testBall.draw();

Ball.prototype.update = function () {
    if ((this.x + this.size) >= width || (this.x - this.size) <= 0) {
        this.velX = -(this.velX);
    }

    if((this.y + this.size) >= height || (this.y - this.size) <= 0) {
        this.velY = -(this.velY);
    }

    this.x += this.velX;
    this.y += this.velY;
}

Ball.prototype.collisionDetect = function () {
    for(let j=0; j < balls.length; j++) {
        if(!(this === balls[j])) {
            const dx = this.x - balls[j].x;
            const dy = this.y - balls[j].y;
            const distance = Math.sqrt(dx **2, dy**2);

            if (distance <= this.size + balls[j].size) {
                balls[j].color = this.color = 'rgb(' + random(0, 255) + ',' + random(0, 255) + ',' + random(0, 255) + ')';
                // balls[j].velX = this.velX = Math.cos(random_cos());
                // balls[j].velY = this.velY = Math.cos(random_cos());
                balls[j].velX = this.velX = random(-7, 7);
                balls[j].velY = this.velY = random(-7, 7);

            }
        }
    }
}

let balls = [];

while (balls.length < 15) {
    let size = random(10, 20);
    let ball = new Ball(
        random(0 + size, width - size),
        random(0 + size, height - size),
        random(-7, 7),
        random(-7, 7),
        'rgb(' + random(0, 255) + ',' + random(0, 255) + ',' + random(0, 255) + ')',
        size
    );

    balls.push(ball);
}

function loop() {
    ctx.fillStyle = 'rgba(0,  0 , 0, 0.25)';
    ctx.fillRect(0, 0, width, height);
    for(let i=0; i < balls.length; i++) {
        balls[i].draw();
        balls[i].update();
        balls[i].collisionDetect();
    }

    requestAnimationFrame(loop);
}

loop();
