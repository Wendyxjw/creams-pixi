import { ShapeContent, Shape, ShapeGraphics, GraphCache } from "../common/Graph";
import { defultGraphStyle } from "./constant";
import AppInterface from "../app/AppInterface";
import { SelectEnum } from "../state/StateInterface";
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
            backgroundPic: "",
            shapesContent: []
        };
        this.graphContainer = new PIXI.Container();
        this._shapeLayer = new PIXI.Container();

        this.graphContainer.addChild(this._shapeLayer);
        app.pixiApp.stage.addChild(this.graphContainer);
        this._shadowShape = new ShadowShape(app);
    }

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
        graphics.on('pointerdown', (event: PIXI.interaction.InteractionEvent) => {
            event.stopPropagation();
            this._app.stateManager.select(SelectEnum.Shape, index);
        }).on("mouseover", (event: PIXI.interaction.InteractionEvent) => {
            let curTarget: ShapeGraphics = <ShapeGraphics>event.currentTarget;
            this._shadowShape.shapeOver(curTarget.shapeIndex);
        }).on("mouseout", (event: PIXI.interaction.InteractionEvent) => {
            let curTarget: ShapeGraphics = <ShapeGraphics>event.currentTarget;
            this._shadowShape.shapeOut(curTarget.shapeIndex);
        }).on("pointerup", (event: PIXI.interaction.InteractionEvent) => {
            let curTarget: ShapeGraphics = <ShapeGraphics>event.currentTarget;
            this._shadowShape.shapePionterUp(curTarget.shapeIndex);
        })

    }
}