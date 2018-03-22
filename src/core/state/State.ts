import GraphManager from "../graph/GraphManager";

const EditBorder = {
    lineWidth: 4,
    color: 0x7ed321,
};

export enum EditEnum {
    Nomal = 'Nomal',
    Editing = 'Editing',
}

export enum SelectEnum {
    None = 'None',
    Shape = 'Shape',
    Line = 'Line',
    Point = 'Point',
}

export abstract class SelectSuperState {
    protected _index: Array<number>;
    protected _select: SelectEnum;

    constructor(index: Array<number>, select: SelectEnum) {
        this._index = index;
        this._select = select;
    }

    processLayer(graphManager: GraphManager): void {
        return;
    };

    processGraph(graphManager: GraphManager): void {
        this.processLayer(graphManager);
    };
}

// 展示、选中
export class NomalSelectState extends SelectSuperState {
    processLayer(graphManager: GraphManager): void {
        graphManager.addDisplayLayer(this._index);
    }
}

// 编辑、选中
export class EditingSelectState extends SelectSuperState {
    processLayer(graphManager: GraphManager): void {
        graphManager.addEditLayer(this._index, this._select);
    }
}

// 展示
export class NomalNoneState extends SelectSuperState {
    processGraph(graphManager: GraphManager): void {
        graphManager.removeLayer();
    }
}

// 编辑
export class EditingNoneState extends SelectSuperState {
    processGraph(graphManager: GraphManager): void {
        graphManager.removeLayer();
    }
}
