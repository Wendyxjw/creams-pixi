type MouseEvent = {
    // TODO: 应该外部定义导入
}

type CallbackFunc = {
    /**
     * @param  {Array<number>} index, target对象的index数组
     * @param  {MouseEvent} event, PIXI的点击事件
     * @returns void
     */
    (index: Array<number>, event: MouseEvent): void;
}

// 事件接口
export interface EventAPI {
    onClickGraph(callback: CallbackFunc): void;

    onMouseEnterShape(callback: CallbackFunc): void;

    onMouseLeaveShape(callback: CallbackFunc): void;

    onMouseDownShape(callback: CallbackFunc): void;

    onMouseUpShape(callback: CallbackFunc): void;

    onMouseDownLine(callback: CallbackFunc): void;

    onMouseUpLine(callback: CallbackFunc): void;

    onMouseDownPoint(callback: CallbackFunc): void;

    onMouseUpPoint(callback: CallbackFunc): void;
}
