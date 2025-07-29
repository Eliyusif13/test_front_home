// Canvas elementini əldə et və kontekstini al
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// Oyun parametrləri
const box = 20;  // Hər bir qutu ölçüsü

// Dinamik ölçüləri təyin edirik
canvas.width = window.innerWidth * 0.8;  // Ekranın 80%-i
canvas.height = window.innerHeight * 0.8;  // Ekranın 80%-i

const canvasSize = canvas.width / box;  // Ekran ölçüsünü şəbəkəyə çevirmək

let snake = [{x: 9 * box, y: 9 * box}];  // İlanın başlanğıcı
let food = {x: Math.floor(Math.random() * canvasSize) * box, y: Math.floor(Math.random() * canvasSize) * box};  // Yeyilməsi lazım olan yemək
let dir = "RIGHT";  // Başlanğıc istiqaməti
let score = 0;  // Xal

// Klaviaturadan istiqamət dəyişmək
document.addEventListener("keydown", direction);

// Mobil toxunma ilə idarə etmə
canvas.addEventListener("touchstart", function(e) {
    const touchX = e.touches[0].clientX;
    const touchY = e.touches[0].clientY;
    if (touchX < canvas.width / 2) {
        if (touchY < canvas.height / 2) {
            dir = "UP";
        } else {
            dir = "DOWN";
        }
    } else {
        if (touchY < canvas.height / 2) {
            dir = "RIGHT";
        } else {
            dir = "LEFT";
        }
    }
});

// İlanın istiqamətini dəyişmək
function direction(event) {
    if (event.keyCode === 37 && dir !== "RIGHT") dir = "LEFT";  // Sol
    if (event.keyCode === 38 && dir !== "DOWN") dir = "UP";   // Yuxarı
    if (event.keyCode === 39 && dir !== "LEFT") dir = "RIGHT";  // Sağ
    if (event.keyCode === 40 && dir !== "UP") dir = "DOWN";   // Aşağı
}

// Oyun funksiyası
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);  // Oyun sahəsini təmizləyirik

    // İlanı çəkirik
    for (let i = 0; i < snake.length; i++) {
        ctx.fillStyle = (i === 0) ? "green" : "white";  // Baş hissə yaşıl, digər hissələr ağ
        ctx.fillRect(snake[i].x, snake[i].y, box, box);
    }

    // Yeməyi çəkirik
    ctx.fillStyle = "red";
    ctx.fillRect(food.x, food.y, box, box);

    // İlanın başını hərəkət etdiririk
    let snakeX = snake[0].x;
    let snakeY = snake[0].y;

    if (dir === "LEFT") snakeX -= box;
    if (dir === "UP") snakeY -= box;
    if (dir === "RIGHT") snakeX += box;
    if (dir === "DOWN") snakeY += box;

    // Ekrandan keçən ilanı digər tərəfdən gətiririk
    if (snakeX < 0) snakeX = canvas.width - box;  // Sol tərəfdən sağa keçmək
    if (snakeX >= canvas.width) snakeX = 0;  // Sağ tərəfdən sola keçmək
    if (snakeY < 0) snakeY = canvas.height - box;  // Yuxarıdan aşağıya keçmək
    if (snakeY >= canvas.height) snakeY = 0;  // Aşağıdan yuxarıya keçmək

    // İlanın yeni başını əlavə edirik
    let newHead = {x: snakeX, y: snakeY};

    // İlan özünə toxunduqda oyunu bitiririk
    if (collision(newHead, snake)) {
        alert("Oyun bitdi! Xal: " + score);
        resetGame();
    }

    snake.unshift(newHead);  // Yeni başı əlavə edirik

    // İlan yeməyi yediyində yeni yemək yaradılır
    if (snakeX === food.x && snakeY === food.y) {
        score++;  // Xalı artır
        food = {  // Yeni yemək yerini təyin edirik
            x: Math.floor(Math.random() * canvasSize) * box,
            y: Math.floor(Math.random() * canvasSize) * box
        };
    } else {
        snake.pop();  // İlanın sonunu silirik
    }

    // Oyun nəticələrini ekranda göstəririk
    ctx.fillStyle = "white";
    ctx.font = "20px Arial";
    ctx.fillText("Xal: " + score, box, box);  // Xalı göstəririk
}

// İlanın özünə toxunub toxunmadığını yoxlamaq
function collision(head, array) {
    for (let i = 0; i < array.length; i++) {
        if (head.x === array[i].x && head.y === array[i].y) {
            return true;
        }
    }
    return false;
}

// Oyunu sıfırlamaq
function resetGame() {
    snake = [{x: 9 * box, y: 9 * box}];  // İlanı sıfırla
    dir = "RIGHT"; // Yönü sıfırla
    score = 0;  // Xalı sıfırla
}

// Oyun dövrünü başlatmaq
let game = setInterval(draw, 100);  // 100ms interval ilə oyunu yeniləyirik
