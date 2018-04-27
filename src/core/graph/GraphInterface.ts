import { Graph, ShapeContent, GraphCache, Shape, SelectEnum, ShapeGraphics } from '../common/Graph';

export type setGraphCallback = {
    (): void;
}

// 项目基础对外API
export interface GraphManagerInterface {

    graphContainer: PIXI.Container;
    mouseHoverShapeIndex: number;
    /**
     * 获得图像数据
     */
    graph: GraphCache;

    /**
     * 初始化画布
     * @param  {Graph} graph
     * @param  {GraphCache} cache
     * @param  {CallbackFunc} callBack?
     * @returns void
     */
    setGraph(graph: Graph, cache: GraphCache, callBack?: setGraphCallback): void;

    /**
     * 给图块设置显示参数
     * @param  {number} index, 图块序号
     * @param  {ShapeContent} content?, 显示参数
     * @returns void
     */
    setShapeContent(index: number, content?: ShapeContent): void;

    /**
     * 增加显示图层
     * @param  {boolean} isNeedInit
     * @param  {Array<number>} index
     * @returns void
     */
    addDisplayLayer(isNeedInit: boolean, index: Array<number>): void;

    /**
     * 增加编辑图层
     * @param  {boolean} isNeedInit, // 更换shape时 需要重绘
     * @param  {Array<number>} index
     * @param  {SelectEnum} select
     * @returns void
     */
    addEditLayer(
        isNeedInit: boolean,
        index: Array<number>,
        select: SelectEnum,
    ): void;

    /**
     * 删除图层
     * @returns void
     */
    removeLayer(): void;

    /**
     * 设置橡皮擦大小
     * @param  {number} size
     * @returns void
     */
    setEraserSize(size: number): void;

    /**
     * 新建shape
     * @param  {Shape} shape
     * @param  {number} shapeIndex
     * @param  {ShapeContent} content?
     */
    buildShapes(shape: Shape, shapeIndex: number, content?: ShapeContent): ShapeGraphics;

    /**
     * 删除shape
     * @param  {string} name
     * @returns void
     */
    deleteShapes(name: string): void

    /**
     * 更新shape
     * @param  {Shape} shape
     * @param  {number} shapeIndex
     * @param  {ShapeContent} content?
     * @param  {boolean} keepIndex? 是否保持当前index
     * @returns void
     */
    updateShapes(shape: Shape, shapeIndex: number, content?: ShapeContent, keepIndex?: boolean): void;

    /**
     * 新建shadow：用于店铺匹配
     * @param  {Shape} shape
     * @param  {ShapeContent} content?
     * @returns PIXI
     */
    buildShadowShapes(shape: Shape, content?: ShapeContent): PIXI.Graphics;

    /**
     * 添加跟随鼠标的shape
     * @param  {number} width
     * @param  {number} height
     * @param  {ShapeContent} content?
     */
    setShadowShape(width: number, height: number, content?: ShapeContent): void

    /**
     * 删除跟随鼠标的shape
     * @returns void
     */
    deleteShadowShape(): void

    /**
     * 在边上加点
     * @param  {number} lineIndex
     * @returns void
     */
    addPoint(lineIndex: number): void;

    /**
     * 控制橡皮擦状态
     * @param  {boolean} isEnabled
     * @returns void
     */
    enableEraser(isEnabled: boolean): void;

    /**
     * 开启关闭框选删除
     * @param  {boolean} isEnabled
     * @returns void
     */
    enableRegionDelete(isEnabled: boolean, callBack?: RegionDeleteCallBack): void
}

export interface EraserInterface {
    /**
     * 初始化鼠标指针样式
     * @returns void
     */
    enable(): void

    /**
     * 退出橡皮擦模式
     * @returns void
     */
    disable(): void

    /**
     * @param  {number} size
     * @returns void
     */
    setSize(size: number): void
}

export type SelectHandler = {
    (target: PIXI.Graphics, state: SelectEnum, index?: number): void;
}

export type UpdateHandler = {
    (shape: Shape): void;
}

export interface EditToolInterface {

    /**
     * 擦除点，通知action和graph
     * @param  {Array<number>} points // point index array
     * @returns void
     */
    erasePoints(): Function;

    /**
     * 初始化编辑层，
     * @param  {Shape} shape
     * @param  {ShapeContent} content
     * @param  {boolean} isDisplay? // 是否只是显示
     * @returns void
     */
    init(shape: Shape, content: ShapeContent, isDisplay?: boolean): void;

    /**
     * 选中的回调方法
     * @param  {SelectHandler} handler
     * @returns void
     */
    addSelectHandler(handler: SelectHandler): void;

    /**
     * 更新的回调方法
     * @param  {UpdateHandler} handler
     * @returns void
     */
    addUpdateHandler(handler: UpdateHandler): void;

    /**
     * 绑定拖拽方法，高亮某一部分，选中整块不需要传index
     * @param  {SelectEnum} type
     * @param  {number} index? // 边或者点的index
     * @returns void
     */
    select(type: SelectEnum, index?: number): void;

    /**
     * 清空内部元素
     * @returns void
     */
    destroy(): void;

    /**
     * 在边上加点
     * @param  {number} lineIndex
     * @returns void
     */
    addPoint(lineIndex: number): void;
}

export interface ShadowShapeInterface {
    /**
     * 初始化shadowshape
     * @param  {number} width
     * @param  {number} height
     * @param  {ShapeContent} content?
     */
    buildShadowShape(width: number, height: number, content?: ShapeContent): void;

    /**
     * @returns void
     */
    destroyShadowShape(): void
}

export type RegionDeleteCallBack = {
    (shapeIndex: Array<number>): void;
}
export interface RegionDeleteInterface {
    /**
     * 开启关闭框选删除模式
     * @param  {boolean} isEnabled
     * @param  {RegionDeleteCallBack} callBack?
     * @returns void
     */
    enable(isEnabled: boolean, callBack?: RegionDeleteCallBack): void;
}
