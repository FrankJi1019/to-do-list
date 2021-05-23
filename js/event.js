function Event(content){
    this.content = content;
    this.finished = false;
    this.time = +new Date();
    this.priority = 1;
}