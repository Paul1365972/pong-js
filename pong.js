let canvas = document.getElementById('gameCanvas');
let ctx = canvas.getContext('2d');

const vals = {
    paddleOffset: 30,
    paddleW: 20,
    paddleH: 100,
    ballR: 10,
    paddleV: 6,
};

let state = {
    lost: 0,
    points1: 0,
    points2: 0,
};

let ball = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    vx: 4,
    vy: 4,
};

let paddle = {
    yL: canvas.height / 2,
    yR: canvas.height / 2,
};

let pressedKeys = {
    upL: false,
    downL: false,
    upR: false,
    downR: false,
};

function update() {
    if (pressedKeys.upL && paddle.yL > vals.paddleH / 2) {
        paddle.yL -= vals.paddleV;
    }
    if (pressedKeys.downL && paddle.yL < canvas.height - vals.paddleH / 2) {
        paddle.yL += vals.paddleV;
    }
    if (pressedKeys.upR && paddle.yR > vals.paddleH / 2) {
        paddle.yR -= vals.paddleV;
    }
    if (pressedKeys.downR && paddle.yR < canvas.height - vals.paddleH / 2) {
        paddle.yR += vals.paddleV;
    }
    ball.x += ball.vx;
    ball.y += ball.vy;
    if (ball.y - vals.ballR < 0 || ball.y + vals.ballR > canvas.height) {
        ball.vy *= -1;
    }
    if (state.lost === 0 && ball.x - vals.ballR < vals.paddleOffset + vals.paddleW / 2) {
        if (Math.abs(ball.y - paddle.yL) < vals.ballR + vals.paddleH / 2) {
            ball.vx *= -1;
        } else {
            state.lost = 1
        }
    }
    if (state.lost === 0 && ball.x + vals.ballR > canvas.width - vals.paddleOffset - vals.paddleW / 2) {
        if (Math.abs(ball.y - paddle.yR) < vals.ballR + vals.paddleH / 2) {
            ball.vx *= -1;
        } else {
            state.lost = 2
        }
    }
    if (state.lost !== 0 && ball.x - vals.ballR < 0 || ball.x + vals.ballR > canvas.width) {
        if (state.lost === 1) {
            state.points2++;
        } else if (state.lost === 2) {
            state.points1++;
        }
        reset();
    }
}

function reset() {
    paddle.yL = canvas.height / 2;
    paddle.yR = canvas.height / 2;
    ball.x = canvas.width / 2;
    ball.y = canvas.height / 2;
    state.lost = 0;
}

function render() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = 'white';
    ctx.fillRect(vals.paddleOffset - vals.paddleW / 2, paddle.yL - vals.paddleH / 2, vals.paddleW, vals.paddleH);
    ctx.fillRect(canvas.width - vals.paddleOffset - vals.paddleW / 2, paddle.yR - vals.paddleH / 2, vals.paddleW, vals.paddleH);
    ctx.fillStyle = 'white';
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, vals.ballR, 0, 2 * Math.PI);
    ctx.fill();
    ctx.font = 'bold 48px Monospaced';
    ctx.fillText(state.points1, canvas.width / 2 - 64, 64);
    ctx.fillText(state.points2, canvas.width / 2 + 64, 64);
}

function updateKey(state) {
    return function (event) {
        if (event.code === 'KeyW') {
            pressedKeys.upL = state;
        } else if (event.code === 'KeyS') {
            pressedKeys.downL = state;
        } else if (event.code === 'ArrowUp') {
            pressedKeys.upR = state;
        } else if (event.code === 'ArrowDown') {
            pressedKeys.downR = state;
        }
    }
}

function loop() {
    update();
    render();

    window.requestAnimationFrame(loop);
}

window.addEventListener("keydown", updateKey(true));
window.addEventListener("keyup", updateKey(false));

window.requestAnimationFrame(loop);