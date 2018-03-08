import { Shape } from './Graph';
import { ActionManager, Action } from './ActionInterface';
import { OperationManager } from './OperationInterface';
import { StateManager } from './StateInterface';

// 
export interface GraphManager {
    // 用于绘制基本线条
    tmpShapes: Array<Shape>;
}


