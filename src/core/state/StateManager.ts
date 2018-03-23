import StateFactory from './StateFactory';
import { EditEnum, SelectEnum, StateManagerInterface, StateInterface } from "./StateInterface";
import AppInterface from "../app/AppInterface";

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

    private _activeState() {
        const tmpState = this._currentState;
        const graphManager = this._app.graphManager;

        this._currentState = StateFactory(
            this._editEnum, this._selectEnum, this._isEnableEraser, this._selectIndex
        );
        this._currentState.processGraph(graphManager)
    }

    enableEdit(isEnabled: boolean) {
        this._editEnum = isEnabled ? EditEnum.Editing : EditEnum.Nomal;
        this._selectEnum = SelectEnum.None;
        this._selectIndex = [];
        this._activeState();
    }

    enableEraser(isEnabled: boolean) {
        this._isEnableEraser = isEnabled;
        this._selectEnum = SelectEnum.Shape;
        this._activeState();
    }

    select(state: SelectEnum, index: Array<number>) {
        this._selectEnum = state;
        this._selectIndex = index;
        this._activeState();
    }

}
