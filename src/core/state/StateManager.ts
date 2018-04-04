import StateFactory from './StateFactory';
import { StateManagerInterface, StateInterface } from "./StateInterface";
import AppInterface from "../app/AppInterface";
import { EditEnum, SelectEnum } from '../common/Graph';

// app状态管理
export default class StateManager implements StateManagerInterface {
    private _app: AppInterface;
    private _editEnum: EditEnum;
    private _selectEnum: SelectEnum;
    private _isEnableEraser: boolean;
    private _selectIndex: Array<number>;
    private _currentState: StateInterface;

    constructor(app: AppInterface) {
        this._app = app;
        this._editEnum = EditEnum.Nomal;
        this._selectEnum = SelectEnum.None;
        this._isEnableEraser = false;
        this._selectIndex = [];
        this._currentState = StateFactory(
            this._editEnum, this._selectEnum, this._isEnableEraser, this._selectIndex
        );
    }

    private _activeState(isChange: boolean = true) {
        const graphManager = this._app.graphManager;
        const eventManager = this._app.eventManager;

        this._currentState = StateFactory(
            this._editEnum, this._selectEnum, this._isEnableEraser, this._selectIndex
        );
        this._currentState.isChangingSelect = isChange;
        this._currentState.processGraph(graphManager, eventManager);
    }

    enableEdit(isEnabled: boolean) {
        this._editEnum = isEnabled ? EditEnum.Editing : EditEnum.Nomal;
        this._selectEnum = SelectEnum.None;
        this._isEnableEraser = false;
        this._selectIndex = [];
        this._activeState();
    }

    enableEraser(isEnabled: boolean) {
        if (this._selectIndex.length == 0) {
            return;
        }
        this._isEnableEraser = isEnabled;
        this._selectEnum = SelectEnum.Shape;
        this._activeState(false);
    }

    select(state: SelectEnum, index: Array<number>) {
        if (this._selectEnum === SelectEnum.None && state === SelectEnum.None) {
            return;
        }
        this._selectEnum = state;
        // const isEqual = this._selectIndex.length == index.length &&
        //     this._selectIndex.every((v, i) => v === index[i]);
        const isEqual = this._selectIndex[0] === index[0]; // 只需要判断shapeIndex

        this._selectIndex = index;
        this._activeState(!isEqual);
    }

}
