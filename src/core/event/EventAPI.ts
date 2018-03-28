type MouseEvent = {
    // TODO: 应该外部定义导入
    x: number,//shape的定位
    y: number
}

export type CallbackFunc = {
    /**
     * @param  {Array<number>} index, target对象的index数组
     * @param  {MouseEvent} event, PIXI的点击事件
     * @returns void
     */
    (index: Array<number>, event: MouseEvent): void;
}

// 事件接口
export default interface EventAPI {
    /**
     * 整个图形 click
     * @param  {CallbackFunc} callback
     * @returns void
     */
    onClickGraph(callback: CallbackFunc): void;

    /**
     * 单个图形 MouseEnter
     * @param  {CallbackFunc} callback
     * @returns void
     */
    onMouseEnterShape(callback: CallbackFunc): void;

    /**
     * 单个图形 MouseLeave
     * @param  {CallbackFunc} callback
     * @returns void
     */
    onMouseLeaveShape(callback: CallbackFunc): void;

    /**
     * @param  {CallbackFunc} callback
     * @returns void
     */
    onMouseMoveShape(callback: CallbackFunc): void;

    /**
     * 单个图形 MouseDown
     * @param  {CallbackFunc} callback
     * @returns void
     */
    onMouseDownShape(callback: CallbackFunc): void;

    /**
     * 单个图形 MouseUp
     * @param  {CallbackFunc} callback
     * @returns void
     */
    onMouseUpShape(callback: CallbackFunc): void;

    /**
     * @param  {CallbackFunc} callback
     * @returns void
     */
    onMouseDownLine(callback: CallbackFunc): void;

    /**
     * 图形的线 MouseUp
     * @param  {CallbackFunc} callback
     * @returns void
     */
    onMouseUpLine(callback: CallbackFunc): void;

    /**
     * 图形的点 MouseDown
     * @param  {CallbackFunc} callback
     * @returns void
     */
    onMouseDownPoint(callback: CallbackFunc): void;

    /**
     * 图形的点 MouseUp
     * @param  {CallbackFunc} callback
     * @returns void
     */
    onMouseUpPoint(callback: CallbackFunc): void;
}
