import { fromString } from 'css-color-converter';

const pixiColorCache = {};
function findPixiColor(cssColor) {
    if (cssColor in pixiColorCache)
        return pixiColorCache[cssColor];
    return pixiColorCache[cssColor] = computePixiColor(cssColor);
}

function computePixiColor(cssColor) {
    const color = fromString(cssColor);
    if (!color)
        return 0xffffff;
    const hexString = color.toHexString();
    return parseInt(`0x${hexString.substring(1, 7)}`);
}

export function hex(cssColor: TemplateStringsArray) {
    return findPixiColor(cssColor[0]);
}
