import {createGame} from "../src/asshat/createGame";
import {Graphics} from "pixi.js";
import {Key} from "../src/utils/browser/key";
import {now} from "../src/utils/now";

const game = createGame({width: 640, height: 480, targetFps: 60});
game.canvasElement.id = "gameCanvas";
document.body.appendChild(game.canvasElement);

const lines = new Graphics()
    .lineStyle(1, 0x808080)
    .withStep(() => {
        const x = game.width * (Math.sin(now.ms * 0.125) + 1) / 2;
        const y = game.height * (Math.cos(now.ms * 0.5) + 1) / 2;
        lines.lineTo(x, y);
    });

const circle = new Graphics()
    .withStep(() => {
        if (Key.isDown("Space"))
        {
            circle.x += 8;
            circle.y += 8;
        }
        else if (Key.isDown("Backspace"))
        {
            circle.x -= 4;
            circle.y -= 4;
        }

        circle
            .clear()
            .beginFill((circle.x / game.width) * 0xffff00 + 0x0000ff)
            .drawCircle(0, 0, 32)
    });

game.stage.addChild(lines, circle);