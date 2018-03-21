// 用户普通行为
export type Operation = {

}

// Operations, 普通行为
export interface OperationAPI {
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
}
