<!-- Game.vue -->
<template>
  <canvas
    ref="canvas"
    :width="canvasWidth"
    :height="canvasHeight"
    style="border:1px solid black; image-rendering: pixelated;"
  ></canvas>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import mapSrc from '../assets/templos.png';
import playerSrc from '../assets/player_spritesheet.png';

import { useColisoes } from '../composables/useColisoes.js';
import { usePlayer } from '../composables/usePlayer.js';
import { useTeclado } from '../composables/useTeclado.js';

const canvas = ref(null);
const canvasWidth = 640;
const canvasHeight = 480;

let context;

const mapImage = new Image();
mapImage.src = mapSrc;

const playerImage = new Image();
playerImage.src = playerSrc;

const {
  templos,
  aviao,
  verificaColisaoTemplos,
  verificaColisaoAviao,
  verificaColisaoPorta,
} = useColisoes();

const { player, keys, resetFrame, updateFrame, setPosition } = usePlayer();

const dialog = ref({
  visible: false,
  message: '',
  currentTemplo: null,
});

function rectFromPlayer(newX, newY) {
  return {
    x: newX + player.value.hitbox.offsetX,
    y: newY + player.value.hitbox.offsetY,
    largura: player.value.hitbox.width,
    altura: player.value.hitbox.height,
  };
}

function processarTecla(e) {
  if (!dialog.value.visible) return;

  if (e.key === 'e' || e.key === 'E') {
    alert(
      dialog.value.currentTemplo === aviao
        ? 'Você entrou no avião!'
        : 'Você entrou no templo!'
    );

    if (dialog.value.currentTemplo === aviao) {
      // Exemplo: se entrou no avião, reposiciona player na frente do avião
      posicionarNoAviao();
    } else {
      // Se entrou no templo, ao sair posiciona player na frente do templo
      posicionarNaFrenteTemplo(dialog.value.currentTemplo);
    }

    dialog.value.visible = false;
  } else if (e.key === 'Escape') {
    dialog.value.visible = false;
  }
}

// Setup teclado, usando composable para detectar setas e WASD
useTeclado(keys, processarTecla);

function update() {
  if (dialog.value.visible) return;

  let moving = false;
  let newX = player.value.x;
  let newY = player.value.y;
  let newDirection = player.value.direction;

  if (keys.value.ArrowLeft) {
    newX -= player.value.speed;
    newDirection = 2;
    moving = true;
  }
  if (keys.value.ArrowRight) {
    newX += player.value.speed;
    newDirection = 3;
    moving = true;
  }
  if (keys.value.ArrowUp) {
    newY -= player.value.speed;
    newDirection = 0;
    moving = true;
  }
  if (keys.value.ArrowDown) {
    newY += player.value.speed;
    newDirection = 1;
    moving = true;
  }

  // Limita o movimento dentro da tela
  if (newX < 0) newX = 0;
  if (newX + player.value.width > canvasWidth)
    newX = canvasWidth - player.value.width;
  if (newY < 0) newY = 0;
  if (newY + player.value.height > canvasHeight)
    newY = canvasHeight - player.value.height;

  const playerRect = rectFromPlayer(newX, newY);

  const collidedTemplo = verificaColisaoTemplos(playerRect);
  const collidedAviao = verificaColisaoAviao(playerRect);
  const temploComPorta = verificaColisaoPorta(playerRect);

  if (temploComPorta && !dialog.value.visible) {
    dialog.value.visible = true;
    dialog.value.message = 'Deseja entrar?\nE - Sim   ESC - Não';
    dialog.value.currentTemplo = temploComPorta;
  }

  if (!collidedTemplo && !collidedAviao && moving) {
    player.value.x = newX;
    player.value.y = newY;
    player.value.direction = newDirection;

    updateFrame();
  } else if (!moving) {
    resetFrame();
  }
}

function draw() {
  context.clearRect(0, 0, canvasWidth, canvasHeight);
  context.drawImage(mapImage, 0, 0, canvasWidth, canvasHeight);

  const frameWidth = playerImage.width / player.value.frameCount;
  const frameHeight = playerImage.height / 4;

  context.imageSmoothingEnabled = false; // garantir

  context.drawImage(
    playerImage,
    frameWidth * player.value.frameIndex,
    frameHeight * player.value.direction,
    frameWidth,
    frameHeight,
    Math.floor(player.value.x),
    Math.floor(player.value.y),
    player.value.width,
    player.value.height
  );
}

function loop() {
  update();
  draw();
  requestAnimationFrame(loop);
}

// --- Funções para posicionar player ---

function posicionarNoAviao() {
  setPosition(
    aviao.x + aviao.largura + 10, // um pouco à direita do avião
    aviao.y
  );
  player.value.direction = 3; // olhando para direita
}

function posicionarNaFrenteTemplo(templo) {
  setPosition(
    templo.x + (templo.largura / 2) - (player.value.width / 2),
    templo.y + templo.altura + 5 // um pouco abaixo do templo
  );
  player.value.direction = 1; // olhando para baixo
}

let mapLoaded = false;
let playerLoaded = false;

onMounted(() => {
  context = canvas.value.getContext('2d');

  mapImage.onload = () => {
    mapLoaded = true;
    if (playerLoaded) {
      posicionarNoAviao(); // posição inicial: perto do avião ao carregar mapa
      loop();
    }
  };

  playerImage.onload = () => {
    playerLoaded = true;
    if (mapLoaded) {
      posicionarNoAviao();
      loop();
    }
  };
});

defineExpose({ dialog });
</script>
