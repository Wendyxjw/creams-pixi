import { ActionInterface } from "./ActionInterface";
import { ShapeContent, Shape, Graph, Point, SelectEnum } from "../common/Graph";
import AppInterface from "../app/AppInterface";

export class CreateShapeAction implements ActionInterface {
    private _pointArr: Shape;
    private _addShapeIndex: number;
    private _app: AppInterface;

    constructor(pointArr: Shape, app: AppInterface) {
        this._pointArr = pointArr;
        this._app = app;
    }

    do(data: Graph): Graph {
        this._addShapeIndex = data.shapes.length;
        let shape = this._app.graphManager.buildShapes(this._pointArr, data.shapes.length);
        this._app.eventManager.bindHandler(SelectEnum.Shape, shape);
        data.shapes.push(this._pointArr);
        return data;
    };
    unDo(data: Graph): Graph {
        this._app.graphManager.deleteShapes(this._addShapeIndex.toString());
        data.shapes[this._addShapeIndex] = []; // 不能删除该元素，要和content一一对应
        return data;
    };
}

export class DeleteShapeAction implements ActionInterface {
    private _deleteShapeIndex: number;
    private _pointArr: Shape;
    private _app: AppInterface;

    constructor(shapeIndex: number, app: AppInterface) {
        this._deleteShapeIndex = shapeIndex;
        this._app = app;
    }

    do(data: Graph): Graph {
        this._app.graphManager.deleteShapes(this._deleteShapeIndex.toString());
        //将对应的点阵置空 保留占位
        this._pointArr = data.shapes[this._deleteShapeIndex];//保存删除的点阵
        data.shapes[this._deleteShapeIndex] = [];
        //调用删除 shapeContent
        return data;
    };
    unDo(data: Graph): Graph {
        this._app.graphManager.buildShapes(this._pointArr, data.shapes.length);
        data.shapes.push(this._pointArr);
        //回滚的时 不会滚匹配状态
        return data;
    };
}

export class CopyShapeAction implements ActionInterface {
    private _copyShapeIndex: number;
    private _addShapeIndex: number;
    private _app: AppInterface;

    constructor(shapeIndex: number, app: AppInterface) {
        this._copyShapeIndex = shapeIndex;
        this._app = app;
    }

    do(data: Graph): Graph {
        const pointArr: Shape = data.shapes[this._copyShapeIndex];
        let newPointArr: Shape;
        //拷贝图片添加偏移量：x+20,y+20
        newPointArr = pointArr.map((item) => {
            let newItem: Point;
            newItem = [item[0] + 20, item[1] + 20]
            return newItem;
        })
        this._addShapeIndex = data.shapes.length
        let shape = this._app.graphManager.buildShapes(newPointArr, this._addShapeIndex);
        this._app.eventManager.bindHandler(SelectEnum.Shape, shape);
        data.shapes.push(newPointArr);
        return data;
    };
    unDo(data: Graph): Graph {
        this._app.graphManager.deleteShapes(this._addShapeIndex.toString())
        data.shapes[this._addShapeIndex] = [];
        return data;
    };
}

//编辑时（点的增删改） 更新shape
export class UpdateShapeAction implements ActionInterface {
    private _newShape: Shape;
    private _updateIndex: number;
    private _app: AppInterface;
    private _oldShape: Shape;

    constructor(shape: Shape, shapeIndex: number, app: AppInterface) {
        this._newShape = shape;
        this._updateIndex = shapeIndex;
        this._app = app;
    }
    do(data: Graph): Graph {
        this._app.graphManager.updateShapes(this._newShape, this._updateIndex);
        this._oldShape = data.shapes[this._updateIndex];//保存一份修改前的数据
        data.shapes[this._updateIndex] = this._newShape;
        return data;
    }
    unDo(data: Graph): Graph {
        this._app.graphManager.updateShapes(this._oldShape, this._updateIndex);
        data.shapes[this._updateIndex] = this._oldShape;
        return data;
    }
}

