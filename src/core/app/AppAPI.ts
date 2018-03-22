import ActionAPI from "../action/ActionAPI";
import OperationAPI from "../operation/OperationAPI";
import EventAPI from "../event/EventAPI";

export default interface AppAPI {
    // 管理用户操作行为
    actionManager: ActionAPI;

    // 管理用户普通行为
    operationManager: OperationAPI;

    // 事件管理
    eventManager: EventAPI;
}
