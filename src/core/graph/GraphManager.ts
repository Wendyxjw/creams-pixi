import { GraphAPI } from "./GraphInterface";
import { Graph, ShapeContent, Shape, GraphicsWithIndex,GraphCache } from "../common/Graph";
import { App } from "../app/App";
import GraphHelper from "./GraphHelper";
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
    shapeIndex:""
}
export default class GraphManager implements GraphAPI {
    private _app: App;
    private _graph: Graph;
    public _graphCache:GraphCache;//保存修改的graph
    public _graphContainer: PIXI.Container;
    private _shapeIndex: number = 0//记录graph编号

    constructor(app: App) {
        this._app = app;
        this._graphContainer = new PIXI.Container();
        this._graphContainer.interactive = true;
        GraphHelper.enableDrag(this._graphContainer);
        app.pixiApp.stage.addChild(this._graphContainer);
        this._graphCache={
            shapes:[],
            backgroundPic:"",
            shapesContent:[]
        }
    }

    private _buildBackground(url: string) {
        let background = PIXI.Sprite.fromImage(url);
        background.alpha = 0.3;
        this._graphContainer.addChild(background);
    }

    public _buildGraphics(shape: Shape, content: ShapeContent = defultGraphStyle) {
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
        
        this._shapeIndex++;
        graphics.shapeIndex = "shape" + this._shapeIndex;

        this._graphContainer.addChild(graphics);

        //save graphdata ；todo 默认的是否存？不存的话 actionManager的clone获取index需要改写
        content.shapeIndex=graphics.shapeIndex;
        this._graphCache.shapes.push(shape);
        this._graphCache.shapesContent.push(content);
        
    }

    getGraph(): Graph {
        return this._graph;
    }

    setGraph(graph: Graph): void {
        this._graph = graph;
        this._graphCache.backgroundPic=graph.backgroundPic;
        const app = this._app.pixiApp;
        this._buildBackground(graph.backgroundPic);
        for (let i = 0; i < graph.shapes.length; i++) {
            this._buildGraphics(graph.shapes[i])
        }
    }


    enableEdit(isEnabled: boolean): void {

    }

    setShapeContent(index: Array<number>, content: ShapeContent): void {

    }

    render(): void {

    }
}
