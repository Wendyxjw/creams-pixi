import { Graph, ShapeContent, GraphCache, Shape, SelectEnum, ShapeGraphics } from '../common/Graph';

// 项目基础对外API
export interface GraphManagerInterface {

    graphContainer: PIXI.Container;
    mouseHoverShapeIndex: number;
    /**
     * 获得图像数据
     */
    graph: GraphCache;

    setGraph(graph: Graph, cache: GraphCache): void;

    /**
     * 给图块设置显示参数
     * @param  {number} index, 图块序号
     * @param  {ShapeContent} content?, 显示参数
     * @returns void
     */
    setShapeContent(index: number, content?: ShapeContent): void;

    /**
     * 触发绘图
     * @returns void
     */
    render(): void;

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
     * @param  {boolean} enableEraser?
     * @returns void
     */
    addEditLayer(
        isNeedInit: boolean,
        index: Array<number>,
        select: SelectEnum,
        enableEraser?: boolean
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
     * 隐藏shape
     * @param  {number} shapeIndex
     * @returns void
     */
    // hideShapes(shapeIndex: number): void;

    /**
     * 显示shape
     * @param  {number} shapeIndex
     * @returns void
     */
    // showShapes(shapeIndex: number): void;

    /**
     * 更新shape
     * @param  {Shape} shape
     * @param  {number} shapeIndex
     * @param  {ShapeContent} content?
     * @returns void
     */
    updateShapes(shape: Shape, shapeIndex: number, content?: ShapeContent): void;

    /**
     * 新建shadow：用于店铺匹配
     * @param  {Shape} shape
     * @param  {ShapeContent} content?
     * @returns PIXI
     */
    buildShadowShapes(shape: Shape, content?: ShapeContent): PIXI.Graphics;

    /**
     * @param  {number} x
     * @param  {number} y
     * @param  {number} width
     * @param  {number} height
     * @param  {ShapeContent} content?
     */
    setShadowShape(x: number, y: number, width: number, height: number, content?: ShapeContent): void
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
    (state: SelectEnum, index?: number): void;
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
    erasePoints(points: Array<number>): void;

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
}

export interface ShadowShapeInterface {
    /**
     * 初始化shadowshape
     * @param  {number} x
     * @param  {number} y
     * @param  {number} width
     * @param  {number} height
     * @param  {ShapeContent} content?
     */
    buildShadowShape(x: number, y: number, width: number, height: number, content?: ShapeContent): void;

    /**
     * 鼠标经过shape
     * @param  {number} shapeIndex
     * @returns void
     */
    shapeOver(shapeIndex: number): void

    /**
     * 鼠标离开shape
     * @param  {number} shapeIndex
     * @returns void
     */
    shapeOut(shapeIndex: number): void

    /**
     * 在shape上mouseup
     * @param  {number} shapeIndex
     * @returns void
     */
    shapePionterUp(shapeIndex: number): void

    /**
     * @returns void
     */
    deleteShadowShape(): void
}
