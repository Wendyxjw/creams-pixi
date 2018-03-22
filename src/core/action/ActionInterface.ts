import { ShapeContent, Shape, GraphCache, Point } from "../common/Graph";
// 用户行为
export type Action = {
    do(data: GraphCache): GraphCache;
    unDo(data: GraphCache): GraphCache;
}

export interface ActionInterface {
    do(data: GraphCache): GraphCache;
    unDo(data: GraphCache): GraphCache;
}
