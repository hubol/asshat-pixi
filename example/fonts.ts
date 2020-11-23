import {BitmapFont} from "pixi.js";
import {loadBitmapFontAsync} from "../src/utils/resources/loadBitmapFont";
import {loadTextureAsync} from "../src/utils/resources/loadTexture";

export let AcrobatixFont: BitmapFont;
export let AtomixFont: BitmapFont;

export async function loadFontsAsync()
{
    // I generated the .fnt files with a program called "AngelCode BMFont"
    AcrobatixFont = await loadBitmapFontAsync(
        require("./fonts/Acrobatix.fnt"),
        await loadTextureAsync(require("./fonts/Acrobatix_0.png")));

    AtomixFont = await loadBitmapFontAsync(
        require("./fonts/Atomix.fnt"),
        await loadTextureAsync(require("./fonts/Atomix_0.png")));
}

