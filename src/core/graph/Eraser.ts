import { EraserInterface } from "./GraphInterface";
import { PointGraphics } from "../common/Graph";
type CallbackFunc = {
    (deletePointArr: Array<number>): void;
}
export default class Eraser implements EraserInterface {
    private _circleCursor: PIXI.Sprite; //橡皮擦
    private _cursorTicker: PIXI.ticker.Ticker; //监听橡皮擦
    private _interaction: PIXI.interaction.InteractionManager;
    private _extraLayer: PIXI.Container;
    private _eraserSize: number; //橡皮擦半径

    private _deletePointArr: Array<number>;//保存要删除的点的index
    private _isErase: Boolean = false; //记录是否mousedown
    private _callback: CallbackFunc;

    constructor(interaction: PIXI.interaction.InteractionManager, extraLayer: PIXI.Container, callback: CallbackFunc) {
        this._interaction = interaction;
        this._extraLayer = extraLayer;
    }
    private buildCircle(radius: number = 10): PIXI.Graphics {
        //画个圆
        let circle = new PIXI.Graphics();
        circle.beginFill(0xffffff, 0);
        circle.lineStyle(1, 0x000, 1);
        circle.drawCircle(0, 0, radius);
        circle.endFill();
        this._eraserSize = radius;
        return circle;
    }
    enable(): void {
        //开启前先销毁 避免生成多个
        this.disable()
        this._circleCursor = new PIXI.Sprite();
        this._circleCursor.addChild(this.buildCircle());
        this._circleCursor.x = -1000; //让初始化位置在屏幕外
        this._circleCursor.y = -1000;
        //bindEvent
        this._circleCursor.on("mousedown", (event: PIXI.interaction.InteractionEvent) => {
            this._isErase = true;
            this._findDeletePoints(event.data.global.x, event.data.global.y);
        }).on("mousemove", (event: PIXI.interaction.InteractionEvent) => {
            if (this._isErase) {
                this._findDeletePoints(event.data.global.x, event.data.global.y);
            }
        }).on("mouseup", (event: PIXI.interaction.InteractionEvent) => {
            this._isErase = false;
            this._callback(this._deletePointArr);
        })

        //放置在编辑层
        this._extraLayer.addChild(this._circleCursor);

        //隐藏默认的鼠标指针 修改的其实是css
        this._interaction.cursorStyles.default = "none";
        //跟着鼠标走
        this._cursorTicker = new PIXI.ticker.Ticker();
        this._cursorTicker.add(() => {
            let mousePosition = this._interaction.mouse.global;
            this._circleCursor.x = mousePosition.x;
            this._circleCursor.y = mousePosition.y;
        }).start();
    }
    disable(): void {
        if (!this._cursorTicker) {
            return
        }
        if (!this._cursorTicker.started) {
            return
        }
        this._interaction.cursorStyles.default = "auto";
        this._cursorTicker.destroy();
        this._circleCursor.destroy();
    }
    setSize(size: number): void {
        this._circleCursor.removeChildren();
        this._circleCursor.addChild(this.buildCircle(size))
    }

    private _findDeletePoints(x: number, y: number) {
        let pointR: number = 3;//编辑点圆点半径
        let eraserR: number = this._eraserSize;
        let minSize: number = pointR + eraserR;

        for (let i = 0; i < this._extraLayer.children.length; i++) {
            let item: PointGraphics = <PointGraphics>this._extraLayer.children[i];
            if (item.pointIndex) {
                let xAbs = Math.abs(x - item.x);
                let yAbs = Math.abs(y - item.y);
                if ((xAbs < minSize) && (yAbs < minSize)) {
                    //point修改透明度，表示要删除
                    item.alpha = 0.3;
                    this._deletePointArr.push(i);
                }
            }
        }
    }
}