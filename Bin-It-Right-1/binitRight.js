// binitRight.js — versão com spritesheets corrigida
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

canvas.width = 1100;
canvas.height = 800;

// -------------------- Configuráveis --------------------
const RATO_SPEED = 8;        // ajusta aqui a velocidade horizontal do rato (px por frame). Se quiseres os +50 originais, define 50.
const GATO_SPEED = 6;        // ajusta aqui a velocidade horizontal do gato (px por frame). Se quiseres os +40 originais, define 40.
const FRAME_INTERVAL_MS = 60; // tempo entre frames da spritesheet (ms) — influencia fluidez da caminhada

// -------------------- Imagens e bins --------------------
const backgroundImage = new Image();
backgroundImage.src = './Images/gameBg.jpeg';

const bins = [
  { img: new Image(), x: 76,  y: 600, tipo: 'vermelho' },
  { img: new Image(), x: 350, y: 600, tipo: 'azul' },
  { img: new Image(), x: 600, y: 600, tipo: 'verde' },
  { img: new Image(), x: 800, y: 600, tipo: 'amarelo' },
  { img: new Image(), x: 1000, y: 600, tipo: 'preto' }
];

bins[0].img.src = './Images/redbin.png';
bins[1].img.src = './Images/bluebin.png';
bins[2].img.src = './Images/greenbin.png';
bins[3].img.src = './Images/yellowbin.png';
bins[4].img.src = './Images/blackbin.png';

// -------------------- Estado do jogo --------------------
let lixoItens = [];
let ultimoSpawn = 0;
let pontuacao = 0;
let lixoArrastado = null;
let erros = []; // {x,y,tempo}
let lixoNoChao = 0;
let jogoAtivo = true;

const tiposLixo = {
  amarelo: ['🧴','🥤','🛍️'],
  azul: ['📄','📦','📰'],
  verde: ['🍾','🫙','🍷'],
  vermelho: ['⚙️','🔩','🪙'],
  preto: ['🍎','🍌','🥕']
};

// -------------------- Gerar lixo --------------------
function gerarLixo(tempo) {
  if (!jogoAtivo) return;
  if (tempo - ultimoSpawn < 2000) return;

  const tipos = Object.keys(tiposLixo);
  const tipo = tipos[Math.floor(Math.random() * tipos.length)];
  const emojiList = tiposLixo[tipo];
  const emoji = emojiList[Math.floor(Math.random() * emojiList.length)];

  lixoItens.push({
    id: Date.now() + Math.random(),
    x: Math.random() * (canvas.width - 50),
    y: -50,
    largura: 50,
    altura: 50,
    velocidade: 2 + Math.random() * 2,
    tipo,
    emoji,
    noChao: false,
    acertou: false
  });

  ultimoSpawn = tempo;
}

// -------------------- Atualizar lixo --------------------
function atualizarLixo() {
  for (const item of lixoItens) {
    if (!item.noChao && item !== lixoArrastado && !item.acertou) {
      item.y += item.velocidade;
      if (item.y + item.altura >= canvas.height - 30) {
        item.noChao = true;
        item.y = canvas.height - item.altura - 30;
        lixoNoChao++;
        if (lixoNoChao >= 15) fimDeJogo();
      }
    }
  }
}

// -------------------- Spritesheet: rato e gato --------------------
// Ajusta estes valores se os teus sprites tiverem dimensões diferentes
const RATO_FRAME_W = 161.5;
const RATO_FRAME_H = 47;
const RATO_FRAMES = 6;

const GATO_FRAME_W = 88;
const GATO_FRAME_H = 38;
const GATO_FRAMES = 6;

const ratoImg = new Image();
ratoImg.src = './Images/mouse.png';

const gatoImg = new Image();
gatoImg.src = './Images/cat.png';

let ratoX = -150;
let ratoY = 680;
let ratoFrame = 0;
let ultimoFrameRatoTime = 0;

let gatoX = -300;
let gatoY = 675;
let gatoFrame = 0;
let ultimoFrameGatoTime = 0;

// -------------------- Atualizar animações (tempo-based) --------------------
function atualizarAnimacoes(tempo) {
  // movimento horizontal (separado da troca de frames)
  ratoX += RATO_SPEED;
  gatoX += GATO_SPEED;

  // reinicia posições conforme lógica original
  if (ratoX > canvas.width) {
    ratoX = -150;
    gatoX = -300;
  }
  if (gatoX > canvas.width) {
    gatoX = -130;
  }

  // trocar frame do rato com base no tempo
  if (tempo - ultimoFrameRatoTime >= FRAME_INTERVAL_MS) {
    ratoFrame = (ratoFrame + 1) % RATO_FRAMES;
    ultimoFrameRatoTime = tempo;
  }

  // trocar frame do gato com base no tempo
  if (tempo - ultimoFrameGatoTime >= FRAME_INTERVAL_MS) {
    gatoFrame = (gatoFrame + 1) % GATO_FRAMES;
    ultimoFrameGatoTime = tempo;
  }
}

// -------------------- Desenhar --------------------
function desenhar() {
  // fundo (fallback se ainda não carregou)
  if (backgroundImage.complete) ctx.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);
  else {
    ctx.fillStyle = '#87CEEB';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }

  // bins
  for (const bin of bins) {
    if (bin.img.complete) ctx.drawImage(bin.img, bin.x, bin.y, 100, 100);
    else {
      ctx.fillStyle = '#666';
      ctx.fillRect(bin.x, bin.y, 100, 100);
    }
  }

  // lixo
  for (const item of lixoItens) {
    ctx.font = '36px "Segoe UI Emoji","Apple Color Emoji"';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.globalAlpha = item.noChao ? 0.6 : 1;
    ctx.fillText(item.emoji, item.x + item.largura / 2, item.y + item.altura / 2);
    ctx.globalAlpha = 1;
  }

  // desenhar rato a partir do spritesheet (se carregado)
  if (ratoImg.complete) {
    const sx = ratoFrame * RATO_FRAME_W;
    ctx.drawImage(ratoImg, sx, 0, RATO_FRAME_W, RATO_FRAME_H, ratoX, ratoY, RATO_FRAME_W, RATO_FRAME_H);
  }

  // desenhar gato a partir do spritesheet (se carregado)
  if (gatoImg.complete) {
    const sxG = gatoFrame * GATO_FRAME_W;
    ctx.drawImage(gatoImg, sxG, 0, GATO_FRAME_W, GATO_FRAME_H, gatoX, gatoY, 139, 60);
    // (dest width/height do gato estamos a manter 139x60 como antes)
  }

  // HUD
  ctx.fillStyle = 'rgba(255,255,255,0.9)';
  ctx.fillRect(20, 20, 260, 75);
  ctx.fillStyle = '#000';
  ctx.font = 'bold 20px Arial';
  ctx.fillText(`Pontuação: ${pontuacao}`, 150, 50);
  ctx.fillText(`Lixo no chão: ${lixoNoChao}`, 150, 80);

  // erros
  for (const err of erros) {
    ctx.font = '48px Arial';
    ctx.fillText('❌', err.x, err.y);
  }

  // overlay fim de jogo
  if (!jogoAtivo) {
    ctx.fillStyle = 'rgba(0,0,0,0.6)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    const w = 600, h = 200;
    ctx.fillStyle = 'white';
    ctx.strokeStyle = '#ffcc00';
    ctx.lineWidth = 8;
    ctx.fillRect(canvas.width/2 - w/2, canvas.height/2 - h/2, w, h);
    ctx.strokeRect(canvas.width/2 - w/2, canvas.height/2 - h/2, w, h);
    ctx.fillStyle = '#2B1E54';
    ctx.font = 'bold 40px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Mas que cidade mais suja!', canvas.width / 2, canvas.height / 2);
  }
}

// -------------------- Input: mouse + touch --------------------
function getPosicaoEvento(e) {
  const rect = canvas.getBoundingClientRect();
  if (e.touches && e.touches.length > 0) {
    return { x: e.touches[0].clientX - rect.left, y: e.touches[0].clientY - rect.top };
  } else if (e.changedTouches && e.changedTouches.length > 0) {
    return { x: e.changedTouches[0].clientX - rect.left, y: e.changedTouches[0].clientY - rect.top };
  } else {
    return { x: e.clientX - rect.left, y: e.clientY - rect.top };
  }
}

canvas.addEventListener('mousedown', iniciarArraste);
window.addEventListener('mousemove', arrastar);
window.addEventListener('mouseup', soltar);

canvas.addEventListener('touchstart', (e) => { iniciarArraste(e); }, { passive: false });
window.addEventListener('touchmove', (e) => { arrastar(e); }, { passive: false });
window.addEventListener('touchend', (e) => { soltar(e); }, { passive: false });

function iniciarArraste(e) {
  if (!jogoAtivo) return;
  const pos = getPosicaoEvento(e);
  for (let i = lixoItens.length - 1; i >= 0; i--) {
    const item = lixoItens[i];
    if (!item.noChao && pos.x >= item.x && pos.x <= item.x + item.largura && pos.y >= item.y && pos.y <= item.y + item.altura) {
      lixoArrastado = item;
      if (e.preventDefault) e.preventDefault();
      break;
    }
  }
}

function arrastar(e) {
  if (!lixoArrastado || !jogoAtivo) return;
  const pos = getPosicaoEvento(e);
  lixoArrastado.x = pos.x - lixoArrastado.largura / 2;
  lixoArrastado.y = pos.y - lixoArrastado.altura / 2;
  // limitar dentro do canvas
  if (lixoArrastado.x < 0) lixoArrastado.x = 0;
  if (lixoArrastado.x + lixoArrastado.largura > canvas.width) lixoArrastado.x = canvas.width - lixoArrastado.largura;
  if (lixoArrastado.y < 0) lixoArrastado.y = 0;
  if (lixoArrastado.y + lixoArrastado.altura > canvas.height) lixoArrastado.y = canvas.height - lixoArrastado.altura;
}

function soltar() {
  if (!lixoArrastado || !jogoAtivo) return;

  let caiuNoCerto = false;
  let caiuNoErrado = false;

  const centroX = lixoArrastado.x + lixoArrastado.largura/2;
  const centroY = lixoArrastado.y + lixoArrastado.altura/2;

  for (const bin of bins) {
    if (centroX >= bin.x && centroX <= bin.x + 100 && centroY >= bin.y && centroY <= bin.y + 100) {
      if (lixoArrastado.tipo === bin.tipo) {
        pontuacao += 10;
        caiuNoCerto = true;
      } else {
        caiuNoErrado = true;
        erros.push({ x: bin.x + 40, y: bin.y - 20, tempo: Date.now() });
      }
      lixoArrastado.acertou = true;
      break;
    }
  }

  if (caiuNoCerto || caiuNoErrado) {
    lixoItens = lixoItens.filter(l => l.id !== lixoArrastado.id);
  } else {
    lixoArrastado.noChao = true;
    lixoArrastado.y = canvas.height - lixoArrastado.altura - 30;
    lixoNoChao++;
    if (lixoNoChao >= 15) fimDeJogo();
  }

  lixoArrastado = null;
}

// limpar erros expirados
function limparErros() {
  const now = Date.now();
  erros = erros.filter(err => now - err.tempo < 1000);
}

// -------------------- Fim de jogo --------------------
function fimDeJogo() {
  jogoAtivo = false;
  // limpa lixo (opcional)
  lixoItens = [];
}

// -------------------- Loop principal --------------------
function animar(tempo = 0) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  gerarLixo(tempo);
  atualizarLixo();
  atualizarAnimacoes(tempo);
  limparErros();
  desenhar();
  requestAnimationFrame(animar);
}
requestAnimationFrame(animar);
