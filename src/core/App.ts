import * as PIXI from "pixi.js";

import { GraphManager } from './interfaces/GraphInterface';
import { ActionManager } from './interfaces/ActionInterface';
import { OperationManager } from './interfaces/OperationInterface';
import { StateManager } from './interfaces/StateInterface';
import { EventManager } from './interfaces/EventInterface';
import AppInterface from './interfaces/AppInterface';

export class App implements AppInterface {

    _app: PIXI.Application;
    stateManager: StateManager;

    actionManager: ActionManager;
    graphManager: GraphManager;
    operationManager: OperationManager;
    eventManager: EventManager;

    constructor(el: HTMLElement) {
        this._app = this.init(el);

    }

    init(el: HTMLElement) {
        const app = new PIXI.Application(
            el.offsetWidth, el.offsetHeight, { antialias: true }
        );
        window.addEventListener("resize", function () {
            app.renderer.resize(el.offsetWidth, el.offsetHeight);
        });
        el.appendChild(app.view);

        return app;
    }

}



let app = new App();

app.onZoomIn()
app.graphManager.render();
app.eventManager.onClickGraph(() => {
    alert();
});
// app.onShapeDeleted()
// app.onShapeMoveEnd((roomId, shapeIndex, graphData) => {

// })