
import { GraphManagerInterface, EraserInterface, EditToolInterface } from "./GraphInterface";
import { Graph, ShapeContent, Shape, ShapeGraphics, GraphCache, Point, PointGraphics, } from "../common/Graph";
import DragHelper from "./DragHelper";
import { SelectEnum } from "../state/StateInterface";
import AppInterface from "../app/AppInterface";
import Eraser from "./Eraser"
import GraphDrawing from './GraphDrawing'
import EditTool from "./EditTool";

export default class GraphManager extends GraphDrawing implements GraphManagerInterface {
    private _extraLayer: PIXI.Container;
    private _backgroundLayer: PIXI.Container;
    private _eraser: EraserInterface;
    private _editTool: EditToolInterface;

    constructor(app: AppInterface) {
        super(app);
        
        this._backgroundLayer = new PIXI.Container();
        this._extraLayer = new PIXI.Container();
        this._extraLayer.visible = false;

        this.graphContainer.addChild(this._backgroundLayer);
        this.graphContainer.addChild(this._extraLayer);

        this.graphContainer.interactive = true;
        DragHelper(this.graphContainer);

        this._eraser = new Eraser(
            this._app.pixiApp.renderer.plugins.interaction,
            this._extraLayer,
            this._editTool.erasePoints
        );
    }

    private _initEditTool() {
        this._editTool = new EditTool(this._extraLayer);
        // this._editTool.addSelectHandler();
        // this._editTool.addUpdateHandler();

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
}
