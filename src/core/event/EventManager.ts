// 绑定传入事件
import EventAPI, { CallbackFunc, Events } from "./EventAPI"
import { ShapeGraphics, LineGraphics, EditEnum, SelectEnum, Point } from "../common/Graph"
import AppInterface from "../app/AppInterface";
import { EventFunc, EventManagerInterface } from "./EventInterface";


class EventAPIManager implements EventAPI {
    protected _events: Events;
    protected _app: AppInterface;
    protected _editState: EditEnum = EditEnum.Nomal;//state change

    onClickGraph(callback: CallbackFunc): void {
        this._events.clickGraph = callback;
        this._bindClickGraph();
    };

    onMouseEnterShape(callback: CallbackFunc): void {
        this._events.mouseEnterShape = callback;
        this._initBindShape(callback, "mouseover");
    };

    onMouseLeaveShape(callback: CallbackFunc): void {
        this._events.mouseLeaveShape = callback;
        this._initBindShape(callback, "mouseout");
    };

    onMouseDownShape(callback: CallbackFunc): void {
        this._events.mouseDownShape = callback;
        this._initBindShape(callback, "pointerdown");
    };

    onMouseUpShape(callback: CallbackFunc): void {
        this._events.mouseUpShape = callback;
        this._initBindShape(callback, "pointerup");
    };

    onMouseDownLine(callback: CallbackFunc): void {
        this._events.mouseDownLine = callback;
        // 初始化的时候没有边
    };
    // 初始化绑定shape
    private _initBindShape(callback: CallbackFunc, event: string) {
        let shapeLayer: PIXI.Container =
            <PIXI.Container>this._app.graphManager.graphContainer.getChildByName("shapeLayer");
        shapeLayer.children.forEach((item: ShapeGraphics, index: number) => {
            item.on(event, this._bindShapeFunc(callback, item));
        })
    }
    // shape的绑定事件的回调
    protected _bindShapeFunc(callback: CallbackFunc, target: ShapeGraphics): Function {
        return (event: PIXI.interaction.InteractionEvent) => {
            callback([target.shapeIndex], {
                x: event.data.global.x,
                y: event.data.global.y,
                target: {
                    xMin: target.xMin,
                    xMax: target.xMax,
                    yMin: target.yMin,
                    yMax: target.yMax
                }
            }, this._editState)
        }
    }
    // line的绑定事件的回调
    protected _bindLineFunc(callback: CallbackFunc, target: LineGraphics): Function {
        let index: number = Number(target.name.substring(5));
        return (event: PIXI.interaction.InteractionEvent) => {
            let startPoint: Point = target.startPoint, endPoint: Point = target.endPoint;
            callback([index], {
                x: event.data.global.x,
                y: event.data.global.y,
                target: {
                    xMin: startPoint[0] < endPoint[0] ? startPoint[0] : endPoint[0],
                    xMax: startPoint[0] > endPoint[0] ? startPoint[0] : endPoint[0],
                    yMin: startPoint[1] < endPoint[1] ? startPoint[1] : endPoint[1],
                    yMax: startPoint[1] > endPoint[1] ? startPoint[1] : endPoint[1]
                }
            }, this._editState)
        }
    }
    // 绑定graph
    protected _bindClickGraph(): void {
        let backgroundLayer: PIXI.Container =
            <PIXI.Container>this._app.graphManager.graphContainer.getChildByName("backgroundLayer");
        backgroundLayer.getChildAt(0).on("click", (event: PIXI.interaction.InteractionEvent) => {
            this._events.clickGraph([], {
                x: event.data.global.x,
                y: event.data.global.y
            }, this._editState)
        })
    };
    // 绑定一个shape的所有事件
    protected _bindShapes() {
        let shapeLayer: PIXI.Container =
            <PIXI.Container>this._app.graphManager.graphContainer.getChildByName("shapeLayer");
        shapeLayer.children.forEach((item: ShapeGraphics, index: number) => {
            this._bindShapeEvents(item);
        })
    }

    protected _bindShapeEvents(item: ShapeGraphics, ) {
        item.on('mouseover', this._bindShapeFunc(this._events.mouseEnterShape, item))
            .on('mouseout', this._bindShapeFunc(this._events.mouseLeaveShape, item))
            .on('pointerdown', this._bindShapeFunc(this._events.mouseDownShape, item))
            .on('pointerup', this._bindShapeFunc(this._events.mouseUpShape, item));
    }

}

export default class EventManager extends EventAPIManager implements EventManagerInterface {
    constructor(app: AppInterface) {
        super();
        this._app = app;
        //初始化_events
        this._events = {
            clickGraph: () => { },
            mouseEnterShape: () => { },
            mouseLeaveShape: () => { },
            mouseDownShape: () => { },
            mouseUpShape: () => { },
            mouseDownLine: () => { },
        }
    }

    setEditState(state: EditEnum): void {
        this._editState = state;
    }

    bindAllHandler(): void {
        //this._bindClickGraph(); // new app的时候graphContainer已经生成
        this._bindShapes();
    }

    bindHandler(selectType: SelectEnum, target: PIXI.Graphics): void {
        switch (selectType) {
            case SelectEnum.Shape:
                this._bindShapeEvents(target);
                break;
            case SelectEnum.Line:
                target.on("pointerdown", this._bindLineFunc(this._events.mouseDownLine, target));
                break;
            default:
                console.error("无法绑定该对象")
        }
    }

}