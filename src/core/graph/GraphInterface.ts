import { Graph, ShapeContent } from '../common/Graph';

// 项目基础对外API
export interface GraphAPI {
    /**
     * 获得图像数据
     * @returns Graph
     */
    // getGraph(): Graph;

    /**
     * 设置图像数据
     * @param  {Graph} graph
     * @returns void
     */
    setGraph(graph: Graph): void;

    /**
     * 给图块设置显示参数
     * @param  {Array<number>} index, 图块序号
     * @param  {ShapeContent} content, 显示参数
     * @returns void
     */
    setShapeContent(index: Array<number>, content: ShapeContent): void;

    /**
     * 触发绘图
     * @returns void
     */
    render(): void;
}
