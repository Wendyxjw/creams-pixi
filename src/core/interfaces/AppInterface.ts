import { Shape } from './Graph';
import { GraphManager } from './GraphInterface';
import { ActionManager, Action } from './ActionInterface';
import { OperationManager } from './OperationInterface';
import { StateManager } from './StateInterface';


// 项目主控制类，单例模式
interface AppInterface {
    // 底层绘图接口
    graphManager: GraphManager;

    // 管理用户操作行为
    actionManager: ActionManager;

    // 管理用户普通行为
    operationManager: OperationManager;

    // app状态管理
    stateManager: StateManager;
}

class App implements AppInterface {

    actionManager: ActionManager;
    graphManager: GraphManager;
    operationManager: OperationManager;
    stateManager: StateManager;

    onZoomIn() { }
}



let app = new App();

app.onZoomIn()
// app.onShapeDeleted()
// app.onShapeMoveEnd((roomId, shapeIndex, graphData) => {

// })