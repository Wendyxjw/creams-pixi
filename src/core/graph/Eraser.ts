/*
 * @Author: xujiawen 
 * @Description: 橡皮擦
 * @Date: 2018-04-26 11:00:54 
 * @Last Modified by:   xujiawen 
 * @Last Modified time: 2018-04-26 11:00:54 
 */

import { EraserInterface } from "./GraphInterface";
import { PointGraphics } from "../common/Graph";

export default class Eraser implements EraserInterface {
    private _circleCursor: PIXI.Sprite; //橡皮擦
    private _cursorTicker: PIXI.ticker.Ticker; //监听橡皮擦
    private _interaction: PIXI.interaction.InteractionManager;
    private _extraLayer: PIXI.Container;
    private _shapeLayer: PIXI.Container;
    private _eraserSize: number; //橡皮擦半径

    private _deletePointArr: Array<number> = [];//保存要删除的点的index
    private _isErase: Boolean = false; //记录是否mousedown
    private _callback: Function;
    private _state: PIXI.Container;
    private _graphContainer: PIXI.Container;

    constructor(interaction: PIXI.interaction.InteractionManager, extraLayer: PIXI.Container, shapeLayer: PIXI.Container, callback: Function, state: PIXI.Container, graphContainer: PIXI.Container) {
        this._interaction = interaction;
        this._extraLayer = extraLayer;
        this._callback = callback;
        this._shapeLayer = shapeLayer;
        this._state = state;
        this._graphContainer = graphContainer;
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
        this._circleCursor.name = "eraser";
        this._circleCursor.addChild(this.buildCircle());
        this._circleCursor.x = -1000; //让初始化位置在屏幕外
        this._circleCursor.y = -1000;
        this._circleCursor.interactive = true;

        //bindEvent
        this._circleCursor.on("pointerdown", (event: PIXI.interaction.InteractionEvent) => {
            this._isErase = true;
            this._findDeletePoints(event.data.global.x, event.data.global.y);
        }).on("mousemove", (event: PIXI.interaction.InteractionEvent) => {
            if (this._isErase) {
                this._findDeletePoints(event.data.global.x, event.data.global.y);
            }
        }).on("pointerup", (event: PIXI.interaction.InteractionEvent) => {
            this._isErase = false;
            this._callback(this._deletePointArr);
            //this._extraLayer.setChildIndex(this._circleCursor, this._extraLayer.children.length - 1);
            this._deletePointArr = [];
        })
        //eraser开启状态 禁止children事件触发.interactiveChildren = false;
        this._changeInteractive(false);

        //放置在编辑层
        this._state.addChild(this._circleCursor);

        //隐藏默认的鼠标指针 修改的其实是css
        this._interaction.cursorStyles.default = "none";

        //跟着鼠标走
        this._cursorTicker = new PIXI.ticker.Ticker();
        this._cursorTicker.speed = 0.5;
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
        this._changeInteractive(true);

        this._interaction.cursorStyles.default = "auto";
        this._cursorTicker.destroy();
        this._circleCursor.destroy();
    }
    setSize(size: number): void {
        this._circleCursor.removeChildren();
        this._circleCursor.addChild(this.buildCircle(size))
    }

    private _changeInteractive(state: boolean) {
        let extraLayer: PIXI.Container = <PIXI.Container>this._extraLayer.getChildByName("editLayer");
        extraLayer.interactive = state;
        extraLayer.children.forEach((item: PIXI.DisplayObject) => {
            item.interactive = state;
            item.interactiveChildren = state;
        })
        this._shapeLayer.interactiveChildren = state;
    }
    private _findDeletePoints(x: number, y: number) {
        //计算没有放大缩小、位移前的 x、y
        x = (x - this._graphContainer.position.x) / this._graphContainer.scale.x;
        y = (y - this._graphContainer.position.y) / this._graphContainer.scale.y;
        let pointR: number = 3;//编辑点圆点半径
        let eraserR: number = Number(this._eraserSize);
        let minSize: number = (pointR + eraserR) / this._graphContainer.scale.x;

        // 如果只有三个点 不能擦除
        let editLayer: PIXI.Container = <PIXI.Container>this._extraLayer.getChildByName("editLayer");
        let pointLayer: PIXI.Container = <PIXI.Container>editLayer.getChildByName("pointLayer");
        for (let i = 0; i < pointLayer.children.length; i++) {
            if (pointLayer.children.length - this._deletePointArr.length === 3) {
                break;
            }
            let item: PointGraphics = <PointGraphics>pointLayer.children[i];
            //如果已经是要删除的点 就不需要再次判断
            if (item.alpha == 0.3) {
                continue;
            }
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