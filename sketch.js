//O jogo foi pensado por mim, porém para a produção do código tive a ajuda da inteligência artificial Gemini
class Snake {
    constructor() {
        this.body = [];
        this.body[0] = createVector(floor(w / rez), floor(h / rez));
        this.xdir = 0;
        this.ydir = 0;
        this.len = 1;
        this.color = color(0); // Cor da cobra sempre preta
        this.thickness = 0.8;
    }

    update() {
        if (!gameOverSequence) {
            let head = this.body[this.body.length - 1].copy();
            this.body.shift();
            head.x += this.xdir;
            head.y += this.ydir;
            this.body.push(head);
        }
    }

    show() {
        fill(this.color);
        noStroke();
        for (let i = 0; i < this.body.length; i++) {
            rect(this.body[i].x + (1 - this.thickness) / 2,
                 this.body[i].y + (1 - this.thickness) / 2,
                 this.thickness,
                 this.thickness);
        }
    }

    setDir(x, y) {
        this.xdir = x;
        this.ydir = y;
    }

    eat(pos) {
        let head = this.body[this.body.length - 1];
        if (head.x === pos.x && head.y === pos.y) {
            this.grow();
            return true;
        }
        return false;
    }

    grow() {
        let head = this.body[this.body.length - 1].copy();
        this.len++;
        this.body.push(head);
    }

    endGame() {
        let head = this.body[this.body.length - 1];

        // Verifica se bateu nas bordas
        if (head.x < 0 || head.x >= w || head.y < 0 || head.y >= h) {
            return true;
        }

        // Verifica se bateu em si mesma
        for (let i = 0; i < this.body.length - 1; i++) {
            let part = this.body[i];
            if (head.x === part.x && head.y === part.y) {
                return true;
            }
        }
        return false;
    }
}

let snake;
let rez = 20;
let food;
let w;
let h;
let emojisLixo = ['🗑️', '🍎', '🍌', '🍕', '🍔', '🍟', '🌭', '🍿', '🍩', '🍪', '🍫', '🍬', '🍭', '🍦', '🍧', '🍰', '🎂', '🧁', '🥧', '🥨'];
let emojiAtual;
let gameStarted = false;
let startButton;
let score = 0;
let gameSpeed = 5;
let backgroundColor;
let snakeColor;
let gameOverSequence = false;
let snakeTargetX;
let snakeTargetY;
let animationCounter = 0;
const animationDuration = 8; // Duração da animação MAIS rápida
let trashCanTop;
let trashCanBottom;
let trashCanLeft;
let trashCanRight;

function setup() {
    createCanvas(600, 400);
    w = floor(width / rez);
    h = floor(height / rez);
    frameRate(gameSpeed);
    backgroundColor = color(0, 0, 255); // Tela inicial azul
    snakeColor = color(0); // Cor inicial da cobra (redundante, mas para clareza)

    // Calcula as posições da lixeira AGORA que width e height estão definidos
    trashCanTop = (height / 2 - 40) / rez;
    trashCanBottom = (height / 2 + 40) / rez;
    trashCanLeft = (width / 2 - 30) / rez;
    trashCanRight = (width / 2 + 30) / rez;

    // Cria o botão de iniciar
    startButton = createButton('Clique para Iniciar');
    startButton.position(width / 2 - startButton.width / 2, height / 2 + 20);
    startButton.mousePressed(startGame);

    // Inicialmente, o jogo não está rodando
    noLoop();
}

function startGame() {
    snake = new Snake();
    foodLocation();
    escolherEmoji();
    gameStarted = true;
    gameOverSequence = false;
    animationCounter = 0;
    startButton.remove(); // Remove o botão após o clique
    score = 0;
    gameSpeed = 5;
    frameRate(gameSpeed);
    backgroundColor = color(0, 255, 0); // Tela de jogo verde
    // snake.color = color(0); // Garante que a cobra seja preta ao iniciar o jogo
    loop(); // Inicia o loop do jogo
}

function escolherEmoji() {
    emojiAtual = random(emojisLixo);
}

function foodLocation() {
    let x = floor(random(w));
    let y = floor(random(h));
    food = createVector(x, y);
}

function keyPressed() {
    if (gameStarted && !gameOverSequence) {
        if (keyCode === LEFT_ARROW && snake.xdir !== 1) {
            snake.setDir(-1, 0);
        } else if (keyCode === RIGHT_ARROW && snake.xdir !== -1) {
            snake.setDir(1, 0);
        } else if (keyCode === DOWN_ARROW && snake.ydir !== -1) {
            snake.setDir(0, 1);
        } else if (keyCode === UP_ARROW && snake.ydir !== 1) {
            snake.setDir(0, -1);
        }
    }
}

function drawLixeira() {
    fill(100);
    rect(width / 2 - 30, height / 2 - 40, 60, 80); // Corpo da lixeira
    fill(130);
    rect(width / 2 - 35, height / 2 - 50, 70, 10); // Tampa da lixeira
}

function draw() {
    background(backgroundColor);

    if (!gameStarted) {
        // Mostra o recado inicial em azul
        fill(255);
        textSize(20);
        textAlign(CENTER);
        text('Ajude a cobrinha a recolher o lixo do parque!', width / 2, height / 2 - 40);
        textSize(16);
        text('Use as setas do teclado para jogar', width / 2, height / 2 - 10);
    } else if (gameOverSequence) {
        scale(rez);
        let allInside = true;
        // Move cada parte do corpo da cobra em direção ao alvo
        for (let i = 0; i < snake.body.length; i++) {
            let targetX = width / 2 / rez;
            let targetY = (height / 2 - 20) / rez; // Alvo ajustado para cima da lixeira
            let dx = targetX - snake.body[i].x;
            let dy = targetY - snake.body[i].y;
            snake.body[i].x += dx / (animationDuration * 1.5); // Divisor menor para movimento mais rápido
            snake.body[i].y += dy / (animationDuration * 1.5);

            // Verifica se a parte da cobra está dentro dos limites da lixeira
            if (snake.body[i].x < trashCanLeft || snake.body[i].x > trashCanRight || snake.body[i].y < trashCanTop || snake.body[i].y > trashCanBottom) {
                allInside = false;
            }
        }
        snake.show();
        scale(1/rez);
        drawLixeira();

        fill(0);
        textSize(20);
        textAlign(CENTER);
        textStyle(BOLD); // Define o estilo do texto para negrito
        text('Lixo Recolhido: ' + score, width / 2, height / 2 + 60); // Exibe a pontuação real em negrito
        textStyle(NORMAL); // Reseta o estilo do texto para normal

        if (allInside) {
            gameStarted = false; // Volta para o estado inicial
            gameOverSequence = false;
            backgroundColor = color(0, 0, 255); // Volta para o fundo azul
            startButton = createButton('Clique para Iniciar'); // Recria o botão
            startButton.position(width / 2 - startButton.width / 2, height / 2 + 20);
            startButton.mousePressed(startGame);
            loop(); // Garante que a tela inicial seja redesenhada
        }
    } else {
        scale(rez);
        if (snake.eat(food)) {
            foodLocation();
            escolherEmoji();
            score++;
            gameSpeed += 0.4; // Acelera um pouco mais já que a animação é mais rápida
            frameRate(gameSpeed);
        }
        snake.update();
        snake.show();

        if (snake.endGame()) {
            gameOverSequence = true;
            noLoop();
            snakeTargetX = width / 2;
            snakeTargetY = height / 2 - 20; // Alvo ajustado também aqui
            animationCounter = 0;
            loop(); // Garante que o draw seja chamado para a animação
        }

        scale(1/rez);
        fill(255, 0, 100);
        textAlign(CENTER, CENTER);
        textSize(rez);
        text(emojiAtual, food.x * rez + rez / 2, food.y * rez + rez / 2);
    }
}