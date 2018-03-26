import { Shape, ShapeContent, Point, PointGraphics, ShapeGraphics } from "../common/Graph";
import { defultGraphStyle } from "./constant";

export function drawShape(graphics: PIXI.Graphics, shape: Shape, content: ShapeContent = defultGraphStyle) {
    graphics.removeChildren();
    // set a fill and line style
    graphics.beginFill(content.backgroundColor, content.alpha);
    graphics.lineStyle(content.border.lineWidth, content.border.color, 1);
    graphics.alpha = content.alpha; //透明度

    let xMin: number = shape[0][0], xMax: number = shape[0][0], yMin: number = shape[0][1], yMax: number = shape[0][1];
    // draw a shape
    graphics.moveTo(shape[0][0], shape[0][1]);
    for (let i = 1; i < shape.length; i++) {
        graphics.lineTo(shape[i][0], shape[i][1]);
        //查找shape的边界
        xMin = xMin > shape[i][0] ? shape[i][0] : xMin;
        xMax = xMax < shape[i][0] ? shape[i][0] : xMax;
        yMin = yMin > shape[i][1] ? shape[i][1] : yMin;
        yMax = yMax < shape[i][1] ? shape[i][1] : yMax;
    }
    graphics.lineTo(shape[0][0], shape[0][1]);
    graphics.endFill();

    let maskGraph = graphics.clone();
    //文字
    if (content.content) {
        let textStyle = new PIXI.TextStyle({
            fontSize: content.font.fontSize,
            fill: content.font.fill,//填充颜色
            wordWrap: true,
            wordWrapWidth: xMax - xMin,
            breakWords: true
        });
        let text = new PIXI.Text(content.content, textStyle);
        text.position.x = (xMin + xMax) / 2 - text.width / 2;
        text.position.y = (yMin + yMax) / 2 - text.height / 2;
        graphics.addChild(maskGraph)
        if (!content.hasMark) {
            //拖出来的shadowshape文字不需要遮住
            text.mask = maskGraph;
        }
        graphics.addChild(text);
    }

    //角标
    if (content.hasMark) {
        //根据右下角的点画一个三角形
        graphics.beginFill(content.backgroundColor, 1);
        graphics.lineStyle();
        graphics.moveTo(xMax - 20, yMax);
        graphics.lineTo(xMax, yMax);
        graphics.lineTo(xMax, yMax - 20);
        graphics.lineTo(xMax - 20, yMax);
        graphics.endFill();
    }

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