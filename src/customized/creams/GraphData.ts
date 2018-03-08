// 持久化数据结构，数据库、网络通讯中的数据结构。
// T，标识内容，eg: { roomId: string; }
export default interface GraphData<T> {
    // 业务标识符，和Graph.shapes一一匹配
    identifiers: Array<T>;
}
