import { EditLayerInterface } from "./GraphInterface";
import { Shape } from "../common/Graph";
import { SelectEnum } from "../state/StateInterface";

export default class EditLayer implements EditLayerInterface{
    erasePoints(points: Array<number>): void {

    }

    init(shape: Array<Shape>, isDisplay?: boolean): void {
    
    }

    addSelectHandler(): void {

    }

    select(type: SelectEnum, index: number): void {

    }

    destroy(): void {

    }
}
