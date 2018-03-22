import { Shape, Graph } from "../common/Graph";
// 用户行为
export type ActionInterface = {
    do(data: Graph): Graph;
    unDo(data: Graph): Graph;
}

export interface ActionManagerInterface {
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
