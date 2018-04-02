import { Shape, ShapeContent, Point, LineGraphics, PointGraphics, ShapeGraphics } from "../common/Graph";
import { defultGraphStyle } from "./constant";

export function drawShape(graphics: ShapeGraphics, shape: Shape, content: ShapeContent = defultGraphStyle) {
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
    graphics.xMin = xMin;
    graphics.xMax = xMax;
    graphics.yMin = yMin;
    graphics.yMax = yMax;

    graphics.lineTo(shape[0][0], shape[0][1]);
    graphics.endFill();

    //文字
    if (content.content) {
        let maskGraph = graphics.clone();
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
        // 文字超出后隐藏
        text.mask = maskGraph;
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
export function buildLine(line: LineGraphics, start: Point, end: Point) {
    line.lineStyle(1, 0xa7acb2, 1);
    line.beginFill(0xa7acb2, 1)
    // TODO: 绘图方法需要修改
    let poly = new PIXI.Polygon(
        new PIXI.Point(start[0] - 2, start[1] - 2),
        new PIXI.Point(end[0] - 2, end[1] - 2),
        new PIXI.Point(end[0] + 2, end[1] + 2),
        new PIXI.Point(start[0] + 2, start[1] + 2),
    );
    line.drawPolygon(poly);
    line.hitArea = poly;
    line.endFill();
    line.startPoint = start;
    line.endPoint = end;
}

//point
export function buildPoint(graphics: PointGraphics, point: Point) {
    graphics.beginFill(0xa7acb2, 1)
    graphics.drawCircle(0, 0, 3);
    graphics.x = point[0];
    graphics.y = point[1];
    graphics.endFill();
    graphics.point = point;
}

//编辑状态下 添加灰度
export function addColorFilter(shapeLayer: PIXI.Container) {
    var filter = new PIXI.filters.ColorMatrixFilter();
    //数值越大 灰度越高
    var matrix: Array<number> = filter.matrix;
    matrix[0] = .55;
    matrix[1] = .55;
    matrix[2] = .55;
    matrix[5] = .55;
    matrix[6] = .55;
    matrix[7] = .55;
    matrix[10] = .55;
    matrix[11] = .55;
    matrix[12] = .55;
    shapeLayer.filters = [filter];
}

export function deleteColorFilter(shapeLayer: PIXI.Container) {
    shapeLayer.filters = null;
}