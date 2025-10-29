import { useRef, useState } from 'react';
import { IRefPhaserGame, PhaserGame } from './PhaserGame';
import { Game } from './game/scenes/Game';
export var nome = ""

function App() {

    //  References to the PhaserGame component (game and scene are exposed)
    const phaserRef = useRef<IRefPhaserGame | null>(null);
    const [playerName, setPlayerName] = useState<string>("")

    const getPlayers = () => {
        if (phaserRef.current) {
            const scene = phaserRef.current.scene as Game
            console.log(scene.getPlayer())
        }
    }
    const summonStars = () => {
        if (phaserRef.current) {
            const scene = phaserRef.current.scene as Game
            scene.summonStars()
        }
    }
    const join = () => {
        if (phaserRef.current) {
            const scene = phaserRef.current.scene as Game
            scene.join(playerName)
            if(nome == ""){
                nome = playerName
            }
        }
    }


    return (
        <div id="app">
            <PhaserGame ref={phaserRef} />
            <div>
                <div>
                    <input type='text' value={playerName} onChange={(e) => setPlayerName(e.target.value)} />
                    <button onClick={join} >Join</button>
                </div>
                <button onClick={getPlayers} >Get Players</button>
                <button onClick={summonStars} >Summon stars</button>
            </div>
        </div>
    )
}


export default App
