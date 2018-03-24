import { Graph, ShapeContent, GraphCache, Shape } from '../common/Graph';
import { SelectEnum } from '../state/StateInterface';

// 项目基础对外API
export interface GraphManagerInterface {
    eraser: EraserInterface;
    graphContainer: PIXI.Container;
    /**
     * 获得图像数据
     */
    graph: GraphCache;

    setGraph(graph: Graph, cache: GraphCache): void;

    /**
     * 给图块设置显示参数
     * @param  {Array<number>} index, 图块序号
     * @param  {ShapeContent} content?, 显示参数
     * @returns void
     */
    setShapeContent(index: Array<number>, content?: ShapeContent): void;

    /**
     * 触发绘图
     * @returns void
     */
    render(): void;

    /**
     * 增加显示图层
     * @param  {Array<number>} index
     * @returns void
     */
    addDisplayLayer(index: Array<number>): void;

    /**
     * 增加编辑图层
     * @param  {Array<number>} index
     * @param  {SelectEnum} select
     * @returns void
     */
    addEditLayer(index: Array<number>, select: SelectEnum, enableEraser?: boolean): void;

    /**
     * 删除图层
     * @returns void
     */
    removeLayer(): void;

    /**
     * 新建shape
     * @param  {Shape} shape
     * @param  {number} shapeIndex
     * @param  {ShapeContent} content?
     */
    buildShapes(shape: Shape, shapeIndex: number, content?: ShapeContent): void;

    /**
     * 隐藏shape
     * @param  {number} shapeIndex
     * @returns void
     */
    hideShapes(shapeIndex: number): void

    /**
     * 显示shape
     * @param  {number} shapeIndex
     * @returns void
     */
    showShapes(shapeIndex: number): void

    /**
     * 更新shape
     * @param  {Shape} shape
     * @param  {number} shapeIndex
     * @returns void
     */
    updateShapes(shape: Shape, shapeIndex: number): void

    /**
     * 新建shadow：用于店铺匹配
     * @param  {Shape} shape
     * @param  {ShapeContent} content?
     * @returns PIXI
     */
    buildShadowShapes(shape: Shape, content?: ShapeContent): PIXI.Graphics

}

export interface EraserInterface {
    /**
     * 初始化鼠标指针样式
     * @returns void
     */
    enable(): void

    /**
     * 退出橡皮擦模式
     * @returns void
     */
    disable(): void

    /**
     * @param  {number} size
     * @returns void
     */
    setSize(size: number): void
}
