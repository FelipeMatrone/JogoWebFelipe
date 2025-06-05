import { ref } from 'vue';

export function usePlayer() {
  const player = ref({
    x: 250,
    y: 240,
    width: 32,
    height: 64,
    hitbox: {
      offsetX: 6,
      offsetY: 14,
      width: 20,
      height: 50,
    },
    speed: 2,
    frameIndex: 0,
    frameCount: 4,
    frameTick: 0,
    frameTickLimit: 10,
    direction: 1, // 0 = cima, 1 = baixo, 2 = esquerda, 3 = direita
  });

  const keys = ref({
    ArrowUp: false,
    ArrowDown: false,
    ArrowLeft: false,
    ArrowRight: false,
  });

  function resetFrame() {
    player.value.frameIndex = 0;
    player.value.frameTick = 0;
  }

  function updateFrame() {
    player.value.frameTick++;
    if (player.value.frameTick >= player.value.frameTickLimit) {
      player.value.frameTick = 0;
      player.value.frameIndex = (player.value.frameIndex + 1) % player.value.frameCount;
    }
  }

  function setPosition(x, y, direction = null) {
    player.value.x = x;
    player.value.y = y;
    if (direction !== null) {
      player.value.direction = direction;
    }
    resetFrame(); // reseta a animação ao posicionar
  }

  return {
    player,
    keys,
    resetFrame,
    updateFrame,
    setPosition,
  };
}
