$(function () {
    var app = new CreamsPIXI(document.getElementById('creams-pixi'));
    app.setGraph({
        shapes: data
    }, {
        backgroundPic: '/res/Model.jpg',
        shapesContent: []
    })
    var state = {
        hasShadowShape: false
    }

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
    app.eventManager.onClickGraph((index, event, editType) => {
        //  console.log(index + ";x:" + event.x + "y:" + event.y + "editType" + editType)
    })


    //添加graph
    $("#addGraph").click(() => {
        var defultGraphStyle = {
            backgroundColor: 0xD1D8DF,
            border: {
                lineWidth: 2,
                color: 0xA7ACB2,
                lineStyle: "dotted"
            },
            font: {
                fontSize: 14,
                fill: [0x000000]
            },
            content: "",
            hasMark: false,
            alpha: 1,
            //shapeIndex: ""
        }
        app.actionManager.addShape(100, 100, 100, 100, defultGraphStyle)
    })
    //graph工具栏   
    // $("#creams-pixi").mousemove(() => {

    // })

    var bindTool = (i) => {
        let graphToolbar = $("#graphToolbar");
        graphToolbar.css({
            "left": event.x + 10,
            "top": event.y + 10
        }).show();
        $(graphToolbar.find('span')[0]).unbind().bind("click", () => {
            app.actionManager.deleteShape(i[0]);
            graphToolbar.hide();
        })
        $(graphToolbar.find('span')[1]).unbind().bind("click", () => {
            app.operationManager.enableEraser(true);
            graphToolbar.hide();
        })
        $(graphToolbar.find('span')[2]).unbind().bind("click", () => {
            app.actionManager.copyShape(i[0]);
            graphToolbar.hide();
        })
    }
    //do undo
    $("#undo").click(function () {
        app.actionManager.unDo((index, event) => {
            console.log(index + " " + event)
        })
    })
    $("#redo").click(function () {
        app.actionManager.reDo()
    })
    const shadowCon = {
        backgroundColor: 0xf5eb33,
        border: {
            lineWidth: 1,
            color: 0xFFC107,
            lineStyle: "solid"
        },
        font: {
            fontSize: 14,
            fill: [0x000000, 0xffbbee]
        },
        content: "5pluse \n45m/2010室 \n2017.01.12到期5pluse \n45m/2010室 \n2017.01.12到期5pluse \n45m/2010室 \n2017.01.12到期5pluse \n45m/2010室 \n2017.01.12到期5pluse \n45m/2010室 \n2017.01.12到期5pluse \n45m/2010室 \n2017.01.12到期5pluse \n45m/2010室 \n2017.01.12到期5pluse \n45m/2010室 \n2017.01.12到期5pluse \n45m/2010室 \n2017.01.12到期5pluse \n45m/2010室 \n2017.01.12到期",
        alpha: 0.5,
        hasMark: true,
        shapeIndex: ""
    }
    const shadowDownCon = {
        backgroundColor: 0xf5eb33,
        border: {
            lineWidth: 2,
            color: 0xFFC107,
            lineStyle: "dashed"
        },
        font: {
            fontSize: 14,
            fill: [0x333333]
        },
        content: "5pluse \n45m/2010室 \n2017.01.12到期5pluse \n45m/2010室 \n2017.01.12到期5pluse \n45m/2010室 \n2017.01.12到期5pluse \n45m/2010室 \n2017.01.12到期5pluse \n45m/2010室 \n2017.01.12到期5pluse \n45m/2010室 \n2017.01.12到期5pluse \n45m/2010室 \n2017.01.12到期5pluse \n45m/2010室 \n2017.01.12到期5pluse \n45m/2010室 \n2017.01.12到期5pluse \n45m/2010室 \n2017.01.12到期",
        alpha: 1,
        hasMark: false,
        shapeIndex: ""
    }
    const con = {
        backgroundColor: 0xcccccc,
        border: {
            lineWidth: 1,
            color: 0xcccccc,
            lineStyle: "solid"
        },
        font: {
            fontSize: 14,
            fill: [0x333333]
        },
        content: "",
        alpha: 1,
        hasMark: false,
        shapeIndex: ""
    }
    app.eventManager.onMouseUpShape((index, event, editType) => {
        if (state.hasShadowShape) {
            state.hasShadowShape = false;
            app.operationManager.setShapeContent(index[0], shadowDownCon);
        }
        console.log("up" + " " + index[0])
        bindTool(index)

    })
    // app.eventManager.onMouseEnterShape((index, event, editType) => {
    //     if (state.hasShadowShape) {
    //         app.operationManager.setShapeContent(index[0], shadowCon);
    //     }
    // })
    // app.eventManager.onMouseLeaveShape((index, event, editType) => {
    //     if (state.hasShadowShape) {
    //         app.operationManager.setShapeContent(index[0]);
    //     }
    // }) //
    app.eventManager.onMouseLeaveShape((index, event, editType) => {
        console.log("leave" + " " + index)
        if (state.hasShadowShape) {
            app.operationManager.setShapeContent(index[0], con);
        }
    })
    app.eventManager.onMouseDownShape((index, event, editType) => {
        console.log("down" + " " + index)
    })
    app.eventManager.onMouseEnterShape((index, event, editType) => {
        console.log("enter" + " " + index)
        if (state.hasShadowShape) {
            app.operationManager.setShapeContent(index[0], shadowDownCon);
        }
    })
    app.eventManager.onMouseDownLine((index, event, editType) => {
        console.log("line down" + " " + index)
        app.operationManager.addPoint(index[0]);

    })
    $("#addShadowShape").mousedown(() => {
        state.hasShadowShape = true;
        app.operationManager.addShadowShape(200, 100, shadowCon)
    })
    $("body").on("mouseup", () => {
        app.operationManager.deleteShadowShape();
    })
    //开启编辑模式
    $("#edit").click(() => {
        app.operationManager.enableEdit(true);
    })

    $('#selectNone').click(() => {
        app.operationManager.selectNone();
    })

})