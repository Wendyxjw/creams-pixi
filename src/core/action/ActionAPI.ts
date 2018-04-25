import { ShapeContent, Graph, Shape } from "../common/Graph";

export enum ActionEvent {
    Add = "add", // 拷贝（新增的shapeIndex）和添加
    Delete = "delete", // 删除
    Update = "update" // 更新
}
export type CallbackFunc = {
    (shapeIndex: Array<number>, event: ActionEvent): void;
}

//导出CurrentData
export type GraphOrder = {
    shapes: Array<Shape>,
    order: Array<number> // shape排序
}
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

    copyShape(shapeIndex: number): void;

    deleteShape(shapeIndex: Array<number>): void;

    // addPoint(index: Array<number>): void;

    /**
     * 撤销
     * @param  {CallbackFunc} callback?
     * @returns void
     */
    unDo(callback: CallbackFunc): void;

    /**
     * 重做
     * @param  {CallbackFunc} callback?
     * @returns void
     */
    reDo(callback?: CallbackFunc): void;

    /**
     * @returns GraphCache
     */
    getCurrentData(): Graph;

    /**
     * 启用编辑模式
     * @param  {GraphCache} data
     * @returns void
     */
    init(data: Graph): void;
}
