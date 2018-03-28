import { EditToolInterface, SelectHandler, UpdateHandler } from "./GraphInterface";
import { Shape, ShapeContent, PointGraphics, LineGraphics, ShapeGraphics, Point } from "../common/Graph";
import { SelectEnum } from "../state/StateInterface";
import { buildPoint, buildLine, drawShape } from "./DrawingHelper";
import DragHelper from "./DragHelper";
import AppInterface from "../app/AppInterface";

export default class EditTool implements EditToolInterface {
    private _layer: PIXI.Container;
    private _selectHandler: SelectHandler;
    private _updateHandler: UpdateHandler;
    private _shape: Shape;
    private _content: ShapeContent;
    private _container: PIXI.Container;
    private _app: AppInterface;
    private _shapeIndex: number;

    constructor(container: PIXI.Container, action: AppInterface) {
        this._layer = new PIXI.Container();
        this._container = container;
        this._container.addChild(this._layer);
        this._app = action;
    }

    erasePoints(points: Array<number>): void {

    }

    init(shape: Shape, content: ShapeContent, shapeIndex: number, isDisplay?: boolean): void {
        this.destroy();
        this._shape = shape;
        this._content = content;
        this._shapeIndex = shapeIndex;
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
        let startPoint: PIXI.Point;
        this._layer.on('pointerup', (event: PIXI.interaction.InteractionEvent) => {
            startPoint = new PIXI.Point();
            startPoint.copy(event.data.global);
        }).on("pointerdown", (event: PIXI.interaction.InteractionEvent) => {
            this._updateShape(startPoint, event.data.global);
        })
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

    //updateshape
    private _updateShape(startPoint: PIXI.Point, endPoint: PIXI.Point) {
        if (startPoint !== endPoint) {
            let x = endPoint.x - startPoint.x;
            let y = endPoint.y - startPoint.y;
            let newShape: Shape = [];
            this._shape.forEach((item, i) => {
                newShape.push([item[0] + x, item[1] + y]);
            })
            this._app.actionManager.updateShape(newShape, this._shapeIndex);
        }
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
