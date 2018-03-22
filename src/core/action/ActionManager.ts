import { ActionAPI, Action } from "./ActionInterface";
import { Graph, ShapeContent, Shape, GraphicsWithIndex, GraphCache } from "../common/Graph";
import { CreateShapeAction, DeleteShapeAction } from "./Action"
import AppInterface from "../app/AppInterface";

class Manager {
    //private _data: GraphCache;
    //public _currentData: GraphEdit;
    private _actionIndex: number;
    private _actionList: Array<Action>
    public _app: AppInterface;

    constructor(app: AppInterface) {
        this._actionIndex = -1;
        this._actionList = [];
        this._app = app;

    }
    //启用编辑模式时 执行;保存后 是否清空修改记录？？
    init(data: GraphCache) {
        //this._data = data;//编辑的原始数据
        this._actionIndex = -1;//当前的操作步骤
        this._actionList = [];//?? 记录的应该是 操作类型（添加／删除／修改），shapeIndex和修改前、后的shapedata
    }

    getCurrentData() {
        //return this._currentData;
    }

    addAction(action: Action) {
        let data = this._app.graphManager.graph
        try {
            // this._currentData = action.do(data);
            //this._app.graphManager._renderCanves();
            this._app.graphManager.graph = action.do(data);
        } catch (error) {
            console.log(error);
            return;
        }
        this._actionIndex++;
        this._actionList.splice(this._actionIndex); // delete the orig actions
        this._actionList.push(action);
    }

    unDo() {
        let index = this._actionIndex;
        let list = this._actionList;
        let data = this._app.graphManager.graph;
        if (index === -1) {
            return;
        }
        let action = list[index];
        //this._currentData = action.unDo(data);
        this._actionIndex--;
        this._app.graphManager.graph = action.unDo(data);
    }

    reDo() {
        let index = this._actionIndex;
        let list = this._actionList;
        let data = this._app.graphManager.graph;
        // let data = this._currentData;
        if (index === list.length - 1) {
            return;
        }
        let action = list[index + 1];
        //this._currentData = action.do(data);
        this._actionIndex++;
        this._app.graphManager.graph = action.do(data);
    }

}

export default class ActionManager extends Manager implements ActionAPI {
    //查找shape的index
    private _findGraphIndex(arr, shapeIndex): number {
        let curIndex: number;
        //todo 待优化 需要跳出循环
        arr.forEach((item: GraphicsWithIndex, index: number) => {
            if (item.shapeIndex == shapeIndex) {
                curIndex = index;
            }
        })
        return curIndex;
    }
    //查找children为shape的index
    private _findShapeIndex(shapeIndex): number {
        let curIndex: number;
        let shapeNum: number = 0//统计shape个数
        //todo 待优化 需要跳出循环
        this._app.graphManager._graphContainer.children.forEach((item: GraphicsWithIndex, index: number) => {
            if (item.shapeIndex == shapeIndex) {
                curIndex = shapeNum;
            }
            if (item.shapeIndex) {
                shapeNum++;
            }
        })
        return curIndex;
    }
    private _findShapeConIndex(data: Array<ShapeContent>, shapeIndex: string) {
        let curIndex: number;
        for (let i = 0; i < data.length; i++) {
            if (data[i].shapeIndex == shapeIndex) {
                curIndex = i;
                break;
            }
        }
        return curIndex;
    }
    addShape(x: number, y: number, width: number, height: number) {
        let pointArr: Shape;
        pointArr = [[x, y], [x, y + height], [x + width, y + height], [x + width, y]];
        let action: Action = new CreateShapeAction(pointArr);
        this.addAction(action)
    };

    addShadowShape(x: number, y: number, width: number, height: number, content?: ShapeContent) {

    };

    copyShape(index: string) {
        //let graphCache = this._app.graphManager.getGraph();
        //let shapeIndex = this._findGraphIndex(graphCache.shapesContent, index)
        //this._app.graphManager._buildShapes(graphCache.shapes[shapeIndex], graphCache.shapesContent[shapeIndex]);
    };

    deleteShape(index: string) {
        //let graphCache = this._app.graphManager._graphCache;
        //  let curConIndex = this._findGraphIndex(this._app.graphManager._graphContainer.children, index);
        // this._app.graphManager._graphContainer.removeChildAt(curConIndex);

        //删除指定位置的数据
        //let shapeIndex = this._findGraphIndex(graphCache.shapesContent, index);
        //graphCache.shapes.splice(shapeIndex, 1);
        //graphCache.shapesContent.splice(shapeIndex, 1);

        // let action: Action = new Actions();
        // action.do = (data: GraphEdit) => {
        //     let shapeIndex = <number><any>index.slice(4, index.length - 1);
        //     let conIndex = this._findShapeConIndex(data.shape.shapesContent, index);
        //     //保存删除的数据
        //     this._deleteData.shape.shapes.push(data.shape.shapes.slice(shapeIndex)[0])
        //     this._deleteData.shape.shapesContent.push(data.shape.shapesContent.slice(conIndex)[0])

        //     data.shape.shapes = data.shape.shapes.slice(shapeIndex, 1);
        //     data.shape.shapesContent = data.shape.shapesContent.slice(conIndex, 1);

        //     return data;
        // };
        // action.unDo = (data: GraphEdit) => {
        //     data.shape.shapes = data.shape.shapes.slice(0, data.shape.shapes.length - 1);
        //     data.shape.shapesContent = data.shape.shapesContent.splice(0, data.shape.shapesContent.length - 1);
        //     return data
        // }
        let action: Action = new CreateShapeAction(index);
        this.addAction(action)

    };

    addPoint(index: Array<number>) {

    };

    emptyDoingList() {

    };
}
