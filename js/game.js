const mario = document.querySelector('.mario');
const pipe = document.querySelector('.pipe');
const gameOverScreen = document.querySelector('.game-over');
const restartButton = document.getElementById('restart');
let isJumping = false;
let gameLoop;

const jump = () => {
    if (isJumping) return;
    isJumping = true;
    mario.classList.add('jump');
    setTimeout(() => {
        mario.classList.remove('jump');
        isJumping = false;
    }, 500);
};

const checkCollision = () => {
    const pipeRect = pipe.getBoundingClientRect();
    const marioRect = mario.getBoundingClientRect();

    // Valores ajustáveis para hitbox:
    const marioWidth = 30;
    const pipeHeight = 60;
    const marioBottomMargin = 15;

    const isColliding = 
        pipeRect.left <= marioRect.right - marioWidth && 
        pipeRect.right >= marioRect.left + marioWidth &&
        marioRect.bottom - marioBottomMargin <= pipeRect.top + pipeHeight;

    if (isColliding) {
        pipe.style.animation = 'none';
        mario.style.animation = 'none';
        mario.src = 'img/game-over.png';
        mario.style.width = '75px';
        mario.style.marginLeft = '0';
        document.removeEventListener('keydown', jump);
        cancelAnimationFrame(gameLoop);
        gameOverScreen.style.display = 'flex';
    } else {
        gameLoop = requestAnimationFrame(checkCollision);
    }
};

const restartGame = () => {
    gameOverScreen.style.display = 'none';
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

// Inicia o jogo:
document.addEventListener('keydown', jump);
restartButton.addEventListener('click', restartGame);
gameLoop = requestAnimationFrame(checkCollision);