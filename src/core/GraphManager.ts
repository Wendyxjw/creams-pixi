import { GraphAPI } from "./interfaces/GraphInterface";
import { Graph, ShapeContent, Shape } from "./interfaces/Graph";
import { App } from "./App";


export default class GraphManager implements GraphAPI {
    private _app: App;
    private _graph: Graph;
    private _graphContainer: PIXI.Container;

    constructor(app: App) {
        this._app = app;
        this._graphContainer = new PIXI.Container();
        app.pixiApp.stage.addChild(this._graphContainer);
    }

    private _buildGraphics(shape: Shape) {
        var graphics = new PIXI.Graphics();

        // set a fill and line style
        graphics.beginFill(0xFFFF0B, 0.3);
        graphics.lineStyle(1, 0xffd900, 1);

        // draw a shape
        graphics.moveTo(shape[0][0], shape[0][1]);
        var i;
        for (var i = 1; i < shape.length; i++) {
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
