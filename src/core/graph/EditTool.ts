/*
 * @Author: xujiawen 
 * @Description: 编辑层
 * @Date: 2018-04-26 11:02:08 
 * @Last Modified by: xujiawen
 * @Last Modified time: 2018-04-28 17:48:08
 */

import { EditToolInterface, SelectHandler, UpdateHandler } from "./GraphInterface";
import { Shape, ShapeContent, PointGraphics, LineGraphics, ShapeGraphics, Point, SelectEnum } from "../common/Graph";
import { buildPoint, buildLine, drawShape } from "./DrawingHelper";
import DragHelper, { DragableObj } from "./DragHelper";
import AppInterface from "../app/AppInterface";
import { defultGraphStyle } from "./constant";

type Highlight = boolean | {
    select: SelectEnum,
    index: number
}

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
        this._layer.name = "editLayer";
        this._container.addChild(this._layer);
    }

    erasePoints(): Function {
        return (points: Array<number>) => {
            let newShape: Shape = this._shape;
            points.forEach(item => {
                newShape[item] = null;
            });
            newShape = newShape.filter(function (n) { return n !== null });
            this.init(newShape, this._content);
            this.select(SelectEnum.Shape);
            this._updateHandler(newShape);
        }
    }

    init(shape: Shape, content: ShapeContent, isDisplay?: boolean): void {
        this.destroy();
        this._shape = shape;
        this._content = content ? content : JSON.parse(JSON.stringify(defultGraphStyle));
        this._content.backgroundAlpha = 1;
        if (isDisplay) {
            this._drawBackShape(true);
        } else {
            this._drawEditLayer(true, false);
        }
    }

    private _drawPoint(index: number, isInit: boolean, isHighlight: Highlight) {
        const element = this._shape[index];
        let point: PointGraphics;
        if (isInit) {
            point = new PointGraphics();
            point.pointIndex = index;
            point.name = `point_${index}`;
            this._pointLayer.addChild(point);
            point.interactive = true;
            this._selectHandler(point, SelectEnum.Point, index);
            DragHelper(point);
        } else {
            point = <PointGraphics>this._pointLayer.getChildByName(`point_${index}`);
            point.clear();
        }
        if (typeof isHighlight === 'boolean') {
            point.isHighlight = isHighlight;
        } else {
            point.isHighlight = isHighlight.select === SelectEnum.Point
                && isHighlight.index === point.pointIndex;
        }
        buildPoint(point, element);
    }

    private _drawLine(index: number, isInit: boolean, isHighlight: Highlight) {
        const startPoint = this._shape[index];
        const endPoint = (index == this._shape.length - 1) ?
            this._shape[0] : this._shape[index + 1];
        let line: LineGraphics;
        if (isInit) {
            line = new LineGraphics();
            line.lineIndex = index;
            line.name = `line_${index}`;
            this._lineLayer.addChild(line);
            line.interactive = true;
            this._selectHandler(line, SelectEnum.Line, index);
            DragHelper(line);
        } else {
            line = <LineGraphics>this._lineLayer.getChildByName(`line_${index}`);
            line.clear();
        }
        if (typeof isHighlight === 'boolean') {
            line.isHighlight = isHighlight;
        } else {
            line.isHighlight = isHighlight.select === SelectEnum.Line
                && isHighlight.index === line.lineIndex;
        }
        buildLine(line, startPoint, endPoint);
    }

    private _drawBackShape(isInit: boolean) {
        const backShape = this._backShape;
        if (isInit) {
            backShape.name = "editShape";
            backShape.interactive = true;
            this._selectHandler(backShape, SelectEnum.Shape);
            this._layer.addChildAt(backShape, 0);
        } else {
            backShape.clear();
        }
        let con = JSON.parse(JSON.stringify(this._content))
        con.backgroundAlpha = 0.8;
        let parent: PIXI.Container = this._container.parent;
        drawShape(backShape, this._shape, parent.scale.x, con);
    }

    private _drawEditLayer(isInit: boolean, isHighlight: Highlight) {
        this._drawBackShape(isInit);
        // 删除null 测试出现的bug：原因估计是项目代码更新时造成的，理应不出现null
        this._shape = this._shape.filter(function (n) { return n !== null });
        for (let i = 0; i < this._shape.length; i++) {
            this._drawPoint(i, isInit, isHighlight);
            this._drawLine(i, isInit, isHighlight);
        }
        if (isInit) {
            DragHelper(this._layer);
        }
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
            Math.round((next[0] + pre[0]) / 2),
            Math.round((next[1] + pre[1]) / 2)
        ];
        newShape.splice(lineIndex + 1, 0, <Point>newPoint);
        this.init(newShape, this._content);
        this._updateHandler(newShape);
        this.select(SelectEnum.Point, lineIndex + 1);
    }

    select(select: SelectEnum, index?: number): void {
        let targetIndex: number;
        let preIndex: number;
        let nextIndex: number;
        let preLine: LineGraphics;
        let prePoint: PointGraphics;
        let nextPoint: PointGraphics;
        let nextLine: LineGraphics;
        this._layer.interactive = false;
        switch (select) {
            case SelectEnum.Point:
                this._drawEditLayer(false, { select, index });
                const targetPoint = <PointGraphics>this._pointLayer.getChildByName(`point_${index}`);
                // 只关心在layer里面的队形，不关心name里的index
                targetIndex = this._pointLayer.getChildIndex(targetPoint);
                preIndex = targetIndex === 0 ? (this._pointLayer.children.length - 1) : (targetIndex - 1);
                preLine = <LineGraphics>this._lineLayer.getChildAt(preIndex);
                nextLine = <LineGraphics>this._lineLayer.getChildAt(targetIndex);
                addPointDragHandler(preLine, targetPoint, nextLine, (point: Point) => {
                    this._shape[targetPoint.pointIndex] = point;
                    this._drawEditLayer(false, { select, index });
                    this._updateHandler(this._shape);
                });
                break;
            case SelectEnum.Line:
                this._drawEditLayer(false, { select, index });
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
                        this._drawEditLayer(false, { select, index });
                        this._updateHandler(this._shape);
                    }
                );
                break;
            case SelectEnum.Shape:
                this._layer.interactive = true;
                this._drawEditLayer(false, true);
                addShapeDragHandler(this._layer, (startPoint: PIXI.Point, endPoint: PIXI.Point) => {
                    if ((startPoint.x !== endPoint.x) || (startPoint.y != endPoint.y)) {
                        let x = endPoint.x - startPoint.x;
                        let y = endPoint.y - startPoint.y;
                        let newShape: Shape = [];
                        this._shape.forEach((item, i) => {
                            newShape.push([Math.round(item[0] + x), Math.round(item[1] + y)]);
                        });
                        this._shape = newShape;

                        this._drawEditLayer(false, true);
                        this._updateHandler(newShape);
                    }
                });
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
    let startPoint: PIXI.Point = new PIXI.Point();
    startPoint.copy(shape.position);
    let endPoint: PIXI.Point = new PIXI.Point();

    const onDragEnd = function () {
        endPoint.copy(shape.position);
        handler(startPoint, endPoint);
        shape.x = 0;
        shape.y = 0;
        shape.off('pointerup', onDragEnd)
            .off('pointerupoutside', onDragEnd)
    }
    shape.on("pointerup", onDragEnd)
        .on('pointerupoutside', onDragEnd);
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
