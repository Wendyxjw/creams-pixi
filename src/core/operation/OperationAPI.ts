import { ShapeContent } from "../common/Graph";

// 用户普通行为
export type Operation = {

}

// Operations, 普通行为
export default interface OperationAPI {
    /**
     * 图像放大
     * @param  {number} level?, 放大等级，不填则放大一级
     * @returns void
     */
    zoomIn(level?: number): void;

    /**
     * 图像缩小
     * @param  {number} level?, 缩小等级，不填则缩小一级
     * @returns void
     */
    zoomOut(level?: number): void;

    /**
     * 图像居中对齐
     * @returns void
     */
    justify(): void;

    /**
     * 设置橡皮擦大小
     * @param  {number} size,半径
     * @returns void
     */
    setEraserSize(size: number): void;

    /**
     * 启动橡皮擦，改变状态
     * @param  {boolean} isEnabled
     * @returns void
     */
    enableEraser(isEnabled: boolean): void;

    /**
     * 是否开启编辑状态
     * @param  {boolean} isEnabled
     * @returns void
     */
    enableEdit(isEnabled: boolean): void;

    /**
     * 给图块设置显示参数
     * @param  {Array<number>} index, 图块序号
     * @param  {ShapeContent} content?, 显示参数
     * @returns void
     */
    setShapeContent(index: Array<number>, content?: ShapeContent): void;

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
}
