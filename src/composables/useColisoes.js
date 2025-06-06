const BASE_WIDTH = 800;
const BASE_HEIGHT = 600;

export function useColisoes() {
  // Dados originais em coordenadas base
  const templosBase = [
    {
      x: 65, y: 100, largura: 125, altura: 215,
      porta: { x: 70, y: 305, largura: 115, altura: 10 },
    },
    {
      x: 265, y: 10, largura: 125, altura: 215,
      porta: { x: 270, y: 215, largura: 120, altura: 10 },
    },
    {
      x: 475, y: 90, largura: 125, altura: 215,
      porta: { x: 480, y: 295, largura: 120, altura: 10 },
    },
  ];

  const aviaoBase = {
    x: 145,
    y: 400,
    largura: 43,
    altura: 50,
    porta: {
      x: 145,
      y: 410,
      largura: 8,
      altura: 30,
    },
  };

  // Escala objeto com base nas dimensões do canvas atual
  function escalarObjeto(obj, scaleX, scaleY) {
    return {
      x: obj.x * scaleX,
      y: obj.y * scaleY,
      largura: obj.largura * scaleX,
      altura: obj.altura * scaleY,
    };
  }

  function escalarTemplos(scaleX, scaleY) {
    return templosBase.map(t => ({
      ...escalarObjeto(t, scaleX, scaleY),
      porta: escalarObjeto(t.porta, scaleX, scaleY),
    }));
  }

  function escalarAviao(scaleX, scaleY) {
    return {
      ...escalarObjeto(aviaoBase, scaleX, scaleY),
      porta: escalarObjeto(aviaoBase.porta, scaleX, scaleY),
    };
  }

  function retangulosColidem(r1, r2) {
    return !(
      r1.x + r1.largura < r2.x ||
      r1.x > r2.x + r2.largura ||
      r1.y + r1.altura < r2.y ||
      r1.y > r2.y + r2.altura
    );
  }

  // As funções abaixo agora recebem as dimensões do canvas
  function verificaColisaoTemplos(retangulo, canvasWidth, canvasHeight) {
    const scaleX = canvasWidth / BASE_WIDTH;
    const scaleY = canvasHeight / BASE_HEIGHT;
    const templos = escalarTemplos(scaleX, scaleY);
    return templos.some(templo => retangulosColidem(retangulo, templo));
  }

 function verificaColisaoAviao(retangulo, canvasWidth, canvasHeight) {
  const scaleX = canvasWidth / BASE_WIDTH;
  const scaleY = canvasHeight / BASE_HEIGHT;
  const aviaoEscalado = escalarAviao(scaleX, scaleY);
  return retangulosColidem(retangulo, aviaoEscalado) ? aviaoBase : null;
}

  function verificaColisaoPorta(retangulo, canvasWidth, canvasHeight) {
    const scaleX = canvasWidth / BASE_WIDTH;
    const scaleY = canvasHeight / BASE_HEIGHT;
    const templos = escalarTemplos(scaleX, scaleY);
    const aviao = escalarAviao(scaleX, scaleY);

    const temploComPorta = templos.find(templo => retangulosColidem(retangulo, templo.porta));
    if (temploComPorta) return temploComPorta;

    if (retangulosColidem(retangulo, aviao.porta)) return aviao;

    return null;
  }

  return {
    verificaColisaoTemplos,
    verificaColisaoAviao,
    verificaColisaoPorta,
    aviao: aviaoBase, // continua base para uso em lógica
  };
}
