import { GraphManagerInterface, EraserInterface, EditToolInterface, RegionDeleteInterface, RegionDeleteCallBack, setGraphCallback } from "./GraphInterface";
import { Graph, ShapeContent, Shape, ShapeGraphics, GraphCache, Point, PointGraphics, SelectEnum, Background, } from "../common/Graph";
import DragHelper from "./DragHelper";
import AppInterface from "../app/AppInterface";
import Eraser from "./Eraser"
import GraphDrawing from './GraphDrawing'
import ShadowShape from "./ShadowShape"
import EditTool from "./EditTool";
import { defultGraphStyle } from "./constant";
import RegionDelete from "./RegionDelete";

export default class GraphManager extends GraphDrawing implements GraphManagerInterface {
    private _extraLayer: PIXI.Container;
    private _backgroundLayer: PIXI.Container;
    private _eraser: EraserInterface;
    private _editTool: EditToolInterface;
    private _regionDelete: RegionDeleteInterface;

    constructor(app: AppInterface) {
        super(app);

        this._backgroundLayer = new PIXI.Container();
        this._backgroundLayer.name = "backgroundLayer";
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

        this._regionDelete = new RegionDelete(
            this._app,
            this._extraLayer,
            this._shapeLayer
        );
    }

    private _buildBackground(bg: Background) {
        this._backgroundLayer.removeChildren();
        let background = PIXI.Sprite.fromImage(bg.url);
        background.alpha = bg.alpha || 1;
        background.hitArea = new PIXI.Rectangle(-10000000, -10000000, 100000000000000, 100000000000000);
        background.interactive = true;
        // background.on('pointerdown', () => {
        //     this._app.stateManager.select(SelectEnum.None, []);
        // });
        let hasMouseUp = true;
        background.on('pointerdown', (event: PIXI.interaction.InteractionEvent) => {
            hasMouseUp = true;
            setTimeout(() => {
                hasMouseUp = false
            }, 500);
        })
        background.on('pointerup', (event: PIXI.interaction.InteractionEvent) => {
            if (hasMouseUp) {
                this._app.stateManager.select(SelectEnum.None, []);
            }
        })

        this._backgroundLayer.addChild(background);
    }

    private _focus(isEditing: boolean, shapeIndex: number) {
        // 进入选中状态，虚化shapeLayer
        if (isEditing) {
            // 编辑状态时，禁用底层的拖拽
            this.graphContainer.interactive = false;
            DragHelper(this.graphContainer, false);
        }
        this._extraLayer.visible = true;
        this._changeAllShapesColor(true, shapeIndex);
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

    // shapeIndex:要隐藏的index
    private _changeAllShapesColor(isWhite: boolean, shapeIndex?: number) {
        this._shapeLayer.children.forEach((item: ShapeGraphics) => {
            let curShape: Shape = this._app.actionManager.getCurrentShape(item.shapeIndex);
            let isVisible: boolean = shapeIndex == item.shapeIndex ? false : true;
            this._changeShapeColor(curShape, item.shapeIndex, isWhite, isVisible);
        })
    }
    //选中shape时 修改颜色
    private _changeShapeColor(shape: Shape, shapeIndex: number, isWhite: boolean, isVisible: boolean = true) {
        if (shape.length !== 0) {
            let content: ShapeContent = this._graphCache.shapesContent[shapeIndex];
            let defaultStyle: ShapeContent = defultGraphStyle;
            let con: ShapeContent = content ? content : defaultStyle;
            let deepCopyCon: ShapeContent = JSON.parse(JSON.stringify(con));
            if (isWhite) {
                deepCopyCon.backgroundAlpha = 1;
                deepCopyCon.backgroundColor = 0xffffff;
                deepCopyCon.border.color = 0xe5e5e5;
                deepCopyCon.font.fill = [0xc6c6c6];
            }
            this._shapeLayer.getChildByName(shapeIndex.toString()).visible = isVisible;
            this.updateShapes(shape, shapeIndex, deepCopyCon, true);
        }
    }


    setGraph(graph: Graph, cache: GraphCache, callBack?: setGraphCallback): void {
        this._graphCache = cache;
        this._shapeLayer.removeChildren();
        this._buildBackground(cache.background);
        for (let i = 0; i < graph.shapes.length; i++) {
            this.buildShapes(graph.shapes[i], i, cache.shapesContent[i]);
        }
        this._loaderBgImg(cache.background, callBack); // 背景图片加载好后执行回调
    }

    setShapeContent(index: number, content?: ShapeContent): void {
        let shape: Shape = this._app.actionManager.getCurrentShape(index);
        //店铺匹配时保存content
        this._graphCache.shapesContent[index] = content;
        this.updateShapes(shape, index, content, true);

    }

    // 背景图片加载
    private _loaderBgImg(bg: Background, callBack?: setGraphCallback) {
        const loader = new PIXI.loaders.Loader();
        loader.add('bgimg', bg.url).load(() => {
            //this._buildBackground(bg);
            if (callBack) {
                callBack();
            }
        });
    }

    private _addLayer(shapeIndex: number, isDisplay: boolean) {
        const shape: Shape = this._app.actionManager.getCurrentShape(shapeIndex);
        const content: ShapeContent = this._graphCache.shapesContent[shapeIndex];
        this._editTool.init(shape, content, isDisplay);
        this._focus(!isDisplay, shapeIndex);
    }

    private _addHandler(shapeIndex: number) {
        this._editTool.addUpdateHandler((shape: Shape) => {
            this._app.actionManager.updateShape(shape, shapeIndex);
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
        if (isNeedInit) {
            this._addHandler(index[0]);
            this._addLayer(index[0], true);
        }
    }

    addEditLayer(
        isNeedInit: boolean,
        index: Array<number>,
        select: SelectEnum,
    ): void {
        if (isNeedInit) {
            this._addHandler(index[0]);
            this._addLayer(index[0], false);
        }
        this._editTool.select(select, index[1]);
    }

    removeLayer(): void {
        // 关闭编辑状态，清除橡皮擦
        this._editTool.destroy();
        this._eraser.disable();
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

    addPoint(lineIndex: number) {
        this._editTool.addPoint(lineIndex);
    }

    enableEraser(isEnabled: boolean): void {
        if (isEnabled) {
            this._eraser.enable();
        } else {
            this._eraser.disable();
        }
    }

    enableRegionDelete(isEnabled: boolean, callBack?: RegionDeleteCallBack): void {
        this._regionDelete.enable(isEnabled, callBack);
    }
}
