import { EditToolInterface, SelectHandler, UpdateHandler } from "./GraphInterface";
import { Shape } from "../common/Graph";
import { SelectEnum } from "../state/StateInterface";

export default class EditTool implements EditToolInterface {
    private _layer: PIXI.Container;
    private _selectHandler: SelectHandler;
    private _updateHandler: UpdateHandler;

    constructor(layer: PIXI.Container) {
        this._layer = layer;
        
    }

    erasePoints(points: Array<number>): void {

    }

    init(shape: Array<Shape>, isDisplay?: boolean): void {
    
    }

    addSelectHandler(handler: SelectHandler): void {
        this._selectHandler = handler;
    }

    addUpdateHandler(handler: UpdateHandler): void {
        this._updateHandler = handler;
    }

    select(type: SelectEnum, index: number): void {

    }

    destroy(): void {

    }
}
