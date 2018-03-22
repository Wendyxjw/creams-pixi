import { ActionInterface } from "./ActionInterface";
import { ShapeContent, Shape, GraphCache } from "../common/Graph";
import AppInterface from "../app/AppInterface";

export class CreateShapeAction implements ActionInterface {
    private _pointArr: Shape;
    private _addShapeIndex: string;
    private _app: AppInterface;

    constructor(pointArr: Shape, app: AppInterface) {
        this._pointArr = pointArr;
        this._app = app;
    }

    do(data: GraphCache): GraphCache {
        this._addShapeIndex = this._app.graphManager.buildShapes(this._pointArr)
        data.shapes.push(this._pointArr);
        data.shapesContent.push(undefined);
        return data;
    };
    unDo(data: GraphCache): GraphCache {
        this._app.graphManager.hideShapes(this._addShapeIndex);
        data.shapes = data.shapes.slice(0, data.shapes.length - 1);
        data.shapesContent = data.shapesContent.slice(0, data.shapesContent.length - 1);
        return data;
    };
}

export class DeleteShapeAction implements ActionInterface {
    private _deleteShapeIndex: string;
    private _pointArr: Shape;
    private _indexNum: number;
    private _app: AppInterface;

    constructor(shapeIndex: string, app: AppInterface) {
        this._deleteShapeIndex = shapeIndex;
        this._app = app;
    }

    do(data: GraphCache): GraphCache {
        this._app.graphManager.hideShapes(this._deleteShapeIndex);
        //shapeIndex="shape1" 将对应的点阵置空 保留占位
        this._indexNum = <number><any>this._deleteShapeIndex.slice(5, this._deleteShapeIndex.length)
        this._pointArr = data.shapes[this._indexNum];//保存删除的点阵
        data.shapes[this._indexNum] = [];
        data.shapesContent[this._indexNum] = undefined;
        return data;
    };
    unDo(data: GraphCache): GraphCache {
        this._app.graphManager.showShapes(this._deleteShapeIndex);
        data.shapes[this._indexNum] = this._pointArr;
        data.shapesContent[this._indexNum] = undefined;
        return data;
    };
}

export class CopyShapeAction implements ActionInterface {
    private _copyShapeIndex: string;
    private _addShapeIndex: string;
    private _indexNum: number
    private _app: AppInterface;

    constructor(shapeIndex: string, app: AppInterface) {
        this._copyShapeIndex = shapeIndex;
        this._app = app;
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
        this._addShapeIndex = this._app.graphManager.buildShapes(pointArr)
        data.shapes.push(pointArr);
        data.shapesContent.push(undefined);
        return data;
    };
    unDo(data: GraphCache): GraphCache {
        this._app.graphManager.hideShapes(this._addShapeIndex);
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

