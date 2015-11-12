var express = require('express');
var url = require('url');
var router = express.Router();
var Db = require('../models/db');
var db = new Db();
router.get('/',function(req,res,next){
    res.render('index')
});
router.get('/find',function(req,res,next){
    var findWhat = url.parse(req.url).query;
    var search = {};
    if(findWhat && findWhat.split('=').length > 1){
        var data = findWhat.split('=')[1];
        search = {$or:[{
            taskname:data
        },{
            time:data
        },{
            priority:parseInt(data)
        }]};
    }
    db.Find(search,function(result){
        res.writeHead(200,{'Content-type':'application/json'});
        var datas = {"data":[]};
        result.forEach(function(data){
            datas["data"].push( data);
        });
        res.end(JSON.stringify(datas).toString())
    });
});
router.delete('/delete',function(req,res,next){
    res.writeHead(200,{'Content-Type':'text/html'});
    var temp = url.parse(req.url,true).query;
    if(typeof(temp._id) != 'string')
    for(var i = 0;i < temp._id.length;i++){
       db.Delete({_id:temp._id[i]},function(result){
            res.end(result);
        });
    }
    else
    {
        db.Delete({_id:temp._id},function(result){
            res.end(result);
        });
    }

});
router.post('/add',function(req,res,next){
   res.writeHead(200,{'Content-Type':'text/html'});
   db.Add(req.body,function(dbResponse){
       res.end(dbResponse)
   })
});
router.put('/update',function(req,res,next){
    res.writeHead(200,{'Content-Type':'text/html'});
    db.Update({_id:req.body._id},req.body,function(dbResponse){
        console.log(dbResponse);
    })
    res.end();
})
module.exports = router