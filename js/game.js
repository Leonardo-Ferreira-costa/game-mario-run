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

    const isColliding = 
        pipeRect.left <= marioRect.right && 
        pipeRect.right >= marioRect.left &&
        pipeRect.top <= marioRect.bottom;

    if (isColliding) {
        // Para o jogo e mostra a tela de Game Over
        pipe.style.animation = 'none';
        mario.style.animation = 'none';
        mario.src = 'img/game-over.png';
        mario.style.width = '75px';
        mario.style.marginLeft = '50px';

        document.removeEventListener('keydown', jump);
        cancelAnimationFrame(gameLoop); // Para a verificação de colisão
        gameOverScreen.style.display = 'block'; // Mostra a tela de Game Over
    } else {
        gameLoop = requestAnimationFrame(checkCollision); // Continua o jogo
    }
};

// Reinicia o jogo
const restartGame = () => {
    gameOverScreen.style.display = 'none'; // Esconde a tela de Game Over
    
    // Reseta o Mario
    mario.src = 'img/mario.gif'; // Imagem original do Mario
    mario.style.width = '150px';
    mario.style.marginLeft = '0';
    mario.style.animation = '';
    mario.style.bottom = '0';
    
    // Reseta o cano
    pipe.style.animation = '';
    pipe.style.left = '';
    
    // Reinicia os eventos e o loop
    document.addEventListener('keydown', jump);
    gameLoop = requestAnimationFrame(checkCollision);
};

// Inicia o jogo pela primeira vez
document.addEventListener('keydown', jump);
restartButton.addEventListener('click', restartGame);
gameLoop = requestAnimationFrame(checkCollision);