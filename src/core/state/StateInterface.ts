import { GraphManagerInterface, RegionDeleteCallBack } from "../graph/GraphInterface";
import { EventManagerInterface } from "../event/EventInterface";
import { SelectEnum } from "../common/Graph";

export interface StateManagerInterface {
    enableEdit(isEnabled: boolean): void;
    enableEraser(isEnabled: boolean): void;
    select(state: SelectEnum, index: Array<number>): void;
    enableRegionDelete(isEnabled: boolean, callBack?: RegionDeleteCallBack): void;
}

export interface StateInterface {
    isChangingSelect: boolean;
    processGraph(graphManager: GraphManagerInterface, eventManager: EventManagerInterface): void;
}
