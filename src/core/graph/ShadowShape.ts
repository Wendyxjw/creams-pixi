import { ShapeContent, Shape } from "../common/Graph";
import { ShadowShapeInterface } from "./GraphInterface";
import AppInterface from "../app/AppInterface";

export default class ShadowShape implements ShadowShapeInterface {
    private _shadowShape: PIXI.Graphics;
    private _shadowTicker: PIXI.ticker.Ticker;
    private _shadowMatching: Boolean = false; //是否开启匹配模式
    private _shadowMatchingCon: ShapeContent;
    private _app: AppInterface;

    constructor(app: AppInterface) {
        this._app = app;
    }
    buildShadowShape(x: number, y: number, width: number, height: number, content?: ShapeContent) {
        this.deleteShadowShape();

        let shape: Shape;
        shape = [[0, 0], [0, height], [width, height], [width, 0]];
        this._shadowMatching = true;
        this._shadowMatchingCon = content;

        this._shadowShape = this._app.graphManager.buildShadowShapes(shape, content);
        this._shadowShape.on("mouseup", () => {
            console.log(12)
        })
        this._app.graphManager.graphContainer.addChild(this._shadowShape);
        //跟着鼠标走
        this._shadowTicker = new PIXI.ticker.Ticker();
        this._shadowTicker.add(() => {
            let mousePosition = this._app.pixiApp.renderer.plugins.interaction.mouse.global;
            this._shadowShape.x = mousePosition.x - width;
            this._shadowShape.y = mousePosition.y - height;
        }).start();
    }
    shapeOver(shapeIndex: number) {
        if (this._shadowMatching) {
            let shape = this._app.actionManager.getCurrentShape(shapeIndex);
            let colorCon: ShapeContent = JSON.parse(JSON.stringify(this._shadowMatchingCon));
            colorCon.content = "";
            colorCon.alpha = 1;
            colorCon.hasMark = false;
            this._app.graphManager.updateShapes(shape, shapeIndex, colorCon)

            // this._app.graphManager.updateShapes(shape, shapeIndex, this._app.operationShadowShape._shadowMatchingCon)
        }
    }
    shapeOut(shapeIndex: number): void {
        if (this._shadowMatching) {
            let index = shapeIndex;
            let shape = this._app.actionManager.getCurrentShape(index);
            this._app.graphManager.updateShapes(shape, shapeIndex)
        }
    }

    shapePionterUp(shapeIndex: number): void {
        if (this._shadowMatching) {
            let index = shapeIndex;
            let shape = this._app.actionManager.getCurrentShape(shapeIndex);
            this._shadowMatchingCon.hasMark = false;
            this._shadowMatchingCon.alpha = 1;
            this._app.graphManager.updateShapes(shape, shapeIndex, this._shadowMatchingCon)
            //更新数据
            this._app.graphManager.graph.shapesContent[index] = this._shadowMatchingCon;
            this._shadowMatching = false;
            this.deleteShadowShape();
        }
    }
    deleteShadowShape() {
        if (!this._shadowTicker) {
            return
        }
        if (!this._shadowTicker.started) {
            return
        }
        this._shadowTicker.destroy();
        this._shadowShape.destroy();
    }
}
