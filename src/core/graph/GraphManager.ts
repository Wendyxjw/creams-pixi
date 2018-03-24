
import { GraphManagerInterface, EraserInterface } from "./GraphInterface";
import { Graph, ShapeContent, Shape, ShapeGraphics, GraphCache, Point, PointGraphics, } from "../common/Graph";
import GraphHelper from "./GraphHelper";
import { SelectEnum } from "../state/StateInterface";
import AppInterface from "../app/AppInterface";
import { defultGraphStyle } from "./constant";
import Eraser from "./Eraser"
export default class GraphManager implements GraphManagerInterface {
    private _app: AppInterface;
    private _graphCache: GraphCache; //保存修改的graph
    private _extraLayer: PIXI.Container;
    private _shapeLayer: PIXI.Container;
    private _backgroundLayer: PIXI.Container;

    public eraser: EraserInterface;
    public graphContainer: PIXI.Container;

    public get graph(): GraphCache {
        return this._graphCache;
    }

    public set graph(v: GraphCache) {
        this._graphCache = v;
    }

    constructor(app: AppInterface) {
        this._app = app;
        this._backgroundLayer = new PIXI.Container();
        this._shapeLayer = new PIXI.Container();
        this._extraLayer = new PIXI.Container();

        this.graphContainer = new PIXI.Container();
        this.graphContainer.addChild(this._backgroundLayer);
        this.graphContainer.addChild(this._shapeLayer);
        this.graphContainer.addChild(this._extraLayer);

        this._extraLayer.visible = false;
        this.graphContainer.interactive = true;
        GraphHelper.enableDrag(this.graphContainer);
        app.pixiApp.stage.addChild(this.graphContainer);
        this._graphCache = {
            backgroundPic: "",
            shapesContent: []
        };
        this.eraser = new Eraser(this._app.pixiApp.renderer.plugins.interaction, this._extraLayer);
    }

    private _buildBackground(url: string) {
        let background = PIXI.Sprite.fromImage(url);
        background.alpha = 0.3;
        this._backgroundLayer.addChild(background);
    }

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

    private _addSelectHandler(graphics: PIXI.Graphics, index: Array<number>) {
        graphics.interactive = true;
        graphics.on('click', (e) => {
            this._app.stateManager.select(SelectEnum.Shape, index);
        })
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

    //line
    private _buildLine(shape: Shape) {

        for (let i = 0; i < shape.length; i++) {
            let graphics = new ShapeGraphics();
            graphics.beginFill(0x1db745, 1);
            graphics.lineStyle(5, 0x1db745, 1);
            graphics.moveTo(shape[i][0], shape[i][1]);
            if (shape.length == i + 1) {
                graphics.lineTo(shape[0][0], shape[0][1]);
            } {
                graphics.lineTo(shape[i + 1][0], shape[i + 1][1]);
            }
            graphics.endFill();
            this._extraLayer.addChild(graphics);
        }
    }
    //point
    private _buildPoint(point: Point) {
        let graphics = new PointGraphics();
        graphics.lineStyle(0);
        graphics.beginFill(0x548f14, 1)
        graphics.drawCircle(0, 0, 3);
        graphics.x = point[0];
        graphics.y = point[1];
        graphics.endFill();
        this._extraLayer.addChild(graphics);
    }

    setGraph(graph: Graph, cache: GraphCache): void {
        this._graphCache = cache;
        this._shapeLayer.removeChildren();
        this._buildBackground(cache.backgroundPic);
        for (let i = 0; i < graph.shapes.length; i++) {
            this.buildShapes(graph.shapes[i], i, cache.shapesContent[i]);
        }
    }

    setShapeContent(index: Array<number>, content?: ShapeContent): void {

    }

    render(): void {

    }

    addDisplayLayer(index: Array<number>): void {

    }

    addEditLayer(
        index: Array<number>, select: SelectEnum, eraser: boolean = false
    ): void {

    }

    removeLayer(): void {

    }
}
