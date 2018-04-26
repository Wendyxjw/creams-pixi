import { StateInterface } from "./StateInterface";
import { GraphManagerInterface, RegionDeleteCallBack } from "../graph/GraphInterface";
import { EventManagerInterface } from "../event/EventInterface";
import { EditEnum, SelectEnum } from "../common/Graph";

const EditBorder = {
    lineWidth: 4,
    color: 0x7ed321,
};

export abstract class SelectSuperState implements StateInterface {
    protected _index: Array<number>;
    protected _select: SelectEnum;

    public isChangingSelect: boolean = true;

    constructor(index: Array<number>, select: SelectEnum) {
        this._index = index; // 选中shape的index
        this._select = select; // 选中目标的类型
    }

    protected processLayer(graphManager: GraphManagerInterface, eventManager: EventManagerInterface): void {
        return;
    };

    processGraph(graphManager: GraphManagerInterface, eventManager: EventManagerInterface): void {
        // 选中状态时，才会执行该方法，否则该方法将被重写
        graphManager.enableEraser(false); // 清除橡皮擦
        graphManager.enableRegionDelete(false); // 清除框选删除
        this.processLayer(graphManager, eventManager);
    };
}

// 展示、选中
export class NomalSelectState extends SelectSuperState {
    protected processLayer(graphManager: GraphManagerInterface, eventManager: EventManagerInterface): void {
        graphManager.addDisplayLayer(this.isChangingSelect, this._index);
    }
}

// 编辑、选中
export class EditingSelectState extends SelectSuperState {
    protected processLayer(graphManager: GraphManagerInterface, eventManager: EventManagerInterface): void {
        graphManager.addEditLayer(
            this.isChangingSelect, this._index, this._select);
    }
}

export class EditingEraserState extends SelectSuperState {
    protected processLayer(graphManager: GraphManagerInterface, eventManager: EventManagerInterface): void {
        const enableEraser = true;
        // 开启橡皮擦
        graphManager.enableEraser(enableEraser);
        graphManager.addEditLayer(
            this.isChangingSelect, this._index, this._select);
    }
}

// 框选删除
export class EditingRegionDeleteState extends SelectSuperState {
    protected _enable: boolean;
    protected _callBack: RegionDeleteCallBack;
    constructor(index: Array<number>, select: SelectEnum, enable: boolean, callBack?: RegionDeleteCallBack) {
        super(index, select)
        this._enable = enable; // 框选删除的状态
        this._callBack = callBack;
    }
    processGraph(graphManager: GraphManagerInterface, eventManager: EventManagerInterface): void {
        graphManager.removeLayer();
        graphManager.enableRegionDelete(this._enable, this._callBack);
    }
}

// 展示
export class NomalNoneState extends SelectSuperState {
    processGraph(graphManager: GraphManagerInterface, eventManager: EventManagerInterface): void {
        graphManager.removeLayer();
        graphManager.enableRegionDelete(false);
    }
}

// 编辑
export class EditingNoneState extends SelectSuperState {
    processGraph(graphManager: GraphManagerInterface, eventManager: EventManagerInterface): void {
        graphManager.removeLayer();
        graphManager.enableRegionDelete(false);
    }
}
