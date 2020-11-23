import {loadFontsAsync} from "./fonts";

async function initialize()
{
    await loadFontsAsync();
    require("./game.ts");
}

window.onload = initialize;