// 基本数据结构，由opencv传过来的图形点阵。
// 点
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
    background: string; // color
    border: string; // size, color, style
    font: string; // size, color
    content: string; // 显示的文字内容
    hasMark: boolean; // 是否需要角标
}

export interface GraphCache extends Graph {
    // 每一个Shape的绘制样式
    shapesContent: Array<ShapeContent>;
}


// let aa: Shape = [[2, 2], [2, 2], [2, 2]]

// let a: Graph = { 
//     shapes: [
//         [[1, 1, 1], [1, 1], [1, 1]],
//         [[2, 2], [2, 2], [2, 2]]
//     ],
// };
// let c = { roomId: '1' };

// let b = <GraphData<typeof c>>a;

// b.identifiers[0] = { roomId: '1'};
// b.identifiers[1] = c;
// b.identifiers[3] = undefined;

// let content = b.identifiers[1];
