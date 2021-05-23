// 读取cookie并渲染页面
(function(){

    // 检查是否是第一次打开，如果是则创建todolist
    if(!localStorage.getItem('todolist')) {
        localStorage.setItem('todolist', '[]')
    }

    // 把事项渲染到页面
    renderTodolist();

}());

// 为div.submit注册点击创建新任务的事件
(function(){

    let div = $("div.submit");
    let input = $("header input");

    div.click(function(){
        let todolist = getTodolist();
        let content = input.val();
        let event = new Event(content);
        input.val("");
        todolist.push(event);
        saveTodolist(todolist);
        input.focus();
        renderTodolist();
    })

}());

// 为每个事项(li)注册事件
(function(){

    let ulFinished = $("div.completed ul");
    let ulNotFinished = $("div.not-completed ul");

    let fn = function(){
        let todolist = getTodolist();
        let time = $(this).parent().attr("data-time")
        $.each(todolist, function(i, dom){
            if(dom.time == time) {
                todolist[i].finished = !todolist[i].finished;
            }
        })
        saveTodolist(todolist);
        renderTodolist();
    }

    ulNotFinished.on("click", "li div.checked", fn);
    ulFinished.on("click", "li div.checked", fn);
    
}());

// 点击删除事项
(function(){

    let ulFinished = $("div.completed ul");
    let ulNotFinished = $("div.not-completed ul");

    fn = function(e){
        let todolist = getTodolist();
        let li = $(this).parents("li");
        let time = li.attr("data-time");
        $.each(todolist, function(i, ele){
            if (ele.time == time){
                todolist.splice(i, 1);
                return false;
            }
        })
        saveTodolist(todolist)
        renderTodolist();
        e.stopPropagation();
    }

    ulFinished.on("click", ".delete", fn);
    ulNotFinished.on("click", ".delete", fn);

}());

// 右键菜单事件
(function(){

    let div = $(".context-menu");

    // 全局禁止右键菜单
    $(document).contextmenu(function(e){
        e.preventDefault();
    })

    // 左击任意认知关闭菜单
    $(document).click(function(){
        // div.css("display", "none");
        div.slideUp(150);
    })

    let time = null;

    // 在事项中右击打开菜单
    $(".event-list ul").on("contextmenu", "li", function(e){
        div.css({
            // display: "block",
            top: e.pageY,
            left: e.pageX
        })
        div.slideDown(150);
        time = $(this).attr("data-time");
    })

    // 为菜单中的li注册点击事件
    div.find("li").click(function(){
        let todolist = getTodolist();
        let that = $(this);
        $.each(todolist, function(i, ele){
            if (ele.time == time) {
                ele.priority = parseInt(that.attr("data-priority"));
                return false;
            }
        })
        saveTodolist(todolist);
        renderTodolist();
        renderTodolist();
    });

}());

// 鼠标滑轮滚动
(function(){

    let ulNotFinished = $("div.not-completed ul");
    let ulFinished = $("div.completed ul");
    let notFinishedContainer = ulNotFinished.parent();
    let finishedContainer = ulFinished.parent();
    let maxTopVal = ulNotFinished.offset().top;

    notFinishedContainer.mousewheel(function(e){

        let currTop = ulNotFinished.offset().top;
        let minTopVal = notFinishedContainer.outerHeight() + notFinishedContainer.offset().top 
        - ulNotFinished.outerHeight() - 20;

        // 滑轮往下滑 = 正，滑轮往上滑 = 负
        let delta = -e.originalEvent.wheelDelta || e.originalEvent.detail;
        if (delta > 0 && ulNotFinished.outerHeight() > notFinishedContainer.outerHeight()){
            currTop = Math.max(minTopVal, currTop - 20);
        } else if (ulNotFinished.outerHeight() > notFinishedContainer.outerHeight()) {
            currTop = Math.min(maxTopVal, currTop + 20);
        }
        ulNotFinished.offset({
            top: currTop
        })
    })

    finishedContainer.mousewheel(function(e){

        let currTop = ulFinished.offset().top;
        let minTopVal = finishedContainer.outerHeight() + finishedContainer.offset().top 
        - ulFinished.outerHeight() - 20;

        // 滑轮往下滑 = 正，滑轮往上滑 = 负
        let delta = -e.originalEvent.wheelDelta || e.originalEvent.detail;
        if (delta > 0 && ulFinished.outerHeight() > finishedContainer.outerHeight()){
            currTop = Math.max(minTopVal, currTop - 20);
        } else if (ulFinished.outerHeight() > finishedContainer.outerHeight()) {
            currTop = Math.min(maxTopVal, currTop + 20);
        }
        ulFinished.offset({
            top: currTop
        })
    })

}());

// 双击未完成的事项更改内容
(function(){

    let ulNotFinished = $("div.not-completed ul");

    ulNotFinished.on("dblclick", "li", function(){
        let p = $(this).find("p");
        let input = $(this).find("input");
        p.hide();
        input.show();
        input.focus();
    })

    ulNotFinished.on("blur", "li input", function(){
        let li = $(this).parents("li");
        let todolist = getTodolist();
        let time = li.attr("data-time")
        let that = $(this);
        $.each(todolist, function(i, ele){
            let s = that.val()
            if (ele.time == time){
                if (s.length == 0){
                    return false;
                }
                ele.content = s;
                return false;
            }
        })
        saveTodolist(todolist);
        renderTodolist();
        // $(this).hide();
        // $(this).siblings('p').show();
    })

}());