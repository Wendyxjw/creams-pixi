import ActionAPI from "../action/ActionAPI";
import OperationAPI from "../operation/OperationAPI";
import EventAPI from "../event/EventAPI";
import { Graph, GraphCache } from "../common/Graph";
import { setGraphCallback } from "../graph/GraphInterface";

export default interface AppAPI {
    // 管理用户操作行为
    actionManager: ActionAPI;

    // 管理用户普通行为
    operationManager: OperationAPI;

    // 事件管理
    eventManager: EventAPI;

    /**
     * @param  {Graph} graph
     * @param  {GraphCache} cache
     * @param  {setGraphCallback} callBack?
     * @returns void
     */
    setGraph(graph: Graph, cache: GraphCache, callBack?: setGraphCallback): void;
}
