import { OperationAPI } from "./OperationInterface"
import { Graph, ShapeContent, Shape } from "../common/Graph";
import { App } from "../app/App";
// implements 实现，必须实现完后面的interface，不然会报错； functionName（）：返回类型
//工具的dom 调用页面写 ；然后具体里面实现的放大画布什么的 写在helper
export default class OperationManager implements OperationAPI {
    private _app: App;
    private _graph: Graph;

    constructor(app: App) {
        this._app = app;
    }
    private _enlargedScale(level?: number) {

    }
    zoomIn(level: number = 1.25): void {
        this._app.graphManager._graphContainer.scale.x *= level;
        this._app.graphManager._graphContainer.scale.y *= level;
    }
    zoomOut(level: number = 1.25): void {
        this._app.graphManager._graphContainer.scale.x /= level;
        this._app.graphManager._graphContainer.scale.y /= level;
    }
    justify(): void {
        let graph = this._app.graphManager._graphContainer;
        let appScreen = this._app.pixiApp.screen;
        //设置graph的长宽
        if ((graph.width / graph.height) > (appScreen.width / appScreen.height)) {
            //以width为准
            graph.height = graph.height / (graph.width / appScreen.width);
            graph.width = appScreen.width;
        } else {
            //以height为准
            graph.width = graph.width / (graph.height / appScreen.height)
            graph.height = appScreen.height;
        }
        //设置graph的定位
        graph.x = appScreen.width / 2 - graph.width / 2;
        graph.y = appScreen.height / 2 - graph.height / 2;
    }
    setEraserSize(size: number): void { }
    enableEraser(isEnabled: boolean): void { }
}