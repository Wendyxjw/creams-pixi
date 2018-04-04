import { Shape, ShapeContent, Point, LineGraphics, PointGraphics, ShapeGraphics, LineStyle } from "../common/Graph";
import { defultGraphStyle } from "./constant";

export function drawShape(graphics: ShapeGraphics, shape: Shape, content: ShapeContent = defultGraphStyle) {
    graphics.removeChildren();
    // set a fill and line style
    graphics.beginFill(content.backgroundColor, content.alpha);

    if (content.border.lineStyle === LineStyle.Solid) {
        graphics.lineStyle(content.border.lineWidth, content.border.color, 1);
    }

    graphics.alpha = content.alpha; //透明度

    let xMin: number = shape[0][0], xMax: number = shape[0][0], yMin: number = shape[0][1], yMax: number = shape[0][1];
    // draw a shape
    graphics.moveTo(shape[0][0], shape[0][1]);
    for (let i = 1; i < shape.length; i++) {
        //borderAlpha = Math.abs(borderAlpha - 1);
        //graphics.lineStyle(content.border.lineWidth, content.border.color, borderAlpha);
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
    //画虚线
    if (content.border.lineStyle === LineStyle.Dashed) {
        drawDashed(graphics, shape, content);
    }


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

function drawDashed(graphics: PIXI.Graphics, shape: Shape, content: ShapeContent) {
    let dashLength: number = 5; // 虚线每段长度 
    let borderAlpha: number = 1; // 虚线的透明度
    let excessLength: number = 0; // 亮点之间多余的虚线长度
    graphics.beginFill(content.backgroundColor, 0);
    graphics.moveTo(shape[0][0], shape[0][1]);
    for (let i = 1; i <= shape.length; i++) {
        let point1 = shape[i - 1]; // 上一个点
        let point2 = shape[i];
        if (i == shape.length) {
            point1 = shape[i - 1];
            point2 = shape[0];
        }
        // 两点之间的长度
        let line: number = Math.sqrt(Math.pow(point1[0] - point2[0], 2) + Math.pow(point1[1] - point2[1], 2));
        let mulriple: number = line / dashLength;

        let drawLineto = (x: number, y: number) => {
            borderAlpha = Math.abs(borderAlpha - 1);
            graphics.lineTo(x, y);
            graphics.lineStyle(content.border.lineWidth, content.border.color, borderAlpha);

        }

        if (mulriple > 1) {
            let x: number = point1[0];
            let y: number = point1[1];
            if (excessLength) {
                let addLine = dashLength - excessLength; // 需要补的长度
                let addMul = line / addLine;
                x = point1[0] + (point2[0] - point1[0]) / addMul;
                y = point1[1] + (point2[1] - point1[1]) / addMul;
                drawLineto(x, y);
                line = line - addLine;
            }
            for (let j = line / dashLength; j >= 1; j--) {
                x += (point2[0] - point1[0]) / mulriple;
                y += (point2[1] - point1[1]) / mulriple;
                drawLineto(x, y);
            }
            if (x !== point2[0]) {
                graphics.lineTo(point2[0], point2[1]);
                excessLength = line % dashLength;
            }
        } else {
            //  excessLength += line;
            if (excessLength + line > dashLength) {
                let addLine = dashLength - excessLength; // 需要补的长度
                let addMul = line / addLine;
                let x: number = point1[0] + (point2[0] - point1[0]) / addMul;
                let y: number = point1[1] + (point2[1] - point1[1]) / addMul;
                drawLineto(x, y);
                excessLength = excessLength + line - dashLength;
                if (x !== point2[0]) {
                    graphics.lineTo(point2[0], point2[1]);
                }
            } else {
                excessLength += line;
                graphics.lineTo(point2[0], point2[1]);
            }
        }
    }
    graphics.endFill();
}

//line
export function buildLine(line: LineGraphics, start: Point, end: Point) {
    const color = line.isHighlight ? 0x7ed321 : 0xa7acb2;
    const radius = 2;
    line.lineStyle(1, color, 1);
    line.beginFill(color, 1)

    let radians = Math.atan2(end[1] - start[1], end[0] - start[0]);
    let dx = Math.sin(radians) * radius;
    let dy = Math.cos(radians) * radius;

    let poly = new PIXI.Polygon(
        new PIXI.Point(start[0] + dx, start[1] - dy),
        new PIXI.Point(end[0] + dx, end[1] - dy),
        new PIXI.Point(end[0] - dx, end[1] + dy),
        new PIXI.Point(start[0] - dx, start[1] + dy),
    );
    line.drawPolygon(poly);
    line.hitArea = poly;
    line.endFill();
    line.startPoint = start;
    line.endPoint = end;
}

//point
export function buildPoint(graphics: PointGraphics, point: Point) {
    const color = graphics.isHighlight ? 0x548f14 : 0xa7acb2;
    graphics.beginFill(color, 1)
    graphics.drawCircle(0, 0, 3);
    graphics.x = point[0];
    graphics.y = point[1];
    graphics.endFill();
    graphics.point = point;
}