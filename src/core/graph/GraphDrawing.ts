import { ShapeContent, Shape, ShapeGraphics, GraphCache } from "../common/Graph";
import { defultGraphStyle } from "./constant";
import AppInterface from "../app/AppInterface";
import { SelectEnum } from "../state/StateInterface";

export default class GraphDrawing {
    protected _shapeLayer: PIXI.Container;
    public graphContainer: PIXI.Container;
    protected _graphCache: GraphCache; //保存修改的graph
    protected _app: AppInterface;

    //画shape 新增和修改shape调用
    private _drawShape(graphics: PIXI.Graphics, shape: Shape, content: ShapeContent = defultGraphStyle) {
        // set a fill and line style
        graphics.beginFill(content.backgroundColor, 1);
        graphics.lineStyle(content.border.lineWidth, content.border.color, 1);
        // draw a shape
        graphics.moveTo(shape[0][0], shape[0][1]);
        for (let i = 1; i < shape.length; i++) {
            graphics.lineTo(shape[i][0], shape[i][1]);
        }
        graphics.lineTo(shape[0][0], shape[0][1]);
        graphics.endFill();
        return graphics
    }
    buildShapes(shape: Shape, index: number, content: ShapeContent = defultGraphStyle): void {
        let graphics = new ShapeGraphics();

        graphics = this._drawShape(graphics, shape, content);
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

    updateShapes(shape: Shape, shapeIndex: number) {
        let curShape: PIXI.Graphics;
        curShape = <PIXI.Graphics>this._shapeLayer.children[shapeIndex];
        curShape.clear();
        curShape = this._drawShape(curShape, shape, this._graphCache.shapesContent[shapeIndex])
    }

    //shadowShape
    buildShadowShapes(shape: Shape, content: ShapeContent = defultGraphStyle): PIXI.Graphics {
        let graphics = new PIXI.Graphics();
        graphics = this._drawShape(graphics, shape, content);
        graphics.x = -1000;
        graphics.y = -1000;
        this.graphContainer.addChild(graphics);
        return graphics;
    }
    private _addSelectHandler(graphics: PIXI.Graphics, index: Array<number>) {
        graphics.interactive = true;
        graphics.on('click', () => {
            this._app.stateManager.select(SelectEnum.Shape, index);
        })
    }
}