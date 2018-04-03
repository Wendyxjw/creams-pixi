// 基本数据结构，由opencv传过来的图形点阵。
// 点 x,y
export type Point = [number, number];
// 块
export type Shape = Array<Point>;
// 图
export type Graph = {
    shapes: Array<Shape>;
}

// 缓存数据结构，运行时的数据结构，用于展示。
// Shape样式
export enum LineStyle {
    Dashed = "dashed",
    Solid = "solid"
}
export type ShapeContent = {
    backgroundColor: number; // 背景颜色：0xffffff(十六进制)
    border: {
        lineWidth: number,
        color: number,
        lineStyle: LineStyle //虚线：dotted 实线：solid
    };
    font: {
        fontSize: number,
        fill: Array<number>,//填充颜色：[0x000000,0xffffff]填一个就是纯色，多个就是渐变效果
    };
    content: string; // 显示的文字内容，换行："\n"
    hasMark?: boolean; // 是否需要角标，默认false：匹配店铺时出现的shadowShape使用
    alpha?: number; // 透明度，默认1
}

interface indexableContent {
    [index: number]: ShapeContent
}
export interface GraphCache {
    // 每一个Shape的绘制样式
    backgroundPic: string;
    shapesContent?: indexableContent;
}

// graph添加shapeIndex属性，用于识别graphContainer.children类型
export class ShapeGraphics extends PIXI.Graphics {
    public shapeIndex?: number; //第几个
    public xMin?: number;
    public xMax?: number;
    public yMin?: number;
    public yMax?: number;
}

export class LineGraphics extends PIXI.Graphics {
    public lineIndex?: number; // 第几个
    public startPoint?: Point; // 起点
    public endPoint?: Point; // 终点
    public isHighlight?: boolean; // 是否高亮
}

export class PointGraphics extends PIXI.Graphics {
    public pointIndex?: number; // 第几个
    public point?: Point;
    public isHighlight?: boolean; // 是否高亮
}

export enum EditEnum {
    Nomal = 'Nomal',
    Editing = 'Editing',
}

export enum SelectEnum {
    None = 'None',
    Shape = 'Shape',
    Line = 'Line',
    Point = 'Point',
}