import {onViewportResize} from "./onViewportResize";
import {viewport} from "./viewport";

type MinPaddingPx = number | (() => number);

export function integralUpscaleCanvas(canvasElement: HTMLCanvasElement, minPaddingPx: MinPaddingPx)
{
    const doUpscale = makeDoUpscale(canvasElement, minPaddingPx);
    doUpscale();
    onViewportResize(doUpscale);
}

function makeDoUpscale(canvas: HTMLCanvasElement, minPaddingPx: MinPaddingPx)
{
    let lastSeenViewportWidth = -1;
    let lastSeenViewportHeight = -1;

    return function()
    {
        if (viewport.width === lastSeenViewportWidth && viewport.height === lastSeenViewportHeight)
            return;

        const padding = (typeof minPaddingPx === "number" ? minPaddingPx : minPaddingPx()) * 2;
        const availableWidth = viewport.width - padding;
        const availableHeight = viewport.height - padding;

        const availableAspectRatio = availableWidth / availableHeight;
        const naturalAspectRatio = canvas.width / canvas.height;

        const linearScale = availableAspectRatio < naturalAspectRatio
            ? (availableWidth / canvas.width)
            : (availableHeight / canvas.height);

        const scale = getIntegralScale(linearScale);

        const width = scale * canvas.width;
        const height = scale * canvas.height;

        canvas.style.width = `${width}px`;
        canvas.style.height = `${height}px`;
        lastSeenViewportWidth = viewport.width;
        lastSeenViewportHeight = viewport.height;
    }
}

function getIntegralScale(linearScale: number)
{
    if (window.devicePixelRatio > 0)
        return Math.max(1, Math.floor(linearScale * window.devicePixelRatio)) / window.devicePixelRatio;
    return Math.max(1, Math.floor(linearScale));
}