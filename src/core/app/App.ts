import * as PIXI from "pixi.js";
import AppInterface from './AppInterface';
import AppAPI from "./AppAPI";
import ActionAPI from "../action/ActionAPI";
import OperationAPI from "../operation/OperationAPI";
import EventAPI from "../event/EventAPI";
import { StateManagerInterface } from '../state/StateInterface';
import { ActionManagerInterface } from "../action/ActionInterface";
import { GraphManagerInterface } from "../graph/GraphInterface";
import GraphManager from '../graph/GraphManager';
import OperationManager from '../operation/OperationManager';
import EventManager from '../event/EventManager';
import ActionManager from '../action/ActionManager';
import StateManager from "../state/StateManager";
import { Graph, GraphCache } from "../common/Graph";
interface ActionCombine extends ActionAPI, ActionManagerInterface {} 

export default class App implements AppInterface, AppAPI {
    pixiApp: PIXI.Application;
    actionManager: ActionCombine;
    stateManager: StateManagerInterface;
    graphManager: GraphManagerInterface;
    operationManager: OperationAPI;
    eventManager: EventAPI;

    constructor(el: HTMLElement) {
        this.pixiApp = this.init(el);
        this.graphManager = new GraphManager(this);
        this.operationManager = new OperationManager(this);
        this.eventManager = new EventManager(this);
        this.actionManager = new ActionManager(this);
        this.stateManager = new StateManager(this);
    }

    private init(el: HTMLElement) {
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

    setGraph(graph: Graph, options: GraphCache) {
        this.actionManager.init(graph);
        this.graphManager.setGraph(graph, options);
    }
}
