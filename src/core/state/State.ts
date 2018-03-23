import { SelectEnum, StateInterface } from "./StateInterface";
import { GraphManagerInterface } from "../graph/GraphInterface";

const EditBorder = {
    lineWidth: 4,
    color: 0x7ed321,
};

export abstract class SelectSuperState implements StateInterface {
    protected _index: Array<number>;
    protected _select: SelectEnum;

    constructor(index: Array<number>, select: SelectEnum) {
        this._index = index;
        this._select = select;
    }

    processLayer(graphManager: GraphManagerInterface): void {
        return;
    };

    processGraph(graphManager: GraphManagerInterface): void {
        this.processLayer(graphManager);
    };
}

// 展示、选中
export class NomalSelectState extends SelectSuperState {
    processLayer(graphManager: GraphManagerInterface): void {
        graphManager.addDisplayLayer(this._index);
    }
}

// 编辑、选中
export class EditingSelectState extends SelectSuperState {
    processLayer(graphManager: GraphManagerInterface): void {
        graphManager.addEditLayer(this._index, this._select);
    }
}

export class EditingEraserState extends SelectSuperState {
    processLayer(graphManager: GraphManagerInterface): void {
        const enableEraser = true;
        graphManager.addEditLayer(this._index, this._select, enableEraser);
    }
}

// 展示
export class NomalNoneState extends SelectSuperState {
    processGraph(graphManager: GraphManagerInterface): void {
        graphManager.removeLayer();
    }
}

// 编辑
export class EditingNoneState extends SelectSuperState {
    processGraph(graphManager: GraphManagerInterface): void {
        graphManager.removeLayer();
    }
}
