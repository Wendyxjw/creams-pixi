import { GraphManagerInterface } from '../graph/GraphInterface';
import { StateManagerInterface } from '../state/StateInterface';
import { ActionManagerInterface } from '../action/ActionInterface';

// 项目主控制类，单例模式
export default interface AppInterface {
    // pixi对象
    pixiApp: PIXI.Application;

    actionManager: ActionManagerInterface;

    // 底层绘图接口
    graphManager: GraphManagerInterface;

    // app状态管理
    stateManager: StateManagerInterface;
}
