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

type LazyTickerReceiver = (ticker: AsshatTicker) => void;

interface LazyTicker extends AsshatTicker {
    _resolve(ticker: AsshatTicker): void;
    _addReceiver(receiver: LazyTickerReceiver): void;
    _isLazy: true;
}

const isLazyTicker = (ticker: AsshatTicker): ticker is LazyTicker => (ticker as any)._isLazy;

const lazyTickerHandler = {
    get(target, propKey) {
        if (propKey === '_resolve') {
            return function (ticker: AsshatTicker) {
                if (target._resolved) {
                    console.error(`Attempt to resolve already resovled LazyTicker`, target);
                    return;
                }
                target._queuedCalls.forEach(({ name, args }) => ticker[name](...args));
                target._receivers.forEach(fn => fn(ticker));
                target._resolved = true;
            }
        }
        if (propKey === '_addReceiver') {
            return function (receiver) {
                if (target._resolved) {
                    console.error(`Attempt to add receiver to already-resovled LazyTicker`, target, receiver);
                    return;
                }
                target._receivers.push(receiver);
            }
        }

        return function (...args) {
            if (target._resolved) {
                console.error(`Attempt to queue call to already-resovled LazyTicker`, target, propKey, args);
                return;
            }
            target._queuedCalls.push({ name: propKey, args })
        };
    }
};

function createLazyTicker(): LazyTicker {
    return new Proxy({ _resolved: false, _receivers: [], _queuedCalls: [] }, lazyTickerHandler);
}

Object.defineProperty(PIXI.DisplayObject.prototype, "ticker", {
    get: function ticker() {
        if (this._ticker)
            return this._ticker;

        if (this._lazyTicker)
            return this._lazyTicker;

        if (this.parent) {
            const maybeTicker = this.parent.ticker;
            if (!isLazyTicker(maybeTicker))
                return this._ticker = maybeTicker;

            maybeTicker._addReceiver(ticker => {
                this._ticker = ticker;
                delete this._lazyTicker;
            });
            return this._lazyTicker = maybeTicker;
        }

        const lazyTicker = createLazyTicker();
        lazyTicker._addReceiver(ticker => {
            this._ticker = ticker;
            delete this._lazyTicker;
        });
        this.on('added', () => {
            const parentTicker = this.parent.ticker;
            if (isLazyTicker(parentTicker))
                parentTicker._addReceiver(lazyTicker._resolve);
            else
                lazyTicker._resolve(parentTicker);
        });
        return this._lazyTicker = lazyTicker;
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
    (this as any)._lazyTicker?._resolve(ticker);
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
