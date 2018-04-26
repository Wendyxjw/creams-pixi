## creams-pixi
基于pixi.js封装的楼层剖面图组件  
### 代码打包指令
npm install //安装依赖  
npm run build //编译代码  
### 发布代码
crnpm安装步骤参照：https://confluence.souban.io/pages/viewpage.action?pageId=13273288  
crnpm publish//发布  记得改版本号：version（在package.json文件内）！！！
***
### 层级结构及其绑定事件思维导图
https://www.processon.com/view/link/5ae04fa5e4b04721d63d05bc

### 文件说明
分类：  
>action：实现撤销重做  
app：组件初始化  
common：公共方法  
event：绑定外部传入事件  
graph：创建图形  
operation：处理外部调用功能接口  
state：状态管理

后缀：
>API：外部调用方法  
Interface：内部调用方法

### 数据格式：
* 设置块样式：
```javascript
 ShapeContent = {
    backgroundAlpha?: number; // 背景透明度（默认shape使用）
    backgroundColor: number; // 背景颜色：0xffffff(十六进制)
    border: {
        lineWidth: number, // 边宽度
        color: number, // 边颜色
        lineStyle: LineStyle // 虚线：dotted 实线：solid
    };
    font: {
        fontSize: number, // 字体大小
        fill: Array<number>,// 填充颜色：[0x000000,0xffffff]填一个就是纯色，多个就是渐变效果
    };
    content: string; // 显示的文字内容，换行："\n"
    hasMark?: boolean; // 是否需要角标，默认false：匹配店铺时出现的shadowShape使用
    alpha?: number; // 透明度，默认1
    interactive?: boolean; // 事件是否开启，默认true
}
```
