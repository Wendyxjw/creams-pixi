import * as PIXI from "pixi.js";

import GraphManager from '../graph/GraphManager';
import { StateManager } from '../state/StateInterface';
import AppInterface from './AppInterface';

export class App {

    pixiApp: PIXI.Application;
    stateManager: StateManager;

    // actionManager: ActionManager;
    graphManager: GraphManager;
    // operationManager: OperationManager;
    // eventManager: EventManager;

    constructor(el: HTMLElement) {
        this.pixiApp = this.init(el);
        this.graphManager = new GraphManager(this);
    }

    init(el: HTMLElement) {
        const app = new PIXI.Application({
            width: el.offsetWidth,
            height: el.offsetHeight,
            backgroundColor: 0xffffff,
            antialias: true 
        });
        window.addEventListener("resize", function () {
            app.renderer.resize(el.offsetWidth, el.offsetHeight);
        });
        el.appendChild(app.view);

        return app;
    }

}



// let app = new App();

// app.onZoomIn()
// app.graphManager.render();
// app.eventManager.onClickGraph(() => {
//     alert();
// });
// app.onShapeDeleted()
// app.onShapeMoveEnd((roomId, shapeIndex, graphData) => {

// })