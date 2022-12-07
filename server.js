var express = require("express")
var app = express()
var db = require("./database.js")
var md5 = require("md5")
var minimist = require("minimist");
var bodyParser = require("body-parser");
// Create express app
//var express = require("express")
const args = minimist(process.argv.slice(2));
var app = express()
var bodyParser = require("body-parser");
//app.use(express.static('./main'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Server port
var HTTP_PORT = 8000 
// Start server
app.listen(HTTP_PORT, () => {
    console.log("Server running on port %PORT%".replace("%PORT%",HTTP_PORT))
});


// Root endpoint
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/main/home.html');
  });

// Insert here other API endpoints
app.get("/api/users", (req, res, next) => {
    var sql = "select * from user"
    var params = []
    db.all(sql, params, (err, rows) => {
        if (err) {
          res.status(400).json({"error":err.message});
          return;
        }
        res.json({
            "message":"success",
            "data":rows
        })
      });
});

app.post("/api/user/", (req, res, next) => {
    var errors=[]
    console.log("in user")
    if (!req.body.password){
        errors.push("No password specified");
    }
    if (errors.length){
        res.status(400).json({"error":errors.join(",")});
        return;
    }
    var data = {
        username: req.body.username,
        password : md5(req.body.password)
    }
    var sql ='INSERT INTO user (name, password) VALUES (?,?)'
    var params =[data.name, data.password]
    db.run(sql, params, function (err, result) {
        if (err){
            res.status(400).json({"error": err.message})
            return;
        }
        res.json({
            "message": "success",
            "data": data,
            "id" : this.lastID
        })
    });
})

app.patch("/api/user/:id", (req, res, next) => {
    var data = {
        name: req.body.name,
        password : req.body.password ? md5(req.body.password) : null
    }
    db.run(
        `UPDATE user set 
           name = COALESCE(?,name), 
           password = COALESCE(?,password) 
           WHERE id = ?`,
        [data.name, data.password, req.params.id],
        function (err, result) {
            if (err){
                res.status(400).json({"error": res.message})
                return;
            }
            res.json({
                message: "success",
                data: data,
                changes: this.changes
            })
    });
})

app.delete("/api/user/:id", (req, res, next) => {
    db.run(
        'DELETE FROM user WHERE id = ?',
        req.params.id,
        function (err, result) {
            if (err){
                res.status(400).json({"error": res.message})
                return;
            }
            res.json({"message":"deleted", changes: this.changes})
    });
})

app.post("/api/login/", (req, res) => {
    //Respond w status 200
    console.log("in login")
    var isUserNamePresent = false
    let data = {
        username: req.body.username,
        password: req.body.password
    } 
    console.log(data[username])
    console.log(data.username)
    console.log(data.password)
    res.statusCode = 200;
    var login = false
    var stmt = db.prepare("SELECT * FROM user WHERE username=data.username AND pass=data.password").all()
    console.log(stmt)
    if(stmt.length > 0){
        login = true
    }
    if(login){
        res.status(200).json({"status":"LOGIN", "user":data.username})
        console.log("LOGIN")
    }else{
        res.status(200).json({"status":"BAD"})
        console.log("NO USER")
    }
});


// Default response for any other request
app.use(function(req, res){
    res.status(404);
});



