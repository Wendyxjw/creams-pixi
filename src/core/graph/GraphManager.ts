import { GraphManagerInterface, EraserInterface, EditToolInterface } from "./GraphInterface";
import { Graph, ShapeContent, Shape, ShapeGraphics, GraphCache, Point, PointGraphics, SelectEnum, } from "../common/Graph";
import DragHelper from "./DragHelper";
import AppInterface from "../app/AppInterface";
import Eraser from "./Eraser"
import GraphDrawing from './GraphDrawing'
import ShadowShape from "./ShadowShape"
import EditTool from "./EditTool";
import { defultGraphStyle } from "./constant";

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
        this._extraLayer.name = "extraLayer";
        this._extraLayer.interactive = true;

        this.graphContainer.addChildAt(this._backgroundLayer, 0);
        this.graphContainer.addChild(this._extraLayer);

        this.graphContainer.interactive = true;
        DragHelper(this.graphContainer);
        this._editTool = new EditTool(this._extraLayer);
        this._eraser = new Eraser(
            this._app.pixiApp.renderer.plugins.interaction,
            this._extraLayer,
            this._shapeLayer,
            this._editTool.erasePoints(),
            this._app.pixiApp.stage,
            this.graphContainer
        );
    }

    private _buildBackground(url: string) {
        this._backgroundLayer.removeChildren();
        let background = PIXI.Sprite.fromImage(url);
        background.alpha = 0.2;
        //background.hitArea = new PIXI.Rectangle(-10000000, -10000000, 100000000000000, 100000000000000);
        background.interactive = true;
        background.on('pointerdown', () => {
            this._app.stateManager.select(SelectEnum.None, []);
        });
        this._backgroundLayer.addChild(background);
    }

    private _focus(isEditing: boolean) {
        // 进入选中状态，虚化shapeLayer
        if (isEditing) {
            // 编辑状态时，禁用底层的拖拽
            this.graphContainer.interactive = false;
            DragHelper(this.graphContainer, false);
        }
        this._extraLayer.visible = true;
        this._changeAllShapesColor(true);
    }

    private _blur(isEditing: boolean) {
        // 释放选中状态，恢复shapeLayer
        if (isEditing) {
            this.graphContainer.interactive = true;
            DragHelper(this.graphContainer, true);
        }
        this._extraLayer.visible = false;
        this._changeAllShapesColor(false);
    }

    private _changeAllShapesColor(isWhite: Boolean) {
        let curShape: Array<Shape> = this._app.actionManager.getCurrentData().shapes;
        this._shapeLayer.children.forEach((item: ShapeGraphics) => {
            this._changeShapeColor(curShape[item.shapeIndex], item.shapeIndex, isWhite);
        })
    }
    //选中shape时 修改颜色
    private _changeShapeColor(shape: Shape, shapeIndex: number, isWhite: Boolean) {
        if (shape.length !== 0) {
            let content: ShapeContent = this._graphCache.shapesContent[shapeIndex];
            let defaultStyle: ShapeContent = defultGraphStyle;
            let con: ShapeContent = content ? content : defaultStyle;
            let deepCopyCon: ShapeContent = JSON.parse(JSON.stringify(con));
            if (isWhite) {
                deepCopyCon.backgroundColor = 0xffffff;
                deepCopyCon.border.color = 0xA7ACB2;
            }
            this.updateShapes(shape, shapeIndex, deepCopyCon, true);
        }
    }


    setGraph(graph: Graph, cache: GraphCache): void {
        this._graphCache = cache;
        this._shapeLayer.removeChildren();
        this._buildBackground(cache.backgroundPic);
        for (let i = 0; i < graph.shapes.length; i++) {
            this.buildShapes(graph.shapes[i], i, cache.shapesContent[i]);
        }
    }

    setShapeContent(index: number, content?: ShapeContent): void {
        let shape: Shape = this._app.actionManager.getCurrentShape(index);
        //店铺匹配时保存content
        this._graphCache.shapesContent[index] = content;
        this.updateShapes(shape, index, content);

    }

    private _addLayer(shapeIndex: number, isDisplay: boolean) {
        const shape: Shape = this._app.actionManager.getCurrentShape(shapeIndex);
        const content: ShapeContent = this._graphCache.shapesContent[shapeIndex];
        this._editTool.init(shape, content, isDisplay);
        this._focus(!isDisplay);
    }

    private _addHandler(shapeIndex: number) {
        this._editTool.addUpdateHandler((shape: Shape) => {
            this._app.actionManager.updateShape(shape, shapeIndex);
            //编辑shape后将对应shapeLayer画成白色
            this._changeShapeColor(shape, shapeIndex, true);
        });
        this._editTool.addSelectHandler((target: ShapeGraphics, state: SelectEnum, idx?: number) => {
            target.shapeIndex = shapeIndex;
            target.on('pointerdown', () => {
                this._app.stateManager.select(state, [shapeIndex, idx]);
            });
            if (state === SelectEnum.Shape || state === SelectEnum.Line) {
                this._app.eventManager.bindHandler(state, target);
            }
        });
    }

    addDisplayLayer(isNeedInit: boolean, index: Array<number>): void {
        this._addHandler(index[0]);
        this._addLayer(index[0], true);
    }

    addEditLayer(
        isNeedInit: boolean,
        index: Array<number>,
        select: SelectEnum,
        eraser: boolean = false
    ): void {
        if (eraser) {
            this._eraser.enable();
        } else {
            this._eraser.disable();
        }
        if (isNeedInit) {
            this._addHandler(index[0]);
            this._addLayer(index[0], false);
        }
        this._editTool.select(select, index[1]);
    }

    removeLayer(): void {
        this._editTool.destroy();
        this._blur(true);
    }

    setEraserSize(size: number): void {
        this._eraser.setSize(size);
    }

    setShadowShape(width: number, height: number, content?: ShapeContent) {
        this._app.stateManager.select(SelectEnum.None, []);
        this._shadowShape.buildShadowShape(width, height, content);
    }

    deleteShadowShape() {
        this._shadowShape.destroyShadowShape();
    }
}
