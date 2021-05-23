function getTodolist(){
    let todolistStr = localStorage.getItem('todolist');
    let todolist = JSON.parse(todolistStr);
    return todolist;
}

function saveTodolist(todolist){
    let todolistStr = JSON.stringify(todolist);
    localStorage.setItem("todolist", todolistStr)
}

function renderTodolist(){
    sortTodolist();
    let todolist = getTodolist();
    let ulFinished = $("div.completed ul");
    let ulNotFinished = $("div.not-completed ul");
    let count = $("div.not-completed span.count");
    let totalNotFinished = 0;
    ulFinished.empty();
    ulNotFinished.empty();
    $.each(todolist, function(i, dom){
        let content = dom.content;
        let li = $("<li><div class='checked'></div><p>&nbsp;" + content + "&nbsp;</p>" + 
        "<input type='text'></input><i class='delete'></i></li>");
        let priority = dom.priority;
        let cName = "priority-" + priority.toString();
        li.addClass(cName);
        li.attr("data-time", dom.time.toString());
        if(dom.finished){
            ulFinished.append(li);
        } else {
            ulNotFinished.append(li);
            totalNotFinished++;
        }
    })
    count.html(totalNotFinished);
}

function sortTodolist(){
    let todolist = getTodolist();
    todolist.sort(function(x, y){
        if (x.priority > y.priority) {
            return -1;
        } else if (x.priority < y.priority){
            return 1;
        } else {
            return y.time - x.time;
        }
    })
    saveTodolist(todolist);
}

