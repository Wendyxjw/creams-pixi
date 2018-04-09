import OperationAPI from "./OperationAPI"
import AppInterface from "../app/AppInterface";
import { ShapeContent, Shape } from "../common/Graph";
export default class OperationManager implements OperationAPI {
    private _app: AppInterface;
    private _graphCon: PIXI.Container;

    constructor(app: AppInterface) {
        this._app = app;
        this._graphCon = this._app.graphManager.graphContainer;
    }

    zoomIn(level: number = 1.25): void {
        this._graphCon.x -= this._graphCon.width * (level - 1) / 2;
        this._graphCon.y -= this._graphCon.height * (level - 1) / 2;
        this._graphCon.scale.x *= level;
        this._graphCon.scale.y *= level;
    }
    zoomOut(level: number = 1.25): void {
        this._graphCon.x += this._graphCon.width * (1 - 1 / level) / 2;
        this._graphCon.y += this._graphCon.height * (1 - 1 / level) / 2;
        this._graphCon.scale.x /= level;
        this._graphCon.scale.y /= level;
    }
    justify(): void {
        let appScreen = this._app.pixiApp.screen;
        //设置graph的长宽
        if ((this._graphCon.width / this._graphCon.height) > (appScreen.width / appScreen.height)) {
            //以width为准
            this._graphCon.height = this._graphCon.height / (this._graphCon.width / appScreen.width);
            this._graphCon.width = appScreen.width;
        } else {
            //以height为准
            this._graphCon.width = this._graphCon.width / (this._graphCon.height / appScreen.height)
            this._graphCon.height = appScreen.height;
        }
        //设置graph的定位
        this._graphCon.x = appScreen.width / 2 - this._graphCon.width / 2;
        this._graphCon.y = appScreen.height / 2 - this._graphCon.height / 2;
    }
    setEraserSize(size: number): void {
        this._app.graphManager.setEraserSize(size);
    }

    enableEraser(isEnabled: boolean): void {
        this._app.stateManager.enableEraser(isEnabled);
    }

    enableEdit(isEnabled: boolean): void {
        this._app.stateManager.enableEdit(isEnabled);
    }

    setShapeContent(index: number, content?: ShapeContent): void {
        this._app.graphManager.setShapeContent(index, content);
    }

    addShadowShape(width: number, height: number, content?: ShapeContent) {
        this._app.graphManager.setShadowShape(width, height, content)
    }

    deleteShadowShape() {
        this._app.graphManager.deleteShadowShape();
    }

    addPoint(lineIndex: number) {
        this._app.graphManager.addPoint(lineIndex);
    }
}