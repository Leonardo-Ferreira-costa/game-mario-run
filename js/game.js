const mario = document.querySelector('.mario');
const pipe = document.querySelector('.pipe');
const gameOverScreen = document.querySelector('.game-over');
const restartButton = document.getElementById('restart');
const scoreElement = document.getElementById('score');

// Variáveis de controle
let isJumping = false;
let gameLoop;
let score = 0;
let lastPipeX = 0;
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

    // Lógica de pontuação (verifica se o cano foi completamente ultrapassado)
    if (pipeRect.right < marioRect.left && pipeRect.right > lastPipeX) {
        score++;
        scoreElement.textContent = score;
        // Efeito visual ao marcar ponto
        scoreElement.style.animation = 'scorePop 0.3s';
        setTimeout(() => { scoreElement.style.animation = ''; }, 300);
    }
    lastPipeX = pipeRect.right;

    // Lógica de colisão
    const marioHitboxRight = marioRect.right - 30;
    const marioHitboxBottom = marioRect.bottom - 15;
    const isPipeInFront = pipeRect.left <= marioHitboxRight;
    const isMarioTooLow = marioHitboxBottom >= pipeRect.top;

    if (isPipeInFront && isMarioTooLow) {
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
    mario.src = 'img/game-over.png';
    mario.style.width = '75px';
    mario.style.marginLeft = '0';
    
    // Verifica e atualiza recorde
    const highScore = localStorage.getItem('highScore') || 0;
    if (score > highScore) {
        localStorage.setItem('highScore', score);
        const highScoreElement = document.createElement('div');
        highScoreElement.textContent = `Novo Recorde: ${score}!`;
        highScoreElement.className = 'high-score';
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
    lastPipeX = 0;
    
    gameOverScreen.style.display = 'none';
    // Remove mensagem de recorde se existir
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