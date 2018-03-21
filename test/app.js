$(function () {
    var app = new CreamsPIXI(document.getElementById('creams-pixi'));
    app.graphManager.setGraph({
        backgroundPic: '/res/Model.jpg',
        shapes: data,
    })
    //放大缩小居中
    let dom = $("#operation");
    $(dom.find("span")[0]).click(function () {
        app.operationManager.zoomIn(1.5)
    })
    $(dom.find("span")[1]).click(function () {
        app.operationManager.justify()
    })
    $(dom.find("span")[2]).click(function () {
        app.operationManager.zoomOut(1.5)
    })
    //橡皮擦
    let eraser = $("#eraser");
    $(eraser.find("span")[0]).click(function () {
        app.operationManager.enableEraser(true);
    })
    $(eraser.find('span')[1]).click(() => {
        app.operationManager.setEraserSize($(eraser.find("input")).val())
    })
    $(eraser.find("span")[2]).click(function () {
        app.operationManager.enableEraser(false);
    })
    app.eventManager.onClickGraph((index, event) => {
       // console.log(index + ";x:" + event.x + "y:" + event.y)
    })
    app.eventManager.onMouseEnterShape((index, event) => {
       // console.log(index + ";x:" + event.x + "y:" + event.y)
    })
    //添加graph
    $("#addGraph").click(() => {
        var defultGraphStyle = {
            backgroundColor: 0xdddddd,
            border: {
                lineWidth: 1,
                color: 0x333333,
            }
        }
        app.actionManager.addShape(100, 100, 100, 100, defultGraphStyle)
    })
    //graph工具栏   
    $("#creams-pixi").mouseover(()=>{
        app.eventManager.onMouseUpShape((index, event) => {
            bindTool(index)
        })
    })

    var bindTool=(i)=>{
        let graphToolbar = $("#graphToolbar");
        graphToolbar.css({"left":event.x,"top":event.y}).show();
        $(graphToolbar.find('span')[0]).unbind().bind("click",() => {
            app.actionManager.deleteShape(i);
            graphToolbar.hide();
        })
        $(graphToolbar.find('span')[1]).unbind().bind("click",() => {
            app.operationManager.enableEraser(true);
            graphToolbar.hide();
        })
        $(graphToolbar.find('span')[2]).unbind().bind("click",() => {
            app.actionManager.copyShape(i);
            graphToolbar.hide();
        })
    }
    //do undo
    $("#undo").click(function(){
        app.actionManager.unDo()
    })
    $("#redo").click(function(){
        app.actionManager.reDo()
    })
    //编辑状态
    $("#edit").click(()=>{
        app.operationManager.enableEdit(true)
    })
})