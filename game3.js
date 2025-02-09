const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

let player = { x: 250, y: 350, width: 50, height: 50, color: 'blue' };
let bullets = [];
let enemies = [];
let gameInterval, spawnInterval;

function startGame() {
    gameInterval = setInterval(updateGame, 50);
    spawnInterval = setInterval(spawnEnemy, 2000);
}

function updateGame() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // رسم اللاعب
    ctx.fillStyle = player.color;
    ctx.fillRect(player.x, player.y, player.width, player.height);

    // تحديث وإظهار الرصاصات
    bullets.forEach((bullet, index) => {
        bullet.y -= 5;
        ctx.fillStyle = "red";
        ctx.fillRect(bullet.x, bullet.y, 5, 10);
        if (bullet.y < 0) bullets.splice(index, 1); // إزالة الرصاصة عندما تخرج من الشاشة
    });

    // تحديث وإظهار الأعداء
    enemies.forEach((enemy, index) => {
        enemy.y += 2;
        ctx.fillStyle = "green";
        ctx.fillRect(enemy.x, enemy.y, enemy.width, enemy.height);

        // التحقق من التصادم بين الرصاصات والأعداء
        bullets.forEach((bullet, bulletIndex) => {
            if (
                bullet.x < enemy.x + enemy.width &&
                bullet.x + 5 > enemy.x &&
                bullet.y < enemy.y + enemy.height &&
                bullet.y + 10 > enemy.y
            ) {
                // إزالة العدو والرصاصة بعد التصادم
                enemies.splice(index, 1);
                bullets.splice(bulletIndex, 1);
            }
        });

        // إزالة العدو إذا خرج من الشاشة
        if (enemy.y > canvas.height) {
            enemies.splice(index, 1);
        }
    });
}

function spawnEnemy() {
    const x = Math.random() * (canvas.width - 50);
    const enemy = { x: x, y: -50, width: 50, height: 50 };
    enemies.push(enemy);
}

function movePlayer(event) {
    if (event.key === "ArrowLeft" && player.x > 0) {
        player.x -= 20;
    }
    if (event.key === "ArrowRight" && player.x < canvas.width - player.width) {
        player.x += 20;
    }
}

function shootBullet() {
    const bullet = { x: player.x + player.width / 2 - 2.5, y: player.y };
    bullets.push(bullet);
}

document.addEventListener("keydown", (event) => {
    if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
        movePlayer(event);
    }
    if (event.key === " " || event.key === "Enter") {
        shootBullet();
    }
});

startGame();
