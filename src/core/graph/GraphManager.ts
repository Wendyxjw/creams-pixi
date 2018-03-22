
import { GraphManagerInterface } from "./GraphInterface";
import { Graph, ShapeContent, Shape, GraphicsWithIndex, GraphCache, Point, GraphWithIndexType } from "../common/Graph";
import App from "../app/App";

import GraphHelper from "./GraphHelper";
import { SelectEnum } from "../state/StateInterface";
import AppInterface from "../app/AppInterface";
//设置默认颜色
const defultGraphStyle: ShapeContent = {
    backgroundColor: 0xD1D8DF,
    border: {
        lineWidth: 1,
        color: 0xA7ACB2,
    },
    font: "",
    content: "",
    hasMark: false,
    shapeIndex: ""
}
export default class GraphManager implements GraphManagerInterface {
    private _app: App;
    private _graph: Graph;
    private _graphCache: GraphCache;//保存修改的graph
    public _graphContainer: PIXI.Container;
    private _shapeIndex: number = 0//记录graph编号

    constructor(app: App) {
        this._app = app;
        this.graphContainer = new PIXI.Container();
        this.graphContainer.interactive = true;
        GraphHelper.enableDrag(this.graphContainer);
        app.pixiApp.stage.addChild(this.graphContainer);
        this._graphCache = {
            shapes: [],
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
    //查找 shapeIndex对应在_graphContainer的位置
    private _findShapeIndex(shapeIndex: string): number {
        let curIndex: number;
        for (let i = 0; i < this._graphContainer.children.length; i++) {
            let item: GraphWithIndexType = this._graphContainer.children[i];
            if (item.shapeIndex == shapeIndex) {
                curIndex = i;
                break;
            }
        }
        return curIndex;
    }



    private _buildBackground(url: string) {
        let background = PIXI.Sprite.fromImage(url);
        background.alpha = 0.3;
        this.graphContainer.addChild(background);
    }
    //shape
    public _buildShapes(shape: Shape, content: ShapeContent = defultGraphStyle): string {
        let graphics = new GraphicsWithIndex();

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
        graphics.shapeIndex = "shape" + this._shapeIndex;
        this.graphContainer.addChild(graphics);
        this._shapeIndex++;

        return <string>graphics.shapeIndex;
    }
    public _deleteShapes(shapeIndex: string) {
        let indexNum = this._findShapeIndex(shapeIndex)
        this._graphContainer.removeChildAt(indexNum);
    }
    public _hideShapes(shapeIndex: string) {
        let indexNum = this._findShapeIndex(shapeIndex)
        this._graphContainer.children[indexNum].visible = false;
    }
    public _showShapes(shapeIndex: string) {
        let indexNum = this._findShapeIndex(shapeIndex)
        this._graphContainer.children[indexNum].visible = true;
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
    public _renderCanves() {
        let graph = this._graphCache;
        //重置画布
        this._shapeIndex = 0;
        this.graphContainer.removeChildren();

        this._buildBackground(graph.backgroundPic);
        for (let i = 0; i < graph.shapes.length; i++) {
            this._buildShapes(graph.shapes[i], graph.shapesContent[i])
        }
        //this._buildLine(graph.line)
        // for (let i = 0; i < graph.point.length; i++) {
        //     this._buildPoint(graph.point[i])
        // }
    }

    setGraph(graph: Graph): void {
        //this._graph = graph;
        this._graphCache = {
            shapes: graph.shapes,
            backgroundPic: graph.backgroundPic,
            shapesContent: []
        };//初始化数据
        const app = this._app.pixiApp;
        this._buildBackground(graph.backgroundPic);
        for (let i = 0; i < graph.shapes.length; i++) {
            this._buildShapes(graph.shapes[i])
            this._graphCache.shapesContent.push(undefined)
        }

    }




    setShapeContent(index: Array<number>, content: ShapeContent): void {

    }

    render(): void {

    }

    addDisplayLayer(index: Array<number>): void {

    }

    addEditLayer(index: Array<number>, select: SelectEnum): void {

    }

    removeLayer(): void {

    }
}
