import colorString from "color-string";

const pixiColorCache = {};
function findPixiColor(cssColor) {
    if (cssColor in pixiColorCache)
        return pixiColorCache[cssColor];
    return pixiColorCache[cssColor] = computePixiColor(cssColor);
}

function computePixiColor(cssColor) {
    const rgbArray = colorString.get.rgb(cssColor);
    if (!rgbArray)
        return 0xffffff;
    const hexString = colorString.to.hex(rgbArray[0], rgbArray[1], rgbArray[2]);
    return parseInt(`0x${hexString.substring(1)}`);
}

export function hex(cssColor: TemplateStringsArray) {
    return findPixiColor(cssColor[0]);
}
