import { GraphManager } from './interfaces/GraphInterface';
import { ActionManager } from './interfaces/ActionInterface';
import { OperationManager } from './interfaces/OperationInterface';
import { StateManager } from './interfaces/StateInterface';
import { EventManager } from './interfaces/EventInterface';
import AppInterface from './interfaces/AppInterface';

export class App implements AppInterface {

    pixi: any;
    actionManager: ActionManager;
    graphManager: GraphManager;
    operationManager: OperationManager;
    stateManager: StateManager;
    eventManager: EventManager;

    onZoomIn() { }
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