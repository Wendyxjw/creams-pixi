import { Shape, Graph } from "../common/Graph";
import { ActionEvent } from "./ActionAPI";
// 用户行为
export type ActionInterface = {
    do(data: Graph): Graph;
    unDo(data: Graph): Graph;
    shapeIndex: Array<number>;
    actionEvent: ActionEvent;
}

export interface ActionManagerInterface {
    /**
     * 清空操作记录
     * @returns void
     */
    emptyDoingList(): void;

    /**
     * 重绘shape
     * @param  {Shape} shape
     * @param  {number} shapeIndex
     */
    updateShape(shape: Shape, shapeIndex: number): void;

    /**
     * 获取指定shape
     * @param  {number} shapeIndex
     * @returns Shape
     */
    getCurrentShape(shapeIndex: number): Shape;

    /**
     * 批量删除
     * @param  {Array<number>} shapeIndex
     * @returns void
     */
    deleteShape(shapeIndex: Array<number>): void;
}
