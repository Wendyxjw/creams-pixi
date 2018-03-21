import { ActionAPI, Action } from "./ActionInterface";
import { Graph, ShapeContent, Shape,GraphicsWithIndex } from "../common/Graph";
import { App } from "../app/App";

class Manager {
    private _data: Array<Shape>;
    private _currentData: Array<Shape>;
    private _actionIndex: number;
    private _actionList: Array<Action>
    public _app: App;

    constructor(app: App) {
        this._actionIndex = -1;
        this._actionList = [];
        this._app = app;
    }

    init(data: Array<Shape>) {
        this._data = data;
        this._currentData = data;
        this._actionIndex = -1;
        this._actionList = [];
    }

    getCurrentData() {
        return this._currentData;
    }

    addAction(action: Action) {
        let data = this._currentData;
        try {
            this._currentData = action.do(data);
        } catch (error) {
            console.log(error);
            return;
        }
        this._actionIndex++;
        this._actionList.splice(this._actionIndex); // delete the orig actions
        this._actionList.push(action);
    }

    unDo() {
        let index = this._actionIndex;
        let list = this._actionList;
        let data = this._currentData;
        if (index === -1) {
            return;
        }
        let action = list[index];
        this._currentData = action.unDo(data);
        this._actionIndex--;
    }

    reDo() {
        let index = this._actionIndex;
        let list = this._actionList;
        let data = this._currentData;
        if (index === list.length - 1) {
            return;
        }
        let action = list[index + 1];
        this._currentData = action.do(data);
        this._actionIndex++;
    }

}

export default class ActionManager extends Manager implements ActionAPI {
    //查找shape的index
    private _findGraphIndex(arr,shapeIndex):number{
        let curIndex:number;
        //todo 待优化 需要跳出循环
        arr.forEach((item:GraphicsWithIndex, index: number)=>{
            if(item.shapeIndex==shapeIndex){
                curIndex = index;
            }
        })
        return curIndex;
    }
    //查找children为shape的index
    // private _findShapeIndex(shapeIndex):number{
    //     let curIndex:number;
    //     let shapeNum:number=0//统计shape个数
    //     //todo 待优化 需要跳出循环
    //     this._app.graphManager._graphContainer.children.forEach((item:GraphicsWithIndex, index: number)=>{
    //         if(item.shapeIndex==shapeIndex){
    //             curIndex = shapeNum;
    //         }
    //         if(item.shapeIndex.indexOf("shape")>-1){
    //             shapeNum++;
    //         }
    //     })
    //     return curIndex;
    // }
    addShape(x: number, y: number, width: number, height: number, content?: ShapeContent) {
        let pointArr:Shape;
        pointArr=[[x,y],[x,y+height],[x+width,y+height],[x+width,y]];
        this._app.graphManager._buildGraphics(pointArr,content);
    };

    addShadowShape(x: number, y: number, width: number, height: number, content?: ShapeContent) {

    };

    copyShape(index: string) {
        let shapeIndex=this._findGraphIndex(this._app.graphManager._graphCache.shapesContent,index)
        this._app.graphManager._buildGraphics(this._app.graphManager._graphCache.shapes[shapeIndex],this._app.graphManager._graphCache.shapesContent[shapeIndex]);
    };

    deleteShape(index: string) {
        let curConIndex=this._findGraphIndex(this._app.graphManager._graphContainer.children,index);
        this._app.graphManager._graphContainer.removeChildAt(curConIndex);
        
        //删除指定位置的数据
        let shapeIndex=this._findGraphIndex(this._app.graphManager._graphCache.shapesContent,index);
        this._app.graphManager._graphCache.shapes.splice(shapeIndex,1);
        this._app.graphManager._graphCache.shapesContent.splice(shapeIndex,1);
    };

    addPoint(index: Array<number>) {

    };

    emptyDoingList() {

    };
}
