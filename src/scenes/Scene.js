import { Lyra } from './Lyra.js';

export class Scene extends Phaser.Scene {
    constructor() {
        super('Scene');
    }

    create() {
        const centerX = this.cameras.main.width / 2;
        const centerY = this.cameras.main.height / 2;

        // Adiciona o fundo centralizado

        // const templo = this.add.image(centerX, centerY, 'deserto');
        // templo.setDisplaySize(this.cameras.main.width, this.cameras.main.height); // Ajusta o tamanho do fundo para preencher a tela

        const map = this.make.tilemap({ key: 'templo' });
        const tileset = map.addTilesetImage('templo', 'tiles');

        map.createLayer('chao', tileset, 0, 0);
        const paredes = map.createLayer('parede', tileset, 0, 0);
        paredes.setCollisionByProperty({ colisao: true });
        const porta = map.createLayer('porta fechada', tileset, 0, 0);
        porta.setCollisionByProperty({ colisao: true });
        map.createLayer('botao', tileset, 0, 0);


        // Teste de Colisão
        // const debugGraphics = this.add.graphics().setAlpha(0.75);
        // paredes.renderDebug(debugGraphics, {
        //     tileColor: null, // Cor dos tiles normais
        //     collidingTileColor: new Phaser.Display.Color(243, 134, 48), // Cor dos tiles de colisão
        //     faceColor: new Phaser.Display.Color(40, 39, 37) // Cor das faces dos tiles
        // });
        // porta.renderDebug(debugGraphics, {
        //     tileColor: null, // Cor dos tiles normais
        //     collidingTileColor: new Phaser.Display.Color(243, 134, 48), // Cor dos tiles de colisão
        //     faceColor: new Phaser.Display.Color(40, 39, 37) // Cor das faces dos tiles
        // });

        // Adiciona a personagem na cena
        this.lyra = new Lyra(this, centerX - 428, centerY + 125);
    }

    update() {
        this.lyra.update();
        this.physics.add.collider(this.lyra, this.paredes);
    }
}
