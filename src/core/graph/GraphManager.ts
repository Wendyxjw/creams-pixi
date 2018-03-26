
import { GraphManagerInterface, EraserInterface, ShadowShapeInterface } from "./GraphInterface";
import { Graph, ShapeContent, Shape, ShapeGraphics, GraphCache, Point, PointGraphics, } from "../common/Graph";
import DragHelper from "./DragHelper";
import { SelectEnum } from "../state/StateInterface";
import AppInterface from "../app/AppInterface";
import Eraser from "./Eraser"
import GraphDrawing from './GraphDrawing'
import ShadowShape from "./ShadowShape"

export default class GraphManager extends GraphDrawing implements GraphManagerInterface {
    private _extraLayer: PIXI.Container;
    private _backgroundLayer: PIXI.Container;
    private _eraser: EraserInterface;

    public get graph(): GraphCache {
        return this._graphCache;
    }

    public set graph(v: GraphCache) {
        this._graphCache = v;
    }

    constructor(app: AppInterface) {
        super();
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
        DragHelper(this.graphContainer);
        app.pixiApp.stage.addChild(this.graphContainer);
        this._graphCache = {
            backgroundPic: "",
            shapesContent: []
        };
        this._eraser = new Eraser(this._app.pixiApp.renderer.plugins.interaction, this._extraLayer, (deletePointArr: Array<number>) => { });
        this._shadowShape = new ShadowShape(app);
    }

    private _buildBackground(url: string) {
        let background = PIXI.Sprite.fromImage(url);
        background.alpha = 0.3;
        this._backgroundLayer.addChild(background);
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

    setEraserSize(size: number): void {
        this._eraser.setSize(size);
    }
    setShadowShape(x: number, y: number, width: number, height: number, content?: ShapeContent) {
        this._shadowShape.buildShadowShape(x, y, width, height, content);
    }
}
