const mario = document.querySelector('.mario');
const pipe = document.querySelector('.pipe');
const gameOverScreen = document.querySelector('.game-over');
const restartButton = document.getElementById('restart');
const scoreElement = document.getElementById('score');

// Variáveis de controle
let isJumping = false;
let gameLoop;
let score = 0000000;
let alreadyScored = false;
let gameActive = true;

// Efeito de pulo
const jump = () => {
    if (!gameActive || isJumping) return;
    
    isJumping = true;
    mario.classList.add('jump');

    setTimeout(() => {
        mario.classList.remove('jump');
        isJumping = false;
    }, 500);
};

// Detecção de colisão e pontuação
const checkCollision = () => {
    if (!gameActive) return;

    const pipeRect = pipe.getBoundingClientRect();
    const marioRect = mario.getBoundingClientRect();

    // Lógica de pontuação - verifica se o Mario passou do centro do cano
    if (pipeRect.right < marioRect.left && !alreadyScored) {
        score++;
        scoreElement.textContent = score;
        alreadyScored = true;
        // Efeito visual ao marcar ponto
        scoreElement.classList.add('score-pop');
        setTimeout(() => scoreElement.classList.remove('score-pop'), 300);
    }
    
    // Reseta a flag quando um novo cano aparece
    if (pipeRect.right > marioRect.right) {
        alreadyScored = false;
    }

    // Lógica de colisão
    const marioHitboxRight = marioRect.right - 30;
    const marioHitboxBottom = marioRect.bottom - 15;
    const isColliding = pipeRect.left <= marioHitboxRight && 
                       marioHitboxBottom >= pipeRect.top;

    if (isColliding) {
        endGame();
    } else {
        gameLoop = requestAnimationFrame(checkCollision);
    }
};

// Finaliza o jogo
const endGame = () => {
    gameActive = false;
    pipe.style.animation = 'none';
    mario.style.animation = 'none';
    mario.style.left = `${pipe.offsetLeft - 30}px`;
    mario.src = 'img/game-over.png';
    mario.style.width = '75px';
    mario.style.marginLeft = '0';
    
    // Verifica recorde
    const highScore = localStorage.getItem('highScore') || 0;
    if (score > highScore) {
        localStorage.setItem('highScore', score);
        const highScoreElement = document.createElement('div');
        highScoreElement.className = 'high-score';
        highScoreElement.textContent = `Novo Recorde: ${score}!`;
        gameOverScreen.appendChild(highScoreElement);
    }
    
    document.removeEventListener('keydown', jump);
    gameOverScreen.style.display = 'flex';
};

// Reinicia o jogo
const restartGame = () => {
    gameActive = true;
    score = 0;
    scoreElement.textContent = '0';
    alreadyScored = false;
    
    gameOverScreen.style.display = 'none';
    const highScoreMsg = document.querySelector('.high-score');
    if (highScoreMsg) highScoreMsg.remove();
    
    mario.src = 'img/mario.gif';
    mario.style.width = '150px';
    mario.style.marginLeft = '0';
    mario.style.animation = '';
    mario.style.bottom = '0';
    mario.style.left = '0';
    
    pipe.style.animation = '';
    pipe.style.left = '';
    
    document.addEventListener('keydown', jump);
    gameLoop = requestAnimationFrame(checkCollision);
};

// Inicia o jogo
document.addEventListener('keydown', jump);
restartButton.addEventListener('click', restartGame);
gameLoop = requestAnimationFrame(checkCollision);