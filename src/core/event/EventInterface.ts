import { EditEnum, SelectEnum } from "../common/Graph";

export type EventFunc = {
    (event: PIXI.interaction.InteractionEvent): void
}
export interface EventManagerInterface {
    /**
     * state调用
     * @param  {EditEnum} state
     * @returns void
     */
    setEditState(state: EditEnum): void;

    /**
     * setGraph时用
     * @returns void
     */
    bindAllHandler(): void;

    /**
     * 新增shape line时调用
     * @param  {SelectEnum} selectType
     * @param  {PIXI.Graphics} target
     * @returns void
     */
    bindHandler(selectType: SelectEnum, target: PIXI.Graphics): void;
}