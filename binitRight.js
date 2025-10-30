const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

canvas.width = 1100;
canvas.height = 800;

// Imagem de fundo do jogo
const backgroundImage = new Image();
backgroundImage.src = './Images/gameBg.jpeg';

// Imagens dos caixotes de lixo
const redbinImage = new Image();
redbinImage.src = './Images/redbin.png'; // Caixote vermelho

const bluebinImage = new Image();
bluebinImage.src = './Images/bluebin.png'; // Caixote azul

const greenbinImage = new Image();
greenbinImage.src = './Images/greenbin.png'; // Caixote verde

const yellowbinImage = new Image();
yellowbinImage.src = './Images/yellowbin.png'; // Caixote amarelo

const blackbinImage = new Image();
blackbinImage.src = './Images/blackbin.png'; // Caixote preto

setTimeout(() => {
    // Desenhar fundo
    ctx.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);
    
    // Desenhar os 5 caixotes todos na mesma linha
    ctx.drawImage(redbinImage, 76, 600, 100, 100);      // Vermelho
    ctx.drawImage(bluebinImage, 350, 600, 100, 100);     // Azul
    ctx.drawImage(greenbinImage, 600, 600, 100, 100);    // Verde
    ctx.drawImage(yellowbinImage, 800, 600, 100, 100);  // Amarelo
    ctx.drawImage(blackbinImage, 1000, 600, 100, 100);   // Preto
}, 1000);