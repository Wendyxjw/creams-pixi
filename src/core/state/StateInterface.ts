import { GraphManagerInterface } from "../graph/GraphInterface";

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

export interface StateManagerInterface {
    enableEdit(isEnabled: boolean): void;
    enableEraser(isEnabled: boolean): void;
    select(state: SelectEnum, index: Array<number>): void;
}

export interface StateInterface {
    processGraph(graphManager: GraphManagerInterface): void;
}
