import { App } from "../app/App";
import { EditEnum, SelectEnum, SelectSuperState } from "./State";
import StateFactory from './StateFactory';

// app状态管理
export default class StateManager {
    private _app: App;
    private _editEnum: EditEnum;
    private _selectEnum: SelectEnum;
    private _isEnableEraser: boolean;
    private _selectIndex: Array<number>;
    private _currentState: SelectSuperState;

    constructor(app: App) {
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
        this._activeState();
    }

    enableEraser(isEnabled: boolean) {
        this._isEnableEraser = isEnabled;
        this._activeState();
    }

    select(state: SelectEnum, index: Array<number>) {
        this._selectEnum = state;
        this._selectIndex = index;
        this._activeState();
    }

}
