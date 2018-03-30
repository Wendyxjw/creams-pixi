// 绑定传入事件
import EventAPI, { CallbackFunc, Events } from "./EventAPI"
import { ShapeGraphics, LineGraphics, EditEnum } from "../common/Graph"
import AppInterface from "../app/AppInterface";
import { EventFunc, EventManagerInterface } from "./EventInterface";


class EventAPIManager implements EventAPI {
    protected _events: Events;

    onClickGraph(callback: CallbackFunc): void {
        this._events.clickGraph = callback;
    };

    onMouseEnterShape(callback: CallbackFunc): void {
        this._events.mouseEnterShape = callback;
    };

    onMouseLeaveShape(callback: CallbackFunc): void {
        this._events.mouseLeaveShape = callback;
    };

    onMouseMoveShape(callback: CallbackFunc): void {
        this._events.mouseMoveShape = callback;
    };

    onMouseDownShape(callback: CallbackFunc): void {
        this._events.mouseDownShape = callback;
    };

    onMouseUpShape(callback: CallbackFunc): void {
        this._events.mouseUpShape = callback;
    };

    onMouseDownLine(callback: CallbackFunc): void {
        this._events.mouseDownLine = callback;
    };

    onMouseUpLine(callback: CallbackFunc): void {
        this._events.mouseUpLine = callback;
    };

    onMouseDownPoint(callback: CallbackFunc): void {
        this._events.mouseDownPoint = callback;
    };

    onMouseUpPoint(callback: CallbackFunc): void {
        this._events.mouseUpPoint = callback;
    };
}

export default class EventManager extends EventAPIManager implements EventManagerInterface {
    private _app: AppInterface;

    constructor(app: AppInterface) {
        super();
        this._app = app;
        //初始化_events
        this._events = {
            clickGraph: () => { },
            mouseEnterShape: () => { },
            mouseLeaveShape: () => { },
            mouseMoveShape: () => { },
            mouseDownShape: () => { },
            mouseUpShape: () => { },
            mouseDownLine: () => { },
            mouseUpLine: () => { },
            mouseDownPoint: () => { },
            mouseUpPoint: () => { }
        }
    }

    bindClickGraph(editType: EditEnum): void {
        let func: EventFunc = (event: PIXI.interaction.InteractionEvent) => {
            this._events.clickGraph([], {
                x: event.data.global.x,
                y: event.data.global.y,
                editType: editType
            })
        }
        this._app.graphManager.graphContainer.off("click", func).on("click", func);
    }

    bindMouseEnterShape(editType: EditEnum): void {
        let shapeLayer: PIXI.Container = <PIXI.Container>this._app.graphManager.graphContainer.getChildByName("shapeLayer");
        shapeLayer.children.forEach((item: ShapeGraphics, index: number) => {
            let func: EventFunc = (event: PIXI.interaction.InteractionEvent) => {
                this._events.mouseEnterShape([item.shapeIndex], {
                    x: event.data.global.x,
                    y: event.data.global.y,
                    editType: editType
                })
            }
            item.off('mouseover', func).on('mouseover', func);
        })
    };

    bindMouseLeaveShape(editType: EditEnum): void {
        let shapeLayer: PIXI.Container = <PIXI.Container>this._app.graphManager.graphContainer.getChildByName("shapeLayer");
        shapeLayer.children.forEach((item: ShapeGraphics, index: number) => {
            let func: EventFunc = (event: PIXI.interaction.InteractionEvent) => {
                this._events.mouseLeaveShape([item.shapeIndex], {
                    x: event.data.global.x,
                    y: event.data.global.y,
                    editType: editType
                })
            }
            item.off('mouseout', func).on('mouseout', func);
        })
    };

    bindMouseMoveShape(editType: EditEnum): void {
        let shapeLayer: PIXI.Container = <PIXI.Container>this._app.graphManager.graphContainer.getChildByName("shapeLayer");
        shapeLayer.children.forEach((item: ShapeGraphics, index: number) => {
            let func: EventFunc = (event: PIXI.interaction.InteractionEvent) => {
                this._events.mouseMoveShape([item.shapeIndex], {
                    x: event.data.global.x,
                    y: event.data.global.y,
                    editType: editType
                })
            }
            item.off('mousemove', func).on('mousemove', func);
        })
    };

    bindMouseDownShape(editType: EditEnum): void {
        let shapeLayer: PIXI.Container = <PIXI.Container>this._app.graphManager.graphContainer.getChildByName("shapeLayer");
        shapeLayer.children.forEach((item: ShapeGraphics, index: number) => {
            let func: EventFunc = (event: PIXI.interaction.InteractionEvent) => {
                this._events.mouseDownShape([item.shapeIndex], {
                    x: event.data.global.x,
                    y: event.data.global.y,
                    editType: editType
                })
            }
            item.off('mousedown', func).on('mousedown', func);
        })
    };

    //extraLayer： pointerdown的时候shapeLayer的时候出现extraLayer生成editShape
    bindMouseUpShape(editType: EditEnum): void {
        let shapeLayer: PIXI.Container = <PIXI.Container>this._app.graphManager.graphContainer.getChildByName("shapeLayer");
        shapeLayer.children.forEach((item: ShapeGraphics, index: number) => {
            let func: EventFunc = (event: PIXI.interaction.InteractionEvent) => {
                this._events.mouseUpShape([item.shapeIndex], {
                    x: event.data.global.x,
                    y: event.data.global.y,
                    editType: editType
                })
            }
            item.off("mouseup", func).on("mouseup", func);
            let extraLayer: PIXI.Container = <PIXI.Container>this._app.graphManager.graphContainer.getChildByName("extraLayer");
            let layer: PIXI.Container = <PIXI.Container>extraLayer.children[0];
            let curGraph: ShapeGraphics = <ShapeGraphics>layer.getChildByName("editShape");
            curGraph.off("mouseup", func).on("mouseup", func);

        })
    };

    //shapeLayer的shape pointerdown 才会有line point
    bindMouseDownLine(editType: EditEnum): void {
        this._app.graphManager.graphContainer.getChildByName("shapeLayer").on("mouseup", () => {
            let extraLayer: PIXI.Container = <PIXI.Container>this._app.graphManager.graphContainer.getChildByName("extraLayer");
            let layer: PIXI.Container = <PIXI.Container>extraLayer.children[0];
            layer.children.forEach((item: LineGraphics, inedex: number) => {
                let func: EventFunc = (event: PIXI.interaction.InteractionEvent) => {
                    let index: number = Number(item.name.substring(5));
                    this._events.mouseDownLine([index], {
                        x: event.data.global.x,
                        y: event.data.global.y,
                        editType: editType
                    })
                }
                if (item.name.indexOf("line") > -1) {
                    item.off("mousedown", func).on("mousedown", func);
                }
            })
        })
    };

    bindMouseUpLine(editType: EditEnum): void {
        this._app.graphManager.graphContainer.getChildByName("shapeLayer").on("mouseup", () => {
            let extraLayer: PIXI.Container = <PIXI.Container>this._app.graphManager.graphContainer.getChildByName("extraLayer");
            let layer: PIXI.Container = <PIXI.Container>extraLayer.children[0];
            layer.children.forEach((item: LineGraphics, inedex: number) => {
                let func: EventFunc = (event: PIXI.interaction.InteractionEvent) => {
                    let index: number = Number(item.name.substring(5));
                    this._events.mouseUpLine([index], {
                        x: event.data.global.x,
                        y: event.data.global.y,
                        editType: editType
                    })
                }
                if (item.name.indexOf("line") > -1) {
                    item.on("mouseup", func);
                }
            })
        })
    };

    bindMouseDownPoint(editType: EditEnum): void {
        this._app.graphManager.graphContainer.getChildByName("shapeLayer").on("mouseup", () => {
            let extraLayer: PIXI.Container = <PIXI.Container>this._app.graphManager.graphContainer.getChildByName("extraLayer");
            let layer: PIXI.Container = <PIXI.Container>extraLayer.children[0];
            layer.children.forEach((item: LineGraphics, inedex: number) => {
                let func: EventFunc = (event: PIXI.interaction.InteractionEvent) => {
                    let index: number = Number(item.name.substring(5));
                    this._events.mouseDownPoint([index], {
                        x: event.data.global.x,
                        y: event.data.global.y,
                        editType: editType
                    })
                }
                if (item.name.indexOf("point") > -1) {
                    item.on("mousedown", func);
                }
            })
        })
    };

    bindMouseUpPoint(editType: EditEnum): void {
        this._app.graphManager.graphContainer.getChildByName("shapeLayer").on("mouseup", () => {
            let extraLayer: PIXI.Container = <PIXI.Container>this._app.graphManager.graphContainer.getChildByName("extraLayer");
            let layer: PIXI.Container = <PIXI.Container>extraLayer.children[0];
            layer.children.forEach((item: LineGraphics, inedex: number) => {
                let func: EventFunc = (event: PIXI.interaction.InteractionEvent) => {
                    let index: number = Number(item.name.substring(5));
                    this._events.mouseUpPoint([index], {
                        x: event.data.global.x,
                        y: event.data.global.y,
                        editType: editType
                    })
                }
                if (item.name.indexOf("point") > -1) {
                    item.on("mouseup", func);
                }
            })
        })
    };
}