import {createGame} from "../utils/asshat/createGame";
import {BitmapText, Container, Graphics, Sprite} from "pixi.js";
import {now} from "../utils/now";
import {Key} from "../utils/browser/key";
import {AcrobatixFont} from "../typedAssets/fonts";
import {Jukebox} from "../utils/jukebox";
import {Iguana} from "../typedAssets/textures";
import {CratePickup} from "../typedAssets/sounds";
import {Fly} from "../typedAssets/musics";
import {integralUpscaleCanvas} from "../utils/browser/integralUpscaleCanvas";
import {hex} from "../utils/asshat/hex";

const game = createGame({width: 640, height: 480, targetFps: 60});
game.canvasElement.id = "gameCanvas";
document.body.appendChild(game.canvasElement);
integralUpscaleCanvas(game.canvasElement, 20);

const lines = new Graphics()
    .withStep(() => {
        lines.lineStyle(1, hex`gray`);
        if (Math.random() > 0.9)
            lines.clear();
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

const iguana = new Sprite(Iguana)
    .at(320, 240)
    .withStep(() => {
        if (Key.isDown("ArrowRight"))
            iguana.x += 1;
        if (Key.justWentDown("Space"))
            CratePickup.play();
        if (Key.isDown("KeyS"))
            iguana.scale.x *= 1.1;
    });

const sprite = new Sprite(Iguana).withStep(() => sprite.x += 1);
const container = new Container().withStep(() => {
    if (Key.isDown("ArrowLeft"))
        container.x--;
});

container.addChild(sprite, iguana)

game.stage.addChild(lines, container, circle, new BitmapText("Welcome, special agent Sylvie.", { fontName: AcrobatixFont.font, tint: hex`red` }));

Jukebox.play(Fly);

setTimeout(() => sprite.destroy(), 8000);
