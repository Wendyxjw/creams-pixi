import { Shape } from './Graph';
import { GraphAPI } from './APIInterface';

// 
export interface GraphManager extends GraphAPI {
    // 用于绘制基本线条
    tmpShapes: Array<Shape>;
}


