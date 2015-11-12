angular.module('todo',[])
.service('Todo',['$rootScope','$http',function(rootScope,http){
    return {
      events:[],
      update:function(obj,next){
          http({method:'PUT',url:'/update',data:obj}).success(function(response){
            next(response);
          })
      },
      add:function(obj,next){
          http({method:'POST',url:'/add',data:obj}).success(function(response){
              next(response);
          });
      },
      remove:function(obj,next){
          http({method:'DELETE',url:'/delete',params:obj}).success(function(response){
               next(response);
          });
      },
      find:function(dest,func){
          http({method:'GET',url:'/find',params:dest}).success(function(response){
                func(response);
          })
      }
    };
}])
.controller('todoCtrl',['$scope','Todo',function(scope,todo){
   /**
    * 变量定义
    */
    scope.list = [];
    /*
    *实例化服务
     */
    scope.todoService = todo;
    /*
    *是否点击了更新按钮
     */
    scope.isUpdated = false;
    /*
    *实例化对象
     */
    scope.todo = new ToDoList();
    /*
    *刷新列表
     */
    scope.todo.getList();
    /*
    *复选框选中项
     */
    scope.checkedItems = [];

    /*
    * 列表类
    * */
    function ToDoList(){
        this.getList = function(obj1){
            scope.todoService.find(obj1,function(responseText){
                for(var i = 0;i < responseText.data.length;i ++){
                    var isNew = true;
                    var len = scope.list.length;
                    for(var j = 0;j < len;j ++){
                        if(scope.list[j].id == responseText.data[i]._id){
                            isNew = false;//不是新元素
                            break;
                        }
                    }
                    if(isNew == false)
                        continue;
                    var temp = {};
                    temp.id = responseText.data[i]._id;
                    temp.taskname = responseText.data[i].taskname;
                    temp.time = responseText.data[i].time;
                    temp.priority = responseText.data[i].priority;
                    scope.list.push(temp);
                }
            });
        };
        this.add = function(obj) {
            scope.todoService.add(obj, function (responseText) {
                scope.todo.getList();//更新
            });
        };
        this.remove = function(obj) {
            scope.todoService.remove(obj,function(text){
                scope.todo.getList();//更新
                var len = scope.list.length;
                if(obj._id.length == 1)
                    for(var i = 0;i < len;i++){

                          if(scope.list[i].id == obj._id){
                              scope.list.splice(i,1);
                              return;
                          }
                    }
                else{
                    for(var i = 0;i < len;i++){
                        for(var j = 0;j < obj._id.length;j ++)
                            if(scope.list[i].id == obj._id[j]){
                                scope.list.splice(i,1);
                                i --;
                                len --;
                                break;
                            }
                    }
                }
            });
        };
        this.update = function(obj,next){
            scope.todoService.update(obj,next);
        };
        this.search = function(obj,next){
            scope.todoService.find(obj,next);
        }
    }
    /**
     * 复选框选中处理
     * @param obj 是单行元素对象。
     */
    scope.checkedChanged = function(obj){
       for(var i = 0;i < scope.checkedItems.length;i++){
           if(obj.id == scope.checkedItems[i]){
               scope.checkedItems.splice(i,1);
               return;
           }
       }
       /*在selectedItems中未查到该项*/
       scope.checkedItems.push(obj.id);
    };
    /**
     * button处理
     */
        /**
         * 提交按钮
         */
    scope.btnClickedAdd = function(){
        /**
         *提交新增项
         */
        if(scope.isUpdated == false) {
            scope.todo.add({taskname: scope.taskname, time: scope.tasktime, priority: scope.taskpriority});
        }
        /**
         * 提交更改项
         */
        else
        {
            scope.isUpdated = false;
            scope.todo.update({"_id":scope.updatedID,taskname: scope.taskname, time: scope.tasktime, priority: scope.taskpriority},function(responseText){
                scope.todo.getList();
            });
        }
    };
        /**
         * 删除按钮
         */
    scope.btnClickedRemove = function(){
        if(scope.checkedItems.length <= 0){
            alert ('你应该至少选中一项。');
            return;
        }
        /*
         * 处理删除操作
         */
        scope.todo.remove({_id:scope.checkedItems});
        /**
         * 清空选中项数组
         * @type {Array}
         */
        scope.checkedItems = [];
    };
        /**
         * 更新按钮
         * @param item 选中项目的数据
         */
    scope.btnClickedUpdate = function(item){
        /*
        *将编辑项数据放入输入框中
         */
        scope.taskname = item.taskname;
        scope.tasktime = item.time;
        scope.taskpriority = item.priority;
        /*
        *指定更新项的ID
         */
        scope.updatedID = item.id;
        /*
        *点击了更新按钮
         */
        scope.isUpdated = true;
    };
        /**
         * 查找按钮
         */
    scope.btnClickedFind = function(){
        scope.todo.search({data:scope.findText},function(responseText){
            scope.list = responseText.data;
//            for(var i = 0;i < scope.list.length;i ++){
//                for(var j = 0;j < responseText.data.length;j ++){
//                    if(scope.list[i].id == responseText.data[j]._id){
//                        break;
//                    }
//                    else if(j != responseText.data.length - 1){
//                        continue;
//                    }
//                    else{
//                        scope.list.splice(i,1);
//                        i --;
//                        break;
//                    }
//                }
//            }
        });
    };

}]);
