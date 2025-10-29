import { Scene } from "phaser"


export class Player {


    public name:string
    public scene: Scene
    
    public colidesWith: (Phaser.Physics.Arcade.Group | Phaser.Physics.Arcade.StaticGroup)[]
    constructor(name:string,scene: Scene, colidesWith: (Phaser.Physics.Arcade.Group | Phaser.Physics.Arcade.StaticGroup)[]) {
        this.scene = scene
        this.colidesWith = colidesWith
        this.name = name
    }
    public speed: number
    public gravity: number
    playerNameBubble: Phaser.GameObjects.Text

    Instance: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody


    setPlayerBubble(value:Phaser.GameObjects.Text){
        this.playerNameBubble = value
    }
    getPlayerBubble(){
       return this.playerNameBubble 
    }
    getName(){
        return this.name
    }
    getScene() {
        return this.scene
    }
    getColidesWith() {
        return this.colidesWith
    }
    getGravity() {
        return this.gravity
    }
    setPlayerInstance(value: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody) {
        this.Instance = value
    }
    getplayerInstance() {
        return {instance:this.Instance,name:this.getName(),bubble:this.getPlayerBubble()}
    }

    summon() {
        const player = this.getScene().physics.add.sprite(100, 450, 'dude')
        player.setBounce(0.2)
        this.playerNameBubble = this.getScene().add.text(player.x,player.y-10,this.getName())
        player.setCollideWorldBounds(true)
        player.body.setGravity(0, this.getGravity())
        for (let col of this.getColidesWith()) {
            this.getScene().physics.add.collider(player, col)
        }
        this.getScene().anims.create({
            key: 'left',
            frames: this.getScene().anims.generateFrameNames('dude', { start: 0, end: 3 }),
            frameRate: 10,
            repeat: -1
        })
        this.getScene().anims.create({
            key: 'right',
            frames: this.getScene().anims.generateFrameNames('dude', { start: 5, end: 8 }),
            frameRate: 10,
            repeat: -1
        })
        this.getScene().anims.create({
            key: "turn",
            frames: [{ key: 'dude', frame: 4 }]
        })

        this.setPlayerBubble(this.playerNameBubble)
        this.setPlayerInstance(player)
    }

    controls() {

    }

}