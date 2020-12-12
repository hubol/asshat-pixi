import {Vector} from "../math/vector";
import * as PIXI from "pixi.js";
import {Container} from "pixi.js";
import {areRectanglesOverlapping, normalizeRectangle, rectangle as createRectangle} from "../math/rectangle";
import {AsshatTicker} from "../asshat/ticker";

declare global {
    namespace PIXI {
        export interface DisplayObject {
            at(vector: Vector): this;
            at(x: number, y: number): this;
            withStep(step: () => void): this;

            collides(displayObjects: DisplayObject | DisplayObject[], offset?: Vector): boolean;

            readonly rectangle: Rectangle;
            readonly destroyed: boolean;
            readonly ticker: AsshatTicker;
        }

        export interface Container {
            removeAllChildren();
            addChild<T extends DisplayObject>(child: T): T;
            withTicker(ticker: AsshatTicker): this;
        }
    }
}

Object.defineProperty(PIXI.DisplayObject.prototype, "rectangle", {
    get: function rectangle() {
        if (!this.anchor)
            return normalizeRectangle(createRectangle(this));
        return normalizeRectangle({ x: this.x - this.width * this.anchor.x, y: this.y - this.height * this.anchor.y, width: this.width, height: this.height });
    }
});

Object.defineProperty(PIXI.DisplayObject.prototype, "destroyed", {
    get: function destroyed() {
        return this._destroyed;
    }
});

Object.defineProperty(PIXI.DisplayObject.prototype, "ticker", {
    get: function ticker() {
        if (this._ticker)
            return this._ticker;

        if (this.parent)
            this._ticker = this.parent.ticker;

        if (!this._ticker)
            throw { displayObject: this, message: "Did not find a ticker" };

        return this._ticker;
    }
});

function doNowOrOnAdded<T extends PIXI.DisplayObject>(displayObject: T, onAdded: () => void): T
{
    if (displayObject.parent)
        onAdded();
    return displayObject.on("added", onAdded);
}

PIXI.Container.prototype.withTicker = function(ticker)
{
    (this as any)._ticker = ticker;
    return this;
}

PIXI.DisplayObject.prototype.withStep = function(step)
{
    return doNowOrOnAdded(this, () => this.ticker.add(step))
        .on("removed", () => this.ticker.remove(step));
}

PIXI.DisplayObject.prototype.at = function(x: Vector | number, y?: number)
{
    if (typeof x === "number")
        this.position.set(x, y);
    else
        this.position.set(x.x, x.y);
    return this;
}

PIXI.Container.prototype.removeAllChildren = function ()
{
    this.children.forEach(x => {
        if (x instanceof PIXI.Container)
            x.removeAllChildren();
    });

    this.removeChildren();
}

// Test if this container collides with any of the specified containers taking into account the offset, if specified
PIXI.DisplayObject.prototype.collides = function(otherContainerOrContainers, offset)
{
    return collides(this, otherContainerOrContainers, offset);
}

function collides(container, otherContainerOrContainers, offset)
{
    if (container.destroyed)
        return false;

    if (Array.isArray(otherContainerOrContainers))
    {
        for (let i = 0; i < otherContainerOrContainers.length; i++)
        {
            if (collides(container, otherContainerOrContainers[i], offset))
                return true;
        }

        return false;
    }

    if (otherContainerOrContainers.destroyed)
        return false;

    const containerBounds = container.getBounds();
    if (offset)
    {
        containerBounds.x += offset.x;
        containerBounds.y += offset.y;
    }
    const otherContainerBounds = otherContainerOrContainers.getBounds();
    return areRectanglesOverlapping(containerBounds, otherContainerBounds);
}

export default 0;