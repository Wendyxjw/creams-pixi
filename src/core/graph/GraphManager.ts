
import { GraphManagerInterface } from "./GraphInterface";
import { Graph, ShapeContent, Shape, GraphicsWithIndex, GraphCache, Point, GraphWithIndexType } from "../common/Graph";
import GraphHelper from "./GraphHelper";
import { SelectEnum } from "../state/StateInterface";
import AppInterface from "../app/AppInterface";
import { defultGraphStyle } from "./constant";

export default class GraphManager implements GraphManagerInterface {
    private _app: AppInterface;
    private _graphCache: GraphCache; //保存修改的graph
    private _shapeIndex: number = 0; //记录graph编号
    private _extraLayer: PIXI.Container;

    public graphContainer: PIXI.Container;

    constructor(app: AppInterface) {
        this._app = app;
        this.graphContainer = new PIXI.Container();
        this.graphContainer.interactive = true;
        GraphHelper.enableDrag(this.graphContainer);
        app.pixiApp.stage.addChild(this.graphContainer);
        this._graphCache = {
            backgroundPic: "",
            shapesContent: []
        }
    }

    public get graph(): GraphCache {
        return this._graphCache;
    }

    public set graph(v: GraphCache) {
        this._graphCache = v;
    }

    //工具方法
    //查找 shapeIndex对应在graphContainer的位置
    private _findShapeIndex(shapeIndex: string): number {
        let curIndex: number;
        for (let i = 0; i < this.graphContainer.children.length; i++) {
            let item: GraphWithIndexType = this.graphContainer.children[i];
            if (item.shapeIndex == shapeIndex) {
                curIndex = i;
                break;
            }
        }
        return curIndex;
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
        graphics.interactive = true;
        graphics.buttonMode = true;
        return graphics
    }

    private _buildBackground(url: string) {
        let background = PIXI.Sprite.fromImage(url);
        background.alpha = 0.3;
        this.graphContainer.addChild(background);
    }
    //shape
    buildShapes(shape: Shape, content: ShapeContent = defultGraphStyle): string {
        let graphics = new GraphicsWithIndex();

        graphics = this._drawShape(graphics, shape, content);

        graphics.shapeIndex = "shape" + this._shapeIndex;
        this.graphContainer.addChild(graphics);
        this._shapeIndex++;

        return <string>graphics.shapeIndex;
    }
    public _deleteShapes(shapeIndex: string) {
        let indexNum = this._findShapeIndex(shapeIndex)
        this.graphContainer.removeChildAt(indexNum);
    }
    hideShapes(shapeIndex: string): void {
        let indexNum = this._findShapeIndex(shapeIndex)
        this.graphContainer.children[indexNum].visible = false;
    }
    showShapes(shapeIndex: string): void {
        let indexNum = this._findShapeIndex(shapeIndex)
        this.graphContainer.children[indexNum].visible = true;
    }
    updateShapes(shape: Shape, shapeIndex: string) {
        let indexNum = this._findShapeIndex(shapeIndex)
        let curShape: PIXI.Graphics;
        curShape = <PIXI.Graphics>this.graphContainer.children[indexNum];
        curShape.clear();
        curShape = this._drawShape(curShape, shape, this._graphCache.shapesContent[indexNum])
    }
    //line
    private _buildLine(shape: Shape) {

        for (let i = 0; i < shape.length; i++) {
            let graphics = new GraphicsWithIndex();
            graphics.beginFill(0x1db745, 1);
            graphics.lineStyle(5, 0x1db745, 1);
            graphics.moveTo(shape[i][0], shape[i][1]);
            if (shape.length == i + 1) {
                graphics.lineTo(shape[0][0], shape[0][1]);
            } {
                graphics.lineTo(shape[i + 1][0], shape[i + 1][1]);
            }
            graphics.endFill();
            this.graphContainer.addChild(graphics);
        }
    }
    //point
    private _buildPoint(point: Point) {
        let graphics = new GraphicsWithIndex();
        graphics.lineStyle(0);
        graphics.beginFill(0xcccccc, 1)
        graphics.drawCircle(point[0], point[1], 5);
        graphics.endFill();
        this.graphContainer.addChild(graphics);
    }
    //编辑状态下重绘 点击保存只需要画shape
    public _renderCanves(graph: Graph, graphCache: GraphCache) {
        //let graph = this._graphCache;
        //重置画布
        this._shapeIndex = 0;
        this.graphContainer.removeChildren();

        this._buildBackground(graphCache.backgroundPic);
        for (let i = 0; i < graph.shapes.length; i++) {
            this.buildShapes(graph.shapes[i], graphCache.shapesContent[i])
        }
        //this._buildLine(graph.line)
        // for (let i = 0; i < graph.point.length; i++) {
        //     this._buildPoint(graph.point[i])
        // }
    }


    setGraph(graph: Graph, cache: GraphCache): void {
        //初始化数据
        this._shapeIndex = 0;
        this._graphCache = cache;
        this.graphContainer.removeChildren();
        this._buildBackground(cache.backgroundPic);
        for (let i = 0; i < graph.shapes.length; i++) {
            this.buildShapes(graph.shapes[i], cache.shapesContent[i]);
        }
    }

    setShapeContent(index: Array<number>, content: ShapeContent): void {

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

    private _enableEraser() {

    }

    private _disableEraser() {
        
    }

}
