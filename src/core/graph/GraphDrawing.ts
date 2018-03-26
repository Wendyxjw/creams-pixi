import { ShapeContent, Shape, ShapeGraphics, GraphCache } from "../common/Graph";
import { defultGraphStyle } from "./constant";
import AppInterface from "../app/AppInterface";
import { SelectEnum } from "../state/StateInterface";
import { drawShape } from "./DrawingHelper";
import { ShadowShapeInterface } from "./GraphInterface";
export default class GraphDrawing {
    protected _shapeLayer: PIXI.Container;
    protected _graphCache: GraphCache; //保存修改的graph
    protected _app: AppInterface;
    protected _shadowShape: ShadowShapeInterface;
    public graphContainer: PIXI.Container;
    public mouseHoverShapeIndex: number;


    buildShapes(shape: Shape, index: number, content: ShapeContent = defultGraphStyle): void {
        let graphics = new ShapeGraphics();

        graphics = drawShape(graphics, shape, content);
        this._addSelectHandler(graphics, [index]);
        graphics.shapeIndex = index;
        this._shapeLayer.addChild(graphics);
    }

    hideShapes(shapeIndex: number): void {
        this._shapeLayer.children[shapeIndex].visible = false;
    }

    showShapes(shapeIndex: number): void {
        this._shapeLayer.children[shapeIndex].visible = true;
    }

    updateShapes(shape: Shape, shapeIndex: number, content?: ShapeContent) {
        let curShape: PIXI.Graphics;
        curShape = <PIXI.Graphics>this._shapeLayer.children[shapeIndex];
        curShape.clear();
        content = content ? content : this._graphCache.shapesContent[shapeIndex];
        curShape = drawShape(curShape, shape, content);
    }

    //shadowShape
    buildShadowShapes(shape: Shape, content: ShapeContent = defultGraphStyle): PIXI.Graphics {
        let graphics = new PIXI.Graphics();
        graphics = drawShape(graphics, shape, content);
        graphics.x = -1000;
        graphics.y = -1000;
        this.graphContainer.addChild(graphics);
        return graphics;
    }
    private _addSelectHandler(graphics: PIXI.Graphics, index: Array<number>) {
        graphics.interactive = true;
        graphics.on('click', () => {
            this._app.stateManager.select(SelectEnum.Shape, index);
        }).on("mouseover", (event) => {
            this._shadowShape.shapeOver(event.currentTarget.shapeIndex);
        }).on("mouseout", (event) => {
            this._shadowShape.shapeOut(event.currentTarget.shapeIndex);
        }).on("pointerup", (event) => {
            this._shadowShape.shapePionterUp(event.currentTarget.shapeIndex);
        })

    }
}