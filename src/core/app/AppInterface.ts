import { GraphManagerInterface } from '../graph/GraphInterface';
import { StateManagerInterface } from '../state/StateInterface';
import { ActionManagerInterface } from '../action/ActionInterface';
import { Graph, GraphCache } from '../common/Graph';
import { EventManagerInterface } from '../event/EventInterface';

// 项目主控制类，单例模式
export default interface AppInterface {

    graph: Graph;

    cache: GraphCache;
    // pixi对象
    pixiApp: PIXI.Application;

    // 用户操作行为
    actionManager: ActionManagerInterface;

    // 底层绘图接口
    graphManager: GraphManagerInterface;

    // app状态管理
    stateManager: StateManagerInterface;

    // 事件管理
    eventManager: EventManagerInterface;
}
