import { EditToolInterface, SelectHandler, UpdateHandler } from "./GraphInterface";
import { Shape, ShapeContent, PointGraphics, LineGraphics } from "../common/Graph";
import { SelectEnum } from "../state/StateInterface";
import { buildPoint, buildLine } from "./DrawingHelper";

export default class EditTool implements EditToolInterface {
    private _layer: PIXI.Container;
    private _selectHandler: SelectHandler;
    private _updateHandler: UpdateHandler;
    private _shape: Shape;
    private _content: ShapeContent;

    constructor(layer: PIXI.Container) {
        this._layer = layer;
    }

    erasePoints(points: Array<number>): void {

    }

    init(shape: Shape, content: ShapeContent, isDisplay?: boolean): void {
        this._shape = shape;
        this._content = content;
        this._drawEditLayer();
    }

    private _drawEditLayer() {
        this._shape.forEach((item, i) => {
            // draw Point
            const point = new PointGraphics();
            buildPoint(point, item);
            point.pointIndex = i;
            this._layer.addChild(point);

            // draw Line
            const line = new LineGraphics();
            const endPoint = (i == this._shape.length - 1) ?
                this._shape[0] : this._shape[i + 1];
            buildLine(line, item, endPoint);
            line.lineIndex = i;
            this._layer.addChild(line);
        })
    }

    addSelectHandler(handler: SelectHandler): void {
        this._selectHandler = handler;
    }

    addUpdateHandler(handler: UpdateHandler): void {
        this._updateHandler = handler;
    }

    select(type: SelectEnum, index: number): void {
        
    }

    destroy(): void {

    }
}
