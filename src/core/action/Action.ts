import { Action } from "./ActionInterface";
import { ShapeContent, Shape, GraphCache } from "../common/Graph";
import { App } from "../app/App";

let deleteData = {}

function deleteShape(data: GraphCache, index: string) {
    //index=“shape11”
    let shapeIndex = <number><any>index.slice(4, index.length - 1);
    //保存要删除的shape数据
    deleteData[index] = {
        shapes: data.shapes[shapeIndex],
    }
    data.shapes[shapeIndex] = [];//清空不删除
}

let _app: App;
export class Actions {
    constructor(app: App) {
        _app = app;
    }
}

export class CreateShapeAction implements Action {
    private _pointArr: Shape;
    private _addShapeIndex: string;
    constructor(pointArr: Shape) {
        this._pointArr = pointArr;
    }

    do(data: GraphCache): GraphCache {
        this._addShapeIndex = _app.graphManager._buildShapes(this._pointArr)
        data.shapes.push(this._pointArr);
        data.shapesContent.push(undefined);
        return data;
    };
    unDo(data: GraphCache): GraphCache {
        _app.graphManager._hideShapes(this._addShapeIndex);
        data.shapes = data.shapes.slice(0, data.shapes.length - 1);
        data.shapesContent = data.shapesContent.slice(0, data.shapesContent.length - 1);
        return data;
    };
}

export class DeleteShapeAction implements Action {
    private _deleteShapeIndex: string;
    private _pointArr: Shape;
    private _indexNum: number;

    constructor(shapeIndex: string) {
        this._deleteShapeIndex = shapeIndex;
    }

    do(data: GraphCache): GraphCache {
        _app.graphManager._hideShapes(this._deleteShapeIndex);
        //shapeIndex="shape1" 将对应的点阵置空 保留占位
        this._indexNum = <number><any>this._deleteShapeIndex.slice(5, this._deleteShapeIndex.length)
        this._pointArr = data.shapes[this._indexNum];//保存删除的点阵
        data.shapes[this._indexNum] = [];
        data.shapesContent[this._indexNum] = undefined;
        return data;
    };
    unDo(data: GraphCache): GraphCache {
        _app.graphManager._showShapes(this._deleteShapeIndex);
        data.shapes[this._indexNum] = this._pointArr;
        data.shapesContent[this._indexNum] = undefined;
        return data;
    };
}

export class CopyShapeAction implements Action {
    private _copyShapeIndex: string;
    private _addShapeIndex: string;
    private _indexNum: number
    constructor(shapeIndex: string) {
        this._copyShapeIndex = shapeIndex;
    }

    do(data: GraphCache): GraphCache {
        this._indexNum = <number><any>this._copyShapeIndex.slice(5, this._copyShapeIndex.length)
        let pointArr = data.shapes[this._indexNum];
        //拷贝图片添加偏移量：x+20,y+20
        pointArr = pointArr.map((item) => {
            item[0] += 20;
            item[1] += 20;
            return item;
        })
        this._addShapeIndex = _app.graphManager._buildShapes(pointArr)
        data.shapes.push(pointArr);
        data.shapesContent.push(undefined);
        return data;
    };
    unDo(data: GraphCache): GraphCache {
        _app.graphManager._hideShapes(this._addShapeIndex);
        data.shapes = data.shapes.slice(0, data.shapes.length - 1);
        data.shapesContent = data.shapesContent.slice(0, data.shapesContent.length - 1);
        return data;
    };
}

// export class CreateAction implements Action {
//     constructor() {
//         super();
//     }
// }

// export class UpdateAction extends Action {
//     constructor() {
//         super();
//     }
// }

// export class DeleteAction extends Action {
//     constructor() {
//         super();
//     }
// }

