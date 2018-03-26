import { GraphManagerInterface, EraserInterface, EditToolInterface } from "./GraphInterface";
import { Graph, ShapeContent, Shape, ShapeGraphics, GraphCache, Point, PointGraphics, } from "../common/Graph";
import DragHelper from "./DragHelper";
import { SelectEnum } from "../state/StateInterface";
import AppInterface from "../app/AppInterface";
import Eraser from "./Eraser"
import GraphDrawing from './GraphDrawing'
import ShadowShape from "./ShadowShape"
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
        this._editTool = new EditTool(this._extraLayer);
        this._eraser = new Eraser(
            this._app.pixiApp.renderer.plugins.interaction,
            this._extraLayer,
            this._editTool.erasePoints
        );
    }

    private _buildBackground(url: string) {
        let background = PIXI.Sprite.fromImage(url);
        background.alpha = 0.3;
        this._backgroundLayer.addChild(background);
    }

    private _focus() {
        // 进入选中状态，虚化shapeLayer
    }

    private _blur() {
        // 释放选中状态，恢复shapeLayer
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

    addDisplayLayer(isNeedInit: boolean, index: Array<number>): void {
        this._extraLayer.visible = true;
        const shape: Shape = this._app.actionManager.getCurrentShape(index[0]);
        const content: ShapeContent = this._graphCache.shapesContent[index[0]];
        this._editTool.init(shape, content, true);
        this._focus();
    }

    addEditLayer(
        isNeedInit: boolean,
        index: Array<number>,
        select: SelectEnum,
        eraser: boolean = false
    ): void {
        this._extraLayer.visible = true;
        if (isNeedInit) {
            const shapeIndex = index[0];
            const shape: Shape = this._app.actionManager.getCurrentShape(shapeIndex);
            const content: ShapeContent = this._graphCache.shapesContent[shapeIndex];
            this._editTool.init(shape, content, false);
            this._editTool.addSelectHandler((state: SelectEnum, idx: number) => {
                this._app.stateManager.select(state, [shapeIndex, idx])
            });
            this._editTool.addUpdateHandler(() => {
                // TODO
            });
            this._focus();
        }
        this._editTool.select(select, index[1]);
    }

    removeLayer(): void {
        this._extraLayer.visible = false;
        this._editTool.destroy();
        this._blur();
    }

    setEraserSize(size: number): void {
        this._eraser.setSize(size);
    }

    setShadowShape(x: number, y: number, width: number, height: number, content?: ShapeContent) {
        this._shadowShape.buildShadowShape(x, y, width, height, content);
    }
}
