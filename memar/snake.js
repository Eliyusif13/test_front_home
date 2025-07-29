// Canvas elementini əldə et və kontekstini al
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// Oyun parametrləri
const box = 20;  // Hər bir qutu ölçüsü

// Dinamik ölçüləri təyin edirik
canvas.width = window.innerWidth * 0.8;  // Ekranın 80%-i
canvas.height = window.innerHeight * 0.8;  // Ekranın 80%-i

const canvasSize = canvas.width / box;  // Ekran ölçüsünü şəbəkəyə çevirmək

let snake, food, dir, score, collisionCount;
let gameInterval; // Oyun dövrü üçün interval

// Oyun sıfırlama funksiyası
function resetGame() {
    snake = [{x: 9 * box, y: 9 * box}];  // İlanın başlanğıcı
    food = generateFood();  // Yeni yemək yeri
    dir = "RIGHT";  // Başlanğıc istiqaməti
    score = 0;  // Xal
    collisionCount = 0; // Toqquşma sayı
}

// Yeni yemək yeri təyin edirik
function generateFood() {
    let foodX = Math.floor(Math.random() * canvasSize) * box;
    let foodY = Math.floor(Math.random() * canvasSize) * box;
    return {x: foodX, y: foodY};
}

// Oyun bitmə funksiyası
function gameOver() {
    clearInterval(gameInterval); // Oyun dövrünü dayandır
    alert("Sadiqov Aliyusuf tərəfindən yaradılan Oyun bitdi 😉 ! Xal: " + score);
    document.getElementById("startButton").disabled = false; // Start düyməsini aktiv et
}

// Start düyməsi funksiyası
function startGame() {
    resetGame();  // Oyun sıfırlanır
    document.getElementById("startButton").disabled = true; // Start düyməsini deaktiv et
    gameInterval = setInterval(draw, 100);  // Oyun dövrünü başlat
}

// Mobil düymələrə toxunma funksiyaları:
document.getElementById("up").addEventListener("click", () => { if (dir !== "DOWN") dir = "UP"; });
document.getElementById("down").addEventListener("click", () => { if (dir !== "UP") dir = "DOWN"; });
document.getElementById("left").addEventListener("click", () => { if (dir !== "RIGHT") dir = "LEFT"; });
document.getElementById("right").addEventListener("click", () => { if (dir !== "LEFT") dir = "RIGHT"; });

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
        collisionCount++;
        if (collisionCount >= 3) {
            gameOver();  // 3 dəfə toqquşma ilə oyun bitir
        } else {
            resetGame();
        }
    }

    snake.unshift(newHead);  // Yeni başı əlavə edirik

    // İlan yeməyi yediyində yeni yemək yaradılır
    if (snakeX === food.x && snakeY === food.y) {
        score++;  // Xalı artır
        food = generateFood();  // Yeni yemək yaradılır
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
