import {loadFontsAsync} from "../assets/fonts";

async function initialize()
{
    await loadFontsAsync();
    require("./game.ts");
}

window.onload = initialize;