const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const fullscreenBtn = document.getElementById("fullscreenBtn");

canvas.width = 400;
canvas.height = 600;

const roadX = 50; // موضع الطريق
const roadWidth = 360; // عرض الطريق بعد زيادة عدد الحارات
const laneWidth = roadWidth / 6; // عرض كل حارة (تم تعديلها لست حارات)
const playerCar = { x: roadX + laneWidth / 2 - 25, y: 500, width: 50, height: 80, color: "blue" };
const enemyCars = [];
let gameInterval;
let speed = 3;
let score = 0;
let countdown = 3;
let countdownInterval;
let touchStartX = 0;
let touchEndX = 0;

function createEnemyCar() {
    if (enemyCars.length < 3) { 
        // تحديد مواقع السيارات في 6 حارات
        const lanePositions = [
            roadX + laneWidth / 2, 
            roadX + laneWidth + laneWidth / 2, 
            roadX + 2 * laneWidth + laneWidth / 2, 
            roadX + 3 * laneWidth + laneWidth / 2, 
            roadX + 4 * laneWidth + laneWidth / 2, 
            roadX + 5 * laneWidth + laneWidth / 2
        ];
        const x = lanePositions[Math.floor(Math.random() * lanePositions.length)];
        enemyCars.push({ x, y: -80, width: 50, height: 80, color: getRandomCarColor() });
    }
}

function updateGame() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawRoad();
    drawCar(playerCar);
    enemyCars.forEach((car, index) => {
        car.y += speed;
        // التأكد من بقاء السيارات العدو داخل الطريق
        if (car.x < roadX || car.x > roadX + roadWidth - car.width) {
            car.x = roadX + laneWidth / 2; // إعادة السيارة إلى مكانها داخل الطريق
        }
        drawCar(car);
        if (car.y > canvas.height) {
            enemyCars.splice(index, 1);
            score++;
        }
    });
    drawScore();
    checkCollision();
    speed += 0.001;
}

function drawRoad() {
    // رسم الطريق
    ctx.fillStyle = "darkgray";
    ctx.fillRect(roadX, 0, roadWidth, canvas.height);

    // رسم الحواجز الجانبية
    ctx.fillStyle = "#333";
    ctx.fillRect(roadX - 10, 0, 10, canvas.height);
    ctx.fillRect(roadX + roadWidth, 0, 10, canvas.height);

    // رسم الخطوط المساعدة بين الحارات
    ctx.strokeStyle = "white";
    ctx.setLineDash([20, 20]); // رسم خطوط متقطعة
    ctx.lineWidth = 5;
    ctx.beginPath();
    for (let i = 1; i < 6; i++) {  // رسم 5 خطوط بين 6 حارات
        ctx.moveTo(roadX + i * laneWidth, 0);
        ctx.lineTo(roadX + i * laneWidth, canvas.height);
    }
    ctx.stroke();
}

function drawCar(car) {
    ctx.fillStyle = car.color;
    ctx.fillRect(car.x, car.y, car.width, car.height);
}

function checkCollision() {
    enemyCars.forEach(car => {
        if (
            playerCar.x < car.x + car.width &&
            playerCar.x + playerCar.width > car.x &&
            playerCar.y < car.y + car.height &&
            playerCar.y + playerCar.height > car.y
        ) {
            clearInterval(gameInterval);
            clearInterval(countdownInterval);
            showGameOver();
        }
    });
}

function drawScore() {
    ctx.fillStyle = "black";
    ctx.font = "20px Arial";
    ctx.fillText(`السيارات التي تجاوزتها: ${score}`, 10, 30);
}

function showGameOver() {
    ctx.fillStyle = "black";
    ctx.font = "30px Arial";
    ctx.fillText("لقد خسرت!", canvas.width / 2 - 50, canvas.height / 2);
    setTimeout(() => location.reload(), 3000);
}

function startCountdown() {
    countdown = 3;
    countdownInterval = setInterval(() => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawRoad();
        drawCar(playerCar);
        drawScore();
        ctx.fillStyle = "black";
        ctx.font = "50px Arial";
        ctx.fillText(countdown, canvas.width / 2 - 15, canvas.height / 2);
        countdown--;
        if (countdown < 0) {
            clearInterval(countdownInterval);
            gameInterval = setInterval(updateGame, 50);
            setInterval(createEnemyCar, 2000);
        }
    }, 1000);
}

function getRandomCarColor() {
    const colors = ["red", "green", "yellow", "orange", "purple", "pink"];
    return colors[Math.floor(Math.random() * colors.length)];
}

document.addEventListener("keydown", (event) => {
    if (event.key === "ArrowLeft" && playerCar.x > roadX) playerCar.x -= laneWidth;
    if (event.key === "ArrowRight" && playerCar.x < roadX + roadWidth - playerCar.width) playerCar.x += laneWidth;
});

document.addEventListener("touchstart", (event) => {
    touchStartX = event.touches[0].clientX;
});

document.addEventListener("touchmove", (event) => {
    touchEndX = event.touches[0].clientX;
});

document.addEventListener("touchend", () => {
    if (touchEndX < touchStartX && playerCar.x > roadX) playerCar.x -= laneWidth;
    if (touchEndX > touchStartX && playerCar.x < roadX + roadWidth - playerCar.width) playerCar.x += laneWidth;
});

fullscreenBtn.addEventListener("click", () => {
    if (!document.fullscreenElement) {
        canvas.requestFullscreen().catch(err => console.log(err));
    } else {
        document.exitFullscreen();
    }
});

canvas.style.position = "absolute";
canvas.style.left = "50%";
canvas.style.transform = "translateX(-50%)";

startCountdown();
function createEnemyCar() {
    if (enemyCars.length < 3) { 
        // تحديد مواقع السيارات في 6 حارات
        const lanePositions = [
            roadX + laneWidth / 2, 
            roadX + laneWidth + laneWidth / 2, 
            roadX + 2 * laneWidth + laneWidth / 2, 
            roadX + 3 * laneWidth + laneWidth / 2, 
            roadX + 4 * laneWidth + laneWidth / 2, 
            roadX + 5 * laneWidth + laneWidth / 2
        ];
        const x = lanePositions[Math.floor(Math.random() * lanePositions.length)];
        enemyCars.push({ x, y: -80, width: 50, height: 80, color: getRandomCarColor() });
    }
}

function updateGame() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawRoad();
    drawCar(playerCar);
    enemyCars.forEach((car, index) => {
        car.y += speed;
        // التأكد من بقاء السيارات العدو داخل الحارات
        if (car.x < roadX || car.x > roadX + roadWidth - car.width) {
            car.x = roadX + (Math.floor((car.x - roadX) / laneWidth) * laneWidth) + laneWidth / 2; // ضبط السيارة داخل الحارة
        }
        drawCar(car);
        if (car.y > canvas.height) {
            enemyCars.splice(index, 1);
            score++;
        }
    });
    drawScore();
    checkCollision();
    speed += 0.001;
}
