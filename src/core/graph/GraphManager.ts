import { GraphAPI } from "./GraphInterface";
import { Graph, ShapeContent, Shape } from "../common/Graph";
import { App } from "../app/App";
import GraphHelper from "./GraphHelper";


export default class GraphManager implements GraphAPI {
    private _app: App;
    private _graph: Graph;
    private _graphContainer: PIXI.Container;

    constructor(app: App) {
        this._app = app;
        this._graphContainer = new PIXI.Container();
        GraphHelper.enableDrag(this._graphContainer);
        app.pixiApp.stage.addChild(this._graphContainer);
    }

    private _buildBackground(url: string) {
        let background = PIXI.Sprite.fromImage(url);
        background.alpha = 0.3;
        this._graphContainer.addChild(background);
    }

    private _buildGraphics(shape: Shape) {
        let graphics = new PIXI.Graphics();

        // set a fill and line style
        graphics.beginFill(0xD1D8DF, 1);
        graphics.lineStyle(1, 0xA7ACB2, 1);

        // draw a shape
        graphics.moveTo(shape[0][0], shape[0][1]);
        for (let i = 1; i < shape.length; i++) {
            graphics.lineTo(shape[i][0], shape[i][1]);
        }
        graphics.lineTo(shape[0][0], shape[0][1]);
        graphics.endFill();

        graphics.interactive = true;
        graphics.buttonMode = true;

        this._graphContainer.addChild(graphics);
    }
    
    getGraph(): Graph {
        return this._graph;
    }

    setGraph(graph: Graph): void {
        this._graph = graph;
        const app = this._app.pixiApp;
        this._buildBackground(graph.backgroundPic);
        for (let i = 0; i < graph.shapes.length; i++) {
            this._buildGraphics(graph.shapes[i])
        }
    }


    enableEdit(isEnabled: boolean): void {

    }

    setShapeContent(index: Array<number>, content: ShapeContent): void {
    
    }

    render(): void {

    }
}
