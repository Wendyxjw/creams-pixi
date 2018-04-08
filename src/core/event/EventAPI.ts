import { EditEnum } from "../common/Graph";

type MouseEvent = {
    x: number,//mouse:position
    y: number,
    target?: { // shape:position
        xMin: number,
        xMax: number,
        yMin: number,
        yMax: number
    }
}

export type CallbackFunc = {
    /**
     * @param  {Array<number>} index, target对象的index数组
     * @param  {MouseEvent} event, PIXI的点击事件
     * @returns void
     */
    (index: Array<number>, event: MouseEvent, editType?: EditEnum): void;
}
export type Events = {
    clickGraph: CallbackFunc;
    mouseEnterShape: CallbackFunc;
    mouseLeaveShape: CallbackFunc;
    mouseDownShape: CallbackFunc;
    mouseUpShape: CallbackFunc;
    mouseDownLine: CallbackFunc;
}
// 事件接口
export default interface EventAPI {
    /**
     * 整个图形 click :普通模式 编辑模式
     * @param  {CallbackFunc} callback
     * @returns void
     */
    onClickGraph(callback: CallbackFunc): void;

    /**
     * 单个图形 MouseEnter：普通模式（出现popup） 编辑模式（shape的颜色根据shadowShape设置）
     * @param  {CallbackFunc} callback
     * @returns void
     */
    onMouseEnterShape(callback: CallbackFunc): void;

    /**
     * 单个图形 MouseLeave：普通模式（popup消失） 编辑模式（shape的颜色恢复原来的颜色）
     * @param  {CallbackFunc} callback
     * @returns void
     */
    onMouseLeaveShape(callback: CallbackFunc): void;

    /**
     * 单个图形 MouseDown：普通模式（弹出右侧店铺介绍）
     * @param  {CallbackFunc} callback
     * @returns void
     */
    onMouseDownShape(callback: CallbackFunc): void;

    /**
     * 单个图形 MouseUp：编辑模式（shadowShape开启，如果在shape上面mouseup，需要updateShape）
     * @param  {CallbackFunc} callback
     * @returns void
     */
    onMouseUpShape(callback: CallbackFunc): void;

    /**
     * 图形的线 MouseDown： 编辑模式
     * @param  {CallbackFunc} callback
     * @returns void
     */
    onMouseDownLine(callback: CallbackFunc): void;

    /**
     * 图形的线 MouseUp：编辑模式（出现添加点按钮）
     * @param  {CallbackFunc} callback
     * @returns void
     */
    // onMouseUpLine(callback: CallbackFunc): void;
}
