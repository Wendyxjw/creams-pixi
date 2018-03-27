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
        point.name = `point_${index}`;
        point.interactive = true;
        point.on('pointerdown', () => {
            this._selectHandler(SelectEnum.Point, index);
        })
        this._layer.addChild(point);
    }

    private _drawLine(index: number) {
        const startPoint = this._shape[index];
        const line = new LineGraphics();
        const endPoint = (index == this._shape.length - 1) ?
            this._shape[0] : this._shape[index + 1];
        buildLine(line, startPoint, endPoint);
        line.lineIndex = index;
        line.name = `line_${index}`;
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
        switch (type) {
            case SelectEnum.Point:
                const targetPoint = <PointGraphics>this._layer.getChildByName(`point_${index}`);
                // 只关心在layer里面的队形，不关心name里的index
                const targetIndex = this._layer.getChildIndex(targetPoint);
                const preLine = <LineGraphics>this._layer.getChildAt(targetIndex - 1);
                const nextLine = <LineGraphics>this._layer.getChildAt(targetIndex + 1);
                addPointDragHandler(preLine, targetPoint, nextLine, ()=>{});
                break;
        
            default:
                break;
        }
        
        
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
    // DragHelper(shape);
}

function addPointDragHandler(
    preLine: LineGraphics, point: PointGraphics, nextLine: LineGraphics,
    handler: { (): void }
) {
    DragHelper(point);
    point.on('pointermove', () => {
        const preLineStart = preLine.startPoint;
        preLine.clear();
        buildLine(preLine, preLineStart, [point.x, point.y]);
        const nextLineEnd = nextLine.endPoint;
        nextLine.clear();
        buildLine(nextLine, [point.x, point.y], nextLineEnd);
    })
}

function addLineDragHandler(
    preLine: LineGraphics, prePoint: PointGraphics,
    Line: LineGraphics,
    nextPoint: PointGraphics, nextLine: LineGraphics,
    handler: { (): void }
) {

}
