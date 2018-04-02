import { EditToolInterface, SelectHandler, UpdateHandler } from "./GraphInterface";
import { Shape, ShapeContent, PointGraphics, LineGraphics, ShapeGraphics, Point, SelectEnum } from "../common/Graph";
import { buildPoint, buildLine, drawShape } from "./DrawingHelper";
import DragHelper, { DragableObj } from "./DragHelper";
import AppInterface from "../app/AppInterface";

export default class EditTool implements EditToolInterface {
    private _layer: PIXI.Container; // 编辑层，负责拖拽
    private _backShape: ShapeGraphics; // 背景
    private _pointLayer: PIXI.Container; // 点层
    private _lineLayer: PIXI.Container; // 线层
    private _selectHandler: SelectHandler;
    private _updateHandler: UpdateHandler;
    private _shape: Shape;
    private _content: ShapeContent;
    private _container: PIXI.Container;

    constructor(container: PIXI.Container) {
        this._container = container;
        this._buildLayer();
    }

    private _buildLayer() {
        this._backShape = new ShapeGraphics();
        this._pointLayer = new PIXI.Container();
        this._pointLayer.name = "pointLayer";
        this._lineLayer = new PIXI.Container();
        this._lineLayer.name = "lineLayer";
        this._layer = new PIXI.Container();
        this._layer.addChild(this._backShape);
        this._layer.addChild(this._lineLayer);
        this._layer.addChild(this._pointLayer);
        this._container.addChild(this._layer);
    }

    erasePoints(points: Array<number>): void {
        let newShape: Shape = this._shape;
        points.forEach(item => {
            newShape[item] = null;
        });
        newShape = newShape.filter(function (n) { return n !== null });
        this.init(newShape, this._content);
        this._updateHandler(newShape);
    }

    init(shape: Shape, content: ShapeContent, isDisplay?: boolean): void {
        this.destroy();
        this._shape = shape;
        this._content = content;
        if (isDisplay) {
            drawShape(this._backShape, this._shape, this._content);
        } else {
            this._drawEditLayer();
        }
    }

    private _drawPoint(index: number) {
        const element = this._shape[index];
        const point = new PointGraphics();
        buildPoint(point, element);
        this._pointLayer.addChild(point);
        point.pointIndex = index;
        point.name = `point_${index}`;
        point.interactive = true;
        point.on('pointerdown', () => {
            this._selectHandler(SelectEnum.Point, index);
        });
        DragHelper(point);
    }

    private _drawLine(index: number) {
        const startPoint = this._shape[index];
        const line = new LineGraphics();
        const endPoint = (index == this._shape.length - 1) ?
            this._shape[0] : this._shape[index + 1];
        buildLine(line, startPoint, endPoint);
        this._lineLayer.addChild(line);
        line.lineIndex = index;
        line.name = `line_${index}`;
        line.interactive = true;
        line.on('pointerdown', () => {
            this._selectHandler(SelectEnum.Line, index);
        });
        DragHelper(line);
    }

    private _drawBackShape() {
        const backShape = this._backShape;
        drawShape(backShape, this._shape, this._content);
        backShape.name = "editShape";
        backShape.interactive = true;
        backShape.on('pointerdown', () => {
            this._selectHandler(SelectEnum.Shape);
        });
        this._layer.addChildAt(backShape, 0);
    }

    private _drawEditLayer() {
        this._drawBackShape();
        for (let i = 0; i < this._shape.length; i++) {
            this._drawPoint(i);
            this._drawLine(i);
        }
        addShapeDragHandler(this._layer, (startPoint: PIXI.Point, endPoint: PIXI.Point) => {
            if ((startPoint.x !== endPoint.x) || (startPoint.y != endPoint.y)) {
                let x = endPoint.x - startPoint.x;
                let y = endPoint.y - startPoint.y;
                let newShape: Shape = [];
                this._shape.forEach((item, i) => {
                    newShape.push([Math.round(item[0] + x), Math.round(item[1] + y)]);
                });
                this._updateHandler(newShape);
                this._shape = newShape;
            }
        });
    }

    addSelectHandler(handler: SelectHandler): void {
        this._selectHandler = handler;
    }

    addUpdateHandler(handler: UpdateHandler): void {
        this._updateHandler = handler;
    }

    addPoint(lineIndex: number): void {
        let newShape: Shape = this._shape;
        let pre = newShape[lineIndex];
        let next = newShape[lineIndex === (newShape.length - 1) ? 0 : (lineIndex + 1)];
        let newPoint = [
            Math.round((next[0] - pre[0]) / 2),
            Math.round((next[1] - pre[1]) / 2)
        ];
        newShape.splice(lineIndex, 0, <Point>newPoint);
        this.init(newShape, this._content);
        this._updateHandler(newShape);
        this.select(SelectEnum.Point, lineIndex + 1);
    }

    select(type: SelectEnum, index: number): void {
        let targetIndex: number;
        let preIndex: number;
        let nextIndex: number;
        let preLine: LineGraphics;
        let prePoint: PointGraphics;
        let nextPoint: PointGraphics;
        let nextLine: LineGraphics;
        this._layer.interactive = false;
        switch (type) {
            case SelectEnum.Point:
                const targetPoint = <PointGraphics>this._pointLayer.getChildByName(`point_${index}`);
                // 只关心在layer里面的队形，不关心name里的index
                targetIndex = this._pointLayer.getChildIndex(targetPoint);
                preIndex = targetIndex === 0 ? (this._pointLayer.children.length - 1) : (targetIndex - 1);
                preLine = <LineGraphics>this._lineLayer.getChildAt(preIndex);
                nextLine = <LineGraphics>this._lineLayer.getChildAt(targetIndex);
                addPointDragHandler(preLine, targetPoint, nextLine, (point: Point) => {
                    this._shape[targetPoint.pointIndex] = point;
                    drawShape(this._backShape.clear(), this._shape, this._content);
                    this._updateHandler(this._shape);
                });
                break;
            case SelectEnum.Line:
                const targetLine = <LineGraphics>this._lineLayer.getChildByName(`line_${index}`);
                // 只关心在layer里面的队形，不关心name里的index
                targetIndex = this._lineLayer.getChildIndex(targetLine);
                preIndex = targetIndex === 0 ? (this._lineLayer.children.length - 1) : (targetIndex - 1);
                nextIndex = targetIndex === (this._lineLayer.children.length - 1) ? 0 : (targetIndex + 1);
                preLine = <LineGraphics>this._lineLayer.getChildAt(preIndex);
                prePoint = <PointGraphics>this._pointLayer.getChildAt(targetIndex);
                nextPoint = <PointGraphics>this._pointLayer.getChildAt(nextIndex);
                nextLine = <LineGraphics>this._lineLayer.getChildAt(nextIndex);
                addLineDragHandler(preLine, prePoint, targetLine, nextPoint, nextLine,
                    (pP: Point, nP: Point) => {
                        this._shape[prePoint.pointIndex] = pP;
                        this._shape[nextPoint.pointIndex] = nP;
                        drawShape(this._backShape.clear(), this._shape, this._content);
                        this._updateHandler(this._shape);
                    }
                );
                break;
            case SelectEnum.Shape:
                this._layer.interactive = true;
            default:
                break;
        }
    }

    destroy(): void {
        this._layer.destroy(true);
        this._buildLayer();
    }
}

function addShapeDragHandler(
    shape: PIXI.Container, handler: { (startPoint: PIXI.Point, endPoint: PIXI.Point): void }
) {
    DragHelper(shape);
    let startPoint: PIXI.Point = new PIXI.Point();
    let endPoint: PIXI.Point = new PIXI.Point();
    shape.on("pointerdown", () => {
        startPoint.copy(shape.position);
    }).on("pointerup", () => {
        endPoint.copy(shape.position);
        handler(startPoint, endPoint);
    });
}

function addPointDragHandler(
    preLine: LineGraphics, point: PointGraphics, nextLine: LineGraphics,
    handler: { (point: Point): void }
) {
    const onDragMove = function () {
        const preLineStart = preLine.startPoint;
        preLine.clear();
        buildLine(preLine, preLineStart, [point.x, point.y]);
        const nextLineEnd = nextLine.endPoint;
        nextLine.clear();
        buildLine(nextLine, [point.x, point.y], nextLineEnd);
    }
    const onDragEnd = function () {
        handler([
            Math.round(point.x),
            Math.round(point.y)
        ]);
        point.off('pointermove', onDragMove)
            .off('pointerup', onDragEnd)
            .off('pointerupoutside', onDragEnd)
    }
    point.on('pointermove', onDragMove)
        .on('pointerup', onDragEnd)
        .on('pointerupoutside', onDragEnd)
}

function addLineDragHandler(
    preLine: LineGraphics, prePoint: PointGraphics,
    line: LineGraphics,
    nextPoint: PointGraphics, nextLine: LineGraphics,
    handler: { (point: Point, nextPoint: Point): void }
) {
    let pPoint = <DragableObj>prePoint;
    pPoint.dragObjStart = new PIXI.Point();
    pPoint.dragObjStart.copy(pPoint.position);
    let nPoint = <DragableObj>nextPoint;
    nPoint.dragObjStart = new PIXI.Point();
    nPoint.dragObjStart.copy(nPoint.position);

    const onDragMove = function () {
        const dLine = <DragableObj>line;
        const dx = dLine.x - dLine.dragObjStart.x;
        const dy = dLine.y - dLine.dragObjStart.y;
        prePoint.x = dx + pPoint.dragObjStart.x;
        prePoint.y = dy + pPoint.dragObjStart.y;
        nextPoint.x = dx + nPoint.dragObjStart.x;
        nextPoint.y = dy + nPoint.dragObjStart.y;

        const preLineStart = preLine.startPoint;
        preLine.clear();
        buildLine(preLine, preLineStart, [prePoint.x, prePoint.y]);
        const nextLineEnd = nextLine.endPoint;
        nextLine.clear();
        buildLine(nextLine, [nextPoint.x, nextPoint.y], nextLineEnd);
    }
    const onDragEnd = function () {
        line.clear();
        line.x = 0;
        line.y = 0;
        const pP: Point = [
            Math.round(prePoint.x),
            Math.round(prePoint.y)
        ];
        const nP: Point = [
            Math.round(nextPoint.x),
            Math.round(nextPoint.y)
        ];
        buildLine(line, pP, nP);
        handler(pP, nP);
        line.off('pointermove', onDragMove)
            .off('pointerup', onDragEnd)
            .off('pointerupoutside', onDragEnd)
    }
    line.on('pointermove', onDragMove)
        .on('pointerup', onDragEnd)
        .on('pointerupoutside', onDragEnd)
}
