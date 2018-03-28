import { Point } from "../common/Graph";
type CallbackFunc = {
    (startPoint: PIXI.Point, endPoint: PIXI.Point): void
}
interface DragableObj extends PIXI.DisplayObject {
    dragData?: PIXI.interaction.InteractionData,
    dragging?: number,
    dragPointerStart?: PIXI.Point,
    dragObjStart?: PIXI.Point,
    dragGlobalStart?: PIXI.Point,
    dragGlobalEnd?: PIXI.Point,
}

function onDragStart(event: PIXI.interaction.InteractionEvent) {
    let obj = <DragableObj>event.currentTarget;
    obj.dragData = event.data;
    obj.dragging = 1;
    obj.dragPointerStart = event.data.getLocalPosition(obj.parent);
    obj.dragObjStart = new PIXI.Point();
    obj.dragObjStart.copy(obj.position);
    obj.dragGlobalStart = new PIXI.Point();
    obj.dragGlobalStart.copy(event.data.global);
}

function onDragEnd(event: PIXI.interaction.InteractionEvent) {
    let obj = <DragableObj>event.currentTarget;
    if (obj.dragging == 1) {
        // toggle(obj);
    } else {
        // snap(obj);
    }
    obj.dragging = 0;
    obj.dragData = null;
    // set the interaction data to null
    obj.dragGlobalEnd = obj.dragGlobalEnd ? obj.dragGlobalEnd : obj.dragGlobalStart;
}

function onDragMove(event: PIXI.interaction.InteractionEvent) {
    let obj = <DragableObj>event.currentTarget;
    if (!obj.dragging) return;
    let data = obj.dragData; // it can be different pointer!
    if (obj.dragging == 1) {
        // click or drag?
        if (Math.abs(data.global.x - obj.dragGlobalStart.x) +
            Math.abs(data.global.y - obj.dragGlobalStart.y) >= 3) {
            // DRAG
            obj.dragging = 2;
        }
    }
    if (obj.dragging == 2) {
        let dragPointerEnd = data.getLocalPosition(obj.parent);
        obj.dragGlobalEnd = new PIXI.Point();
        obj.dragGlobalEnd.copy(event.data.global);
        // DRAG
        obj.position.set(
            obj.dragObjStart.x + (dragPointerEnd.x - obj.dragPointerStart.x),
            obj.dragObjStart.y + (dragPointerEnd.y - obj.dragPointerStart.y)
        );
    }
}

export default function DragHelper(container: PIXI.Container) {
    container.interactive = true;
    container.on('pointerdown', onDragStart)
        .on('pointerup', onDragEnd)
        .on('pointerupoutside', onDragEnd)
        .on('pointermove', onDragMove);
}
