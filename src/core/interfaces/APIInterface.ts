import { Graph, ShapeContent } from "./Graph";

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

// 项目基础对外API
export interface BasicAPI {
    /**
     * 获得图像数据
     * @returns Graph
     */
    getGraph(): Graph;

    /**
     * 设置图像数据
     * @param  {Graph} graph
     * @returns void
     */
    setGraph(graph: Graph): void;

    /**
     * 是否开启编辑状态
     * @param  {boolean} isEnabled
     * @returns void
     */
    enableEdit(isEnabled: boolean): void;

    /**
     * 给图块设置显示参数
     * @param  {Array<number>} index, 图块序号
     * @param  {ShapeContent} content, 显示参数
     * @returns void
     */
    setShapeContent(index: Array<number>, content: ShapeContent): void;

    /**
     * 触发绘图
     * @returns void
     */
    render(): void;
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
     * @param  {number} size
     * @returns void
     */
    setEraserSize(size: number): void;

    /**
     * 启动橡皮擦，改变状态
     * @param  {boolean} isEnabled
     * @returns void
     */
    enableEraser(isEnabled: boolean): void;
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
    undo(): void;

    /**
     * 重做
     * @returns void
     */
    redo(): void;

    /**
     * 清空操作记录
     * @returns void
     */
    emptyDoingList(): void;
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

// export default interface APIInterface extends BasicAPI, OperationAPI, ActionAPI, EventAPI {}
