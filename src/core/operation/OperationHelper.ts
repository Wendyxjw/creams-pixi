import { ShapeGraphics } from "../common/Graph";

// 放大缩小后修改文字 避免文字放大缩小
export function changeTextStyle(scale: number, graphCon: PIXI.Container) {
    let changeText: Function = (text: PIXI.Text) => {
        let oldScale: number = text.scale.x;
        let newScale: number = 1 / scale
        text.scale.x = newScale;
        text.scale.y = newScale;
        let DValue = newScale - oldScale;
        text.position.x -= DValue * text.width * scale / 2;
        text.position.y -= DValue * text.height * scale / 2;
    }
    // 底部
    let shapeLayer: PIXI.Container = <PIXI.Container>graphCon.getChildByName('shapeLayer');
    shapeLayer.children.forEach((item: ShapeGraphics) => {
        if (item.children.length > 0) {
            let text: PIXI.Text = <PIXI.Text>item.getChildByName("text");
            changeText(text);
        }
    })
    // 编辑层
    let extraLayer: PIXI.Container = <PIXI.Container>graphCon.getChildByName('extraLayer');
    let editLayer: PIXI.Container = <PIXI.Container>extraLayer.getChildByName('editLayer');
    let editShape: ShapeGraphics = <ShapeGraphics>editLayer.getChildByName('editShape');
    if (editShape && editShape.children.length > 0) {
        let text: PIXI.Text = <PIXI.Text>editShape.getChildByName("text");
        changeText(text);
    }
}