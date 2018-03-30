import { GraphManagerInterface } from "../graph/GraphInterface";
import { EventManagerInterface } from "../event/EventInterface";

export enum SelectEnum {
    None = 'None',
    Shape = 'Shape',
    Line = 'Line',
    Point = 'Point',
}

export interface StateManagerInterface {
    enableEdit(isEnabled: boolean): void;
    enableEraser(isEnabled: boolean): void;
    select(state: SelectEnum, index: Array<number>): void;
}

export interface StateInterface {
    isChangingSelect: boolean;
    processGraph(graphManager: GraphManagerInterface, eventManager: EventManagerInterface): void;
}
