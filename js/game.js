const mario = document.querySelector('.mario');
const pipe = document.querySelector('.pipe');
const gameOverScreen = document.querySelector('.game-over');
const restartButton = document.getElementById('restart');
let isJumping = false;
let gameLoop;

// Pulo do Mario
const jump = () => {
    if (isJumping) return;
    
    isJumping = true;
    mario.classList.add('jump');

    setTimeout(() => {
        mario.classList.remove('jump');
        isJumping = false;
    }, 500);
};

// Detecção de colisão precisa
const checkCollision = () => {
    const pipeRect = pipe.getBoundingClientRect();
    const marioRect = mario.getBoundingClientRect();

    // Ajuste fino da hitbox
    const marioWidth = 50;  // Largura real do Mario no CSS
    const pipeHeight = 80;  // Altura da área de colisão do cano

    const isColliding = 
        pipeRect.left <= marioRect.right - marioWidth && 
        pipeRect.right >= marioRect.left + marioWidth &&
        marioRect.bottom <= pipeRect.top + pipeHeight;

    if (isColliding) {
        // Para todas as animações
        pipe.style.animation = 'none';
        mario.style.animation = 'none';
        
        // Posiciona o Mario exatamente no ponto de colisão
        mario.style.left = `${pipeRect.left - marioWidth}px`;
        
        // Configura o game over
        mario.src = 'img/game-over.png';
        mario.style.width = '75px';
        mario.style.marginLeft = '0';

        // Desativa controles e mostra tela
        document.removeEventListener('keydown', jump);
        cancelAnimationFrame(gameLoop);
        gameOverScreen.style.display = 'flex'; // Usando flex para centralizar
    } else {
        gameLoop = requestAnimationFrame(checkCollision);
    }
};

// Reinício completo do jogo
const restartGame = () => {
    // Esconde a tela de game over
    gameOverScreen.style.display = 'none';
    
    // Reseta o Mario completamente
    mario.src = 'img/mario.gif';
    mario.style.width = '150px';
    mario.style.marginLeft = '0';
    mario.style.animation = '';
    mario.style.bottom = '0';
    mario.style.left = '0'; // ← Reseta posição horizontal!
    
    // Reseta o cano
    pipe.style.animation = '';
    pipe.style.left = '';
    
    // Reinicia o jogo
    document.addEventListener('keydown', jump);
    gameLoop = requestAnimationFrame(checkCollision);
};

// Inicialização
document.addEventListener('keydown', jump);
restartButton.addEventListener('click', restartGame);
gameLoop = requestAnimationFrame(checkCollision);