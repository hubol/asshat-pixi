import {loadFontsAsync} from "../fonts";
import {loadTexturesAsync} from "../textures";
import {loadHowlsAsync} from "../utils/resources/loadHowls";
import {Howl} from "howler";
import * as PIXI from "pixi.js";

async function initialize()
{
    const howls = Object.values(require("../sounds")) as Howl[];
    PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST;
    await Promise.all([loadFontsAsync(), loadTexturesAsync(), loadHowlsAsync(howls)]);
    require("./game.ts");
}

window.onload = initialize;