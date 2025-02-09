const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const countdownEl = document.getElementById("countdown");
const applesCounter = document.getElementById("apples");
const timeCounter = document.getElementById("time");

let snake = [{ x: 200, y: 200 }];
let direction = "Right";
let food = getRandomFoodPosition();
let score = 0;
let time = 0;
let speed = 150;
let gameInterval, timerInterval;

function startGame() {
    gameInterval = setInterval(updateGame, speed);
    timerInterval = setInterval(() => {
        time++;
        timeCounter.textContent = time;
    }, 1000);
}

function updateGame() {
    let head = { ...snake[0] };
    if (direction === "Up") head.y -= 20;
    if (direction === "Down") head.y += 20;
    if (direction === "Left") head.x -= 20;
    if (direction === "Right") head.x += 20;

    snake.unshift(head);

    if (head.x === food.x && head.y === food.y) {
        food = getRandomFoodPosition();
        score++;
        applesCounter.textContent = score;

        if (speed > 50) {
            speed -= 5;
            clearInterval(gameInterval);
            gameInterval = setInterval(updateGame, speed);
        }
    } else {
        snake.pop();
    }

    if (isGameOver(head)) {
        clearInterval(gameInterval);
        clearInterval(timerInterval);
        countdownRestart();
        return;
    }

    drawGame();
}

function drawGame() {
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // رسم الحدود باللون الأبيض
    ctx.strokeStyle = "white";
    ctx.lineWidth = 5;
    ctx.strokeRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "red";
    ctx.fillRect(food.x, food.y, 20, 20);

    ctx.fillStyle = "green";
    snake.forEach(segment => ctx.fillRect(segment.x, segment.y, 20, 20));
}

function changeDirection(newDirection) {
    const opposite = { Up: "Down", Down: "Up", Left: "Right", Right: "Left" };
    if (direction !== opposite[newDirection]) {
        direction = newDirection;
    }
}

function isGameOver(head) {
    return head.x < 0 || head.x >= 400 || head.y < 0 || head.y >= 400 || snake.slice(1).some(seg => seg.x === head.x && seg.y === head.y);
}

function getRandomFoodPosition() {
    return { x: Math.floor(Math.random() * 20) * 20, y: Math.floor(Math.random() * 20) * 20 };
}

function countdownRestart() {
    let countdown = 3;
    countdownEl.style.display = "block";
    countdownEl.textContent = countdown;

    let countdownInterval = setInterval(() => {
        countdown--;
        countdownEl.textContent = countdown;

        if (countdown === 0) {
            clearInterval(countdownInterval);
            location.reload();
        }
    }, 1000);
}

// إضافة دعم التحكم عبر اللمس
let touchStartX, touchStartY;

canvas.addEventListener("touchstart", (event) => {
    const touch = event.touches[0];
    touchStartX = touch.clientX;
    touchStartY = touch.clientY;
});

canvas.addEventListener("touchmove", (event) => {
    if (!touchStartX || !touchStartY) return;

    const touchEndX = event.touches[0].clientX;
    const touchEndY = event.touches[0].clientY;

    const dx = touchEndX - touchStartX;
    const dy = touchEndY - touchStartY;

    if (Math.abs(dx) > Math.abs(dy)) {
        if (dx > 0) changeDirection("Right");
        else changeDirection("Left");
    } else {
        if (dy > 0) changeDirection("Down");
        else changeDirection("Up");
    }

    touchStartX = null;
    touchStartY = null;
});

// دعم لوحة المفاتيح
document.addEventListener("keydown", (event) => {
    if (event.key === "ArrowUp") changeDirection("Up");
    if (event.key === "ArrowDown") changeDirection("Down");
    if (event.key === "ArrowLeft") changeDirection("Left");
    if (event.key === "ArrowRight") changeDirection("Right");
});

// زر ملء الشاشة
function toggleFullScreen() {
    if (!document.fullscreenElement) {
        canvas.requestFullscreen();
    } else {
        document.exitFullscreen();
    }
}

startGame();
