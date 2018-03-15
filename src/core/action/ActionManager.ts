import { ActionAPI, Action } from "./ActionInterface";
import { ShapeContent, Shape } from "../common/Graph";

class Manager {
    private _data: Array<Shape>;
    private _currentData: Array<Shape>;
    private _actionIndex: number;
    private _actionList: Array<Action>

    constructor() {
        this._actionIndex = -1;
        this._actionList = [];     
    }

    init(data: Array<Shape>) {
        this._data = data;
        this._currentData = data;
        this._actionIndex = -1;
        this._actionList = []; 
    }

    getCurrentData() {
        return this._currentData;
    }

    addAction(action: Action) {
        let data = this._currentData;
        try {
            this._currentData = action.do(data);
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
        let data = this._currentData;
        if (index === -1) {
            return;
        }
        let action = list[index];
        this._currentData = action.unDo(data);
        this._actionIndex--;
    }

    reDo() {
        let index = this._actionIndex;
        let list = this._actionList;
        let data = this._currentData;
        if (index === list.length - 1) {
            return;
        }
        let action = list[index + 1];
        this._currentData = action.do(data);
        this._actionIndex++;
    }

}

export default class ActionManager extends Manager implements ActionAPI {

    addShape(x: number, y: number, width: number, height: number, content?: ShapeContent) {

    };

    addShadowShape(x: number, y: number, width: number, height: number, content?: ShapeContent) {

    };

    copyShape(index: Array<number>) {

    };

    deleteShape(index: Array<number>) {

    };

    addPoint(index: Array<number>) {

    };

    emptyDoingList() {

    };
}
