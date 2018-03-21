import { Action, GraphEdit } from "./ActionInterface";
import { ShapeContent, Shape } from "../common/Graph";

let deleteData = {}

function deleteShape(data: GraphEdit, index: string) {
    //index=“shape11”
    let shapeIndex = <number><any>index.slice(4, index.length - 1);

    //保存要删除的shape数据
    deleteData[index] = {
        shapes: data.shapes[shapeIndex],
    }
    data.shapes[shapeIndex] = [];//清空不删除
}

export class CreateShapeAction implements Action {
    private _pointArr: Shape;

    constructor(pointArr) {
        this._pointArr = pointArr;
    }

    do(data: GraphEdit): GraphEdit {
        data.shapes.push(this._pointArr);
        return data
    };
    unDo(data: GraphEdit): GraphEdit {
        data.shapes = data.shapes.slice(0, data.shapes.length - 1);
        return data
    };
}

export class DeleteShapeAction implements Action {
    private shapeIndex: string
    constructor(shapeIndex: string) {
        this.shapeIndex = shapeIndex;
    }

    do(data: GraphEdit): GraphEdit {

        return data
    };
    unDo(data: GraphEdit): GraphEdit {

        return data
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

