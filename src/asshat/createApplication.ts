import {Application, InteractionManager} from "pixi.js";
import * as PIXI from "pixi.js";
import {make2dCanvasSink} from "../utils/browser/make2dCanvasSink";
import {environment} from "../utils/environment";
import {advanceKeyListener, startKeyListener} from "../utils/browser/key";
import {AsshatTicker} from "./ticker";

type ApplicationOptions = ConstructorParameters<typeof Application>[0]
    & { targetFps?: number, hideCursor?: boolean, allowBlurring?: boolean };

export type AsshatApplication = ReturnType<typeof createApplication>;

export function createApplication(options: ApplicationOptions)
{
    if (!options.allowBlurring)
        PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST;

    const app = new Application(options);

    if (options.targetFps)
        app.ticker.maxFPS = options.targetFps;

    if (options.hideCursor === true)
        (app.renderer.plugins.interaction as InteractionManager).cursorStyles.default = "none";

    let canvasElement = app.view;

    if (!options.allowBlurring)
    {
        canvasElement.style.cssText = `image-rendering: -moz-crisp-edges;
image-rendering: pixelated;`;

        if (environment.isSafari)
            canvasElement = make2dCanvasSink(app.view);
    }

    const ticker = new AsshatTicker();

    startKeyListener();

    app.ticker.add(() => {
        advanceKeyListener();
        ticker.update();
    });

    return {
        canvasElement,
        stage: app.stage,
        ticker,
        get width() {
            return app.renderer.width;
        },
        get height() {
            return app.renderer.height;
        }
    };
}