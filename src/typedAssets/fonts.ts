import {BitmapFont} from "pixi.js";
import {loadBitmapFontAsync} from "../utils/resources/loadBitmapFont";
import {loadTextureAsync} from "../utils/resources/loadTexture";

export let AcrobatixFont: BitmapFont;
export let AtomixFont: BitmapFont;

export async function loadFontsAsync()
{
    // I generated the .fnt files with a program called "AngelCode BMFont"
    AcrobatixFont = await loadBitmapFontAsync(
        require("../../assets/fonts/Acrobatix.fnt"),
        await loadTextureAsync(require("../../assets/fonts/Acrobatix_0.png")));

    AtomixFont = await loadBitmapFontAsync(
        require("../../assets/fonts/Atomix.fnt"),
        await loadTextureAsync(require("../../assets/fonts/Atomix_0.png")));
}

