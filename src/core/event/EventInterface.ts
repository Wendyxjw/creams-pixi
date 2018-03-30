import { EditEnum } from "../common/Graph";
export type EventFunc = {
    (event: PIXI.interaction.InteractionEvent): void
}
export interface EventManagerInterface {
    /**
     * @param  {EditEnum} editType
     * @returns void
     */
    bindClickGraph(editType: EditEnum): void

    /**
     * @param  {EditEnum} editType
     * @returns void
     */
    bindMouseEnterShape(editType: EditEnum): void

    /**
     * @param  {EditEnum} editType
     * @returns void
     */
    bindMouseLeaveShape(editType: EditEnum): void

    /**
     * @param  {EditEnum} editType
     * @returns void
     */
    bindMouseMoveShape(editType: EditEnum): void

    /**
     * @param  {EditEnum} editType
     * @returns void
     */
    bindMouseDownShape(editType: EditEnum): void

    /**
     * @param  {EditEnum} editType
     * @returns void
     */
    bindMouseUpShape(editType: EditEnum): void

    /**
     * @param  {EditEnum} editType
     * @returns void
     */
    bindMouseDownLine(editType: EditEnum): void

    /**
     * @param  {EditEnum} editType
     * @returns void
     */
    bindMouseUpLine(editType: EditEnum): void

    /**
     * @param  {EditEnum} editType
     * @returns void
     */
    bindMouseDownPoint(editType: EditEnum): void

    /**
     * @param  {EditEnum} editType
     * @returns void
     */
    bindMouseUpPoint(editType: EditEnum): void
}