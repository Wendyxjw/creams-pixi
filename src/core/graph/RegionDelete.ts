/*
 * @Author: xujiawen 
 * @Description: 框选删除
 * @Date: 2018-04-24 11:24:22 
 * @Last Modified by: xujiawen
 * @Last Modified time: 2018-05-07 17:09:50
 */
import { RegionDeleteInterface, RegionDeleteCallBack } from "./GraphInterface";
import AppInterface from "../app/AppInterface";
import { drawShape } from "./DrawingHelper";
import { Shape, ShapeGraphics, ShapeContent, LineStyle, SelectEnum } from "../common/Graph";
import DragHelper from "./DragHelper";

export default class RegionDelete implements RegionDeleteInterface {
    private _app: AppInterface;
    private _extraLayer: PIXI.Container;
    private _shapeLayer: PIXI.Container;

    private _regionLayer: PIXI.Container; // 框选层
    private _graph: ShapeGraphics; // 框选图形
    private _startDown: boolean; // 是否开始框选（pointerdown）
    private _startX: number; // 开始框选的点
    private _startY: number;
    private _hasOpen: boolean = false;
    private _callBack: RegionDeleteCallBack;

    constructor(app: AppInterface, extraLayer: PIXI.Container, shapeLayer: PIXI.Container, ) {
        this._app = app;
        this._extraLayer = extraLayer;
        this._shapeLayer = shapeLayer;
        this._regionLayer = new PIXI.Container();
        this._regionLayer.hitArea = new PIXI.Rectangle(-10000000, -10000000, 100000000000000, 100000000000000);
        this._regionLayer.interactive = true;
    }

    enable(isEnabled: boolean, callBack?: RegionDeleteCallBack): void {
        if (isEnabled) {
            this._callBack = callBack;
            this._hasOpen = true;
            // 关闭所有事件
            this._changeInteractive(false);
            this._unbindEvent();

            this._app.graphManager.graphContainer.addChild(this._regionLayer);
            this._regionLayer.on("pointerdown", this._startDraw)
                .on("mousemove", this._drawing)
                .on("pointerup", this._endDraw)
                .on("pointerout", this._endDraw);
        } else {
            if (!this._hasOpen) {
                return;
            } else {
                this._hasOpen = false;
            }
            this._changeInteractive(true);
            this._unbindEvent();
            this._app.graphManager.graphContainer.removeChild(this._regionLayer);
        }

    }

    // disable(): void {
    //     this._changeInteractive(true);
    //     this._unbindEvent();
    //     this._app.graphManager.graphContainer.removeChild(this._regionLayer);
    // }
    private _unbindEvent() {
        this._regionLayer.off("pointerdown", this._startDraw)
            .off("mousemove", this._drawing)
            .off("pointerup", this._endDraw)
            .off("pointerout", this._endDraw);
    }
    private _startDraw: Function = (event: PIXI.interaction.InteractionEvent) => {
        this._startX = event.data.global.x;
        this._startY = event.data.global.y;
        this._startDown = true;
        this._graph = new ShapeGraphics();
        this._regionLayer.addChild(this._graph);
    }
    private _drawing: Function = (event: PIXI.interaction.InteractionEvent) => {
        if (this._startDown) {
            let conStyle: ShapeContent = {
                backgroundAlpha: 0.15,
                backgroundColor: 0x4494F0,
                border: {
                    lineWidth: 1,
                    color: 0x4494F0,
                    lineStyle: LineStyle.Solid
                },
                font: {
                    fontSize: 14,
                    fill: [0x000000]
                },
                content: "",
                hasMark: false,
                alpha: 0.8,
                interactive: true
            }
            this._graph.clear();
            let moveX: number = event.data.global.x;
            let moveY: number = event.data.global.y;
            let position: PIXI.Point = <PIXI.Point>this._app.graphManager.graphContainer.position;
            let scale: PIXI.Point = <PIXI.Point>this._app.graphManager.graphContainer.scale;
            let getPoint = (data: number, type: string) => {
                if (type == "x") {
                    return (data - position.x) / scale.x;
                } else {
                    return (data - position.y) / scale.y;
                }
            }
            let shape: Shape = [
                [getPoint(this._startX, "x"), getPoint(this._startY, "y")],
                [getPoint(this._startX, "x"), getPoint(moveY, "y")],
                [getPoint(moveX, "x"), getPoint(moveY, "y")],
                [getPoint(moveX, "x"), getPoint(this._startY, "y")]
            ];
            // 没有文字所以textScale可以传1或者任意数字
            drawShape(this._graph, shape, 1, conStyle)
        }
    }

    private _endDraw: Function = (event: PIXI.interaction.InteractionEvent) => {
        if (this._startDown) {
            this._startDown = false;
            let deleteArr: Array<number> = [];
            this._shapeLayer.children.forEach((item: ShapeGraphics) => {
                if (item.xMin > this._graph.xMin && item.xMax < this._graph.xMax && item.yMin > this._graph.yMin && item.yMax < this._graph.yMax) {
                    deleteArr.push(item.shapeIndex);
                }
            })
            if (deleteArr.length > 0) {
                this._app.actionManager.deleteShape(deleteArr);
            }

            this._regionLayer.removeChild(this._graph);
            if (this._callBack) {
                this._callBack(deleteArr);
            }

        }

    }

    private _changeInteractive(state: boolean) {
        DragHelper(this._app.graphManager.graphContainer, state);
        this._app.graphManager.graphContainer.interactive = state;
        this._shapeLayer.interactiveChildren = state;
    }
}