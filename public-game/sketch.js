const URL = `http://${window.location.hostname}:8080`;
let socket = io(URL, {
    path: '/real-time'
});

let ball
let player
let score = undefined

function setup() {
    createCanvas(windowWidth, windowHeight);
    ball = {
        x: windowWidth / 2,
        y: windowHeight / 4,
        diameter: 25,
        xDirection: 'RIGHT',
        yDirection: 'DOWN',
        block: false,
        previousBlockValue: false,
        speed: 5
    }
    player = {
        x: windowWidth / 2,
        y: windowHeight / 8 * 7,
        xDirection: 'CENTER',
        width: windowWidth / 10,
        height: 25,
        block: false
    }

}

function draw() {
    background(0, 50)
    renderScore()
    renderBall(ball)
    renderPlayer(player)

    ballCollision(ball);
    ballMovement(ball);

    playerBallCollider(player, ball)

    gameOver()
    gameState()
}

function renderBall(ball) {
    fill(255)
    circle(ball.x, ball.y, ball.diameter)
}

function renderPlayer(player) {
    fill(0, 0, 255)
    rectMode(CENTER)
    rect(player.x, player.y, player.width, player.height);
    rectMode(CORNER)
}

function renderScore() {
    if (score !== undefined) {
        textAlign(CENTER, CENTER)
        fill(255, 255, 0);
        textSize(32)
        text(`Final score: ${score}`, windowWidth / 2, 100)

        fill(255, 0, 0);
        textSize(50)
        text(`GAME OVER`, windowWidth / 2, windowHeight / 2)


    }
}

function ballMovement(ball) {
    if (!ball.block) {
        switch (ball.xDirection) {
            case 'RIGHT':
                ball.x += ball.speed
                break;
            case 'LEFT':
                ball.x -= ball.speed
                break;
        }
        switch (ball.yDirection) {
            case 'DOWN':
                ball.y += ball.speed
                break;
            case 'UP':
                ball.y -= ball.speed
                break;
        }
    }
}

function ballCollision(ball) {
    if (ball.x <= 0) {
        ball.xDirection = 'RIGHT'
    }
    if (ball.x >= windowWidth) {
        ball.xDirection = 'LEFT'
    }
    if (ball.y <= 0) {
        ball.yDirection = 'DOWN'
    }
    if (ball.y >= windowHeight) {
        ball.y = windowHeight / 4
        ball.block = true
        player.block = true
        const point = 0
        sendScore(point)
    }
}

function playerBallCollider(player, ball) {
    if (ball.x >= player.x - (player.width / 2) && ball.x <= player.x + (player.width / 2) && ball.y <= player.y + (player.height / 2) && ball.y >= player.y - (player.height / 2)) {
        ball.yDirection = 'UP'
        const point = 1
        sendScore(point)
    }
}

function gameOver() {
    if (ball.block) {
        getFinalScore();
    }
}

function gameState() {
    if (ball.previousBlockValue !== ball.block) {
        gameResult()
        ball.previousBlockValue = ball.block;
      }
}

async function getFinalScore() {
    const getInfo = await fetch('/final-score')
    const data = await getInfo.json()
    score = data.content
}

/*___________________________________________

1) Include the socket method to listen to events and use the data:

1.1. Change the player position base on the potentiometer value. The highest value (1023) of the potentiometer should be the window width.

1.2. Increase the ball's speed each time the user press the button B

1.2. Reduce player's width each time the user press the button A
_____________________________________________ */

socket.on('arduino-message', (arduinoMessages) => {

    //
    
})

/*___________________________________________

2) Include the fetch method to POST each time the player scores a point and it should send a char to ARDUINO in order to turn on and off the lights.

It should send an "S" char to the ARDUINO
_____________________________________________ */

async function sendScore(point) {

    //
    
    await fetch('/score', request)
}


/*___________________________________________

3) Include the fetch method to POST when the game is over and turn on the lights by sending the "L" char
_____________________________________________ */

async function gameResult() {
    
    //

    await fetch('/game-over', request)
}