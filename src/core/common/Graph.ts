// 基本数据结构，由opencv传过来的图形点阵。
// 点 x,y
export type Point = [number, number];
// 块
export type Shape = Array<Point>;
// 图
export type Graph = {
    shapes: Array<Shape>;
    backgroundPic: string;
}

// 缓存数据结构，运行时的数据结构，用于展示。
// Shape样式
export type ShapeContent = {
    backgroundColor: number; // color
    border: {
        lineWidth: number,
        color: number,
        //alpha:number//默认为1
    }; // size, color, style
    font: string; // size, color
    content: string; // 显示的文字内容
    hasMark: boolean; // 是否需要角标
    shapeIndex: string;//与Graph匹配
}

export interface GraphCache extends Graph {
    // 每一个Shape的绘制样式
    shapesContent?: Array<ShapeContent>;
}



//graph添加shapeIndex属性，用于识别_graphContainer.children类型
export interface GraphWithIndexType extends PIXI.DisplayObject {
    shapeIndex?: string,
    width: number,
    height: number
}
export class GraphicsWithIndex extends PIXI.Graphics {
    public shapeIndex?: String//第几个
}
