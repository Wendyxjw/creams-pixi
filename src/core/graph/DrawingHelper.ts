import { Shape, ShapeContent, Point, PointGraphics, ShapeGraphics } from "../common/Graph";
import { defultGraphStyle } from "./constant";

export function drawShape(graphics: PIXI.Graphics, shape: Shape, content: ShapeContent = defultGraphStyle) {
    // set a fill and line style
    graphics.beginFill(content.backgroundColor, 1);
    graphics.lineStyle(content.border.lineWidth, content.border.color, 1);
    // draw a shape
    graphics.moveTo(shape[0][0], shape[0][1]);
    for (let i = 1; i < shape.length; i++) {
        graphics.lineTo(shape[i][0], shape[i][1]);
    }
    graphics.lineTo(shape[0][0], shape[0][1]);
    graphics.endFill();
    return graphics
}
//line
export function buildLine(shape: Shape) {

    for (let i = 0; i < shape.length; i++) {
        let graphics = new ShapeGraphics();
        graphics.beginFill(0x1db745, 1);
        graphics.lineStyle(5, 0x1db745, 1);
        graphics.moveTo(shape[i][0], shape[i][1]);
        if (shape.length == i + 1) {
            graphics.lineTo(shape[0][0], shape[0][1]);
        } {
            graphics.lineTo(shape[i + 1][0], shape[i + 1][1]);
        }
        graphics.endFill();
        this._extraLayer.addChild(graphics);
    }
}
//point
export function buildPoint(point: Point) {
    let graphics = new PointGraphics();
    graphics.lineStyle(0);
    graphics.beginFill(0x548f14, 1)
    graphics.drawCircle(0, 0, 3);
    graphics.x = point[0];
    graphics.y = point[1];
    graphics.endFill();
    this._extraLayer.addChild(graphics);
}