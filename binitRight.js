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

// Imagem do rato (sprite)
const ratoImg = new Image();
ratoImg.src = './Images/mouse.png'; // Imagem do rato

let ratoX = -150;
let ratoY = 680;
let frameIndex = 0;

function Desenhar(){
    // desenhar fundo
    ctx.drawImage(backgroundImage, 0,0,canvas.width,canvas.height);

    // desenhar caixotes de lixo
    ctx.drawImage(redbinImage, 76, 600, 100, 100);
    ctx.drawImage(bluebinImage, 350, 600, 100, 100);
    ctx.drawImage(greenbinImage, 600, 600, 100, 100);
    ctx.drawImage(yellowbinImage, 800, 600, 100, 100);
    ctx.drawImage(blackbinImage, 1000, 600, 100, 100);
    
    // desenhar rato

    ctx.drawImage(ratoImg, frameIndex * 161.5,0,161.5,47, ratoX, ratoY,161.5,47);
    ratoX = ratoX +50; // velocidade do rato

    if(ratoX > 1100){
        ratoX = -150; // Se sair do ecrã, volta ao inicio
    }

    frameIndex++;
    if(frameIndex == 6){
        frameIndex = 0; // reiniciar animação do rato
    }   
}

// Esperar imagens carregarem antes de desenhar
ratoImg.onload = function(){setInterval(Desenhar, 1000/14)}; // Desenhar a 12 fps


