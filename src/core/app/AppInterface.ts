import { GraphManagerInterface } from '../graph/GraphInterface';
import { ActionAPI } from '../action/ActionInterface';
import OperationAPI from '../operation/OperationAPI';
import { StateManagerInterface } from '../state/StateInterface';
import EventAPI from '../event/EventAPI';


// 项目主控制类，单例模式
export default interface AppInterface {
    pixiApp: PIXI.Application;

    // 底层绘图接口
    graphManager: GraphManagerInterface;

    // 管理用户操作行为
    actionManager: ActionAPI;

    // 管理用户普通行为
    operationManager: OperationAPI;

    // 事件管理
    eventManager: EventAPI;

    // app状态管理
    stateManager: StateManagerInterface;
}
