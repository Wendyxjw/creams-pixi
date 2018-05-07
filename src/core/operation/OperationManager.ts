import OperationAPI from "./OperationAPI"
import AppInterface from "../app/AppInterface";
import { ShapeContent, Shape, SelectEnum } from "../common/Graph";
import { RegionDeleteCallBack } from "../graph/GraphInterface";
import { changeTextStyle } from "./OperationHelper";
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
        changeTextStyle(this._graphCon.scale.y, this._graphCon);
    }

    zoomOut(level: number = 1.25): void {
        this._graphCon.x += this._graphCon.width * (1 - 1 / level) / 2;
        this._graphCon.y += this._graphCon.height * (1 - 1 / level) / 2;
        this._graphCon.scale.x /= level;
        this._graphCon.scale.y /= level;
        changeTextStyle(this._graphCon.scale.y, this._graphCon);
    }


    justify(): void {
        //如果shapelayer里面没有children 不做居中
        let shapeLayer: PIXI.Container = <PIXI.Container>this._graphCon.getChildByName("shapeLayer");
        let appScreen = this._app.pixiApp.screen;
        let backgroundLayer: PIXI.Container = <PIXI.Container>this._graphCon.getChildByName("backgroundLayer")
        if (shapeLayer.children.length < 1 && backgroundLayer.width <= 1) {
            return;
        }
        if (backgroundLayer.width > 1) {
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
        } else {
            let multiple: number = 0; // 缩放倍数
            let scaleShapeWidth: number = this._graphCon.scale.x * shapeLayer.width; // 计算shapelayer的长宽
            let scaleShapeHeight: number = this._graphCon.scale.y * shapeLayer.height;
            let standard: string = '';
            //设置graph的长宽
            if ((scaleShapeWidth / scaleShapeHeight) > (appScreen.width / appScreen.height)) {
                //以width为准
                multiple = appScreen.width / scaleShapeWidth;
                standard = 'width';
            } else {
                //以height为准
                multiple = appScreen.height / scaleShapeHeight;
                standard = 'height';
            }
            this._graphCon.width = this._graphCon.width * multiple;
            this._graphCon.height = this._graphCon.height * multiple;
            scaleShapeWidth = scaleShapeWidth * multiple;
            scaleShapeHeight = scaleShapeHeight * multiple;

            //设置graph的定位
            let x, y;
            if (standard == 'width') {
                x = -(this._graphCon.width - scaleShapeWidth);
                y = appScreen.height / 2 - scaleShapeHeight / 2
            } else {
                x = - (this._graphCon.width - scaleShapeWidth / 2 - appScreen.width / 2);
                y = - (this._graphCon.height - scaleShapeHeight)
            }

            this._graphCon.x = x;
            this._graphCon.y = y;
        }
        changeTextStyle(this._graphCon.scale.y, this._graphCon);
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

    selectNone() {
        this._app.stateManager.select(SelectEnum.None, []);
    }

    enableRegionDelete(isEnabled: boolean, callBack?: RegionDeleteCallBack): void {
        this._app.stateManager.enableRegionDelete(isEnabled, callBack);
    }
}