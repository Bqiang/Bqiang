var mongoose = require('mongoose');
var Schema = mongoose.Schema;
function DB(){
    var schema = new Schema({
        taskname:String,
        time:String,
        priority:Number
    });
    var Task = mongoose.model('Task',schema);
    var self = this;
    this.connect = function(){
        mongoose.connect('mongodb://localhost:27017/todolist',function(err){
            if(err){
                console.log('连接数据库失败。');
            }
        });
    }
    this.Init = function(){
        self.connect();

    }

    this.Add = function(obj,next){
        if(obj.taskname && obj.time && obj.priority) {
            var task = new Task();
            task.taskname = obj.taskname;
            task.time = obj.time;
            task.priority = obj.priority;
            task.save(function (err) {
                if (err) throw err;
                next('保存成功。')
            })

        }
        else next('参数不正确。');
    };
    this.Delete = function(obj,next){
        Task.find(obj,function(err,task){
            if(err) throw err;
            if(task.length) {
                var tasknames = [];
                task.forEach(function (x) {
                    tasknames.push(x.taskname);
                    x.remove();
                });
                next(tasknames + '已被删除。')
            }
            else{
               next('未查到该项。')
            }
        })
    };
    this.Update = function(obj1,obj2){
        Task.update(obj1,obj2,{multi:false},function(err,rows_updated){
            if(err) throw err;
            console.log('Updated.');
        })
    };
    this.Find = function(selector,next){
        var t = Task.find(selector,function(err,tasks){
            if(err) throw err;
            var result = [];
            for(var i = 0;i < tasks.length;i ++){
               result.push(tasks[i]);
            }
            next(result);
        });

    }
    this.Init();
    this.close = function(){
        mongoose.disconnect();
    }
}

module.exports = DB;