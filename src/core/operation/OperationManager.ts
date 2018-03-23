import OperationAPI from "./OperationAPI"
import AppInterface from "../app/AppInterface";
import { ShapeContent } from "../common/Graph";
// implements 实现，必须实现完后面的interface，不然会报错； functionName（）：返回类型

export default class OperationManager implements OperationAPI {
    private _app: AppInterface;
    private _circleCursor: PIXI.Sprite;//橡皮擦
    private _cursorTicker: PIXI.ticker.Ticker;//监听橡皮擦
    private _graphCon: PIXI.Container

    constructor(app: AppInterface) {
        this._app = app;
        this._graphCon = this._app.graphManager.graphContainer;
    }
    private _drawCircle(radius: number = 10) {
        //画个圆
        let circle = new PIXI.Graphics();
        circle.beginFill(0xffffff, 0);
        circle.lineStyle(1, 0x000, 1);
        circle.drawCircle(0, 0, radius);
        circle.endFill();
        return circle;
    }
    private _drawCursor() {
        //开启前先销毁 避免生成多个
        this._destroyMosueCursor()
        this._circleCursor = new PIXI.Sprite();
        this._circleCursor.addChild(this._drawCircle());
        this._circleCursor.x = -10;//让初始化位置在stage外
        this._circleCursor.y = -10;
        this._app.pixiApp.stage.addChild(this._circleCursor);
        //隐藏默认的鼠标指针 修改的其实是css
        var interaction = this._app.pixiApp.renderer.plugins.interaction;
        interaction.cursorStyles.default = "none";
        //跟着鼠标走
        this._cursorTicker = new PIXI.ticker.Ticker();
        this._cursorTicker.add(() => {
            let mousePosition = interaction.mouse.global;
            this._circleCursor.x = mousePosition.x;
            this._circleCursor.y = mousePosition.y;
        }).start();
    }
    //销毁指针ticker 还原指针默认样式
    private _destroyMosueCursor() {
        if (!this._cursorTicker) {
            return
        }
        if (!this._cursorTicker.started) {
            return
        }
        this._app.pixiApp.renderer.plugins.interaction.cursorStyles.default = "auto";
        this._cursorTicker.destroy();
        this._circleCursor.destroy();
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
        this._circleCursor.removeChildren();
        this._circleCursor.addChild(this._drawCircle(size))
    }

    enableEraser(isEnabled: boolean): void {
        // if (isEnabled) {
        //     this._drawCursor();
        // } else {
        //     this._destroyMosueCursor();
        // }
        this._app.stateManager.enableEraser(isEnabled);
    }

    enableEdit(isEnabled: boolean): void {
        this._app.stateManager.enableEdit(isEnabled);
    }

    setShapeContent(index: Array<number>, content: ShapeContent): void {
        this._app.graphManager.setShapeContent(index, content);
    }
    addShadowShape(x: number, y: number, width: number, height: number, content?: ShapeContent) {

    }
}