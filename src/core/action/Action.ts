/*
 * @Author: xujiawen 
 * @Description: 实现撤销重做
 * @Date: 2018-04-26 10:53:51 
 * @Last Modified by: xujiawen
 * @Last Modified time: 2018-04-26 10:54:31
 */

import { ActionInterface } from "./ActionInterface";
import { ShapeContent, Shape, Graph, Point, SelectEnum } from "../common/Graph";
import AppInterface from "../app/AppInterface";
import { ActionEvent } from "./ActionAPI";

export class CreateShapeAction implements ActionInterface {
    private _pointArr: Shape;
    private _app: AppInterface;
    shapeIndex: Array<number> = []; // addShapeIndex
    actionEvent: ActionEvent;

    constructor(pointArr: Shape, app: AppInterface) {
        this._pointArr = pointArr;
        this._app = app;
    }

    do(data: Graph): Graph {
        this.shapeIndex[0] = data.shapes.length;
        this.actionEvent = ActionEvent.Add;
        let shape: PIXI.Graphics = this._app.graphManager.buildShapes(this._pointArr, data.shapes.length);
        this._app.eventManager.bindHandler(SelectEnum.Shape, shape);
        data.shapes.push(this._pointArr);
        return data;
    };
    unDo(data: Graph): Graph {
        this.actionEvent = ActionEvent.Delete;
        this._app.graphManager.deleteShapes(this.shapeIndex[0].toString());
        data.shapes[this.shapeIndex[0]] = []; // 不能删除该元素，要和content一一对应
        return data;
    };
}

export class DeleteShapeAction implements ActionInterface {
    private _pointArr: Array<Shape>;
    private _app: AppInterface;
    shapeIndex: Array<number> = []; //deleteShapeIndex
    actionEvent: ActionEvent;

    constructor(shapeIndex: Array<number>, app: AppInterface) {
        this.shapeIndex = shapeIndex;
        this._app = app;
    }

    do(data: Graph): Graph {
        this.actionEvent = ActionEvent.Delete;
        this._pointArr = [];
        this.shapeIndex.forEach((item: number) => {
            this._app.graphManager.deleteShapes(item.toString());
            //将对应的点阵置空 保留占位
            this._pointArr.push(data.shapes[item]);
            data.shapes[item] = [];
        })
        return data;
    };
    unDo(data: Graph): Graph {
        this.shapeIndex = [];
        this._pointArr.forEach((item: Shape) => {
            this.shapeIndex.push(data.shapes.length);
            let shape: PIXI.Graphics = this._app.graphManager.buildShapes(item, data.shapes.length);
            this._app.eventManager.bindHandler(SelectEnum.Shape, shape);
            data.shapes.push(item);
        })

        this.actionEvent = ActionEvent.Add;
        //回滚的时 不会滚匹配状态
        return data;
    };
}

export class CopyShapeAction implements ActionInterface {
    private _copyShapeIndex: number;
    private _app: AppInterface;
    shapeIndex: Array<number> = []; // addShapeIndex
    actionEvent: ActionEvent;

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
        this.shapeIndex[0] = data.shapes.length;
        this.actionEvent = ActionEvent.Add;

        let shape: PIXI.Graphics = this._app.graphManager.buildShapes(newPointArr, this.shapeIndex[0]);
        this._app.eventManager.bindHandler(SelectEnum.Shape, shape);
        data.shapes.push(newPointArr);
        return data;
    };
    unDo(data: Graph): Graph {
        this.actionEvent = ActionEvent.Delete;
        this._app.graphManager.deleteShapes(this.shapeIndex.toString())
        data.shapes[this.shapeIndex[0]] = [];
        return data;
    };
}

//编辑时（点的增删改） 更新shape
export class UpdateShapeAction implements ActionInterface {
    private _newShape: Shape;
    private _app: AppInterface;
    private _oldShape: Shape;
    shapeIndex: Array<number> = []; // updateIndex
    actionEvent: ActionEvent = ActionEvent.Update;

    constructor(shape: Shape, shapeIndex: number, app: AppInterface) {
        this._newShape = shape;
        this.shapeIndex[0] = shapeIndex;
        this._app = app;
    }

    do(data: Graph): Graph {
        this._app.graphManager.updateShapes(this._newShape, this.shapeIndex[0]);
        this._oldShape = data.shapes[this.shapeIndex[0]];//保存一份修改前的数据
        data.shapes[this.shapeIndex[0]] = this._newShape;
        return data;
    }
    unDo(data: Graph): Graph {
        this._app.graphManager.updateShapes(this._oldShape, this.shapeIndex[0]);
        data.shapes[this.shapeIndex[0]] = this._oldShape;
        return data;
    }
}

