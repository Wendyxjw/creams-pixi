import { EraserInterface } from "./GraphInterface";

export default class Eraser implements EraserInterface {
    private _circleCursor: PIXI.Sprite;//橡皮擦
    private _cursorTicker: PIXI.ticker.Ticker;//监听橡皮擦
    private _interaction: PIXI.interaction.InteractionManager;
    private _extraLayer: PIXI.Container;

    constructor(interaction: PIXI.interaction.InteractionManager, extraLayer: PIXI.Container) {
        this._interaction = interaction;
        this._extraLayer = extraLayer;
    }
    private buildCircle(radius: number = 10): PIXI.Graphics {
        //画个圆
        let circle = new PIXI.Graphics();
        circle.beginFill(0xffffff, 0);
        circle.lineStyle(1, 0x000, 1);
        circle.drawCircle(0, 0, radius);
        circle.endFill();
        return circle;
    }
    enable(): void {
        //开启前先销毁 避免生成多个
        this.disable()
        this._circleCursor = new PIXI.Sprite();
        this._circleCursor.addChild(this.buildCircle());
        this._circleCursor.x = -1000; //让初始化位置在屏幕外
        this._circleCursor.y = -1000;
        //放置在编辑层
        this._extraLayer.addChild(this._circleCursor);

        //隐藏默认的鼠标指针 修改的其实是css
        this._interaction.cursorStyles.default = "none";
        //跟着鼠标走
        this._cursorTicker = new PIXI.ticker.Ticker();
        this._cursorTicker.add(() => {
            let mousePosition = this._interaction.mouse.global;
            this._circleCursor.x = mousePosition.x;
            this._circleCursor.y = mousePosition.y;
        }).start();
    }
    disable(): void {
        if (!this._cursorTicker) {
            return
        }
        if (!this._cursorTicker.started) {
            return
        }
        this._interaction.cursorStyles.default = "auto";
        this._cursorTicker.destroy();
        this._circleCursor.destroy();
    }
    setSize(size: number): void {
        this._circleCursor.removeChildren();
        this._circleCursor.addChild(this.buildCircle(size))
    }
}