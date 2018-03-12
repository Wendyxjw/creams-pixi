import { GraphManager } from './GraphInterface';
import { ActionManager } from './ActionInterface';
import { OperationManager } from './OperationInterface';
import { StateManager } from './StateInterface';
import { EventManager } from './EventInterface';


// 项目主控制类，单例模式
export default interface AppInterface {
    // 底层绘图接口
    graphManager: GraphManager;

    // 管理用户操作行为
    actionManager: ActionManager;

    // 管理用户普通行为
    operationManager: OperationManager;

    // 事件管理
    eventManager: EventManager;

    // app状态管理
    stateManager: StateManager;
}
