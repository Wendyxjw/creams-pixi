import { ShapeContent, Graph } from "../common/Graph";


// Action, 操作行为
export default interface ActionAPI {
    // Actions
    /**
     * 添加图块
     * @param  {number} x
     * @param  {number} y
     * @param  {number} width
     * @param  {number} height
     * @param  {ShapeContent} content?
     * @returns void
     */
    addShape(x: number, y: number, width: number, height: number, content?: ShapeContent): void;

    copyShape(index: string): void;

    deleteShape(index: string): void;

    // addPoint(index: Array<number>): void;

    /**
     * 撤销
     * @returns void
     */
    unDo(): void;

    /**
     * 重做
     * @returns void
     */
    reDo(): void;

    /**
     * @returns GraphCache
     */
    getCurrentData(): Graph;

    /**
     * 启用编辑模式
     * @param  {GraphCache} data
     * @returns void
     */
    init(data: Graph): void
}
