import { ShapeContent, Shape, ShapeGraphics, GraphCache, SelectEnum } from "../common/Graph";
import { defultGraphStyle } from "./constant";
import AppInterface from "../app/AppInterface";
import { drawShape } from "./DrawingHelper";
import { ShadowShapeInterface } from "./GraphInterface";
import ShadowShape from "./ShadowShape";

export default class GraphDrawing {
    protected _shapeLayer: PIXI.Container;
    protected _graphCache: GraphCache; //保存修改的graph
    protected _app: AppInterface;
    protected _shadowShape: ShadowShapeInterface;
    public graphContainer: PIXI.Container;
    public mouseHoverShapeIndex: number;

    public get graph(): GraphCache {
        return this._graphCache;
    }
    public set graph(v: GraphCache) {
        this._graphCache = v;
    }

    constructor(app: AppInterface) {
        this._app = app;
        this._graphCache = {
            background: {
                url: "",
            },
            shapesContent: {}
        };
        this.graphContainer = new PIXI.Container();
        this.graphContainer.hitArea = new PIXI.Rectangle(-10000000, -10000000, 100000000000000, 100000000000000);
        this._shapeLayer = new PIXI.Container();
        this._shapeLayer.name = "shapeLayer";

        this.graphContainer.addChild(this._shapeLayer);
        app.pixiApp.stage.addChild(this.graphContainer);
        this._shadowShape = new ShadowShape(app);

    }

    buildShapes(shape: Shape, index: number, content: ShapeContent = defultGraphStyle): ShapeGraphics {
        if (!shape) {
            return;
        }
        if (shape.length < 1) {
            return;
        }

        let graphics = new ShapeGraphics();

        graphics = drawShape(graphics, shape, this.graphContainer.scale.x, content);
        this._addSelectHandler(graphics, [index]);
        graphics.name = index.toString();
        graphics.shapeIndex = index;
        this._shapeLayer.addChild(graphics);
        return graphics;
    }

    deleteShapes(name: string) {
        this._shapeLayer.removeChild(this._shapeLayer.getChildByName(name));
    }

    // hideShapes(shapeIndex: number): void {
    //     this._shapeLayer.getChildByName(shapeIndex.toString()).visible = false;
    // }

    // showShapes(shapeIndex: number): void {
    //     this._shapeLayer.getChildByName(shapeIndex.toString()).visible = true;
    // }

    updateShapes(shape: Shape, shapeIndex: number, content?: ShapeContent, keepIndex?: boolean) {
        let curShape: PIXI.Graphics;
        curShape = <PIXI.Graphics>this._shapeLayer.getChildByName(shapeIndex.toString());
        curShape.clear();
        content = content ? content : this._graphCache.shapesContent[shapeIndex];
        curShape = drawShape(curShape, shape, this.graphContainer.scale.x, content);
        if (!keepIndex) {
            this._shapeLayer.setChildIndex(curShape, this._shapeLayer.children.length - 1);
        }
    }

    //shadowShape
    buildShadowShapes(shape: Shape, content: ShapeContent = defultGraphStyle): PIXI.Graphics {
        let graphics = new PIXI.Graphics();
        // 放大缩小对shadowShape没有影响 所以textScale传1
        graphics = drawShape(graphics, shape, 1, content);
        graphics.x = -1000;
        graphics.y = -1000;
        this.graphContainer.addChild(graphics);
        return graphics;
    }

    private _addSelectHandler(graphics: PIXI.Graphics, index: Array<number>) {
        graphics.interactive = true;
        let hasMouseUp = true;
        graphics.on('pointerdown', (event: PIXI.interaction.InteractionEvent) => {
            hasMouseUp = true;
            setTimeout(() => {
                hasMouseUp = false
            }, 500);
        })
        graphics.on('pointerup', (event: PIXI.interaction.InteractionEvent) => {
            if (hasMouseUp) {
                this._app.stateManager.select(SelectEnum.Shape, index);
            }
        })
    }
}