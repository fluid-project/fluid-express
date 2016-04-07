var express = require("express");

var app = express();

/*
app.get("/", function(req,res,next){
    next({ message: "There is an error" });
});

app.use(function(err, req, res, next){
    debugger;
    res.status(500).send("I heard about the error.");
});
*/

var router = express.Router();
router.use("/",function (req,res,next){
    next("There is an error");
});


router.use(function(err, req, res, next){
    debugger;
    res.status(500).send("I heard about the error: " + err);
});

app.use("/", router);

app.listen(3000);
