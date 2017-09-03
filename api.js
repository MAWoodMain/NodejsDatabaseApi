var mysql = require("mysql");

function REST_ROUTER(router,connection,md5) {
    var self = this;
    self.handleRoutes(router,connection,md5);
}

REST_ROUTER.prototype.handleRoutes= function(router,connection,md5) {
    router.get("/",function(req,res){
        res.json({"Message" : "Hello World!"});
    });

    router.post("/:loc/:type",function(req,res)
    {

        connection.query("SELECT locationid FROM location WHERE tag LIKE ?",
            [req.params.loc],function(err,result){
                if (!err) {
                    var locId = result[0].locationid;
                    connection.query("SELECT datatypeid FROM datatype WHERE tag LIKE ?",
                        [req.params.type], function (err, result) {
                            if (!err) {
                                var typeid = result[0].datatypeid;
                                var query = "INSERT INTO readings (locationid,datatypeid,reading,timestamp) VALUES (?,?,?,?)";
                                var values;
                                var count = 0;
                                var failures = 0;
                                console.log(req.body);
                                for(var item in req.body)
                                {
                                    console.log(req.body[item]);
                                    if(req.body[item].reading !== undefined && req.body[item].timestamp !== undefined)
                                    {
                                        values = [locId,typeid,req.body[item].reading,req.body[item].timestamp];
                                        connection.query(query,values, function (err, result) {
                                            if(err) res.json({"Error": true, "Message": "Error executing MySQL query"});
                                        });
                                        count++;
                                    } else failures++;
                                }
                                res.json({"Error" : false, "Message" : "Completed", "Added" : count, "Failures" : failures});
                            } else {
                                res.json({"Error": true, "Message": "Error executing MySQL query"});
                            }
                        });
                } else {
                    res.json({"Error": true, "Message": "Error executing MySQL query"});
                }
            });



    });

    router.get("/:loc/:type", function(req,res){

        connection.query("SELECT locationid FROM location WHERE tag LIKE ?",
            [req.params.loc],function(err,result){
                if (!err) {
                    var locId = result[0].locationid;
                    connection.query("SELECT datatypeid FROM datatype WHERE tag LIKE ?",
                        [req.params.type], function (err, result) {
                            if (!err) {
                                var typeid = result[0].datatypeid;
                                if(req.query.start !== undefined && req.query.end !== undefined)
                                {
                                    var query = mysql.format("SELECT reading, timestamp FROM readings WHERE (locationid LIKE ?) AND (datatypeid LIKE ?) AND (timestamp > ?) AND (timestamp < ?)",
                                        [locId, typeid,req.query.start,req.query.end]);
                                } else
                                {
                                    var query = mysql.format("SELECT reading, timestamp FROM readings WHERE (locationid LIKE ?) AND (datatypeid LIKE ?)",
                                        [locId, typeid]);
                                }
                                connection.query(query, function (err, result) {
                                    res.json(result)
                                });
                            } else {
                                res.json({"Error": true, "Message": "Error executing MySQL query"});
                            }
                        });
                } else {
                    res.json({"Error": true, "Message": "Error executing MySQL query"});
                }
            });
    });


    router.put("/datatype", function(req,res){
        var query = "INSERT INTO ??(??,??,??,??) VALUES (?,?,?,?)";
        var table = ["dataType","name","tag","symbol","description",
            req.body.name, req.body.tag, req.body.symbol, req.body.description];
        console.log(table);
        connection.query(query,table,function(err,result){
            if(err) {
                res.json({"Error" : true, "Message" : "Error executing MySQL query"});
            } else {
                res.json({"Error" : false, "Message" : "Data type Added!"});
            }
        });
    });

    router.put("/location", function(req,res){
        var query = "INSERT INTO ??(??,??) VALUES (?,?)";
        var table = ["location","name","tag",req.body.name,req.body.tag];
        console.log(table);
        connection.query(query,table,function(err,rows){
            if(err) {
                res.json({"Error" : true, "Message" : "Error executing MySQL query"});
            } else {
                res.json({"Error" : false, "Message" : "Location Added!"});
            }
        });
    });

    router.get("/:loc", function(req,res){
        var query = "SELECT locationid, name, tag, description FROM location where tag like ?";
        var table = [req.params.loc];
        console.log(table);
        connection.query(query,table,function(err,rows){
            if(err) {
                res.json({"Error" : true, "Message" : "Error executing MySQL query"});
            } else {
                if(rows.length < 1)
                {
                    res.json({"Error" : true, "Message" : "Unknown location"});
                } else res.json(rows);
            }
        });
    });
};

module.exports = REST_ROUTER;