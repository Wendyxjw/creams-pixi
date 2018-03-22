import { ShapeContent, Shape, GraphCache, Point } from "../common/Graph";
// 用户行为
export type Action = {
    do(data: GraphCache): GraphCache;
    unDo(data: GraphCache): GraphCache;
}

export interface ActionInterface {
    /**
     * 清空操作记录
     * @returns void
     */
    emptyDoingList(): void;
    /**
     * 重绘shape
     * @param  {Shape} shape
     * @param  {string} shapeIndex
     */
    updateShape(shape: Shape, shapeIndex: string)
}
