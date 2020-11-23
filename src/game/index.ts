import {loadFontsAsync} from "../fonts";
import {loadTexturesAsync} from "../textures";

async function initialize()
{
    await Promise.all([loadFontsAsync(), loadTexturesAsync()]);
    require("./game.ts");
}

window.onload = initialize;