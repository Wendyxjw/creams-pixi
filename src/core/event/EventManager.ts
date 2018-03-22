// 绑定传入事件
import { EventAPI, CallbackFunc } from "./EventInterface"
import App from "../app/App";
import { GraphWithIndexType } from "../common/Graph"

export default class EventManager implements EventAPI {
    private _app: App;

    constructor(app: App) {
        this._app = app;
    }

    onClickGraph(callback: CallbackFunc): void {
        this._app.graphManager._graphContainer.on("click", (event) => {
            //console.log(event)
            callback([], {
                x: event.data.global.x,//触发事件位置
                y: event.data.global.y
            })
        })
    };

    onMouseEnterShape(callback: CallbackFunc): void {
        this._app.graphManager._graphContainer.children.forEach((item: GraphWithIndexType, index: number) => {
            //console.log(item)
            if (item.shapeIndex) {
                item.on('mouseover', (event) => {
                    callback([item.shapeIndex], {
                        x: event.data.global.x,//触发事件位置
                        y: event.data.global.y
                    })
                })
            }
        })
    };

    onMouseLeaveShape(callback: CallbackFunc): void { };

    onMouseDownShape(callback: CallbackFunc): void { };

    onMouseUpShape(callback: CallbackFunc): void {
        this._app.graphManager._graphContainer.children.forEach((item: GraphWithIndexType, index: number) => {
            //console.log(item)
            if (item.shapeIndex) {
                item.on('mouseup', (event) => {
                    callback([item.shapeIndex], {
                        x: event.data.global.x,//触发事件位置
                        y: event.data.global.y
                    })
                })
            }
        })
    };

    onMouseDownLine(callback: CallbackFunc): void { };

    onMouseUpLine(callback: CallbackFunc): void { };

    onMouseDownPoint(callback: CallbackFunc): void { };

    onMouseUpPoint(callback: CallbackFunc): void { };
}