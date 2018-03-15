import { ShapeContent, Shape } from "../common/Graph";

// 用户行为
export type Action = {
    do(data: Array<Shape>): Array<Shape>;
    unDo(data: Array<Shape>): Array<Shape>;
}

// Action, 操作行为
export interface ActionAPI {
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

    /**
     * 添加阴影图块，释放鼠标即销毁
     * @param  {number} x
     * @param  {number} y
     * @param  {number} width
     * @param  {number} height
     * @param  {ShapeContent} content?
     * @returns void
     */
    addShadowShape(x: number, y: number, width: number, height: number, content?: ShapeContent): void;

    copyShape(index: Array<number>): void;

    deleteShape(index: Array<number>): void;

    addPoint(index: Array<number>): void;

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
     * 清空操作记录
     * @returns void
     */
    emptyDoingList(): void;
}
