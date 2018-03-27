import { EditToolInterface, SelectHandler, UpdateHandler } from "./GraphInterface";
import { Shape, ShapeContent, PointGraphics, LineGraphics, ShapeGraphics } from "../common/Graph";
import { SelectEnum } from "../state/StateInterface";
import { buildPoint, buildLine, drawShape } from "./DrawingHelper";
import DragHelper from "./DragHelper";

export default class EditTool implements EditToolInterface {
    private _layer: PIXI.Container;
    private _selectHandler: SelectHandler;
    private _updateHandler: UpdateHandler;
    private _shape: Shape;
    private _content: ShapeContent;
    private _container: PIXI.Container

    constructor(container: PIXI.Container) {
        this._layer = new PIXI.Container();
        this._container = container;
        this._container.addChild(this._layer);
    }

    erasePoints(points: Array<number>): void {

    }

    init(shape: Shape, content: ShapeContent, isDisplay?: boolean): void {
        this.destroy();
        this._shape = shape;
        this._content = content;
        this._drawEditLayer();
    }

    private _drawPoint(index: number) {
        const element = this._shape[index];
        const point = new PointGraphics();
        buildPoint(point, element);
        point.pointIndex = index;
        this._layer.addChild(point);
    }

    private _drawLine(index: number) {
        const startPoint = this._shape[index];
        const line = new LineGraphics();
        const endPoint = (index == this._shape.length - 1) ?
            this._shape[0] : this._shape[index + 1];
        buildLine(line, startPoint, endPoint);
        line.lineIndex = index;
        this._layer.addChild(line);
    }

    private _drawEditLayer() {
        const backShape = new PIXI.Graphics();
        drawShape(backShape, this._shape, this._content);
        this._layer.addChild(backShape);
        
        for (let i = 0; i < this._shape.length; i++) {
            this._drawPoint(i);
            this._drawLine(i);
        }
        addShapeDragHandler(this._layer, () => { });
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
        this._layer.destroy();
        this._layer = new PIXI.Container();
        this._container.addChild(this._layer);
    }
}

function addShapeDragHandler(
    shape: PIXI.Container, handler: { (): void }
) {
    DragHelper(shape);
}

function addPointDragHandler(
    preLine: LineGraphics, point: PointGraphics, nextLine: LineGraphics,
    handler: { (): void }
) {

}

function addLineDragHandler(
    preLine: LineGraphics, prePoint: PointGraphics,
    Line: LineGraphics,
    nextPoint: PointGraphics, nextLine: LineGraphics,
    handler: { (): void }
) {

}
