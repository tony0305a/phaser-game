import { Scene } from 'phaser';
import { EventBus } from '../EventBus';
import { Player } from '../classes/player';
import { nome } from '../../App';

export class Game extends Scene {
    constructor() {
        super('Game');
    }
    scoreText: Phaser.GameObjects.Text
    Score: number
    player: ({
        bubble: Phaser.GameObjects.Text; instance: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody; name: string;
    })[] = []
    stars: Phaser.Physics.Arcade.Group;
    bombs: Phaser.Physics.Arcade.Group;
    plataforms: any;
    setPlayer(value: {
        instance: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
        name: string;
        bubble: Phaser.GameObjects.Text
    }) {
        this.player.push(value)
        return this.player
    }
    getPlayer() {
        return this.player
    }
    setPlataforms(value: any) {
        this.plataforms = value
        return this.plataforms
    }
    getPlataforms() {
        return this.plataforms
    }
    setStars(value: Phaser.Physics.Arcade.Group) {
        this.stars = value
        return this.stars
    }
    getStars() {
        return this.stars
    }
    setBombs(value: Phaser.Physics.Arcade.Group) {
        this.bombs = value
        return this.bombs
    }
    getBombs() {
        return this.bombs
    }
    setScore(value: number) {
        this.Score = value
    }
    getScore() {
        return this.Score
    }
    preload() {

        this.load.image('sky', 'assets/sky.png');
        this.load.image('star', 'assets/star.png');
        this.load.image('ground', 'assets/platform.png');
        this.load.image('bomb', 'assets/bomb.png');
        this.load.spritesheet('dude', 'assets/dude.png', { frameWidth: 32, frameHeight: 48 })
    }
    join(name: string) {
        let allow = true
        for (let p of this.getPlayer()) {
            if (p.name == name) {
                allow = false
            }
        }
        if (!allow) return
        //@ts-ignore
        const newPlayer = new Player(name, this, ["", ""])
        newPlayer.summon()
        this.physics.add.collider(this.getPlataforms(), newPlayer.getplayerInstance().instance)
        this.physics.add.collider(newPlayer.getplayerInstance().instance, this.getBombs(), this.hitBomb, undefined, this)
        this.physics.add.overlap(newPlayer.getplayerInstance().instance, this.getStars(), this.collectStar, undefined, this)
        this.setPlayer(newPlayer.getplayerInstance())
    }
    summonStars() {
        //@ts-ignore
        this.getStars()?.create(Phaser.Math.Between(0, 600), Phaser.Math.Between(0, 800), 'star')
    }
    create() {
        this.add.image(400, 300, 'sky')
        this.scoreText = this.add.text(16, 16, "Score:0", { fontSize: '32px', color: '#000' })
        const plataforms = this.physics.add.staticGroup()
        const bombs = this.physics.add.group()
        const stars = this.physics.add.group({
            key: 'star',
            repeat: 11,
            setXY: { x: 12, y: 0, stepX: 70 }
        })
        //@ts-ignore
        stars.children.iterate(function (child) {
            //@ts-ignore
            child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
        });

        plataforms.create(400, 568, 'ground').setScale(2).refreshBody()
        plataforms.create(600, 400, 'ground')
        plataforms.create(50, 250, 'ground')
        plataforms.create(750, 220, 'ground')

        this.physics.add.collider(stars, plataforms)
        this.physics.add.collider(bombs, plataforms)


        this.setPlataforms(plataforms)
        this.setStars(stars)
        this.setBombs(bombs)
        EventBus.emit('current-scene-ready', this);
    }
    collectStar(player: any, star: any) {
        console.log(player)
        star.disableBody(true, true)
        if (this.getScore() == undefined) {
            this.setScore(10)
        }
        this.setScore(this.getScore() + 10)
        this.scoreText.setText('Score: ' + this.getScore())

        if (this.getStars()?.countActive(true) === 0) {
            //@ts-ignore
            this.getStars().children.iterate(function (child: any) {
                child.enableBody(true, child.x, 0, true, true)
            })
            for (player of this.getPlayer()) {
                var x = (player.instance || 0 < 400) ? Phaser.Math.Between(400, 800) : Phaser.Math.Between(0, 400)
                var bomb = this.getBombs()?.create(x, 16, 'bomb')
                bomb.setBounce(1)
                bomb.setCollideWorldBounds(true)
                bomb.setVelocity(Phaser.Math.Between(-200, 200), 20)
            }

        }
    }
    hitBomb(player: any, bomb: any) {
        console.log(bomb)
        this.physics.pause()
        player.setTint(0xff0000)
        player.anims.play('turn')
    }

    update() {
        const cursors = this?.input?.keyboard?.createCursorKeys();
        for (let player of this.getPlayer()) {
            var topLeft = player.bubble.getTopLeft().x
            var bottomRight = player.bubble.getBottomRight().x
            var nameOffset = (bottomRight - topLeft) / 2
            player.bubble.x = player.instance.x - nameOffset
            player.bubble.y = player.instance.y - 30
            if (player.name == nome) {
                if (cursors?.left.isDown) {
                    player.instance.setVelocityX(-160);
                    player.instance.anims.play('left', true);
                }
                else if (cursors?.right.isDown) {
                    player.instance.setVelocityX(160)
                    player.instance.anims.play('right', true)
                }
                else {
                    player.instance.setVelocityX(0)
                    player.instance.anims.play('turn')
                }
                if (cursors?.up.isDown && player.instance.body.touching.down) {
                    player.instance.setVelocityY(-2000)
                }
            }
        }
    }
}
