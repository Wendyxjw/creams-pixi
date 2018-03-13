import { GraphAPI } from './GraphInterface';
import { ActionAPI } from './ActionInterface';
import { OperationAPI } from './OperationInterface';
import { StateManager } from './StateInterface';
import { EventAPI } from './EventInterface';


// 项目主控制类，单例模式
export default interface AppInterface {
    // 底层绘图接口
    graphManager: GraphAPI;

    // 管理用户操作行为
    actionManager: ActionAPI;

    // 管理用户普通行为
    operationManager: OperationAPI;

    // 事件管理
    eventManager: EventAPI;

    // app状态管理
    stateManager: StateManager;
}
