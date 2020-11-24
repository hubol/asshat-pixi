import * as PIXI from "pixi.js";
    
// This file is generated. Do not touch.

export let Iguana: PIXI.Texture;


export function loadTexturesAsync()
{
    const loader = new PIXI.Loader();

    const IguanaPath = require("../../assets/images/iguana.png");
    loader.add(IguanaPath); 

    
    return new Promise<void>(resolve =>
    {
        loader.load((_, resources) => {
            Iguana = resources[IguanaPath]?.texture as PIXI.Texture;

            resolve();
        });
    });
}