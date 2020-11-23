import {loadFontsAsync} from "../fonts";
import {loadTexturesAsync} from "../textures";
import {loadHowlsAsync} from "../utils/resources/loadHowls";
import {Howl} from "howler";

async function initialize()
{
    const howls = Object.values(require("../sounds")) as Howl[];
    await Promise.all([loadFontsAsync(), loadTexturesAsync(), loadHowlsAsync(howls)]);
    require("./game.ts");
}

window.onload = initialize;