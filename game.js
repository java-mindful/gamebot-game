const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

let basket = { x: 200, y: 450, width: 50, height: 10 };
let fallingObjects = [];
let score = 0;
let isGameOver = false;

document.addEventListener("keydown", moveBasket);

function moveBasket(e) {
    if (e.key === "ArrowLeft" && basket.x > 0) {
        basket.x -= 20;
    }
    if (e.key === "ArrowRight" && basket.x < canvas.width - basket.width) {
        basket.x += 20;
    }
}

function createFallingObject() {
    fallingObjects.push({
        x: Math.random() * (canvas.width - 20),
        y: 0,
        width: 20,
        height: 20
    });
}

function updateGame() {
    if (!isGameOver) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        ctx.fillStyle = "#0095DD";
        ctx.fillRect(basket.x, basket.y, basket.width, basket.height);

        for (let i = 0; i < fallingObjects.length; i++) {
            let obj = fallingObjects[i];
            obj.y += 2;
            ctx.fillStyle = "#FF0000";
            ctx.fillRect(obj.x, obj.y, obj.width, obj.height);

            if (
                obj.x < basket.x + basket.width &&
                obj.x + obj.width > basket.x &&
                obj.y < basket.y + basket.height &&
                obj.y + obj.height > basket.y
            ) {
                fallingObjects.splice(i, 1);
                score += 10;
            }

            if (obj.y > canvas.height) {
                isGameOver = true;
                submitScore();
            }
        }

        if (Math.random() < 0.02) {
            createFallingObject();
        }

        ctx.fillStyle = "#000";
        ctx.font = "16px Arial";
        ctx.fillText("Score: " + score, 8, 20);

        requestAnimationFrame(updateGame);
    }
}

function submitScore() {
    const botUrl = "https://api.telegram.org/bot6573180797:AAF4eDt3XdDsV0RBxm4ewt2btNe0bW_tTag/setGameScore";
    fetch(botUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            user_id: "<USER_ID>",
            score: score,
            force: true
        })
    });
    alert("Game Over! Your score is: " + score);
}

updateGame();
