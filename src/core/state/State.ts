import { SelectEnum, StateInterface } from "./StateInterface";
import { GraphManagerInterface } from "../graph/GraphInterface";
import { EventManagerInterface } from "../event/EventInterface";
import { EditEnum } from "../common/Graph";

const EditBorder = {
    lineWidth: 4,
    color: 0x7ed321,
};

export abstract class SelectSuperState implements StateInterface {
    protected _index: Array<number>;
    protected _select: SelectEnum;

    public isChangingSelect: boolean = true;

    constructor(index: Array<number>, select: SelectEnum) {
        this._index = index;
        this._select = select;
    }

    protected processLayer(graphManager: GraphManagerInterface, eventManager: EventManagerInterface): void {
        return;
    };

    processGraph(graphManager: GraphManagerInterface, eventManager: EventManagerInterface): void {
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
        eventManager.bindMouseDownLine(EditEnum.Editing);
        eventManager.bindMouseUpLine(EditEnum.Editing);
        eventManager.bindMouseDownPoint(EditEnum.Editing);
        eventManager.bindMouseUpPoint(EditEnum.Editing);
        eventManager.bindMouseUpShape(EditEnum.Editing);

        graphManager.addEditLayer(
            this.isChangingSelect, this._index, this._select);
    }
}

export class EditingEraserState extends SelectSuperState {
    protected processLayer(graphManager: GraphManagerInterface, eventManager: EventManagerInterface): void {
        const enableEraser = true;
        graphManager.addEditLayer(
            this.isChangingSelect, this._index, this._select, enableEraser);
    }
}

// 展示
export class NomalNoneState extends SelectSuperState {
    processGraph(graphManager: GraphManagerInterface, eventManager: EventManagerInterface): void {
        eventManager.bindClickGraph(EditEnum.Nomal);
        eventManager.bindMouseEnterShape(EditEnum.Nomal);
        eventManager.bindMouseLeaveShape(EditEnum.Nomal);
        eventManager.bindMouseDownShape(EditEnum.Nomal);
        eventManager.bindMouseMoveShape(EditEnum.Nomal);

        graphManager.removeLayer();
    }
}

// 编辑
export class EditingNoneState extends SelectSuperState {
    processGraph(graphManager: GraphManagerInterface, eventManager: EventManagerInterface): void {
        eventManager.bindClickGraph(EditEnum.Editing);
        eventManager.bindMouseEnterShape(EditEnum.Editing);
        eventManager.bindMouseLeaveShape(EditEnum.Editing);
        eventManager.bindMouseUpShape(EditEnum.Editing);

        graphManager.removeLayer();
    }
}
