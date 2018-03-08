// 用户行为
export type Action = {

}

// 用户行为管理，undo、redo
export interface ActionManager {
    // 用户操作记录
    actionHistory: Array<Action>;
}
