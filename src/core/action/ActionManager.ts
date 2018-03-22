import { ActionAPI, Action } from "./ActionInterface";
import { Graph, ShapeContent, Shape, GraphicsWithIndex, GraphCache } from "../common/Graph";
import { CreateShapeAction, DeleteShapeAction, CopyShapeAction } from "./Action"
import AppInterface from "../app/AppInterface";

class Manager {
    //private _data: GraphCache;
    private _currentData: GraphCache;//因为还是需要删除shape的时候 清空con
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
        this._currentData = data;//编辑的原始数据
        this._actionIndex = -1;//当前的操作步骤
        this._actionList = [];//?? 记录的应该是 操作类型（添加／删除／修改），shapeIndex和修改前、后的shapedata
    }

    getCurrentData() {
        return this._currentData;
    }

    addAction(action: Action) {
        try {
            this._currentData = action.do(this._currentData);
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
        if (index === -1) {
            return;
        }
        let action = list[index];
        //this._currentData = action.unDo(data);
        this._actionIndex--;
        this._currentData = action.unDo(this._currentData);
    }

    reDo() {
        let index = this._actionIndex;
        let list = this._actionList;
        if (index === list.length - 1) {
            return;
        }
        let action = list[index + 1];
        this._actionIndex++;
        this._currentData = action.do(this._currentData);
    }

}

export default class ActionManager extends Manager implements ActionAPI {

    addShape(x: number, y: number, width: number, height: number) {
        let pointArr: Shape;
        pointArr = [[x, y], [x, y + height], [x + width, y + height], [x + width, y]];
        let action: Action = new CreateShapeAction(pointArr);
        this.addAction(action)
    };

    addShadowShape(x: number, y: number, width: number, height: number, content?: ShapeContent) {

    };

    copyShape(index: string) {
        let action: Action = new CopyShapeAction(index);
        this.addAction(action);
        //let graphCache = this._app.graphManager.getGraph();
        //let shapeIndex = this._findGraphIndex(graphCache.shapesContent, index)
        //this._app.graphManager._buildShapes(graphCache.shapes[shapeIndex], graphCache.shapesContent[shapeIndex]);
    };

    deleteShape(index: string) {
        let action: Action = new DeleteShapeAction(index);
        this.addAction(action);
    };

    addPoint(index: Array<number>) {

    };

    emptyDoingList() {

    };
}
