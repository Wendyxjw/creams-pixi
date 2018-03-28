// 绑定传入事件
import EventAPI, { CallbackFunc } from "./EventAPI"
import { ShapeGraphics, LineGraphics } from "../common/Graph"
import AppInterface from "../app/AppInterface";

export default class EventManager implements EventAPI {
    private _app: AppInterface;

    constructor(app: AppInterface) {
        this._app = app;
    }
    //点击最外面的一层Container
    onClickGraph(callback: CallbackFunc): void {
        this._app.graphManager.graphContainer.on("click", (event: PIXI.interaction.InteractionEvent) => {
            callback([], {
                x: event.data.global.x,//触发事件位置
                y: event.data.global.y
            })
        })
    };
    //shapeLayer
    onMouseEnterShape(callback: CallbackFunc): void {
        let shapeLayer: PIXI.Container = <PIXI.Container>this._app.graphManager.graphContainer.getChildByName("shapeLayer");
        shapeLayer.children.forEach((item: ShapeGraphics, index: number) => {
            item.on('mouseover', (event: PIXI.interaction.InteractionEvent) => {
                callback([item.shapeIndex], {
                    x: event.data.global.x,//触发事件位置
                    y: event.data.global.y
                })
            })
        })
    };
    //shapeLayer
    onMouseLeaveShape(callback: CallbackFunc): void {
        let shapeLayer: PIXI.Container = <PIXI.Container>this._app.graphManager.graphContainer.getChildByName("shapeLayer");
        shapeLayer.children.forEach((item: ShapeGraphics, index: number) => {
            item.on('mouseout', (event: PIXI.interaction.InteractionEvent) => {
                callback([item.shapeIndex], {
                    x: event.data.global.x,//触发事件位置
                    y: event.data.global.y
                })
            })
        })
    };
    //shapeLayer
    onMouseMoveShape(callback: CallbackFunc): void {
        let shapeLayer: PIXI.Container = <PIXI.Container>this._app.graphManager.graphContainer.getChildByName("shapeLayer");
        shapeLayer.children.forEach((item: ShapeGraphics, index: number) => {
            item.on('mousemove', (event: PIXI.interaction.InteractionEvent) => {
                callback([item.shapeIndex], {
                    x: event.data.global.x,//触发事件位置
                    y: event.data.global.y
                })
            })
        })
    };
    //shapeLayer
    onMouseDownShape(callback: CallbackFunc): void {
        let shapeLayer: PIXI.Container = <PIXI.Container>this._app.graphManager.graphContainer.getChildByName("shapeLayer");
        shapeLayer.children.forEach((item: ShapeGraphics, index: number) => {
            item.on('mousedown', (event: PIXI.interaction.InteractionEvent) => {
                callback([item.shapeIndex], {
                    x: event.data.global.x,//触发事件位置
                    y: event.data.global.y
                })
            })
        })
    };

    //extraLayer： pointerdown的时候shapeLayer的时候出现extraLayer生成editShape
    onMouseUpShape(callback: CallbackFunc): void {
        this._app.graphManager.graphContainer.getChildByName("extraLayer").on("mouseup", (event: PIXI.interaction.InteractionEvent) => {
            let currentTarget: PIXI.Container = <PIXI.Container>event.currentTarget;
            let curContainer: PIXI.Container = <PIXI.Container>currentTarget.children[0];
            let curGraph: ShapeGraphics = <ShapeGraphics>curContainer.getChildByName("editShape");
            callback([curGraph.shapeIndex], {
                x: event.data.global.x,//触发事件位置
                y: event.data.global.y
            })
            curGraph.on("mouseup", (e: PIXI.interaction.InteractionEvent) => {
                callback([curGraph.shapeIndex], {
                    x: e.data.global.x,//触发事件位置
                    y: e.data.global.y
                })
            })
        })
    };

    //shapeLayer的shape pointerdown 才会有line point
    onMouseDownLine(callback: CallbackFunc): void {
        this._app.graphManager.graphContainer.getChildByName("shapeLayer").on("mouseup", () => {
            let extraLayer: PIXI.Container = <PIXI.Container>this._app.graphManager.graphContainer.getChildByName("extraLayer");
            let layer: PIXI.Container = <PIXI.Container>extraLayer.children[0];
            layer.children.forEach((item: LineGraphics, inedex: number) => {
                if (item.name.indexOf("line") > -1) {
                    item.on("mousedown", (event: PIXI.interaction.InteractionEvent) => {
                        let index: number = Number(item.name.substring(5));
                        callback([index], {
                            x: event.data.global.x,
                            y: event.data.global.y
                        })
                    })
                }
            })
        })
    };

    onMouseUpLine(callback: CallbackFunc): void {
        this._app.graphManager.graphContainer.getChildByName("shapeLayer").on("mouseup", () => {
            let extraLayer: PIXI.Container = <PIXI.Container>this._app.graphManager.graphContainer.getChildByName("extraLayer");
            let layer: PIXI.Container = <PIXI.Container>extraLayer.children[0];
            layer.children.forEach((item: LineGraphics, inedex: number) => {
                if (item.name.indexOf("line") > -1) {
                    item.on("mouseup", (event: PIXI.interaction.InteractionEvent) => {
                        let index: number = Number(item.name.substring(5));
                        callback([index], {
                            x: event.data.global.x,
                            y: event.data.global.y
                        })
                    })
                }
            })
        })
    };

    onMouseDownPoint(callback: CallbackFunc): void {
        this._app.graphManager.graphContainer.getChildByName("shapeLayer").on("mouseup", () => {
            let extraLayer: PIXI.Container = <PIXI.Container>this._app.graphManager.graphContainer.getChildByName("extraLayer");
            let layer: PIXI.Container = <PIXI.Container>extraLayer.children[0];
            layer.children.forEach((item: LineGraphics, inedex: number) => {
                if (item.name.indexOf("point") > -1) {
                    item.on("mousedown", (event: PIXI.interaction.InteractionEvent) => {
                        let index: number = Number(item.name.substring(5));
                        callback([index], {
                            x: event.data.global.x,
                            y: event.data.global.y
                        })
                    })
                }
            })
        })
    };

    onMouseUpPoint(callback: CallbackFunc): void {
        this._app.graphManager.graphContainer.getChildByName("shapeLayer").on("mouseup", () => {
            let extraLayer: PIXI.Container = <PIXI.Container>this._app.graphManager.graphContainer.getChildByName("extraLayer");
            let layer: PIXI.Container = <PIXI.Container>extraLayer.children[0];
            layer.children.forEach((item: LineGraphics, inedex: number) => {
                if (item.name.indexOf("point") > -1) {
                    item.on("mouseup", (event: PIXI.interaction.InteractionEvent) => {
                        let index: number = Number(item.name.substring(5));
                        callback([index], {
                            x: event.data.global.x,
                            y: event.data.global.y
                        })
                    })
                }
            })
        })
    };
}