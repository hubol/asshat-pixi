import {createGame} from "../src/asshat/createGame";

const game = createGame({width: 640, height: 480, targetFps: 60});
game.canvasElement.id = "gameCanvas";
document.body.appendChild(game.canvasElement);