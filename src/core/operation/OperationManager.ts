import { OperationAPI } from "./OperationInterface"
import { Graph, ShapeContent, Shape } from "../common/Graph";
import { App } from "../app/App";
// implements 实现，必须实现完后面的interface，不然会报错； functionName（）：返回类型
//newcontainer 实现布局 然后具体里面实现的放大画布什么的 写在helper
export default class OperationManager implements OperationAPI {
    private _app: App;
    private _graph: Graph;
    private _graphContainer: PIXI.Container;

    constructor(app: App) {
        this._app = app;
        this._graphContainer = new PIXI.Container();
        var square = new PIXI.Sprite(PIXI.Texture.WHITE);
        square.tint = 0xff0000;
        square.anchor.set(0.5);
        square.position.set(10, 10);
        this._graphContainer.addChild(square)
        this._graphContainer.x = 250;
        this._graphContainer.y = 50
        this._graphContainer.width=100;
        this._graphContainer.height=300;
        //GraphHelper.enableDrag(this._graphContainer);
        app.pixiApp.stage.addChild(this._graphContainer);
    }

    zoomIn(level?: number): void { }
    zoomOut(level?: number): void { }
    justify(): void { }
    setEraserSize(size: number): void { }
    enableEraser(isEnabled: boolean): void { }
}