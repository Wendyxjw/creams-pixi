import ActionAPI, { CallbackFunc, GraphOrder } from "./ActionAPI"
import { ActionInterface, ActionManagerInterface } from "./ActionInterface";
import { Graph, ShapeContent, Shape, ShapeGraphics, SelectEnum } from "../common/Graph";
import { CreateShapeAction, DeleteShapeAction, CopyShapeAction, UpdateShapeAction } from "./Action"
import AppInterface from "../app/AppInterface";

class Manager {
    //protected _data: Graph;
    protected _currentData: Graph; //因为还是需要删除shape的时候 清空con
    protected _actionIndex: number;
    protected _actionList: Array<ActionInterface>
    protected _app: AppInterface;

    constructor(app: AppInterface) {
        this._actionIndex = -1;
        this._actionList = [];
        this._app = app;
    }
    protected addAction(action: ActionInterface) {
        try {
            this._currentData = action.do(this._currentData);
        } catch (error) {
            console.log(error);
            return;
        }
        this._actionIndex++;
        this._actionList.splice(this._actionIndex); // delete the orig actions
        this._actionList.push(action);

        //最多保留30条记录
        if (this._actionList.length > 30) {
            this._actionList = this._actionList.slice(-30);
        }
    }
    unDo(callback?: CallbackFunc) {
        let index = this._actionIndex;
        let list = this._actionList;
        if (index === -1) {
            return;
        }
        let action = list[index];
        this._actionIndex--;
        this._currentData = action.unDo(this._currentData);

        if (callback) {
            callback(action.shapeIndex, action.actionEvent);
        }

        // 取消选中和橡皮擦状态
        this._app.stateManager.enableEraser(false);
        this._app.stateManager.select(SelectEnum.None, []);
    }

    reDo(callback?: CallbackFunc) {
        let index = this._actionIndex;
        let list = this._actionList;
        if (index === list.length - 1) {
            return;
        }
        let action = list[index + 1];
        this._actionIndex++;
        this._currentData = action.do(this._currentData);

        if (callback) {
            callback(action.shapeIndex, action.actionEvent);
        }

        // 取消选中和橡皮擦状态
        this._app.stateManager.enableEraser(false);
        this._app.stateManager.select(SelectEnum.None, []);
    }

    emptyDoingList() {
        this._actionList = [];
    }

}

export default class ActionManager extends Manager implements ActionAPI, ActionManagerInterface {
    //启用编辑模式时 执行;保存后 是否清空修改记录？？
    init(data: Graph): void {
        //this._data = data;
        this._currentData = data; //编辑的原始数据
        this._actionIndex = -1; //当前的操作步骤
        this._actionList = []; //?? 记录的应该是 操作类型（添加／删除／修改），shapeIndex和修改前、后的shapedata
    }

    getCurrentData(): GraphOrder {
        let order: Array<number> = [];
        let shapeLayer: PIXI.Container = <PIXI.Container>this._app.graphManager.graphContainer.getChildByName("shapeLayer");
        shapeLayer.children.forEach((item: ShapeGraphics) => {
            order.push(item.shapeIndex);
        })
        let newGraph: GraphOrder = {
            shapes: JSON.parse(JSON.stringify(this._currentData.shapes)),
            order: order
        }
        return newGraph;
    }

    addShape(x: number, y: number, width: number, height: number) {
        let pointArr: Shape;
        pointArr = [[x, y], [x, y + height], [x + width, y + height], [x + width, y]];
        let action: ActionInterface = new CreateShapeAction(pointArr, this._app);
        this.addAction(action)

    };

    copyShape(shapeIndex: number) {
        let action: ActionInterface = new CopyShapeAction(shapeIndex, this._app);
        this.addAction(action);
        this._app.stateManager.select(SelectEnum.None, []);
    };

    deleteShape(shapeIndex: Array<number>) {
        // 如果传入的为number 做强转换
        if (Object.prototype.toString.call(shapeIndex) == "[object Number]") {
            shapeIndex = [Number(shapeIndex)];
        }
        let action: ActionInterface = new DeleteShapeAction(shapeIndex, this._app);
        this.addAction(action);
        this._app.stateManager.select(SelectEnum.None, []);
    };

    updateShape(shape: Shape, shapeIndex: number) {
        let action: ActionInterface = new UpdateShapeAction(shape, shapeIndex, this._app);
        this.addAction(action);
    };

    getCurrentShape(shapeIndex: number): Shape {
        return JSON.parse(JSON.stringify(this._currentData.shapes[shapeIndex]));
    }

}
